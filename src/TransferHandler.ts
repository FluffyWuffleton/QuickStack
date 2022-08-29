import Island from "game/island/Island";
import Item from "game/item/Item";
import { ContainerReferenceType } from "game/item/IItem";
import Player from "game/entity/player/Player";
import StaticHelper from "./StaticHelper";
import Doodad from "game/doodad/Doodad";
import { ITransferTarget, THState, ITransferPairing, THTargettingFlag, ITransferTypeMatch } from "./ITransferHandler";
import { ITile } from "game/tile/ITerrain";

/**
 * The catch-all class for constructing and executing stack actions to/from one or more source and target containers. 
 * @class TransferHandler
 */
export class TransferHandler {
    readonly player: Player;
    readonly sources: ITransferTarget[];
    readonly destinations: ITransferTarget[];
    readonly island: Island;


    private _state: THState;
    private _executionResults: ITransferPairing[][]; // Indexed by [source#][dest#]

    private _anyFailed: boolean = false;
    private _anySuccess: boolean = false;
    private _anyPartial: boolean = false;

    public get state(): THState { return this._state; }
    public get executionResults(): ITransferPairing[][] { return this._executionResults; }
    public get anySuccess(): boolean { return this._anySuccess; } // If any given source->dest transfer of a single ItemType was successfully completed.
    public get anyPartial(): boolean { return this._anyPartial; } // If any given source->dest transfer of a single ItemType was only partially completed.
    public get anyFailed(): boolean { return this._anyFailed; } // If any given source->dest transfer of a single ItemType was failed outright due to capacity.


    /**
     * May succesfully return an empty target array but that's ok. 
     * It means there's no non-empty containers matching the search flags.
     * In this case, executeTransfer() will successfully attempt to do a whole lot of nothing. 
     * @param {THTargettingFlag} target 
     * @returns {ITransferTarget[]}
     */
    private resolveTargetting(target: number): ITransferTarget[] {
        if (!(target & THTargettingFlag.everywhere)) {
            // Invalid flags. Must include at least one location flag set.
            this._state |= THState.noTargetFlag;
            return [];
        }

        // Nearby tile and doodad containers
        let validTypes: ContainerReferenceType[] = [];
        if (target & THTargettingFlag.nearbyDoodads) validTypes.push(ContainerReferenceType.Doodad);
        if (target & THTargettingFlag.nearbyTiles) validTypes.push(ContainerReferenceType.Tile);
        const allContainers: ITransferTarget[] =
            this.island.items.getAdjacentContainers(this.player, false)
                .map((c) => { return { container: c, type: this.island.items.getContainerReference(c, undefined).crt }; }
                    , this).filter(iTT => validTypes.includes(iTT.type));

        // Player inventory?
        if (target & THTargettingFlag.self)
            allContainers.push({ container: this.player.inventory, type: ContainerReferenceType.PlayerInventory });

        return allContainers.filter(iTT => iTT.container.containedItems.length > 0);
    }

    /**
     * Given two lists of items, returns a (unique) list of typeMatches for use in constructing IQSPairings
     * Param order is labelled but really doesn't matter. (matchingTypes(A,B) and matchingTypes(B,A) will have the same content in maybe a different order)
     * @param {Item[]} sourceItems Items in the source container.
     * @param {Item[]} destItems Items in the destination container.
     * @returns {ITransferTypeMatch[]} List of type matches.
     */
    private matchTypes(sourceItems: Item[], destItems: Item[]): ITransferTypeMatch[] {
        const sourceTypes = new Set([...sourceItems.map(i => i.type)]);
        const destTypes = new Set([...destItems.map(i => i.type)]);
        sourceTypes.retainWhere(t => destTypes.has(t));

        return [...sourceTypes].map((sT) => { return { type: sT, had: -1, sent: -1 } });
    }

    /**
    * Attempt to perform the quick-stack according to the parameters passed on construction.
    * Returns immediately if state has any error flag set, or if the 'complete' flag is already set. 
    * @returns {THState} The handler state. 
    */
    public executeTransfer(): THState {
        // Active error or already complete
        if (this._state & (THState.error | THState.complete)) return this._state;

        // No valid containers somewhere...
        if (this.sources.length === 0 || this.destinations.length === 0) {
            this._state = THState.complete;
            return this._state;
        }

        const itemMgr = this.island.items;

        // For each source...
        this.sources.forEach((src, i) => {
            // Start a row for this source in the results array.
            const thesePairings: ITransferPairing[] = [];

            // For each destination...
            this.destinations.forEach((dest, j) => {
                // Define the pairing and find type-matches
                const thisPairing: ITransferPairing = {
                    source: src,
                    destination: dest,
                    matches: this.matchTypes(src.container.containedItems, dest.container.containedItems)
                };

                // Get rid of any type-matches caused exclusively by protected/equipped items when drawing from player inventory.
                // Those shouldn't be included in executionResults.
                let badMatches: number[] = [];

                // For each type-match
                thisPairing.matches.forEach((match, k) => {
                    // Original number in source
                    match.had = src.container.containedItems.reduce((n, item) => { return (item.type === match.type) ? n + 1 : n }, 0);

                    StaticHelper.QS_LOG.info(`Source ${i + 1} -> Dest ${j + 1} :: Matched ${match.had} '${itemMgr.getItemTypeGroupName(match.type, false).getString()}'`);

                    // Transfer as many as possible, but ignore protected/equipped if source is player inventory.
                    let itMoved: Item[];
                    if (src.type !== ContainerReferenceType.PlayerInventory) {
                        itMoved = itemMgr.moveAllFromContainerToContainer(this.player, src.container, dest.container, match.type, undefined, true);
                    } else {
                        const weightCap = itemMgr.getWeightCapacity(dest.container, true) ?? Infinity;
                        let canFit = true;

                        itMoved = src.container.containedItems
                            // Filter for matching type
                            .filter(it => (it.type === match.type))
                            // Filter out protected/equipped, and reduce match.had accordingly.
                            .filter(it => {
                                if (it.isProtected() || it.isEquipped()) {
                                    match.had--;
                                    return false;
                                } return true;
                            })
                            // Attempt to deposit; retain list of items that successfully deposited. Check weights first to cut down msgspam.
                            .filter(it => {
                                if(canFit) {
                                    canFit = dest.type === ContainerReferenceType.Tile
                                        ? !this.island.isTileFull(dest.container as ITile)
                                        : it.weight <= weightCap - itemMgr.computeContainerWeight(dest.container);
                                    if(canFit) return itemMgr.moveToContainer(this.player, it, dest.container);                                            
                                    }
                                return false;
                            }, this);
                    }

                    // Number transferred.
                    match.sent = itMoved.length;

                    if (match.had > 0) {
                        if (match.sent === match.had) this._anySuccess = true;
                        else if (match.sent > 0) this._anyPartial = true;
                        else this._anyFailed = true;
                    } else { // If 'had' has ended up at zero, this typematch is exclusively driven by protected/equipped items. 
                        badMatches.push(k);
                        if (match.had < 0) StaticHelper.QS_LOG.warn(`match.had ended up negative (${match.had}). This shouldn't happen wtf. Throwing out.`);
                    }


                }, this); // foreach type-match

                // Remove bad matches from the pairing before collection.
                if (badMatches.length) thisPairing.matches.spliceWhere((_, k) => badMatches.includes(k));

                thesePairings.push(thisPairing);

            }, this); // foreach destination

            this._executionResults.push(thesePairings)

        }, this); // foreach source

        StaticHelper.QS_LOG.info(`executionResults structure: [[${this._executionResults.map(row => row.map(_ => 'x').join(',')).join('][')}]]`);

        this._state = THState.complete;
        return this._state;
    }

    /**
     * Send post-transfer messages to the player.
     * If any error flag is set, or the 'complete' flag is *not* set, this will do nothing and return false.
     * @param player 
     * @returns {boolean} Successfully sent messages?
     */
    public reportMessages(player: Player = this.player): boolean {
        // Active error or not yet complete
        if ((this._state & THState.error) || !(this._state & THState.complete)) return false;

        const itemMgr = this.island.items;

        // For each unique source->destination pair observed in this transfer... 
        this._executionResults.forEach(pairList => {
            pairList.forEach(pair => {

                // <Destination container>-string ("into [containername]", "onto the ground")
                let tgtStr: string = "";
                switch (pair.destination.type) {
                    case ContainerReferenceType.Doodad:
                        tgtStr = "into " + (pair.destination.container as Doodad).getName().getString();
                        break;
                    case ContainerReferenceType.Tile:
                        tgtStr = "onto the ground";
                        break;
                    default:
                        tgtStr = "to somewhere"
                }

                const itemStrings = {
                    all: [] as string[],  // item types that were fully deposited. Format e.g. '4 grapes', '6 piles of sand'
                    some: [] as string[], // item types that were partially deposited. Format e.g. '2/4 grapes', '1/6 piles of sand'
                    none: [] as string[]  // item types that could not be deposited. Format e.g. 'grapes', 'piles of sand'
                };
                let anyPartial = false; // did any partial transfers take place

                pair.matches.forEach((match) => {
                    if (match.sent === match.had) // Complete transfer
                        itemStrings.all.push(`${match.sent} ${itemMgr.getItemTypeGroupName(match.type, false, match.sent).getString()}`);
                    else if (match.sent > 0) { // Partial transfer
                        itemStrings.some.push(`${match.sent}/${match.had} ${itemMgr.getItemTypeGroupName(match.type, false, match.had).getString()}`);
                        anyPartial = true;
                    } else  // Failed transfer
                        itemStrings.none.push(`${itemMgr.getItemTypeGroupName(match.type, "indefinite", match.had).getString()}`);
                });

                // Send messages for this destination's results
                if (itemStrings.all.length + itemStrings.some.length) {
                    player.messages.send(StaticHelper.QS_INSTANCE[anyPartial ? "messageStackedSome" : "messageStackedAll"], itemStrings.all.concat(itemStrings.some), tgtStr);
                }
                if (itemStrings.none.length) {
                    player.messages.send(StaticHelper.QS_INSTANCE.messageStackedNone, itemStrings.none, tgtStr);
                }

            }, this); // foreach pair in pairList
        }, this); // foreach pairlist in executionResults


        if (!(this._anySuccess || this._anyPartial || this._anyFailed)) player.messages.send(StaticHelper.QS_INSTANCE.messageNoMatch)

        return true;
    }
    /**
     * All relevant container and player references are passed to or found by the constructor.
     * They cannot be changed elsewhere.
     * Any instance of this class is expected to exist for less than one game turn, performing one quickstack operation.
     *
     * @param {Player} executor Player initiating the transfer.
     * @param {number} [source=THTargettingFlag.self] Some combination of bitmap flags to specify valid source container(s). Value should have at least one set location flag (self, nearbyDoodads, etc). Should not share any location flags with 'dest' param.
     * @param {number} [dest=THTargettingFlag.nearbyDoodads|THTargettingFlag.nearbyTiles] Bitmap flags to specify valid destination container(s). Value should have at least one set location flag (self, nearbyDoodads, etc). Should not share any location flags with 'source' param.
     */
    constructor(executor: Player, source: number = THTargettingFlag.self, dest: number = THTargettingFlag.nearbyDoodads | THTargettingFlag.nearbyTiles) {
        this._state = THState.idle;
        this._executionResults = [];

        this.player = executor;
        this.island = executor.island;

        // Targetting collision: source and dest inputs have one or more of the same location flags set. This will not work.
        if ((source & dest & THTargettingFlag.everywhere) != 0) {
            this._state = THState.collision;
            this.sources = [];
            this.destinations = [];
            return;
        }

        // Resolve target containers.
        this.sources = this.resolveTargetting(source);
        this.destinations = this.resolveTargetting(dest);

        if (this._state & THState.error) return; // Possible missing-location flag.
    }
};
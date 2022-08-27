import Player from "game/entity/player/Player";
import Island from "game/island/Island";
import { ContainerReferenceType } from "game/item/IItem";
import Item from "game/item/Item";
import "./IQSTransferHandler";
import { IQSTarget, QSTargettingFlag, QSHandlerState, IQSTypeMatch, IQSPairing, IQSPairingResult } from "./IQSTransferHandler";

/**
 * The catch-all class for constructing and executing stack actions to/from one or more source and target containers. 
 * @class QSTransferHandler
 */

export default class {
    readonly player: Player;
    readonly sources: IQSTarget[] = [];
    readonly destinations: IQSTarget[] = [];
    readonly island: Island;

    private _state: QSHandlerState;
    private _executionResults: IQSPairingResult[][]; // Indexed by [source#][dest#]

    public get state(): QSHandlerState { return this._state; }
    public get executionResults(): IQSPairingResult[][] { return this._executionResults; }

    /**
     * All relevant container and player references are passed to or found by the constructor.
     * They cannot be changed elsewhere.
     * Any instance of this class is expected to exist for less than one game turn, performing one quickstack operation.
     *
     * @param {Player} executor Player initiating the transfer.
     * @param {QSTargettingFlag} [source={self:true}] Bitmap flags for identifying source container(s). Value should have at least one set location flag (self, nearbyDoodads, etc). Should not share any location flags with 'dest' param.
     * @param {QSTargettingFlag} [dest={nearbyDoodads:true}] Bitmap flags for identifying destination container(s). Value should have at least one set location flag (self, nearbyDoodads, etc). Should not share any location flags with 'source' param.
     */
    constructor(executor: Player, source: QSTargettingFlag, dest: QSTargettingFlag) {
        this._state = QSHandlerState.idle;
        this._executionResults = [];

        this.player = executor;
        this.island = executor.island;

        // Targetting collision: source and dest inputs have one or more of the same location flags set. This will not work.
        if ((source & dest & QSTargettingFlag.everywhere) != 0) {
            this._state = QSHandlerState.collision;
            this.sources = [];
            this.destinations = [];
            return;
        }

        // Resolve target containers.
        this.sources = this.resolveTargetting(source);
        this.destinations = this.resolveTargetting(dest);

        if (this._state & QSHandlerState.error) return; // Possible missing-location flag.
    }

    /**
     * May succesfully return an empty target array but that's ok. 
     * It means there's no non-empty containers matching the search flags.
     * In this case, executeTransfer() will successfully attempt to do a whole lot of nothing. 
     * @param {QSTargettingFlag} target 
     * @returns {IQSTarget[]}
     */
    private resolveTargetting(target: QSTargettingFlag): IQSTarget[] {
        if (!(target & QSTargettingFlag.everywhere)) {
            // Invalid flags. Must include at least one location flag set.
            this._state |= QSHandlerState.noTargetFlag;
            return [];
        }

        // Nearby tile and doodad containers
        let validTypes: ContainerReferenceType[] = [];
        if (target & QSTargettingFlag.nearbyDoodads) validTypes.push(ContainerReferenceType.Doodad);
        if (target & QSTargettingFlag.nearbyTiles) validTypes.push(ContainerReferenceType.Tile);
        const allContainers: IQSTarget[] = 
            this.island.items.getAdjacentContainers(this.player, false)
            .map((c) => { 
                return {
                    container: c,
                    type: this.island.items.getContainerReference(c,undefined).crt
                }
            }, this).filter(iQST=>validTypes.includes(iQST.type));
        
        // Player inventory?
        if(target & QSTargettingFlag.self)
            allContainers.push({container: this.player.inventory, type: ContainerReferenceType.PlayerInventory});
        
        return allContainers.filter(iQST=>iQST.container.containedItems.length>0);
    }

    /**
     * Given two lists of items, returns a (unique) list of typeMatches for use in constructing IQSPairings
     * Param order is labelled but really doesn't matter. (matchingTypes(A,B) and matchingTypes(B,A) will have the same content in maybe a different order)
     * @param {Item[]} sourceItems Items in the source container.
     * @param {Item[]} destItems Items in the destination container.
     * @returns {IQSTypeMatch[]} List of type matches.
     */
    private matchTypes(sourceItems: Item[], destItems: Item[]): IQSTypeMatch[] {
        const sourceTypes = new Set([...sourceItems.map(i => i.type)]);
        const destTypes = new Set([...destItems.map(i => i.type)]);
        sourceTypes.retainWhere(t => destTypes.has(t));

        return [...sourceTypes].map((sT) => { return { type: sT } });
    }

    /**
    * Attempt to perform the quick-stack according to the parameters passed on construction.
    * Returns immediately if state has any error flag set, or if the 'complete' flag is already set. 
    * @returns {QSHandlerState} The handler state. 
    */
    public executeTransfer(): Omit<QSHandlerState, QSHandlerState.idle> {
        // Active error or already complete
        if (this._state & (QSHandlerState.error | QSHandlerState.complete)) return this._state;

        // No valid containers somewhere...
        if (this.sources.length === 0 || this.destinations.length === 0) {
            this._state = QSHandlerState.complete;
            return this._state;
        }

        const itemMgr = this.island.items;

        // For each source/destination pair...
        this.sources.forEach((src, i) => {
            this.destinations.forEach((dest, j) => {

                // Define the pairing and find type-matches
                const thisPairing: IQSPairing = {
                    source: src,
                    destination: dest,
                    matches: this.matchTypes(src.container.containedItems, dest.container.containedItems)
                };

                // For each type-match
                thisPairing.matches.forEach((match, k) => {
                    // Original number in source
                    match.had = src.container.containedItems.reduce((n, item) => { return (item.type === match.type) ? n + 1 : n }, 0);

                    // Transfer as many as possible, but ignore protected/equipped if source is player inventory.
                    let itMoved: Item[];
                    if (src.type != ContainerReferenceType.PlayerInventory) {
                        itMoved = itemMgr.moveAllFromContainerToContainer(this.player, src.container, dest.container, match.type, undefined, true);
                    } else {
                        itMoved = src.container.containedItems
                            // Filter for matching type, omit equipped/protected
                            .filter(it => it.type === match.type && !it.isProtected && !it.isEquipped)
                            // Attempt to deposit; filter out items that failed to deposit (moveToContainer returns bool)
                            .filter(it => itemMgr.moveToContainer(this.player, it, dest.container));
                    }

                    // Number transferred.
                    match.sent = itMoved.length;
                
                }, this); // foreach type match
                
                this._executionResults[i][j] = thisPairing as IQSPairingResult;

            }, this); // foreach destination
        }, this); // foreach source
        return this._state;
    }
}

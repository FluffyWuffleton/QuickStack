import Island from "game/island/Island";
import Item from "game/item/Item";
import { ContainerReferenceType, IContainer, ItemType } from "game/item/IItem";
import Player from "game/entity/player/Player";
import QSStaticHelper from "./QSStaticHelper";
//import QSStaticHelper from "./QSStaticHelper";

export enum QSTransferCompleteness {
    none = 0,
    some = 1,
    all = 2
}

export enum QSHandlerState {
    idle = 0b00000000, // 0 // No errors yet but haven't performed transfer.
    complete = 0b00000001, // 1 // Executed transfer, no errors.
    collision = 0b00000010, // 2 // Error in construction params. Source and destination inputs share a location flag.
    noTargetFlag = 0b00000100, // 4 // Error in construction params. Source and/or destination inputs with no location flag.
    executeError = 0b00001000, // 8 // Error in executeTransfer(). 
    // This flag is only raised if an error occurs in the process of transfering inventory about in executeTransfer().
    // Note that executeTransfer() will not attempt to run if another error flag is already set.
    error = 0b10001110 // Union of all error flags + bit8
}

// Bitmap flags to define IQSTarget auto-selection mode for QSHandler constructor
export enum QSTargettingFlag {
    recursive = 0b0001, // 1 // Include sub-containers. !! NOT IMPLEMENTED RIGHT NOW.
    self = 0b0010, // 2 // Player inventory
    nearbyDoodads = 0b0100, // 4 // Player-adjacent doodads 
    nearbyTiles = 0b1000, // 8 // Player-adjacent tiles
    everywhere = self | nearbyDoodads | nearbyTiles // Union value of every location-specific flag
}

export interface IQSTarget {
    container: IContainer;
    type: ContainerReferenceType;
}

export interface IQSTypeMatch {
    type: ItemType;
    had: number;
    sent: number;
}

export interface IQSPairing {
    source: IQSTarget;
    destination: IQSTarget;
    matches: IQSTypeMatch[];
}

/**
 * The catch-all class for constructing and executing stack actions to/from one or more source and target containers. 
 * @class QSTransferHandler
 */
export class QSTransferHandler {
    readonly player: Player;
    readonly sources: IQSTarget[];
    readonly destinations: IQSTarget[];
    readonly island: Island;

    private _state: QSHandlerState;
    private _executionResults: IQSPairing[][]; // Indexed by [source#][dest#]

    public get state(): QSHandlerState { return this._state; }
    public get executionResults(): IQSPairing[][] { return this._executionResults; }
    /**
     * May succesfully return an empty target array but that's ok. 
     * It means there's no non-empty containers matching the search flags.
     * In this case, executeTransfer() will successfully attempt to do a whole lot of nothing. 
     * @param {QSTargettingFlag} target 
     * @returns {IQSTarget[]}
     */
    private resolveTargetting(target: number): IQSTarget[] {
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
                        type: this.island.items.getContainerReference(c, undefined).crt
                    }
                }, this).filter(iQST => validTypes.includes(iQST.type));

        // Player inventory?
        if (target & QSTargettingFlag.self)
            allContainers.push({ container: this.player.inventory, type: ContainerReferenceType.PlayerInventory });

        return allContainers.filter(iQST => iQST.container.containedItems.length > 0);
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

        return [...sourceTypes].map((sT) => { return { type: sT, had: -1, sent: -1 } });
    }

    /**
    * Attempt to perform the quick-stack according to the parameters passed on construction.
    * Returns immediately if state has any error flag set, or if the 'complete' flag is already set. 
    * @returns {QSHandlerState} The handler state. 
    */
    public executeTransfer(): QSHandlerState {

        // Active error or already complete
        if (this._state & (QSHandlerState.error | QSHandlerState.complete)) return this._state;

        // No valid containers somewhere...
        if (this.sources.length === 0 || this.destinations.length === 0) {
            this._state = QSHandlerState.complete;
            return this._state;
        }

        const itemMgr = this.island.items;

        // For each source...
        this.sources.forEach((src, i) => {
            // Start a row for this source in the results array.
            const thesePairings: IQSPairing[] = [];

            // For each destination...
            this.destinations.forEach((dest, j) => {
                // Define the pairing and find type-matches
                const thisPairing: IQSPairing = {
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

                    QSStaticHelper.LOG.info(`S[${i}](Type${src.type}) D[${j}](Type${dest.type}): Matched ${match.had} '${itemMgr.getItemTypeGroupName(match.type,false).getString()}'`);

                    // Transfer as many as possible, but ignore protected/equipped if source is player inventory.
                    let itMoved: Item[];
                    if (src.type !== ContainerReferenceType.PlayerInventory) {
                        itMoved = itemMgr.moveAllFromContainerToContainer(this.player, src.container, dest.container, match.type, undefined, true);
                    } else {
                        const weightCap = itemMgr.getWeightCapacity(dest.container, true) ?? Infinity;
                        let weightCur = itemMgr.computeContainerWeight(dest.container);
                        

                        itMoved = src.container.containedItems
                            // Filter for matching type
                            .filter(it => (it.type === match.type))
                            // Filter out protected/equipped, and reduce match.had accordingly.
                            .filter(it => {
                                if(it.isProtected() || it.isEquipped()) {
                                    match.had--;
                                    return false;
                                } return true;
                            })
                            // Attempt to deposit; retain list of items that successfully deposited. Check weights first to cut down msgspam.
                            .filter(it => {
                                if (it.weight <= weightCap - weightCur) {
                                    if (itemMgr.moveToContainer(this.player, it, dest.container)) {
                                        weightCur = itemMgr.computeContainerWeight(dest.container);
                                        return true;
                                    }
                                }
                                return false;
                            }, this);
                        
                        // If 'had' has ended up at zero, this typematch is exclusively driven by protected/equipped items. 
                        if (match.had < 1) {
                            badMatches.push(k);
                            if(match.had < 0) QSStaticHelper.LOG.warn(`match.had ended up negative (${match.had}). This shouldn't happen wtf. Throwing out.`);
                        }
                    }
                    // Number transferred.
                    match.sent = itMoved.length;
                    
                }, this); // foreach type-match
                
                // Remove bad matches from the pairing before collection.
                if(badMatches.length) thisPairing.matches.spliceWhere((_,k)=>badMatches.includes(k));
                
                thesePairings.push(thisPairing); 

            }, this); // foreach destination

            this._executionResults.push(thesePairings)

        }, this); // foreach source

        QSStaticHelper.LOG.info(`executionResults structure: [[${this._executionResults.map(row => row.map(_ => 'x').join(',')).join('][')}]]`);

        this._state = QSHandlerState.complete;
        return this._state;
    }

    /**
     * All relevant container and player references are passed to or found by the constructor.
     * They cannot be changed elsewhere.
     * Any instance of this class is expected to exist for less than one game turn, performing one quickstack operation.
     *
     * @param {Player} executor Player initiating the transfer.
     * @param {number} [source=QSTargettingFlag.self] Some combination of bitmap flags to specify valid source container(s). Value should have at least one set location flag (self, nearbyDoodads, etc). Should not share any location flags with 'dest' param.
     * @param {number} [dest=QSTargettingFlag.nearbyDoodads|QSTargettingFlag.nearbyTiles] Bitmap flags to specify valid destination container(s). Value should have at least one set location flag (self, nearbyDoodads, etc). Should not share any location flags with 'source' param.
     */
    constructor(executor: Player, source: number = QSTargettingFlag.self, dest: number = QSTargettingFlag.nearbyDoodads | QSTargettingFlag.nearbyTiles) {
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
};
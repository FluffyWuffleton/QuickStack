import Island from "game/island/Island";
import Item from "game/item/Item";
import { ContainerReferenceType, IContainer, ItemType, ItemTypeGroup } from "game/item/IItem";
import Player from "game/entity/player/Player";
import StaticHelper from "./StaticHelper";
import Doodad from "game/doodad/Doodad";
import { ITransferTarget, THState, ITransferPairing, ITransferItemMatch, THTargettingParam } from "./ITransferHandler";
import { ITile } from "game/tile/ITerrain";
import Log from "utilities/Log";
import Translation from "language/Translation";
import TranslationImpl from "language/impl/TranslationImpl";
import Dictionary from "language/Dictionary";
import { GLOBALCONFIG } from "./QuickStack";

// Utility functions for item and inventory fetching/checking. Pretty self-explanatory.
export function isHeldContainer(player: Player, item: Item): boolean { return player.island.items.isContainer(item) && player === player.island.items.getPlayerWithItemInInventory(item); }
export function isContainerType(player: Player, type: ItemType): boolean { return player.island.items.isInGroup(type, ItemTypeGroup.Storage); }
export function isInHeldContainer(player: Player, item: Item): boolean { return (item?.containedWithin) ? player.island.items.getContainedContainers(player.inventory).includes(item.containedWithin) : false; }
export function playerHasItem(player: Player, item: Item): boolean { return item.getCurrentOwner() === player; }
export function playerHasType(player: Player, type: ItemType): boolean { return player.inventory.containedItems.some(i => i.type === type); }
export function playerHeldContainers(player: Player, type?: ItemType[]): IContainer[] {
    return (type === undefined || !type.length)
        ? player.island.items.getContainedContainers(player.inventory)
        : player.island.items.getContainedContainers(player.inventory)
            .map(c => player.island.items.resolveContainer(c))
            .filter(i => type.some(t => t === (i as Item)?.type)) as IContainer[];
}

// getAdjacentContainers with respect for forbidTiles option.
export function validNearby(player: Player): IContainer[] {
    const adj = player.island.items.getAdjacentContainers(player, false);
    if(StaticHelper.QS_INSTANCE.globalData.optionForbidTiles)
        return adj.filter(c => player.island.items.getContainerReference(c, undefined).crt !== ContainerReferenceType.Tile);
    return adj;
}


/**
 * The catch-all class for constructing, executing, and reporting on type-match transfers to/from one or more source and destination containers.
 * All construction and execution should be handled through {@link TransferHandler.MakeAndRun}
 * Any single instance of this class is expected to exist for less than one game turn, performing one batch of transfers.
 * @class TransferHandler
 */
export default class TransferHandler {
    readonly player: Player;
    readonly sources: ITransferTarget[];
    readonly destinations: ITransferTarget[];
    readonly island: Island;
    readonly typeFilter: ItemType[];
    readonly log: Log | undefined;

    readonly bottomUp: boolean;

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

    /******************************************************
        Static helper functions
    */

    /**
     * Return set of unique Item types in a given Container or Item array.
     * Mainly for overload handling.
     * @param {IContainer|Item[]} X 
     * @returns {Set<ItemType>}
     */
    private static setOfTypes(X: Pick<IContainer, "containedItems">[]): Set<ItemType> {
        return new Set<ItemType>([...X.flatMap(x => x.containedItems.map(it => it.type))]);
    }

    /** 
     * Given two IContainer (or anything with the 'containedItems' field) arrays, returns a (unique) list of typeMatches for use in constructing ITransferPairings
     * @param {IContainer|Item[]} A 
     * @param {IContainer|Item[]} B
     * @param {ItemType[]} [filter = []] Only matches types found in the filter array (if specified).
     * @returns {ITransferItemMatch[]} List of type matches.
     */
    public static matchTypes(A: Pick<IContainer, "containedItems">[], B: Pick<IContainer, "containedItems">[], filter: ItemType[] = []): ITransferItemMatch[] {
        const ATypes = TransferHandler.setOfTypes(A);
        const BTypes = TransferHandler.setOfTypes(B);

        if(filter.length > 0) ATypes.retainWhere(type => filter.includes(type));
        ATypes.retainWhere(type => BTypes.has(type));

        return [...ATypes].map((t) => { return { type: t, had: -1, sent: -1 } })
    }

    /**
     * Given two IContainer (or anything with the 'containedItems' field) arrays, returns the number of matched types between their content.
     * @param {IContainer|Item[]} A 
     * @param {IContainer|Item[]} B
     * @param {ItemType[]} [filter = []] Only matches types found in the filter array (if specified).
     * @returns {number} Number of matching ItemTypes
     */
    public static countMatchTypes(A: Pick<IContainer, "containedItems">[], B: Pick<IContainer, "containedItems">[], filter: ItemType[] = []): number {
        const ATypes = [...TransferHandler.setOfTypes(A)];
        const BTypes = TransferHandler.setOfTypes(B); // B can stay in set form. The 'has()' method will work just fine in our reduce callback.

        if(filter.length > 0) BTypes.retainWhere(type => filter.includes(type));

        return ATypes.reduce((n, type) => { return BTypes.has(type) ? n + 1 : n }, 0);
    }

    /**
     * Returns true if the input container arrays have any shared item type. 
     * @param {Pick<IContainer, "containedItems">[]} A 
     * @param {Pick<IContainer, "containedItems">} B
     * @param {ItemType[]} [filter = []] Only matches types found in the filter array (if specified).
     * @returns {boolean}
     */
    public static hasMatchType(A: Pick<IContainer, "containedItems">[], B: Pick<IContainer, "containedItems">[], filter: ItemType[] = []): boolean {
        const ATypes = [...TransferHandler.setOfTypes(A)];
        const BTypes = TransferHandler.setOfTypes(B);

        if(filter.length > 0) BTypes.retainWhere(type => filter.includes(type));

        return ATypes.some(type => BTypes.has(type));
    }

    /**
     * Returns true if the input containers have a given item type
     * @param {Pick<IContainer, "containedItems">[]} A 
     * @param {ItemType} type
     * @returns {boolean}
     */
    public static hasType(X: Pick<IContainer, "containedItems">[], type: ItemType): boolean {
        return TransferHandler.setOfTypes(X).has(type);
    }

    public static canFitAny(src: Pick<IContainer, "containedItems">[], dest: IContainer[], player: Player, filter: ItemType[] = []) {
        const srcItems = src.flatMap(s => s.containedItems).filter(i=>!i.isProtected() && !i.isEquipped());
        const srcTypes = filter.length > 0 ? new Set<ItemType>(filter) : TransferHandler.setOfTypes([{containedItems: srcItems}]);
        if(StaticHelper.QS_INSTANCE.globalData.optionKeepContainers) srcTypes.retainWhere(t => !player.island.items.isInGroup(t, ItemTypeGroup.Storage));
        for(let d of dest) {
            const matchTypes = [...new Set<ItemType>(d.containedItems.map(i => i.type))].filter(t => srcTypes.has(t));
            const remaining = (player.island.items.getWeightCapacity(d, undefined) ?? (player.island.isTileFull(d as ITile) ? 0 : Infinity)) - player.island.items.computeContainerWeight(d);
            if(matchTypes.some(t => remaining >= srcItems.reduce((w,i) => (i.type === t && i.weight<w ? i.weight : w), Infinity))) return true;
        };
        return false;
    }

    /******************************************************
        Meaty functions
    */

    /**
     * This function resolves a list of Containers or TargettingParams into a list of TransferTargets.
     * If the {@arg nested} parameter is set, it will resolve any container-nesting hierarchy, returning only the list of top-level containers, 
     *  with subcontainers accessible via the {@link ITransferTarget.children} property. 
     * Otherwise, the returned list will be flat, with all {@link ITransferTarget.children} and {@link ITransferTarget.parent} properties will be undefined.
     * @param {THTargettingParam[]|IContainer[]} target 
     * @param {boolean}[nested = false]
     * @returns {ITransferTarget[]}
     */
    private resolveTargetting(target: THTargettingParam[] | IContainer[], nested: boolean = false): ITransferTarget[] {
        // Empty input
        if(!target.length) { this._state |= THState.noTargetFlag; return []; }

        let targetsFlat: ITransferTarget[];

        if('containedItems' in target[0]) {  // IContainer[] input. Easy flat map.
            // Ensure no repetition via the magic of Sets    
            targetsFlat = [... new Set<ITransferTarget>([...(target as IContainer[]).map(t => ({ container: t, type: this.island.items.getContainerReference(t, undefined).crt }))])];

        } else { // THTargettingParam[] input. Parse stuff. Maybe recursively.
            const targetSet = new Set<ITransferTarget>();

            // If a call to getAdjacentContainers will be needed, get it out of the way.
            const nearby: ITransferTarget[] = (target as THTargettingParam[]).some(p => ('doodads' in p || 'tiles' in p))
                ? this.island.items
                    .getAdjacentContainers(this.player, false)
                    .map(c => ({ container: c, type: this.island.items.getContainerReference(c, undefined).crt }))
                : [];

            // Callback function taking an individual parameter and adding a list of matching targets onto targetSet. 
            // Recursively resolves sub-containers if specified by the parameter.
            const resolveParam = (p: THTargettingParam) => {
                let adding: ITransferTarget[];

                // Identify target containers
                if('self' in p) adding = [{ container: this.player.inventory, type: ContainerReferenceType.PlayerInventory }];
                else if('tiles' in p) adding = StaticHelper.QS_INSTANCE.globalData.optionForbidTiles ? [] : adding = nearby.filter(near => near.type === ContainerReferenceType.Tile);
                else if('doodads' in p) adding = nearby.filter(near => near.type === ContainerReferenceType.Doodad);
                else adding = (Array.isArray(p.container) ? p.container : [p.container]).map(c => ({ container: c, type: this.island.items.getContainerReference(c, undefined).crt }));

                // Filter existing targets
                adding = adding.filter(t => !targetSet.has(t))

                // If we're recurring on these...
                if('recursive' in p) adding.forEach(a => // For each of the targets to be added...
                    this.island.items.getContainedContainers(a.container).forEach((subCon) => // for each of its subcontainers
                        resolveParam({ container: subCon, recursive: true }))); // Wrap it in a recursive container param and resolve.

                targetSet.add(...adding);
            }

            // Resolve each parameter through our callback, which will populate targetSet.
            target.forEach(t => resolveParam(t as THTargettingParam));
            targetsFlat = [...targetSet];
        }

        if(!nested) return targetsFlat;

        // Resolve the nesting structure
        // This doesn't account for the possibility of circular inheritance, but we have bigger problems if that somehow appears.
        // For each target, see if it's contained in one of the other targets. If so, define that link.
        targetsFlat.forEach(orphan => {
            const parent = (orphan.container.containedWithin !== undefined) ? targetsFlat.find(t => t.container === orphan.container.containedWithin) : undefined;
            if(parent !== undefined) { // If so, define the link.
                orphan.parent = parent;
                if(parent.children !== undefined) parent.children.push(orphan);
                else parent.children = [orphan];
            }
        });

        // Return the top-level of the nested structure, comprising the targets that still have no parent.
        return targetsFlat.filter(t => t.parent === undefined);
    }

    /**
    * Attempt to perform the quick-stack according to the parameters passed on construction.
    * Returns immediately if state has any error flag set, or if the 'complete' flag is already set. 
    * @returns {THState} The handler state. 
    */
    private executeTransfer(log: Log = StaticHelper.QS_LOG): THState {
        // Active error or already complete
        if(this._state & (THState.error | THState.complete)) return this._state;

        // At least one end of this transfer is missing valid targets...
        if(this.sources.length === 0 || this.destinations.length === 0) { this._state = THState.complete; return this._state; }

        const itemMgr = this.island.items;

        // Helper function doTransfer. To be called once on each source.
        const doTransfer = (src: ITransferTarget): Item[] => {

            // Pairings for this source, to be added as a row in executionResults.
            const thesePairings: ITransferPairing[] = [];
            const allItemsMoved: Item[] = [];

            // For each destination...
            this.destinations.forEach((dest, j) => {

                // Define the pairing and find type-matches
                const thisPairing: ITransferPairing = {
                    source: src,
                    destination: dest,
                    matches: TransferHandler.matchTypes([src.container], [dest.container], this.typeFilter)
                };

                // Remove any forbidden types
                if(StaticHelper.QS_INSTANCE.globalData.optionKeepContainers)
                    thisPairing.matches = thisPairing.matches.filter(m => !itemMgr.isInGroup(m.type, ItemTypeGroup.Storage));

                // We'll want to keep track of any type-matches caused exclusively by protected/equipped items when drawing from player inventory,
                // No action will be taken for these matches, and we'll want to remove the pairing from executionResults before returning.
                let badMatches: number[] = [];

                // For each type-match
                log?.info(`executeTransfer: PAIRING:\n Length ${thisPairing.matches.length} \n ${itemMgr.resolveContainer(thisPairing.destination.container)} from ${itemMgr.resolveContainer(thisPairing.source.container)}`);
                thisPairing.matches.forEach((match, k) => {

                    // Original number of this item in source
                    match.had = src.container.containedItems.reduce((n, item) => { return (item.type === match.type) ? n + 1 : n }, 0);

                    log?.info(`executeTransfer: Match ${k} :: (${Translation.nameOf(Dictionary.Item, match.type, false).toString()}) :: Had ${match.had}`);

                    // Make a fixed copy of our matched items first, otherwise NIGHTMARE BUGS as containedItems reference changes while we deposit.
                    const itHad = src.container.containedItems.filter(it => {
                        if(it.type !== match.type) return false; // Filter for matching type
                        if(it.isProtected() || it.isEquipped()) { // Exclude protected/equipped, and remove their count from match.had
                            match.had--;
                            return false;
                        }
                        return true;
                    });

                    // Transfer as many as possible, but ignore protected/equipped
                    const weightCap = itemMgr.getWeightCapacity(dest.container, true) ?? Infinity;
                    let update = true; // has destination capacity changed?
                    let remaining: number; // Remaining weight capacity if destination is a doodad, (!isFull ? infinity : -Infinity) if destination is a tile.

                    // itMoved will contain the list of items that were successfully transferred.
                    const itMoved: Item[] = itHad.filter(it => {
                        // Attempt to deposit. Check weights as we go to avoid 'no room in container' spam.
                        if(update) remaining = dest.type === ContainerReferenceType.Tile
                            ? (this.island.isTileFull(dest.container as ITile) ? -Infinity : Infinity)
                            : (weightCap - itemMgr.computeContainerWeight(dest.container));
                        update = false;

                        if(remaining >= it.weight) update = itemMgr.moveToContainer(this.player, it, dest.container);
                        return update;

                    }, this);

                    // Number transferred.
                    match.sent = itMoved.length;

                    log?.info(`executeTransfer: Sent :: ${match.sent} ${Translation.nameOf(Dictionary.Item, match.type, false).toString()} :: Had ${match.had}`);

                    allItemsMoved.push(...itMoved);


                    if(match.had > 0) {
                        if(match.sent === match.had) this._anySuccess = true;
                        else if(match.sent > 0) this._anyPartial = true;
                        else this._anyFailed = true;
                    } else { // If 'had' has ended up at zero, this typematch is exclusively driven by protected/equipped items. 
                        badMatches.push(k);
                        if(match.had < 0) log?.warn(`match.had ended up negative (${match.had}). This shouldn't happen wtf. Throwing out.`);
                    }

                }, this); // foreach type-match

                // Remove bad matches from the pairing before collection.
                if(badMatches.length) {
                    log?.info(`executeTransfer: Excising bad matches (${badMatches})`);
                    thisPairing.matches = thisPairing.matches.filter((_, k) => !badMatches.includes(k)); // Can't use splicewhere because indices desync after splicing one element.
                }

                log?.info(`executeTransfer: Final matches count for pairing: ${thisPairing.matches.length}`);
                thesePairings.push(thisPairing);

            }, this); // foreach destination
            this._executionResults.push(thesePairings);
            return allItemsMoved;
        }

        // Helper function handleSource. Called once for each top-level source container, then recursively for any child containers. 
        // Handles calls to doTransfer() for each source according to topDown/bottomUp recursion order.
        const handleSource = (src: ITransferTarget, dummy: boolean = false) => {
            if(this.bottomUp) { // Handle children first
                src.children?.forEach(child => handleSource(child), this);
                doTransfer(src);
            } else { // Handle children last
                // In top-down ordering, child containers might be transferred out of the source inventory before being touched.
                // If a child container was transferred, it and its nested children should still get their (empty) 
                //   result rows added to _executionResults in order to line up with the structure of this.sources. 
                // The 'dummy' flag signifies whether the current source falls into that category. 
                if(dummy) {
                    this._executionResults.push([]);
                    src.children?.forEach(child => handleSource(child, true));
                } else {
                    const itemsMoved = doTransfer(src);
                    src.children?.forEach(child => handleSource(child, itemsMoved.includes(child.container as Item)), this);
                }
            }
        };

        // Handle each top-level source.
        this.sources.forEach(s => handleSource(s), this);

        this._state = THState.complete;
        return this._state;
    }

    /**
     * Send post-transfer messages to the player.
     * If any error flag is set, or the 'complete' flag is *not* set, this will do nothing and return false.
     * @param player 
     * @returns {boolean} Successfully sent messages?
     */
    private reportMessages(player: Player = this.player, log: Log = StaticHelper.QS_LOG): boolean {
        // Active error or not yet complete
        if((this._state & THState.error) || !(this._state & THState.complete)) return false;

        const itemMgr = this.island.items;

        // For each unique source->destination pair observed in this transfer... 
        this._executionResults.forEach(pairList => {
            pairList.forEach(pair => {
                if(pair.matches.length) {
                    log?.info(`ReportMessage:\nPAIRING: Length ${pair.matches.length} :: ${itemMgr.resolveContainer(pair.destination.container)}(${pair.destination.type}) from ${itemMgr.resolveContainer(pair.source.container)}`);

                    type sdKey = keyof Pick<typeof pair, "source" | "destination">;
                    const str: { [key in sdKey]: TranslationImpl | "UNDEFINED"; } & { items: { [key in 'all' | 'some' | 'none']: TranslationImpl[]; } } = {
                        source: "UNDEFINED", //  will hold TranslationImpl for the source string segment.
                        destination: "UNDEFINED", //  will hold TranslationImpl for the destination string segment.
                        items: {
                            all: new Array<TranslationImpl>, // separate arrays so they can be sorted in the output (full, then)
                            some: new Array<TranslationImpl>,
                            none: new Array<TranslationImpl>
                        }
                    };

                    // Source and Destination strings...
                    (["source", "destination"] as sdKey[]).forEach(k => {
                        switch(pair[k].type) {
                            case ContainerReferenceType.PlayerInventory:
                                str[k] = StaticHelper.TLget(k === "source" ? "fromX" : "toX").addArgs(StaticHelper.TLget("yourInventory"));
                                break;
                            case ContainerReferenceType.Doodad:
                                str[k] = StaticHelper.TLget(k === "source" ? "fromX" : "toX").addArgs((pair[k].container as Doodad).getName("indefinite", 1));
                                break;
                            case ContainerReferenceType.Item:
                                str[k] = StaticHelper.TLget(k === "source" ? "fromX" : "toX").addArgs((pair[k].container as Item).getName("indefinite", 1, false, false, true, false));
                                break;
                            case ContainerReferenceType.Tile:
                                str[k] = StaticHelper.TLget(k === "source" ? "fromTile" : "toTile");
                                break;
                            default:
                                str[k] = StaticHelper.TLget(k === "source" ? "fromUnknown" : "toUnknown");
                        }
                    });

                    // Transferred item fragment strings
                    let resultFlags: { [key in keyof typeof str.items]?: true } = {}; // Fields are set if any items fall into the category

                    pair.matches.forEach(match => {
                        if(match.sent === match.had) { // Complete transfer
                            resultFlags.all = true;
                            str.items.all.push(StaticHelper.TLget("XOutOfY").addArgs({
                                X: match.sent,
                                name: Translation.nameOf(Dictionary.Item, match.type, match.sent, match.sent > 1 ? "indefinite" : false, true)
                            }));
                        } else if(match.sent > 0) { // Partial transfer
                            resultFlags.some = true;
                            str.items.all.push(StaticHelper.TLget("XOutOfY").addArgs({
                                X: match.sent,
                                Y: match.had,
                                name: Translation.nameOf(Dictionary.Item, match.type, match.had, false, true)
                            }));
                        } else { // Failed transfer
                            resultFlags.none = true;
                            str.items.none.push(Translation.nameOf(Dictionary.Item, match.type, match.had, match.had > 1 ? "indefinite" : false, true));
                        }
                    });

                    log?.info(`ReportMessages: All(${str.items.all.length})  Some(${str.items.some.length})  None(${str.items.none.length})`);

                    // Send messages for this source/destination pairing results
                    // If any items were successfully transferred, the failed items are omitted from the list.
                    /* Message parameter structure, copypasted from english.json...     
                        {   items: ITranslationImpl[],      // item segments array
                            source: ItranslationImpl,       // source segment
                            destination: ITranslationImpl,  // desination segment
                            failed: {             // Flags indicating the failure state of the transfer. Fields are undefined unless trueonly defined when true.
                                some ?: true | undefined, // if some items were successsfully moved, but not all.
                                all ?: true | undefined   // if no items were successfully moved.
                            }
                        }
                    */
                    player.asLocalPlayer?.messages.send(StaticHelper.QS_INSTANCE.messageStackResult, {
                        prefix: StaticHelper.TLget("qsPrefix"),
                        items: [...str.items.all, ...str.items.some, ...(resultFlags.some || resultFlags.all ? [] : str.items.none)],
                        source: str.source,
                        destination: str.destination,
                        failed: {
                            some: resultFlags.some || (resultFlags.all && resultFlags.none) ? true : undefined,
                            all: resultFlags.none && !resultFlags.all && !resultFlags.some ? true : undefined
                        }
                    });

                } // if pair.matches.length
            }, this); // foreach pair in pairList
        }, this); // foreach pairlist in executionResults


        if(!(this._anySuccess || this._anyPartial || this._anyFailed)) player.messages.send(StaticHelper.QS_INSTANCE.messageNoMatch, { prefix: StaticHelper.TLget("qsPrefix") })

        return true;
    }

    /**
     * All relevant container and player references are passed to or found by the constructor.
     * They cannot be changed elsewhere.
     * Any instance of this class is expected to exist for less than one game turn, performing one quickstack operation.
     *  
     * @param {Player} executor Player initiating the transfer.
     * @param {THTargettingParam[] | IContainer[]} [source=[{self:true}]] Sources containers and/or flags to specify valid source targetting. If container list is passed directly IT'S ASSUMED TO BE VALID.
     * @param {THTargettingParam[] | IContainer[]} [dest=[{doodads: true}, {tiles: true}]] Destination containers, and/or flags to specify valid destination targetting. If container list is passed directly IT'S ASSUMED TO BE VALID.
     */
    private constructor(
        executor: Player,
        source: THTargettingParam[] | IContainer[] = [{ self: true }],
        dest: THTargettingParam[] | IContainer[] = [{ doodads: true }, { tiles: true }],
        params: {
            filter?: ItemType[],
            bottomUp?: boolean
        }
    ) {
        this._state = THState.idle;
        this._executionResults = [];

        this.player = executor;
        this.island = executor.island;
        this.typeFilter = params.filter ?? [];
        this.bottomUp = (!!params.bottomUp);

        // Resolve target containers.
        this.sources = this.resolveTargetting(source, true);
        this.destinations = this.resolveTargetting(dest);

        // Check collision
        this.sources.forEach(s => {
            if(this.destinations.includes(s)) {
                this._state |= THState.collision;
                return;
            }
        });
    }

    // Called by executeStackAction. Construct, execute, and report on a transfer, with some error flag checking in between.
    public static MakeAndRun(
        player: Player,
        source: THTargettingParam[] | IContainer[],
        dest: THTargettingParam[] | IContainer[],
        filterTypes?: ItemType[] | undefined,
        log?: Log,
        successFlag?: { failed: boolean },
        suppress?: { report?: true, delay: true }
    ): void {
        const thisfcn = `${TransferHandler.MakeAndRun.name} :: `;
        const t0 = performance.now();
        log?.info(`${thisfcn}Constructing TransferHandler. Timestamp ${t0}`);

        const handler = new TransferHandler(player, source, dest, {
            bottomUp: !StaticHelper.QS_INSTANCE.globalData.optionTopDown,
            ...(filterTypes ? { filter: filterTypes } : {})
        });

        if(handler.state & THState.error) { // Initialization error
            log?.error(`${thisfcn}Error flag in handler after construction. Code ${handler.state.toString(2)}`);
            if(successFlag) successFlag.failed = true;
            return;
        }

        if(log) {
            const crtKey = (crt: ContainerReferenceType): string => ContainerReferenceType[crt];
            let str = `Handler initialized\n    Identified sources`;

            const wrapChildren = (c: ITransferTarget): string => {
                if(c.children) return `${crtKey(c.type)}[ ${c.children.map(cc => wrapChildren(cc)).join(', ')} ]`
                return `${crtKey(c.type)}`;
            }

            handler.sources.forEach(s => { str = str + `\n        ${wrapChildren(s)}`; });

            let destStr: string[] = [];
            Object.values(ContainerReferenceType).forEach(v => {
                const destCount = handler.destinations.reduce((n, itt) => { return itt.type === v ? n + 1 : n }, 0);
                if(destCount) destStr.push(`${destCount} ${crtKey(v as ContainerReferenceType)}`);
            });

            log.info(`${thisfcn}${str}\n    Identified destinations:\n        ${destStr.join(',  ')}`);
        }

        // Transfer error?
        if(handler.executeTransfer(log) & THState.error) {
            log?.error(`${thisfcn}Error flag in handler during execution. Code ${handler.state.toString(2)}`);
            if(successFlag) successFlag.failed = true;
            return;
        }

        // Transfer complete. Send messages. Unless we're not.
        if(suppress?.report) log?.info(`${thisfcn}Message reporting suppressed`);
        else if(!handler.reportMessages(player, log)) log?.warn(`TransferHandler.reportMessages() failed for some reason.`);

        if(handler.anySuccess || handler.anyPartial) {
            if(!suppress?.delay) player.addDelay(GLOBALCONFIG.pause_length);
            if(GLOBALCONFIG.pass_turn_success) game.passTurn(player);
            else player.update();
            if(successFlag) successFlag.failed = false;
        }

        const t1 = performance.now();
        log?.info(`${thisfcn}Complete. Timestamp ${t1}. Elapsed ${t1 - t0}`);
    }

};
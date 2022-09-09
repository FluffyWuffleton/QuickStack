import Island from "game/island/Island";
import Item from "game/item/Item";
import { ContainerReferenceType, IContainer, ItemType, ItemTypeGroup } from "game/item/IItem";
import Player from "game/entity/player/Player";
import StaticHelper, { QSMatchableGroupKey, QSMatchableGroups } from "./StaticHelper";
import Doodad from "game/doodad/Doodad";
import { ITransferTarget, THState, ITransferPairing, ITransferItemMatch, THTargettingParam, IMatchParam, Matchable } from "./ITransferHandler";
import { ITile } from "game/tile/ITerrain";
import Log from "utilities/Log";
import Translation from "language/Translation";
import TranslationImpl from "language/impl/TranslationImpl";
import Dictionary from "language/Dictionary";
import { GLOBALCONFIG } from "./StaticHelper";
import ItemManager from "game/item/ItemManager";

export type ThingWithContents = Pick<IContainer, "containedItems">;

// Utility functions for item and inventory fetching/checking. Pretty self-explanatory.
export function isHeldContainer(player: Player, item: Item): boolean { return player.island.items.isContainer(item) && player === player.island.items.getPlayerWithItemInInventory(item); }
export function isContainerType(player: Player, type: ItemType): boolean { return player.island.items.isInGroup(type, ItemTypeGroup.Storage); }
export function isInHeldContainer(player: Player, item: Item): boolean { return (item?.containedWithin) ? player.island.items.getContainedContainers(player.inventory).includes(item.containedWithin) : false; }
export function playerHasItem(player: Player, item: Item): boolean { return item.getCurrentOwner() === player; }
export function playerHasType(player: Player, type: ItemType): boolean { //return player.inventory.containedItems.some(i => i.type === type); }
    const g = TransferHandler.getActiveGroup(type);
    return TransferHandler.canMatch([player.inventory, ...playerHeldContainers(player)], [g !== undefined ? { group: g } : { type: type }]);
}
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
    readonly typeFilter: IMatchParam[];
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

    // Take a list of match parameters. 
    // If any item parameters can be represented by an enabled match-group, use the group parameter instead.
    // Returns a set of flattened parameters.
    private static groupifyParameters(P: IMatchParam[]): Set<(ItemType | QSMatchableGroupKey)> {
        const pSet = new Set<ItemType | QSMatchableGroupKey>;
        P.forEach(param => pSet.add(param.group !== undefined ? param.group : (this.getActiveGroup(param.type) ?? param.type)));
        return pSet;
    }

    //private static flattenParameters(P: IMatchParam[]): (ItemType | QSMatchableGroupKey)[] { return P.map(p => p.type ?? p.group); }

    /**
     * Return set of unique Item types in a given Container or Item array.
     * Mainly for overload handling.
     * @param {ThingWithContents[]} X 
     * @returns {Set<ItemType>}
     */
    private static setOfTypes(X: ThingWithContents[]): Set<ItemType> {
        return new Set<ItemType>([...X.flatMap(x => x.containedItems.map(it => it.type))]);
    }
    /**
     * Return set of unique active match-groups in which the given item types can be found. Might be empty.
     * @param {Set<ItemType>} Types 
     * @returns {Set<QSMatchableGroupKey>}
     */
    private static setOfActiveGroups(Types: Set<ItemType> | ItemType[]): Set<QSMatchableGroupKey> {
        if(!StaticHelper.QS_INSTANCE.activeMatchGroupsArray.length) return new Set<QSMatchableGroupKey>();
        const MGKeySet = new Set<QSMatchableGroupKey>(StaticHelper.QS_INSTANCE.activeMatchGroupsKeys);
        const mset = new Set<Matchable>([...Types, ...[...Types].flatMap(t => ItemManager.getGroups(t))]);

        MGKeySet.retainWhere(KEY => {
            for(const matchable of QSMatchableGroups[KEY]) if(mset.has(matchable)) return true;
            return false;
        });
        return MGKeySet;
    }
    /**
     * Return set of unique parameters (types and active groups) in then given containers
     * If a given type belongs to an active group, that specific type's parameter will be omitted in favor of the group parameter.
     * @param {ThingWithContents[]} X 
     * @returns {Set<IMatchParam>}
     */
    private static setOfParams(X: ThingWithContents[]): Set<IMatchParam> {
        const types = this.setOfTypes(X);               // Set of all types present in the thing.
        const groups = this.setOfActiveGroups(types);   // Set of all active groups comprised by those types

        // Remove type params for types encompassed by an active group.
        groups.forEach(g => types.deleteWhere(t => StaticHelper.QS_INSTANCE.activeMatchGroupsFlattened[g]?.includes(t) ?? false));

        return new Set<IMatchParam>([
            ...[...types].map(t => ({ type: t })),
            ...[...groups].map(g => ({ group: g }))
        ]);
    }
    /**
     * Return set of unique parameters (types and active groups) in then given containers, type-union style
     * If a given type belongs to an active group, that specific type's parameter will be omitted in favor of the group parameter.
     * @param {ThingWithContents[]} X 
     * @returns {Set<ItemType|QSMatchableGroupKey>}
     */
    private static setOfFlatParams(X: ThingWithContents[]): Set<ItemType | QSMatchableGroupKey> {
        const types = this.setOfTypes(X);               // Set of all types present in the thing.
        const groups = this.setOfActiveGroups(types);   // Set of all active groups comprised by those types
        // Remove type params for types encompassed by an active group.
        groups.forEach(g =>
            types.deleteWhere(t =>
                StaticHelper.QS_INSTANCE.activeMatchGroupsFlattened[g]?.includes(t) ?? false));


        StaticHelper.QS_LOG.info(`Resolved params: (Flat) [TYPES, GROUPS]`);
        console.log([[...types], [...groups]]);
        return new Set<ItemType | QSMatchableGroupKey>([...types, ...groups]);
    }

    /** 
     * Given two IContainer (or anything with the 'containedItems' field) arrays, returns a (unique) list of matches for use in constructing ITransferPairings
     * @param {IContainer|Item[]} A 
     * @param {IContainer|Item[]} B
     * @param {IMatchParam[]} [filter = []] Only matches types/groups found in the filter array (if specified).
     * @returns {ITransferItemMatch[]} List of matches.
     */
    public static getMatches(A: ThingWithContents[], B: ThingWithContents[], filter: IMatchParam[] = []): ITransferItemMatch[] {
        StaticHelper.QS_LOG.info(`GET MATCHES:: ${A}  ${B}`);

        // setOfParams will favor providing a group over a type if the group exists. If an item is present, it has no active group.
        const AParams = TransferHandler.setOfFlatParams(A);
        const BParams = TransferHandler.setOfFlatParams(B);
        if(filter.length) {
            const fgrp = this.groupifyParameters(filter);
            AParams.retainWhere(param => fgrp.has(param));
        }
        AParams.retainWhere(param => BParams.has(param));
        StaticHelper.QS_LOG.info(`GET MATCHES:: REMAINING::`);
        console.log(AParams);
        return [...AParams].map((p) => ({
            matched: (p in ItemType)
                ? { type: p as ItemType }
                : { group: p as QSMatchableGroupKey },
            had: -1,
            sent: -1
        }));
    }

    /**
     * Returns true if the input container arrays have any matches.
     * @param {ThingWithContents[]} A 
     * @param {ThingWithContents[]} B
     * @param {IMatchParam[]} [filter = []] Only match according to types/groups found in the filter array (if specified).
     * @returns {boolean}
     */
    public static hasMatch(A: ThingWithContents[], B: ThingWithContents[], filter: IMatchParam[] = []): boolean {
        StaticHelper.QS_LOG.info(`HAS MATCH:: ${A}  ${B}`);

        const AParams = TransferHandler.setOfFlatParams(A);
        const BParams = TransferHandler.setOfFlatParams(B);
        const fgrouped = this.groupifyParameters(filter);
        return [...AParams].some(param => fgrouped.has(param) && BParams.has(param));
    }

    /**
     * Returns true if the input containers have a given item type/activegroup
     * @param {ThingWithContents[]} X
     * @param {IMatchParam[]} params
     * @returns {boolean}
     */
    public static canMatch(X: ThingWithContents[], params: IMatchParam[]): boolean {
        const xFlat = this.setOfFlatParams(X);
        return [...this.groupifyParameters(params)].some(p => xFlat.has(p));
    }

    /**
     * Returns the matchable group key in which the provided ItemType or ItemTypeGroup can be found, if any such group is active. 
     * There are no types or groups belonging to multiple matchable groups.
     * @param {(ItemType|ItemTypeGroup)} type
     * @returns {QSMatchableGroupKey|undefined}
     */
    public static getActiveGroup(type: ItemType | ItemTypeGroup): QSMatchableGroupKey | undefined {
        if(type in ItemTypeGroup) return StaticHelper.QS_INSTANCE.activeMatchGroupsKeys.find(KEY => QSMatchableGroups[KEY].includes(type));
        else return StaticHelper.QS_INSTANCE.activeMatchGroupsKeys.find(KEY => {
            if(QSMatchableGroups[KEY].includes(type)) return true;
            return ItemManager.getGroups(type as ItemType).some(g => QSMatchableGroups[KEY].includes(g));
        });
    }

    public static canFitAny(src: ThingWithContents[], dest: IContainer[], player: Player, filter: IMatchParam[] = []) {
        const srcItems = src.flatMap(s => s.containedItems).filter(i => !i.isProtected() && !i.isEquipped());
        const srcParams = TransferHandler.setOfParams([{ containedItems: srcItems }]);

        if(StaticHelper.QS_INSTANCE.globalData.optionKeepContainers) // None of the activegroups includes storage items. It's fine to remove by 'type' param only.
            srcParams.retainWhere(t => t.type === undefined ? true : !player.island.items.isInGroup(t.type, ItemTypeGroup.Storage));
        if(filter.length) {
            const fgrp = this.groupifyParameters(filter);
            srcParams.retainWhere(p => fgrp.has(p.type ?? p.group));
        }
        const srcParamsFlat = [...srcParams].map(p => p.group ?? p.type);

        // for each destination
        for(const d of dest) {
            const remaining = ( // remaining weight capacity of this destination.
                player.island.items.getWeightCapacity(d, undefined) ?? (player.island.isTileFull(d as ITile) ? 0 : Infinity)
            ) - player.island.items.computeContainerWeight(d);
            const matchParams = TransferHandler.setOfParams([d]);
            matchParams.retainWhere(p => srcParamsFlat.includes(p.group ?? p.type));
            if([...matchParams].some(param =>
                remaining >= srcItems.reduce((w, it) => // reduce => LightestMatchedItemWeight | Infinity
                    (param.type !== undefined
                        ? it.type === param.type
                        : this.getActiveGroup(it.type) === param.group
                    ) && it.weight < w ? it.weight : w, Infinity)
            )) return true;
        }
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
                adding = adding.filter(t => !targetSet.has(t));

                // If we're recurring on these...
                if('recursive' in p) adding.forEach(a => // For each of the targets to be added...
                    this.island.items.getContainedContainers(a.container).forEach((subCon) => // for each of its subcontainers
                        resolveParam({ container: subCon, recursive: true }))); // Wrap it in a recursive container param and resolve.

                targetSet.add(...adding);
            };

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

                // Define the pairing and find matches
                const thisPairing: ITransferPairing = {
                    source: src,
                    destination: dest,
                    matches: TransferHandler.getMatches([src.container], [dest.container], this.typeFilter)
                };

                // Remove any forbidden types
                if(StaticHelper.QS_INSTANCE.globalData.optionKeepContainers)
                    thisPairing.matches = thisPairing.matches.filter(m => m.matched.type === undefined ? true : !itemMgr.isInGroup(m.matched.type, ItemTypeGroup.Storage));

                // If any matches are group-based, remove any type-based matches of the group's itemtypes to avoid redundancy.
                for(const m of [...thisPairing.matches])
                    if(m.matched.group !== undefined)
                        thisPairing.matches = thisPairing.matches.filter(oldm => {
                            if(oldm.matched.type === undefined) return true;
                            return TransferHandler.getActiveGroup(oldm.matched.type) === m.matched.group;
                        });

                // We'll want to keep track of any matches caused exclusively by protected/equipped items when drawing from player inventory,
                // No action will be taken for these matches, and we'll want to remove the pairing from executionResults before returning.
                let badMatches: number[] = [];

                log?.info(`executeTransfer: PAIRING:`
                    + `\n ${itemMgr.resolveContainer(thisPairing.destination.container)} from ${itemMgr.resolveContainer(thisPairing.source.container)}`
                    + `\n Found ${thisPairing.matches.length} matches.`);

                // For each matched parameter
                thisPairing.matches.forEach((match, k) => {
                    const isGroupMatch = match.matched.group !== undefined;
                    const doesThisMatch = isGroupMatch
                        ? (it: Item) => (StaticHelper.QS_INSTANCE.activeMatchGroupsFlattened[match.matched.group!]!.includes(it.type))
                        : (it: Item) => (it.type === match.matched.type);

                    // List of items that we should try to send.
                    const validItems = src.container.containedItems.filter((it) => doesThisMatch(it) && !it.isProtected() && !it.isEquipped());

                    // Original number of these items in source
                    match.had = validItems.length;

                    log?.info(`executeTransfer: Match #${k} (${!isGroupMatch
                        ? `TYPE: '${Translation.nameOf(Dictionary.Item, match.matched.type!, false).toString()}'`
                        : `GROUP: '${StaticHelper.TLget(match.matched.group!).toString()}'`
                        }) :: Had ${match.had}`);

                    // Track weight capacity as we go.
                    const weightCap = itemMgr.getWeightCapacity(dest.container, true) ?? Infinity;
                    let update = true; // has destination capacity changed?
                    let remaining: number; // Remaining weight capacity if destination is a doodad, (!isFull ? infinity : -Infinity) if destination is a tile.

                    // itMoved will contain the list of items that were successfully transferred.
                    const itMoved: Item[] = validItems.filter(it => {
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
                    allItemsMoved.push(...itMoved);

                    log?.info(`executeTransfer: Sent ${match.sent} :: Had ${match.had}`);

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
        };

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
                    const str: { [key in sdKey]: TranslationImpl | "UNDEFINED"; } & { items: { [key in 'all' | 'some' | 'none']: TranslationImpl[]; }; } = {
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
                                name: match.matched.type !== undefined
                                    ? Translation.nameOf(Dictionary.Item, match.matched.type, match.sent, match.sent > 1 ? "indefinite" : false, true)
                                    : StaticHelper.TLget(match.matched.group).passTo(StaticHelper.TLget("colorMatchGroup")).passTo(Translation.reformatSingularNoun(match.sent, false))
                            }));
                        } else if(match.sent > 0) { // Partial transfer
                            resultFlags.some = true;
                            str.items.all.push(StaticHelper.TLget("XOutOfY").addArgs({
                                X: match.sent,
                                Y: match.had,
                                name: match.matched.type !== undefined
                                    ? Translation.nameOf(Dictionary.Item, match.matched.type, match.had, false, true)
                                    : StaticHelper.TLget(match.matched.group).passTo(StaticHelper.TLget("colorMatchGroup")).passTo(Translation.reformatSingularNoun(match.had, false))

                            }));
                        } else { // Failed transfer
                            resultFlags.none = true;
                            str.items.none.push(match.matched.type !== undefined
                                ? Translation.nameOf(Dictionary.Item, match.matched.type, match.had, match.had > 1 ? "indefinite" : false, true)
                                : StaticHelper.TLget(match.matched.group).passTo(StaticHelper.TLget("colorMatchGroup")).passTo(Translation.reformatSingularNoun(match.had, false)));
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


        if(!(this._anySuccess || this._anyPartial || this._anyFailed)) player.messages.send(StaticHelper.QS_INSTANCE.messageNoMatch, { prefix: StaticHelper.TLget("qsPrefix") });

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
            filter?: IMatchParam[],
            bottomUp?: boolean;
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
        filterTypes?: IMatchParam[] | undefined,
        log?: Log,
        successFlag?: { failed: boolean; },
        suppress?: { report?: true, delay: true; }
    ): void {
        const thisfcn = `${TransferHandler.MakeAndRun.name} :: `;
        const t0 = performance.now();
        log?.info(`${thisfcn}Constructing TransferHandler.Timestamp ${t0} `);

        const handler = new TransferHandler(player, source, dest, {
            bottomUp: !StaticHelper.QS_INSTANCE.globalData.optionTopDown,
            ...(filterTypes ? { filter: filterTypes } : {})
        });

        if(handler.state & THState.error) { // Initialization error
            log?.error(`${thisfcn}Error flag in handler after construction.Code ${handler.state.toString(2)} `);
            if(successFlag) successFlag.failed = true;
            return;
        }

        if(log) {
            const crtKey = (crt: ContainerReferenceType): string => ContainerReferenceType[crt];
            let str = `Handler initialized\n    Identified sources`;

            const wrapChildren = (c: ITransferTarget): string => {
                if(c.children) return `${crtKey(c.type)} [${c.children.map(cc => wrapChildren(cc)).join(', ')}]`;
                return `${crtKey(c.type)} `;
            };

            handler.sources.forEach(s => { str = str + `\n        ${wrapChildren(s)} `; });

            let destStr: string[] = [];
            Object.values(ContainerReferenceType).forEach(v => {
                const destCount = handler.destinations.reduce((n, itt) => { return itt.type === v ? n + 1 : n; }, 0);
                if(destCount) destStr.push(`${destCount} ${crtKey(v as ContainerReferenceType)} `);
            });

            log.info(`${thisfcn}${str} \n    Identified destinations: \n        ${destStr.join(',  ')} `);
        }

        // Transfer error?
        if(handler.executeTransfer(log) & THState.error) {
            log?.error(`${thisfcn}Error flag in handler during execution.Code ${handler.state.toString(2)} `);
            if(successFlag) successFlag.failed = true;
            return;
        }

        // Transfer complete. Send messages. Unless we're not.
        if(suppress?.report) log?.info(`${thisfcn}Message reporting suppressed`);
        else if(!handler.reportMessages(player, /* log */)) log?.warn(`TransferHandler.reportMessages() failed for some reason.`);

        if(handler.anySuccess || handler.anyPartial) {
            if(!suppress?.delay) player.addDelay(GLOBALCONFIG.pause_length);
            if(GLOBALCONFIG.pass_turn_success) game.passTurn(player);
            else player.update();
            if(successFlag) successFlag.failed = false;
        }

        const t1 = performance.now();
        log?.info(`${thisfcn} Complete.Timestamp ${t1}. Elapsed ${t1 - t0} `);
    }
}
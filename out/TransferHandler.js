define(["require", "exports", "game/item/IItem", "game/item/ItemManager", "game/tile/ITerrain", "language/Dictionary", "language/ITranslation", "language/Translation", "utilities/game/TileHelpers", "utilities/math/Direction", "./ITransferHandler", "./QSMatchGroups", "./StaticHelper"], function (require, exports, IItem_1, ItemManager_1, ITerrain_1, Dictionary_1, ITranslation_1, Translation_1, TileHelpers_1, Direction_1, ITransferHandler_1, QSMatchGroups_1, StaticHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TLContainer = exports.isSafeTile = exports.isValidTile = exports.validNearby = exports.itemTransferAllowed = exports.playerHeldContainers = exports.playerHasType = exports.playerHasItem = exports.isInHeldContainer = exports.isStorageType = exports.isHeldContainer = exports.DestinationTileOptions = exports.SourceTileOptions = void 0;
    ;
    exports.SourceTileOptions = { ignoreForbidTiles: true };
    exports.DestinationTileOptions = { allowBlockedTiles: false };
    function isHeldContainer(player, item) { return player.island.items.isContainer(item) && player === item.getCurrentOwner(); }
    exports.isHeldContainer = isHeldContainer;
    function isStorageType(type) { return ItemManager_1.default.isInGroup(type, IItem_1.ItemTypeGroup.Storage); }
    exports.isStorageType = isStorageType;
    function isInHeldContainer(player, item) { return !!(item?.containedWithin) ? player.island.items.getContainedContainers(player.inventory).includes(item.containedWithin) : false; }
    exports.isInHeldContainer = isInHeldContainer;
    function playerHasItem(player, item) { return item.getCurrentOwner() === player; }
    exports.playerHasItem = playerHasItem;
    function playerHasType(player, type) {
        const groups = (0, QSMatchGroups_1.getActiveGroups)(type);
        return TransferHandler.canMatch([player.inventory, ...playerHeldContainers(player)], (groups.length > 0) ? groups.map(g => ({ group: g })) : [{ type: type }]);
    }
    exports.playerHasType = playerHasType;
    function playerHeldContainers(player, type) {
        return (type === undefined || !type.length)
            ? player.island.items.getContainedContainers(player.inventory)
            : player.island.items.getContainedContainers(player.inventory)
                .map(c => player.island.items.resolveContainer(c))
                .filter(i => type.some(t => t === i?.type));
    }
    exports.playerHeldContainers = playerHeldContainers;
    function itemTransferAllowed(i) { return Array.isArray(i) ? i.map(ii => _itemTransferAllowed(ii)) : _itemTransferAllowed(i); }
    exports.itemTransferAllowed = itemTransferAllowed;
    function _itemTransferAllowed(item) {
        if (item.isProtected())
            return false;
        if (item.isEquipped(true))
            return false;
        if (StaticHelper_1.default.QS_INSTANCE.globalData.optionKeepContainers && isStorageType(item.type))
            return false;
        return true;
    }
    ;
    function validNearby(player, tileOptions) {
        const adj = player.island.items.getAdjacentContainers(player, false);
        [...adj].entries().reverse().forEach(([idx, c]) => {
            if (player.island.items.getContainerReference(c, undefined).crt === IItem_1.ContainerReferenceType.Tile
                && !isValidTile(c, tileOptions))
                adj.splice(idx, 1);
        });
        return adj;
    }
    exports.validNearby = validNearby;
    function isValidTile(tile, tileOptions) {
        return (!!(tileOptions?.ignoreForbidTiles) || !StaticHelper_1.default.QS_INSTANCE.globalData.optionForbidTiles)
            && (!!(tileOptions?.allowBlockedTiles) || !tile.doodad?.description()?.blockMove)
            && isSafeTile(tile);
    }
    exports.isValidTile = isValidTile;
    function isSafeTile(tile) {
        return (TileHelpers_1.default.getType(tile) !== ITerrain_1.TerrainType.Lava)
            && !(tile.events?.some(e => e.description()?.providesFire))
            && !(tile.doodad?.isDangerous(localPlayer));
    }
    exports.isSafeTile = isSafeTile;
    function TLContainer(c, crt, toFrom) {
        const cache = StaticHelper_1.default.QSLSC?.findNearby(localPlayer.island.items.hashContainer(c));
        switch (crt) {
            case IItem_1.ContainerReferenceType.PlayerInventory:
                return (0, StaticHelper_1.TLMain)(`${toFrom}X`).addArgs((0, StaticHelper_1.TLMain)("yourInventory"));
            case IItem_1.ContainerReferenceType.Item:
                return (0, StaticHelper_1.TLMain)(`${toFrom}X`).addArgs(c.getName("indefinite", 1, false, false, true, false));
            case IItem_1.ContainerReferenceType.Doodad:
                if (!cache || cache.iswhat === "Item" || cache.relation === Direction_1.Direction.None)
                    return (0, StaticHelper_1.TLMain)(`${toFrom}X`).addArgs(c.getName("indefinite", 1));
                else
                    return (0, StaticHelper_1.TLMain)(`${toFrom}X`).addArgs((0, StaticHelper_1.TLUtil)("concat").addArgs(c.getName("indefinite", 1), (0, StaticHelper_1.TLUtil)("parenthetical").addArgs(Translation_1.default.get(Dictionary_1.default.Direction, cache.relation))));
            case IItem_1.ContainerReferenceType.Tile:
                if (!cache || cache.iswhat === "Item" || cache.relation === Direction_1.Direction.None)
                    return (0, StaticHelper_1.TLMain)(`${toFrom}Tile`);
                else
                    return (0, StaticHelper_1.TLUtil)("concat").addArgs((0, StaticHelper_1.TLMain)(`${toFrom}Tile`), (0, StaticHelper_1.TLUtil)("parenthetical").addArgs(Translation_1.default.get(Dictionary_1.default.Direction, cache.relation)));
            default:
                return (0, StaticHelper_1.TLMain)(`${toFrom}Unknown`);
        }
    }
    exports.TLContainer = TLContainer;
    class TransferHandler {
        constructor(executor, source = [{ self: true }], dest = [{ doodads: true }, { tiles: true }], params) {
            this._anyFailed = false;
            this._anySuccess = false;
            this._anyPartial = false;
            this._state = ITransferHandler_1.THState.idle;
            this._executionResults = [];
            this.player = executor;
            this.island = executor.island;
            this.typeFilter = params.filter ?? [];
            this.bottomUp = (!!params.bottomUp);
            this.sources = this.resolveTargetting(source, true, exports.SourceTileOptions);
            this.destinations = this.resolveTargetting(dest, false, exports.DestinationTileOptions);
            this.sources.forEach(s => {
                if (this.destinations.includes(s)) {
                    this._state |= ITransferHandler_1.THState.collision;
                    return;
                }
            });
        }
        get state() { return this._state; }
        get executionResults() { return this._executionResults; }
        get anySuccess() { return this._anySuccess; }
        get anyPartial() { return this._anyPartial; }
        get anyFailed() { return this._anyFailed; }
        static setOfTypes(X) {
            return new Set([...X.flatMap(x => (x.containedItems ?? X).map(it => it.type))]);
        }
        static setOfActiveGroups(Types) {
            if (!StaticHelper_1.default.QS_INSTANCE.anyMatchgroupsActive)
                return new Set();
            const MGKeySet = new Set(StaticHelper_1.default.QS_INSTANCE.activeMatchGroupsKeys);
            const mset = new Set([...Types, ...[...Types].flatMap(t => ItemManager_1.default.getGroups(t))]);
            MGKeySet.retainWhere(KEY => {
                for (const matchable of QSMatchGroups_1.QSMatchableGroups[KEY])
                    if (mset.has(matchable))
                        return true;
                return false;
            });
            return MGKeySet;
        }
        static setOfParams(X) {
            const types = this.setOfTypes(X);
            const groups = this.setOfActiveGroups(types);
            groups.forEach(g => types.deleteWhere(t => StaticHelper_1.default.QS_INSTANCE.activeMatchGroupsFlattened[g]?.includes(t) ?? false));
            return new Set((0, QSMatchGroups_1.unflattenMatchParams)([...types, ...groups]));
        }
        static setOfFlatParams(X) {
            const types = this.setOfTypes(X);
            const groups = this.setOfActiveGroups(types);
            groups.forEach(g => types.deleteWhere(t => StaticHelper_1.default.QS_INSTANCE.activeMatchGroupsFlattened[g]?.includes(t) ?? false));
            return new Set([...types, ...groups]);
        }
        static getMatches(A, B, filter = []) {
            const AParams = TransferHandler.setOfFlatParams(A);
            const BParams = TransferHandler.setOfFlatParams(B);
            if (filter.length) {
                const fgrp = (0, QSMatchGroups_1.groupifyParameters)(filter);
                AParams.retainWhere(param => fgrp.has(param));
            }
            AParams.retainWhere(param => BParams.has(param));
            return (0, QSMatchGroups_1.unflattenMatchParams)([...AParams]);
        }
        static hasMatch(A, B, filter = []) {
            const AParams = TransferHandler.setOfFlatParams(A);
            const BParams = TransferHandler.setOfFlatParams(B);
            if (filter.length) {
                const fgrouped = (0, QSMatchGroups_1.groupifyParameters)(filter);
                return [...AParams].some(param => fgrouped.has(param) && BParams.has(param));
            }
            return [...AParams].some(param => BParams.has(param));
        }
        static canMatch(X, params) {
            const xFlat = this.setOfFlatParams(X);
            return [...(0, QSMatchGroups_1.groupifyParameters)(params)].some(p => xFlat.has(p));
        }
        static canFitAny(src, dest, player, filter = []) {
            if (!this.hasMatch(src, dest, filter))
                return false;
            const srcItems = src.flatMap(s => s.containedItems).filter(i => !i.isProtected() && !i.isEquipped());
            const srcParams = TransferHandler.setOfParams([{ containedItems: srcItems }]);
            if (StaticHelper_1.default.QS_INSTANCE.globalData.optionKeepContainers)
                srcParams.retainWhere(t => t.type === undefined ? true : !ItemManager_1.default.isInGroup(t.type, IItem_1.ItemTypeGroup.Storage));
            if (filter.length) {
                const fgrp = (0, QSMatchGroups_1.groupifyParameters)(filter);
                srcParams.retainWhere(p => fgrp.has((0, QSMatchGroups_1.flattenMatchParams)(p)));
            }
            const srcParamsFlat = (0, QSMatchGroups_1.flattenMatchParams)([...srcParams]);
            for (const d of dest) {
                const remaining = (player.island.items.getWeightCapacity(d, undefined) ?? (player.island.isTileFull(d) ? 0 : Infinity)) - player.island.items.computeContainerWeight(d);
                const matchParams = TransferHandler.setOfParams([d]);
                matchParams.retainWhere(p => srcParamsFlat.includes((0, QSMatchGroups_1.flattenMatchParams)(p)));
                if ([...matchParams].some(param => remaining > srcItems.reduce((w, it) => (param.type !== undefined
                    ? it.type === param.type
                    : ((0, QSMatchGroups_1.getActiveGroups)(it.type).includes(param.group)
                        && (StaticHelper_1.default.QS_INSTANCE.globalData.optionKeepContainers
                            ? !ItemManager_1.default.isInGroup(it.type, IItem_1.ItemTypeGroup.Storage)
                            : true))) && it.weight < w ? it.weight : w, Infinity)))
                    return true;
            }
            return false;
        }
        resolveTargetting(target, nested = false, tileOptions) {
            if (!target.length) {
                this._state |= ITransferHandler_1.THState.noTargetFlag;
                return [];
            }
            let targetsFlat;
            if ('containedItems' in target[0]) {
                targetsFlat = [...new Set([...target.map(t => ({ container: t, type: this.island.items.getContainerReference(t, undefined).crt }))])];
            }
            else {
                const targetSet = new Set();
                const nearby = target.some(p => ('doodads' in p || 'tiles' in p))
                    ? validNearby(this.player, tileOptions)
                        .map(c => ({ container: c, type: this.island.items.getContainerReference(c, undefined).crt }))
                    : [];
                const resolveParam = (p) => {
                    let adding;
                    if ('self' in p)
                        adding = [{ container: this.player.inventory, type: IItem_1.ContainerReferenceType.PlayerInventory }];
                    else if ('tiles' in p)
                        adding = nearby.filter(near => near.type === IItem_1.ContainerReferenceType.Tile);
                    else if ('doodads' in p)
                        adding = nearby.filter(near => near.type === IItem_1.ContainerReferenceType.Doodad);
                    else
                        adding = (Array.isArray(p.container) ? p.container : [p.container]).map(c => ({ container: c, type: this.island.items.getContainerReference(c, undefined).crt }));
                    adding = adding.filter(t => !targetSet.has(t));
                    if ('recursive' in p)
                        adding.forEach(a => this.island.items.getContainedContainers(a.container).forEach((subCon) => resolveParam({ container: subCon, recursive: true })));
                    targetSet.add(...adding);
                };
                target.forEach(t => resolveParam(t));
                targetsFlat = [...targetSet];
            }
            if (!nested)
                return targetsFlat;
            targetsFlat.forEach(orphan => {
                const parent = (orphan.container.containedWithin !== undefined) ? targetsFlat.find(t => t.container === orphan.container.containedWithin) : undefined;
                if (parent !== undefined) {
                    orphan.parent = parent;
                    if (parent.children !== undefined)
                        parent.children.push(orphan);
                    else
                        parent.children = [orphan];
                }
            });
            return targetsFlat.filter(t => t.parent === undefined);
        }
        executeTransfer(log = StaticHelper_1.default.MaybeLog) {
            if (this._state & (ITransferHandler_1.THState.error | ITransferHandler_1.THState.complete))
                return this._state;
            if (this.sources.length === 0 || this.destinations.length === 0) {
                this._state = ITransferHandler_1.THState.complete;
                return this._state;
            }
            const itemMgr = this.island.items;
            const doTransfer = (src) => {
                const thesePairings = [];
                const allItemsMoved = [];
                this.destinations.forEach((dest, j) => {
                    const thisPairing = {
                        source: src,
                        destination: dest,
                        matches: TransferHandler.getMatches([src.container], [dest.container], this.typeFilter).map(m => ({ matched: m, had: -1, sent: -1 }))
                    };
                    if (StaticHelper_1.default.QS_INSTANCE.globalData.optionKeepContainers)
                        thisPairing.matches = thisPairing.matches.filter(m => m.matched.type === undefined ? true : !itemMgr.isInGroup(m.matched.type, IItem_1.ItemTypeGroup.Storage));
                    for (const origMatch of [...thisPairing.matches.filter(m => m.matched.group !== undefined)])
                        thisPairing.matches = thisPairing.matches.filter(m => !((m.matched.group === undefined) && (0, QSMatchGroups_1.canMatchActiveGroup)(m.matched.type, origMatch.matched.group)));
                    let badMatches = [];
                    log?.info(`executeTransfer: PAIRING:`
                        + `\n ${itemMgr.resolveContainer(thisPairing.destination.container)} from ${itemMgr.resolveContainer(thisPairing.source.container)}`
                        + `\n Found ${thisPairing.matches.length} matches.`);
                    thisPairing.matches.forEach((match, k) => {
                        const isGroupMatch = match.matched.group !== undefined;
                        const doesThisMatch = isGroupMatch
                            ? (it) => StaticHelper_1.default.QS_INSTANCE.activeMatchGroupsFlattened[match.matched.group].includes(it.type)
                                && (!StaticHelper_1.default.QS_INSTANCE.globalData.optionKeepContainers || !ItemManager_1.default.isInGroup(it.type, IItem_1.ItemTypeGroup.Storage))
                            : (it) => (it.type === match.matched.type);
                        const validItems = src.container.containedItems.filter((it) => doesThisMatch(it) && !it.isProtected() && !it.isEquipped()).sort((a, b) => a.weight - b.weight);
                        match.had = validItems.length;
                        log?.info(`executeTransfer: Match #${k} (${!isGroupMatch
                            ? `TYPE: '${Translation_1.default.nameOf(Dictionary_1.default.Item, match.matched.type, false).toString()}'`
                            : `GROUP: '${(0, StaticHelper_1.TLGroup)(match.matched.group).toString()}'`}) :: Had ${match.had}`);
                        const weightCap = itemMgr.getWeightCapacity(dest.container, true) ?? Infinity;
                        let update = true;
                        let remaining;
                        const itMoved = validItems.filter(it => {
                            if (update)
                                remaining = dest.type === IItem_1.ContainerReferenceType.Tile
                                    ? (this.island.isTileFull(dest.container) ? -Infinity : Infinity)
                                    : (weightCap - itemMgr.computeContainerWeight(dest.container));
                            update = false;
                            if (remaining > it.weight)
                                update = itemMgr.moveToContainer(this.player, it, dest.container);
                            return update;
                        }, this);
                        match.sent = itMoved.length;
                        allItemsMoved.push(...itMoved);
                        log?.info(`executeTransfer: Sent ${match.sent} :: Had ${match.had}`);
                        if (match.had > 0) {
                            if (match.sent === match.had)
                                this._anySuccess = true;
                            else if (match.sent > 0)
                                this._anyPartial = true;
                            else
                                this._anyFailed = true;
                        }
                        else {
                            badMatches.push(k);
                            if (match.had < 0)
                                log?.warn(`match.had ended up negative (${match.had}). This shouldn't happen wtf. Throwing out.`);
                        }
                    }, this);
                    if (badMatches.length) {
                        log?.info(`executeTransfer: Excising bad matches (${badMatches})`);
                        thisPairing.matches = thisPairing.matches.filter((_, k) => !badMatches.includes(k));
                    }
                    log?.info(`executeTransfer: Final matches count for pairing: ${thisPairing.matches.length}`);
                    thesePairings.push(thisPairing);
                }, this);
                this._executionResults.push(thesePairings);
                return allItemsMoved;
            };
            const handleSource = (src, dummy = false) => {
                if (this.bottomUp) {
                    src.children?.forEach(child => handleSource(child), this);
                    doTransfer(src);
                }
                else {
                    if (dummy) {
                        this._executionResults.push([]);
                        src.children?.forEach(child => handleSource(child, true));
                    }
                    else {
                        const itemsMoved = doTransfer(src);
                        src.children?.forEach(child => handleSource(child, itemsMoved.includes(child.container)), this);
                    }
                }
            };
            this.sources.forEach(s => handleSource(s), this);
            this.player.updateTablesAndWeight("Quick Stack");
            this._state = ITransferHandler_1.THState.complete;
            return this._state;
        }
        reportMessages(player = this.player, log = StaticHelper_1.default.MaybeLog) {
            if ((this._state & ITransferHandler_1.THState.error) || !(this._state & ITransferHandler_1.THState.complete))
                return false;
            const itemMgr = this.island.items;
            this._executionResults.forEach(pairList => {
                pairList.forEach(pair => {
                    if (pair.matches.length) {
                        log?.info(`ReportMessage:\nPAIRING: Length ${pair.matches.length} :: ${itemMgr.resolveContainer(pair.destination.container)}(${pair.destination.type}) from ${itemMgr.resolveContainer(pair.source.container)}`);
                        const str = {
                            source: "UNDEFINED",
                            destination: "UNDEFINED",
                            items: {
                                all: new Array,
                                some: new Array,
                                none: new Array
                            }
                        };
                        str.source = TLContainer(pair.source.container, pair.source.type, "from");
                        str.destination = TLContainer(pair.destination.container, pair.destination.type, "to");
                        let resultFlags = {};
                        pair.matches.forEach(match => {
                            if (match.sent === match.had) {
                                resultFlags.all = true;
                                str.items.all.push((0, StaticHelper_1.TLMain)("XOutOfY").addArgs({
                                    X: match.sent,
                                    name: match.matched.type !== undefined
                                        ? Translation_1.default.nameOf(Dictionary_1.default.Item, match.matched.type, match.sent, match.sent > 1 ? "indefinite" : false, true)
                                        : (0, StaticHelper_1.TLUtil)("concat").addArgs((0, StaticHelper_1.TLGroup)(match.matched.group)
                                            .inContext(ITranslation_1.TextContext.None)
                                            .passTo((0, StaticHelper_1.TLUtil)("colorMatchGroup")), (0, StaticHelper_1.TLGroup)("Item").passTo(Translation_1.default.reformatSingularNoun(match.sent, false)))
                                }));
                            }
                            else if (match.sent > 0) {
                                resultFlags.some = true;
                                str.items.all.push((0, StaticHelper_1.TLMain)("XOutOfY").addArgs({
                                    X: match.sent,
                                    Y: match.had,
                                    name: match.matched.type !== undefined
                                        ? Translation_1.default.nameOf(Dictionary_1.default.Item, match.matched.type, match.had, false, true)
                                        : (0, StaticHelper_1.TLUtil)("concat").addArgs((0, StaticHelper_1.TLGroup)(match.matched.group)
                                            .inContext(ITranslation_1.TextContext.None)
                                            .passTo((0, StaticHelper_1.TLUtil)("colorMatchGroup")), (0, StaticHelper_1.TLGroup)("Item").passTo(Translation_1.default.reformatSingularNoun(match.had, false)))
                                }));
                            }
                            else {
                                resultFlags.none = true;
                                str.items.none.push(match.matched.type !== undefined
                                    ? Translation_1.default.nameOf(Dictionary_1.default.Item, match.matched.type, match.had, match.had > 1 ? "indefinite" : false, true)
                                    : (0, StaticHelper_1.TLUtil)("concat").addArgs((0, StaticHelper_1.TLGroup)(match.matched.group)
                                        .inContext(ITranslation_1.TextContext.None)
                                        .passTo((0, StaticHelper_1.TLUtil)("colorMatchGroup")), (0, StaticHelper_1.TLGroup)("Item").passTo(Translation_1.default.reformatSingularNoun(999, false))));
                            }
                        });
                        log?.info(`ReportMessages: All(${str.items.all.length})  Some(${str.items.some.length})  None(${str.items.none.length})`);
                        player.asLocalPlayer?.messages.send(StaticHelper_1.default.QS_INSTANCE.messageStackResult, {
                            items: [...str.items.all, ...str.items.some, ...(resultFlags.some || resultFlags.all ? [] : str.items.none)],
                            source: str.source,
                            destination: str.destination,
                            failed: {
                                some: resultFlags.some || (resultFlags.all && resultFlags.none) ? true : undefined,
                                all: resultFlags.none && !resultFlags.all && !resultFlags.some ? true : undefined
                            },
                            prefix: (0, StaticHelper_1.TLUtil)("qsPrefixShort")
                        });
                    }
                }, this);
            }, this);
            if (!(this._anySuccess || this._anyPartial || this._anyFailed))
                player.asLocalPlayer?.messages.send(StaticHelper_1.default.QS_INSTANCE.messageNoMatch, { prefix: (0, StaticHelper_1.TLUtil)("qsPrefixShort").passTo(Translation_1.default.colorizeImportance("secondary")) });
            return true;
        }
        static MakeAndRun(player, source, dest, filterTypes, log, successFlag, suppress) {
            const thisfcn = `MakeAndRun: `;
            const t0 = performance.now();
            log?.info(`${thisfcn}Constructing TransferHandler.Timestamp ${t0} `);
            const handler = new TransferHandler(player, source, dest, {
                bottomUp: !StaticHelper_1.default.QS_INSTANCE.globalData.optionTopDown,
                ...(filterTypes ? { filter: filterTypes } : {})
            });
            if (handler.state & ITransferHandler_1.THState.error) {
                log?.error(`${thisfcn}Error flag in handler after construction.Code ${handler.state.toString(2)} `);
                if (successFlag)
                    successFlag.failed = true;
                return false;
            }
            if (log) {
                const crtKey = (crt) => IItem_1.ContainerReferenceType[crt];
                let str = `Handler initialized\n    Identified sources`;
                const wrapChildren = (c) => {
                    if (c.children)
                        return `${crtKey(c.type)} [${c.children.map(cc => wrapChildren(cc)).join(', ')}]`;
                    return `${crtKey(c.type)} `;
                };
                handler.sources.forEach(s => { str = str + `\n        ${wrapChildren(s)} `; });
                let destStr = [];
                Object.values(IItem_1.ContainerReferenceType).forEach(v => {
                    const destCount = handler.destinations.reduce((n, itt) => { return itt.type === v ? n + 1 : n; }, 0);
                    if (destCount)
                        destStr.push(`${destCount} ${crtKey(v)} `);
                });
                log.info(`${thisfcn}${str} \n    Identified destinations: \n        ${destStr.join(',  ')} `);
            }
            if (handler.executeTransfer(log) & ITransferHandler_1.THState.error) {
                log?.error(`${thisfcn}Error flag in handler during execution.Code ${handler.state.toString(2)} `);
                if (successFlag)
                    successFlag.failed = true;
                return false;
            }
            if (suppress?.report)
                log?.info(`${thisfcn}Message reporting suppressed`);
            else if (!handler.reportMessages(player, log))
                log?.warn(`TransferHandler.reportMessages() failed for some reason.`);
            const t1 = performance.now();
            log?.info(`${thisfcn} Complete.Timestamp ${t1}. Elapsed ${t1 - t0} `);
            if (handler.anySuccess || handler.anyPartial) {
                if (successFlag)
                    successFlag.failed = false;
                return true;
            }
            return false;
        }
    }
    exports.default = TransferHandler;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJhbnNmZXJIYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1RyYW5zZmVySGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBbUJvRyxDQUFDO0lBQ3hGLFFBQUEsaUJBQWlCLEdBQTJCLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFXLENBQUM7SUFDakYsUUFBQSxzQkFBc0IsR0FBMkIsRUFBRSxpQkFBaUIsRUFBRSxLQUFLLEVBQVcsQ0FBQztJQUdwRyxTQUFnQixlQUFlLENBQUMsTUFBYyxFQUFFLElBQVUsSUFBYSxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLEtBQUssSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUEzSiwwQ0FBMko7SUFDM0osU0FBZ0IsYUFBYSxDQUFDLElBQWMsSUFBYSxPQUFPLHFCQUFXLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxxQkFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUFySCxzQ0FBcUg7SUFDckgsU0FBZ0IsaUJBQWlCLENBQUMsTUFBYyxFQUFFLElBQVUsSUFBYSxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFBbE4sOENBQWtOO0lBQ2xOLFNBQWdCLGFBQWEsQ0FBQyxNQUFjLEVBQUUsSUFBVSxJQUFhLE9BQU8sSUFBSSxDQUFDLGVBQWUsRUFBRSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFBaEgsc0NBQWdIO0lBQ2hILFNBQWdCLGFBQWEsQ0FBQyxNQUFj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
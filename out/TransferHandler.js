define(["require", "exports", "game/item/IItem", "game/item/ItemManager", "game/tile/ITerrain", "language/Dictionary", "language/ITranslation", "language/Translation", "utilities/game/TileHelpers", "utilities/math/Direction", "./ITransferHandler", "./QSMatchGroups", "./StaticHelper"], function (require, exports, IItem_1, ItemManager_1, ITerrain_1, Dictionary_1, ITranslation_1, Translation_1, TileHelpers_1, Direction_1, ITransferHandler_1, QSMatchGroups_1, StaticHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TLContainer = exports.isSafeTile = exports.isValidTile = exports.validNearby = exports.itemTransferAllowed = exports.playerHeldContainers = exports.playerHasType = exports.playerHasItem = exports.isInHeldContainer = exports.isStorageType = exports.isHeldContainer = void 0;
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
    function validNearby(player, overrideForbidTiles = false, allowBlocked = true) {
        const adj = player.island.items.getAdjacentContainers(player, false);
        [...adj].entries().reverse().forEach(([idx, c]) => {
            if (player.island.items.getContainerReference(c, undefined).crt === IItem_1.ContainerReferenceType.Tile
                && !isValidTile(c, overrideForbidTiles, allowBlocked))
                adj.splice(idx, 1);
        });
        return adj;
    }
    exports.validNearby = validNearby;
    function isValidTile(tile, overrideForbidTiles = false, allowBlocked = true) {
        return (overrideForbidTiles || !StaticHelper_1.default.QS_INSTANCE.globalData.optionForbidTiles)
            && (allowBlocked || !tile.doodad?.description()?.blockMove)
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
            this.sources = this.resolveTargetting(source, true, true);
            this.destinations = this.resolveTargetting(dest);
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
        static groupifyParameters(P) {
            const pSet = new Set;
            P.forEach(param => {
                if (param.group)
                    pSet.add(param.group);
                else {
                    const grps = (0, QSMatchGroups_1.getActiveGroups)(param.type);
                    if (grps.length)
                        pSet.addFrom(grps);
                    else
                        pSet.add(param.type);
                }
            });
            return pSet;
        }
        static groupifyFlatParameters(P) {
            const pSet = new Set;
            P.forEach(param => {
                if (typeof param === "string")
                    pSet.add(param);
                else {
                    const grps = (0, QSMatchGroups_1.getActiveGroups)(param);
                    if (grps.length)
                        pSet.addFrom(grps);
                    else
                        pSet.add(param);
                }
            });
            return pSet;
        }
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
            return new Set([
                ...[...types].map(t => ({ type: t })),
                ...[...groups].map(g => ({ group: g }))
            ]);
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
                const fgrp = this.groupifyParameters(filter);
                AParams.retainWhere(param => fgrp.has(param));
            }
            AParams.retainWhere(param => BParams.has(param));
            if (StaticHelper_1.GLOBALCONFIG.log_info) {
                StaticHelper_1.default.MaybeLog.info(`GET MATCHES:: REMAINING::`);
                console.log(AParams);
            }
            return [...AParams].map(p => (typeof p === "string") ? { group: p } : { type: p });
        }
        static hasMatch(A, B, filter = []) {
            const AParams = TransferHandler.setOfFlatParams(A);
            const BParams = TransferHandler.setOfFlatParams(B);
            if (filter.length) {
                const fgrouped = this.groupifyParameters(filter);
                return [...AParams].some(param => fgrouped.has(param) && BParams.has(param));
            }
            return [...AParams].some(param => BParams.has(param));
        }
        static canMatch(X, params) {
            const xFlat = this.setOfFlatParams(X);
            return [...this.groupifyParameters(params)].some(p => xFlat.has(p));
        }
        static canFitAny(src, dest, player, filter = []) {
            if (!this.hasMatch(src, dest, filter))
                return false;
            const srcItems = src.flatMap(s => s.containedItems).filter(i => !i.isProtected() && !i.isEquipped());
            const srcParams = TransferHandler.setOfParams([{ containedItems: srcItems }]);
            if (StaticHelper_1.default.QS_INSTANCE.globalData.optionKeepContainers)
                srcParams.retainWhere(t => t.type === undefined ? true : !ItemManager_1.default.isInGroup(t.type, IItem_1.ItemTypeGroup.Storage));
            if (filter.length) {
                const fgrp = this.groupifyParameters(filter);
                srcParams.retainWhere(p => fgrp.has(p.type ?? p.group));
            }
            const srcParamsFlat = [...srcParams].map(p => p.group ?? p.type);
            for (const d of dest) {
                const remaining = (player.island.items.getWeightCapacity(d, undefined) ?? (player.island.isTileFull(d) ? 0 : Infinity)) - player.island.items.computeContainerWeight(d);
                const matchParams = TransferHandler.setOfParams([d]);
                matchParams.retainWhere(p => srcParamsFlat.includes(p.group ?? p.type));
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
        resolveTargetting(target, nested = false, overrideForbidTiles = false, allowBlockedTiles = true) {
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
                    ? validNearby(this.player, overrideForbidTiles)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJhbnNmZXJIYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1RyYW5zZmVySGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBc0JBLFNBQWdCLGVBQWUsQ0FBQyxNQUFjLEVBQUUsSUFBVSxJQUFhLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sS0FBSyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQTNKLDBDQUEySjtJQUMzSixTQUFnQixhQUFhLENBQUMsSUFBYyxJQUFhLE9BQU8scUJBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLHFCQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQXJILHNDQUFxSDtJQUNySCxTQUFnQixpQkFBaUIsQ0FBQyxNQUFjLEVBQUUsSUFBVSxJQUFhLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUFsTiw4Q0FBa047SUFDbE4sU0FBZ0IsYUFBYSxDQUFDLE1BQWMsRUFBRSxJQUFVLElBQWEsT0FBTyxJQUFJLENBQUMsZUFBZSxFQUFFLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztJQUFoSCxzQ0FBZ0g7SUFDaEgsU0FBZ0IsYUFBYSxDQUFDLE1BQWMsRUFBRSxJQUFjO1FBQ3hELE1BQU0sTUFBTSxHQUFHLElBQUEsK0JBQWUsRUFBQyxJQUFJLENBQUMsQ0FBQztRQUNyQyxPQUFPLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLEdBQUcsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDbkssQ0FBQztJQUhELHNDQUdDO0lBQ0QsU0FBZ0Isb0JBQW9CLENBQUMsTUFBYyxFQUFFLElBQWlCO1FBQ2xFLE9BQU8sQ0FBQyxJQUFJLEtBQUssU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUN2QyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztZQUM5RCxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztpQkFDekQsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ2pELE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQU0sQ0FBVSxFQUFFLElBQUksQ0FBQyxDQUFpQixDQUFDO0lBQ2xGLENBQUM7SUFORCxvREFNQztJQUlELFNBQWdCLG1CQUFtQixDQUFDLENBQWdCLElBQXlCLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUF6SyxrREFBeUs7SUFDekssU0FBUyxvQkFBb0IsQ0FBQyxJQUFVO1FBQ3BDLElBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUFFLE9BQU8sS0FBSyxDQUFDO1FBQ3BDLElBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7WUFBRSxPQUFPLEtBQUssQ0FBQztRQUN2QyxJQUFHLHNCQUFZLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsSUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUFFLE9BQU8sS0FBSyxDQUFDO1FBQ3RHLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFBQSxDQUFDO0lBR0YsU0FBZ0IsV0FBVyxDQUFDLE1BQWMsRUFBRSxzQkFBK0IsS0FBSyxFQUFFLGVBQXdCLElBQUk7UUFDMUcsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3JFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQzlDLElBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQUcsS0FBSyw4QkFBc0IsQ0FBQyxJQUFJO21CQUN2RixDQUFDLFdBQVcsQ0FBQyxDQUFVLEVBQUUsbUJBQW1CLEVBQUUsWUFBWSxDQUFDO2dCQUNoRSxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN6QixDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQVJELGtDQVFDO0lBRUQsU0FBZ0IsV0FBVyxDQUFDLElBQVcsRUFBRSxzQkFBK0IsS0FBSyxFQUFFLGVBQXdCLElBQUk7UUFDdkcsT0FBTyxDQUFDLG1CQUFtQixJQUFJLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDO2VBQy9FLENBQUMsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxTQUFTLENBQUM7ZUFDeEQsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzNCLENBQUM7SUFKRCxrQ0FJQztJQUVELFNBQWdCLFVBQVUsQ0FBQyxJQUFXO1FBQ2xDLE9BQU8sQ0FBQyxxQkFBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxzQkFBVyxDQUFDLElBQUksQ0FBQztlQUNoRCxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUUsWUFBWSxDQUFDLENBQUM7ZUFDeEQsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUpELGdDQUlDO0lBRUQsU0FBZ0IsV0FBVyxDQUFDLENBQWEsRUFBRSxHQUEyQixFQUFFLE1BQXFCO1FBQ3pGLE1BQU0sS0FBSyxHQUFHLHNCQUFZLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4RixRQUFPLEdBQUcsRUFBRTtZQUNSLEtBQUssOEJBQXNCLENBQUMsZUFBZTtnQkFDdkMsT0FBTyxJQUFBLHFCQUFNLEVBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFBLHFCQUFNLEVBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUVqRSxLQUFLLDhCQUFzQixDQUFDLElBQUk7Z0JBQzVCLE9BQU8sSUFBQSxxQkFBTSxFQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUUsQ0FBVSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFFekcsS0FBSyw4QkFBc0IsQ0FBQyxNQUFNO2dCQUM5QixJQUFHLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssTUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLEtBQUsscUJBQVMsQ0FBQyxJQUFJO29CQUNyRSxPQUFPLElBQUEscUJBQU0sRUFBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFFLENBQVksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7O29CQUU1RSxPQUFPLElBQUEscUJBQU0sRUFBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUMvQixJQUFBLHFCQUFNLEVBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUNuQixDQUFZLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsRUFDdEMsSUFBQSxxQkFBTSxFQUFDLGVBQWUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxxQkFBVyxDQUFDLEdBQUcsQ0FBQyxvQkFBVSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFekcsS0FBSyw4QkFBc0IsQ0FBQyxJQUFJO2dCQUM1QixJQUFHLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssTUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLEtBQUsscUJBQVMsQ0FBQyxJQUFJO29CQUFFLE9BQU8sSUFBQSxxQkFBTSxFQUFDLEdBQUcsTUFBTSxNQUFNLENBQUMsQ0FBQTs7b0JBQ3BHLE9BQU8sSUFBQSxxQkFBTSxFQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FDaEMsSUFBQSxxQkFBTSxFQUFDLEdBQUcsTUFBTSxNQUFNLENBQUMsRUFDdkIsSUFBQSxxQkFBTSxFQUFDLGVBQWUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxxQkFBVyxDQUFDLEdBQUcsQ0FBQyxvQkFBVSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWhHO2dCQUNJLE9BQU8sSUFBQSxxQkFBTSxFQUFDLEdBQUcsTUFBTSxTQUFTLENBQUMsQ0FBQztTQUN6QztJQUNMLENBQUM7SUEzQkQsa0NBMkJDO0lBUUQsTUFBcUIsZUFBZTtRQTBpQmhDLFlBQ0ksUUFBZ0IsRUFDaEIsU0FBNkMsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUM3RCxPQUEyQyxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQy9FLE1BR0M7WUFyaUJHLGVBQVUsR0FBWSxLQUFLLENBQUM7WUFDNUIsZ0JBQVcsR0FBWSxLQUFLLENBQUM7WUFDN0IsZ0JBQVcsR0FBWSxLQUFLLENBQUM7WUFxaUJqQyxJQUFJLENBQUMsTUFBTSxHQUFHLDBCQUFPLENBQUMsSUFBSSxDQUFDO1lBQzNCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxFQUFFLENBQUM7WUFFNUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7WUFDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQzlCLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7WUFDdEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFHcEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMxRCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUdqRCxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDckIsSUFBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDOUIsSUFBSSxDQUFDLE1BQU0sSUFBSSwwQkFBTyxDQUFDLFNBQVMsQ0FBQztvQkFDakMsT0FBTztpQkFDVjtZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQXZqQkQsSUFBVyxLQUFLLEtBQWMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNuRCxJQUFXLGdCQUFnQixLQUEyQixPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7UUFDdEYsSUFBVyxVQUFVLEtBQWMsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUM3RCxJQUFXLFVBQVUsS0FBYyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQzdELElBQVcsU0FBUyxLQUFjLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFTcEQsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQW1DO1lBQ2hFLE1BQU0sSUFBSSxHQUFHLElBQUksR0FBbUIsQ0FBQztZQUNyQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNkLElBQUcsS0FBSyxDQUFDLEtBQUs7b0JBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7cUJBQ2pDO29CQUNELE1BQU0sSUFBSSxHQUFHLElBQUEsK0JBQWUsRUFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3pDLElBQUcsSUFBSSxDQUFDLE1BQU07d0JBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7d0JBQzlCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUM3QjtZQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUNNLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxDQUF5QztZQUMxRSxNQUFNLElBQUksR0FBRyxJQUFJLEdBQW1CLENBQUM7WUFDckMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDZCxJQUFHLE9BQU8sS0FBSyxLQUFLLFFBQVE7b0JBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztxQkFDekM7b0JBQ0QsTUFBTSxJQUFJLEdBQUcsSUFBQSwrQkFBZSxFQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNwQyxJQUFHLElBQUksQ0FBQyxNQUFNO3dCQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7O3dCQUM5QixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUN4QjtZQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQVVNLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBc0I7WUFDM0MsT0FBTyxJQUFJLEdBQUcsQ0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUYsQ0FBQztRQU9NLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFpQztZQUM3RCxJQUFHLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsb0JBQW9CO2dCQUFFLE9BQU8sSUFBSSxHQUFHLEVBQXVCLENBQUM7WUFDekYsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQXNCLHNCQUFZLENBQUMsV0FBVyxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFDOUYsTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQVksQ0FBQyxHQUFHLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxxQkFBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsRyxRQUFRLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUN2QixLQUFJLE1BQU0sU0FBUyxJQUFJLGlDQUFpQixDQUFDLEdBQUcsQ0FBQztvQkFBRSxJQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDO3dCQUFFLE9BQU8sSUFBSSxDQUFDO2dCQUNuRixPQUFPLEtBQUssQ0FBQztZQUNqQixDQUFDLENBQUMsQ0FBQztZQUNILE9BQU8sUUFBUSxDQUFDO1FBQ3BCLENBQUM7UUFPTSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQXNCO1lBQzVDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRzdDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFFMUgsT0FBTyxJQUFJLEdBQUcsQ0FBYztnQkFDeEIsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNyQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDMUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQU9NLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBc0I7WUFDaEQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFN0MsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUNmLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FDbEIsc0JBQVksQ0FBQyxXQUFXLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFPdkYsT0FBTyxJQUFJLEdBQUcsQ0FBaUIsQ0FBQyxHQUFHLEtBQUssRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDMUQsQ0FBQztRQVNNLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBc0IsRUFBRSxDQUFzQixFQUFFLFNBQXdCLEVBQUU7WUFJL0YsTUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuRCxNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25ELElBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRTtnQkFDZCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzdDLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7YUFDakQ7WUFDRCxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2pELElBQUcsMkJBQVksQ0FBQyxRQUFRLEVBQUU7Z0JBQ3RCLHNCQUFZLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO2dCQUN4RCxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ3hCO1lBRUQsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdkYsQ0FBQztRQVNNLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBc0IsRUFBRSxDQUFzQixFQUFFLFNBQXdCLEVBQUU7WUFHN0YsTUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuRCxNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25ELElBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRTtnQkFDZCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ2pELE9BQU8sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2FBQ2hGO1lBQ0QsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzFELENBQUM7UUFRTSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQXNCLEVBQUUsTUFBcUI7WUFDaEUsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEUsQ0FBQztRQUVNLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBd0IsRUFBRSxJQUFrQixFQUFFLE1BQWMsRUFBRSxTQUF3QixFQUFFO1lBQzVHLElBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDO2dCQUFFLE9BQU8sS0FBSyxDQUFDO1lBQ25ELE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztZQUNyRyxNQUFNLFNBQVMsR0FBRyxlQUFlLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBSTlFLElBQUcsc0JBQVksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLG9CQUFvQjtnQkFDdkQsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMscUJBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxxQkFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFFcEgsSUFBRyxNQUFNLENBQUMsTUFBTSxFQUFFO2dCQUNkLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDN0MsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzthQUMzRDtZQUNELE1BQU0sYUFBYSxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUdqRSxLQUFJLE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRTtnQkFDakIsTUFBTSxTQUFTLEdBQUcsQ0FDZCxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FDL0csR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEQsTUFBTSxXQUFXLEdBQUcsZUFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JELFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3hFLElBQUcsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUM3QixTQUFTLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUNsQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssU0FBUztvQkFDckIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLElBQUk7b0JBQ3hCLENBQUMsQ0FBQyxDQUFDLElBQUEsK0JBQWUsRUFBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7MkJBQzFDLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLG9CQUFvQjs0QkFDeEQsQ0FBQyxDQUFDLENBQUMscUJBQVcsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxxQkFBYSxDQUFDLE9BQU8sQ0FBQzs0QkFDeEQsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQ25CLElBQUksRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztvQkFDcEQsT0FBTyxJQUFJLENBQUM7YUFDakI7WUFDRCxPQUFPLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBZU8saUJBQWlCLENBQUMsTUFBMEMsRUFBRSxTQUFrQixLQUFLLEVBQUUsc0JBQStCLEtBQUssRUFBRSxvQkFBNkIsSUFBSTtZQUVsSyxJQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtnQkFBRSxJQUFJLENBQUMsTUFBTSxJQUFJLDBCQUFPLENBQUMsWUFBWSxDQUFDO2dCQUFDLE9BQU8sRUFBRSxDQUFDO2FBQUU7WUFFdEUsSUFBSSxXQUE4QixDQUFDO1lBRW5DLElBQUcsZ0JBQWdCLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUU5QixXQUFXLEdBQUcsQ0FBQyxHQUFJLElBQUksR0FBRyxDQUFrQixDQUFDLEdBQUksTUFBdUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUU3SztpQkFBTTtnQkFDSCxNQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBbUIsQ0FBQztnQkFHN0MsTUFBTSxNQUFNLEdBQXVCLE1BQThCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFJLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDekcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLG1CQUFtQixDQUFDO3lCQUMxQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7b0JBQ2xHLENBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBSVQsTUFBTSxZQUFZLEdBQUcsQ0FBQyxDQUFvQixFQUFFLEVBQUU7b0JBQzFDLElBQUksTUFBeUIsQ0FBQztvQkFHOUIsSUFBRyxNQUFNLElBQUksQ0FBQzt3QkFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsOEJBQXNCLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQzt5QkFDekcsSUFBRyxPQUFPLElBQUksQ0FBQzt3QkFBRSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssOEJBQXNCLENBQUMsSUFBSSxDQUFDLENBQUM7eUJBQzNGLElBQUcsU0FBUyxJQUFJLENBQUM7d0JBQUUsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLDhCQUFzQixDQUFDLE1BQU0sQ0FBQyxDQUFDOzt3QkFDL0YsTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBR3ZLLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBRy9DLElBQUcsV0FBVyxJQUFJLENBQUM7d0JBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUNwQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FDckUsWUFBWSxDQUFDLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBRS9ELFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQztnQkFDN0IsQ0FBQyxDQUFDO2dCQUdGLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBc0IsQ0FBQyxDQUFDLENBQUM7Z0JBQzFELFdBQVcsR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUM7YUFDaEM7WUFFRCxJQUFHLENBQUMsTUFBTTtnQkFBRSxPQUFPLFdBQVcsQ0FBQztZQUsvQixXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUN6QixNQUFNLE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsZUFBZSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsS0FBSyxNQUFNLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7Z0JBQ3RKLElBQUcsTUFBTSxLQUFLLFNBQVMsRUFBRTtvQkFDckIsTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7b0JBQ3ZCLElBQUcsTUFBTSxDQUFDLFFBQVEsS0FBSyxTQUFTO3dCQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOzt3QkFDMUQsTUFBTSxDQUFDLFFBQVEsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2lCQUNuQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBR0gsT0FBTyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxTQUFTLENBQUMsQ0FBQztRQUMzRCxDQUFDO1FBT08sZUFBZSxDQUFDLE1BQXVCLHNCQUFZLENBQUMsUUFBUTtZQUVoRSxJQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQywwQkFBTyxDQUFDLEtBQUssR0FBRywwQkFBTyxDQUFDLFFBQVEsQ0FBQztnQkFBRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7WUFHeEUsSUFBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsMEJBQU8sQ0FBQyxRQUFRLENBQUM7Z0JBQUMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO2FBQUU7WUFFdkgsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFHbEMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxHQUFvQixFQUFVLEVBQUU7Z0JBRWhELE1BQU0sYUFBYSxHQUF1QixFQUFFLENBQUM7Z0JBQzdDLE1BQU0sYUFBYSxHQUFXLEVBQUUsQ0FBQztnQkFHakMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBRWxDLE1BQU0sV0FBVyxHQUFxQjt3QkFDbEMsTUFBTSxFQUFFLEdBQUc7d0JBQ1gsV0FBVyxFQUFFLElBQUk7d0JBQ2pCLE9BQU8sRUFBRSxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztxQkFDeEksQ0FBQztvQkFJRixJQUFHLHNCQUFZLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxvQkFBb0I7d0JBQ3ZELFdBQVcsQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLHFCQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFHM0osS0FBSSxNQUFNLFNBQVMsSUFBSSxDQUFDLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQzt3QkFDdEYsV0FBVyxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUNqRCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsSUFBSSxJQUFBLG1DQUFtQixFQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO29CQUs1RyxJQUFJLFVBQVUsR0FBYSxFQUFFLENBQUM7b0JBRTlCLEdBQUcsRUFBRSxJQUFJLENBQUMsMkJBQTJCOzBCQUMvQixNQUFNLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxTQUFTLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFOzBCQUNsSSxZQUFZLFdBQVcsQ0FBQyxPQUFPLENBQUMsTUFBTSxXQUFXLENBQUMsQ0FBQztvQkFHekQsV0FBVyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQ3JDLE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQzt3QkFDdkQsTUFBTSxhQUFhLEdBQUcsWUFBWTs0QkFDOUIsQ0FBQyxDQUFDLENBQUMsRUFBUSxFQUFFLEVBQUUsQ0FBQyxzQkFBWSxDQUFDLFdBQVcsQ0FBQywwQkFBMEIsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQU0sQ0FBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO21DQUNyRyxDQUFDLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLG9CQUFvQixJQUFJLENBQUMscUJBQVcsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxxQkFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDOzRCQUM1SCxDQUFDLENBQUMsQ0FBQyxFQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUdyRCxNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUUvSixLQUFLLENBQUMsR0FBRyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUM7d0JBRTlCLEdBQUcsRUFBRSxJQUFJLENBQUMsMkJBQTJCLENBQUMsS0FBSyxDQUFDLFlBQVk7NEJBQ3BELENBQUMsQ0FBQyxVQUFVLHFCQUFXLENBQUMsTUFBTSxDQUFDLG9CQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxHQUFHOzRCQUN6RixDQUFDLENBQUMsV0FBVyxJQUFBLHNCQUFPLEVBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFNLENBQUMsQ0FBQyxRQUFRLEVBQUUsR0FDckQsWUFBWSxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQzt3QkFHN0IsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksUUFBUSxDQUFDO3dCQUM5RSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7d0JBQ2xCLElBQUksU0FBaUIsQ0FBQzt3QkFHdEIsTUFBTSxPQUFPLEdBQVcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTs0QkFFM0MsSUFBRyxNQUFNO2dDQUFFLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxLQUFLLDhCQUFzQixDQUFDLElBQUk7b0NBQzVELENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7b0NBQzFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7NEJBQ25FLE1BQU0sR0FBRyxLQUFLLENBQUM7NEJBRWYsSUFBRyxTQUFTLEdBQUcsRUFBRSxDQUFDLE1BQU07Z0NBQUUsTUFBTSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDOzRCQUM1RixPQUFPLE1BQU0sQ0FBQzt3QkFDbEIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO3dCQUdULEtBQUssQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQzt3QkFDNUIsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDO3dCQUUvQixHQUFHLEVBQUUsSUFBSSxDQUFDLHlCQUF5QixLQUFLLENBQUMsSUFBSSxXQUFXLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO3dCQUVyRSxJQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFOzRCQUNkLElBQUcsS0FBSyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsR0FBRztnQ0FBRSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztpQ0FDaEQsSUFBRyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUM7Z0NBQUUsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7O2dDQUMzQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQzt5QkFDL0I7NkJBQU07NEJBQ0gsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDbkIsSUFBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUM7Z0NBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxnQ0FBZ0MsS0FBSyxDQUFDLEdBQUcsNkNBQTZDLENBQUMsQ0FBQzt5QkFDdkg7b0JBRUwsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUdULElBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRTt3QkFDbEIsR0FBRyxFQUFFLElBQUksQ0FBQywwQ0FBMEMsVUFBVSxHQUFHLENBQUMsQ0FBQzt3QkFDbkUsV0FBVyxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUN2RjtvQkFFRCxHQUFHLEVBQUUsSUFBSSxDQUFDLHFEQUFxRCxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7b0JBQzdGLGFBQWEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBRXBDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDVCxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUMzQyxPQUFPLGFBQWEsQ0FBQztZQUN6QixDQUFDLENBQUM7WUFJRixNQUFNLFlBQVksR0FBRyxDQUFDLEdBQW9CLEVBQUUsUUFBaUIsS0FBSyxFQUFFLEVBQUU7Z0JBQ2xFLElBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRTtvQkFDZCxHQUFHLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDMUQsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUNuQjtxQkFBTTtvQkFLSCxJQUFHLEtBQUssRUFBRTt3QkFDTixJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUNoQyxHQUFHLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztxQkFDN0Q7eUJBQU07d0JBQ0gsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUNuQyxHQUFHLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsU0FBaUIsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7cUJBQzNHO2lCQUNKO1lBQ0wsQ0FBQyxDQUFDO1lBR0YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFakQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUVqRCxJQUFJLENBQUMsTUFBTSxHQUFHLDBCQUFPLENBQUMsUUFBUSxDQUFDO1lBQy9CLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN2QixDQUFDO1FBUU8sY0FBYyxDQUFDLFNBQWlCLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBdUIsc0JBQVksQ0FBQyxRQUFRO1lBRTdGLElBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLDBCQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsMEJBQU8sQ0FBQyxRQUFRLENBQUM7Z0JBQUUsT0FBTyxLQUFLLENBQUM7WUFFcEYsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFHbEMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDdEMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDcEIsSUFBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTt3QkFDcEIsR0FBRyxFQUFFLElBQUksQ0FBQyxtQ0FBbUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLE9BQU8sT0FBTyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLFVBQVUsT0FBTyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUdqTixNQUFNLEdBQUcsR0FBOEg7NEJBQ25JLE1BQU0sRUFBRSxXQUFXOzRCQUNuQixXQUFXLEVBQUUsV0FBVzs0QkFDeEIsS0FBSyxFQUFFO2dDQUNILEdBQUcsRUFBRSxJQUFJLEtBQXNCO2dDQUMvQixJQUFJLEVBQUUsSUFBSSxLQUFzQjtnQ0FDaEMsSUFBSSxFQUFFLElBQUksS0FBc0I7NkJBQ25DO3lCQUNKLENBQUM7d0JBR0YsR0FBRyxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7d0JBQzFFLEdBQUcsQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO3dCQUd2RixJQUFJLFdBQVcsR0FBK0MsRUFBRSxDQUFDO3dCQUVqRSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTs0QkFDekIsSUFBRyxLQUFLLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxHQUFHLEVBQUU7Z0NBQ3pCLFdBQVcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO2dDQUN2QixHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBQSxxQkFBTSxFQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztvQ0FDekMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxJQUFJO29DQUNiLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxTQUFTO3dDQUNsQyxDQUFDLENBQUMscUJBQVcsQ0FBQyxNQUFNLENBQUMsb0JBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDO3dDQUNsSCxDQUFDLENBQUMsSUFBQSxxQkFBTSxFQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FDdEIsSUFBQSxzQkFBTyxFQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDOzZDQUN2QixTQUFTLENBQUMsMEJBQVcsQ0FBQyxJQUFJLENBQUM7NkNBQzNCLE1BQU0sQ0FBQyxJQUFBLHFCQUFNLEVBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUN0QyxJQUFBLHNCQUFPLEVBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLHFCQUFXLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO2lDQUN2RixDQUFDLENBQUMsQ0FBQzs2QkFDUDtpQ0FBTSxJQUFHLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFO2dDQUN0QixXQUFXLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztnQ0FDeEIsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUEscUJBQU0sRUFBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUM7b0NBQ3pDLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSTtvQ0FDYixDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUc7b0NBQ1osSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLFNBQVM7d0NBQ2xDLENBQUMsQ0FBQyxxQkFBVyxDQUFDLE1BQU0sQ0FBQyxvQkFBVSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUM7d0NBQ2pGLENBQUMsQ0FBQyxJQUFBLHFCQUFNLEVBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUN0QixJQUFBLHNCQUFPLEVBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7NkNBQ3ZCLFNBQVMsQ0FBQywwQkFBVyxDQUFDLElBQUksQ0FBQzs2Q0FDM0IsTUFBTSxDQUFDLElBQUEscUJBQU0sRUFBQyxpQkFBaUIsQ0FBQyxDQUFDLEVBQ3RDLElBQUEsc0JBQU8sRUFBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMscUJBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7aUNBQ3RGLENBQUMsQ0FBQyxDQUFDOzZCQUNQO2lDQUFNO2dDQUNILFdBQVcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO2dDQUN4QixHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssU0FBUztvQ0FDaEQsQ0FBQyxDQUFDLHFCQUFXLENBQUMsTUFBTSxDQUFDLG9CQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQztvQ0FDaEgsQ0FBQyxDQUFDLElBQUEscUJBQU0sRUFBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQ3RCLElBQUEsc0JBQU8sRUFBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQzt5Q0FDdkIsU0FBUyxDQUFDLDBCQUFXLENBQUMsSUFBSSxDQUFDO3lDQUMzQixNQUFNLENBQUMsSUFBQSxxQkFBTSxFQUFDLGlCQUFpQixDQUFDLENBQUMsRUFDdEMsSUFBQSxzQkFBTyxFQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxxQkFBVyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQzVFLENBQUM7NkJBQ0w7d0JBQ0wsQ0FBQyxDQUFDLENBQUM7d0JBRUgsR0FBRyxFQUFFLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxXQUFXLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sV0FBVyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO3dCQWMxSCxNQUFNLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLEVBQUU7NEJBQzdFLEtBQUssRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksSUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBQzVHLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTTs0QkFDbEIsV0FBVyxFQUFFLEdBQUcsQ0FBQyxXQUFXOzRCQUM1QixNQUFNLEVBQUU7Z0NBQ0osSUFBSSxFQUFFLFdBQVcsQ0FBQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTO2dDQUNsRixHQUFHLEVBQUUsV0FBVyxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVM7NkJBQ3BGOzRCQUNELE1BQU0sRUFBRSxJQUFBLHFCQUFNLEVBQUMsZUFBZSxDQUFDO3lCQUNsQyxDQUFDLENBQUM7cUJBRU47Z0JBQ0wsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2IsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBR1QsSUFBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUM7Z0JBQ3pELE1BQU0sQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxjQUFjLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBQSxxQkFBTSxFQUFDLGVBQWUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxxQkFBVyxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRTFLLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUEwQ00sTUFBTSxDQUFDLFVBQVUsQ0FDcEIsTUFBYyxFQUNkLE1BQTBDLEVBQzFDLElBQXdDLEVBQ3hDLFdBQXVDLEVBQ3ZDLEdBQVMsRUFDVCxXQUFrQyxFQUNsQyxRQUEyQztZQUUzQyxNQUFNLE9BQU8sR0FBRyxjQUF1QixDQUFDO1lBQ3hDLE1BQU0sRUFBRSxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUM3QixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsT0FBTywwQ0FBMEMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUVyRSxNQUFNLE9BQU8sR0FBRyxJQUFJLGVBQWUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtnQkFDdEQsUUFBUSxFQUFFLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLGFBQWE7Z0JBQzVELEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7YUFDbEQsQ0FBQyxDQUFDO1lBRUgsSUFBRyxPQUFPLENBQUMsS0FBSyxHQUFHLDBCQUFPLENBQUMsS0FBSyxFQUFFO2dCQUM5QixHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUcsT0FBTyxpREFBaUQsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNwRyxJQUFHLFdBQVc7b0JBQUUsV0FBVyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7Z0JBQzFDLE9BQU8sS0FBSyxDQUFDO2FBQ2hCO1lBRUQsSUFBRyxHQUFHLEVBQUU7Z0JBQ0osTUFBTSxNQUFNLEdBQUcsQ0FBQyxHQUEyQixFQUFVLEVBQUUsQ0FBQyw4QkFBc0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDcEYsSUFBSSxHQUFHLEdBQUcsNkNBQTZDLENBQUM7Z0JBRXhELE1BQU0sWUFBWSxHQUFHLENBQUMsQ0FBa0IsRUFBVSxFQUFFO29CQUNoRCxJQUFHLENBQUMsQ0FBQyxRQUFRO3dCQUFFLE9BQU8sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7b0JBQ2pHLE9BQU8sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7Z0JBQ2hDLENBQUMsQ0FBQztnQkFFRixPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsYUFBYSxZQUFZLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUUvRSxJQUFJLE9BQU8sR0FBYSxFQUFFLENBQUM7Z0JBQzNCLE1BQU0sQ0FBQyxNQUFNLENBQUMsOEJBQXNCLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQzlDLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLEdBQUcsT0FBTyxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNyRyxJQUFHLFNBQVM7d0JBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLFNBQVMsSUFBSSxNQUFNLENBQUMsQ0FBMkIsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDdkYsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLE9BQU8sR0FBRyxHQUFHLDZDQUE2QyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNqRztZQUdELElBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsR0FBRywwQkFBTyxDQUFDLEtBQUssRUFBRTtnQkFDN0MsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHLE9BQU8sK0NBQStDLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbEcsSUFBRyxXQUFXO29CQUFFLFdBQVcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO2dCQUMxQyxPQUFPLEtBQUssQ0FBQzthQUNoQjtZQUdELElBQUcsUUFBUSxFQUFFLE1BQU07Z0JBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLE9BQU8sOEJBQThCLENBQUMsQ0FBQztpQkFDcEUsSUFBRyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQztnQkFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLDBEQUEwRCxDQUFDLENBQUM7WUFFcEgsTUFBTSxFQUFFLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQzdCLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxPQUFPLHVCQUF1QixFQUFFLGFBQWEsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFFdEUsSUFBRyxPQUFPLENBQUMsVUFBVSxJQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUU7Z0JBQ3pDLElBQUcsV0FBVztvQkFBRSxXQUFXLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztnQkFDM0MsT0FBTyxJQUFJLENBQUM7YUFDZjtZQUNELE9BQU8sS0FBSyxDQUFDO1FBQ2pCLENBQUM7S0FDSjtJQXpvQkQsa0NBeW9CQyJ9
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
            if (player.island.items.getContainerReference(c, undefined).crt === IItem_1.ContainerReferenceType.Tile && !isValidTile(c, overrideForbidTiles, allowBlocked))
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
                return StaticHelper_1.default.TLMain(`${toFrom}X`).addArgs(StaticHelper_1.default.TLMain("yourInventory"));
            case IItem_1.ContainerReferenceType.Item:
                return StaticHelper_1.default.TLMain(`${toFrom}X`).addArgs(c.getName("indefinite", 1, false, false, true, false));
            case IItem_1.ContainerReferenceType.Doodad:
                if (!cache || cache.iswhat === "Item" || cache.relation === Direction_1.Direction.None)
                    return StaticHelper_1.default.TLMain(`${toFrom}X`).addArgs(c.getName("indefinite", 1));
                else
                    return StaticHelper_1.default.TLMain(`${toFrom}X`).addArgs(StaticHelper_1.default.TLMain("concat").addArgs(c.getName("indefinite", 1), StaticHelper_1.default.TLMain("parenthetical").addArgs(Translation_1.default.get(Dictionary_1.default.Direction, cache.relation))));
            case IItem_1.ContainerReferenceType.Tile:
                if (!cache || cache.iswhat === "Item" || cache.relation === Direction_1.Direction.None)
                    return StaticHelper_1.default.TLMain(`${toFrom}Tile`);
                else
                    return StaticHelper_1.default.TLMain("concat").addArgs(StaticHelper_1.default.TLMain(`${toFrom}Tile`), StaticHelper_1.default.TLMain("parenthetical").addArgs(Translation_1.default.get(Dictionary_1.default.Direction, cache.relation)));
            default:
                return StaticHelper_1.default.TLMain(`${toFrom}Unknown`);
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
                            : `GROUP: '${StaticHelper_1.default.TLGroup(match.matched.group).toString()}'`}) :: Had ${match.had}`);
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
                                str.items.all.push(StaticHelper_1.default.TLMain("XOutOfY").addArgs({
                                    X: match.sent,
                                    name: match.matched.type !== undefined
                                        ? Translation_1.default.nameOf(Dictionary_1.default.Item, match.matched.type, match.sent, match.sent > 1 ? "indefinite" : false, true)
                                        : StaticHelper_1.default.TLMain("concat").addArgs(StaticHelper_1.default.TLGroup(match.matched.group)
                                            .inContext(ITranslation_1.TextContext.None)
                                            .passTo(StaticHelper_1.default.TLMain("colorMatchGroup")), StaticHelper_1.default.TLGroup("Item").passTo(Translation_1.default.reformatSingularNoun(match.sent, false)))
                                }));
                            }
                            else if (match.sent > 0) {
                                resultFlags.some = true;
                                str.items.all.push(StaticHelper_1.default.TLMain("XOutOfY").addArgs({
                                    X: match.sent,
                                    Y: match.had,
                                    name: match.matched.type !== undefined
                                        ? Translation_1.default.nameOf(Dictionary_1.default.Item, match.matched.type, match.had, false, true)
                                        : StaticHelper_1.default.TLMain("concat").addArgs(StaticHelper_1.default.TLGroup(match.matched.group)
                                            .inContext(ITranslation_1.TextContext.None)
                                            .passTo(StaticHelper_1.default.TLMain("colorMatchGroup")), StaticHelper_1.default.TLGroup("Item").passTo(Translation_1.default.reformatSingularNoun(match.had, false)))
                                }));
                            }
                            else {
                                resultFlags.none = true;
                                str.items.none.push(match.matched.type !== undefined
                                    ? Translation_1.default.nameOf(Dictionary_1.default.Item, match.matched.type, match.had, match.had > 1 ? "indefinite" : false, true)
                                    : StaticHelper_1.default.TLMain("concat").addArgs(StaticHelper_1.default.TLGroup(match.matched.group)
                                        .inContext(ITranslation_1.TextContext.None)
                                        .passTo(StaticHelper_1.default.TLMain("colorMatchGroup")), StaticHelper_1.default.TLGroup("Item").passTo(Translation_1.default.reformatSingularNoun(999, false))));
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
                            prefix: StaticHelper_1.default.TLMain("qsPrefixShort")
                        });
                    }
                }, this);
            }, this);
            if (!(this._anySuccess || this._anyPartial || this._anyFailed))
                player.asLocalPlayer?.messages.send(StaticHelper_1.default.QS_INSTANCE.messageNoMatch, { prefix: StaticHelper_1.default.TLMain("qsPrefixShort").passTo(Translation_1.default.colorizeImportance("secondary")) });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJhbnNmZXJIYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1RyYW5zZmVySGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBc0JBLFNBQWdCLGVBQWUsQ0FBQyxNQUFjLEVBQUUsSUFBVSxJQUFhLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sS0FBSyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQTNKLDBDQUEySjtJQUMzSixTQUFnQixhQUFhLENBQUMsSUFBYyxJQUFhLE9BQU8scUJBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLHFCQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQXJILHNDQUFxSDtJQUNySCxTQUFnQixpQkFBaUIsQ0FBQyxNQUFjLEVBQUUsSUFBVSxJQUFhLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUFsTiw4Q0FBa047SUFDbE4sU0FBZ0IsYUFBYSxDQUFDLE1BQWMsRUFBRSxJQUFVLElBQWEsT0FBTyxJQUFJLENBQUMsZUFBZSxFQUFFLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztJQUFoSCxzQ0FBZ0g7SUFDaEgsU0FBZ0IsYUFBYSxDQUFDLE1BQWMsRUFBRSxJQUFjO1FBQ3hELE1BQU0sTUFBTSxHQUFHLElBQUEsK0JBQWUsRUFBQyxJQUFJLENBQUMsQ0FBQztRQUNyQyxPQUFPLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLEdBQUcs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
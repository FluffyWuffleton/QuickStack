define(["require", "exports", "game/item/IItem", "game/item/ItemManager", "game/tile/ITerrain", "language/Dictionary", "language/ITranslation", "language/Translation", "utilities/game/TileHelpers", "./ITransferHandler", "./QSMatchGroups", "./StaticHelper"], function (require, exports, IItem_1, ItemManager_1, ITerrain_1, Dictionary_1, ITranslation_1, Translation_1, TileHelpers_1, ITransferHandler_1, QSMatchGroups_1, StaticHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isSafeTile = exports.validNearby = exports.playerHeldContainers = exports.playerHasType = exports.playerHasItem = exports.isInHeldContainer = exports.isStorageType = exports.isHeldContainer = void 0;
    function isHeldContainer(player, item) { return player.island.items.isContainer(item) && player === player.island.items.getPlayerWithItemInInventory(item); }
    exports.isHeldContainer = isHeldContainer;
    function isStorageType(type) { return ItemManager_1.default.isInGroup(type, IItem_1.ItemTypeGroup.Storage); }
    exports.isStorageType = isStorageType;
    function isInHeldContainer(player, item) { return (item?.containedWithin) ? player.island.items.getContainedContainers(player.inventory).includes(item.containedWithin) : false; }
    exports.isInHeldContainer = isInHeldContainer;
    function playerHasItem(player, item) { return item.getCurrentOwner() === player; }
    exports.playerHasItem = playerHasItem;
    function playerHasType(player, type) {
        const g = TransferHandler.getActiveGroup(type);
        return TransferHandler.canMatch([player.inventory, ...playerHeldContainers(player)], [g !== undefined ? { group: g } : { type: type }]);
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
    function validNearby(player, overrideForbidTiles = false) {
        const adj = player.island.items.getAdjacentContainers(player, false);
        [...adj].entries().reverse().forEach(([idx, c]) => {
            if (player.island.items.getContainerReference(c, undefined).crt === IItem_1.ContainerReferenceType.Tile
                && !isSafeTile(player, c))
                adj.splice(idx, 1);
        });
        return adj;
    }
    exports.validNearby = validNearby;
    function isSafeTile(player, tile) {
        return (TileHelpers_1.default.getType(tile) !== ITerrain_1.TerrainType.Lava)
            && !(tile.events?.some(e => e.description()?.providesFire || e.description()?.blocksTile) ?? false)
            && !(tile.doodad?.isDangerous(player) ?? false);
    }
    exports.isSafeTile = isSafeTile;
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
            P.forEach(param => pSet.add(param.group !== undefined ? param.group : (this.getActiveGroup(param.type) ?? param.type)));
            return pSet;
        }
        static groupifyFlatParameters(P) {
            const pSet = new Set;
            P.forEach(param => pSet.add(typeof param == "string" ? param : (this.getActiveGroup(param) ?? param)));
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
            if (StaticHelper_1.GLOBALCONFIG.log_info) {
                StaticHelper_1.default.QS_LOG.info(`Resolved params: (Flat) [TYPES, GROUPS]`);
                console.log([[...types], [...groups]]);
            }
            return new Set([...types, ...groups]);
        }
        static getMatches(A, B, filter = []) {
            StaticHelper_1.default.MaybeLog?.info(`GET MATCHES:: ${A}  ${B}`);
            const AParams = TransferHandler.setOfFlatParams(A);
            const BParams = TransferHandler.setOfFlatParams(B);
            if (filter.length) {
                const fgrp = this.groupifyParameters(filter);
                AParams.retainWhere(param => fgrp.has(param));
            }
            AParams.retainWhere(param => BParams.has(param));
            if (StaticHelper_1.GLOBALCONFIG.log_info) {
                StaticHelper_1.default.QS_LOG.info(`GET MATCHES:: REMAINING::`);
                console.log(AParams);
            }
            return [...AParams].map(p => (typeof p === "string") ? { group: p } : { type: p });
        }
        static hasMatch(A, B, filter = []) {
            StaticHelper_1.default.MaybeLog?.info(`HAS MATCH:: ${A}  ${B}`);
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
        static getActiveGroup(type) {
            if (type in IItem_1.ItemTypeGroup)
                return StaticHelper_1.default.QS_INSTANCE.activeMatchGroupsKeys.find(KEY => QSMatchGroups_1.QSMatchableGroups[KEY].includes(type));
            else
                return StaticHelper_1.default.QS_INSTANCE.activeMatchGroupsKeys.find(KEY => {
                    if (QSMatchGroups_1.QSMatchableGroups[KEY].includes(type))
                        return true;
                    return ItemManager_1.default.getGroups(type).some(g => QSMatchGroups_1.QSMatchableGroups[KEY].includes(g));
                });
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
                    : (this.getActiveGroup(it.type) === param.group
                        && (StaticHelper_1.default.QS_INSTANCE.globalData.optionKeepContainers
                            ? !ItemManager_1.default.isInGroup(it.type, IItem_1.ItemTypeGroup.Storage)
                            : true))) && it.weight < w ? it.weight : w, Infinity)))
                    return true;
            }
            return false;
        }
        resolveTargetting(target, nested = false, overrideForbidTiles = false) {
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
        executeTransfer(log = (StaticHelper_1.GLOBALCONFIG.log_info ? StaticHelper_1.default.QS_LOG : undefined)) {
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
                        thisPairing.matches = thisPairing.matches.filter(m => (m.matched.type === undefined) || TransferHandler.getActiveGroup(m.matched.type) !== origMatch.matched.group);
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
        reportMessages(player = this.player, log = StaticHelper_1.GLOBALCONFIG.log_info ? StaticHelper_1.default.QS_LOG : undefined) {
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
                        ["source", "destination"].forEach(k => {
                            switch (pair[k].type) {
                                case IItem_1.ContainerReferenceType.PlayerInventory:
                                    str[k] = StaticHelper_1.default.TLMain(k === "source" ? "fromX" : "toX").addArgs(StaticHelper_1.default.TLMain("yourInventory"));
                                    break;
                                case IItem_1.ContainerReferenceType.Doodad:
                                    str[k] = StaticHelper_1.default.TLMain(k === "source" ? "fromX" : "toX").addArgs(pair[k].container.getName("indefinite", 1));
                                    break;
                                case IItem_1.ContainerReferenceType.Item:
                                    str[k] = StaticHelper_1.default.TLMain(k === "source" ? "fromX" : "toX").addArgs(pair[k].container.getName("indefinite", 1, false, false, true, false));
                                    break;
                                case IItem_1.ContainerReferenceType.Tile:
                                    str[k] = StaticHelper_1.default.TLMain(k === "source" ? "fromTile" : "toTile");
                                    break;
                                default:
                                    str[k] = StaticHelper_1.default.TLMain(k === "source" ? "fromUnknown" : "toUnknown");
                            }
                        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJhbnNmZXJIYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1RyYW5zZmVySGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBcUJBLFNBQWdCLGVBQWUsQ0FBQyxNQUFjLEVBQUUsSUFBVSxJQUFhLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sS0FBSyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFBM0wsMENBQTJMO0lBQzNMLFNBQWdCLGFBQWEsQ0FBQyxJQUFjLElBQWEsT0FBTyxxQkFBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUscUJBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFBckgsc0NBQXFIO0lBQ3JILFNBQWdCLGlCQUFpQixDQUFDLE1BQWMsRUFBRSxJQUFVLElBQWEsT0FBTyxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFBaE4sOENBQWdOO0lBQ2hOLFNBQWdCLGFBQWEsQ0FBQyxNQUFjLEVBQUUsSUFBVSxJQUFhLE9BQU8sSUFBSSxDQUFDLGVBQWUsRUFBRSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFBaEgsc0NBQWdIO0lBQ2hILFNBQWdCLGFBQWEsQ0FBQyxNQUFjLEVBQUUsSUFBYztRQUN4RCxNQUFNLENBQUMsR0FBRyxlQUFlLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9DLE9BQU8sZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFD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
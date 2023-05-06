define(["require", "exports", "game/item/IItem", "game/item/ItemManager", "game/tile/ITerrain", "language/Dictionary", "language/ITranslation", "language/Translation", "utilities/math/Direction", "utilities/math/Vector3", "language/Translation", "./ITransferHandler", "./QSMatchGroups", "./StaticHelper"], function (require, exports, IItem_1, ItemManager_1, ITerrain_1, Dictionary_1, ITranslation_1, Translation_1, Direction_1, Vector3_1, Translation_2, ITransferHandler_1, QSMatchGroups_1, StaticHelper_1) {
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
            && (!!(tileOptions?.allowBlockedTiles) || !tile.doodad?.description?.blockMove)
            && isSafeTile(tile);
    }
    exports.isValidTile = isValidTile;
    function isSafeTile(tile) {
        return (tile.type !== ITerrain_1.TerrainType.Lava)
            && !(tile.events?.some((e) => e.description?.providesFire))
            && !(tile.doodad?.isDangerous(localPlayer));
    }
    exports.isSafeTile = isSafeTile;
    function TLContainer(tgt, toFrom) {
        const cached = StaticHelper_1.default.QSLSC?.findNearby(tgt.cHash);
        switch (tgt.type) {
            case IItem_1.ContainerReferenceType.PlayerInventory:
                return (0, StaticHelper_1.TLMain)(`${toFrom}X`).addArgs((0, StaticHelper_1.TLMain)("yourInventory"));
            case IItem_1.ContainerReferenceType.Item:
                return (0, StaticHelper_1.TLMain)(`${toFrom}X`).addArgs(tgt.container.getName(Translation_2.Article.Indefinite, 1, false, false, true, false));
            case IItem_1.ContainerReferenceType.Doodad:
                if (!cached || cached.iswhat === "Item" || cached.relation === Direction_1.Direction.None)
                    return (0, StaticHelper_1.TLMain)(`${toFrom}X`).addArgs(tgt.container.getName(Translation_2.Article.Indefinite, 1));
                else
                    return (0, StaticHelper_1.TLMain)(`${toFrom}X`).addArgs((0, StaticHelper_1.TLUtil)("concat").addArgs(tgt.container.getName(Translation_2.Article.Indefinite, 1), (0, StaticHelper_1.TLUtil)("parenthetical").addArgs(Translation_1.default.get(Dictionary_1.default.Direction, cached.relation))));
            case IItem_1.ContainerReferenceType.Tile:
                if (!cached || cached.iswhat === "Item" || cached.relation === Direction_1.Direction.None)
                    return (0, StaticHelper_1.TLMain)(`${toFrom}Tile`);
                else
                    return (0, StaticHelper_1.TLUtil)("concat").addArgs((0, StaticHelper_1.TLMain)(`${toFrom}Tile`), (0, StaticHelper_1.TLUtil)("parenthetical").addArgs(Translation_1.default.get(Dictionary_1.default.Direction, cached.relation)));
            default:
                return (0, StaticHelper_1.TLMain)(`${toFrom}Unknown`);
        }
    }
    exports.TLContainer = TLContainer;
    function locateTransferTarget(IM, T) {
        switch (T.type) {
            case IItem_1.ContainerReferenceType.Doodad:
                return IM.resolveContainer(T.container).point;
            case IItem_1.ContainerReferenceType.Item:
                return IM.resolveContainer(T.container).point ?? { x: 0, y: 0, z: 0 };
            case IItem_1.ContainerReferenceType.PlayerInventory:
            case IItem_1.ContainerReferenceType.NPCInventory:
                return IM.resolveContainer(T.container).point ?? { x: 0, y: 0, z: 0 };
            case IItem_1.ContainerReferenceType.Tile:
                return IM.resolveContainer(T.container).point;
            default:
                return { x: 0, y: 0, z: 0 };
        }
    }
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
                const remaining = ((player.island.items.getWeightCapacity(d, undefined)
                    ?? (player.island.items.isTileContainer(d) && !player.island.getTileFromPoint(d).isFull)) ? Infinity : 0) - player.island.items.computeContainerWeight(d);
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
                targetsFlat = [...new Set([...target.map(t => ({ container: t, cHash: this.island.items.hashContainer(t), type: this.island.items.getContainerReference(t, undefined).crt }))])];
            }
            else {
                const targetSet = new Set();
                const nearby = target.some(p => ('doodads' in p || 'tiles' in p))
                    ? validNearby(this.player, tileOptions)
                        .map(c => ({ container: c, cHash: this.island.items.hashContainer(c), type: this.island.items.getContainerReference(c, undefined).crt }))
                    : [];
                const resolveParam = (p) => {
                    let adding;
                    if ('self' in p)
                        adding = [{ container: this.player.inventory, cHash: this.island.items.hashContainer(this.player.inventory), type: IItem_1.ContainerReferenceType.PlayerInventory }];
                    else if ('tiles' in p)
                        adding = nearby.filter(near => near.type === IItem_1.ContainerReferenceType.Tile);
                    else if ('doodads' in p)
                        adding = nearby.filter(near => near.type === IItem_1.ContainerReferenceType.Doodad);
                    else
                        adding = (Array.isArray(p.container) ? p.container : [p.container]).map(c => ({ container: c, cHash: this.island.items.hashContainer(c), type: this.island.items.getContainerReference(c, undefined).crt }));
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
                    const srcPoint = locateTransferTarget(itemMgr, thisPairing.source);
                    const destPoint = locateTransferTarget(itemMgr, thisPairing.destination);
                    const pairingAnimParams = srcPoint === destPoint
                        ? undefined
                        :
                            {
                                fromTile: this.island.getTileFromPoint(srcPoint),
                                fromTileApplyPlayerOffset: thisPairing.source.type === IItem_1.ContainerReferenceType.PlayerInventory
                                    || (thisPairing.source.type === IItem_1.ContainerReferenceType.Item && !!itemMgr.resolveContainer(thisPairing.source.container).getCurrentOwner()),
                                toTile: this.island.getTileFromPoint(destPoint),
                                toTileApplyPlayerOffset: thisPairing.destination.type === IItem_1.ContainerReferenceType.PlayerInventory
                                    || (thisPairing.destination.type === IItem_1.ContainerReferenceType.Item && !!itemMgr.resolveContainer(thisPairing.destination.container).getCurrentOwner()),
                                toContainer: (thisPairing.destination.type === IItem_1.ContainerReferenceType.Tile || thisPairing.destination.type === IItem_1.ContainerReferenceType.World)
                                    ? undefined
                                    : thisPairing.destination.container,
                                toContainerOptions: { skipTileUpdate: true, skipMessage: true }
                            };
                    log?.info(`executeTransfer: PAIRING:`
                        + `\n ${itemMgr.resolveContainer(thisPairing.destination.container)} from ${itemMgr.resolveContainer(thisPairing.source.container)}`
                        + `\n Found ${thisPairing.matches.length} matches.`
                        + (!pairingAnimParams ? '' : (`\n FROM: ${Vector3_1.default.xyz(pairingAnimParams.fromTile)}${pairingAnimParams.fromTileApplyPlayerOffset ? ' (+)' : ''}`
                            + `\n   TO: ${Vector3_1.default.xyz(pairingAnimParams.toTile)}${pairingAnimParams.toTileApplyPlayerOffset ? ' (+)' : ''}`)));
                    thisPairing.matches.forEach((match, k) => {
                        const isGroupMatch = match.matched.group !== undefined;
                        const doesThisMatch = isGroupMatch
                            ? (it) => StaticHelper_1.default.QS_INSTANCE.activeMatchGroupsFlattened[match.matched.group].includes(it.type)
                                && (!StaticHelper_1.default.QS_INSTANCE.globalData.optionKeepContainers || !ItemManager_1.default.isInGroup(it.type, IItem_1.ItemTypeGroup.Storage))
                            : (it) => (it.type === match.matched.type);
                        const validItems = src.container.containedItems.filter((it) => doesThisMatch(it) && !it.isProtected() && !it.isEquipped()).sort((a, b) => a.weight - b.weight);
                        match.had = validItems.length;
                        log?.info(`executeTransfer: Match #${k} (${!isGroupMatch
                            ? `TYPE: '${Translation_1.default.nameOf(Dictionary_1.default.Item, match.matched.type, Translation_2.Article.None).toString()}'`
                            : `GROUP: '${(0, StaticHelper_1.TLGroup)(match.matched.group).toString()}'`}) :: Had ${match.had}`);
                        const weightCap = itemMgr.getWeightCapacity(dest.container, true) ?? Infinity;
                        let update = true;
                        let remaining;
                        const itMoved = validItems.filter(it => {
                            if (update)
                                remaining = dest.type === IItem_1.ContainerReferenceType.Tile
                                    ? (this.player.island.getTileFromPoint(dest.container).isFull ? -Infinity : Infinity)
                                    : (weightCap - itemMgr.computeContainerWeight(dest.container));
                            update = false;
                            if (remaining > it.weight)
                                update = !!itemMgr.moveItemToContainer(this.player, it, dest.container, { moveToTileOptions: pairingAnimParams }).itemsMoved.length;
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
            this._executionResults.forEach(pairList => {
                pairList.forEach(pair => {
                    if (pair.matches.length) {
                        const str = {
                            source: "UNDEFINED",
                            destination: "UNDEFINED",
                            items: {
                                all: new Array,
                                some: new Array,
                                none: new Array
                            }
                        };
                        str.source = TLContainer(pair.source, "from");
                        str.destination = TLContainer(pair.destination, "to");
                        let resultFlags = {};
                        pair.matches.forEach(match => {
                            if (match.sent === match.had) {
                                resultFlags.all = true;
                                str.items.all.push((0, StaticHelper_1.TLMain)("XOutOfY").addArgs({
                                    X: match.sent,
                                    name: match.matched.type !== undefined
                                        ? Translation_1.default.nameOf(Dictionary_1.default.Item, match.matched.type, match.sent, match.sent > 1 ? Translation_2.Article.Indefinite : Translation_2.Article.None, true)
                                        : (0, StaticHelper_1.TLUtil)("concat").addArgs((0, StaticHelper_1.TLGroup)(match.matched.group)
                                            .inContext(ITranslation_1.TextContext.None)
                                            .passTo((0, StaticHelper_1.TLUtil)("colorMatchGroup")), (0, StaticHelper_1.TLGroup)("Item").passTo(Translation_1.default.reformatSingularNoun(match.sent, Translation_2.Article.None)))
                                }));
                            }
                            else if (match.sent > 0) {
                                resultFlags.some = true;
                                str.items.all.push((0, StaticHelper_1.TLMain)("XOutOfY").addArgs({
                                    X: match.sent,
                                    Y: match.had,
                                    name: match.matched.type !== undefined
                                        ? Translation_1.default.nameOf(Dictionary_1.default.Item, match.matched.type, match.had, Translation_2.Article.None, true)
                                        : (0, StaticHelper_1.TLUtil)("concat").addArgs((0, StaticHelper_1.TLGroup)(match.matched.group)
                                            .inContext(ITranslation_1.TextContext.None)
                                            .passTo((0, StaticHelper_1.TLUtil)("colorMatchGroup")), (0, StaticHelper_1.TLGroup)("Item").passTo(Translation_1.default.reformatSingularNoun(match.had, Translation_2.Article.None)))
                                }));
                            }
                            else {
                                resultFlags.none = true;
                                str.items.none.push(match.matched.type !== undefined
                                    ? Translation_1.default.nameOf(Dictionary_1.default.Item, match.matched.type, match.had, match.had > 1 ? Translation_2.Article.Indefinite : Translation_2.Article.None, true)
                                    : (0, StaticHelper_1.TLUtil)("concat").addArgs((0, StaticHelper_1.TLGroup)(match.matched.group)
                                        .inContext(ITranslation_1.TextContext.None)
                                        .passTo((0, StaticHelper_1.TLUtil)("colorMatchGroup")), (0, StaticHelper_1.TLGroup)("Item").passTo(Translation_1.default.reformatSingularNoun(999, Translation_2.Article.None))));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJhbnNmZXJIYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1RyYW5zZmVySGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBd0JvRyxDQUFDO0lBQ3hGLFFBQUEsaUJBQWlCLEdBQTJCLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFXLENBQUM7SUFDakYsUUFBQSxzQkFBc0IsR0FBMkIsRUFBRSxpQkFBaUIsRUFBRSxLQUFLLEVBQVcsQ0FBQztJQUdwRyxTQUFnQixlQUFlLENBQUMsTUFBYyxFQUFFLElBQVUsSUFBYSxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLEtBQUssSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUEzSiwwQ0FBMko7SUFDM0osU0FBZ0IsYUFBYSxDQUFDLElBQWMsSUFBYSxPQUFPLHFCQUFXLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxxQkFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUFySCxzQ0FBcUg7SUFDckgsU0FBZ0IsaUJBQWlCLENBQUMsTUFBYyxFQUFFLElBQVUsSUFBYSxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFBbE4sOENBQWtOO0lBQ2xOLFNBQWdCLGFBQWEsQ0FBQyxNQUFjLEVBQUUsSUFBVSxJQUFhLE9BQU8sSUFBSSxDQUFDLGVBQWUsRUFBRSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFBaEgsc0NBQWdIO0lBQ2hILFNBQWdCLGFBQWEsQ0FBQyxNQUFj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
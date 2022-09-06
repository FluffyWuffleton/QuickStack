define(["require", "exports", "game/item/IItem", "./StaticHelper", "./ITransferHandler", "language/Translation", "language/Dictionary", "./QuickStack"], function (require, exports, IItem_1, StaticHelper_1, ITransferHandler_1, Translation_1, Dictionary_1, QuickStack_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MakeAndRunTransferHandler = exports.playerHeldContainers = exports.playerHasType = exports.playerHasItem = exports.isInHeldContainer = exports.isContainerType = exports.isHeldContainer = void 0;
    function isHeldContainer(player, item) { return player.island.items.isContainer(item) && player === player.island.items.getPlayerWithItemInInventory(item); }
    exports.isHeldContainer = isHeldContainer;
    function isContainerType(player, type) { return player.island.items.isInGroup(type, IItem_1.ItemTypeGroup.Storage); }
    exports.isContainerType = isContainerType;
    function isInHeldContainer(player, item) { return (item?.containedWithin) ? player.island.items.getContainedContainers(player.inventory).includes(item.containedWithin) : false; }
    exports.isInHeldContainer = isInHeldContainer;
    function playerHasItem(player, item) { return item.getCurrentOwner() === player; }
    exports.playerHasItem = playerHasItem;
    function playerHasType(player, type) { return player.inventory.containedItems.some(i => i.type === type); }
    exports.playerHasType = playerHasType;
    function playerHeldContainers(player, type) {
        return (type === undefined || !type.length)
            ? player.island.items.getContainedContainers(player.inventory)
            : player.island.items.getContainedContainers(player.inventory)
                .map(c => player.island.items.resolveContainer(c))
                .filter(i => type.some(t => t === i?.type));
    }
    exports.playerHeldContainers = playerHeldContainers;
    function MakeAndRunTransferHandler(player, source, dest, filterTypes, log, successFlag, suppress) {
        const thisfcn = `${MakeAndRunTransferHandler.name} :: `;
        const t0 = performance.now();
        log?.info(`${thisfcn}Constructing TransferHandler. Timestamp ${t0}`);
        const handler = new TransferHandler(player, source, dest, {
            bottomUp: !StaticHelper_1.default.QS_INSTANCE.globalData.optionTopDown,
            ...(filterTypes ? { filter: filterTypes } : {})
        });
        if (handler.state & ITransferHandler_1.THState.error) {
            log?.error(`${thisfcn}Error flag in handler after construction. Code ${handler.state.toString(2)}`);
            if (successFlag)
                successFlag.failed = true;
            return;
        }
        if (log) {
            const crtKey = (crt) => IItem_1.ContainerReferenceType[crt];
            let str = `Handler initialized\n    Identified sources`;
            const wrapChildren = (c) => {
                if (c.children)
                    return `${crtKey(c.type)}[ ${c.children.map(cc => wrapChildren(cc)).join(', ')} ]`;
                return `${crtKey(c.type)}`;
            };
            handler.sources.forEach(s => { str = str + `\n        ${wrapChildren(s)}`; });
            let destStr = [];
            Object.values(IItem_1.ContainerReferenceType).forEach(v => {
                const destCount = handler.destinations.reduce((n, itt) => { return itt.type === v ? n + 1 : n; }, 0);
                if (destCount)
                    destStr.push(`${destCount} ${crtKey(v)}`);
            });
            log.info(`${thisfcn}${str}\n    Identified destinations:\n        ${destStr.join(',  ')}`);
        }
        if (handler.executeTransfer(log) & ITransferHandler_1.THState.error) {
            log?.error(`${thisfcn}Error flag in handler during execution. Code ${handler.state.toString(2)}`);
            if (successFlag)
                successFlag.failed = true;
            return;
        }
        if (suppress?.report)
            log?.info(`${thisfcn}Message reporting suppressed`);
        else if (!handler.reportMessages(player, log))
            log?.warn(`TransferHandler.reportMessages() failed for some reason.`);
        if (handler.anySuccess || handler.anyPartial) {
            if (!suppress?.delay)
                player.addDelay(QuickStack_1.GLOBALCONFIG.pause_length);
            if (QuickStack_1.GLOBALCONFIG.pass_turn_success)
                game.passTurn(player);
            if (successFlag)
                successFlag.failed = false;
        }
        const t1 = performance.now();
        log?.info(`${thisfcn}Complete. Timestamp ${t1}. Elapsed ${t1 - t0}`);
    }
    exports.MakeAndRunTransferHandler = MakeAndRunTransferHandler;
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
            this.sources = this.resolveTargetting(source, true);
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
        static setOfTypes(X) {
            return new Set([...X.flatMap(x => x.containedItems.map(it => it.type))]);
        }
        static matchTypes(A, B, filter = []) {
            const ATypes = TransferHandler.setOfTypes(A);
            const BTypes = TransferHandler.setOfTypes(B);
            if (filter.length > 0)
                ATypes.retainWhere(type => filter.includes(type));
            ATypes.retainWhere(type => BTypes.has(type));
            return [...ATypes].map((t) => { return { type: t, had: -1, sent: -1 }; });
        }
        static countMatchTypes(A, B, filter = []) {
            const ATypes = [...TransferHandler.setOfTypes(A)];
            const BTypes = TransferHandler.setOfTypes(B);
            if (filter.length > 0)
                BTypes.retainWhere(type => filter.includes(type));
            return ATypes.reduce((n, type) => { return BTypes.has(type) ? n + 1 : n; }, 0);
        }
        static hasMatchType(A, B, filter = []) {
            const ATypes = [...TransferHandler.setOfTypes(A)];
            const BTypes = TransferHandler.setOfTypes(B);
            if (filter.length > 0)
                BTypes.retainWhere(type => filter.includes(type));
            return ATypes.some(type => BTypes.has(type));
        }
        static hasType(X, type) {
            return TransferHandler.setOfTypes(X).has(type);
        }
        resolveTargetting(target, nested = false) {
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
                    ? this.island.items
                        .getAdjacentContainers(this.player, false)
                        .map(c => ({ container: c, type: this.island.items.getContainerReference(c, undefined).crt }))
                    : [];
                const resolveParam = (p) => {
                    let adding;
                    if ('self' in p)
                        adding = [{ container: this.player.inventory, type: IItem_1.ContainerReferenceType.PlayerInventory }];
                    else if ('tiles' in p)
                        adding = StaticHelper_1.default.QS_INSTANCE.globalData.optionForbidTiles ? [] : adding = nearby.filter(near => near.type === IItem_1.ContainerReferenceType.Tile);
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
        executeTransfer(log = StaticHelper_1.default.QS_LOG) {
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
                        matches: TransferHandler.matchTypes([src.container], [dest.container], this.typeFilter)
                    };
                    if (StaticHelper_1.default.QS_INSTANCE.globalData.optionKeepContainers)
                        thisPairing.matches = thisPairing.matches.filter(m => !itemMgr.isInGroup(m.type, IItem_1.ItemTypeGroup.Storage));
                    let badMatches = [];
                    log?.info(`executeTransfer: PAIRING:\n Length ${thisPairing.matches.length} \n ${itemMgr.resolveContainer(thisPairing.destination.container)} from ${itemMgr.resolveContainer(thisPairing.source.container)}`);
                    thisPairing.matches.forEach((match, k) => {
                        match.had = src.container.containedItems.reduce((n, item) => { return (item.type === match.type) ? n + 1 : n; }, 0);
                        log?.info(`executeTransfer: Match ${k} :: (${Translation_1.default.nameOf(Dictionary_1.default.Item, match.type, false).toString()}) :: Had ${match.had}`);
                        const itHad = src.container.containedItems.filter(it => {
                            if (it.type !== match.type)
                                return false;
                            if (it.isProtected() || it.isEquipped()) {
                                match.had--;
                                return false;
                            }
                            return true;
                        });
                        const weightCap = itemMgr.getWeightCapacity(dest.container, true) ?? Infinity;
                        let update = true;
                        let remaining;
                        const itMoved = itHad.filter(it => {
                            if (update)
                                remaining = dest.type === IItem_1.ContainerReferenceType.Tile
                                    ? (this.island.isTileFull(dest.container) ? -Infinity : Infinity)
                                    : (weightCap - itemMgr.computeContainerWeight(dest.container));
                            update = false;
                            if (remaining >= it.weight)
                                update = itemMgr.moveToContainer(this.player, it, dest.container);
                            return update;
                        }, this);
                        match.sent = itMoved.length;
                        log?.info(`executeTransfer: Sent :: ${match.sent} ${Translation_1.default.nameOf(Dictionary_1.default.Item, match.type, false).toString()} :: Had ${match.had}`);
                        allItemsMoved.push(...itMoved);
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
            this._state = ITransferHandler_1.THState.complete;
            return this._state;
        }
        reportMessages(player = this.player, log = StaticHelper_1.default.QS_LOG) {
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
                                    str[k] = StaticHelper_1.default.TLget(k === "source" ? "fromX" : "toX").addArgs(StaticHelper_1.default.TLget("yourInventory"));
                                    break;
                                case IItem_1.ContainerReferenceType.Doodad:
                                    str[k] = StaticHelper_1.default.TLget(k === "source" ? "fromX" : "toX").addArgs(pair[k].container.getName("indefinite", 1));
                                    break;
                                case IItem_1.ContainerReferenceType.Item:
                                    str[k] = StaticHelper_1.default.TLget(k === "source" ? "fromX" : "toX").addArgs(pair[k].container.getName("indefinite", 1, false, false, true, false));
                                    break;
                                case IItem_1.ContainerReferenceType.Tile:
                                    str[k] = StaticHelper_1.default.TLget(k === "source" ? "fromTile" : "toTile");
                                    break;
                                default:
                                    str[k] = StaticHelper_1.default.TLget(k === "source" ? "fromUnknown" : "toUnknown");
                            }
                        });
                        let resultFlags = {};
                        pair.matches.forEach(match => {
                            if (match.sent === match.had) {
                                resultFlags.all = true;
                                str.items.all.push(StaticHelper_1.default.TLget("XOutOfY").addArgs({
                                    X: match.sent,
                                    name: Translation_1.default.nameOf(Dictionary_1.default.Item, match.type, match.sent, match.sent > 1 ? "indefinite" : false, true)
                                }));
                            }
                            else if (match.sent > 0) {
                                resultFlags.some = true;
                                str.items.all.push(StaticHelper_1.default.TLget("XOutOfY").addArgs({
                                    X: match.sent,
                                    Y: match.had,
                                    name: Translation_1.default.nameOf(Dictionary_1.default.Item, match.type, match.had, false, true)
                                }));
                            }
                            else {
                                resultFlags.none = true;
                                str.items.none.push(Translation_1.default.nameOf(Dictionary_1.default.Item, match.type, match.had, match.had > 1 ? "indefinite" : false, true));
                            }
                        });
                        log?.info(`ReportMessages: All(${str.items.all.length})  Some(${str.items.some.length})  None(${str.items.none.length})`);
                        player.asLocalPlayer?.messages.send(StaticHelper_1.default.QS_INSTANCE.messageStackResult, {
                            prefix: StaticHelper_1.default.TLget("qsPrefix"),
                            items: [...str.items.all, ...str.items.some, ...(resultFlags.some || resultFlags.all ? [] : str.items.none)],
                            source: str.source,
                            destination: str.destination,
                            failed: {
                                some: resultFlags.some || (resultFlags.all && resultFlags.none) ? true : undefined,
                                all: resultFlags.none && !resultFlags.all && !resultFlags.some ? true : undefined
                            }
                        });
                    }
                }, this);
            }, this);
            if (!(this._anySuccess || this._anyPartial || this._anyFailed))
                player.messages.send(StaticHelper_1.default.QS_INSTANCE.messageNoMatch, { prefix: StaticHelper_1.default.TLget("qsPrefix") });
            return true;
        }
    }
    exports.default = TransferHandler;
    ;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJhbnNmZXJIYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1RyYW5zZmVySGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBaUJBLFNBQWdCLGVBQWUsQ0FBQyxNQUFjLEVBQUUsSUFBVSxJQUFhLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sS0FBSyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFBM0wsMENBQTJMO0lBQzNMLFNBQWdCLGVBQWUsQ0FBQyxNQUFjLEVBQUUsSUFBYyxJQUFhLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxxQkFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUEvSSwwQ0FBK0k7SUFDL0ksU0FBZ0IsaUJBQWlCLENBQUMsTUFBYyxFQUFFLElBQVUsSUFBYSxPQUFPLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUFoTiw4Q0FBZ047SUFDaE4sU0FBZ0IsYUFBYSxDQUFDLE1BQWMsRUFBRSxJQUFVLElBQWEsT0FBTyxJQUFJLENBQUMsZUFBZSxFQUFFLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztJQUFoSCxzQ0FBZ0g7SUFDaEgsU0FBZ0IsYUFBYSxDQUFDLE1BQWMsRUFBRSxJQUFjLElBQWEsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVB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
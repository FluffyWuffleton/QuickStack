define(["require", "exports", "game/item/IItem", "./StaticHelper", "./ITransferHandler", "game/entity/IHuman", "language/Translation", "language/Dictionary"], function (require, exports, IItem_1, StaticHelper_1, ITransferHandler_1, IHuman_1, Translation_1, Dictionary_1) {
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
    function MakeAndRunTransferHandler(player, source, dest, filter, log, sFlag) {
        log?.info("Constructing TransferHandler.");
        const handler = new TransferHandler(player, source, dest, filter ?? []);
        if (handler.state & ITransferHandler_1.THState.error) {
            log?.error(`Error flag in handler after construction. Code ${handler.state.toString(2)}`);
            if (sFlag)
                sFlag.pass = false;
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
            log.info(str + `\n    Identified destinations:\n        ${destStr.join(',  ')}`);
        }
        if (handler.executeTransfer(log) & ITransferHandler_1.THState.error) {
            log?.error(`Error flag in handler during execution. Code ${handler.state.toString(2)}`);
            if (sFlag)
                sFlag.pass = false;
            return;
        }
        if (!handler.reportMessages(player, log))
            log?.warn(`TransferHandler.reportMessages() failed for some reason.`);
        if (handler.anySuccess || handler.anyPartial) {
            player.addDelay(IHuman_1.Delay.LongPause);
            game.passTurn(player);
            if (sFlag)
                sFlag.pass = true;
        }
    }
    exports.MakeAndRunTransferHandler = MakeAndRunTransferHandler;
    class TransferHandler {
        constructor(executor, source = [{ self: true }], dest = [{ doodads: true }, { tiles: true }], filterTypes = [], bottomUp = true) {
            this._anyFailed = false;
            this._anySuccess = false;
            this._anyPartial = false;
            this._state = ITransferHandler_1.THState.idle;
            this._executionResults = [];
            this.player = executor;
            this.island = executor.island;
            this.typeFilter = filterTypes;
            this.bottomUp = bottomUp;
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
                            items: { all: new Array, some: new Array, none: new Array }
                        };
                        ["source", "destination"].forEach(k => {
                            switch (pair[k].type) {
                                case IItem_1.ContainerReferenceType.PlayerInventory:
                                    str[k] = Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE[k === "source" ? "messageFromInventory" : "messageToInventory"]);
                                    break;
                                case IItem_1.ContainerReferenceType.Doodad:
                                    str[k] = Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE[k === "source" ? "messageFromContainer" : "messageToContainer"])
                                        .addArgs(pair[k].container.getName("indefinite", 1));
                                    break;
                                case IItem_1.ContainerReferenceType.Item:
                                    str[k] = Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE[k === "source" ? "messageFromContainer" : "messageToContainer"])
                                        .addArgs(pair[k].container.getName("indefinite", 1, false, false, true, false));
                                    break;
                                case IItem_1.ContainerReferenceType.Tile:
                                    str[k] = Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE[k === "source" ? "messageFromTile" : "messageToTile"]);
                                    break;
                                default:
                                    str[k] = Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE[k === "source" ? "messageFromUnknown" : "messageToUnknown"]);
                            }
                        });
                        let resultFlags = {};
                        pair.matches.forEach(match => {
                            if (match.sent === match.had) {
                                resultFlags.all = true;
                                str.items.all.push(Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE.messageItemAll)
                                    .addArgs(match.sent, Translation_1.default.nameOf(Dictionary_1.default.Item, match.type, match.sent, match.sent > 1 ? "indefinite" : false, true)));
                            }
                            else if (match.sent > 0) {
                                resultFlags.some = true;
                                str.items.some.push(Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE.messageItemSome)
                                    .addArgs(match.sent, match.had, Translation_1.default.nameOf(Dictionary_1.default.Item, match.type, match.had, false, true)));
                            }
                            else {
                                resultFlags.none = true;
                                str.items.none.push(Translation_1.default.nameOf(Dictionary_1.default.Item, match.type, match.had, match.had > 1 ? "indefinite" : false, true));
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
                            }
                        });
                    }
                }, this);
            }, this);
            if (!(this._anySuccess || this._anyPartial || this._anyFailed))
                player.messages.send(StaticHelper_1.default.QS_INSTANCE.messageNoMatch);
            return true;
        }
    }
    exports.default = TransferHandler;
    ;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJhbnNmZXJIYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1RyYW5zZmVySGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBaUJBLFNBQWdCLGVBQWUsQ0FBQyxNQUFjLEVBQUUsSUFBVSxJQUFhLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sS0FBSyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFBM0wsMENBQTJMO0lBQzNMLFNBQWdCLGVBQWUsQ0FBQyxNQUFjLEVBQUUsSUFBYyxJQUFhLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxxQkFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUEvSSwwQ0FBK0k7SUFDL0ksU0FBZ0IsaUJBQWlCLENBQUMsTUFBYyxFQUFFLElBQVUsSUFBYSxPQUFPLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUFoTiw4Q0FBZ047SUFDaE4sU0FBZ0IsYUFBYSxDQUFDLE1BQWMsRUFBRSxJQUFVLElBQWEsT0FBTyxJQUFJLENBQUMsZUFBZSxFQUFFLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztJQUFoSCxzQ0FBZ0g7SUFDaEgsU0FBZ0IsYUFBYSxDQUFDLE1BQWMsRUFBRSxJQUFjLElBQWEsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVB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NUUsQ0FBQztRQVFNLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBdUMsRUFBRSxDQUF1QyxFQUFFLFNBQXFCLEVBQUU7WUFDbkksTUFBTSxNQUFNLEdBQUcsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsRCxNQUFNLE1BQU0sR0FBRyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTdDLElBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDO2dCQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFFeEUsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEdBQUcsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbEYsQ0FBQztRQVFNLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBdUMsRUFBRSxDQUF1QyxFQUFFLFNBQXFCLEVBQUU7WUFDaEksTUFBTSxNQUFNLEdBQUcsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsRCxNQUFNLE1BQU0sR0FBRyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTdDLElBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDO2dCQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFFeEUsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2pELENBQUM7UUFFTSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQXVDLEVBQUUsSUFBYztZQUN6RSxPQUFPLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25ELENBQUM7UUFXTyxpQkFBaUIsQ0FBQyxNQUEwQyxFQUFFLFNBQWtCLEtBQUs7WUFFekYsSUFBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7Z0JBQUUsSUFBSSxDQUFDLE1BQU0sSUFBSSwwQkFBTyxDQUFDLFlBQVksQ0FBQztnQkFBQyxPQUFPLEVBQUUsQ0FBQzthQUFFO1lBRXRFLElBQUksV0FBOEIsQ0FBQztZQUVuQyxJQUFHLGdCQUFnQixJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFFOUIsV0FBVyxHQUFHLENBQUMsR0FBSSxJQUFJLEdBQUcsQ0FBa0IsQ0FBQyxHQUFJLE1BQXVCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFFN0s7aUJBQU07Z0JBQ0gsTUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQW1CLENBQUM7Z0JBRzdDLE1BQU0sTUFBTSxHQUF1QixNQUE4QixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxJQUFJLENBQUMsSUFBSSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ3pHLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUs7eUJBQ2QscUJBQXFCLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUM7eUJBQ3pDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztvQkFDbEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztnQkFJVCxNQUFNLFlBQVksR0FBRyxDQUFDLENBQW9CLEVBQUUsRUFBRTtvQkFDMUMsSUFBSSxNQUF5QixDQUFDO29CQUc5QixJQUFHLE1BQU0sSUFBSSxDQUFDO3dCQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSw4QkFBc0IsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDO3lCQUN6RyxJQUFHLE9BQU8sSUFBSSxDQUFDO3dCQUFFLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyw4QkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQzt5QkFDM0YsSUFBRyxTQUFTLElBQUksQ0FBQzt3QkFBRSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssOEJBQXNCLENBQUMsTUFBTSxDQUFDLENBQUM7O3dCQUMvRixNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFHdkssTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtvQkFHOUMsSUFBRyxXQUFXLElBQUksQ0FBQzt3QkFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQ3BDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUNyRSxZQUFZLENBQUMsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFFL0QsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDO2dCQUM3QixDQUFDLENBQUE7Z0JBR0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFzQixDQUFDLENBQUMsQ0FBQztnQkFDMUQsV0FBVyxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQzthQUNoQztZQUtELFdBQVcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ3pCLE1BQU0sTUFBTSxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxlQUFlLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxLQUFLLE1BQU0sQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztnQkFDdEosSUFBRyxNQUFNLEtBQUssU0FBUyxFQUFFO29CQUNyQixNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztvQkFDdkIsSUFBRyxNQUFNLENBQUMsUUFBUSxLQUFLLFNBQVM7d0JBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7O3dCQUMxRCxNQUFNLENBQUMsUUFBUSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQ25DO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFHSCxPQUFPLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLFNBQVMsQ0FBQyxDQUFDO1FBQzNELENBQUM7UUFPTSxlQUFlLENBQUMsTUFBVyxzQkFBWSxDQUFDLE1BQU07WUFFakQsSUFBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsMEJBQU8sQ0FBQyxLQUFLLEdBQUcsMEJBQU8sQ0FBQyxRQUFRLENBQUM7Z0JBQUUsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBR3hFLElBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLDBCQUFPLENBQUMsUUFBUSxDQUFDO2dCQUFDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQzthQUFFO1lBRXZILE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBR2xDLE1BQU0sVUFBVSxHQUFHLENBQUMsR0FBb0IsRUFBVSxFQUFFO2dCQUVoRCxNQUFNLGFBQWEsR0FBdUIsRUFBRSxDQUFDO2dCQUM3QyxNQUFNLGFBQWEsR0FBVyxFQUFFLENBQUM7Z0JBR2pDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUdsQyxNQUFNLFdBQVcsR0FBcUI7d0JBQ2xDLE1BQU0sRUFBRSxHQUFHO3dCQUNYLFdBQVcsRUFBRSxJQUFJO3dCQUNqQixPQUFPLEVBQUUsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDO3FCQUMxRixDQUFDO29CQUlGLElBQUksVUFBVSxHQUFhLEVBQUUsQ0FBQztvQkFHOUIsR0FBRyxFQUFFLElBQUksQ0FBQyxzQ0FBc0MsV0FBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLE9BQU8sT0FBTyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFNBQVMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUMvTSxXQUFXLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFHckMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFHbkgsR0FBRyxFQUFFLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLHFCQUFXLENBQUMsTUFBTSxDQUFDLG9CQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFLFlBQVksS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7d0JBR3ZJLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTs0QkFDbkQsSUFBRyxFQUFFLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxJQUFJO2dDQUFFLE9BQU8sS0FBSyxDQUFDOzRCQUN4QyxJQUFHLEVBQUUsQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUU7Z0NBQ3BDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQ0FDWixPQUFPLEtBQUssQ0FBQzs2QkFDaEI7NEJBQ0QsT0FBTyxJQUFJLENBQUM7d0JBQ2hCLENBQUMsQ0FBQyxDQUFDO3dCQUdILE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLFFBQVEsQ0FBQzt3QkFDOUUsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDO3dCQUNsQixJQUFJLFNBQWlCLENBQUM7d0JBR3RCLE1BQU0sT0FBTyxHQUFXLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUU7NEJBRXRDLElBQUcsTUFBTTtnQ0FBRSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksS0FBSyw4QkFBc0IsQ0FBQyxJQUFJO29DQUM1RCxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO29DQUMxRSxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDOzRCQUNuRSxNQUFNLEdBQUcsS0FBSyxDQUFDOzRCQUVmLElBQUcsU0FBUyxJQUFJLEVBQUUsQ0FBQyxNQUFNO2dDQUFFLE1BQU0sR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzs0QkFDN0YsT0FBTyxNQUFNLENBQUM7d0JBRWxCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFHVCxLQUFLLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7d0JBRTVCLEdBQUcsRUFBRSxJQUFJLENBQUMsNEJBQTRCLEtBQUssQ0FBQyxJQUFJLElBQUkscUJBQVcsQ0FBQyxNQUFNLENBQUMsb0JBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsV0FBVyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQzt3QkFFN0ksYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDO3dCQUUvQixJQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFOzRCQUNkLElBQUcsS0FBSyxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsR0FBRztnQ0FBRSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztpQ0FDaEQsSUFBRyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUM7Z0NBQUUsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7O2dDQUMzQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQzt5QkFDL0I7NkJBQU07NEJBQ0gsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDbkIsSUFBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUM7Z0NBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxnQ0FBZ0MsS0FBSyxDQUFDLEdBQUcsNkNBQTZDLENBQUMsQ0FBQzt5QkFDdkg7b0JBRUwsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUdULElBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRTt3QkFDbEIsR0FBRyxFQUFFLElBQUksQ0FBQywwQ0FBMEMsVUFBVSxHQUFHLENBQUMsQ0FBQzt3QkFDbkUsV0FBVyxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUN2RjtvQkFFRCxHQUFHLEVBQUUsSUFBSSxDQUFDLHFEQUFxRCxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7b0JBQzdGLGFBQWEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBRXBDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDVCxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUMzQyxPQUFPLGFBQWEsQ0FBQztZQUN6QixDQUFDLENBQUE7WUFFRCxNQUFNLFlBQVksR0FBRyxDQUFDLEdBQW9CLEVBQUUsUUFBaUIsS0FBSyxFQUFFLEVBQUU7Z0JBQ2xFLElBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRTtvQkFDZCxHQUFHLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDMUQsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUNuQjtxQkFBTTtvQkFLSCxJQUFHLEtBQUssRUFBRTt3QkFDTixJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUNoQyxHQUFHLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztxQkFDN0Q7eUJBQU07d0JBQ0gsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUNuQyxHQUFHLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsU0FBaUIsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7cUJBQzNHO2lCQUNKO1lBQ0wsQ0FBQyxDQUFDO1lBR0YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFakQsSUFBSSxDQUFDLE1BQU0sR0FBRywwQkFBTyxDQUFDLFFBQVEsQ0FBQztZQUMvQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDdkIsQ0FBQztRQVFNLGNBQWMsQ0FBQyxTQUFpQixJQUFJLENBQUMsTUFBTSxFQUFFLE1BQVcsc0JBQVksQ0FBQyxNQUFNO1lBRTlFLElBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLDBCQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsMEJBQU8sQ0FBQyxRQUFRLENBQUM7Z0JBQUUsT0FBTyxLQUFLLENBQUM7WUFFcEYsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFHbEMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDdEMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDcEIsSUFBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTt3QkFDcEIsR0FBRyxFQUFFLElBQUksQ0FBQyxtQ0FBbUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLE9BQU8sT0FBTyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLFVBQVUsT0FBTyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUdqTixNQUFNLEdBQUcsR0FBNkg7NEJBQ2xJLE1BQU0sRUFBRSxXQUFXOzRCQUNuQixXQUFXLEVBQUUsV0FBVzs0QkFDeEIsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksS0FBc0IsRUFBRSxJQUFJLEVBQUUsSUFBSSxLQUFzQixFQUFFLElBQUksRUFBRSxJQUFJLEtBQXNCLEVBQUU7eUJBQ2pILENBQUM7d0JBR0QsQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFOzRCQUMvQyxRQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUU7Z0NBQ2pCLEtBQUssOEJBQXNCLENBQUMsZUFBZTtvQ0FDdkMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLHFCQUFXLENBQUMsT0FBTyxDQUFDLHNCQUFZLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7b0NBQ3ZILE1BQU07Z0NBQ1YsS0FBSyw4QkFBc0IsQ0FBQyxNQUFNO29DQUM5QixHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcscUJBQVcsQ0FBQyxPQUFPLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUM7eUNBQ2pILE9BQU8sQ0FBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBb0IsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7b0NBQ3JFLE1BQU07Z0NBQ1YsS0FBSyw4QkFBc0IsQ0FBQyxJQUFJO29DQUM1QixHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcscUJBQVcsQ0FBQyxPQUFPLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUM7eUNBQ2pILE9BQU8sQ0FBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBa0IsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO29DQUM5RixNQUFNO2dDQUNWLEtBQUssOEJBQXNCLENBQUMsSUFBSTtvQ0FDNUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLHFCQUFXLENBQUMsT0FBTyxDQUFDLHNCQUFZLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO29DQUM3RyxNQUFNO2dDQUNWO29DQUNJLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxxQkFBVyxDQUFDLE9BQU8sQ0FBQyxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDOzZCQUMxSDt3QkFDTCxDQUFDLENBQUMsQ0FBQzt3QkFHSCxJQUFJLFdBQVcsR0FBK0MsRUFBRSxDQUFDO3dCQUVqRSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTs0QkFDekIsSUFBRyxLQUFLLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxHQUFHLEVBQUU7Z0NBQ3pCLFdBQVcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO2dDQUN2QixHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMscUJBQVcsQ0FBQyxPQUFPLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDO3FDQUMxRSxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxxQkFBVyxDQUFDLE1BQU0sQ0FBQyxvQkFBVSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs2QkFDdkk7aUNBQU0sSUFBRyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRTtnQ0FDdEIsV0FBVyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Z0NBQ3hCLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBVyxDQUFDLE9BQU8sQ0FBQyxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUM7cUNBQzVFLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUscUJBQVcsQ0FBQyxNQUFNLENBQUMsb0JBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7NkJBQ2pIO2lDQUFNO2dDQUNILFdBQVcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO2dDQUN4QixHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQVcsQ0FBQyxNQUFNLENBQUMsb0JBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDOzZCQUMvSDt3QkFDTCxDQUFDLENBQUMsQ0FBQzt3QkFFSCxHQUFHLEVBQUUsSUFBSSxDQUFDLHVCQUF1QixHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLFdBQVcsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxXQUFXLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7d0JBYzFILE1BQU0sQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsRUFBRTs0QkFDN0UsS0FBSyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxJQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDNUcsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNOzRCQUNsQixXQUFXLEVBQUUsR0FBRyxDQUFDLFdBQVc7NEJBQzVCLE1BQU0sRUFBRTtnQ0FDSixJQUFJLEVBQUUsV0FBVyxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVM7Z0NBQ2xGLEdBQUcsRUFBRSxXQUFXLENBQUMsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUzs2QkFDcEY7eUJBQ0osQ0FBQyxDQUFDO3FCQUVOO2dCQUNMLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNiLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUdULElBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDO2dCQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLHNCQUFZLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFBO1lBRTVILE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7S0FxQ0o7SUE5YUQsa0NBOGFDO0lBQUEsQ0FBQyJ9
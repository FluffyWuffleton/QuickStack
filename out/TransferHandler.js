define(["require", "exports", "game/item/IItem", "./StaticHelper", "./ITransferHandler", "game/entity/IHuman", "language/Translation", "language/Dictionary"], function (require, exports, IItem_1, StaticHelper_1, ITransferHandler_1, IHuman_1, Translation_1, Dictionary_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MakeAndRunTransferHandler = exports.playerHeldContainers = exports.playerHasItem = exports.isInHeldContainer = exports.isHeldContainer = void 0;
    function isHeldContainer(player, item) { return player.island.items.isContainer(item) && player === player.island.items.getPlayerWithItemInInventory(item); }
    exports.isHeldContainer = isHeldContainer;
    function isInHeldContainer(player, item) {
        return !(item?.containedWithin) ? false : player.island.items.getContainedContainers(player.inventory).includes(item.containedWithin);
    }
    exports.isInHeldContainer = isInHeldContainer;
    function playerHasItem(player, item) { return item.getCurrentOwner() === player; }
    exports.playerHasItem = playerHasItem;
    function playerHeldContainers(player) { return player.island.items.getContainedContainers(player.inventory); }
    exports.playerHeldContainers = playerHeldContainers;
    function MakeAndRunTransferHandler(player, source, dest, filter, log) {
        log?.info("Constructing TransferHandler.");
        const handler = new TransferHandler(player, source, dest, filter ?? []);
        if (handler.state & ITransferHandler_1.THState.error) {
            log?.error(`Error flag in handler after construction. Code ${handler.state.toString(2)}`);
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
        if (handler.executeTransfer() & ITransferHandler_1.THState.error) {
            log?.error(`Error flag in handler during execution. Code ${handler.state.toString(2)}`);
            return;
        }
        if (!handler.reportMessages())
            log?.warn(`TransferHandler.reportMessages() failed for some reason.`);
        if (handler.anySuccess || handler.anyPartial) {
            player.addDelay(IHuman_1.Delay.LongPause);
            game.passTurn(player);
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
        executeTransfer() {
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
                    thisPairing.matches.forEach((match, k) => {
                        match.had = src.container.containedItems.reduce((n, item) => { return (item.type === match.type) ? n + 1 : n; }, 0);
                        StaticHelper_1.default.QS_LOG.info(`~~ PAIRING ~~ \n${thisPairing.destination.container} from ${thisPairing.source.container} ::: Match ${k} (${Translation_1.default.nameOf(Dictionary_1.default.Item, match.type).toString()}) :::: Had ${match.had}`);
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
                        StaticHelper_1.default.QS_LOG.info(`TRANSFERRED TO ${dest.container} :: ${match.sent} ${Translation_1.default.nameOf(Dictionary_1.default.Item, match.type).toString()} HAD ${match.had}`);
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
                                StaticHelper_1.default.QS_LOG.warn(`match.had ended up negative (${match.had}). This shouldn't happen wtf. Throwing out.`);
                        }
                    }, this);
                    if (badMatches.length)
                        thisPairing.matches.spliceWhere((_, k) => badMatches.includes(k));
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
        reportMessages(player = this.player) {
            if ((this._state & ITransferHandler_1.THState.error) || !(this._state & ITransferHandler_1.THState.complete))
                return false;
            const itemMgr = this.island.items;
            this._executionResults.forEach(pairList => {
                pairList.forEach(pair => {
                    if (pair.matches.length) {
                        StaticHelper_1.default.QS_LOG.info(`ReportMessages() PAIRING:\n`
                            + `\t${itemMgr.resolveContainer(pair.source.container)}`
                            + `\t${itemMgr.resolveContainer(pair.destination.container)}`);
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
                        StaticHelper_1.default.QS_LOG.info(`ITEM LISTS: All(${str.items.all.length})   Some(${str.items.some.length})    None(${str.items.none.length})`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJhbnNmZXJIYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1RyYW5zZmVySGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBcUJBLFNBQWdCLGVBQWUsQ0FBQyxNQUFjLEVBQUUsSUFBVSxJQUFhLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sS0FBSyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFBM0wsMENBQTJMO0lBRTNMLFNBQWdCLGlCQUFpQixDQUFDLE1BQWMsRUFBRSxJQUFVO1FBQ3hELE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUMxSSxDQUFDO0lBRkQsOENBRUM7SUFDRCxTQUFnQixhQUFhLENBQUMsTUFBYyxFQUFFLElBQVUsSUFBYSxPQUFPLElBQUksQ0FBQyxlQUFlLEVBQUUsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQWhILHNDQUFnSDtJQUNoSCxTQUFnQixvQkFBb0IsQ0FBQyxNQUFjLElBQWtCLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUEzSSxvREFBMkk7SUFFM0ksU0FBZ0IseUJBQXlCLENBQ3JDLE1BQWMsRUFDZCxNQUEwQyxFQUMxQyxJQUF3QyxFQUN4QyxNQUErQixFQUMvQixHQUFTO1FBR1QsR0FBRyxFQUFFLElBQUksQ0FBQywrQkFBK0IsQ0FB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QyxFQUFFLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUM1RSxDQUFDO1FBUU0sTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUF1QyxFQUFFLENBQXVDLEVBQUUsU0FBcUIsRUFBRTtZQUNuSSxNQUFNLE1BQU0sR0FBRyxDQUFDLEdBQUcsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xELE1BQU0sTUFBTSxHQUFHLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFN0MsSUFBRyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUM7Z0JBQUUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUV4RSxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsR0FBRyxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNsRixDQUFDO1FBUU0sTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUF1QyxFQUFFLENBQXVDLEVBQUUsU0FBcUIsRUFBRTtZQUNoSSxNQUFNLE1BQU0sR0FBRyxDQUFDLEdBQUcsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xELE1BQU0sTUFBTSxHQUFHLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFN0MsSUFBRyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUM7Z0JBQUUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUV4RSxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUs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
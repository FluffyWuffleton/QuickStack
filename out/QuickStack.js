var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "mod/Mod", "mod/ModRegistry", "ui/input/IInput", "game/entity/action/usable/actions/UsableActionsMain", "./actions/Actions", "./actions/UsableActionsQuickStack", "ui/input/Bind", "ui/component/Component", "ui/component/CheckButton", "language/Translation", "game/entity/IHuman", "game/item/IItem", "ui/component/Details", "game/item/ItemManager", "ui/component/Text", "ui/component/IComponent", "language/segment/ListSegment", "./QSMatchGroups", "./IStorageCache", "event/EventManager", "event/EventBuses", "game/doodad/Doodad", "utilities/game/TileHelpers", "game/IGame", "utilities/game/TilePosition", "utilities/math/Vector3"], function (require, exports, Mod_1, ModRegistry_1, IInput_1, UsableActionsMain_1, Actions_1, UsableActionsQuickStack_1, Bind_1, Component_1, CheckButton_1, Translation_1, IHuman_1, IItem_1, Details_1, ItemManager_1, Text_1, IComponent_1, ListSegment_1, QSMatchGroups_1, IStorageCache_1, EventManager_1, EventBuses_1, Doodad_1, TileHelpers_1, IGame_1, TilePosition_1, Vector3_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.QSTranslation = exports.GLOBALCONFIG = void 0;
    var GLOBALCONFIG;
    (function (GLOBALCONFIG) {
        GLOBALCONFIG.log_info = true;
        GLOBALCONFIG.pause_length = IHuman_1.Delay.ShortPause;
        GLOBALCONFIG.pass_turn_success = false;
        GLOBALCONFIG.force_isusable = false;
    })(GLOBALCONFIG = exports.GLOBALCONFIG || (exports.GLOBALCONFIG = {}));
    var QSTranslation;
    (function (QSTranslation) {
        QSTranslation[QSTranslation["qsPrefix"] = 0] = "qsPrefix";
        QSTranslation[QSTranslation["qsPrefixShort"] = 1] = "qsPrefixShort";
        QSTranslation[QSTranslation["parenthetical"] = 2] = "parenthetical";
        QSTranslation[QSTranslation["colorPrefix"] = 3] = "colorPrefix";
        QSTranslation[QSTranslation["colorMatchGroup"] = 4] = "colorMatchGroup";
        QSTranslation[QSTranslation["underline"] = 5] = "underline";
        QSTranslation[QSTranslation["concat"] = 6] = "concat";
        QSTranslation[QSTranslation["toX"] = 7] = "toX";
        QSTranslation[QSTranslation["fromX"] = 8] = "fromX";
        QSTranslation[QSTranslation["allX"] = 9] = "allX";
        QSTranslation[QSTranslation["here"] = 10] = "here";
        QSTranslation[QSTranslation["nearby"] = 11] = "nearby";
        QSTranslation[QSTranslation["yourInventory"] = 12] = "yourInventory";
        QSTranslation[QSTranslation["toTile"] = 13] = "toTile";
        QSTranslation[QSTranslation["fromTile"] = 14] = "fromTile";
        QSTranslation[QSTranslation["toUnknown"] = 15] = "toUnknown";
        QSTranslation[QSTranslation["fromUnknown"] = 16] = "fromUnknown";
        QSTranslation[QSTranslation["XOutOfY"] = 17] = "XOutOfY";
        QSTranslation[QSTranslation["mainInventory"] = 18] = "mainInventory";
        QSTranslation[QSTranslation["fullInventory"] = 19] = "fullInventory";
        QSTranslation[QSTranslation["deposit"] = 20] = "deposit";
        QSTranslation[QSTranslation["collect"] = 21] = "collect";
        QSTranslation[QSTranslation["onlyXType"] = 22] = "onlyXType";
        QSTranslation[QSTranslation["allTypes"] = 23] = "allTypes";
        QSTranslation[QSTranslation["thisContainer"] = 24] = "thisContainer";
        QSTranslation[QSTranslation["likeContainers"] = 25] = "likeContainers";
        QSTranslation[QSTranslation["optionTopDown"] = 26] = "optionTopDown";
        QSTranslation[QSTranslation["optionTopDown_desc"] = 27] = "optionTopDown_desc";
        QSTranslation[QSTranslation["optionKeepContainers"] = 28] = "optionKeepContainers";
        QSTranslation[QSTranslation["optionForbidTiles"] = 29] = "optionForbidTiles";
        QSTranslation[QSTranslation["optionMatchSimilar"] = 30] = "optionMatchSimilar";
        QSTranslation[QSTranslation["optionMatchSimilar_desc"] = 31] = "optionMatchSimilar_desc";
    })(QSTranslation = exports.QSTranslation || (exports.QSTranslation = {}));
    ;
    const QSToggleOptionKeys = ["optionForbidTiles", "optionKeepContainers", "optionTopDown"];
    class QuickStack extends Mod_1.default {
        constructor() {
            super(...arguments);
            this.TLGetMain = (id) => Translation_1.default.get(this.dictMain, QSTranslation[id]);
            this.TLGetGroup = (id) => Translation_1.default.get(this.dictGroups, QSMatchGroups_1.QSGroupsTranslation[id]);
            this._anyMatchgroupsActive = false;
        }
        SASeNBind() { return !(0, UsableActionsQuickStack_1.execSASeN)(localPlayer); }
        SAMNBind() { return !(0, UsableActionsQuickStack_1.execSAMN)(localPlayer); }
        SANSeBind() { return !(0, UsableActionsQuickStack_1.execSANSe)(localPlayer); }
        SANMBind() { return !(0, UsableActionsQuickStack_1.execSANM)(localPlayer); }
        get isDedicatedServer() { return this._isDedicatedServer; }
        get localStorageCache() { return this._localStorageCache; }
        localPlayerMoved(host) {
            QuickStack.LOG.info(`localPlayerMoved`);
            if (!host.asLocalPlayer)
                return;
        }
        localPlayerItemAdd(host) {
            QuickStack.LOG.info(`inventoryItemAdd`);
        }
        localPlayerItemRemove(host) {
            QuickStack.LOG.info(`inventoryItemRemove`);
        }
        islandTileUpdated(host, tile, x, y, z, updtype) {
            QuickStack.LOG.info(`TILE UPDATE`);
            if (!host.isLocalIsland)
                return;
            if (!TileHelpers_1.default.isAdjacent(localPlayer.getPoint(), new Vector3_1.default(x, y, z)))
                return;
            switch (updtype) {
                case IGame_1.TileUpdateType.Batch:
                case IGame_1.TileUpdateType.DoodadChangeType:
                case IGame_1.TileUpdateType.DoodadCreate:
                case IGame_1.TileUpdateType.DoodadRemove:
                case IGame_1.TileUpdateType.DoodadOverHidden:
                case IGame_1.TileUpdateType.Item:
                case IGame_1.TileUpdateType.ItemDrop:
                    this.updateLSCNearbyThing(host.items, tile);
                default:
                    return;
            }
        }
        itemsContainerItemAdd(host, item, c) {
            QuickStack.LOG.info(`containerItemAdd\nITEM ${item.getName()}\nTO   ${c}`);
        }
        itemsContainerItemRemove(host, item, c, cpos) {
            QuickStack.LOG.info(`containerItemRemove\nITEM ${item.getName()}\nFROM ${c}\nAT   ${cpos}`);
        }
        itemsContainerItemUpdate(host, item, cFrom, cFpos, c) {
            QuickStack.LOG.info(`containerItemUpdate\nITEM ${item.getName()}\nFROM ${cFrom}\nAT   ${cFpos}\nTO   ${c}`);
        }
        containerContentsAltered(items, container) {
            const topLevel = (c) => (c.containedWithin === undefined ? c : topLevel(c.containedWithin));
            let containerOfInterest = container;
            switch (items.getContainerReference(container, undefined).crt) {
                case IItem_1.ContainerReferenceType.Tile: return;
                case IItem_1.ContainerReferenceType.Item:
                    containerOfInterest = topLevel(container);
                    switch (items.getContainerReference(containerOfInterest, undefined).crt) {
                        case IItem_1.ContainerReferenceType.Tile:
                            return this.updateLSCNearbyThing(items, containerOfInterest);
                        case IItem_1.ContainerReferenceType.Doodad:
                            break;
                        default:
                            return;
                    }
                case IItem_1.ContainerReferenceType.Doodad:
                    return this.updateLSCNearbyThing(items, containerOfInterest);
                default:
                    return;
            }
        }
        updateLSCNearbyThing(items, thing) {
            const thingIsDoodad = Doodad_1.default.is(thing);
            if (!TileHelpers_1.default.isAdjacent(localPlayer.getPoint(), thingIsDoodad ? { x: thing.x, y: thing.y, z: thing.z } : (new Vector3_1.default((0, TilePosition_1.getTilePosition)(thing.data)))))
                return;
            const cachedAt = this._localStorageCache.nearby.findIndex(n => thingIsDoodad
                ? (Doodad_1.default.is(n.entity) && n.entity.id === thing.id)
                : (!Doodad_1.default.is(n.entity) && n.entity.data === thing.data));
            if (cachedAt !== -1)
                this._localStorageCache.nearby[cachedAt].refresh();
            else
                this._localStorageCache.nearby.push(thingIsDoodad ? new IStorageCache_1.StorageCacheDoodad(thing, items) : new IStorageCache_1.StorageCacheTile(thing, items));
            this._localStorageCache.unrollNearby();
        }
        updateLSCNearbyAll(player) {
            this._localStorageCache.nearby.map((n, i) => !!n.refreshRelation() ? undefined : i).filterNullish().reverse().forEach(removeIdx => {
                this._localStorageCache.nearby.splice(removeIdx, 1);
            });
            const cachedNearHashes = this._localStorageCache.nearby.map(n => n.cHash);
            player.island.items.getAdjacentContainers(localPlayer, false).forEach(adj => {
                const adjHash = player.island.items.hashContainer(adj);
                if (!cachedNearHashes.includes(adjHash))
                    if (Doodad_1.default.is(adj))
                        this._localStorageCache.nearby.push(new IStorageCache_1.StorageCacheDoodad(adj, player.island.items));
                    else if (player.island.items.isTileContainer(adj) && "data" in adj)
                        this._localStorageCache.nearby.push(new IStorageCache_1.StorageCacheTile(adj, player.island.items));
                    else if (GLOBALCONFIG.log_info)
                        QuickStack.LOG.warn(`QuickStack::updateLSCNearbyAll()\nUnhandled adjacent container: ${adj}`);
            });
            this._localStorageCache.unrollNearby();
        }
        updateLSCPlayerMain() {
        }
        onLoad() {
            if (!steamworks.isDedicatedServer()) {
                QuickStack.LOG.info("REGISTERiNG HANDlERS");
                this["subscribedHandlers"] = false;
                this.registerEventHandlers("unload");
            }
        }
        onInitialize() {
            this["subscribedHandlers"] = true;
            this.refreshMatchGroupsArray();
        }
        initializeGlobalData(data) {
            const retData = {
                optionTopDown: false,
                optionForbidTiles: false,
                optionKeepContainers: false,
                activeMatchGroups: Object.keys(QSMatchGroups_1.QSMatchableGroups)
                    .reduce((out, KEY) => ({ ...out, [`${KEY}`]: false }), {})
            };
            if (data !== undefined) {
                QSToggleOptionKeys.forEach(KEY => { if (data[KEY] !== undefined)
                    retData[KEY] = data[KEY]; });
                Object.keys(QSMatchGroups_1.QSMatchableGroups).forEach(KEY => {
                    if (data.activeMatchGroups?.[KEY] !== undefined)
                        retData.activeMatchGroups[KEY] = data.activeMatchGroups[KEY];
                });
            }
            return retData;
        }
        get activeMatchGroupsFlattened() { return this._activeMatchGroupsFlattened; }
        get activeMatchGroupsKeys() { return this._activeMatchGroupsKeys; }
        get anyMatchgroupsActive() { return this._anyMatchgroupsActive; }
        refreshMatchGroupsArray() {
            this._activeMatchGroupsKeys = [];
            this._activeMatchGroupsFlattened = {};
            this._anyMatchgroupsActive = false;
            Object.keys(QSMatchGroups_1.QSMatchableGroups).forEach(KEY => {
                if (this.globalData.activeMatchGroups[KEY]) {
                    this._anyMatchgroupsActive = true;
                    this._activeMatchGroupsKeys.push(KEY);
                    this._activeMatchGroupsFlattened[KEY] = [...QSMatchGroups_1.QSMatchableGroups[KEY].flatMap(matchable => matchable in IItem_1.ItemTypeGroup
                            ? [...ItemManager_1.default.getGroupItems(matchable)]
                            : matchable)];
                }
            });
            if (GLOBALCONFIG.log_info) {
                QuickStack.LOG.info(`Updated match groups.`);
                console.log(this._activeMatchGroupsKeys);
                console.log(this._activeMatchGroupsFlattened);
            }
        }
        constructOptionsSection(section) {
            QSToggleOptionKeys.forEach(KEY => {
                const descKey = `${KEY}_desc`;
                new CheckButton_1.CheckButton()
                    .setTooltip(!(descKey in QSTranslation) ? undefined : ttip => ttip
                    .setLocation(IComponent_1.TooltipLocation.CenterRight)
                    .setText(this.TLGetMain(descKey)
                    .withSegments(ListSegment_1.default)))
                    .setText(this.TLGetMain(KEY))
                    .setRefreshMethod(() => !!(this.globalData[KEY] ?? false))
                    .event.subscribe("toggle", (_, checked) => { this.globalData[KEY] = checked; })
                    .appendTo(section);
            });
            new Details_1.default()
                .setSummary(btn => btn
                .setText(this.TLGetMain("optionMatchSimilar"))
                .setTooltip(ttip => ttip
                .setLocation(IComponent_1.TooltipLocation.CenterRight)
                .setText(this.TLGetMain("optionMatchSimilar_desc"))))
                .setBlock(true)
                .append([...Object.keys(QSMatchGroups_1.QSMatchableGroups).map(KEY => new CheckButton_1.CheckButton()
                    .setText(this.TLGetGroup(KEY))
                    .setTooltip(ttip => ttip
                    .setLocation(IComponent_1.TooltipLocation.Mouse)
                    .addBlock(ttblock => ttblock
                    .setTitle(t => t.setText(this.TLGetGroup("MatchGroupIncludes")))
                    .append([...QSMatchGroups_1.QSMatchableGroups[KEY]
                        .map(matchable => new Component_1.default()
                        .setStyle("padding-left", "5ch")
                        .setStyle("text-indent", "-5ch")
                        .append(new Text_1.default()
                        .setText((matchable in IItem_1.ItemType ? this.TLGetGroup("ItemTypeX") : this.TLGetGroup("ItemGroupX"))
                        .addArgs(ItemManager_1.default.getItemTypeGroupName(matchable, false, 1)))))
                ])))
                    .setRefreshMethod(() => !!this.globalData.activeMatchGroups[KEY])
                    .event.subscribe("toggle", (_, checked) => {
                    this.globalData.activeMatchGroups[KEY] = checked;
                    this.refreshMatchGroupsArray();
                }))])
                .appendTo(section);
        }
    }
    __decorate([
        ModRegistry_1.default.dictionary("MainDictionary", QSTranslation)
    ], QuickStack.prototype, "dictMain", void 0);
    __decorate([
        ModRegistry_1.default.dictionary("GroupsDictionary", QSMatchGroups_1.QSGroupsTranslation)
    ], QuickStack.prototype, "dictGroups", void 0);
    __decorate([
        ModRegistry_1.default.message("Search")
    ], QuickStack.prototype, "messageSearch", void 0);
    __decorate([
        ModRegistry_1.default.message("NoMatch")
    ], QuickStack.prototype, "messageNoMatch", void 0);
    __decorate([
        ModRegistry_1.default.message("NoTypeMatch")
    ], QuickStack.prototype, "messageNoTypeMatch", void 0);
    __decorate([
        ModRegistry_1.default.message("StackResult")
    ], QuickStack.prototype, "messageStackResult", void 0);
    __decorate([
        ModRegistry_1.default.action("StackAction", Actions_1.StackAction)
    ], QuickStack.prototype, "actionStackAction", void 0);
    __decorate([
        ModRegistry_1.default.usableActionTypePlaceholder("Self")
    ], QuickStack.prototype, "UAPSelf", void 0);
    __decorate([
        ModRegistry_1.default.usableActionTypePlaceholder("Main")
    ], QuickStack.prototype, "UAPMain", void 0);
    __decorate([
        ModRegistry_1.default.usableActionTypePlaceholder("Sub")
    ], QuickStack.prototype, "UAPSub", void 0);
    __decorate([
        ModRegistry_1.default.usableActionTypePlaceholder("Here")
    ], QuickStack.prototype, "UAPHere", void 0);
    __decorate([
        ModRegistry_1.default.usableActionTypePlaceholder("Alike")
    ], QuickStack.prototype, "UAPAlike", void 0);
    __decorate([
        ModRegistry_1.default.usableActionTypePlaceholder("Nearby")
    ], QuickStack.prototype, "UAPNearby", void 0);
    __decorate([
        ModRegistry_1.default.usableActionTypePlaceholder("DepositMenu")
    ], QuickStack.prototype, "UAPDepositMenu", void 0);
    __decorate([
        ModRegistry_1.default.usableActionTypePlaceholder("StackAllSelfNear")
    ], QuickStack.prototype, "UAPAllSelfNear", void 0);
    __decorate([
        ModRegistry_1.default.usableActionTypePlaceholder("StackAllMainNear")
    ], QuickStack.prototype, "UAPAllMainNear", void 0);
    __decorate([
        ModRegistry_1.default.usableActionTypePlaceholder("StackAllSubNear")
    ], QuickStack.prototype, "UAPAllSubNear", void 0);
    __decorate([
        ModRegistry_1.default.usableActionTypePlaceholder("StackAllLikeNear")
    ], QuickStack.prototype, "UAPAllLikeNear", void 0);
    __decorate([
        ModRegistry_1.default.usableActionTypePlaceholder("StackTypeSelfNear")
    ], QuickStack.prototype, "UAPTypeSelfNear", void 0);
    __decorate([
        ModRegistry_1.default.usableActionTypePlaceholder("StackTypeMainNear")
    ], QuickStack.prototype, "UAPTypeMainNear", void 0);
    __decorate([
        ModRegistry_1.default.usableActionTypePlaceholder("StackTypeHereNear")
    ], QuickStack.prototype, "UAPTypeHereNear", void 0);
    __decorate([
        ModRegistry_1.default.usableActionTypePlaceholder("StackAllNearSelf")
    ], QuickStack.prototype, "UAPAllNearSelf", void 0);
    __decorate([
        ModRegistry_1.default.usableActionTypePlaceholder("StackAllNearMain")
    ], QuickStack.prototype, "UAPAllNearMain", void 0);
    __decorate([
        ModRegistry_1.default.usableActionTypePlaceholder("StackAllMainSub")
    ], QuickStack.prototype, "UAPAllMainSub", void 0);
    __decorate([
        ModRegistry_1.default.usableActionTypePlaceholder("StackAllNearSub")
    ], QuickStack.prototype, "UAPAllNearSub", void 0);
    __decorate([
        ModRegistry_1.default.usableActionTypePlaceholder("StackTypeToHere")
    ], QuickStack.prototype, "UAPTypeToHere", void 0);
    __decorate([
        ModRegistry_1.default.usableActionTypePlaceholder("StackAllToHere")
    ], QuickStack.prototype, "UAPAllToHere", void 0);
    __decorate([
        ModRegistry_1.default.usableActions("QSUsableActions", UsableActionsMain_1.UsableActionSet.ItemMoveMenus, reg => UsableActionsQuickStack_1.UsableActionsQuickStack.register(reg))
    ], QuickStack.prototype, "QSUsableActions", void 0);
    __decorate([
        ModRegistry_1.default.bindable("StackAllSelfNear", IInput_1.IInput.key("Slash", "Shift"))
    ], QuickStack.prototype, "bindableSASeN", void 0);
    __decorate([
        ModRegistry_1.default.bindable("StackAllMainNear")
    ], QuickStack.prototype, "bindableSAMN", void 0);
    __decorate([
        ModRegistry_1.default.bindable("StackAllNearSelf", IInput_1.IInput.key("Slash", "Shift", "Ctrl"))
    ], QuickStack.prototype, "bindableSANSe", void 0);
    __decorate([
        ModRegistry_1.default.bindable("StackAllNearMain")
    ], QuickStack.prototype, "bindableSANM", void 0);
    __decorate([
        Bind_1.default.onDown((0, ModRegistry_1.Registry)().get("bindableSASeN"))
    ], QuickStack.prototype, "SASeNBind", null);
    __decorate([
        Bind_1.default.onDown((0, ModRegistry_1.Registry)().get("bindableSAMN"))
    ], QuickStack.prototype, "SAMNBind", null);
    __decorate([
        Bind_1.default.onDown((0, ModRegistry_1.Registry)().get("bindableSANSe"))
    ], QuickStack.prototype, "SANSeBind", null);
    __decorate([
        Bind_1.default.onDown((0, ModRegistry_1.Registry)().get("bindableSANM"))
    ], QuickStack.prototype, "SANMBind", null);
    __decorate([
        ModRegistry_1.default.bindable("All", IInput_1.IInput.key("a"))
    ], QuickStack.prototype, "bindableAll", void 0);
    __decorate([
        ModRegistry_1.default.bindable("Type", IInput_1.IInput.key("t"))
    ], QuickStack.prototype, "bindableType", void 0);
    __decorate([
        ModRegistry_1.default.bindable("Self", IInput_1.IInput.key("f"))
    ], QuickStack.prototype, "bindableSelf", void 0);
    __decorate([
        ModRegistry_1.default.bindable("Main", IInput_1.IInput.key("t"))
    ], QuickStack.prototype, "bindableMain", void 0);
    __decorate([
        ModRegistry_1.default.bindable("Sub", IInput_1.IInput.key("c"))
    ], QuickStack.prototype, "bindableSub", void 0);
    __decorate([
        ModRegistry_1.default.bindable("Like", IInput_1.IInput.key("c", "Shift"))
    ], QuickStack.prototype, "bindableLike", void 0);
    __decorate([
        ModRegistry_1.default.bindable("Here", IInput_1.IInput.key("h"))
    ], QuickStack.prototype, "bindableHere", void 0);
    __decorate([
        ModRegistry_1.default.bindable("Nearb", IInput_1.IInput.key("n"))
    ], QuickStack.prototype, "bindableNear", void 0);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.LocalPlayer, "moveComplete")
    ], QuickStack.prototype, "localPlayerMoved", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.LocalPlayer, "inventoryItemAdd")
    ], QuickStack.prototype, "localPlayerItemAdd", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.LocalPlayer, "inventoryItemRemove")
    ], QuickStack.prototype, "localPlayerItemRemove", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.LocalIsland, "tileUpdate")
    ], QuickStack.prototype, "islandTileUpdated", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.ItemManager, "containerItemAdd")
    ], QuickStack.prototype, "itemsContainerItemAdd", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.ItemManager, "containerItemRemove")
    ], QuickStack.prototype, "itemsContainerItemRemove", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.ItemManager, "containerItemUpdate")
    ], QuickStack.prototype, "itemsContainerItemUpdate", null);
    __decorate([
        Mod_1.default.globalData("Quick Stack")
    ], QuickStack.prototype, "globalData", void 0);
    __decorate([
        ModRegistry_1.default.optionsSection
    ], QuickStack.prototype, "constructOptionsSection", null);
    __decorate([
        Mod_1.default.instance()
    ], QuickStack, "INSTANCE", void 0);
    __decorate([
        Mod_1.default.log()
    ], QuickStack, "LOG", void 0);
    exports.default = QuickStack;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVpY2tTdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9RdWlja1N0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUF5Q0EsSUFBaUIsWUFBWSxDQUs1QjtJQUxELFdBQWlCLFlBQVk7UUFDWixxQkFBUSxHQUFHLElBQWEsQ0FBQztRQUN6Qix5QkFBWSxHQUFHLGNBQUssQ0FBQyxVQUFtQixDQUFDO1FBQ3pDLDhCQUFpQixHQUFHLEtBQWMsQ0FBQztRQUNuQywyQkFBYyxHQUFHLEtBQWMsQ0FBQztJQUNqRCxDQUFDLEVBTGdCLFlBQVksR0FBWixvQkFBWSxLQUFaLG9CQUFZLFFBSzVCO0lBRUQsSUFBWSxhQWtDWDtJQWxDRCxXQUFZLGFBQWE7UUFDckIseURBQVksQ0FBQTtRQUNaLG1FQUFhLENBQUE7UUFDYixtRUFBYSxDQUFBO1FBQ2IsK0RBQVcsQ0FBQTtRQUNYLHVFQUFlLENBQUE7UUFDZiwyREFBUyxDQUFBO1FBQ1QscURBQU0sQ0FBQTtRQUVOLCtDQUFHLENBQUE7UUFDSCxtREFBSyxDQUFBO1FBQ0wsaURBQUksQ0FBQTtRQUNKLGtEQUFJLENBQUE7UUFDSixzREFBTSxDQUFBO1FBQ04sb0VBQWEsQ0FBQTtRQUNiLHNEQUFNLENBQUE7UUFDTiwwREFBUSxDQUFBO1FBQ1IsNERBQVMsQ0FBQTtRQUNULGdFQUFXLENBQUE7UUFDWCx3REFBTyxDQUFBO1FBQ1Asb0VBQWEsQ0FBQTtRQUNiLG9FQUFhLENBQUE7UUFDYix3REFBTyxDQUFBO1FBQ1Asd0RBQU8sQ0FBQTtRQUNQLDREQUFTLENBQUE7UUFDVCwwREFBUSxDQUFBO1FBQ1Isb0VBQWEsQ0FBQTtRQUNiLHNFQUFjLENBQUE7UUFDZCxvRUFBYSxDQUFBO1FBQ2IsOEVBQWtCLENBQUE7UUFDbEIsa0ZBQW9CLENBQUE7UUFDcEIsNEVBQWlCLENBQUE7UUFDakIsOEVBQWtCLENBQUE7UUFDbEIsd0ZBQXVCLENBQUE7SUFDM0IsQ0FBQyxFQWxDVyxh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
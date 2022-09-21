var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "game/entity/action/usable/actions/UsableActionsMain", "mod/Mod", "mod/ModRegistry", "ui/input/IInput", "event/EventBuses", "event/EventEmitter", "event/EventManager", "game/entity/IHuman", "game/IGame", "game/item/IItem", "game/item/ItemManager", "language/segment/ListSegment", "language/Translation", "ui/component/CheckButton", "ui/component/Component", "ui/component/Details", "ui/component/IComponent", "ui/component/Text", "ui/input/Bind", "utilities/math/Vector3", "./actions/Actions", "./actions/UsableActionsQuickStack", "./LocalStorageCache", "./QSMatchGroups"], function (require, exports, UsableActionsMain_1, Mod_1, ModRegistry_1, IInput_1, EventBuses_1, EventEmitter_1, EventManager_1, IHuman_1, IGame_1, IItem_1, ItemManager_1, ListSegment_1, Translation_1, CheckButton_1, Component_1, Details_1, IComponent_1, Text_1, Bind_1, Vector3_1, Actions_1, UsableActionsQuickStack_1, LocalStorageCache_1, QSMatchGroups_1) {
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
            this.haveCache = false;
            this._anyMatchgroupsActive = false;
        }
        static get MaybeLog() { return GLOBALCONFIG.log_info ? QuickStack.LOG : undefined; }
        SASeNBind() { return !(0, UsableActionsQuickStack_1.execSASeN)(localPlayer); }
        SAMNBind() { return !(0, UsableActionsQuickStack_1.execSAMN)(localPlayer); }
        SANSeBind() { return !(0, UsableActionsQuickStack_1.execSANSe)(localPlayer); }
        SANMBind() { return !(0, UsableActionsQuickStack_1.execSANM)(localPlayer); }
        get localStorageCache() { return this._localStorageCache; }
        localPlayerMoved() {
            if (!this.haveCache)
                return;
            QuickStack.MaybeLog?.info(`\n\t\tEVENT TRIGGERED -- localPlayer.moveComplete\n`);
            this._localStorageCache.setOutdated("nearby");
        }
        localPlayerItemAdd() {
            if (!this.haveCache)
                return;
            QuickStack.MaybeLog?.info(`\n\t\tEVENT TRIGGERED -- localPlayer.inventoryItemAdd\n`);
            this._localStorageCache.setOutdated("player");
        }
        localPlayerItemRemove() {
            if (!this.haveCache)
                return;
            QuickStack.MaybeLog?.info(`\n\t\tEVENT TRIGGERED -- localPlayer.inventoryItemRemove\n`);
            this._localStorageCache.setOutdated("player");
        }
        localPlayerItemUpdate() {
            if (!this.haveCache)
                return;
            QuickStack.MaybeLog?.info(`\n\t\tEVENT TRIGGERED -- localPlayer.inventoryItemUpdate\n`);
            this._localStorageCache.setOutdated("player");
        }
        localPlayerIDChanged(host, curID, newID, absent) {
            if (!this.haveCache)
                return;
            this._localStorageCache.playerNoUpdate.updateHash();
        }
        islandTileUpdated(_host, _tile, x, y, z, updtype) {
            if (!this.haveCache)
                return;
            QuickStack.MaybeLog?.info(`\n\t\tEVENT TRIGGERED -- localIsland.tileUpdate\n\t${[x, y, z].toString()} type '${IGame_1.TileUpdateType[updtype]}'\n`);
            if (!(0, LocalStorageCache_1.isOnOrAdjacent)(this._localStorageCache.playerNoUpdate.entity.getPoint(), new Vector3_1.default(x, y, z)))
                return;
            switch (updtype) {
                case IGame_1.TileUpdateType.Batch:
                case IGame_1.TileUpdateType.DoodadChangeType:
                case IGame_1.TileUpdateType.DoodadCreate:
                case IGame_1.TileUpdateType.DoodadRemove:
                case IGame_1.TileUpdateType.DoodadOverHidden:
                case IGame_1.TileUpdateType.Item:
                case IGame_1.TileUpdateType.ItemDrop:
                    this._localStorageCache.setOutdated("nearby");
                default:
                    return;
            }
        }
        itemsContainerItemAdd(host, _item, c) {
            if (!this.haveCache)
                return;
            QuickStack.MaybeLog?.info(`\n\t\tEVENT TRIGGERED -- ItemManager.containerItemAdd\n\t'${_item.getName()}' to '${c ? host.hashContainer(c) : "undefined"}'\n`);
            this.containerUpdated(host, c, undefined);
        }
        itemsContainerItemRemove(host, _item, c, cpos) {
            if (!this.haveCache)
                return;
            QuickStack.MaybeLog?.info(`\n\t\tEVENT TRIGGERED -- ItemManager.containerItemRemove\n\t'${_item.getName()}' from '${c ? host.hashContainer(c) : "undefined"}'\n`);
            this.containerUpdated(host, c, cpos);
        }
        initCache() {
            this._localStorageCache = new LocalStorageCache_1.LocalStorageCache(localPlayer);
            this.haveCache = true;
        }
        containerUpdated(items, container, cpos) {
            const topLevel = (c) => (c.containedWithin === undefined) ? c : topLevel(c.containedWithin);
            const findIVecValid = (c) => ('x' in c && 'y' in c && 'z' in c) ? c : (c.containedWithin !== undefined) ? findIVecValid(c.containedWithin) : undefined;
            if (container !== undefined) {
                const topLevel = (c) => (c.containedWithin === undefined) ? c : topLevel(c.containedWithin);
                if (items.hashContainer(topLevel(container)) === this._localStorageCache.playerNoUpdate.cHash) {
                    return;
                }
                container = findIVecValid(container);
                cpos = container;
            }
            if (cpos !== undefined) {
                if ((0, LocalStorageCache_1.isOnOrAdjacent)(cpos, this._localStorageCache.playerNoUpdate.entity.getPoint())) {
                    const found = container ? this._localStorageCache.findNearby(items.hashContainer(container)) : undefined;
                    if (!!found) {
                        QuickStack.MaybeLog?.info(`QuickStack.containerUpdated: Updated container '${found.cHash}' identified in cache. Flagging.`);
                        if (this._localStorageCache.setOutdatedSpecific(found.cHash, true))
                            return;
                        else
                            QuickStack.MaybeLog?.info(`QuickStack.containerUpdated: Specific flagging failed...`);
                    }
                    QuickStack.MaybeLog?.info(`QuickStack.containerUpdated: Updated container not found in cache. Flagging 'nearby'.`);
                    this._localStorageCache.setOutdated("nearby");
                }
                return;
            }
            QuickStack.LOG.warn(`QuickStack.containerUpdated\nUnhandled case for container '${container}' at ${cpos}`);
        }
        onInitialize() {
            this["subscribedHandlers"] = true;
            this.refreshMatchGroupsArray();
        }
        onLoad() {
            console.log("ON LOAD");
            if (!steamworks.isDedicatedServer()) {
                this["subscribedHandlers"] = false;
                this.registerEventHandlers("unload");
            }
        }
        onUnload() {
            this.haveCache = false;
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
            if (this.haveCache)
                this._localStorageCache.setOutdated();
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
        ModRegistry_1.default.usableActionTypePlaceholder("All")
    ], QuickStack.prototype, "UAPAll", void 0);
    __decorate([
        ModRegistry_1.default.usableActionTypePlaceholder("Type")
    ], QuickStack.prototype, "UAPType", void 0);
    __decorate([
        ModRegistry_1.default.usableActionTypePlaceholder("DepositMenu")
    ], QuickStack.prototype, "UAPDepositMenu", void 0);
    __decorate([
        ModRegistry_1.default.usableActionTypePlaceholder("CollectMenu")
    ], QuickStack.prototype, "UAPCollectMenu", void 0);
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
        ModRegistry_1.default.bindable("StackAllSelfNear", IInput_1.IInput.key("Slash", "Shift", "Alt"))
    ], QuickStack.prototype, "bindableSASeN", void 0);
    __decorate([
        ModRegistry_1.default.bindable("StackAllMainNear", IInput_1.IInput.key("Slash", "Shift"))
    ], QuickStack.prototype, "bindableSAMN", void 0);
    __decorate([
        ModRegistry_1.default.bindable("StackAllNearSelf", IInput_1.IInput.key("Slash", "Ctrl", "Alt"))
    ], QuickStack.prototype, "bindableSANSe", void 0);
    __decorate([
        ModRegistry_1.default.bindable("StackAllNearMain", IInput_1.IInput.key("Slash", "Ctrl"))
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
        ModRegistry_1.default.bindable("All", IInput_1.IInput.key("KeyA"))
    ], QuickStack.prototype, "bindableAll", void 0);
    __decorate([
        ModRegistry_1.default.bindable("Type", IInput_1.IInput.key("KeyT"))
    ], QuickStack.prototype, "bindableType", void 0);
    __decorate([
        ModRegistry_1.default.bindable("Self", IInput_1.IInput.key("KeyF"))
    ], QuickStack.prototype, "bindableSelf", void 0);
    __decorate([
        ModRegistry_1.default.bindable("Main", IInput_1.IInput.key("KeyM"))
    ], QuickStack.prototype, "bindableMain", void 0);
    __decorate([
        ModRegistry_1.default.bindable("Sub", IInput_1.IInput.key("KeyC"))
    ], QuickStack.prototype, "bindableSub", void 0);
    __decorate([
        ModRegistry_1.default.bindable("Like", IInput_1.IInput.key("KeyC", "Shift"))
    ], QuickStack.prototype, "bindableLike", void 0);
    __decorate([
        ModRegistry_1.default.bindable("Here", IInput_1.IInput.key("KeyH"))
    ], QuickStack.prototype, "bindableHere", void 0);
    __decorate([
        ModRegistry_1.default.bindable("Near", IInput_1.IInput.key("KeyN"))
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
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.LocalPlayer, "inventoryItemUpdate")
    ], QuickStack.prototype, "localPlayerItemUpdate", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.LocalPlayer, "idChanged")
    ], QuickStack.prototype, "localPlayerIDChanged", null);
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
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.LocalPlayer, "loadedOnIsland", EventEmitter_1.Priority.High)
    ], QuickStack.prototype, "initCache", null);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVpY2tTdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9RdWlja1N0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUF1Q0EsSUFBaUIsWUFBWSxDQUs1QjtJQUxELFdBQWlCLFlBQVk7UUFDWixxQkFBUSxHQUFHLElBQWEsQ0FBQztRQUN6Qix5QkFBWSxHQUFHLGNBQUssQ0FBQyxVQUFtQixDQUFDO1FBQ3pDLDhCQUFpQixHQUFHLEtBQWMsQ0FBQztRQUNuQywyQkFBYyxHQUFHLEtBQWMsQ0FBQztJQUNqRCxDQUFDLEVBTGdCLFlBQVksR0FBWixvQkFBWSxLQUFaLG9CQUFZLFFBSzVCO0lBRUQsSUFBWSxhQWtDWDtJQWxDRCxXQUFZLGFBQWE7UUFDckIseURBQVksQ0FBQTtRQUNaLG1FQUFhLENBQUE7UUFDYixtRUFBYSxDQUFBO1FBQ2IsK0RBQVcsQ0FBQTtRQUNYLHVFQUFlLENBQUE7UUFDZiwyREFBUyxDQUFBO1FBQ1QscURBQU0sQ0FBQTtRQUVOLCtDQUFHLENBQUE7UUFDSCxtREFBSyxDQUFBO1FBQ0wsaURBQUksQ0FBQTtRQUNKLGtEQUFJLENBQUE7UUFDSixzREFBTSxDQUFBO1FBQ04sb0VBQWEsQ0FBQTtRQUNiLHNEQUFNLENBQUE7UUFDTiwwREFBUSxDQUFBO1FBQ1IsNERBQVMsQ0FBQTtRQUNULGdFQUFXLENBQUE7UUFDWCx3REFBTyxDQUFBO1FBQ1Asb0VBQWEsQ0FBQTtRQUNiLG9FQUFhLENBQUE7UUFDYix3REFBTyxDQUFBO1FBQ1Asd0RBQU8sQ0FBQTtRQUNQLDREQUFTLENBQUE7UUFDVCwwREFBUSxDQUFBO1FBQ1Isb0VBQWEsQ0FBQTtRQUNiLHNFQUFjLENBQUE7UUFDZCxvRUFBYSxDQUFBO1FBQ2IsOEVBQWtCLENBQUE7UUFDbEIsa0ZBQW9CLENBQUE7UUFDcEIsNEVBQWlCLENBQUE7UUFDakIsOEVBQWtCLENBQUE7UUFDbEIsd0ZBQXVCLENBQUE7SUFDM0IsQ0FBQyxFQWxDVyxh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
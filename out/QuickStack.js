var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "game/entity/action/usable/actions/UsableActionsMain", "mod/Mod", "mod/ModRegistry", "ui/input/IInput", "event/EventBuses", "event/EventManager", "game/entity/IHuman", "game/item/IItem", "game/item/ItemManager", "language/segment/ListSegment", "language/Translation", "ui/component/CheckButton", "ui/component/Component", "ui/component/Details", "ui/component/IComponent", "ui/component/Text", "ui/input/Bind", "./actions/Actions", "./actions/UsableActionsQuickStack", "./LocalStorageCache", "./QSMatchGroups"], function (require, exports, UsableActionsMain_1, Mod_1, ModRegistry_1, IInput_1, EventBuses_1, EventManager_1, IHuman_1, IItem_1, ItemManager_1, ListSegment_1, Translation_1, CheckButton_1, Component_1, Details_1, IComponent_1, Text_1, Bind_1, Actions_1, UsableActionsQuickStack_1, LocalStorageCache_1, QSMatchGroups_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.QSTranslation = exports.GLOBALCONFIG = void 0;
    var GLOBALCONFIG;
    (function (GLOBALCONFIG) {
        GLOBALCONFIG.log_info = true;
        GLOBALCONFIG.pause_length = IHuman_1.Delay.ShortPause;
        GLOBALCONFIG.pass_turn_success = false;
        GLOBALCONFIG.force_isusable = false;
        GLOBALCONFIG.force_menus = false;
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
        static get MaybeLog() { return GLOBALCONFIG.log_info ? QuickStack.LOG : undefined; }
        SASeNBind() { return !(0, UsableActionsQuickStack_1.execSASeN)(localPlayer); }
        SAMNBind() { return !(0, UsableActionsQuickStack_1.execSAMN)(localPlayer); }
        SANSeBind() { return !(0, UsableActionsQuickStack_1.execSANSe)(localPlayer); }
        SANMBind() { return !(0, UsableActionsQuickStack_1.execSANM)(localPlayer); }
        get localStorageCache() { return this._localStorageCache ?? this.initCache(); }
        initCache() {
            this["subscribedHandlers"] = false;
            this.registerEventHandlers("unload");
            return (this._localStorageCache = new LocalStorageCache_1.LocalStorageCache(localPlayer));
        }
        onInitialize() {
            this.refreshMatchGroupsArray();
            this["subscribedHandlers"] = true;
        }
        onUnload() {
            delete (this._localStorageCache);
        }
        localPlayerPostMove() {
            QuickStack.MaybeLog?.info(`\t\tEVENT TRIGGERED -- localPlayer.postMove`);
            this._localStorageCache.setOutdated("nearby");
        }
        localPlayerItemAdd() {
            QuickStack.MaybeLog?.info(`\t\tEVENT TRIGGERED -- localPlayer.inventoryItemAdd`);
            this._localStorageCache.setOutdated("player");
        }
        localPlayerItemRemove() {
            QuickStack.MaybeLog?.info(`\t\tEVENT TRIGGERED -- localPlayer.inventoryItemRemove`);
            this._localStorageCache.setOutdated("player");
        }
        localPlayerItemUpdate() {
            QuickStack.MaybeLog?.info(`\t\tEVENT TRIGGERED -- localPlayer.inventoryItemUpdate`);
            this._localStorageCache.setOutdated("player");
        }
        localPlayerIDChanged(host, curID, newID, absent) {
            this._localStorageCache.playerNoUpdate.updateHash();
        }
        itemsContainerItemAdd(host, _item, c) {
            QuickStack.MaybeLog?.info(`\t\tEVENT TRIGGERED -- ItemManager.containerItemAdd\t\t'${_item.getName()}' to '${c ? host.hashContainer(c) : "undefined"}'`);
            this.containerUpdated(host, c, undefined);
        }
        itemsContainerItemRemove(host, _item, c, cpos) {
            QuickStack.MaybeLog?.info(`\t\tEVENT TRIGGERED -- ItemManager.containerItemRemove\t\t'${_item.getName()}' from '${c ? host.hashContainer(c) : "undefined"}'`);
            this.containerUpdated(host, c, cpos);
        }
        containerUpdated(items, container, cpos) {
            const topLevel = (c) => (c.containedWithin === undefined) ? c : topLevel(c.containedWithin);
            const findIVecValid = (c) => ('x' in c && 'y' in c && 'z' in c) ? c : (c.containedWithin !== undefined) ? findIVecValid(c.containedWithin) : undefined;
            if (container !== undefined) {
                const topLevel = (c) => (c.containedWithin === undefined) ? c : topLevel(c.containedWithin);
                if (items.hashContainer(topLevel(container)) === this._localStorageCache.playerNoUpdate.cHash) {
                    this._localStorageCache.playerNoUpdate.setOutdated(true);
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
            this._localStorageCache?.setOutdated();
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
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.LocalPlayer, "postMove")
    ], QuickStack.prototype, "localPlayerPostMove", null);
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
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.ItemManager, "containerItemAdd")
    ], QuickStack.prototype, "itemsContainerItemAdd", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.ItemManager, "containerItemRemove")
    ], QuickStack.prototype, "itemsContainerItemRemove", null);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVpY2tTdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9RdWlja1N0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFrQ0EsSUFBaUIsWUFBWSxDQU01QjtJQU5ELFdBQWlCLFlBQVk7UUFDWixxQkFBUSxHQUFHLElBQWEsQ0FBQztRQUN6Qix5QkFBWSxHQUFHLGNBQUssQ0FBQyxVQUFtQixDQUFDO1FBQ3pDLDhCQUFpQixHQUFHLEtBQWMsQ0FBQztRQUNuQywyQkFBYyxHQUFHLEtBQWMsQ0FBQztRQUNoQyx3QkFBVyxHQUFHLEtBQWMsQ0FBQztJQUM5QyxDQUFDLEVBTmdCLFlBQVksR0FBWixvQkFBWSxLQUFaLG9CQUFZLFFBTTVCO0lBRUQsSUFBWSxhQWtDWDtJQWxDRCxXQUFZLGFBQWE7UUFDckIseURBQVksQ0FBQTtRQUNaLG1FQUFhLENBQUE7UUFDYixtRUFBYSxDQUFBO1FBQ2IsK0RBQVcsQ0FBQTtRQUNYLHVFQUFlLENBQUE7UUFDZiwyREFBUyxDQUFBO1FBQ1QscURBQU0sQ0FBQTtRQUVOLCtDQUFHLENBQUE7UUFDSCxtREFBSyxDQUFBO1FBQ0wsaURBQUksQ0FBQTtRQUNKLGtEQUFJLENBQUE7UUFDSixzREFBTSxDQUFBO1FBQ04sb0VBQWEsQ0FBQTtRQUNiLHNEQUFNLENBQUE7UUFDTiwwREFBUSxDQUFBO1FBQ1IsNERBQVMsQ0FBQTtRQUNULGdFQUFXLENBQUE7UUFDWCx3REFBTyxDQUFBO1FBQ1Asb0VBQWEsQ0FBQTtRQUNiLG9FQUFhLENBQUE7UUFDYix3REFBTyxDQUFBO1FBQ1Asd0RBQU8sQ0FBQTtRQUNQLDREQUFTLENBQUE7UUFDVCwwREFBUSxDQUFBO1FBQ1Isb0VBQWEsQ0FBQTtRQUNiLHNFQUFjLENBQUE7UUFDZCxvRUFBYSxDQUFBO1FBQ2IsOEVBQWtCLENBQUE7UUFDbEIsa0ZBQW9CLENBQUE7UUFDcEIsNEVBQWlCLENBQUE7UUFDakIsOEVBQWtCLENBQUE7UUFDbEIsd0ZBQXVCLENBQUE7SUFDM0IsQ0FBQyxFQWxDVyxhQUFhLEdBQWIscUJBQWEsS0FBYixxQkFBYSxRQWtDeEI7SUFBQSxDQUFDO0lBSUYsTUFBTSxrQkFBa0IsR0FBaUMsQ0FBQyxtQkFBbUIsRUFBRSxzQkFBc0IsRUFBRSxlQUFlLENBQVUsQ0FBQztJQVFqSSxNQUFxQixVQUFXLFNBQVEsYUFBRztRQUEzQzs7WUFlcUIsY0FBUyxHQUFHLENBQUMsRUFBb0IsRUFBRSxFQUFFLENBQUMscUJBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN4RixlQUFVLEdBQUcsQ0FBQyxFQUEwQixFQUFFLEVBQUUsQ0FBQyxxQkFBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLG1DQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUE4TWhILDBCQUFxQixHQUFZLEtBQUssQ0FBQztRQTZFbkQsQ0FBQztRQXJTVSxNQUFNLEtBQUssUUFBUSxLQUFzQixPQUFPLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUF1RTNDLFNBQVMsS0FBYyxPQUFPLENBQUMsSUFBQSxtQ0FBUyxFQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6RCxRQUFRLEtBQWMsT0FBTyxDQUFDLElBQUEsa0NBQVEsRUFBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckQsU0FBUyxLQUFjLE9BQU8sQ0FBQyxJQUFBLG1DQUFTLEVBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pELFFBQVEsS0FBYyxPQUFPLENBQUMsSUFBQSxrQ0FBUSxFQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQWlCdEgsSUFBVyxpQkFBaUIsS0FBSyxPQUFPLElBQUksQ0FBQyxrQkFBa0IsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRTlFLFNBQVM7WUFDYixJQUFJLENBQUMsb0JBQW9CLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDbkMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3JDLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxxQ0FBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQzFFLENBQUM7UUFFZSxZQUFZO1lBQ3hCLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1lBQy9CLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QyxDQUFDO1FBQ2UsUUFBUTtZQUNwQixPQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDcEMsQ0FBQztRQUdTLG1CQUFtQjtZQUN6QixVQUFVLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO1lBQ3pFLElBQUksQ0FBQyxrQkFBbUIsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbkQsQ0FBQztRQUVTLGtCQUFrQjtZQUN4QixVQUFVLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxxREFBcUQsQ0FBQyxDQUFDO1lBQ2pGLElBQUksQ0FBQyxrQkFBbUIsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbkQsQ0FBQztRQUVTLHFCQUFxQjtZQUMzQixVQUFVLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyx3REFBd0QsQ0FBQyxDQUFDO1lBQ3BGLElBQUksQ0FBQyxrQkFBbUIsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbkQsQ0FBQztRQUVTLHFCQUFxQjtZQUMzQixVQUFVLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyx3REFBd0QsQ0FBQyxDQUFDO1lBQ3BGLElBQUksQ0FBQyxrQkFBbUIsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbkQsQ0FBQztRQUdTLG9CQUFvQixDQUFDLElBQVksRUFBRSxLQUFhLEVBQUUsS0FBYSxFQUFFLE1BQWU7WUFDdEYsSUFBSSxDQUFDLGtCQUFtQixDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUN6RCxDQUFDO1FBS1MscUJBQXFCLENBQUMsSUFBaUIsRUFBRSxLQUFXLEVBQUUsQ0FBYTtZQUN6RSxVQUFVLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQywyREFBMkQsS0FBSyxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztZQUN6SixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUM5QyxDQUFDO1FBR1Msd0JBQXdCLENBQUMsSUFBaUIsRUFBRSxLQUFXLEVBQUUsQ0FBeUIsRUFBRSxJQUEwQjtZQUNwSCxVQUFVLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyw4REFBOEQsS0FBSyxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztZQUM5SixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN6QyxDQUFDO1FBRVMsZ0JBQWdCLENBQUMsS0FBa0IsRUFBRSxTQUFpQyxFQUFFLElBQTBCO1lBQ3hHLE1BQU0sUUFBUSxHQUFrQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDM0gsTUFBTSxhQUFhLEdBQThDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FDbkUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1lBRTlILElBQUcsU0FBUyxLQUFLLFNBQVMsRUFBRTtnQkFDeEIsTUFBTSxRQUFRLEdBQWtDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDM0gsSUFBRyxLQUFLLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxrQkFBbUIsQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFO29CQUczRixJQUFJLENBQUMsa0JBQW1CLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDMUQsT0FBTztpQkFDVjtnQkFDRCxTQUFTLEdBQUcsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNyQyxJQUFJLEdBQUcsU0FBZ0MsQ0FBQzthQUMzQztZQUNELElBQUcsSUFBSSxLQUFLLFNBQVMsRUFBRTtnQkFDbkIsSUFBRyxJQUFBLGtDQUFjLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxrQkFBbUIsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUU7b0JBQ2hGLE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFtQixDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztvQkFDMUcsSUFBRyxDQUFDLENBQUMsS0FBSyxFQUFFO3dCQUNSLFVBQVUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLG1EQUFtRCxLQUFLLENBQUMsS0FBSyxrQ0FBa0MsQ0FBQyxDQUFDO3dCQUM1SCxJQUFHLElBQUksQ0FBQyxrQkFBbUIsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQzs0QkFBRSxPQUFPOzs0QkFDdEUsVUFBVSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsMERBQTBELENBQUMsQ0FBQztxQkFDOUY7b0JBQ0QsVUFBVSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsdUZBQXVGLENBQUMsQ0FBQztvQkFDbkgsSUFBSSxDQUFDLGtCQUFtQixDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDbEQ7Z0JBQ0QsT0FBTzthQUNWO1lBQ0QsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsOERBQThELFNBQVMsUUFBUSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQy9HLENBQUM7UUFPZSxvQkFBb0IsQ0FBQyxJQUFvQjtZQUNyRCxNQUFNLE9BQU8sR0FBa0I7Z0JBQzNCLGFBQWEsRUFBRSxLQUFLO2dCQUNwQixpQkFBaUIsRUFBRSxLQUFLO2dCQUN4QixvQkFBb0IsRUFBRSxLQUFLO2dCQUMzQixpQkFBaUIsRUFBRyxNQUFNLENBQUMsSUFBSSxDQUFDLGlDQUFpQixDQUEyQjtxQkFDdkUsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBNkMsQ0FBQzthQUM1RyxDQUFDO1lBQ0YsSUFBRyxJQUFJLEtBQUssU0FBUyxFQUFFO2dCQUNuQixrQkFBa0IsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxJQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxTQUFTO29CQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUYsTUFBTSxDQUFDLElBQUksQ0FBQyxpQ0FBaUIsQ0FBMkIsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQ3BFLElBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssU0FBUzt3QkFBRSxPQUFPLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNqSCxDQUFDLENBQUMsQ0FBQzthQUNOO1lBQ0QsT0FBTyxPQUFPLENBQUM7UUFDbkIsQ0FBQztRQVFELElBQVcsMEJBQTBCLEtBQWdDLE9BQU8sSUFBSSxDQUFDLDJCQUEyQixDQUFDLENBQUMsQ0FBQztRQU8vRyxJQUFXLHFCQUFxQixLQUE0QixPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7UUFHakcsSUFBVyxvQkFBb0IsS0FBYyxPQUFPLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7UUFFMUUsdUJBQXVCO1lBQzFCLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxFQUFFLENBQUM7WUFDakMsSUFBSSxDQUFDLDJCQUEyQixHQUFHLEVBQUUsQ0FBQztZQUN0QyxJQUFJLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDO1lBQ2xDLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUNBQWlCLENBQTJCLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNwRSxJQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQ3ZDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUM7b0JBQ2xDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3RDLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQ3JDLGlDQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUN2QyxTQUFTLElBQUkscUJBQWE7NEJBQ3RCLENBQUMsQ0FBQyxDQUFDLEdBQUcscUJBQVcsQ0FBQyxhQUFhLENBQUMsU0FBMEIsQ0FBQyxDQUFDOzRCQUM1RCxDQUFDLENBQUMsU0FBcUIsQ0FDOUIsQ0FBQyxDQUFDO2lCQUNWO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDSCxJQUFHLFlBQVksQ0FBQyxRQUFRLEVBQUU7Z0JBQ3RCLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7Z0JBQzdDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7Z0JBQ3pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLDJCQUEyQixDQUFDLENBQUM7YUFDakQ7WUFFRCxJQUFJLENBQUMsa0JBQWtCLEVBQUUsV0FBVyxFQUFFLENBQUM7UUFDM0MsQ0FBQztRQUlNLHVCQUF1QixDQUFDLE9BQWtCO1lBRTdDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDN0IsTUFBTSxPQUFPLEdBQUcsR0FBRyxHQUFHLE9BQWdCLENBQUM7Z0JBQ3ZDLElBQUkseUJBQVcsRUFBRTtxQkFDWixVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUk7cUJBQzdELFdBQVcsQ0FBQyw0QkFBZSxDQUFDLFdBQVcsQ0FBQztxQkFDeEMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBcUMsQ0FBQztxQkFDekQsWUFBWSxDQUFDLHFCQUFXLENBQUMsQ0FBQyxDQUFDO3FCQUNuQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDNUIsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQztxQkFDekQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDOUUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxDQUFDO1lBR0gsSUFBSSxpQkFBTyxFQUFFO2lCQUNSLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUc7aUJBQ2pCLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDLENBQUM7aUJBQzdDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUk7aUJBQ25CLFdBQVcsQ0FBQyw0QkFBZSxDQUFDLFdBQVcsQ0FBQztpQkFDeEMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzVELFFBQVEsQ0FBQyxJQUFJLENBQUM7aUJBQ2QsTUFBTSxDQUFDLENBQUMsR0FDSixNQUFNLENBQUMsSUFBSSxDQUFDLGlDQUFpQixDQUEyQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUkseUJBQVcsRUFBRTtxQkFDakYsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQzdCLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUk7cUJBQ25CLFdBQVcsQ0FBQyw0QkFBZSxDQUFDLEtBQUssQ0FBQztxQkFDbEMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTztxQkFDdkIsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztxQkFDL0QsTUFBTSxDQUFDLENBQUMsR0FBRyxpQ0FBaUIsQ0FBQyxHQUFHLENBQUM7eUJBQzdCLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksbUJBQVMsRUFBd0I7eUJBQ2xELFFBQVEsQ0FBQyxjQUFjLEVBQUUsS0FBSyxDQUFDO3lCQUMvQixRQUFRLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQzt5QkFDL0IsTUFBTSxDQUFDLElBQUksY0FBSSxFQUFFO3lCQUNiLE9BQU8sQ0FBQyxDQUFDLFNBQVMsSUFBSSxnQkFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO3lCQUMxRixPQUFPLENBQUMscUJBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNqRixDQUFDLENBQ0wsQ0FBQztxQkFDTCxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDaEUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUU7b0JBQ3RDLElBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDO29CQUNqRCxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztnQkFDbkMsQ0FBQyxDQUFDLENBQ0wsQ0FBQyxDQUFDO2lCQUNOLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzQixDQUFDO0tBQ0o7SUFoU0c7UUFEQyxxQkFBUSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxhQUFhLENBQUM7Z0RBQ2hCO0lBRXJDO1FBREMscUJBQVEsQ0FBQyxVQUFVLENBQUMsa0JBQWtCLEVBQUUsbUNBQW1CLENBQUM7a0RBQ3ZCO0lBWVY7UUFBM0IscUJBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO3FEQUF3QztJQUN0QztRQUE1QixxQkFBUSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7c0RBQXlDO0lBQ3BDO1FBQWhDLHFCQUFRLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQzswREFBNkM7SUFDNUM7UUFBaEMscUJBQVEsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDOzBEQUE2QztJQUloQztRQUE1QyxxQkFBUSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUscUJBQVcsQ0FBQzt5REFBK0M7SUFHN0M7UUFBN0MscUJBQVEsQ0FBQywyQkFBMkIsQ0FBQyxNQUFNLENBQUM7K0NBQTJDO0lBQzFDO1FBQTdDLHFCQUFRLENBQUMsMkJBQTJCLENBQUMsTUFBTSxDQUFDOytDQUEyQztJQUMzQztRQUE1QyxxQkFBUSxDQUFDLDJCQUEyQixDQUFDLEtBQUssQ0FBQzs4Q0FBMEM7SUFDeEM7UUFBN0MscUJBQVEsQ0FBQywyQkFBMkIsQ0FBQyxNQUFNLENBQUM7K0NBQTJDO0lBQ3pDO1FBQTlDLHFCQUFRLENBQUMsMkJBQTJCLENBQUMsT0FBTyxDQUFDO2dEQUE0QztJQUMxQztRQUEvQyxxQkFBUSxDQUFDLDJCQUEyQixDQUFDLFFBQVEsQ0FBQztpREFBNkM7SUFDL0M7UUFBNUMscUJBQVEsQ0FBQywyQkFBMkIsQ0FBQyxLQUFLLENBQUM7OENBQTBDO0lBQ3hDO1FBQTdDLHFCQUFRLENBQUMsMkJBQTJCLENBQUMsTUFBTSxDQUFDOytDQUEyQztJQUluQztRQUFwRCxxQkFBUSxDQUFDLDJCQUEyQixDQUFDLGFBQWEsQ0FBQztzREFBa0Q7SUFDakQ7UUFBcEQscUJBQVEsQ0FBQywyQkFBMkIsQ0FBQyxhQUFhLENBQUM7c0RBQWtEO0lBQzVDO1FBQXpELHFCQUFRLENBQUMsMkJBQTJCLENBQUMsa0JBQWtCLENBQUM7c0RBQWtEO0lBQ2pEO1FBQXpELHFCQUFRLENBQUMsMkJBQTJCLENBQUMsa0JBQWtCLENBQUM7c0RBQWtEO0lBQ2xEO1FBQXhELHFCQUFRLENBQUMsMkJBQTJCLENBQUMsaUJBQWlCLENBQUM7cURBQWlEO0lBQy9DO1FBQXpELHFCQUFRLENBQUMsMkJBQTJCLENBQUMsa0JBQWtCLENBQUM7c0RBQWtEO0lBQ2hEO1FBQTFELHFCQUFRLENBQUMsMkJBQTJCLENBQUMsbUJBQW1CLENBQUM7dURBQW1EO0lBQ2xEO1FBQTFELHFCQUFRLENBQUMsMkJBQTJCLENBQUMsbUJBQW1CLENBQUM7dURBQW1EO0lBQ2xEO1FBQTFELHFCQUFRLENBQUMsMkJBQTJCLENBQUMsbUJBQW1CLENBQUM7dURBQW1EO0lBQ25EO1FBQXpELHFCQUFRLENBQUMsMkJBQTJCLENBQUMsa0JBQWtCLENBQUM7c0RBQWtEO0lBQ2pEO1FBQXpELHFCQUFRLENBQUMsMkJBQTJCLENBQUMsa0JBQWtCLENBQUM7c0RBQWtEO0lBQ2xEO1FBQXhELHFCQUFRLENBQUMsMkJBQTJCLENBQUMsaUJBQWlCLENBQUM7cURBQWlEO0lBQ2hEO1FBQXhELHFCQUFRLENBQUMsMkJBQTJCLENBQUMsaUJBQWlCLENBQUM7cURBQWlEO0lBQ2hEO1FBQXhELHFCQUFRLENBQUMsMkJBQTJCLENBQUMsaUJBQWlCLENBQUM7cURBQWlEO0lBQ2pEO1FBQXZELHFCQUFRLENBQUMsMkJBQTJCLENBQUMsZ0JBQWdCLENBQUM7b0RBQWdEO0lBS3ZHO1FBREMscUJBQVEsQ0FBQyxhQUFhLENBQUMsaUJBQWlCLEVBQUUsbUNBQWUsQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxpREFBdUIsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7dURBQ2hFO0lBT3FCO1FBQTNFLHFCQUFRLENBQUMsUUFBUSxDQUFDLGtCQUFrQixFQUFFLGVBQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztxREFBeUM7SUFDL0M7UUFBcEUscUJBQVEsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLEVBQUUsZUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7b0RBQXdDO0lBQ2pDO1FBQTFFLHFCQUFRLENBQUMsUUFBUSxDQUFDLGtCQUFrQixFQUFFLGVBQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztxREFBeUM7SUFDL0M7UUFBbkUscUJBQVEsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLEVBQUUsZUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7b0RBQXdDO0lBRWpEO1FBQXpELGNBQUksQ0FBQyxNQUFNLENBQUMsSUFBQSxzQkFBUSxHQUFjLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDOytDQUFnRTtJQUNoRTtRQUF4RCxjQUFJLENBQUMsTUFBTSxDQUFDLElBQUEsc0JBQVEsR0FBYyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQzs4Q0FBOEQ7SUFDNUQ7UUFBekQsY0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFBLHNCQUFRLEdBQWMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7K0NBQWdFO0lBQ2hFO1FBQXhELGNBQUksQ0FBQyxNQUFNLENBQUMsSUFBQSxzQkFBUSxHQUFjLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDOzhDQUE4RDtJQUd4RTtRQUE3QyxxQkFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsZUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQzttREFBdUM7SUFDckM7UUFBOUMscUJBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLGVBQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7b0RBQXdDO0lBQ3ZDO1FBQTlDLHFCQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxlQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29EQUF3QztJQUN2QztRQUE5QyxxQkFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsZUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztvREFBd0M7SUFDeEM7UUFBN0MscUJBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLGVBQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7bURBQXVDO0lBQzVCO1FBQXZELHFCQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxlQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztvREFBd0M7SUFDaEQ7UUFBOUMscUJBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLGVBQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7b0RBQXdDO0lBQ3ZDO1FBQTlDLHFCQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxlQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29EQUF3QztJQXdCdEY7UUFEQyxJQUFBLDJCQUFZLEVBQUMscUJBQVEsQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDO3lEQUk5QztJQUVEO1FBREMsSUFBQSwyQkFBWSxFQUFDLHFCQUFRLENBQUMsV0FBVyxFQUFFLGtCQUFrQixDQUFDO3dEQUl0RDtJQUVEO1FBREMsSUFBQSwyQkFBWSxFQUFDLHFCQUFRLENBQUMsV0FBVyxFQUFFLHFCQUFxQixDQUFDOzJEQUl6RDtJQUVEO1FBREMsSUFBQSwyQkFBWSxFQUFDLHFCQUFRLENBQUMsV0FBVyxFQUFFLHFCQUFxQixDQUFDOzJEQUl6RDtJQUdEO1FBREMsSUFBQSwyQkFBWSxFQUFDLHFCQUFRLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQzswREFHL0M7SUFLRDtRQURDLElBQUEsMkJBQVksRUFBQyxxQkFBUSxDQUFDLFdBQVcsRUFBRSxrQkFBa0IsQ0FBQzsyREFJdEQ7SUFHRDtRQURDLElBQUEsMkJBQVksRUFBQyxxQkFBUSxDQUFDLFdBQVcsRUFBRSxxQkFBcUIsQ0FBQzs4REFJekQ7SUFxQzBDO1FBQTFDLGFBQUcsQ0FBQyxVQUFVLENBQWEsYUFBYSxDQUFDO2tEQUFrQztJQWdFNUU7UUFEQyxxQkFBUSxDQUFDLGNBQWM7NkRBK0N2QjtJQXhTRDtRQURDLGFBQUcsQ0FBQyxRQUFRLEVBQWM7c0NBQ2lCO0lBRTVDO1FBREMsYUFBRyxDQUFDLEdBQUcsRUFBRTtpQ0FDc0I7SUFKcEMsNkJBMlNDIn0=
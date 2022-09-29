var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "game/entity/action/usable/actions/UsableActionsMain", "mod/Mod", "mod/ModRegistry", "ui/input/IInput", "event/EventBuses", "event/EventManager", "game/entity/IHuman", "game/item/IItem", "game/item/ItemManager", "language/segment/ListSegment", "language/Translation", "ui/component/CheckButton", "ui/component/Component", "ui/component/Details", "ui/component/IComponent", "ui/component/Text", "ui/input/Bind", "./actions/Actions", "./actions/UsableActionsQuickStack", "./LocalStorageCache", "./QSMatchGroups"], function (require, exports, UsableActionsMain_1, Mod_1, ModRegistry_1, IInput_1, EventBuses_1, EventManager_1, IHuman_1, IItem_1, ItemManager_1, ListSegment_1, Translation_1, CheckButton_1, Component_1, Details_1, IComponent_1, Text_1, Bind_1, Actions_1, UsableActionsQuickStack_1, LocalStorageCache_1, QSMatchGroups_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.QSTranslation = exports.QSTLUtilies = exports.GLOBALCONFIG = void 0;
    var GLOBALCONFIG;
    (function (GLOBALCONFIG) {
        GLOBALCONFIG.log_info = false;
        GLOBALCONFIG.pause_length = IHuman_1.Delay.ShortPause;
        GLOBALCONFIG.pass_turn_success = false;
        GLOBALCONFIG.force_isusable = false;
        GLOBALCONFIG.force_menus = false;
    })(GLOBALCONFIG = exports.GLOBALCONFIG || (exports.GLOBALCONFIG = {}));
    var QSTLUtilies;
    (function (QSTLUtilies) {
        QSTLUtilies[QSTLUtilies["qsPrefix"] = 0] = "qsPrefix";
        QSTLUtilies[QSTLUtilies["qsPrefixShort"] = 1] = "qsPrefixShort";
        QSTLUtilies[QSTLUtilies["parenthetical"] = 2] = "parenthetical";
        QSTLUtilies[QSTLUtilies["colorPrefix"] = 3] = "colorPrefix";
        QSTLUtilies[QSTLUtilies["colorMatchGroup"] = 4] = "colorMatchGroup";
        QSTLUtilies[QSTLUtilies["colorGround"] = 5] = "colorGround";
        QSTLUtilies[QSTLUtilies["underline"] = 6] = "underline";
        QSTLUtilies[QSTLUtilies["concat"] = 7] = "concat";
    })(QSTLUtilies = exports.QSTLUtilies || (exports.QSTLUtilies = {}));
    ;
    var QSTranslation;
    (function (QSTranslation) {
        QSTranslation[QSTranslation["toX"] = 0] = "toX";
        QSTranslation[QSTranslation["fromX"] = 1] = "fromX";
        QSTranslation[QSTranslation["fromXtoY"] = 2] = "fromXtoY";
        QSTranslation[QSTranslation["allX"] = 3] = "allX";
        QSTranslation[QSTranslation["here"] = 4] = "here";
        QSTranslation[QSTranslation["nearby"] = 5] = "nearby";
        QSTranslation[QSTranslation["yourInventory"] = 6] = "yourInventory";
        QSTranslation[QSTranslation["toTile"] = 7] = "toTile";
        QSTranslation[QSTranslation["fromTile"] = 8] = "fromTile";
        QSTranslation[QSTranslation["toUnknown"] = 9] = "toUnknown";
        QSTranslation[QSTranslation["fromUnknown"] = 10] = "fromUnknown";
        QSTranslation[QSTranslation["XOutOfY"] = 11] = "XOutOfY";
        QSTranslation[QSTranslation["mainInventory"] = 12] = "mainInventory";
        QSTranslation[QSTranslation["fullInventory"] = 13] = "fullInventory";
        QSTranslation[QSTranslation["facingTile"] = 14] = "facingTile";
        QSTranslation[QSTranslation["deposit"] = 15] = "deposit";
        QSTranslation[QSTranslation["collect"] = 16] = "collect";
        QSTranslation[QSTranslation["onlyXType"] = 17] = "onlyXType";
        QSTranslation[QSTranslation["allTypes"] = 18] = "allTypes";
        QSTranslation[QSTranslation["thisContainer"] = 19] = "thisContainer";
        QSTranslation[QSTranslation["likeContainers"] = 20] = "likeContainers";
        QSTranslation[QSTranslation["optionTopDown"] = 21] = "optionTopDown";
        QSTranslation[QSTranslation["optionTopDown_desc"] = 22] = "optionTopDown_desc";
        QSTranslation[QSTranslation["optionKeepContainers"] = 23] = "optionKeepContainers";
        QSTranslation[QSTranslation["optionForbidTiles"] = 24] = "optionForbidTiles";
        QSTranslation[QSTranslation["optionMatchSimilar"] = 25] = "optionMatchSimilar";
        QSTranslation[QSTranslation["optionMatchSimilar_desc"] = 26] = "optionMatchSimilar_desc";
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
        static get MaybeLog() {
            if (!this._maybeLog) {
                this._maybeLog = this.LOG;
                if (!GLOBALCONFIG.log_info)
                    this._maybeLog.info = (..._) => void {};
            }
            return this._maybeLog;
        }
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
        localPlayerChangeZ() {
            QuickStack.MaybeLog?.info(`\t\tEVENT TRIGGERED -- localPlayer.changeZ`);
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
        localPlayerIDChanged(host) {
            QuickStack.MaybeLog?.info(`\t\tEVENT TRIGGERED -- localPlayer.idChanged`);
            if (host !== localPlayer)
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
        ModRegistry_1.default.dictionary("Utilities", QSTLUtilies)
    ], QuickStack.prototype, "dictUtil", void 0);
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
        ModRegistry_1.default.usableActionTypePlaceholder("Near")
    ], QuickStack.prototype, "UAPNear", void 0);
    __decorate([
        ModRegistry_1.default.usableActionTypePlaceholder("Face")
    ], QuickStack.prototype, "UAPFace", void 0);
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
        ModRegistry_1.default.bindable("Deposit", IInput_1.IInput.key("KeyD", "Shift"))
    ], QuickStack.prototype, "bindableDeposit", void 0);
    __decorate([
        ModRegistry_1.default.bindable("Collect", IInput_1.IInput.key("KeyC", "Shift"))
    ], QuickStack.prototype, "bindableCollect", void 0);
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
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.LocalPlayer, "changeZ")
    ], QuickStack.prototype, "localPlayerChangeZ", null);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVpY2tTdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9RdWlja1N0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFpQ0EsSUFBaUIsWUFBWSxDQU01QjtJQU5ELFdBQWlCLFlBQVk7UUFDWixxQkFBUSxHQUFHLEtBQWMsQ0FBQztRQUMxQix5QkFBWSxHQUFHLGNBQUssQ0FBQyxVQUFtQixDQUFDO1FBQ3pDLDhCQUFpQixHQUFHLEtBQWMsQ0FBQztRQUNuQywyQkFBYyxHQUFHLEtBQWMsQ0FBQztRQUNoQyx3QkFBVyxHQUFHLEtBQWMsQ0FBQztJQUM5QyxDQUFDLEVBTmdCLFlBQVksR0FBWixvQkFBWSxLQUFaLG9CQUFZLFFBTTVCO0lBRUQsSUFBWSxXQVNYO0lBVEQsV0FBWSxXQUFXO1FBQ25CLHFEQUFZLENBQUE7UUFDWiwrREFBYSxDQUFBO1FBQ2IsK0RBQWEsQ0FBQTtRQUNiLDJEQUFXLENBQUE7UUFDWCxtRUFBZSxDQUFBO1FBQ2YsMkRBQVcsQ0FBQTtRQUNYLHVEQUFTLENBQUE7UUFDVCxpREFBTSxDQUFBO0lBQ1YsQ0FBQyxFQVRXLFdBQVcsR0FBWCxtQkFBVyxLQUFYLG1CQUFXLFFBU3RCO0lBQUEsQ0FBQztJQUdGLElBQVksYUE0Qlg7SUE1QkQsV0FBWSxhQUFhO1FBQ3JCLCtDQUFHLENBQUE7UUFDSCxtREFBSyxDQUFBO1FBQ0wseURBQVEsQ0FBQTtRQUNSLGlEQUFJLENBQUE7UUFDSixpREFBSSxDQUFBO1FBQ0oscURBQU0sQ0FBQTtRQUNOLG1FQUFhLENBQUE7UUFDYixxREFBTSxDQUFBO1FBQ04seURBQVEsQ0FBQTtRQUNSLDJEQUFTLENBQUE7UUFDVCxnRUFBVyxDQUFBO1FBQ1gsd0RBQU8sQ0FBQTtRQUNQLG9FQUFhLENBQUE7UUFDYixvRUFBYSxDQUFBO1FBQ2IsOERBQVUsQ0FBQTtRQUNWLHdEQUFPLENBQUE7UUFDUCx3REFBTyxDQUFBO1FBQ1AsNERBQVMsQ0FBQTtRQUNULDBE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
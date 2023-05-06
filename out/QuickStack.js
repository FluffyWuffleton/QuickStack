var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "game/entity/action/usable/actions/UsableActionsMain", "mod/Mod", "mod/ModRegistry", "ui/input/IInput", "event/EventBuses", "event/EventManager", "game/entity/IHuman", "game/item/IItem", "game/item/ItemManager", "language/segment/ListSegment", "language/Translation", "ui/component/CheckButton", "ui/component/Component", "ui/component/Details", "ui/component/Text", "ui/input/Bind", "./actions/Actions", "./actions/UsableActionsQuickStack", "./LocalStorageCache", "./QSMatchGroups", "event/EventEmitter"], function (require, exports, UsableActionsMain_1, Mod_1, ModRegistry_1, IInput_1, EventBuses_1, EventManager_1, IHuman_1, IItem_1, ItemManager_1, ListSegment_1, Translation_1, CheckButton_1, Component_1, Details_1, Text_1, Bind_1, Actions_1, UsableActionsQuickStack_1, LocalStorageCache_1, QSMatchGroups_1, EventEmitter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.QSTranslation = exports.QSTLUtilies = exports.GLOBALCONFIG = void 0;
    var GLOBALCONFIG;
    (function (GLOBALCONFIG) {
        GLOBALCONFIG.log_info = true;
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
            this.registerEventHandlersOnPreLoad = false;
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
            this.registerEventHandlers("unload");
            return this._localStorageCache = new LocalStorageCache_1.LocalStorageCache(localPlayer);
        }
        preLoadHandler() {
            Bind_1.default.registerHandlers(this);
        }
        onInitialize() {
            this.refreshMatchGroupsArray(true);
        }
        onLoad() {
            this.refreshMatchGroupsArray();
        }
        onUnload() {
            delete this._localStorageCache;
            this._localStorageCache = undefined;
        }
        outdatedNearby() { this._localStorageCache.setOutdated("nearby"); }
        outdatedPlayer() { this._localStorageCache.setOutdated("player"); }
        localPlayerIDChanged() { this._localStorageCache.playerNoUpdate.updateHash(); }
        itemsContainerItemAdd(host, _item, c, opt) {
            this.containerUpdated(host, c, undefined);
        }
        itemsContainerItemRemove(host, _item, c, cpos) {
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
                if ((0, LocalStorageCache_1.isOnOrAdjacent)(cpos, this._localStorageCache.playerNoUpdate.entity.point)) {
                    const found = container ? this._localStorageCache.findNearby(items.hashContainer(container)) : undefined;
                    if (!!found) {
                        QuickStack.MaybeLog.info(`QuickStack.containerUpdated: Updated container '${found.cHash}' identified in cache. Flagging.`);
                        if (this._localStorageCache.setOutdatedSpecific(found.cHash, true))
                            return;
                        else
                            QuickStack.MaybeLog.info(`QuickStack.containerUpdated: Specific flagging failed...`);
                    }
                    QuickStack.MaybeLog.info(`QuickStack.containerUpdated: Updated container not found in cache. Flagging 'nearby'.`);
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
        refreshMatchGroupsArray(initOnly) {
            this._activeMatchGroupsKeys = [];
            this._activeMatchGroupsFlattened = {};
            this._anyMatchgroupsActive = false;
            if (!initOnly)
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
                    .setLocation("aligned right", "center")
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
                .setLocation("aligned right", "center")
                .setText(this.TLGetMain("optionMatchSimilar_desc"))))
                .setBlock(true)
                .append([...Object.keys(QSMatchGroups_1.QSMatchableGroups).map(KEY => new CheckButton_1.CheckButton()
                    .setText(this.TLGetGroup(KEY))
                    .setTooltip(ttip => ttip
                    .setLocation("mouse")
                    .addBlock(ttblock => ttblock
                    .setTitle(t => t.setText(this.TLGetGroup("MatchGroupIncludes")))
                    .append([...QSMatchGroups_1.QSMatchableGroups[KEY]
                        .map(matchable => new Component_1.default()
                        .setStyle("padding-left", "5ch")
                        .setStyle("text-indent", "-5ch")
                        .append(new Text_1.default()
                        .setText((matchable in IItem_1.ItemType ? this.TLGetGroup("ItemTypeX") : this.TLGetGroup("ItemGroupX"))
                        .addArgs(ItemManager_1.default.getItemTypeGroupName(matchable, Translation_1.Article.None, 1)))))
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
        (0, EventManager_1.OwnEventHandler)(QuickStack, "preLoad", EventEmitter_1.Priority.High)
    ], QuickStack.prototype, "preLoadHandler", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.LocalPlayer, "postMove"),
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.LocalPlayer, "changeZ")
    ], QuickStack.prototype, "outdatedNearby", null);
    __decorate([
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.LocalPlayer, "inventoryItemAdd"),
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.LocalPlayer, "inventoryItemRemove"),
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.LocalPlayer, "inventoryItemUpdate")
    ], QuickStack.prototype, "outdatedPlayer", null);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVpY2tTdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9RdWlja1N0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFrQ0EsSUFBaUIsWUFBWSxDQU01QjtJQU5ELFdBQWlCLFlBQVk7UUFDWixxQkFBUSxHQUFHLElBQWEsQ0FBQztRQUN6Qix5QkFBWSxHQUFHLGNBQUssQ0FBQyxVQUFtQixDQUFDO1FBQ3pDLDhCQUFpQixHQUFHLEtBQWMsQ0FBQztRQUNuQywyQkFBYyxHQUFHLEtBQWMsQ0FBQztRQUNoQyx3QkFBVyxHQUFHLEtBQWMsQ0FBQztJQUM5QyxDQUFDLEVBTmdCLFlBQVksR0FBWixvQkFBWSxLQUFaLG9CQUFZLFFBTTVCO0lBRUQsSUFBWSxXQVNYO0lBVEQsV0FBWSxXQUFXO1FBQ25CLHFEQUFZLENBQUE7UUFDWiwrREFBYSxDQUFBO1FBQ2IsK0RBQWEsQ0FBQTtRQUNiLDJEQUFXLENBQUE7UUFDWCxtRUFBZSxDQUFBO1FBQ2YsMkRBQVcsQ0FBQTtRQUNYLHVEQUFTLENBQUE7UUFDVCxpREFBTSxDQUFBO0lBQ1YsQ0FBQyxFQVRXLFdBQVcsR0FBWCxtQkFBVyxLQUFYLG1CQUFXLFFBU3RCO0lBQUEsQ0FBQztJQUdGLElBQVksYUE0Qlg7SUE1QkQsV0FBWSxhQUFhO1FBQ3JCLCtDQUFHLENBQUE7UUFDSCxtREFBSyxDQUFBO1FBQ0wseURBQVEsQ0FBQTtRQUNSLGlEQUFJLENBQUE7UUFDSixpREFBSSxDQUFBO1FBQ0oscURBQU0sQ0FBQTtRQUNOLG1FQUFhLENBQUE7UUFDYixxREFBTSxDQUFBO1FBQ04seURBQVEsQ0FBQTtRQUNSLDJEQUFTLENBQUE7UUFDVCxnRUFBVyxDQUFBO1FBQ1gsd0RBQU8sQ0FBQTtRQUNQLG9FQUFhLENBQUE7UUFDYixvRUFBYSxDQUFBO1FBQ2IsOERBQVUsQ0FBQTtRQUNWLHdEQUFPLENBQUE7UUFDUCx3REFBTyxDQUFBO1FBQ1AsNERBQVMsQ0FBQTtRQUNULDBE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
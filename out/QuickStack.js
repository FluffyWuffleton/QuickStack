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
        preLoadHandler() { Bind_1.default.registerHandlers(this); }
        postFieldOfView() {
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
        (0, EventManager_1.EventHandler)(EventBuses_1.EventBus.Game, "postFieldOfView")
    ], QuickStack.prototype, "postFieldOfView", null);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVpY2tTdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9RdWlja1N0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFrQ0EsSUFBaUIsWUFBWSxDQU01QjtJQU5ELFdBQWlCLFlBQVk7UUFDWixxQkFBUSxHQUFHLEtBQWMsQ0FBQztRQUMxQix5QkFBWSxHQUFHLGNBQUssQ0FBQyxVQUFtQixDQUFDO1FBQ3pDLDhCQUFpQixHQUFHLEtBQWMsQ0FBQztRQUNuQywyQkFBYyxHQUFHLEtBQWMsQ0FBQztRQUNoQyx3QkFBVyxHQUFHLEtBQWMsQ0FBQztJQUM5QyxDQUFDLEVBTmdCLFlBQVksR0FBWixvQkFBWSxLQUFaLG9CQUFZLFFBTTVCO0lBRUQsSUFBWSxXQVNYO0lBVEQsV0FBWSxXQUFXO1FBQ25CLHFEQUFZLENBQUE7UUFDWiwrREFBYSxDQUFBO1FBQ2IsK0RBQWEsQ0FBQTtRQUNiLDJEQUFXLENBQUE7UUFDWCxtRUFBZSxDQUFBO1FBQ2YsMkRBQVcsQ0FBQTtRQUNYLHVEQUFTLENBQUE7UUFDVCxpREFBTSxDQUFBO0lBQ1YsQ0FBQyxFQVRXLFdBQVcsR0FBWCxtQkFBVyxLQUFYLG1CQUFXLFFBU3RCO0lBQUEsQ0FBQztJQUdGLElBQVksYUE0Qlg7SUE1QkQsV0FBWSxhQUFhO1FBQ3JCLCtDQUFHLENBQUE7UUFDSCxtREFBSyxDQUFBO1FBQ0wseURBQVEsQ0FBQTtRQUNSLGlEQUFJLENBQUE7UUFDSixpREFBSSxDQUFBO1FBQ0oscURBQU0sQ0FBQTtRQUNOLG1FQUFhLENBQUE7UUFDYixxREFBTSxDQUFBO1FBQ04seURBQVEsQ0FBQTtRQUNSLDJEQUFTLENBQUE7UUFDVCxnRUFBVyxDQUFBO1FBQ1gsd0RBQU8sQ0FBQTtRQUNQLG9FQUFhLENBQUE7UUFDYixvRUFBYSxDQUFBO1FBQ2IsOERBQVUsQ0FBQTtRQUNWLHdEQUFPLENBQUE7UUFDUCx3REFBTyxDQUFBO1FBQ1AsNERBQVMsQ0FBQTtRQUNULDBE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
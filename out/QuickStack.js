var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "mod/Mod", "mod/ModRegistry", "ui/input/IInput", "game/entity/action/usable/actions/UsableActionsMain", "./actions/Actions", "./actions/UsableActionsQuickStack", "ui/input/Bind", "ui/component/Component", "ui/component/CheckButton", "language/Translation", "game/entity/IHuman", "game/item/IItem", "ui/component/Details", "game/item/ItemManager", "ui/component/Text", "ui/component/IComponent", "language/segment/ListSegment", "./QSMatchGroups"], function (require, exports, Mod_1, ModRegistry_1, IInput_1, UsableActionsMain_1, Actions_1, UsableActionsQuickStack_1, Bind_1, Component_1, CheckButton_1, Translation_1, IHuman_1, IItem_1, Details_1, ItemManager_1, Text_1, IComponent_1, ListSegment_1, QSMatchGroups_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.activeGroupKeyPrefix = exports.QSTranslation = exports.GLOBALCONFIG = void 0;
    var GLOBALCONFIG;
    (function (GLOBALCONFIG) {
        GLOBALCONFIG.log_info = false;
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
    exports.activeGroupKeyPrefix = "isActive_";
    class QuickStack extends Mod_1.default {
        constructor() {
            super(...arguments);
            this.TLGetMain = (id) => Translation_1.default.get(this.dictMain, QSTranslation[id]);
            this.TLGetGroup = (id) => Translation_1.default.get(this.dictGroups, QSMatchGroups_1.QSGroupsTranslation[id]);
            this._activeMatchGroupsKeys = [];
            this._anyMatchgroupsActive = false;
        }
        SASeNBind() { return !(0, UsableActionsQuickStack_1.execSASeN)(localPlayer); }
        SAMNBind() { return !(0, UsableActionsQuickStack_1.execSAMN)(localPlayer); }
        SANSeBind() { return !(0, UsableActionsQuickStack_1.execSANSe)(localPlayer); }
        SANMBind() { return !(0, UsableActionsQuickStack_1.execSANM)(localPlayer); }
        initializeGlobalData(data) {
            const retData = this.freshGlobalData();
            if (!data)
                return retData;
            retData.optionForbidTiles = data.optionForbidTiles;
            retData.optionKeepContainers = data.optionKeepContainers;
            retData.optionTopDown = data.optionTopDown;
            Object.keys(QSMatchGroups_1.QSMatchableGroups).forEach(KEY => {
                if (data.activeMatchGroups?.[KEY] !== undefined)
                    retData.activeMatchGroups[KEY] = data.activeMatchGroups[KEY];
            });
            return retData;
        }
        freshGlobalData() {
            return {
                optionTopDown: false,
                optionForbidTiles: false,
                optionKeepContainers: false,
                activeMatchGroups: Object.keys(QSMatchGroups_1.QSMatchableGroups)
                    .reduce((out, KEY) => ({ ...out, [`${KEY}`]: false }), {})
            };
        }
        onInitialize() {
            this.refreshMatchGroupsArray();
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
            const QSToggleKeys = ["optionForbidTiles", "optionKeepContainers", "optionTopDown"];
            QSToggleKeys.forEach(KEY => {
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
        ModRegistry_1.default.usableActionType("QuickStackDepositMenu")
    ], QuickStack.prototype, "UAPDepositMenu", void 0);
    __decorate([
        ModRegistry_1.default.usableActionType("StackAllSelfNearby")
    ], QuickStack.prototype, "UAPAllSelfNearby", void 0);
    __decorate([
        ModRegistry_1.default.usableActionTypePlaceholder("StackAllMainNearby")
    ], QuickStack.prototype, "UAPAllMainNearby", void 0);
    __decorate([
        ModRegistry_1.default.usableActionTypePlaceholder("StackAllSubNearby")
    ], QuickStack.prototype, "UAPAllSubNearby", void 0);
    __decorate([
        ModRegistry_1.default.usableActionTypePlaceholder("StackAllAlikeSubNearby")
    ], QuickStack.prototype, "UAPAllAlikeSubNearby", void 0);
    __decorate([
        ModRegistry_1.default.usableActionType("StackTypeSelfNearby")
    ], QuickStack.prototype, "UAPTypeSelfNearby", void 0);
    __decorate([
        ModRegistry_1.default.usableActionTypePlaceholder("StackTypeMainNearby")
    ], QuickStack.prototype, "UAPTypeMainNearby", void 0);
    __decorate([
        ModRegistry_1.default.usableActionTypePlaceholder("StackTypeHereNearby")
    ], QuickStack.prototype, "UAPTypeHereNearby", void 0);
    __decorate([
        ModRegistry_1.default.usableActionType("StackAllNearbySelf")
    ], QuickStack.prototype, "UAPAllNearbySelf", void 0);
    __decorate([
        ModRegistry_1.default.usableActionTypePlaceholder("StackAllNearbyMain")
    ], QuickStack.prototype, "UAPAllNearbyMain", void 0);
    __decorate([
        ModRegistry_1.default.usableActionTypePlaceholder("StackAllMainSub")
    ], QuickStack.prototype, "UAPAllMainSub", void 0);
    __decorate([
        ModRegistry_1.default.usableActionTypePlaceholder("StackAllNearbySub")
    ], QuickStack.prototype, "UAPAllNearbySub", void 0);
    __decorate([
        ModRegistry_1.default.usableActionType("StackTypeToHere")
    ], QuickStack.prototype, "UAPTypeToHere", void 0);
    __decorate([
        ModRegistry_1.default.usableActionType("StackAllToHere")
    ], QuickStack.prototype, "UAPAllToHere", void 0);
    __decorate([
        ModRegistry_1.default.usableActions("QSUsableActions", UsableActionsMain_1.UsableActionSet.ItemMoveMenus, reg => UsableActionsQuickStack_1.UsableActionsQuickStack.register(reg))
    ], QuickStack.prototype, "QSUsableActions", void 0);
    __decorate([
        ModRegistry_1.default.bindable("StackAllSelfNearby", IInput_1.IInput.key("Slash", "Shift"))
    ], QuickStack.prototype, "bindableSASeN", void 0);
    __decorate([
        ModRegistry_1.default.bindable("StackAllMainNearby")
    ], QuickStack.prototype, "bindableSAMN", void 0);
    __decorate([
        ModRegistry_1.default.bindable("StackAllNearbySelf", IInput_1.IInput.key("Slash", "Shift", "Ctrl"))
    ], QuickStack.prototype, "bindableSANSe", void 0);
    __decorate([
        ModRegistry_1.default.bindable("StackAllNearbyMain")
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
        ModRegistry_1.default.bindable("Alike", IInput_1.IInput.key("c", "Shift"))
    ], QuickStack.prototype, "bindableAlike", void 0);
    __decorate([
        ModRegistry_1.default.bindable("Here", IInput_1.IInput.key("h"))
    ], QuickStack.prototype, "bindableHere", void 0);
    __decorate([
        ModRegistry_1.default.bindable("Nearby", IInput_1.IInput.key("n"))
    ], QuickStack.prototype, "bindableNearby", void 0);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVpY2tTdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9RdWlja1N0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUE0QkEsSUFBaUIsWUFBWSxDQUs1QjtJQUxELFdBQWlCLFlBQVk7UUFDWixxQkFBUSxHQUFHLEtBQWMsQ0FBQztRQUMxQix5QkFBWSxHQUFHLGNBQUssQ0FBQyxVQUFtQixDQUFDO1FBQ3pDLDhCQUFpQixHQUFHLEtBQWMsQ0FBQztRQUNuQywyQkFBYyxHQUFHLEtBQWMsQ0FBQztJQUNqRCxDQUFDLEVBTGdCLFlBQVksR0FBWixvQkFBWSxLQUFaLG9CQUFZLFFBSzVCO0lBRUQsSUFBWSxhQW1DWDtJQW5DRCxXQUFZLGFBQWE7UUFDckIseURBQVksQ0FBQTtRQUNaLG1FQUFhLENBQUE7UUFDYixtRUFBYSxDQUFBO1FBQ2IsK0RBQVcsQ0FBQTtRQUNYLHVFQUFlLENBQUE7UUFDZiwyREFBUyxDQUFBO1FBQ1QscURBQU0sQ0FBQTtRQUVOLCtDQUFHLENBQUE7UUFDSCxtREFBSyxDQUFBO1FBQ0wsaURBQUksQ0FBQTtRQUNKLGtEQUFJLENBQUE7UUFDSixzREFBTSxDQUFBO1FBQ04sb0VBQWEsQ0FBQTtRQUNiLHNEQUFNLENBQUE7UUFDTiwwREFBUSxDQUFBO1FBQ1IsNERBQVMsQ0FBQTtRQUNULGdFQUFXLENBQUE7UUFDWCx3REFBTyxDQUFBO1FBQ1Asb0VBQWEsQ0FBQTtRQUNiLG9FQUFhLENBQUE7UUFDYix3REFBTyxDQUFBO1FBQ1Asd0RBQU8sQ0FBQTtRQUNQLDREQUFTLENBQUE7UUFDVCwwREFBUSxDQUFBO1FBQ1Isb0VBQWEsQ0FBQTtRQUNiLHNFQUFjLENBQUE7UUFDZCxvRUFBYSxDQUFBO1FBQ2IsOEVBQWtCLENBQUE7UUFDbEIsa0ZBQW9CLENBQUE7UUFDcEIsNEVBQWlCLENBQUE7UUFFakIsOEVBQWtCLENBQUE7UUFDbEIsd0ZBQXVCLENBQUE7SUFDM0IsQ0FBQyxFQW5DVyxh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
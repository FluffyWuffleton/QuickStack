var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "mod/Mod", "mod/ModRegistry", "ui/input/IInput", "game/entity/action/usable/actions/UsableActionsMain", "./actions/Actions", "./actions/UsableActionsQuickStack", "ui/input/Bind", "ui/component/Component", "ui/component/CheckButton", "language/Translation", "game/entity/IHuman", "game/item/IItem", "ui/component/Details", "game/item/ItemManager", "ui/component/Text", "ui/component/IComponent", "language/segment/ListSegment"], function (require, exports, Mod_1, ModRegistry_1, IInput_1, UsableActionsMain_1, Actions_1, UsableActionsQuickStack_1, Bind_1, Component_1, CheckButton_1, Translation_1, IHuman_1, IItem_1, Details_1, ItemManager_1, Text_1, IComponent_1, ListSegment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.activeGroupKeyPrefix = exports.QSMatchableGroups = exports.QSTranslation = exports.GLOBALCONFIG = void 0;
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
        QSTranslation[QSTranslation["Projectile"] = 32] = "Projectile";
        QSTranslation[QSTranslation["ProjectileWeapon"] = 33] = "ProjectileWeapon";
        QSTranslation[QSTranslation["Equipment"] = 34] = "Equipment";
        QSTranslation[QSTranslation["Edible"] = 35] = "Edible";
        QSTranslation[QSTranslation["Raw"] = 36] = "Raw";
        QSTranslation[QSTranslation["Medical"] = 37] = "Medical";
        QSTranslation[QSTranslation["Potable"] = 38] = "Potable";
        QSTranslation[QSTranslation["Unpotable"] = 39] = "Unpotable";
        QSTranslation[QSTranslation["Rock"] = 40] = "Rock";
        QSTranslation[QSTranslation["Poles"] = 41] = "Poles";
        QSTranslation[QSTranslation["Fastening"] = 42] = "Fastening";
        QSTranslation[QSTranslation["Needlework"] = 43] = "Needlework";
        QSTranslation[QSTranslation["Gardening"] = 44] = "Gardening";
        QSTranslation[QSTranslation["Paperwork"] = 45] = "Paperwork";
        QSTranslation[QSTranslation["Woodwork"] = 46] = "Woodwork";
        QSTranslation[QSTranslation["MatchGroupIncludes"] = 47] = "MatchGroupIncludes";
        QSTranslation[QSTranslation["ItemGroupX"] = 48] = "ItemGroupX";
        QSTranslation[QSTranslation["ItemTypeX"] = 49] = "ItemTypeX";
        QSTranslation[QSTranslation["Item"] = 50] = "Item";
    })(QSTranslation = exports.QSTranslation || (exports.QSTranslation = {}));
    ;
    exports.QSMatchableGroups = {
        Projectile: [
            IItem_1.ItemTypeGroup.Arrow,
            IItem_1.ItemTypeGroup.Bullet
        ],
        ProjectileWeapon: [
            IItem_1.ItemTypeGroup.WeaponThatFiresArrows,
            IItem_1.ItemTypeGroup.WeaponThatFiresBullets
        ],
        Equipment: [
            IItem_1.ItemTypeGroup.Equipment
        ],
        Edible: [
            IItem_1.ItemTypeGroup.CookedFood,
            IItem_1.ItemTypeGroup.Vegetable,
            IItem_1.ItemTypeGroup.Fruit
        ],
        Raw: [
            IItem_1.ItemTypeGroup.RawFish,
            IItem_1.ItemTypeGroup.RawMeat,
            IItem_1.ItemTypeGroup.Insect,
            IItem_1.ItemTypeGroup.Egg,
            IItem_1.ItemType.AnimalFat,
            IItem_1.ItemType.Tallow
        ],
        Medical: [
            IItem_1.ItemTypeGroup.Health,
            IItem_1.ItemTypeGroup.Medicinal
        ],
        Potable: [
            IItem_1.ItemTypeGroup.ContainerOfFilteredWater,
            IItem_1.ItemTypeGroup.ContainerOfDesalinatedWater,
            IItem_1.ItemTypeGroup.ContainerOfPurifiedFreshWater,
            IItem_1.ItemTypeGroup.ContainerOfMilk
        ],
        Unpotable: [
            IItem_1.ItemTypeGroup.ContainerOfSeawater,
            IItem_1.ItemTypeGroup.ContainerOfSwampWater,
            IItem_1.ItemTypeGroup.ContainerOfUnpurifiedFreshWater
        ],
        Rock: [
            IItem_1.ItemTypeGroup.Rock
        ],
        Poles: [
            IItem_1.ItemTypeGroup.Pole
        ],
        Fastening: [
            IItem_1.ItemTypeGroup.Cordage,
            IItem_1.ItemType.String,
            IItem_1.ItemType.Rope
        ],
        Needlework: [
            IItem_1.ItemTypeGroup.Needle,
            IItem_1.ItemTypeGroup.Fabric,
            IItem_1.ItemType.AnimalFur,
            IItem_1.ItemType.AnimalPelt,
            IItem_1.ItemType.LeatherHide,
            IItem_1.ItemType.TannedLeather,
            IItem_1.ItemType.Scales
        ],
        Gardening: [
            IItem_1.ItemTypeGroup.Seed,
            IItem_1.ItemTypeGroup.Spores,
            IItem_1.ItemTypeGroup.Compost,
            IItem_1.ItemType.PileOfCompost,
            IItem_1.ItemType.BoneMeal,
            IItem_1.ItemType.PileOfAsh,
            IItem_1.ItemType.Fertilizer,
            IItem_1.ItemType.FertileSoil
        ],
        Paperwork: [
            IItem_1.ItemTypeGroup.Pulp,
            IItem_1.ItemType.PaperMold,
            IItem_1.ItemType.PaperSheet,
            IItem_1.ItemType.Inkstick,
            IItem_1.ItemType.DrawnMap,
            IItem_1.ItemType.TatteredMap
        ],
        Woodwork: [
            IItem_1.ItemType.Log,
            IItem_1.ItemType.WoodenPlank,
            IItem_1.ItemType.WoodenDowels,
            IItem_1.ItemType.TreeBark
        ]
    };
    exports.activeGroupKeyPrefix = "isActive_";
    class QuickStack extends Mod_1.default {
        constructor() {
            super(...arguments);
            this.TLget = (id) => Translation_1.default.get(this.dictionary, QSTranslation[id]);
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
            Object.keys(exports.QSMatchableGroups).forEach(KEY => {
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
                activeMatchGroups: Object.keys(exports.QSMatchableGroups)
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
            Object.keys(exports.QSMatchableGroups).forEach(KEY => {
                if (this.globalData.activeMatchGroups[KEY]) {
                    this._anyMatchgroupsActive = true;
                    this._activeMatchGroupsKeys.push(KEY);
                    this._activeMatchGroupsFlattened[KEY] = [...exports.QSMatchableGroups[KEY].flatMap(matchable => matchable in IItem_1.ItemTypeGroup
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
                    .setText(this.TLget(descKey)
                    .withSegments(ListSegment_1.default)))
                    .setText(this.TLget(KEY))
                    .setRefreshMethod(() => !!(this.globalData[KEY] ?? false))
                    .event.subscribe("toggle", (_, checked) => { this.globalData[KEY] = checked; })
                    .appendTo(section);
            });
            new Details_1.default()
                .setSummary(btn => btn
                .setText(this.TLget("optionMatchSimilar"))
                .setTooltip(ttip => ttip
                .setLocation(IComponent_1.TooltipLocation.CenterRight)
                .setText(this.TLget("optionMatchSimilar_desc"))))
                .setBlock(true)
                .append([...Object.keys(exports.QSMatchableGroups).map(KEY => new CheckButton_1.CheckButton()
                    .setText(this.TLget(KEY))
                    .setTooltip(ttip => ttip
                    .setLocation(IComponent_1.TooltipLocation.Mouse)
                    .addBlock(ttblock => ttblock
                    .setTitle(t => t.setText(this.TLget("MatchGroupIncludes")))
                    .append([...exports.QSMatchableGroups[KEY]
                        .map(matchable => new Component_1.default()
                        .setStyle("padding-left", "5ch")
                        .setStyle("text-indent", "-5ch")
                        .append(new Text_1.default()
                        .setText((matchable in IItem_1.ItemType ? this.TLget("ItemTypeX") : this.TLget("ItemGroupX"))
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
        ModRegistry_1.default.dictionary("QSDictionary", QSTranslation)
    ], QuickStack.prototype, "dictionary", void 0);
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
        ModRegistry_1.default.bindable("StackAllSelfNearby", IInput_1.IInput.key("slash", "Shift"))
    ], QuickStack.prototype, "bindableSASeN", void 0);
    __decorate([
        ModRegistry_1.default.bindable("StackAllMainNearby")
    ], QuickStack.prototype, "bindableSAMN", void 0);
    __decorate([
        ModRegistry_1.default.bindable("StackAllNearbySelf", IInput_1.IInput.key("slash", "Shift", "Ctrl"))
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVpY2tTdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9RdWlja1N0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUE0QkEsSUFBaUIsWUFBWSxDQUs1QjtJQUxELFdBQWlCLFlBQVk7UUFDWixxQkFBUSxHQUFHLElBQWEsQ0FBQztRQUN6Qix5QkFBWSxHQUFHLGNBQUssQ0FBQyxVQUFtQixDQUFDO1FBQ3pDLDhCQUFpQixHQUFHLEtBQWMsQ0FBQztRQUNuQywyQkFBYyxHQUFHLEtBQWMsQ0FBQztJQUNqRCxDQUFDLEVBTGdCLFlBQVksR0FBWixvQkFBWSxLQUFaLG9CQUFZLFFBSzVCO0lBRUQsSUFBWSxhQXdEWDtJQXhERCxXQUFZLGFBQWE7UUFDckIseURBQVksQ0FBQTtRQUNaLG1FQUFhLENBQUE7UUFDYixtRUFBYSxDQUFBO1FBQ2IsK0RBQVcsQ0FBQTtRQUNYLHVFQUFlLENBQUE7UUFDZiwyREFBUyxDQUFBO1FBQ1QscURBQU0sQ0FBQTtRQUVOLCtDQUFHLENBQUE7UUFDSCxtREFBSyxDQUFBO1FBQ0wsaURBQUksQ0FBQTtRQUNKLGtEQUFJLENBQUE7UUFDSixzREFBTSxDQUFBO1FBQ04sb0VBQWEsQ0FBQTtRQUNiLHNEQUFNLENBQUE7UUFDTiwwREFBUSxDQUFBO1FBQ1IsNERBQVMsQ0FBQTtRQUNULGdFQUFXLENBQUE7UUFDWCx3REFBTyxDQUFBO1FBQ1Asb0VBQWEsQ0FBQTtRQUNiLG9FQUFhLENBQUE7UUFDYix3REFBTyxDQUFBO1FBQ1Asd0RBQU8sQ0FBQTtRQUNQLDREQUFTLENBQUE7UUFDVCwwREFBUSxDQUFBO1FBQ1Isb0VBQWEsQ0FBQTtRQUNiLHNFQUFjLENBQUE7UUFDZCxvRUFBYSxDQUFBO1FBQ2IsOEVBQWtCLENBQUE7UUFDbEIsa0ZBQW9CLENBQUE7UUFDcEIsNEVBQWlCLENBQUE7UUFFakIsOEVBQWtCLENBQUE7UUFDbEIsd0ZBQXVCLENBQUE7UUFFdkIsOERBQVUsQ0FBQTtR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
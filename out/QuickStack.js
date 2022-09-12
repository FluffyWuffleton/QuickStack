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
        QSTranslation[QSTranslation["Seeds"] = 44] = "Seeds";
        QSTranslation[QSTranslation["Fertilizer"] = 45] = "Fertilizer";
        QSTranslation[QSTranslation["Paperwork"] = 46] = "Paperwork";
        QSTranslation[QSTranslation["Woodwork"] = 47] = "Woodwork";
        QSTranslation[QSTranslation["MatchGroupIncludes"] = 48] = "MatchGroupIncludes";
        QSTranslation[QSTranslation["ItemGroupX"] = 49] = "ItemGroupX";
        QSTranslation[QSTranslation["ItemTypeX"] = 50] = "ItemTypeX";
        QSTranslation[QSTranslation["Item"] = 51] = "Item";
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
        Seeds: [
            IItem_1.ItemTypeGroup.Seed,
            IItem_1.ItemTypeGroup.Spores
        ],
        Fertilizer: [
            IItem_1.ItemType.AnimalDung,
            IItem_1.ItemType.AnimalDroppings,
            IItem_1.ItemType.BirdDroppings,
            IItem_1.ItemType.Guano,
            IItem_1.ItemType.PileOfCompost,
            IItem_1.ItemType.BoneMeal,
            IItem_1.ItemType.PileOfAsh,
            IItem_1.ItemType.Fertilizer,
            IItem_1.ItemType.Soil,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVpY2tTdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9RdWlja1N0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUE0QkEsSUFBaUIsWUFBWSxDQUs1QjtJQUxELFdBQWlCLFlBQVk7UUFDWixxQkFBUSxHQUFHLElBQWEsQ0FBQztRQUN6Qix5QkFBWSxHQUFHLGNBQUssQ0FBQyxVQUFtQixDQUFDO1FBQ3pDLDhCQUFpQixHQUFHLEtBQWMsQ0FBQztRQUNuQywyQkFBYyxHQUFHLEtBQWMsQ0FBQztJQUNqRCxDQUFDLEVBTGdCLFlBQVksR0FBWixvQkFBWSxLQUFaLG9CQUFZLFFBSzVCO0lBRUQsSUFBWSxhQXlEWDtJQXpERCxXQUFZLGFBQWE7UUFDckIseURBQVksQ0FBQTtRQUNaLG1FQUFhLENBQUE7UUFDYixtRUFBYSxDQUFBO1FBQ2IsK0RBQVcsQ0FBQTtRQUNYLHVFQUFlLENBQUE7UUFDZiwyREFBUyxDQUFBO1FBQ1QscURBQU0sQ0FBQTtRQUVOLCtDQUFHLENBQUE7UUFDSCxtREFBSyxDQUFBO1FBQ0wsaURBQUksQ0FBQTtRQUNKLGtEQUFJLENBQUE7UUFDSixzREFBTSxDQUFBO1FBQ04sb0VBQWEsQ0FBQTtRQUNiLHNEQUFNLENBQUE7UUFDTiwwREFBUSxDQUFBO1FBQ1IsNERBQVMsQ0FBQTtRQUNULGdFQUFXLENBQUE7UUFDWCx3REFBTyxDQUFBO1FBQ1Asb0VBQWEsQ0FBQTtRQUNiLG9FQUFhLENBQUE7UUFDYix3REFBTyxDQUFBO1FBQ1Asd0RBQU8sQ0FBQTtRQUNQLDREQUFTLENBQUE7UUFDVCwwREFBUSxDQUFBO1FBQ1Isb0VBQWEsQ0FBQTtRQUNiLHNFQUFjLENBQUE7UUFDZCxvRUFBYSxDQUFBO1FBQ2IsOEVBQWtCLENBQUE7UUFDbEIsa0ZBQW9CLENBQUE7UUFDcEIsNEVBQWlCLENBQUE7UUFFakIsOEVBQWtCLENBQUE7UUFDbEIsd0ZBQXVCLENBQUE7UUFFdkIsOERBQVUsQ0FBQTtR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
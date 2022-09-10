var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "mod/Mod", "mod/ModRegistry", "ui/input/IInput", "game/entity/action/usable/actions/UsableActionsMain", "./actions/Actions", "./actions/UsableActionsQuickStack", "ui/input/Bind", "ui/component/Component", "ui/component/CheckButton", "language/Translation", "game/entity/IHuman", "game/item/IItem", "ui/component/Details", "game/item/ItemManager", "ui/component/Text"], function (require, exports, Mod_1, ModRegistry_1, IInput_1, UsableActionsMain_1, Actions_1, UsableActionsQuickStack_1, Bind_1, Component_1, CheckButton_1, Translation_1, IHuman_1, IItem_1, Details_1, ItemManager_1, Text_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.activeGroupKeyPrefix = exports.QSMatchableGroups = exports.QSTranslation = exports.GLOBALCONFIG = void 0;
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
        QSTranslation[QSTranslation["CordageAndString"] = 42] = "CordageAndString";
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
        CordageAndString: [
            IItem_1.ItemTypeGroup.Cordage,
            IItem_1.ItemType.String,
            IItem_1.ItemType.Rope
        ],
        Needlework: [
            IItem_1.ItemTypeGroup.Needle,
            IItem_1.ItemTypeGroup.Fabric,
            IItem_1.ItemType.TannedLeather,
            IItem_1.ItemType.LeatherHide
        ],
        Gardening: [
            IItem_1.ItemTypeGroup.Seed,
            IItem_1.ItemTypeGroup.Spores,
            IItem_1.ItemTypeGroup.Compost,
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
            this._activeMatchGroupsArray = [];
            this._activeMatchGroupsKeys = [];
        }
        SASeNBind() { return !(0, UsableActionsQuickStack_1.execSASeN)(localPlayer); }
        SAMNBind() { return !(0, UsableActionsQuickStack_1.execSAMN)(localPlayer); }
        SANSeBind() { return !(0, UsableActionsQuickStack_1.execSANSe)(localPlayer); }
        SANMBind() { return !(0, UsableActionsQuickStack_1.execSANM)(localPlayer); }
        get activeMatchGroupsArray() { return this._activeMatchGroupsArray; }
        get activeMatchGroupsKeys() { return this._activeMatchGroupsKeys; }
        get activeMatchGroupsFlattened() { return this._activeMatchGroupsFlattened; }
        refreshMatchGroupsArray() {
            this._activeMatchGroupsArray = [];
            this._activeMatchGroupsKeys = [];
            this._activeMatchGroupsFlattened = {};
            Object.keys(exports.QSMatchableGroups).forEach(KEY => {
                if (this.globalData[`${exports.activeGroupKeyPrefix}${KEY}`]) {
                    this._activeMatchGroupsArray.push(exports.QSMatchableGroups[KEY]);
                    this._activeMatchGroupsKeys.push(KEY);
                    this._activeMatchGroupsFlattened[KEY] = [...exports.QSMatchableGroups[KEY].flatMap(matchable => matchable in IItem_1.ItemTypeGroup
                            ? [...ItemManager_1.default.getGroupItems(matchable)]
                            : matchable)];
                }
            });
            QuickStack.LOG.info(`Updated match groups.`);
            console.log(this._activeMatchGroupsArray);
            console.log(this._activeMatchGroupsKeys);
            console.log(this._activeMatchGroupsFlattened);
        }
        onInitialize() {
            this.refreshMatchGroupsArray();
        }
        constructOptionsSection(section) {
            const ToggleKeys = ["optionForbidTiles", "optionKeepContainers", "optionTopDown"];
            ToggleKeys.forEach(KEY => {
                (!((KEY + "_desc") in QSTranslation)
                    ? new CheckButton_1.CheckButton()
                    : new CheckButton_1.CheckButton()
                        .setTooltip(ttip => ttip.setText(this.TLget(KEY + "_desc"))))
                    .setText(this.TLget(KEY))
                    .setRefreshMethod(() => !!(this.globalData[KEY] ?? false))
                    .event.subscribe("toggle", (_, checked) => { this.globalData[KEY] = checked; })
                    .appendTo(section);
            });
            new Details_1.default()
                .setSummary(btn => btn
                .setText(this.TLget("optionMatchSimilar"))
                .setTooltip(tt => tt.setText(this.TLget("optionMatchSimilar_desc"))))
                .setBlock(true)
                .append([...Object.keys(exports.QSMatchableGroups)
                    .map(KEY => new CheckButton_1.CheckButton()
                    .setText(this.TLget(KEY))
                    .setTooltip(ttip => ttip.addBlock(ttblock => ttblock
                    .setTitle(t => t.setText(this.TLget("MatchGroupIncludes")))
                    .append([...exports.QSMatchableGroups[KEY]
                        .map(matchable => new Component_1.default()
                        .setStyle("padding-left", "5ch")
                        .setStyle("text-indent", "-5ch")
                        .append(new Text_1.default()
                        .setText((matchable in IItem_1.ItemType ? this.TLget("ItemTypeX") : this.TLget("ItemGroupX"))
                        .addArgs(ItemManager_1.default.getItemTypeGroupName(matchable, false, 1)))))
                ])))
                    .setRefreshMethod(() => !!this.globalData[`${exports.activeGroupKeyPrefix}${KEY}`])
                    .event.subscribe("toggle", (_, checked) => {
                    this.globalData[`${exports.activeGroupKeyPrefix}${KEY}`] = checked;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVpY2tTdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9RdWlja1N0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUEwQkEsSUFBaUIsWUFBWSxDQUs1QjtJQUxELFdBQWlCLFlBQVk7UUFDWixxQkFBUSxHQUFHLEtBQWMsQ0FBQztRQUMxQix5QkFBWSxHQUFHLGNBQUssQ0FBQyxVQUFtQixDQUFDO1FBQ3pDLDhCQUFpQixHQUFHLEtBQWMsQ0FBQztRQUNuQywyQkFBYyxHQUFHLEtBQWMsQ0FBQztJQUNqRCxDQUFDLEVBTGdCLFlBQVksR0FBWixvQkFBWSxLQUFaLG9CQUFZLFFBSzVCO0lBRUQsSUFBWSxhQXdEWDtJQXhERCxXQUFZLGFBQWE7UUFDckIseURBQVksQ0FBQTtRQUNaLG1FQUFhLENBQUE7UUFDYixtRUFBYSxDQUFBO1FBQ2IsK0RBQVcsQ0FBQTtRQUNYLHVFQUFlLENBQUE7UUFDZiwyREFBUyxDQUFBO1FBQ1QscURBQU0sQ0FBQTtRQUVOLCtDQUFHLENBQUE7UUFDSCxtREFBSyxDQUFBO1FBQ0wsaURBQUksQ0FBQTtRQUNKLGtEQUFJLENBQUE7UUFDSixzREFBTSxDQUFBO1FBQ04sb0VBQWEsQ0FBQTtRQUNiLHNEQUFNLENBQUE7UUFDTiwwREFBUSxDQUFBO1FBQ1IsNERBQVMsQ0FBQTtRQUNULGdFQUFXLENBQUE7UUFDWCx3REFBTyxDQUFBO1FBQ1Asb0VBQWEsQ0FBQTtRQUNiLG9FQUFhLENBQUE7UUFDYix3REFBTyxDQUFBO1FBQ1Asd0RBQU8sQ0FBQTtRQUNQLDREQUFTLENBQUE7UUFDVCwwREFBUSxDQUFBO1FBQ1Isb0VBQWEsQ0FBQTtRQUNiLHNFQUFjLENBQUE7UUFDZCxvRUFBYSxDQUFBO1FBQ2IsOEVBQWtCLENBQUE7UUFDbEIsa0ZBQW9CLENBQUE7UUFDcEIsNEVBQWlCLENBQUE7UUFFakIsOEVBQWtCLENBQUE7UUFDbEIsd0ZBQXVCLENBQUE7UUFFdkIsOERBQVUsQ0FBQTtR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
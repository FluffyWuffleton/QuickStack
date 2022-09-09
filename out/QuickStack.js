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
        GLOBALCONFIG.pause_length = IHuman_1.Delay.ShortPause;
        GLOBALCONFIG.pass_turn_success = false;
    })(GLOBALCONFIG = exports.GLOBALCONFIG || (exports.GLOBALCONFIG = {}));
    var QSTranslation;
    (function (QSTranslation) {
        QSTranslation[QSTranslation["qsPrefix"] = 0] = "qsPrefix";
        QSTranslation[QSTranslation["parenthetical"] = 1] = "parenthetical";
        QSTranslation[QSTranslation["colorMatchGroup"] = 2] = "colorMatchGroup";
        QSTranslation[QSTranslation["toX"] = 3] = "toX";
        QSTranslation[QSTranslation["fromX"] = 4] = "fromX";
        QSTranslation[QSTranslation["allX"] = 5] = "allX";
        QSTranslation[QSTranslation["here"] = 6] = "here";
        QSTranslation[QSTranslation["yourInventory"] = 7] = "yourInventory";
        QSTranslation[QSTranslation["toTile"] = 8] = "toTile";
        QSTranslation[QSTranslation["fromTile"] = 9] = "fromTile";
        QSTranslation[QSTranslation["toUnknown"] = 10] = "toUnknown";
        QSTranslation[QSTranslation["fromUnknown"] = 11] = "fromUnknown";
        QSTranslation[QSTranslation["XOutOfY"] = 12] = "XOutOfY";
        QSTranslation[QSTranslation["mainInventory"] = 13] = "mainInventory";
        QSTranslation[QSTranslation["fullInventory"] = 14] = "fullInventory";
        QSTranslation[QSTranslation["deposit"] = 15] = "deposit";
        QSTranslation[QSTranslation["withdraw"] = 16] = "withdraw";
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
        QSTranslation[QSTranslation["Projectile"] = 27] = "Projectile";
        QSTranslation[QSTranslation["ProjectileWeapon"] = 28] = "ProjectileWeapon";
        QSTranslation[QSTranslation["Equipment"] = 29] = "Equipment";
        QSTranslation[QSTranslation["Edible"] = 30] = "Edible";
        QSTranslation[QSTranslation["Raw"] = 31] = "Raw";
        QSTranslation[QSTranslation["Medical"] = 32] = "Medical";
        QSTranslation[QSTranslation["Potable"] = 33] = "Potable";
        QSTranslation[QSTranslation["Unpotable"] = 34] = "Unpotable";
        QSTranslation[QSTranslation["Rock"] = 35] = "Rock";
        QSTranslation[QSTranslation["Poles"] = 36] = "Poles";
        QSTranslation[QSTranslation["CordageAndString"] = 37] = "CordageAndString";
        QSTranslation[QSTranslation["Needlework"] = 38] = "Needlework";
        QSTranslation[QSTranslation["Gardening"] = 39] = "Gardening";
        QSTranslation[QSTranslation["Paperwork"] = 40] = "Paperwork";
        QSTranslation[QSTranslation["MatchGroupIncludes"] = 41] = "MatchGroupIncludes";
        QSTranslation[QSTranslation["ItemGroupX"] = 42] = "ItemGroupX";
        QSTranslation[QSTranslation["ItemTypeX"] = 43] = "ItemTypeX";
        QSTranslation[QSTranslation["Item"] = 44] = "Item";
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
        SAMNBind() { return !(0, UsableActionsQuickStack_1.execSAMN)(localPlayer); }
        SASNBind() { return !(0, UsableActionsQuickStack_1.execSASeN)(localPlayer); }
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
        ModRegistry_1.default.bindable("StackAllSelfNearby", IInput_1.IInput.key("slash", "Shift"))
    ], QuickStack.prototype, "bindableSASN", void 0);
    __decorate([
        ModRegistry_1.default.bindable("StackAllMainNearby")
    ], QuickStack.prototype, "bindableSAMN", void 0);
    __decorate([
        ModRegistry_1.default.bindable("StackAllSelfNearby_submenu", IInput_1.IInput.key("slash", "Shift"))
    ], QuickStack.prototype, "bindableSASN_submenu", void 0);
    __decorate([
        ModRegistry_1.default.bindable("StackAllMainNearby_submenu")
    ], QuickStack.prototype, "bindableSAMN_submenu", void 0);
    __decorate([
        ModRegistry_1.default.action("StackAction", Actions_1.StackAction)
    ], QuickStack.prototype, "actionStackAction", void 0);
    __decorate([
        ModRegistry_1.default.usableActionType("AllMainNearby")
    ], QuickStack.prototype, "UAPlaceholderAllMainNearby", void 0);
    __decorate([
        ModRegistry_1.default.usableActionType("AllSelfNearby")
    ], QuickStack.prototype, "UAPlaceholderAllSelfNearby", void 0);
    __decorate([
        ModRegistry_1.default.usableActions("QSUsableActions", UsableActionsMain_1.UsableActionSet.ItemMoveMenus, reg => UsableActionsQuickStack_1.UsableActionsQuickStack.register(reg))
    ], QuickStack.prototype, "QSUsableActions", void 0);
    __decorate([
        Bind_1.default.onDown((0, ModRegistry_1.Registry)().get("bindableSAMN"))
    ], QuickStack.prototype, "SAMNBind", null);
    __decorate([
        Bind_1.default.onDown((0, ModRegistry_1.Registry)().get("bindableSASN"))
    ], QuickStack.prototype, "SASNBind", null);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVpY2tTdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9RdWlja1N0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUEwQkEsSUFBaUIsWUFBWSxDQUc1QjtJQUhELFdBQWlCLFlBQVk7UUFDWix5QkFBWSxHQUFHLGNBQUssQ0FBQyxVQUFVLENBQUM7UUFDaEMsOEJBQWlCLEdBQUcsS0FBSyxDQUFDO0lBQzNDLENBQUMsRUFIZ0IsWUFBWSxHQUFaLG9CQUFZLEtBQVosb0JBQVksUUFHNUI7SUFFRCxJQUFZLGFBa0RYO0lBbERELFdBQVksYUFBYTtRQUNyQix5REFBWSxDQUFBO1FBQ1osbUVBQWEsQ0FBQTtRQUNiLHVFQUFlLENBQUE7UUFFZiwrQ0FBRyxDQUFBO1FBQ0gsbURBQUssQ0FBQTtRQUNMLGlEQUFJLENBQUE7UUFDSixpREFBSSxDQUFBO1FBQ0osbUVBQWEsQ0FBQTtRQUNiLHFEQUFNLENBQUE7UUFDTix5REFBUSxDQUFBO1FBQ1IsNERBQVMsQ0FBQTtRQUNULGdFQUFXLENBQUE7UUFDWCx3REFBTyxDQUFBO1FBQ1Asb0VBQWEsQ0FBQTtRQUNiLG9FQUFhLENBQUE7UUFDYix3REFBTyxDQUFBO1FBQ1AsMERBQVEsQ0FBQTtRQUNSLDREQUFTLENBQUE7UUFDVCwwREFBUSxDQUFBO1FBQ1Isb0VBQWEsQ0FBQTtRQUNiLHNFQUFjLENBQUE7UUFDZCxvRUFBYSxDQUFBO1FBQ2IsOEVBQWtCLENBQUE7UUFDbEIsa0ZBQW9CLENBQUE7UUFDcEIsNEVBQWlCLENBQUE7UUFFakIsOEVBQWtCLENBQUE7UUFDbEIsd0ZBQXVCLENBQUE7UUFFdkIsOERBQVUsQ0FBQTtRQUNWLDBFQUFnQixDQUFBO1FBQ2hCLDREQUFTLENBQUE7UUFDVCxzREFBTSxDQUFBO1FBQ04sZ0RBQUcsQ0FBQTtRQUNILHdEQUFPLENBQUE7UUFDUCx3REFBTyxDQUFBO1FBQ1AsNERBQVMsQ0FBQTtRQUNULGtEQUFJLENBQUE7UUFDSixv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
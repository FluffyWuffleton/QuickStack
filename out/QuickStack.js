var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "mod/Mod", "mod/ModRegistry", "ui/input/IInput", "game/entity/action/usable/actions/UsableActionsMain", "./actions/Actions", "./actions/UsableActionsQuickStack", "ui/input/Bind", "ui/component/Component", "ui/component/CheckButton", "language/Translation", "game/entity/IHuman", "game/item/IItem", "ui/component/Details", "game/item/ItemManager", "ui/component/Text"], function (require, exports, Mod_1, ModRegistry_1, IInput_1, UsableActionsMain_1, Actions_1, UsableActionsQuickStack_1, Bind_1, Component_1, CheckButton_1, Translation_1, IHuman_1, IItem_1, Details_1, ItemManager_1, Text_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.QSTranslation = exports.GLOBALCONFIG = void 0;
    var GLOBALCONFIG;
    (function (GLOBALCONFIG) {
        GLOBALCONFIG.pause_length = IHuman_1.Delay.ShortPause;
        GLOBALCONFIG.pass_turn_success = false;
    })(GLOBALCONFIG = exports.GLOBALCONFIG || (exports.GLOBALCONFIG = {}));
    var QSTranslation;
    (function (QSTranslation) {
        QSTranslation[QSTranslation["qsPrefix"] = 0] = "qsPrefix";
        QSTranslation[QSTranslation["toX"] = 1] = "toX";
        QSTranslation[QSTranslation["fromX"] = 2] = "fromX";
        QSTranslation[QSTranslation["allX"] = 3] = "allX";
        QSTranslation[QSTranslation["here"] = 4] = "here";
        QSTranslation[QSTranslation["yourInventory"] = 5] = "yourInventory";
        QSTranslation[QSTranslation["toTile"] = 6] = "toTile";
        QSTranslation[QSTranslation["fromTile"] = 7] = "fromTile";
        QSTranslation[QSTranslation["toUnknown"] = 8] = "toUnknown";
        QSTranslation[QSTranslation["fromUnknown"] = 9] = "fromUnknown";
        QSTranslation[QSTranslation["XOutOfY"] = 10] = "XOutOfY";
        QSTranslation[QSTranslation["mainInventory"] = 11] = "mainInventory";
        QSTranslation[QSTranslation["fullInventory"] = 12] = "fullInventory";
        QSTranslation[QSTranslation["deposit"] = 13] = "deposit";
        QSTranslation[QSTranslation["withdraw"] = 14] = "withdraw";
        QSTranslation[QSTranslation["onlyXType"] = 15] = "onlyXType";
        QSTranslation[QSTranslation["allTypes"] = 16] = "allTypes";
        QSTranslation[QSTranslation["thisContainer"] = 17] = "thisContainer";
        QSTranslation[QSTranslation["likeContainers"] = 18] = "likeContainers";
        QSTranslation[QSTranslation["optionTopDown"] = 19] = "optionTopDown";
        QSTranslation[QSTranslation["optionTopDown_desc"] = 20] = "optionTopDown_desc";
        QSTranslation[QSTranslation["optionKeepContainers"] = 21] = "optionKeepContainers";
        QSTranslation[QSTranslation["optionForbidTiles"] = 22] = "optionForbidTiles";
        QSTranslation[QSTranslation["optionMatchSimilar"] = 23] = "optionMatchSimilar";
        QSTranslation[QSTranslation["optionMatchSimilar_desc"] = 24] = "optionMatchSimilar_desc";
        QSTranslation[QSTranslation["Projectile"] = 25] = "Projectile";
        QSTranslation[QSTranslation["ProjectileWeapon"] = 26] = "ProjectileWeapon";
        QSTranslation[QSTranslation["Equipment"] = 27] = "Equipment";
        QSTranslation[QSTranslation["Edible"] = 28] = "Edible";
        QSTranslation[QSTranslation["Raw"] = 29] = "Raw";
        QSTranslation[QSTranslation["Medical"] = 30] = "Medical";
        QSTranslation[QSTranslation["Potable"] = 31] = "Potable";
        QSTranslation[QSTranslation["Unpotable"] = 32] = "Unpotable";
        QSTranslation[QSTranslation["Rock"] = 33] = "Rock";
        QSTranslation[QSTranslation["Poles"] = 34] = "Poles";
        QSTranslation[QSTranslation["CordageAndString"] = 35] = "CordageAndString";
        QSTranslation[QSTranslation["Needlework"] = 36] = "Needlework";
        QSTranslation[QSTranslation["Gardening"] = 37] = "Gardening";
        QSTranslation[QSTranslation["Paperwork"] = 38] = "Paperwork";
        QSTranslation[QSTranslation["MatchGroupIncludes"] = 39] = "MatchGroupIncludes";
        QSTranslation[QSTranslation["ItemGroupX"] = 40] = "ItemGroupX";
        QSTranslation[QSTranslation["ItemTypeX"] = 41] = "ItemTypeX";
    })(QSTranslation = exports.QSTranslation || (exports.QSTranslation = {}));
    ;
    const QSMatchableGroups = {
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
            IItem_1.ItemTypeGroup.Compost,
            IItem_1.ItemType.Fertilizer,
            IItem_1.ItemType.FertileSoil,
            IItem_1.ItemTypeGroup.Seed,
            IItem_1.ItemTypeGroup.Spores
        ],
        Paperwork: [
            IItem_1.ItemType.PaperMold,
            IItem_1.ItemType.PaperSheet,
            IItem_1.ItemTypeGroup.Pulp,
            IItem_1.ItemType.DrawnMap,
            IItem_1.ItemType.TatteredMap,
            IItem_1.ItemType.Inkstick
        ]
    };
    class QuickStack extends Mod_1.default {
        constructor() {
            super(...arguments);
            this.TLget = (id) => Translation_1.default.get(this.dictionary, QSTranslation[id]);
        }
        SAMNBind() { return !(0, UsableActionsQuickStack_1.execSAMN)(localPlayer); }
        SASNBind() { return !(0, UsableActionsQuickStack_1.execSASeN)(localPlayer); }
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
                .append([...Object.keys(QSMatchableGroups).map(KEY => new CheckButton_1.CheckButton()
                    .setText(this.TLget(KEY))
                    .setTooltip(ttip => ttip.addBlock(b => b
                    .setTitle(t => t.setText(this.TLget("MatchGroupIncludes")))
                    .append([...QSMatchableGroups[KEY].map((matchable, i) => new Component_1.default().setStyle("padding-left", "5ch").setStyle("text-indent", "-5ch").append(new Text_1.default().setText((matchable in IItem_1.ItemType ? this.TLget("ItemTypeX") : this.TLget("ItemGroupX"))
                        .addArgs(ItemManager_1.default.getItemTypeGroupName(matchable, false, 1)))))])))
                    .setRefreshMethod(() => !!(this.globalData.activeMatchGroups?.[KEY] ?? false))
                    .event.subscribe("toggle", (_, checked) => { this.globalData.activeMatchGroups[KEY] = checked; }))])
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVpY2tTdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9RdWlja1N0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUF5QkEsSUFBaUIsWUFBWSxDQUc1QjtJQUhELFdBQWlCLFlBQVk7UUFDWix5QkFBWSxHQUFHLGNBQUssQ0FBQyxVQUFVLENBQUM7UUFDaEMsOEJBQWlCLEdBQUcsS0FBSyxDQUFDO0lBQzNDLENBQUMsRUFIZ0IsWUFBWSxHQUFaLG9CQUFZLEtBQVosb0JBQVksUUFHNUI7SUFFRCxJQUFZLGFBOENYO0lBOUNELFdBQVksYUFBYTtRQUNyQix5REFBWSxDQUFBO1FBQ1osK0NBQUcsQ0FBQTtRQUNILG1EQUFLLENBQUE7UUFDTCxpREFBSSxDQUFBO1FBQ0osaURBQUksQ0FBQTtRQUNKLG1FQUFhLENBQUE7UUFDYixxREFBTSxDQUFBO1FBQ04seURBQVEsQ0FBQTtRQUNSLDJEQUFTLENBQUE7UUFDVCwrREFBVyxDQUFBO1FBQ1gsd0RBQU8sQ0FBQTtRQUNQLG9FQUFhLENBQUE7UUFDYixvRUFBYSxDQUFBO1FBQ2Isd0RBQU8sQ0FBQTtRQUNQLDBEQUFRLENBQUE7UUFDUiw0REFBUyxDQUFBO1FBQ1QsMERBQVEsQ0FBQTtRQUNSLG9FQUFhLENBQUE7UUFDYixzRUFBYyxDQUFBO1FBQ2Qsb0VBQWEsQ0FBQTtRQUNiLDhFQUFrQixDQUFBO1FBQ2xCLGtGQUFvQixDQUFBO1FBQ3BCLDRFQUFpQixDQUFBO1FBRWpCLDhFQUFrQixDQUFBO1FBQ2xCLHdGQUF1QixDQUFBO1FBRXZCLDhEQUFVLENBQUE7UUFDViwwRUFBZ0IsQ0FBQTtRQUNoQiw0REFBUyxDQUFBO1FBQ1Qsc0RBQU0sQ0FBQTtRQUNOLGdEQUFHLENBQUE7UUFDSCx3REFBTyxDQUFBO1FBQ1Asd0RBQU8sQ0FBQTtRQUNQLDREQUFTLENBQUE7UUFDVCxrREFBSSxDQUFBO1FBQ0osb0RBQUssQ0FBQTtRQUNMLDBFQUFnQixDQUFBO1FBQ2hC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
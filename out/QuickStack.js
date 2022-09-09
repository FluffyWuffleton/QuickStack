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
        QSTranslation[QSTranslation["qsPrefixShort"] = 1] = "qsPrefixShort";
        QSTranslation[QSTranslation["parenthetical"] = 2] = "parenthetical";
        QSTranslation[QSTranslation["colorMatchGroup"] = 3] = "colorMatchGroup";
        QSTranslation[QSTranslation["concat"] = 4] = "concat";
        QSTranslation[QSTranslation["toX"] = 5] = "toX";
        QSTranslation[QSTranslation["fromX"] = 6] = "fromX";
        QSTranslation[QSTranslation["allX"] = 7] = "allX";
        QSTranslation[QSTranslation["here"] = 8] = "here";
        QSTranslation[QSTranslation["yourInventory"] = 9] = "yourInventory";
        QSTranslation[QSTranslation["toTile"] = 10] = "toTile";
        QSTranslation[QSTranslation["fromTile"] = 11] = "fromTile";
        QSTranslation[QSTranslation["toUnknown"] = 12] = "toUnknown";
        QSTranslation[QSTranslation["fromUnknown"] = 13] = "fromUnknown";
        QSTranslation[QSTranslation["XOutOfY"] = 14] = "XOutOfY";
        QSTranslation[QSTranslation["mainInventory"] = 15] = "mainInventory";
        QSTranslation[QSTranslation["fullInventory"] = 16] = "fullInventory";
        QSTranslation[QSTranslation["deposit"] = 17] = "deposit";
        QSTranslation[QSTranslation["withdraw"] = 18] = "withdraw";
        QSTranslation[QSTranslation["onlyXType"] = 19] = "onlyXType";
        QSTranslation[QSTranslation["allTypes"] = 20] = "allTypes";
        QSTranslation[QSTranslation["thisContainer"] = 21] = "thisContainer";
        QSTranslation[QSTranslation["likeContainers"] = 22] = "likeContainers";
        QSTranslation[QSTranslation["optionTopDown"] = 23] = "optionTopDown";
        QSTranslation[QSTranslation["optionTopDown_desc"] = 24] = "optionTopDown_desc";
        QSTranslation[QSTranslation["optionKeepContainers"] = 25] = "optionKeepContainers";
        QSTranslation[QSTranslation["optionForbidTiles"] = 26] = "optionForbidTiles";
        QSTranslation[QSTranslation["optionMatchSimilar"] = 27] = "optionMatchSimilar";
        QSTranslation[QSTranslation["optionMatchSimilar_desc"] = 28] = "optionMatchSimilar_desc";
        QSTranslation[QSTranslation["Projectile"] = 29] = "Projectile";
        QSTranslation[QSTranslation["ProjectileWeapon"] = 30] = "ProjectileWeapon";
        QSTranslation[QSTranslation["Equipment"] = 31] = "Equipment";
        QSTranslation[QSTranslation["Edible"] = 32] = "Edible";
        QSTranslation[QSTranslation["Raw"] = 33] = "Raw";
        QSTranslation[QSTranslation["Medical"] = 34] = "Medical";
        QSTranslation[QSTranslation["Potable"] = 35] = "Potable";
        QSTranslation[QSTranslation["Unpotable"] = 36] = "Unpotable";
        QSTranslation[QSTranslation["Rock"] = 37] = "Rock";
        QSTranslation[QSTranslation["Poles"] = 38] = "Poles";
        QSTranslation[QSTranslation["CordageAndString"] = 39] = "CordageAndString";
        QSTranslation[QSTranslation["Needlework"] = 40] = "Needlework";
        QSTranslation[QSTranslation["Gardening"] = 41] = "Gardening";
        QSTranslation[QSTranslation["Paperwork"] = 42] = "Paperwork";
        QSTranslation[QSTranslation["MatchGroupIncludes"] = 43] = "MatchGroupIncludes";
        QSTranslation[QSTranslation["ItemGroupX"] = 44] = "ItemGroupX";
        QSTranslation[QSTranslation["ItemTypeX"] = 45] = "ItemTypeX";
        QSTranslation[QSTranslation["Item"] = 46] = "Item";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVpY2tTdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9RdWlja1N0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUEwQkEsSUFBaUIsWUFBWSxDQUc1QjtJQUhELFdBQWlCLFlBQVk7UUFDWix5QkFBWSxHQUFHLGNBQUssQ0FBQyxVQUFVLENBQUM7UUFDaEMsOEJBQWlCLEdBQUcsS0FBSyxDQUFDO0lBQzNDLENBQUMsRUFIZ0IsWUFBWSxHQUFaLG9CQUFZLEtBQVosb0JBQVksUUFHNUI7SUFFRCxJQUFZLGFBb0RYO0lBcERELFdBQVksYUFBYTtRQUNyQix5REFBWSxDQUFBO1FBQ1osbUVBQWEsQ0FBQTtRQUNiLG1FQUFhLENBQUE7UUFDYix1RUFBZSxDQUFBO1FBQ2YscURBQU0sQ0FBQTtRQUVOLCtDQUFHLENBQUE7UUFDSCxtREFBSyxDQUFBO1FBQ0wsaURBQUksQ0FBQTtRQUNKLGlEQUFJLENBQUE7UUFDSixtRUFBYSxDQUFBO1FBQ2Isc0RBQU0sQ0FBQTtRQUNOLDBEQUFRLENBQUE7UUFDUiw0REFBUyxDQUFBO1FBQ1QsZ0VBQVcsQ0FBQTtRQUNYLHdEQUFPLENBQUE7UUFDUCxvRUFBYSxDQUFBO1FBQ2Isb0VBQWEsQ0FBQTtRQUNiLHdEQUFPLENBQUE7UUFDUCwwREFBUSxDQUFBO1FBQ1IsNERBQVMsQ0FBQTtRQUNULDBEQUFRLENBQUE7UUFDUixvRUFBYSxDQUFBO1FBQ2Isc0VBQWMsQ0FBQTtRQUNkLG9FQUFhLENBQUE7UUFDYiw4RUFBa0IsQ0FBQTtRQUNsQixrRkFBb0IsQ0FBQTtRQUNwQiw0RUFBaUIsQ0FBQTtRQUVqQiw4RUFBa0IsQ0FBQTtRQUNsQix3RkFBdUIsQ0FBQTtRQUV2Qiw4REFBVSxDQUFBO1FBQ1YsMEVBQWdCLENBQUE7UUFDaEIsNERBQVMsQ0FBQTtRQUNULHNEQUFNLENBQUE7UUFDTixnREFBRyxDQUFBO1FBQ0gsd0RBQU8sQ0FBQTtRQUNQLHdEQUFPLENBQUE7UUFDUCw0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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "mod/Mod", "mod/ModRegistry", "ui/input/IInput", "game/entity/action/usable/actions/UsableActionsMain", "./actions/Actions", "./actions/UsableActionsQuickStack", "ui/input/Bind", "ui/component/CheckButton", "language/Translation"], function (require, exports, Mod_1, ModRegistry_1, IInput_1, UsableActionsMain_1, Actions_1, UsableActionsQuickStack_1, Bind_1, CheckButton_1, Translation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.QSTranslation = void 0;
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
    })(QSTranslation = exports.QSTranslation || (exports.QSTranslation = {}));
    ;
    class QuickStack extends Mod_1.default {
        constructor() {
            super(...arguments);
            this.TLget = (id) => Translation_1.default.get(this.dictionary, QSTranslation[id]);
        }
        SAMNBind() { return (0, UsableActionsQuickStack_1.execSAMN)(localPlayer); }
        SASNBind() { return (0, UsableActionsQuickStack_1.execSASeN)(localPlayer); }
        constructOptionsSection(section) {
            const ToggleKeys = ["optionForbidTiles", "optionKeepContainers", "optionTopDown"];
            ToggleKeys.forEach(k => {
                QuickStack.LOG.info(`${k}`);
                (!((k + "_desc") in QSTranslation)
                    ? new CheckButton_1.CheckButton()
                    : new CheckButton_1.CheckButton()
                        .addDescription(desc => desc.setText(this.TLget(k + "_desc")).setStyle("--text-size", "calc(var(--text-size-normal)*0.9)")))
                    .setText(this.TLget(k))
                    .setRefreshMethod(() => !!this.globalData[k])
                    .event.subscribe("toggle", (_, checked) => { this.globalData[k] = checked; })
                    .appendTo(section);
            });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVpY2tTdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9RdWlja1N0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFxQkEsSUFBWSxhQXdCWDtJQXhCRCxXQUFZLGFBQWE7UUFDckIseURBQVksQ0FBQTtRQUNaLCtDQUFHLENBQUE7UUFDSCxtREFBSyxDQUFBO1FBQ0wsaURBQUksQ0FBQTtRQUNKLGlEQUFJLENBQUE7UUFDSixtRUFBYSxDQUFBO1FBQ2IscURBQU0sQ0FBQTtRQUNOLHlEQUFRLENBQUE7UUFDUiwyREFBUyxDQUFBO1FBQ1QsK0RBQVcsQ0FBQTtRQUNYLHdEQUFPLENBQUE7UUFDUCxvRUFBYSxDQUFBO1FBQ2Isb0VBQWEsQ0FBQTtRQUNiLHdEQUFPLENBQUE7UUFDUCwwREFBUSxDQUFBO1FBQ1IsNERBQVMsQ0FBQTtRQUNULDBEQUFRLENBQUE7UUFDUixvRUFBYSxDQUFBO1FBQ2Isc0VBQWMsQ0FBQTtRQUNkLG9FQUFhLENBQUE7UUFDYiw4RUFBa0IsQ0FBQTtRQUNsQixrRkFBb0IsQ0FBQTtRQUNwQiw0RUFBaUIsQ0FBQTtJQUNyQixDQUFDLEVBeEJXLGFBQWEsR0FBYixxQkFBYSxLQUFiLHFCQUFhLFFBd0J4QjtJQUFBLENBQUM7SUFPRixNQUFxQixVQUFXLFNBQVEsYUFBRztRQUEzQzs7WUFVcUIsVUFBSyxHQUFHLENBQUMsRUFBOEIsRUFBRSxFQUFFLENBQUMscUJBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQThFckgsQ0FBQztRQWhDVSxRQUFRLEtBQWMsT0FBTyxJQUFBLGtDQUFRLEVBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBR3JELFFBQVEsS0FBYyxPQUFPLElBQUEsbUNBQVMsRUFBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFhdEQsdUJBQXVCLENBQUMsT0FBa0I7WUFFN0Ms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
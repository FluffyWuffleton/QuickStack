var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "mod/Mod", "mod/ModRegistry", "ui/input/Bind", "ui/input/IInput", "game/entity/action/usable/actions/UsableActionsMain", "./actions/Actions", "./actions/UsableActions"], function (require, exports, Mod_1, ModRegistry_1, Bind_1, IInput_1, UsableActionsMain_1, Actions_1, UsableActions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class QuickStack extends Mod_1.default {
        Activate() {
            QuickStack.LOG.info("Received keybind!");
            (0, Actions_1.executeStackAction)(localPlayer, [{ self: true }], [{ tiles: true }, { doodads: true }], []);
            return true;
        }
        ;
    }
    __decorate([
        ModRegistry_1.default.message("Search")
    ], QuickStack.prototype, "messageSearch", void 0);
    __decorate([
        ModRegistry_1.default.message("NoMatch")
    ], QuickStack.prototype, "messageNoMatch", void 0);
    __decorate([
        ModRegistry_1.default.message("StackedNone")
    ], QuickStack.prototype, "messageStackedNone", void 0);
    __decorate([
        ModRegistry_1.default.message("StackedSome")
    ], QuickStack.prototype, "messageStackedSome", void 0);
    __decorate([
        ModRegistry_1.default.message("StackedAll")
    ], QuickStack.prototype, "messageStackedAll", void 0);
    __decorate([
        ModRegistry_1.default.message("StackResult")
    ], QuickStack.prototype, "messageStackResult", void 0);
    __decorate([
        ModRegistry_1.default.message("ToTile")
    ], QuickStack.prototype, "messageToTile", void 0);
    __decorate([
        ModRegistry_1.default.message("ToContainer")
    ], QuickStack.prototype, "messageToContainer", void 0);
    __decorate([
        ModRegistry_1.default.message("ToInventory")
    ], QuickStack.prototype, "messageToInventory", void 0);
    __decorate([
        ModRegistry_1.default.message("ToUnknown")
    ], QuickStack.prototype, "messageToUnknown", void 0);
    __decorate([
        ModRegistry_1.default.message("FromTile")
    ], QuickStack.prototype, "messageFromTile", void 0);
    __decorate([
        ModRegistry_1.default.message("FromInventory")
    ], QuickStack.prototype, "messageFromInventory", void 0);
    __decorate([
        ModRegistry_1.default.message("FromContainer")
    ], QuickStack.prototype, "messageFromContainer", void 0);
    __decorate([
        ModRegistry_1.default.message("FromUnknown")
    ], QuickStack.prototype, "messageFromUnknown", void 0);
    __decorate([
        ModRegistry_1.default.message("ItemAll")
    ], QuickStack.prototype, "messageItemAll", void 0);
    __decorate([
        ModRegistry_1.default.message("ItemSome")
    ], QuickStack.prototype, "messageItemSome", void 0);
    __decorate([
        ModRegistry_1.default.message("QuickStack")
    ], QuickStack.prototype, "messageQuickStack", void 0);
    __decorate([
        ModRegistry_1.default.message("QuickStackType")
    ], QuickStack.prototype, "messageQuickStackType", void 0);
    __decorate([
        ModRegistry_1.default.message("QuickStackAll")
    ], QuickStack.prototype, "messageQuickStackAll", void 0);
    __decorate([
        ModRegistry_1.default.message("AllMainNearby")
    ], QuickStack.prototype, "messageAllMainNearby", void 0);
    __decorate([
        ModRegistry_1.default.message("AllSubNearby")
    ], QuickStack.prototype, "messageAllSubNearby", void 0);
    __decorate([
        ModRegistry_1.default.message("AllSelfNearby")
    ], QuickStack.prototype, "messageAllSelfNearby", void 0);
    __decorate([
        ModRegistry_1.default.message("TypeMainNearby")
    ], QuickStack.prototype, "messageTypeMainNearby", void 0);
    __decorate([
        ModRegistry_1.default.message("TypeSelfNearby")
    ], QuickStack.prototype, "messageTypeSelfNearby", void 0);
    __decorate([
        ModRegistry_1.default.message("TypeHereNearby")
    ], QuickStack.prototype, "messageTypeHereNearby", void 0);
    __decorate([
        ModRegistry_1.default.message("AllNearbyMain")
    ], QuickStack.prototype, "messageAllNearbyMain", void 0);
    __decorate([
        ModRegistry_1.default.message("AllNearbySub")
    ], QuickStack.prototype, "messageAllNearbySub", void 0);
    __decorate([
        ModRegistry_1.default.message("AllNearbySelf")
    ], QuickStack.prototype, "messageAllNearbySelf", void 0);
    __decorate([
        ModRegistry_1.default.message("TypeNearbyMain")
    ], QuickStack.prototype, "messageTypeNearbyMain", void 0);
    __decorate([
        ModRegistry_1.default.message("TypeNearbySub")
    ], QuickStack.prototype, "messageTypeNearbySub", void 0);
    __decorate([
        ModRegistry_1.default.bindable("StackAllMainNearby", IInput_1.IInput.key("slash", "Shift"))
    ], QuickStack.prototype, "bindableStackAllMainNearby", void 0);
    __decorate([
        ModRegistry_1.default.bindable("StackAllSubNearby")
    ], QuickStack.prototype, "bindableStackAllSubNearby", void 0);
    __decorate([
        ModRegistry_1.default.bindable("StackAllSelfNearby")
    ], QuickStack.prototype, "bindableStackAllSelfNearby", void 0);
    __decorate([
        ModRegistry_1.default.action("StackAction", Actions_1.StackAction)
    ], QuickStack.prototype, "actionStackAction", void 0);
    __decorate([
        ModRegistry_1.default.action("StackActionLimited", Actions_1.StackActionLimited)
    ], QuickStack.prototype, "actionStackActionLimited", void 0);
    __decorate([
        ModRegistry_1.default.usableActions("QSActions", UsableActionsMain_1.UsableActionSet.ItemMoveMenus, reg => UsableActions_1.QSUsableActions.MainSubmenu.register(reg))
    ], QuickStack.prototype, "QSActions", void 0);
    __decorate([
        Bind_1.default.onDown((0, ModRegistry_1.Registry)().get("bindableStackAllMainNearby"))
    ], QuickStack.prototype, "Activate", null);
    __decorate([
        Mod_1.default.instance()
    ], QuickStack, "INSTANCE", void 0);
    __decorate([
        Mod_1.default.log()
    ], QuickStack, "LOG", void 0);
    exports.default = QuickStack;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVpY2tTdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9RdWlja1N0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQW9CQSxNQUFxQixVQUFXLFNBQVEsYUFBRztRQThIaEMsUUFBUTtZQUNYLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFDekMsSUFBQSw0QkFBa0IsRUFBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUM1RixPQUFPLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQUEsQ0FBQztLQUNMO0lBdkhHO1FBREMscUJBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO3FEQUNZO0lBRXZDO1FBREMscUJBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO3NEQUNZO0lBRXhDO1FBREMscUJBQVEsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDOzBEQUNZO0lBRTVDO1FBREMscUJBQVEsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDOzBEQUNZO0lBRTVDO1FBREMscUJBQVEsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO3lEQUNZO0lBRTNDO1FBREMscUJBQVEsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDOzBEQUNZO0lBSTVDO1FBREMscUJBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO3FEQUNZO0lBRXZDO1FBREMscUJBQVEsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDOzBEQUNZO0lBRTVDO1FBREMscUJBQVEsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDOzBEQUNZO0lBRTVDO1FBREMscUJBQVEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO3dEQUNZO0lBSTFD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
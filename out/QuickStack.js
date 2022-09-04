var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "mod/Mod", "mod/ModRegistry", "ui/input/IInput", "game/entity/action/usable/actions/UsableActionsMain", "./actions/Actions", "./actions/UsableActionsQuickStack", "ui/input/Bind"], function (require, exports, Mod_1, ModRegistry_1, IInput_1, UsableActionsMain_1, Actions_1, UsableActionsQuickStack_1, Bind_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class QuickStack extends Mod_1.default {
        SAMNBind() { return (0, UsableActionsQuickStack_1.execSAMN)(localPlayer); }
        SASNBind() { return (0, UsableActionsQuickStack_1.execSASeN)(localPlayer); }
    }
    __decorate([
        ModRegistry_1.default.message("ArgBase")
    ], QuickStack.prototype, "messageArgBase", void 0);
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
        ModRegistry_1.default.message("MainInventory")
    ], QuickStack.prototype, "messageMainInventory", void 0);
    __decorate([
        ModRegistry_1.default.message("ThisInventory")
    ], QuickStack.prototype, "messageThisInventory", void 0);
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
        ModRegistry_1.default.message("Deposit")
    ], QuickStack.prototype, "messageDeposit", void 0);
    __decorate([
        ModRegistry_1.default.message("From")
    ], QuickStack.prototype, "messageFrom", void 0);
    __decorate([
        ModRegistry_1.default.message("AllX")
    ], QuickStack.prototype, "messageAllX", void 0);
    __decorate([
        ModRegistry_1.default.message("Main")
    ], QuickStack.prototype, "messageMain", void 0);
    __decorate([
        ModRegistry_1.default.message("Self")
    ], QuickStack.prototype, "messageSelf", void 0);
    __decorate([
        ModRegistry_1.default.message("Here")
    ], QuickStack.prototype, "messageHere", void 0);
    __decorate([
        ModRegistry_1.default.message("Sub")
    ], QuickStack.prototype, "messageSub", void 0);
    __decorate([
        ModRegistry_1.default.message("Alike")
    ], QuickStack.prototype, "messageAlike", void 0);
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
        Mod_1.default.instance()
    ], QuickStack, "INSTANCE", void 0);
    __decorate([
        Mod_1.default.log()
    ], QuickStack, "LOG", void 0);
    exports.default = QuickStack;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVpY2tTdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9RdWlja1N0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQW1CQSxNQUFxQixVQUFXLFNBQVEsYUFBRztRQWdIaEMsUUFBUSxLQUFlLE9BQU8sSUFBQSxrQ0FBUSxFQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUd0RCxRQUFRLEtBQWUsT0FBTyxJQUFBLG1DQUFTLEVBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2pFO0lBekdHO1FBREMscUJBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO3NEQUNZO0lBSXhDO1FBREMscUJBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO3FEQUNZO0lBRXZDO1FBREMscUJBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO3NEQUNZO0lBRXhDO1FBREMscUJBQVEsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDOzBEQUNZO0lBRTVDO1FBREMscUJBQVEsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDOzBEQUNZO0lBSTVDO1FBREMscUJBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO3FEQUNZO0lBRXZDO1FBREMscUJBQVEsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDOzBEQUNZO0lBRTVDO1FBREMscUJBQVEsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDOzBEQUNZO0lBRTVDO1FBREMscUJBQVEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO3dEQUNZO0lBSTFDO1FBREMscUJBQVEsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO3VEQUNZO0lBRXpDO1FBREMscUJBQVEsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDOzREQUNZO0lBRTlDO1FBREMscUJBQVEsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDOzREQUNZO0lBRTlDO1FBREMscUJBQVEsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDOzBEQUNZO0lBRzVDO1FBREMscUJBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO3NEQUNZO0lBRXhDO1FBREMscUJBQVEsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO3VEQUNZO0lBSXpDO1FBREMscUJBQVEsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDOzREQUNZO0lBRzlDO1FBREMscUJBQVEsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDOzREQUNZO0lBTzlDO1FBREMscUJBQVEsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO3lEQUNZO0lBRTNDO1FBREMscUJBQVEsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUM7NkRBQ1k7SUFFL0M7UUFEQyxxQkFBUSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUM7NERBQ1k7SUFHOUM7UUFEQyxxQkFBUSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7c0RBQ1k7SUFHeEM7UUFEQyxxQkFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7bURBQ1k7SUFJckM7UUFEQyxxQkFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7bURBQ1k7SUFFckM7UUFEQyxxQkFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7bURBQ1k7SUFFckM7UUFEQyxxQkFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7bURBQ1k7SUFFckM7UUFEQyxxQkFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7bURBQ1k7SUFFckM7UUFEQyxxQkFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7a0RBQ1k7SUFFcEM7UUFEQyxxQkFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7b0RBQ1k7SUFLdEM7UUFEQyxxQkFBUSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRSxlQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztvREFDL0I7SUFFdkM7UUFEQyxxQkFBUSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQztvREFDRDtJQUd2QztRQURDLHFCQUFRLENBQUMsUUFBUSxDQUFDLDRCQUE0QixFQUFFLGVBQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDOzREQUMvQjtJQUUvQztRQURDLHFCQUFRLENBQUMsUUFBUSxDQUFDLDRCQUE0QixDQUFDOzREQUNEO0lBTS9DO1FBREMscUJBQVEsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLHFCQUFXLENBQUM7eURBQ0U7SUFPOUM7UUFEQyxxQkFBUSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsRUFBRSxtQ0FBZSxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLGlEQUF1QixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQzt1REFDaEU7SUFHdkQ7UUFEQyxjQUFJLENBQUMsTUFBTSxDQUFDLElBQUEsc0JBQVEsR0FBYyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQzs4Q0FDSztJQUc3RDtRQURDLGNBQUksQ0FBQyxNQUFNLENBQUMsSUFBQSxzQkFBUSxHQUFjLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDOzhDQUNNO0lBakg5RDtRQURDLGFBQUcsQ0FBQyxRQUFRLEVBQWM7c0NBQ2lCO0lBRTVDO1FBREMsYUFBRyxDQUFDLEdBQUcsRUFBRTtpQ0FDc0I7SUFKcEMsNkJBb0hDIn0=
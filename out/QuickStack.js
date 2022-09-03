var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "mod/Mod", "mod/ModRegistry", "ui/input/IInput", "game/entity/action/usable/actions/UsableActionsMain", "./actions/Actions", "./actions/UsableActionsQuickStack"], function (require, exports, Mod_1, ModRegistry_1, IInput_1, UsableActionsMain_1, Actions_1, UsableActionsQuickStack_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class QuickStack extends Mod_1.default {
    }
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
    ], QuickStack.prototype, "bindableStackAllSelfNearby", void 0);
    __decorate([
        ModRegistry_1.default.bindable("StackAllMainNearby")
    ], QuickStack.prototype, "bindableStackAllMainNearby", void 0);
    __decorate([
        ModRegistry_1.default.action("StackAction", Actions_1.StackAction)
    ], QuickStack.prototype, "actionStackAction", void 0);
    __decorate([
        ModRegistry_1.default.action("StackActionLimited", Actions_1.StackActionLimited)
    ], QuickStack.prototype, "actionStackActionLimited", void 0);
    __decorate([
        ModRegistry_1.default.usableActions("QSUsableActions", UsableActionsMain_1.UsableActionSet.ItemMoveMenus, reg => UsableActionsQuickStack_1.UsableActionsQuickStack.register(reg))
    ], QuickStack.prototype, "QSUsableActions", void 0);
    __decorate([
        Mod_1.default.instance()
    ], QuickStack, "INSTANCE", void 0);
    __decorate([
        Mod_1.default.log()
    ], QuickStack, "LOG", void 0);
    exports.default = QuickStack;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVpY2tTdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9RdWlja1N0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQWtCQSxNQUFxQixVQUFXLFNBQVEsYUFBRztLQThHMUM7SUFsR0c7UUFEQyxxQkFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7cURBQ1k7SUFFdkM7UUFEQyxxQkFBUSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7c0RBQ1k7SUFFeEM7UUFEQyxxQkFBUSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7MERBQ1k7SUFFNUM7UUFEQyxxQkFBUSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7MERBQ1k7SUFJNUM7UUFEQyxxQkFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7cURBQ1k7SUFFdkM7UUFEQyxxQkFBUSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7MERBQ1k7SUFFNUM7UUFEQyxxQkFBUSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7MERBQ1k7SUFFNUM7UUFEQyxxQkFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7d0RBQ1k7SUFJMUM7UUFEQyxxQkFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7dURBQ1k7SUFFekM7UUFEQyxxQkFBUSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUM7NERBQ1k7SUFFOUM7UUFEQyxxQkFBUSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUM7NERBQ1k7SUFFOUM7UUFEQyxxQkFBUSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7MERBQ1k7SUFHNUM7UUFEQyxxQkFBUSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7c0RBQ1k7SUFFeEM7UUFEQyxxQkFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7dURBQ1k7SUFJekM7UUFEQyxxQkFBUSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUM7NERBQ1k7SUFHOUM7UUFEQyxxQkFBUSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUM7NERBQ1k7SUFPOUM7UUFEQyxxQkFBUSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUM7eURBQ1k7SUFFM0M7UUFEQyxxQkFBUSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQzs2REFDWTtJQUUvQztRQURDLHFCQUFRLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQzs0REFDWTtJQUc5QztRQURDLHFCQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztzREFDWTtJQUd4QztRQURDLHFCQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQzttREFDWTtJQUlyQztRQURDLHFCQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQzttREFDWTtJQUVyQztRQURDLHFCQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQzttREFDWTtJQUVyQztRQURDLHFCQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQzttREFDWTtJQUVyQztRQURDLHFCQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQzttREFDWTtJQUVyQztRQURDLHFCQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztrREFDWTtJQUVwQztRQURDLHFCQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztvREFDWTtJQUt0QztRQURDLHFCQUFRLENBQUMsUUFBUSxDQUFDLG9CQUFvQixFQUFFLGVBQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2tFQUNqQjtJQUdyRDtRQURDLHFCQUFRLENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDO2tFQUNhO0lBTXJEO1FBREMscUJBQVEsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLHFCQUFXLENBQUM7eURBQ0U7SUFFOUM7UUFEQyxxQkFBUSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSw0QkFBa0IsQ0FBQztnRUFDTDtJQUtyRDtRQURDLHFCQUFRLENBQUMsYUFBYSxDQUFDLGlCQUFpQixFQUFFLG1DQUFlLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsaURBQXVCLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3VEQUNoRTtJQXBHdkQ7UUFEQyxhQUFHLENBQUMsUUFBUSxFQUFjO3NDQUNpQjtJQUU1QztRQURDLGFBQUcsQ0FBQyxHQUFHLEVBQUU7aUNBQ3NCO0lBSnBDLDZCQThHQyJ9
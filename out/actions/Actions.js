define(["require", "exports", "game/entity/action/Action", "game/entity/IEntity", "../TransferHandler", "../StaticHelper", "game/entity/action/IAction", "game/entity/action/ActionExecutor", "language/Translation", "../StaticHelper", "game/entity/player/IPlayer"], function (require, exports, Action_1, IEntity_1, TransferHandler_1, StaticHelper_1, IAction_1, ActionExecutor_1, Translation_1, StaticHelper_2, IPlayer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StackAction = exports.executeStackAction = exports.executeStackAction_notify = void 0;
    function executeStackAction_notify(executor, src, dest, filter) {
        const sFlag = { failed: false };
        executeStackAction(executor, src, dest, filter, sFlag);
        StaticHelper_1.default.QS_LOG.info(`executeStackAction_notify: Flag ${sFlag.failed}`);
        return !sFlag.failed;
    }
    exports.executeStackAction_notify = executeStackAction_notify;
    function executeStackAction(executor, src, dest, filter, successFlag, suppress) {
        executor.asLocalPlayer?.messages.send(Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE.messageSearch)
            .addArgs({ prefix: StaticHelper_1.default.TLget("qsPrefix").passTo(StaticHelper_1.default.TLget("colorPrefix")) })
            .passTo(StaticHelper_1.default.TLget("underline")));
        ActionExecutor_1.default.get(exports.StackAction).execute(executor, src, dest, filter, successFlag, suppress);
    }
    exports.executeStackAction = executeStackAction;
    exports.StackAction = new Action_1.Action(IAction_1.ActionArgument.Array, IAction_1.ActionArgument.Array, IAction_1.ActionArgument.Array, IAction_1.ActionArgument.Object, IAction_1.ActionArgument.Object)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setHandler((action, src, dest, filter, sFlag, suppress) => {
        if (TransferHandler_1.default.MakeAndRun(action.executor, src, dest, filter, StaticHelper_2.GLOBALCONFIG.log_info ? StaticHelper_1.default.QS_LOG : undefined, sFlag ?? undefined, suppress ?? undefined)) {
            if (!suppress?.delay)
                action.setDelay(StaticHelper_2.GLOBALCONFIG.pause_length);
            action.setUpdateTablesAndWeight();
            action.setUpdateView(false);
            action.setPassTurn(StaticHelper_2.GLOBALCONFIG.pass_turn_success ? IPlayer_1.TurnTypeFlag.Idle : undefined);
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL0FjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQW1CQSxTQUFnQix5QkFBeUIsQ0FBQyxRQUFnQixFQUFFLEdBQXdCLEVBQUUsSUFBeUIsRUFBRSxNQUFxQjtRQUNsSSxNQUFNLEtBQUssR0FBRyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQztRQUNoQyxrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdkQsc0JBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLG1DQUFtQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUM1RSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUN6QixDQUFDO0lBTEQsOERBS0M7SUFTRCxTQUFnQixrQkFBa0IsQ0FDOUIsUUFBZ0IsRUFDaEIsR0FBd0IsRUFDeEIsSUFBeUIsRUFDekIsTUFBcUIsRUFDckIsV0FBaUMsRUFDakMsUUFBMEM7UUFFMUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUNqQyxxQkFBVyxDQUFDLE9BQU8sQ0FBQyxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUM7YUFDdEQsT0FBTyxDQUFDLEVBQUUsTUFBTSxFQUFFLHNCQUFZLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUM7YUFDN0YsTUFBTSxDQUFDLHNCQUFZLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRCx3QkFBYyxDQUFDLEdBQUcsQ0FBQyxtQkFBVyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDaEcsQ0FBQztJQWJELGdEQWFDO0lBY1ksUUFBQSxXQUFXLEdBQUcsSUFBSSxlQUFNLENBQUMsd0JBQWMsQ0FBQyxLQUFLLEVBQUUsd0JBQWMsQ0FBQyxLQUFLLEVBQUUsd0JBQWMsQ0FBQyxLQUFLLEVBQUUsd0JBQWMsQ0FBQyxNQUFNLEVBQUUsd0JBQWMsQ0FBQyxNQUFNLENBQUM7U0FDaEosV0FBVyxDQUFDLG9CQUFVLENBQUMsTUFBTSxDQUFDO1NBQzlCLFVBQVUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUU7UUFDdkQsSUFBRyx5QkFBZSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLDJCQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxzQkFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLEtBQUssSUFBSSxTQUFTLEVBQUUsUUFBUSxJQUFJLFNBQVMsQ0FBQyxFQUFFO1lBQ25LLElBQUcsQ0FBQyxRQUFRLEVBQUUsS0FBSztnQkFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLDJCQUFZLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDaEUsTUFBTSxDQUFDLHdCQUF3QixFQUFFLENBQUM7WUFDbEMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM1QixNQUFNLENBQUMsV0FBVyxDQUFDLDJCQUFZLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLHNCQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUN0RjtJQUNMLENBQUMsQ0FBQyxDQUFBIn0=
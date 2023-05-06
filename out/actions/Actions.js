define(["require", "exports", "game/entity/action/Action", "game/entity/action/ActionExecutor", "game/entity/action/IAction", "game/entity/IEntity", "game/entity/player/IPlayer", "language/Translation", "../StaticHelper", "../TransferHandler"], function (require, exports, Action_1, ActionExecutor_1, IAction_1, IEntity_1, IPlayer_1, Translation_1, StaticHelper_1, TransferHandler_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StackAction = exports.executeStackAction = exports.executeStackAction_notify = void 0;
    function executeStackAction_notify(executor, src, dest, filter) {
        const sFlag = { failed: false };
        executeStackAction(executor, src, dest, filter, sFlag);
        StaticHelper_1.default.MaybeLog.info(`executeStackAction_notify: Flag ${sFlag.failed}`);
        return !sFlag.failed;
    }
    exports.executeStackAction_notify = executeStackAction_notify;
    function executeStackAction(executor, src, dest, filter, successFlag, suppress) {
        executor.asLocalPlayer?.messages.send(Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE.messageSearch)
            .addArgs({ prefix: (0, StaticHelper_1.TLUtil)("qsPrefix").passTo((0, StaticHelper_1.TLUtil)("colorPrefix")) })
            .passTo((0, StaticHelper_1.TLUtil)("underline")));
        ActionExecutor_1.default.get(exports.StackAction).execute(executor, src, dest, filter, successFlag, suppress);
    }
    exports.executeStackAction = executeStackAction;
    exports.StackAction = new Action_1.Action(IAction_1.ActionArgument.Array, IAction_1.ActionArgument.Array, IAction_1.ActionArgument.Array, IAction_1.ActionArgument.Object, IAction_1.ActionArgument.Object)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setHandler((action, src, dest, filter, sFlag, suppress) => {
        StaticHelper_1.default.QSLSC.freeze();
        const didSomething = TransferHandler_1.default.MakeAndRun(action.executor, src, dest, filter, StaticHelper_1.default.MaybeLog, sFlag, suppress);
        StaticHelper_1.default.QSLSC.thaw();
        if (didSomething) {
            if (!suppress?.delay)
                action.setDelay(StaticHelper_1.GLOBALCONFIG.pause_length);
            action.setUpdateTablesAndWeight();
            action.setUpdateView(false);
            if (StaticHelper_1.GLOBALCONFIG.pass_turn_success)
                action.setPassTurn(IPlayer_1.TurnTypeFlag.Idle);
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL0FjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQWlCQSxTQUFnQix5QkFBeUIsQ0FBQyxRQUFnQixFQUFFLEdBQXdCLEVBQUUsSUFBeUIsRUFBRSxNQUFxQjtRQUNsSSxNQUFNLEtBQUssR0FBRyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQztRQUNoQyxrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdkQsc0JBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLG1DQUFtQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUM5RSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUN6QixDQUFDO0lBTEQsOERBS0M7SUFTRCxTQUFnQixrQkFBa0IsQ0FDOUIsUUFBZ0IsRUFDaEIsR0FBd0IsRUFDeEIsSUFBeUIsRUFDekIsTUFBcUIsRUFDckIsV0FBaUMsRUFDakMsUUFBMEM7UUFFMUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUNqQyxxQkFBVyxDQUFDLE9BQU8sQ0FBQyxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUM7YUFDdEQsT0FBTyxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUEscUJBQU0sRUFBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBQSxxQkFBTSxFQUFDLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQzthQUNyRSxNQUFNLENBQUMsSUFBQSxxQkFBTSxFQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0Qyx3QkFBYyxDQUFDLEdBQUcsQ0FBQyxtQkFBVyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDaEcsQ0FBQztJQWJELGdEQWFDO0lBY1ksUUFBQSxXQUFXLEdBQUcsSUFBSSxlQUFNLENBQUMsd0JBQWMsQ0FBQyxLQUFLLEVBQUUsd0JBQWMsQ0FBQyxLQUFLLEVBQUUsd0JBQWMsQ0FBQyxLQUFLLEVBQUUsd0JBQWMsQ0FBQyxNQUFNLEVBQUUsd0JBQWMsQ0FBQyxNQUFNLENBQUM7U0FDaEosV0FBVyxDQUFDLG9CQUFVLENBQUMsTUFBTSxDQUFDO1NBQzlCLFVBQVUsQ0FBQyxDQUFDLE1BQU0sRUFDZixHQUF3QixFQUN4QixJQUF5QixFQUN6QixNQUFxQixFQUNyQixLQUFzQyxFQUN0QyxRQUFxRCxFQUN2RCxFQUFFO1FBQ0Esc0JBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDNUIsTUFBTSxZQUFZLEdBQUcseUJBQWUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxzQkFBWSxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUE7UUFDM0gsc0JBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDMUIsSUFBRyxZQUFZLEVBQUU7WUFDYixJQUFHLENBQUMsUUFBUSxFQUFFLEtBQUs7Z0JBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQywyQkFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ2hFLE1BQU0sQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO1lBQ2xDLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDNUIsSUFBRywyQkFBWSxDQUFDLGlCQUFpQjtnQkFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLHNCQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDNUU7SUFDTCxDQUFDLENBQUMsQ0FBQSJ9
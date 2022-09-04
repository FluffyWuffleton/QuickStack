define(["require", "exports", "game/entity/action/Action", "game/entity/IEntity", "../TransferHandler", "../StaticHelper", "game/entity/action/IAction", "game/entity/action/ActionExecutor"], function (require, exports, Action_1, IEntity_1, TransferHandler_1, StaticHelper_1, IAction_1, ActionExecutor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StackAction = exports.executeStackAction = exports.executeStackAction_notify = void 0;
    function executeStackAction_notify(executor, src, dest, types) {
        const sFlag = { pass: false };
        executeStackAction(executor, src, dest, types, sFlag);
        StaticHelper_1.default.QS_LOG.info(`executeStackAction_notify: Flag ${sFlag.pass}`);
        return sFlag.pass;
    }
    exports.executeStackAction_notify = executeStackAction_notify;
    function executeStackAction(executor, src, dest, types, successFlag) {
        executor.asLocalPlayer?.messages.send(StaticHelper_1.default.QS_INSTANCE.messageSearch);
        ActionExecutor_1.default.get(exports.StackAction).execute(executor, src, dest, types, successFlag);
    }
    exports.executeStackAction = executeStackAction;
    exports.StackAction = new Action_1.Action(IAction_1.ActionArgument.Array, IAction_1.ActionArgument.Array, IAction_1.ActionArgument.Array, IAction_1.ActionArgument.Object)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setHandler((action, src, dest, types, sFlag) => (0, TransferHandler_1.MakeAndRunTransferHandler)(action.executor, src, dest, types, undefined, sFlag ?? undefined));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL0FjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQWlCQSxTQUFnQix5QkFBeUIsQ0FBQyxRQUFnQixFQUFFLEdBQXdCLEVBQUUsSUFBeUIsRUFBRSxLQUFpQjtRQUM5SCxNQUFNLEtBQUssR0FBRyxFQUFDLElBQUksRUFBQyxLQUFLLEVBQUMsQ0FBQztRQUMzQixrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdEQsc0JBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLG1DQUFtQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUMxRSxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFDdEIsQ0FBQztJQUxELDhEQUtDO0lBQ0QsU0FBZ0Isa0JBQWtCLENBQUMsUUFBZ0IsRUFBRSxHQUF3QixFQUFFLElBQXlCLEVBQUUsS0FBaUIsRUFBRSxXQUEyQjtRQUNwSixRQUFRLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDOUUsd0JBQWMsQ0FBQyxHQUFHLENBQUMsbUJBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDckYsQ0FBQztJQUhELGdEQUdDO0lBWVksUUFBQSxXQUFXLEdBQUcsSUFBSSxlQUFNLENBQUMsd0JBQWMsQ0FBQyxLQUFLLEVBQUUsd0JBQWMsQ0FBQyxLQUFLLEVBQUUsd0JBQWMsQ0FBQyxLQUFLLEVBQUUsd0JBQWMsQ0FBQyxNQUFNLENBQUM7U0FDekgsV0FBVyxDQUFDLG9CQUFVLENBQUMsTUFBTSxDQUFDO1NBQzlCLFVBQVUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLElBQUEsMkNBQXlCLEVBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQXlCLEtBQUssSUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDIn0=
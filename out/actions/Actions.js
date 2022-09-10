define(["require", "exports", "game/entity/action/Action", "game/entity/IEntity", "../TransferHandler", "../StaticHelper", "game/entity/action/IAction", "game/entity/action/ActionExecutor", "language/Translation", "../StaticHelper"], function (require, exports, Action_1, IEntity_1, TransferHandler_1, StaticHelper_1, IAction_1, ActionExecutor_1, Translation_1, StaticHelper_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StackAction = exports.executeStackAction = exports.executeStackAction_notify = void 0;
    function executeStackAction_notify(executor, src, dest, types) {
        const sFlag = { failed: false };
        executeStackAction(executor, src, dest, types, sFlag);
        StaticHelper_1.default.QS_LOG.info(`executeStackAction_notify: Flag ${sFlag.failed}`);
        return !sFlag.failed;
    }
    exports.executeStackAction_notify = executeStackAction_notify;
    function executeStackAction(executor, src, dest, types, successFlag) {
        executor.asLocalPlayer?.messages.send(Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE.messageSearch)
            .addArgs({ prefix: StaticHelper_1.default.TLget("qsPrefix").passTo(StaticHelper_1.default.TLget("colorPrefix")) })
            .passTo(StaticHelper_1.default.TLget("underline")));
        ActionExecutor_1.default.get(exports.StackAction).execute(executor, src, dest, types, successFlag);
    }
    exports.executeStackAction = executeStackAction;
    exports.StackAction = new Action_1.Action(IAction_1.ActionArgument.Array, IAction_1.ActionArgument.Array, IAction_1.ActionArgument.Array, IAction_1.ActionArgument.Object)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setHandler((action, src, dest, types, sFlag) => TransferHandler_1.default.MakeAndRun(action.executor, src, dest, types, StaticHelper_2.GLOBALCONFIG.log_info ? StaticHelper_1.default.QS_LOG : undefined, sFlag ?? undefined));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL0FjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQWtCQSxTQUFnQix5QkFBeUIsQ0FBQyxRQUFnQixFQUFFLEdBQXdCLEVBQUUsSUFBeUIsRUFBRSxLQUFpQjtRQUM5SCxNQUFNLEtBQUssR0FBRyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQztRQUNoQyxrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdEQsc0JBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLG1DQUFtQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUM1RSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUN6QixDQUFDO0lBTEQsOERBS0M7SUFTRCxTQUFnQixrQkFBa0IsQ0FBQyxRQUFnQixFQUFFLEdBQXdCLEVBQUUsSUFBeUIsRUFBRSxLQUFpQixFQUFFLFdBQWlDO1FBQzFKLFFBQVEsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FDakMscUJBQVcsQ0FBQyxPQUFPLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDO2FBQ3RELE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSxzQkFBWSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsc0JBQVksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDO2FBQzdGLE1BQU0sQ0FBQyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEQsd0JBQWMsQ0FBQyxHQUFHLENBQUMsbUJBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDckYsQ0FBQztJQU5ELGdEQU1DO0lBYVksUUFBQSxXQUFXLEdBQUcsSUFBSSxlQUFNLENBQUMsd0JBQWMsQ0FBQyxLQUFLLEVBQUUsd0JBQWMsQ0FBQyxLQUFLLEVBQUUsd0JBQWMsQ0FBQyxLQUFLLEVBQUUsd0JBQWMsQ0FBQyxNQUFNLENBQUM7U0FDekgsV0FBVyxDQUFDLG9CQUFVLENBQUMsTUFBTSxDQUFDO1NBQzlCLFVBQVUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLHlCQUFlLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsMkJBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLHNCQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsS0FBSyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMifQ==
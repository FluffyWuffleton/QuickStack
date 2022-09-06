define(["require", "exports", "game/entity/action/Action", "game/entity/IEntity", "../TransferHandler", "../StaticHelper", "game/entity/action/IAction", "game/entity/action/ActionExecutor"], function (require, exports, Action_1, IEntity_1, TransferHandler_1, StaticHelper_1, IAction_1, ActionExecutor_1) {
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
        executor.asLocalPlayer?.messages.send(StaticHelper_1.default.QS_INSTANCE.messageSearch, { prefix: StaticHelper_1.default.TLget("qsPrefix") });
        ActionExecutor_1.default.get(exports.StackAction).execute(executor, src, dest, types, successFlag);
    }
    exports.executeStackAction = executeStackAction;
    exports.StackAction = new Action_1.Action(IAction_1.ActionArgument.Array, IAction_1.ActionArgument.Array, IAction_1.ActionArgument.Array, IAction_1.ActionArgument.Object)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setHandler((action, src, dest, types, sFlag) => TransferHandler_1.default.MakeAndRun(action.executor, src, dest, types, undefined, sFlag ?? undefined));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL0FjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQWlCQSxTQUFnQix5QkFBeUIsQ0FBQyxRQUFnQixFQUFFLEdBQXdCLEVBQUUsSUFBeUIsRUFBRSxLQUFpQjtRQUM5SCxNQUFNLEtBQUssR0FBRyxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsQ0FBQztRQUM3QixrQkFBa0IsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdEQsc0JBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLG1DQUFtQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUM1RSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUN6QixDQUFDO0lBTEQsOERBS0M7SUFTRCxTQUFnQixrQkFBa0IsQ0FBQyxRQUFnQixFQUFFLEdBQXdCLEVBQUUsSUFBeUIsRUFBRSxLQUFpQixFQUFFLFdBQTZCO1FBQ3RKLFFBQVEsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsRUFBQyxNQUFNLEVBQUUsc0JBQVksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ3hILHdCQUFjLENBQUMsR0FBRyxDQUFDLG1CQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ3JGLENBQUM7SUFIRCxnREFHQztJQWFZLFFBQUEsV0FBVyxHQUFHLElBQUksZUFBTSxDQUFDLHdCQUFjLENBQUMsS0FBSyxFQUFFLHdCQUFjLENBQUMsS0FBSyxFQUFFLHdCQUFjLENBQUMsS0FBSyxFQUFFLHdCQUFjLENBQUMsTUFBTSxDQUFDO1NBQ3pILFdBQVcsQ0FBQyxvQkFBVSxDQUFDLE1BQU0sQ0FBQztTQUM5QixVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyx5QkFBZSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBeUIsS0FBSyxJQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMifQ==
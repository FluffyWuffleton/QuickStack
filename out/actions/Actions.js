define(["require", "exports", "game/entity/action/Action", "game/entity/IEntity", "../TransferHandler", "../StaticHelper", "game/entity/action/IAction", "game/entity/action/ActionExecutor"], function (require, exports, Action_1, IEntity_1, TransferHandler_1, StaticHelper_1, IAction_1, ActionExecutor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StackActionLimited = exports.StackAction = exports.executeStackActionLimited = exports.executeStackAction = void 0;
    function executeStackAction(executor, src, dest, types) {
        executor.asLocalPlayer?.messages.send(StaticHelper_1.default.QS_INSTANCE.messageSearch);
        ActionExecutor_1.default.get(exports.StackAction).execute(executor, src, dest, types);
    }
    exports.executeStackAction = executeStackAction;
    function executeStackActionLimited(executor, src, dest, type = undefined) {
        executor.asLocalPlayer?.messages.send(StaticHelper_1.default.QS_INSTANCE.messageSearch);
        ActionExecutor_1.default.get(exports.StackActionLimited).execute(executor, src, dest, type);
    }
    exports.executeStackActionLimited = executeStackActionLimited;
    exports.StackAction = new Action_1.Action(IAction_1.ActionArgument.Array, IAction_1.ActionArgument.Array, IAction_1.ActionArgument.Array)
        .setUsableBy(IEntity_1.EntityType.Player)
        .setHandler((action, src, dest, types) => (0, TransferHandler_1.MakeAndRunTransferHandler)(action.executor, src, dest, types, StaticHelper_1.default.QS_LOG));
    exports.StackActionLimited = new Action_1.Action(IAction_1.ActionArgument.Array, IAction_1.ActionArgument.Array, [IAction_1.ActionArgument.ItemType, IAction_1.ActionArgument.Undefined])
        .setUsableBy(IEntity_1.EntityType.Player)
        .setHandler((action, src, dest, type) => (0, TransferHandler_1.MakeAndRunTransferHandler)(action.executor, src, dest, !!type ? [type] : [], StaticHelper_1.default.QS_LOG));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL0FjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQWtCQSxTQUFnQixrQkFBa0IsQ0FBQyxRQUFnQixFQUFFLEdBQXdCLEVBQUUsSUFBeUIsRUFBRSxLQUFpQjtRQUN2SCxRQUFRLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDOUUsd0JBQWMsQ0FBQyxHQUFHLENBQUMsbUJBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBSEQsZ0RBR0M7SUFFRCxTQUFnQix5QkFBeUIsQ0FBQyxRQUFnQixFQUFFLEdBQWlCLEVBQUUsSUFBa0IsRUFBRSxPQUE2QixTQUFTO1FBQ3JJLFFBQVEsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM5RSx3QkFBYyxDQUFDLEdBQUcsQ0FBQywwQkFBa0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM5RSxDQUFDO0lBSEQsOERBR0M7SUFZWSxRQUFBLFdBQVcsR0FBRyxJQUFJLGVBQU0sQ0FBQyx3QkFBYyxDQUFDLEtBQUssRUFBRSx3QkFBYyxDQUFDLEtBQUssRUFBRSx3QkFBYyxDQUFDLEtBQUssQ0FBQztTQUNsRyxXQUFXLENBQUMsb0JBQVUsQ0FBQyxNQUFNLENBQUM7U0FDOUIsVUFBVSxDQUFDLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxJQUFBLDJDQUF5QixFQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsc0JBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBYXBILFFBQUEsa0JBQWtCLEdBQUcsSUFBSSxlQUFNLENBQUMsd0JBQWMsQ0FBQyxLQUFLLEVBQUUsd0JBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyx3QkFBYyxDQUFDLFFBQVEsRUFBRSx3QkFBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3hJLFdBQVcsQ0FBQyxvQkFBVSxDQUFDLE1BQU0sQ0FBQztTQUM5QixVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUEsMkNBQXlCLEVBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxzQkFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMifQ==
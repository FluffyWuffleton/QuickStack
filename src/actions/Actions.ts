import { Action } from "game/entity/action/Action";
import { EntityType } from "game/entity/IEntity";
import TransferHandler from "../TransferHandler";
import { THTargettingParam } from "../ITransferHandler";
import StaticHelper from "../StaticHelper";
import { ActionArgument } from "game/entity/action/IAction";
import { ItemType } from "game/item/IItem";
import Player from "game/entity/player/Player";

//@ts-ignore // for JSDoc
import type { QSUsable } from "./UsableActionsQuickStack";
import ActionExecutor from "game/entity/action/ActionExecutor";
import Translation from "language/Translation";
import { GLOBALCONFIG } from "../StaticHelper";

/**
 * Alternate signature for {@link executeStackAction}, returns true/false depending on transfer completion.
 */
export function executeStackAction_notify(executor: Player, src: THTargettingParam[], dest: THTargettingParam[], types: ItemType[]): boolean {
    const sFlag = { failed: false };
    executeStackAction(executor, src, dest, types, sFlag);
    StaticHelper.QS_LOG.info(`executeStackAction_notify: Flag ${sFlag.failed}`);
    return !sFlag.failed;
}
/**
 * 
 * @param {Player} executor
 * @param {THTargettingParam[]} src 
 * @param {THTargettingParam[]} dest 
 * @param {ItemType[]} types 
 * @param {{failed:boolean}} [successFlag=undefined] Optional reference to an object containing boolean property 'pass', which will be set according to the success/failure of the transfer.
 */
export function executeStackAction(executor: Player, src: THTargettingParam[], dest: THTargettingParam[], types: ItemType[], successFlag?: { failed: boolean }): void {
    executor.asLocalPlayer?.messages.send(
        Translation.message(StaticHelper.QS_INSTANCE.messageSearch)
            .addArgs({ prefix: StaticHelper.TLget("qsPrefix").passTo(StaticHelper.TLget("colorPrefix")) })
            .passTo(StaticHelper.TLget("underline")));
    ActionExecutor.get(StackAction).execute(executor, src, dest, types, successFlag);
}

/**
 * Stack items from one or more source locations one or more destinations, optionally filtering by type. 
 * 
 * Action executor parameters
 *      @arg {THTargettingParam[] as any[]} Arg0 Source targetting parameters.
 *      @arg {THTargettingParam[] as any[]} Arg1 Destination targetting parameters.
 *      @arg {ItemType[] as any[]} Arg2 Type list to filter for, with [] accepting all types.
 *      @arg {Log? as Object} Arg3 log or undefined, target for logging ouput.
 *
 * The action executor should only be called via {@link executeStackAction} for type validation.
 */
export const StackAction = new Action(ActionArgument.Array, ActionArgument.Array, ActionArgument.Array, ActionArgument.Object)
    .setUsableBy(EntityType.Player)
    .setHandler((action, src, dest, types, sFlag) => TransferHandler.MakeAndRun(action.executor, src, dest, types, GLOBALCONFIG.log_info ? StaticHelper.QS_LOG : undefined, sFlag ?? undefined));

/**
 * Stack items from one or more source locations one or more destinations, optionally filtering by type. Specified by container array.
 *
 * Action executor parameters
 *      @arg {IContainer[] as any[]} Arg0 Sources
 *      @arg {IContainer[] as any[]} Arg1 Destinations.
 *      @arg {ItemType | undefined} Arg2 Type list to filter for.
 *
 * For use by UsableActions in the {@module QSUsable} module.
 * The action executor should only be called via {@link executeStackLimited} for type validation.
 */
// export const StackActionLimited = new Action(ActionArgument.Array, ActionArgument.Array, [ActionArgument.ItemType, ActionArgument.Undefined])
//     .setUsableBy(EntityType.Player)
//     .setHandler((action, src, dest, type):boolean => MakeAndRunTransferHandler(action.executor, src, dest, !!type ? [type] : [], StaticHelper.QS_LOG));

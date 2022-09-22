import { Action } from "game/entity/action/Action";
import ActionExecutor from "game/entity/action/ActionExecutor";
import { ActionArgument } from "game/entity/action/IAction";
import { EntityType } from "game/entity/IEntity";
import { TurnTypeFlag } from "game/entity/player/IPlayer";
import Player from "game/entity/player/Player";
import Translation from "language/Translation";

import { THTargettingParam } from "../ITransferHandler";
import { IMatchParam } from "../QSMatchGroups";
import StaticHelper, { GLOBALCONFIG } from "../StaticHelper";
import TransferHandler from "../TransferHandler";


/**
 * Alternate signature for {@link executeStackAction}, returns true/false depending on transfer completion.
 */
export function executeStackAction_notify(executor: Player, src: THTargettingParam[], dest: THTargettingParam[], filter: IMatchParam[]): boolean {
    const sFlag = { failed: false };
    executeStackAction(executor, src, dest, filter, sFlag);
    StaticHelper.QS_LOG.info(`executeStackAction_notify: Flag ${sFlag.failed}`);
    return !sFlag.failed;
}
/**
 * 
 * @param {Player} executor
 * @param {THTargettingParam[]} src 
 * @param {THTargettingParam[]} dest 
 * @param {IMatchParam[]} filter
 * @param {{failed:boolean}} [successFlag=undefined] Optional reference to an object containing boolean property 'pass', which will be set according to the success/failure of the transfer.
 */
export function executeStackAction(
    executor: Player,
    src: THTargettingParam[],
    dest: THTargettingParam[],
    filter: IMatchParam[],
    successFlag?: { failed: boolean },
    suppress?: { report?: true, delay?: true }
): void {
    executor.asLocalPlayer?.messages.send(
        Translation.message(StaticHelper.QS_INSTANCE.messageSearch)
            .addArgs({ prefix: StaticHelper.TLMain("qsPrefix").passTo(StaticHelper.TLMain("colorPrefix")) })
            .passTo(StaticHelper.TLMain("underline")));
    ActionExecutor.get(StackAction).execute(executor, src, dest, filter, successFlag, suppress);
}

/**
 * Stack items from one or more source locations one or more destinations, optionally filtering by type. 
 * 
 * Action executor parameters
 *      @arg {THTargettingParam[]} src Source targetting parameters.
 *      @arg {THTargettingParam[]} dest Destination targetting parameters.
 *      @arg {IMatchParam[]} filter Type list to filter for, with [] accepting all types.
 *      @arg {?{failed:boolean}} sFlag Optional success flag reference
 *      @arg {?{report?:true, delay?:true}} suppress optional flags for suppressing messages and delay.
 *
 * The action executor should only be called via {@link executeStackAction} for type validation.
 */
export const StackAction = new Action(ActionArgument.Array, ActionArgument.Array, ActionArgument.Array, ActionArgument.Object, ActionArgument.Object)
    .setUsableBy(EntityType.Player)
    .setHandler((action,
        src: THTargettingParam[],
        dest: THTargettingParam[],
        filter: IMatchParam[],
        sFlag: { failed: boolean } | undefined,
        suppress: { report?: true, delay?: true } | undefined
    ) => {
        if(TransferHandler.MakeAndRun(action.executor, src, dest, filter, GLOBALCONFIG.log_info ? StaticHelper.QS_LOG : undefined, sFlag, suppress)) {
            if(!suppress?.delay) action.setDelay(GLOBALCONFIG.pause_length);
            action.setUpdateTablesAndWeight();
            action.setUpdateView(false);
            if(GLOBALCONFIG.pass_turn_success) action.setPassTurn(TurnTypeFlag.Idle);
        }
    })
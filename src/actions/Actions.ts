import { Action } from "game/entity/action/Action";
import { EntityType } from "game/entity/IEntity";
import { MakeAndRunTransferHandler } from "../TransferHandler";
import { THTargettingParam } from "../ITransferHandler";
import StaticHelper from "../StaticHelper";
import { ActionArgument } from "game/entity/action/IAction";
import { IContainer, ItemType } from "game/item/IItem";
import Player from "game/entity/player/Player";


//@ts-ignore // for JSDoc
import type { QSUsable } from "./UsableActionsQuickStack";
import ActionExecutor from "game/entity/action/ActionExecutor";

// function validateSubInventories(player: Player, subs: Item[]): boolean {
//     return subs.every(s => s.containedWithin === player.inventory && ((s.containedItems?.length ?? undefined) !== undefined));
// }

export function executeStackAction(executor: Player, src: THTargettingParam[], dest: THTargettingParam[], types: ItemType[]): void {
    executor.asLocalPlayer?.messages.send(StaticHelper.QS_INSTANCE.messageSearch);
    ActionExecutor.get(StackAction).execute(executor, src, dest, types);
}

export function executeStackActionLimited(executor: Player, src: IContainer[], dest: IContainer[], type: ItemType | undefined = undefined): void {
    executor.asLocalPlayer?.messages.send(StaticHelper.QS_INSTANCE.messageSearch);
    ActionExecutor.get(StackActionLimited).execute(executor, src, dest, type);
}

/**
 * Stack items from one or more source locations one or more destinations, optionally filtering by type. 
 * 
 * Action executor parameters
 *      @arg {THTargettingParam[] as any[]} Arg0 Source targetting parameters.
 *      @arg {THTargettingParam[] as any[]} Arg1 Destination targetting parameters.
 *      @arg {ItemType[] as any[]} Arg2 Type list to filter for, with [] accepting all types.
 *
 * The action executor should only be called via {@link executeStackAction} for type validation.
 */
export const StackAction = new Action(ActionArgument.Array, ActionArgument.Array, ActionArgument.Array)
    .setUsableBy(EntityType.Player)
    .setHandler((action, src, dest, types) => MakeAndRunTransferHandler(action.executor, src, dest, types, StaticHelper.QS_LOG));

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
export const StackActionLimited = new Action(ActionArgument.Array, ActionArgument.Array, [ActionArgument.ItemType, ActionArgument.Undefined])
    .setUsableBy(EntityType.Player)
    .setHandler((action, src, dest, type) => MakeAndRunTransferHandler(action.executor, src, dest, !!type ? [type] : [], StaticHelper.QS_LOG));

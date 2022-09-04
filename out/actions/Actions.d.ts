import { Action } from "game/entity/action/Action";
import { THTargettingParam } from "../ITransferHandler";
import { ActionArgument } from "game/entity/action/IAction";
import { ItemType } from "game/item/IItem";
import Player from "game/entity/player/Player";
export declare function executeStackAction_notify(executor: Player, src: THTargettingParam[], dest: THTargettingParam[], types: ItemType[]): boolean;
export declare function executeStackAction(executor: Player, src: THTargettingParam[], dest: THTargettingParam[], types: ItemType[], successFlag?: {
    pass: boolean;
}): void;
export declare const StackAction: Action<[ActionArgument.Array, ActionArgument.Array, ActionArgument.Array, ActionArgument.Object], Player, void, import("game/entity/action/IAction").IActionUsable, [any[], any[], any[], any?]>;

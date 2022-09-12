import { Action } from "game/entity/action/Action";
import { IMatchParam, THTargettingParam } from "../ITransferHandler";
import { ActionArgument } from "game/entity/action/IAction";
import Player from "game/entity/player/Player";
export declare function executeStackAction_notify(executor: Player, src: THTargettingParam[], dest: THTargettingParam[], filter: IMatchParam[]): boolean;
export declare function executeStackAction(executor: Player, src: THTargettingParam[], dest: THTargettingParam[], filter: IMatchParam[], successFlag?: {
    failed: boolean;
}, suppress?: {
    report?: true;
    delay?: true;
}): void;
export declare const StackAction: Action<[ActionArgument.Array, ActionArgument.Array, ActionArgument.Array, ActionArgument.Object, ActionArgument.Object], Player, void, import("game/entity/action/IAction").IActionUsable, [any[], any[], any[], any?, any?]>;

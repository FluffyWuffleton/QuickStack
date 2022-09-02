import { Action } from "game/entity/action/Action";
import { THTargettingParam } from "../ITransferHandler";
import { ActionArgument } from "game/entity/action/IAction";
import { IContainer, ItemType } from "game/item/IItem";
import Player from "game/entity/player/Player";
export declare function executeStackAction(executor: Player, src: THTargettingParam[], dest: THTargettingParam[], types: ItemType[]): void;
export declare function executeStackActionLimited(executor: Player, src: IContainer[], dest: IContainer[], type?: ItemType | undefined): void;
export declare const StackAction: Action<[ActionArgument.Array, ActionArgument.Array, ActionArgument.Array], Player, void, import("game/entity/action/IAction").IActionUsable, [any[], any[], any[]]>;
export declare const StackActionLimited: Action<[ActionArgument.Array, ActionArgument.Array, (ActionArgument.Undefined | ActionArgument.ItemType)[]], Player, void, import("game/entity/action/IAction").IActionUsable, [any[], any[], (ItemType | undefined)?]>;

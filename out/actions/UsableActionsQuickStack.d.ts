import { UsableActionGenerator } from "game/entity/action/usable/UsableActionRegistrar";
export declare const UsableActionsQuickStack: UsableActionGenerator<[]>;
export declare namespace QSSubmenu {
    const Deposit: UsableActionGenerator<[]>;
    const All: UsableActionGenerator<[]>;
    const Type: UsableActionGenerator<[]>;
}
export declare const StackAllSelfNearby: UsableActionGenerator<[boolean]>;
export declare const StackAllMainNearby: UsableActionGenerator<[boolean]>;
export declare const StackAllSubNearby: UsableActionGenerator<[boolean]>;
export declare const StackAllAlikeSubNearby: UsableActionGenerator<[boolean]>;
export declare const StackTypeSelfNearby: UsableActionGenerator<[boolean]>;
export declare const StackTypeHereNearby: UsableActionGenerator<[]>;

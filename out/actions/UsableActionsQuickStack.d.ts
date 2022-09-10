import { UsableActionGenerator } from "game/entity/action/usable/UsableActionRegistrar";
import Player from "game/entity/player/Player";
export declare const UsableActionsQuickStack: UsableActionGenerator<[]>;
export declare namespace QSSubmenu {
    const Deposit: UsableActionGenerator<[]>;
    const DepositAll: UsableActionGenerator<[]>;
    const DepositType: UsableActionGenerator<[]>;
    const Collect: UsableActionGenerator<[]>;
    const CollectAll: UsableActionGenerator<[]>;
    const CollectType: UsableActionGenerator<[]>;
}
export declare const StackAllSelfNearby: UsableActionGenerator<[isMainReg?: boolean | undefined]>;
export declare const execSASeN: (p: Player) => boolean;
export declare const StackAllMainNearby: UsableActionGenerator<[isMainReg?: boolean | undefined]>;
export declare const execSAMN: (p: Player) => boolean;
export declare const StackAllSubNearby: UsableActionGenerator<[isMainReg?: boolean | undefined]>;
export declare const StackAllAlikeSubNearby: UsableActionGenerator<[isMainReg?: boolean | undefined]>;
export declare const StackTypeSelfNearby: UsableActionGenerator<[isMainReg?: boolean | undefined]>;
export declare const StackTypeHereNearby: UsableActionGenerator<[isMainReg?: boolean | undefined]>;
export declare const StackAllNearbySelf: UsableActionGenerator<[isMainReg?: boolean | undefined]>;
export declare const execSANSe: (p: Player) => boolean;
export declare const StackAllNearbyMain: UsableActionGenerator<[isMainReg?: boolean | undefined]>;
export declare const execSANM: (p: Player) => boolean;
export declare const StackAllMainSub: UsableActionGenerator<[isMainReg?: boolean | undefined]>;
export declare const StackAllNearbySub: UsableActionGenerator<[isMainReg?: boolean | undefined]>;
export declare const StackAllSelfHere: UsableActionGenerator<[isMainReg?: boolean | undefined]>;
export declare const StackAllNearbyHere: UsableActionGenerator<[isMainReg?: boolean | undefined]>;
export declare const StackTypeSelfHere: UsableActionGenerator<[isMainReg?: boolean | undefined]>;
export declare const StackTypeNearbyHere: UsableActionGenerator<[isMainReg?: boolean | undefined]>;

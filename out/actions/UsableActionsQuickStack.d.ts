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
export declare const StackAllSelfNear: UsableActionGenerator<[isMainReg?: boolean | undefined]>;
export declare const execSASeN: (p: Player) => boolean;
export declare const StackAllMainNear: UsableActionGenerator<[isMainReg?: boolean | undefined]>;
export declare const execSAMN: (p: Player) => boolean;
export declare const StackAllSubNear: UsableActionGenerator<[isMainReg?: boolean | undefined]>;
export declare const StackTypeSelfNear: UsableActionGenerator<[isMainReg?: boolean | undefined]>;
export declare const StackTypeHereNear: UsableActionGenerator<[isMainReg?: boolean | undefined]>;
export declare const StackAllNearSelf: UsableActionGenerator<[isMainReg?: boolean | undefined]>;
export declare const execSANSe: (p: Player) => boolean;
export declare const StackAllNearMain: UsableActionGenerator<[isMainReg?: boolean | undefined]>;
export declare const execSANM: (p: Player) => boolean;
export declare const StackAllMainSub: UsableActionGenerator<[isMainReg?: boolean | undefined]>;
export declare const StackAllNearSub: UsableActionGenerator<[isMainReg?: boolean | undefined]>;
export declare const StackAllSelfHere: UsableActionGenerator<[isMainReg?: boolean | undefined]>;
export declare const StackAllNearHere: UsableActionGenerator<[isMainReg?: boolean | undefined]>;
export declare const StackTypeSelfHere: UsableActionGenerator<[isMainReg?: boolean | undefined]>;
export declare const StackTypeNearHere: UsableActionGenerator<[isMainReg?: boolean | undefined]>;

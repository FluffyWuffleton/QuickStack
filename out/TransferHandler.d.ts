import Island from "game/island/Island";
import Item from "game/item/Item";
import { IContainer, ItemType } from "game/item/IItem";
import Player from "game/entity/player/Player";
import { ITransferTarget, THState, ITransferPairing, ITransferTypeMatch, THTargettingParam } from "./ITransferHandler";
import Log from "utilities/Log";
export declare function isHeldContainer(player: Player, item: Item): boolean;
export declare function isContainerType(player: Player, type: ItemType): boolean;
export declare function isInHeldContainer(player: Player, item: Item): boolean;
export declare function playerHasItem(player: Player, item: Item): boolean;
export declare function playerHasType(player: Player, type: ItemType): boolean;
export declare function playerHeldContainers(player: Player, type?: ItemType[]): IContainer[];
export declare function MakeAndRunTransferHandler(player: Player, source: THTargettingParam[] | IContainer[], dest: THTargettingParam[] | IContainer[], filter?: ItemType[] | undefined, log?: Log): void;
export default class TransferHandler {
    readonly player: Player;
    readonly sources: ITransferTarget[];
    readonly destinations: ITransferTarget[];
    readonly island: Island;
    readonly typeFilter: ItemType[];
    readonly log: Log | undefined;
    readonly bottomUp: boolean;
    private _state;
    private _executionResults;
    private _anyFailed;
    private _anySuccess;
    private _anyPartial;
    get state(): THState;
    get executionResults(): ITransferPairing[][];
    get anySuccess(): boolean;
    get anyPartial(): boolean;
    get anyFailed(): boolean;
    private static setOfTypes;
    static matchTypes(A: Pick<IContainer, "containedItems">[], B: Pick<IContainer, "containedItems">[], filter?: ItemType[]): ITransferTypeMatch[];
    static countMatchTypes(A: Pick<IContainer, "containedItems">[], B: Pick<IContainer, "containedItems">[], filter?: ItemType[]): number;
    static hasMatchType(A: Pick<IContainer, "containedItems">[], B: Pick<IContainer, "containedItems">[], filter?: ItemType[]): boolean;
    static hasType(X: Pick<IContainer, "containedItems">[], type: ItemType): boolean;
    private resolveTargetting;
    executeTransfer(): THState;
    reportMessages(player?: Player): boolean;
    constructor(executor: Player, source?: THTargettingParam[] | IContainer[], dest?: THTargettingParam[] | IContainer[], filterTypes?: ItemType[], bottomUp?: boolean);
}

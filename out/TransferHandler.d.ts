import Player from "game/entity/player/Player";
import Island from "game/island/Island";
import { ContainerReferenceType, IContainer, ItemType } from "game/item/IItem";
import Item from "game/item/Item";
import { ITile } from "game/tile/ITerrain";
import TranslationImpl from "language/impl/TranslationImpl";
import Log from "utilities/Log";
import { ITransferPairing, ITransferTarget, THState, THTargettingParam } from "./ITransferHandler";
import { IMatchParam, QSMatchableGroupKey, MatchParamFlat, ThingWithContents } from "./QSMatchGroups";
export interface ITileTargettingOptions {
    ignoreForbidTiles?: boolean;
    allowBlockedTiles?: boolean;
}
export declare const SourceTileOptions: ITileTargettingOptions;
export declare const DestinationTileOptions: ITileTargettingOptions;
export declare function isHeldContainer(player: Player, item: Item): boolean;
export declare function isStorageType(type: ItemType): boolean;
export declare function isInHeldContainer(player: Player, item: Item): boolean;
export declare function playerHasItem(player: Player, item: Item): boolean;
export declare function playerHasType(player: Player, type: ItemType): boolean;
export declare function playerHeldContainers(player: Player, type?: ItemType[]): IContainer[];
export declare function itemTransferAllowed(item: Item): boolean;
export declare function itemTransferAllowed(items: Item[]): boolean[];
export declare function validNearby(player: Player, tileOptions?: ITileTargettingOptions): IContainer[];
export declare function isValidTile(tile: ITile, tileOptions?: ITileTargettingOptions): boolean;
export declare function isSafeTile(tile: ITile): boolean;
export declare function TLContainer(c: IContainer, crt: ContainerReferenceType, toFrom: "to" | "from"): TranslationImpl;
export default class TransferHandler {
    readonly player: Player;
    readonly sources: ITransferTarget[];
    readonly destinations: ITransferTarget[];
    readonly island: Island;
    readonly typeFilter: IMatchParam[];
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
    static setOfTypes(X: ThingWithContents[]): Set<ItemType>;
    static setOfActiveGroups(Types: Set<ItemType> | ItemType[]): Set<QSMatchableGroupKey>;
    static setOfParams(X: ThingWithContents[]): Set<IMatchParam>;
    static setOfFlatParams(X: ThingWithContents[]): Set<MatchParamFlat>;
    static getMatches(A: ThingWithContents[], B: ThingWithContents[], filter?: IMatchParam[]): IMatchParam[];
    static hasMatch(A: ThingWithContents[], B: ThingWithContents[], filter?: IMatchParam[]): boolean;
    static canMatch(X: ThingWithContents[], params: IMatchParam[]): boolean;
    static canFitAny(src: ThingWithContents[], dest: IContainer[], player: Player, filter?: IMatchParam[]): boolean;
    private resolveTargetting;
    private executeTransfer;
    private reportMessages;
    private constructor();
    static MakeAndRun(player: Player, source: THTargettingParam[] | IContainer[], dest: THTargettingParam[] | IContainer[], filterTypes?: IMatchParam[] | undefined, log?: Log, successFlag?: {
        failed: boolean;
    }, suppress?: {
        report?: true;
        delay?: true;
    }): boolean;
}

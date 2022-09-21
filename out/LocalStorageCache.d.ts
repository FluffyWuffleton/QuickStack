import Doodad from "game/doodad/Doodad";
import Player from "game/entity/player/Player";
import { IContainer } from "game/item/IItem";
import Item from "game/item/Item";
import { ITile } from "game/tile/ITerrain";
import { Direction } from "utilities/math/Direction";
import { IVector3 } from "utilities/math/IVector";
import { IMatchParam, MatchParamFlat } from "./QSMatchGroups";
export declare type ABCheckedMatch = [match: MatchParamFlat, fitAtoB: boolean, fitBtoA: boolean];
interface ICheckedRelations {
    checked: MatchParamFlat[];
    found: ABCheckedMatch[];
}
export declare enum locationGroup {
    self = 0,
    nearby = 1
}
export declare type ContainerHash = string;
export declare function isOnOrAdjacent(A: IVector3, B: IVector3): boolean;
export declare class LocalStorageCache {
    private _player;
    private _nearby;
    private _nearbyOutdated;
    private _interrelations;
    get player(): StorageCachePlayer;
    get playerNoUpdate(): StorageCachePlayer;
    get nearby(): (StorageCacheTile | StorageCacheDoodad)[];
    interrelation(A: ContainerHash, B: ContainerHash, filter?: MatchParamFlat[]): ICheckedRelations | undefined;
    setOutdated(K?: "player" | "nearby"): void;
    setOutdatedSpecific(Hash: ContainerHash, recursive?: true): boolean;
    private refreshNearby;
    private locationGroupMembers;
    flipHash(A: ContainerHash, B: ContainerHash): boolean;
    ABHash(A: ContainerHash, B: ContainerHash): string;
    CheckedMatchCanTransfer(ABMatch: ABCheckedMatch, filter?: MatchParamFlat[], reverse?: boolean): boolean;
    private purgeRelations;
    updateRelation(A: ContainerHash, B: ContainerHash, filter?: MatchParamFlat[]): boolean;
    canFind(Hash: ContainerHash): boolean;
    findNearby(Hash: ContainerHash): StorageCacheBase | undefined;
    checkSelfNearby(filter?: MatchParamFlat[], reverse?: true): boolean;
    checkSpecificNearby(AHash: ContainerHash, filter?: MatchParamFlat[], reverse?: true): boolean | undefined;
    checkSelfSpecific(BHash: ContainerHash, filter?: MatchParamFlat[], reverse?: true): boolean | undefined;
    checkSpecific(fromHash: ContainerHash, toHash: ContainerHash, filter?: MatchParamFlat[]): boolean | undefined;
    constructor(p: Player);
}
declare type StorageCacheEntityType = Item | Player | Doodad | ITile;
declare type StorageCacheEntityTypeString = "Item" | "Player" | "Doodad" | "ITile";
export declare abstract class StorageCacheBase<T extends StorageCacheEntityType = StorageCacheEntityType> {
    readonly entity: T;
    readonly cHash: string;
    abstract readonly iswhat: StorageCacheEntityTypeString;
    abstract readonly cRef: IContainer;
    private _main;
    private _subs;
    protected _outdated: boolean;
    get main(): Set<IMatchParam>;
    get subs(): StorageCacheItem[];
    get subsNoUpdate(): StorageCacheItem[];
    get outdated(): boolean;
    setOutdated(recursive?: true): boolean;
    deepSubs(): StorageCacheItem[];
    deepProperty<T extends keyof StorageCacheBase>(prop: T): StorageCacheBase[T][];
    findSub(sub: Item | ContainerHash): StorageCacheItem | undefined;
    protected refresh(protect?: true): this;
    constructor(e: T, hash: string, noRefresh?: true);
}
declare abstract class StorageCacheNearby<T extends ITile | Doodad> extends StorageCacheBase<T> {
    readonly nearWhom: Player;
    private _relation;
    get relation(): Direction.Cardinal | Direction.None;
    protected abstract thisPos(): IVector3;
    protected refreshRelation(): boolean;
    refreshIfNear(): boolean;
    constructor(e: T, p: Player, hash: string);
}
export declare class StorageCacheItem extends StorageCacheBase<Item> {
    readonly iswhat = "Item";
    readonly cRef: IContainer;
    constructor(e: Item);
}
export declare class StorageCachePlayer extends StorageCacheBase<Player> {
    readonly iswhat = "Player";
    readonly cRef: IContainer;
    refresh(): this;
    updateHash(): this;
    constructor(e: Player);
}
export declare class StorageCacheTile extends StorageCacheNearby<ITile> {
    readonly iswhat = "ITile";
    readonly cRef: IContainer;
    thisPos(): IVector3;
    constructor(e: ITile, p: Player);
}
export declare class StorageCacheDoodad extends StorageCacheNearby<Doodad> {
    readonly iswhat = "Doodad";
    readonly cRef: IContainer;
    thisPos(): IVector3;
    constructor(e: Doodad, p: Player);
}
export {};

import Doodad from "game/doodad/Doodad";
import Player from "game/entity/player/Player";
import { IContainer } from "game/item/IItem";
import Item from "game/item/Item";
import { ITile } from "game/tile/ITerrain";
import { Direction } from "utilities/math/Direction";
import { IVector3 } from "utilities/math/IVector";
import { IMatchParam } from "./QSMatchGroups";
import { ContainerHash } from "./LocalStorageCache";
declare type StorageCacheEntityType = Item | Player | Doodad | ITile;
declare type StorageCacheEntityTypeString = "Item" | "Player" | "Doodad" | "ITile";
export declare type StorageCacheAny = StorageCacheItem | StorageCachePlayer | StorageCacheDoodad | StorageCacheTile;
export declare abstract class StorageCacheBase<T extends StorageCacheEntityType = StorageCacheEntityType> {
    readonly entity: T;
    readonly cHash: string;
    abstract readonly cRef: IContainer;
    abstract readonly iswhat: StorageCacheEntityTypeString;
    private _main;
    private _subs;
    protected _outdated: boolean;
    protected _fullTreeFlat?: (this | StorageCacheItem)[];
    isValidSource(): boolean;
    isValidDestination(): boolean;
    get main(): Set<IMatchParam>;
    get subs(): StorageCacheItem[];
    get subsNoUpdate(): StorageCacheItem[];
    abstract get fullTreeFlat(): (this | StorageCacheAny)[];
    get outdated(): boolean;
    setOutdated(recursive?: true): boolean;
    deepSubs(): StorageCacheItem[];
    deepProperty<T extends keyof StorageCacheBase>(prop: T): StorageCacheBase[T][];
    findSub(lookingFor: Item | ContainerHash, noUpdate?: boolean): StorageCacheItem | undefined;
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
    get fullTreeFlat(): StorageCacheItem[];
    constructor(e: Item);
}
export declare class StorageCachePlayer extends StorageCacheBase<Player> {
    readonly iswhat = "Player";
    readonly cRef: IContainer;
    get fullTreeFlat(): (StorageCachePlayer | StorageCacheItem)[];
    refresh(): this;
    updateHash(): this;
    constructor(e: Player);
}
export declare class StorageCacheTile extends StorageCacheNearby<ITile> {
    readonly iswhat = "ITile";
    readonly cRef: IContainer;
    get fullTreeFlat(): (StorageCacheTile | StorageCacheItem)[];
    isValidSource(): boolean;
    isValidDestination(): boolean;
    thisPos(): IVector3;
    constructor(e: ITile, p: Player);
}
export declare class StorageCacheDoodad extends StorageCacheNearby<Doodad> {
    readonly iswhat = "Doodad";
    readonly cRef: IContainer;
    get fullTreeFlat(): (this | StorageCacheItem)[];
    thisPos(): IVector3;
    constructor(e: Doodad, p: Player);
}
export {};

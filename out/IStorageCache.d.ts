import Doodad from "game/doodad/Doodad";
import Player from "game/entity/player/Player";
import Item from "game/item/Item";
import ItemManager from "game/item/ItemManager";
import { ITile } from "game/tile/ITerrain";
import { Direction } from "utilities/math/Direction";
import { IVector3 } from "utilities/math/IVector";
import { IMatchParamSet } from "./QSMatchGroups";
export declare class ILocalStorageCache {
    readonly player: StorageCachePlayer;
    private _nearby;
    private _nearbyUnrolled;
    get nearby(): (StorageCacheTile | StorageCacheDoodad)[];
    set nearby(value: (StorageCacheTile | StorageCacheDoodad)[]);
    get nearbyUnrolled(): IMatchParamSet;
    unrollNearby(): void;
}
declare type StorageCacheEntityType = Item | Player | Doodad | ITile;
export declare abstract class StorageCache<T extends StorageCacheEntityType> {
    readonly entity: T;
    readonly cHash: string;
    private _main;
    private _subs;
    private _unrolled;
    get main(): IMatchParamSet;
    get subs(): StorageCacheItem[];
    get unrolled(): IMatchParamSet;
    updateUnrolled(): void;
    findSub(i: Item): StorageCacheItem | undefined;
    protected refreshFromArray(i: Item[]): void;
    abstract refresh(): void;
    constructor(e: T, hash: string);
}
export declare namespace StorageCache {
    function is<WHAT extends StorageCacheEntityType>(val: unknown): val is WHAT extends Item ? StorageCacheItem : WHAT extends Player ? StorageCachePlayer : WHAT extends ITile ? StorageCacheTile : StorageCacheDoodad;
}
declare abstract class StorageCacheNearby<T extends ITile | Doodad> extends StorageCache<T> {
    readonly nearWhom: Player;
    private _relation;
    get relation(): Direction.Cardinal | Direction.None;
    protected refreshRelationFromPos(thisPos: IVector3): boolean;
    protected abstract refreshRelation(): boolean;
    refresh(): boolean;
}
export declare class StorageCacheItem extends StorageCache<Item> {
    refresh(): void;
    constructor(e: Item);
}
export declare class StorageCachePlayer extends StorageCache<Player> {
    refresh(): void;
    constructor(e: Player);
}
export declare class StorageCacheTile extends StorageCacheNearby<ITile> {
    refreshRelation(): boolean;
    constructor(e: ITile, items: ItemManager);
}
export declare class StorageCacheDoodad extends StorageCacheNearby<Doodad> {
    refreshRelation(): boolean;
    constructor(e: Doodad, items: ItemManager);
}
export {};

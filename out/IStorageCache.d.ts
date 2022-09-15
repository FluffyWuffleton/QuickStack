import Doodad from "game/doodad/Doodad";
import Player from "game/entity/player/Player";
import Item from "game/item/Item";
import { ITile } from "game/tile/ITerrain";
import { Direction } from "utilities/math/Direction";
import { IVector3 } from "utilities/math/IVector";
import { IMatchParamSet } from "./QSMatchGroups";
export declare type ILocalStorageCache = {
    localPlayer: StorageCachePlayer;
} & {
    nearby: (StorageCacheTile | StorageCacheDoodad)[];
};
declare type StorageCacheEntityType = Item | Player | Doodad | ITile;
export declare abstract class StorageCache<T extends StorageCacheEntityType> {
    readonly entity: T;
    private _main;
    private _subs;
    private _unrolled?;
    get main(): IMatchParamSet;
    get subs(): StorageCacheItem[];
    get unrolled(): IMatchParamSet;
    protected refreshFromArray(i: Item[]): void;
    abstract refresh(): void;
    protected constructor(e: T);
}
export declare module StorageCache {
}
declare abstract class StorageCacheNearby<T extends ITile | Doodad> extends StorageCache<T> {
    readonly nearWhom: Player;
    private _relation;
    get relation(): Direction.Cardinal | Direction.None;
    protected refreshRelationFromPos(thisPos: IVector3): boolean;
    protected abstract refreshRelation(): boolean;
    refresh(): boolean;
}
declare class StorageCacheItem extends StorageCache<Item> {
    refresh(): void;
}
declare class StorageCachePlayer extends StorageCache<Player> {
    refresh(): void;
}
declare class StorageCacheTile extends StorageCacheNearby<ITile> {
    refreshRelation(): boolean;
}
declare class StorageCacheDoodad extends StorageCacheNearby<Doodad> {
    refreshRelation(): boolean;
}
export {};

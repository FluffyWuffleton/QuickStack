import Doodad from "game/doodad/Doodad";
import Player from "game/entity/player/Player";
import { ItemType, ItemTypeGroup } from "game/item/IItem";
import Item from "game/item/Item";
import ItemManager from "game/item/ItemManager";
import { ITile } from "game/tile/ITerrain";
import { getTilePosition } from "utilities/game/TilePosition";
import { Direction } from "utilities/math/Direction";
import { IVector3 } from "utilities/math/IVector";

import { IMatchParamSet } from "./QSMatchGroups";

export class ILocalStorageCache {
    readonly player: StorageCachePlayer;
    private _nearby: (StorageCacheTile | StorageCacheDoodad)[];
    private _nearbyFlat : IMatchParamSet | undefined;
    
    public get nearbyFlat(): IMatchParamSet {    
        if(this._nearbyFlat === undefined) this._nearbyFlat = this.computeNearbyFlat();
        return this._nearbyFlat;
    }
    public updateNearbyFlat() { this._nearbyFlat = this.computeNearbyFlat(); }
    private computeNearbyFlat(): IMatchParamSet { 
        const flat:IMatchParamSet = {types: new Set<ItemType>, groups: new Set<ItemTypeGroup> };
        this._nearby.forEach(n => {
            const unrolled = n.unroll();
            flat.types.addFrom(unrolled.types);
            flat.groups.addFrom(unrolled.groups);
        });
        return flat;
    }

    public get nearby(): (StorageCacheTile | StorageCacheDoodad)[] { this._nearbyFlat = undefined; return this._nearby;  }
    public set nearby(value: (StorageCacheTile | StorageCacheDoodad)[]) { this._nearbyFlat = undefined; this._nearby = value; }
};

type StorageCacheEntityType = Item | Player | Doodad | ITile;

export abstract class StorageCache<T extends StorageCacheEntityType> {
    readonly entity: T;
    private _main: IMatchParamSet;
    private _subs: StorageCacheItem[];

    public get main(): IMatchParamSet { return this._main; }
    public get subs(): StorageCacheItem[] { return this._subs; }
    public unroll(): IMatchParamSet { // Flattened contents across nested inventory.
        const unrolled = { types: new Set<ItemType>, groups: new Set<ItemTypeGroup> };
        for(const sub of [this._main, ...this._subs.flatMap(sub => sub.unroll())]) {
            unrolled.types.addFrom(sub.types);
            unrolled.groups.addFrom(sub.groups);
        }
        return unrolled;
    }

    public findSub(i: Item): StorageCacheItem | undefined {
        for(const s of this._subs) {
            if(s.entity === i) return s;
            const ss = s.findSub(i);
            if(ss) return ss;
        }
        return undefined;
    }

    protected refreshFromArray(i: Item[]) {
        const types = new Set<ItemType>(i.map(i => i.type))
        const groups = new Set<ItemTypeGroup>(i.flatMap(i => [...ItemManager.getGroups(i.type)]));
        groups.forEach(g => types.retainWhere(t => !ItemManager.getGroupItems(g).has(t)));

        this._main = { types: types, groups: groups };
        this._subs = i.filter(i => ItemManager.isInGroup(i.type, ItemTypeGroup.Storage)).map(ii => new StorageCacheItem(ii));
    }

    public abstract refresh(): void;

    constructor(e: T) {
        this.entity = e;
        this.refresh();
    }
};

export module StorageCache {
    export function is<WHAT extends StorageCacheEntityType>(val: unknown): val is WHAT extends Item ? StorageCacheItem
        : WHAT extends Player ? StorageCachePlayer : WHAT extends ITile ? StorageCacheTile : StorageCacheDoodad {
        return val instanceof StorageCache<WHAT>;
    }
}

/**
 * Superclass for storage cache of nearby doodad or tile, with information about its relation to the player.
 */
abstract class StorageCacheNearby<T extends ITile | Doodad> extends StorageCache<T> {
    /**
     * The player adjacent to this object, for whom the cache was generated 
     */
    readonly nearWhom: Player;
    /**
     * Relative position to the player for whom this cache was generated 
     */
    private _relation: Direction.Cardinal | Direction.None;
    public get relation(): Direction.Cardinal | Direction.None { return this._relation; }
    /**
     * Update the player-relative context of this object.
     * Returns true if the object is still adjacent to the player, false otherwise.
     */
    protected refreshRelationFromPos(thisPos: IVector3): boolean {
        const ppos = this.nearWhom.getPoint();
        const D = Direction.get({ x: ppos.x - thisPos.x, y: ppos.y - thisPos.y });
        if(Direction.isCardinal(D)) {
            this._relation = D;
            return true;
        }
        return false;
    }
    protected abstract refreshRelation(): boolean;
    public  refresh(): boolean {
        if(this.refreshRelation()) {
            this.refreshFromArray(this.entity.containedItems ?? []);
            return true;
        }
        return false;
    }
}

export class StorageCacheItem extends StorageCache<Item> { public refresh() { this.refreshFromArray(this.entity.containedItems ?? []); } }
export class StorageCachePlayer extends StorageCache<Player> { public refresh() { this.refreshFromArray(this.entity.inventory.containedItems); } }
export class StorageCacheTile extends StorageCacheNearby<ITile> { public refreshRelation(): boolean { return super.refreshRelationFromPos(((a: number[]) => ({ x: a[0], y: a[1], z: a[2] })).call(this, getTilePosition(this.entity.data))); } }
export class StorageCacheDoodad extends StorageCacheNearby<Doodad> { public refreshRelation(): boolean { return super.refreshRelationFromPos({ x: this.entity.x, y: this.entity.y, z: this.entity.z }); } }
import Doodad from "game/doodad/Doodad";
import Player from "game/entity/player/Player";
import { IContainable, ItemType, ItemTypeGroup } from "game/item/IItem";
import Item from "game/item/Item";
import ItemManager from "game/item/ItemManager";
import { ITile } from "game/tile/ITerrain";
import TileHelpers from "utilities/game/TileHelpers";
import { getTilePosition } from "utilities/game/TilePosition";
import { Direction } from "utilities/math/Direction";
import { IVector3 } from "utilities/math/IVector";
import Vector3 from "utilities/math/Vector3";
import { IMatchParam, QSMatchableGroupKey } from "./QSMatchGroups";
import StaticHelper, { GLOBALCONFIG } from "./StaticHelper";
import TransferHandler, { isStorageType } from "./TransferHandler";

export type ABMatchTuple = [match: ItemType | QSMatchableGroupKey, canFitAtoB: boolean, canFitBtoA: boolean];

export class LocalStorageCache {
    readonly player: StorageCachePlayer;
    private _nearby: (StorageCacheTile | StorageCacheDoodad)[];
    private _nearbyUnrolled: Set<IMatchParam> = new Set<IMatchParam>;
    private _outdated: { player: boolean, nearby: boolean } = { player: true, nearby: true };
    private _interrelations: { [ABHash: string]: ABMatchTuple[] }

    public get nearby(): (StorageCacheTile | StorageCacheDoodad)[] { return this._nearby; }
    public set nearby(value: (StorageCacheTile | StorageCacheDoodad)[]) { this._nearby = value; }

    public setOutdated(K: keyof typeof this._outdated) { this._outdated[K] = true; }
    public update() {
        if(this._outdated.player) {
            this._interrelations = {};
            this.player.refresh();
            this.player.updateUnrolled();
        }

        if(this._outdated.nearby) {
            this._interrelations = {};
            this._nearby.map((n, i) => n.refresh() ? undefined : i).filterNullish().reverse().forEach(removeIdx => {
                this._nearby.splice(removeIdx, 1); // containers reported by refresh() to no longer be adjacent. Remove.
            });
            const hashes: string[] = this._nearby.map(n => n.cHash);
            const itemMgr = this.player.entity.island.items;
            itemMgr.getAdjacentContainers(this.player.entity, false).forEach(adj => {
                const adjHash = itemMgr.hashContainer(adj);
                if(!hashes.includes(adjHash)) { // New container. Add it.
                    if(Doodad.is(adj)) this._nearby.push(new StorageCacheDoodad(adj, itemMgr));
                    else if(itemMgr.isTileContainer(adj) && "data" in adj) this._nearby.push(new StorageCacheTile(adj as ITile, itemMgr));
                    else if(GLOBALCONFIG.log_info) StaticHelper.QS_LOG.warn(`LocalStorageCache::update("nearby")\nUnhandled adjacent container: ${adj}`);
                }
            });
            this.unrollNearby();
        }
    }

    public get nearbyUnrolled(): Set<IMatchParam> { return this._nearbyUnrolled; }
    public unrollNearby() {
        this._nearby.forEach(n => n.updateUnrolled());
        this._nearbyUnrolled.clear();
        this._nearby.forEach(n => this._nearbyUnrolled.addFrom(n.unrolled));
    }

    public updateRelation(AHash: string, BHash: string): boolean {
        if(AHash > BHash) [AHash, BHash] = [BHash, AHash];
        const ABHash = `${AHash}${BHash}`;

        // Locate the cache entries for the provided hashes.
        const fullCacheTreeFlat = [this.player, ...this.player.deepSubs(), ...this.nearby.flatMap(n => [n, ...n.deepSubs()])];
        const fullHashList = fullCacheTreeFlat.map(c => c.cHash);
        const Aidx = fullHashList.findIndex(h => h === AHash);
        const Bidx = fullHashList.findIndex(h => h === BHash);
        if(Aidx < 0 || Bidx < 0) return false; // one of the provided hashes wasn't in the tree...
        
        const ARef = fullCacheTreeFlat[Aidx];
        const BRef = fullCacheTreeFlat[Bidx];

        // Identify matching parameters
        const matches = new Set<ItemType | QSMatchableGroupKey>([...ARef.main].map(p => p.group ?? p.type));
        const BParams = [...BRef.main].map(p => p.group ?? p.type)
        matches.retainWhere(m => BParams.includes(m));
        
        this._interrelations[ABHash] = [];
        matches.forEach(m => this._interrelations[ABHash].push(
            

        ))

        return true;
    }

};

type StorageCacheEntityType = Item | Player | Doodad | ITile;

export abstract class StorageCache<T extends StorageCacheEntityType> {
    readonly entity: T;                 // The entity whos contents this cache is observing. (player, doodad, etc)
    readonly cHash: string;             // The hash string for the IContainer corresponding to this cache's entity.
    private _main: Set<IMatchParam>;    // Matchable contents at this .
    private _subs: StorageCacheItem[];  // Array of nested subcaches for any identified sub-containers.
    private _unrolled: Set<IMatchParam>;


    public get main(): Set<IMatchParam> { return this._main; }
    public get subs(): StorageCacheItem[] { return this._subs; }
    public get unrolled(): Set<IMatchParam> { return this._unrolled; }
    public deepSubs(): StorageCacheItem[] { // All subcaches, recursive
        const ret = [...this._subs];
        this._subs.forEach(s => ret.push(...s.deepSubs()));
        return ret;
    }

    public updateUnrolled() {
        this._subs.forEach(s => s.updateUnrolled());
        this._unrolled.clear();
        this._unrolled.addFrom(this._main);
        this._subs.forEach(s => this._unrolled.addFrom(s.unrolled))
    }

    // If the provided item is a container targetted by any nested subcache of this object (i.e. subcache.entity === item), returns a reference to that subcache.
    // Otherwise returns undefined.
    public findSub(i: Item): StorageCacheItem | undefined {
        for(const s of this._subs) {
            if(s.entity === i) return s;
            const ss = s.findSub(i);
            if(ss) return ss;
        }
        return undefined;
    }

    // Recursively update the contents of this cache and subcaches using the provided item array.
    // This should only be called by type-specific constructors. Item array is assumed to represent the contents of the target entity.
    protected refreshFromArray(contents: Item[], protect?: true) {
        this._main = TransferHandler.setOfParams([{
            containedItems: (protect ?? false)
                ? contents.filter(i => !(i.isProtected || i.isEquipped(true) || (StaticHelper.QS_INSTANCE.globalData.optionKeepContainers && isStorageType(i.type))))
                : contents
        }]);
        this._subs = contents
            .filter(i => i.island.items.isContainer(i))
            .map(ii => new StorageCacheItem(ii));
    }

    public abstract refresh(): void;

    constructor(e: T, hash: string) {
        this.entity = e;
        this.cHash = hash;
        this._unrolled = new Set<IMatchParam>;
        this.refresh();
    }
};

export namespace StorageCache {
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
        const diff = { x: thisPos.x - ppos.x, y: thisPos.y - ppos.y, z: thisPos.z - ppos.z };
        if(!TileHelpers.isAdjacent(ppos, thisPos) && !Object.values(diff).every(d => d === 0)) return false; // not adjacent or on top.
        this._relation = Direction.get(diff) as typeof this._relation;
        return true;
    }
    protected abstract refreshRelation(): boolean;
    public refresh(): boolean {
        if(this.refreshRelation()) {
            this.refreshFromArray(this.entity.containedItems ?? []);
            return true;
        }
        return false;
    }
}

export class StorageCacheItem extends StorageCache<Item> {
    public refresh() { this.refreshFromArray(this.entity.containedItems ?? []); }
    constructor(e: Item) { super(e, e.island.items.hashContainer(e)); }
}
export class StorageCachePlayer extends StorageCache<Player> {
    public refresh() { this.refreshFromArray(this.entity.inventory.containedItems, true); }
    constructor(e: Player) { super(e, e.island.items.hashContainer(e.inventory)); }
}

export class StorageCacheTile extends StorageCacheNearby<ITile> {
    public refreshRelation(): boolean { return super.refreshRelationFromPos(new Vector3(getTilePosition(this.entity.data))); }
    constructor(e: ITile, items: ItemManager) { super(e, items.hashContainer(e/* island.items.getTileContainer(...getTilePosition(e.data), e) */)); }
}
export class StorageCacheDoodad extends StorageCacheNearby<Doodad> {
    public refreshRelation(): boolean { return super.refreshRelationFromPos({ x: this.entity.x, y: this.entity.y, z: this.entity.z }); }
    constructor(e: Doodad, items: ItemManager) { super(e, items.hashContainer(e as IContainable)); }
}
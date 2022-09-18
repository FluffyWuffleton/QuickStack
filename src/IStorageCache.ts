import Doodad from "game/doodad/Doodad";
import Player from "game/entity/player/Player";
import { IContainable, IContainer, ItemType } from "game/item/IItem";
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
import TransferHandler, { isStorageType, validNearby } from "./TransferHandler";

export type ABMatchesObserved = [match: (ItemType | QSMatchableGroupKey), fitAtoB: boolean, fitBtoA: boolean];
export enum locationGroup { self = 0, nearby = 1 };

export class LocalStorageCache {
    readonly player: StorageCachePlayer;
    private _nearby: (StorageCacheTile | StorageCacheDoodad)[];
    private _nearbyUnrolled: Set<IMatchParam> = new Set<IMatchParam>;
    private _outdated: { player: boolean, nearby: boolean } = { player: true, nearby: true };
    private _interrelations: {
        [ABHash: string]: {
            checked: (ItemType | QSMatchableGroupKey)[],
            found: ABMatchesObserved[]
        }
    }
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
            validNearby(this.player.entity, true).forEach(adj => {
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


    private locationGroupHashes(g: locationGroup): string[] {
        switch(g) {
            case locationGroup.nearby: return this._nearby.map(n => n.cHash);
            case locationGroup.self: return [this.player.cHash, ...this.player.deepSubs().map(s => s.cHash)];
        }
    }

    public flipHash(A: string, B: string): boolean { return A > B; }
    public ABHash(A: string, B: string): string { return this.flipHash(A, B) ? `${B}${A}` : `${A}${B}` }

    // Returns false if any of the hashes could not be found in the cache. Does nothing if the hashes are equal.
    public updateRelation(A: string | locationGroup, B: string | locationGroup, filter?: (ItemType | QSMatchableGroupKey)[]): boolean {
        if(A === B) return true;
        if(typeof A !== "string") { return !this.locationGroupHashes(A).map(hash => this.updateRelation(hash, B, filter)).some(ret => !ret); } // Recursive for locgroups.
        if(typeof B !== "string") { return !this.locationGroupHashes(B).map(hash => this.updateRelation(A, hash, filter)).some(ret => !ret); } // Recursive for locgroups.

        if(A < B) { [A, B] = [B, A]; }
        const ABHash = `${A}${B}`;

        // Identify previously checked parameters in this match, if it exists in the array.
        // If it doesn't exist in the array, initialize it.
        const checkedParams: Set<ItemType | QSMatchableGroupKey> = new Set();
        if(this._interrelations[ABHash] !== undefined) {
            checkedParams.addFrom(this._interrelations[ABHash].checked);
            if(filter !== undefined && filter.length > 0) {
                filter = [...TransferHandler.groupifyParameters(filter.map(p => typeof p === "string" ? { group: p } : { type: p }))]
                filter = filter.filter(p => !checkedParams.has(p));
                if(filter.length === 0) return true; // Is valid relation, but nothing new needs to be checked.
            }
        } else this._interrelations[ABHash] = { checked: [], found: [] };

        // Locate the cache entries for the provided hashes.
        const fullCacheTreeFlat = [this.player, ...this.player.deepSubs(), ...this.nearby.flatMap(n => [n, ...n.deepSubs()])];
        const ARef = fullCacheTreeFlat.find(cache => cache.cHash === A);
        const BRef = fullCacheTreeFlat.find(cache => cache.cHash === B);
        if(ARef === undefined || BRef === undefined) return false; // one of the provided hashes wasn't in the tree...

        const matches = new Set<ItemType | QSMatchableGroupKey>([...ARef.main].map(p => p.group ?? p.type));
        if(filter !== undefined && filter.length > 0) matches.retainWhere(m => !filter!.includes(m));
        this._interrelations[ABHash].checked.push(...matches)

        const BParams = [...BRef.main].map(p => p.group ?? p.type)
        matches.retainWhere(m => BParams.includes(m));
        if(matches.size < 1) return true; // nothing new to check.
        const infA = StorageCache.is<Player>(ARef);
        const infB = StorageCache.is<Player>(BRef);

        matches.forEach(m => {
            const fitAB = infB ? true : TransferHandler.canFitAny([ARef.cRef], [BRef.cRef], this.player.entity, typeof (m) === "string" ? [{ group: m }] : [{ type: m }]);
            const fitBA = infA ? true : TransferHandler.canFitAny([BRef.cRef], [ARef.cRef], this.player.entity, typeof (m) === "string" ? [{ group: m }] : [{ type: m }]);
            this._interrelations[ABHash].found.push([m, fitAB, fitBA])
        });
        return true;
    }

    public checkSelfNearby(filter?: (ItemType | QSMatchableGroupKey)[], reverse?: true): boolean {
        this.update();
        this.updateRelation(locationGroup.self, locationGroup.nearby, filter);

        for(const s of [this.player, ...this.player.deepSubs()])
            for(const n of this.nearby) {
                if(StorageCache.is<ITile>(n) && StaticHelper.QS_INSTANCE.globalData.optionForbidTiles && !reverse) continue; // This is a tile and a deposit operation, but tile deposit is forbidden.
                if(this._interrelations[this.ABHash(s.cHash, n.cHash)].found
                    .filter(fnd => filter === undefined || filter.length > 0 || filter.includes(fnd[0]))
                    .some(fnd => fnd[(this.flipHash(s.cHash, n.cHash) ? !reverse : reverse) ? 1 : 2]) // flip XOR reverse ? BtoA : AtoB
                ) return true;
            }
        return false;
    }

    // Return undefined if AHash isn't found in the cache.
    // Return true if transfer possible.
    public checkSpecificNearby(AHash: string, filter?: (ItemType | QSMatchableGroupKey)[], reverse?: true): boolean | undefined {
        this.update();
        if(this.updateRelation(AHash, locationGroup.nearby, filter) === false) return undefined;

        for(const n of this._nearby) {
            if(StorageCache.is<ITile>(n) && StaticHelper.QS_INSTANCE.globalData.optionForbidTiles && !reverse) continue; // This is a tile and a deposit operation, but tile deposit is forbidden.
            if(n.cHash === AHash) continue; // This is the same container...
            
            if(this._interrelations[this.ABHash(AHash, n.cHash)].found
                .filter(fnd => filter === undefined || filter.length > 0 || filter.includes(fnd[0]))
                .some(fnd => fnd[(this.flipHash(AHash, n.cHash) ? !reverse : reverse) ? 2 : 1]) // flip XOR reverse ? BtoA : AtoB
            ) return true;
        }
        return false;
    }

    // Return undefined if AHash isn't found in the cache.
    // Return true if transfer possible.
    public checkSelfSpecific(BHash: string, filter?: (ItemType | QSMatchableGroupKey)[], reverse?: true): boolean | undefined {
        this.update();
        if(this.updateRelation(BHash, locationGroup.nearby, filter) === false) return undefined;

        for(const s of [this.player, ...this.player.deepSubs()]) {
            if(s.cHash === BHash) continue; // This is the same container...
            
            if(this._interrelations[this.ABHash(s.cHash, BHash)].found
                .filter(fnd => filter === undefined || filter.length > 0 || filter.includes(fnd[0]))
                .some(fnd => fnd[(this.flipHash(s.cHash, BHash) ? !reverse : reverse) ? 2 : 1]) // flip XOR reverse ? BtoA : AtoB
            ) return true;
        }
        return false;
    }

    // Return undefined if a hash isn't found in the cache.
    // Return true if transfer possible. Returns false if no transfer possible or if hashes are equal.
    public checkSpecific(fromHash: string, toHash: string, filter?: (ItemType | QSMatchableGroupKey)[]): boolean | undefined {
        this.update();
        if(fromHash === toHash) return false;
        if(this.updateRelation(fromHash, toHash, filter) === false) return undefined;
        if(this._interrelations[this.ABHash(fromHash, toHash)].found
            .filter(fnd => filter === undefined || filter.length > 0 || filter.includes(fnd[0]))
            .some(fnd => fnd[this.flipHash(fromHash, toHash) ? 2 : 1]) // flip ? BtoA : AtoB
        ) return true;
        return false;
    }
};

type StorageCacheEntityType = Item | Player | Doodad | ITile;

export abstract class StorageCache<T extends StorageCacheEntityType> {
    readonly entity: T;                 // The entity whos contents this cache is observing. (player, doodad, etc)
    readonly cHash: string;             // The hash string for the IContainer corresponding to this cache's entity.
    abstract readonly cRef: IContainer;
    private _main: Set<IMatchParam>;    // Matchable contents at this.
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
}

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
    public readonly cRef: IContainer;
    public refresh() { this.refreshFromArray(this.entity.containedItems ?? []); }
    constructor(e: Item) {
        super(e, e.island.items.hashContainer(e));
        this.cRef = this.entity as IContainer;
    }
}
export class StorageCachePlayer extends StorageCache<Player> {
    public readonly cRef: IContainer;
    public refresh() { this.refreshFromArray(this.entity.inventory.containedItems, true); }
    constructor(e: Player) {
        super(e, e.island.items.hashContainer(e.inventory));
        this.cRef = this.entity.inventory;
    }
}

export class StorageCacheTile extends StorageCacheNearby<ITile> {
    public readonly cRef: IContainer;
    public refreshRelation(): boolean { return super.refreshRelationFromPos(new Vector3(getTilePosition(this.entity.data))); }
    constructor(e: ITile, items: ItemManager) {
        super(e, items.hashContainer(e));
        this.cRef = items.getTileContainer(...getTilePosition(e.data), e);
    }
}
export class StorageCacheDoodad extends StorageCacheNearby<Doodad> {
    public readonly cRef: IContainer;
    public refreshRelation(): boolean { return super.refreshRelationFromPos({ x: this.entity.x, y: this.entity.y, z: this.entity.z }); }
    constructor(e: Doodad, items: ItemManager) {
        super(e, items.hashContainer(e as IContainable));
        this.cRef = e;
    }
}
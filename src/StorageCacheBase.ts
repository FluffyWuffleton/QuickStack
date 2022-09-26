import Doodad from "game/doodad/Doodad";
import Player from "game/entity/player/Player";
import { IContainer } from "game/item/IItem";
import Item from "game/item/Item";
import ItemManager from "game/item/ItemManager";
import { ITile, ITileContainer } from "game/tile/ITerrain";
import { Direction } from "utilities/math/Direction";
import { IVector3 } from "utilities/math/IVector";
import Vector3 from "utilities/math/Vector3";
import { IMatchParam } from "./QSMatchGroups";
import StaticHelper from "./StaticHelper";
import TransferHandler, { isStorageType } from "./TransferHandler";
import { ContainerHash, isOnOrAdjacent } from "./LocalStorageCache";

type StorageCacheEntityType = Item | Player | Doodad | ITile;
type StorageCacheEntityTypeString = "Item" | "Player" | "Doodad" | "ITile";

export type StorageCacheAny = StorageCacheItem | StorageCachePlayer | StorageCacheDoodad | StorageCacheTile;

export abstract class StorageCacheBase<T extends StorageCacheEntityType = StorageCacheEntityType> {
    readonly entity: T; // The entity whos contents this cache is observing. (player, doodad, etc)
    readonly cHash: string; // The hash string for the IContainer corresponding to this cache's entity.
    abstract readonly iswhat: StorageCacheEntityTypeString;
    abstract readonly cRef: IContainer;

    private _main: Set<IMatchParam>; // Matchable content parameters for this entity's top-level inventory.
    private _subs: StorageCacheItem[]; // Array of subcaches for any identified sub-containers in this entity's inventory.
    private _fullTreeFlat?: StorageCacheBase[];

    //private _unrolled: Set<IMatchParam>; // Matchable content parameters for full cache tree within this entity (main, subs, nested subs, etc)
    protected _outdated: boolean = true; // Update parameters on next get?

    //protected _unrollOutdated: boolean = true;  // Update unrolled parameters on next get?
    public get main(): Set<IMatchParam> { this.refresh(); return this._main; }
    public get subs(): StorageCacheItem[] { this.refresh(); return this._subs; }
    public get subsNoUpdate(): StorageCacheItem[] { return this._subs; }
    public get fullTreeFlat(): StorageCacheBase[] {
        return this._fullTreeFlat ?? (this._fullTreeFlat = [this, ...this.deepSubs()]);
    }


    //public get unrolled(): Set<IMatchParam> { this.updateUnrolled(); return this._unrolled; }
    public get outdated(): boolean { return this._outdated; }

    // Returns true if any target caches were not already flagged as outdated
    public setOutdated(recursive?: true): boolean {
        let flagged = false;
        if(!this._outdated) {
            StaticHelper.MaybeLog.info(`StorageCacheBase.setOutdated: Cache for '${this.cHash}' is now outdated.`);
            flagged = true;
            this._outdated = true;
        }
        if(recursive)
            this._subs.forEach(s => flagged ||= s.setOutdated(true));
        return flagged;
    }

    // All subcaches in the nested tree beneath this one.
    public deepSubs(): StorageCacheItem[] { return [...this.subs, ...this.subs.flatMap(s => s.deepSubs())]; }
    public deepProperty<T extends keyof StorageCacheBase>(prop: T): StorageCacheBase[T][] { return [this[prop], ...this.deepSubs().map(s => (s as StorageCacheBase)[prop])]; }

    // If the provided item is a container found within any nested subcache of this object (i.e. subcache.entity === item), returns a reference to that subcache.
    // Does not update if outdated.
    // Otherwise returns undefined.
    public findSub(sub: Item | ContainerHash): StorageCacheItem | undefined {
        if(typeof (sub) !== "string")
            sub = sub.island.items.hashContainer(sub);
        for(const s of this._subs) {
            const ss = (s.cHash === sub) ? s : s.findSub(sub);
            if(ss)
                return ss;
        }
        return undefined;
    }

    /**
     * If 'outdated' flag is set..
     *      Update the top-level contents of this cache (_main).
     *      Update its list of subcaches, and mark them as outdated.
     *      Clear top-level outdated flag.
     * Otherwise do nothing.
     * @return {this}
     **/
    protected refresh(protect?: true): this {
        if(!this._outdated)
            return this;
        StaticHelper.MaybeLog.info(`StorageCacheBase.refresh(): Updating outdated cache for '${this.cHash}'`);
        this._main = !this.cRef.containedItems ? new Set<IMatchParam>() : TransferHandler.setOfParams([{
            containedItems: (protect ?? false)
                ? this.cRef.containedItems.filter(i => !(i.isProtected() || i.isEquipped(true) || (StaticHelper.QS_INSTANCE.globalData.optionKeepContainers && isStorageType(i.type))))
                : this.cRef.containedItems
        }]);

        const subCacheHashes = this._subs.map(s => s.cHash); // existing subcache hashes.

        const subContainers = this.cRef.containedItems?.filter(i => ItemManager.isContainer(i)) ?? []; // Up-to-date list of subcontainer items.
        const subConHashes = subContainers.map(s => s.island.items.hashContainer(s)); // Up-to-date list of subcontainer hashes.


        // Remove subcache entries for containers that are no longer present, and add entries for containers that lack one.
        subCacheHashes.map((h, idx) => subConHashes.includes(h) ? undefined : idx).filterNullish().reverse().forEach(idx => {
            StaticHelper.MaybeLog.info(`... removing cache entry for missing subcontainer '${this._subs[idx].cHash}' within ${this.cHash}`);
            this._subs.splice(idx); subCacheHashes.splice(idx);
        });
        subConHashes.map((h, idx) => subCacheHashes.includes(h) ? undefined : idx).filterNullish().forEach(idx => {
            this._subs.push(new StorageCacheItem(subContainers[idx]));
            StaticHelper.MaybeLog.info(`... adding new cache entry for subcontainer, hash '${this._subs.last()?.cHash}'`);
        });


        this._subs.forEach(s => s.setOutdated(true));
        this._outdated = false;
        return this;
    }

    constructor(e: T, hash: string, noRefresh?: true) {
        StaticHelper.MaybeLog.info(`Constructing StorageCache for entity ${e} with hash '${hash}'`);
        this.entity = e;
        this.cHash = hash;
        this._main = new Set<IMatchParam>;
        this._subs = [];
        // this._unrolled = new Set<IMatchParam>;
    }
}
/**
 * Superclass for storage cache of nearby doodad or tile, with information about its relation to the player.
 */

abstract class StorageCacheNearby<T extends ITile | Doodad> extends StorageCacheBase<T> {

    readonly nearWhom: Player; // The player adjacent to this object, for whom the cache was generated 
    private _relation: Direction.Cardinal | Direction.None; // Relative position to the player for whom this cache was generated 
    public get relation(): Direction.Cardinal | Direction.None { return this._relation; }

    protected abstract thisPos(): IVector3;

    /**
     * Update the player-relative context of this object.
     * Returns true if the object is still adjacent to the player, false otherwise.
     */
    protected refreshRelation(): boolean {
        const ppos = this.nearWhom.getPoint();
        const thisPos = this.thisPos();

        const diff = { x: thisPos.x - ppos.x, y: thisPos.y - ppos.y, z: thisPos.z - ppos.z };
        const ok = isOnOrAdjacent(ppos, thisPos);
        StaticHelper.MaybeLog.info(
            `StorageCacheNearby: Updating relation of '${this.cHash}'. Identified positions     ` +
            `Player: ${new Vector3(ppos).xyz}    Entity${new Vector3(thisPos).xyz}     OK?: ${ok}`);

        if(!ok)
            return false; // not adjacent or on top.
        this._relation = Direction.get(diff) as (Direction.Cardinal | Direction.None);
        return true;
    }

    // Refresh this cache if the entity is still in range of the player, otherwise do nothing and return false.
    public refreshIfNear(): boolean {
        if(this.refreshRelation()) {
            this.refresh();
            return true;
        }
        return false;
    }
    constructor(e: T, p: Player, hash: string) {
        super(e, hash);
        this.nearWhom = p;
    }
}

export class StorageCacheItem extends StorageCacheBase<Item> {
    public readonly iswhat = "Item";
    public readonly cRef: IContainer;
    constructor(e: Item) {
        super(e, e.island.items.hashContainer(e));
        this.cRef = this.entity as IContainer;
    }
}
export class StorageCachePlayer extends StorageCacheBase<Player> {
    public readonly iswhat = "Player";
    public readonly cRef: IContainer;
    public override refresh(): this { return super.refresh(true); }
    public updateHash(): this {
        this.cHash.replace(this.cHash, this.entity.island.items.hashContainer(this.cRef)); //"readonly" lol yea sure.
        return this;
    }

    constructor(e: Player) {
        super(e, e.island.items.hashContainer(e.inventory), true);
        this.cRef = this.entity.inventory;
    }
}

export class StorageCacheTile extends StorageCacheNearby<ITile> {
    public readonly iswhat = "ITile";
    public readonly cRef: IContainer;
    public thisPos(): IVector3 { return !('x' in this.entity && 'y' in this.entity && 'z' in this.entity) ? { x: NaN, y: NaN, z: NaN } : this.entity as IVector3; }
    constructor(e: ITile, p: Player) {
        super(e, p, p.island.items.hashContainer(e));
        this.cRef = e as ITileContainer;
    }
}
export class StorageCacheDoodad extends StorageCacheNearby<Doodad> {
    public readonly iswhat = "Doodad";
    public readonly cRef: IContainer;
    public thisPos(): IVector3 { return this.entity as IVector3; }
    constructor(e: Doodad, p: Player) {
        super(e, p, p.island.items.hashContainer(e as IContainer));
        this.cRef = e;
    }
}

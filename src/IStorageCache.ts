import Doodad from "game/doodad/Doodad";
import Player from "game/entity/player/Player";
import { IContainer } from "game/item/IItem";
import Item from "game/item/Item";
import ItemManager from "game/item/ItemManager";
import { ITile, ITileContainer } from "game/tile/ITerrain";
import { Direction } from "utilities/math/Direction";
import { IVector3 } from "utilities/math/IVector";
import Vector3 from "utilities/math/Vector3";
import { IMatchParam, MatchParamFlat } from "./QSMatchGroups";
import StaticHelper, { GLOBALCONFIG } from "./StaticHelper";
import TransferHandler, { isStorageType, validNearby } from "./TransferHandler";

export type ABCheckedMatch = [match: MatchParamFlat, fitAtoB: boolean, fitBtoA: boolean];
interface ICheckedRelations { checked: MatchParamFlat[], found: ABCheckedMatch[] };

export enum locationGroup { self = 0, nearby = 1 };
export type ContainerHash = string;


export function isOnOrAdjacent(A: IVector3, B: IVector3): boolean { return A.z === B.z && (Math.abs(A.x - B.x) + Math.abs(A.y - B.y)) <= 1 }

export class LocalStorageCache {
    private _player: StorageCachePlayer;
    private _nearby: (StorageCacheTile | StorageCacheDoodad)[] = [];
    // private _nearbyUnrolled: Set<IMatchParam> = new Set<IMatchParam>;
    private _nearbyOutdated: boolean = true;

    private _interrelations: { [ABHash: string]: ICheckedRelations } = {};
    public get player(): StorageCachePlayer { return this._player.refresh(); }
    public get nearby(): (StorageCacheTile | StorageCacheDoodad)[] { return this.refreshNearby()._nearby; }

    //public set nearby(value: (StorageCacheTile | StorageCacheDoodad)[]) { this._nearby = value; }
    public interrelation(A: ContainerHash, B: ContainerHash, filter?: MatchParamFlat[]): ICheckedRelations | undefined {
        return this.updateRelation(A, B, filter) ? this._interrelations[this.ABHash(A, B)] : undefined;
    }

    //public setOutdated(K?: "player" | "nearby") { if(K) this._outdated[K] = true; else { this._outdated.nearby = true; this._outdated.player = true; } }
    public setOutdated(K?: "player" | "nearby") {
        const upd = !K ? ["player", "nearby"] : [K];
        if(upd.includes("player")) this.player.setOutdated(true);
        if(upd.includes("nearby")) {
            this._nearbyOutdated = true;
            this._nearby.forEach(n => n.setOutdated(true));
        }
        this._interrelations = {};
    }

    private refreshNearby(): this {
        if(!this._nearbyOutdated) return this;
        //if(GLOBALCONFIG.log_info) StaticHelper.QS_LOG.info("LocalStorageCache: Updating nearby...");

        const hashes: string[] = this._nearby.map(n => n.cHash);
        const itemMgr = this.player.entity.island.items;

        this._nearby.map((n, i) => n.refreshIfNear() ? undefined : i).filterNullish().reverse().forEach(removeIdx => {
            if(GLOBALCONFIG.log_info) StaticHelper.QS_LOG.info(`Removing cache for distant entity '${this._nearby[removeIdx].cHash}' at index ${removeIdx}.`);
            this.purgeRelations(this._nearby[removeIdx].cHash);
            this._nearby.splice(removeIdx, 1); // containers reported by refresh() to no longer be adjacent. Remove.
        });

        validNearby(this.player.entity, true).forEach(adj => {
            const adjHash = itemMgr.hashContainer(adj);
            if(!hashes.includes(adjHash)) { // New container. Add it.
                if(GLOBALCONFIG.log_info) StaticHelper.QS_LOG.info(`Appending new cache for nearby entity '${this.player.entity.island.items.hashContainer(adj)}'`);
                if(Doodad.is(adj)) this._nearby.push(new StorageCacheDoodad(adj, this.player.entity));
                else if(itemMgr.isTileContainer(adj) && "data" in adj) this._nearby.push(new StorageCacheTile(adj as ITile, this.player.entity));
                else if(GLOBALCONFIG.log_info) StaticHelper.QS_LOG.warn(`FAILED TO HANDLE ADJACENT CONTAINER: ${adj}'`);
            }
        });

        this._nearbyOutdated = false;
        return this;
    }

    /* public get nearbyUnrolled(): Set<IMatchParam> { return this._nearbyUnrolled; }
    public unrollNearby() {
        this._nearby.forEach(n => n.updateUnrolled());
        this._nearbyUnrolled.clear();
        this._nearby.forEach(n => this._nearbyUnrolled.addFrom(n.unrolled));
    } */

    private locationGroupMembers(g: locationGroup): StorageCacheBase[] {
        switch(g) {
            case locationGroup.nearby: return this._nearby;
            case locationGroup.self: return [this.player, ...this.player.deepSubs()];
        }
    }



    public flipHash(A: ContainerHash, B: ContainerHash): boolean { return A > B; }
    public ABHash(A: ContainerHash, B: ContainerHash): string { return this.flipHash(A, B) ? `${B}::${A}` : `${A}::${B}` }
    public CheckedMatchCanTransfer(ABMatch: ABCheckedMatch, filter?: MatchParamFlat[], reverse?: boolean) {
        return ABMatch[reverse ? 2 : 1] && (!filter || !filter.length || filter.includes(ABMatch[0]));
    }


    private purgeRelations(oldHash: ContainerHash) {
        Object.keys(this._interrelations)
            .map(KEY => KEY.includes(oldHash) ? KEY : undefined).filterNullish()
            .forEach(KEY => delete(this._interrelations[KEY])
        )
    }

    /**
     * @param {(ContainerHash | locationGroup)} A   The first hash or location to pair.
     * @param {(ContainerHash | locationGroup)} B   The second hash or location to pair.
     * @param {(MatchParamFlat[])} [filter] Flattened parameter
     * @returns {*}  {boolean}
     * @memberof LocalStorageCache
     */
    public updateRelation(A: ContainerHash, B: ContainerHash, filter?: MatchParamFlat[]): boolean {
        if(A === B) return true;
        // if(typeof A !== "string") { return !this.locationGroupHashes(A).map(hash => this.updateRelation(hash, B, filter)).some(ret => !ret); } // Recursive for locgroups.
        // if(typeof B !== "string") { return !this.locationGroupHashes(B).map(hash => this.updateRelation(A, hash, filter)).some(ret => !ret); } // Recursive for locgroups.

        const flip = this.flipHash(A, B);
        const ABHash = this.ABHash(A, B);

        // Identify previously checked parameters in this match, if it exists in the array.
        // If it doesn't exist in the array, initialize it.
        const checkedParams: Set<MatchParamFlat> = new Set();
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
        const Ref = [fullCacheTreeFlat.find(cache => cache.cHash === (flip ? B : A)), fullCacheTreeFlat.find(cache => cache.cHash === (flip ? A : B))]
        if(Ref[0] === undefined || Ref[1] === undefined) return false; // one of the provided hashes wasn't in the tree...

        const matches = new Set<MatchParamFlat>([...Ref[0].main].map(p => p.group ?? p.type));
        if(filter !== undefined && filter.length > 0) matches.retainWhere(m => filter!.includes(m));
        matches.retainWhere(m => !this._interrelations[ABHash].checked.includes(m));
        this._interrelations[ABHash].checked.push(...matches)

        const BParams = [...Ref[1].main].map(p => p.group ?? p.type)
        matches.retainWhere(m => BParams.includes(m));
        if(matches.size < 1) return true; // nothing new to check.
        const infCapacity = Ref.map(r => r!.iswhat === "Player");

        matches.forEach(m => {
            const fitAB = infCapacity[1] ? true : TransferHandler.canFitAny([Ref[0]!.cRef], [Ref[1]!.cRef], this.player.entity, typeof (m) === "string" ? [{ group: m }] : [{ type: m }]);
            const fitBA = infCapacity[0] ? true : TransferHandler.canFitAny([Ref[1]!.cRef], [Ref[0]!.cRef], this.player.entity, typeof (m) === "string" ? [{ group: m }] : [{ type: m }]);
            this._interrelations[ABHash].found.push([m, fitAB, fitBA])
        });
        return true;
    }

    public checkSelfNearby(filter?: MatchParamFlat[], reverse?: true): boolean {
        //this.update();
        for(const s of this.locationGroupMembers(locationGroup.self))
            for(const n of this.locationGroupMembers(locationGroup.self)) {
                if(n.iswhat === "ITile" && StaticHelper.QS_INSTANCE.globalData.optionForbidTiles && !reverse) continue; // This is a tile and a deposit operation, but tile deposit is forbidden.
                const flip = this.flipHash(s.cHash, n.cHash) ? !reverse : !!reverse;
                if(this.interrelation(s.cHash, n.cHash)?.found.some(checkedMatch => this.CheckedMatchCanTransfer(checkedMatch, filter, flip)))
                    return true;
            }
        return false;
    }

    // Return undefined if AHash isn't found in the cache.
    // Return true if transfer possible.
    public checkSpecificNearby(AHash: ContainerHash, filter?: MatchParamFlat[], reverse?: true): boolean | undefined {
        if(![this.player, ...this._nearby].some(c => c.findSub(AHash))) return undefined; // hash wasn't found.

        for(const n of this.nearby) {
            if(n.iswhat === "ITile" && StaticHelper.QS_INSTANCE.globalData.optionForbidTiles && !reverse) continue; // This is a tile and a deposit operation, but tile deposit is forbidden.
            if(n.cHash === AHash) continue; // This is the same container...

            const flip = this.flipHash(AHash, n.cHash) ? !reverse : !!reverse;
            if(this.interrelation(AHash, n.cHash)?.found.some(checkedMatch => this.CheckedMatchCanTransfer(checkedMatch, filter, flip)))
                return true;
        }
        return false;
    }

    // Return undefined if AHash isn't found in the cache.
    // Return true if transfer possible.
    public checkSelfSpecific(BHash: ContainerHash, filter?: MatchParamFlat[], reverse?: true): boolean | undefined {
        if(![this.player, ...this._nearby].some(c => c.findSub(BHash))) return undefined; // hash wasn't found.

        for(const s of [this.player, ...this.player.deepSubs()]) {
            if(s.cHash === BHash) continue; // This is the same container...
            const flip = this.flipHash(s.cHash, BHash) ? !reverse : !!reverse;
            if(this.interrelation(s.cHash, BHash)?.found.some(checkedMatch => this.CheckedMatchCanTransfer(checkedMatch, filter, flip)))
                return true;
        }
        return false;
    }

    // Return undefined if a hash isn't found in the cache.
    // Return true if transfer possible. Returns false if no transfer possible or if hashes are equal.
    public checkSpecific(fromHash: ContainerHash, toHash: ContainerHash, filter?: MatchParamFlat[]): boolean | undefined {
        if(fromHash === toHash) return false;
        [fromHash, toHash].forEach(h => { if(![this.player, ...this._nearby].some(c => c.findSub(h))) return undefined; }); // hash wasn't found.
        const flip = this.flipHash(fromHash, toHash);
        return this.interrelation(fromHash, toHash)?.found.some(checkedMatch => this.CheckedMatchCanTransfer(checkedMatch, filter, flip))
    }

    constructor(p: Player) {
        this._player = new StorageCachePlayer(p);
    }
};

type StorageCacheEntityType = Item | Player | Doodad | ITile;
type StorageCacheEntityTypeString = "Item" | "Player" | "Doodad" | "ITile";

export abstract class StorageCacheBase<T extends StorageCacheEntityType = StorageCacheEntityType> {
    readonly entity: T;                 // The entity whos contents this cache is observing. (player, doodad, etc)
    readonly cHash: string;             // The hash string for the IContainer corresponding to this cache's entity.
    abstract readonly iswhat: StorageCacheEntityTypeString;
    abstract readonly cRef: IContainer;

    private _main: Set<IMatchParam>;     // Matchable content parameters for this entity's top-level inventory.
    private _subs: StorageCacheItem[];   // Array of subcaches for any identified sub-containers in this entity's inventory.
    //private _unrolled: Set<IMatchParam>; // Matchable content parameters for full cache tree within this entity (main, subs, nested subs, etc)

    protected _outdated: boolean = true;        // Update parameters on next get?
    //protected _unrollOutdated: boolean = true;  // Update unrolled parameters on next get?

    public get main(): Set<IMatchParam> { this.refresh(); return this._main; }
    public get subs(): StorageCacheItem[] { this.refresh(); return this._subs; }
    //public get unrolled(): Set<IMatchParam> { this.updateUnrolled(); return this._unrolled; }
    public get outdated(): boolean { return this._outdated; }

    public setOutdated(recursive?: true): void { this._outdated = true; if(recursive) this._subs.forEach(s => s.setOutdated(true)); }

    // All subcaches in the nested tree beneath this one.
    public deepSubs(): StorageCacheItem[] { return [...this.subs, ...this.subs.flatMap(s => s.deepSubs())]; }

    // public updateUnrolled() {
    //     this._unrolled.clear();
    //     this._unrolled.addFrom(this._main);
    //     this._subs.forEach(s => s.updateUnrolled());
    //     this._subs.forEach(s => this._unrolled.addFrom(s.unrolled))
    // }

    // If the provided item is a container found within any nested subcache of this object (i.e. subcache.entity === item), returns a reference to that subcache.
    // Otherwise returns undefined.
    public findSub(sub: Item | ContainerHash): StorageCacheItem | undefined {
        if(typeof (sub) !== "string") sub = sub.island.items.hashContainer(sub);
        for(const s of this._subs) {
            const ss = (s.cHash === sub) ? s : s.findSub(sub);
            if(ss) return ss;
        }
        return undefined
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
        if(!this._outdated) return this;
        if(GLOBALCONFIG.log_info) StaticHelper.QS_LOG.info(`StorageCacheBase.refresh(): Updating outdated cache for entity ${this.entity} with hash '${this.cHash}'`);
        this._main = TransferHandler.setOfParams([{
            containedItems: (protect ?? false)
                ? this.cRef.containedItems.filter(i => !(i.isProtected() || i.isEquipped(true) || (StaticHelper.QS_INSTANCE.globalData.optionKeepContainers && isStorageType(i.type))))
                : this.cRef.containedItems
        }]);

        const subCacheHashes = this._subs.map(s => s.cHash); // existing subcache hashes.
        const subContainers = this.cRef.containedItems.filter(i => ItemManager.isContainer(i)); // Identified subcontainers.
        const subConHashes = subContainers.map(s => s.island.items.hashContainer(s)); // Subcontainer hashes.

        // Remove subcache entries for containers that are no longer present, and add entries for containers that lack one.
        subCacheHashes.map((h, idx) => subConHashes.includes(h) ? undefined : idx).filterNullish().reverse().forEach(idx => {
            if(GLOBALCONFIG.log_info) StaticHelper.QS_LOG.info(`... removing cache entry for missing subcontainer, hash '${this._subs[idx].cHash}'`);
            this._subs.splice(idx); subCacheHashes.splice(idx);
        });
        subConHashes.map((h, idx) => subCacheHashes.includes(h) ? undefined : idx).filterNullish().forEach(idx => {
            this._subs.push(new StorageCacheItem(subContainers[idx]))
            if(GLOBALCONFIG.log_info) StaticHelper.QS_LOG.info(`... adding new cache entry for subcontainer, hash '${this._subs.last()?.cHash}'`);
        });


        this._subs.forEach(s => s.setOutdated(true));
        this._outdated = false;
        return this;
    }

    constructor(e: T, hash: string, noRefresh?: true) {
        if(GLOBALCONFIG.log_info) StaticHelper.QS_LOG.info(`Constructing StorageCache for entity ${e} with hash '${hash}'`);
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
        if(GLOBALCONFIG.log_info) StaticHelper.QS_LOG.info(
            `StorageCacheNearby: Updating relation of '${this.cHash}'. Identified positions\n` +
            `Player: ${new Vector3(ppos).xyz}    Entity${new Vector3(thisPos).xyz}     OK?: ${ok}`);

        if(!ok) return false; // not adjacent or on top.
        this._relation = Direction.get(diff) as (Direction.Cardinal | Direction.None);
        return true;
    }

    // Refresh this cache if the entity is still in range of the player, otherwise do nothing and return false.
    public refreshIfNear(): boolean {
        if(this.refreshRelation()) {
            this.refresh();
            return true
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
    constructor(e: Player) {
        super(e, e.island.items.hashContainer(e.inventory), true);
        this.cRef = this.entity.inventory;
    }
}

export class StorageCacheTile extends StorageCacheNearby<ITile> {
    public readonly iswhat = "ITile";
    public readonly cRef: IContainer;
    public thisPos(): IVector3 { return !this.nearWhom.island.isTileEmpty(this.entity) ? { x: NaN, y: NaN, z: NaN } : this.entity as IVector3; }
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
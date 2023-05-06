import Doodad from "game/doodad/Doodad";
import Player from "game/entity/player/Player";
import { IVector3 } from "utilities/math/IVector";

import { groupifyParameters, MatchParamFlat } from "./QSMatchGroups";
import StaticHelper from "./StaticHelper";
import { StorageCachePlayer, StorageCacheTile, StorageCacheDoodad, StorageCacheBase, StorageCacheItem } from "./StorageCacheBase";
import TransferHandler, { DestinationTileOptions, isValidTile, SourceTileOptions, validNearby } from "./TransferHandler";
import { ITileContainer } from "game/tile/ITerrain";

export type ABCheckedMatch = [match: MatchParamFlat, fitAtoB: boolean, fitBtoA: boolean];
interface ICheckedRelations { checked: MatchParamFlat[], found: ABCheckedMatch[] };

export enum locationGroup { self = 0, nearby = 1 };
export type ContainerHash = string;

export function isOnOrAdjacent(A: IVector3, B: IVector3): boolean { return A.z === B.z && (Math.abs(A.x - B.x) + Math.abs(A.y - B.y)) <= 1 }

export class LocalStorageCache {
    private _player: StorageCachePlayer;
    private _nearby: (StorageCacheTile | StorageCacheDoodad)[] = [];
    private _nearbyOutdated: boolean = true;
    private _freeze: boolean = false;

    private _interrelations: { [ABHash: string]: ICheckedRelations } = {};
    private _fullTreeFlat?: StorageCacheBase[];

    public get player(): StorageCachePlayer { return this._player.refresh(); }
    public get playerNoUpdate(): StorageCachePlayer { return this._player; }
    public get nearby(): (StorageCacheTile | StorageCacheDoodad)[] { return this.refreshNearby()._nearby; }

    public get frozen(): boolean { return this._freeze; }
    public freeze(updateFirst: boolean = true) {
        if(updateFirst) this.refreshNearby();
        for(const c of [this._player, ...this._nearby]) c.freeze(updateFirst);
        this._freeze = true;
    }
    public thaw() {
        for(const c of [this._player, ...this._nearby]) c.thaw(true);
        this._freeze = false;
    }


    private get fullTreeFlat(): StorageCacheBase[] {
        return this._fullTreeFlat ??
            (this._fullTreeFlat = [this.player, ...this.nearby].flatMap(c => [c, ...c.deepSubs()]));
    }

    public interrelation(A: ContainerHash, B: ContainerHash, filter?: MatchParamFlat[]): ICheckedRelations | undefined {
        return this.updateRelation(A, B, filter) ? this._interrelations[this.ABHash(A, B)] : undefined;
    }

    public setOutdated(K?: "player" | "nearby") {
        if(!K || K === "player") {
            this.purgeRelations(this._player);
            this._player.setOutdated(true);
        }
        if(!K || K === "nearby") {
            if(!this._nearbyOutdated) StaticHelper.MaybeLog.info(`StorageCacheBase.setOutdated: List of nearby containers is now outdated.`);
            this._nearbyOutdated = true;
        }
        this._fullTreeFlat = undefined;
    }

    // Set the outdated flag for a cache with specified container hash. Returns false if no such cache exists.
    public setOutdatedSpecific(Hash: ContainerHash, recursive?: true): boolean {
        const found = this._player.findSub(Hash) ?? this.findNearby(Hash);
        if(found !== undefined) {
            if(found.setOutdated(recursive)) {
                StaticHelper.MaybeLog.info(`LocalStorageCache.setOutdatedSpecific: Cache or subcache of '${Hash}' newly flagged as outdated. Wiping its relations.`);
                this.purgeRelations(found);
            }
            return true;
        }
        return false;
    }

    // Update the list of nearby entities: remove out-of-range entities, and flag the caches for new/remaining entities as outdated.
    private refreshNearby(): this {
        if(!this._nearbyOutdated || this._freeze) return this;

        const hashes: string[] = this._nearby.map(n => n.cHash);
        const itemMgr = this._player.entity.island.items;

        this._nearby // update near, remove distant
            .map((n, i) => n.refreshIfNear() ? undefined : i)
            .filterNullish().reverse()
            .forEach(removeIdx => {
                StaticHelper.MaybeLog.info(`Removing cache for distant entity '${this._nearby[removeIdx].cHash}' at index ${removeIdx}.`);
                this.purgeRelations(this._nearby[removeIdx]);
                this._nearby.splice(removeIdx, 1); // containers reported by refresh() to no longer be adjacent. Remove.
            });

        // Append new near
        validNearby(this._player.entity, { ignoreForbidTiles: true, allowBlockedTiles: true }).forEach(adj => {
            const adjHash = itemMgr.hashContainer(adj);
            if(!hashes.includes(adjHash)) {
                StaticHelper.MaybeLog.info(`Appending new cache for nearby entity '${this._player.entity.island.items.hashContainer(adj)}'`);
                if(Doodad.is(adj)) this._nearby.push(new StorageCacheDoodad(adj, this._player.entity));
                else if(itemMgr.isTileContainer(adj)) this._nearby.push(new StorageCacheTile(this._player.entity.island.getTileFromPoint(adj as ITileContainer), this._player.entity));
                else StaticHelper.MaybeLog.warn(`FAILED TO HANDLE ADJACENT CONTAINER: ${adj}'`);
            }
        });

        this._nearbyOutdated = false;
        return this;
    }

    private locationGroupMembers(g: locationGroup.nearby): (StorageCacheDoodad | StorageCacheTile)[];
    private locationGroupMembers(g: locationGroup.self): (StorageCachePlayer | StorageCacheItem)[];
    private locationGroupMembers(g: locationGroup): (StorageCacheDoodad | StorageCacheTile)[] | (StorageCachePlayer | StorageCacheItem)[];
    private locationGroupMembers(g: locationGroup): (StorageCacheDoodad | StorageCacheTile)[] | (StorageCacheItem | StorageCachePlayer)[] {
        switch(g) {
            case locationGroup.nearby: return this._nearby;
            case locationGroup.self: return [this._player, ...this._player.deepSubs()];
        }
    }

    // In the _interrelations interface, the 'A, B' designations ABCheckedMatches for a pairing is determined alphabetically based on the two hashes.
    // flipHash(A,B) returns true if the provided hashes are backwards compared to their interrelation entry.
    public flipHash(A: ContainerHash, B: ContainerHash): boolean { return A > B; }

    // Convert two container hashes into unique key for _interrelations
    public ABHash(A: ContainerHash, B: ContainerHash): string { return this.flipHash(A, B) ? `${B}::${A}` : `${A}::${B}` }

    // Determine if any transferring can be done from A->B (if !reverse) or B->A (if reverse),
    // based on the provided ABCheckedMatch entry and desired matches specified in the filter.
    public CheckedMatchCanTransfer(ABMatch: ABCheckedMatch, filter?: MatchParamFlat[], reverse?: boolean) {
        const f = (!filter || !filter.length || groupifyParameters(filter).has(ABMatch[0]));
        return ABMatch[reverse ? 2 : 1] && f;
    }

    // Delete any interrelation entries involving the given cache and its subcaches (recursive).
    // Does not attempt to update subcache list.
    private purgeRelations(old: StorageCacheBase) {
        StaticHelper.MaybeLog.info(`Purging any outdated interrelations entries for entity '${old.cHash}'`);
        old.subsNoUpdate.forEach(s => this.purgeRelations(s));
        Object.keys(this._interrelations)
            .map(KEY => KEY.includes(old.cHash) ? KEY : undefined).filterNullish()
            .forEach(KEY => delete (this._interrelations[KEY]))
    }

    /**
     * @param {(ContainerHash | locationGroup)} A   The first hash or location to pair.
     * @param {(ContainerHash | locationGroup)} B   The second hash or location to pair.
     * @param {(MatchParamFlat[]|undefined)} [filter] If specified, ignore any match parameters not included in the filter.
     * @returns {boolean} // False if any hash couldn't be found. True otherwise.
     * @memberof LocalStorageCache
     */
    public updateRelation(A: ContainerHash, B: ContainerHash, filter?: MatchParamFlat[]): boolean {
        if(A === B) return true;
        if(filter?.length === 0) filter = undefined; // [] => undefined
        // if(typeof A !== "string") { return !this.locationGroupHashes(A).map(hash => this.updateRelation(hash, B, filter)).some(ret => !ret); } // Recursive for locgroups.
        // if(typeof B !== "string") { return !this.locationGroupHashes(B).map(hash => this.updateRelation(A, hash, filter)).some(ret => !ret); } // Recursive for locgroups.

        const flip = this.flipHash(A, B);
        const ABHash = this.ABHash(A, B);

        // Groupify filter params.
        if(filter) filter = [...groupifyParameters(filter)];


        // Identify previously checked parameters in this AB pairing, if it exists in the array.
        const checkedParams: Set<MatchParamFlat> = new Set();
        if(this._interrelations[ABHash] !== undefined) {
            checkedParams.addFrom(this._interrelations[ABHash].checked);
            if(filter) { // omit pre-checked params from the filter.
                filter = filter.filter(p => !checkedParams.has(p));
                if(filter.length === 0) return true; // Everything in the filter has already been checked for this AB pairing.
            }
        } else this._interrelations[ABHash] = { checked: [], found: [] }; // If it doesn't exist in the array, initialize it.

        // Locate the cache entries for the provided hashes.
        const Ref = [this.find(flip ? B : A), this.find(flip ? A : B)];
        if(Ref[0] === undefined || Ref[1] === undefined) return false; // one of the provided hashes wasn't in the tree...

        // Parameters from Ref0 that match the filter and haven't yet been checked for in the AB relation
        const matches = new Set<MatchParamFlat>([...Ref[0].main].map(p => p.group ?? p.type));
        if(filter) matches.retainWhere(m => filter!.includes(m));
        matches.retainWhere(m => !this._interrelations[ABHash].checked.includes(m));
        if(matches.size < 1) return true; // nothing new to check.

        // These parameters will be checked for a match in Ref1.
        this._interrelations[ABHash].checked.push(...matches);

        // Parameters shared between Ref0 and Ref1...
        const BParams = [...Ref[1].main].map(p => p.group ?? p.type)
        matches.retainWhere(m => BParams.includes(m));
        if(matches.size < 1) return true; // nothing new to check.

        // Check the identified matches for transfer validity, and record in interrelations.
        const infCapacity = Ref.map(r => r!.iswhat === "Player");
        matches.forEach(m => {
            const fitAB = infCapacity[1] ? true : TransferHandler.canFitAny([Ref[0]!.cRef], [Ref[1]!.cRef], this.player.entity, typeof (m) === "string" ? [{ group: m }] : [{ type: m }]);
            const fitBA = infCapacity[0] ? true : TransferHandler.canFitAny([Ref[1]!.cRef], [Ref[0]!.cRef], this.player.entity, typeof (m) === "string" ? [{ group: m }] : [{ type: m }]);
            this._interrelations[ABHash].found.push([m, fitAB, fitBA])
        });
        return true;
    }

    public find(Hash: ContainerHash): StorageCacheBase | undefined {
        return this.fullTreeFlat.find(c => c.cHash === Hash);
    }
    public findNearby(Hash: ContainerHash): StorageCacheItem | StorageCacheDoodad | StorageCacheTile | undefined {
        for(const n of this.nearby) {
            const found = (n.fullTreeFlat as (StorageCacheItem | StorageCacheDoodad | StorageCacheTile)[]).find(s => s.cHash === Hash);
            if(!!found) return found;
        }
        return undefined;
    }

    /** 
     * Return true if transfer possible. Otherwise false.
     * Input 'reverse' specifies the intended direction of transfer
     *      Default: Self -> Nearby        Reverse: Nearby -> Self
     */
    public checkSelfNearby(filter?: MatchParamFlat[], reverse?: true): boolean {
        for(const s of this.locationGroupMembers(locationGroup.self))
            for(const n of this.locationGroupMembers(locationGroup.nearby)) {
                if(n.iswhat === "Tile" && !isValidTile(n.entity, reverse ? SourceTileOptions : DestinationTileOptions)) continue; // This nearby container is a tile which isn't a valid target under the circumstances.
                const flip = this.flipHash(s.cHash, n.cHash) ? !reverse : !!reverse;
                if(this.interrelation(s.cHash, n.cHash, filter)?.found.some(checkedMatch => this.CheckedMatchCanTransfer(checkedMatch, filter, flip)))
                    return true;
            }
        return false;
    }

    /** 
     * Return undefined if AHash isn't found in the cache.
     * Return true if transfer possible.
     * Input 'reverse' specifies the intended direction of transfer
     *      Default: Input -> Nearby        Reverse: Nearby -> Input
     */
    public checkSpecificNearby(AHash: ContainerHash, filter?: MatchParamFlat[], reverse?: true): boolean | undefined {
        if(!this.find(AHash)) {
            StaticHelper.MaybeLog.warn(`LocalStorageCache.checkSpecificNearby failed to locate hash '${AHash}'`);
            return undefined; // hash wasn't found.
        }
        for(const n of this.nearby) {
            if(n.iswhat === "Tile" && !isValidTile(n.entity, reverse ? SourceTileOptions : DestinationTileOptions)) continue; // This nearby container is a tile which isn't a valid target under the circumstances.
            if(n.cHash === AHash) continue; // This is the same container...


            const flip = this.flipHash(AHash, n.cHash) ? !reverse : !!reverse;
            if(this.interrelation(AHash, n.cHash, filter)?.found.some(checkedMatch => this.CheckedMatchCanTransfer(checkedMatch, filter, flip)))
                return true;
        }
        return false;
    }

    /** 
     * Return undefined if BHash isn't found in the cache.
     * Return true if transfer possible.
     * Input 'reverse' specifies the intended direction of transfer
     *      Default: Self -> Input        Reverse: Input -> Self
     */
    public checkSelfSpecific(BHash: ContainerHash, filter?: MatchParamFlat[], reverse?: true): boolean | undefined {
        if(!this.find(BHash)) {
            StaticHelper.MaybeLog.warn(`LocalStorageCache.checkSelfSpecific failed to locate hash '${BHash}'`);
            return undefined; // hash wasn't found.
        }

        for(const s of this.locationGroupMembers(locationGroup.self)) {
            if(s.cHash === BHash) continue; // This is the same container...
            const flip = this.flipHash(s.cHash, BHash) ? !reverse : !!reverse;
            if(this.interrelation(s.cHash, BHash, filter)?.found.some(checkedMatch => this.CheckedMatchCanTransfer(checkedMatch, filter, flip)))
                return true;
        }
        return false;
    }

    /** 
     * Return undefined if a hash isn't found in the cache.
     * Return true if transfer possible. Returns false if no transfer possible or hashes are the same.
     * Intended direction of transfer is 'from' -> 'to'
     */
    public checkSpecific(from: ContainerHash | locationGroup, to: ContainerHash | locationGroup, filter?: MatchParamFlat[]): boolean | undefined {
        let fList: string[];
        if(typeof from === "string") {
            if(!this.find(from)) { StaticHelper.MaybeLog.warn(`LocalStorageCache.checkSpecific failed to locate hash '${from}'`); return undefined; }
            fList = [from];
        } else fList = this.locationGroupMembers(from).map(f => f.cHash);

        let tList: string[];
        if(typeof to === "string") {
            if(!this.find(to)) { StaticHelper.MaybeLog.warn(`LocalStorageCache.checkSpecific failed to locate hash '${to}'`); return undefined; }
            tList = [to];
        } else tList = this.locationGroupMembers(to).map(t => t.cHash);

        return fList.some(f => tList.some(t => this._checkSpecific(f, t, filter)));
    }

    private _checkSpecific(fromHash: ContainerHash, toHash: ContainerHash, filter?: MatchParamFlat[]): boolean | undefined {
        if(fromHash === toHash) return false;
        const flip = this.flipHash(fromHash, toHash);
        return this.interrelation(fromHash, toHash, filter)?.found.some(checkedMatch => this.CheckedMatchCanTransfer(checkedMatch, filter, flip));
    }

    constructor(p: Player) {
        this._player = new StorageCachePlayer(p);
    }
};
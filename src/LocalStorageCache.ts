import Doodad from "game/doodad/Doodad";
import Player from "game/entity/player/Player";
import { ITile } from "game/tile/ITerrain";
import { IVector3 } from "utilities/math/IVector";

import { MatchParamFlat } from "./QSMatchGroups";
import StaticHelper from "./StaticHelper";
import { StorageCachePlayer, StorageCacheTile, StorageCacheDoodad, StorageCacheBase } from "./StorageCacheBase";
import TransferHandler, { validNearby } from "./TransferHandler";

export type ABCheckedMatch = [match: MatchParamFlat, fitAtoB: boolean, fitBtoA: boolean];
interface ICheckedRelations { checked: MatchParamFlat[], found: ABCheckedMatch[] };

export enum locationGroup { self = 0, nearby = 1 };
export type ContainerHash = string;

export function isOnOrAdjacent(A: IVector3, B: IVector3): boolean { return A.z === B.z && (Math.abs(A.x - B.x) + Math.abs(A.y - B.y)) <= 1 }

export class LocalStorageCache {
    private _player: StorageCachePlayer;
    private _nearby: (StorageCacheTile | StorageCacheDoodad)[] = [];
    private _nearbyOutdated: boolean = true;

    private _interrelations: { [ABHash: string]: ICheckedRelations } = {};
    private _fullTreeFlat?: StorageCacheBase[];

    public get player(): StorageCachePlayer { return this._player.refresh(); }
    public get playerNoUpdate(): StorageCachePlayer { return this._player; }
    public get nearby(): (StorageCacheTile | StorageCacheDoodad)[] { return this.refreshNearby()._nearby; }

    private get fullTreeFlat(): StorageCacheBase[] {
        return this._fullTreeFlat ??
            (this._fullTreeFlat = [this.player, ...this.nearby].flatMap(c => [c, ...c.deepSubs()]));
    }
    
    //public set nearby(value: (StorageCacheTile | StorageCacheDoodad)[]) { this._nearby = value; }
    public interrelation(A: ContainerHash, B: ContainerHash, filter?: MatchParamFlat[]): ICheckedRelations | undefined {
        return this.updateRelation(A, B, filter) ? this._interrelations[this.ABHash(A, B)] : undefined;
    }

    //public setOutdated(K?: "player" | "nearby") { if(K) this._outdated[K] = true; else { this._outdated.nearby = true; this._outdated.player = true; } }
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
        if(!this._nearbyOutdated) return this;

        const hashes: string[] = this._nearby.map(n => n.cHash);
        const itemMgr = this._player.entity.island.items;

        this._nearby.map((n, i) => n.refreshIfNear() ? undefined : i).filterNullish().reverse().forEach(removeIdx => {
            StaticHelper.MaybeLog.info(`Removing cache for distant entity '${this._nearby[removeIdx].cHash}' at index ${removeIdx}.`);
            this.purgeRelations(this._nearby[removeIdx]);
            this._nearby.splice(removeIdx, 1); // containers reported by refresh() to no longer be adjacent. Remove.
        });

        validNearby(this._player.entity, true).forEach(adj => {
            const adjHash = itemMgr.hashContainer(adj);
            if(!hashes.includes(adjHash)) { // New container. Add it.
                StaticHelper.MaybeLog.info(`Appending new cache for nearby entity '${this._player.entity.island.items.hashContainer(adj)}'`);
                if(Doodad.is(adj)) this._nearby.push(new StorageCacheDoodad(adj, this._player.entity));
                else if(itemMgr.isTileContainer(adj) && "data" in adj) this._nearby.push(new StorageCacheTile(adj as ITile, this._player.entity));
                else StaticHelper.MaybeLog.warn(`FAILED TO HANDLE ADJACENT CONTAINER: ${adj}'`);
            }
        });

        this._nearbyOutdated = false;
        return this;
    }

    private locationGroupMembers(g: locationGroup): StorageCacheBase[] {
        switch(g) {
            case locationGroup.nearby: return this._nearby;
            case locationGroup.self: return [this._player, ...this._player.deepSubs()];
        }
    }

    public flipHash(A: ContainerHash, B: ContainerHash): boolean { return A > B; }
    public ABHash(A: ContainerHash, B: ContainerHash): string { return this.flipHash(A, B) ? `${B}::${A}` : `${A}::${B}` }
    public CheckedMatchCanTransfer(ABMatch: ABCheckedMatch, filter?: MatchParamFlat[], reverse?: boolean) {
        const f = (!filter || !filter.length || TransferHandler.groupifyFlatParameters(filter).has(ABMatch[0]));
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
     * @param {(MatchParamFlat[])} [filter] Flattened parameter
     * @returns {*}  {boolean}
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
        if(filter) filter = [...TransferHandler.groupifyFlatParameters(filter)];


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

    public canFind(Hash: ContainerHash): boolean {
        return this.fullTreeFlat.some(c => c.cHash === Hash);
    }
    public findNearby(Hash: ContainerHash): StorageCacheBase | undefined {
        for(const n of this.nearby) {
            const nGot = n.cHash === Hash ? n : n.findSub(Hash);
            if(!!nGot) return nGot;
        }
        return undefined;
    }
    public find(Hash: ContainerHash): StorageCacheBase | undefined {
        return this.fullTreeFlat.find(c => c.cHash === Hash);
    }

    public checkSelfNearby(filter?: MatchParamFlat[], reverse?: true): boolean {
        for(const s of this.locationGroupMembers(locationGroup.self))
            for(const n of this.locationGroupMembers(locationGroup.nearby)) {
                if(n.iswhat === "ITile" && StaticHelper.QS_INSTANCE.globalData.optionForbidTiles && !reverse) continue; // This is a tile and a deposit operation, but tile deposit is forbidden.
                const flip = this.flipHash(s.cHash, n.cHash) ? !reverse : !!reverse;
                if(this.interrelation(s.cHash, n.cHash, filter)?.found.some(checkedMatch => this.CheckedMatchCanTransfer(checkedMatch, filter, flip)))
                    return true;
            }
        return false;
    }

    // Return undefined if AHash isn't found in the cache.
    // Return true if transfer possible.
    public checkSpecificNearby(AHash: ContainerHash, filter?: MatchParamFlat[], reverse?: true): boolean | undefined {
        if(!this.canFind(AHash)) {
            StaticHelper.MaybeLog.warn(`LocalStorageCache.checkSpecificNearby failed to locate hash '${AHash}'`);
            return undefined; // hash wasn't found.
        }
        for(const n of this.nearby) {
            if(n.iswhat === "ITile" && StaticHelper.QS_INSTANCE.globalData.optionForbidTiles && !reverse) continue; // This is a tile and a deposit operation, but tile deposit is forbidden.
            if(n.cHash === AHash) continue; // This is the same container...

            const flip = this.flipHash(AHash, n.cHash) ? !reverse : !!reverse;
            if(this.interrelation(AHash, n.cHash, filter)?.found.some(checkedMatch => this.CheckedMatchCanTransfer(checkedMatch, filter, flip)))
                return true;
        }
        return false;
    }

    // Return undefined if AHash isn't found in the cache.
    // Return true if transfer possible.
    public checkSelfSpecific(BHash: ContainerHash, filter?: MatchParamFlat[], reverse?: true): boolean | undefined {
        if(!this.canFind(BHash)) {
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

    // Return undefined if a hash isn't found in the cache.
    // Return true if transfer possible. Returns false if no transfer possible or if hashes are equal.
    public checkSpecific(fromHash: ContainerHash, toHash: ContainerHash, filter?: MatchParamFlat[]): boolean | undefined {
        if(fromHash === toHash) return false;
        [fromHash, toHash].forEach(h => {
            if(!this.canFind(h)) {
                StaticHelper.MaybeLog.warn(`LocalStorageCache.checkSpecific failed to locate hash '${h}'`);
                return undefined;
            }
        }); // hash wasn't found.
        const flip = this.flipHash(fromHash, toHash);
        return this.interrelation(fromHash, toHash, filter)?.found.some(checkedMatch => this.CheckedMatchCanTransfer(checkedMatch, filter, flip))
    }

    constructor(p: Player) {
        this._player = new StorageCachePlayer(p);
    }
};
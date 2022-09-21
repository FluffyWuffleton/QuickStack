define(["require", "exports", "game/doodad/Doodad", "game/item/ItemManager", "utilities/math/Direction", "utilities/math/Vector3", "./StaticHelper", "./TransferHandler"], function (require, exports, Doodad_1, ItemManager_1, Direction_1, Vector3_1, StaticHelper_1, TransferHandler_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StorageCacheDoodad = exports.StorageCacheTile = exports.StorageCachePlayer = exports.StorageCacheItem = exports.StorageCacheBase = exports.LocalStorageCache = exports.isOnOrAdjacent = exports.locationGroup = void 0;
    ;
    var locationGroup;
    (function (locationGroup) {
        locationGroup[locationGroup["self"] = 0] = "self";
        locationGroup[locationGroup["nearby"] = 1] = "nearby";
    })(locationGroup = exports.locationGroup || (exports.locationGroup = {}));
    ;
    function isOnOrAdjacent(A, B) { return A.z === B.z && (Math.abs(A.x - B.x) + Math.abs(A.y - B.y)) <= 1; }
    exports.isOnOrAdjacent = isOnOrAdjacent;
    class LocalStorageCache {
        constructor(p) {
            this._nearby = [];
            this._nearbyOutdated = true;
            this._interrelations = {};
            this._player = new StorageCachePlayer(p);
        }
        get player() { return this._player.refresh(); }
        get playerNoUpdate() { return this._player; }
        get nearby() { return this.refreshNearby()._nearby; }
        interrelation(A, B, filter) {
            return this.updateRelation(A, B, filter) ? this._interrelations[this.ABHash(A, B)] : undefined;
        }
        setOutdated(K) {
            StaticHelper_1.default.MaybeLog?.info(`LocalStorageCache.setOutdated: Flagging ${K ? K : "player+nearby"} as outdated.${!K || K === "player" ? " Player relations wiped." : ""}`);
            if (!K || K === "player") {
                this.purgeRelations(this._player);
                this._player.setOutdated(true);
            }
            if (!K || K === "nearby") {
                this._nearbyOutdated = true;
                this._nearby.forEach(n => n.setOutdated(true));
            }
        }
        setOutdatedSpecific(Hash, recursive) {
            const found = this._player.findSub(Hash) ?? this.findNearby(Hash);
            if (found !== undefined) {
                if (found.setOutdated(recursive)) {
                    StaticHelper_1.default.MaybeLog?.info(`LocalStorageCache.setOutdatedSpecific: Cache or subcache of '${Hash}' newly flagged as outdated. Wiping its relations.`);
                    this.purgeRelations(found);
                }
                return true;
            }
            return false;
        }
        refreshNearby() {
            if (!this._nearbyOutdated)
                return this;
            const hashes = this._nearby.map(n => n.cHash);
            const itemMgr = this._player.entity.island.items;
            this._nearby.map((n, i) => n.refreshIfNear() ? undefined : i).filterNullish().reverse().forEach(removeIdx => {
                StaticHelper_1.default.MaybeLog?.info(`Removing cache for distant entity '${this._nearby[removeIdx].cHash}' at index ${removeIdx}.`);
                this.purgeRelations(this._nearby[removeIdx]);
                this._nearby.splice(removeIdx, 1);
            });
            (0, TransferHandler_1.validNearby)(this._player.entity, true).forEach(adj => {
                const adjHash = itemMgr.hashContainer(adj);
                if (!hashes.includes(adjHash)) {
                    StaticHelper_1.default.MaybeLog?.info(`Appending new cache for nearby entity '${this._player.entity.island.items.hashContainer(adj)}'`);
                    if (Doodad_1.default.is(adj))
                        this._nearby.push(new StorageCacheDoodad(adj, this._player.entity));
                    else if (itemMgr.isTileContainer(adj) && "data" in adj)
                        this._nearby.push(new StorageCacheTile(adj, this._player.entity));
                    else
                        StaticHelper_1.default.MaybeLog?.warn(`FAILED TO HANDLE ADJACENT CONTAINER: ${adj}'`);
                }
            });
            this._nearbyOutdated = false;
            return this;
        }
        locationGroupMembers(g) {
            switch (g) {
                case locationGroup.nearby: return this._nearby;
                case locationGroup.self: return [this._player, ...this._player.deepSubs()];
            }
        }
        flipHash(A, B) { return A > B; }
        ABHash(A, B) { return this.flipHash(A, B) ? `${B}::${A}` : `${A}::${B}`; }
        CheckedMatchCanTransfer(ABMatch, filter, reverse) {
            const f = (!filter || !filter.length || TransferHandler_1.default.groupifyFlatParameters(filter).has(ABMatch[0]));
            return ABMatch[reverse ? 2 : 1] && f;
        }
        purgeRelations(old) {
            old.subsNoUpdate.forEach(s => this.purgeRelations(s));
            Object.keys(this._interrelations)
                .map(KEY => KEY.includes(old.cHash) ? KEY : undefined).filterNullish()
                .forEach(KEY => delete (this._interrelations[KEY]));
        }
        updateRelation(A, B, filter) {
            if (A === B)
                return true;
            const flip = this.flipHash(A, B);
            const ABHash = this.ABHash(A, B);
            const checkedParams = new Set();
            if (this._interrelations[ABHash] !== undefined) {
                checkedParams.addFrom(this._interrelations[ABHash].checked);
                if (filter !== undefined && filter.length > 0) {
                    filter = [...TransferHandler_1.default.groupifyFlatParameters(filter)];
                    filter = filter.filter(p => !checkedParams.has(p));
                    if (filter.length === 0)
                        return true;
                }
            }
            else
                this._interrelations[ABHash] = { checked: [], found: [] };
            const fullCacheTreeFlat = [this.player, ...this.player.deepSubs(), ...this.nearby.flatMap(n => [n, ...n.deepSubs()])];
            const Ref = [fullCacheTreeFlat.find(cache => cache.cHash === (flip ? B : A)), fullCacheTreeFlat.find(cache => cache.cHash === (flip ? A : B))];
            if (Ref[0] === undefined || Ref[1] === undefined)
                return false;
            const matches = new Set([...Ref[0].main].map(p => p.group ?? p.type));
            if (filter !== undefined && filter.length > 0)
                matches.retainWhere(m => filter.includes(m));
            matches.retainWhere(m => !this._interrelations[ABHash].checked.includes(m));
            if (matches.size < 1)
                return true;
            this._interrelations[ABHash].checked.push(...matches);
            const BParams = [...Ref[1].main].map(p => p.group ?? p.type);
            matches.retainWhere(m => BParams.includes(m));
            if (matches.size < 1)
                return true;
            const infCapacity = Ref.map(r => r.iswhat === "Player");
            matches.forEach(m => {
                const fitAB = infCapacity[1] ? true : TransferHandler_1.default.canFitAny([Ref[0].cRef], [Ref[1].cRef], this.player.entity, typeof (m) === "string" ? [{ group: m }] : [{ type: m }]);
                const fitBA = infCapacity[0] ? true : TransferHandler_1.default.canFitAny([Ref[1].cRef], [Ref[0].cRef], this.player.entity, typeof (m) === "string" ? [{ group: m }] : [{ type: m }]);
                this._interrelations[ABHash].found.push([m, fitAB, fitBA]);
            });
            return true;
        }
        canFind(Hash) {
            return [this.player, ...this._nearby].some(c => c.cHash === Hash || !!c.findSub(Hash));
        }
        findNearby(Hash) {
            for (const n of this.nearby) {
                const nGot = n.cHash === Hash ? n : n.findSub(Hash);
                if (!!nGot)
                    return nGot;
            }
            return undefined;
        }
        checkSelfNearby(filter, reverse) {
            for (const s of this.locationGroupMembers(locationGroup.self))
                for (const n of this.locationGroupMembers(locationGroup.nearby)) {
                    if (n.iswhat === "ITile" && StaticHelper_1.default.QS_INSTANCE.globalData.optionForbidTiles && !reverse)
                        continue;
                    const flip = this.flipHash(s.cHash, n.cHash) ? !reverse : !!reverse;
                    if (this.interrelation(s.cHash, n.cHash, filter)?.found.some(checkedMatch => this.CheckedMatchCanTransfer(checkedMatch, filter, flip)))
                        return true;
                }
            return false;
        }
        checkSpecificNearby(AHash, filter, reverse) {
            if (!this.canFind(AHash))
                return undefined;
            for (const n of this.nearby) {
                if (n.iswhat === "ITile" && StaticHelper_1.default.QS_INSTANCE.globalData.optionForbidTiles && !reverse)
                    continue;
                if (n.cHash === AHash)
                    continue;
                const flip = this.flipHash(AHash, n.cHash) ? !reverse : !!reverse;
                if (this.interrelation(AHash, n.cHash, filter)?.found.some(checkedMatch => this.CheckedMatchCanTransfer(checkedMatch, filter, flip)))
                    return true;
            }
            return false;
        }
        checkSelfSpecific(BHash, filter, reverse) {
            if (!this.canFind(BHash))
                return undefined;
            for (const s of this.locationGroupMembers(locationGroup.self)) {
                if (s.cHash === BHash)
                    continue;
                const flip = this.flipHash(s.cHash, BHash) ? !reverse : !!reverse;
                if (this.interrelation(s.cHash, BHash, filter)?.found.some(checkedMatch => this.CheckedMatchCanTransfer(checkedMatch, filter, flip)))
                    return true;
            }
            return false;
        }
        checkSpecific(fromHash, toHash, filter) {
            if (fromHash === toHash)
                return false;
            [fromHash, toHash].forEach(h => { if (![this.player, ...this.nearby].some(c => c.findSub(h)))
                return undefined; });
            const flip = this.flipHash(fromHash, toHash);
            return this.interrelation(fromHash, toHash, filter)?.found.some(checkedMatch => this.CheckedMatchCanTransfer(checkedMatch, filter, flip));
        }
    }
    exports.LocalStorageCache = LocalStorageCache;
    ;
    class StorageCacheBase {
        constructor(e, hash, noRefresh) {
            this._outdated = true;
            StaticHelper_1.default.MaybeLog?.info(`Constructing StorageCache for entity ${e} with hash '${hash}'`);
            this.entity = e;
            this.cHash = hash;
            this._main = new Set;
            this._subs = [];
        }
        get main() { this.refresh(); return this._main; }
        get subs() { this.refresh(); return this._subs; }
        get subsNoUpdate() { return this._subs; }
        get outdated() { return this._outdated; }
        setOutdated(recursive) {
            let flagged = false;
            if (!this._outdated) {
                StaticHelper_1.default.MaybeLog?.info(`StorageCacheBase.setOutdated: Cache for '${this.cHash}' is now outdated.`);
                flagged = true;
                this._outdated = true;
            }
            if (recursive)
                this._subs.forEach(s => flagged ||= s.setOutdated(true));
            return flagged;
        }
        deepSubs() { return [...this.subs, ...this.subs.flatMap(s => s.deepSubs())]; }
        deepProperty(prop) { return [this[prop], ...this.deepSubs().map(s => s[prop])]; }
        findSub(sub) {
            if (typeof (sub) !== "string")
                sub = sub.island.items.hashContainer(sub);
            for (const s of this._subs) {
                const ss = (s.cHash === sub) ? s : s.findSub(sub);
                if (ss)
                    return ss;
            }
            return undefined;
        }
        refresh(protect) {
            if (!this._outdated)
                return this;
            StaticHelper_1.default.MaybeLog?.info(`StorageCacheBase.refresh(): Updating outdated cache for '${this.cHash}'`);
            this._main = !this.cRef.containedItems ? new Set() : TransferHandler_1.default.setOfParams([{
                    containedItems: (protect ?? false)
                        ? this.cRef.containedItems.filter(i => !(i.isProtected() || i.isEquipped(true) || (StaticHelper_1.default.QS_INSTANCE.globalData.optionKeepContainers && (0, TransferHandler_1.isStorageType)(i.type))))
                        : this.cRef.containedItems
                }]);
            const subCacheHashes = this._subs.map(s => s.cHash);
            const subContainers = this.cRef.containedItems?.filter(i => ItemManager_1.default.isContainer(i)) ?? [];
            const subConHashes = subContainers.map(s => s.island.items.hashContainer(s));
            subCacheHashes.map((h, idx) => subConHashes.includes(h) ? undefined : idx).filterNullish().reverse().forEach(idx => {
                StaticHelper_1.default.MaybeLog?.info(`... removing cache entry for missing subcontainer '${this._subs[idx].cHash}' within ${this.cHash}`);
                this._subs.splice(idx);
                subCacheHashes.splice(idx);
            });
            subConHashes.map((h, idx) => subCacheHashes.includes(h) ? undefined : idx).filterNullish().forEach(idx => {
                this._subs.push(new StorageCacheItem(subContainers[idx]));
                StaticHelper_1.default.MaybeLog?.info(`... adding new cache entry for subcontainer, hash '${this._subs.last()?.cHash}'`);
            });
            this._subs.forEach(s => s.setOutdated(true));
            this._outdated = false;
            return this;
        }
    }
    exports.StorageCacheBase = StorageCacheBase;
    class StorageCacheNearby extends StorageCacheBase {
        constructor(e, p, hash) {
            super(e, hash);
            this.nearWhom = p;
        }
        get relation() { return this._relation; }
        refreshRelation() {
            const ppos = this.nearWhom.getPoint();
            const thisPos = this.thisPos();
            const diff = { x: thisPos.x - ppos.x, y: thisPos.y - ppos.y, z: thisPos.z - ppos.z };
            const ok = isOnOrAdjacent(ppos, thisPos);
            StaticHelper_1.default.MaybeLog?.info(`StorageCacheNearby: Updating relation of '${this.cHash}'. Identified positions     ` +
                `Player: ${new Vector3_1.default(ppos).xyz}    Entity${new Vector3_1.default(thisPos).xyz}     OK?: ${ok}`);
            if (!ok)
                return false;
            this._relation = Direction_1.Direction.get(diff);
            return true;
        }
        refreshIfNear() {
            if (this.refreshRelation()) {
                this.refresh();
                return true;
            }
            return false;
        }
    }
    class StorageCacheItem extends StorageCacheBase {
        constructor(e) {
            super(e, e.island.items.hashContainer(e));
            this.iswhat = "Item";
            this.cRef = this.entity;
        }
    }
    exports.StorageCacheItem = StorageCacheItem;
    class StorageCachePlayer extends StorageCacheBase {
        constructor(e) {
            super(e, e.island.items.hashContainer(e.inventory), true);
            this.iswhat = "Player";
            this.cRef = this.entity.inventory;
        }
        refresh() { return super.refresh(true); }
        updateHash() {
            this.cHash.replace(this.cHash, this.entity.island.items.hashContainer(this.cRef));
            return this;
        }
    }
    exports.StorageCachePlayer = StorageCachePlayer;
    class StorageCacheTile extends StorageCacheNearby {
        constructor(e, p) {
            super(e, p, p.island.items.hashContainer(e));
            this.iswhat = "ITile";
            this.cRef = e;
        }
        thisPos() { return !this.nearWhom.island.isTileEmpty(this.entity) ? { x: NaN, y: NaN, z: NaN } : this.entity; }
    }
    exports.StorageCacheTile = StorageCacheTile;
    class StorageCacheDoodad extends StorageCacheNearby {
        constructor(e, p) {
            super(e, p, p.island.items.hashContainer(e));
            this.iswhat = "Doodad";
            this.cRef = e;
        }
        thisPos() { return this.entity; }
    }
    exports.StorageCacheDoodad = StorageCacheDoodad;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9jYWxTdG9yYWdlQ2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvTG9jYWxTdG9yYWdlQ2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQWNrRixDQUFDO0lBRW5GLElBQVksYUFBc0M7SUFBbEQsV0FBWSxhQUFhO1FBQUcsaURBQVEsQ0FBQTtRQUFFLHFEQUFVLENBQUE7SUFBQyxDQUFDLEVBQXRDLGFBQWEsR0FBYixxQkFBYSxLQUFiLHFCQUFhLFFBQXlCO0lBQUEsQ0FBQztJQUduRCxTQUFnQixjQUFjLENBQUMsQ0FBVyxFQUFFLENBQVcsSUFBYSxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFBNUksd0NBQTRJO0lBRTVJLE1BQWEsaUJBQWlCO1FBd04xQixZQUFZLENBQVM7WUF0TmIsWUFBTyxHQUE4QyxFQUFFLENBQUM7WUFFeEQsb0JBQWUsR0FBWSxJQUFJLENBQUM7WUFFaEMsb0JBQWUsR0FBNEMsRUFBRSxDQUFDO1lBbU5sRSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0MsQ0FBQztRQW5ORCxJQUFXLE1BQU0sS0FBeUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMxRSxJQUFXLGNBQWMsS0FBeUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUN4RSxJQUFXLE1BQU0sS0FBZ0QsT0FBTyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsT0FBTyxDQUFD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
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
            if (!this.canFind(AHash)) {
                StaticHelper_1.default.QS_LOG.warn(`LocalStorageCache.checkSpecificNearby failed to locate hash '${AHash}'`);
                return undefined;
            }
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
            if (!this.canFind(BHash)) {
                StaticHelper_1.default.QS_LOG.warn(`LocalStorageCache.checkSelfSpecific failed to locate hash '${BHash}'`);
                return undefined;
            }
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
            [fromHash, toHash].forEach(h => {
                if (!this.canFind(h)) {
                    StaticHelper_1.default.QS_LOG.warn(`LocalStorageCache.checkSpecific failed to locate hash '${h}'`);
                    return undefined;
                }
            });
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
        thisPos() { return !('x' in this.entity && 'y' in this.entity && 'z' in this.entity) ? { x: NaN, y: NaN, z: NaN } : this.entity; }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9jYWxTdG9yYWdlQ2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvTG9jYWxTdG9yYWdlQ2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQWNrRixDQUFDO0lBRW5GLElBQVksYUFBc0M7SUFBbEQsV0FBWSxhQUFhO1FBQUcsaURBQVEsQ0FBQTtRQUFFLHFEQUFVLENBQUE7SUFBQyxDQUFDLEVBQXRDLGFBQWEsR0FBYixxQkFBYSxLQUFiLHFCQUFhLFFBQXlCO0lBQUEsQ0FBQztJQUduRCxTQUFnQixjQUFjLENBQUMsQ0FBVyxFQUFFLENBQVcsSUFBYSxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFBNUksd0NBQTRJO0lBRTVJLE1BQWEsaUJBQWlCO1FBaU8xQixZQUFZLENBQVM7WUEvTmIsWUFBTyxHQUE4QyxFQUFFLENBQUM7WUFFeEQsb0JBQWUsR0FBWSxJQUFJLENBQUM7WUFFaEMsb0JBQWUsR0FBNEMsRUFBRSxDQUFDO1lBNE5sRSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0MsQ0FBQztRQTVORCxJQUFXLE1BQU0sS0FBeUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMxRSxJQUFXLGNBQWMsS0FBeUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUN4RSxJQUFXLE1BQU0sS0FBZ0QsT0FBTyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsT0FBTyxDQUFD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
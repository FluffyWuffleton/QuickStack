define(["require", "exports", "game/doodad/Doodad", "./QSMatchGroups", "./StaticHelper", "./StorageCacheBase", "./TransferHandler"], function (require, exports, Doodad_1, QSMatchGroups_1, StaticHelper_1, StorageCacheBase_1, TransferHandler_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LocalStorageCache = exports.isOnOrAdjacent = exports.locationGroup = void 0;
    ;
    var locationGroup;
    (function (locationGroup) {
        locationGroup[locationGroup["self"] = 0] = "self";
        locationGroup[locationGroup["nearby"] = 1] = "nearby";
    })(locationGroup || (exports.locationGroup = locationGroup = {}));
    ;
    function isOnOrAdjacent(A, B) { return A.z === B.z && (Math.abs(A.x - B.x) + Math.abs(A.y - B.y)) <= 1; }
    exports.isOnOrAdjacent = isOnOrAdjacent;
    class LocalStorageCache {
        get player() { return this._player.refresh(); }
        get playerNoUpdate() { return this._player; }
        get nearby() { return this.refreshNearby()._nearby; }
        get frozen() { return this._freeze; }
        freeze(updateFirst = true) {
            if (updateFirst)
                this.refreshNearby();
            for (const c of [this._player, ...this._nearby])
                c.freeze(updateFirst);
            this._freeze = true;
        }
        thaw() {
            for (const c of [this._player, ...this._nearby])
                c.thaw(true);
            this._freeze = false;
        }
        get fullTreeFlat() {
            return this._fullTreeFlat ??
                (this._fullTreeFlat = [this.player, ...this.nearby].flatMap(c => [c, ...c.deepSubs()]));
        }
        interrelation(A, B, filter) {
            return this.updateRelation(A, B, filter) ? this._interrelations[this.ABHash(A, B)] : undefined;
        }
        setOutdated(K) {
            if (!K || K === "player") {
                this.purgeRelations(this._player);
                this._player.setOutdated(true);
            }
            if (!K || K === "nearby") {
                if (!this._nearbyOutdated)
                    StaticHelper_1.default.MaybeLog.info(`StorageCacheBase.setOutdated: List of nearby containers is now outdated.`);
                this._nearbyOutdated = true;
            }
            this._fullTreeFlat = undefined;
        }
        setOutdatedSpecific(Hash, recursive) {
            const found = this._player.findSub(Hash) ?? this.findNearby(Hash);
            if (found !== undefined) {
                if (found.setOutdated(recursive)) {
                    StaticHelper_1.default.MaybeLog.info(`LocalStorageCache.setOutdatedSpecific: Cache or subcache of '${Hash}' newly flagged as outdated. Wiping its relations.`);
                    this.purgeRelations(found);
                }
                return true;
            }
            return false;
        }
        refreshNearby() {
            if (!this._nearbyOutdated || this._freeze)
                return this;
            const hashes = this._nearby.map(n => n.cHash);
            const itemMgr = this._player.entity.island.items;
            this._nearby
                .map((n, i) => n.refreshIfNear() ? undefined : i)
                .filterNullish().reverse()
                .forEach(removeIdx => {
                StaticHelper_1.default.MaybeLog.info(`Removing cache for distant entity '${this._nearby[removeIdx].cHash}' at index ${removeIdx}.`);
                this.purgeRelations(this._nearby[removeIdx]);
                this._nearby.splice(removeIdx, 1);
            });
            (0, TransferHandler_1.validNearby)(this._player.entity, { ignoreForbidTiles: true, allowBlockedTiles: true }).forEach(adj => {
                const adjHash = itemMgr.hashContainer(adj);
                if (!hashes.includes(adjHash)) {
                    StaticHelper_1.default.MaybeLog.info(`Appending new cache for nearby entity '${this._player.entity.island.items.hashContainer(adj)}'`);
                    if (Doodad_1.default.is(adj))
                        this._nearby.push(new StorageCacheBase_1.StorageCacheDoodad(adj, this._player.entity));
                    else if (itemMgr.isTileContainer(adj))
                        this._nearby.push(new StorageCacheBase_1.StorageCacheTile(this._player.entity.island.getTileFromPoint(adj), this._player.entity));
                    else
                        StaticHelper_1.default.MaybeLog.warn(`FAILED TO HANDLE ADJACENT CONTAINER: ${adj}'`);
                }
            });
            this._nearbyOutdated = false;
            return this;
        }
        locationGroupMembers(g, noupdate) {
            switch (g) {
                case locationGroup.nearby: return noupdate ? this._nearby : this.nearby;
                case locationGroup.self: return noupdate ? [this.playerNoUpdate, ...this.playerNoUpdate.deepSubs()] : [this.player, ...this.player.deepSubs()];
            }
        }
        flipHash(A, B) { return A > B; }
        ABHash(A, B) { return this.flipHash(A, B) ? `${B}::${A}` : `${A}::${B}`; }
        CheckedMatchCanTransfer(ABMatch, filter, reverse) {
            const f = (!filter || !filter.length || (0, QSMatchGroups_1.groupifyParameters)(filter).has(ABMatch[0]));
            return ABMatch[reverse ? 2 : 1] && f;
        }
        purgeRelations(old) {
            StaticHelper_1.default.MaybeLog.info(`Purging any outdated interrelations entries for entity '${old.cHash}'`);
            old.subsNoUpdate.forEach(s => this.purgeRelations(s));
            Object.keys(this._interrelations)
                .map(KEY => KEY.includes(old.cHash) ? KEY : undefined).filterNullish()
                .forEach(KEY => delete (this._interrelations[KEY]));
        }
        updateRelation(A, B, filter) {
            if (A === B)
                return true;
            if (filter?.length === 0)
                filter = undefined;
            const flip = this.flipHash(A, B);
            const ABHash = this.ABHash(A, B);
            if (filter)
                filter = [...(0, QSMatchGroups_1.groupifyParameters)(filter)];
            const checkedParams = new Set();
            if (this._interrelations[ABHash] !== undefined) {
                checkedParams.addFrom(this._interrelations[ABHash].checked);
                if (filter) {
                    filter = filter.filter(p => !checkedParams.has(p));
                    if (filter.length === 0)
                        return true;
                }
            }
            else
                this._interrelations[ABHash] = { checked: [], found: [] };
            const Ref = [this.find(flip ? B : A), this.find(flip ? A : B)];
            if (Ref[0] === undefined || Ref[1] === undefined)
                return false;
            const matches = new Set([...Ref[0].main].map(p => p.group ?? p.type));
            if (filter)
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
        find(Hash) {
            return this.fullTreeFlat.find(c => c.cHash === Hash);
        }
        findNearby(Hash) {
            for (const n of this.nearby) {
                const found = n.fullTreeFlat.find(s => s.cHash === Hash);
                if (!!found)
                    return found;
            }
            return undefined;
        }
        checkSelfNearby(filter, reverse) {
            for (const s of this.locationGroupMembers(locationGroup.self))
                for (const n of this.locationGroupMembers(locationGroup.nearby)) {
                    if (n.iswhat === "Tile" && !(0, TransferHandler_1.isValidTile)(n.entity, reverse ? TransferHandler_1.SourceTileOptions : TransferHandler_1.DestinationTileOptions))
                        continue;
                    const flip = this.flipHash(s.cHash, n.cHash) ? !reverse : !!reverse;
                    if (this.interrelation(s.cHash, n.cHash, filter)?.found.some(checkedMatch => this.CheckedMatchCanTransfer(checkedMatch, filter, flip)))
                        return true;
                }
            return false;
        }
        checkSpecificNearby(AHash, filter, reverse) {
            if (!this.find(AHash)) {
                StaticHelper_1.default.MaybeLog.warn(`LocalStorageCache.checkSpecificNearby failed to locate hash '${AHash}'`);
                return undefined;
            }
            for (const n of this.nearby) {
                if (n.iswhat === "Tile" && !(0, TransferHandler_1.isValidTile)(n.entity, reverse ? TransferHandler_1.SourceTileOptions : TransferHandler_1.DestinationTileOptions))
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
            if (!this.find(BHash)) {
                StaticHelper_1.default.MaybeLog.warn(`LocalStorageCache.checkSelfSpecific failed to locate hash '${BHash}'`);
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
        checkSpecific(from, to, filter) {
            let fList;
            if (typeof from === "string") {
                if (!this.find(from)) {
                    StaticHelper_1.default.MaybeLog.warn(`LocalStorageCache.checkSpecific failed to locate hash '${from}'`);
                    return undefined;
                }
                fList = [from];
            }
            else
                fList = this.locationGroupMembers(from).map(f => f.cHash);
            let tList;
            if (typeof to === "string") {
                if (!this.find(to)) {
                    StaticHelper_1.default.MaybeLog.warn(`LocalStorageCache.checkSpecific failed to locate hash '${to}'`);
                    return undefined;
                }
                tList = [to];
            }
            else
                tList = this.locationGroupMembers(to).map(t => t.cHash);
            return fList.some(f => tList.some(t => this._checkSpecific(f, t, filter)));
        }
        _checkSpecific(fromHash, toHash, filter) {
            if (fromHash === toHash)
                return false;
            const flip = this.flipHash(fromHash, toHash);
            return this.interrelation(fromHash, toHash, filter)?.found.some(checkedMatch => this.CheckedMatchCanTransfer(checkedMatch, filter, flip));
        }
        constructor(p) {
            this._nearby = [];
            this._nearbyOutdated = true;
            this._freeze = false;
            this._interrelations = {};
            this._player = new StorageCacheBase_1.StorageCachePlayer(p);
        }
    }
    exports.LocalStorageCache = LocalStorageCache;
    ;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9jYWxTdG9yYWdlQ2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvTG9jYWxTdG9yYWdlQ2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQVdrRixDQUFDO0lBRW5GLElBQVksYUFBc0M7SUFBbEQsV0FBWSxhQUFhO1FBQUcsaURBQVEsQ0FBQTtRQUFFLHFEQUFVLENBQUE7SUFBQyxDQUFDLEVBQXRDLGFBQWEsNkJBQWIsYUFBYSxRQUF5QjtJQUFBLENBQUM7SUFHbkQsU0FBZ0IsY0FBYyxDQUFDLENBQVcsRUFBRSxDQUFXLElBQWEsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQTVJLHdDQUE0STtJQUU1SSxNQUFhLGlCQUFpQjtRQVMxQixJQUFXLE1BQU0sS0FBeUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMxRSxJQUFXLGNBQWMsS0FBeUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUN4RSxJQUFXLE1BQU0sS0FBZ0QsT0FBTyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUV2RyxJQUFXLE1BQU0sS0FBYyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQzlDLE1BQU0sQ0FBQyxjQUF1QixJQUFJO1lBQ3JDLElBQUcsV0FBVztnQkFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDckMsS0FBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FB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
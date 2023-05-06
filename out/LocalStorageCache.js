define(["require", "exports", "game/doodad/Doodad", "./QSMatchGroups", "./StaticHelper", "./StorageCacheBase", "./TransferHandler"], function (require, exports, Doodad_1, QSMatchGroups_1, StaticHelper_1, StorageCacheBase_1, TransferHandler_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LocalStorageCache = exports.isOnOrAdjacent = exports.locationGroup = void 0;
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
            this._freeze = false;
            this._interrelations = {};
            this._player = new StorageCacheBase_1.StorageCachePlayer(p);
        }
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
        locationGroupMembers(g) {
            switch (g) {
                case locationGroup.nearby: return this._nearby;
                case locationGroup.self: return [this._player, ...this._player.deepSubs()];
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
    }
    exports.LocalStorageCache = LocalStorageCache;
    ;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9jYWxTdG9yYWdlQ2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvTG9jYWxTdG9yYWdlQ2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQVdrRixDQUFDO0lBRW5GLElBQVksYUFBc0M7SUFBbEQsV0FBWSxhQUFhO1FBQUcsaURBQVEsQ0FBQTtRQUFFLHFEQUFVLENBQUE7SUFBQyxDQUFDLEVBQXRDLGFBQWEsR0FBYixxQkFBYSxLQUFiLHFCQUFhLFFBQXlCO0lBQUEsQ0FBQztJQUduRCxTQUFnQixjQUFjLENBQUMsQ0FBVyxFQUFFLENBQVcsSUFBYSxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFBNUksd0NBQTRJO0lBRTVJLE1BQWEsaUJBQWlCO1FBd1IxQixZQUFZLENBQVM7WUF0UmIsWUFBTyxHQUE4QyxFQUFFLENBQUM7WUFDeEQsb0JBQWUsR0FBWSxJQUFJLENBQUM7WUFDaEMsWUFBTyxHQUFZLEtBQUssQ0FBQztZQUV6QixvQkFBZSxHQUE0QyxFQUFFLENBQUM7WUFtUmxFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxxQ0FBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QyxDQUFDO1FBalJELElBQVcsTUFBTSxLQUF5QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzFFLElBQVcsY0FBYyxLQUF5QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3hFLElBQVcsTUFBTSxLQUFnRCxPQUFPLElBQUksQ0FB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
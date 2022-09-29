define(["require", "exports", "game/doodad/Doodad", "./StaticHelper", "./StorageCacheBase", "./TransferHandler"], function (require, exports, Doodad_1, StaticHelper_1, StorageCacheBase_1, TransferHandler_1) {
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
            this._interrelations = {};
            this._player = new StorageCacheBase_1.StorageCachePlayer(p);
        }
        get player() { return this._player.refresh(); }
        get playerNoUpdate() { return this._player; }
        get nearby() { return this.refreshNearby()._nearby; }
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
            if (!this._nearbyOutdated)
                return this;
            const hashes = this._nearby.map(n => n.cHash);
            const itemMgr = this._player.entity.island.items;
            this._nearby.map((n, i) => n.refreshIfNear() ? undefined : i).filterNullish().reverse().forEach(removeIdx => {
                StaticHelper_1.default.MaybeLog.info(`Removing cache for distant entity '${this._nearby[removeIdx].cHash}' at index ${removeIdx}.`);
                this.purgeRelations(this._nearby[removeIdx]);
                this._nearby.splice(removeIdx, 1);
            });
            (0, TransferHandler_1.validNearby)(this._player.entity, true).forEach(adj => {
                const adjHash = itemMgr.hashContainer(adj);
                if (!hashes.includes(adjHash)) {
                    StaticHelper_1.default.MaybeLog.info(`Appending new cache for nearby entity '${this._player.entity.island.items.hashContainer(adj)}'`);
                    if (Doodad_1.default.is(adj))
                        this._nearby.push(new StorageCacheBase_1.StorageCacheDoodad(adj, this._player.entity));
                    else if (itemMgr.isTileContainer(adj) && "data" in adj)
                        this._nearby.push(new StorageCacheBase_1.StorageCacheTile(adj, this._player.entity));
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
            const f = (!filter || !filter.length || TransferHandler_1.default.groupifyFlatParameters(filter).has(ABMatch[0]));
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
                filter = [...TransferHandler_1.default.groupifyFlatParameters(filter)];
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
                    if (n.iswhat === "ITile" && StaticHelper_1.default.QS_INSTANCE.globalData.optionForbidTiles && !reverse)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9jYWxTdG9yYWdlQ2FjaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvTG9jYWxTdG9yYWdlQ2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQVdrRixDQUFDO0lBRW5GLElBQVksYUFBc0M7SUFBbEQsV0FBWSxhQUFhO1FBQUcsaURBQVEsQ0FBQTtRQUFFLHFEQUFVLENBQUE7SUFBQyxDQUFDLEVBQXRDLGFBQWEsR0FBYixxQkFBYSxLQUFiLHFCQUFhLFFBQXlCO0lBQUEsQ0FBQztJQUduRCxTQUFnQixjQUFjLENBQUMsQ0FBVyxFQUFFLENBQVcsSUFBYSxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFBNUksd0NBQTRJO0lBRTVJLE1BQWEsaUJBQWlCO1FBbVAxQixZQUFZLENBQVM7WUFqUGIsWUFBTyxHQUE4QyxFQUFFLENBQUM7WUFDeEQsb0JBQWUsR0FBWSxJQUFJLENBQUM7WUFFaEMsb0JBQWUsR0FBNEMsRUFBRSxDQUFDO1lBK09sRSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUkscUNBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0MsQ0FBQztRQTdPRCxJQUFXLE1BQU0sS0FBeUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMxRSxJQUFXLGNBQWMsS0FBeUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUN4RSxJQUFXLE1BQU0sS0FBZ0QsT0FBTyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsT0FBTyxDQUFD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
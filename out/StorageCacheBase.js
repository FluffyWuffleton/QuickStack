define(["require", "exports", "game/item/ItemManager", "utilities/math/Direction", "utilities/math/Vector3", "./StaticHelper", "./TransferHandler", "./LocalStorageCache"], function (require, exports, ItemManager_1, Direction_1, Vector3_1, StaticHelper_1, TransferHandler_1, LocalStorageCache_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StorageCacheDoodad = exports.StorageCacheTile = exports.StorageCachePlayer = exports.StorageCacheItem = exports.StorageCacheBase = void 0;
    class StorageCacheBase {
        constructor(e, hash, noRefresh) {
            this._freeze = false;
            this._outdated = true;
            StaticHelper_1.default.MaybeLog.info(`Constructing StorageCache for entity ${e} with hash '${hash}'`);
            this.entity = e;
            this.cHash = hash;
            this._main = new Set;
            this._subs = [];
        }
        isValidSource() { return true; }
        isValidDestination() { return true; }
        get main() { return this.refresh()._main; }
        get subs() { return this.refresh()._subs; }
        get frozen() { return this._freeze; }
        get subsNoUpdate() { return this._subs; }
        get outdated() { return this._outdated; }
        freeze(updateFirst = true) {
            if (updateFirst)
                this.refresh();
            for (const s of this._subs)
                s.freeze(updateFirst);
            this._freeze = true;
        }
        thaw(updateNow) {
            for (const s of this._subs)
                s.thaw(updateNow);
            this._freeze = false;
            if (updateNow)
                this.refresh();
        }
        setOutdated(recursive) {
            let flagged = false;
            if (!this._outdated) {
                StaticHelper_1.default.MaybeLog.info(`StorageCacheBase.setOutdated: Cache for '${this.cHash}' is now outdated.`);
                flagged = true;
                this._outdated = true;
            }
            if (recursive)
                this._subs.forEach(s => flagged ||= s.setOutdated(true));
            return flagged;
        }
        deepSubs() { return [...this.subs, ...this.subs.flatMap(s => s.deepSubs())]; }
        deepProperty(prop) { return [this[prop], ...this.deepSubs().map(s => s[prop])]; }
        findSub(lookingFor, noUpdate = true) {
            if (typeof lookingFor !== "string")
                lookingFor = lookingFor.island.items.hashContainer(lookingFor);
            for (const sub of (noUpdate ? this._subs : this.subs)) {
                const found = (sub.cHash === lookingFor) ? sub : sub.findSub(lookingFor, noUpdate);
                if (found)
                    return found;
            }
            return undefined;
        }
        refresh(protect) {
            if (!this._outdated || this._freeze)
                return this;
            StaticHelper_1.default.MaybeLog.info(`StorageCacheBase.refresh(): Updating outdated cache for '${this.cHash}'`);
            if (!this.cRef.containedItems)
                this._main.clear();
            else
                this._main = TransferHandler_1.default.setOfParams([{
                        containedItems: !protect ? this.cRef.containedItems : this.cRef.containedItems.filter(i => (0, TransferHandler_1.itemTransferAllowed)(i))
                    }]);
            const subCacheHashes = this._subs.map(s => s.cHash);
            const subContainers = this.cRef.containedItems?.filter(i => ItemManager_1.default.isContainer(i)) ?? [];
            const subConHashes = subContainers.map(s => s.island.items.hashContainer(s));
            subCacheHashes.map((h, idx) => subConHashes.includes(h) ? undefined : idx).filterNullish().reverse().forEach(idx => {
                StaticHelper_1.default.MaybeLog.info(`... removing cache entry for missing subcontainer '${this._subs[idx].cHash}' within ${this.cHash}`);
                this._subs.splice(idx);
                subCacheHashes.splice(idx);
            });
            subConHashes.map((h, idx) => subCacheHashes.includes(h) ? undefined : idx).filterNullish().forEach(idx => {
                this._subs.push(new StorageCacheItem(subContainers[idx]));
                StaticHelper_1.default.MaybeLog.info(`... adding new cache entry for subcontainer, hash '${this._subs.last()?.cHash}'`);
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
            this._relation = Direction_1.Direction.None;
            this.nearWhom = p;
        }
        get relation() { this.refreshRelation(); return this._relation; }
        refreshRelation() {
            const ppos = this.nearWhom.point;
            const thisPos = this.thisPos();
            const diff = { x: thisPos.x - ppos.x, y: thisPos.y - ppos.y, z: thisPos.z - ppos.z };
            const ok = (0, LocalStorageCache_1.isOnOrAdjacent)(ppos, thisPos);
            StaticHelper_1.default.MaybeLog.info(`StorageCacheNearby: Updating relation of '${this.cHash}'. Identified positions     ` +
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
        get fullTreeFlat() { return this._fullTreeFlat ?? (this._fullTreeFlat = [this, ...this.deepSubs()]); }
    }
    exports.StorageCacheItem = StorageCacheItem;
    class StorageCachePlayer extends StorageCacheBase {
        constructor(e) {
            super(e, e.island.items.hashContainer(e.inventory), true);
            this.iswhat = "Player";
            this.cRef = this.entity.inventory;
        }
        get fullTreeFlat() { return this._fullTreeFlat ?? (this._fullTreeFlat = [this, ...this.deepSubs()]); }
        refresh() { return super.refresh(true); }
        updateHash() {
            this.cHash.replace(this.cHash, this.entity.island.items.hashContainer(this.cRef));
            return this;
        }
    }
    exports.StorageCachePlayer = StorageCachePlayer;
    class StorageCacheTile extends StorageCacheNearby {
        constructor(e, p) {
            super(e, p, p.island.items.hashContainer(e.tileContainer));
            this.iswhat = "Tile";
            this.cRef = e;
        }
        get fullTreeFlat() { return this._fullTreeFlat ?? (this._fullTreeFlat = [this, ...this.deepSubs()]); }
        isValidSource() { return (0, TransferHandler_1.isValidTile)(this.entity, TransferHandler_1.SourceTileOptions); }
        isValidDestination() { return (0, TransferHandler_1.isValidTile)(this.entity, TransferHandler_1.DestinationTileOptions); }
        thisPos() { return !('x' in this.entity && 'y' in this.entity && 'z' in this.entity) ? { x: NaN, y: NaN, z: NaN } : this.entity; }
    }
    exports.StorageCacheTile = StorageCacheTile;
    class StorageCacheDoodad extends StorageCacheNearby {
        constructor(e, p) {
            super(e, p, p.island.items.hashContainer(e));
            this.iswhat = "Doodad";
            this.cRef = e;
        }
        get fullTreeFlat() { return this._fullTreeFlat ?? (this._fullTreeFlat = [this, ...this.deepSubs()]); }
        thisPos() { return this.entity; }
    }
    exports.StorageCacheDoodad = StorageCacheDoodad;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RvcmFnZUNhY2hlQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9TdG9yYWdlQ2FjaGVCYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFvQkEsTUFBc0IsZ0JBQWdCO1FBbUdsQyxZQUFZLENBQUksRUFBRSxJQUFZLEVBQUUsU0FBZ0I7WUEzRnhDLFlBQU8sR0FBWSxLQUFLLENBQUM7WUFDdkIsY0FBUyxHQUFZLElBQUksQ0FBQztZQTJGaEMsc0JBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLHdDQUF3QyxDQUFDLGVBQWUsSUFBSSxHQUFHLENBQUMsQ0FBQztZQUM1RixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUNoQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztZQUNsQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksR0FBZ0IsQ0FBQztZQUNsQyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNwQixDQUFDO1FBNUZNLGFBQWEsS0FBYyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDekMsa0JBQWtCLEtBQWMsT0FBTyxJQUFJLENBQUMsQ0FBQSxDQUFDO1FBRXBELElBQVcsSUFBSSxLQUF1QixPQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3BFLElBQVcsSUFBSSxLQUF5QixPQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLElBQVcsTUFBTSxLQUFjLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDckQsSUFBVyxZQUFZLEtBQXlCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFFcEUsSUFBVyxRQUFRLEtBQWMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUVsRCxNQUFNLENBQUMsY0FBdUIsSUFBSTtZQUNy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
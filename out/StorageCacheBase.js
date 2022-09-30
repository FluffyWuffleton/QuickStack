define(["require", "exports", "game/item/ItemManager", "utilities/math/Direction", "utilities/math/Vector3", "./StaticHelper", "./TransferHandler", "./LocalStorageCache"], function (require, exports, ItemManager_1, Direction_1, Vector3_1, StaticHelper_1, TransferHandler_1, LocalStorageCache_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StorageCacheDoodad = exports.StorageCacheTile = exports.StorageCachePlayer = exports.StorageCacheItem = exports.StorageCacheBase = void 0;
    class StorageCacheBase {
        constructor(e, hash, noRefresh) {
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
        get subsNoUpdate() { return this._subs; }
        get outdated() { return this._outdated; }
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
            if (!this._outdated)
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
            const ppos = this.nearWhom.getPoint();
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
            super(e, p, p.island.items.hashContainer(e));
            this.iswhat = "ITile";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RvcmFnZUNhY2hlQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9TdG9yYWdlQ2FjaGVCYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFtQkEsTUFBc0IsZ0JBQWdCO1FBdUZsQyxZQUFZLENBQUksRUFBRSxJQUFZLEVBQUUsU0FBZ0I7WUEvRXRDLGNBQVMsR0FBWSxJQUFJLENBQUM7WUFnRmhDLHNCQUFZLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyx3Q0FBd0MsQ0FBQyxlQUFlLElBQUksR0FBRyxDQUFDLENBQUM7WUFDNUYsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDaEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLEdBQWdCLENBQUM7WUFDbEMsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDcEIsQ0FBQztRQWxGTSxhQUFhLEtBQWMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLGtCQUFrQixLQUFjLE9BQU8sSUFBSSxDQUFDLENBQUEsQ0FBQztRQUVwRCxJQUFXLElBQUksS0FBdUIsT0FBTyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNwRSxJQUFXLElBQUksS0FBeUIsT0FBTyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUN0RSxJQUFXLFlBQVksS0FBeUIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUlwRSxJQUFXLFFBQVEsS0FBYyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBR2xELFdBQVcsQ0FBQyxTQUFnQjtZQUMvQixJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFDcEIsSUFBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ2hCLHNCQUFZLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyw0Q0FBNEMsSUFBSSxDQUFDLEtBQUssb0JBQW9CLENBQUMsQ0FBQztnQkFDdkcsT0FBTyxHQUFHLElBQUksQ0FBQztnQkFDZixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQzthQUN6QjtZQUNELElBQUcsU0FBUztnQkFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sS0FBSyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDdkUsT0FBTyxPQUFPLENBQUM7UUFDbkIsQ0FBQztRQUdNLFFBQVEsS0FBeUIsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEcsWUFBWSxDQUFtQyxJQUFPLElBQTJCLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUUsQ0FBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBS25LLE9BQU8sQ0FBQyxVQUFnQyxFQUFFLFdBQW9CLElBQUk7WUFDckUsSUFBRyxPQUFPLFVBQVUsS0FBSyxRQUFRO2dCQUFFLFVBQVUsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDbEcsS0FBSSxNQUFNLEdBQUcsSUFBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNqRCxNQUFNLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ25GLElBQUcsS0FBSztvQkFBRSxPQUFPLEtBQUssQ0FBQzthQUMxQjtZQUNELE9BQU8sU0FBUyxDQUFDO1FBQ3JCLENBQUM7UUFVUyxPQUFPLENBQUMsT0FBYztZQUM1QixJQUFHLENBQUMsSUFBSSxDQUFDLFNBQVM7Z0JBQUUsT0FBTyxJQUFJLENBQUM7WUFFaEMsc0JBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLDREQUE0RCxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztZQUN0RyxJQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjO2dCQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUE7O2dCQUMzQyxJQUFJLENBQUMsS0FBSyxHQUFHLHlCQUFlLENBQUMsV0FBVyxDQUFDLENBQUM7d0JBQzNDLGNBQWMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUEscUNBQW1CLEVBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3JILENBQUMsQ0FBQyxDQUFDO1lBRUosTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEQsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMscUJBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDOUYsTUFBTSxZQUFZLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRzdFLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDL0csc0JBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLHNEQUFzRCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssWUFBWSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztnQkFDaEksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN2RCxDQUFDLENBQUMsQ0FBQztZQUNILFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDckcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMxRCxzQkFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsc0RBQXNELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQztZQUNsSCxDQUFDLENBQUMsQ0FBQztZQUdILElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzdDLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1lBQ3ZCLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7S0FTSjtJQTlGRCw0Q0E4RkM7SUFLRCxNQUFlLGtCQUE2QyxTQUFRLGdCQUFtQjtRQStCbkYsWUFBWSxDQUFJLEVBQUUsQ0FBUyxFQUFFLElBQVk7WUFDckMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQTlCWCxjQUFTLEdBQXdDLHFCQUFTLENBQUMsSUFBSSxDQUFDO1lBK0JwRSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztRQUN0QixDQUFDO1FBL0JELElBQVcsUUFBUSxLQUEwQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBTW5HLGVBQWU7WUFDckIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUN0QyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFFL0IsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ3JGLE1BQU0sRUFBRSxHQUFHLElBQUEsa0NBQWMsRUFBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDekMsc0JBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUN0Qiw2Q0FBNkMsSUFBSSxDQUFDLEtBQUssOEJBQThCO2dCQUNyRixXQUFXLElBQUksaUJBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLGFBQWEsSUFBSSxpQkFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzVGLElBQUcsQ0FBQyxFQUFFO2dCQUFFLE9BQU8sS0FBSyxDQUFDO1lBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcscUJBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUEwQyxDQUFDO1lBQzlFLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFHTSxhQUFhO1lBQ2hCLElBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFFO2dCQUN2QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ2YsT0FBTyxJQUFJLENBQUM7YUFDZjtZQUNELE9BQU8sS0FBSyxDQUFDO1FBQ2pCLENBQUM7S0FLSjtJQUVELE1BQWEsZ0JBQWlCLFNBQVEsZ0JBQXNCO1FBS3hELFlBQVksQ0FBTztZQUNmLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFMOUIsV0FBTSxHQUFHLE1BQU0sQ0FBQztZQU01QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFvQixDQUFDO1FBQzFDLENBQUM7UUFMRCxJQUFXLFlBQVksS0FBeUIsT0FBTyxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBTXBJO0lBVEQsNENBU0M7SUFDRCxNQUFhLGtCQUFtQixTQUFRLGdCQUF3QjtRQVc1RCxZQUFZLENBQVM7WUFDakIsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBWDlDLFdBQU0sR0FBRyxRQUFRLENBQUM7WUFZOUIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUN0QyxDQUFDO1FBWEQsSUFBVyxZQUFZLEtBQThDLE9BQU8sSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFBLENBQUMsQ0FBQztRQUNySSxPQUFPLEtBQVcsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV4RCxVQUFVO1lBQ2IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2xGLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7S0FNSjtJQWZELGdEQWVDO0lBRUQsTUFBYSxnQkFBaUIsU0FBUSxrQkFBeUI7UUFTM0QsWUFBWSxDQUFRLEVBQUUsQ0FBUztZQUMzQixLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQVRqQyxXQUFNLEdBQUcsT0FBTyxDQUFDO1lBVTdCLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBbUIsQ0FBQztRQUNwQyxDQUFDO1FBVEQsSUFBVyxZQUFZLEtBQTRDLE9BQU8sSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFBLENBQUMsQ0FBQztRQUVuSSxhQUFhLEtBQWMsT0FBTyxJQUFBLDZCQUFXLEVBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxtQ0FBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRixrQkFBa0IsS0FBYyxPQUFPLElBQUEsNkJBQVcsRUFBQyxJQUFJLENBQUMsTUFBTSxFQUFFLHdDQUFzQixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRW5HLE9BQU8sS0FBZSxPQUFPLENBQUMsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFrQixDQUFDLENBQUMsQ0FBQztLQUtsSztJQWJELDRDQWFDO0lBQ0QsTUFBYSxrQkFBbUIsU0FBUSxrQkFBMEI7UUFNOUQsWUFBWSxDQUFTLEVBQUUsQ0FBUztZQUM1QixLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBZSxDQUFDLENBQUMsQ0FBQztZQU4vQyxXQUFNLEdBQUcsUUFBUSxDQUFDO1lBTzlCLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLENBQUM7UUFORCxJQUFXLFlBQVksS0FBZ0MsT0FBTyxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUEsQ0FBQyxDQUFDO1FBRWhJLE9BQU8sS0FBZSxPQUFPLElBQUksQ0FBQyxNQUFrQixDQUFDLENBQUMsQ0FBQztLQUtqRTtJQVZELGdEQVVDIn0=
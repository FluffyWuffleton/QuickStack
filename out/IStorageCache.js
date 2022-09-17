define(["require", "exports", "game/item/ItemManager", "utilities/game/TilePosition", "utilities/math/Direction", "utilities/math/Vector3"], function (require, exports, ItemManager_1, TilePosition_1, Direction_1, Vector3_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StorageCacheDoodad = exports.StorageCacheTile = exports.StorageCachePlayer = exports.StorageCacheItem = exports.StorageCache = exports.ILocalStorageCache = void 0;
    class ILocalStorageCache {
        constructor() {
            this._nearbyUnrolled = { types: new Set, groups: new Set };
        }
        get nearby() { return this._nearby; }
        set nearby(value) { this._nearby = value; }
        get nearbyUnrolled() { return this._nearbyUnrolled; }
        unrollNearby() {
            this._nearby.forEach(n => n.updateUnrolled());
            ["types", "groups"].forEach(KEY => {
                this._nearbyUnrolled[KEY].clear();
                this._nearby.forEach(n => this._nearbyUnrolled[KEY].addFrom(n.unrolled[KEY]));
            });
        }
    }
    exports.ILocalStorageCache = ILocalStorageCache;
    ;
    class StorageCache {
        constructor(e, hash) {
            this.entity = e;
            this.cHash = hash;
            this._unrolled = { types: new Set, groups: new Set };
            this.refresh();
        }
        get main() { return this._main; }
        get subs() { return this._subs; }
        get unrolled() { return this._unrolled; }
        updateUnrolled() {
            this._subs.forEach(s => s.updateUnrolled());
            ["types", "groups"].forEach(KEY => {
                this._unrolled[KEY].clear();
                this._unrolled[KEY].addFrom(this._main[KEY]);
                this._subs.forEach(s => this._unrolled[KEY].addFrom(s.unrolled[KEY]));
            });
        }
        findSub(i) {
            for (const s of this._subs) {
                if (s.entity === i)
                    return s;
                const ss = s.findSub(i);
                if (ss)
                    return ss;
            }
            return undefined;
        }
        refreshFromArray(i) {
            this._main = {
                types: new Set(i.map(i => i.type)),
                groups: new Set(i.flatMap(i => [...ItemManager_1.default.getGroups(i.type)]))
            };
            this._subs = i
                .filter(i => i.island.items.isContainer(i))
                .map(ii => new StorageCacheItem(ii));
        }
    }
    exports.StorageCache = StorageCache;
    ;
    (function (StorageCache) {
        function is(val) {
            return val instanceof (StorageCache);
        }
        StorageCache.is = is;
    })(StorageCache = exports.StorageCache || (exports.StorageCache = {}));
    class StorageCacheNearby extends StorageCache {
        get relation() { return this._relation; }
        refreshRelationFromPos(thisPos) {
            const ppos = this.nearWhom.getPoint();
            const D = Direction_1.Direction.get({ x: ppos.x - thisPos.x, y: ppos.y - thisPos.y });
            if (Direction_1.Direction.isCardinal(D)) {
                this._relation = D;
                return true;
            }
            return false;
        }
        refresh() {
            if (this.refreshRelation()) {
                this.refreshFromArray(this.entity.containedItems ?? []);
                return true;
            }
            return false;
        }
    }
    class StorageCacheItem extends StorageCache {
        refresh() { this.refreshFromArray(this.entity.containedItems ?? []); }
        constructor(e) { super(e, e.island.items.hashContainer(e)); }
    }
    exports.StorageCacheItem = StorageCacheItem;
    class StorageCachePlayer extends StorageCache {
        refresh() { this.refreshFromArray(this.entity.inventory.containedItems); }
        constructor(e) { super(e, e.island.items.hashContainer(e.inventory)); }
    }
    exports.StorageCachePlayer = StorageCachePlayer;
    class StorageCacheTile extends StorageCacheNearby {
        refreshRelation() { return super.refreshRelationFromPos(new Vector3_1.default((0, TilePosition_1.getTilePosition)(this.entity.data))); }
        constructor(e, items) { super(e, items.hashContainer(e)); }
    }
    exports.StorageCacheTile = StorageCacheTile;
    class StorageCacheDoodad extends StorageCacheNearby {
        refreshRelation() { return super.refreshRelationFromPos({ x: this.entity.x, y: this.entity.y, z: this.entity.z }); }
        constructor(e, items) { super(e, items.hashContainer(e)); }
    }
    exports.StorageCacheDoodad = StorageCacheDoodad;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSVN0b3JhZ2VDYWNoZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9JU3RvcmFnZUNhY2hlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFZQSxNQUFhLGtCQUFrQjtRQUEvQjtZQUdZLG9CQUFlLEdBQW1CLEVBQUUsS0FBSyxFQUFFLElBQUksR0FBYSxFQUFFLE1BQU0sRUFBRSxJQUFJLEdBQWtCLEVBQUUsQ0FBQztRQWEzRyxDQUFDO1FBWEcsSUFBVyxNQUFNLEtBQWdELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDdkYsSUFBVyxNQUFNLENBQUMsS0FBZ0QsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFFN0YsSUFBVyxjQUFjLEtBQXFCLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7UUFDckUsWUFBWTtZQUNmLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7WUFDN0MsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUE4QixDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDNUQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDbEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBRSxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7S0FDSjtJQWhCRCxnREFnQkM7SUFBQSxDQUFDO0lBSUYsTUFBc0IsWUFBWTtRQTZDOUIsWUFBWSxDQUFJLEVBQUUsSUFBWTtZQUMxQixJQUFJLENBQUMsTUFB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
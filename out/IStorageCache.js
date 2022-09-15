define(["require", "exports", "game/item/IItem", "game/item/ItemManager", "utilities/game/TilePosition", "utilities/math/Direction"], function (require, exports, IItem_1, ItemManager_1, TilePosition_1, Direction_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StorageCache = void 0;
    class StorageCache {
        constructor(e) {
            this.entity = e;
            this.refresh();
        }
        get main() { return this._main; }
        get subs() { return this._subs; }
        get unrolled() {
            if (this._unrolled === undefined) {
                const subFlat = this._subs.flatMap(sub => sub.unrolled);
                this._unrolled = { types: new Set, groups: new Set };
                for (const sub of subFlat) {
                    this._unrolled.types.addFrom(sub.types);
                    this._unrolled.groups.addFrom(sub.groups);
                }
            }
            return this._unrolled;
        }
        refreshFromArray(i) {
            const types = new Set(i.map(i => i.type));
            const groups = new Set(i.flatMap(i => [...ItemManager_1.default.getGroups(i.type)]));
            groups.forEach(g => types.retainWhere(t => !ItemManager_1.default.getGroupItems(g).has(t)));
            this._main = { types: types, groups: groups };
            this._subs = i.filter(i => ItemManager_1.default.isInGroup(i.type, IItem_1.ItemTypeGroup.Storage)).map(ii => new StorageCacheItem(ii));
            this._unrolled = undefined;
        }
    }
    exports.StorageCache = StorageCache;
    ;
    (function (StorageCache) {
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
    }
    class StorageCachePlayer extends StorageCache {
        refresh() { this.refreshFromArray(this.entity.inventory.containedItems); }
    }
    class StorageCacheTile extends StorageCacheNearby {
        refreshRelation() { return super.refreshRelationFromPos(((a) => ({ x: a[0], y: a[1], z: a[2] })).call(this, (0, TilePosition_1.getTilePosition)(this.entity.data))); }
    }
    class StorageCacheDoodad extends StorageCacheNearby {
        refreshRelation() { return super.refreshRelationFromPos({ x: this.entity.x, y: this.entity.y, z: this.entity.z }); }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSVN0b3JhZ2VDYWNoZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9JU3RvcmFnZUNhY2hlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFxQkEsTUFBc0IsWUFBWTtRQWdDOUIsWUFBc0IsQ0FBSTtZQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUNoQixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDbkIsQ0FBQztRQTdCRCxJQUFXLElBQUksS0FBcUIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUN4RCxJQUFXLElBQUksS0FBeUIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUM1RCxJQUFXLFFBQVE7WUFDZixJQUFHLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUyxFQUFFO2dCQUM3QixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDeEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEdBQWEsRUFBRSxNQUFNLEVBQUUsSUFBSSxHQUFrQixFQUFFLENBQUM7Z0JBQzlFLEtBQUksTUFBTSxHQUFHLElBQUksT0FBTyxFQUFFO29CQUN0QixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN4QyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2lCQUM3QzthQUNKO1lBQ0QsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFBO1FBQ3pCLENBQUM7UUFFUyxnQkFBZ0IsQ0FBQyxDQUFTO1lBQ2hDLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMs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
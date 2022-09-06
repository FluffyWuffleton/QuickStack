define(["require", "exports", "game/entity/action/usable/UsableAction", "../StaticHelper", "./Actions", "game/entity/action/IAction", "game/entity/action/usable/UsableActionRegistrar", "language/Translation", "../TransferHandler", "language/Dictionary", "language/ITranslation", "ui/screen/screens/game/component/Item"], function (require, exports, UsableAction_1, StaticHelper_1, Actions_1, IAction_1, UsableActionRegistrar_1, Translation_1, TransferHandler_1, Dictionary_1, ITranslation_1, Item_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StackTypeHereNearby = exports.StackTypeSelfNearby = exports.StackAllAlikeSubNearby = exports.StackAllSubNearby = exports.execSAMN = exports.StackAllMainNearby = exports.execSASeN = exports.StackAllSelfNearby = exports.QSSubmenu = exports.UsableActionsQuickStack = void 0;
    const menuScaling = { width: 16, height: 16, scale: 1 };
    const slotScaling = { width: 16, height: 16, scale: 2 };
    exports.UsableActionsQuickStack = new UsableActionRegistrar_1.UsableActionGenerator(reg => {
        QSSubmenu.Deposit.register(reg);
        exports.StackAllSelfNearby.register(reg, false);
        exports.StackAllMainNearby.register(reg, false);
        exports.StackAllSubNearby.register(reg, false);
        exports.StackTypeSelfNearby.register(reg, false);
        exports.StackAllAlikeSubNearby.register(reg, false);
    });
    var QSSubmenu;
    (function (QSSubmenu) {
        QSSubmenu.Deposit = new UsableActionRegistrar_1.UsableActionGenerator(reg => reg.add("QuickStackMainSubmenu", UsableAction_1.default
            .requiring({ item: { allowNone: true } })
            .create({
            displayLevel: IAction_1.ActionDisplayLevel.Always,
            translate: (translator) => translator.name(StaticHelper_1.default.TLget("deposit")),
            isApplicable: () => true,
            isUsable: (player, { item, itemType }) => {
                if (!item && !itemType)
                    return true;
                if (item && (0, TransferHandler_1.playerHasItem)(player, item))
                    return true;
                if (itemType && (0, TransferHandler_1.playerHasType)(player, itemType))
                    return true;
                return false;
            },
            submenu: (subreg) => {
                QSSubmenu.All.register(subreg);
                QSSubmenu.Type.register(subreg);
            }
        })));
        QSSubmenu.All = new UsableActionRegistrar_1.UsableActionGenerator(reg => reg.add("QuickStackAllSubmenu", UsableAction_1.default
            .requiring({ item: { allowNone: true } })
            .create({
            displayLevel: IAction_1.ActionDisplayLevel.Always,
            translate: (translator) => translator.name(StaticHelper_1.default.TLget("allTypes")),
            isApplicable: () => true,
            isUsable: () => true,
            submenu: (subreg) => {
                exports.StackAllSelfNearby.register(subreg, true);
                exports.StackAllMainNearby.register(subreg, true);
                exports.StackAllSubNearby.register(subreg, true);
                exports.StackAllAlikeSubNearby.register(subreg, true);
            }
        })));
        QSSubmenu.Type = new UsableActionRegistrar_1.UsableActionGenerator(reg => reg.add("QuickStackTypeSubmenu", UsableAction_1.default
            .requiring({ item: true })
            .create({
            displayLevel: IAction_1.ActionDisplayLevel.Always,
            translate: (translator) => translator.name(({ item, itemType }) => StaticHelper_1.default.TLget("onlyXType")
                .addArgs(item?.getName(false, 999, false, false, false, false)
                ?? (itemType ? Translation_1.default.nameOf(Dictionary_1.default.Item, itemType) : undefined))),
            isApplicable: (player, using) => {
                const type = using.item?.type ?? using.itemType;
                return !type ? false : (0, TransferHandler_1.playerHasType)(player, type);
            },
            isUsable: (player, using) => {
                const type = using.item?.type ?? using.itemType;
                return !type ? false : (0, TransferHandler_1.playerHasType)(player, type);
            },
            submenu: (subreg) => {
                exports.StackTypeSelfNearby.register(subreg, true);
                exports.StackTypeHereNearby.register(subreg);
            }
        })));
    })(QSSubmenu = exports.QSSubmenu || (exports.QSSubmenu = {}));
    exports.StackAllSelfNearby = new UsableActionRegistrar_1.UsableActionGenerator((reg, inSubmenu) => reg.add("StackAllSelfNearby", UsableAction_1.default
        .requiring(inSubmenu ? { item: { allowNone: true, validate: (p, i) => (0, TransferHandler_1.playerHasItem)(p, i) } } : {})
        .create({
        slottable: true,
        icon: { action: StaticHelper_1.default.QS_INSTANCE.UAPlaceholderAllSelfNearby, ...(inSubmenu ? menuScaling : slotScaling) },
        iconLocationOnItem: Item_1.ItemDetailIconLocation.BottomRight,
        bindable: inSubmenu ? StaticHelper_1.default.QS_INSTANCE.bindableSASN_submenu : undefined,
        displayLevel: inSubmenu ? IAction_1.ActionDisplayLevel.Always : IAction_1.ActionDisplayLevel.Never,
        translate: (translator) => translator.name(() => {
            const fromSegment = StaticHelper_1.default.TLget("fromX").addArgs(StaticHelper_1.default.TLget("fullInventory"));
            return inSubmenu
                ? fromSegment
                : StaticHelper_1.default.TLget("deposit").addArgs(StaticHelper_1.default.TLget("allTypes").inContext(ITranslation_1.TextContext.Lowercase), fromSegment);
        }),
        isApplicable: () => true,
        isUsable: (player) => TransferHandler_1.default.hasMatchType(player.island.items.getAdjacentContainers(player, false), [player.inventory, ...(0, TransferHandler_1.playerHeldContainers)(player)]),
        execute: exports.execSASeN
    })));
    const execSASeN = (p) => (0, Actions_1.executeStackAction_notify)(p, [{ self: true, recursive: true }], [{ tiles: true }, { doodads: true }], []);
    exports.execSASeN = execSASeN;
    exports.StackAllMainNearby = new UsableActionRegistrar_1.UsableActionGenerator((reg, inSubmenu) => reg.add("StackAllMainNearby", UsableAction_1.default
        .requiring(inSubmenu ? { item: { allowNone: true, validate: (p, i) => (0, TransferHandler_1.playerHasItem)(p, i) } } : {})
        .create({
        slottable: true,
        icon: { action: StaticHelper_1.default.QS_INSTANCE.UAPlaceholderAllMainNearby, ...(inSubmenu ? menuScaling : slotScaling) },
        iconLocationOnItem: Item_1.ItemDetailIconLocation.BottomRight,
        bindable: StaticHelper_1.default.QS_INSTANCE[inSubmenu ? "bindableSAMN_submenu" : "bindableSAMN"],
        displayLevel: inSubmenu ? IAction_1.ActionDisplayLevel.Always : IAction_1.ActionDisplayLevel.Never,
        translate: (translator) => translator.name(() => {
            const fromSegment = StaticHelper_1.default.TLget("fromX").addArgs(StaticHelper_1.default.TLget("mainInventory"));
            return inSubmenu
                ? fromSegment
                : StaticHelper_1.default.TLget("deposit").addArgs(StaticHelper_1.default.TLget("allTypes").inContext(ITranslation_1.TextContext.Lowercase), fromSegment);
        }),
        isApplicable: () => true,
        isUsable: (player) => TransferHandler_1.default.hasMatchType(player.island.items.getAdjacentContainers(player, false), [player.inventory]),
        execute: exports.execSAMN
    })));
    const execSAMN = (p) => (0, Actions_1.executeStackAction_notify)(p, [{ self: true }], [{ tiles: true }, { doodads: true }], []);
    exports.execSAMN = execSAMN;
    exports.StackAllSubNearby = new UsableActionRegistrar_1.UsableActionGenerator((reg, inSubmenu) => reg.add("StackAllSubNearby", UsableAction_1.default
        .requiring({
        item: {
            allowOnlyItemType: (p, ty) => !inSubmenu ? false : (0, TransferHandler_1.isContainerType)(p, ty),
            validate: (p, i) => (0, TransferHandler_1.isHeldContainer)(p, i)
        }
    })
        .create({
        slottable: !inSubmenu,
        displayLevel: inSubmenu ? IAction_1.ActionDisplayLevel.Always : IAction_1.ActionDisplayLevel.Never,
        translate: (translator) => translator.name(({ item, itemType }) => {
            const fromSegment = StaticHelper_1.default.TLget("fromX").addArgs(item
                ? item.getName(false)
                : itemType
                    ? Translation_1.default.nameOf(Dictionary_1.default.Item, itemType, 999, false)
                    : StaticHelper_1.default.TLget("thisContainer"));
            return inSubmenu
                ? fromSegment
                : StaticHelper_1.default.TLget("deposit").addArgs(StaticHelper_1.default.TLget("allTypes").inContext(ITranslation_1.TextContext.Lowercase), fromSegment);
        }),
        isApplicable: (player, using) => using.item
            ? (0, TransferHandler_1.isHeldContainer)(player, using.item)
            : using.itemType
                ? (0, TransferHandler_1.playerHasType)(player, using.itemType) && (0, TransferHandler_1.isContainerType)(player, using.itemType)
                : false,
        isUsable: (player, using) => TransferHandler_1.default.hasMatchType(player.island.items.getAdjacentContainers(player, false), using.itemType ? (0, TransferHandler_1.playerHeldContainers)(player, [using.itemType]) : [using.item]),
        execute: (p, u) => (0, Actions_1.executeStackAction)(p, [{ container: u.itemType ? (0, TransferHandler_1.playerHeldContainers)(p, [u.itemType]) : u.item }], [{ tiles: true }, { doodads: true }], [])
    })));
    exports.StackAllAlikeSubNearby = new UsableActionRegistrar_1.UsableActionGenerator((reg, inSubmenu) => reg.add("StackAllAlikeSubNearby", UsableAction_1.default
        .requiring({
        item: {
            allowOnlyItemType: (p, ty) => (0, TransferHandler_1.isContainerType)(p, ty),
            validate: (p, i) => (0, TransferHandler_1.isHeldContainer)(p, i)
        }
    })
        .create({
        slottable: true,
        displayLevel: inSubmenu ? IAction_1.ActionDisplayLevel.Always : IAction_1.ActionDisplayLevel.Never,
        translate: (translator) => translator.name(({ item, itemType }) => {
            const fromSegment = StaticHelper_1.default.TLget("fromX").addArgs(StaticHelper_1.default.TLget("allX").addArgs(item
                ? Translation_1.default.nameOf(Dictionary_1.default.Item, item.type, 999, false)
                : itemType
                    ? Translation_1.default.nameOf(Dictionary_1.default.Item, itemType, 999, false)
                    : StaticHelper_1.default.TLget("likeContainers")));
            return inSubmenu
                ? fromSegment
                : StaticHelper_1.default.TLget("deposit").addArgs(StaticHelper_1.default.TLget("allTypes").inContext(ITranslation_1.TextContext.Lowercase), fromSegment);
        }),
        isApplicable: (player, using) => using.item ? (0, TransferHandler_1.isHeldContainer)(player, using.item) : using.itemType ? (0, TransferHandler_1.playerHasType)(player, using.itemType) : false,
        isUsable: (player, using) => TransferHandler_1.default.hasMatchType(player.island.items.getAdjacentContainers(player, false), using.itemType ? (0, TransferHandler_1.playerHeldContainers)(player, [using.itemType]) : [using.item]),
        execute: (player, using, _context) => (0, Actions_1.executeStackAction)(player, [{ container: using.item ? using.item : (0, TransferHandler_1.playerHeldContainers)(player, using.itemType ? [using.itemType] : []) }], [{ tiles: true }, { doodads: true }], [])
    })));
    exports.StackTypeSelfNearby = new UsableActionRegistrar_1.UsableActionGenerator((reg, inSubmenu) => reg.add("StackTypeSelfNearby", UsableAction_1.default
        .requiring({
        item: {
            allowOnlyItemType: () => true,
            validate: (player, value) => (0, TransferHandler_1.playerHasItem)(player, value)
        }
    })
        .create({
        slottable: true,
        displayLevel: inSubmenu ? IAction_1.ActionDisplayLevel.Always : IAction_1.ActionDisplayLevel.Never,
        translate: (translator) => translator.name(({ item, itemType }) => {
            const fromSegment = StaticHelper_1.default.TLget("fromX").addArgs(StaticHelper_1.default.TLget("fullInventory"));
            return inSubmenu
                ? fromSegment
                : StaticHelper_1.default.TLget("deposit").addArgs(item
                    ? Translation_1.default.nameOf(Dictionary_1.default.Item, item.type, 999, false)
                    : itemType
                        ? Translation_1.default.nameOf(Dictionary_1.default.Item, itemType, 999, false)
                        : undefined, fromSegment);
        }),
        isApplicable: (player, using) => {
            const type = (using.item?.type ?? using.itemType);
            return !type ? false : TransferHandler_1.default.hasType([player.inventory, ...(0, TransferHandler_1.playerHeldContainers)(player)], type);
        },
        isUsable: (player, using) => {
            const type = (using.item?.type ?? using.itemType);
            return !type ? false : TransferHandler_1.default.hasType(player.island.items.getAdjacentContainers(player, false), type);
        },
        execute: (player, using, _context) => (0, Actions_1.executeStackAction)(player, [{ self: true, recursive: true }], [{ tiles: true }, { doodads: true }], using.item?.type ? [using.item.type] : using.itemType ? [using.itemType] : [])
    })));
    exports.StackTypeHereNearby = new UsableActionRegistrar_1.UsableActionGenerator(reg => reg.add("StackTypeHereNearby", UsableAction_1.default
        .requiring({
        item: {
            validate: (p, i) => (0, TransferHandler_1.playerHasItem)(p, i)
        }
    })
        .create({
        slottable: false,
        displayLevel: IAction_1.ActionDisplayLevel.Always,
        translate: (translator) => translator.name(StaticHelper_1.default.TLget("fromX").addArgs(StaticHelper_1.default.TLget("here"))),
        isApplicable: (player, { item }) => item ? (0, TransferHandler_1.playerHasItem)(player, item) : false,
        isUsable: (player, { item }) => TransferHandler_1.default.hasType(player.island.items.getAdjacentContainers(player, false), item.type),
        execute: (player, { item }, _context) => (0, Actions_1.executeStackAction)(player, [{ container: item.containedWithin }], [{ tiles: true }, { doodads: true }], [item.type])
    })));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNhYmxlQWN0aW9uc1F1aWNrU3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9ucy9Vc2FibGVBY3Rpb25zUXVpY2tTdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBa0JBLE1BQU0sV0FBVyxHQUF3QixFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDN0UsTUFBTSxXQUFXLEdBQXdCLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQztJQVloRSxRQUFBLHVCQUF1QixHQUFHLElBQUksNkNBQXFCLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFHbkUsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7UUFHaEMsMEJBQWtCLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4QywwQkFBa0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3hDLHlCQUFpQixDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdkMsMkJBQW1CLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN6Qyw4QkFBc0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBSWhELENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBaUIsU0FBUyxDQW1FekI7SUFuRUQsV0FBaUIsU0FBUztRQUVULGlCQUFPLEdBQUcsSUFBSSw2Q0FBcUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEVBQUUsc0JBQVk7YUFDaEcsU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsU0FBUyxF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
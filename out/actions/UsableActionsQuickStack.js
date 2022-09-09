define(["require", "exports", "game/entity/action/usable/UsableAction", "../StaticHelper", "./Actions", "game/entity/action/IAction", "game/entity/action/usable/UsableActionRegistrar", "language/Translation", "../TransferHandler", "game/item/IItem", "language/Dictionary", "language/ITranslation", "ui/screen/screens/game/component/Item"], function (require, exports, UsableAction_1, StaticHelper_1, Actions_1, IAction_1, UsableActionRegistrar_1, Translation_1, TransferHandler_1, IItem_1, Dictionary_1, ITranslation_1, Item_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StackTypeHereNearby = exports.StackTypeSelfNearby = exports.StackAllAlikeSubNearby = exports.StackAllSubNearby = exports.execSAMN = exports.StackAllMainNearby = exports.execSASeN = exports.StackAllSelfNearby = exports.QSSubmenu = exports.UsableActionsQuickStack = void 0;
    const menuScaling = { width: 16, height: 16, scale: 1 };
    const slotScaling = { width: 16, height: 16, scale: 2 };
    exports.UsableActionsQuickStack = new UsableActionRegistrar_1.UsableActionGenerator(reg => {
        QSSubmenu.Deposit.register(reg);
        exports.StackAllSelfNearby.register(reg, false);
        exports.StackAllMainNearby.register(reg, false);
        exports.StackTypeSelfNearby.register(reg, false);
        exports.StackAllSubNearby.register(reg, false);
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
            isUsable: (player, using) => {
                return QSSubmenu.All.get().actions[0][1].isUsable(player, using);
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
            isApplicable: (player, using) => using.item ? (0, TransferHandler_1.playerHasItem)(player, using.item) : true,
            isUsable: (player, using) => {
                return exports.StackAllSelfNearby.get(true).actions[0][1].isUsable(player, using);
            },
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
            translate: (translator) => translator.name(({ item, itemType }) => {
                const grp = TransferHandler_1.default.getActiveGroup(item?.type ?? itemType ?? IItem_1.ItemTypeGroup.Invalid);
                return StaticHelper_1.default.TLget("onlyXType").addArgs(...(grp !== undefined
                    ? [
                        StaticHelper_1.default.TLget(grp).passTo(StaticHelper_1.default.TLget("colorMatchGroup")),
                        StaticHelper_1.default.TLget("Item").passTo(Translation_1.default.reformatSingularNoun(999, false))
                    ] : [
                    item?.getName(false, 999, false, false, false, false)
                        ?? (itemType
                            ? Translation_1.default.nameOf(Dictionary_1.default.Item, itemType, false)
                            : undefined)
                ]));
            }),
            isApplicable: (player, using) => {
                const type = using.item?.type ?? using.itemType;
                return !type ? false : (0, TransferHandler_1.playerHasType)(player, type);
            },
            isUsable: (player, using) => {
                return exports.StackTypeSelfNearby.get(true).actions[0][1]
                    .isUsable(player, using);
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
        icon: IAction_1.ActionType.Drop,
        iconLocationOnItem: Item_1.ItemDetailIconLocation.BottomRight,
        bindable: inSubmenu ? StaticHelper_1.default.QS_INSTANCE.bindableSASN_submenu : undefined,
        displayLevel: inSubmenu ? IAction_1.ActionDisplayLevel.Always : IAction_1.ActionDisplayLevel.Never,
        translate: (translator) => translator.name(() => {
            const fromSegment = StaticHelper_1.default.TLget("fromX").addArgs(StaticHelper_1.default.TLget("fullInventory"));
            return inSubmenu
                ? fromSegment
                : StaticHelper_1.default.TLget("deposit").addArgs(StaticHelper_1.default.TLget("allTypes").inContext(ITranslation_1.TextContext.Lowercase), fromSegment);
        }),
        isApplicable: (player) => inSubmenu ? TransferHandler_1.default.hasMatch((0, TransferHandler_1.validNearby)(player), [player.inventory, ...(0, TransferHandler_1.playerHeldContainers)(player)]) : true,
        isUsable: (player) => TransferHandler_1.default.canFitAny([player.inventory, ...(0, TransferHandler_1.playerHeldContainers)(player)], (0, TransferHandler_1.validNearby)(player), player),
        execute: exports.execSASeN
    })));
    const execSASeN = (p) => (0, Actions_1.executeStackAction_notify)(p, [{ self: true, recursive: true }], [{ tiles: true }, { doodads: true }], []);
    exports.execSASeN = execSASeN;
    exports.StackAllMainNearby = new UsableActionRegistrar_1.UsableActionGenerator((reg, inSubmenu) => reg.add("StackAllMainNearby", UsableAction_1.default
        .requiring(inSubmenu ? { item: { allowNone: true, validate: (p, i) => (0, TransferHandler_1.playerHasItem)(p, i) } } : {})
        .create({
        slottable: true,
        icon: IAction_1.ActionType.Drop,
        iconLocationOnItem: Item_1.ItemDetailIconLocation.BottomRight,
        bindable: StaticHelper_1.default.QS_INSTANCE[inSubmenu ? "bindableSAMN_submenu" : "bindableSAMN"],
        displayLevel: inSubmenu ? IAction_1.ActionDisplayLevel.Always : IAction_1.ActionDisplayLevel.Never,
        translate: (translator) => translator.name(() => {
            const fromSegment = StaticHelper_1.default.TLget("fromX").addArgs(StaticHelper_1.default.TLget("mainInventory"));
            return inSubmenu
                ? fromSegment
                : StaticHelper_1.default.TLget("deposit").addArgs(StaticHelper_1.default.TLget("allTypes").inContext(ITranslation_1.TextContext.Lowercase), fromSegment);
        }),
        isApplicable: (player) => inSubmenu ? TransferHandler_1.default.hasMatch([player.inventory], (0, TransferHandler_1.validNearby)(player)) : true,
        isUsable: (player) => TransferHandler_1.default.canFitAny([player.inventory], (0, TransferHandler_1.validNearby)(player), player),
        execute: exports.execSAMN
    })));
    const execSAMN = (p) => (0, Actions_1.executeStackAction_notify)(p, [{ self: true }], [{ tiles: true }, { doodads: true }], []);
    exports.execSAMN = execSAMN;
    exports.StackAllSubNearby = new UsableActionRegistrar_1.UsableActionGenerator((reg, inSubmenu) => reg.add("StackAllSubNearby", UsableAction_1.default
        .requiring({
        item: {
            validate: (p, i) => (0, TransferHandler_1.isHeldContainer)(p, i)
        }
    })
        .create({
        slottable: !inSubmenu,
        icon: IAction_1.ActionType.Drop,
        iconLocationOnItem: Item_1.ItemDetailIconLocation.BottomRight,
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
        isApplicable: (player, { item }) => item ? (0, TransferHandler_1.isHeldContainer)(player, item) : false,
        isUsable: (player, { item }) => TransferHandler_1.default.canFitAny([item], (0, TransferHandler_1.validNearby)(player), player),
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
        icon: IAction_1.ActionType.Drop,
        iconLocationOnItem: Item_1.ItemDetailIconLocation.BottomRight,
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
        isApplicable: (player, { item, itemType }) => {
            let conType;
            if (item) {
                if (!(0, TransferHandler_1.isHeldContainer)(player, item))
                    return false;
                conType = item.type;
            }
            else if (itemType) {
                if (!(0, TransferHandler_1.playerHasType)(player, itemType))
                    return false;
                conType = itemType;
            }
            else
                return false;
            return inSubmenu ? true : TransferHandler_1.default.hasMatch((0, TransferHandler_1.playerHeldContainers)(player, [conType]), (0, TransferHandler_1.validNearby)(player));
        },
        isUsable: (player, { item, itemType }) => TransferHandler_1.default.canFitAny((0, TransferHandler_1.playerHeldContainers)(player, item ? [item.type] : itemType ? [itemType] : []), (0, TransferHandler_1.validNearby)(player), player),
        execute: (player, using, _context) => (0, Actions_1.executeStackAction)(player, [{ container: (0, TransferHandler_1.playerHeldContainers)(player, using.item ? [using.item.type] : using.itemType ? [using.itemType] : []) }], [{ tiles: true }, { doodads: true }], [])
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
        icon: IAction_1.ActionType.Drop,
        iconLocationOnItem: Item_1.ItemDetailIconLocation.TopLeft,
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
        isApplicable: (player, { item, itemType }) => {
            const type = (item?.type ?? itemType);
            return type ? (0, TransferHandler_1.playerHasType)(player, type) : false;
        },
        isUsable: (player, { item, itemType }) => {
            const type = (item?.type ?? itemType);
            return type ? TransferHandler_1.default.canFitAny([player.inventory], (0, TransferHandler_1.validNearby)(player), player, [{ type: type }]) : false;
        },
        execute: (player, using, _context) => (0, Actions_1.executeStackAction)(player, [{ self: true, recursive: true }], [{ tiles: true }, { doodads: true }], using.item?.type ? [using.item.type] : using.itemType ? [using.itemType] : [])
    })));
    exports.StackTypeHereNearby = new UsableActionRegistrar_1.UsableActionGenerator(reg => reg.add("StackTypeHereNearby", UsableAction_1.default
        .requiring({ item: { validate: (p, i) => (0, TransferHandler_1.playerHasItem)(p, i) } })
        .create({
        slottable: false,
        displayLevel: IAction_1.ActionDisplayLevel.Always,
        translate: (translator) => translator.name(StaticHelper_1.default.TLget("fromX").addArgs(StaticHelper_1.default.TLget("here"))),
        isApplicable: (player, { item }) => item ? (0, TransferHandler_1.playerHasItem)(player, item) : false,
        isUsable: (player, { item }) => TransferHandler_1.default.canFitAny([item.containedWithin], (0, TransferHandler_1.validNearby)(player), player, [{ type: item.type }]),
        execute: (player, { item }, _context) => (0, Actions_1.executeStackAction)(player, [{ container: item.containedWithin }], [{ tiles: true }, { doodads: true }], [item.type])
    })));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNhYmxlQWN0aW9uc1F1aWNrU3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9ucy9Vc2FibGVBY3Rpb25zUXVpY2tTdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBbUJBLE1BQU0sV0FBVyxHQUF3QixFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFFN0UsTUFBTSxXQUFXLEdBQXdCLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQztJQTRCaEUsUUFBQSx1QkFBdUIsR0FBRyxJQUFJLDZDQUFxQixDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBR25FLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBR2hDLDBCQUFrQixDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDeEMsMEJBQWtCLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4QywyQkFBbUIsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3pDLHlCQUFpQixDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdkMsOEJBQXNCLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNoRCxDQUFDLENBQUMsQ0FBQztJQUdILElBQWlCLFNBQVMsQ0E0RXpCO0lBNUVELFdBQWlCLFNBQVM7UUFFVCxpQkFBTyxHQUFHLElBQUksNkNBQXFCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLHVCQUF1QixFQUFFLHNCQUFZO2FBQ2hHLFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLFNBQVMs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
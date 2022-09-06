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
            translate: (translator) => translator.name(({ item, itemType }) => StaticHelper_1.default.TLget("onlyXType")
                .addArgs(item?.getName(false, 999, false, false, false, false)
                ?? (itemType ? Translation_1.default.nameOf(Dictionary_1.default.Item, itemType) : undefined))),
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
        isApplicable: (player) => inSubmenu ? TransferHandler_1.default.hasMatchType((0, TransferHandler_1.validNearby)(player), [player.inventory, ...(0, TransferHandler_1.playerHeldContainers)(player)]) : true,
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
        isApplicable: (player) => inSubmenu ? TransferHandler_1.default.hasMatchType([player.inventory], (0, TransferHandler_1.validNearby)(player)) : true,
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
            return inSubmenu ? true : TransferHandler_1.default.hasMatchType((0, TransferHandler_1.playerHeldContainers)(player, [conType]), (0, TransferHandler_1.validNearby)(player));
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
            return type ? TransferHandler_1.default.canFitAny([player.inventory], (0, TransferHandler_1.validNearby)(player), player, [type]) : false;
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
        isUsable: (player, { item }) => TransferHandler_1.default.canFitAny([item.containedWithin], (0, TransferHandler_1.validNearby)(player), player, [item.type]),
        execute: (player, { item }, _context) => (0, Actions_1.executeStackAction)(player, [{ container: item.containedWithin }], [{ tiles: true }, { doodads: true }], [item.type])
    })));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNhYmxlQWN0aW9uc1F1aWNrU3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9ucy9Vc2FibGVBY3Rpb25zUXVpY2tTdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBbUJBLE1BQU0sV0FBVyxHQUF3QixFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFFN0UsTUFBTSxXQUFXLEdBQXdCLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQztJQTRCaEUsUUFBQSx1QkFBdUIsR0FBRyxJQUFJLDZDQUFxQixDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBR25FLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBR2hDLDBCQUFrQixDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDeEMsMEJBQWtCLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4QywyQkFBbUIsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3pDLHlCQUFpQixDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdkMsOEJBQXNCLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNoRCxDQUFDLENBQUMsQ0FBQztJQVlILElBQWlCLFNBQVMsQ0FnRXpCO0lBaEVELFdBQWlCLFNBQVM7UUFFVCxpQkFBTyxHQUFHLElBQUksNkNBQXFCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLHVCQUF1QixFQUFFLHNCQUFZO2FBQ2hHLFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDO2FBQ3hDLE1BQU0sQ0FBQztZQUNKLFlBQVksRUFBRSw0QkFBa0IsQ0FBQyxNQUFNO1lBQ3ZDLFNBQVMsRUFBRSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN6RSxZQUFZLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSTtZQUN4QixRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7Z0JBRXhCLE9BQVEsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFpRCxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdEgsQ0FBQztZQUNELE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFO2dCQUVoQixTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFFL0IsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDcEMsQ0FBQztTQUNKLENBQUMsQ0FDTCxDQUFDLENBQUM7UUFHVSxhQUFHLEdBQUcsSUFBSSw2Q0FBcUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEVBQUUsc0JBQVk7YUFDM0YsU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUM7YUFDeEMsTUFBTSxDQUFDO1lBQ0osWUFBWSxFQUFFLDRCQUFrQixDQUFDLE1BQU07WUFDdkMsU0FBUyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLHNCQUFZLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzFFLFlBQVksRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUEsK0JBQWEsRUFBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO1lBQ3RGLFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFFeEIsT0FBUSwwQkFBa0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBaUQsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQy9ILENBQUM7WUFDRCxPQUFPLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFDaEIsMEJBQWtCLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDMUMsMEJBQWtCLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDMUMseUJBQWlCLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDekMsOEJBQXNCLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNsRCxDQUFDO1NBQ0osQ0FBQyxDQUNMLENBQUMsQ0FBQztRQUdVLGNBQUksR0FBRyxJQUFJLDZDQUFxQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxzQkFBWTthQUM3RixTQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUM7YUFDekIsTUFBTSxDQUFDO1lBQ0osWUFBWSxFQUFFLDRCQUFrQixDQUFDLE1BQU07WUFDdkMsU0FBUyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDLHNCQUFZLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQztpQkFDN0YsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUM7bUJBQ3ZELENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxxQkFBVyxDQUFDLE1BQU0sQ0FBQyxvQkFBVSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNuRixZQUFZLEVBQUUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7Z0JBQzVCLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUM7Z0JBQ2hELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBQSwrQkFBYSxFQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN2RCxDQUFDO1lBQ0QsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUV4QixPQUFRLDJCQUFtQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUF3SDtxQkFDckssUUFBUSxDQUFDLE1BQU0sRUFBRSxLQUFpSSxDQUFDLENBQUM7WUFDN0osQ0FBQztZQUNELE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFO2dCQUNoQiwyQkFBbUIsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUMzQywyQkFBbUIsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDekMsQ0FBQztTQUNKLENBQUMsQ0FDTCxDQUFDLENBQUM7SUFDUCxDQUFDLEVBaEVnQixTQUFTLEdBQVQsaUJBQVMsS0FBVCxpQkFBUyxRQWdFekI7SUFXWSxRQUFBLGtCQUFrQixHQUFHLElBQUksNkNBQXFCLENBQVksQ0FBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFLHNCQUFZO1NBQ2hJLFNBQVMsQ0FFTixTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFBLCtCQUFhLEVBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUMxRjtTQUNBLE1BQU0sQ0FBQztRQUNKLFNBQVMsRUFBRSxJQUFJO1FBQ2YsSUFBSSxFQUFFLG9CQUFVLENBQUMsSUFBSTtRQUNyQixrQkFBa0IsRUFBRSw2QkFBc0IsQ0FBQyxXQUFXO1FBQ3RELFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLHNCQUFZLENBQUMsV0FBVyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxTQUFTO1FBQy9FLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLDRCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsNEJBQWtCLENBQUMsS0FBSztRQUM5RSxTQUFTLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQzVDLE1BQU0sV0FBVyxHQUFHLHNCQUFZLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQzdGLE9BQU8sU0FBUztnQkFDWixDQUFDLENBQUMsV0FBVztnQkFDYixDQUFDLENBQUMsc0JBQVksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUNuQyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLENBQUMsMEJBQVcsQ0FBQyxTQUFTLENBQUMsRUFDL0QsV0FBVyxDQUFDLENBQUM7UUFDekIsQ0FBQyxDQUFDO1FBQ0YsWUFBWSxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLHlCQUFlLENBQUMsWUFBWSxDQUFDLElBQUEsNkJBQVcsRUFBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsR0FBRyxJQUFBLHNDQUFvQixFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTtRQUNuSixRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLHlCQUFlLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxHQUFHLElBQUEsc0NBQW9CLEVBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFBLDZCQUFXLEVBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxDQUFDO1FBQ2pJLE9BQU8sRUFBRSxpQkFBUztLQUNyQixDQUFDLENBQ0wsQ0FBQyxDQUFDO0lBRUksTUFBTSxTQUFTLEdBQUcsQ0FBQyxDQUFTLEVBQVcsRUFBRSxDQUFDLElBQUEsbUNBQXlCLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUE5SSxRQUFBLFNBQVMsYUFBcUk7SUFTOUksUUFBQSxrQkFBa0IsR0FBRyxJQUFJLDZDQUFxQixDQUFZLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxzQkFBWTtTQUNoSSxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBQSwrQkFBYSxFQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztTQUNsRyxNQUFNLENBQUM7UUFDSixTQUFTLEVBQUUsSUFBSTtRQUNmLElBQUksRUFBRSxvQkFBVSxDQUFDLElBQUk7UUFDckIsa0JBQWtCLEVBQUUsNkJBQXNCLENBQUMsV0FBVztRQUN0RCxRQUFRLEVBQUUsc0JBQVksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDO1FBQ3ZGLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLDRCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsNEJBQWtCLENBQUMsS0FBSztRQUM5RSxTQUFTLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQzVDLE1BQU0sV0FBVyxHQUFHLHNCQUFZLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQzdGLE9BQU8sU0FBUztnQkFDWixDQUFDLENBQUMsV0FBVztnQkFDYixDQUFDLENBQUMsc0JBQVksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUNuQyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLENBQUMsMEJBQVcsQ0FBQyxTQUFTLENBQUMsRUFDL0QsV0FBVyxDQUFDLENBQUM7UUFDekIsQ0FBQyxDQUFDO1FBQ0YsWUFBWSxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLHlCQUFlLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUEsNkJBQVcsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO1FBQ2xILFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMseUJBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBQSw2QkFBVyxFQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sQ0FBQztRQUNoRyxPQUFPLEVBQUUsZ0JBQVE7S0FDcEIsQ0FBQyxDQUNMLENBQUMsQ0FBQztJQUVJLE1BQU0sUUFBUSxHQUFHLENBQUMsQ0FBUyxFQUFXLEVBQUUsQ0FBQyxJQUFBLG1DQUF5QixFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQTVILFFBQUEsUUFBUSxZQUFvSDtJQVk1SCxRQUFBLGlCQUFpQixHQUFHLElBQUksNkNBQXFCLENBQVksQ0FBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLHNCQUFZO1NBQzlILFNBQVMsQ0FBQztRQUNQLElBQUksRUFBRTtZQUNGLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUEsaUNBQWUsRUFBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQzVDO0tBQ0osQ0FBQztTQUNELE1BQU0sQ0FBQztRQUNKLFNBQVMsRUFBRSxDQUFDLFNBQVM7UUFDckIsSUFBSSxFQUFFLG9CQUFVLENBQUMsSUFBSTtRQUNyQixrQkFBa0IsRUFBRSw2QkFBc0IsQ0FBQyxXQUFXO1FBQ3RELFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLDRCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsNEJBQWtCLENBQUMsS0FBSztRQUU5RSxTQUFTLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFO1lBQzlELE1BQU0sV0FBVyxHQUFHLHNCQUFZLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJO2dCQUN4RCxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7Z0JBQ3JCLENBQUMsQ0FBQyxRQUFRO29CQUNOLENBQUMsQ0FBQyxxQkFBVyxDQUFDLE1BQU0sQ0FBQyxvQkFBVSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQztvQkFDM0QsQ0FBQyxDQUFDLHNCQUFZLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDL0MsT0FBTyxTQUFTO2dCQUNaLENBQUMsQ0FBQyxXQUFXO2dCQUNiLENBQUMsQ0FBQyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQ25DLHNCQUFZLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQywwQkFBVyxDQUFDLFNBQVMsQ0FBQyxFQUMvRCxXQUFXLENBQUMsQ0FBQztRQUN6QixDQUFDLENBQUM7UUFDRixZQUFZLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFBLGlDQUFlLEVBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLO1FBQ2hGLFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyx5QkFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQWtCLENBQUMsRUFBRSxJQUFBLDZCQUFXLEVBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxDQUFDO1FBQzVHLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUEsNEJBQWtCLEVBQUMsQ0FBQyxFQUNuQyxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUEsc0NBQW9CLEVBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFrQixFQUFFLENBQUMsRUFDMUYsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUNwQyxFQUFFLENBQUM7S0FDVixDQUFDLENBQ0wsQ0FBQyxDQUFDO0lBYVUsUUFBQSxzQkFBc0IsR0FBRyxJQUFJLDZDQUFxQixDQUFZLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsRUFBRSxzQkFBWTtTQUN4SSxTQUFTLENBQUM7UUFDUCxJQUFJLEVBQUU7WUFDRixpQkFBaUIsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUEsaUNBQWUsRUFBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3BELFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUEsaUNBQWUsRUFBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQzVDO0tBQ0osQ0FBQztTQUNELE1BQU0sQ0FBQztRQUNKLFNBQVMsRUFBRSxJQUFJO1FBQ2YsSUFBSSxFQUFFLG9CQUFVLENBQUMsSUFBSTtRQUNyQixrQkFBa0IsRUFBRSw2QkFBc0IsQ0FBQyxXQUFXO1FBQ3RELFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLDRCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsNEJBQWtCLENBQUMsS0FBSztRQUM5RSxTQUFTLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFO1lBQzlELE1BQU0sV0FBVyxHQUFHLHNCQUFZLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSTtnQkFDM0YsQ0FBQyxDQUFDLHFCQUFXLENBQUMsTUFBTSxDQUFDLG9CQUFVLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQztnQkFDNUQsQ0FBQyxDQUFDLFFBQVE7b0JBQ04sQ0FBQyxDQUFDLHFCQUFXLENBQUMsTUFBTSxDQUFDLG9CQUFVLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDO29CQUMzRCxDQUFDLENBQUMsc0JBQVksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakQsT0FBTyxTQUFTO2dCQUNaLENBQUMsQ0FBQyxXQUFXO2dCQUNiLENBQUMsQ0FBQyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQ25DLHNCQUFZLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQywwQkFBVyxDQUFDLFNBQVMsQ0FBQyxFQUMvRCxXQUFXLENBQUMsQ0FBQztRQUN6QixDQUFDLENBQUM7UUFDRixZQUFZLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRTtZQUN6QyxJQUFJLE9BQWlCLENBQUM7WUFDdEIsSUFBRyxJQUFJLEVBQUU7Z0JBQ0wsSUFBRyxDQUFDLElBQUEsaUNBQWUsRUFBQyxNQUFNLEVBQUUsSUFBSSxDQUFDO29CQUFFLE9BQU8sS0FBSyxDQUFDO2dCQUNoRCxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQzthQUN2QjtpQkFBTSxJQUFHLFFBQVEsRUFBRTtnQkFDaEIsSUFBRyxDQUFDLElBQUEsK0JBQWEsRUFBQyxNQUFNLEVBQUUsUUFBUSxDQUFDO29CQUFFLE9BQU8sS0FBSyxDQUFDO2dCQUNsRCxPQUFPLEdBQUcsUUFBUSxDQUFDO2FBQ3RCOztnQkFBTSxPQUFPLEtBQUssQ0FBQztZQUNwQixPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyx5QkFBZSxDQUFDLFlBQVksQ0FBQyxJQUFBLHNDQUFvQixFQUFDLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsSUFBQSw2QkFBVyxFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDekgsQ0FBQztRQUNELFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUMseUJBQWUsQ0FBQyxTQUFTLENBQy9ELElBQUEsc0NBQW9CLEVBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQzdFLElBQUEsNkJBQVcsRUFBQyxNQUFNLENBQUMsRUFBRSxNQUFNLENBQUM7UUFDaEMsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLElBQUEsNEJBQWtCLEVBQUMsTUFBTSxFQUMzRCxDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUEsc0NBQW9CLEVBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDdEgsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUNwQyxFQUFFLENBQUM7S0FDVixDQUFDLENBQ0wsQ0FBQyxDQUFDO0lBYVUsUUFBQSxtQkFBbUIsR0FBRyxJQUFJLDZDQUFxQixDQUFZLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxzQkFBWTtTQUNsSSxTQUFTLENBQUM7UUFDUCxJQUFJLEVBQUU7WUFDRixpQkFBaUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJO1lBQzdCLFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLElBQUEsK0JBQWEsRUFBQyxNQUFNLEVBQUUsS0FBSyxDQUFDO1NBQzVEO0tBQ0osQ0FBQztTQUNELE1BQU0sQ0FBQztRQUNKLFNBQVMsRUFBRSxJQUFJO1FBQ2YsSUFBSSxFQUFFLG9CQUFVLENBQUMsSUFBSTtRQUNyQixrQkFBa0IsRUFBRSw2QkFBc0IsQ0FBQyxPQUFPO1FBQ2xELFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLDRCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsNEJBQWtCLENBQUMsS0FBSztRQUM5RSxTQUFTLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFO1lBQzlELE1BQU0sV0FBVyxHQUFHLHNCQUFZLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQzdGLE9BQU8sU0FBUztnQkFDWixDQUFDLENBQUMsV0FBVztnQkFDYixDQUFDLENBQUMsc0JBQVksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUk7b0JBQ3hDLENBQUMsQ0FBQyxxQkFBVyxDQUFDLE1BQU0sQ0FBQyxvQkFBVSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUM7b0JBQzVELENBQUMsQ0FBQyxRQUFRO3dCQUNOLENBQUMsQ0FBQyxxQkFBVyxDQUFDLE1BQU0sQ0FBQyxvQkFBVSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQzt3QkFDM0QsQ0FBQyxDQUFDLFNBQVMsRUFDZixXQUFXLENBQUMsQ0FBQztRQUN6QixDQUFDLENBQUM7UUFDRixZQUFZLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRTtZQUN6QyxNQUFNLElBQUksR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLElBQUksUUFBUSxDQUFDLENBQUM7WUFDdEMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUEsK0JBQWEsRUFBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUN0RCxDQUFDO1FBQ0QsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUU7WUFDckMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxJQUFJLFFBQVEsQ0FBQyxDQUFDO1lBQ3RDLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyx5QkFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxJQUFBLDZCQUFXLEVBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQzdHLENBQUM7UUFDRCxPQUFPLEVBQUUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsSUFBQSw0QkFBa0IsRUFBQyxNQUFNLEVBQzNELENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUNqQyxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQ3BDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7S0FDckYsQ0FBQyxDQUNMLENBQUMsQ0FBQztJQWNVLFFBQUEsbUJBQW1CLEdBQUcsSUFBSSw2Q0FBcUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsc0JBQVk7U0FDMUcsU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBQSwrQkFBYSxFQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7U0FDaEUsTUFBTSxDQUFDO1FBQ0osU0FBUyxFQUFFLEtBQUs7UUFDaEIsWUFBWSxFQUFFLDRCQUFrQixDQUFDLE1BQU07UUFDdkMsU0FBUyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLHNCQUFZLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzNHLFlBQVksRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUEsK0JBQWEsRUFBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUs7UUFDOUUsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLHlCQUFlLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWdCLENBQUMsRUFBRSxJQUFBLDZCQUFXLEVBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVILE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsSUFBQSw0QkFBa0IsRUFBQyxNQUFNLEVBQzlELENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLGVBQWdCLEVBQUUsQ0FBQyxFQUN0QyxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQ3BDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBRW5CLENBQUMsQ0FDTCxDQUFDLENBQUMifQ==
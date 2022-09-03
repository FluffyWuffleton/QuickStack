define(["require", "exports", "game/entity/action/usable/UsableAction", "../StaticHelper", "./Actions", "game/entity/action/IAction", "game/entity/action/usable/UsableActionRegistrar", "language/Translation", "../TransferHandler", "language/Dictionary", "language/ITranslation"], function (require, exports, UsableAction_1, StaticHelper_1, Actions_1, IAction_1, UsableActionRegistrar_1, Translation_1, TransferHandler_1, Dictionary_1, ITranslation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StackTypeHereNearby = exports.StackTypeSelfNearby = exports.StackAllAlikeSubNearby = exports.StackAllSubNearby = exports.StackAllMainNearby = exports.StackAllSelfNearby = exports.QSSubmenu = exports.UsableActionsQuickStack = void 0;
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
            translate: (translator) => translator.name(Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE.messageDeposit)),
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
                StaticHelper_1.default.QS_LOG.info('TopSubmenu');
            }
        })));
        QSSubmenu.All = new UsableActionRegistrar_1.UsableActionGenerator(reg => reg.add("QuickStackAllSubmenu", UsableAction_1.default
            .requiring({ item: { allowNone: true } })
            .create({
            displayLevel: IAction_1.ActionDisplayLevel.Always,
            translate: (translator) => translator.name(({ item, itemType }) => Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE.messageQuickStackAll)),
            isApplicable: () => true,
            isUsable: () => true,
            submenu: (subreg) => {
                StaticHelper_1.default.QS_LOG.info('AllSubmenu');
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
            translate: (translator) => translator.name(({ item, itemType }) => Translation_1.default
                .message(StaticHelper_1.default.QS_INSTANCE.messageQuickStackType)
                .addArgs(item?.getName(false, 999, false, false, false, false) ?? ((!!itemType ? Translation_1.default.nameOf(Dictionary_1.default.Item, itemType) : undefined)))),
            isApplicable: (player, using) => {
                const type = using.item?.type ?? using.itemType;
                return !type ? false : (0, TransferHandler_1.playerHasType)(player, type);
            },
            isUsable: (player, using) => {
                const type = using.item?.type ?? using.itemType;
                return !type ? false : (0, TransferHandler_1.playerHasType)(player, type);
            },
            submenu: (subreg) => {
                StaticHelper_1.default.QS_LOG.info('TypeSubmenu');
                exports.StackTypeSelfNearby.register(subreg, true);
                exports.StackTypeHereNearby.register(subreg);
            }
        })));
    })(QSSubmenu = exports.QSSubmenu || (exports.QSSubmenu = {}));
    exports.StackAllSelfNearby = new UsableActionRegistrar_1.UsableActionGenerator((reg, inSubmenu) => reg.add("StackAllSelfNearby", UsableAction_1.default
        .requiring(inSubmenu ? { item: { allowNone: true, validate: (p, i) => (0, TransferHandler_1.playerHasItem)(p, i) } } : {})
        .create({
        slottable: true,
        bindable: StaticHelper_1.default.QS_INSTANCE.bindableStackAllSelfNearby,
        displayLevel: inSubmenu ? IAction_1.ActionDisplayLevel.Always : IAction_1.ActionDisplayLevel.Never,
        translate: (translator) => translator.name(() => {
            const fromSegment = Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE.messageFrom).addArgs(Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE.messageSelf));
            return inSubmenu
                ? fromSegment
                : Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE.messageDeposit)
                    .addArgs(Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE.messageQuickStackAll).inContext(ITranslation_1.TextContext.Lowercase), fromSegment);
        }),
        isApplicable: () => true,
        isUsable: (player) => TransferHandler_1.default.hasMatchType(player.island.items.getAdjacentContainers(player, false), [player.inventory, ...(0, TransferHandler_1.playerHeldContainers)(player)]),
        execute: (player) => (0, Actions_1.executeStackAction)(player, [{ self: true, recursive: true }], [{ tiles: true }, { doodads: true }], [])
    })));
    exports.StackAllMainNearby = new UsableActionRegistrar_1.UsableActionGenerator((reg, inSubmenu) => reg.add("StackAllMainNearby", UsableAction_1.default
        .requiring(inSubmenu ? { item: { allowNone: true, validate: (p, i) => (0, TransferHandler_1.playerHasItem)(p, i) } } : {})
        .create({
        slottable: true,
        bindable: StaticHelper_1.default.QS_INSTANCE.bindableStackAllMainNearby,
        displayLevel: inSubmenu ? IAction_1.ActionDisplayLevel.Always : IAction_1.ActionDisplayLevel.Never,
        translate: (translator) => translator.name(() => {
            const fromSegment = Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE.messageFrom).addArgs(Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE.messageMain));
            return inSubmenu
                ? fromSegment
                : Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE.messageDeposit)
                    .addArgs(Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE.messageQuickStackAll).inContext(ITranslation_1.TextContext.Lowercase), fromSegment);
        }),
        isApplicable: () => true,
        isUsable: (player) => TransferHandler_1.default.hasMatchType(player.island.items.getAdjacentContainers(player, false), [player.inventory]),
        execute: (player) => (0, Actions_1.executeStackAction)(player, [{ self: true }], [{ tiles: true }, { doodads: true }], [])
    })));
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
        bindable: (using) => inSubmenu ? StaticHelper_1.default.QS_INSTANCE.bindableStackAllSubNearby : undefined,
        translate: (translator) => translator.name(({ item, itemType }) => {
            const fromSegment = Translation_1.default
                .message(StaticHelper_1.default.QS_INSTANCE.messageFrom).addArgs(item
                ? item.getName(false)
                : itemType
                    ? Translation_1.default.nameOf(Dictionary_1.default.Item, itemType, 999, false)
                    : Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE.messageSub));
            return inSubmenu
                ? fromSegment
                : Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE.messageDeposit)
                    .addArgs(Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE.messageQuickStackAll).inContext(ITranslation_1.TextContext.Lowercase), fromSegment);
        }),
        isApplicable: (player, using) => using.item
            ? (0, TransferHandler_1.isHeldContainer)(player, using.item)
            : using.itemType
                ? (0, TransferHandler_1.playerHasType)(player, using.itemType) && (0, TransferHandler_1.isContainerType)(player, using.itemType)
                : false,
        isUsable: (player, using) => TransferHandler_1.default.hasMatchType(player.island.items.getAdjacentContainers(player, false), using.itemType ? (0, TransferHandler_1.playerHeldContainers)(player, [using.itemType]) : [using.item]),
        execute: (player, using, _context) => (0, Actions_1.executeStackAction)(player, [{ container: using.itemType ? (0, TransferHandler_1.playerHeldContainers)(player, [using.itemType]) : using.item }], [{ tiles: true }, { doodads: true }], [])
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
            const fromSegment = Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE.messageFrom)
                .addArgs(Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE.messageAllX)
                .addArgs(item ? Translation_1.default.nameOf(Dictionary_1.default.Item, item.type, 999, false)
                : itemType ? Translation_1.default.nameOf(Dictionary_1.default.Item, itemType, 999, false)
                    : Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE.messageAlike)));
            return inSubmenu
                ? fromSegment
                : Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE.messageDeposit)
                    .addArgs(Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE.messageQuickStackAll).inContext(ITranslation_1.TextContext.Lowercase), fromSegment);
        }),
        isApplicable: (player, using) => using.item ? (0, TransferHandler_1.isHeldContainer)(player, using.item) : using.itemType ? (0, TransferHandler_1.playerHasType)(player, using.itemType) : false,
        isUsable: (player, using) => TransferHandler_1.default.hasMatchType(player.island.items.getAdjacentContainers(player, false), using.itemType ? (0, TransferHandler_1.playerHeldContainers)(player, [using.itemType]) : [using.item]),
        execute: (player, using, _context) => (0, Actions_1.executeStackAction)(player, [{ container: using.item ? using.item : (0, TransferHandler_1.playerHeldContainers)(player, [using.itemType]) }], [{ tiles: true }, { doodads: true }], [])
    })));
    exports.StackTypeSelfNearby = new UsableActionRegistrar_1.UsableActionGenerator((reg, inSubmenu) => reg.add("StackTypeSelfNearby", UsableAction_1.default
        .requiring({
        item: {
            allowOnlyItemType: () => true,
            validate: (player, value) => { const v = (0, TransferHandler_1.playerHasItem)(player, value); StaticHelper_1.default.QS_LOG.info(`STSN VALIDATE: ${v}`); return v; }
        }
    })
        .create({
        slottable: true,
        displayLevel: inSubmenu ? IAction_1.ActionDisplayLevel.Always : IAction_1.ActionDisplayLevel.Never,
        translate: (translator) => translator.name(({ item, itemType }) => {
            const fromSegment = Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE.messageFrom)
                .addArgs(Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE.messageSelf));
            return inSubmenu
                ? fromSegment
                : Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE.messageDeposit)
                    .addArgs(item
                    ? Translation_1.default.nameOf(Dictionary_1.default.Item, item.type, 999, false)
                    : itemType ? Translation_1.default.nameOf(Dictionary_1.default.Item, itemType, 999, false)
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
        execute: (player, using, _context) => (0, Actions_1.executeStackAction)(player, [{ self: true, recursive: true }], [{ tiles: true }, { doodads: true }], [using.item?.type ?? using.itemType])
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
        translate: (translator) => translator.name(({ item, itemType }) => Translation_1.default
            .message(StaticHelper_1.default.QS_INSTANCE.messageFrom)
            .addArgs(Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE.messageHere))),
        isApplicable: (player, { item }) => item ? (0, TransferHandler_1.playerHasItem)(player, item) : false,
        isUsable: (player, { item }) => TransferHandler_1.default.hasType(player.island.items.getAdjacentContainers(player, false), item.type),
        execute: (player, { item }, _context) => (0, Actions_1.executeStackAction)(player, [{ container: item.containedWithin }], [{ tiles: true }, { doodads: true }], [item.type])
    })));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNhYmxlQWN0aW9uc1F1aWNrU3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9ucy9Vc2FibGVBY3Rpb25zUXVpY2tTdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBZWEsUUFBQSx1QkFBdUIsR0FBRyxJQUFJLDZDQUFxQixDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBR25FLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBR2hDLDBCQUFrQixDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDeEMsMEJBQWtCLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4Qyx5QkFBaUIsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3ZDLDJCQUFtQixDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDekMsOEJBQXNCLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBQyxLQUFLLENBQUMsQ0FBQztJQUkvQyxDQUFDLENBQUMsQ0FBQztJQUVILElBQWlCLFNBQVMsQ0FzRXpCO0lBdEVELFdBQWlCLFNBQVM7UUFFVCxpQkFBTyxHQUFHLElBQUksNkNBQXFCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLHVCQUF1QixFQUFFLHNCQUFZO2FBQ2hHLFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDO2FBQ3hDLE1BQU0sQ0FBQztZQUNKLFlBQVksRUFBRSw0QkFBa0IsQ0FBQyxNQUFNO1lBQ3ZDLFNBQVMsRUFBRSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxxQkFBVyxDQUFDLE9BQU8sQ0FBQyxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMs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
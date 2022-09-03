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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNhYmxlQWN0aW9uc1F1aWNrU3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9ucy9Vc2FibGVBY3Rpb25zUXVpY2tTdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBZWEsUUFBQSx1QkFBdUIsR0FBRyxJQUFJLDZDQUFxQixDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBR25FLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBR2hDLDBCQUFrQixDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDeEMsMEJBQWtCLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4Qyx5QkFBaUIsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3ZDLDJCQUFtQixDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDekMsOEJBQXNCLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUloRCxDQUFDLENBQUMsQ0FBQztJQUVILElBQWlCLFNBQVMsQ0FzRXpCO0lBdEVELFdBQWlCLFNBQVM7UUFFVCxpQkFBTyxHQUFHLElBQUksNkNBQXFCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLHVCQUF1QixFQUFFLHNCQUFZO2FBQ2hHLFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDO2FBQ3hDLE1BQU0sQ0FBQztZQUNKLFlBQVksRUFBRSw0QkFBa0IsQ0FBQyxNQUFNO1lBQ3ZDLFNBQVMsRUFBRSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxxQkFBVyxDQUFDLE9BQU8sQ0FBQyxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMs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
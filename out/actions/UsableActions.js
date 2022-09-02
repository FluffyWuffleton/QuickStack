define(["require", "exports", "game/entity/action/usable/UsableAction", "./../StaticHelper", "./Actions", "game/entity/action/IAction", "game/entity/action/usable/UsableActionRegistrar", "language/Translation", "./../TransferHandler", "language/Dictionary"], function (require, exports, UsableAction_1, StaticHelper_1, Actions_1, IAction_1, UsableActionRegistrar_1, Translation_1, TransferHandler_1, Dictionary_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.QSUsableActions = void 0;
    var QSUsableActions;
    (function (QSUsableActions) {
        QSUsableActions.MainSubmenu = new UsableActionRegistrar_1.UsableActionGenerator(reg => reg.add("QuickStackMainSubmenu", UsableAction_1.default
            .requiring({ item: { allowNone: true } })
            .create({
            displayLevel: IAction_1.ActionDisplayLevel.Always,
            translate: (translator) => translator.name(Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE.messageQuickStack)),
            isApplicable: () => true,
            isUsable: () => true,
            submenu: (subreg) => {
                StaticHelper_1.default.QS_LOG.info('MainSubmenu');
                QSUsableActions.AllSubmenu.register(subreg);
                QSUsableActions.TypeSubmenu.register(subreg);
            }
        })));
        QSUsableActions.AllSubmenu = new UsableActionRegistrar_1.UsableActionGenerator(reg => reg.add("QuickStackAllSubmenu", UsableAction_1.default
            .requiring({ item: { allowNone: true } })
            .create({
            displayLevel: IAction_1.ActionDisplayLevel.Always,
            translate: (translator) => translator.name(({ item, itemType }) => Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE.messageQuickStackAll)),
            isApplicable: () => true,
            isUsable: () => true,
            submenu: (subreg) => {
                StaticHelper_1.default.QS_LOG.info('AllSubmenu');
                QSUsableActions.StackAllSelfNearby.register(subreg);
                QSUsableActions.StackAllMainNearby.register(subreg);
                QSUsableActions.StackAllSubNearby.register(subreg);
            }
        })));
        QSUsableActions.TypeSubmenu = new UsableActionRegistrar_1.UsableActionGenerator(reg => reg.add("QuickStackTypeSubmenu", UsableAction_1.default
            .requiring({ item: true })
            .create({
            displayLevel: IAction_1.ActionDisplayLevel.Always,
            translate: (translator) => translator.name(({ item, itemType }) => Translation_1.default
                .message(StaticHelper_1.default.QS_INSTANCE.messageQuickStackType)
                .addArgs(item?.getName(false, 1, false, false, false, false) ?? ((!!itemType ? Translation_1.default.nameOf(Dictionary_1.default.Item, itemType) : undefined)))),
            isApplicable: (player, using) => {
                const type = (using.item?.type ?? using.itemType);
                return !type ? false : TransferHandler_1.default.hasType([player.inventory, ...(0, TransferHandler_1.playerHeldContainers)(player)], type);
            },
            isUsable: (player, using) => {
                const type = (using.item?.type ?? using.itemType);
                return !type ? false : TransferHandler_1.default.hasType(player.island.items.getAdjacentContainers(player, false), type);
            },
            submenu: (subreg) => {
                StaticHelper_1.default.QS_LOG.info('TypeSubmenu');
                QSUsableActions.StackTypeSelfNearby.register(subreg);
                QSUsableActions.StackTypeHereNearby.register(subreg);
            }
        })));
        QSUsableActions.StackAllSelfNearby = new UsableActionRegistrar_1.UsableActionGenerator(reg => reg.add("StackAllSelfNearby", UsableAction_1.default
            .requiring({ item: { allowNone: true } })
            .create({
            slottable: true,
            bindable: StaticHelper_1.default.QS_INSTANCE.bindableStackAllSelfNearby,
            displayLevel: IAction_1.ActionDisplayLevel.Always,
            translate: (translator) => translator.name(Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE.messageAllSelfNearby)),
            isApplicable: () => true,
            isUsable: (player) => TransferHandler_1.default.hasMatchType(player.island.items.getAdjacentContainers(player, false), [player.inventory, ...(0, TransferHandler_1.playerHeldContainers)(player)]),
            execute: (player) => (0, Actions_1.executeStackAction)(player, [{ self: true, recursive: true }], [{ tiles: true }, { doodads: true }], [])
        })));
        QSUsableActions.StackAllMainNearby = new UsableActionRegistrar_1.UsableActionGenerator(reg => reg.add("StackAllMainNearby", UsableAction_1.default
            .create({
            slottable: true,
            displayLevel: IAction_1.ActionDisplayLevel.Always,
            translate: (translator) => translator.name(Translation_1.default.message(StaticHelper_1.default.QS_INSTANCE.messageAllMainNearby)),
            isApplicable: () => true,
            isUsable: (player) => TransferHandler_1.default.hasMatchType(player.island.items.getAdjacentContainers(player, false), [player.inventory]),
            execute: (player) => (0, Actions_1.executeStackAction)(player, [{ self: true }], [{ tiles: true }, { doodads: true }], [])
        })));
        QSUsableActions.StackAllSubNearby = new UsableActionRegistrar_1.UsableActionGenerator(reg => reg.add("StackAllSubNearby", UsableAction_1.default
            .requiring({ item: { validate: (p, i) => (0, TransferHandler_1.isHeldContainer)(p, i) } })
            .create({
            slottable: true,
            displayLevel: IAction_1.ActionDisplayLevel.Always,
            translate: (translator) => translator.name(({ item }) => Translation_1.default
                .message(StaticHelper_1.default.QS_INSTANCE.messageAllSubNearby)
                .addArgs(item?.getName() ?? undefined)),
            isApplicable: (player, using) => using.item !== undefined ? (0, TransferHandler_1.isHeldContainer)(player, using.item) : false,
            isUsable: (player, using) => TransferHandler_1.default.hasMatchType(player.island.items.getAdjacentContainers(player, false), [using.item]),
            execute: (player, using, _context) => (0, Actions_1.executeStackAction)(player, [{ container: using.item }], [{ tiles: true }, { doodads: true }], [])
        })));
        QSUsableActions.StackTypeSelfNearby = new UsableActionRegistrar_1.UsableActionGenerator(reg => reg.add("StackTypeSelfNearby", UsableAction_1.default
            .requiring({ item: { allowOnlyItemType: () => true, validate: (player, value) => (0, TransferHandler_1.playerHasItem)(player, value) } })
            .create({
            translate: (translator) => translator.name(({ item, itemType }) => Translation_1.default
                .message(StaticHelper_1.default.QS_INSTANCE.messageTypeSelfNearby)
                .addArgs((item?.type ?? itemType) ? Translation_1.default.nameOf(Dictionary_1.default.Item, (item?.type ?? itemType)) : undefined)),
            slottable: true,
            displayLevel: IAction_1.ActionDisplayLevel.Always,
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
        QSUsableActions.StackTypeHereNearby = new UsableActionRegistrar_1.UsableActionGenerator(reg => reg.add("StackTypeHereNearby", UsableAction_1.default
            .requiring({ item: { validate: (player, value) => (0, TransferHandler_1.playerHasItem)(player, value) } })
            .create({
            translate: (translator) => translator.name(({ item }) => Translation_1.default
                .message(StaticHelper_1.default.QS_INSTANCE.messageTypeHereNearby)
                .addArgs(item?.getName())),
            slottable: false,
            displayLevel: IAction_1.ActionDisplayLevel.Always,
            isApplicable: (player, { item }) => item === undefined ? false : (0, TransferHandler_1.playerHasItem)(player, item)
                && TransferHandler_1.default.hasType([player.inventory, ...(0, TransferHandler_1.playerHeldContainers)(player)].filter(c => c === item.containedWithin), item.type),
            isUsable: (player, { item }) => TransferHandler_1.default.hasType(player.island.items.getAdjacentContainers(player, false), item.type),
            execute: (player, { item }, _context) => (0, Actions_1.executeStackAction)(player, [{ container: item.containedWithin }], [{ tiles: true }, { doodads: true }], [item.type])
        })));
    })(QSUsableActions = exports.QSUsableActions || (exports.QSUsableActions = {}));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNhYmxlQWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL1VzYWJsZUFjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQWNBLElBQWMsZUFBZSxDQTJNNUI7SUEzTUQsV0FBYyxlQUFlO1FBR1osMkJBQVcsR0FBRyxJQUFJLDZDQUFxQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxzQkFBWTthQUNwRyxTQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQzthQUN4QyxNQUFNLENBQUM7WUFDSixZQUFZLEVBQUUsNEJBQWtCLENBQUMsTUFBTTtZQUN2QyxTQUFTLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMscUJBQVcsQ0FBQyxPQUFPLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUMzRyxZQUFZLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSTtZQUN4QixRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSTtZQUNwQixPQUFPLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFDaEIsc0JBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUd4QyxlQUFlLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFHNUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDakQsQ0FBQztTQUNKLENBQUMsQ0FDTCxDQUFDLENBQUM7UUFHVSwwQkFBVSxHQUFHLElBQUksNkNBQXFCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLHNCQUFzQixFQUFFLHNCQUFZO2FBQ2xHLFNBQVMsQ0FB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
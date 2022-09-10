define(["require", "exports", "game/entity/action/usable/UsableAction", "../StaticHelper", "./Actions", "game/entity/action/IAction", "game/entity/action/usable/UsableActionRegistrar", "language/Translation", "../TransferHandler", "game/item/IItem", "language/Dictionary", "language/ITranslation", "ui/screen/screens/game/component/Item", "../StaticHelper", "game/item/ItemManager"], function (require, exports, UsableAction_1, StaticHelper_1, Actions_1, IAction_1, UsableActionRegistrar_1, Translation_1, TransferHandler_1, IItem_1, Dictionary_1, ITranslation_1, Item_1, StaticHelper_2, ItemManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StackTypeNearbyHere = exports.StackTypeSelfHere = exports.StackAllNearbyHere = exports.StackAllSelfHere = exports.StackAllNearbySub = exports.StackAllMainSub = exports.execSANM = exports.StackAllNearbyMain = exports.execSANSe = exports.StackAllNearbySelf = exports.StackTypeHereNearby = exports.StackTypeSelfNearby = exports.StackAllAlikeSubNearby = exports.StackAllSubNearby = exports.execSAMN = exports.StackAllMainNearby = exports.execSASeN = exports.StackAllSelfNearby = exports.QSSubmenu = exports.UsableActionsQuickStack = void 0;
    exports.UsableActionsQuickStack = new UsableActionRegistrar_1.UsableActionGenerator(reg => {
        QSSubmenu.Deposit.register(reg);
        QSSubmenu.Collect.register(reg);
        exports.StackAllSelfNearby.register(reg, true);
        exports.StackAllMainNearby.register(reg, true);
        exports.StackAllSubNearby.register(reg, true);
        exports.StackAllAlikeSubNearby.register(reg, true);
        exports.StackTypeSelfNearby.register(reg, true);
        exports.StackTypeHereNearby.register(reg, true);
        exports.StackAllNearbySelf.register(reg, true);
        exports.StackAllNearbyMain.register(reg, true);
        exports.StackAllMainSub.register(reg, true);
        exports.StackAllNearbySub.register(reg, true);
        exports.StackAllSelfHere.register(reg, true);
        exports.StackAllNearbyHere.register(reg, true);
        exports.StackTypeNearbyHere.register(reg, true);
        exports.StackTypeSelfHere.register(reg, true);
    });
    var QSSubmenu;
    (function (QSSubmenu) {
        QSSubmenu.Deposit = new UsableActionRegistrar_1.UsableActionGenerator(reg => reg.add("DepositMenu", UsableAction_1.default
            .requiring({ item: { allowNone: true, validate: () => true } })
            .create({
            displayLevel: IAction_1.ActionDisplayLevel.Always,
            translate: (translator) => translator.name(StaticHelper_1.default.TLget("deposit")),
            isApplicable: () => true,
            isUsable: (player, using) => {
                if (StaticHelper_2.GLOBALCONFIG.force_isusable)
                    return true;
                return using.item
                    ? QSSubmenu.DepositType.get().actions[0][1]
                        .isUsable(player, { creature: using.creature, doodad: using.doodad, npc: using.npc, item: using.item, itemType: using.itemType ?? using.item.type })
                    : QSSubmenu.DepositAll.get().actions[0][1]
                        .isUsable(player, { creature: using.creature, doodad: using.doodad, npc: using.npc, item: using.item, itemType: using.itemType });
            },
            submenu: (subreg) => {
                QSSubmenu.DepositAll.register(subreg);
                QSSubmenu.DepositType.register(subreg);
            }
        })));
        QSSubmenu.DepositAll = new UsableActionRegistrar_1.UsableActionGenerator(reg => reg.add("DepositAllSubmenu", UsableAction_1.default
            .requiring({ item: { allowNone: true, validate: () => true } })
            .create({
            displayLevel: IAction_1.ActionDisplayLevel.Always,
            bindable: StaticHelper_1.default.QS_INSTANCE.bindableAll,
            translate: (translator) => translator.name(StaticHelper_1.default.TLget("allTypes")),
            isUsable: (player, using) => {
                if (StaticHelper_2.GLOBALCONFIG.force_isusable)
                    return true;
                return using.item
                    ? exports.StackAllSubNearby.get().actions[0][1]
                        .isUsable(player, { creature: undefined, doodad: undefined, npc: undefined, item: using.item, itemType: using.itemType })
                    : using.itemType
                        ? exports.StackAllAlikeSubNearby.get().actions[0][1]
                            .isUsable(player, { creature: undefined, doodad: undefined, npc: undefined, item: using.item, itemType: using.itemType })
                        : exports.StackAllSelfNearby.get().actions[0][1]
                            .isUsable(player, { creature: undefined, doodad: undefined, npc: undefined, item: undefined, itemType: undefined });
            },
            submenu: (subreg) => {
                exports.StackAllSelfNearby.register(subreg);
                exports.StackAllMainNearby.register(subreg);
                exports.StackAllSubNearby.register(subreg);
                exports.StackAllAlikeSubNearby.register(subreg);
            }
        })));
        QSSubmenu.DepositType = new UsableActionRegistrar_1.UsableActionGenerator(reg => reg.add("DepositTypeSubmenu", UsableAction_1.default
            .requiring({ item: true })
            .create({
            displayLevel: IAction_1.ActionDisplayLevel.Always,
            bindable: StaticHelper_1.default.QS_INSTANCE.bindableType,
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
            isUsable: (player, using) => {
                if (StaticHelper_2.GLOBALCONFIG.force_isusable)
                    return true;
                return exports.StackTypeSelfNearby.get(true).actions[0][1]
                    .isUsable(player, { creature: undefined, doodad: undefined, npc: undefined, item: using.item, itemType: using.itemType ?? using.item.type });
            },
            submenu: (subreg) => {
                exports.StackTypeSelfNearby.register(subreg);
                exports.StackTypeHereNearby.register(subreg);
            },
        })));
        QSSubmenu.Collect = new UsableActionRegistrar_1.UsableActionGenerator(reg => reg.add("CollectMenu", UsableAction_1.default
            .requiring({ item: { allowNone: true } })
            .create({
            displayLevel: IAction_1.ActionDisplayLevel.Always,
            translate: (translator) => translator.name(StaticHelper_1.default.TLget("collect")),
            isApplicable: () => true,
            isUsable: (player, using) => {
                if (StaticHelper_2.GLOBALCONFIG.force_isusable)
                    return true;
                return QSSubmenu.CollectAll.get().actions[0][1].isUsable(player, using)
                    || QSSubmenu.CollectType.get().actions[0][1].isUsable(player, using);
            },
            submenu: (subreg) => {
                QSSubmenu.CollectAll.register(subreg);
                QSSubmenu.CollectType.register(subreg);
            }
        })));
        QSSubmenu.CollectAll = new UsableActionRegistrar_1.UsableActionGenerator(reg => reg.add("CollectAllSubmenu", UsableAction_1.default
            .requiring({ item: { allowNone: true } })
            .create({
            displayLevel: IAction_1.ActionDisplayLevel.Always,
            bindable: StaticHelper_1.default.QS_INSTANCE.bindableAll,
            translate: (translator) => translator.name(StaticHelper_1.default.TLget("allTypes")),
            isUsable: (player, using) => {
                if (StaticHelper_2.GLOBALCONFIG.force_isusable)
                    return true;
                return exports.StackAllNearbySelf.get(true).actions[0][1].isUsable(player, using);
            },
            submenu: (subreg) => {
                exports.StackAllNearbySelf.register(subreg);
                exports.StackAllNearbyMain.register(subreg);
                exports.StackAllMainSub.register(subreg);
                exports.StackAllNearbySub.register(subreg);
                exports.StackAllSelfHere.register(subreg);
                exports.StackAllNearbyHere.register(subreg);
            }
        })));
        QSSubmenu.CollectType = new UsableActionRegistrar_1.UsableActionGenerator(reg => reg.add("CollectTypeSubmenu", UsableAction_1.default
            .requiring({ item: true })
            .create({
            displayLevel: IAction_1.ActionDisplayLevel.Always,
            bindable: StaticHelper_1.default.QS_INSTANCE.bindableType,
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
            isApplicable: (player, using) => true,
            isUsable: (player, using) => {
                if (StaticHelper_2.GLOBALCONFIG.force_isusable)
                    return true;
                return exports.StackTypeNearbyHere.get().actions[0][1]
                    .isUsable(player, using);
            },
            submenu: (subreg) => {
                exports.StackTypeNearbyHere.register(subreg);
                exports.StackTypeSelfHere.register(subreg);
            }
        })));
    })(QSSubmenu = exports.QSSubmenu || (exports.QSSubmenu = {}));
    exports.StackAllSelfNearby = new UsableActionRegistrar_1.UsableActionGenerator((reg, isMainReg = false) => reg.add(StaticHelper_1.default.QS_INSTANCE.UAPAllSelfNearby, UsableAction_1.default
        .requiring({})
        .create({
        slottable: isMainReg,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableSelf,
        icon: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.UAPSelf,
        iconLocationOnItem: Item_1.ItemDetailIconLocation.BottomRight,
        translate: (translator) => translator.name(() => isMainReg
            ? StaticHelper_1.default.TLget("deposit").addArgs(StaticHelper_1.default.TLget("allTypes").inContext(ITranslation_1.TextContext.Lowercase), StaticHelper_1.default.TLget("fromX").addArgs(StaticHelper_1.default.TLget("fullInventory")))
            : StaticHelper_1.default.TLget("fromX").addArgs(StaticHelper_1.default.TLget("fullInventory"))),
        isUsable: (player) => {
            if (StaticHelper_2.GLOBALCONFIG.force_isusable)
                return true;
            return TransferHandler_1.default.canFitAny([player.inventory, ...(0, TransferHandler_1.playerHeldContainers)(player)], (0, TransferHandler_1.validNearby)(player), player);
        },
        execute: exports.execSASeN
    })));
    const execSASeN = (p) => (0, Actions_1.executeStackAction_notify)(p, [{ self: true, recursive: true }], [{ tiles: true }, { doodads: true }], []);
    exports.execSASeN = execSASeN;
    exports.StackAllMainNearby = new UsableActionRegistrar_1.UsableActionGenerator((reg, isMainReg = false) => reg.add(StaticHelper_1.default.QS_INSTANCE.UAPAllMainNearby, UsableAction_1.default
        .requiring({})
        .create({
        slottable: isMainReg,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableMain,
        icon: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.UAPMain,
        iconLocationOnItem: Item_1.ItemDetailIconLocation.BottomRight,
        translate: (translator) => translator.name(() => isMainReg
            ? StaticHelper_1.default.TLget("deposit").addArgs(StaticHelper_1.default.TLget("allTypes").inContext(ITranslation_1.TextContext.Lowercase), StaticHelper_1.default.TLget("fromX").addArgs(StaticHelper_1.default.TLget("mainInventory")))
            : StaticHelper_1.default.TLget("fromX").addArgs(StaticHelper_1.default.TLget("mainInventory"))),
        isUsable: (player) => {
            if (StaticHelper_2.GLOBALCONFIG.force_isusable)
                return true;
            return TransferHandler_1.default.canFitAny([player.inventory], (0, TransferHandler_1.validNearby)(player), player);
        },
        execute: exports.execSAMN
    })));
    const execSAMN = (p) => (0, Actions_1.executeStackAction_notify)(p, [{ self: true }], [{ tiles: true }, { doodads: true }], []);
    exports.execSAMN = execSAMN;
    exports.StackAllSubNearby = new UsableActionRegistrar_1.UsableActionGenerator((reg, isMainReg = false) => reg.add(StaticHelper_1.default.QS_INSTANCE.UAPAllSubNearby, UsableAction_1.default
        .requiring({
        item: { validate: (_, item) => (0, TransferHandler_1.isStorageType)(item.type) }
    })
        .create({
        slottable: isMainReg,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableSub,
        icon: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.UAPSub,
        iconLocationOnItem: Item_1.ItemDetailIconLocation.BottomRight,
        translate: (translator) => translator.name(({ item, itemType }) => {
            const itemStr = !!(item ?? itemType) ? Translation_1.default.nameOf(Dictionary_1.default.Item, (item?.type ?? itemType), 999, false) : StaticHelper_1.default.TLget("thisContainer");
            return isMainReg
                ? StaticHelper_1.default.TLget("deposit").addArgs(StaticHelper_1.default.TLget("allTypes").inContext(ITranslation_1.TextContext.Lowercase), StaticHelper_1.default.TLget("fromX").addArgs(itemStr))
                : StaticHelper_1.default.TLget("fromX").addArgs(itemStr);
        }),
        isUsable: (player, { item }) => {
            if (StaticHelper_2.GLOBALCONFIG.force_isusable)
                return true;
            return (0, TransferHandler_1.isHeldContainer)(player, item)
                && TransferHandler_1.default.canFitAny([item], (0, TransferHandler_1.validNearby)(player), player);
        },
        execute: (player, { item }) => (0, Actions_1.executeStackAction)(player, [{ container: [item] }], [{ tiles: true }, { doodads: true }], [])
    })));
    exports.StackAllAlikeSubNearby = new UsableActionRegistrar_1.UsableActionGenerator((reg, isMainReg = false) => reg.add(StaticHelper_1.default.QS_INSTANCE.UAPAllAlikeSubNearby, UsableAction_1.default
        .requiring({
        item: {
            allowOnlyItemType: (_, type) => (0, TransferHandler_1.isStorageType)(type),
            validate: (_, item) => (0, TransferHandler_1.isStorageType)(item.type)
        }
    })
        .create({
        slottable: true,
        iconLocationOnItem: Item_1.ItemDetailIconLocation.BottomRight,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableAlike,
        icon: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.UAPAlike,
        translate: (translator) => translator.name(({ item, itemType }) => {
            const itemStr = !!(item ?? itemType) ? Translation_1.default.nameOf(Dictionary_1.default.Item, (item?.type ?? itemType), 999, false) : StaticHelper_1.default.TLget("likeContainers");
            return isMainReg
                ? StaticHelper_1.default.TLget("deposit").addArgs(StaticHelper_1.default.TLget("allTypes").inContext(ITranslation_1.TextContext.Lowercase), StaticHelper_1.default.TLget("fromX").addArgs(StaticHelper_1.default.TLget("allX").addArgs(itemStr)))
                : StaticHelper_1.default.TLget("fromX").addArgs(StaticHelper_1.default.TLget("allX").addArgs(itemStr));
        }),
        isUsable: (player, { item, itemType }) => {
            if (StaticHelper_2.GLOBALCONFIG.force_isusable)
                return true;
            if (item && !(0, TransferHandler_1.isHeldContainer)(player, item))
                return false;
            if (itemType && !(0, TransferHandler_1.playerHasType)(player, itemType))
                return false;
            return TransferHandler_1.default.canFitAny((0, TransferHandler_1.playerHeldContainers)(player, [(item?.type ?? itemType)]), (0, TransferHandler_1.validNearby)(player), player);
        },
        execute: (player, { item, itemType }) => (0, Actions_1.executeStackAction)(player, [{ container: (0, TransferHandler_1.playerHeldContainers)(player, [(item?.type ?? itemType)]) }], [{ tiles: true }, { doodads: true }], [])
    })));
    exports.StackTypeSelfNearby = new UsableActionRegistrar_1.UsableActionGenerator((reg, isMainReg = false) => reg.add(StaticHelper_1.default.QS_INSTANCE.UAPTypeSelfNearby, UsableAction_1.default
        .requiring({
        item: { allowOnlyItemType: () => true }
    })
        .create({
        slottable: true,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableSelf,
        icon: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.UAPSelf,
        iconLocationOnItem: Item_1.ItemDetailIconLocation.TopLeft,
        translate: (translator) => translator.name(({ item, itemType }) => isMainReg
            ? StaticHelper_1.default.TLget("deposit").addArgs(StaticHelper_1.default.TLget("onlyXType")
                .inContext(ITranslation_1.TextContext.Lowercase)
                .addArgs(!!(item ?? itemType) ? Translation_1.default.nameOf(Dictionary_1.default.Item, (item?.type ?? itemType), 999, false) : undefined), StaticHelper_1.default.TLget("fromX").addArgs(StaticHelper_1.default.TLget("fullInventory")))
            : StaticHelper_1.default.TLget("fromX").addArgs(StaticHelper_1.default.TLget("fullInventory"))),
        isUsable: (player, { itemType }) => {
            if (StaticHelper_2.GLOBALCONFIG.force_isusable)
                return true;
            return (0, TransferHandler_1.playerHasType)(player, itemType)
                && TransferHandler_1.default.canFitAny([player.inventory, ...(0, TransferHandler_1.playerHeldContainers)(player)], (0, TransferHandler_1.validNearby)(player), player, [{ type: itemType }]);
        },
        execute: (player, { itemType }) => (0, Actions_1.executeStackAction)(player, [{ self: true, recursive: true }], [{ tiles: true }, { doodads: true }], [itemType])
    })));
    exports.StackTypeHereNearby = new UsableActionRegistrar_1.UsableActionGenerator((reg, isMainReg = false) => reg.add(StaticHelper_1.default.QS_INSTANCE.UAPTypeHereNearby, UsableAction_1.default
        .requiring({ item: true })
        .create({
        slottable: false,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableHere,
        icon: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.UAPHere,
        translate: (translator) => translator.name(({ item, itemType }) => isMainReg
            ? StaticHelper_1.default.TLget("deposit").addArgs(StaticHelper_1.default.TLget("onlyXType")
                .inContext(ITranslation_1.TextContext.Lowercase)
                .addArgs(!!(item ?? itemType) ? Translation_1.default.nameOf(Dictionary_1.default.Item, (item?.type ?? itemType), 999, false) : undefined), StaticHelper_1.default.TLget("fromX").addArgs(StaticHelper_1.default.TLget("here")))
            : StaticHelper_1.default.TLget("fromX").addArgs(StaticHelper_1.default.TLget("here"))),
        isUsable: (player, { item }) => {
            if (StaticHelper_2.GLOBALCONFIG.force_isusable)
                return true;
            if (isMainReg)
                return false;
            return (0, TransferHandler_1.playerHasItem)(player, item)
                && TransferHandler_1.default.canFitAny([item.containedWithin], (0, TransferHandler_1.validNearby)(player), player, [{ type: item.type }]);
        },
        execute: (player, { item }, _context) => (0, Actions_1.executeStackAction)(player, [{ container: item.containedWithin }], [{ tiles: true }, { doodads: true }], [item.type])
    })));
    exports.StackAllNearbySelf = new UsableActionRegistrar_1.UsableActionGenerator((reg, isMainReg = false) => reg.add(StaticHelper_1.default.QS_INSTANCE.UAPAllNearbySelf, UsableAction_1.default
        .requiring({})
        .create({
        slottable: isMainReg,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableSelf,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        icon: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.UAPSelf,
        iconLocationOnItem: Item_1.ItemDetailIconLocation.BottomRight,
        translate: (translator) => translator.name(() => isMainReg
            ? StaticHelper_1.default.TLget("collect").addArgs(StaticHelper_1.default.TLget("allTypes").inContext(ITranslation_1.TextContext.Lowercase), StaticHelper_1.default.TLFromTo("fullInventory", "nearby"))
            : StaticHelper_1.default.TLFromTo("fullInventory", "nearby")),
        isUsable: (player) => {
            if (StaticHelper_2.GLOBALCONFIG.force_isusable)
                return true;
            if (isMainReg)
                return false;
            return TransferHandler_1.default.hasMatch((0, TransferHandler_1.validNearby)(player), [player.inventory, ...(0, TransferHandler_1.playerHeldContainers)(player)]);
        },
        execute: exports.execSANSe
    })));
    const execSANSe = (p) => (0, Actions_1.executeStackAction_notify)(p, [{ tiles: true }, { doodads: true }], [{ self: true, recursive: true }], []);
    exports.execSANSe = execSANSe;
    exports.StackAllNearbyMain = new UsableActionRegistrar_1.UsableActionGenerator((reg, isMainReg = false) => reg.add(StaticHelper_1.default.QS_INSTANCE.UAPAllNearbyMain, UsableAction_1.default
        .requiring({})
        .create({
        slottable: isMainReg,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableMain,
        icon: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.UAPMain,
        iconLocationOnItem: Item_1.ItemDetailIconLocation.TopLeft,
        translate: (translator) => translator.name(() => isMainReg
            ? StaticHelper_1.default.TLget("collect").addArgs(StaticHelper_1.default.TLget("allTypes").inContext(ITranslation_1.TextContext.Lowercase), StaticHelper_1.default.TLFromTo("mainInventory", "nearby"))
            : StaticHelper_1.default.TLFromTo("mainInventory", "nearby")),
        isUsable: (player) => {
            if (StaticHelper_2.GLOBALCONFIG.force_isusable)
                return true;
            if (isMainReg)
                return false;
            return TransferHandler_1.default.hasMatch((0, TransferHandler_1.validNearby)(player), [player.inventory]);
        },
        execute: exports.execSANM
    })));
    const execSANM = (p) => (0, Actions_1.executeStackAction_notify)(p, [{ tiles: true }, { doodads: true }], [{ self: true }], []);
    exports.execSANM = execSANM;
    exports.StackAllMainSub = new UsableActionRegistrar_1.UsableActionGenerator((reg, isMainReg = false) => reg.add(StaticHelper_1.default.QS_INSTANCE.UAPAllMainSub, UsableAction_1.default
        .requiring({ item: { validate: (_, item) => ItemManager_1.default.isInGroup(item.type, IItem_1.ItemTypeGroup.Storage) } })
        .create({
        slottable: isMainReg,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableMain,
        icon: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.UAPMain,
        iconLocationOnItem: Item_1.ItemDetailIconLocation.TopLeft,
        translate: (translator) => translator.name(({ item, itemType }) => {
            const itemStr = item ? item.getName(false) : itemType ? Translation_1.default.nameOf(Dictionary_1.default.Item, itemType, 999, false) : StaticHelper_1.default.TLget("thisContainer");
            return isMainReg
                ? StaticHelper_1.default.TLget("collect").addArgs(StaticHelper_1.default.TLget("allTypes").inContext(ITranslation_1.TextContext.Lowercase), StaticHelper_1.default.TLFromTo(itemStr, "mainInventory"))
                : StaticHelper_1.default.TLFromTo(itemStr, "mainInventory");
        }),
        isUsable: (player, { item }) => {
            if (StaticHelper_2.GLOBALCONFIG.force_isusable)
                return true;
            if (isMainReg)
                return false;
            return TransferHandler_1.default.hasMatch([item], [player.inventory]);
        },
        execute: (p, u) => (0, Actions_1.executeStackAction)(p, [{ self: true }], [{ container: u.item }], [])
    })));
    exports.StackAllNearbySub = new UsableActionRegistrar_1.UsableActionGenerator((reg, isMainReg = false) => reg.add(StaticHelper_1.default.QS_INSTANCE.UAPAllNearbySub, UsableAction_1.default
        .requiring({ item: { validate: (_, item) => (0, TransferHandler_1.isStorageType)(item.type) } })
        .create({
        slottable: isMainReg,
        iconLocationOnItem: Item_1.ItemDetailIconLocation.TopLeft,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableNearby,
        icon: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.UAPNearby,
        translate: (translator) => translator.name(({ item, itemType }) => {
            const itemStr = item ? item.getName(false) : itemType ? Translation_1.default.nameOf(Dictionary_1.default.Item, itemType, 999, false) : StaticHelper_1.default.TLget("thisContainer");
            return isMainReg
                ? StaticHelper_1.default.TLget("collect").addArgs(StaticHelper_1.default.TLget("allTypes").inContext(ITranslation_1.TextContext.Lowercase), StaticHelper_1.default.TLFromTo(itemStr, "nearby"))
                : StaticHelper_1.default.TLFromTo(itemStr, "nearby");
        }),
        isUsable: (player, { item }) => {
            if (StaticHelper_2.GLOBALCONFIG.force_isusable)
                return true;
            if (isMainReg)
                return false;
            return (0, TransferHandler_1.isHeldContainer)(player, item)
                && TransferHandler_1.default.canFitAny((0, TransferHandler_1.validNearby)(player), [item], player);
        },
        execute: (p, u) => (0, Actions_1.executeStackAction)(p, [{ tiles: true }, { doodads: true }], [{ container: u.item }], [])
    })));
    exports.StackAllSelfHere = new UsableActionRegistrar_1.UsableActionGenerator((reg, isMainReg = false) => reg.add("StackAllSelfHere", UsableAction_1.default
        .requiring({ item: true })
        .create({
        slottable: false,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableSelf,
        icon: StaticHelper_1.default.QS_INSTANCE.UAPSelf,
        translate: (translator) => translator.name(() => isMainReg
            ? StaticHelper_1.default.TLget("collect").addArgs(StaticHelper_1.default.TLget("allTypes").inContext(ITranslation_1.TextContext.Lowercase), StaticHelper_1.default.TLFromTo("here", "fullInventory"))
            : StaticHelper_1.default.TLFromTo("here", "fullInventory")),
        isUsable: (player, { item }) => {
            if (StaticHelper_2.GLOBALCONFIG.force_isusable)
                return true;
            return player.island.items.getContainerReference(item?.containedWithin, undefined).crt === IItem_1.ContainerReferenceType.Doodad
                && TransferHandler_1.default.canFitAny([item.containedWithin], [player.inventory, ...(0, TransferHandler_1.playerHeldContainers)(player)], player, []);
        },
        execute: (player, { item }, _context) => (0, Actions_1.executeStackAction)(player, [{ self: true, recursive: true }], [{ container: item.containedWithin }], [])
    })));
    exports.StackAllNearbyHere = new UsableActionRegistrar_1.UsableActionGenerator((reg, isMainReg = false) => reg.add("StackAllNearbyHere", UsableAction_1.default
        .requiring({ item: true })
        .create({
        slottable: false,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableHere,
        icon: StaticHelper_1.default.QS_INSTANCE.UAPNearby,
        translate: (translator) => translator.name(() => isMainReg
            ? StaticHelper_1.default.TLget("collect").addArgs(StaticHelper_1.default.TLget("allTypes").inContext(ITranslation_1.TextContext.Lowercase), StaticHelper_1.default.TLFromTo("here", "nearby"))
            : StaticHelper_1.default.TLFromTo("here", "nearby")),
        isUsable: (player, { item }) => {
            if (StaticHelper_2.GLOBALCONFIG.force_isusable)
                return true;
            if (isMainReg)
                return false;
            return player.island.items.getContainerReference(item?.containedWithin, undefined).crt === IItem_1.ContainerReferenceType.Doodad
                && TransferHandler_1.default.canFitAny([item.containedWithin], (0, TransferHandler_1.validNearby)(player).filter(c => c !== item.containedWithin), player, []);
        },
        execute: (player, { item }, _context) => (0, Actions_1.executeStackAction)(player, [{ container: (0, TransferHandler_1.validNearby)(player).filter(c => c !== item.containedWithin) }], [{ container: item.containedWithin }], [])
    })));
    exports.StackTypeSelfHere = new UsableActionRegistrar_1.UsableActionGenerator((reg, isMainReg = false) => reg.add("StackTypeSelfHere", UsableAction_1.default
        .requiring({ item: true })
        .create({
        slottable: false,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableSelf,
        icon: StaticHelper_1.default.QS_INSTANCE.UAPSelf,
        translate: (translator) => translator.name(({ item, itemType }) => isMainReg
            ? StaticHelper_1.default.TLget("collect").addArgs(StaticHelper_1.default.TLget("onlyXType")
                .inContext(ITranslation_1.TextContext.Lowercase)
                .addArgs(!!(item ?? itemType) ? Translation_1.default.nameOf(Dictionary_1.default.Item, (item?.type ?? itemType), 999, false) : undefined), StaticHelper_1.default.TLFromTo("here", "fullInventory"))
            : StaticHelper_1.default.TLFromTo("here", "fullInventory")),
        isUsable: (player, { item }) => {
            if (StaticHelper_2.GLOBALCONFIG.force_isusable)
                return true;
            if (isMainReg)
                return false;
            if (player.island.items.getContainerReference(item.containedWithin, undefined).crt === IItem_1.ContainerReferenceType.PlayerInventory)
                return TransferHandler_1.default.hasMatch((0, TransferHandler_1.playerHeldContainers)(player), [item.containedWithin], [{ type: item.type }]);
            else
                return TransferHandler_1.default.canFitAny([player.inventory, ...(0, TransferHandler_1.playerHeldContainers)(player)].filter(c => c !== item.containedWithin), [item.containedWithin], player, [{ type: item.type }]);
        },
        execute: (player, { item }, _context) => (0, Actions_1.executeStackAction)(player, (0, TransferHandler_1.playerHasItem)(player, item)
            ? [{ container: [player.inventory, ...(0, TransferHandler_1.playerHeldContainers)(player)].filter(c => c !== item.containedWithin) }]
            : [{ self: true, recursive: true }], [{ container: item.containedWithin }], [item.type])
    })));
    exports.StackTypeNearbyHere = new UsableActionRegistrar_1.UsableActionGenerator((reg, isMainReg = false) => reg.add("StackTypeNearbyHere", UsableAction_1.default
        .requiring({ item: true })
        .create({
        slottable: false,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableNearby,
        icon: StaticHelper_1.default.QS_INSTANCE.UAPNearby,
        translate: (translator) => translator.name(({ item, itemType }) => isMainReg
            ? StaticHelper_1.default.TLget("collect").addArgs(StaticHelper_1.default.TLget("onlyXType")
                .inContext(ITranslation_1.TextContext.Lowercase)
                .addArgs(!!(item ?? itemType) ? Translation_1.default.nameOf(Dictionary_1.default.Item, (item?.type ?? itemType), 999, false) : undefined), StaticHelper_1.default.TLFromTo("here", "nearby"))
            : StaticHelper_1.default.TLFromTo("here", "nearby")),
        isUsable: (player, { item }) => {
            if (StaticHelper_2.GLOBALCONFIG.force_isusable)
                return true;
            if (isMainReg)
                return false;
            if (player.island.items.getContainerReference(item.containedWithin, undefined).crt === IItem_1.ContainerReferenceType.PlayerInventory)
                return TransferHandler_1.default.hasMatch((0, TransferHandler_1.validNearby)(player), [item.containedWithin], [{ type: item.type }]);
            else
                return TransferHandler_1.default.canFitAny((0, TransferHandler_1.validNearby)(player).filter(c => c !== item.containedWithin), [item.containedWithin], player, [{ type: item.type }]);
        },
        execute: (player, { item }, _context) => (0, Actions_1.executeStackAction)(player, (0, TransferHandler_1.playerHasItem)(player, item)
            ? [{ doodads: true }, { tiles: true }]
            : [{ container: (0, TransferHandler_1.validNearby)(player).filter(c => c !== item.containedWithin) }], [{ container: item.containedWithin }], [item.type])
    })));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNhYmxlQWN0aW9uc1F1aWNrU3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9ucy9Vc2FibGVBY3Rpb25zUXVpY2tTdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBNkNhLFFBQUEsdUJBQXVCLEdBQUcsSUFBSSw2Q0FBcUIsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUVuRSxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoQyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVoQywwQkFBa0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLDBCQUFrQixDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkMseUJBQWlCLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0Qyw4QkFBc0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzNDLDJCQUFtQixDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsMkJBQW1CLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4QywwQkFBa0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLDBCQUFrQixDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkMsdUJBQWUsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3BDLHlCQUFpQixDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdEMsd0JBQWdCLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNyQywwQkFBa0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLDJCQUFtQixDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMseUJBQWlCLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUUxQyxDQUFDLENBQUMsQ0FBQztJQUdILElBQWlCLFNBQVMsQ0F3THpCO0lBeExELFdBQWlCLFNBQVM7UUFXVCxpQkFBTyxHQUFHLElBQUksNkNBQXFCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBK0Msc0JBQVk7YUFDbkksU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQzthQUM5RCxNQUFNLENBQUM7WUFDSixZQUFZLEVBQUUsNEJBQWtCLENBQUMsTUFBTTtZQUN2QyxTQUFTLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsc0JBQVksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDekUsWUFBWSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUk7WUFDeEIsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUN4QixJQUFHLDJCQUFZLENBQUMsY0FBYztvQkFBRSxPQUFPLElBQUksQ0FBQztnQkFDNUMsT0FBTyxLQUFLLENBQUMsSUFBSTtvQkFDYixDQUFDLENBQUUsU0FBUyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUE2Qzt5QkFDbkYsUUFBUSxDQUFDLE1BQU0sRUFBRSxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ3hKLENBQUMsQ0FBRSxTQUFTLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQWtGO3lCQUN2SCxRQUFRLENBQUMsTUFBTSxFQUFFLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1lBQzdJLENBQUM7WUFDRCxPQUFPLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFFaEIsU0FBUyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBRXRDLFNBQVMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzNDLENBQUM7U0FDSixDQUFDLENBQ0wsQ0FBQyxDQUFDO1FBR1Usb0JBQVUsR0FBRyxJQUFJLDZDQUFxQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxzQkFBWTthQUMvRixTQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDO2FBQzlELE1BQU0sQ0FBQztZQUNKLFlBQVksRUFBRSw0QkFBa0IsQ0FBQyxNQUFNO1lBQ3ZDLFFBQVEsRUFBRSxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxXQUFXO1lBQzlDLFNBQVMsRUFBRSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMxRSxRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7Z0JBQ3hCLElBQUcsMkJBQVksQ0FBQyxjQUFjO29CQUFFLE9BQU8sSUFBSSxDQUFDO2dCQUM1QyxPQUFPLEtBQUssQ0FBQyxJQUFJO29CQUNiLENBQUMsQ0FBRSx5QkFBaUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFvRTt5QkFDdEcsUUFBUSxDQUFDLE1BQU0sRUFBRSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQzdILENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUTt3QkFDWixDQUFDLENBQUUsOEJBQXNCLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBc0c7NkJBQzdJLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO3dCQUM3SCxDQUFDLENBQUUsMEJBQWtCLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBc0I7NkJBQ3pELFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDO1lBQ3BJLENBQUM7WUFDRCxPQUFPLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFDaEIsMEJBQWtCLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNwQywwQkFBa0IsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3BDLHlCQUFpQixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbkMsOEJBQXNCLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzVDLENBQUM7U0FDSixDQUFDLENBQ0wsQ0FBQyxDQUFDO1FBR1UscUJBQVcsR0FBRyxJQUFJLDZDQUFxQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxzQkFBWTthQUNqRyxTQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUM7YUFDekIsTUFBTSxDQUFDO1lBQ0osWUFBWSxFQUFFLDRCQUFrQixDQUFDLE1BQU07WUFDdkMsUUFBUSxFQUFFLHNCQUFZLENBQUMsV0FBVyxDQUFDLFlBQVk7WUFDL0MsU0FBUyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRTtnQkFDOUQsTUFBTSxHQUFHLEdBQUcseUJBQWUsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksSUFBSSxRQUFRLElBQUkscUJBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDNUYsT0FBTyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FDM0MsQ0FBQyxHQUFHLEtBQUssU0FBUztvQkFDZCxDQUFDLENBQUM7d0JBQ0Usc0JBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLHNCQUFZLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7d0JBQ3JFLHNCQUFZLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxxQkFBVyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztxQkFDbEYsQ0FBQyxDQUFDLENBQUM7b0JBQ0EsSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQzsyQkFDbEQsQ0FBQyxRQUFROzRCQUNSLENBQUMsQ0FBQyxxQkFBVyxDQUFDLE1BQU0sQ0FBQyxvQkFBVSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDOzRCQUN0RCxDQUFDLENBQUMsU0FBUyxDQUFDO2lCQUNuQixDQUFDLENBQ1QsQ0FBQztZQUNOLENBQUMsQ0FBQztZQUNGLFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDeEIsSUFBRywyQkFBWSxDQUFDLGNBQWM7b0JBQUUsT0FBTyxJQUFJLENBQUM7Z0JBQzVDLE9BQVEsMkJBQW1CLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQXNHO3FCQUNuSixRQUFRLENBQUMsTUFBTSxFQUFFLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ3JKLENBQUM7WUFDRCxPQUFPLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFDaEIsMkJBQW1CLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNyQywyQkFBbUIsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDekMsQ0FBQztTQUNKLENBQUMsQ0FDTCxDQUFDLENBQUM7UUFlVSxpQkFBTyxHQUFHLElBQUksNkNBQXFCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBK0Msc0JBQVk7YUFDbkksU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUM7YUFDeEMsTUFBTSxDQUFDO1lBQ0osWUFBWSxFQUFFLDRCQUFrQixDQUFDLE1BQU07WUFDdkMsU0FBUyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLHNCQUFZLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3pFLFlBQVksRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJO1lBQ3hCLFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDeEIsSUFBRywyQkFBWSxDQUFDLGNBQWM7b0JBQUUsT0FBTyxJQUFJLENBQUM7Z0JBRTVDLE9BQVEsU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFpRCxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDO3VCQUNoSCxTQUFTLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQWlELENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztZQUM5SCxDQUFDO1lBQ0QsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUU7Z0JBRWhCLFNBQVMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUV0QyxTQUFTLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMzQyxDQUFDO1NBQ0osQ0FBQyxDQUNMLENBQUMsQ0FBQztRQUdVLG9CQUFVLEdBQUcsSUFBSSw2Q0FBcUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsc0JBQVk7YUFDL0YsU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUM7YUFDeEMsTUFBTSxDQUFDO1lBQ0osWUFBWSxFQUFFLDRCQUFrQixDQUFDLE1BQU07WUFDdkMsUUFBUSxFQUFFLHNCQUFZLENBQUMsV0FBVyxDQUFDLFdBQVc7WUFDOUMsU0FBUyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLHNCQUFZLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzFFLFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDeEIsSUFBRywyQkFBWSxDQUFDLGNBQWM7b0JBQUUsT0FBTyxJQUFJLENBQUM7Z0JBQzVDLE9BQVEsMEJBQWtCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQWlELENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMvSCxDQUFDO1lBQ0QsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUU7Z0JBQ2hCLDBCQUFrQixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDcEMsMEJBQWtCLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNwQyx1QkFBZSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDakMseUJBQWlCLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNuQyx3QkFBZ0IsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ2xDLDBCQUFrQixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN4QyxDQUFDO1NBQ0osQ0FBQyxDQUNMLENBQUMsQ0FBQztRQUdVLHFCQUFXLEdBQUcsSUFBSSw2Q0FBcUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsc0JBQVk7YUFDakcsU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDO2FBQ3pCLE1BQU0sQ0FBQztZQUNKLFlBQVksRUFBRSw0QkFBa0IsQ0FBQyxNQUFNO1lBQ3ZDLFFBQVEsRUFBRSxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxZQUFZO1lBQy9DLFNBQVMsRUFBRSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUU7Z0JBQzlELE1BQU0sR0FBRyxHQUFHLHlCQUFlLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxJQUFJLElBQUksUUFBUSxJQUFJLHFCQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQzVGLE9BQU8sc0JBQVksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQzNDLENBQUMsR0FBRyxLQUFLLFNBQVM7b0JBQ2QsQ0FBQyxDQUFDO3dCQUNFLHNCQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO3dCQUNyRSxzQkFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMscUJBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7cUJBQ2xGLENBQUMsQ0FBQyxDQUFDO29CQUNBLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUM7MkJBQ2xELENBQUMsUUFBUTs0QkFDUixDQUFDLENBQUMscUJBQVcsQ0FBQyxNQUFNLENBQUMsb0JBQVUsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQzs0QkFDdEQsQ0FBQyxDQUFDLFNBQVMsQ0FBQztpQkFDbkIsQ0FBQyxDQUNULENBQUM7WUFDTixDQUFDLENBQUM7WUFDRixZQUFZLEVBQUUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxJQUFJO1lBQ3JDLFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDeEIsSUFBRywyQkFBWSxDQUFDLGNBQWM7b0JBQUUsT0FBTyxJQUFJLENBQUM7Z0JBQzVDLE9BQVEsMkJBQW1CLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBc0Y7cUJBQy9ILFFBQVEsQ0FBQyxNQUFNLEVBQUUsS0FBK0YsQ0FBQyxDQUFDO1lBQzNILENBQUM7WUFDRCxPQUFPLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFDaEIsMkJBQW1CLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNyQyx5QkFBaUIsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdkMsQ0FBQztTQUNKLENBQUMsQ0FDTCxDQUFDLENBQUM7SUFFUCxDQUFDLEVBeExnQixTQUFTLEdBQVQsaUJBQVMsS0FBVCxpQkFBUyxRQXdMekI7SUFVWSxRQUFBLGtCQUFrQixHQUFHLElBQUksNkNBQXFCLENBQUMsQ0FBQyxHQUFHLEVBQUUsWUFBcUIsS0FBSyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLHNCQUFZLENBQUMsV0FBVyxDQUFDLGdCQUFnQixFQUFFLHNCQUFZO1NBQzNKLFNBQVMsQ0FBQyxFQUFFLENBQUM7U0FDYixNQUFNLENBQUM7UUFDSixTQUFTLEVBQUUsU0FBUztRQUNwQixZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyw0QkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLDRCQUFrQixDQUFDLE1BQU07UUFDOUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxZQUFZO1FBQ3ZFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsT0FBTztRQUM5RCxrQkFBa0IsRUFBRSw2QkFBc0IsQ0FBQyxXQUFXO1FBQ3RELFNBQVMsRUFBRSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FDNUMsU0FBUztZQUNMLENBQUMsQ0FBQyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQ25DLHNCQUFZLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQywwQkFBVyxDQUFDLFNBQVMsQ0FBQyxFQUMvRCxzQkFBWSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsc0JBQVksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUM3RSxDQUFDLENBQUMsc0JBQVksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLHNCQUFZLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQ2pGO1FBQ0QsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDakIsSUFBRywyQkFBWSxDQUFDLGNBQWM7Z0JBQUUsT0FBTyxJQUFJLENBQUM7WUFDNUMsT0FBTyx5QkFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsR0FBRyxJQUFBLHNDQUFvQixFQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBQSw2QkFBVyxFQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZILENBQUM7UUFDRCxPQUFPLEVBQUUsaUJBQVM7S0FDckIsQ0FBQyxDQUNMLENBQUMsQ0FBQztJQUVJLE1BQU0sU0FBUyxHQUFHLENBQUMsQ0FBUyxFQUFXLEVBQUUsQ0FBQyxJQUFBLG1DQUF5QixFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFBOUksUUFBQSxTQUFTLGFBQXFJO0lBUzlJLFFBQUEsa0JBQWtCLEdBQUcsSUFBSSw2Q0FBcUIsQ0FBQyxDQUFDLEdBQUcsRUFBRSxZQUFxQixLQUFLLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLEVBQUUsc0JBQVk7U0FDM0osU0FBUyxDQUFDLEVBQUUsQ0FBQztTQUNiLE1BQU0sQ0FBQztRQUNKLFNBQVMsRUFBRSxTQUFTO1FBQ3BCLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLDRCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsNEJBQWtCLENBQUMsTUFBTTtRQUM5RSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLHNCQUFZLENBQUMsV0FBVyxDQUFDLFlBQVk7UUFDdkUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxPQUFPO1FBQzlELGtCQUFrQixFQUFFLDZCQUFzQixDQUFDLFdBQVc7UUFDdEQsU0FBUyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUM1QyxTQUFTO1lBQ0wsQ0FBQyxDQUFDLHNCQUFZLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FDbkMsc0JBQVksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLDBCQUFXLENBQUMsU0FBUyxDQUFDLEVBQy9ELHNCQUFZLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQzdFLENBQUMsQ0FBQyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsc0JBQVksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FDakY7UUFDRCxRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUNqQixJQUFHLDJCQUFZLENBQUMsY0FBYztnQkFBRSxPQUFPLElBQUksQ0FBQztZQUM1QyxPQUFPLHlCQUFlLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUEsNkJBQVcsRUFBQyxNQUFNLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN0RixDQUFDO1FBQ0QsT0FBTyxFQUFFLGdCQUFRO0tBRXBCLENBQUMsQ0FDTCxDQUFDLENBQUM7SUFFSSxNQUFNLFFBQVEsR0FBRyxDQUFDLENBQVMsRUFBVyxFQUFFLENBQUMsSUFBQSxtQ0FBeUIsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUE1SCxRQUFBLFFBQVEsWUFBb0g7SUFZNUgsUUFBQSxpQkFBaUIsR0FBRyxJQUFJLDZDQUFxQixDQUFDLENBQUMsR0FBRyxFQUFFLFlBQXFCLEtBQUssRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxlQUFlLEVBQUUsc0JBQVk7U0FDekosU0FBUyxDQUFDO1FBQ1AsSUFBSSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsSUFBQSwrQkFBYSxFQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtLQUM1RCxDQUFDO1NBQ0QsTUFBTSxDQUFDO1FBQ0osU0FBUyxFQUFFLFNBQVM7UUFDcEIsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsNEJBQWtCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyw0QkFBa0IsQ0FBQyxNQUFNO1FBQzlFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsV0FBVztRQUN0RSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLHNCQUFZLENBQUMsV0FBVyxDQUFDLE1BQU07UUFDN0Qsa0JBQWtCLEVBQUUsNkJBQXNCLENBQUMsV0FBVztRQUN0RCxTQUFTLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFO1lBQzlELE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMscUJBQVcsQ0FBQyxNQUFNLENBQUMsb0JBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxJQUFJLFFBQVEsQ0FBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsc0JBQVksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDeEosT0FBTyxTQUFTO2dCQUNaLENBQUMsQ0FBQyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQ25DLHNCQUFZLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQywwQkFBVyxDQUFDLFNBQVMsQ0FBQyxFQUMvRCxzQkFBWSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ2pELENBQUMsQ0FBQyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkQsQ0FBQyxDQUFDO1FBQ0YsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUMzQixJQUFHLDJCQUFZLENBQUMsY0FBYztnQkFBRSxPQUFPLElBQUksQ0FBQztZQUM1QyxPQUFPLElBQUEsaUNBQWUsRUFBQyxNQUFNLEVBQUUsSUFBSSxDQUFDO21CQUM3Qix5QkFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQWtCLENBQUMsRUFBRSxJQUFBLDZCQUFXLEVBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDeEYsQ0FBQztRQUNELE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFBLDRCQUFrQixFQUFDLE1BQU0sRUFDcEQsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLElBQWtCLENBQUMsRUFBRSxDQUFDLEVBQ3JDLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFDcEMsRUFBRSxDQUFDO0tBQ1YsQ0FBQyxDQUNMLENBQUMsQ0FBQztJQWFVLFFBQUEsc0JBQXNCLEdBQUcsSUFBSSw2Q0FBcUIsQ0FBQyxDQUFDLEdBQUcsRUFBRSxZQUFxQixLQUFLLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsb0JBQW9CLEVBQUUsc0JBQVk7U0FDbkssU0FBUyxDQUFDO1FBQ1AsSUFBSSxFQUFFO1lBQ0YsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFBLCtCQUFhLEVBQUMsSUFBSSxDQUFDO1lBQ25ELFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUEsK0JBQWEsRUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1NBQ2xEO0tBQ0osQ0FBQztTQUNELE1BQU0sQ0FBQztRQUNKLFNBQVMsRUFBRSxJQUFJO1FBQ2Ysa0JBQWtCLEVBQUUsNkJBQXNCLENBQUMsV0FBVztRQUN0RCxZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyw0QkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLDRCQUFrQixDQUFDLE1BQU07UUFDOUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxhQUFhO1FBQ3hFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsUUFBUTtRQUMvRCxTQUFTLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFO1lBQzlELE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMscUJBQVcsQ0FBQyxNQUFNLENBQUMsb0JBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxJQUFJLFFBQVEsQ0FBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsc0JBQVksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUN6SixPQUFPLFNBQVM7Z0JBQ1osQ0FBQyxDQUFDLHNCQUFZLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FDbkMsc0JBQVksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLDBCQUFXLENBQUMsU0FBUyxDQUFDLEVBQy9ELHNCQUFZLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDckYsQ0FBQyxDQUFDLHNCQUFZLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUMzRixDQUFDLENBQUM7UUFDRixRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRTtZQUNyQyxJQUFHLDJCQUFZLENBQUMsY0FBYztnQkFBRSxPQUFPLElBQUksQ0FBQztZQUM1QyxJQUFHLElBQUksSUFBSSxDQUFDLElBQUEsaUNBQWUsRUFBQyxNQUFNLEVBQUUsSUFBSSxDQUFDO2dCQUFFLE9BQU8sS0FBSyxDQUFDO1lBQ3hELElBQUcsUUFBUSxJQUFJLENBQUMsSUFBQSwrQkFBYSxFQUFDLE1BQU0sRUFBRSxRQUFRLENBQUM7Z0JBQUUsT0FBTyxLQUFLLENBQUM7WUFDOUQsT0FBTyx5QkFBZSxDQUFDLFNBQVMsQ0FBQyxJQUFBLHNDQUFvQixFQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksSUFBSSxRQUFRLENBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBQSw2QkFBVyxFQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzdILENBQUM7UUFDRCxPQUFPLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUEsNEJBQWtCLEVBQUMsTUFBTSxFQUM5RCxDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUEsc0NBQW9CLEVBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxJQUFJLFFBQVEsQ0FBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQzFFLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFDcEMsRUFBRSxDQUFDO0tBQ1YsQ0FBQyxDQUNMLENBQUMsQ0FBQztJQWFVLFFBQUEsbUJBQW1CLEdBQUcsSUFBSSw2Q0FBcUIsQ0FBQyxDQUFDLEdBQUcsRUFBRSxZQUFxQixLQUFLLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsaUJBQWlCLEVBQUUsc0JBQVk7U0FDN0osU0FBUyxDQUFDO1FBQ1AsSUFBSSxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFO0tBQzFDLENBQUM7U0FDRCxNQUFNLENBQUM7UUFDSixTQUFTLEVBQUUsSUFBSTtRQUNmLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLDRCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsNEJBQWtCLENBQUMsTUFBTTtRQUM5RSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLHNCQUFZLENBQUMsV0FBVyxDQUFDLFlBQVk7UUFDdkUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxPQUFPO1FBQzlELGtCQUFrQixFQUFFLDZCQUFzQixDQUFDLE9BQU87UUFDbEQsU0FBUyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUM5RCxTQUFTO1lBQ0wsQ0FBQyxDQUFDLHNCQUFZLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FDbkMsc0JBQVksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO2lCQUMxQixTQUFTLENBQUMsMEJBQVcsQ0FBQyxTQUFTLENBQUM7aUJBQ2hDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLHFCQUFXLENBQUMsTUFBTSxDQUFDLG9CQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksSUFBSSxRQUFRLENBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUMzSCxzQkFBWSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsc0JBQVksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUM3RSxDQUFDLENBQUMsc0JBQVksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLHNCQUFZLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQ2pGO1FBQ0QsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRTtZQUMvQixJQUFHLDJCQUFZLENBQUMsY0FBYztnQkFBRSxPQUFPLElBQUksQ0FBQztZQUM1QyxPQUFPLElBQUEsK0JBQWEsRUFBQyxNQUFNLEVBQUUsUUFBUSxDQUFDO21CQUMvQix5QkFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsR0FBRyxJQUFBLHNDQUFvQixFQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBQSw2QkFBVyxFQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM3SSxDQUFDO1FBQ0QsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUEsNEJBQWtCLEVBQUMsTUFBTSxFQUN4RCxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFDakMsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUNwQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ2xCLENBQUMsQ0FDTCxDQUFDLENBQUM7SUFhVSxRQUFBLG1CQUFtQixHQUFHLElBQUksNkNBQXFCLENBQUMsQ0FBQyxHQUFHLEVBQUUsWUFBcUIsS0FBSyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLHNCQUFZLENBQUMsV0FBVyxDQUFDLGlCQUFpQixFQUFFLHNCQUFZO1NBQzdKLFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQztTQUN6QixNQUFNLENBQUM7UUFDSixTQUFTLEVBQUUsS0FBSztRQUNoQixZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyw0QkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLDRCQUFrQixDQUFDLE1BQU07UUFDOUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxZQUFZO1FBQ3ZFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsT0FBTztRQUM5RCxTQUFTLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQzlELFNBQVM7WUFDTCxDQUFDLENBQUMsc0JBQVksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUNuQyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUM7aUJBQzFCLFNBQVMsQ0FBQywwQkFBVyxDQUFDLFNBQVMsQ0FBQztpQkFDaEMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMscUJBQVcsQ0FBQyxNQUFNLENBQUMsb0JBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxJQUFJLFFBQVEsQ0FBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQzNILHNCQUFZLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3BFLENBQUMsQ0FBQyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsc0JBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FDeEU7UUFDRCxRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQzNCLElBQUcsMkJBQVksQ0FBQyxjQUFjO2dCQUFFLE9BQU8sSUFBSSxDQUFDO1lBQzVDLElBQUcsU0FBUztnQkFBRSxPQUFPLEtBQUssQ0FBQztZQUMzQixPQUFPLElBQUEsK0JBQWEsRUFBQyxNQUFNLEVBQUUsSUFBSSxDQUFDO21CQUMzQix5QkFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFnQixDQUFDLEVBQUUsSUFBQSw2QkFBVyxFQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbEgsQ0FBQztRQUNELE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsSUFBQSw0QkFBa0IsRUFBQyxNQUFNLEVBQzlELENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLGVBQWdCLEVBQUUsQ0FBQyxFQUN0QyxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQ3BDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBRW5CLENBQUMsQ0FDTCxDQUFDLENBQUM7SUFXVSxRQUFBLGtCQUFrQixHQUFHLElBQUksNkNBQXFCLENBQUMsQ0FBQyxHQUFHLEVBQUUsWUFBcUIsS0FBSyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLHNCQUFZLENBQUMsV0FBVyxDQUFDLGdCQUFnQixFQUFFLHNCQUFZO1NBQzNKLFNBQVMsQ0FBQyxFQUFFLENBQUM7U0FDYixNQUFNLENBQUM7UUFDSixTQUFTLEVBQUUsU0FBUztRQUNwQixRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLHNCQUFZLENBQUMsV0FBVyxDQUFDLFlBQVk7UUFDdkUsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsNEJBQWtCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyw0QkFBa0IsQ0FBQyxNQUFNO1FBQzlFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsT0FBTztRQUM5RCxrQkFBa0IsRUFBRSw2QkFBc0IsQ0FBQyxXQUFXO1FBQ3RELFNBQVMsRUFBRSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FDNUMsU0FBUztZQUNMLENBQUMsQ0FBQyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQ25DLHNCQUFZLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQywwQkFBVyxDQUFDLFNBQVMsQ0FBQyxFQUMvRCxzQkFBWSxDQUFDLFFBQVEsQ0FBQyxlQUFlLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDckQsQ0FBQyxDQUFDLHNCQUFZLENBQUMsUUFBUSxDQUFDLGVBQWUsRUFBRSxRQUFRLENBQUMsQ0FDekQ7UUFDRCxRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUNqQixJQUFHLDJCQUFZLENBQUMsY0FBYztnQkFBRSxPQUFPLElBQUksQ0FBQztZQUM1QyxJQUFHLFNBQVM7Z0JBQUUsT0FBTyxLQUFLLENBQUM7WUFDM0IsT0FBTyx5QkFBZSxDQUFDLFFBQVEsQ0FBQyxJQUFBLDZCQUFXLEVBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLEdBQUcsSUFBQSxzQ0FBb0IsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUcsQ0FBQztRQUNELE9BQU8sRUFBRSxpQkFBUztLQUNyQixDQUFDLENBQ0wsQ0FBQyxDQUFDO0lBRUksTUFBTSxTQUFTLEdBQUcsQ0FBQyxDQUFTLEVBQVcsRUFBRSxDQUFDLElBQUEsbUNBQXlCLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUE5SSxRQUFBLFNBQVMsYUFBcUk7SUFVOUksUUFBQSxrQkFBa0IsR0FBRyxJQUFJLDZDQUFxQixDQUFDLENBQUMsR0FBRyxFQUFFLFlBQXFCLEtBQUssRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRSxzQkFBWTtTQUMzSixTQUFTLENBQUMsRUFBRSxDQUFDO1NBQ2IsTUFBTSxDQUFDO1FBQ0osU0FBUyxFQUFFLFNBQVM7UUFDcEIsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsNEJBQWtCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyw0QkFBa0IsQ0FBQyxNQUFNO1FBQzlFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsWUFBWTtRQUN2RSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLHNCQUFZLENBQUMsV0FBVyxDQUFDLE9BQU87UUFDOUQsa0JBQWtCLEVBQUUsNkJBQXNCLENBQUMsT0FBTztRQUNsRCxTQUFTLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQzVDLFNBQVM7WUFDTCxDQUFDLENBQUMsc0JBQVksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUNuQyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLENBQUMsMEJBQVcsQ0FBQyxTQUFTLENBQUMsRUFDL0Qsc0JBQVksQ0FBQyxRQUFRLENBQUMsZUFBZSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3JELENBQUMsQ0FBQyxzQkFBWSxDQUFDLFFBQVEsQ0FBQyxlQUFlLEVBQUUsUUFBUSxDQUFDLENBQ3pEO1FBQ0QsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDakIsSUFBRywyQkFBWSxDQUFDLGNBQWM7Z0JBQUUsT0FBTyxJQUFJLENBQUM7WUFDNUMsSUFBRyxTQUFTO2dCQUFFLE9BQU8sS0FBSyxDQUFDO1lBQzNCLE9BQU8seUJBQWUsQ0FBQyxRQUFRLENBQUMsSUFBQSw2QkFBVyxFQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDN0UsQ0FBQztRQUNELE9BQU8sRUFBRSxnQkFBUTtLQUNwQixDQUFDLENBQ0wsQ0FBQyxDQUFDO0lBRUksTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFTLEVBQVcsRUFBRSxDQUFDLElBQUEsbUNBQXlCLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFBNUgsUUFBQSxRQUFRLFlBQW9IO0lBRzVILFFBQUEsZUFBZSxHQUFHLElBQUksNkNBQXFCLENBQUMsQ0FBQyxHQUFHLEVBQUUsWUFBcUIsS0FBSyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLHNCQUFZLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxzQkFBWTtTQUNySixTQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxxQkFBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLHFCQUFhLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDO1NBQ3ZHLE1BQU0sQ0FBQztRQUNKLFNBQVMsRUFBRSxTQUFTO1FBQ3BCLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLDRCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsNEJBQWtCLENBQUMsTUFBTTtRQUM5RSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLHNCQUFZLENBQUMsV0FBVyxDQUFDLFlBQVk7UUFDdkUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxPQUFPO1FBQzlELGtCQUFrQixFQUFFLDZCQUFzQixDQUFDLE9BQU87UUFDbEQsU0FBUyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRTtZQUM5RCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMscUJBQVcsQ0FBQyxNQUFNLENBQUMsb0JBQVUsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsc0JBQVksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDeEosT0FBTyxTQUFTO2dCQUNaLENBQUMsQ0FBQyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQ25DLHNCQUFZLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQywwQkFBVyxDQUFDLFNBQVMsQ0FBQyxFQUMvRCxzQkFBWSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsZUFBZSxDQUFDLENBQUM7Z0JBQ3BELENBQUMsQ0FBQyxzQkFBWSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFDMUQsQ0FBQyxDQUFDO1FBS0YsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUMzQixJQUFHLDJCQUFZLENBQUMsY0FBYztnQkFBRSxPQUFPLElBQUksQ0FBQztZQUM1QyxJQUFHLFNBQVM7Z0JBQUUsT0FBTyxLQUFLLENBQUM7WUFDM0IsT0FBTyx5QkFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQWtCLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzlFLENBQUM7UUFDRCxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFBLDRCQUFrQixFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsSUFBa0IsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO0tBQ3hHLENBQUMsQ0FDTCxDQUFDLENBQUM7SUFFVSxRQUFBLGlCQUFpQixHQUFHLElBQUksNkNBQXFCLENBQUMsQ0FBQyxHQUFHLEVBQUUsWUFBcUIsS0FBSyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLHNCQUFZLENBQUMsV0FBVyxDQUFDLGVBQWUsRUFBRSxzQkFBWTtTQUN6SixTQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFBLCtCQUFhLEVBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztTQUN4RSxNQUFNLENBQUM7UUFDSixTQUFTLEVBQUUsU0FBUztRQUNwQixrQkFBa0IsRUFBRSw2QkFBc0IsQ0FBQyxPQUFPO1FBQ2xELFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLDRCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsNEJBQWtCLENBQUMsTUFBTTtRQUM5RSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLHNCQUFZLENBQUMsV0FBVyxDQUFDLGNBQWM7UUFDekUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxTQUFTO1FBQ2hFLFNBQVMsRUFBRSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUU7WUFDOUQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLHFCQUFXLENBQUMsTUFBTSxDQUFDLG9CQUFVLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLHNCQUFZLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3hKLE9BQU8sU0FBUztnQkFDWixDQUFDLENBQUMsc0JBQVksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUNuQyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLENBQUMsMEJBQVcsQ0FBQyxTQUFTLENBQUMsRUFDL0Qsc0JBQVksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUM3QyxDQUFDLENBQUMsc0JBQVksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ25ELENBQUMsQ0FBQztRQUNGLFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7WUFDM0IsSUFBRywyQkFBWSxDQUFDLGNBQWM7Z0JBQUUsT0FBTyxJQUFJLENBQUM7WUFDNUMsSUFBRyxTQUFTO2dCQUFFLE9BQU8sS0FBSyxDQUFDO1lBQzNCLE9BQU8sSUFBQSxpQ0FBZSxFQUFDLE1BQU0sRUFBRSxJQUFJLENBQUM7bUJBQzdCLHlCQUFlLENBQUMsU0FBUyxDQUFDLElBQUEsNkJBQVcsRUFBQyxNQUFNLENBQUMsRUFBRSxDQUFDLElBQWtCLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN4RixDQUFDO1FBQ0QsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBQSw0QkFBa0IsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLElBQWtCLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztLQUM1SCxDQUFDLENBQ0wsQ0FBQyxDQUFDO0lBRVUsUUFBQSxnQkFBZ0IsR0FBRyxJQUFJLDZDQUFxQixDQUFDLENBQUMsR0FBRyxFQUFFLFlBQXFCLEtBQUssRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBK0Msc0JBQVk7U0FDL0ssU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDO1NBQ3pCLE1BQU0sQ0FBQztRQUNKLFNBQVMsRUFBRSxLQUFLO1FBQ2hCLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLDRCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsNEJBQWtCLENBQUMsTUFBTTtRQUM5RSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLHNCQUFZLENBQUMsV0FBVyxDQUFDLFlBQVk7UUFDdkUsSUFBSSxFQUFFLHNCQUFZLENBQUMsV0FBVyxDQUFDLE9BQU87UUFDdEMsU0FBUyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUM1QyxTQUFTO1lBQ0wsQ0FBQyxDQUFDLHNCQUFZLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FDbkMsc0JBQVksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLDBCQUFXLENBQUMsU0FBUyxDQUFDLEVBQy9ELHNCQUFZLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxlQUFlLENBQUMsQ0FBQztZQUNuRCxDQUFDLENBQUMsc0JBQVksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLGVBQWUsQ0FBQyxDQUN2RDtRQUNELFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7WUFDM0IsSUFBRywyQkFBWSxDQUFDLGNBQWM7Z0JBQUUsT0FBTyxJQUFJLENBQUM7WUFDNUMsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQUcsS0FBSyw4QkFBc0IsQ0FBQyxNQUFNO21CQUNqSCx5QkFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFnQixDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLEdBQUcsSUFBQSxzQ0FBb0IsRUFBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztRQUMvSCxDQUFDO1FBQ0QsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxJQUFBLDRCQUFrQixFQUFDLE1BQU0sRUFDOUQsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQ2pDLENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLGVBQWdCLEVBQUUsQ0FBQyxFQUN0QyxFQUFFLENBQUM7S0FDVixDQUFDLENBQ0wsQ0FBQyxDQUFDO0lBRVUsUUFBQSxrQkFBa0IsR0FBRyxJQUFJLDZDQUFxQixDQUFDLENBQUMsR0FBRyxFQUFFLFlBQXFCLEtBQUssRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBaUQsc0JBQVk7U0FDckwsU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDO1NBQ3pCLE1BQU0sQ0FBQztRQUNKLFNBQVMsRUFBRSxLQUFLO1FBQ2hCLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLDRCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsNEJBQWtCLENBQUMsTUFBTTtRQUM5RSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLHNCQUFZLENBQUMsV0FBVyxDQUFDLFlBQVk7UUFDdkUsSUFBSSxFQUFFLHNCQUFZLENBQUMsV0FBVyxDQUFDLFNBQVM7UUFDeEMsU0FBUyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUM1QyxTQUFTO1lBQ0wsQ0FBQyxDQUFDLHNCQUFZLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FDbkMsc0JBQVksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLDBCQUFXLENBQUMsU0FBUyxDQUFDLEVBQy9ELHNCQUFZLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztZQUM1QyxDQUFDLENBQUMsc0JBQVksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUNoRDtRQUNELFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7WUFDM0IsSUFBRywyQkFBWSxDQUFDLGNBQWM7Z0JBQUUsT0FBTyxJQUFJLENBQUM7WUFDNUMsSUFBRyxTQUFTO2dCQUFFLE9BQU8sS0FBSyxDQUFDO1lBQzNCLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFHLEtBQUssOEJBQXNCLENBQUMsTUFBTTttQkFDakgseUJBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZ0IsQ0FBQyxFQUFFLElBQUEsNkJBQVcsRUFBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLGVBQWdCLENBQUMsRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDeEksQ0FBQztRQUNELE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsSUFBQSw0QkFBa0IsRUFBQyxNQUFNLEVBQzlELENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBQSw2QkFBVyxFQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsZUFBZ0IsQ0FBQyxFQUFFLENBQUMsRUFDN0UsQ0FBQyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsZUFBZ0IsRUFBRSxDQUFDLEVBQ3RDLEVBQUUsQ0FBQztLQUNWLENBQUMsQ0FDTCxDQUFDLENBQUM7SUFFVSxRQUFBLGlCQUFpQixHQUFHLElBQUksNkNBQXFCLENBQUMsQ0FBQyxHQUFHLEVBQUUsWUFBcUIsS0FBSyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFnRCxzQkFBWTtTQUNsTCxTQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUM7U0FDekIsTUFBTSxDQUFDO1FBQ0osU0FBUyxFQUFFLEtBQUs7UUFDaEIsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsNEJBQWtCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyw0QkFBa0IsQ0FBQyxNQUFNO1FBQzlFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsWUFBWTtRQUN2RSxJQUFJLEVBQUUsc0JBQVksQ0FBQyxXQUFXLENBQUMsT0FBTztRQUN0QyxTQUFTLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQzlELFNBQVM7WUFDTCxDQUFDLENBQUMsc0JBQVksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUNuQyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUM7aUJBQzFCLFNBQVMsQ0FBQywwQkFBVyxDQUFDLFNBQVMsQ0FBQztpQkFDaEMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMscUJBQVcsQ0FBQyxNQUFNLENBQUMsb0JBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxJQUFJLFFBQVEsQ0FBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQzNILHNCQUFZLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxlQUFlLENBQUMsQ0FBQztZQUNuRCxDQUFDLENBQUMsc0JBQVksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLGVBQWUsQ0FBQyxDQUN2RDtRQUVELFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7WUFDM0IsSUFBRywyQkFBWSxDQUFDLGNBQWM7Z0JBQUUsT0FBTyxJQUFJLENBQUM7WUFDNUMsSUFBRyxTQUFTO2dCQUFFLE9BQU8sS0FBSyxDQUFDO1lBQzNCLElBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLGVBQWdCLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBRyxLQUFLLDhCQUFzQixDQUFDLGVBQWU7Z0JBQ3pILE9BQU8seUJBQWUsQ0FBQyxRQUFRLENBQUMsSUFBQSxzQ0FBb0IsRUFBQyxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFnQixDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDOztnQkFFOUcsT0FBTyx5QkFBZSxDQUFDLFNBQVMsQ0FDNUIsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLEdBQUcsSUFBQSxzQ0FBb0IsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsZUFBZ0IsQ0FBQyxFQUM1RixDQUFDLElBQUksQ0FBQyxlQUFnQixDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNwRSxDQUFDO1FBQ0QsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxJQUFBLDRCQUFrQixFQUFDLE1BQU0sRUFDOUQsSUFBQSwrQkFBYSxFQUFDLE1BQU0sRUFBRSxJQUFJLENBQUM7WUFDdkIsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLEdBQUcsSUFBQSxzQ0FBb0IsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsZUFBZ0IsQ0FBQyxFQUFFLENBQUM7WUFDL0csQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUN2QyxDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxlQUFnQixFQUFFLENBQUMsRUFDdEMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDbkIsQ0FBQyxDQUNMLENBQUMsQ0FBQztJQUVVLFFBQUEsbUJBQW1CLEdBQUcsSUFBSSw2Q0FBcUIsQ0FBQyxDQUFDLEdBQUcsRUFBRSxZQUFxQixLQUFLLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQWtELHNCQUFZO1NBQ3hMLFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQztTQUN6QixNQUFNLENBQUM7UUFDSixTQUFTLEVBQUUsS0FBSztRQUNoQixZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyw0QkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLDRCQUFrQixDQUFDLE1BQU07UUFDOUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxjQUFjO1FBQ3pFLElBQUksRUFBRSxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxTQUFTO1FBQ3hDLFNBQVMsRUFBRSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsQ0FDOUQsU0FBUztZQUNMLENBQUMsQ0FBQyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQ25DLHNCQUFZLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQztpQkFDMUIsU0FBUyxDQUFDLDBCQUFXLENBQUMsU0FBUyxDQUFDO2lCQUNoQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxxQkFBVyxDQUFDLE1BQU0sQ0FBQyxvQkFBVSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLElBQUksUUFBUSxDQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFDM0gsc0JBQVksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzVDLENBQUMsQ0FBQyxzQkFBWSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQ2hEO1FBQ0QsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUMzQixJQUFHLDJCQUFZLENBQUMsY0FBYztnQkFBRSxPQUFPLElBQUksQ0FBQztZQUM1QyxJQUFHLFNBQVM7Z0JBQUUsT0FBTyxLQUFLLENBQUM7WUFDM0IsSUFBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsZUFBZ0IsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFHLEtBQUssOEJBQXNCLENBQUMsZUFBZTtnQkFDekgsT0FBTyx5QkFBZSxDQUFDLFFBQVEsQ0FBQyxJQUFBLDZCQUFXLEVBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZ0IsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQzs7Z0JBRXJHLE9BQU8seUJBQWUsQ0FBQyxTQUFTLENBQzVCLElBQUEsNkJBQVcsRUFBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLGVBQWdCLENBQUMsRUFDNUQsQ0FBQyxJQUFJLENBQUMsZUFBZ0IsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDcEUsQ0FBQztRQUNELE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsSUFBQSw0QkFBa0IsRUFBQyxNQUFNLEVBQzlELElBQUEsK0JBQWEsRUFBQyxNQUFNLEVBQUUsSUFBSSxDQUFDO1lBQ3ZCLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDO1lBQ3RDLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUEsNkJBQVcsRUFBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLGVBQWdCLENBQUMsRUFBRSxDQUFDLEVBQ25GLENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLGVBQWdCLEVBQUUsQ0FBQyxFQUN0QyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNuQixDQUFDLENBQ0wsQ0FBQyxDQUFDIn0=
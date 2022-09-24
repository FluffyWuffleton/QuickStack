define(["require", "exports", "game/entity/action/IAction", "game/entity/action/usable/UsableAction", "game/entity/action/usable/UsableActionRegistrar", "game/item/IItem", "language/Dictionary", "language/ITranslation", "language/Translation", "ui/screen/screens/game/component/Item", "../StaticHelper", "../TransferHandler", "./Actions", "../QSMatchGroups", "game/item/ItemManager"], function (require, exports, IAction_1, UsableAction_1, UsableActionRegistrar_1, IItem_1, Dictionary_1, ITranslation_1, Translation_1, Item_1, StaticHelper_1, TransferHandler_1, Actions_1, QSMatchGroups_1, ItemManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StackTypeNearHere = exports.StackTypeSelfHere = exports.StackAllNearHere = exports.StackAllSelfHere = exports.StackAllNearSub = exports.StackAllMainSub = exports.execSANM = exports.StackAllNearMain = exports.execSANSe = exports.StackAllNearSelf = exports.StackTypeHereNear = exports.StackTypeSelfNear = exports.StackAllSubNear = exports.execSAMN = exports.StackAllMainNear = exports.execSASeN = exports.StackAllSelfNear = exports.QSSubmenu = exports.UsableActionsQuickStack = void 0;
    exports.UsableActionsQuickStack = new UsableActionRegistrar_1.UsableActionGenerator(reg => {
        QSSubmenu.Deposit.register(reg);
        QSSubmenu.Collect.register(reg);
        exports.StackAllSelfNear.register(reg, true);
        exports.StackAllMainNear.register(reg, true);
        exports.StackAllSubNear.register(reg, true);
        exports.StackTypeSelfNear.register(reg, true);
        exports.StackTypeHereNear.register(reg, true);
        exports.StackAllNearSelf.register(reg, true);
        exports.StackAllNearMain.register(reg, true);
        exports.StackAllMainSub.register(reg, true);
        exports.StackAllNearSub.register(reg, true);
        exports.StackAllSelfHere.register(reg, true);
        exports.StackAllNearHere.register(reg, true);
        exports.StackTypeNearHere.register(reg, true);
        exports.StackTypeSelfHere.register(reg, true);
    });
    var QSSubmenu;
    (function (QSSubmenu) {
        QSSubmenu.Deposit = new UsableActionRegistrar_1.UsableActionGenerator(reg => reg.add(StaticHelper_1.default.QS_INSTANCE.UAPDepositMenu, UsableAction_1.default
            .requiring({ item: { allowNone: true, validate: () => true } })
            .create({
            displayLevel: IAction_1.ActionDisplayLevel.Always,
            translate: (translator) => translator.name(StaticHelper_1.default.TLMain("deposit")),
            isUsable: (player, using) => {
                if (StaticHelper_1.GLOBALCONFIG.force_isusable || StaticHelper_1.GLOBALCONFIG.force_menus)
                    return true;
                return true;
            },
            submenu: (subreg) => {
                QSSubmenu.DepositAll.register(subreg);
                QSSubmenu.DepositType.register(subreg);
            }
        })));
        QSSubmenu.DepositAll = new UsableActionRegistrar_1.UsableActionGenerator(reg => reg.add("DepositAllMenu", UsableAction_1.default
            .requiring({ item: { allowNone: true, validate: () => true } })
            .create({
            displayLevel: IAction_1.ActionDisplayLevel.Always,
            bindable: StaticHelper_1.default.QS_INSTANCE.bindableAll,
            translate: (translator) => translator.name(StaticHelper_1.default.TLMain("allTypes")),
            icon: StaticHelper_1.default.QS_INSTANCE.UAPAll,
            isUsable: (player, using) => {
                if (StaticHelper_1.GLOBALCONFIG.force_isusable || StaticHelper_1.GLOBALCONFIG.force_menus)
                    return true;
                return true;
            },
            submenu: (subreg) => {
                exports.StackAllSelfNear.register(subreg);
                exports.StackAllMainNear.register(subreg);
                exports.StackAllSubNear.register(subreg);
            }
        })));
        QSSubmenu.DepositType = new UsableActionRegistrar_1.UsableActionGenerator(reg => reg.add("DepositTypeMenu", UsableAction_1.default
            .requiring({ item: true })
            .create({
            displayLevel: IAction_1.ActionDisplayLevel.Always,
            bindable: StaticHelper_1.default.QS_INSTANCE.bindableType,
            icon: StaticHelper_1.default.QS_INSTANCE.UAPType,
            translate: (translator) => translator.name(({ item, itemType }) => {
                const grp = (0, QSMatchGroups_1.getActiveGroups)(item?.type ?? itemType ?? IItem_1.ItemTypeGroup.Invalid);
                return StaticHelper_1.default.TLMain("onlyXType").addArgs(...(grp.length
                    ? [
                        StaticHelper_1.default.TLGroup(grp[0]).passTo(StaticHelper_1.default.TLMain("colorMatchGroup")),
                        StaticHelper_1.default.TLGroup("Item").passTo(Translation_1.default.reformatSingularNoun(999, false))
                    ] : [
                    item?.getName(false, 999, false, false, false, false)
                        ?? (itemType
                            ? Translation_1.default.nameOf(Dictionary_1.default.Item, itemType, false)
                            : undefined)
                ]));
            }),
            isUsable: (player, using) => {
                if (StaticHelper_1.GLOBALCONFIG.force_isusable || StaticHelper_1.GLOBALCONFIG.force_menus)
                    return true;
                return true;
            },
            submenu: (subreg) => {
                exports.StackTypeSelfNear.register(subreg);
                exports.StackTypeHereNear.register(subreg);
            },
        })));
        QSSubmenu.Collect = new UsableActionRegistrar_1.UsableActionGenerator(reg => reg.add(StaticHelper_1.default.QS_INSTANCE.UAPCollectMenu, UsableAction_1.default
            .requiring({ item: { allowNone: true, validate: () => true } })
            .create({
            displayLevel: IAction_1.ActionDisplayLevel.Always,
            translate: (translator) => translator.name(StaticHelper_1.default.TLMain("collect")),
            isApplicable: () => true,
            isUsable: (player, using) => {
                if (StaticHelper_1.GLOBALCONFIG.force_isusable || StaticHelper_1.GLOBALCONFIG.force_menus)
                    return true;
                return true;
                return QSSubmenu.CollectAll.get().actions[0][1].isUsable(player, using).usable
                    || QSSubmenu.CollectType.get().actions[0][1].isUsable(player, using).usable;
            },
            submenu: (subreg) => {
                QSSubmenu.CollectAll.register(subreg);
                QSSubmenu.CollectType.register(subreg);
            }
        })));
        QSSubmenu.CollectAll = new UsableActionRegistrar_1.UsableActionGenerator(reg => reg.add("CollectAllMenu", UsableAction_1.default
            .requiring({ item: { allowNone: true, validate: () => true } })
            .create({
            displayLevel: IAction_1.ActionDisplayLevel.Always,
            bindable: StaticHelper_1.default.QS_INSTANCE.bindableAll,
            translate: (translator) => translator.name(StaticHelper_1.default.TLMain("allTypes")),
            icon: StaticHelper_1.default.QS_INSTANCE.UAPAll,
            isUsable: (player, { item }) => {
                if (StaticHelper_1.GLOBALCONFIG.force_isusable || StaticHelper_1.GLOBALCONFIG.force_menus)
                    return true;
                return true;
                return false;
            },
            submenu: (subreg) => {
                exports.StackAllNearSelf.register(subreg);
                exports.StackAllNearMain.register(subreg);
                exports.StackAllMainSub.register(subreg);
                exports.StackAllNearSub.register(subreg);
                exports.StackAllSelfHere.register(subreg);
                exports.StackAllNearHere.register(subreg);
            }
        })));
        QSSubmenu.CollectType = new UsableActionRegistrar_1.UsableActionGenerator(reg => reg.add("CollectTypeMenu", UsableAction_1.default
            .requiring({ item: true })
            .create({
            displayLevel: IAction_1.ActionDisplayLevel.Always,
            bindable: StaticHelper_1.default.QS_INSTANCE.bindableType,
            icon: StaticHelper_1.default.QS_INSTANCE.UAPType,
            translate: (translator) => translator.name(({ item, itemType }) => {
                const grp = (0, QSMatchGroups_1.getActiveGroups)(item?.type ?? itemType ?? IItem_1.ItemTypeGroup.Invalid);
                return StaticHelper_1.default.TLMain("onlyXType").addArgs(...(grp.length
                    ? [
                        StaticHelper_1.default.TLGroup(grp[0]).passTo(StaticHelper_1.default.TLMain("colorMatchGroup")),
                        StaticHelper_1.default.TLGroup("Item").passTo(Translation_1.default.reformatSingularNoun(999, false))
                    ] : [
                    item?.getName(false, 999, false, false, false, false)
                        ?? (itemType
                            ? Translation_1.default.nameOf(Dictionary_1.default.Item, itemType, false)
                            : undefined)
                ]));
            }),
            isUsable: (player, using) => {
                if (StaticHelper_1.GLOBALCONFIG.force_isusable || StaticHelper_1.GLOBALCONFIG.force_menus)
                    return true;
                return exports.StackTypeNearHere.get().actions[0][1]
                    .isUsable(player, using).usable
                    || exports.StackTypeSelfHere.get().actions[0][1]
                        .isUsable(player, using).usable;
            },
            submenu: (subreg) => {
                exports.StackTypeSelfHere.register(subreg);
                exports.StackTypeNearHere.register(subreg);
            }
        })));
    })(QSSubmenu = exports.QSSubmenu || (exports.QSSubmenu = {}));
    exports.StackAllSelfNear = new UsableActionRegistrar_1.UsableActionGenerator((reg, isMainReg = false) => reg.add(StaticHelper_1.default.QS_INSTANCE.UAPAllSelfNear, UsableAction_1.default
        .requiring({})
        .create({
        slottable: isMainReg,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableSelf,
        icon: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.UAPSelf,
        iconLocationOnItem: Item_1.ItemDetailIconLocation.BottomRight,
        translate: (translator) => translator.name(() => isMainReg
            ? StaticHelper_1.default.TLMain("deposit").addArgs(StaticHelper_1.default.TLMain("allTypes").inContext(ITranslation_1.TextContext.Lowercase), StaticHelper_1.default.TLMain("fromX").addArgs(StaticHelper_1.default.TLMain("fullInventory")))
            : StaticHelper_1.default.TLMain("fromX").addArgs(StaticHelper_1.default.TLMain("fullInventory"))),
        isUsable: (player) => {
            if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                return true;
            if (StaticHelper_1.default.QSLSC.checkSelfNearby())
                return true;
            return false;
        },
        execute: exports.execSASeN
    })));
    const execSASeN = (p) => (0, Actions_1.executeStackAction_notify)(p, [{ self: true, recursive: true }], [{ tiles: true }, { doodads: true }], []);
    exports.execSASeN = execSASeN;
    exports.StackAllMainNear = new UsableActionRegistrar_1.UsableActionGenerator((reg, isMainReg = false) => reg.add(StaticHelper_1.default.QS_INSTANCE.UAPAllMainNear, UsableAction_1.default
        .requiring({})
        .create({
        slottable: isMainReg,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableMain,
        icon: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.UAPMain,
        iconLocationOnItem: Item_1.ItemDetailIconLocation.BottomRight,
        translate: (translator) => translator.name(() => isMainReg
            ? StaticHelper_1.default.TLMain("deposit").addArgs(StaticHelper_1.default.TLMain("allTypes").inContext(ITranslation_1.TextContext.Lowercase), StaticHelper_1.default.TLMain("fromX").addArgs(StaticHelper_1.default.TLMain("mainInventory")))
            : StaticHelper_1.default.TLMain("fromX").addArgs(StaticHelper_1.default.TLMain("mainInventory"))),
        isUsable: (player) => {
            if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                return true;
            if (StaticHelper_1.default.QSLSC.checkSelfNearby())
                return true;
            return false;
        },
        execute: exports.execSAMN
    })));
    const execSAMN = (p) => (0, Actions_1.executeStackAction_notify)(p, [{ self: true }], [{ tiles: true }, { doodads: true }], []);
    exports.execSAMN = execSAMN;
    exports.StackAllSubNear = new UsableActionRegistrar_1.UsableActionGenerator((reg, isMainReg = false) => reg.add(StaticHelper_1.default.QS_INSTANCE.UAPAllSubNear, UsableAction_1.default
        .requiring({ item: { validate: (_, item) => ItemManager_1.default.isContainer(item) || (0, TransferHandler_1.isStorageType)(item.type) } })
        .create({
        slottable: isMainReg,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableSub,
        icon: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.UAPSub,
        iconLocationOnItem: Item_1.ItemDetailIconLocation.BottomRight,
        translate: (translator) => translator.name(({ item }) => {
            const itemStr = item?.getName("indefinite", 1) ?? StaticHelper_1.default.TLMain("thisContainer");
            return isMainReg
                ? StaticHelper_1.default.TLMain("deposit").addArgs(StaticHelper_1.default.TLMain("allTypes").inContext(ITranslation_1.TextContext.Lowercase), StaticHelper_1.default.TLMain("fromX").addArgs(itemStr))
                : StaticHelper_1.default.TLMain("fromX").addArgs(itemStr);
        }),
        isUsable: (player, { item }) => {
            if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                return true;
            if (!(0, TransferHandler_1.isHeldContainer)(player, item))
                return false;
            if (StaticHelper_1.default.QSLSC.checkSpecificNearby(player.island.items.hashContainer(item)))
                return true;
            return false;
        },
        execute: (player, { item }) => (0, Actions_1.executeStackAction)(player, [{ container: [item] }], [{ tiles: true }, { doodads: true }], [])
    })));
    exports.StackTypeSelfNear = new UsableActionRegistrar_1.UsableActionGenerator((reg, isMainReg = false) => reg.add(StaticHelper_1.default.QS_INSTANCE.UAPTypeSelfNear, UsableAction_1.default
        .requiring({ item: { allowOnlyItemType: () => true, validate: () => true } })
        .create({
        slottable: isMainReg,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableSelf,
        icon: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.UAPSelf,
        iconLocationOnItem: Item_1.ItemDetailIconLocation.TopLeft,
        onlySlotItemType: isMainReg ? true : undefined,
        translate: (translator) => translator.name(({ item, itemType }) => isMainReg
            ? StaticHelper_1.default.TLMain("deposit").addArgs(StaticHelper_1.default.TLMain("onlyXType")
                .inContext(ITranslation_1.TextContext.Lowercase)
                .addArgs(!!(item ?? itemType) ? Translation_1.default.nameOf(Dictionary_1.default.Item, (item?.type ?? itemType), 999, false) : undefined), StaticHelper_1.default.TLMain("fromX").addArgs(StaticHelper_1.default.TLMain("fullInventory")))
            : StaticHelper_1.default.TLMain("fromX").addArgs(StaticHelper_1.default.TLMain("fullInventory"))),
        isUsable: (player, { item, itemType }) => {
            if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                return true;
            if (item && item.containedWithin) {
                const iHash = item.island.items.hashContainer(item.containedWithin);
                if (StaticHelper_1.default.QSLSC.checkSelfNearby([item.type])
                    && [StaticHelper_1.default.QSLSC.player, ...StaticHelper_1.default.QSLSC.player.deepSubs()].some(c => c.cHash !== iHash && TransferHandler_1.default.canMatch([{ containedItems: [item] }], [...c.main])))
                    return true;
            }
            else if (StaticHelper_1.default.QSLSC.checkSelfNearby([(item?.type ?? itemType)]))
                return true;
            return false;
        },
        execute: (player, { item, itemType }) => (0, Actions_1.executeStackAction)(player, [{ self: true, recursive: true }], [{ tiles: true }, { doodads: true }], [{ type: (item?.type ?? itemType) }])
    })));
    exports.StackTypeHereNear = new UsableActionRegistrar_1.UsableActionGenerator((reg, isMainReg = false) => reg.add(StaticHelper_1.default.QS_INSTANCE.UAPTypeHereNear, UsableAction_1.default
        .requiring({ item: true })
        .create({
        slottable: false,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableHere,
        icon: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.UAPHere,
        translate: (translator) => translator.name(({ item, itemType }) => isMainReg
            ? StaticHelper_1.default.TLMain("deposit").addArgs(StaticHelper_1.default.TLMain("onlyXType")
                .inContext(ITranslation_1.TextContext.Lowercase)
                .addArgs(!!(item ?? itemType) ? Translation_1.default.nameOf(Dictionary_1.default.Item, (item?.type ?? itemType), 999, false) : undefined), StaticHelper_1.default.TLMain("fromX").addArgs(StaticHelper_1.default.TLMain("here")))
            : StaticHelper_1.default.TLMain("fromX").addArgs(StaticHelper_1.default.TLMain("here"))),
        isUsable: (player, { item }) => {
            if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                return true;
            if (!(0, TransferHandler_1.playerHasItem)(player, item) || !item.containedWithin)
                return false;
            if (StaticHelper_1.default.QSLSC.checkSpecificNearby(player.island.items.hashContainer(item.containedWithin)))
                return true;
            return false;
        },
        execute: (player, { item }, _context) => (0, Actions_1.executeStackAction)(player, [{ container: item.containedWithin }], [{ tiles: true }, { doodads: true }], [{ type: item.type }])
    })));
    exports.StackAllNearSelf = new UsableActionRegistrar_1.UsableActionGenerator((reg, isMainReg = false) => reg.add(StaticHelper_1.default.QS_INSTANCE.UAPAllNearSelf, UsableAction_1.default
        .requiring(isMainReg ? {} : { item: { allowNone: true, validate: () => true } })
        .create({
        slottable: isMainReg,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableSelf,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        icon: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.UAPSelf,
        iconLocationOnItem: Item_1.ItemDetailIconLocation.BottomRight,
        translate: (translator) => translator.name(() => isMainReg
            ? StaticHelper_1.default.TLMain("collect").addArgs(StaticHelper_1.default.TLMain("allTypes").inContext(ITranslation_1.TextContext.Lowercase), StaticHelper_1.default.TLFromTo("fullInventory", "nearby"))
            : StaticHelper_1.default.TLFromTo("fullInventory", "nearby")),
        isUsable: (player, { item }) => {
            if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                return true;
            if (item && !(0, TransferHandler_1.playerHasItem)(player, item))
                return false;
            if (StaticHelper_1.default.QSLSC.checkSelfNearby(undefined, true))
                return true;
            return false;
        },
        execute: exports.execSANSe
    })));
    const execSANSe = (p) => (0, Actions_1.executeStackAction_notify)(p, [{ tiles: true }, { doodads: true }], [{ self: true, recursive: true }], []);
    exports.execSANSe = execSANSe;
    exports.StackAllNearMain = new UsableActionRegistrar_1.UsableActionGenerator((reg, isMainReg = false) => reg.add(StaticHelper_1.default.QS_INSTANCE.UAPAllNearMain, UsableAction_1.default
        .requiring({})
        .create({
        slottable: isMainReg,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableMain,
        icon: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.UAPMain,
        iconLocationOnItem: Item_1.ItemDetailIconLocation.TopLeft,
        translate: (translator) => translator.name(() => isMainReg
            ? StaticHelper_1.default.TLMain("collect").addArgs(StaticHelper_1.default.TLMain("allTypes").inContext(ITranslation_1.TextContext.Lowercase), StaticHelper_1.default.TLFromTo("mainInventory", "nearby"))
            : StaticHelper_1.default.TLFromTo("mainInventory", "nearby")),
        isUsable: (player) => {
            if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                return true;
            if (StaticHelper_1.default.QSLSC.checkSpecificNearby(player.island.items.hashContainer(player.inventory), [], true))
                return true;
            return false;
        },
        execute: exports.execSANM
    })));
    const execSANM = (p) => (0, Actions_1.executeStackAction_notify)(p, [{ tiles: true }, { doodads: true }], [{ self: true }], []);
    exports.execSANM = execSANM;
    exports.StackAllMainSub = new UsableActionRegistrar_1.UsableActionGenerator((reg, isMainReg = false) => reg.add(StaticHelper_1.default.QS_INSTANCE.UAPAllMainSub, UsableAction_1.default
        .requiring({ item: { validate: (_, item) => ItemManager_1.default.isContainer(item) || (0, TransferHandler_1.isStorageType)(item.type) } })
        .create({
        slottable: isMainReg,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableMain,
        icon: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.UAPMain,
        iconLocationOnItem: Item_1.ItemDetailIconLocation.TopLeft,
        translate: (translator) => translator.name(({ item, itemType }) => {
            const itemStr = item ? item.getName(false) : itemType ? Translation_1.default.nameOf(Dictionary_1.default.Item, itemType, 999, false) : StaticHelper_1.default.TLMain("thisContainer");
            return isMainReg
                ? StaticHelper_1.default.TLMain("collect").addArgs(StaticHelper_1.default.TLMain("allTypes").inContext(ITranslation_1.TextContext.Lowercase), StaticHelper_1.default.TLFromTo(itemStr, "mainInventory"))
                : StaticHelper_1.default.TLFromTo(itemStr, "mainInventory");
        }),
        isUsable: (player, { item }) => {
            if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                return true;
            if (!(0, TransferHandler_1.isHeldContainer)(player, item))
                return false;
            if (StaticHelper_1.default.QSLSC.checkSpecific(player.island.items.hashContainer(player.inventory), player.island.items.hashContainer(item)))
                return true;
            return false;
        },
        execute: (p, u) => (0, Actions_1.executeStackAction)(p, [{ self: true }], [{ container: u.item }], [])
    })));
    exports.StackAllNearSub = new UsableActionRegistrar_1.UsableActionGenerator((reg, isMainReg = false) => reg.add(StaticHelper_1.default.QS_INSTANCE.UAPAllNearSub, UsableAction_1.default
        .requiring({ item: { validate: (_, item) => ItemManager_1.default.isContainer(item) || (0, TransferHandler_1.isStorageType)(item.type) } })
        .create({
        slottable: isMainReg,
        iconLocationOnItem: Item_1.ItemDetailIconLocation.TopLeft,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableNear,
        icon: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.UAPNearby,
        translate: (translator) => translator.name(({ item, itemType }) => {
            const itemStr = item ? item.getName(false) : itemType ? Translation_1.default.nameOf(Dictionary_1.default.Item, itemType, 999, false) : StaticHelper_1.default.TLMain("thisContainer");
            return isMainReg
                ? StaticHelper_1.default.TLMain("collect").addArgs(StaticHelper_1.default.TLMain("allTypes").inContext(ITranslation_1.TextContext.Lowercase), StaticHelper_1.default.TLFromTo(itemStr, "nearby"))
                : StaticHelper_1.default.TLFromTo(itemStr, "nearby");
        }),
        isUsable: (player, { item }) => {
            if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                return true;
            if (!(0, TransferHandler_1.isHeldContainer)(player, item))
                return false;
            if (StaticHelper_1.default.QSLSC.checkSpecificNearby(player.island.items.hashContainer(item), undefined, true))
                return true;
            return false;
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
            ? StaticHelper_1.default.TLMain("collect").addArgs(StaticHelper_1.default.TLMain("allTypes").inContext(ITranslation_1.TextContext.Lowercase), StaticHelper_1.default.TLFromTo("here", "fullInventory"))
            : StaticHelper_1.default.TLFromTo("here", "fullInventory")),
        isUsable: (player, { item }) => {
            if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                return true;
            if ((0, TransferHandler_1.playerHasItem)(player, item) || !item.containedWithin)
                return false;
            if (StaticHelper_1.default.QSLSC.checkSelfSpecific(player.island.items.hashContainer(item.containedWithin)))
                return true;
            return false;
        },
        execute: (player, { item }, _context) => (0, Actions_1.executeStackAction)(player, [{ self: true, recursive: true }], [{ container: item.containedWithin }], [])
    })));
    exports.StackAllNearHere = new UsableActionRegistrar_1.UsableActionGenerator((reg, isMainReg = false) => reg.add("StackAllNearHere", UsableAction_1.default
        .requiring({ item: true })
        .create({
        slottable: false,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableNear,
        icon: StaticHelper_1.default.QS_INSTANCE.UAPHere,
        translate: (translator) => translator.name(() => isMainReg
            ? StaticHelper_1.default.TLMain("collect").addArgs(StaticHelper_1.default.TLMain("allTypes").inContext(ITranslation_1.TextContext.Lowercase), StaticHelper_1.default.TLFromTo("here", "nearby"))
            : StaticHelper_1.default.TLFromTo("here", "nearby")),
        isUsable: (player, { item }) => {
            if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                return true;
            if (item.containedWithin === undefined)
                return false;
            if (StaticHelper_1.default.QSLSC.checkSpecificNearby(player.island.items.hashContainer(item.containedWithin), undefined, true))
                return true;
            return false;
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
            ? StaticHelper_1.default.TLMain("collect").addArgs(StaticHelper_1.default.TLMain("onlyXType")
                .inContext(ITranslation_1.TextContext.Lowercase)
                .addArgs(!!(item ?? itemType) ? Translation_1.default.nameOf(Dictionary_1.default.Item, (item?.type ?? itemType), 999, false) : undefined), StaticHelper_1.default.TLFromTo("here", "fullInventory"))
            : StaticHelper_1.default.TLFromTo("here", "fullInventory")),
        isUsable: (player, { item }) => {
            if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                return true;
            if ((0, TransferHandler_1.playerHasItem)(player, item) || !item.containedWithin)
                return false;
            if (StaticHelper_1.default.QSLSC.checkSelfSpecific(player.island.items.hashContainer(item.containedWithin), [item.type]))
                return true;
            return false;
        },
        execute: (player, { item }, _context) => (0, Actions_1.executeStackAction)(player, (0, TransferHandler_1.playerHasItem)(player, item)
            ? [{ container: [player.inventory, ...(0, TransferHandler_1.playerHeldContainers)(player)].filter(c => c !== item.containedWithin) }]
            : [{ self: true, recursive: true }], [{ container: item.containedWithin }], [{ type: item.type }])
    })));
    exports.StackTypeNearHere = new UsableActionRegistrar_1.UsableActionGenerator((reg, isMainReg = false) => reg.add("StackTypeNearHere", UsableAction_1.default
        .requiring({ item: true })
        .create({
        slottable: false,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableNear,
        icon: StaticHelper_1.default.QS_INSTANCE.UAPNearby,
        translate: (translator) => translator.name(({ item, itemType }) => isMainReg
            ? StaticHelper_1.default.TLMain("collect").addArgs(StaticHelper_1.default.TLMain("onlyXType")
                .inContext(ITranslation_1.TextContext.Lowercase)
                .addArgs(!!(item ?? itemType) ? Translation_1.default.nameOf(Dictionary_1.default.Item, (item?.type ?? itemType), 999, false) : undefined), StaticHelper_1.default.TLFromTo("here", "nearby"))
            : StaticHelper_1.default.TLFromTo("here", "nearby")),
        isUsable: (player, { item }) => {
            if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                return true;
            if (!item.containedWithin)
                return false;
            if (StaticHelper_1.default.QSLSC.checkSpecificNearby(player.island.items.hashContainer(item.containedWithin), [item.type], true))
                return true;
            return false;
        },
        execute: (player, { item }, _context) => (0, Actions_1.executeStackAction)(player, (0, TransferHandler_1.playerHasItem)(player, item)
            ? [{ doodads: true }, { tiles: true }]
            : [{ container: (0, TransferHandler_1.validNearby)(player).filter(c => c !== item.containedWithin) }], [{ container: item.containedWithin }], [{ type: item.type }])
    })));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNhYmxlQWN0aW9uc1F1aWNrU3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9ucy9Vc2FibGVBY3Rpb25zUXVpY2tTdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBZ0JhLFFBQUEsdUJBQXVCLEdBQUcsSUFBSSw2Q0FBcUIsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUVuRSxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoQyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVoQyx3QkFBZ0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3JDLHdCQUFnQixDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDckMsdUJBQWUsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRXBDLHlCQUFpQixDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdEMseUJBQWlCLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0Qyx3QkFBZ0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3JDLHdCQUFnQixDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDckMsdUJBQWUsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3BDLHVCQUFlLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwQyx3QkFBZ0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3JDLHdCQUFnQixDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDckMseUJBQWlCLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0Qyx5QkFBaUIsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzFDLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBaUIsU0FBUyxDQTJOekI7SUEzTkQsV0FBaUIsU0FBUztRQVVULGlCQUFPLEdBQUcsSUFBSSw2Q0FBcUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsY0FBYyxFQUFFLHNCQUFZO2FBQ2hILFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUM7YUFDOUQsTUFBTSxDQUFDO1lBQ0osWUFBWSxFQUFFLDRCQUFrQixDQUFDLE1BQU07WUFDdkMsU0FBUyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLHNCQUFZLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzFFLFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQVcsRUFBRTtnQkFDakMsSUFBRywyQkFBWSxDQUFDLGNBQWMsSUFBSSwyQkFBWSxDQUFDLFdBQVc7b0JBQUUsT0FBTyxJQUFJLENBQUM7Z0JBQ3hFLE9BQU8sSUFBSSxDQUFDO1lBWWhCLENBQUM7WUFDRCxPQUFPLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFDaEIsU0FBUyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3RDLFNBQVMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzNDLENBQUM7U0FDSixDQUFDLENBQ0wsQ0FBQyxDQUFDO1FBR1Usb0JBQVUsR0FBRyxJQUFJLDZDQUFxQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxzQkFBWTthQUM1RixTQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDO2FBQzlELE1BQU0sQ0FBQztZQUNKLFlBQVksRUFBRSw0QkFBa0IsQ0FBQyxNQUFNO1lBQ3ZDLFFBQVEsRUFBRSxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxXQUFXO1lBQzlDLFNBQVMsRUFBRSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxzQkFBWSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMzRSxJQUFJLEVBQUUsc0JBQVksQ0FBQyxXQUFXLENBQUMsTUFBTTtZQUNyQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7Z0JBQ3hCLElBQUcsMkJBQVksQ0FBQyxjQUFjLElBQUksMkJBQVksQ0FBQyxXQUFXO29CQUFFLE9BQU8sSUFBSSxDQUFDO2dCQUN4RSxPQUFPLElBQUksQ0FBQztZQWVoQixDQUFDO1lBQ0QsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUU7Z0JBQ2hCLHdCQUFnQixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbEMsd0JBQWdCLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNsQyx1QkFBZSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNyQyxDQUFDO1NBQ0osQ0FBQyxDQUNMLENBQUMsQ0FBQztRQUdVLHFCQUFXLEdBQUcsSUFBSSw2Q0FBcUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsc0JBQVk7YUFDOUYsU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDO2FBQ3pCLE1BQU0sQ0FBQztZQUNKLFlBQVksRUFBRSw0QkFBa0IsQ0FBQyxNQUFNO1lBQ3ZDLFFBQVEsRUFBRSxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxZQUFZO1lBQy9DLElBQUksRUFBRSxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxPQUFPO1lBQ3RDLFNBQVMsRUFBRSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUU7Z0JBQzlELE1BQU0sR0FBRyxHQUFHLElBQUEsK0JBQWUsRUFBQyxJQUFJLEVBQUUsSUFBSSxJQUFJLFFBQVEsSUFBSSxxQkFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUM3RSxPQUFPLHNCQUFZLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUM1QyxDQUFDLEdBQUcsQ0FBQyxNQUFNO29CQUNQLENBQUMsQ0FBQzt3QkFDRSxzQkFBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsc0JBQVksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQzt3QkFDM0Usc0JBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLHFCQUFXLENBQUMsb0JBQW9CLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO3FCQUNwRixDQUFDLENBQUMsQ0FBQztvQkFDQSxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDOzJCQUNsRCxDQUFDLFFBQVE7NEJBQ1IsQ0FBQyxDQUFDLHFCQUFXLENBQUMsTUFBTSxDQUFDLG9CQUFVLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUM7NEJBQ3RELENBQUMsQ0FBQyxTQUFTLENBQUM7aUJBQ25CLENBQUMsQ0FDVCxDQUFDO1lBQ04sQ0FBQyxDQUFDO1lBQ0YsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUN4QixJQUFHLDJCQUFZLENBQUMsY0FBYyxJQUFJLDJCQUFZLENBQUMsV0FBVztvQkFBRSxPQUFPLElBQUksQ0FBQztnQkFDeEUsT0FBTyxJQUFJLENBQUM7WUFDaEIsQ0FBQztZQUNELE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFO2dCQUNoQix5QkFBaUIsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ25DLHlCQUFpQixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN2QyxDQUFDO1NBQ0osQ0FBQyxDQUNMLENBQUMsQ0FBQztRQWVVLGlCQUFPLEdBQUcsSUFBSSw2Q0FBcUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsY0FBYyxFQUFFLHNCQUFZO2FBQ2hILFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUM7YUFDOUQsTUFBTSxDQUFDO1lBQ0osWUFBWSxFQUFFLDRCQUFrQixDQUFDLE1BQU07WUFDdkMsU0FBUyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLHNCQUFZLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzFFLFlBQVksRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJO1lBQ3hCLFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDeEIsSUFBRywyQkFBWSxDQUFDLGNBQWMsSUFBSSwyQkFBWSxDQUFDLFdBQVc7b0JBQUUsT0FBTyxJQUFJLENBQUM7Z0JBQ3hFLE9BQU8sSUFBSSxDQUFDO2dCQUVaLE9BQVEsU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFrRixDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsTUFBTTt1QkFDeEosU0FBUyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFrRixDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDO1lBQ3RLLENBQUM7WUFDRCxPQUFPLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFFaEIsU0FBUyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBRXRDLFNBQVMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzNDLENBQUM7U0FDSixDQUFDLENBQ0wsQ0FBQyxDQUFDO1FBR1Usb0JBQVUsR0FBRyxJQUFJLDZDQUFxQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxzQkFBWTthQUM1RixTQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDO2FBQzlELE1BQU0sQ0FBQztZQUNKLFlBQVksRUFBRSw0QkFBa0IsQ0FBQyxNQUFNO1lBQ3ZDLFFBQVEsRUFBRSxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxXQUFXO1lBQzlDLFNBQVMsRUFBRSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxzQkFBWSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMzRSxJQUFJLEVBQUUsc0JBQVksQ0FBQyxXQUFXLENBQUMsTUFBTTtZQUNyQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO2dCQUMzQixJQUFHLDJCQUFZLENBQUMsY0FBYyxJQUFJLDJCQUFZLENBQUMsV0FBVztvQkFBRSxPQUFPLElBQUksQ0FBQztnQkFDeEUsT0FBTyxJQUFJLENBQUM7Z0JBcUJaLE9BQU8sS0FBSyxDQUFDO1lBQ2pCLENBQUM7WUFDRCxPQUFPLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFDaEIsd0JBQWdCLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNsQyx3QkFBZ0IsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ2xDLHVCQUFlLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNqQyx1QkFBZSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDakMsd0JBQWdCLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNsQyx3QkFBZ0IsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdEMsQ0FBQztTQUNKLENBQUMsQ0FDTCxDQUFDLENBQUM7UUFHVSxxQkFBVyxHQUFHLElBQUksNkNBQXFCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLHNCQUFZO2FBQzlGLFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQzthQUN6QixNQUFNLENBQUM7WUFDSixZQUFZLEVBQUUsNEJBQWtCLENBQUMsTUFBTTtZQUN2QyxRQUFRLEVBQUUsc0JBQVksQ0FBQyxXQUFXLENBQUMsWUFBWTtZQUMvQyxJQUFJLEVBQUUsc0JBQVksQ0FBQyxXQUFXLENBQUMsT0FBTztZQUN0QyxTQUFTLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFO2dCQUM5RCxNQUFNLEdBQUcsR0FBRyxJQUFBLCtCQUFlLEVBQUMsSUFBSSxFQUFFLElBQUksSUFBSSxRQUFRLElBQUkscUJBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDN0UsT0FBTyxzQkFBWSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FDNUMsQ0FBQyxHQUFHLENBQUMsTUFBTTtvQkFDUCxDQUFDLENBQUM7d0JBQ0Usc0JBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLHNCQUFZLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUM7d0JBQzNFLHNCQUFZLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxxQkFBVyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztxQkFDcEYsQ0FBQyxDQUFDLENBQUM7b0JBQ0EsSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQzsyQkFDbEQsQ0FBQyxRQUFROzRCQUNSLENBQUMsQ0FBQyxxQkFBVyxDQUFDLE1BQU0sQ0FBQyxvQkFBVSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDOzRCQUN0RCxDQUFDLENBQUMsU0FBUyxDQUFDO2lCQUNuQixDQUFDLENBQ1QsQ0FBQztZQUNOLENBQUMsQ0FBQztZQUNGLFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDeEIsSUFBRywyQkFBWSxDQUFDLGNBQWMsSUFBSSwyQkFBWSxDQUFDLFdBQVc7b0JBQUUsT0FBTyxJQUFJLENBQUM7Z0JBQ3hFLE9BQVEseUJBQWlCLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBb0U7cUJBQzNHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsS0FBNkUsQ0FBQyxDQUFDLE1BQU07dUJBQ25HLHlCQUFpQixDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQW9FO3lCQUN2RyxRQUFRLENBQUMsTUFBTSxFQUFFLEtBQTZFLENBQUMsQ0FBQyxNQUFNLENBQUM7WUFDcEgsQ0FBQztZQUNELE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFO2dCQUNoQix5QkFBaUIsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ25DLHlCQUFpQixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN2QyxDQUFDO1NBQ0osQ0FBQyxDQUNMLENBQUMsQ0FBQztJQUVQLENBQUMsRUEzTmdCLFNBQVMsR0FBVCxpQkFBUyxLQUFULGlCQUFTLFFBMk56QjtJQVVZLFFBQUEsZ0JBQWdCLEdBQUcsSUFBSSw2Q0FBcUIsQ0FBQyxDQUFDLEdBQUcsRUFBRSxZQUFxQixLQUFLLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsY0FBYyxFQUFFLHNCQUFZO1NBQ3ZKLFNBQVMsQ0FBQyxFQUFFLENBQUM7U0FDYixNQUFNLENBQUM7UUFDSixTQUFTLEVBQUUsU0FBUztRQUNwQixZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyw0QkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLDRCQUFrQixDQUFDLE1BQU07UUFDOUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxZQUFZO1FBQ3ZFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsT0FBTztRQUM5RCxrQkFBa0IsRUFBRSw2QkFBc0IsQ0FBQyxXQUFXO1FBQ3RELFNBQVMsRUFBRSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FDNUMsU0FBUztZQUNMLENBQUMsQ0FBQyxzQkFBWSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQ3BDLHNCQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQywwQkFBVyxDQUFDLFNBQVMsQ0FBQyxFQUNoRSxzQkFBWSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsc0JBQVksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUMvRSxDQUFDLENBQUMsc0JBQVksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLHNCQUFZLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQ25GO1FBQ0QsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDakIsSUFBRywyQkFBWSxDQUFDLGNBQWM7Z0JBQUUsT0FBTyxJQUFJLENBQUM7WUFDNUMsSUFBRyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUU7Z0JBQUUsT0FBTyxJQUFJLENBQUM7WUFFckQsT0FBTyxLQUFLLENBQUM7UUFFakIsQ0FBQztRQUNELE9BQU8sRUFBRSxpQkFBUztLQUNyQixDQUFDLENBQ0wsQ0FBQyxDQUFDO0lBRUksTUFBTSxTQUFTLEdBQUcsQ0FBQyxDQUFTLEVBQVcsRUFBRSxDQUFDLElBQUEsbUNBQXlCLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUE5SSxRQUFBLFNBQVMsYUFBcUk7SUFTOUksUUFBQSxnQkFBZ0IsR0FBRyxJQUFJLDZDQUFxQixDQUFDLENBQUMsR0FBRyxFQUFFLFlBQXFCLEtBQUssRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxjQUFjLEVBQUUsc0JBQVk7U0FDdkosU0FBUyxDQUFDLEVBQUUsQ0FBQztTQUNiLE1BQU0sQ0FBQztRQUNKLFNBQVMsRUFBRSxTQUFTO1FBQ3BCLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLDRCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsNEJBQWtCLENBQUMsTUFBTTtRQUM5RSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLHNCQUFZLENBQUMsV0FBVyxDQUFDLFlBQVk7UUFDdkUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxPQUFPO1FBQzlELGtCQUFrQixFQUFFLDZCQUFzQixDQUFDLFdBQVc7UUFDdEQsU0FBUyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUM1QyxTQUFTO1lBQ0wsQ0FBQyxDQUFDLHNCQUFZLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FDcEMsc0JBQVksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLDBCQUFXLENBQUMsU0FBUyxDQUFDLEVBQ2hFLHNCQUFZLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxzQkFBWSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQy9FLENBQUMsQ0FBQyxzQkFBWSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsc0JBQVksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FDbkY7UUFDRCxRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUNqQixJQUFHLDJCQUFZLENBQUMsY0FBYztnQkFBRSxPQUFPLElBQUksQ0FBQztZQUM1QyxJQUFHLHNCQUFZLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRTtnQkFBRSxPQUFPLElBQUksQ0FBQztZQUNyRCxPQUFPLEtBQUssQ0FBQztRQUVqQixDQUFDO1FBQ0QsT0FBTyxFQUFFLGdCQUFRO0tBRXBCLENBQUMsQ0FDTCxDQUFDLENBQUM7SUFFSSxNQUFNLFFBQVEsR0FBRyxDQUFDLENBQVMsRUFBVyxFQUFFLENBQUMsSUFBQSxtQ0FBeUIsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUE1SCxRQUFBLFFBQVEsWUFBb0g7SUFZNUgsUUFBQSxlQUFlLEdBQUcsSUFBSSw2Q0FBcUIsQ0FBQyxDQUFDLEdBQUcsRUFBRSxZQUFxQixLQUFLLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLHNCQUFZO1NBQ3JKLFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLHFCQUFXLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUEsK0JBQWEsRUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO1NBQ3pHLE1BQU0sQ0FBQztRQUNKLFNBQVMsRUFBRSxTQUFTO1FBQ3BCLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLDRCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsNEJBQWtCLENBQUMsTUFBTTtRQUM5RSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLHNCQUFZLENBQUMsV0FBVyxDQUFDLFdBQVc7UUFDdEUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxNQUFNO1FBQzdELGtCQUFrQixFQUFFLDZCQUFzQixDQUFDLFdBQVc7UUFDdEQsU0FBUyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQ3BELE1BQU0sT0FBTyxHQUFHLElBQUksRUFBRSxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLHNCQUFZLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3ZGLE9BQU8sU0FBUztnQkFDWixDQUFDLENBQUMsc0JBQVksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUNwQyxzQkFBWSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLENBQUMsMEJBQVcsQ0FBQyxTQUFTLENBQUMsRUFDaEUsc0JBQVksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNsRCxDQUFDLENBQUMsc0JBQVksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hELENBQUMsQ0FBQztRQUNGLFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7WUFDM0IsSUFBRywyQkFBWSxDQUFDLGNBQWM7Z0JBQUUsT0FBTyxJQUFJLENBQUM7WUFDNUMsSUFBRyxDQUFDLElBQUEsaUNBQWUsRUFBQyxNQUFNLEVBQUUsSUFBSSxDQUFDO2dCQUFFLE9BQU8sS0FBSyxDQUFDO1lBQ2hELElBQUcsc0JBQVksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUFFLE9BQU8sSUFBSSxDQUFDO1lBQ2hHLE9BQU8sS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFDRCxPQUFPLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBQSw0QkFBa0IsRUFBQyxNQUFNLEVBQ3BELENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxJQUFrQixDQUFDLEVBQUUsQ0FBQyxFQUNyQyxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQ3BDLEVBQUUsQ0FBQztLQUNWLENBQUMsQ0FDTCxDQUFDLENBQUM7SUE2RFUsUUFBQSxpQkFBaUIsR0FBRyxJQUFJLDZDQUFxQixDQUFDLENBQUMsR0FBRyxFQUFFLFlBQXFCLEtBQUssRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxlQUFlLEVBQUUsc0JBQVk7U0FDekosU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDO1NBQzVFLE1BQU0sQ0FBQztRQUNKLFNBQVMsRUFBRSxTQUFTO1FBQ3BCLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLDRCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsNEJBQWtCLENBQUMsTUFBTTtRQUM5RSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLHNCQUFZLENBQUMsV0FBVyxDQUFDLFlBQVk7UUFDdkUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxPQUFPO1FBQzlELGtCQUFrQixFQUFFLDZCQUFzQixDQUFDLE9BQU87UUFDbEQsZ0JBQWdCLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVM7UUFDOUMsU0FBUyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUM5RCxTQUFTO1lBQ0wsQ0FBQyxDQUFDLHNCQUFZLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FDcEMsc0JBQVksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO2lCQUMzQixTQUFTLENBQUMsMEJBQVcsQ0FBQyxTQUFTLENBQUM7aUJBQ2hDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLHFCQUFXLENBQUMsTUFBTSxDQUFDLG9CQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksSUFBSSxRQUFRLENBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUMzSCxzQkFBWSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsc0JBQVksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUMvRSxDQUFDLENBQUMsc0JBQVksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLHNCQUFZLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQ25GO1FBQ0QsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUU7WUFDckMsSUFBRywyQkFBWSxDQUFDLGNBQWM7Z0JBQUUsT0FBTyxJQUFJLENBQUM7WUFDNUMsSUFBRyxJQUFJLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtnQkFDN0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDcEUsSUFBRyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSyxDQUFDLENBQUM7dUJBQzVDLENBQUMsc0JBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEdBQUcsc0JBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQzdFLENBQUMsQ0FBQyxLQUFLLEtBQUssS0FBSyxJQUFJLHlCQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxjQUFjLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUMvRixPQUFPLElBQUksQ0FBQzthQUNqQjtpQkFBTSxJQUFHLHNCQUFZLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksSUFBSSxRQUFRLENBQUUsQ0FBQyxDQUFDO2dCQUFFLE9BQU8sSUFBSSxDQUFDO1lBQ3ZGLE9BQU8sS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFDRCxPQUFPLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUEsNEJBQWtCLEVBQUMsTUFBTSxFQUM5RCxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFDakMsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUNwQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksSUFBSSxRQUFRLENBQUUsRUFBRSxDQUFDLENBQUM7S0FDN0MsQ0FBQyxDQUNMLENBQUMsQ0FBQztJQWFVLFFBQUEsaUJBQWlCLEdBQUcsSUFBSSw2Q0FBcUIsQ0FBQyxDQUFDLEdBQUcsRUFBRSxZQUFxQixLQUFLLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsZUFBZSxFQUFFLHNCQUFZO1NBQ3pKLFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQztTQUN6QixNQUFNLENBQUM7UUFDSixTQUFTLEVBQUUsS0FBSztRQUNoQixZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyw0QkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLDRCQUFrQixDQUFDLE1BQU07UUFDOUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxZQUFZO1FBQ3ZFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsT0FBTztRQUM5RCxTQUFTLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQzlELFNBQVM7WUFDTCxDQUFDLENBQUMsc0JBQVksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUNwQyxzQkFBWSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7aUJBQzNCLFNBQVMsQ0FBQywwQkFBVyxDQUFDLFNBQVMsQ0FBQztpQkFDaEMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMscUJBQVcsQ0FBQyxNQUFNLENBQUMsb0JBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxJQUFJLFFBQVEsQ0FBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQzNILHNCQUFZLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxzQkFBWSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3RFLENBQUMsQ0FBQyxzQkFBWSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsc0JBQVksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FDMUU7UUFDRCxRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQzNCLElBQUcsMkJBQVksQ0FBQyxjQUFjO2dCQUFFLE9BQU8sSUFBSSxDQUFDO1lBQzVDLElBQUcsQ0FBQyxJQUFBLCtCQUFhLEVBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWU7Z0JBQUUsT0FBTyxLQUFLLENBQUM7WUFDdkUsSUFBRyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUFFLE9BQU8sSUFBSSxDQUFDO1lBQ2hILE9BQU8sS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFDRCxPQUFPLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLElBQUEsNEJBQWtCLEVBQUMsTUFBTSxFQUM5RCxDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxlQUFnQixFQUFFLENBQUMsRUFDdEMsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUNwQyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0tBRTdCLENBQUMsQ0FDTCxDQUFDLENBQUM7SUFXVSxRQUFBLGdCQUFnQixHQUFHLElBQUksNkNBQXFCLENBQUMsQ0FBQyxHQUFHLEVBQUUsWUFBcUIsS0FBSyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLHNCQUFZLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSxzQkFBWTtTQUN2SixTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQztTQUMvRSxNQUFNLENBQUM7UUFDSixTQUFTLEVBQUUsU0FBUztRQUNwQixRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLHNCQUFZLENBQUMsV0FBVyxDQUFDLFlBQVk7UUFDdkUsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsNEJBQWtCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyw0QkFBa0IsQ0FBQyxNQUFNO1FBQzlFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsT0FBTztRQUM5RCxrQkFBa0IsRUFBRSw2QkFBc0IsQ0FBQyxXQUFXO1FBQ3RELFNBQVMsRUFBRSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FDNUMsU0FBUztZQUNMLENBQUMsQ0FBQyxzQkFBWSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQ3BDLHNCQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQywwQkFBVyxDQUFDLFNBQVMsQ0FBQyxFQUNoRSxzQkFBWSxDQUFDLFFBQVEsQ0FBQyxlQUFlLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDckQsQ0FBQyxDQUFDLHNCQUFZLENBQUMsUUFBUSxDQUFDLGVBQWUsRUFBRSxRQUFRLENBQUMsQ0FDekQ7UUFDRCxRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQzNCLElBQUcsMkJBQVksQ0FBQyxjQUFjO2dCQUFFLE9BQU8sSUFBSSxDQUFDO1lBQzVDLElBQUcsSUFBSSxJQUFJLENBQUMsSUFBQSwrQkFBYSxFQUFDLE1BQU0sRUFBRSxJQUFJLENBQUM7Z0JBQUUsT0FBTyxLQUFLLENBQUM7WUFDdEQsSUFBRyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQztnQkFBRSxPQUFPLElBQUksQ0FBQztZQUNwRSxPQUFPLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBQ0QsT0FBTyxFQUFFLGlCQUFTO0tBQ3JCLENBQUMsQ0FDTCxDQUFDLENBQUM7SUFFSSxNQUFNLFNBQVMsR0FBRyxDQUFDLENBQVMsRUFBVyxFQUFFLENBQUMsSUFBQSxtQ0FBeUIsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQTlJLFFBQUEsU0FBUyxhQUFxSTtJQVU5SSxRQUFBLGdCQUFnQixHQUFHLElBQUksNkNBQXFCLENBQUMsQ0FBQyxHQUFHLEVBQUUsWUFBcUIsS0FBSyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLHNCQUFZLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSxzQkFBWTtTQUN2SixTQUFTLENBQUMsRUFBRSxDQUFDO1NBQ2IsTUFBTSxDQUFDO1FBQ0osU0FBUyxFQUFFLFNBQVM7UUFDcEIsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsNEJBQWtCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyw0QkFBa0IsQ0FBQyxNQUFNO1FBQzlFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsWUFBWTtRQUN2RSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLHNCQUFZLENBQUMsV0FBVyxDQUFDLE9BQU87UUFDOUQsa0JBQWtCLEVBQUUsNkJBQXNCLENBQUMsT0FBTztRQUNsRCxTQUFTLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQzVDLFNBQVM7WUFDTCxDQUFDLENBQUMsc0JBQVksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUNwQyxzQkFBWSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLENBQUMsMEJBQVcsQ0FBQyxTQUFTLENBQUMsRUFDaEUsc0JBQVksQ0FBQyxRQUFRLENBQUMsZUFBZSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3JELENBQUMsQ0FBQyxzQkFBWSxDQUFDLFFBQVEsQ0FBQyxlQUFlLEVBQUUsUUFBUSxDQUFDLENBQ3pEO1FBQ0QsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDakIsSUFBRywyQkFBWSxDQUFDLGNBQWM7Z0JBQUUsT0FBTyxJQUFJLENBQUM7WUFDNUMsSUFBRyxzQkFBWSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUM7Z0JBQUUsT0FBTyxJQUFJLENBQUM7WUFDdEgsT0FBTyxLQUFLLENBQUM7UUFDakIsQ0FBQztRQUNELE9BQU8sRUFBRSxnQkFBUTtLQUNwQixDQUFDLENBQ0wsQ0FBQyxDQUFDO0lBRUksTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFTLEVBQVcsRUFBRSxDQUFDLElBQUEsbUNBQXlCLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFBNUgsUUFBQSxRQUFRLFlBQW9IO0lBRTVILFFBQUEsZUFBZSxHQUFHLElBQUksNkNBQXFCLENBQUMsQ0FBQyxHQUFHLEVBQUUsWUFBcUIsS0FBSyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLHNCQUFZLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxzQkFBWTtTQUNySixTQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxxQkFBVyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFBLCtCQUFhLEVBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztTQUN6RyxNQUFNLENBQUM7UUFDSixTQUFTLEVBQUUsU0FBUztRQUNwQixZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyw0QkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLDRCQUFrQixDQUFDLE1BQU07UUFDOUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxZQUFZO1FBQ3ZFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsT0FBTztRQUM5RCxrQkFBa0IsRUFBRSw2QkFBc0IsQ0FBQyxPQUFPO1FBQ2xELFNBQVMsRUFBRSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUU7WUFDOUQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLHFCQUFXLENBQUMsTUFBTSxDQUFDLG9CQUFVLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLHNCQUFZLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3pKLE9BQU8sU0FBUztnQkFDWixDQUFDLENBQUMsc0JBQVksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUNwQyxzQkFBWSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLENBQUMsMEJBQVcsQ0FBQyxTQUFTLENBQUMsRUFDaEUsc0JBQVksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLGVBQWUsQ0FBQyxDQUFDO2dCQUNwRCxDQUFDLENBQUMsc0JBQVksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQzFELENBQUMsQ0FBQztRQUNGLFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7WUFDM0IsSUFBRywyQkFBWSxDQUFDLGNBQWM7Z0JBQUUsT0FBTyxJQUFJLENBQUM7WUFDNUMsSUFBRyxDQUFDLElBQUEsaUNBQWUsRUFBQyxNQUFNLEVBQUUsSUFBSSxDQUFDO2dCQUFFLE9BQU8sS0FBSyxDQUFDO1lBQ2hELElBQUcsc0JBQVksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUFFLE9BQU8sSUFBSSxDQUFDO1lBQy9JLE9BQU8sS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFDRCxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFBLDRCQUFrQixFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsSUFBa0IsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO0tBQ3hHLENBQUMsQ0FDTCxDQUFDLENBQUM7SUFFVSxRQUFBLGVBQWUsR0FBRyxJQUFJLDZDQUFxQixDQUFDLENBQUMsR0FBRyxFQUFFLFlBQXFCLEtBQUssRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsc0JBQVk7U0FDckosU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMscUJBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksSUFBQSwrQkFBYSxFQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7U0FDekcsTUFBTSxDQUFDO1FBQ0osU0FBUyxFQUFFLFNBQVM7UUFDcEIsa0JBQWtCLEVBQUUsNkJBQXNCLENBQUMsT0FBTztRQUNsRCxZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyw0QkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLDRCQUFrQixDQUFDLE1BQU07UUFDOUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxZQUFZO1FBQ3ZFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsU0FBUztRQUNoRSxTQUFTLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFO1lBQzlELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxxQkFBVyxDQUFDLE1BQU0sQ0FBQyxvQkFBVSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxzQkFBWSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUN6SixPQUFPLFNBQVM7Z0JBQ1osQ0FBQyxDQUFDLHNCQUFZLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FDcEMsc0JBQVksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLDBCQUFXLENBQUMsU0FBUyxDQUFDLEVBQ2hFLHNCQUFZLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDN0MsQ0FBQyxDQUFDLHNCQUFZLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNuRCxDQUFDLENBQUM7UUFDRixRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQzNCLElBQUcsMkJBQVksQ0FBQyxjQUFjO2dCQUFFLE9BQU8sSUFBSSxDQUFDO1lBQzVDLElBQUcsQ0FBQyxJQUFBLGlDQUFlLEVBQUMsTUFBTSxFQUFFLElBQUksQ0FBQztnQkFBRSxPQUFPLEtBQUssQ0FBQztZQUNoRCxJQUFHLHNCQUFZLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDO2dCQUFFLE9BQU8sSUFBSSxDQUFDO1lBQ2pILE9BQU8sS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFDRCxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFBLDRCQUFrQixFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsSUFBa0IsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO0tBQzVILENBQUMsQ0FDTCxDQUFDLENBQUM7SUFFVSxRQUFBLGdCQUFnQixHQUFHLElBQUksNkNBQXFCLENBQUMsQ0FBQyxHQUFHLEVBQUUsWUFBcUIsS0FBSyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUErQyxzQkFBWTtTQUMvSyxTQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUM7U0FDekIsTUFBTSxDQUFDO1FBQ0osU0FBUyxFQUFFLEtBQUs7UUFDaEIsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsNEJBQWtCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyw0QkFBa0IsQ0FBQyxNQUFNO1FBQzlFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsc0JBQVksQ0FBQyxXQUFXLENBQUMsWUFBWTtRQUN2RSxJQUFJLEVBQUUsc0JBQVksQ0FBQyxXQUFXLENBQUMsT0FBTztRQUN0QyxTQUFTLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQzVDLFNBQVM7WUFDTCxDQUFDLENBQUMsc0JBQVksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUNwQyxzQkFBWSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLENBQUMsMEJBQVcsQ0FBQyxTQUFTLENBQUMsRUFDaEUsc0JBQVksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQ25ELENBQUMsQ0FBQyxzQkFBWSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsZUFBZSxDQUFDLENBQ3ZEO1FBQ0QsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUMzQixJQUFHLDJCQUFZLENBQUMsY0FBYztnQkFBRSxPQUFPLElBQUksQ0FBQztZQUM1QyxJQUFHLElBQUEsK0JBQWEsRUFBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZTtnQkFBRSxPQUFPLEtBQUssQ0FBQztZQUN0RSxJQUFHLHNCQUFZLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBQUUsT0FBTyxJQUFJLENBQUM7WUFDOUcsT0FBTyxLQUFLLENBQUM7UUFDakIsQ0FBQztRQUNELE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsSUFBQSw0QkFBa0IsRUFBQyxNQUFNLEVBQzlELENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUNqQyxDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxlQUFnQixFQUFFLENBQUMsRUFDdEMsRUFBRSxDQUFDO0tBQ1YsQ0FBQyxDQUNMLENBQUMsQ0FBQztJQUVVLFFBQUEsZ0JBQWdCLEdBQUcsSUFBSSw2Q0FBcUIsQ0FBQyxDQUFDLEdBQUcsRUFBRSxZQUFxQixLQUFLLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQWlELHNCQUFZO1NBQ2pMLFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQztTQUN6QixNQUFNLENBQUM7UUFDSixTQUFTLEVBQUUsS0FBSztRQUNoQixZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyw0QkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLDRCQUFrQixDQUFDLE1BQU07UUFDOUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxZQUFZO1FBQ3ZFLElBQUksRUFBRSxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxPQUFPO1FBQ3RDLFNBQVMsRUFBRSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FDNUMsU0FBUztZQUNMLENBQUMsQ0FBQyxzQkFBWSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQ3BDLHNCQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQywwQkFBVyxDQUFDLFNBQVMsQ0FBQyxFQUNoRSxzQkFBWSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDNUMsQ0FBQyxDQUFDLHNCQUFZLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FDaEQ7UUFDRCxRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQzNCLElBQUcsMkJBQVksQ0FBQyxjQUFjO2dCQUFFLE9BQU8sSUFBSSxDQUFDO1lBQzVDLElBQUcsSUFBSSxDQUFDLGVBQWUsS0FBSyxTQUFTO2dCQUFFLE9BQU8sS0FBSyxDQUFDO1lBQ3BELElBQUcsc0JBQVksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDO2dCQUFFLE9BQU8sSUFBSSxDQUFDO1lBQ2pJLE9BQU8sS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFDRCxPQUFPLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLElBQUEsNEJBQWtCLEVBQUMsTUFBTSxFQUM5RCxDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUEsNkJBQVcsRUFBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLGVBQWdCLENBQUMsRUFBRSxDQUFDLEVBQzdFLENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLGVBQWdCLEVBQUUsQ0FBQyxFQUN0QyxFQUFFLENBQUM7S0FDVixDQUFDLENBQ0wsQ0FBQyxDQUFDO0lBRVUsUUFBQSxpQkFBaUIsR0FBRyxJQUFJLDZDQUFxQixDQUFDLENBQUMsR0FBRyxFQUFFLFlBQXFCLEtBQUssRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBZ0Qsc0JBQVk7U0FDbEwsU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDO1NBQ3pCLE1BQU0sQ0FBQztRQUNKLFNBQVMsRUFBRSxLQUFLO1FBQ2hCLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLDRCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsNEJBQWtCLENBQUMsTUFBTTtRQUM5RSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLHNCQUFZLENBQUMsV0FBVyxDQUFDLFlBQVk7UUFDdkUsSUFBSSxFQUFFLHNCQUFZLENBQUMsV0FBVyxDQUFDLE9BQU87UUFDdEMsU0FBUyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUM5RCxTQUFTO1lBQ0wsQ0FBQyxDQUFDLHNCQUFZLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FDcEMsc0JBQVksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO2lCQUMzQixTQUFTLENBQUMsMEJBQVcsQ0FBQyxTQUFTLENBQUM7aUJBQ2hDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLHFCQUFXLENBQUMsTUFBTSxDQUFDLG9CQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksSUFBSSxRQUFRLENBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUMzSCxzQkFBWSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDbkQsQ0FBQyxDQUFDLHNCQUFZLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxlQUFlLENBQUMsQ0FDdkQ7UUFFRCxRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQzNCLElBQUcsMkJBQVksQ0FBQyxjQUFjO2dCQUFFLE9BQU8sSUFBSSxDQUFDO1lBQzVDLElBQUcsSUFBQSwrQkFBYSxFQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlO2dCQUFFLE9BQU8sS0FBSyxDQUFDO1lBQ3RFLElBQUcsc0JBQVksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFBRSxPQUFPLElBQUksQ0FBQztZQUMzSCxPQUFPLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBQ0QsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxJQUFBLDRCQUFrQixFQUFDLE1BQU0sRUFDOUQsSUFBQSwrQkFBYSxFQUFDLE1BQU0sRUFBRSxJQUFJLENBQUM7WUFDdkIsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLEdBQUcsSUFBQSxzQ0FBb0IsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsZUFBZ0IsQ0FBQyxFQUFFLENBQUM7WUFDL0csQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUN2QyxDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxlQUFnQixFQUFFLENBQUMsRUFDdEMsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztLQUM3QixDQUFDLENBQ0wsQ0FBQyxDQUFDO0lBRVUsUUFBQSxpQkFBaUIsR0FBRyxJQUFJLDZDQUFxQixDQUFDLENBQUMsR0FBRyxFQUFFLFlBQXFCLEtBQUssRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBa0Qsc0JBQVk7U0FDcEwsU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDO1NBQ3pCLE1BQU0sQ0FBQztRQUNKLFNBQVMsRUFBRSxLQUFLO1FBQ2hCLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLDRCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsNEJBQWtCLENBQUMsTUFBTTtRQUM5RSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLHNCQUFZLENBQUMsV0FBVyxDQUFDLFlBQVk7UUFDdkUsSUFBSSxFQUFFLHNCQUFZLENBQUMsV0FBVyxDQUFDLFNBQVM7UUFDeEMsU0FBUyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUM5RCxTQUFTO1lBQ0wsQ0FBQyxDQUFDLHNCQUFZLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FDcEMsc0JBQVksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO2lCQUMzQixTQUFTLENBQUMsMEJBQVcsQ0FBQyxTQUFTLENBQUM7aUJBQ2hDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLHFCQUFXLENBQUMsTUFBTSxDQUFDLG9CQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksSUFBSSxRQUFRLENBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUMzSCxzQkFBWSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDNUMsQ0FBQyxDQUFDLHNCQUFZLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FDaEQ7UUFDRCxRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQzNCLElBQUcsMkJBQVksQ0FBQyxjQUFjO2dCQUFFLE9BQU8sSUFBSSxDQUFDO1lBQzVDLElBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZTtnQkFBRSxPQUFPLEtBQUssQ0FBQztZQUN2QyxJQUFHLHNCQUFZLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDO2dCQUFFLE9BQU8sSUFBSSxDQUFDO1lBQ25JLE9BQU8sS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFDRCxPQUFPLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLElBQUEsNEJBQWtCLEVBQUMsTUFBTSxFQUM5RCxJQUFBLCtCQUFhLEVBQUMsTUFBTSxFQUFFLElBQUksQ0FBQztZQUN2QixDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQztZQUN0QyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxJQUFBLDZCQUFXLEVBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxlQUFnQixDQUFDLEVBQUUsQ0FBQyxFQUNuRixDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxlQUFnQixFQUFFLENBQUMsRUFDdEMsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztLQUM3QixDQUFDLENBQ0wsQ0FBQyxDQUFDIn0=
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
            bindable: StaticHelper_1.default.QS_INSTANCE.bindableDeposit,
            translate: (translator) => translator.name((0, StaticHelper_1.TLMain)("deposit")),
            submenu: (subreg) => {
                QSSubmenu.DepositAll.register(subreg);
                QSSubmenu.DepositType.register(subreg);
            }
        })));
        QSSubmenu.DepositAll = new UsableActionRegistrar_1.UsableActionGenerator(reg => reg.add("DepositAllMenu", UsableAction_1.default
            .requiring({ item: { allowNone: true, validate: () => true } })
            .create({
            icon: StaticHelper_1.default.QS_INSTANCE.UAPAll,
            bindable: StaticHelper_1.default.QS_INSTANCE.bindableAll,
            displayLevel: IAction_1.ActionDisplayLevel.Always,
            translate: (translator) => translator.name((0, StaticHelper_1.TLMain)("allTypes")),
            submenu: (subreg) => {
                exports.StackAllSelfNear.register(subreg);
                exports.StackAllMainNear.register(subreg);
                exports.StackAllSubNear.register(subreg);
            }
        })));
        QSSubmenu.DepositType = new UsableActionRegistrar_1.UsableActionGenerator(reg => reg.add("DepositTypeMenu", UsableAction_1.default
            .requiring({ item: true })
            .create({
            icon: StaticHelper_1.default.QS_INSTANCE.UAPType,
            bindable: StaticHelper_1.default.QS_INSTANCE.bindableType,
            displayLevel: IAction_1.ActionDisplayLevel.Always,
            translate: (translator) => translator.name(({ item, itemType }) => {
                const grp = (0, QSMatchGroups_1.getActiveGroups)(item?.type ?? itemType ?? IItem_1.ItemTypeGroup.Invalid);
                return (0, StaticHelper_1.TLMain)("onlyXType").addArgs(...(grp.length
                    ? [
                        (0, StaticHelper_1.TLGroup)(grp[0]).passTo((0, StaticHelper_1.TLUtil)("colorMatchGroup")),
                        (0, StaticHelper_1.TLGroup)("Item").passTo(Translation_1.default.reformatSingularNoun(999, false))
                    ] : [
                    item?.getName(false, 999, false, false, false, false)
                        ?? (itemType
                            ? Translation_1.default.nameOf(Dictionary_1.default.Item, itemType, false)
                            : undefined)
                ]));
            }),
            submenu: (subreg) => {
                exports.StackTypeSelfNear.register(subreg);
                exports.StackTypeHereNear.register(subreg);
            },
        })));
        QSSubmenu.Collect = new UsableActionRegistrar_1.UsableActionGenerator(reg => reg.add(StaticHelper_1.default.QS_INSTANCE.UAPCollectMenu, UsableAction_1.default
            .requiring({ item: { allowNone: true, validate: () => true } })
            .create({
            bindable: StaticHelper_1.default.QS_INSTANCE.bindableCollect,
            displayLevel: IAction_1.ActionDisplayLevel.Always,
            translate: (translator) => translator.name((0, StaticHelper_1.TLMain)("collect")),
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
            translate: (translator) => translator.name((0, StaticHelper_1.TLMain)("allTypes")),
            icon: StaticHelper_1.default.QS_INSTANCE.UAPAll,
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
                return (0, StaticHelper_1.TLMain)("onlyXType").addArgs(...(grp.length
                    ? [
                        (0, StaticHelper_1.TLGroup)(grp[0]).passTo((0, StaticHelper_1.TLUtil)("colorMatchGroup")),
                        (0, StaticHelper_1.TLGroup)("Item").passTo(Translation_1.default.reformatSingularNoun(999, false))
                    ] : [
                    item?.getName(false, 999, false, false, false, false)
                        ?? (itemType
                            ? Translation_1.default.nameOf(Dictionary_1.default.Item, itemType, false)
                            : undefined)
                ]));
            }),
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
            ? (0, StaticHelper_1.TLMain)("deposit").addArgs((0, StaticHelper_1.TLMain)("allTypes").inContext(ITranslation_1.TextContext.Lowercase), (0, StaticHelper_1.TLMain)("fromX").addArgs((0, StaticHelper_1.TLMain)("fullInventory")))
            : (0, StaticHelper_1.TLMain)("fromX").addArgs((0, StaticHelper_1.TLMain)("fullInventory"))),
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
            ? (0, StaticHelper_1.TLMain)("deposit").addArgs((0, StaticHelper_1.TLMain)("allTypes").inContext(ITranslation_1.TextContext.Lowercase), (0, StaticHelper_1.TLMain)("fromX").addArgs((0, StaticHelper_1.TLMain)("mainInventory")))
            : (0, StaticHelper_1.TLMain)("fromX").addArgs((0, StaticHelper_1.TLMain)("mainInventory"))),
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
            const itemStr = item?.getName("indefinite", 1) ?? (0, StaticHelper_1.TLMain)("thisContainer");
            return isMainReg
                ? (0, StaticHelper_1.TLMain)("deposit").addArgs((0, StaticHelper_1.TLMain)("allTypes").inContext(ITranslation_1.TextContext.Lowercase), (0, StaticHelper_1.TLMain)("fromX").addArgs(itemStr))
                : (0, StaticHelper_1.TLMain)("fromX").addArgs(itemStr);
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
            ? (0, StaticHelper_1.TLMain)("deposit").addArgs((0, StaticHelper_1.TLMain)("onlyXType")
                .inContext(ITranslation_1.TextContext.Lowercase)
                .addArgs(!!(item ?? itemType) ? Translation_1.default.nameOf(Dictionary_1.default.Item, (item?.type ?? itemType), 999, false) : undefined), (0, StaticHelper_1.TLMain)("fromX").addArgs((0, StaticHelper_1.TLMain)("fullInventory")))
            : (0, StaticHelper_1.TLMain)("fromX").addArgs((0, StaticHelper_1.TLMain)("fullInventory"))),
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
            ? (0, StaticHelper_1.TLMain)("deposit").addArgs((0, StaticHelper_1.TLMain)("onlyXType")
                .inContext(ITranslation_1.TextContext.Lowercase)
                .addArgs(!!(item ?? itemType) ? Translation_1.default.nameOf(Dictionary_1.default.Item, (item?.type ?? itemType), 999, false) : undefined), (0, StaticHelper_1.TLMain)("fromX").addArgs((0, StaticHelper_1.TLMain)("here")))
            : (0, StaticHelper_1.TLMain)("fromX").addArgs((0, StaticHelper_1.TLMain)("here"))),
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
            ? (0, StaticHelper_1.TLMain)("collect").addArgs((0, StaticHelper_1.TLMain)("allTypes").inContext(ITranslation_1.TextContext.Lowercase), (0, StaticHelper_1.TLMain)("fromXtoY").addArgs((0, StaticHelper_1.TLMain)("fullInventory"), (0, StaticHelper_1.TLMain)("nearby")))
            : (0, StaticHelper_1.TLMain)("fromXtoY").addArgs((0, StaticHelper_1.TLMain)("fullInventory"), (0, StaticHelper_1.TLMain)("nearby"))),
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
            ? (0, StaticHelper_1.TLMain)("collect").addArgs((0, StaticHelper_1.TLMain)("allTypes").inContext(ITranslation_1.TextContext.Lowercase), (0, StaticHelper_1.TLMain)("fromXtoY").addArgs((0, StaticHelper_1.TLMain)("mainInventory"), (0, StaticHelper_1.TLMain)("nearby")))
            : (0, StaticHelper_1.TLMain)("fromXtoY").addArgs((0, StaticHelper_1.TLMain)("mainInventory"), (0, StaticHelper_1.TLMain)("nearby"))),
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
            const itemStr = item ? item.getName(false) : itemType ? Translation_1.default.nameOf(Dictionary_1.default.Item, itemType, 999, false) : (0, StaticHelper_1.TLMain)("thisContainer");
            return isMainReg
                ? (0, StaticHelper_1.TLMain)("collect").addArgs((0, StaticHelper_1.TLMain)("allTypes").inContext(ITranslation_1.TextContext.Lowercase), (0, StaticHelper_1.TLMain)("fromXtoY").addArgs(itemStr, (0, StaticHelper_1.TLMain)("mainInventory")))
                : (0, StaticHelper_1.TLMain)("fromXtoY").addArgs(itemStr, (0, StaticHelper_1.TLMain)("mainInventory"));
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
        icon: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.UAPNear,
        translate: (translator) => translator.name(({ item, itemType }) => {
            const itemStr = item ? item.getName(false) : itemType ? Translation_1.default.nameOf(Dictionary_1.default.Item, itemType, 999, false) : (0, StaticHelper_1.TLMain)("thisContainer");
            return isMainReg
                ? (0, StaticHelper_1.TLMain)("collect").addArgs((0, StaticHelper_1.TLMain)("allTypes").inContext(ITranslation_1.TextContext.Lowercase), (0, StaticHelper_1.TLMain)("fromXtoY").addArgs(itemStr, (0, StaticHelper_1.TLMain)("nearby")))
                : (0, StaticHelper_1.TLMain)("fromXtoY").addArgs(itemStr, (0, StaticHelper_1.TLMain)("nearby"));
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
            ? (0, StaticHelper_1.TLMain)("collect").addArgs((0, StaticHelper_1.TLMain)("allTypes").inContext(ITranslation_1.TextContext.Lowercase), (0, StaticHelper_1.TLMain)("fromXtoY").addArgs((0, StaticHelper_1.TLMain)("here"), (0, StaticHelper_1.TLMain)("fullInventory")))
            : (0, StaticHelper_1.TLMain)("fromXtoY").addArgs((0, StaticHelper_1.TLMain)("here"), (0, StaticHelper_1.TLMain)("fullInventory"))),
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
            ? (0, StaticHelper_1.TLMain)("collect").addArgs((0, StaticHelper_1.TLMain)("allTypes").inContext(ITranslation_1.TextContext.Lowercase), (0, StaticHelper_1.TLMain)("fromXtoY").addArgs((0, StaticHelper_1.TLMain)("here"), (0, StaticHelper_1.TLMain)("nearby")))
            : (0, StaticHelper_1.TLMain)("fromXtoY").addArgs((0, StaticHelper_1.TLMain)("here"), (0, StaticHelper_1.TLMain)("nearby"))),
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
            ? (0, StaticHelper_1.TLMain)("collect").addArgs((0, StaticHelper_1.TLMain)("onlyXType").inContext(ITranslation_1.TextContext.Lowercase)
                .addArgs(!!(item ?? itemType) ? Translation_1.default.nameOf(Dictionary_1.default.Item, (item?.type ?? itemType), 999, false) : undefined), (0, StaticHelper_1.TLMain)("fromXtoY").addArgs((0, StaticHelper_1.TLMain)("here"), (0, StaticHelper_1.TLMain)("fullInventory")))
            : (0, StaticHelper_1.TLMain)("fromXtoY").addArgs((0, StaticHelper_1.TLMain)("here"), (0, StaticHelper_1.TLMain)("fullInventory"))),
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
        icon: StaticHelper_1.default.QS_INSTANCE.UAPNear,
        translate: (translator) => translator.name(({ item, itemType }) => isMainReg
            ? (0, StaticHelper_1.TLMain)("collect").addArgs((0, StaticHelper_1.TLMain)("onlyXType").inContext(ITranslation_1.TextContext.Lowercase)
                .addArgs(!!(item ?? itemType) ? Translation_1.default.nameOf(Dictionary_1.default.Item, (item?.type ?? itemType), 999, false) : undefined), (0, StaticHelper_1.TLMain)("fromXtoY").addArgs((0, StaticHelper_1.TLMain)("nearby"), (0, StaticHelper_1.TLMain)("here")))
            : (0, StaticHelper_1.TLMain)("fromXtoY").addArgs((0, StaticHelper_1.TLMain)("nearby"), (0, StaticHelper_1.TLMain)("here"))),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNhYmxlQWN0aW9uc1F1aWNrU3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9ucy9Vc2FibGVBY3Rpb25zUXVpY2tTdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBZ0JhLFFBQUEsdUJBQXVCLEdBQUcsSUFBSSw2Q0FBcUIsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUVuRSxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoQyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVoQyx3QkFBZ0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3JDLHdCQUFnQixDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDckMsdUJBQWUsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3BDLHlCQUFpQixDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdEMseUJBQWlCLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0Qyx3QkFBZ0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3JDLHdCQUFnQixDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDckMsdUJBQWUsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3BDLHVCQUFlLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwQyx3QkFBZ0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3JDLHdCQUFnQixDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDckMseUJBQWlC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
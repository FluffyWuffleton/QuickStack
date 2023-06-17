define(["require", "exports", "game/entity/action/IAction", "game/entity/action/usable/UsableAction", "game/entity/action/usable/UsableActionRegistrar", "game/item/IItem", "language/Dictionary", "language/ITranslation", "language/Translation", "ui/screen/screens/game/component/ItemComponent", "../StaticHelper", "../TransferHandler", "./Actions", "../QSMatchGroups", "game/item/ItemManager"], function (require, exports, IAction_1, UsableAction_1, UsableActionRegistrar_1, IItem_1, Dictionary_1, ITranslation_1, Translation_1, ItemComponent_1, StaticHelper_1, TransferHandler_1, Actions_1, QSMatchGroups_1, ItemManager_1) {
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
            discoveredByDefault: true,
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
            discoveredByDefault: true,
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
            discoveredByDefault: true,
            icon: StaticHelper_1.default.QS_INSTANCE.UAPType,
            bindable: StaticHelper_1.default.QS_INSTANCE.bindableType,
            displayLevel: IAction_1.ActionDisplayLevel.Always,
            translate: (translator) => translator.name(({ item, itemType }) => {
                const grp = (0, QSMatchGroups_1.getActiveGroups)(item?.type ?? itemType ?? IItem_1.ItemTypeGroup.Invalid);
                return (0, StaticHelper_1.TLMain)("onlyXType").addArgs(...(grp.length
                    ? [
                        (0, StaticHelper_1.TLGroup)(grp[0]).passTo((0, StaticHelper_1.TLUtil)("colorMatchGroup")),
                        (0, StaticHelper_1.TLGroup)("Item").passTo(Translation_1.default.reformatSingularNoun(999, Translation_1.Article.None))
                    ] : [
                    item?.getName(Translation_1.Article.None, 999, false, false, false, false)
                        ?? (itemType
                            ? Translation_1.default.nameOf(Dictionary_1.default.Item, itemType, Translation_1.Article.None)
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
            discoveredByDefault: true,
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
            discoveredByDefault: true,
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
            discoveredByDefault: true,
            displayLevel: IAction_1.ActionDisplayLevel.Always,
            bindable: StaticHelper_1.default.QS_INSTANCE.bindableType,
            icon: StaticHelper_1.default.QS_INSTANCE.UAPType,
            translate: (translator) => translator.name(({ item, itemType }) => {
                const grp = (0, QSMatchGroups_1.getActiveGroups)(item?.type ?? itemType ?? IItem_1.ItemTypeGroup.Invalid);
                return (0, StaticHelper_1.TLMain)("onlyXType").addArgs(...(grp.length
                    ? [
                        (0, StaticHelper_1.TLGroup)(grp[0]).passTo((0, StaticHelper_1.TLUtil)("colorMatchGroup")),
                        (0, StaticHelper_1.TLGroup)("Item").passTo(Translation_1.default.reformatSingularNoun(999, Translation_1.Article.None))
                    ] : [
                    item?.getName(Translation_1.Article.None, 999, false, false, false, false)
                        ?? (itemType
                            ? Translation_1.default.nameOf(Dictionary_1.default.Item, itemType, Translation_1.Article.None)
                            : undefined)
                ]));
            }),
            submenu: (subreg) => {
                exports.StackTypeSelfHere.register(subreg);
                exports.StackTypeNearHere.register(subreg);
            }
        })));
    })(QSSubmenu || (exports.QSSubmenu = QSSubmenu = {}));
    exports.StackAllSelfNear = new UsableActionRegistrar_1.UsableActionGenerator((reg, isMainReg = false) => reg.add(StaticHelper_1.default.QS_INSTANCE.UAPAllSelfNear, UsableAction_1.default
        .requiring({})
        .create({
        discoveredByDefault: true,
        slottable: isMainReg,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableSelf,
        icon: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.UAPSelf,
        iconLocationOnItem: ItemComponent_1.ItemDetailIconLocation.BottomRight,
        translate: (translator) => translator.name(() => isMainReg
            ? (0, StaticHelper_1.TLMain)("deposit").addArgs((0, StaticHelper_1.TLMain)("allTypes").inContext(ITranslation_1.TextContext.Lowercase), (0, StaticHelper_1.TLMain)("fromX").addArgs((0, StaticHelper_1.TLMain)("fullInventory")))
            : (0, StaticHelper_1.TLMain)("fromX").addArgs((0, StaticHelper_1.TLMain)("fullInventory"))),
        isUsable: (player) => {
            if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                return true;
            StaticHelper_1.default.MaybeLog.info("Checking isUsable: AllSelfNear");
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
        discoveredByDefault: true,
        slottable: isMainReg,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableMain,
        icon: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.UAPMain,
        iconLocationOnItem: ItemComponent_1.ItemDetailIconLocation.BottomRight,
        translate: (translator) => translator.name(() => isMainReg
            ? (0, StaticHelper_1.TLMain)("deposit").addArgs((0, StaticHelper_1.TLMain)("allTypes").inContext(ITranslation_1.TextContext.Lowercase), (0, StaticHelper_1.TLMain)("fromX").addArgs((0, StaticHelper_1.TLMain)("mainInventory")))
            : (0, StaticHelper_1.TLMain)("fromX").addArgs((0, StaticHelper_1.TLMain)("mainInventory"))),
        isUsable: (player) => {
            if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                return true;
            StaticHelper_1.default.MaybeLog.info("Checking isUsable: AllMainNear");
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
        discoveredByDefault: true,
        slottable: isMainReg,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableSub,
        icon: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.UAPSub,
        iconLocationOnItem: ItemComponent_1.ItemDetailIconLocation.BottomRight,
        translate: (translator) => translator.name(({ item }) => {
            const itemStr = item?.getName(Translation_1.Article.Indefinite, 1) ?? (0, StaticHelper_1.TLMain)("thisContainer");
            return isMainReg
                ? (0, StaticHelper_1.TLMain)("deposit").addArgs((0, StaticHelper_1.TLMain)("allTypes").inContext(ITranslation_1.TextContext.Lowercase), (0, StaticHelper_1.TLMain)("fromX").addArgs(itemStr))
                : (0, StaticHelper_1.TLMain)("fromX").addArgs(itemStr);
        }),
        isUsable: (player, { item }) => {
            if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                return true;
            if (!(0, TransferHandler_1.isHeldContainer)(player, item))
                return false;
            StaticHelper_1.default.MaybeLog.info("Checking isUsable: AllSubNear");
            if (StaticHelper_1.default.QSLSC.checkSpecificNearby(player.island.items.hashContainer(item)))
                return true;
            return false;
        },
        execute: (player, { item }) => (0, Actions_1.executeStackAction)(player, [{ container: [item] }], [{ tiles: true }, { doodads: true }], [])
    })));
    exports.StackTypeSelfNear = new UsableActionRegistrar_1.UsableActionGenerator((reg, isMainReg = false) => reg.add(StaticHelper_1.default.QS_INSTANCE.UAPTypeSelfNear, UsableAction_1.default
        .requiring({ item: { allowOnlyItemType: () => true, validate: () => true } })
        .create({
        discoveredByDefault: true,
        slottable: isMainReg,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableSelf,
        icon: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.UAPSelf,
        iconLocationOnItem: ItemComponent_1.ItemDetailIconLocation.TopLeft,
        onlySlotItemType: isMainReg ? true : undefined,
        translate: (translator) => translator.name(({ item, itemType }) => isMainReg
            ? (0, StaticHelper_1.TLMain)("deposit").addArgs((0, StaticHelper_1.TLMain)("onlyXType")
                .inContext(ITranslation_1.TextContext.Lowercase)
                .addArgs(!!(item ?? itemType) ? Translation_1.default.nameOf(Dictionary_1.default.Item, (item?.type ?? itemType), 999, Translation_1.Article.None) : undefined), (0, StaticHelper_1.TLMain)("fromX").addArgs((0, StaticHelper_1.TLMain)("fullInventory")))
            : (0, StaticHelper_1.TLMain)("fromX").addArgs((0, StaticHelper_1.TLMain)("fullInventory"))),
        isUsable: (player, { item, itemType }) => {
            if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                return true;
            StaticHelper_1.default.MaybeLog.info("Checking isUsable: TypeSelfNear");
            if (item && item.containedWithin && !isMainReg) {
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
        discoveredByDefault: true,
        slottable: false,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableHere,
        icon: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.UAPHere,
        translate: (translator) => translator.name(({ item, itemType }) => isMainReg
            ? (0, StaticHelper_1.TLMain)("deposit").addArgs((0, StaticHelper_1.TLMain)("onlyXType")
                .inContext(ITranslation_1.TextContext.Lowercase)
                .addArgs(!!(item ?? itemType) ? Translation_1.default.nameOf(Dictionary_1.default.Item, (item?.type ?? itemType), 999, Translation_1.Article.None) : undefined), (0, StaticHelper_1.TLMain)("fromX").addArgs((0, StaticHelper_1.TLMain)("here")))
            : (0, StaticHelper_1.TLMain)("fromX").addArgs((0, StaticHelper_1.TLMain)("here"))),
        isUsable: (player, { item }) => {
            if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                return true;
            StaticHelper_1.default.MaybeLog.info("Checking isUsable: TypeHereNear");
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
        discoveredByDefault: true,
        slottable: isMainReg,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableSelf,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        icon: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.UAPSelf,
        iconLocationOnItem: ItemComponent_1.ItemDetailIconLocation.BottomRight,
        translate: (translator) => translator.name(() => isMainReg
            ? (0, StaticHelper_1.TLMain)("collect").addArgs((0, StaticHelper_1.TLMain)("allTypes").inContext(ITranslation_1.TextContext.Lowercase), (0, StaticHelper_1.TLMain)("fromXtoY").addArgs((0, StaticHelper_1.TLMain)("nearby"), ((0, StaticHelper_1.TLMain)("fullInventory"))))
            : (0, StaticHelper_1.TLMain)("fromXtoY").addArgs((0, StaticHelper_1.TLMain)("nearby"), (0, StaticHelper_1.TLMain)("fullInventory"))),
        isUsable: (player, { item }) => {
            if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                return true;
            StaticHelper_1.default.MaybeLog.info("Checking isUsable: AllNearSelf");
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
        discoveredByDefault: true,
        slottable: isMainReg,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableMain,
        icon: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.UAPMain,
        iconLocationOnItem: ItemComponent_1.ItemDetailIconLocation.TopLeft,
        translate: (translator) => translator.name(() => isMainReg
            ? (0, StaticHelper_1.TLMain)("collect").addArgs((0, StaticHelper_1.TLMain)("allTypes").inContext(ITranslation_1.TextContext.Lowercase), (0, StaticHelper_1.TLMain)("fromXtoY").addArgs((0, StaticHelper_1.TLMain)("nearby"), (0, StaticHelper_1.TLMain)("mainInventory")))
            : (0, StaticHelper_1.TLMain)("fromXtoY").addArgs((0, StaticHelper_1.TLMain)("nearby"), (0, StaticHelper_1.TLMain)("mainInventory"))),
        isUsable: (player) => {
            if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                return true;
            StaticHelper_1.default.MaybeLog.info("Checking isUsable: AllNearMain");
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
        discoveredByDefault: true,
        slottable: isMainReg,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableMain,
        icon: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.UAPMain,
        iconLocationOnItem: ItemComponent_1.ItemDetailIconLocation.TopLeft,
        translate: (translator) => translator.name(({ item }) => {
            const itemStr = item?.getName(Translation_1.Article.None) ?? (0, StaticHelper_1.TLMain)("thisContainer");
            return isMainReg
                ? (0, StaticHelper_1.TLMain)("collect").addArgs((0, StaticHelper_1.TLMain)("allTypes").inContext(ITranslation_1.TextContext.Lowercase), (0, StaticHelper_1.TLMain)("fromXtoY").addArgs((0, StaticHelper_1.TLMain)("mainInventory"), itemStr))
                : (0, StaticHelper_1.TLMain)("fromXtoY").addArgs((0, StaticHelper_1.TLMain)("mainInventory"), itemStr);
        }),
        isUsable: (player, { item }) => {
            if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                return true;
            StaticHelper_1.default.MaybeLog.info("Checking isUsable: AllMainSub");
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
        discoveredByDefault: true,
        slottable: isMainReg,
        iconLocationOnItem: ItemComponent_1.ItemDetailIconLocation.TopLeft,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableNear,
        icon: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.UAPNear,
        translate: (translator) => translator.name(({ item, itemType }) => {
            const itemStr = item ? item.getName(Translation_1.Article.None) : itemType ? Translation_1.default.nameOf(Dictionary_1.default.Item, itemType, 999, Translation_1.Article.None) : (0, StaticHelper_1.TLMain)("thisContainer");
            return isMainReg
                ? (0, StaticHelper_1.TLMain)("collect").addArgs((0, StaticHelper_1.TLMain)("allTypes").inContext(ITranslation_1.TextContext.Lowercase), (0, StaticHelper_1.TLMain)("fromXtoY").addArgs((0, StaticHelper_1.TLMain)("nearby"), itemStr))
                : (0, StaticHelper_1.TLMain)("fromXtoY").addArgs((0, StaticHelper_1.TLMain)("nearby"), itemStr);
        }),
        isUsable: (player, { item }) => {
            if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                return true;
            StaticHelper_1.default.MaybeLog.info("Checking isUsable: AllNearSub");
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
        discoveredByDefault: true,
        slottable: false,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableSelf,
        icon: StaticHelper_1.default.QS_INSTANCE.UAPSelf,
        translate: (translator) => translator.name(() => isMainReg
            ? (0, StaticHelper_1.TLMain)("collect").addArgs((0, StaticHelper_1.TLMain)("allTypes").inContext(ITranslation_1.TextContext.Lowercase), (0, StaticHelper_1.TLMain)("fromXtoY").addArgs((0, StaticHelper_1.TLMain)("fullInventory"), (0, StaticHelper_1.TLMain)("here")))
            : (0, StaticHelper_1.TLMain)("fromXtoY").addArgs((0, StaticHelper_1.TLMain)("fullInventory"), (0, StaticHelper_1.TLMain)("here"))),
        isUsable: (player, { item }) => {
            if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                return true;
            StaticHelper_1.default.MaybeLog.info("Checking isUsable: AllSelfHere");
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
        discoveredByDefault: true,
        slottable: false,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableNear,
        icon: StaticHelper_1.default.QS_INSTANCE.UAPHere,
        translate: (translator) => translator.name(() => isMainReg
            ? (0, StaticHelper_1.TLMain)("collect").addArgs((0, StaticHelper_1.TLMain)("allTypes").inContext(ITranslation_1.TextContext.Lowercase), (0, StaticHelper_1.TLMain)("fromXtoY").addArgs((0, StaticHelper_1.TLMain)("nearby"), (0, StaticHelper_1.TLMain)("here")))
            : (0, StaticHelper_1.TLMain)("fromXtoY").addArgs((0, StaticHelper_1.TLMain)("nearby"), (0, StaticHelper_1.TLMain)("here"))),
        isUsable: (player, { item }) => {
            if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                return true;
            StaticHelper_1.default.MaybeLog.info("Checking isUsable: AllNearHere");
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
        discoveredByDefault: true,
        slottable: false,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableSelf,
        icon: StaticHelper_1.default.QS_INSTANCE.UAPSelf,
        translate: (translator) => translator.name(({ item, itemType }) => isMainReg
            ? (0, StaticHelper_1.TLMain)("collect").addArgs((0, StaticHelper_1.TLMain)("onlyXType").inContext(ITranslation_1.TextContext.Lowercase)
                .addArgs(!!(item ?? itemType) ? Translation_1.default.nameOf(Dictionary_1.default.Item, (item?.type ?? itemType), 999, Translation_1.Article.None) : undefined), (0, StaticHelper_1.TLMain)("fromXtoY").addArgs((0, StaticHelper_1.TLMain)("fullInventory"), (0, StaticHelper_1.TLMain)("here")))
            : (0, StaticHelper_1.TLMain)("fromXtoY").addArgs((0, StaticHelper_1.TLMain)("fullInventory"), (0, StaticHelper_1.TLMain)("here"))),
        isUsable: (player, { item }) => {
            if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                return true;
            StaticHelper_1.default.MaybeLog.info("Checking isUsable: TypeSelfHere");
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
        discoveredByDefault: true,
        slottable: false,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableNear,
        icon: StaticHelper_1.default.QS_INSTANCE.UAPNear,
        translate: (translator) => translator.name(({ item, itemType }) => isMainReg
            ? (0, StaticHelper_1.TLMain)("collect").addArgs((0, StaticHelper_1.TLMain)("onlyXType").inContext(ITranslation_1.TextContext.Lowercase)
                .addArgs(!!(item ?? itemType) ? Translation_1.default.nameOf(Dictionary_1.default.Item, (item?.type ?? itemType), 999, Translation_1.Article.None) : undefined), (0, StaticHelper_1.TLMain)("fromXtoY").addArgs((0, StaticHelper_1.TLMain)("nearby"), (0, StaticHelper_1.TLMain)("here")))
            : (0, StaticHelper_1.TLMain)("fromXtoY").addArgs((0, StaticHelper_1.TLMain)("nearby"), (0, StaticHelper_1.TLMain)("here"))),
        isUsable: (player, { item }) => {
            if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                return true;
            StaticHelper_1.default.MaybeLog.info("Checking isUsable: TypeNearHere");
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
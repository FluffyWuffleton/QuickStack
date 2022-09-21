define(["require", "exports", "game/entity/action/IAction", "game/entity/action/usable/UsableAction", "game/entity/action/usable/UsableActionRegistrar", "game/item/IItem", "game/item/ItemManager", "language/Dictionary", "language/ITranslation", "language/Translation", "ui/screen/screens/game/component/Item", "../StaticHelper", "../TransferHandler", "./Actions"], function (require, exports, IAction_1, UsableAction_1, UsableActionRegistrar_1, IItem_1, ItemManager_1, Dictionary_1, ITranslation_1, Translation_1, Item_1, StaticHelper_1, TransferHandler_1, Actions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StackTypeNearHere = exports.StackTypeSelfHere = exports.StackAllNearHere = exports.StackAllSelfHere = exports.StackAllNearSub = exports.StackAllMainSub = exports.execSANM = exports.StackAllNearMain = exports.execSANSe = exports.StackAllNearSelf = exports.StackTypeHereNear = exports.StackTypeSelfNear = exports.StackAllLikeNear = exports.StackAllSubNear = exports.execSAMN = exports.StackAllMainNear = exports.execSASeN = exports.StackAllSelfNear = exports.QSSubmenu = exports.UsableActionsQuickStack = void 0;
    exports.UsableActionsQuickStack = new UsableActionRegistrar_1.UsableActionGenerator(reg => {
        QSSubmenu.Deposit.register(reg);
        QSSubmenu.Collect.register(reg);
        exports.StackAllSelfNear.register(reg, true);
        exports.StackAllMainNear.register(reg, true);
        exports.StackAllSubNear.register(reg, true);
        exports.StackAllLikeNear.register(reg, true);
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
                if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                    return true;
                return ((using.item
                    && QSSubmenu.DepositType.get().actions[0][1]
                        .isUsable(player, { creature: using.creature, doodad: using.doodad, npc: using.npc, item: using.item, itemType: using.itemType ?? using.item.type }).usable) || (QSSubmenu.DepositAll.get().actions[0][1]
                    .isUsable(player, { creature: using.creature, doodad: using.doodad, npc: using.npc, item: using.item, itemType: using.itemType }).usable));
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
                if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                    return true;
                if (using.item) {
                    if (exports.StackAllSubNear.get().actions[0][1]
                        .isUsable(player, { creature: undefined, doodad: undefined, npc: undefined, item: using.item, itemType: using.itemType }).usable)
                        return true;
                }
                else if (using.itemType) {
                    if (exports.StackAllLikeNear.get().actions[0][1]
                        .isUsable(player, { creature: undefined, doodad: undefined, npc: undefined, item: using.item, itemType: using.itemType }).usable)
                        return true;
                }
                else {
                    if (exports.StackAllSelfNear.get().actions[0][1]
                        .isUsable(player, { creature: undefined, doodad: undefined, npc: undefined, item: undefined, itemType: undefined }).usable)
                        return true;
                }
                return false;
            },
            submenu: (subreg) => {
                exports.StackAllSelfNear.register(subreg);
                exports.StackAllMainNear.register(subreg);
                exports.StackAllSubNear.register(subreg);
                exports.StackAllLikeNear.register(subreg);
            }
        })));
        QSSubmenu.DepositType = new UsableActionRegistrar_1.UsableActionGenerator(reg => reg.add("DepositTypeMenu", UsableAction_1.default
            .requiring({ item: true })
            .create({
            displayLevel: IAction_1.ActionDisplayLevel.Always,
            bindable: StaticHelper_1.default.QS_INSTANCE.bindableType,
            icon: StaticHelper_1.default.QS_INSTANCE.UAPType,
            translate: (translator) => translator.name(({ item, itemType }) => {
                const grp = TransferHandler_1.default.getActiveGroup(item?.type ?? itemType ?? IItem_1.ItemTypeGroup.Invalid);
                return StaticHelper_1.default.TLMain("onlyXType").addArgs(...(grp !== undefined
                    ? [
                        StaticHelper_1.default.TLGroup(grp).passTo(StaticHelper_1.default.TLMain("colorMatchGroup")),
                        StaticHelper_1.default.TLGroup("Item").passTo(Translation_1.default.reformatSingularNoun(999, false))
                    ] : [
                    item?.getName(false, 999, false, false, false, false)
                        ?? (itemType
                            ? Translation_1.default.nameOf(Dictionary_1.default.Item, itemType, false)
                            : undefined)
                ]));
            }),
            isUsable: (player, using) => {
                if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                    return true;
                return exports.StackTypeSelfNear.get(true).actions[0][1]
                    .isUsable(player, { creature: undefined, doodad: undefined, npc: undefined, item: using.item, itemType: using.itemType ?? using.item.type }).usable;
            },
            submenu: (subreg) => {
                exports.StackTypeSelfNear.register(subreg);
                exports.StackTypeHereNear.register(subreg);
            },
        })));
        QSSubmenu.Collect = new UsableActionRegistrar_1.UsableActionGenerator(reg => reg.add(StaticHelper_1.default.QS_INSTANCE.UAPCollectMenu, UsableAction_1.default
            .requiring({ item: { allowNone: true } })
            .create({
            displayLevel: IAction_1.ActionDisplayLevel.Always,
            translate: (translator) => translator.name(StaticHelper_1.default.TLMain("collect")),
            isApplicable: () => true,
            isUsable: (player, using) => {
                if (StaticHelper_1.GLOBALCONFIG.force_isusable)
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
                if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                    return true;
                if (item === undefined)
                    return exports.StackAllNearSelf.get().actions[0][1]
                        .isUsable(player, { creature: undefined, doodad: undefined, item: item, itemType: undefined, npc: undefined }).usable;
                else
                    return exports.StackAllNearHere.get().actions[0][1]
                        .isUsable(player, { creature: undefined, doodad: undefined, item: item, itemType: item.type, npc: undefined }).usable
                        ||
                            exports.StackAllSelfHere.get().actions[0][1]
                                .isUsable(player, { creature: undefined, doodad: undefined, item: item, itemType: item.type, npc: undefined }).usable
                        ||
                            exports.StackAllMainSub.get().actions[0][1]
                                .isUsable(player, { creature: undefined, doodad: undefined, item: item, itemType: item.type, npc: undefined }).usable;
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
                const grp = TransferHandler_1.default.getActiveGroup(item?.type ?? itemType ?? IItem_1.ItemTypeGroup.Invalid);
                return StaticHelper_1.default.TLMain("onlyXType").addArgs(...(grp !== undefined
                    ? [
                        StaticHelper_1.default.TLGroup(grp).passTo(StaticHelper_1.default.TLMain("colorMatchGroup")),
                        StaticHelper_1.default.TLGroup("Item").passTo(Translation_1.default.reformatSingularNoun(999, false))
                    ] : [
                    item?.getName(false, 999, false, false, false, false)
                        ?? (itemType
                            ? Translation_1.default.nameOf(Dictionary_1.default.Item, itemType, false)
                            : undefined)
                ]));
            }),
            isUsable: (player, using) => {
                if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                    return true;
                return exports.StackTypeNearHere.get().actions[0][1]
                    .isUsable(player, using).usable
                    || exports.StackTypeSelfHere.get().actions[0][1]
                        .isUsable(player, using).usable;
            },
            submenu: (subreg) => {
                exports.StackTypeNearHere.register(subreg);
                exports.StackTypeSelfHere.register(subreg);
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
            return StaticHelper_1.default.QSLSC.checkSelfNearby();
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
            return StaticHelper_1.default.QSLSC.checkSelfNearby();
        },
        execute: exports.execSAMN
    })));
    const execSAMN = (p) => (0, Actions_1.executeStackAction_notify)(p, [{ self: true }], [{ tiles: true }, { doodads: true }], []);
    exports.execSAMN = execSAMN;
    exports.StackAllSubNear = new UsableActionRegistrar_1.UsableActionGenerator((reg, isMainReg = false) => reg.add(StaticHelper_1.default.QS_INSTANCE.UAPAllSubNear, UsableAction_1.default
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
            const itemStr = item ? item.getName("indefinite", 1) : itemType ? Translation_1.default.nameOf(Dictionary_1.default.Item, itemType, 1, "indefinite") : StaticHelper_1.default.TLMain("thisContainer");
            return isMainReg
                ? StaticHelper_1.default.TLMain("deposit").addArgs(StaticHelper_1.default.TLMain("allTypes").inContext(ITranslation_1.TextContext.Lowercase), StaticHelper_1.default.TLMain("fromX").addArgs(itemStr))
                : StaticHelper_1.default.TLMain("fromX").addArgs(itemStr);
        }),
        isUsable: (player, { item }) => {
            if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                return true;
            if (!(0, TransferHandler_1.isHeldContainer)(player, item))
                return false;
            switch (StaticHelper_1.default.QSLSC.checkSpecificNearby(player.island.items.hashContainer(item))) {
                case undefined: StaticHelper_1.default.QS_LOG.warn(`LocalStorageCache Failed to locate hash for held container '${item.getName()}'`);
                case false: return false;
                case true: return true;
            }
            return (0, TransferHandler_1.isHeldContainer)(player, item)
                && TransferHandler_1.default.canFitAny([item], (0, TransferHandler_1.validNearby)(player), player);
        },
        execute: (player, { item }) => (0, Actions_1.executeStackAction)(player, [{ container: [item] }], [{ tiles: true }, { doodads: true }], [])
    })));
    exports.StackAllLikeNear = new UsableActionRegistrar_1.UsableActionGenerator((reg, isMainReg = false) => reg.add(StaticHelper_1.default.QS_INSTANCE.UAPAllLikeNear, UsableAction_1.default
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
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableLike,
        icon: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.UAPAlike,
        translate: (translator) => translator.name(({ item, itemType }) => {
            const itemStr = !!(item ?? itemType) ? Translation_1.default.nameOf(Dictionary_1.default.Item, (item?.type ?? itemType), 999, false) : StaticHelper_1.default.TLMain("likeContainers");
            return isMainReg
                ? StaticHelper_1.default.TLMain("deposit").addArgs(StaticHelper_1.default.TLMain("allTypes").inContext(ITranslation_1.TextContext.Lowercase), StaticHelper_1.default.TLMain("fromX").addArgs(StaticHelper_1.default.TLMain("allX").addArgs(itemStr)))
                : StaticHelper_1.default.TLMain("fromX").addArgs(StaticHelper_1.default.TLMain("allX").addArgs(itemStr));
        }),
        isUsable: (player, { item, itemType }) => {
            if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                return true;
            if (item && !(0, TransferHandler_1.isHeldContainer)(player, item))
                return false;
            if (itemType && !(0, TransferHandler_1.playerHasType)(player, itemType))
                return false;
            for (const container of (0, TransferHandler_1.playerHeldContainers)(player, [(item?.type ?? itemType)]))
                switch (StaticHelper_1.default.QSLSC.checkSpecificNearby(player.island.items.hashContainer(container))) {
                    case undefined: StaticHelper_1.default.QS_LOG.warn(`LocalStorageCache Failed to locate hash for held container '${container}'`);
                    case false: break;
                    case true: return true;
                }
            return false;
        },
        execute: (player, { item, itemType }) => (0, Actions_1.executeStackAction)(player, [{ container: (0, TransferHandler_1.playerHeldContainers)(player, [(item?.type ?? itemType)]) }], [{ tiles: true }, { doodads: true }], [])
    })));
    exports.StackTypeSelfNear = new UsableActionRegistrar_1.UsableActionGenerator((reg, isMainReg = false) => reg.add(StaticHelper_1.default.QS_INSTANCE.UAPTypeSelfNear, UsableAction_1.default
        .requiring({
        item: { allowOnlyItemType: () => true, validate: () => true }
    })
        .create({
        slottable: true,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableSelf,
        icon: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.UAPSelf,
        iconLocationOnItem: Item_1.ItemDetailIconLocation.TopLeft,
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
                return StaticHelper_1.default.QSLSC.checkSelfNearby([item.type])
                    && [StaticHelper_1.default.QSLSC.player, ...StaticHelper_1.default.QSLSC.player.deepSubs()].some(c => c.cHash !== iHash && TransferHandler_1.default.canMatch([{ containedItems: [item] }], [...c.main]));
            }
            return StaticHelper_1.default.QSLSC.checkSelfNearby([(item?.type ?? itemType)]);
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
            const check = StaticHelper_1.default.QSLSC.checkSpecificNearby(player.island.items.hashContainer(item.containedWithin));
            if (check === undefined)
                StaticHelper_1.default.QS_LOG.warn(`LocalStorageCache failed to locate hash for location of item '${item.getName()}'`);
            return !!check;
        },
        execute: (player, { item }, _context) => (0, Actions_1.executeStackAction)(player, [{ container: item.containedWithin }], [{ tiles: true }, { doodads: true }], [{ type: item.type }])
    })));
    exports.StackAllNearSelf = new UsableActionRegistrar_1.UsableActionGenerator((reg, isMainReg = false) => reg.add(StaticHelper_1.default.QS_INSTANCE.UAPAllNearSelf, UsableAction_1.default
        .requiring({ item: { allowNone: true, validate: (p, it) => (0, TransferHandler_1.playerHasItem)(p, it) } })
        .create({
        slottable: isMainReg,
        bindable: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.bindableSelf,
        displayLevel: isMainReg ? IAction_1.ActionDisplayLevel.Never : IAction_1.ActionDisplayLevel.Always,
        icon: isMainReg ? undefined : StaticHelper_1.default.QS_INSTANCE.UAPSelf,
        iconLocationOnItem: Item_1.ItemDetailIconLocation.BottomRight,
        translate: (translator) => translator.name(() => isMainReg
            ? StaticHelper_1.default.TLMain("collect").addArgs(StaticHelper_1.default.TLMain("allTypes").inContext(ITranslation_1.TextContext.Lowercase), StaticHelper_1.default.TLFromTo("fullInventory", "nearby"))
            : StaticHelper_1.default.TLFromTo("fullInventory", "nearby")),
        isUsable: (player) => {
            if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                return true;
            return StaticHelper_1.default.QSLSC.checkSelfNearby([], true);
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
            const check = StaticHelper_1.default.QSLSC.checkSpecificNearby(player.island.items.hashContainer(player.inventory), [], true);
            if (check === undefined)
                StaticHelper_1.default.QS_LOG.warn(`LocalStorageCache failed to locate hash for player inventory`);
            return !!check;
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
            const itemStr = item ? item.getName(false) : itemType ? Translation_1.default.nameOf(Dictionary_1.default.Item, itemType, 999, false) : StaticHelper_1.default.TLMain("thisContainer");
            return isMainReg
                ? StaticHelper_1.default.TLMain("collect").addArgs(StaticHelper_1.default.TLMain("allTypes").inContext(ITranslation_1.TextContext.Lowercase), StaticHelper_1.default.TLFromTo(itemStr, "mainInventory"))
                : StaticHelper_1.default.TLFromTo(itemStr, "mainInventory");
        }),
        isUsable: (player, { item }) => {
            if (StaticHelper_1.GLOBALCONFIG.force_isusable)
                return true;
            if (!(0, TransferHandler_1.playerHasItem)(player, item))
                return false;
            const check = StaticHelper_1.default.QSLSC.checkSpecific(player.island.items.hashContainer(player.inventory), player.island.items.hashContainer(item));
            if (check === undefined)
                StaticHelper_1.default.QS_LOG.warn(`LocalStorageCache failed to locate hash for either player inventory or held container '${item.getName()}'`);
            return !!check;
        },
        execute: (p, u) => (0, Actions_1.executeStackAction)(p, [{ self: true }], [{ container: u.item }], [])
    })));
    exports.StackAllNearSub = new UsableActionRegistrar_1.UsableActionGenerator((reg, isMainReg = false) => reg.add(StaticHelper_1.default.QS_INSTANCE.UAPAllNearSub, UsableAction_1.default
        .requiring({ item: { validate: (_, item) => (0, TransferHandler_1.isStorageType)(item.type) } })
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
            const check = StaticHelper_1.default.QSLSC.checkSpecificNearby(player.island.items.hashContainer(item), [], true);
            if (check === undefined)
                StaticHelper_1.default.QS_LOG.warn(`LocalStorageCache failed to locate hash for held container '${item.getName()}'`);
            return !!check;
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
            const check = StaticHelper_1.default.QSLSC.checkSelfSpecific(player.island.items.hashContainer(item.containedWithin));
            if (check === undefined)
                StaticHelper_1.default.QS_LOG.warn(`LocalStorageCache failed to locate hash for location of nearby item '${item.getName()}'`);
            return !!check;
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
            if (!item.containedWithin)
                return false;
            const check = StaticHelper_1.default.QSLSC.checkSpecificNearby(player.island.items.hashContainer(item.containedWithin), [], true);
            if (check === undefined)
                StaticHelper_1.default.QS_LOG.warn(`LocalStorageCache failed to locate hash for location of item '${item.getName()}'`);
            return !!check;
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
            const check = StaticHelper_1.default.QSLSC.checkSelfSpecific(player.island.items.hashContainer(item.containedWithin), [item.type]);
            if (check === undefined)
                StaticHelper_1.default.QS_LOG.warn(`LocalStorageCache failed to locate hash for location of nearby item '${item.getName()}'`);
            return !!check;
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
            const check = StaticHelper_1.default.QSLSC.checkSpecificNearby(player.island.items.hashContainer(item.containedWithin), [item.type], true);
            if (check === undefined)
                StaticHelper_1.default.QS_LOG.warn(`LocalStorageCache failed to locate hash for location of item '${item.getName()}'`);
            return !!check;
        },
        execute: (player, { item }, _context) => (0, Actions_1.executeStackAction)(player, (0, TransferHandler_1.playerHasItem)(player, item)
            ? [{ doodads: true }, { tiles: true }]
            : [{ container: (0, TransferHandler_1.validNearby)(player).filter(c => c !== item.containedWithin) }], [{ container: item.containedWithin }], [{ type: item.type }])
    })));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNhYmxlQWN0aW9uc1F1aWNrU3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9ucy9Vc2FibGVBY3Rpb25zUXVpY2tTdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBZWEsUUFBQSx1QkFBdUIsR0FBRyxJQUFJLDZDQUFxQixDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBRW5FLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hDLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWhDLHdCQUFnQixDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDckMsd0JBQWdCLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNyQyx1QkFBZSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEMsd0JBQWdCLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNyQyx5QkFBaUIsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3RDLHlCQUFpQixDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdEMsd0JBQWdCLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNyQyx3QkFBZ0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3JDLHVCQUFlLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwQyx1QkFBZSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEMsd0JBQWdCLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNyQyx3QkFBZ0Is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
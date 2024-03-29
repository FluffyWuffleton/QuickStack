import { ActionDisplayLevel } from "game/entity/action/IAction";
import UsableAction from "game/entity/action/usable/UsableAction";
import { UsableActionGenerator } from "game/entity/action/usable/UsableActionRegistrar";
import Player from "game/entity/player/Player";
import { IContainer, ItemTypeGroup } from "game/item/IItem";
import Dictionary from "language/Dictionary";
import { TextContext } from "language/ITranslation";
import Translation, { Article } from "language/Translation";
import { ItemDetailIconLocation } from "ui/screen/screens/game/component/Item";

import StaticHelper, { GLOBALCONFIG, TLGroup, TLMain, TLUtil } from "../StaticHelper";
import TransferHandler, { isHeldContainer, isStorageType, playerHasItem, playerHeldContainers, validNearby } from "../TransferHandler";
import { executeStackAction, executeStackAction_notify } from "./Actions";
import { getActiveGroups } from "../QSMatchGroups";
import ItemManager from "game/item/ItemManager";

export const UsableActionsQuickStack = new UsableActionGenerator(reg => {
    // 2nd-level submenus are registered by the parent. Visible submenu actions are registered by 2nd-level menus.
    QSSubmenu.Deposit.register(reg);
    QSSubmenu.Collect.register(reg);

    StackAllSelfNear.register(reg, true);
    StackAllMainNear.register(reg, true);
    StackAllSubNear.register(reg, true);
    StackTypeSelfNear.register(reg, true);
    StackTypeHereNear.register(reg, true);
    StackAllNearSelf.register(reg, true);
    StackAllNearMain.register(reg, true);
    StackAllMainSub.register(reg, true);
    StackAllNearSub.register(reg, true);
    StackAllSelfHere.register(reg, true);
    StackAllNearHere.register(reg, true);
    StackTypeNearHere.register(reg, true);
    StackTypeSelfHere.register(reg, true);
});

export namespace QSSubmenu {
    // Top-level submenu for depositing.
    // Nonspecific (Q) 
    //      Deposit all to nearby from full inv           -- Slottable
    //      Deposit all to nearby from top-level inv      -- Slottable
    // Held container
    //      Deposit all to nearby from container          -- Slottable for container item
    // Item in inventory
    //      Deposit type to nearby from full inv
    //      Deposit type to nearby from item's location
    export const Deposit = new UsableActionGenerator(reg => reg.add(StaticHelper.QS_INSTANCE.UAPDepositMenu, UsableAction
        .requiring({ item: { allowNone: true, validate: () => true } })
        .create({
            discoveredByDefault: true,
            displayLevel: ActionDisplayLevel.Always,
            bindable: StaticHelper.QS_INSTANCE.bindableDeposit,
            translate: (translator) => translator.name(TLMain("deposit")),
            submenu: (subreg) => {
                QSSubmenu.DepositAll.register(subreg); // Add subsubmenu for actions that function regardless of item selection.
                QSSubmenu.DepositType.register(subreg); // Add subsubmenu for item-type actions. Requires Item.
            }
        })
    ));

    // 2nd-level menu for deposit operations operating on all item types
    export const DepositAll = new UsableActionGenerator(reg => reg.add("DepositAllMenu", UsableAction
        .requiring({ item: { allowNone: true, validate: () => true } })
        .create({
            discoveredByDefault: true,
            icon: StaticHelper.QS_INSTANCE.UAPAll,
            bindable: StaticHelper.QS_INSTANCE.bindableAll,
            displayLevel: ActionDisplayLevel.Always,
            translate: (translator) => translator.name(TLMain("allTypes")),
            submenu: (subreg) => {
                StackAllSelfNear.register(subreg);
                StackAllMainNear.register(subreg);
                StackAllSubNear.register(subreg);
            }
        })
    ));

    // 2nd-level menu for deposit operations that require a selected item type
    export const DepositType = new UsableActionGenerator(reg => reg.add("DepositTypeMenu", UsableAction
        .requiring({ item: true })
        .create({
            discoveredByDefault: true,
            icon: StaticHelper.QS_INSTANCE.UAPType,
            bindable: StaticHelper.QS_INSTANCE.bindableType,
            displayLevel: ActionDisplayLevel.Always,
            translate: (translator) => translator.name(({ item, itemType }) => {
                const grp = getActiveGroups(item?.type ?? itemType ?? ItemTypeGroup.Invalid);
                return TLMain("onlyXType").addArgs(...
                    (grp.length
                        ? [
                            TLGroup(grp[0]).passTo(TLUtil("colorMatchGroup")),
                            TLGroup("Item").passTo(Translation.reformatSingularNoun(999, Article.None))
                        ] : [
                            item?.getName(Article.None, 999, false, false, false, false)
                            ?? (itemType
                                ? Translation.nameOf(Dictionary.Item, itemType, Article.None)
                                : undefined)
                        ])
                );
            }),
            submenu: (subreg) => {
                StackTypeSelfNear.register(subreg);
                StackTypeHereNear.register(subreg);
            },
        })
    ));

    // Top-level submenu for collection.
    // Nonspecific (Q) 
    //      Collect all to full inv from nearby         -- Slottable
    //      Collect all to top-level inv from nearby    -- Slottable
    // Held container
    //      Collect all to container from top-level inv -- Slottable for container item
    //      Collect all to container from nearby        -- Slottable for container item
    // Item in inventory or in nearby container
    //      Collect type to here from nearby
    //      Collect type to here from full inventory
    // Item in nearby container
    //      Collect all to here from nearby
    //      Collect all to here from inventory
    export const Collect = new UsableActionGenerator(reg => reg.add(StaticHelper.QS_INSTANCE.UAPCollectMenu, UsableAction
        .requiring({ item: { allowNone: true, validate: () => true } })
        .create({
            discoveredByDefault: true,
            bindable: StaticHelper.QS_INSTANCE.bindableCollect,
            displayLevel: ActionDisplayLevel.Always,
            translate: (translator) => translator.name(TLMain("collect")),
            submenu: (subreg) => {
                // Add subsubmenu for actions that function regardless of item selection.
                QSSubmenu.CollectAll.register(subreg);
                // Add subsubmenu for item-type actions. Requires Item.
                QSSubmenu.CollectType.register(subreg);
            }
        })
    ));

    // 2nd-level menu for collection operations operating on all item types
    export const CollectAll = new UsableActionGenerator(reg => reg.add("CollectAllMenu", UsableAction
        .requiring({ item: { allowNone: true, validate: () => true } })
        .create({
            discoveredByDefault: true,
            displayLevel: ActionDisplayLevel.Always,
            bindable: StaticHelper.QS_INSTANCE.bindableAll,
            translate: (translator) => translator.name(TLMain("allTypes")),
            icon: StaticHelper.QS_INSTANCE.UAPAll,
            submenu: (subreg) => {
                StackAllNearSelf.register(subreg);
                StackAllNearMain.register(subreg);
                StackAllMainSub.register(subreg);
                StackAllNearSub.register(subreg);
                StackAllSelfHere.register(subreg);
                StackAllNearHere.register(subreg);
            }
        })
    ));

    // 2nd-level menu for collection operations that require a selected item type
    export const CollectType = new UsableActionGenerator(reg => reg.add("CollectTypeMenu", UsableAction
        .requiring({ item: true })
        .create({
            discoveredByDefault: true,
            displayLevel: ActionDisplayLevel.Always,
            bindable: StaticHelper.QS_INSTANCE.bindableType,
            icon: StaticHelper.QS_INSTANCE.UAPType,
            translate: (translator) => translator.name(({ item, itemType }) => {
                const grp = getActiveGroups(item?.type ?? itemType ?? ItemTypeGroup.Invalid);
                return TLMain("onlyXType").addArgs(...
                    (grp.length
                        ? [
                            TLGroup(grp[0]).passTo(TLUtil("colorMatchGroup")),
                            TLGroup("Item").passTo(Translation.reformatSingularNoun(999, Article.None))
                        ] : [
                            item?.getName(Article.None, 999, false, false, false, false)
                            ?? (itemType
                                ? Translation.nameOf(Dictionary.Item, itemType, Article.None)
                                : undefined)
                        ])
                );
            }),
            submenu: (subreg) => {
                StackTypeSelfHere.register(subreg);
                StackTypeNearHere.register(subreg);
            }
        })
    ));
}

/** 
 * Stack all types from full inventory to nearby containers
 * Slottable.
 * Applicability:
 *      Always
 * Usability:
 *      Full inventory contents have type match(es) nearby
 */
export const StackAllSelfNear = new UsableActionGenerator((reg, isMainReg: boolean = false) => reg.add(StaticHelper.QS_INSTANCE.UAPAllSelfNear, UsableAction
    .requiring({})
    .create({
        discoveredByDefault: true,
        slottable: isMainReg,
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableSelf,
        icon: isMainReg ? undefined : StaticHelper.QS_INSTANCE.UAPSelf,
        iconLocationOnItem: ItemDetailIconLocation.BottomRight, // TL: Thing done to item. BR: Item does thing. In this case
        translate: (translator) => translator.name(() =>
            isMainReg
                ? TLMain("deposit").addArgs(
                    TLMain("allTypes").inContext(TextContext.Lowercase),
                    TLMain("fromX").addArgs(TLMain("fullInventory")))
                : TLMain("fromX").addArgs(TLMain("fullInventory"))
        ),
        isUsable: (player) => {
            if(GLOBALCONFIG.force_isusable) return true;
            StaticHelper.MaybeLog.info("Checking isUsable: AllSelfNear");
            if(StaticHelper.QSLSC.checkSelfNearby()) return true;

            return false;//{ usable: false, message: StaticHelper.QS_INSTANCE.messageNoMatch };
            //return TransferHandler.canFitAny([player.inventory, ...playerHeldContainers(player)], validNearby(player), player);
        },
        execute: execSASeN
    })
));
// Extracted execute function for accessibility from this action's @Bind.
export const execSASeN = (p: Player): boolean => executeStackAction_notify(p, [{ self: true, recursive: true }], [{ tiles: true }, { doodads: true }], []);

/** 
 * Stack all types from only main inventory to nearby containers
 * Slottable.
 * Requirements:    None
 * Applicability:   Always
 * Usability:       Main inventory contents have type match(es) nearby 
 */
export const StackAllMainNear = new UsableActionGenerator((reg, isMainReg: boolean = false) => reg.add(StaticHelper.QS_INSTANCE.UAPAllMainNear, UsableAction
    .requiring({})
    .create({
        discoveredByDefault: true,
        slottable: isMainReg,
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableMain,
        icon: isMainReg ? undefined : StaticHelper.QS_INSTANCE.UAPMain,
        iconLocationOnItem: ItemDetailIconLocation.BottomRight,
        translate: (translator) => translator.name(() =>
            isMainReg
                ? TLMain("deposit").addArgs(
                    TLMain("allTypes").inContext(TextContext.Lowercase),
                    TLMain("fromX").addArgs(TLMain("mainInventory")))
                : TLMain("fromX").addArgs(TLMain("mainInventory"))
        ),
        isUsable: (player) => {
            if(GLOBALCONFIG.force_isusable) return true;
            StaticHelper.MaybeLog.info("Checking isUsable: AllMainNear");
            if(StaticHelper.QSLSC.checkSelfNearby()) return true;
            return false;// { usable: false, message: StaticHelper.QS_INSTANCE.messageNoMatch };
            //return TransferHandler.canFitAny([player.inventory], validNearby(player), player);
        },
        execute: execSAMN

    })
));
// Extracted execute function for accessibility from this action's @Bind.
export const execSAMN = (p: Player): boolean => executeStackAction_notify(p, [{ self: true }], [{ tiles: true }, { doodads: true }], []);

/** 
 * Stack all types from a held container(s) to nearby containers
 * Slottable in the context of a held container or container type.
 * Requires:
 *      [Item]: A held container or type of a held container
 * Applicability:
 *      [Item] is a held container or [ItemType] is the type of a container the player possesses.
 * Usability:
 *      Selected container(s) contents have type match(es) nearby 
 */
export const StackAllSubNear = new UsableActionGenerator((reg, isMainReg: boolean = false) => reg.add(StaticHelper.QS_INSTANCE.UAPAllSubNear, UsableAction
    .requiring({ item: { validate: (_, item) => ItemManager.isContainer(item) || isStorageType(item.type) } })
    .create({
        discoveredByDefault: true,
        slottable: isMainReg,
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableSub,
        icon: isMainReg ? undefined : StaticHelper.QS_INSTANCE.UAPSub,
        iconLocationOnItem: ItemDetailIconLocation.BottomRight, // TL: Thing done to item. BR: Item does thing.
        translate: (translator) => translator.name(({ item }) => {
            const itemStr = item?.getName(Article.Indefinite, 1) ?? TLMain("thisContainer");
            return isMainReg
                ? TLMain("deposit").addArgs(
                    TLMain("allTypes").inContext(TextContext.Lowercase),
                    TLMain("fromX").addArgs(itemStr))
                : TLMain("fromX").addArgs(itemStr);
        }),
        isUsable: (player, { item }) => {
            if(GLOBALCONFIG.force_isusable) return true;
            if(!isHeldContainer(player, item)) return false;
            StaticHelper.MaybeLog.info("Checking isUsable: AllSubNear");
            if(StaticHelper.QSLSC.checkSpecificNearby(player.island.items.hashContainer(item))) return true;
            return false;// { usable: false, message: StaticHelper.QS_INSTANCE.messageNoMatch };
        },
        execute: (player, { item }) => executeStackAction(player,
            [{ container: [item as IContainer] }],
            [{ tiles: true }, { doodads: true }],
            [])
    })
));

/** 
 * Stack selected type from full inventory to nearby containers 
 * Slottable in the context of a particular item type.
 * Requires:
 *      [item] in the player inventory
 *   or [itemType]
 * Applicability:
 *      [itemType] is present in the inventory
 * Usability:
 *      [itemType] has a match nearby
 */
export const StackTypeSelfNear = new UsableActionGenerator((reg, isMainReg: boolean = false) => reg.add(StaticHelper.QS_INSTANCE.UAPTypeSelfNear, UsableAction
    .requiring({ item: { allowOnlyItemType: () => true, validate: () => true } })
    .create({
        discoveredByDefault: true,
        slottable: isMainReg,
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableSelf,
        icon: isMainReg ? undefined : StaticHelper.QS_INSTANCE.UAPSelf,
        iconLocationOnItem: ItemDetailIconLocation.TopLeft, // TL: Thing done to item. BR: Item does thing.
        onlySlotItemType: isMainReg ? true : undefined,
        translate: (translator) => translator.name(({ item, itemType }) =>
            isMainReg
                ? TLMain("deposit").addArgs(
                    TLMain("onlyXType")
                        .inContext(TextContext.Lowercase)
                        .addArgs(!!(item ?? itemType) ? Translation.nameOf(Dictionary.Item, (item?.type ?? itemType)!, 999, Article.None) : undefined),
                    TLMain("fromX").addArgs(TLMain("fullInventory")))
                : TLMain("fromX").addArgs(TLMain("fullInventory"))
        ),
        isUsable: (player, { item, itemType }) => {
            if(GLOBALCONFIG.force_isusable) return true;
            StaticHelper.MaybeLog.info("Checking isUsable: TypeSelfNear");
            if(item && item.containedWithin && !isMainReg) { // exclude 'self->near' if 'here->near' would function identically, unless this is slotted version.
                const iHash = item.island.items.hashContainer(item.containedWithin);
                if(StaticHelper.QSLSC.checkSelfNearby([item.type!])
                    && [StaticHelper.QSLSC.player, ...StaticHelper.QSLSC.player.deepSubs()].some(c =>
                        c.cHash !== iHash && TransferHandler.canMatch([{ containedItems: [item] }], [...c.main]))
                ) return true;
            } else if(StaticHelper.QSLSC.checkSelfNearby([(item?.type ?? itemType)!])) return true;
            return false;// { usable: false, message: StaticHelper.QS_INSTANCE.messageNoMatch };
        },
        execute: (player, { item, itemType }) => executeStackAction(player,
            [{ self: true, recursive: true }],
            [{ tiles: true }, { doodads: true }],
            [{ type: (item?.type ?? itemType)! }])
    })
));

/** 
 * Stack selected type from its parent inventory to nearby containers 
 * Not slottable: Requires both type and container context. Only registered under its corresponding submenu.
 * Requires:
 *      [item] in the player inventory
 * Applicability:
 *      [item] is present in the inventory
 *  AND [item.type] items are present in another section of the inventory (otherwise redundant with TypeSelfNear)
 * Usability:
 *      [itemType] has a match nearby
 */
export const StackTypeHereNear = new UsableActionGenerator((reg, isMainReg: boolean = false) => reg.add(StaticHelper.QS_INSTANCE.UAPTypeHereNear, UsableAction
    .requiring({ item: true })
    .create({
        discoveredByDefault: true,
        slottable: false,
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableHere,
        icon: isMainReg ? undefined : StaticHelper.QS_INSTANCE.UAPHere,
        translate: (translator) => translator.name(({ item, itemType }) =>
            isMainReg
                ? TLMain("deposit").addArgs(
                    TLMain("onlyXType")
                        .inContext(TextContext.Lowercase)
                        .addArgs(!!(item ?? itemType) ? Translation.nameOf(Dictionary.Item, (item?.type ?? itemType)!, 999, Article.None) : undefined),
                    TLMain("fromX").addArgs(TLMain("here")))
                : TLMain("fromX").addArgs(TLMain("here"))
        ),
        isUsable: (player, { item }) => {
            if(GLOBALCONFIG.force_isusable) return true;
            StaticHelper.MaybeLog.info("Checking isUsable: TypeHereNear");
            if(!playerHasItem(player, item) || !item.containedWithin) return false;
            if(StaticHelper.QSLSC.checkSpecificNearby(player.island.items.hashContainer(item.containedWithin))) return true;
            return false;// { usable: false, message: StaticHelper.QS_INSTANCE.messageNoMatch };
        },
        execute: (player, { item }, _context) => executeStackAction(player,
            [{ container: item.containedWithin! }],
            [{ tiles: true }, { doodads: true }],
            [{ type: item.type }])

    })
));


/** 
 * Stack all types from nearby to full inventory
 * Slottable.
 * Applicability:
 *      Always
 * Usability:
 *      Full inventory contents have type match(es) nearby
 */
export const StackAllNearSelf = new UsableActionGenerator((reg, isMainReg: boolean = false) => reg.add(StaticHelper.QS_INSTANCE.UAPAllNearSelf, UsableAction
    .requiring(isMainReg ? {} : { item: { allowNone: true, validate: () => true } })
    .create({
        discoveredByDefault: true,
        slottable: isMainReg,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableSelf,
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        icon: isMainReg ? undefined : StaticHelper.QS_INSTANCE.UAPSelf,
        iconLocationOnItem: ItemDetailIconLocation.BottomRight, // TL: Thing done to item. BR: Item does thing. In this case
        translate: (translator) => translator.name(() =>
            isMainReg
                ? TLMain("collect").addArgs(
                    TLMain("allTypes").inContext(TextContext.Lowercase),
                    TLMain("fromXtoY").addArgs(TLMain("nearby"), (TLMain("fullInventory"))))
                : TLMain("fromXtoY").addArgs(TLMain("nearby"),TLMain("fullInventory"))
        ),
        isUsable: (player, { item }) => {
            if(GLOBALCONFIG.force_isusable) return true;
            StaticHelper.MaybeLog.info("Checking isUsable: AllNearSelf");
            if(item && !playerHasItem(player, item)) return false;
            if(StaticHelper.QSLSC.checkSelfNearby(undefined, true)) return true;
            return false;// { usable: false, message: StaticHelper.QS_INSTANCE.messageNoMatch };
        },
        execute: execSANSe
    })
));
// Extracted execute function for accessibility from this action's @Bind.
export const execSANSe = (p: Player): boolean => executeStackAction_notify(p, [{ tiles: true }, { doodads: true }], [{ self: true, recursive: true }], []);

/** 
 * Stack all types from nearby to full inventory
 * Slottable.
 * Applicability:
 *      Always
 * Usability:
 *      Full inventory contents have type match(es) nearby
 */
export const StackAllNearMain = new UsableActionGenerator((reg, isMainReg: boolean = false) => reg.add(StaticHelper.QS_INSTANCE.UAPAllNearMain, UsableAction
    .requiring({})
    .create({
        discoveredByDefault: true,
        slottable: isMainReg,
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableMain,
        icon: isMainReg ? undefined : StaticHelper.QS_INSTANCE.UAPMain,
        iconLocationOnItem: ItemDetailIconLocation.TopLeft, // TL: Thing done to item. BR: Item does thing. In this case
        translate: (translator) => translator.name(() =>
            isMainReg
                ? TLMain("collect").addArgs(
                    TLMain("allTypes").inContext(TextContext.Lowercase),
                    TLMain("fromXtoY").addArgs(TLMain("nearby"),TLMain("mainInventory")))
                : TLMain("fromXtoY").addArgs(TLMain("nearby"), TLMain("mainInventory"))
        ),
        isUsable: (player) => {
            if(GLOBALCONFIG.force_isusable) return true;
            StaticHelper.MaybeLog.info("Checking isUsable: AllNearMain");
            if(StaticHelper.QSLSC.checkSpecificNearby(player.island.items.hashContainer(player.inventory), [], true)) return true;
            return false;//{ usable: false, message: StaticHelper.QS_INSTANCE.messageNoMatch };
        },
        execute: execSANM
    })
));
// Extracted execute function for accessibility from this action's @Bind.
export const execSANM = (p: Player): boolean => executeStackAction_notify(p, [{ tiles: true }, { doodads: true }], [{ self: true }], []);

export const StackAllMainSub = new UsableActionGenerator((reg, isMainReg: boolean = false) => reg.add(StaticHelper.QS_INSTANCE.UAPAllMainSub, UsableAction
    .requiring({ item: { validate: (_, item) => ItemManager.isContainer(item) || isStorageType(item.type) } })
    .create({
        discoveredByDefault: true,
        slottable: isMainReg,
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableMain,
        icon: isMainReg ? undefined : StaticHelper.QS_INSTANCE.UAPMain,
        iconLocationOnItem: ItemDetailIconLocation.TopLeft, // TL: Thing done to item. BR: Item does thing.
        translate: (translator) => translator.name(({ item }) => {
            const itemStr = item?.getName(Article.None) ?? TLMain("thisContainer");
            return isMainReg
                ? TLMain("collect").addArgs(
                    TLMain("allTypes").inContext(TextContext.Lowercase),
                    TLMain("fromXtoY").addArgs(TLMain("mainInventory"), itemStr))
                : TLMain("fromXtoY").addArgs(TLMain("mainInventory"), itemStr);
        }),
        isUsable: (player, { item }) => {
            if(GLOBALCONFIG.force_isusable) return true;
            StaticHelper.MaybeLog.info("Checking isUsable: AllMainSub");
            if(!isHeldContainer(player, item)) return false;
            if(StaticHelper.QSLSC.checkSpecific(player.island.items.hashContainer(player.inventory), player.island.items.hashContainer(item))) return true;
            return false;//
        },
        execute: (p, u) => executeStackAction(p, [{ self: true }], [{ container: u.item as IContainer }], [])
    })
));

export const StackAllNearSub = new UsableActionGenerator((reg, isMainReg: boolean = false) => reg.add(StaticHelper.QS_INSTANCE.UAPAllNearSub, UsableAction
    .requiring({ item: { validate: (_, item) => ItemManager.isContainer(item) || isStorageType(item.type) } })
    .create({
        discoveredByDefault: true,
        slottable: isMainReg,
        iconLocationOnItem: ItemDetailIconLocation.TopLeft, // TL: Thing done to item. BR: Item does thing.
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableNear,
        icon: isMainReg ? undefined : StaticHelper.QS_INSTANCE.UAPNear,
        translate: (translator) => translator.name(({ item, itemType }) => {
            const itemStr = item ? item.getName(Article.None) : itemType ? Translation.nameOf(Dictionary.Item, itemType, 999, Article.None) : TLMain("thisContainer");
            return isMainReg
                ? TLMain("collect").addArgs(
                    TLMain("allTypes").inContext(TextContext.Lowercase),
                    TLMain("fromXtoY").addArgs(TLMain("nearby"), itemStr))
                : TLMain("fromXtoY").addArgs(TLMain("nearby"), itemStr);
        }),
        isUsable: (player, { item }) => {
            if(GLOBALCONFIG.force_isusable) return true;
            StaticHelper.MaybeLog.info("Checking isUsable: AllNearSub");
            if(!isHeldContainer(player, item)) return false;
            if(StaticHelper.QSLSC.checkSpecificNearby(player.island.items.hashContainer(item), undefined, true)) return true;
            return false;//{ usable: false, message: StaticHelper.QS_INSTANCE.messageNoMatch };
        },
        execute: (p, u) => executeStackAction(p, [{ tiles: true }, { doodads: true }], [{ container: u.item as IContainer }], [])
    })
));

export const StackAllSelfHere = new UsableActionGenerator((reg, isMainReg: boolean = false) => reg.add("StackAllSelfHere"/* StaticHelper.QS_INSTANCE.UAPAllSelfHere */, UsableAction
    .requiring({ item: true })
    .create({
        discoveredByDefault: true,
        slottable: false,
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableSelf,
        icon: StaticHelper.QS_INSTANCE.UAPSelf,
        translate: (translator) => translator.name(() =>
            isMainReg
                ? TLMain("collect").addArgs(
                    TLMain("allTypes").inContext(TextContext.Lowercase),
                    TLMain("fromXtoY").addArgs(TLMain("fullInventory"), TLMain("here")))
                : TLMain("fromXtoY").addArgs(TLMain("fullInventory"), TLMain("here"))
        ),
        isUsable: (player, { item }) => {
            if(GLOBALCONFIG.force_isusable) return true;
            StaticHelper.MaybeLog.info("Checking isUsable: AllSelfHere");
            if(playerHasItem(player, item) || !item.containedWithin) return false; // This action isn't available for player items.
            if(StaticHelper.QSLSC.checkSelfSpecific(player.island.items.hashContainer(item.containedWithin))) return true;
            return false;//{ usable: false, message: StaticHelper.QS_INSTANCE.messageNoMatch };
        },
        execute: (player, { item }, _context) => executeStackAction(player,
            [{ self: true, recursive: true }],
            [{ container: item.containedWithin! }],
            [])
    })
));

export const StackAllNearHere = new UsableActionGenerator((reg, isMainReg: boolean = false) => reg.add("StackAllNearHere"/* StaticHelper.QS_INSTANCE.UAPAllNearbyHere */, UsableAction
    .requiring({ item: true })
    .create({
        discoveredByDefault: true,
        slottable: false,
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableNear,
        icon: StaticHelper.QS_INSTANCE.UAPHere,
        translate: (translator) => translator.name(() =>
            isMainReg
                ? TLMain("collect").addArgs(
                    TLMain("allTypes").inContext(TextContext.Lowercase),
                    TLMain("fromXtoY").addArgs(TLMain("nearby"), TLMain("here")))
                : TLMain("fromXtoY").addArgs(TLMain("nearby"), TLMain("here"))
        ),
        isUsable: (player, { item }) => {
            if(GLOBALCONFIG.force_isusable) return true;
            StaticHelper.MaybeLog.info("Checking isUsable: AllNearHere");
            if(item.containedWithin === undefined) return false;
            if(StaticHelper.QSLSC.checkSpecificNearby(player.island.items.hashContainer(item.containedWithin), undefined, true)) return true;
            return false;//{ usable: false, message: StaticHelper.QS_INSTANCE.messageNoMatch };
        },
        execute: (player, { item }, _context) => executeStackAction(player,
            [{ container: validNearby(player).filter(c => c !== item.containedWithin!) }],
            [{ container: item.containedWithin! }],
            [])
    })
));

export const StackTypeSelfHere = new UsableActionGenerator((reg, isMainReg: boolean = false) => reg.add("StackTypeSelfHere"/* StaticHelper.QS_INSTANCE.UAPTypeSelfHere */, UsableAction
    .requiring({ item: true })
    .create({
        discoveredByDefault: true,
        slottable: false,
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableSelf,
        icon: StaticHelper.QS_INSTANCE.UAPSelf,
        translate: (translator) => translator.name(({ item, itemType }) =>
            isMainReg
                ? TLMain("collect").addArgs(
                    TLMain("onlyXType").inContext(TextContext.Lowercase)
                        .addArgs(!!(item ?? itemType) ? Translation.nameOf(Dictionary.Item, (item?.type ?? itemType)!, 999, Article.None) : undefined),
                    TLMain("fromXtoY").addArgs(TLMain("fullInventory"), TLMain("here")))
                : TLMain("fromXtoY").addArgs(TLMain("fullInventory"), TLMain("here"))
        ),
        //isApplicable: () => true,
        isUsable: (player, { item }) => {
            if(GLOBALCONFIG.force_isusable) return true;
            StaticHelper.MaybeLog.info("Checking isUsable: TypeSelfHere");
            if(playerHasItem(player, item) || !item.containedWithin) return false; // Unusable if playerHasItem. This action isn't available for player items.
            if(StaticHelper.QSLSC.checkSelfSpecific(player.island.items.hashContainer(item.containedWithin), [item.type])) return true;
            return false;//{ usable: false, message: StaticHelper.QS_INSTANCE.messageNoMatch };
        },
        execute: (player, { item }, _context) => executeStackAction(player,
            playerHasItem(player, item)
                ? [{ container: [player.inventory, ...playerHeldContainers(player)].filter(c => c !== item.containedWithin!) }]
                : [{ self: true, recursive: true }],
            [{ container: item.containedWithin! }],
            [{ type: item.type }])
    })
));

export const StackTypeNearHere = new UsableActionGenerator((reg, isMainReg: boolean = false) => reg.add("StackTypeNearHere"/* StaticHelper.QS_INSTANCE.UAPTypeNearbyHere */, UsableAction
    .requiring({ item: true })
    .create({
        discoveredByDefault: true,
        slottable: false,
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableNear,
        icon: StaticHelper.QS_INSTANCE.UAPNear,
        translate: (translator) => translator.name(({ item, itemType }) =>
            isMainReg
                ? TLMain("collect").addArgs(
                    TLMain("onlyXType").inContext(TextContext.Lowercase)
                        .addArgs(!!(item ?? itemType) ? Translation.nameOf(Dictionary.Item, (item?.type ?? itemType)!, 999, Article.None) : undefined),
                    TLMain("fromXtoY").addArgs(TLMain("nearby"), TLMain("here")))
                : TLMain("fromXtoY").addArgs(TLMain("nearby"), TLMain("here"))
        ),
        isUsable: (player, { item }) => {
            if(GLOBALCONFIG.force_isusable) return true;
            StaticHelper.MaybeLog.info("Checking isUsable: TypeNearHere");
            if(!item.containedWithin) return false;
            if(StaticHelper.QSLSC.checkSpecificNearby(player.island.items.hashContainer(item.containedWithin), [item.type], true)) return true;
            return false;//{ usable: false, message: StaticHelper.QS_INSTANCE.messageNoMatch };
        },
        execute: (player, { item }, _context) => executeStackAction(player,
            playerHasItem(player, item)
                ? [{ doodads: true }, { tiles: true }]
                : [{ container: validNearby(player).filter(c => c !== item.containedWithin!) }],
            [{ container: item.containedWithin! }],
            [{ type: item.type }])
    })
));
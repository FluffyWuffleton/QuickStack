import { ActionDisplayLevel } from "game/entity/action/IAction";
import UsableAction, { IUsableActionUsing } from "game/entity/action/usable/UsableAction";
import { UsableActionGenerator } from "game/entity/action/usable/UsableActionRegistrar";
import Player from "game/entity/player/Player";
import { IContainer, ItemTypeGroup } from "game/item/IItem";
import ItemManager from "game/item/ItemManager";
import Dictionary from "language/Dictionary";
import { TextContext } from "language/ITranslation";
import Translation from "language/Translation";
import { ItemDetailIconLocation } from "ui/screen/screens/game/component/Item";

import StaticHelper, { GLOBALCONFIG } from "../StaticHelper";
import TransferHandler, { isHeldContainer, isStorageType, playerHasItem, playerHasType, playerHeldContainers, validNearby } from "../TransferHandler";
import { executeStackAction, executeStackAction_notify } from "./Actions";

// isApplicable should return true if the action can accept that type of item
// and isUsable should return true if it can actually be performed right now

// enum QSTarget {
//     nearby,
//     main,
//     self,
//     sub,
//     alike
// }

// enum QSTypeMode {
//     all,
//     type
// }


// import { IUsableActionDefinition, IUsableActionRequirements } from "game/entity/action/usable/UsableAction";
// class UsableQSAction<
//     REQUIREMENTS extends IUsableActionRequirements,
//     DEFINITION extends IUsableActionDefinition<REQUIREMENTS> = IUsableActionDefinition<REQUIREMENTS>>
//     extends UsableAction<REQUIREMENTS, DEFINITION>
// {
//     private TH: TransferHandler;
//     private src: QSTarget;
//     private dest: QSTarget;
//     private mode: QSTypeMode
// }

export const UsableActionsQuickStack = new UsableActionGenerator(reg => {
    // 2nd-level submenus are registered by the parent. Visible submenu actions are registered by 2nd-level menus.
    QSSubmenu.Deposit.register(reg);
    QSSubmenu.Collect.register(reg);

    StackAllSelfNear.register(reg, true);
    StackAllMainNear.register(reg, true);
    StackAllSubNear.register(reg, true);
    StackAllLikeNear.register(reg, true);
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
    //      Deposit all to nearby from similar containers -- Slottable for container item
    // Item in inventory
    //      Deposit type to nearby from full inv
    //      Deposit type to nearby from item's location
    export const Deposit = new UsableActionGenerator(reg => reg.add("DepositMenu"/* StaticHelper.QS_INSTANCE.UAPDepositMenu */, UsableAction
        .requiring({ item: { allowNone: true, validate: () => true } })
        .create({
            displayLevel: ActionDisplayLevel.Always,
            translate: (translator) => translator.name(StaticHelper.TLMain("deposit")),
            isUsable: (player, using): boolean => {
                if(GLOBALCONFIG.force_isusable) return true;
                return (
                    (
                        using.item
                        && (QSSubmenu.DepositType.get().actions[0][1] as unknown as UsableAction<{ item: true }>)
                            .isUsable(player, { creature: using.creature, doodad: using.doodad, npc: using.npc, item: using.item, itemType: using.itemType ?? using.item.type }).usable
                    ) || (
                        (QSSubmenu.DepositAll.get().actions[0][1] as unknown as UsableAction<{ item: { allowNone: true, validate: () => true } }>)
                            .isUsable(player, { creature: using.creature, doodad: using.doodad, npc: using.npc, item: using.item, itemType: using.itemType }).usable
                    ));
            },
            submenu: (subreg) => {
                // Add subsubmenu for actions that function regardless of item selection.
                QSSubmenu.DepositAll.register(subreg);
                // Add subsubmenu for item-type actions. Requires Item.
                QSSubmenu.DepositType.register(subreg);
            }
        })
    ));

    // 2nd-level menu for deposit operations operating on all item types
    export const DepositAll = new UsableActionGenerator(reg => reg.add("DepositAllSubmenu", UsableAction
        .requiring({ item: { allowNone: true, validate: () => true } })
        .create({
            displayLevel: ActionDisplayLevel.Always,
            bindable: StaticHelper.QS_INSTANCE.bindableAll,
            translate: (translator) => translator.name(StaticHelper.TLMain("allTypes")),
            isUsable: (player, using) => {
                if(GLOBALCONFIG.force_isusable) return true;
                return (
                    (using.item
                        && (StackAllSubNear.get().actions[0][1] as unknown as UsableAction<{ item: { validate: () => boolean } }>)
                            .isUsable(player, { creature: undefined, doodad: undefined, npc: undefined, item: using.item, itemType: using.itemType }).usable
                    ) || (using.itemType
                        && (StackAllLikeNear.get().actions[0][1] as unknown as UsableAction<{ item: { allowOnlyItemType: () => boolean, validate: () => boolean } }>)
                            .isUsable(player, { creature: undefined, doodad: undefined, npc: undefined, item: using.item, itemType: using.itemType }).usable
                    ) || (!using.item
                        && !using.itemType
                        && (StackAllSelfNear.get().actions[0][1] as UsableAction<{}>)
                            .isUsable(player, { creature: undefined, doodad: undefined, npc: undefined, item: undefined, itemType: undefined }).usable
                    ));
            },
            submenu: (subreg) => {
                StackAllSelfNear.register(subreg);
                StackAllMainNear.register(subreg);
                StackAllSubNear.register(subreg);
                StackAllLikeNear.register(subreg);
            }
        })
    ));

    // 2nd-level menu for deposit operations that require a selected item type
    export const DepositType = new UsableActionGenerator(reg => reg.add("DepositTypeSubmenu", UsableAction
        .requiring({ item: true })
        .create({
            displayLevel: ActionDisplayLevel.Always,
            bindable: StaticHelper.QS_INSTANCE.bindableType,
            translate: (translator) => translator.name(({ item, itemType }) => {
                const grp = TransferHandler.getActiveGroup(item?.type ?? itemType ?? ItemTypeGroup.Invalid);
                return StaticHelper.TLMain("onlyXType").addArgs(...
                    (grp !== undefined
                        ? [
                            StaticHelper.TLGroup(grp).passTo(StaticHelper.TLMain("colorMatchGroup")),
                            StaticHelper.TLGroup("Item").passTo(Translation.reformatSingularNoun(999, false))
                        ] : [
                            item?.getName(false, 999, false, false, false, false)
                            ?? (itemType
                                ? Translation.nameOf(Dictionary.Item, itemType, false)
                                : undefined)
                        ])
                );
            }),
            isUsable: (player, using) => {
                if(GLOBALCONFIG.force_isusable) return true;
                return (StackTypeSelfNear.get(true).actions[0][1] as unknown as UsableAction<{ item: { allowOnlyItemType: () => boolean, validate: () => boolean } }>)
                    .isUsable(player, { creature: undefined, doodad: undefined, npc: undefined, item: using.item, itemType: using.itemType ?? using.item.type }).usable
            },
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
    export const Collect = new UsableActionGenerator(reg => reg.add("CollectMenu"/* StaticHelper.QS_INSTANCE.UAPCollectMenu */, UsableAction
        .requiring({ item: { allowNone: true } })
        .create({
            displayLevel: ActionDisplayLevel.Always,
            translate: (translator) => translator.name(StaticHelper.TLMain("collect")),
            isApplicable: () => true,
            isUsable: (player, using) => {
                if(GLOBALCONFIG.force_isusable) return true;
                return (QSSubmenu.CollectAll.get().actions[0][1] as UsableAction<{ item: { allowNone: true } }>).isUsable(player, using).usable
                    || (QSSubmenu.CollectType.get().actions[0][1] as UsableAction<{ item: { allowNone: true } }>).isUsable(player, using).usable;
            },
            submenu: (subreg) => {
                // Add subsubmenu for actions that function regardless of item selection.
                QSSubmenu.CollectAll.register(subreg);
                // Add subsubmenu for item-type actions. Requires Item.
                QSSubmenu.CollectType.register(subreg);
            }
        })
    ));

    // 2nd-level menu for collection operations operating on all item types
    export const CollectAll = new UsableActionGenerator(reg => reg.add("CollectAllSubmenu", UsableAction
        .requiring({ item: { allowNone: true, validate: () => true } })
        .create({
            displayLevel: ActionDisplayLevel.Always,
            bindable: StaticHelper.QS_INSTANCE.bindableAll,
            translate: (translator) => translator.name(StaticHelper.TLMain("allTypes")),
            isUsable: (player, { item }) =>
                GLOBALCONFIG.force_isusable
                || (
                    (item === undefined)
                    && (StackAllNearSelf.get().actions[0][1] as UsableAction<{ item: { allowNone: true } }>)
                        .isUsable(player, { creature: undefined, doodad: undefined, item: item, itemType: undefined, npc: undefined }).usable
                ) || (
                    (item !== undefined)
                    && (
                        (StackAllNearHere.get().actions[0][1] as UsableAction<{ item: true }>)
                            .isUsable(player, { creature: undefined, doodad: undefined, item: item, itemType: item.type, npc: undefined }).usable
                        ||
                        (StackAllSelfHere.get().actions[0][1] as UsableAction<{ item: true }>)
                            .isUsable(player, { creature: undefined, doodad: undefined, item: item, itemType: item.type, npc: undefined }).usable
                        ||
                        (StackAllMainSub.get().actions[0][1] as UsableAction<{ item: true }>)
                            .isUsable(player, { creature: undefined, doodad: undefined, item: item, itemType: item.type, npc: undefined }).usable
                    )
                ),
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
    export const CollectType = new UsableActionGenerator(reg => reg.add("CollectTypeSubmenu", UsableAction
        .requiring({ item: true })
        .create({
            displayLevel: ActionDisplayLevel.Always,
            bindable: StaticHelper.QS_INSTANCE.bindableType,
            translate: (translator) => translator.name(({ item, itemType }) => {
                const grp = TransferHandler.getActiveGroup(item?.type ?? itemType ?? ItemTypeGroup.Invalid);
                return StaticHelper.TLMain("onlyXType").addArgs(...
                    (grp !== undefined
                        ? [
                            StaticHelper.TLGroup(grp).passTo(StaticHelper.TLMain("colorMatchGroup")),
                            StaticHelper.TLGroup("Item").passTo(Translation.reformatSingularNoun(999, false))
                        ] : [
                            item?.getName(false, 999, false, false, false, false)
                            ?? (itemType
                                ? Translation.nameOf(Dictionary.Item, itemType, false)
                                : undefined)
                        ])
                );
            }),
            isUsable: (player, using) => {
                if(GLOBALCONFIG.force_isusable) return true;
                return (StackTypeNearHere.get().actions[0][1] as unknown as UsableAction<{ item: { validate: () => boolean } }>)
                    .isUsable(player, using as unknown as IUsableActionUsing<{ item: { validate: () => boolean } }>).usable
                    || (StackTypeSelfHere.get().actions[0][1] as unknown as UsableAction<{ item: { validate: () => boolean } }>)
                        .isUsable(player, using as unknown as IUsableActionUsing<{ item: { validate: () => boolean } }>).usable;
            },
            submenu: (subreg) => {
                StackTypeNearHere.register(subreg);
                StackTypeSelfHere.register(subreg);
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
        slottable: isMainReg,
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableSelf,
        icon: isMainReg ? undefined : StaticHelper.QS_INSTANCE.UAPSelf,
        iconLocationOnItem: ItemDetailIconLocation.BottomRight, // TL: Thing done to item. BR: Item does thing. In this case
        translate: (translator) => translator.name(() =>
            isMainReg
                ? StaticHelper.TLMain("deposit").addArgs(
                    StaticHelper.TLMain("allTypes").inContext(TextContext.Lowercase),
                    StaticHelper.TLMain("fromX").addArgs(StaticHelper.TLMain("fullInventory")))
                : StaticHelper.TLMain("fromX").addArgs(StaticHelper.TLMain("fullInventory"))
        ),
        isUsable: (player) => {
            if(GLOBALCONFIG.force_isusable) return true;
            return StaticHelper.QSLSC.checkSelfNearby();
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
        slottable: isMainReg,
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableMain,
        icon: isMainReg ? undefined : StaticHelper.QS_INSTANCE.UAPMain,
        iconLocationOnItem: ItemDetailIconLocation.BottomRight,
        translate: (translator) => translator.name(() =>
            isMainReg
                ? StaticHelper.TLMain("deposit").addArgs(
                    StaticHelper.TLMain("allTypes").inContext(TextContext.Lowercase),
                    StaticHelper.TLMain("fromX").addArgs(StaticHelper.TLMain("mainInventory")))
                : StaticHelper.TLMain("fromX").addArgs(StaticHelper.TLMain("mainInventory"))
        ),
        isUsable: (player) => {
            if(GLOBALCONFIG.force_isusable) return true;
            return StaticHelper.QSLSC.checkSelfNearby();
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
    .requiring({
        item: { validate: (_, item) => isStorageType(item.type) }
    })
    .create({
        slottable: isMainReg,
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableSub,
        icon: isMainReg ? undefined : StaticHelper.QS_INSTANCE.UAPSub,
        iconLocationOnItem: ItemDetailIconLocation.BottomRight, // TL: Thing done to item. BR: Item does thing.
        translate: (translator) => translator.name(({ item, itemType }) => {
            const itemStr = !!(item ?? itemType) ? Translation.nameOf(Dictionary.Item, (item?.type ?? itemType)!, 999, false) : StaticHelper.TLMain("thisContainer");
            return isMainReg
                ? StaticHelper.TLMain("deposit").addArgs(
                    StaticHelper.TLMain("allTypes").inContext(TextContext.Lowercase),
                    StaticHelper.TLMain("fromX").addArgs(itemStr))
                : StaticHelper.TLMain("fromX").addArgs(itemStr);
        }),
        isUsable: (player, { item }) => {
            if(GLOBALCONFIG.force_isusable) return true;
            if(!isHeldContainer(player, item)) return false;
            switch(StaticHelper.QSLSC.checkSpecificNearby(player.island.items.hashContainer(item))) {
                case undefined: StaticHelper.QS_LOG.warn(`LocalStorageCache Failed to locate hash for held container '${item.getName()}'`);
                case false: return false;
                case true: return true;
            }
            return isHeldContainer(player, item)
                && TransferHandler.canFitAny([item as IContainer], validNearby(player), player);
        },
        execute: (player, { item }) => executeStackAction(player,
            [{ container: [item as IContainer] }],
            [{ tiles: true }, { doodads: true }],
            [])
    })
));

/** 
* Stack all types from a held container and all similar containers to nearby containers
* Slottable in the context of a held container or container type.
* Requires:
*      [Item] or [ItemType]: A held container type.
* Applicability:
*      [Item] is a held container.
* OR   [ItemType] is a container type present in inventory
* Usability:
*      Held container(s) contain type match(es) nearby 
*/
export const StackAllLikeNear = new UsableActionGenerator((reg, isMainReg: boolean = false) => reg.add(StaticHelper.QS_INSTANCE.UAPAllLikeNear, UsableAction
    .requiring({
        item: {
            allowOnlyItemType: (_, type) => isStorageType(type),
            validate: (_, item) => isStorageType(item.type)
        }
    })
    .create({
        slottable: true,
        iconLocationOnItem: ItemDetailIconLocation.BottomRight, // TL: Thing done to item. BR: Item does thing.
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableLike,
        icon: isMainReg ? undefined : StaticHelper.QS_INSTANCE.UAPAlike,
        translate: (translator) => translator.name(({ item, itemType }) => {
            const itemStr = !!(item ?? itemType) ? Translation.nameOf(Dictionary.Item, (item?.type ?? itemType)!, 999, false) : StaticHelper.TLMain("likeContainers");
            return isMainReg
                ? StaticHelper.TLMain("deposit").addArgs(
                    StaticHelper.TLMain("allTypes").inContext(TextContext.Lowercase),
                    StaticHelper.TLMain("fromX").addArgs(StaticHelper.TLMain("allX").addArgs(itemStr)))
                : StaticHelper.TLMain("fromX").addArgs(StaticHelper.TLMain("allX").addArgs(itemStr));
        }),
        isUsable: (player, { item, itemType }) => {
            if(GLOBALCONFIG.force_isusable) return true;
            if(item && !isHeldContainer(player, item)) return false;
            if(itemType && !playerHasType(player, itemType)) return false;
            for(const container of playerHeldContainers(player, [(item?.type ?? itemType)!]))
                switch(StaticHelper.QSLSC.checkSpecificNearby(player.island.items.hashContainer(container))) {
                    case undefined: StaticHelper.QS_LOG.warn(`LocalStorageCache Failed to locate hash for held container '${container}'`);
                    case false: break;
                    case true: return true;
                }
            return false;
            //return TransferHandler.canFitAny(playerHeldContainers(player, [(item?.type ?? itemType)!]), validNearby(player), player);
        },
        execute: (player, { item, itemType }) => executeStackAction(player,
            [{ container: playerHeldContainers(player, [(item?.type ?? itemType)!]) }],
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
    .requiring({
        item: { allowOnlyItemType: () => true }
    })
    .create({
        slottable: true,
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableSelf,
        icon: isMainReg ? undefined : StaticHelper.QS_INSTANCE.UAPSelf,
        iconLocationOnItem: ItemDetailIconLocation.TopLeft, // TL: Thing done to item. BR: Item does thing.
        translate: (translator) => translator.name(({ item, itemType }) =>
            isMainReg
                ? StaticHelper.TLMain("deposit").addArgs(
                    StaticHelper.TLMain("onlyXType")
                        .inContext(TextContext.Lowercase)
                        .addArgs(!!(item ?? itemType) ? Translation.nameOf(Dictionary.Item, (item?.type ?? itemType)!, 999, false) : undefined),
                    StaticHelper.TLMain("fromX").addArgs(StaticHelper.TLMain("fullInventory")))
                : StaticHelper.TLMain("fromX").addArgs(StaticHelper.TLMain("fullInventory"))
        ),
        isUsable: (player, { itemType }) => {
            if(GLOBALCONFIG.force_isusable) return true;
            return StaticHelper.QSLSC.checkSelfNearby([itemType]);

            //return playerHasType(player, itemType)
            //    && TransferHandler.canFitAny([player.inventory, ...playerHeldContainers(player)], validNearby(player), player, [{ type: itemType }]);
        },
        execute: (player, { itemType }) => executeStackAction(player,
            [{ self: true, recursive: true }],
            [{ tiles: true }, { doodads: true }],
            [{ type: itemType }])
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
        slottable: false,
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableHere,
        icon: isMainReg ? undefined : StaticHelper.QS_INSTANCE.UAPHere,
        translate: (translator) => translator.name(({ item, itemType }) =>
            isMainReg
                ? StaticHelper.TLMain("deposit").addArgs(
                    StaticHelper.TLMain("onlyXType")
                        .inContext(TextContext.Lowercase)
                        .addArgs(!!(item ?? itemType) ? Translation.nameOf(Dictionary.Item, (item?.type ?? itemType)!, 999, false) : undefined),
                    StaticHelper.TLMain("fromX").addArgs(StaticHelper.TLMain("here")))
                : StaticHelper.TLMain("fromX").addArgs(StaticHelper.TLMain("here"))
        ),
        isUsable: (player, { item }) => {
            if(GLOBALCONFIG.force_isusable) return true;
            if(!playerHasItem(player, item) || !item.containedWithin) return false;
            const check = StaticHelper.QSLSC.checkSpecificNearby(player.island.items.hashContainer(item.containedWithin));
            if(check === undefined) StaticHelper.QS_LOG.warn(`LocalStorageCache failed to locate hash for location of item '${item.getName()}'`);
            return !!check;
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
    .requiring({ item: { allowNone: true, validate: (p, it) => playerHasItem(p, it) } })
    .create({
        slottable: isMainReg,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableSelf,
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        icon: isMainReg ? undefined : StaticHelper.QS_INSTANCE.UAPSelf,
        iconLocationOnItem: ItemDetailIconLocation.BottomRight, // TL: Thing done to item. BR: Item does thing. In this case
        translate: (translator) => translator.name(() =>
            isMainReg
                ? StaticHelper.TLMain("collect").addArgs(
                    StaticHelper.TLMain("allTypes").inContext(TextContext.Lowercase),
                    StaticHelper.TLFromTo("fullInventory", "nearby"))
                : StaticHelper.TLFromTo("fullInventory", "nearby")
        ),
        isUsable: (player) => {
            if(GLOBALCONFIG.force_isusable) return true;
            return StaticHelper.QSLSC.checkSelfNearby([], true);
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
        slottable: isMainReg,
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableMain,
        icon: isMainReg ? undefined : StaticHelper.QS_INSTANCE.UAPMain,
        iconLocationOnItem: ItemDetailIconLocation.TopLeft, // TL: Thing done to item. BR: Item does thing. In this case
        translate: (translator) => translator.name(() =>
            isMainReg
                ? StaticHelper.TLMain("collect").addArgs(
                    StaticHelper.TLMain("allTypes").inContext(TextContext.Lowercase),
                    StaticHelper.TLFromTo("mainInventory", "nearby"))
                : StaticHelper.TLFromTo("mainInventory", "nearby")
        ),
        isUsable: (player) => {
            if(GLOBALCONFIG.force_isusable) return true;
            const check = StaticHelper.QSLSC.checkSpecificNearby(player.island.items.hashContainer(player.inventory), [], true);
            if(check === undefined) StaticHelper.QS_LOG.warn(`LocalStorageCache failed to locate hash for player inventory`);
            return !!check;
        },
        execute: execSANM
    })
));
// Extracted execute function for accessibility from this action's @Bind.
export const execSANM = (p: Player): boolean => executeStackAction_notify(p, [{ tiles: true }, { doodads: true }], [{ self: true }], []);


export const StackAllMainSub = new UsableActionGenerator((reg, isMainReg: boolean = false) => reg.add(StaticHelper.QS_INSTANCE.UAPAllMainSub, UsableAction
    .requiring({ item: { validate: (_, item) => ItemManager.isInGroup(item.type, ItemTypeGroup.Storage) } })
    .create({
        slottable: isMainReg,
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableMain,
        icon: isMainReg ? undefined : StaticHelper.QS_INSTANCE.UAPMain,
        iconLocationOnItem: ItemDetailIconLocation.TopLeft, // TL: Thing done to item. BR: Item does thing.
        translate: (translator) => translator.name(({ item, itemType }) => {
            const itemStr = item ? item.getName(false) : itemType ? Translation.nameOf(Dictionary.Item, itemType, 999, false) : StaticHelper.TLMain("thisContainer");
            return isMainReg
                ? StaticHelper.TLMain("collect").addArgs(
                    StaticHelper.TLMain("allTypes").inContext(TextContext.Lowercase),
                    StaticHelper.TLFromTo(itemStr, "mainInventory"))
                : StaticHelper.TLFromTo(itemStr, "mainInventory");
        }),
        // isApplicable: (player, { item }) => {
        //     if(GLOBALCONFIG.force_isusable) return true;
        //     ;
        // },
        isUsable: (player, { item }) => {
            if(GLOBALCONFIG.force_isusable) return true;
            if(!playerHasItem(player,item)) return false;
            const check = StaticHelper.QSLSC.checkSpecific(player.island.items.hashContainer(player.inventory), player.island.items.hashContainer(item));
            if(check === undefined) StaticHelper.QS_LOG.warn(`LocalStorageCache failed to locate hash for either player inventory or held container '${item.getName()}'`);
            return !!check;
        },
        execute: (p, u) => executeStackAction(p, [{ self: true }], [{ container: u.item as IContainer }], [])
    })
));

export const StackAllNearSub = new UsableActionGenerator((reg, isMainReg: boolean = false) => reg.add(StaticHelper.QS_INSTANCE.UAPAllNearSub, UsableAction
    .requiring({ item: { validate: (_, item) => isStorageType(item.type) } })
    .create({
        slottable: isMainReg,
        iconLocationOnItem: ItemDetailIconLocation.TopLeft, // TL: Thing done to item. BR: Item does thing.
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableNear,
        icon: isMainReg ? undefined : StaticHelper.QS_INSTANCE.UAPNearby,
        translate: (translator) => translator.name(({ item, itemType }) => {
            const itemStr = item ? item.getName(false) : itemType ? Translation.nameOf(Dictionary.Item, itemType, 999, false) : StaticHelper.TLMain("thisContainer");
            return isMainReg
                ? StaticHelper.TLMain("collect").addArgs(
                    StaticHelper.TLMain("allTypes").inContext(TextContext.Lowercase),
                    StaticHelper.TLFromTo(itemStr, "nearby"))
                : StaticHelper.TLFromTo(itemStr, "nearby");
        }),
        isUsable: (player, { item }) => {
            if(GLOBALCONFIG.force_isusable) return true;
            if(!isHeldContainer(player, item)) return false;
            const check = StaticHelper.QSLSC.checkSpecificNearby(player.island.items.hashContainer(item), [], true);
            if(check === undefined) StaticHelper.QS_LOG.warn(`LocalStorageCache failed to locate hash for held container '${item.getName()}'`);
            return !!check;
        },
        execute: (p, u) => executeStackAction(p, [{ tiles: true }, { doodads: true }], [{ container: u.item as IContainer }], [])
    })
));

export const StackAllSelfHere = new UsableActionGenerator((reg, isMainReg: boolean = false) => reg.add("StackAllSelfHere"/* StaticHelper.QS_INSTANCE.UAPAllSelfHere */, UsableAction
    .requiring({ item: true })
    .create({
        slottable: false,
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableSelf,
        icon: StaticHelper.QS_INSTANCE.UAPSelf,
        translate: (translator) => translator.name(() =>
            isMainReg
                ? StaticHelper.TLMain("collect").addArgs(
                    StaticHelper.TLMain("allTypes").inContext(TextContext.Lowercase),
                    StaticHelper.TLFromTo("here", "fullInventory"))
                : StaticHelper.TLFromTo("here", "fullInventory")
        ),
        isUsable: (player, { item }) => {
            if(GLOBALCONFIG.force_isusable) return true;
            if(playerHasItem(player,item) || !item.containedWithin) return false; // NOT !playerHasItem. This action isn't available for player items.
            
            const check = StaticHelper.QSLSC.checkSelfSpecific(player.island.items.hashContainer(item.containedWithin));
            if(check === undefined) StaticHelper.QS_LOG.warn(`LocalStorageCache failed to locate hash for location of nearby item '${item.getName()}'`);
            return !!check;
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
        slottable: false,
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableNear,
        icon: StaticHelper.QS_INSTANCE.UAPHere,
        translate: (translator) => translator.name(() =>
            isMainReg
                ? StaticHelper.TLMain("collect").addArgs(
                    StaticHelper.TLMain("allTypes").inContext(TextContext.Lowercase),
                    StaticHelper.TLFromTo("here", "nearby"))
                : StaticHelper.TLFromTo("here", "nearby")
        ),
        isUsable: (player, { item }) => {
            if(GLOBALCONFIG.force_isusable) return true;
            if(!item.containedWithin) return false;
            const check = StaticHelper.QSLSC.checkSpecificNearby(player.island.items.hashContainer(item.containedWithin), [], true);
            if(check === undefined) StaticHelper.QS_LOG.warn(`LocalStorageCache failed to locate hash for location of item '${item.getName()}'`);
            return !!check;
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
        slottable: false,
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableSelf,
        icon: StaticHelper.QS_INSTANCE.UAPSelf,
        translate: (translator) => translator.name(({ item, itemType }) =>
            isMainReg
                ? StaticHelper.TLMain("collect").addArgs(
                    StaticHelper.TLMain("onlyXType")
                        .inContext(TextContext.Lowercase)
                        .addArgs(!!(item ?? itemType) ? Translation.nameOf(Dictionary.Item, (item?.type ?? itemType)!, 999, false) : undefined),
                    StaticHelper.TLFromTo("here", "fullInventory"))
                : StaticHelper.TLFromTo("here", "fullInventory")
        ),
        //isApplicable: () => true,
        isUsable: (player, { item }) => {
            if(GLOBALCONFIG.force_isusable) return true;
            if(playerHasItem(player,item) || !item.containedWithin) return false; // NOT !playerHasItem. This action isn't available for player items.
            
            const check = StaticHelper.QSLSC.checkSelfSpecific(player.island.items.hashContainer(item.containedWithin), [item.type]);
            if(check === undefined) StaticHelper.QS_LOG.warn(`LocalStorageCache failed to locate hash for location of nearby item '${item.getName()}'`);
            return !!check;
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
        slottable: false,
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableNear,
        icon: StaticHelper.QS_INSTANCE.UAPNearby,
        translate: (translator) => translator.name(({ item, itemType }) =>
            isMainReg
                ? StaticHelper.TLMain("collect").addArgs(
                    StaticHelper.TLMain("onlyXType")
                        .inContext(TextContext.Lowercase)
                        .addArgs(!!(item ?? itemType) ? Translation.nameOf(Dictionary.Item, (item?.type ?? itemType)!, 999, false) : undefined),
                    StaticHelper.TLFromTo("here", "nearby"))
                : StaticHelper.TLFromTo("here", "nearby")
        ),
        isUsable: (player, { item }) => {
            if(GLOBALCONFIG.force_isusable) return true;
            if(!item.containedWithin) return false;
            const check = StaticHelper.QSLSC.checkSpecificNearby(player.island.items.hashContainer(item.containedWithin), [item.type], true);
            if(check === undefined) StaticHelper.QS_LOG.warn(`LocalStorageCache failed to locate hash for location of item '${item.getName()}'`);
            return !!check;

        },
        execute: (player, { item }, _context) => executeStackAction(player,
            playerHasItem(player, item)
                ? [{ doodads: true }, { tiles: true }]
                : [{ container: validNearby(player).filter(c => c !== item.containedWithin!) }],
            [{ container: item.containedWithin! }],
            [{ type: item.type }])
    })
));
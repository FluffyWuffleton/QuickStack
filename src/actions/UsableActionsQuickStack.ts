import UsableAction, { IUsableActionUsing } from "game/entity/action/usable/UsableAction";
import StaticHelper from "../StaticHelper";
import { executeStackAction, executeStackAction_notify } from "./Actions";
import { ActionDisplayLevel } from "game/entity/action/IAction";
import { UsableActionGenerator } from "game/entity/action/usable/UsableActionRegistrar";
import Translation from "language/Translation";
import TransferHandler, { playerHeldContainers, isHeldContainer, playerHasItem, playerHasType, validNearby, isStorageType } from "../TransferHandler";
import { ContainerReferenceType, IContainer, ItemTypeGroup } from "game/item/IItem";
import Dictionary from "language/Dictionary";
import { TextContext } from "language/ITranslation";
import { ItemDetailIconLocation } from "ui/screen/screens/game/component/Item";
import Player from "game/entity/player/Player";
import Item from "game/item/Item";
import { GLOBALCONFIG } from "../StaticHelper";
import ItemManager from "game/item/ItemManager";

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

    StackAllSelfNearby.register(reg, true);
    StackAllMainNearby.register(reg, true);
    StackAllSubNearby.register(reg, true);
    StackAllAlikeSubNearby.register(reg, true);
    StackTypeSelfNearby.register(reg, true);
    StackTypeHereNearby.register(reg, true);
    StackAllNearbySelf.register(reg, true);
    StackAllNearbyMain.register(reg, true);
    StackAllMainSub.register(reg, true);
    StackAllNearbySub.register(reg, true);
    StackAllSelfHere.register(reg, true);
    StackAllNearbyHere.register(reg, true);
    StackTypeNearbyHere.register(reg, true);
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
            translate: (translator) => translator.name(StaticHelper.TLget("deposit")),
            isApplicable: () => true,
            isUsable: (player, using) => {
                if(GLOBALCONFIG.force_isusable) return true;
                return using.item
                    ? (QSSubmenu.DepositType.get().actions[0][1] as unknown as UsableAction<{ item: true }>)
                        .isUsable(player, { creature: using.creature, doodad: using.doodad, npc: using.npc, item: using.item, itemType: using.itemType ?? using.item.type })
                    : (QSSubmenu.DepositAll.get().actions[0][1] as unknown as UsableAction<{ item: { allowNone: true, validate: () => true } }>)
                        .isUsable(player, { creature: using.creature, doodad: using.doodad, npc: using.npc, item: using.item, itemType: using.itemType })
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
            translate: (translator) => translator.name(StaticHelper.TLget("allTypes")),
            isUsable: (player, using) => {
                if(GLOBALCONFIG.force_isusable) return true;
                return using.item
                    ? (StackAllSubNearby.get().actions[0][1] as unknown as UsableAction<{ item: { validate: () => boolean } }>)
                        .isUsable(player, { creature: undefined, doodad: undefined, npc: undefined, item: using.item, itemType: using.itemType })
                    : using.itemType
                        ? (StackAllAlikeSubNearby.get().actions[0][1] as unknown as UsableAction<{ item: { allowOnlyItemType: () => boolean, validate: () => boolean } }>)
                            .isUsable(player, { creature: undefined, doodad: undefined, npc: undefined, item: using.item, itemType: using.itemType })
                        : (StackAllSelfNearby.get().actions[0][1] as UsableAction<{}>)
                            .isUsable(player, { creature: undefined, doodad: undefined, npc: undefined, item: undefined, itemType: undefined });
            },
            submenu: (subreg) => {
                StackAllSelfNearby.register(subreg);
                StackAllMainNearby.register(subreg);
                StackAllSubNearby.register(subreg);
                StackAllAlikeSubNearby.register(subreg);
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
                return StaticHelper.TLget("onlyXType").addArgs(...
                    (grp !== undefined
                        ? [
                            StaticHelper.TLget(grp).passTo(StaticHelper.TLget("colorMatchGroup")),
                            StaticHelper.TLget("Item").passTo(Translation.reformatSingularNoun(999, false))
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
                return (StackTypeSelfNearby.get(true).actions[0][1] as unknown as UsableAction<{ item: { allowOnlyItemType: () => boolean, validate: () => boolean } }>)
                    .isUsable(player, { creature: undefined, doodad: undefined, npc: undefined, item: using.item, itemType: using.itemType ?? using.item.type });
            },
            submenu: (subreg) => {
                StackTypeSelfNearby.register(subreg);
                StackTypeHereNearby.register(subreg);
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
            translate: (translator) => translator.name(StaticHelper.TLget("collect")),
            isApplicable: () => true,
            isUsable: (player, using) => {
                if(GLOBALCONFIG.force_isusable) return true;
                // The all-types submenu is the most widely applicable. If its actions aren't usable, none of the rest will be either.
                return (QSSubmenu.CollectAll.get().actions[0][1] as UsableAction<{ item: { allowNone: true } }>).isUsable(player, using)
                    || (QSSubmenu.CollectType.get().actions[0][1] as UsableAction<{ item: { allowNone: true } }>).isUsable(player, using);
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
        .requiring({ item: { allowNone: true } })
        .create({
            displayLevel: ActionDisplayLevel.Always,
            bindable: StaticHelper.QS_INSTANCE.bindableAll,
            translate: (translator) => translator.name(StaticHelper.TLget("allTypes")),
            isUsable: (player, using) => {
                if(GLOBALCONFIG.force_isusable) return true;
                return (StackAllNearbySelf.get(true).actions[0][1] as UsableAction<{ item: { allowNone: true } }>).isUsable(player, using);
            },
            submenu: (subreg) => {
                StackAllNearbySelf.register(subreg);
                StackAllNearbyMain.register(subreg);
                StackAllMainSub.register(subreg);
                StackAllNearbySub.register(subreg);
                StackAllSelfHere.register(subreg);
                StackAllNearbyHere.register(subreg);
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
                return StaticHelper.TLget("onlyXType").addArgs(...
                    (grp !== undefined
                        ? [
                            StaticHelper.TLget(grp).passTo(StaticHelper.TLget("colorMatchGroup")),
                            StaticHelper.TLget("Item").passTo(Translation.reformatSingularNoun(999, false))
                        ] : [
                            item?.getName(false, 999, false, false, false, false)
                            ?? (itemType
                                ? Translation.nameOf(Dictionary.Item, itemType, false)
                                : undefined)
                        ])
                );
            }),
            isApplicable: (player, using) => true,
            isUsable: (player, using) => {
                if(GLOBALCONFIG.force_isusable) return true;
                return (StackTypeNearbyHere.get().actions[0][1] as unknown as UsableAction<{ item: { validate: (p: Player, v: Item) => boolean } }>)
                    .isUsable(player, using as unknown as IUsableActionUsing<{ item: { validate: (p: Player, v: Item) => boolean } }>);
            },
            submenu: (subreg) => {
                StackTypeNearbyHere.register(subreg);
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
export const StackAllSelfNearby = new UsableActionGenerator((reg, isMainReg: boolean = false) => reg.add(StaticHelper.QS_INSTANCE.UAPAllSelfNearby, UsableAction
    .requiring({})
    .create({
        slottable: isMainReg,
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableSelf,
        icon: isMainReg ? undefined : StaticHelper.QS_INSTANCE.UAPSelf,
        iconLocationOnItem: ItemDetailIconLocation.BottomRight, // TL: Thing done to item. BR: Item does thing. In this case
        translate: (translator) => translator.name(() =>
            isMainReg
                ? StaticHelper.TLget("deposit").addArgs(
                    StaticHelper.TLget("allTypes").inContext(TextContext.Lowercase),
                    StaticHelper.TLget("fromX").addArgs(StaticHelper.TLget("fullInventory")))
                : StaticHelper.TLget("fromX").addArgs(StaticHelper.TLget("fullInventory"))
        ),
        isUsable: (player) => {
            if(GLOBALCONFIG.force_isusable) return true;
            return TransferHandler.canFitAny([player.inventory, ...playerHeldContainers(player)], validNearby(player), player);
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
export const StackAllMainNearby = new UsableActionGenerator((reg, isMainReg: boolean = false) => reg.add(StaticHelper.QS_INSTANCE.UAPAllMainNearby, UsableAction
    .requiring({})
    .create({
        slottable: isMainReg,
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableMain,
        icon: isMainReg ? undefined : StaticHelper.QS_INSTANCE.UAPMain,
        iconLocationOnItem: ItemDetailIconLocation.BottomRight,
        translate: (translator) => translator.name(() =>
            isMainReg
                ? StaticHelper.TLget("deposit").addArgs(
                    StaticHelper.TLget("allTypes").inContext(TextContext.Lowercase),
                    StaticHelper.TLget("fromX").addArgs(StaticHelper.TLget("mainInventory")))
                : StaticHelper.TLget("fromX").addArgs(StaticHelper.TLget("mainInventory"))
        ),
        isUsable: (player) => {
            if(GLOBALCONFIG.force_isusable) return true;
            return TransferHandler.canFitAny([player.inventory], validNearby(player), player);
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
export const StackAllSubNearby = new UsableActionGenerator((reg, isMainReg: boolean = false) => reg.add(StaticHelper.QS_INSTANCE.UAPAllSubNearby, UsableAction
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
            const itemStr = !!(item ?? itemType) ? Translation.nameOf(Dictionary.Item, (item?.type ?? itemType)!, 999, false) : StaticHelper.TLget("thisContainer");
            return isMainReg
                ? StaticHelper.TLget("deposit").addArgs(
                    StaticHelper.TLget("allTypes").inContext(TextContext.Lowercase),
                    StaticHelper.TLget("fromX").addArgs(itemStr))
                : StaticHelper.TLget("fromX").addArgs(itemStr);
        }),
        isUsable: (player, { item }) => {
            if(GLOBALCONFIG.force_isusable) return true;
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
export const StackAllAlikeSubNearby = new UsableActionGenerator((reg, isMainReg: boolean = false) => reg.add(StaticHelper.QS_INSTANCE.UAPAllAlikeSubNearby, UsableAction
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
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableAlike,
        icon: isMainReg ? undefined : StaticHelper.QS_INSTANCE.UAPAlike,
        translate: (translator) => translator.name(({ item, itemType }) => {
            const itemStr = !!(item ?? itemType) ? Translation.nameOf(Dictionary.Item, (item?.type ?? itemType)!, 999, false) : StaticHelper.TLget("likeContainers");
            return isMainReg
                ? StaticHelper.TLget("deposit").addArgs(
                    StaticHelper.TLget("allTypes").inContext(TextContext.Lowercase),
                    StaticHelper.TLget("fromX").addArgs(StaticHelper.TLget("allX").addArgs(itemStr)))
                : StaticHelper.TLget("fromX").addArgs(StaticHelper.TLget("allX").addArgs(itemStr));
        }),
        isUsable: (player, { item, itemType }) => {
            if(GLOBALCONFIG.force_isusable) return true;
            if(item && !isHeldContainer(player, item)) return false;
            if(itemType && !playerHasType(player, itemType)) return false;
            return TransferHandler.canFitAny(playerHeldContainers(player, [(item?.type ?? itemType)!]), validNearby(player), player);
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
export const StackTypeSelfNearby = new UsableActionGenerator((reg, isMainReg: boolean = false) => reg.add(StaticHelper.QS_INSTANCE.UAPTypeSelfNearby, UsableAction
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
                ? StaticHelper.TLget("deposit").addArgs(
                    StaticHelper.TLget("onlyXType")
                        .inContext(TextContext.Lowercase)
                        .addArgs(!!(item ?? itemType) ? Translation.nameOf(Dictionary.Item, (item?.type ?? itemType)!, 999, false) : undefined),
                    StaticHelper.TLget("fromX").addArgs(StaticHelper.TLget("fullInventory")))
                : StaticHelper.TLget("fromX").addArgs(StaticHelper.TLget("fullInventory"))
        ),
        isUsable: (player, { itemType }) => {
            if(GLOBALCONFIG.force_isusable) return true;
            return playerHasType(player, itemType)
                && TransferHandler.canFitAny([player.inventory, ...playerHeldContainers(player)], validNearby(player), player, [{ type: itemType }]);
        },
        execute: (player, { itemType }) => executeStackAction(player,
            [{ self: true, recursive: true }],
            [{ tiles: true }, { doodads: true }],
            [itemType])
    })
));

/** 
 * Stack selected type from its parent inventory to nearby containers 
 * Not slottable: Requires both type and container context. Only registered under its corresponding submenu.
 * Requires:
 *      [item] in the player inventory
 * Applicability:
 *      [item] is present in the inventory
 *  AND [item.type] items are present in another section of the inventory (otherwise redundant with TypeSelfNearby)
 * Usability:
 *      [itemType] has a match nearby
 */
export const StackTypeHereNearby = new UsableActionGenerator((reg, isMainReg: boolean = false) => reg.add(StaticHelper.QS_INSTANCE.UAPTypeHereNearby, UsableAction
    .requiring({ item: true })
    .create({
        slottable: false,
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableHere,
        icon: isMainReg ? undefined : StaticHelper.QS_INSTANCE.UAPHere,
        translate: (translator) => translator.name(({ item, itemType }) =>
            isMainReg
                ? StaticHelper.TLget("deposit").addArgs(
                    StaticHelper.TLget("onlyXType")
                        .inContext(TextContext.Lowercase)
                        .addArgs(!!(item ?? itemType) ? Translation.nameOf(Dictionary.Item, (item?.type ?? itemType)!, 999, false) : undefined),
                    StaticHelper.TLget("fromX").addArgs(StaticHelper.TLget("here")))
                : StaticHelper.TLget("fromX").addArgs(StaticHelper.TLget("here"))
        ),
        isUsable: (player, { item }) => {
            if(GLOBALCONFIG.force_isusable) return true;
            if(isMainReg) return false;
            return playerHasItem(player, item)
                && TransferHandler.canFitAny([item.containedWithin!], validNearby(player), player, [{ type: item.type }]);
        },
        execute: (player, { item }, _context) => executeStackAction(player,
            [{ container: item.containedWithin! }],
            [{ tiles: true }, { doodads: true }],
            [item.type])

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
export const StackAllNearbySelf = new UsableActionGenerator((reg, isMainReg: boolean = false) => reg.add(StaticHelper.QS_INSTANCE.UAPAllNearbySelf, UsableAction
    .requiring({})
    .create({
        slottable: isMainReg,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableSelf,
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        icon: isMainReg ? undefined : StaticHelper.QS_INSTANCE.UAPSelf,
        iconLocationOnItem: ItemDetailIconLocation.BottomRight, // TL: Thing done to item. BR: Item does thing. In this case
        translate: (translator) => translator.name(() =>
            isMainReg
                ? StaticHelper.TLget("collect").addArgs(
                    StaticHelper.TLget("allTypes").inContext(TextContext.Lowercase),
                    StaticHelper.TLFromTo("fullInventory", "nearby"))
                : StaticHelper.TLFromTo("fullInventory", "nearby")
        ),
        isUsable: (player) => {
            if(GLOBALCONFIG.force_isusable) return true;
            if(isMainReg) return false;
            return TransferHandler.hasMatch(validNearby(player), [player.inventory, ...playerHeldContainers(player)]);
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
export const StackAllNearbyMain = new UsableActionGenerator((reg, isMainReg: boolean = false) => reg.add(StaticHelper.QS_INSTANCE.UAPAllNearbyMain, UsableAction
    .requiring({})
    .create({
        slottable: isMainReg,
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableMain,
        icon: isMainReg ? undefined : StaticHelper.QS_INSTANCE.UAPMain,
        iconLocationOnItem: ItemDetailIconLocation.TopLeft, // TL: Thing done to item. BR: Item does thing. In this case
        translate: (translator) => translator.name(() =>
            isMainReg
                ? StaticHelper.TLget("collect").addArgs(
                    StaticHelper.TLget("allTypes").inContext(TextContext.Lowercase),
                    StaticHelper.TLFromTo("mainInventory", "nearby"))
                : StaticHelper.TLFromTo("mainInventory", "nearby")
        ),
        isUsable: (player) => {
            if(GLOBALCONFIG.force_isusable) return true;
            if(isMainReg) return false;
            return TransferHandler.hasMatch(validNearby(player), [player.inventory]);
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
            const itemStr = item ? item.getName(false) : itemType ? Translation.nameOf(Dictionary.Item, itemType, 999, false) : StaticHelper.TLget("thisContainer");
            return isMainReg
                ? StaticHelper.TLget("collect").addArgs(
                    StaticHelper.TLget("allTypes").inContext(TextContext.Lowercase),
                    StaticHelper.TLFromTo(itemStr, "mainInventory"))
                : StaticHelper.TLFromTo(itemStr, "mainInventory");
        }),
        // isApplicable: (player, { item }) => {
        //     if(GLOBALCONFIG.force_isusable) return true;
        //     ;
        // },
        isUsable: (player, { item }) => {
            if(GLOBALCONFIG.force_isusable) return true;
            if(isMainReg) return false;
            return TransferHandler.hasMatch([item as IContainer], [player.inventory]);
        },
        execute: (p, u) => executeStackAction(p, [{ self: true }], [{ container: u.item as IContainer }], [])
    })
));

export const StackAllNearbySub = new UsableActionGenerator((reg, isMainReg: boolean = false) => reg.add(StaticHelper.QS_INSTANCE.UAPAllNearbySub, UsableAction
    .requiring({ item: { validate: (_, item) => isStorageType(item.type) } })
    .create({
        slottable: isMainReg,
        iconLocationOnItem: ItemDetailIconLocation.TopLeft, // TL: Thing done to item. BR: Item does thing.
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableNearby,
        icon: isMainReg ? undefined : StaticHelper.QS_INSTANCE.UAPNearby,
        translate: (translator) => translator.name(({ item, itemType }) => {
            const itemStr = item ? item.getName(false) : itemType ? Translation.nameOf(Dictionary.Item, itemType, 999, false) : StaticHelper.TLget("thisContainer");
            return isMainReg
                ? StaticHelper.TLget("collect").addArgs(
                    StaticHelper.TLget("allTypes").inContext(TextContext.Lowercase),
                    StaticHelper.TLFromTo(itemStr, "nearby"))
                : StaticHelper.TLFromTo(itemStr, "nearby");
        }),
        isUsable: (player, { item }) => {
            if(GLOBALCONFIG.force_isusable) return true;
            if(isMainReg) return false;
            return isHeldContainer(player, item)
                && TransferHandler.canFitAny(validNearby(player), [item as IContainer], player);
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
                ? StaticHelper.TLget("collect").addArgs(
                    StaticHelper.TLget("allTypes").inContext(TextContext.Lowercase),
                    StaticHelper.TLFromTo("here", "fullInventory"))
                : StaticHelper.TLFromTo("here", "fullInventory")
        ),
        isUsable: (player, { item }) => {
            if(GLOBALCONFIG.force_isusable) return true;
            return player.island.items.getContainerReference(item?.containedWithin, undefined).crt === ContainerReferenceType.Doodad
                && TransferHandler.canFitAny([item.containedWithin!], [player.inventory, ...playerHeldContainers(player)], player, []);
        },
        execute: (player, { item }, _context) => executeStackAction(player,
            [{ self: true, recursive: true }],
            [{ container: item.containedWithin! }],
            [])
    })
));

export const StackAllNearbyHere = new UsableActionGenerator((reg, isMainReg: boolean = false) => reg.add("StackAllNearbyHere"/* StaticHelper.QS_INSTANCE.UAPAllNearbyHere */, UsableAction
    .requiring({ item: true })
    .create({
        slottable: false,
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableHere,
        icon: StaticHelper.QS_INSTANCE.UAPNearby,
        translate: (translator) => translator.name(() =>
            isMainReg
                ? StaticHelper.TLget("collect").addArgs(
                    StaticHelper.TLget("allTypes").inContext(TextContext.Lowercase),
                    StaticHelper.TLFromTo("here", "nearby"))
                : StaticHelper.TLFromTo("here", "nearby")
        ),
        isUsable: (player, { item }) => {
            if(GLOBALCONFIG.force_isusable) return true;
            if(isMainReg) return false;
            return player.island.items.getContainerReference(item?.containedWithin, undefined).crt === ContainerReferenceType.Doodad
                && TransferHandler.canFitAny([item.containedWithin!], validNearby(player).filter(c => c !== item.containedWithin!), player, []);
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
                ? StaticHelper.TLget("collect").addArgs(
                    StaticHelper.TLget("onlyXType")
                        .inContext(TextContext.Lowercase)
                        .addArgs(!!(item ?? itemType) ? Translation.nameOf(Dictionary.Item, (item?.type ?? itemType)!, 999, false) : undefined),
                    StaticHelper.TLFromTo("here", "fullInventory"))
                : StaticHelper.TLFromTo("here", "fullInventory")
        ),
        //isApplicable: () => true,
        isUsable: (player, { item }) => {
            if(GLOBALCONFIG.force_isusable) return true;
            if(isMainReg) return false;
            if(player.island.items.getContainerReference(item.containedWithin!, undefined).crt === ContainerReferenceType.PlayerInventory)
                return TransferHandler.hasMatch(playerHeldContainers(player), [item.containedWithin!], [{ type: item.type }]);
            else
                return TransferHandler.canFitAny(
                    [player.inventory, ...playerHeldContainers(player)].filter(c => c !== item.containedWithin!),
                    [item.containedWithin!], player, [{ type: item.type }]);
        },
        execute: (player, { item }, _context) => executeStackAction(player,
            playerHasItem(player, item)
                ? [{ container: [player.inventory, ...playerHeldContainers(player)].filter(c => c !== item.containedWithin!) }]
                : [{ self: true, recursive: true }],
            [{ container: item.containedWithin! }],
            [item.type])
    })
));

export const StackTypeNearbyHere = new UsableActionGenerator((reg, isMainReg: boolean = false) => reg.add("StackTypeNearbyHere"/* StaticHelper.QS_INSTANCE.UAPTypeNearbyHere */, UsableAction
    .requiring({ item: true })
    .create({
        slottable: false,
        displayLevel: isMainReg ? ActionDisplayLevel.Never : ActionDisplayLevel.Always,
        bindable: isMainReg ? undefined : StaticHelper.QS_INSTANCE.bindableNearby,
        icon: StaticHelper.QS_INSTANCE.UAPNearby,
        translate: (translator) => translator.name(({ item, itemType }) =>
            isMainReg
                ? StaticHelper.TLget("collect").addArgs(
                    StaticHelper.TLget("onlyXType")
                        .inContext(TextContext.Lowercase)
                        .addArgs(!!(item ?? itemType) ? Translation.nameOf(Dictionary.Item, (item?.type ?? itemType)!, 999, false) : undefined),
                    StaticHelper.TLFromTo("here", "nearby"))
                : StaticHelper.TLFromTo("here", "nearby")
        ),
        isUsable: (player, { item }) => {
            if(GLOBALCONFIG.force_isusable) return true;
            if(isMainReg) return false;
            if(player.island.items.getContainerReference(item.containedWithin!, undefined).crt === ContainerReferenceType.PlayerInventory)
                return TransferHandler.hasMatch(validNearby(player), [item.containedWithin!], [{ type: item.type }]);
            else
                return TransferHandler.canFitAny(
                    validNearby(player).filter(c => c !== item.containedWithin!),
                    [item.containedWithin!], player, [{ type: item.type }]);
        },
        execute: (player, { item }, _context) => executeStackAction(player,
            playerHasItem(player, item)
                ? [{ doodads: true }, { tiles: true }]
                : [{ container: validNearby(player).filter(c => c !== item.containedWithin!) }],
            [{ container: item.containedWithin! }],
            [item.type])
    })
));


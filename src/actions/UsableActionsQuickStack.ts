import UsableAction from "game/entity/action/usable/UsableAction";
//import { Bindable } from "ui/input/Bindable";
import StaticHelper from "../StaticHelper";
import { executeStackAction } from "./Actions";
import { ActionDisplayLevel } from "game/entity/action/IAction";
import { UsableActionGenerator } from "game/entity/action/usable/UsableActionRegistrar";
import Translation from "language/Translation";
import TransferHandler, { playerHeldContainers, isHeldContainer, playerHasItem, isContainerType, playerHasType } from "../TransferHandler";
import { IContainer } from "game/item/IItem";
import Dictionary from "language/Dictionary";
import { TextContext } from "language/ITranslation";

// isApplicable should return true if the action can accept that type of item
// and isUsable should return true if it can actually be performed right now

export const UsableActionsQuickStack = new UsableActionGenerator(reg => {
    // 2nd-level submenus are registered by Top.
    // Visible submenu actions are registered by 2nd-level menus.
    QSSubmenu.Deposit.register(reg);
    //QSSubmenu.Withdraw.register(reg);

    StackAllSelfNearby.register(reg, false);
    StackAllMainNearby.register(reg, false);
    StackAllSubNearby.register(reg, false);
    StackTypeSelfNearby.register(reg, false);       // Stack from inventory recursively 
    StackAllAlikeSubNearby.register(reg,false);
    //StackAllHereNearby.register(reg, false, true); // Stack from this container
    //StackAllHereNearby.register(reg, false, false); // Stack from main inventory
    //StackAllAlikeSubNearby.register(reg, false);     // Stack from all similar containers
});

export namespace QSSubmenu {
    // Top-level submenu.
    export const Deposit = new UsableActionGenerator(reg => reg.add("QuickStackMainSubmenu", UsableAction
        .requiring({ item: { allowNone: true } })
        .create({
            displayLevel: ActionDisplayLevel.Always,
            translate: (translator) => translator.name(Translation.message(StaticHelper.QS_INSTANCE.messageDeposit)),
            isApplicable: () => true,
            isUsable: (player, { item, itemType }) => {
                if(!item && !itemType) return true;
                if(item && playerHasItem(player, item)) return true;
                if(itemType && playerHasType(player, itemType)) return true;
                return false;
            },
            submenu: (subreg) => {
                // Add subsubmenu for actions that function regardless of item selection.
                All.register(subreg);
                // Add subsubmenu for item-type actions. Requires Item.
                Type.register(subreg);

                StaticHelper.QS_LOG.info('TopSubmenu');
            }
        })
    ));

    // 2nd-level menu for quickstack operations operating on all item types
    export const All = new UsableActionGenerator(reg => reg.add("QuickStackAllSubmenu", UsableAction
        .requiring({ item: { allowNone: true } })
        .create({
            displayLevel: ActionDisplayLevel.Always,
            translate: (translator) => translator.name(({ item, itemType }) => Translation.message(StaticHelper.QS_INSTANCE.messageQuickStackAll)),
            isApplicable: () => true,
            isUsable: () => true,
            submenu: (subreg) => {
                StaticHelper.QS_LOG.info('AllSubmenu');

                StackAllSelfNearby.register(subreg, true);
                StackAllMainNearby.register(subreg, true);
                StackAllSubNearby.register(subreg, true);
                StackAllAlikeSubNearby.register(subreg, true);
            }
        })
    ));

    /** 
     * 2nd-level menu for quickstack operations that require a selected item type
     */
    export const Type = new UsableActionGenerator(reg => reg.add("QuickStackTypeSubmenu", UsableAction
        .requiring({ item: true })
        .create({
            displayLevel: ActionDisplayLevel.Always,
            translate: (translator) => translator.name(({ item, itemType }) => Translation
                .message(StaticHelper.QS_INSTANCE.messageQuickStackType)
                .addArgs(item?.getName(false, 999, false, false, false, false) ?? ((!!itemType ? Translation.nameOf(Dictionary.Item, itemType) : undefined)))),
            isApplicable: (player, using) => {
                const type = using.item?.type ?? using.itemType;
                return !type ? false : playerHasType(player, type);
            },
            isUsable: (player, using) => {
                const type = using.item?.type ?? using.itemType;
                return !type ? false : playerHasType(player, type);
            },
            submenu: (subreg) => {
                StaticHelper.QS_LOG.info('TypeSubmenu');

                StackTypeSelfNearby.register(subreg, true);
                StackTypeHereNearby.register(subreg);
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
export const StackAllSelfNearby = new UsableActionGenerator<[boolean]>((reg, inSubmenu) => reg.add("StackAllSelfNearby", UsableAction
    .requiring(
        // I want this option to still appear when right-clicking inventory items, but the slottable version should be non-item specific
        inSubmenu ? { item: { allowNone: true, validate: (p, i) => playerHasItem(p, i) } } : {}
    )
    .create({
        slottable: true,
        bindable: StaticHelper.QS_INSTANCE.bindableStackAllSelfNearby,
        displayLevel: inSubmenu ? ActionDisplayLevel.Always : ActionDisplayLevel.Never,
        translate: (translator) => translator.name(() => {
            const fromSegment = Translation.message(StaticHelper.QS_INSTANCE.messageFrom).addArgs(Translation.message(StaticHelper.QS_INSTANCE.messageSelf));
            return inSubmenu
                ? fromSegment
                : Translation.message(StaticHelper.QS_INSTANCE.messageDeposit)
                    .addArgs(Translation.message(StaticHelper.QS_INSTANCE.messageQuickStackAll).inContext(TextContext.Lowercase), fromSegment)
        }),
        isApplicable: () => true,
        isUsable: (player) => TransferHandler.hasMatchType(
            player.island.items.getAdjacentContainers(player, false),
            [player.inventory, ...playerHeldContainers(player)]),
        execute: (player) => executeStackAction(player,
            [{ self: true, recursive: true }],
            [{ tiles: true }, { doodads: true }],
            [])
    })
));

/** 
 * Stack all types from only main inventory to nearby containers
 * Slottable.
 * Requirements:    None
 * Applicability:   Always
 * Usability:       Main inventory contents have type match(es) nearby 
 */
export const StackAllMainNearby = new UsableActionGenerator<[boolean]>((reg, inSubmenu) => reg.add("StackAllMainNearby", UsableAction
    .requiring(inSubmenu ? { item: { allowNone: true, validate: (p, i) => playerHasItem(p, i) } } : {})
    .create({
        slottable: true,
        bindable: StaticHelper.QS_INSTANCE.bindableStackAllMainNearby,
        displayLevel: inSubmenu ? ActionDisplayLevel.Always : ActionDisplayLevel.Never,
        translate: (translator) => translator.name(() => {
            const fromSegment = Translation.message(StaticHelper.QS_INSTANCE.messageFrom).addArgs(Translation.message(StaticHelper.QS_INSTANCE.messageMain));
            return inSubmenu
                ? fromSegment
                : Translation.message(StaticHelper.QS_INSTANCE.messageDeposit)
                    .addArgs(Translation.message(StaticHelper.QS_INSTANCE.messageQuickStackAll).inContext(TextContext.Lowercase), fromSegment)
        }),
        isApplicable: () => true,
        isUsable: (player) => TransferHandler.hasMatchType(player.island.items.getAdjacentContainers(player, false), [player.inventory]),
        execute: (player) => executeStackAction(player, [{ self: true }], [{ tiles: true }, { doodads: true }], [])
    })
));

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
export const StackAllSubNearby = new UsableActionGenerator<[boolean]>((reg, inSubmenu) => reg.add("StackAllSubNearby", UsableAction
    .requiring({
        item: {
            allowOnlyItemType: (p, ty) => !inSubmenu ? false : isContainerType(p, ty),
            validate: (p, i) => isHeldContainer(p, i)
        }
    })
    .create({
        slottable: !inSubmenu,
        displayLevel: inSubmenu ? ActionDisplayLevel.Always : ActionDisplayLevel.Never,
        bindable: (using) => inSubmenu ? StaticHelper.QS_INSTANCE.bindableStackAllSubNearby : undefined,

    translate: (translator) => translator.name(({ item, itemType }) => {
            const fromSegment = Translation
            .message(StaticHelper.QS_INSTANCE.messageFrom).addArgs(item
                ? item.getName(false)
                : itemType 
                        ? Translation.nameOf(Dictionary.Item, itemType, 999, false) 
                        : Translation.message(StaticHelper.QS_INSTANCE.messageSub));

            return inSubmenu
                ? fromSegment
                : Translation.message(StaticHelper.QS_INSTANCE.messageDeposit)
                    .addArgs(
                        Translation.message(StaticHelper.QS_INSTANCE.messageQuickStackAll).inContext(TextContext.Lowercase),
                        fromSegment);
        }),
        isApplicable: (player, using) =>
            using.item
                ? isHeldContainer(player, using.item)
                : using.itemType
                    ? playerHasType(player, using.itemType) && isContainerType(player, using.itemType)
                    : false,
        isUsable: (player, using) => TransferHandler.hasMatchType(
            player.island.items.getAdjacentContainers(player, false),
            using.itemType ? playerHeldContainers(player, [using.itemType]) : [using.item as IContainer]
        ),
        execute: (player, using, _context) => executeStackAction(player,
            [{ container: using.itemType ? playerHeldContainers(player, [using.itemType]) : using.item as IContainer }],
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
export const StackAllAlikeSubNearby = new UsableActionGenerator<[boolean]>((reg, inSubmenu) => reg.add("StackAllAlikeSubNearby", UsableAction
    .requiring({
        item: {
            allowOnlyItemType: (p, ty) => isContainerType(p, ty),
            validate: (p, i) => isHeldContainer(p, i)
        }
    })
    .create({
        slottable: true,
        displayLevel: inSubmenu ? ActionDisplayLevel.Always : ActionDisplayLevel.Never,
        translate: (translator) => translator.name(({ item, itemType }) => {
            const fromSegment = Translation.message(StaticHelper.QS_INSTANCE.messageFrom)
                .addArgs(Translation.message(StaticHelper.QS_INSTANCE.messageAllX)
                    .addArgs(item ? Translation.nameOf(Dictionary.Item, item.type, 999, false)
                        : itemType ? Translation.nameOf(Dictionary.Item, itemType, 999, false)
                            : Translation.message(StaticHelper.QS_INSTANCE.messageAlike)))
            return inSubmenu
                ? fromSegment
                : Translation.message(StaticHelper.QS_INSTANCE.messageDeposit)
                    .addArgs(
                        Translation.message(StaticHelper.QS_INSTANCE.messageQuickStackAll).inContext(TextContext.Lowercase),
                        fromSegment);
        }),
        isApplicable: (player, using) => using.item ? isHeldContainer(player, using.item) : using.itemType ? playerHasType(player, using.itemType) : false,
        isUsable: (player, using) => TransferHandler.hasMatchType(
            player.island.items.getAdjacentContainers(player, false),
            using.itemType ? playerHeldContainers(player, [using.itemType]) : [using.item as IContainer]),
        execute: (player, using, _context) => executeStackAction(player,
            [{ container: using.item ? using.item as IContainer : playerHeldContainers(player, [using.itemType]) }],
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
export const StackTypeSelfNearby = new UsableActionGenerator<[boolean]>((reg, inSubmenu) => reg.add("StackTypeSelfNearby", UsableAction
    .requiring({
        item: {
            allowOnlyItemType: () => true,
            validate: (player, value) => { const v = playerHasItem(player, value); StaticHelper.QS_LOG.info(`STSN VALIDATE: ${v}`); return v; }//playerHasItem(player, value); }
        }
    })
    .create({
        slottable: true,
        displayLevel: inSubmenu ? ActionDisplayLevel.Always : ActionDisplayLevel.Never,
        translate: (translator) => translator.name(({ item, itemType }) => {
            const fromSegment = Translation.message(StaticHelper.QS_INSTANCE.messageFrom)
                .addArgs(Translation.message(StaticHelper.QS_INSTANCE.messageSelf))
            return inSubmenu
                ? fromSegment
                : Translation.message(StaticHelper.QS_INSTANCE.messageDeposit)
                    .addArgs(item
                        ? Translation.nameOf(Dictionary.Item, item.type, 999, false)
                        : itemType ? Translation.nameOf(Dictionary.Item, itemType, 999, false)
                            : undefined,
                        fromSegment);
        }),
        isApplicable: (player, using) => {
            const type = (using.item?.type ?? using.itemType);
            return !type ? false : TransferHandler.hasType([player.inventory, ...playerHeldContainers(player)], type);
        },
        isUsable: (player, using) => {
            const type = (using.item?.type ?? using.itemType);
            return !type ? false : TransferHandler.hasType(player.island.items.getAdjacentContainers(player, false), type);
        },
        execute: (player, using, _context) => executeStackAction(player,
            [{ self: true, recursive: true }],
            [{ tiles: true }, { doodads: true }],
            [using.item?.type ?? using.itemType])
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
export const StackTypeHereNearby = new UsableActionGenerator(reg => reg.add("StackTypeHereNearby", UsableAction
    .requiring({
        item: {
            validate: (p, i) => playerHasItem(p, i)
        }
    })
    .create({
        slottable: false,
        displayLevel: ActionDisplayLevel.Always,
        translate: (translator) => translator.name(({ item, itemType }) => Translation
            .message(StaticHelper.QS_INSTANCE.messageFrom)
            .addArgs(Translation.message(StaticHelper.QS_INSTANCE.messageHere))
        ),
        isApplicable: (player, { item }) => item ? playerHasItem(player, item) : false,
        isUsable: (player, { item }) => TransferHandler.hasType(player.island.items.getAdjacentContainers(player, false), item.type),
        execute: (player, { item }, _context) => executeStackAction(player,
            [{ container: item.containedWithin! }],
            [{ tiles: true }, { doodads: true }],
            [item.type])

    })
));

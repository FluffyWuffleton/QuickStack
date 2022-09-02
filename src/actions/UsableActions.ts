import UsableAction from "game/entity/action/usable/UsableAction";
//import { Bindable } from "ui/input/Bindable";
import StaticHelper from "./../StaticHelper";
import { executeStackAction } from "./Actions";
import { ActionDisplayLevel } from "game/entity/action/IAction";
import { UsableActionGenerator } from "game/entity/action/usable/UsableActionRegistrar";
import Translation from "language/Translation";
import TransferHandler, { playerHeldContainers, isHeldContainer, playerHasItem } from "./../TransferHandler";
import { IContainer, ItemType } from "game/item/IItem";
import Dictionary from "language/Dictionary";

// isApplicable should return true if the action can accept that type of item
// and isUsable should return true if it can actually be performed right now

export module QSUsableActions {

    // Top-level submenu for quickstack usableactions.
    export const MainSubmenu = new UsableActionGenerator(reg => reg.add("QuickStackMainSubmenu", UsableAction
        .requiring({ item: { allowNone: true } })
        .create({
            displayLevel: ActionDisplayLevel.Always,
            translate: (translator) => translator.name(Translation.message(StaticHelper.QS_INSTANCE.messageQuickStack)),
            isApplicable: () => true,
            isUsable: () => true,
            submenu: (subreg) => {
                StaticHelper.QS_LOG.info('MainSubmenu');

                // Add subsubmenu for actions that function regardless of item selection.
                QSUsableActions.AllSubmenu.register(subreg);
                
                // Add subsubmenu for item-type actions. Requires Item.
                QSUsableActions.TypeSubmenu.register(subreg);
            }
        })
    ));

    // 2nd-level menu for quickstack operations on all item types.
    export const AllSubmenu = new UsableActionGenerator(reg => reg.add("QuickStackAllSubmenu", UsableAction
        .requiring({ item: { allowNone: true } })
        .create({
            displayLevel: ActionDisplayLevel.Always,
            translate: (translator) => translator.name(({ item, itemType }) => Translation.message(StaticHelper.QS_INSTANCE.messageQuickStackAll)),
            isApplicable: () => true,
            isUsable: () => true,
            submenu: (subreg) => {
                StaticHelper.QS_LOG.info('AllSubmenu');
                QSUsableActions.StackAllSelfNearby.register(subreg);
                QSUsableActions.StackAllMainNearby.register(subreg);
                QSUsableActions.StackAllSubNearby.register(subreg);
            }
        })
    ));

    /** 
     * 2nd-level menu for quickstack operations on a selected item/itemtype
     * Requires: Item or ItemType
     * Applicable: itemtype exists in player inventory
     * Usable: itemtype has a match nearby
     */
    export const TypeSubmenu = new UsableActionGenerator(reg => reg.add("QuickStackTypeSubmenu", UsableAction
        .requiring({ item: true })
        .create({
            displayLevel: ActionDisplayLevel.Always,
            translate: (translator) => translator.name(({ item, itemType }) => Translation
                .message(StaticHelper.QS_INSTANCE.messageQuickStackType)
                .addArgs(item?.getName(false,1,false,false,false,false) ?? ((!!itemType ? Translation.nameOf(Dictionary.Item, itemType) : undefined)))),
            isApplicable: (player, using) => {
                const type = (using.item?.type ?? using.itemType);
                return !type ? false : TransferHandler.hasType([player.inventory, ...playerHeldContainers(player)], type);
            },
            isUsable: (player, using) => {
                const type = (using.item?.type ?? using.itemType);
                return !type ? false : TransferHandler.hasType(player.island.items.getAdjacentContainers(player, false), type);
            },
            submenu: (subreg) => {
                StaticHelper.QS_LOG.info('TypeSubmenu')
                QSUsableActions.StackTypeSelfNearby.register(subreg);
                QSUsableActions.StackTypeHereNearby.register(subreg);
            }
        })
    ));

    /** 
     * Stack all types from full inventory to nearby containers
     * Slottable.
     * Applicability:
     *      Always
     * Usability:
     *      Full inventory contents have type match(es) nearby
     */
    export const StackAllSelfNearby = new UsableActionGenerator(reg => reg.add("StackAllSelfNearby", UsableAction
        .requiring({ item: { allowNone: true } })
        .create({
            slottable: true,
            bindable: StaticHelper.QS_INSTANCE.bindableStackAllSelfNearby,
            displayLevel: ActionDisplayLevel.Always,
            translate: (translator) => translator.name(Translation.message(StaticHelper.QS_INSTANCE.messageAllSelfNearby)),
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
    export const StackAllMainNearby = new UsableActionGenerator(reg => reg.add("StackAllMainNearby", UsableAction
        .create({
            slottable: true,
            displayLevel: ActionDisplayLevel.Always,
            translate: (translator) => translator.name(Translation.message(StaticHelper.QS_INSTANCE.messageAllMainNearby)),
            isApplicable: () => true,
            isUsable: (player) => TransferHandler.hasMatchType(player.island.items.getAdjacentContainers(player, false), [player.inventory]),
            execute: (player) => executeStackAction(player, [{ self: true }], [{ tiles: true }, { doodads: true }], [])
        })
    ));

    /** 
     * Stack all types from a held container to nearby containers
     * Slottable in the context of a held container.
     * Requires:
     *      [Item]: A held container.
     * Applicability:
     *      [Item] is a held container.
     * Usability:
     *      [Item] contents have type match(es) nearby 
     */
    export const StackAllSubNearby = new UsableActionGenerator(reg => reg.add("StackAllSubNearby", UsableAction
        .requiring({ item: { validate: (p, i) => isHeldContainer(p, i) } })
        .create({
            slottable: true,
            displayLevel: ActionDisplayLevel.Always,
            translate: (translator) => translator.name(({ item }) => Translation
                .message(StaticHelper.QS_INSTANCE.messageAllSubNearby)
                .addArgs(item?.getName() ?? undefined)),
            isApplicable: (player, using) => using.item !== undefined ? isHeldContainer(player, using.item) : false,
            isUsable: (player, using) => TransferHandler.hasMatchType(player.island.items.getAdjacentContainers(player, false), [using.item as IContainer]),
            execute: (player, using, _context) => executeStackAction(player,
                [{ container: using.item as IContainer }],
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
    export const StackTypeSelfNearby = new UsableActionGenerator(reg => reg.add("StackTypeSelfNearby", UsableAction
        .requiring({ item: { allowOnlyItemType: () => true, validate: (player, value) => playerHasItem(player, value) } })
        .create({
            translate: (translator) => translator.name(({ item, itemType }) => Translation
                .message(StaticHelper.QS_INSTANCE.messageTypeSelfNearby)
                .addArgs((item?.type ?? itemType) ? Translation.nameOf(Dictionary.Item, (item?.type ?? itemType) as ItemType) : undefined)),
            slottable: true,
            displayLevel: ActionDisplayLevel.Always,
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
     * Not slottable.
     * Requires:
     *      [item] in the player inventory
     * Applicability:
     *      [item] is present in the inventory
     *  AND [item.type] items are present in another section of the inventory (otherwise redundant with TypeSelfNearby)
     * Usability:
     *      [itemType] has a match nearby
     */
    export const StackTypeHereNearby = new UsableActionGenerator(reg => reg.add("StackTypeHereNearby", UsableAction
        .requiring({ item: { validate: (player, value) => playerHasItem(player, value) } })
        .create({
            translate: (translator) => translator.name(({ item }) => Translation
                .message(StaticHelper.QS_INSTANCE.messageTypeHereNearby)
                .addArgs(item?.getName())),
            slottable: false,
            displayLevel: ActionDisplayLevel.Always,
            isApplicable: (player, { item }) => item === undefined ? false : playerHasItem(player, item)
                && TransferHandler.hasType([player.inventory, ...playerHeldContainers(player)].filter(c => c === item.containedWithin), item.type),
            isUsable: (player, { item }) => TransferHandler.hasType(player.island.items.getAdjacentContainers(player, false), item.type),
            execute: (player, { item }, _context) => executeStackAction(player,
                [{ container: item.containedWithin as IContainer }],
                [{ tiles: true }, { doodads: true }],
                [item.type])

        })
    ));

}
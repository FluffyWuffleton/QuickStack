import { ActionType } from "game/entity/action/IAction";
import Message from "language/dictionary/Message";
import Mod from "mod/Mod";
import Register, { Registry } from "mod/ModRegistry";
import Bind from "ui/input/Bind";
import Bindable from "ui/input/Bindable";
import { IInput } from "ui/input/IInput";
import { UsableActionSet } from "game/entity/action/usable/actions/UsableActionsMain";
import { UsableActionGenerator } from "game/entity/action/usable/UsableActionRegistrar";
import Log from "utilities/Log";

import { executeStackAction, StackAction, StackActionLimited } from "./actions/Actions";
import { QSUsableActions } from "./actions/UsableActions";

// TODO: ADD OPTIONS
// Bottom up- top down
// Allow tiles.
// Never move subcontainers.


export default class QuickStack extends Mod {
    @Mod.instance<QuickStack>()
    public static readonly INSTANCE: QuickStack;
    @Mod.log()
    public static readonly LOG: Log;

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Messages 
    //

    // Activation and result messages...
    @Register.message("Search") // Smart-stack initiated 
    public readonly messageSearch: Message;
    @Register.message("NoMatch") // No items in inventory match available targets.
    public readonly messageNoMatch: Message;
    @Register.message("StackedNone") // Target found but too full to deposit anything.
    public readonly messageStackedNone: Message;
    @Register.message("StackedSome") // Some matching items deposited to a target, but it filled up.
    public readonly messageStackedSome: Message;
    @Register.message("StackedAll") // All matching items deposited to a target.
    public readonly messageStackedAll: Message;
    @Register.message("StackResult")
    public readonly messageStackResult: Message;
    
    // Destination message segments
    @Register.message("ToTile")
    public readonly messageToTile: Message;
    @Register.message("ToContainer")
    public readonly messageToContainer: Message;
    @Register.message("ToInventory")
    public readonly messageToInventory: Message;
    @Register.message("ToUnknown")
    public readonly messageToUnknown: Message;
    
    // Source  message segments
    @Register.message("FromTile")
    public readonly messageFromTile: Message;
    @Register.message("FromInventory")
    public readonly messageFromInventory: Message;
    @Register.message("FromContainer")
    public readonly messageFromContainer: Message;
    @Register.message("FromUnknown")
    public readonly messageFromUnknown: Message;

    @Register.message("ItemAll")
    public readonly messageItemAll: Message;
    @Register.message("ItemSome")
    public readonly messageItemSome: Message;
    


    //////////////////////////////////////////////////////////////////////////////////
    // Action labels and descriptions for menus etc.    

    @Register.message("QuickStack") // Main menu
    public readonly messageQuickStack: Message;
    @Register.message("QuickStackType") // Type-specific submenu
    public readonly messageQuickStackType: Message;
    @Register.message("QuickStackAll") // All-type submenu
    public readonly messageQuickStackAll: Message;

    // All types :: Main inventory -> Nearby containers
    @Register.message("AllMainNearby")
    public readonly messageAllMainNearby: Message;
    // All types :: Sub-inventory -> Nearby containers
    @Register.message("AllSubNearby")
    public readonly messageAllSubNearby: Message;
    // All types :: All inventories -> Nearby containers
    @Register.message("AllSelfNearby")
    public readonly messageAllSelfNearby: Message;

    // Selected type :: Main inventory -> Nearby containers
    @Register.message("TypeMainNearby")
    public readonly messageTypeMainNearby: Message;
    // Selected type :: Sub-inventory -> Nearby containers
    // Selected type :: All inventories -> Nearby containers 
    @Register.message("TypeSelfNearby")
    public readonly messageTypeSelfNearby: Message;
    // Immediate containing inventory -> nearby containers
    @Register.message("TypeHereNearby")
    public readonly messageTypeHereNearby: Message;

    // ALl types :: Nearby containers -> Main inventory
    @Register.message("AllNearbyMain")
    public readonly messageAllNearbyMain: Message;
    // ALl types :: Nearby containers -> Sub-inventory
    @Register.message("AllNearbySub")
    public readonly messageAllNearbySub: Message;
    // ALl types :: Nearby containers -> All inventories
    @Register.message("AllNearbySelf")
    public readonly messageAllNearbySelf: Message;


    // Selected type :: Nearby containers -> Main inventory
    @Register.message("TypeNearbyMain")
    public readonly messageTypeNearbyMain: Message;
    // Selected type :: Nearby containers -> Sub-inventory
    @Register.message("TypeNearbySub")
    public readonly messageTypeNearbySub: Message;


    //////////////////////////////////////////////////////////////////////////////////////////////
    // Binds
    @Register.bindable("StackAllMainNearby", IInput.key("slash", "Shift"))
    public readonly bindableStackAllMainNearby: Bindable;

    @Register.bindable("StackAllSubNearby")
    public readonly bindableStackAllSubNearby: Bindable;

    @Register.bindable("StackAllSelfNearby")
    public readonly bindableStackAllSelfNearby: Bindable;


    //////////////////////////////////////////////////////////////////////////////////////////////
    // Actions
    @Register.action("StackAction", StackAction)
    public readonly actionStackAction: ActionType;
    @Register.action("StackActionLimited", StackActionLimited)
    public readonly actionStackActionLimited: ActionType;

    // Register the top-level QuickStack submenu.
    // The rest of the actions and menus are registered to this menu when its submenu function is called.
    @Register.usableActions("QSActions", UsableActionSet.ItemMoveMenus, reg => QSUsableActions.MainSubmenu.register(reg))
    public readonly QSActions: UsableActionGenerator;
    
    @Bind.onDown(Registry<QuickStack>().get("bindableStackAllMainNearby"))
    public Activate() {
        QuickStack.LOG.info("Received keybind!");
        executeStackAction(localPlayer, [{ self: true }], [{ tiles: true }, { doodads: true }], []);
        return true;
    };
}

import { ActionType } from "game/entity/action/IAction";
import Message from "language/dictionary/Message";
import Mod from "mod/Mod";
import Register from "mod/ModRegistry";
import Bindable from "ui/input/Bindable";
import { IInput } from "ui/input/IInput";
import { UsableActionSet } from "game/entity/action/usable/actions/UsableActionsMain";
import { UsableActionGenerator } from "game/entity/action/usable/UsableActionRegistrar";
import Log from "utilities/Log";

import { StackAction, StackActionLimited } from "./actions/Actions";
import { UsableActionsQuickStack } from "./actions/UsableActionsQuickStack";

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
    @Register.message("NoTypeMatch") // No available targets for selected item type.
    public readonly messageNoTypeMatch: Message;
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
    
    // "top-level inventory"
    @Register.message("MainInventory")
    public readonly messageMainInventory: Message;
    // "here" (this inventory container)
    @Register.message("ThisInventory")
    public readonly messageThisInventory: Message;


    //////////////////////////////////////////////////////////////////////////////////
    // Action labels and descriptions for menus etc.    

    @Register.message("QuickStack") // Main menu
    public readonly messageQuickStack: Message;
    @Register.message("QuickStackType") // Type-specific submenu
    public readonly messageQuickStackType: Message;
    @Register.message("QuickStackAll") // All-type submenu
    public readonly messageQuickStackAll: Message;

    @Register.message("Deposit") // Submenu label and master interpolator for labelling 'deposit' slottables.
    public readonly messageDeposit: Message;
    
    @Register.message("From") // "from" || "from <THING>"
    public readonly messageFrom: Message;
    

    @Register.message("AllX") // "all <THING>"
    public readonly messageAllX: Message;
    @Register.message("Main") // main inventory
    public readonly messageMain: Message;
    @Register.message("Self") // full inventory
    public readonly messageSelf: Message;
    @Register.message("Here") // immediate location
    public readonly messageHere: Message;
    @Register.message("Sub") // this container 
    public readonly messageSub: Message;
    @Register.message("Alike") // alike containers
    public readonly messageAlike: Message;

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Binds
    @Register.bindable("StackAllSelfNearby", IInput.key("slash", "Shift"))
    public readonly bindableStackAllSelfNearby: Bindable;

    @Register.bindable("StackAllMainNearby")
    public readonly bindableStackAllMainNearby: Bindable;


    //////////////////////////////////////////////////////////////////////////////////////////////
    // Actions
    @Register.action("StackAction", StackAction)
    public readonly actionStackAction: ActionType;
    @Register.action("StackActionLimited", StackActionLimited)
    public readonly actionStackActionLimited: ActionType;

    // Register the top-level QuickStack submenu.
    // The rest of the actions and menus are registered to this menu when its submenu function is called.
    @Register.usableActions("QSUsableActions", UsableActionSet.ItemMoveMenus, reg => UsableActionsQuickStack.register(reg))
    public readonly QSUsableActions: UsableActionGenerator;
    
    // @Bind.onDown(Registry<QuickStack>().get("bindableStackAllMainNearby"))
    // public Activate() {
    //     QuickStack.LOG.info("Received keybind!");
    //     executeStackAction(localPlayer, [{ self: true }], [{ tiles: true }, { doodads: true }], []);
    //     return true;
    // };
}

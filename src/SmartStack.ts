import Mod from "mod/Mod";
import Register, { Registry } from "mod/ModRegistry";
import { ActionType } from "game/entity/action/IAction"
import Bindable from "ui/input/Bindable";
import { IInput } from "ui/input/IInput"
import Message from "language/dictionary/Message";
import Log from "utilities/Log";
import Bind from "ui/input/Bind";
import StackNearby from "./StackNearby";

export default class SmartStack extends Mod {
    @Mod.instance<SmartStack>("SmartStack")
    public static readonly INSTANCE: SmartStack;

    @Mod.log()
    public static readonly LOG: Log;

    public override onLoad(): void {
        this.getLog
    }
    //////////////////////////////////////////////////////////////////////////////////////////////
    // Messages 
    //
    @Register.message("Search") // Source has no items that match those in the target.
    public readonly messageSearch: Message;

    @Register.message("NoMatch") // Source has no items that match those in the target.
    public readonly messageNoMatch: Message;

    @Register.message("StackedNone") // Target too full to deposit anything.
    public readonly messageStackedNone: Message;

    @Register.message("StackedSome") // Some matching items deposited to target, but it filled up.
    public readonly messageStackedSome: Message;

    @Register.message("StackedAll") // All matching items deposited to target.
    public readonly messageStackedAll: Message;

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Bindable
    //
    @Register.bindable("StackNearby", IInput.key("slash", "Shift"))
    public readonly bindableStackNearby: Bindable;

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Actions and handlers
    //

    @Register.action("StackNearby", StackNearby)
    public readonly actionStackNearby: ActionType;

    
    //////////////////////////////////////////////////////////////////////////////////////////////
    // Bind
    //
    @Bind.onDown(Registry<SmartStack>().get("bindableStackNearby"))
    public Activate() {
        SmartStack.LOG.info("Received keybind!");
        if(StackNearby.canUse(localPlayer)) {
            StackNearby.execute(localPlayer);
            return true;
        }
        return false;
    };

}



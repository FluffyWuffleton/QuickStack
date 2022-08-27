import Mod from "mod/Mod";
import Register, { Registry } from "mod/ModRegistry";
import { ActionType } from "game/entity/action/IAction"
import Bindable from "ui/input/Bindable";
import { IInput } from "ui/input/IInput"
import Message from "language/dictionary/Message";
import Bind from "ui/input/Bind";
import ActionExecutor from "game/entity/action/ActionExecutor";
import { StackNearby } from "./actions/StackNearby";
import Log from "utilities/Log";

export default class QuickStack extends Mod {    
    @Mod.instance<QuickStack>()
	public static readonly INSTANCE: QuickStack;
	@Mod.log()
	public static readonly LOG: Log;

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Messages 
    //
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

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Actions
    @Register.action("StackNearby", StackNearby)
    public readonly actionStackNearby: ActionType;

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Binds
    @Register.bindable("StackNearby", IInput.key("slash", "Shift"))
    public readonly bindableStackNearby: Bindable;

    @Bind.onDown(Registry<QuickStack>().get("bindableStackNearby"))
    public Activate() {
        QuickStack.LOG.info("Received keybind!");
        ActionExecutor.get(StackNearby).execute(localPlayer);
        return true;
    };
}
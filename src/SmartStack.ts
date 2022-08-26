// import Doodad from "game/doodad/Doodad";
// import { Action } from "game/entity/action/Action";
// import { EntityType } from "game/entity/IEntity";
// import { ContainerReferenceType } from "game/item/IItem";
import Mod from "mod/Mod";
import Register, { Registry } from "mod/ModRegistry";
import { ActionType } from "game/entity/action/IAction"
import Bindable from "ui/input/Bindable";
import { IInput } from "ui/input/IInput"
import Message from "language/dictionary/Message";
import Log from "utilities/Log";
import Bind from "ui/input/Bind";
import { StackNearby } from "./StackNearby";
import ActionExecutor from "game/entity/action/ActionExecutor";
// import { EventHandler } from "event/EventManager";
// import { EventBus } from "event/EventBuses";
// import { Game } from "game/Game";


export default class SmartStack extends Mod {
    @Mod.instance<SmartStack>("SmartStack")
    public static readonly INSTANCE: SmartStack;

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

    @Bind.onDown(Registry<SmartStack>().get("bindableStackNearby"))
    public Activate() {
        SmartStack.LOG.info("Received keybind!");
        ActionExecutor.get(StackNearby).execute(localPlayer);
        return true;
    };
}
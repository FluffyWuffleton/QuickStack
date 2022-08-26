import Doodad from "game/doodad/Doodad";
import { Action } from "game/entity/action/Action";
import { EntityType } from "game/entity/IEntity";
import { ContainerReferenceType } from "game/item/IItem";

import Mod from "mod/Mod";
import Register, { Registry } from "mod/ModRegistry";
import { ActionType } from "game/entity/action/IAction"
import Bindable from "ui/input/Bindable";
import { IInput } from "ui/input/IInput"
import Message from "language/dictionary/Message";
import Log from "utilities/Log";
import Bind from "ui/input/Bind";
//import { StackNearby } from "./StackNearby";
import ActionExecutor from "game/entity/action/ActionExecutor";

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

    //@Register.action("StackNearby", StackNearby)

    static StackNearby = new Action()
        .setUsableBy(EntityType.Player)
        .setHandler((action) => {
            const player = action.executor;
            const IM = player.island.items;
            const validContainerTypes = [ContainerReferenceType.Doodad, ContainerReferenceType.Tile];
            const containers = IM.getAdjacentContainers(player, false)
                .filter((c) => validContainerTypes.includes(IM.getContainerReference(c, undefined).crt))
                .filter((c) => c.containedItems.length > 0);

            const invFreeItems = player.inventory.containedItems.filter(it => (!it.isEquipped() && !it.isProtected())); // Exclude protected and equipped.
            const invTypes = invFreeItems.map(it => it.type);
            const invTypesUnique = invTypes.filter((ty, i) => invTypes.indexOf(ty) === i);

            let haveMatched = false;
            if (containers.length) {
                SmartStack.LOG.info(`Sending message 'messageSearch'...`);
                player.messages.send(Registry<SmartStack>().get("messageSearch"));
            }
            containers.forEach((c) => {
                let cRef = IM.getContainerReference(c, undefined);
                let tgtStr: string;

                if (cRef.crt == ContainerReferenceType.Doodad) {
                    tgtStr = "into " + (c as Doodad).getName().getString();
                } else {
                    tgtStr = "onto the ground";
                }

                let cTypes = c.containedItems.map(it => it.type);
                let cTypesUniqueMatched = cTypes.filter((ty, i) => cTypes.indexOf(ty) === i)
                    .filter(ty => invTypesUnique.includes(ty));

                cTypesUniqueMatched.forEach((type) => {
                    let nHave = player.inventory.containedItems.filter(it => it.type == type).length;
                    let nMoved = IM.moveAllFromContainerToContainer(player, player.inventory, c, type, undefined, true).length;
                    let itemStr = `${nMoved} ` + IM.getItemTypeGroupName(type, false, nMoved > 0 ? nMoved : 5).getString();
                    haveMatched = true;
                    let msgKey: keyof SmartStack;
                    if (nMoved == nHave) msgKey = "messageStackedAll";
                    else if (nMoved > 0) msgKey = "messageStackedSome";
                    else msgKey = "messageStackedNone";
                    SmartStack.LOG.info(`Sending message '${msgKey}'...`);
                    player.messages.send(Registry<SmartStack>().get(msgKey), itemStr, tgtStr);
                });
            });
            if (!haveMatched) player.messages.send(Registry<SmartStack>().get("messageNoMatch"));
        });
    @Register.action("StackNearby", SmartStack.StackNearby)
    public readonly actionStackNearby: ActionType;


    //////////////////////////////////////////////////////////////////////////////////////////////
    // Bind
    //
    @Bind.onDown(Registry<SmartStack>().get("bindableStackNearby"))
    public Activate() {
        SmartStack.LOG.info("Received keybind!");
        ActionExecutor.get(SmartStack.StackNearby).execute(localPlayer);
        return true;
    };
}
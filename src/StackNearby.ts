import Doodad from "game/doodad/Doodad";
import { Action } from "game/entity/action/Action";
import { EntityType } from "game/entity/IEntity";
import { ContainerReferenceType, ItemType } from "game/item/IItem";
import SmartStack from "./SmartStack";
import { IActionHandlerApi } from "game/entity/action/IAction";
import Player from "game/entity/player/Player";
import { IActionUsable } from "game/entity/action/IAction";
import Item from "game/item/Item";

import { TurnType } from "game/entity/player/IPlayer";

export function handleStackNearby(action: IActionHandlerApi<Player, IActionUsable>): void {
    const player = action.executor;
    const IMgr = player.island.items;
    const validContainerTypes = [ContainerReferenceType.Doodad, ContainerReferenceType.Tile];
    const containers = IMgr.getAdjacentContainers(player, false)
        .filter((c) => validContainerTypes.includes(IMgr.getContainerReference(c, undefined).crt))
        .filter((c) => c.containedItems.length > 0);

    let haveMatched = false;
    let haveMoved = false;
    let invChanged: boolean = true;
    let invFreeItems: Item[];
    let invTypes: ItemType[];
    let invTypesUnique: ItemType[];

    if(containers.length) player.messages.send(SmartStack.INSTANCE.messageSearch);
    containers.forEach((c) => {
        let cRef = IMgr.getContainerReference(c, undefined);
        let tgtStr: string;
        // let isTile: boolean;
        if (cRef.crt == ContainerReferenceType.Doodad) {
            tgtStr = "into " + (c as Doodad).getName().getString();
            // isTile = false;
        } else {
            tgtStr = "onto the ground";
            // isTile = true;
        }

        if (invChanged) {
            invFreeItems = player.inventory.containedItems.filter(it => (!it.isEquipped() && !it.isProtected())); // Exclude protected and equipped.
            invTypes = invFreeItems.map(it => it.type);
            invTypesUnique = invTypes.filter((ty, i) => invTypes.indexOf(ty) === i);
        }
        invChanged = false;

        const cTypes = c.containedItems.map(it => it.type);
        const cTypesUniqueMatched = cTypes.filter((ty, i) => cTypes.indexOf(ty) === i)
            .filter(ty => invTypesUnique.includes(ty));

        cTypesUniqueMatched.forEach((type) => {
            const nHave = invFreeItems.filter(it => it.type == type).length;
            const itMoved = IMgr.moveAllFromContainerToContainer(player, player.inventory, c, type, undefined, true);
            const nMoved = itMoved.length
            const itemStr = IMgr.getItemTypeGroupName(type, false, nMoved > 0 ? nMoved : 2).getString();

            haveMatched = true;
            if (!nMoved) {
                haveMoved = true;
                player.messages.send(SmartStack.INSTANCE["messageStackedNone"], itemStr + " " + tgtStr);
            } else {
                invChanged = true;
                if (nMoved < nHave) player.messages.send(SmartStack.INSTANCE["messageStackedSome"], nMoved, nHave, itemStr + " " + tgtStr);
                else player.messages.send(SmartStack.INSTANCE["messageStackedAll"], nMoved, itemStr + " " + tgtStr);
            }
        });
    });
    if(!haveMatched) player.messages.send(SmartStack.INSTANCE.messageNoMatch);
    else if(haveMoved) {
        player.updateStatsAndAttributes();
        player.passTurn(TurnType.Idle);
    }

}

export const StackNearby = new Action()
    .setUsableBy(EntityType.Player)
    .setHandler(handleStackNearby);


import Doodad from "game/doodad/Doodad";
import { Action } from "game/entity/action/Action";
import { EntityType } from "game/entity/IEntity";
import { ContainerReferenceType } from "game/item/IItem";
import { Registry } from "mod/ModRegistry";
import SmartStack from "./SmartStack";

export declare enum StackAttemptResults {
    StackedAll = 0,
    StackedSome = 1,
    StackedNone = 2,
    NoMatch = 3,
    TargetInvalid = 4
};

export default new Action()
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
        if(containers.length) { 
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
                let msgKey:keyof SmartStack;
                if(nMoved == nHave) msgKey = "messageStackedAll";
                else if(nMoved > 0) msgKey = "messageStackedSome";
                else msgKey = "messageStackedNone";
                SmartStack.LOG.info(`Sending message '${msgKey}'...`);
                player.messages.send(Registry<SmartStack>().get(msgKey), itemStr, tgtStr);
            });
        });
        if(!haveMatched) player.messages.send(Registry<SmartStack>().get("messageNoMatch"));
    });

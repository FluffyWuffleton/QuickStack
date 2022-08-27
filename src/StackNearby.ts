import Doodad from "game/doodad/Doodad";
import { Action } from "game/entity/action/Action";
import { EntityType } from "game/entity/IEntity";
import { ContainerReferenceType } from "game/item/IItem";
import { IActionHandlerApi } from "game/entity/action/IAction";
import Player from "game/entity/player/Player";
import { IActionUsable } from "game/entity/action/IAction";
import { Delay } from "game/entity/IHuman";

import QSTransferHandler from "QSTransferHandler";
import { QSHandlerState, QSTargettingFlag } from "IQSTransferHandler";
import QuickStack from "QuickStack";

function handleStackNearby(action: IActionHandlerApi<Player, IActionUsable>): void {
    const handler = new QSTransferHandler(
        action.executor,
        QSTargettingFlag.self,
        QSTargettingFlag.nearbyDoodads | QSTargettingFlag.nearbyTiles
    );
    const itemMgr = action.executor.island.items;
    let movedSome: boolean = false;

    // Initialization error?
    if (handler.state & QSHandlerState.error) {
        QuickStack.LOG.error(`Error flag in handler after initialization. Code ${handler.state.toString(2)}`);
        return;
    }

    // Initialization success
    QuickStack.LOG.info(`Handler initialized for StackNearby. Identified ` +
        `${handler.destinations.reduce((n, d) => { return d.type === ContainerReferenceType.Doodad ? n + 1 : 0; }, 0)} nearby doodads and ` +
        `${handler.destinations.reduce((n, d) => { return d.type === ContainerReferenceType.Tile ? n + 1 : 0; }, 0)} nearby tiles.`);

    // Transfer error?
    if ((handler.executeTransfer() as QSHandlerState) & QSHandlerState.error) {
        QuickStack.LOG.error(`Error flag in handler during execution. Code ${handler.state.toString(2)}`);
        return;
    }

    // Transfer success. Or maybe nothing.
    // Send messages.
    handler.executionResults.forEach(pairList => {
        pairList.forEach(pair => {
            // <Destination container>-string ("into [containername]", "onto the ground")
            let tgtStr: string = "";
            switch (pair.destination.type) {
                case ContainerReferenceType.Doodad:
                    tgtStr = "into " + (pair.destination.container as Doodad).getName().getString();
                    break;
                case ContainerReferenceType.Tile:
                    tgtStr = "onto the ground";
                    break;
                default:
                    tgtStr = "somewhere"
            }

            // somestr = <transferred item>-strings ("5 bones", "1/7 piles of ashes") 
            // nonestr = <non-transferred item>-strings ("bones", "mud")
            const somestr:string[] = [];
            const nonestr:string[] = [];
            let filledup = false; 
            pair.matches.forEach((match) => {
                let str = "";
                let plural = 5;
                if (match.sent === match.had) {
                    str = `${match.sent} `;
                    plural = match.sent;
                } else if (match.sent > 0) {
                    str = `${match.sent}/${match.had} `;
                    plural = match.had;
                    filledup = true;
                }
                str += `${itemMgr.getItemTypeGroupName(match.type, false, plural).getString()}`;
                if(match.sent) somestr.push(str);
                else nonestr.push(str);
            });
            
            // Send messages for this destination's results
            if(somestr.length) {
                movedSome = true;
                action.executor.messages.send(QuickStack.INSTANCE[filledup ? "messageStackedSome" : "messageStackedAll"], somestr.join(', ').concat(tgtStr));
            }
            if(nonestr.length) action.executor.messages.send(QuickStack.INSTANCE.messageStackedNone, somestr.join(', ').concat(tgtStr));
            
        }); // foreach pair in pairList
    }); // foreach pairlist in executionResults

    if (!movedSome) action.executor.messages.send(QuickStack.INSTANCE.messageNoMatch);
    else {
        action.executor.addDelay(Delay.LongPause);
        game.passTurn(action.executor);
    }
}

export const StackNearby = new Action()
    .setUsableBy(EntityType.Player)
    .setHandler(handleStackNearby);
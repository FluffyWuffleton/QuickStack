import Doodad from "game/doodad/Doodad";
import { Action } from "game/entity/action/Action";
import { EntityType } from "game/entity/IEntity";
import { ContainerReferenceType } from "game/item/IItem";
import { IActionHandlerApi } from "game/entity/action/IAction";
import Player from "game/entity/player/Player";
import { IActionUsable } from "game/entity/action/IAction";
import { Delay } from "game/entity/IHuman";
import { QSTransferHandler, QSHandlerState, QSTargettingFlag } from "./../QSTransferHandler";
import QSStaticHelper from "./../QSStaticHelper";

function handleStackNearby(action: IActionHandlerApi<Player, IActionUsable>): void {
    QSStaticHelper.LOG.info("Entering handleStackNearby()");

    const handler = new QSTransferHandler(
        action.executor,
        QSTargettingFlag.self,
        QSTargettingFlag.nearbyDoodads | QSTargettingFlag.nearbyTiles
    );
    const itemMgr = action.executor.island.items;
    let movedSome: boolean = false;
    let triedSome: boolean = false;

    QSStaticHelper.LOG.info("Called QSTransferHandler constructor.");


    // Initialization error?
    if (handler.state & QSHandlerState.error) {
        QSStaticHelper.LOG.error(`Error flag in handler after initialization. Code ${handler.state.toString(2)}`);
        return;
    }

    // Initialization success
    QSStaticHelper.LOG.info(`Handler initialized for StackNearby. Identified ` +
        `${handler.destinations.reduce((n, d) => { return d.type === ContainerReferenceType.Doodad ? n + 1 : n; }, 0)} nearby doodads and ` +
        `${handler.destinations.reduce((n, d) => { return d.type === ContainerReferenceType.Tile ? n + 1 : n; }, 0)} nearby tiles.`);

    // Transfer error?
    if ((handler.executeTransfer() as QSHandlerState) & QSHandlerState.error) {
        QSStaticHelper.LOG.error(`Error flag in handler during execution. Code ${handler.state.toString(2)}`);
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
                    tgtStr = "to somewhere"
            }

            const itemStrings = {
                all: [] as string[],  // item types that were fully deposited. Format e.g. '4 grapes', '6 piles of sand'
                some: [] as string[], // item types that were partially deposited. Format e.g. '2/4 grapes', '1/6 piles of sand'
                none: [] as string[]  // item types that could not be deposited. Format e.g. 'grapes', 'piles of sand'
            };
            let anyPartial = false; // did any partial transfers take place

            pair.matches.forEach((match) => {
                if (match.sent === match.had) {
                    itemStrings.all.push(`${match.sent} ${itemMgr.getItemTypeGroupName(match.type, false, match.sent).getString()}`);
                } else if (match.sent > 0) {
                    itemStrings.some.push(`${match.sent}/${match.had} ${itemMgr.getItemTypeGroupName(match.type, false, match.had).getString()}`);
                    anyPartial = true;
                } else {
                    itemStrings.none.push(`${itemMgr.getItemTypeGroupName(match.type, "indefinite", match.had).getString()}`);
                }
            });

            // Send messages for this destination's results
            if (itemStrings.all.length + itemStrings.some.length) {
                movedSome = true;
                action.executor.messages.send(QSStaticHelper.INSTANCE[anyPartial ? "messageStackedSome" : "messageStackedAll"], itemStrings.all.concat(itemStrings.some), tgtStr);
            }
            if (itemStrings.none.length) {
                triedSome = true;
                action.executor.messages.send(QSStaticHelper.INSTANCE.messageStackedNone, itemStrings.none, tgtStr);
            }

        }); // foreach pair in pairList
    }); // foreach pairlist in executionResults

    if (movedSome) {
        action.executor.addDelay(Delay.LongPause);
        game.passTurn(action.executor);
    } else if (!triedSome) {
        action.executor.messages.send(QSStaticHelper.INSTANCE.messageNoMatch);
    }
}

export const StackNearby = new Action()
    .setUsableBy(EntityType.Player)
    .setHandler(handleStackNearby);
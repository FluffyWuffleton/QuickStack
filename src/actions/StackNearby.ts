import { Action } from "game/entity/action/Action";
import { EntityType } from "game/entity/IEntity";
import { ContainerReferenceType } from "game/item/IItem";
import { IActionHandlerApi } from "game/entity/action/IAction";
import Player from "game/entity/player/Player";
import { IActionUsable } from "game/entity/action/IAction";
import { Delay } from "game/entity/IHuman";
import { TransferHandler } from "../TransferHandler";
import { THState, THTargettingFlag } from "../ITransferHandler";
import StaticHelper from "./../StaticHelper";

function handleStackNearby(action: IActionHandlerApi<Player, IActionUsable>): void {
    StaticHelper.QS_LOG.info("Entering handleStackNearby()");
    
    const player = action.executor;
    
    const handler = new TransferHandler(
        player,
        THTargettingFlag.self,
        THTargettingFlag.nearbyDoodads | THTargettingFlag.nearbyTiles
    );
    
    StaticHelper.QS_LOG.info("Called TransferHandler constructor.");

    // Initialization error?
    if (handler.state & THState.error) {
        StaticHelper.QS_LOG.error(`Error flag in handler after initialization. Code ${handler.state.toString(2)}`);
        return;
    }

    // Initialization success
    StaticHelper.QS_LOG.info(`Handler initialized for StackNearby. Identified ` +
        `${handler.destinations.reduce((n, d) => { return d.type === ContainerReferenceType.Doodad ? n + 1 : n; }, 0)} nearby doodads and ` +
        `${handler.destinations.reduce((n, d) => { return d.type === ContainerReferenceType.Tile ? n + 1 : n; }, 0)} nearby tiles.`);

    // Transfer error?
    if ((handler.executeTransfer() as THState) & THState.error) {
        StaticHelper.QS_LOG.error(`Error flag in handler during execution. Code ${handler.state.toString(2)}`);
        return;
    }

    // Transfer success. Or maybe nothing.
    // Send messages.
    if(!handler.reportMessages()) StaticHelper.QS_LOG.warn(`TransferHandler.reportMessages() failed for some reason.`);

    if (handler.anySuccess || handler.anyPartial) {
        player.addDelay(Delay.LongPause);
        game.passTurn(player);
    }
}

export const StackNearby = new Action()
    .setUsableBy(EntityType.Player)
    .setHandler(handleStackNearby);

//export const StacknearbySet = new UsableAction<
import { ContainerReferenceType, IContainer, ItemType } from "game/item/IItem";

export enum TransferCompleteness {
    none = 0,
    some = 1,
    all = 2
}

// Bitmap flags indicating the state of a TransferHandler object.
export enum THState {
    idle = 0b00000000, // 0 // No errors yet but haven't performed transfer.
    complete = 0b00000001, // 1 // Executed transfer, no errors.
    collision = 0b00000010, // 2 // Error in construction params. Source and destination inputs share a location flag.
    noTargetFlag = 0b00000100, // 4 // Error in construction params. Source and/or destination inputs with no location flag.
    executeError = 0b00001000, // 8 // Error in executeTransfer(). 
    // This flag is only raised if an error occurs in the process of transfering inventory about in executeTransfer().
    // Note that executeTransfer() will not attempt to run if another error flag is already set.
    error = 0b10001110 // Union of all error flags + bit8
}

// Bitmap flags to define transfer target selection mode for TransferHandler construction
export enum THTargettingFlag {
    recursive = 0b0001, // 1 // Include sub-containers. !! NOT IMPLEMENTED RIGHT NOW.
    self = 0b0010,  // 2 // Player inventory
    nearbyDoodads = 0b0100, // 4 // Player-adjacent doodads 
    nearbyTiles = 0b1000, // 8 // Player-adjacent tiles
    everywhere = self | nearbyDoodads | nearbyTiles // Union value of every location-specific flag
}

/**
 * A container, its reference type, and a name string for messages.
 */
export interface ITransferTarget {
    container: IContainer;
    type: ContainerReferenceType;
}
        /* readonly msgString: string | TranslationImpl;

    constructor(container: IContainer, island: Island) {
        this.container = container;
        this.refType = island.items.getContainerReference(container, undefined).crt;
        switch (this.refType) {
            case ContainerReferenceType.Doodad:
                this.msgString = (container as Doodad).getName("indefinite", 1);
            case ContainerReferenceType.Item:
                this.msgString = (container as Item).getName("indefinite", 1, false, false, true);
            case ContainerReferenceType.PlayerInventory:
                this.msgString = Translation.message("yourinventory");
            case ContainerReferenceType.Tile:
                let ttype:ITerrainDecoration = island.getTerrainItems() getTile(1,2,3).data
                //((container as ITile).x ?? -1, (container as ITile).y ?? -1, (container as ITile).z ?? -1);
                //this.msgString = ttype ? Translation.resolve(Dictionary.Terrain, ttype[0].)'';

            case ContainerReferenceType.Invalid:
            case ContainerReferenceType.NPCInventory:
            case ContainerReferenceType.World:
            default:
                return Translation.message("unknown");

        }
    }

} */



/**
 * Describes the transfer of a single ItemType.
 */
export interface ITransferTypeMatch {
    type: ItemType; // The type
    had: number;    // How many of this item were originally present in the source container.
    sent: number;   // How many of this item were transferred to the destination container.
}

/**
 * Defines a single source->destination transfer event.
 */
export interface ITransferPairing {
    source: ITransferTarget;        // The source container for this event.
    destination: ITransferTarget;   // The destination container for this event.
    matches: ITransferTypeMatch[];  // List of TypeMatches present in this event.
}

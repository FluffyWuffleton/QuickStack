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

export interface ITHTargetRecursive { recursive?: true; }

export interface ITHTargetSelf extends ITHTargetRecursive { self: true; };
export interface ITHTargetTiles extends ITHTargetRecursive { tiles: true; };
export interface ITHTargetDoodads extends ITHTargetRecursive { doodads: true; };
export interface ITHTargetSpecific extends ITHTargetRecursive { container: IContainer | IContainer[] };

export type THTargettingParam = (ITHTargetSelf) | (ITHTargetTiles) | (ITHTargetDoodads) | (ITHTargetSpecific);

/**
 * A container, its reference type, and optional links within a nested-container hierarchy.
 */
export interface ITransferTarget {
    container: IContainer;
    type: ContainerReferenceType;
    children?: ITransferTarget[];
    parent?: ITransferTarget;
}

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
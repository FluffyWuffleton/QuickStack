import Item from "game/item/Item";
import { ContainerReferenceType, IContainer, ItemType } from "game/item/IItem";

export declare enum QSTransferCompleteness {
    none = 0,
    some = 1,
    all = 2
}

export declare enum QSHandlerState { 
    idle         = 0b00000000, // 0 // No errors yet but haven't performed transfer.
    complete     = 0b00000001, // 1 // Executed transfer, no errors.
    collision    = 0b00000010, // 2 // Error in construction params. Source and destination inputs share a location flag.
    noTargetFlag = 0b00000100, // 4 // Error in construction params. Source and/or destination inputs with no location flag.
    executeError = 0b00001000, // 8 // Error in executeTransfer(). 
                                    // This flag is only raised if an error occurs in the process of transfering inventory about in executeTransfer().
                                    // Note that executeTransfer() will not attempt to run if another error flag is already set.
    error        = 0b10001110 // Union of all error flags + bit8
}
// Bitmap flags to define IQSTarget auto-selection mode for QSHandler constructor
export declare enum QSTargettingFlag {
    recursive     = 1<<0, // 1 // Include sub-containers. !! NOT IMPLEMENTED RIGHT NOW.
    self          = 1<<1, // 2 // Player inventory
    nearbyDoodads = 1<<2, // 4 // Player-adjacent doodads 
    nearbyTiles   = 1<<3, // 8 // Player-adjacent tiles
    everywhere    = self|nearbyDoodads|nearbyTiles // Union value of every location-specific flag
}

// /**
//  * Check if a number represents a valid set of IQSAutoTargetFlags.
//  * At least one location flag must be set. Recursion flag is optional in all cases. 
//  * Bits that aren't covered by the enumeration (bit 5 and above) are ignored.
//  * @param {QSAutoTargetFlagSet} flags 
//  * @returns {boolean}
//  */
// export function validIQSAutoTarget(flags: QSTargettingFlag):boolean { { return (flags & QSTargettingFlag.everywhere)!= 0 } }

export interface IQSTarget {
    container: IContainer;
    type: ContainerReferenceType;
}

export interface IQSTypeMatch {
    type: ItemType;
    had?: number;
    sent?: number;
    hadRefs?: Item[];
    sentRefs?: Item[]; 
}

export interface IQSPairing {
    source: IQSTarget;
    destination: IQSTarget;
    matches: IQSTypeMatch[];
}

export interface IQSPairingResult extends IQSPairing {
    matches: (IQSTypeMatch & Required<Pick<IQSTypeMatch, 'had'|'sent'>>)[]; // IQSTypeMatch[] but 'had' and 'sent' fields are required
}
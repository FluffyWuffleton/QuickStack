import { ContainerReferenceType, IContainer } from "game/item/IItem";
import { ContainerHash } from "./LocalStorageCache";
import { IMatchParam } from "./QSMatchGroups";
export declare enum THState {
    idle = 0,
    complete = 1,
    collision = 2,
    noTargetFlag = 4,
    executeError = 8,
    error = 142
}
export declare enum THTargettingFlag {
    recursive = 1,
    self = 2,
    nearbyDoodads = 4,
    nearbyTiles = 8,
    everywhere = 14
}
export interface ITHTargetRecursive {
    recursive?: true;
}
export interface ITHTargetSelf extends ITHTargetRecursive {
    self: true;
}
export interface ITHTargetTiles extends ITHTargetRecursive {
    tiles: true;
}
export interface ITHTargetDoodads extends ITHTargetRecursive {
    doodads: true;
}
export interface ITHTargetSpecific extends ITHTargetRecursive {
    container: IContainer | IContainer[];
}
export type THTargettingParam = (ITHTargetSelf) | (ITHTargetTiles) | (ITHTargetDoodads) | (ITHTargetSpecific);
export interface ITransferTarget {
    container: IContainer;
    cHash: ContainerHash;
    type: ContainerReferenceType;
    children?: ITransferTarget[];
    parent?: ITransferTarget;
}
export interface ITransferItemMatch {
    matched: IMatchParam;
    had: number;
    sent: number;
}
export interface ITransferPairing {
    source: ITransferTarget;
    destination: ITransferTarget;
    matches: ITransferItemMatch[];
}

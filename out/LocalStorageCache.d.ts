import Player from "game/entity/player/Player";
import { IVector3 } from "utilities/math/IVector";
import { MatchParamFlat } from "./QSMatchGroups";
import { StorageCachePlayer, StorageCacheTile, StorageCacheDoodad, StorageCacheBase, StorageCacheItem } from "./StorageCacheBase";
export type ABCheckedMatch = [match: MatchParamFlat, fitAtoB: boolean, fitBtoA: boolean];
interface ICheckedRelations {
    checked: MatchParamFlat[];
    found: ABCheckedMatch[];
}
export declare enum locationGroup {
    self = 0,
    nearby = 1
}
export type ContainerHash = string;
export declare function isOnOrAdjacent(A: IVector3, B: IVector3): boolean;
export declare class LocalStorageCache {
    private _player;
    private _nearby;
    private _nearbyOutdated;
    private _freeze;
    private _interrelations;
    private _fullTreeFlat?;
    get player(): StorageCachePlayer;
    get playerNoUpdate(): StorageCachePlayer;
    get nearby(): (StorageCacheTile | StorageCacheDoodad)[];
    get frozen(): boolean;
    freeze(updateFirst?: boolean): void;
    thaw(): void;
    private get fullTreeFlat();
    interrelation(A: ContainerHash, B: ContainerHash, filter?: MatchParamFlat[]): ICheckedRelations | undefined;
    setOutdated(K?: "player" | "nearby"): void;
    setOutdatedSpecific(Hash: ContainerHash, recursive?: true): boolean;
    private refreshNearby;
    private locationGroupMembers;
    flipHash(A: ContainerHash, B: ContainerHash): boolean;
    ABHash(A: ContainerHash, B: ContainerHash): string;
    CheckedMatchCanTransfer(ABMatch: ABCheckedMatch, filter?: MatchParamFlat[], reverse?: boolean): boolean;
    private purgeRelations;
    updateRelation(A: ContainerHash, B: ContainerHash, filter?: MatchParamFlat[]): boolean;
    find(Hash: ContainerHash): StorageCacheBase | undefined;
    findNearby(Hash: ContainerHash): StorageCacheItem | StorageCacheDoodad | StorageCacheTile | undefined;
    checkSelfNearby(filter?: MatchParamFlat[], reverse?: true): boolean;
    checkSpecificNearby(AHash: ContainerHash, filter?: MatchParamFlat[], reverse?: true): boolean | undefined;
    checkSelfSpecific(BHash: ContainerHash, filter?: MatchParamFlat[], reverse?: true): boolean | undefined;
    checkSpecific(from: ContainerHash | locationGroup, to: ContainerHash | locationGroup, filter?: MatchParamFlat[]): boolean | undefined;
    private _checkSpecific;
    constructor(p: Player);
}
export {};

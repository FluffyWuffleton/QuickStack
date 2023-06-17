import { IContainer, ItemType, ItemTypeGroup } from "game/item/IItem";
export type ThingWithContents = Pick<IContainer, "containedItems">;
interface IMatchByType {
    type: ItemType;
    group?: never;
}
interface IMatchByGroup {
    type?: never;
    group: QSMatchableGroupKey;
}
export type IMatchParam = IMatchByType | IMatchByGroup;
export type MatchParamFlat = ItemType | QSMatchableGroupKey;
export type Matchable = ItemType | ItemTypeGroup;
export declare function flattenMatchParams(p: IMatchParam): MatchParamFlat;
export declare function flattenMatchParams(p: IMatchParam[]): MatchParamFlat[];
export declare function flattenMatchParams(p: Set<IMatchParam>): Set<MatchParamFlat>;
export declare function unflattenMatchParams(p: MatchParamFlat): IMatchParam;
export declare function unflattenMatchParams(p: MatchParamFlat[]): IMatchParam[];
export declare function unflattenMatchParams(p: Set<MatchParamFlat>): Set<IMatchParam>;
export declare function groupifyParameters(P: IMatchParam[] | Set<IMatchParam> | MatchParamFlat[] | Set<MatchParamFlat>): Set<MatchParamFlat>;
export declare function getActiveGroups(type: Matchable): QSMatchableGroupKey[];
export declare function canMatchActiveGroup(type: ItemType, group: QSMatchableGroupKey): boolean;
export declare enum QSGroupsTranslation {
    Projectile = 0,
    ProjectileWeapon = 1,
    Equipment = 2,
    Edible = 3,
    Raw = 4,
    Medical = 5,
    Potable = 6,
    Unpotable = 7,
    Rock = 8,
    Metal = 9,
    Smelting = 10,
    Glassblowing = 11,
    ClayThrowing = 12,
    Poles = 13,
    Fastening = 14,
    Needlework = 15,
    Seeds = 16,
    Fertilizing = 17,
    Paperwork = 18,
    Woodwork = 19,
    Treasure = 20,
    MatchGroupIncludes = 21,
    ItemGroupX = 22,
    ItemTypeX = 23,
    Item = 24
}
export type QSGroupsTranslationKey = keyof typeof QSGroupsTranslation;
export type QSMatchableGroupKey = keyof Omit<typeof QSGroupsTranslation, "MatchGroupIncludes" | "ItemGroupX" | "ItemTypeX" | "Item">;
export declare const QSMatchableGroups: {
    [k in QSMatchableGroupKey]: readonly Matchable[];
};
export type QSMatchableGroupsFlatType = {
    [k in QSMatchableGroupKey]?: ItemType[];
};
export {};

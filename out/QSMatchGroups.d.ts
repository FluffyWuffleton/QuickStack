import { ItemType, ItemTypeGroup } from "game/item/IItem";
interface IMatchByType {
    type: ItemType;
    group?: never;
}
interface IMatchByGroup {
    type?: never;
    group: QSMatchableGroupKey;
}
export declare type IMatchParam = IMatchByType | IMatchByGroup;
export declare type MatchParamFlat = ItemType | QSMatchableGroupKey;
export declare type Matchable = ItemType | ItemTypeGroup;
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
export declare type QSGroupsTranslationKey = keyof typeof QSGroupsTranslation;
export declare type QSMatchableGroupKey = keyof Omit<typeof QSGroupsTranslation, "MatchGroupIncludes" | "ItemGroupX" | "ItemTypeX" | "Item">;
export declare const QSMatchableGroups: {
    [k in QSMatchableGroupKey]: readonly Matchable[];
};
export declare type QSMatchableGroupsFlatType = {
    [k in QSMatchableGroupKey]?: ItemType[];
};
export {};

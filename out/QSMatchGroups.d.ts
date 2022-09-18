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
    Poles = 11,
    Fastening = 12,
    Needlework = 13,
    Seeds = 14,
    Fertilizing = 15,
    Paperwork = 16,
    Woodwork = 17,
    Treasure = 18,
    MatchGroupIncludes = 19,
    ItemGroupX = 20,
    ItemTypeX = 21,
    Item = 22
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

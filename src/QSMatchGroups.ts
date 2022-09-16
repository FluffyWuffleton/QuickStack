import { ItemType, ItemTypeGroup } from "game/item/IItem";

// A generic item-matching parameters based on either ItemType or itemTypeGroup (vanilla groups, not custom groups)
interface IMatchByType { type: ItemType; group?: never;};
interface IMatchByGroup { type?: never; group: QSMatchableGroupKey; };
export type IMatchParam = IMatchByType | IMatchByGroup; // Will contain exactly one defined property, 'type' or 'group'
export type IMatchParamSet = { types: Set<ItemType>, groups: Set<ItemTypeGroup> };
export type Matchable = ItemType | ItemTypeGroup;

// A collection of custom groupings for similar-item match options.
export enum QSGroupsTranslation {
    Projectile,
    ProjectileWeapon,
    Equipment,
    Edible,
    Raw,
    Medical,
    Potable,
    Unpotable,
    Rock,
    Metal,
    Smelting,
    Poles,
    Fastening,
    Needlework,
    Seeds,
    Fertilizing,
    Paperwork,
    Woodwork,
    Treasure, 
    
    MatchGroupIncludes,
    ItemGroupX,
    ItemTypeX,
    Item
};
export type QSGroupsTranslationKey = keyof typeof QSGroupsTranslation;

export type QSMatchableGroupKey = keyof Omit<typeof QSGroupsTranslation, "MatchGroupIncludes"|"ItemGroupX"|"ItemTypeX"|"Item">;
export const QSMatchableGroups: {[k in QSMatchableGroupKey]: readonly Matchable[]} = {
    Projectile: [
        ItemTypeGroup.Arrow,
        ItemTypeGroup.Bullet
    ],
    ProjectileWeapon: [
        ItemTypeGroup.WeaponThatFiresArrows,
        ItemTypeGroup.WeaponThatFiresBullets
    ],
    Equipment: [
        ItemTypeGroup.Equipment
    ],
    Edible: [
        ItemTypeGroup.CookedFood,
        ItemTypeGroup.Vegetable,
        ItemTypeGroup.Fruit
    ],
    Raw: [
        ItemTypeGroup.RawFish,
        ItemTypeGroup.RawMeat,
        ItemTypeGroup.Insect,
        ItemTypeGroup.Egg,
        ItemType.AnimalFat,
        ItemType.Tallow
    ],
    Medical: [
        ItemTypeGroup.Health,
        ItemTypeGroup.Medicinal
    ],
    Potable: [
        ItemTypeGroup.ContainerOfFilteredWater,
        ItemTypeGroup.ContainerOfDesalinatedWater,
        ItemTypeGroup.ContainerOfPurifiedFreshWater,
        ItemTypeGroup.ContainerOfMilk
    ],
    Unpotable: [
        ItemTypeGroup.ContainerOfSeawater,
        ItemTypeGroup.ContainerOfSwampWater,
        ItemTypeGroup.ContainerOfUnpurifiedFreshWater
    ],
    Rock: [
        ItemTypeGroup.Rock
    ],
    Metal: [
        ItemType.CopperIngot,
        ItemType.TinIngot,
        ItemType.BronzeIngot,
        ItemType.IronIngot,
        ItemType.WroughtIron
    ],
    Smelting: [
        ItemType.Limestone,
        ItemType.Talc,
        ItemType.LimestonePowder,
        ItemType.TalcumPowder,
        ItemType.CarbonPowder,
        ItemType.TinOre,
        ItemType.CopperOre,
        ItemType.IronOre
    ],
    Poles: [
        ItemTypeGroup.Pole
    ],
    Fastening: [
        ItemTypeGroup.Cordage,
        ItemType.String,
        ItemType.Rope
    ],
    Needlework: [
        ItemTypeGroup.Needle,
        ItemTypeGroup.Fabric,
        ItemType.AnimalFur,
        ItemType.AnimalPelt,
        ItemType.LeatherHide,
        ItemType.TannedLeather,
        ItemType.Scales
    ],
    Seeds: [
        ItemTypeGroup.Seed,
        ItemTypeGroup.Spores
    ],
    Fertilizing: [
        ItemType.AnimalDung,
        ItemType.AnimalDroppings,
        ItemType.BirdDroppings,
        ItemType.Guano,
        ItemType.PileOfCompost,
        ItemType.BoneMeal,
        ItemType.PileOfAsh,
        ItemType.Fertilizer,
        ItemType.Soil,
        ItemType.FertileSoil
    ],
    Paperwork: [
        ItemTypeGroup.Pulp,
        ItemType.PaperMold,
        ItemType.PaperSheet,
        ItemType.Inkstick,
        ItemType.DrawnMap,
        ItemType.TatteredMap
    ],
    Woodwork: [
        ItemType.Log,
        ItemType.WoodenPlank,
        ItemType.WoodenDowels,
        ItemType.TreeBark
    ],
    Treasure: [
        ItemTypeGroup.Treasure
    ]
} as const;

export type QSMatchableGroupsFlatType = {
    [k in QSMatchableGroupKey]?: ItemType[];
};
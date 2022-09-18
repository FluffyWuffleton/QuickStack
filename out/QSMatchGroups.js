define(["require", "exports", "game/item/IItem"], function (require, exports, IItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.QSMatchableGroups = exports.QSGroupsTranslation = void 0;
    ;
    ;
    var QSGroupsTranslation;
    (function (QSGroupsTranslation) {
        QSGroupsTranslation[QSGroupsTranslation["Projectile"] = 0] = "Projectile";
        QSGroupsTranslation[QSGroupsTranslation["ProjectileWeapon"] = 1] = "ProjectileWeapon";
        QSGroupsTranslation[QSGroupsTranslation["Equipment"] = 2] = "Equipment";
        QSGroupsTranslation[QSGroupsTranslation["Edible"] = 3] = "Edible";
        QSGroupsTranslation[QSGroupsTranslation["Raw"] = 4] = "Raw";
        QSGroupsTranslation[QSGroupsTranslation["Medical"] = 5] = "Medical";
        QSGroupsTranslation[QSGroupsTranslation["Potable"] = 6] = "Potable";
        QSGroupsTranslation[QSGroupsTranslation["Unpotable"] = 7] = "Unpotable";
        QSGroupsTranslation[QSGroupsTranslation["Rock"] = 8] = "Rock";
        QSGroupsTranslation[QSGroupsTranslation["Metal"] = 9] = "Metal";
        QSGroupsTranslation[QSGroupsTranslation["Smelting"] = 10] = "Smelting";
        QSGroupsTranslation[QSGroupsTranslation["Poles"] = 11] = "Poles";
        QSGroupsTranslation[QSGroupsTranslation["Fastening"] = 12] = "Fastening";
        QSGroupsTranslation[QSGroupsTranslation["Needlework"] = 13] = "Needlework";
        QSGroupsTranslation[QSGroupsTranslation["Seeds"] = 14] = "Seeds";
        QSGroupsTranslation[QSGroupsTranslation["Fertilizing"] = 15] = "Fertilizing";
        QSGroupsTranslation[QSGroupsTranslation["Paperwork"] = 16] = "Paperwork";
        QSGroupsTranslation[QSGroupsTranslation["Woodwork"] = 17] = "Woodwork";
        QSGroupsTranslation[QSGroupsTranslation["Treasure"] = 18] = "Treasure";
        QSGroupsTranslation[QSGroupsTranslation["MatchGroupIncludes"] = 19] = "MatchGroupIncludes";
        QSGroupsTranslation[QSGroupsTranslation["ItemGroupX"] = 20] = "ItemGroupX";
        QSGroupsTranslation[QSGroupsTranslation["ItemTypeX"] = 21] = "ItemTypeX";
        QSGroupsTranslation[QSGroupsTranslation["Item"] = 22] = "Item";
    })(QSGroupsTranslation = exports.QSGroupsTranslation || (exports.QSGroupsTranslation = {}));
    ;
    exports.QSMatchableGroups = {
        Projectile: [
            IItem_1.ItemTypeGroup.Arrow,
            IItem_1.ItemTypeGroup.Bullet
        ],
        ProjectileWeapon: [
            IItem_1.ItemTypeGroup.WeaponThatFiresArrows,
            IItem_1.ItemTypeGroup.WeaponThatFiresBullets
        ],
        Equipment: [
            IItem_1.ItemTypeGroup.Equipment
        ],
        Edible: [
            IItem_1.ItemTypeGroup.CookedFood,
            IItem_1.ItemTypeGroup.Vegetable,
            IItem_1.ItemTypeGroup.Fruit
        ],
        Raw: [
            IItem_1.ItemTypeGroup.RawFish,
            IItem_1.ItemTypeGroup.RawMeat,
            IItem_1.ItemTypeGroup.Insect,
            IItem_1.ItemTypeGroup.Egg,
            IItem_1.ItemType.AnimalFat,
            IItem_1.ItemType.Tallow
        ],
        Medical: [
            IItem_1.ItemTypeGroup.Health,
            IItem_1.ItemTypeGroup.Medicinal
        ],
        Potable: [
            IItem_1.ItemTypeGroup.ContainerOfFilteredWater,
            IItem_1.ItemTypeGroup.ContainerOfDesalinatedWater,
            IItem_1.ItemTypeGroup.ContainerOfPurifiedFreshWater,
            IItem_1.ItemTypeGroup.ContainerOfMilk
        ],
        Unpotable: [
            IItem_1.ItemTypeGroup.ContainerOfSeawater,
            IItem_1.ItemTypeGroup.ContainerOfSwampWater,
            IItem_1.ItemTypeGroup.ContainerOfUnpurifiedFreshWater
        ],
        Rock: [
            IItem_1.ItemTypeGroup.Rock
        ],
        Metal: [
            IItem_1.ItemType.CopperIngot,
            IItem_1.ItemType.TinIngot,
            IItem_1.ItemType.BronzeIngot,
            IItem_1.ItemType.IronIngot,
            IItem_1.ItemType.WroughtIron
        ],
        Smelting: [
            IItem_1.ItemType.Limestone,
            IItem_1.ItemType.Talc,
            IItem_1.ItemType.LimestonePowder,
            IItem_1.ItemType.TalcumPowder,
            IItem_1.ItemType.CarbonPowder,
            IItem_1.ItemType.TinOre,
            IItem_1.ItemType.CopperOre,
            IItem_1.ItemType.IronOre
        ],
        Poles: [
            IItem_1.ItemTypeGroup.Pole
        ],
        Fastening: [
            IItem_1.ItemTypeGroup.Cordage,
            IItem_1.ItemType.String,
            IItem_1.ItemType.Rope
        ],
        Needlework: [
            IItem_1.ItemTypeGroup.Needle,
            IItem_1.ItemTypeGroup.Fabric,
            IItem_1.ItemType.AnimalFur,
            IItem_1.ItemType.AnimalPelt,
            IItem_1.ItemType.LeatherHide,
            IItem_1.ItemType.TannedLeather,
            IItem_1.ItemType.Scales
        ],
        Seeds: [
            IItem_1.ItemTypeGroup.Seed,
            IItem_1.ItemTypeGroup.Spores
        ],
        Fertilizing: [
            IItem_1.ItemType.AnimalDung,
            IItem_1.ItemType.AnimalDroppings,
            IItem_1.ItemType.BirdDroppings,
            IItem_1.ItemType.Guano,
            IItem_1.ItemType.PileOfCompost,
            IItem_1.ItemType.BoneMeal,
            IItem_1.ItemType.PileOfAsh,
            IItem_1.ItemType.Fertilizer,
            IItem_1.ItemType.Soil,
            IItem_1.ItemType.FertileSoil
        ],
        Paperwork: [
            IItem_1.ItemTypeGroup.Pulp,
            IItem_1.ItemType.PaperMold,
            IItem_1.ItemType.PaperSheet,
            IItem_1.ItemType.Inkstick,
            IItem_1.ItemType.DrawnMap,
            IItem_1.ItemType.TatteredMap
        ],
        Woodwork: [
            IItem_1.ItemType.Log,
            IItem_1.ItemType.WoodenPlank,
            IItem_1.ItemType.WoodenDowels,
            IItem_1.ItemType.TreeBark
        ],
        Treasure: [
            IItem_1.ItemTypeGroup.Treasure
        ]
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUVNNYXRjaEdyb3Vwcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9RU01hdGNoR3JvdXBzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFHd0QsQ0FBQztJQUNZLENBQUM7SUFLdEUsSUFBWSxtQkF5Qlg7SUF6QkQsV0FBWSxtQkFBbUI7UUFDM0IseUVBQVUsQ0FBQTtRQUNWLHFGQUFnQixDQUFBO1FBQ2hCLHVFQUFTLENBQUE7UUFDVCxpRUFBTSxDQUFBO1FBQ04sMkRBQUcsQ0FBQTtRQUNILG1FQUFPLENBQUE7UUFDUCxtRUFBTyxDQUFBO1FBQ1AsdUVBQVMsQ0FBQTtRQUNULDZEQUFJLENBQUE7UUFDSiwrREFBSyxDQUFBO1FBQ0wsc0VBQVEsQ0FBQTtRQUNSLGdFQUFLLENBQUE7UUFDTCx3RUFBUyxDQUFBO1FBQ1QsMEVBQVUsQ0FBQTtRQUNWLGdFQUFLLENBQUE7UUFDTCw0RUFBVyxDQUFBO1FBQ1gsd0VBQVMsQ0FBQTtRQUNULHNFQUFRLENBQUE7UUFDUixzRUFBUSxDQUFBO1FBRVIsMEZBQWtCLENBQUE7UUFDbEIsMEVBQVUsQ0FBQTtRQUNWLHdFQUFTLENBQUE7UUFDVCw4REFBSSxDQUFBO0lBQ1IsQ0FBQyxFQXpCVyxtQkFBbUIsR0FBbkIsMkJBQW1CLEtBQW5CLDJCQUFtQixRQXlCOUI7SUFBQSxDQUFDO0lBSVcsUUFBQSxpQkFBaUIsR0FBdUQ7UUFDakYsVUFBVSxFQUFFO1lBQ1IscUJBQWEsQ0FBQyxLQUFLO1lBQ25CLHFCQUFhLENBQUMsTUFBTTtTQUN2QjtRQUNELGdCQUFnQixFQUFFO1lBQ2QscUJBQWEsQ0FBQyxxQkFBcUI7WUFDbkMscUJBQWEsQ0FBQyxzQkFBc0I7U0FDdkM7UUFDRCxTQUFTLEVBQUU7WUFDUCxxQkFBYSxDQUFDLFNBQVM7U0FDMUI7UUFDRCxNQUFNLEVBQUU7WUFDSixxQkFBYSxDQUFDLFVBQVU7WUFDeEIscUJBQWEsQ0FBQyxTQUFTO1lBQ3ZCLHFCQUFhLENBQUMsS0FBSztTQUN0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
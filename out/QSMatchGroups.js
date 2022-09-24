define(["require", "exports", "game/item/IItem", "game/item/ItemManager", "./StaticHelper"], function (require, exports, IItem_1, ItemManager_1, StaticHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.QSMatchableGroups = exports.QSGroupsTranslation = exports.canMatchActiveGroup = exports.getActiveGroups = void 0;
    ;
    ;
    function getActiveGroups(type) {
        if (type in IItem_1.ItemTypeGroup)
            return StaticHelper_1.default.QS_INSTANCE.activeMatchGroupsKeys.filter(KEY => exports.QSMatchableGroups[KEY].includes(type));
        const typeAndGroups = [type, ...ItemManager_1.default.getGroups(type)];
        return StaticHelper_1.default.QS_INSTANCE.activeMatchGroupsKeys.filter(KEY => typeAndGroups.some(tg => exports.QSMatchableGroups[KEY].includes(tg)));
    }
    exports.getActiveGroups = getActiveGroups;
    function canMatchActiveGroup(type, group) {
        return StaticHelper_1.default.QS_INSTANCE.activeMatchGroupsKeys.includes(group)
            && (exports.QSMatchableGroups[group].includes(type) || ItemManager_1.default.getGroups(type).some(g => exports.QSMatchableGroups[group].includes(g)));
    }
    exports.canMatchActiveGroup = canMatchActiveGroup;
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
        QSGroupsTranslation[QSGroupsTranslation["Glassblowing"] = 11] = "Glassblowing";
        QSGroupsTranslation[QSGroupsTranslation["ClayThrowing"] = 12] = "ClayThrowing";
        QSGroupsTranslation[QSGroupsTranslation["Poles"] = 13] = "Poles";
        QSGroupsTranslation[QSGroupsTranslation["Fastening"] = 14] = "Fastening";
        QSGroupsTranslation[QSGroupsTranslation["Needlework"] = 15] = "Needlework";
        QSGroupsTranslation[QSGroupsTranslation["Seeds"] = 16] = "Seeds";
        QSGroupsTranslation[QSGroupsTranslation["Fertilizing"] = 17] = "Fertilizing";
        QSGroupsTranslation[QSGroupsTranslation["Paperwork"] = 18] = "Paperwork";
        QSGroupsTranslation[QSGroupsTranslation["Woodwork"] = 19] = "Woodwork";
        QSGroupsTranslation[QSGroupsTranslation["Treasure"] = 20] = "Treasure";
        QSGroupsTranslation[QSGroupsTranslation["MatchGroupIncludes"] = 21] = "MatchGroupIncludes";
        QSGroupsTranslation[QSGroupsTranslation["ItemGroupX"] = 22] = "ItemGroupX";
        QSGroupsTranslation[QSGroupsTranslation["ItemTypeX"] = 23] = "ItemTypeX";
        QSGroupsTranslation[QSGroupsTranslation["Item"] = 24] = "Item";
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
            IItem_1.ItemType.IronOre,
            IItem_1.ItemTypeGroup.SandCastFlask
        ],
        Glassblowing: [
            IItem_1.ItemTypeGroup.Sand,
            IItem_1.ItemType.RefinedSand,
            IItem_1.ItemType.SheetOfGlass,
            IItem_1.ItemType.Lens,
            IItem_1.ItemType.ClayBlowpipe
        ],
        ClayThrowing: [
            IItem_1.ItemType.RawClay,
            IItem_1.ItemType.RawClayBlowpipe,
            IItem_1.ItemType.RawClayBrick,
            IItem_1.ItemType.RawClayJug,
            IItem_1.ItemType.RawClayMortarAndPestle,
            IItem_1.ItemType.ClayFlakes,
            IItem_1.ItemType.ClayBrick,
            IItem_1.ItemType.AshCement,
            IItem_1.ItemType.AshCementBrick
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
            IItem_1.ItemTypeGroup.Spine,
            IItem_1.ItemTypeGroup.Fabric,
            IItem_1.ItemType.Tannin,
            IItem_1.ItemType.Cotton,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUVNNYXRjaEdyb3Vwcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9RU01hdGNoR3JvdXBzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFLeUQsQ0FBQztJQUNXLENBQUM7SUFVdEUsU0FBZ0IsZUFBZSxDQUFDLElBQThCO1FBQzFELElBQUcsSUFBSSxJQUFJLHFCQUFhO1lBQUUsT0FBTyxzQkFBWSxDQUFDLFdBQVcsQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyx5QkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUVySSxNQUFNLGFBQWEsR0FBRyxDQUFDLElBQWdCLEVBQUUsR0FBRyxxQkFBVyxDQUFDLFNBQVMsQ0FBQyxJQUFnQixDQUFDLENBQUMsQ0FBQztRQUNyRixPQUFPLHNCQUFZLENBQUMsV0FBVyxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyx5QkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZJLENBQUM7SUFMRCwwQ0FLQztJQUVELFNBQWdCLG1CQUFtQixDQUFDLElBQWMsRUFBRSxLQUEwQjtRQUMxRSxPQUFPLHNCQUFZLENBQUMsV0FBVyxDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7ZUFDOUQsQ0FBQyx5QkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUkscUJBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMseUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwSSxDQUFDO0lBSEQsa0RBR0M7SUFJRCxJQUFZLG1CQTJCWDtJQTNCRCxXQUFZLG1CQUFtQjtRQUMzQix5RUFBVSxDQUFBO1FBQ1YscUZBQWdCLENBQUE7UUFDaEIsdUVBQVMsQ0FBQTtRQUNULGlFQUFNLENBQUE7UUFDTiwyREFBRyxDQUFBO1FBQ0gsbUVBQU8sQ0FBQTtRQUNQLG1FQUFPLENBQUE7UUFDUCx1RUFBUyxDQUFBO1FBQ1QsNkRBQUksQ0FBQTtRQUNKLCtEQUFLLENBQUE7UUFDTCxzRUFBUSxDQUFBO1FBQ1IsOEVBQVksQ0FBQTtRQUNaLDhFQUFZLENBQUE7UUFDWixnRUFBSyxDQUFBO1FBQ0wsd0VBQVMsQ0FBQTtRQUNULDBFQUFVLENBQUE7UUFDVixnRUFBSyxDQUFBO1FBQ0wsNEVBQVcsQ0FBQTtRQUNYLHdFQUFTLENBQUE7UUFDVCxzRUFBUSxDQUFBO1FBQ1Isc0VBQVEsQ0FBQTtRQUVSLDBGQUFrQixDQUFBO1FBQ2xCLDBFQUFVLENBQUE7UUFDVix3RUFBUyxDQUFBO1FBQ1QsOERBQUksQ0FBQTtJQUNSLENBQUMsRUEzQlcsbUJBQW1CLEdBQW5CLDJCQUFtQixLQUFuQiwyQkFBbUIsUUEyQjlCO0lBQUEsQ0FBQztJQUlXLFFBQUEsaUJBQWlCLEdBQXlEO1FBQ25GLFVBQVUsRUFBRTtZQUNSLHFCQUFhLENBQUMsS0FBSztZQUNuQixxQkFBYSxDQUFDLE1BQU07U0FDdkI7UUFDRCxnQkFBZ0IsRUFBRTtZQUNkLHFCQUFhLENBQUMscUJBQXFCO1lBQ25DLHFCQUFhLENBQUMsc0JBQXNCO1NBQ3ZDO1FBQ0QsU0FBUyxFQUFFO1lBQ1AscUJBQWEsQ0FBQyxTQUFTO1NBQzFCO1FBQ0QsTUFBTSxFQUFFO1lBQ0oscUJBQWEsQ0FBQyxVQUFVO1lBQ3hCLHFCQUFhLENBQUMsU0FBUztZQUN2QixxQkFBYSxDQUFDLEtBQUs7U0FDdEI7UUFDRCxHQUFHLEVBQUU7WUFDRCxxQkFBYSxDQUFDLE9BQU87WUFDckIscUJBQWEsQ0FBQyxPQUFPO1lBQ3JCLHFCQUFhLENBQUMsTUFBTTtZQUNwQixxQkFBYSxDQUFDLEdBQUc7WUFDakIsZ0JBQVEsQ0FBQyxTQUFTO1lBQ2xCLGdCQUFRLENBQUMsTUFBTTtTQUNsQjtRQUNELE9BQU8sRUFBRTtZQUNMLHFCQUFhLENBQUMsTUFBTTtZQUNwQixxQkFBYSxDQUFDLFNBQVM7U0FDMUI7UUFDRCxPQUFPLEVBQUU7WUFDTCxxQkFBYSxDQUFDLHdCQUF3QjtZQUN0QyxxQkFBYSxDQUFDLDJCQUEyQjtZQUN6QyxxQkFBYSxDQUFDLDZCQUE2QjtZQUMzQyxxQkFBYSxDQUFDLGVBQWU7U0FDaEM7UUFDRCxTQUFTLEVBQUU7WUFDUCxxQkFBYSxDQUFDLG1CQUFtQjtZQUNqQyxxQkFBYSxDQUFDLHFCQUFxQjtZQUNuQyxxQkFBYSxDQUFDLCtCQUErQjtTQUNoRDtRQUNELElBQUksRUFBRTtZQUNGLHFCQUFhLENBQUMsSUFBSTtTQUNyQjtRQUNELEtBQUssRUFBRTtZQUNILGdCQUFRLENBQUMsV0FBVztZQUNwQixnQkFBUSxDQUFDLFFBQVE7WUFDakIsZ0JBQVEsQ0FBQyxXQUFXO1lBQ3BCLGdCQUFRLENBQUMsU0FBUztZQUNsQixnQkFBUSxDQUFDLFdBQVc7U0FDdkI7UUFDRCxRQUFRLEVBQUU7WUFDTixnQkFBUSxDQUFDLFNBQVM7WUFDbEIsZ0JBQVEsQ0FBQyxJQUFJO1lBQ2IsZ0JBQVEsQ0FBQyxlQUFlO1lBQ3hCLGdCQUFRLENBQUMsWUFBWTtZQUNyQixnQkFBUSxDQUFDLFlBQVk7WUFDckIsZ0JBQVEsQ0FBQyxNQUFNO1lBQ2YsZ0JBQVEsQ0FBQyxTQUFTO1lBQ2xCLGdCQUFRLENBQUMsT0FBTztZQUNoQixxQkFBYSxDQUFDLGFBQWE7U0FDOUI7UUFDRCxZQUFZLEVBQUU7WUFDVixxQkFBYSxDQUFDLElBQUk7WUFDbEIsZ0JBQVEsQ0FBQyxXQUFXO1lBQ3BCLGdCQUFRLENBQUMsWUFBWTtZQUNyQixnQkFBUSxDQUFDLElBQUk7WUFDYixnQkFBUSxDQUFDLFlBQVk7U0FDeEI7UUFDRCxZQUFZLEVBQUU7WUFDVixnQkFBUSxDQUFDLE9BQU87WUFDaEIsZ0JBQVEsQ0FBQyxlQUFlO1lBQ3hCLGdCQUFRLENBQUMsWUFBWTtZQUNyQixnQkFBUSxDQUFDLFVBQVU7WUFDbkIsZ0JBQVEsQ0FBQyxzQkFBc0I7WUFDL0IsZ0JBQVEsQ0FBQyxVQUFVO1lBQ25CLGdCQUFRLENBQUMsU0FBUztZQUNsQixnQkFBUSxDQUFDLFNBQVM7WUFDbEIsZ0JBQVEsQ0FBQyxjQUFjO1NBQzFCO1FBQ0QsS0FBSyxFQUFFO1lBQ0gscUJBQWEsQ0FBQyxJQUFJO1NBQ3JCO1FBQ0QsU0FBUyxFQUFFO1lBQ1AscUJBQWEsQ0FBQyxPQUFPO1lBQ3JCLGdCQUFRLENBQUMsTUFBTTtZQUNmLGdCQUFRLENBQUMsSUFBSTtTQUNoQjtRQUNELFVBQVUsRUFBRTtZQUNSLHFCQUFhLENBQUMsTUFBTTtZQUNwQixxQkFBYSxDQUFDLEtBQUs7WUFDbkIscUJBQWEsQ0FBQyxNQUFNO1lBQ3BCLGdCQUFRLENBQUMsTUFBTTtZQUNmLGdCQUFRLENBQUMsTUFBTTtZQUNmLGdCQUFRLENBQUMsU0FBUztZQUNsQixnQkFBUSxDQUFDLFVBQVU7WUFDbkIsZ0JBQVEsQ0FBQyxXQUFXO1lBQ3BCLGdCQUFRLENBQUMsYUFBYTtZQUN0QixnQkFBUSxDQUFDLE1BQU07U0FDbEI7UUFDRCxLQUFLLEVBQUU7WUFDSCxxQkFBYSxDQUFDLElBQUk7WUFDbEIscUJBQWEsQ0FBQyxNQUFNO1NBQ3ZCO1FBQ0QsV0FBVyxFQUFFO1lBQ1QsZ0JBQVEsQ0FBQyxVQUFVO1lBQ25CLGdCQUFRLENBQUMsZUFBZTtZQUN4QixnQkFBUSxDQUFDLGFBQWE7WUFDdEIsZ0JBQVEsQ0FBQyxLQUFLO1lBQ2QsZ0JBQVEsQ0FBQyxhQUFhO1lBQ3RCLGdCQUFRLENBQUMsUUFBUTtZQUNqQixnQkFBUSxDQUFDLFNBQVM7WUFDbEIsZ0JBQVEsQ0FBQyxVQUFVO1lBQ25CLGdCQUFRLENBQUMsSUFBSTtZQUNiLGdCQUFRLENBQUMsV0FBVztTQUN2QjtRQUNELFNBQVMsRUFBRTtZQUNQLHFCQUFhLENBQUMsSUFBSTtZQUNsQixnQkFBUSxDQUFDLFNBQVM7WUFDbEIsZ0JBQVEsQ0FBQyxVQUFVO1lBQ25CLGdCQUFRLENBQUMsUUFBUTtZQUNqQixnQkFBUSxDQUFDLFFBQVE7WUFDakIsZ0JBQVEsQ0FBQyxXQUFXO1NBQ3ZCO1FBQ0QsUUFBUSxFQUFFO1lBQ04sZ0JBQVEsQ0FBQyxHQUFHO1lBQ1osZ0JBQVEsQ0FBQyxXQUFXO1lBQ3BCLGdCQUFRLENBQUMsWUFBWTtZQUNyQixnQkFBUSxDQUFDLFFBQVE7U0FDcEI7UUFDRCxRQUFRLEVBQUU7WUFDTixxQkFBYSxDQUFDLFFBQVE7U0FDekI7S0FDSyxDQUFDIn0=
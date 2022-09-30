define(["require", "exports", "game/item/IItem", "game/item/ItemManager", "./StaticHelper"], function (require, exports, IItem_1, ItemManager_1, StaticHelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.QSMatchableGroups = exports.QSGroupsTranslation = exports.canMatchActiveGroup = exports.getActiveGroups = exports.groupifyParameters = exports.unflattenMatchParams = exports.flattenMatchParams = void 0;
    ;
    ;
    function flattenMatchParams(p) {
        const fMapFcn = (pp) => pp.group ?? pp.type;
        if ("length" in p)
            return p.map(fMapFcn);
        if ("size" in p)
            return p.values().map(fMapFcn).toSet();
        return fMapFcn(p);
    }
    exports.flattenMatchParams = flattenMatchParams;
    function unflattenMatchParams(p) {
        const ufMapFcn = (pp) => (typeof pp === "string" ? { group: pp } : { type: pp });
        if (typeof p === "object")
            if ("length" in p)
                return p.map(ufMapFcn);
            else
                return p.values().map(ufMapFcn).toSet();
        else
            return ufMapFcn(p);
    }
    exports.unflattenMatchParams = unflattenMatchParams;
    function groupifyParameters(P) {
        const pSet = new Set;
        if (typeof (Array.isArray(P) ? P[0] : P.values().first()) !== "object")
            P.forEach(param => {
                if (typeof param === "string")
                    pSet.add(param);
                else {
                    const grps = getActiveGroups(param);
                    if (grps.length)
                        pSet.addFrom(grps);
                    else
                        pSet.add(param);
                }
            });
        else
            P.forEach(param => {
                if (param.group)
                    pSet.add(param.group);
                else {
                    const grps = getActiveGroups(param.type);
                    if (grps.length)
                        pSet.addFrom(grps);
                    else
                        pSet.add(param.type);
                }
            });
        return pSet;
    }
    exports.groupifyParameters = groupifyParameters;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUVNNYXRjaEdyb3Vwcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9RU01hdGNoR3JvdXBzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFPeUQsQ0FBQztJQUNXLENBQUM7SUFRdEUsU0FBZ0Isa0JBQWtCLENBQUMsQ0FBaUQ7UUFDaEYsTUFBTSxPQUFPLEdBQUcsQ0FBQyxFQUFlLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQztRQUN6RCxJQUFHLFFBQVEsSUFBSSxDQUFDO1lBQUUsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hDLElBQUcsTUFBTSxJQUFJLENBQUM7WUFBRSxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDdkQsT0FBTyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQUxELGdEQUtDO0lBS0QsU0FBZ0Isb0JBQW9CLENBQUMsQ0FBMEQ7UUFDM0YsTUFBTSxRQUFRLEdBQUcsQ0FBQyxFQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDakcsSUFBRyxPQUFPLENBQUMsS0FBSyxRQUFRO1lBQ3BCLElBQUcsUUFBUSxJQUFJLENBQUM7Z0JBQUUsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztnQkFDcEMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDOztZQUM1QyxPQUFPLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1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
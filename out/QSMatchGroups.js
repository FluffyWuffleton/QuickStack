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
            return StaticHelper_1.default.QS_INSTANCE.activeMatchGroupsKeys?.filter(KEY => exports.QSMatchableGroups[KEY].includes(type)) ?? [];
        const typeAndGroups = [type, ...ItemManager_1.default.getGroups(type)];
        return StaticHelper_1.default.QS_INSTANCE.activeMatchGroupsKeys?.filter(KEY => typeAndGroups.some(tg => exports.QSMatchableGroups[KEY].includes(tg))) ?? [];
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
    })(QSGroupsTranslation || (exports.QSGroupsTranslation = QSGroupsTranslation = {}));
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
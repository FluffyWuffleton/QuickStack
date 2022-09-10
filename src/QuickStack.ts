import { ActionType } from "game/entity/action/IAction";
import Message from "language/dictionary/Message";
import Mod from "mod/Mod";
import Register, { Registry } from "mod/ModRegistry";
import Bindable from "ui/input/Bindable";
import { IInput } from "ui/input/IInput";
import { UsableActionSet } from "game/entity/action/usable/actions/UsableActionsMain";
import { UsableActionGenerator } from "game/entity/action/usable/UsableActionRegistrar";
import Log from "utilities/Log";

import { StackAction } from "./actions/Actions";
import { execSAMN, execSANM, execSANSe, execSASeN, UsableActionsQuickStack } from "./actions/UsableActionsQuickStack";
import Bind from "ui/input/Bind";
import Dictionary from "language/Dictionary";
import Component from "ui/component/Component";
import { CheckButton } from "ui/component/CheckButton";
import Translation from "language/Translation";
import { UsableActionType } from "game/entity/action/usable/UsableActionType";
import { Delay } from "game/entity/IHuman";
import { ItemType, ItemTypeGroup } from "game/item/IItem";
import Details from "ui/component/Details";
import ItemManager from "game/item/ItemManager";
import Text from "ui/component/Text";
import { Matchable } from "./ITransferHandler";


export namespace GLOBALCONFIG {
    export const log_info = false as const;
    export const pause_length = Delay.ShortPause as const;
    export const pass_turn_success = false as const;
    export const force_isusable = false as const;
}

export enum QSTranslation {
    qsPrefix = 0,
    qsPrefixShort,
    parenthetical,
    colorPrefix,
    colorMatchGroup,
    underline,
    concat,

    toX,
    fromX,
    allX,
    here,
    nearby,
    yourInventory,
    toTile,
    fromTile,
    toUnknown,
    fromUnknown,
    XOutOfY,
    mainInventory,
    fullInventory,
    deposit,
    collect,
    onlyXType,
    allTypes,
    thisContainer,
    likeContainers,
    optionTopDown,
    optionTopDown_desc,
    optionKeepContainers,
    optionForbidTiles,

    optionMatchSimilar,
    optionMatchSimilar_desc,

    Projectile,
    ProjectileWeapon,
    Equipment,
    Edible,
    Raw,
    Medical,
    Potable,
    Unpotable,
    Rock,
    Poles,
    CordageAndString,
    Needlework,
    Gardening,
    Paperwork,
    Woodwork,

    MatchGroupIncludes,
    ItemGroupX,
    ItemTypeX,
    Item
};

type QSToggleOptionKey = keyof Pick<typeof QSTranslation, "optionTopDown" | "optionKeepContainers" | "optionForbidTiles">;

// A collection of custom groupings for similar-item match options.
export type QSMatchableGroupKey = keyof Pick<typeof QSTranslation,
    "Projectile"
    | "ProjectileWeapon"
    | "Equipment"
    | "Edible"
    | "Raw"
    | "Medical"
    | "Potable"
    | "Unpotable"
    | "Rock"
    | "Poles"
    | "CordageAndString"
    | "Needlework"
    | "Gardening"
    | "Paperwork"
    | "Woodwork">;

export const QSMatchableGroups: { [k in QSMatchableGroupKey]: readonly Matchable[] } = {
    Projectile: [
        ItemTypeGroup.Arrow,
        ItemTypeGroup.Bullet],
    ProjectileWeapon: [
        ItemTypeGroup.WeaponThatFiresArrows,
        ItemTypeGroup.WeaponThatFiresBullets],
    Equipment: [
        ItemTypeGroup.Equipment],
    Edible: [
        ItemTypeGroup.CookedFood,
        ItemTypeGroup.Vegetable,
        ItemTypeGroup.Fruit],
    Raw: [
        ItemTypeGroup.RawFish,
        ItemTypeGroup.RawMeat,
        ItemTypeGroup.Insect,
        ItemTypeGroup.Egg,
        ItemType.AnimalFat,
        ItemType.Tallow],
    Medical: [
        ItemTypeGroup.Health,
        ItemTypeGroup.Medicinal],
    Potable: [
        ItemTypeGroup.ContainerOfFilteredWater,
        ItemTypeGroup.ContainerOfDesalinatedWater,
        ItemTypeGroup.ContainerOfPurifiedFreshWater,
        ItemTypeGroup.ContainerOfMilk],
    Unpotable: [
        ItemTypeGroup.ContainerOfSeawater,
        ItemTypeGroup.ContainerOfSwampWater,
        ItemTypeGroup.ContainerOfUnpurifiedFreshWater],
    Rock: [
        ItemTypeGroup.Rock],
    Poles: [
        ItemTypeGroup.Pole],
    CordageAndString: [
        ItemTypeGroup.Cordage,
        ItemType.String,
        ItemType.Rope],
    Needlework: [
        ItemTypeGroup.Needle,
        ItemTypeGroup.Fabric,
        ItemType.TannedLeather,
        ItemType.LeatherHide],
    Gardening: [
        ItemTypeGroup.Seed,
        ItemTypeGroup.Spores,
        ItemTypeGroup.Compost,
        ItemType.Fertilizer,
        ItemType.FertileSoil],
    Paperwork: [
        ItemTypeGroup.Pulp,
        ItemType.PaperMold,
        ItemType.PaperSheet,
        ItemType.Inkstick,
        ItemType.DrawnMap,
        ItemType.TatteredMap],
    Woodwork: [
        ItemType.Log,
        ItemType.WoodenPlank,
        ItemType.WoodenDowels,
        ItemType.TreeBark
    ]
} as const;
export type QSMatchableGroupsFlatType = { [k in QSMatchableGroupKey]?: ItemType[] };


export const activeGroupKeyPrefix = "isActive_" as const;
export type IQSGlobalData = { [k in QSToggleOptionKey]: boolean } & { [k in `${typeof activeGroupKeyPrefix}${QSMatchableGroupKey}`]: boolean };

export default class QuickStack extends Mod {
    @Mod.instance<QuickStack>()
    public static readonly INSTANCE: QuickStack;
    @Mod.log()
    public static readonly LOG: Log;

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Dictionary
    @Register.dictionary("QSDictionary", QSTranslation)
    public readonly dictionary: Dictionary;
    private readonly TLget = (id: keyof typeof QSTranslation) => Translation.get(this.dictionary, QSTranslation[id]);

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Messages 
    //

    //@Register.message("ArgBase") // {0}{ 1??} -- utility and debugging
    //public readonly messageArgBase: Message;

    @Register.message("Search") // Smart-stack initiated 
    public readonly messageSearch: Message;
    @Register.message("NoMatch") // No items in inventory match available targets.
    public readonly messageNoMatch: Message;
    @Register.message("NoTypeMatch") // No available targets for selected item type.
    public readonly messageNoTypeMatch: Message;
    @Register.message("StackResult") // Master interpolator for transfer results messaging.
    public readonly messageStackResult: Message;

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Actions
    @Register.action("StackAction", StackAction)
    public readonly actionStackAction: ActionType;

    // Icon placeholders for icon overrides in the submenu
    @Register.usableActionTypePlaceholder("Self")
    public readonly UAPSelf: UsableActionType;
    @Register.usableActionTypePlaceholder("Main")
    public readonly UAPMain: UsableActionType;
    @Register.usableActionTypePlaceholder("Sub")
    public readonly UAPSub: UsableActionType;
    @Register.usableActionTypePlaceholder("Here")
    public readonly UAPHere: UsableActionType;
    @Register.usableActionTypePlaceholder("Alike")
    public readonly UAPAlike: UsableActionType;
    @Register.usableActionTypePlaceholder("Nearby")
    public readonly UAPNearby: UsableActionType;
    
    
    // UA Types for all actions that have an associated slottable icon.
    @Register.usableActionType("QuickStackDepositMenu")
    public readonly UAPDepositMenu: UsableActionType;
    @Register.usableActionType("StackAllSelfNearby")
    public readonly UAPAllSelfNearby: UsableActionType;
    @Register.usableActionTypePlaceholder("StackAllMainNearby")
    public readonly UAPAllMainNearby: UsableActionType;
    @Register.usableActionTypePlaceholder("StackAllSubNearby")
    public readonly UAPAllSubNearby: UsableActionType;
    @Register.usableActionTypePlaceholder("StackAllAlikeSubNearby")
    public readonly UAPAllAlikeSubNearby: UsableActionType;
    @Register.usableActionType("StackTypeSelfNearby")
    public readonly UAPTypeSelfNearby: UsableActionType;
    @Register.usableActionTypePlaceholder("StackTypeMainNearby")
    public readonly UAPTypeMainNearby: UsableActionType;
    @Register.usableActionTypePlaceholder("StackTypeHereNearby")
    public readonly UAPTypeHereNearby: UsableActionType;
    @Register.usableActionType("StackAllNearbySelf")           
    public readonly UAPAllNearbySelf: UsableActionType;
    @Register.usableActionTypePlaceholder("StackAllNearbyMain")
    public readonly UAPAllNearbyMain: UsableActionType;
    @Register.usableActionTypePlaceholder("StackAllMainSub") 
    public readonly UAPAllMainSub: UsableActionType;
    @Register.usableActionTypePlaceholder("StackAllNearbySub")
    public readonly UAPAllNearbySub: UsableActionType;
    @Register.usableActionType("StackTypeToHere")
    public readonly UAPTypeToHere: UsableActionType;
    @Register.usableActionType("StackAllToHere")
    public readonly UAPAllToHere: UsableActionType;

    // Register the top-level QuickStack submenu.
    // The rest of the actions and menus are registered to this menu when its submenu function is called.
    @Register.usableActions("QSUsableActions", UsableActionSet.ItemMoveMenus, reg => UsableActionsQuickStack.register(reg))
    public readonly QSUsableActions: UsableActionGenerator;

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Binds
    @Register.bindable("StackAllSelfNearby", IInput.key("slash", "Shift"))
    public readonly bindableSASeN: Bindable;
    @Register.bindable("StackAllMainNearby")
    public readonly bindableSAMN: Bindable;
    
    @Register.bindable("StackAllNearbySelf", IInput.key("slash", "Shift", "Ctrl"))
    public readonly bindableSANSe: Bindable;
    @Register.bindable("StackAllNearbyMain")
    public readonly bindableSANM: Bindable;

    @Register.bindable("All", IInput.key("a")) // for actions on all types
    public readonly bindableAll: Bindable;
    @Register.bindable("Type", IInput.key("t")) // for actions on specific type
    public readonly bindableType: Bindable;

    @Register.bindable("Self", IInput.key("f")) // for actions to/from full inventory
    public readonly bindableSelf: Bindable;
    @Register.bindable("Main", IInput.key("t")) // for actions to/from top-level inventory
    public readonly bindableMain: Bindable;
    @Register.bindable("Sub", IInput.key("c")) // for actions to/from subcontainer
    public readonly bindableSub: Bindable;
    @Register.bindable("Alike", IInput.key("c", "Shift")) // for actions to/from similar subcontainer
    public readonly bindableAlike: Bindable;
    @Register.bindable("Here", IInput.key("h")) // for actions to/from selected item's location
    public readonly bindableHere: Bindable;
    @Register.bindable("Nearby", IInput.key("n")) // for actions to/from nearby
    public readonly bindableNearby: Bindable;
    

    @Bind.onDown(Registry<QuickStack>().get("bindableSASeN"))
    public SASeNBind(): boolean { return !execSASeN(localPlayer); }

    @Bind.onDown(Registry<QuickStack>().get("bindableSAMN"))
    public SAMNBind(): boolean { return !execSAMN(localPlayer); }

    @Bind.onDown(Registry<QuickStack>().get("bindableSANSe"))
    public SANSeBind(): boolean { return !execSANSe(localPlayer); }

    @Bind.onDown(Registry<QuickStack>().get("bindableSANM"))
    public SANMBind(): boolean { return !execSANM(localPlayer); }
    

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Global data, helper data, and refresh methods
    //

    @Mod.globalData<QuickStack>("Quick Stack")
    public globalData: IQSGlobalData;

    /**
     * An array containing each currently-active match-group as a subarray of itemtypes/itemgroups.
     * e.g. if the group "Projectiles" is active, _activeMatchGroupsArray[0] = [ItemTypeGroup.arrows, ItemTypeGroup.bullets]
     * @type {(readonly Matchable[])[]}
     */
    private _activeMatchGroupsArray: (readonly (Matchable)[])[] = [];
    public get activeMatchGroupsArray(): (readonly (Matchable)[])[] { return this._activeMatchGroupsArray; }

    /**
     * An array of the keys for each each active match group
     * @type {QSMatchableGroupKey[]}
     */
    private _activeMatchGroupsKeys: QSMatchableGroupKey[] = [];
    public get activeMatchGroupsKeys(): QSMatchableGroupKey[] { return this._activeMatchGroupsKeys; }

    private _activeMatchGroupsFlattened: QSMatchableGroupsFlatType;
    public get activeMatchGroupsFlattened(): QSMatchableGroupsFlatType { return this._activeMatchGroupsFlattened; }

    public refreshMatchGroupsArray() {
        this._activeMatchGroupsArray = [];
        this._activeMatchGroupsKeys = [];
        this._activeMatchGroupsFlattened = {};
        (Object.keys(QSMatchableGroups) as QSMatchableGroupKey[]).forEach(KEY => {
            if(this.globalData[`${activeGroupKeyPrefix}${KEY}`]) {
                this._activeMatchGroupsArray.push(QSMatchableGroups[KEY]);
                this._activeMatchGroupsKeys.push(KEY);
                this._activeMatchGroupsFlattened[KEY] = [...QSMatchableGroups[KEY].flatMap(matchable =>
                    matchable in ItemTypeGroup
                        ? [...ItemManager.getGroupItems(matchable as ItemTypeGroup)]
                        : matchable as ItemType
                )];
            }
        });
        QuickStack.LOG.info(`Updated match groups.`);
        console.log(this._activeMatchGroupsArray);
        console.log(this._activeMatchGroupsKeys);
        console.log(this._activeMatchGroupsFlattened)
    }
    public override onInitialize(): any {
        this.refreshMatchGroupsArray();
    }


    // Option section
    @Register.optionsSection
    public constructOptionsSection(section: Component) {
        // Construct buttons for each of the toggleable options
        const ToggleKeys: (keyof Pick<IQSGlobalData, "optionForbidTiles" | "optionKeepContainers" | "optionTopDown">)[] = ["optionForbidTiles", "optionKeepContainers", "optionTopDown"];
        ToggleKeys.forEach(KEY => {
            (!((KEY + "_desc") in QSTranslation)
                ? new CheckButton()
                : new CheckButton()
                    .setTooltip(ttip => ttip.setText(this.TLget(KEY + "_desc" as keyof typeof QSTranslation)))//.setStyle("--text-size", "calc(var(--text-size-normal)*0.9)"))
            )
                .setText(this.TLget(KEY))
                .setRefreshMethod(() => !!(this.globalData[KEY] ?? false))
                .event.subscribe("toggle", (_, checked) => { this.globalData[KEY] = checked; })
                .appendTo(section);
        });

        // "Match Similar"
        new Details()
            .setSummary(btn => btn
                .setText(this.TLget("optionMatchSimilar"))
                .setTooltip(tt => tt.setText(this.TLget("optionMatchSimilar_desc"))))
            .setBlock(true)
            .append([...
                (Object.keys(QSMatchableGroups) as QSMatchableGroupKey[])
                    .map(KEY => new CheckButton()
                        .setText(this.TLget(KEY))
                        .setTooltip(ttip => ttip.addBlock(ttblock => ttblock
                            .setTitle(t => t.setText(this.TLget("MatchGroupIncludes")))
                            .append([...QSMatchableGroups[KEY]
                                .map(matchable => new Component<HTMLParagraphElement>()
                                    .setStyle("padding-left", "5ch")
                                    .setStyle("text-indent", "-5ch")
                                    .append(new Text()
                                        .setText((matchable in ItemType ? this.TLget("ItemTypeX") : this.TLget("ItemGroupX"))
                                            .addArgs(ItemManager.getItemTypeGroupName(matchable, false, 1)))))
                            ])
                        ))
                        .setRefreshMethod(() => !!this.globalData[`${activeGroupKeyPrefix}${KEY}`])
                        .event.subscribe("toggle", (_, checked) => {
                            this.globalData[`${activeGroupKeyPrefix}${KEY}`] = checked;
                            this.refreshMatchGroupsArray();
                        })
                    )])
            .appendTo(section);
    }
}

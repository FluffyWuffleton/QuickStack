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
import { execSAMN, execSASeN, UsableActionsQuickStack } from "./actions/UsableActionsQuickStack";
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
    export const pause_length = Delay.ShortPause;
    export const pass_turn_success = false;
}

export enum QSTranslation {
    qsPrefix = 0,
    parenthetical,
    colorMatchGroup,

    toX,
    fromX,
    allX,
    here,
    yourInventory,
    toTile,
    fromTile,
    toUnknown,
    fromUnknown,
    XOutOfY,
    mainInventory,
    fullInventory,
    deposit,
    withdraw,
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
    | "Paperwork">;

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
        ItemType.TatteredMap]
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
    // Binds
    @Register.bindable("StackAllSelfNearby", IInput.key("slash", "Shift"))
    public readonly bindableSASN: Bindable;
    @Register.bindable("StackAllMainNearby")
    public readonly bindableSAMN: Bindable;

    @Register.bindable("StackAllSelfNearby_submenu", IInput.key("slash", "Shift"))
    public readonly bindableSASN_submenu: Bindable;
    @Register.bindable("StackAllMainNearby_submenu")
    public readonly bindableSAMN_submenu: Bindable;


    //////////////////////////////////////////////////////////////////////////////////////////////
    // Actions
    @Register.action("StackAction", StackAction)
    public readonly actionStackAction: ActionType;

    // Icon placeholder types
    @Register.usableActionType("AllMainNearby")
    public readonly UAPlaceholderAllMainNearby: UsableActionType;

    @Register.usableActionType("AllSelfNearby")
    public readonly UAPlaceholderAllSelfNearby: UsableActionType;


    // Register the top-level QuickStack submenu.
    // The rest of the actions and menus are registered to this menu when its submenu function is called.
    @Register.usableActions("QSUsableActions", UsableActionSet.ItemMoveMenus, reg => UsableActionsQuickStack.register(reg))
    public readonly QSUsableActions: UsableActionGenerator;


    @Bind.onDown(Registry<QuickStack>().get("bindableSAMN"))
    public SAMNBind(): boolean { return !execSAMN(localPlayer); }

    @Bind.onDown(Registry<QuickStack>().get("bindableSASN"))
    public SASNBind(): boolean { return !execSASeN(localPlayer); }


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

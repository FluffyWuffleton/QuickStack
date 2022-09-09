import { ActionType } from "game/entity/action/IAction";
import Message from "language/dictionary/Message";
import Mod from "mod/Mod";
import Bindable from "ui/input/Bindable";
import { UsableActionGenerator } from "game/entity/action/usable/UsableActionRegistrar";
import Log from "utilities/Log";
import Dictionary from "language/Dictionary";
import Component from "ui/component/Component";
import { UsableActionType } from "game/entity/action/usable/UsableActionType";
import { Delay } from "game/entity/IHuman";
import { ItemType } from "game/item/IItem";
import { Matchable } from "./ITransferHandler";
export declare namespace GLOBALCONFIG {
    const pause_length = Delay.ShortPause;
    const pass_turn_success = false;
}
export declare enum QSTranslation {
    qsPrefix = 0,
    qsPrefixShort = 1,
    parenthetical = 2,
    colorMatchGroup = 3,
    concat = 4,
    toX = 5,
    fromX = 6,
    allX = 7,
    here = 8,
    yourInventory = 9,
    toTile = 10,
    fromTile = 11,
    toUnknown = 12,
    fromUnknown = 13,
    XOutOfY = 14,
    mainInventory = 15,
    fullInventory = 16,
    deposit = 17,
    withdraw = 18,
    onlyXType = 19,
    allTypes = 20,
    thisContainer = 21,
    likeContainers = 22,
    optionTopDown = 23,
    optionTopDown_desc = 24,
    optionKeepContainers = 25,
    optionForbidTiles = 26,
    optionMatchSimilar = 27,
    optionMatchSimilar_desc = 28,
    Projectile = 29,
    ProjectileWeapon = 30,
    Equipment = 31,
    Edible = 32,
    Raw = 33,
    Medical = 34,
    Potable = 35,
    Unpotable = 36,
    Rock = 37,
    Poles = 38,
    CordageAndString = 39,
    Needlework = 40,
    Gardening = 41,
    Paperwork = 42,
    MatchGroupIncludes = 43,
    ItemGroupX = 44,
    ItemTypeX = 45,
    Item = 46
}
declare type QSToggleOptionKey = keyof Pick<typeof QSTranslation, "optionTopDown" | "optionKeepContainers" | "optionForbidTiles">;
export declare type QSMatchableGroupKey = keyof Pick<typeof QSTranslation, "Projectile" | "ProjectileWeapon" | "Equipment" | "Edible" | "Raw" | "Medical" | "Potable" | "Unpotable" | "Rock" | "Poles" | "CordageAndString" | "Needlework" | "Gardening" | "Paperwork">;
export declare const QSMatchableGroups: {
    [k in QSMatchableGroupKey]: readonly Matchable[];
};
export declare type QSMatchableGroupsFlatType = {
    [k in QSMatchableGroupKey]?: ItemType[];
};
export declare const activeGroupKeyPrefix: "isActive_";
export declare type IQSGlobalData = {
    [k in QSToggleOptionKey]: boolean;
} & {
    [k in `${typeof activeGroupKeyPrefix}${QSMatchableGroupKey}`]: boolean;
};
export default class QuickStack extends Mod {
    static readonly INSTANCE: QuickStack;
    static readonly LOG: Log;
    readonly dictionary: Dictionary;
    private readonly TLget;
    readonly messageSearch: Message;
    readonly messageNoMatch: Message;
    readonly messageNoTypeMatch: Message;
    readonly messageStackResult: Message;
    readonly bindableSASN: Bindable;
    readonly bindableSAMN: Bindable;
    readonly bindableSASN_submenu: Bindable;
    readonly bindableSAMN_submenu: Bindable;
    readonly actionStackAction: ActionType;
    readonly UAPlaceholderAllMainNearby: UsableActionType;
    readonly UAPlaceholderAllSelfNearby: UsableActionType;
    readonly QSUsableActions: UsableActionGenerator;
    SAMNBind(): boolean;
    SASNBind(): boolean;
    globalData: IQSGlobalData;
    private _activeMatchGroupsArray;
    get activeMatchGroupsArray(): (readonly (Matchable)[])[];
    private _activeMatchGroupsKeys;
    get activeMatchGroupsKeys(): QSMatchableGroupKey[];
    private _activeMatchGroupsFlattened;
    get activeMatchGroupsFlattened(): QSMatchableGroupsFlatType;
    refreshMatchGroupsArray(): void;
    onInitialize(): any;
    constructOptionsSection(section: Component): void;
}
export {};

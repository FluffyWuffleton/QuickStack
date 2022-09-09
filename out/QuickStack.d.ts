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
    parenthetical = 1,
    colorMatchGroup = 2,
    toX = 3,
    fromX = 4,
    allX = 5,
    here = 6,
    yourInventory = 7,
    toTile = 8,
    fromTile = 9,
    toUnknown = 10,
    fromUnknown = 11,
    XOutOfY = 12,
    mainInventory = 13,
    fullInventory = 14,
    deposit = 15,
    withdraw = 16,
    onlyXType = 17,
    allTypes = 18,
    thisContainer = 19,
    likeContainers = 20,
    optionTopDown = 21,
    optionTopDown_desc = 22,
    optionKeepContainers = 23,
    optionForbidTiles = 24,
    optionMatchSimilar = 25,
    optionMatchSimilar_desc = 26,
    Projectile = 27,
    ProjectileWeapon = 28,
    Equipment = 29,
    Edible = 30,
    Raw = 31,
    Medical = 32,
    Potable = 33,
    Unpotable = 34,
    Rock = 35,
    Poles = 36,
    CordageAndString = 37,
    Needlework = 38,
    Gardening = 39,
    Paperwork = 40,
    MatchGroupIncludes = 41,
    ItemGroupX = 42,
    ItemTypeX = 43,
    Item = 44
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

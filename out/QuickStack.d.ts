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
import { QSMatchableGroupKey, QSMatchableGroupsFlatType } from "./QSMatchGroups";
export declare namespace GLOBALCONFIG {
    const log_info: false;
    const pause_length: Delay.ShortPause;
    const pass_turn_success: false;
    const force_isusable: false;
}
export declare enum QSTranslation {
    qsPrefix = 0,
    qsPrefixShort = 1,
    parenthetical = 2,
    colorPrefix = 3,
    colorMatchGroup = 4,
    underline = 5,
    concat = 6,
    toX = 7,
    fromX = 8,
    allX = 9,
    here = 10,
    nearby = 11,
    yourInventory = 12,
    toTile = 13,
    fromTile = 14,
    toUnknown = 15,
    fromUnknown = 16,
    XOutOfY = 17,
    mainInventory = 18,
    fullInventory = 19,
    deposit = 20,
    collect = 21,
    onlyXType = 22,
    allTypes = 23,
    thisContainer = 24,
    likeContainers = 25,
    optionTopDown = 26,
    optionTopDown_desc = 27,
    optionKeepContainers = 28,
    optionForbidTiles = 29,
    optionMatchSimilar = 30,
    optionMatchSimilar_desc = 31
}
export declare type QSTranslationKey = keyof typeof QSTranslation;
declare type QSToggleOptionKey = keyof Pick<typeof QSTranslation, "optionForbidTiles" | "optionKeepContainers" | "optionTopDown">;
export declare const activeGroupKeyPrefix: "isActive_";
export declare type IQSGlobalData = {
    [k in QSToggleOptionKey]: boolean;
} & {
    activeMatchGroups: {
        [k in QSMatchableGroupKey]: boolean;
    };
};
export default class QuickStack extends Mod {
    static readonly INSTANCE: QuickStack;
    static readonly LOG: Log;
    readonly dictMain: Dictionary;
    private readonly TLGetMain;
    readonly dictGroups: Dictionary;
    private readonly TLGetGroup;
    readonly messageSearch: Message;
    readonly messageNoMatch: Message;
    readonly messageNoTypeMatch: Message;
    readonly messageStackResult: Message;
    readonly actionStackAction: ActionType;
    readonly UAPSelf: UsableActionType;
    readonly UAPMain: UsableActionType;
    readonly UAPSub: UsableActionType;
    readonly UAPHere: UsableActionType;
    readonly UAPAlike: UsableActionType;
    readonly UAPNearby: UsableActionType;
    readonly UAPDepositMenu: UsableActionType;
    readonly UAPAllSelfNearby: UsableActionType;
    readonly UAPAllMainNearby: UsableActionType;
    readonly UAPAllSubNearby: UsableActionType;
    readonly UAPAllAlikeSubNearby: UsableActionType;
    readonly UAPTypeSelfNearby: UsableActionType;
    readonly UAPTypeMainNearby: UsableActionType;
    readonly UAPTypeHereNearby: UsableActionType;
    readonly UAPAllNearbySelf: UsableActionType;
    readonly UAPAllNearbyMain: UsableActionType;
    readonly UAPAllMainSub: UsableActionType;
    readonly UAPAllNearbySub: UsableActionType;
    readonly UAPTypeToHere: UsableActionType;
    readonly UAPAllToHere: UsableActionType;
    readonly QSUsableActions: UsableActionGenerator;
    readonly bindableSASeN: Bindable;
    readonly bindableSAMN: Bindable;
    readonly bindableSANSe: Bindable;
    readonly bindableSANM: Bindable;
    SASeNBind(): boolean;
    SAMNBind(): boolean;
    SANSeBind(): boolean;
    SANMBind(): boolean;
    readonly bindableAll: Bindable;
    readonly bindableType: Bindable;
    readonly bindableSelf: Bindable;
    readonly bindableMain: Bindable;
    readonly bindableSub: Bindable;
    readonly bindableAlike: Bindable;
    readonly bindableHere: Bindable;
    readonly bindableNearby: Bindable;
    globalData: IQSGlobalData;
    initializeGlobalData(data?: IQSGlobalData): IQSGlobalData;
    freshGlobalData(): IQSGlobalData;
    onInitialize(): void;
    private _activeMatchGroupsFlattened;
    get activeMatchGroupsFlattened(): QSMatchableGroupsFlatType;
    private _activeMatchGroupsKeys;
    get activeMatchGroupsKeys(): QSMatchableGroupKey[];
    private _anyMatchgroupsActive;
    get anyMatchgroupsActive(): boolean;
    refreshMatchGroupsArray(): void;
    constructOptionsSection(section: Component): void;
}
export {};

import { ActionType } from "game/entity/action/IAction";
import { UsableActionGenerator } from "game/entity/action/usable/UsableActionRegistrar";
import Player from "game/entity/player/Player";
import Message from "language/dictionary/Message";
import Mod from "mod/Mod";
import Bindable from "ui/input/Bindable";
import Log from "utilities/Log";
import { UsableActionType } from "game/entity/action/usable/UsableActionType";
import { Delay } from "game/entity/IHuman";
import { IContainer } from "game/item/IItem";
import Item from "game/item/Item";
import ItemManager from "game/item/ItemManager";
import Dictionary from "language/Dictionary";
import Component from "ui/component/Component";
import { IVector3 } from "utilities/math/IVector";
import { LocalStorageCache } from "./LocalStorageCache";
import { QSMatchableGroupKey, QSMatchableGroupsFlatType } from "./QSMatchGroups";
export declare namespace GLOBALCONFIG {
    const log_info: true;
    const pause_length: Delay.ShortPause;
    const pass_turn_success: false;
    const force_isusable: false;
    const force_menus: false;
}
export declare enum QSTLUtilies {
    qsPrefix = 0,
    qsPrefixShort = 1,
    parenthetical = 2,
    colorPrefix = 3,
    colorMatchGroup = 4,
    colorGround = 5,
    underline = 6,
    concat = 7
}
export declare type QSTLUtilitiesKey = keyof typeof QSTLUtilies;
export declare enum QSTranslation {
    toX = 0,
    fromX = 1,
    fromXtoY = 2,
    allX = 3,
    here = 4,
    nearby = 5,
    yourInventory = 6,
    toTile = 7,
    fromTile = 8,
    toUnknown = 9,
    fromUnknown = 10,
    XOutOfY = 11,
    mainInventory = 12,
    fullInventory = 13,
    facingTile = 14,
    deposit = 15,
    collect = 16,
    onlyXType = 17,
    allTypes = 18,
    thisContainer = 19,
    likeContainers = 20,
    optionTopDown = 21,
    optionTopDown_desc = 22,
    optionKeepContainers = 23,
    optionForbidTiles = 24,
    optionMatchSimilar = 25,
    optionMatchSimilar_desc = 26
}
export declare type QSTranslationKey = keyof typeof QSTranslation;
declare type QSToggleOptionKey = keyof Pick<typeof QSTranslation, "optionForbidTiles" | "optionKeepContainers" | "optionTopDown">;
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
    private static _maybeLog?;
    static get MaybeLog(): Log;
    readonly dictMain: Dictionary;
    readonly dictGroups: Dictionary;
    readonly dictUtil: Dictionary;
    private readonly TLGetMain;
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
    readonly UAPNear: UsableActionType;
    readonly UAPFace: UsableActionType;
    readonly UAPAll: UsableActionType;
    readonly UAPType: UsableActionType;
    readonly UAPDepositMenu: UsableActionType;
    readonly UAPCollectMenu: UsableActionType;
    readonly UAPAllSelfNear: UsableActionType;
    readonly UAPAllMainNear: UsableActionType;
    readonly UAPAllSubNear: UsableActionType;
    readonly UAPAllLikeNear: UsableActionType;
    readonly UAPTypeSelfNear: UsableActionType;
    readonly UAPTypeMainNear: UsableActionType;
    readonly UAPTypeHereNear: UsableActionType;
    readonly UAPAllNearSelf: UsableActionType;
    readonly UAPAllNearMain: UsableActionType;
    readonly UAPAllMainSub: UsableActionType;
    readonly UAPAllNearSub: UsableActionType;
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
    readonly bindableDeposit: Bindable;
    readonly bindableCollect: Bindable;
    readonly bindableAll: Bindable;
    readonly bindableType: Bindable;
    readonly bindableSelf: Bindable;
    readonly bindableMain: Bindable;
    readonly bindableSub: Bindable;
    readonly bindableLike: Bindable;
    readonly bindableHere: Bindable;
    readonly bindableNear: Bindable;
    private _localStorageCache?;
    get localStorageCache(): LocalStorageCache;
    private initCache;
    protected registerEventHandlersOnPreLoad: boolean;
    protected preLoadHandler(): void;
    onInitialize(): void;
    onUnload(): void;
    protected localPlayerPostMove(): void;
    protected localPlayerChangeZ(): void;
    protected localPlayerItemAdd(): void;
    protected localPlayerItemRemove(): void;
    protected localPlayerItemUpdate(): void;
    protected localPlayerIDChanged(host: Player): void;
    protected itemsContainerItemAdd(host: ItemManager, _item: Item, c: IContainer): void;
    protected itemsContainerItemRemove(host: ItemManager, _item: Item, c: IContainer | undefined, cpos: IVector3 | undefined): void;
    protected containerUpdated(items: ItemManager, container: IContainer | undefined, cpos: IVector3 | undefined): void;
    globalData: IQSGlobalData;
    initializeGlobalData(data?: IQSGlobalData): IQSGlobalData;
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

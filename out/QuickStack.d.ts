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
    const log_info: false;
    const pause_length: Delay.ShortPause;
    const pass_turn_success: false;
    const force_isusable: false;
    const force_menus: false;
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

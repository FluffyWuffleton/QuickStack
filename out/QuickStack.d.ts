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
export declare namespace GLOBALCONFIG {
    const pause_length = Delay.ShortPause;
    const pass_turn_success = false;
}
export declare enum QSTranslation {
    qsPrefix = 0,
    toX = 1,
    fromX = 2,
    allX = 3,
    here = 4,
    yourInventory = 5,
    toTile = 6,
    fromTile = 7,
    toUnknown = 8,
    fromUnknown = 9,
    XOutOfY = 10,
    mainInventory = 11,
    fullInventory = 12,
    deposit = 13,
    withdraw = 14,
    onlyXType = 15,
    allTypes = 16,
    thisContainer = 17,
    likeContainers = 18,
    optionTopDown = 19,
    optionTopDown_desc = 20,
    optionKeepContainers = 21,
    optionForbidTiles = 22,
    optionMatchSimilar = 23,
    optionMatchSimilar_desc = 24,
    Projectile = 25,
    ProjectileWeapon = 26,
    Equipment = 27,
    Edible = 28,
    Raw = 29,
    Medical = 30,
    Potable = 31,
    Unpotable = 32,
    Rock = 33,
    Poles = 34,
    CordageAndString = 35,
    Needlework = 36,
    Gardening = 37,
    Paperwork = 38,
    MatchGroupIncludes = 39,
    ItemGroupX = 40,
    ItemTypeX = 41
}
declare type QSToggleOptionKey = keyof Pick<typeof QSTranslation, "optionTopDown" | "optionKeepContainers" | "optionForbidTiles">;
declare type QSMatchableGroupKey = keyof Pick<typeof QSTranslation, "Projectile" | "ProjectileWeapon" | "Equipment" | "Edible" | "Raw" | "Medical" | "Potable" | "Unpotable" | "Rock" | "Poles" | "CordageAndString" | "Needlework" | "Gardening" | "Paperwork">;
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
    constructOptionsSection(section: Component): void;
}
export {};

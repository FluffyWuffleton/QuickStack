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


export namespace GLOBALCONFIG {
    export const pause_length = Delay.ShortPause;
    export const pass_turn_success = false;
}

export enum QSTranslation {
    qsPrefix = 0,
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
    optionForbidTiles
};

type QSToggleOptionKey = keyof Pick<typeof QSTranslation, "optionTopDown" | "optionKeepContainers" | "optionForbidTiles">;
export type IQSGlobalData = {
    [k in QSToggleOptionKey]: boolean
};

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

    /*
        Activation and result messages...
    */
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
    // Options and global data
    @Mod.globalData<QuickStack>("Quick Stack")
    public globalData: IQSGlobalData;

    @Register.optionsSection
    public constructOptionsSection(section: Component) {
        // Construct buttons for each of the toggleable options
        const ToggleKeys:(keyof IQSGlobalData)[] = ["optionForbidTiles", "optionKeepContainers", "optionTopDown"];
        ToggleKeys.forEach(k => {
            QuickStack.LOG.info(`${k}`);
            (!((k + "_desc") in QSTranslation)
                ? new CheckButton()
                : new CheckButton()
                    .addDescription(desc => desc.setText(this.TLget(k + "_desc" as keyof typeof QSTranslation)).setStyle("--text-size","calc(var(--text-size-normal)*0.9)"))
            )
                .setText(this.TLget(k))
                .setRefreshMethod(() => !!this.globalData[k])
                .event.subscribe("toggle", (_, checked) => { this.globalData[k] = checked; })
                .appendTo(section);
        });
    }
}

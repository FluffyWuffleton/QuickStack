import { ActionType } from "game/entity/action/IAction";
import { UsableActionSet } from "game/entity/action/usable/actions/UsableActionsMain";
import { UsableActionGenerator } from "game/entity/action/usable/UsableActionRegistrar";
import Player from "game/entity/player/Player";
import Message from "language/dictionary/Message";
import Mod from "mod/Mod";
import Register, { Registry } from "mod/ModRegistry";
import Bindable from "ui/input/Bindable";
import { IInput } from "ui/input/IInput";
import Log from "utilities/Log";
import { EventBus } from "event/EventBuses";
import { Priority } from "event/EventEmitter";
import { EventHandler } from "event/EventManager";
import { UsableActionType } from "game/entity/action/usable/UsableActionType";
import { Delay } from "game/entity/IHuman";
import { TileUpdateType } from "game/IGame";
import Island from "game/island/Island";
import { IContainer, ItemType, ItemTypeGroup } from "game/item/IItem";
import Item from "game/item/Item";
import ItemManager from "game/item/ItemManager";
import { ITile } from "game/tile/ITerrain";
import Dictionary from "language/Dictionary";
import listSegment from "language/segment/ListSegment";
import Translation from "language/Translation";
import { CheckButton } from "ui/component/CheckButton";
import Component from "ui/component/Component";
import Details from "ui/component/Details";
import { TooltipLocation } from "ui/component/IComponent";
import Text from "ui/component/Text";
import Bind from "ui/input/Bind";
import { IVector3 } from "utilities/math/IVector";
import Vector3 from "utilities/math/Vector3";

import { StackAction } from "./actions/Actions";
import { execSAMN, execSANM, execSANSe, execSASeN, UsableActionsQuickStack } from "./actions/UsableActionsQuickStack";
import { isOnOrAdjacent, LocalStorageCache } from "./LocalStorageCache";
import { QSGroupsTranslation, QSGroupsTranslationKey, QSMatchableGroupKey, QSMatchableGroups, QSMatchableGroupsFlatType } from "./QSMatchGroups";


export namespace GLOBALCONFIG {
    export const log_info = true as const;
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
};
export type QSTranslationKey = keyof typeof QSTranslation;

type QSToggleOptionKey = keyof Pick<typeof QSTranslation, "optionForbidTiles" | "optionKeepContainers" | "optionTopDown">;
const QSToggleOptionKeys: readonly QSToggleOptionKey[] = ["optionForbidTiles", "optionKeepContainers", "optionTopDown"] as const;

export type IQSGlobalData = {
    [k in QSToggleOptionKey]: boolean
} & {
    activeMatchGroups: { [k in QSMatchableGroupKey]: boolean },
};

export default class QuickStack extends Mod {
    @Mod.instance<QuickStack>()
    public static readonly INSTANCE: QuickStack;
    @Mod.log()
    public static readonly LOG: Log;

    public static get MaybeLog(): Log | undefined { return GLOBALCONFIG.log_info ? QuickStack.LOG : undefined; }

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Dictionary
    @Register.dictionary("MainDictionary", QSTranslation)
    public readonly dictMain: Dictionary;
    @Register.dictionary("GroupsDictionary", QSGroupsTranslation)
    public readonly dictGroups: Dictionary

    private readonly TLGetMain = (id: QSTranslationKey) => Translation.get(this.dictMain, QSTranslation[id]);
    private readonly TLGetGroup = (id: QSGroupsTranslationKey) => Translation.get(this.dictGroups, QSGroupsTranslation[id]);

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Messages 
    //

    //@Register.message("ArgBase") // {0}{ 1??} -- utility and debugging
    //public readonly messageArgBase: Message;

    @Register.message("Search") public readonly messageSearch: Message; // Smart-stack initiated 
    @Register.message("NoMatch") public readonly messageNoMatch: Message; // No items in inventory match available targets.
    @Register.message("NoTypeMatch") public readonly messageNoTypeMatch: Message; // No available targets for selected item type.
    @Register.message("StackResult") public readonly messageStackResult: Message; // Master interpolator for transfer results messaging.

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Actions
    @Register.action("StackAction", StackAction) public readonly actionStackAction: ActionType;

    // Icon placeholders for icon overrides in the submenu
    @Register.usableActionTypePlaceholder("Self") public readonly UAPSelf: UsableActionType;
    @Register.usableActionTypePlaceholder("Main") public readonly UAPMain: UsableActionType;
    @Register.usableActionTypePlaceholder("Sub") public readonly UAPSub: UsableActionType;
    @Register.usableActionTypePlaceholder("Here") public readonly UAPHere: UsableActionType;
    @Register.usableActionTypePlaceholder("Alike") public readonly UAPAlike: UsableActionType;
    @Register.usableActionTypePlaceholder("Nearby") public readonly UAPNearby: UsableActionType;
    @Register.usableActionTypePlaceholder("All") public readonly UAPAll: UsableActionType;
    @Register.usableActionTypePlaceholder("Type") public readonly UAPType: UsableActionType;


    // Placeholder types for all UAs that have an associated icon separate from the ones above.
    @Register.usableActionTypePlaceholder("DepositMenu") public readonly UAPDepositMenu: UsableActionType;
    @Register.usableActionTypePlaceholder("CollectMenu") public readonly UAPCollectMenu: UsableActionType;
    @Register.usableActionTypePlaceholder("StackAllSelfNear") public readonly UAPAllSelfNear: UsableActionType;
    @Register.usableActionTypePlaceholder("StackAllMainNear") public readonly UAPAllMainNear: UsableActionType;
    @Register.usableActionTypePlaceholder("StackAllSubNear") public readonly UAPAllSubNear: UsableActionType;
    @Register.usableActionTypePlaceholder("StackAllLikeNear") public readonly UAPAllLikeNear: UsableActionType;
    @Register.usableActionTypePlaceholder("StackTypeSelfNear") public readonly UAPTypeSelfNear: UsableActionType;
    @Register.usableActionTypePlaceholder("StackTypeMainNear") public readonly UAPTypeMainNear: UsableActionType;
    @Register.usableActionTypePlaceholder("StackTypeHereNear") public readonly UAPTypeHereNear: UsableActionType;
    @Register.usableActionTypePlaceholder("StackAllNearSelf") public readonly UAPAllNearSelf: UsableActionType;
    @Register.usableActionTypePlaceholder("StackAllNearMain") public readonly UAPAllNearMain: UsableActionType;
    @Register.usableActionTypePlaceholder("StackAllMainSub") public readonly UAPAllMainSub: UsableActionType;
    @Register.usableActionTypePlaceholder("StackAllNearSub") public readonly UAPAllNearSub: UsableActionType;
    @Register.usableActionTypePlaceholder("StackTypeToHere") public readonly UAPTypeToHere: UsableActionType;
    @Register.usableActionTypePlaceholder("StackAllToHere") public readonly UAPAllToHere: UsableActionType;

    // Register the top-level QuickStack submenu.
    // The rest of the actions and menus are registered to this menu when its submenu function is called.
    @Register.usableActions("QSUsableActions", UsableActionSet.ItemMoveMenus, reg => UsableActionsQuickStack.register(reg))
    public readonly QSUsableActions: UsableActionGenerator;

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Binds
    //

    // Global bindings
    @Register.bindable("StackAllSelfNear", IInput.key("Slash", "Shift", "Alt")) public readonly bindableSASeN: Bindable;
    @Register.bindable("StackAllMainNear", IInput.key("Slash", "Shift")) public readonly bindableSAMN: Bindable;
    @Register.bindable("StackAllNearSelf", IInput.key("Slash", "Ctrl", "Alt")) public readonly bindableSANSe: Bindable;
    @Register.bindable("StackAllNearMain", IInput.key("Slash", "Ctrl")) public readonly bindableSANM: Bindable;

    @Bind.onDown(Registry<QuickStack>().get("bindableSASeN")) public SASeNBind(): boolean { return !execSASeN(localPlayer); }
    @Bind.onDown(Registry<QuickStack>().get("bindableSAMN")) public SAMNBind(): boolean { return !execSAMN(localPlayer); }
    @Bind.onDown(Registry<QuickStack>().get("bindableSANSe")) public SANSeBind(): boolean { return !execSANSe(localPlayer); }
    @Bind.onDown(Registry<QuickStack>().get("bindableSANM")) public SANMBind(): boolean { return !execSANM(localPlayer); }

    // Submenu bindings
    @Register.bindable("All", IInput.key("KeyA")) public readonly bindableAll: Bindable; // for actions on all types
    @Register.bindable("Type", IInput.key("KeyT")) public readonly bindableType: Bindable; // for actions on specific type
    @Register.bindable("Self", IInput.key("KeyF")) public readonly bindableSelf: Bindable; // for actions to/from full inventory
    @Register.bindable("Main", IInput.key("KeyM")) public readonly bindableMain: Bindable; // for actions to/from top-level inventory
    @Register.bindable("Sub", IInput.key("KeyC")) public readonly bindableSub: Bindable; // for actions to/from subcontainer
    @Register.bindable("Like", IInput.key("KeyC", "Shift")) public readonly bindableLike: Bindable; // for actions to/from similar subcontainer
    @Register.bindable("Here", IInput.key("KeyH")) public readonly bindableHere: Bindable; // for actions to/from selected item's location
    @Register.bindable("Near", IInput.key("KeyN")) public readonly bindableNear: Bindable; // for actions to/from nearby

    //////////////////////////////////////////////////////////////////////////////////////////////
    // Events for storage cache maintenance
    //

    private haveCache: boolean = false;
    private _localStorageCache: LocalStorageCache; // initialized in onLoad
    public get localStorageCache() { return this._localStorageCache; }

    @EventHandler(EventBus.LocalPlayer, "moveComplete")
    protected localPlayerMoved(): void {
        if(!this.haveCache) return;
        QuickStack.MaybeLog?.info(`\n\t\tEVENT TRIGGERED -- localPlayer.moveComplete\n`);
        this._localStorageCache.setOutdated("nearby");
    }
    @EventHandler(EventBus.LocalPlayer, "inventoryItemAdd")
    protected localPlayerItemAdd(): void {
        if(!this.haveCache) return;
        QuickStack.MaybeLog?.info(`\n\t\tEVENT TRIGGERED -- localPlayer.inventoryItemAdd\n`);
        this._localStorageCache.setOutdated("player");
    }
    @EventHandler(EventBus.LocalPlayer, "inventoryItemRemove")
    protected localPlayerItemRemove(): void {
        if(!this.haveCache) return;
        QuickStack.MaybeLog?.info(`\n\t\tEVENT TRIGGERED -- localPlayer.inventoryItemRemove\n`);
        this._localStorageCache.setOutdated("player");
    }
    @EventHandler(EventBus.LocalPlayer, "inventoryItemUpdate")
    protected localPlayerItemUpdate(): void {
        if(!this.haveCache) return;
        QuickStack.MaybeLog?.info(`\n\t\tEVENT TRIGGERED -- localPlayer.inventoryItemUpdate\n`);
        this._localStorageCache.setOutdated("player");
    }

    @EventHandler(EventBus.LocalPlayer, "idChanged")
    protected localPlayerIDChanged(host: Player, curID: number, newID: number, absent: boolean): any { 
        if(!this.haveCache) return;
        this._localStorageCache.playerNoUpdate.updateHash();
    }

    @EventHandler(EventBus.LocalIsland, "tileUpdate")
    protected islandTileUpdated(_host: Island, _tile: ITile, x: number, y: number, z: number, updtype: TileUpdateType): void {
        if(!this.haveCache) return;
        QuickStack.MaybeLog?.info(`\n\t\tEVENT TRIGGERED -- localIsland.tileUpdate\n\t${[x, y, z].toString()} type '${TileUpdateType[updtype]}'\n`);
        if(!isOnOrAdjacent(this._localStorageCache.playerNoUpdate.entity.getPoint(), new Vector3(x, y, z))) return;
        switch(updtype) {
            case TileUpdateType.Batch:
            case TileUpdateType.DoodadChangeType:
            case TileUpdateType.DoodadCreate:
            case TileUpdateType.DoodadRemove:
            case TileUpdateType.DoodadOverHidden:
            case TileUpdateType.Item:
            case TileUpdateType.ItemDrop:
                this._localStorageCache.setOutdated("nearby");
            default:
                return;
        }
    }

    @EventHandler(EventBus.ItemManager, "containerItemAdd")
    protected itemsContainerItemAdd(host: ItemManager, _item: Item, c: IContainer): void {
        if(!this.haveCache) return;
        QuickStack.MaybeLog?.info(`\n\t\tEVENT TRIGGERED -- ItemManager.containerItemAdd\n\t'${_item.getName()}' to '${c ? host.hashContainer(c) : "undefined"}'\n`);
        this.containerUpdated(host, c, undefined);
    }

    @EventHandler(EventBus.ItemManager, "containerItemRemove")
    protected itemsContainerItemRemove(host: ItemManager, _item: Item, c: IContainer | undefined, cpos: IVector3 | undefined): void {
        if(!this.haveCache) return;
        QuickStack.MaybeLog?.info(`\n\t\tEVENT TRIGGERED -- ItemManager.containerItemRemove\n\t'${_item.getName()}' from '${c ? host.hashContainer(c) : "undefined"}'\n`);
        this.containerUpdated(host, c, cpos);
    }

    @EventHandler(EventBus.LocalPlayer, "loadedOnIsland", Priority.High)
    protected initCache() {
        this._localStorageCache = new LocalStorageCache(localPlayer);
        this.haveCache = true;
    }

    // Shouldn't need to track this if we're accounting for both Add and Remove events already..
    // @EventHandler(EventBus.ItemManager, "containerItemUpdate")
    // protected itemsContainerItemUpdate(host: ItemManager, item: Item, cFrom: IContainer | undefined, cFpos: IVector3 | undefined, c: IContainer): void {
    //     QuickStack.LOG.info(`containerItemUpdate\nITEM ${item.getName()}\nFROM ${cFrom}\nAT   ${cFpos}\nTO   ${c}`);
    // }

    protected containerUpdated(items: ItemManager, container: IContainer | undefined, cpos: IVector3 | undefined) {
        const topLevel: (c: IContainer) => IContainer = (c) => (c.containedWithin === undefined) ? c : topLevel(c.containedWithin);
        const findIVecValid: (c: IContainer) => IContainer | undefined = (c) =>
            ('x' in c && 'y' in c && 'z' in c) ? c : (c.containedWithin !== undefined) ? findIVecValid(c.containedWithin) : undefined;

        if(container !== undefined) {
            const topLevel: (c: IContainer) => IContainer = (c) => (c.containedWithin === undefined) ? c : topLevel(c.containedWithin);
            if(items.hashContainer(topLevel(container)) === this._localStorageCache.playerNoUpdate.cHash) {
                // this._localStorageCache.setOutdated("player"); // Handled in localPlayer events.
                return;
            }
            container = findIVecValid(container);
            cpos = container as unknown as IVector3;
            // if(Doodad.is(container) || items.isTileContainer(top))
            //     cpos = (container as IVector3);
        }
        if(cpos !== undefined) {
            if(isOnOrAdjacent(cpos, this._localStorageCache.playerNoUpdate.entity.getPoint())) {
                const found = container ? this._localStorageCache.findNearby(items.hashContainer(container)) : undefined;

                if(!!found) {
                    QuickStack.MaybeLog?.info(`QuickStack.containerUpdated: Updated container '${found.cHash}' identified in cache. Flagging.`);
                    if(this._localStorageCache.setOutdatedSpecific(found.cHash, true)) return;
                    else QuickStack.MaybeLog?.info(`QuickStack.containerUpdated: Specific flagging failed...`);

                }
                QuickStack.MaybeLog?.info(`QuickStack.containerUpdated: Updated container not found in cache. Flagging 'nearby'.`);
                this._localStorageCache.setOutdated("nearby");
            }
            return;
        }
        QuickStack.LOG.warn(`QuickStack.containerUpdated\nUnhandled case for container '${container}' at ${cpos}`);
    }


    public override onInitialize(): void {
        this["subscribedHandlers"] = true;
        this.refreshMatchGroupsArray();
    }
    public override onLoad(): void {
        console.log("ON LOAD");
        if(!steamworks.isDedicatedServer()) {
            this["subscribedHandlers"] = false;
            this.registerEventHandlers("unload");
        }
    }
    public override onUnload(): void {
        this.haveCache = false;
    }


    //////////////////////////////////////////////////////////////////////////////////////////////
    // Global data, helper data, and refresh methods
    //
    @Mod.globalData<QuickStack>("Quick Stack") public globalData: IQSGlobalData;

    public override initializeGlobalData(data?: IQSGlobalData): IQSGlobalData {
        const retData: IQSGlobalData = { // Blank slate, fully initialized, to be updated according to data where present.
            optionTopDown: false,
            optionForbidTiles: false,
            optionKeepContainers: false,
            activeMatchGroups: (Object.keys(QSMatchableGroups) as QSMatchableGroupKey[])
                .reduce((out, KEY) => ({ ...out, [`${KEY}`]: false }), {} as { [k in QSMatchableGroupKey]: boolean })
        };
        if(data !== undefined) {
            QSToggleOptionKeys.forEach(KEY => { if(data[KEY] !== undefined) retData[KEY] = data[KEY]; });
            (Object.keys(QSMatchableGroups) as QSMatchableGroupKey[]).forEach(KEY => {
                if(data.activeMatchGroups?.[KEY] !== undefined) retData.activeMatchGroups[KEY] = data.activeMatchGroups[KEY];
            });
        }
        return retData;
    }

    /**
     * For each active match group, _activeMatchGroupsFlattened[<that group's key>] will contain an exhaustive list of ItemTypes belonging to that group.
     * @type {(QSMatchableGroupsFlatType)}
     * @type {{ [k in QSMatchableGroupKey]?: ItemType[] }}
     */
    private _activeMatchGroupsFlattened: QSMatchableGroupsFlatType;
    public get activeMatchGroupsFlattened(): QSMatchableGroupsFlatType { return this._activeMatchGroupsFlattened; }

    /**
     * An array of the keys for each each active match group
     * @type {QSMatchableGroupKey[]}
     */
    private _activeMatchGroupsKeys: QSMatchableGroupKey[];
    public get activeMatchGroupsKeys(): QSMatchableGroupKey[] { return this._activeMatchGroupsKeys; }

    private _anyMatchgroupsActive: boolean = false;
    public get anyMatchgroupsActive(): boolean { return this._anyMatchgroupsActive; }

    public refreshMatchGroupsArray() {
        this._activeMatchGroupsKeys = [];
        this._activeMatchGroupsFlattened = {};
        this._anyMatchgroupsActive = false;
        (Object.keys(QSMatchableGroups) as QSMatchableGroupKey[]).forEach(KEY => {
            if(this.globalData.activeMatchGroups[KEY]) {
                this._anyMatchgroupsActive = true;
                this._activeMatchGroupsKeys.push(KEY);
                this._activeMatchGroupsFlattened[KEY] = [...
                    QSMatchableGroups[KEY].flatMap(matchable =>
                        matchable in ItemTypeGroup
                            ? [...ItemManager.getGroupItems(matchable as ItemTypeGroup)]
                            : matchable as ItemType
                    )];
            }
        });
        if(GLOBALCONFIG.log_info) {
            QuickStack.LOG.info(`Updated match groups.`);
            console.log(this._activeMatchGroupsKeys);
            console.log(this._activeMatchGroupsFlattened);
        }

        if(this.haveCache) this._localStorageCache.setOutdated();
    }

    // Option section
    @Register.optionsSection
    public constructOptionsSection(section: Component) {
        // Construct buttons for each of the toggleable options
        QSToggleOptionKeys.forEach(KEY => {
            const descKey = `${KEY}_desc` as const;
            new CheckButton()
                .setTooltip(!(descKey in QSTranslation) ? undefined : ttip => ttip
                    .setLocation(TooltipLocation.CenterRight)
                    .setText(this.TLGetMain(descKey as keyof typeof QSTranslation)
                        .withSegments(listSegment)))
                .setText(this.TLGetMain(KEY))
                .setRefreshMethod(() => !!(this.globalData[KEY] ?? false))
                .event.subscribe("toggle", (_, checked) => { this.globalData[KEY] = checked; })
                .appendTo(section);
        });

        // "Match Similar"
        new Details()
            .setSummary(btn => btn
                .setText(this.TLGetMain("optionMatchSimilar"))
                .setTooltip(ttip => ttip
                    .setLocation(TooltipLocation.CenterRight)
                    .setText(this.TLGetMain("optionMatchSimilar_desc"))))
            .setBlock(true)
            .append([...
                (Object.keys(QSMatchableGroups) as QSMatchableGroupKey[]).map(KEY => new CheckButton()
                    .setText(this.TLGetGroup(KEY))
                    .setTooltip(ttip => ttip
                        .setLocation(TooltipLocation.Mouse)
                        .addBlock(ttblock => ttblock
                            .setTitle(t => t.setText(this.TLGetGroup("MatchGroupIncludes")))
                            .append([...QSMatchableGroups[KEY]
                                .map(matchable => new Component<HTMLParagraphElement>()
                                    .setStyle("padding-left", "5ch")
                                    .setStyle("text-indent", "-5ch")
                                    .append(new Text()
                                        .setText((matchable in ItemType ? this.TLGetGroup("ItemTypeX") : this.TLGetGroup("ItemGroupX"))
                                            .addArgs(ItemManager.getItemTypeGroupName(matchable, false, 1)))))
                            ])
                        ))
                    .setRefreshMethod(() => !!this.globalData.activeMatchGroups[KEY])
                    .event.subscribe("toggle", (_, checked) => {
                        this.globalData.activeMatchGroups[KEY] = checked;
                        this.refreshMatchGroupsArray();
                    })
                )])
            .appendTo(section);
    }
}

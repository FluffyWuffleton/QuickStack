import TranslationImpl from "language/impl/TranslationImpl";
import Translation from "language/Translation";
import Mod from "mod/Mod";
import Log from "utilities/Log";
import { QSGroupsTranslation, QSGroupsTranslationKey } from "./QSMatchGroups";
import QuickStack, { QSTLUtilies, QSTLUtilitiesKey, QSTranslation, QSTranslationKey } from "./QuickStack";

export { GLOBALCONFIG, QSTranslation } from "./QuickStack";


export function TLMain(id: QSTranslationKey): TranslationImpl { return Translation.get(QuickStack.INSTANCE.dictMain, QSTranslation[id]); }
export function TLGroup(id: QSGroupsTranslationKey): TranslationImpl { return Translation.get(QuickStack.INSTANCE.dictGroups, QSGroupsTranslation[id]); }
export function TLUtil(id: QSTLUtilitiesKey): TranslationImpl { return Translation.get(QuickStack.INSTANCE.dictUtil, QSTLUtilies[id]); }

export default class StaticHelper {
    @Mod.instance<QuickStack>("Quick Stack")
    public static readonly QS_INSTANCE: QuickStack;

    public static get MaybeLog(): Log { return QuickStack.MaybeLog; }
    public static get QSLSC() { return StaticHelper.QS_INSTANCE.localStorageCache; }
}
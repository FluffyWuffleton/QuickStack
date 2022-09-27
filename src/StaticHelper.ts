import TranslationImpl from "language/impl/TranslationImpl";
import Translation from "language/Translation";
import Mod from "mod/Mod";
import Log from "utilities/Log";
import { QSGroupsTranslation, QSGroupsTranslationKey } from "./QSMatchGroups";
import QuickStack, { QSTranslation, QSTranslationKey } from "./QuickStack";

export { GLOBALCONFIG, QSTranslation } from "./QuickStack";



export default class StaticHelper {
    @Mod.instance<QuickStack>("Quick Stack")
    public static readonly QS_INSTANCE: QuickStack;

    public static get MaybeLog(): Log { return QuickStack.MaybeLog; }
    public static get QSLSC() { return StaticHelper.QS_INSTANCE.localStorageCache; }

    public static TLMain(id: QSTranslationKey): Translation { return Translation.get(QuickStack.INSTANCE.dictMain, QSTranslation[id]); }
    public static TLGroup(id: QSGroupsTranslationKey): Translation { return Translation.get(QuickStack.INSTANCE.dictGroups, QSGroupsTranslation[id]); }

    public static TLFromTo(
        to: (keyof Pick<typeof QSTranslation, "here" | "nearby" | "fullInventory" | "mainInventory">) | TranslationImpl,
        from: (keyof Pick<typeof QSTranslation, "here" | "nearby" | "fullInventory" | "mainInventory">) | TranslationImpl
    ): Translation {
        return this.TLMain("concat").addArgs(
            this.TLMain("fromX").addArgs(typeof (from) === "string" ? this.TLMain(from) : from),
            this.TLMain("toX").addArgs(typeof (to) === "string" ? this.TLMain(to) : to));
    }
}
import TranslationImpl from "language/impl/TranslationImpl";
import Translation from "language/Translation";
import Mod from "mod/Mod";
import Log from "utilities/Log";
import QuickStack, { QSTranslation } from "./QuickStack";

export { GLOBALCONFIG, QSTranslation, QSMatchableGroupKey, QSMatchableGroups } from "./QuickStack";

export default class StaticHelper {
    @Mod.instance<QuickStack>("Quick Stack")
    public static readonly QS_INSTANCE: QuickStack;
    @Mod.log("Quick Stack")
    public static readonly QS_LOG: Log;

    public static QSdict() { return QuickStack.INSTANCE.dictionary; }
    public static TLget(id: keyof typeof QSTranslation): Translation { return Translation.get(QuickStack.INSTANCE.dictionary, QSTranslation[id]); }
    public static TLFromTo(
        to: (keyof Pick<typeof QSTranslation, "here" | "nearby" | "fullInventory" | "mainInventory">) | TranslationImpl,
        from: (keyof Pick<typeof QSTranslation, "here" | "nearby" | "fullInventory" | "mainInventory">) | TranslationImpl
    ): Translation {
        return this.TLget("concat").addArgs(
            this.TLget("fromX").addArgs(typeof (from) === "string" ? this.TLget(from) : from),
            this.TLget("toX").addArgs(typeof (to) === "string" ? this.TLget(to) : to));
    }
}
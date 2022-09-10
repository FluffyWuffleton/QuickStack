import TranslationImpl from "language/impl/TranslationImpl";
import Translation from "language/Translation";
import Log from "utilities/Log";
import QuickStack, { QSTranslation } from "./QuickStack";
export { GLOBALCONFIG, QSTranslation, QSMatchableGroupKey, QSMatchableGroups } from "./QuickStack";
export default class StaticHelper {
    static readonly QS_INSTANCE: QuickStack;
    static readonly QS_LOG: Log;
    static QSdict(): import("language/Dictionary").default;
    static TLget(id: keyof typeof QSTranslation): Translation;
    static TLFromTo(to: (keyof Pick<typeof QSTranslation, "here" | "nearby" | "fullInventory" | "mainInventory">) | TranslationImpl, from: (keyof Pick<typeof QSTranslation, "here" | "nearby" | "fullInventory" | "mainInventory">) | TranslationImpl): Translation;
}

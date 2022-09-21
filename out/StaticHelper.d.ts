import TranslationImpl from "language/impl/TranslationImpl";
import Translation from "language/Translation";
import Log from "utilities/Log";
import { QSGroupsTranslationKey } from "./QSMatchGroups";
import QuickStack, { QSTranslation, QSTranslationKey } from "./QuickStack";
export { GLOBALCONFIG, QSTranslation } from "./QuickStack";
export default class StaticHelper {
    static readonly QS_INSTANCE: QuickStack;
    static readonly QS_LOG: Log;
    static get MaybeLog(): Log | undefined;
    static get QSLSC(): import("./LocalStorageCache").LocalStorageCache;
    static TLMain(id: QSTranslationKey): Translation;
    static TLGroup(id: QSGroupsTranslationKey): Translation;
    static TLFromTo(to: (keyof Pick<typeof QSTranslation, "here" | "nearby" | "fullInventory" | "mainInventory">) | TranslationImpl, from: (keyof Pick<typeof QSTranslation, "here" | "nearby" | "fullInventory" | "mainInventory">) | TranslationImpl): Translation;
}

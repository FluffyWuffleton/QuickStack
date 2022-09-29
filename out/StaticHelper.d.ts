import TranslationImpl from "language/impl/TranslationImpl";
import Log from "utilities/Log";
import { QSGroupsTranslationKey } from "./QSMatchGroups";
import QuickStack, { QSTLUtilitiesKey, QSTranslationKey } from "./QuickStack";
export { GLOBALCONFIG, QSTranslation } from "./QuickStack";
export declare function TLMain(id: QSTranslationKey): TranslationImpl;
export declare function TLGroup(id: QSGroupsTranslationKey): TranslationImpl;
export declare function TLUtil(id: QSTLUtilitiesKey): TranslationImpl;
export default class StaticHelper {
    static readonly QS_INSTANCE: QuickStack;
    static get MaybeLog(): Log;
    static get QSLSC(): import("./LocalStorageCache").LocalStorageCache;
}

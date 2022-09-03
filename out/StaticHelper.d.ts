import Log from "utilities/Log";
import QuickStack from "./QuickStack";
export declare type QS_KEYTYPE = keyof QuickStack;
export default class StaticHelper {
    static readonly QS_INSTANCE: QuickStack;
    static readonly QS_LOG: Log;
}

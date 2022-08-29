import Mod from "mod/Mod";
import Log from "utilities/Log";
import QuickStack from "./QuickStack";

export default class StaticHelper {
    @Mod.instance<QuickStack>("Quick Stack")
    public static readonly QS_INSTANCE: QuickStack;
    @Mod.log("Quick Stack")
    public static readonly QS_LOG: Log;
};
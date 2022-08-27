import Mod from "mod/Mod";
import Log from "utilities/Log";
import QuickStack from "./QuickStack";

export default class QSStaticHelper {
    @Mod.instance<QuickStack>("Quick Stack")
    public static readonly INSTANCE: QuickStack;
    @Mod.log("Quick Stack")
    public static readonly LOG: Log;
};
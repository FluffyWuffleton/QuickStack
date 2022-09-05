import Translation from "language/Translation";
import Mod from "mod/Mod";
import Log from "utilities/Log";
import QuickStack, {QSTranslation} from "./QuickStack";

export {QSTranslation} from "./QuickStack";

export default class StaticHelper {
    @Mod.instance<QuickStack>("Quick Stack")
    public static readonly QS_INSTANCE: QuickStack;
    @Mod.log("Quick Stack")
    public static readonly QS_LOG: Log;

    public static QSdict() { return QuickStack.INSTANCE.dictionary; }
    public static TLget(id: keyof typeof QSTranslation):Translation { return Translation.get(QuickStack.INSTANCE.dictionary, QSTranslation[id]); }
}

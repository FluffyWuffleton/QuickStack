var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "language/Translation", "mod/Mod", "./QSMatchGroups", "./QuickStack", "./QuickStack"], function (require, exports, Translation_1, Mod_1, QSMatchGroups_1, QuickStack_1, QuickStack_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.QSTranslation = exports.GLOBALCONFIG = void 0;
    Object.defineProperty(exports, "GLOBALCONFIG", { enumerable: true, get: function () { return QuickStack_2.GLOBALCONFIG; } });
    Object.defineProperty(exports, "QSTranslation", { enumerable: true, get: function () { return QuickStack_2.QSTranslation; } });
    class StaticHelper {
        static get MaybeLog() { return QuickStack_1.GLOBALCONFIG.log_info ? this.QS_LOG : undefined; }
        static get QSLSC() { return StaticHelper.QS_INSTANCE.localStorageCache; }
        static TLMain(id) { return Translation_1.default.get(QuickStack_1.default.INSTANCE.dictMain, QuickStack_1.QSTranslation[id]); }
        static TLGroup(id) { return Translation_1.default.get(QuickStack_1.default.INSTANCE.dictGroups, QSMatchGroups_1.QSGroupsTranslation[id]); }
        static TLFromTo(to, from) {
            return this.TLMain("concat").addArgs(this.TLMain("fromX").addArgs(typeof (from) === "string" ? this.TLMain(from) : from), this.TLMain("toX").addArgs(typeof (to) === "string" ? this.TLMain(to) : to));
        }
    }
    __decorate([
        Mod_1.default.instance("Quick Stack")
    ], StaticHelper, "QS_INSTANCE", void 0);
    __decorate([
        Mod_1.default.log("Quick Stack")
    ], StaticHelper, "QS_LOG", void 0);
    exports.default = StaticHelper;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhdGljSGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1N0YXRpY0hlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBT1MsMEdBQUEsWUFBWSxPQUFBO0lBQUUsMkdBQUEsYUFBYSxPQUFBO0lBRXBDLE1BQXFCLFlBQVk7UUFNdEIsTUFBTSxLQUFLLFFBQVEsS0FBc0IsT0FBTyx5QkFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUVsRyxNQUFNLEtBQUssS0FBSyxLQUFLLE9BQU8sWUFBWSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7UUFFekUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFvQixJQUFpQixPQUFPLHFCQUFXLENBQUMsR0FBRyxDQUFDLG9CQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSwwQkFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdILE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBMEIsSUFBaUIsT0FBTyxxQkFBVyxDQUFDLEdBQUcsQ0FBQyxvQkFBVSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsbUNBQW1CLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFNUksTUFBTSxDQUFDLFFBQVEsQ0FDbEIsRUFBK0csRUFDL0csSUFBaUg7WUFFakgsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FDaEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQ25GLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDckYsQ0FBQztLQUNKO0lBbkJHO1FBREMsYUFBRyxDQUFDLFFBQVEsQ0FBYSxhQUFhLENBQUM7MkNBQ087SUFFL0M7UUFEQyxhQUFHLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQztzQ0FDWTtJQUp2QywrQkFxQkMifQ==
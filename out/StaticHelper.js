var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "language/Translation", "mod/Mod", "./QSMatchGroups", "./QuickStack", "./QuickStack"], function (require, exports, Translation_1, Mod_1, QSMatchGroups_1, QuickStack_1, QuickStack_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TLUtil = exports.TLGroup = exports.TLMain = exports.QSTranslation = exports.GLOBALCONFIG = void 0;
    Object.defineProperty(exports, "GLOBALCONFIG", { enumerable: true, get: function () { return QuickStack_2.GLOBALCONFIG; } });
    Object.defineProperty(exports, "QSTranslation", { enumerable: true, get: function () { return QuickStack_2.QSTranslation; } });
    function TLMain(id) { return Translation_1.default.get(QuickStack_1.default.INSTANCE.dictMain, QuickStack_1.QSTranslation[id]); }
    exports.TLMain = TLMain;
    function TLGroup(id) { return Translation_1.default.get(QuickStack_1.default.INSTANCE.dictGroups, QSMatchGroups_1.QSGroupsTranslation[id]); }
    exports.TLGroup = TLGroup;
    function TLUtil(id) { return Translation_1.default.get(QuickStack_1.default.INSTANCE.dictUtil, QuickStack_1.QSTLUtilies[id]); }
    exports.TLUtil = TLUtil;
    class StaticHelper {
        static get MaybeLog() { return QuickStack_1.default.MaybeLog; }
        static get QSLSC() { return StaticHelper.QS_INSTANCE.localStorageCache; }
    }
    exports.default = StaticHelper;
    __decorate([
        Mod_1.default.instance("Quick Stack")
    ], StaticHelper, "QS_INSTANCE", void 0);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhdGljSGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1N0YXRpY0hlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBT1MsMEdBQUEsWUFBWSxPQUFBO0lBQUUsMkdBQUEsYUFBYSxPQUFBO0lBR3BDLFNBQWdCLE1BQU0sQ0FBQyxFQUFvQixJQUFxQixPQUFPLHFCQUFXLENBQUMsR0FBRyxDQUFDLG9CQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSwwQkFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQTFJLHdCQUEwSTtJQUMxSSxTQUFnQixPQUFPLENBQUMsRUFBMEIsSUFBcUIsT0FBTyxxQkFBVyxDQUFDLEdBQUcsQ0FBQyxvQkFBVSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsbUNBQW1CLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFBekosMEJBQXlKO0lBQ3pKLFNBQWdCLE1BQU0sQ0FBQyxFQUFvQixJQUFxQixPQUFPLHFCQUFXLENBQUMsR0FBRyxDQUFDLG9CQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSx3QkFBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQXhJLHdCQUF3STtJQUV4SSxNQUFxQixZQUFZO1FBSXRCLE1BQU0sS0FBSyxRQUFRLEtBQVUsT0FBTyxvQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDMUQsTUFBTSxLQUFLLEtBQUssS0FBSyxPQUFPLFlBQVksQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO0tBQ25GO0lBTkQsK0JBTUM7SUFKMEI7UUFEdEIsYUFBRyxDQUFDLFFBQVEsQ0FBYSxhQUFhLENBQUM7MkNBQ08ifQ==
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "language/Translation", "mod/Mod", "./QuickStack", "./QuickStack"], function (require, exports, Translation_1, Mod_1, QuickStack_1, QuickStack_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.QSMatchableGroups = exports.QSTranslation = exports.GLOBALCONFIG = void 0;
    Object.defineProperty(exports, "GLOBALCONFIG", { enumerable: true, get: function () { return QuickStack_2.GLOBALCONFIG; } });
    Object.defineProperty(exports, "QSTranslation", { enumerable: true, get: function () { return QuickStack_2.QSTranslation; } });
    Object.defineProperty(exports, "QSMatchableGroups", { enumerable: true, get: function () { return QuickStack_2.QSMatchableGroups; } });
    class StaticHelper {
        static QSdict() { return QuickStack_1.default.INSTANCE.dictionary; }
        static TLget(id) { return Translation_1.default.get(QuickStack_1.default.INSTANCE.dictionary, QuickStack_1.QSTranslation[id]); }
    }
    __decorate([
        Mod_1.default.instance("Quick Stack")
    ], StaticHelper, "QS_INSTANCE", void 0);
    __decorate([
        Mod_1.default.log("Quick Stack")
    ], StaticHelper, "QS_LOG", void 0);
    exports.default = StaticHelper;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhdGljSGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1N0YXRpY0hlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBS1EsMEdBQUEsWUFBWSxPQUFBO0lBQUUsMkdBQUEsYUFBYSxPQUFBO0lBQXVCLCtHQUFBLGlCQUFpQixPQUFBO0lBRTNFLE1BQXFCLFlBQVk7UUFNdEIsTUFBTSxDQUFDLE1BQU0sS0FBSyxPQUFPLG9CQUFVLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDMUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUE4QixJQUFnQixPQUFPLHFCQUFXLENBQUMsR0FBRyxDQUFDLG9CQUFVLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSwwQkFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2pKO0lBTkc7UUFEQyxhQUFHLENBQUMsUUFBUSxDQUFhLGFBQWEsQ0FBQzsyQ0FDTztJQUUvQztRQURDLGFBQUcsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDO3NDQUNZO0lBSnZDLCtCQVFDIn0=
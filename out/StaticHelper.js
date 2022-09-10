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
        static TLFromTo(to, from) {
            return this.TLget("concat").addArgs(this.TLget("fromX").addArgs(typeof (from) === "string" ? this.TLget(from) : from), this.TLget("toX").addArgs(typeof (to) === "string" ? this.TLget(to) : to));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhdGljSGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1N0YXRpY0hlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBTVMsMEdBQUEsWUFBWSxPQUFBO0lBQUUsMkdBQUEsYUFBYSxPQUFBO0lBQXVCLCtHQUFBLGlCQUFpQixPQUFBO0lBRTVFLE1BQXFCLFlBQVk7UUFNdEIsTUFBTSxDQUFDLE1BQU0sS0FBSyxPQUFPLG9CQUFVLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDMUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUE4QixJQUFpQixPQUFPLHFCQUFXLENBQUMsR0FBRyxDQUFDLG9CQUFVLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSwwQkFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hJLE1BQU0sQ0FBQyxRQUFRLENBQ2xCLEVBQStHLEVBQy9HLElBQWlIO1lBRWpILE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQy9CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUNqRixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ25GLENBQUM7S0FDSjtJQWRHO1FBREMsYUFBRyxDQUFDLFFBQVEsQ0FBYSxhQUFhLENBQUM7MkNBQ087SUFFL0M7UUFEQyxhQUFHLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQztzQ0FDWTtJQUp2QywrQkFnQkMifQ==
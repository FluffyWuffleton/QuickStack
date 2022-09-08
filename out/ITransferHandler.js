define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.THTargettingFlag = exports.THState = void 0;
    var THState;
    (function (THState) {
        THState[THState["idle"] = 0] = "idle";
        THState[THState["complete"] = 1] = "complete";
        THState[THState["collision"] = 2] = "collision";
        THState[THState["noTargetFlag"] = 4] = "noTargetFlag";
        THState[THState["executeError"] = 8] = "executeError";
        THState[THState["error"] = 142] = "error";
    })(THState = exports.THState || (exports.THState = {}));
    var THTargettingFlag;
    (function (THTargettingFlag) {
        THTargettingFlag[THTargettingFlag["recursive"] = 1] = "recursive";
        THTargettingFlag[THTargettingFlag["self"] = 2] = "self";
        THTargettingFlag[THTargettingFlag["nearbyDoodads"] = 4] = "nearbyDoodads";
        THTargettingFlag[THTargettingFlag["nearbyTiles"] = 8] = "nearbyTiles";
        THTargettingFlag[THTargettingFlag["everywhere"] = 14] = "everywhere";
    })(THTargettingFlag = exports.THTargettingFlag || (exports.THTargettingFlag = {}));
    ;
    ;
    ;
    ;
    ;
    ;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSVRyYW5zZmVySGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9JVHJhbnNmZXJIYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFVQSxJQUFZLE9BU1g7SUFURCxXQUFZLE9BQU87UUFDZixxQ0FBaUIsQ0FBQTtRQUNqQiw2Q0FBcUIsQ0FBQTtRQUNyQiwrQ0FBc0IsQ0FBQTtRQUN0QixxREFBeUIsQ0FBQTtRQUN6QixxREFBeUIsQ0FBQTtRQUd6Qix5Q0FBa0IsQ0FBQTtJQUN0QixDQUFDLEVBVFcsT0FBTyxHQUFQLGVBQU8sS0FBUCxlQUFPLFFBU2xCO0lBR0QsSUFBWSxnQkFNWDtJQU5ELFdBQVksZ0JBQWdCO1FBQ3hCLGlFQUFrQixDQUFBO1FBQ2xCLHVEQUFhLENBQUE7UUFDYix5RUFBc0IsQ0FBQTtRQUN0QixxRUFBb0IsQ0FBQTtRQUNwQixvRUFBK0MsQ0FBQTtJQUNuRCxDQUFDLEVBTlcsZ0JBQWdCLEdBQWhCLHdCQUFnQixLQUFoQix3QkFBZ0IsUUFNM0I7SUFHd0UsQ0FBQztJQUNDLENBQUM7SUFDRyxDQUFDO0lBQ3NCLENBQUM7SUFJaEUsQ0FBQztJQUNPLENBQUMifQ==
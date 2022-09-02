define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.THTargettingFlag = exports.THState = exports.TransferCompleteness = void 0;
    var TransferCompleteness;
    (function (TransferCompleteness) {
        TransferCompleteness[TransferCompleteness["none"] = 0] = "none";
        TransferCompleteness[TransferCompleteness["some"] = 1] = "some";
        TransferCompleteness[TransferCompleteness["all"] = 2] = "all";
    })(TransferCompleteness = exports.TransferCompleteness || (exports.TransferCompleteness = {}));
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSVRyYW5zZmVySGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9JVHJhbnNmZXJIYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFFQSxJQUFZLG9CQUlYO0lBSkQsV0FBWSxvQkFBb0I7UUFDNUIsK0RBQVEsQ0FBQTtRQUNSLCtEQUFRLENBQUE7UUFDUiw2REFBTyxDQUFBO0lBQ1gsQ0FBQyxFQUpXLG9CQUFvQixHQUFwQiw0QkFBb0IsS0FBcEIsNEJBQW9CLFFBSS9CO0lBR0QsSUFBWSxPQVNYO0lBVEQsV0FBWSxPQUFPO1FBQ2YscUNBQWlCLENBQUE7UUFDakIsNkNBQXFCLENBQUE7UUFDckIsK0NBQXNCLENBQUE7UUFDdEIscURBQXlCLENBQUE7UUFDekIscURBQXlCLENBQUE7UUFHekIseUNBQWtCLENBQUE7SUFDdEIsQ0FBQyxFQVRXLE9BQU8sR0FBUCxlQUFPLEtBQVAsZUFBTyxRQVNsQjtJQUdELElBQVksZ0JBTVg7SUFORCxXQUFZLGdCQUFnQjtRQUN4QixpRUFBa0IsQ0FBQTtRQUNsQix1REFBYSxDQUFBO1FBQ2IseUVBQXNCLENBQUE7UUFDdEIscUVBQW9CLENBQUE7UUFDcEIsb0VBQStDLENBQUE7SUFDbkQsQ0FBQyxFQU5XLGdCQUFnQixHQUFoQix3QkFBZ0IsS0FBaEIsd0JBQWdCLFFBTTNCO0lBSXdFLENBQUM7SUFDQyxDQUFDO0lBQ0csQ0FBQztJQUNzQixDQUFDIn0=
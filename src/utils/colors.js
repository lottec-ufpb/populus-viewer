"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomColor = exports.UserColor = void 0;
var math_js_1 = require("./math.js");
function generateColor(username) {
    if (UserColor[username])
        return UserColor[username]; // memoize
    var hash = (0, math_js_1.hashString)(username);
    UserColor[username] = hash % 360;
    return UserColor[username];
}
var UserColor = /** @class */ (function () {
    function UserColor(userId) {
        this.hue = generateColor(userId);
        this.light = "hsl(".concat(this.hue, ",100%, 80%)");
        this.solid = "hsl(".concat(this.hue, ",100%, 50%)");
        this.dark = "hsl(".concat(this.hue, ",100%, 20%)");
        this.ultralight = "hsl(".concat(this.hue, ",100%, 95%)");
        this.ultradark = "hsl(".concat(this.hue, ",100%, 10%)");
        this.styleVariables = {
            "--user_ultralight": this.ultralight,
            "--user_light": this.light,
            "--user_solid": this.solid,
            "--user_dark": this.dark,
            "--user_ultradark": this.ultradark
        };
    }
    return UserColor;
}());
exports.UserColor = UserColor;
var RoomColor = /** @class */ (function () {
    function RoomColor(roomId) {
        this.hue = generateColor(roomId);
        this.ultralight = "hsl(".concat(this.hue, ",100%, 95%)");
        this.light = "hsl(".concat(this.hue, ",100%, 80%)");
        this.solid = "hsl(".concat(this.hue, ",100%, 50%)");
        this.dark = "hsl(".concat(this.hue, ",100%, 20%)");
        this.ultradark = "hsl(".concat(this.hue, ",100%, 10%)");
        this.styleVariables = {
            "--room_ultralight": this.ultralight,
            "--room_light": this.light,
            "--room_solid": this.solid,
            "--room_dark": this.dark,
            "--room_ultradark": this.ultradark
        };
    }
    return RoomColor;
}());
exports.RoomColor = RoomColor;

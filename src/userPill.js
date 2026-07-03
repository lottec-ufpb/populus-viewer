"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UserPill;
var preact_1 = require("preact");
var colors_js_1 = require("./utils/colors.js");
require("./styles/memberPill.css");
function UserPill(props) {
    var colorFromId = new colors_js_1.UserColor(props.user.userId || props.user.user_id);
    return <span style={colorFromId.styleVariables} class="member-pill">{props.user.displayName || props.user.display_name}</span>;
}

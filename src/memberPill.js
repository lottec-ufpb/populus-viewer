"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MemberPill;
var preact_1 = require("preact");
var colors_js_1 = require("./utils/colors.js");
require("./styles/memberPill.css");
function MemberPill(props) {
    var colorFromId = new colors_js_1.UserColor(props.member.userId);
    return <span style={colorFromId.styleVariables} class="member-pill">{props.member.name}</span>;
}

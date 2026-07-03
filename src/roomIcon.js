"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomIconPlaceholder = RoomIconPlaceholder;
var client_js_1 = require("./client.js");
var preact_1 = require("preact");
var colors_js_1 = require("./utils/colors.js");
var tooltip_js_1 = require("./utils/tooltip.js");
var Icons = require("./icons.js");
require("./styles/roomIcon.css");
var RoomIcon = /** @class */ (function (_super) {
    __extends(RoomIcon, _super);
    function RoomIcon(props) {
        var _this = _super.call(this, props) || this;
        _this.amJoined = function (_) { var _a; return !!(((_a = client_js_1.default.client.getRoom(_this.props.roomId)) === null || _a === void 0 ? void 0 : _a.getMyMembership()) === "join"); };
        _this.handleRoom = function (e, r) {
            if (e.roomId === _this.props.roomId || (r === null || r === void 0 ? void 0 : r.roomId) === _this.props.roomId) {
                if (e.getType() === "m.room.avatar") {
                    _this.setState({
                        joined: _this.amJoined(),
                        avatarUrl: e.getContent().url
                            ? client_js_1.default.client.mxcUrlToHttp(e.getContent().url, 35, 35, "crop", false, true, true)
                            : null
                    });
                }
                else {
                    clearTimeout(_this.roomDebounceTimeout);
                    _this.roomDebounceTimeout = setTimeout(function (_) {
                        _this.setState({ joined: _this.amJoined() });
                    });
                }
            }
        };
        _this.handleClick = function (_) { return _this.state.joined
            ? (_this.props.activeClick && _this.props.activeClick(_this.props.roomId, _this.props.name))
            : (_this.props.inactiveClick && _this.props.inactiveClick(_this.props.roomId, _this.props.name)); };
        _this.roomColor = new colors_js_1.RoomColor(_this.props.name);
        _this.toolTipContent = "<h3>".concat(_this.props.name, "</h3>").concat(_this.props.topic ? "<p>".concat(_this.props.topic, "</p>") : "").concat(_this.props.numJoinedMembers ? "<span><svg\n      xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24\n      24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"\n      stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather\n      feather-users\"><path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"\n        /><circle cx=\"9\" cy=\"7\" r=\"4\" /><path d=\"M23 21v-2a4 4 0 0 0-3-3.87\"\n        /><path d=\"M16 3.13a4 4 0 0 1 0 7.75\" /></svg>:\n      ".concat(_this.props.numJoinedMembers) : "");
        _this.state = {
            joined: _this.amJoined(),
            loaded: false,
            avatarUrl: props.avatarUrl
                ? client_js_1.default.client.mxcUrlToHttp(props.avatarUrl, 35, 35, "crop", false, true, true)
                : null
        };
        return _this;
    }
    RoomIcon.prototype.componentDidMount = function () {
        client_js_1.default.client.on("Room", this.handleRoom);
        client_js_1.default.client.on("RoomState.events", this.handleRoom);
    };
    RoomIcon.prototype.componentDidUnmount = function () {
        client_js_1.default.client.on("Room", this.handleRoom);
        client_js_1.default.client.on("RoomState.events", this.handleRoom);
    };
    RoomIcon.prototype.render = function (props, state) {
        return <tooltip_js_1.default content={this.toolTipContent} placement="bottom-start" allowHTML={true} theme="info">
        <div onclick={this.handleClick} data-joined={state.joined} data-has-avatar={!!state.avatarUrl} class="room-icon" style={__assign({ cursor: state.joined
                    ? (props.activeClick && "pointer")
                    : (props.inactiveClick && "pointer"), width: props.size, height: props.size, lineHeight: "".concat(props.size, "px") }, this.roomColor.styleVariables)}>
          {state.avatarUrl
                ? <img src={state.avatarUrl} style={{
                        width: props.size,
                        height: props.size
                    }}/>
                : props.name.slice(0, 1)}
        </div>
      </tooltip_js_1.default>;
    };
    return RoomIcon;
}(preact_1.Component));
exports.default = RoomIcon;
function RoomIconPlaceholder(props) {
    return <div class="room-icon" data-joined data-placeholder style={{
            width: props.size,
            height: props.size,
            lineHeight: "".concat(props.size, "px"),
            "--room_light": "var(--low-contrast-background)"
        }}/>;
}

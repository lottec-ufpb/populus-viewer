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
Object.defineProperty(exports, "__esModule", { value: true });
var preact_1 = require("preact");
var client_js_1 = require("./client.js");
var colors_js_1 = require("./utils/colors.js");
var UserInfoHeader = /** @class */ (function (_super) {
    __extends(UserInfoHeader, _super);
    function UserInfoHeader() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = client_js_1.default.client.getUser(_this.props.userId).displayName;
        _this.avatarUrl = client_js_1.default.client.getUser(_this.props.userId).avatarUrl;
        _this.avatarHttpURI = client_js_1.default.client.getHttpUriForMxcFromHS(_this.avatarUrl, 20, 20, "crop");
        _this.userColor = new colors_js_1.UserColor(_this.props.userId);
        _this.theClass = _this.props.isMe
            ? "user-info-message message-from-user"
            : _this.props.isReply
                ? "reply-sender-info"
                : "user-info-message";
        return _this;
    }
    UserInfoHeader.prototype.render = function () {
        return <div class={this.theClass} style={this.userColor.styleVariables}>
        {this.avatarHttpURI ? <img src={this.avatarHttpURI}/> : null}
        <span>{this.displayName}</span>
      </div>;
    };
    return UserInfoHeader;
}(preact_1.Component));
exports.default = UserInfoHeader;

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
require("./styles/toast.css");
var Icons = require("./icons.js");
var Toast = /** @class */ (function (_super) {
    __extends(Toast, _super);
    function Toast(props) {
        var _this = _super.call(this, props) || this;
        _this.hideToast = function (_) { return _this.setState({ content: null }); };
        _this.setContent = function (content) { return _this.setState({ content: content }); };
        Toast.hide = _this.hideToast;
        Toast.set = _this.setContent;
        return _this;
    }
    Toast.prototype.render = function (_, state) {
        return state.content
            ? <div id="toast-popup">
        <div id="toast-content">
          <button id="dismiss-toast" onclick={this.hideToast}>
            {Icons.close}
          </button>
          {state.content}
        </div>
      </div>
            : null;
    };
    return Toast;
}(preact_1.Component));
exports.default = Toast;

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
var tippy_js_1 = require("tippy.js");
require("../styles/tooltip.css");
var ToolTip = /** @class */ (function (_super) {
    __extends(ToolTip, _super);
    function ToolTip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ToolTip.prototype.componentDidMount = function () {
        this.tippy = (0, tippy_js_1.default)(this.base, Object.assign({
            delay: [1500, null],
            touch: ["hold", 1000]
        }, this.props));
        this.base.addEventListener("focusout", this.tippy.hide());
        this.base.setAttribute("aria-label", this.props.content);
    };
    ToolTip.prototype.componentWillUnmount = function () {
        this.tippy.destroy();
    };
    ToolTip.prototype.componentDidUpdate = function (prev) {
        if (prev.content !== this.props.content)
            this.tippy.setProps(this.props);
    };
    ToolTip.prototype.show = function () {
        this.tippy.show();
    };
    ToolTip.prototype.hide = function () {
        this.tippy.show();
    };
    ToolTip.prototype.render = function (props) {
        return props.children;
    };
    return ToolTip;
}(preact_1.Component));
exports.default = ToolTip;

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
var Icons = require("../icons");
require("../styles/copyButton.css");
var tooltip_js_1 = require("./tooltip.js");
var CopyButton = /** @class */ (function (_super) {
    __extends(CopyButton, _super);
    function CopyButton(props) {
        var _this = _super.call(this, props) || this;
        _this.tooltip = (0, preact_1.createRef)();
        _this.handleClick = function () {
            navigator.clipboard.writeText(_this.props.copy)
                .then(function (_) {
                _this.setState({ content: "copied!" }, function (_) { return _this.tooltip.current.show(); });
            });
        };
        _this.state = { content: "copy to clipboard" };
        return _this;
    }
    CopyButton.prototype.render = function (props, _a) {
        var content = _a.content;
        return <tooltip_js_1.default ref={this.tooltip} content={content}>
      <button onClick={this.handleClick} type="button" class="copy-button">{Icons.copy}</button>
    </tooltip_js_1.default>;
    };
    return CopyButton;
}(preact_1.Component));
exports.default = CopyButton;

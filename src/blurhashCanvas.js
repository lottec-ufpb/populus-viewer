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
var blurhash_1 = require("blurhash");
var BlurhashCanvas = /** @class */ (function (_super) {
    __extends(BlurhashCanvas, _super);
    function BlurhashCanvas() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.blurhashCanvas = (0, preact_1.createRef)();
        _this.drawBlurhash = function (_) {
            if (!_this.props.height || !_this.props.width)
                return;
            var ctx = _this.blurhashCanvas.current.getContext("2d");
            ctx.clearRect(0, 0, _this.blurhashCanvas.current.wdith, _this.blurhashCanvas.current.height);
            // we draw them small and scale up in CSS, following blurhash developer's advice
            var width = 32;
            var height = Math.round(32 * (_this.props.height / _this.props.width));
            _this.blurhashCanvas.current.width = width;
            _this.blurhashCanvas.current.height = height;
            if (!_this.props.blurhash)
                return;
            var imageData = ctx.createImageData(width, height);
            var pixels = (0, blurhash_1.decode)(_this.props.blurhash, width, height);
            imageData.data.set(pixels);
            ctx.putImageData(imageData, 0, 0);
        };
        return _this;
    }
    BlurhashCanvas.prototype.componentDidMount = function () {
        this.drawBlurhash();
    };
    BlurhashCanvas.prototype.render = function (props) {
        //we allow this to be set without blurhash to fill space
        var canvasWidthFromInfo = props.width && props.height ? {
            "width": "".concat(props.width, "px"),
            "max-width": "calc(min(100% - 20px, ".concat(props.width, "px))")
        } : null;
        return <canvas ref={this.blurhashCanvas} style={canvasWidthFromInfo} class={this.props.class}/>;
    };
    return BlurhashCanvas;
}(preact_1.Component));
exports.default = BlurhashCanvas;

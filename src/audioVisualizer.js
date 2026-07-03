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
var AudioVisualizer = /** @class */ (function (_super) {
    __extends(AudioVisualizer, _super);
    function AudioVisualizer(props) {
        var _this = _super.call(this, props) || this;
        _this.theCanvas = (0, preact_1.createRef)();
        var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        _this.analyser = audioCtx.createAnalyser();
        var source = audioCtx.createMediaStreamSource(props.stream);
        source.connect(_this.analyser);
        _this.analyser.fftSize = 2048;
        _this.bufferLength = _this.analyser.frequencyBinCount;
        _this.dataArray = new Uint8Array(_this.bufferLength);
        _this.draw = _this.draw.bind(_this);
        return _this;
    }
    AudioVisualizer.prototype.componentDidMount = function () {
        this.width = this.theCanvas.current.width;
        this.height = this.theCanvas.current.height;
        this.canvasCtx = this.theCanvas.current.getContext('2d');
        this.canvasCtx.clearRect(0, 0, this.width, this.height);
        this.draw();
    };
    AudioVisualizer.prototype.componentWillUnmount = function () {
        this.paused = true;
    };
    AudioVisualizer.prototype.play = function () {
        this.paused = false;
        this.draw();
    };
    AudioVisualizer.prototype.pause = function () {
        this.paused = true;
    };
    AudioVisualizer.prototype.draw = function () {
        this.analyser.getByteTimeDomainData(this.dataArray);
        this.canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        this.canvasCtx.fillRect(0, 0, this.width, this.height);
        this.canvasCtx.lineWidth = 2;
        this.canvasCtx.strokeStyle = 'rgb(200, 200, 200)';
        this.canvasCtx.beginPath();
        var sliceWidth = this.width * 1.0 / this.bufferLength;
        var x = 0;
        for (var i = 0; i < this.bufferLength; i++) {
            var v = this.dataArray[i] / 128.0;
            var y = v * this.height / 2;
            if (i === 0)
                this.canvasCtx.moveTo(x, y);
            else
                this.canvasCtx.lineTo(x, y);
            x += sliceWidth;
        }
        this.canvasCtx.lineTo(this.width, this.height / 2);
        this.canvasCtx.stroke();
        if (this.paused)
            return;
        requestAnimationFrame(this.draw);
    };
    AudioVisualizer.prototype.render = function (props) {
        return <canvas class={"audioVisualizer ".concat(props.class)} onclick={props.onclick} height={props.height} width={props.width} ref={this.theCanvas}/>;
    };
    return AudioVisualizer;
}(preact_1.Component));
exports.default = AudioVisualizer;

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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var preact_1 = require("preact");
var temporal_js_1 = require("./utils/temporal.js");
var Icons = require("./icons.js");
var audioVisualizer_js_1 = require("./audioVisualizer.js");
require("./styles/locationPreview.css");
var LocationPreview = /** @class */ (function (_super) {
    __extends(LocationPreview, _super);
    function LocationPreview(props) {
        var _this = _super.call(this, props) || this;
        _this.mediaElement = (0, preact_1.createRef)();
        _this.canvasElement = (0, preact_1.createRef)();
        _this.secondaryAudio = (0, preact_1.createRef)();
        _this.handleMediaClick = function (_) {
            var _a, _b;
            if (_this.mediaElement.current.paused) {
                _this.mediaElement.current.currentTime = _this.props.location.getIntervalStart() / 1000;
                _this.mediaElement.current.play();
                if (_this.canvasElement.current)
                    _this.projectToCanvas();
                (_a = _this.secondaryAudio.current) === null || _a === void 0 ? void 0 : _a.play();
            }
            else {
                _this.mediaElement.current.pause();
                (_b = _this.secondaryAudio.current) === null || _b === void 0 ? void 0 : _b.pause();
            }
        };
        _this.mediaRect = _this.props.location.getMediaRect();
        _this.handleLoadedMetadata = function (_) {
            if (!_this.mediaRect) {
                var theWidth = _this.mediaElement.current.videoWidth || _this.mediaElement.current.width;
                var theHeight = _this.mediaElement.current.videoHeight || _this.mediaElement.current.height;
                _this.canvasElement.current.width = theWidth;
                _this.canvasElement.current.height = theHeight;
                _this.mediaRect = new DOMRect(0, 0, theWidth, theHeight);
            }
        };
        _this.handleLoadedData = function (_) {
            var _a, _b;
            var stream = ((_b = (_a = _this.mediaElement.current).mozCaptureStream) === null || _b === void 0 ? void 0 : _b.call(_a)) || _this.mediaElement.current.captureStream();
            _this.setState({ stream: stream });
        };
        _this.refreshCanvas = function (_) {
            var ctx = _this.canvasElement.current.getContext('2d', { alpha: false });
            ctx.drawImage(_this.mediaElement.current, _this.mediaRect.x, _this.mediaRect.y, _this.mediaRect.width, _this.mediaRect.height, 0, 0, _this.mediaRect.width, _this.mediaRect.height);
        };
        _this.projectToCanvas = function (_) {
            _this.refreshCanvas();
            if (_this.mediaElement.current.paused)
                return;
            requestAnimationFrame(_this.projectToCanvas);
        };
        _this.handleTimeUpdate = function (_) {
            var _a, _b;
            if (((_a = _this.mediaElement.current) === null || _a === void 0 ? void 0 : _a.currentTime) > (_this.props.location.getIntervalEnd() / 1000)) {
                _this.mediaElement.current.pause();
                (_b = _this.secondaryAudio.current) === null || _b === void 0 ? void 0 : _b.pause();
            }
        };
        _this.initializeUrl = function (_) { return __awaiter(_this, void 0, void 0, function () {
            var mediaSrc;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.props.resource.hasFetched];
                    case 1:
                        mediaSrc = _a.sent();
                        this.setState({ mediaSrc: mediaSrc }, function (_) {
                            var _a, _b;
                            if ((_b = (_a = _this.props.resource) === null || _a === void 0 ? void 0 : _a.mimetype) === null || _b === void 0 ? void 0 : _b.match(/^video|^audio/)) {
                                var location_1 = _this.props.location.getIntervalStart();
                                if (location_1 !== 0) {
                                    _this.mediaElement.current.currentTime = location_1 / 1000;
                                }
                                else {
                                    _this.mediaElement.current.currentTime = 1;
                                    //we build in a millisecond seek to make sure the seeked event is triggered
                                }
                            }
                        });
                        return [2 /*return*/];
                }
            });
        }); };
        return _this;
    }
    LocationPreview.prototype.componentDidMount = function () {
        if (this.props.location.getType() === "media-fragment" && this.props.resource) {
            this.initializeUrl();
        }
    };
    LocationPreview.prototype.componentWillUnmount = function () {
        var _a, _b, _c, _d;
        (_b = (_a = this.mediaElement.current) === null || _a === void 0 ? void 0 : _a.pause) === null || _b === void 0 ? void 0 : _b.call(_a);
        (_d = (_c = this.secondaryAudio.current) === null || _c === void 0 ? void 0 : _c.pause) === null || _d === void 0 ? void 0 : _d.call(_c);
    };
    LocationPreview.prototype.render = function (props, state) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        if (props.location.getType() === "highlight") {
            return <div class="preview-quote">
          <span>{Icons.quote}</span>
          {props.location.getText()}
        </div>;
        }
        else if (props.location.getType() === "text") {
            return <div class="preview-pin">
          {Icons.pin} <span>on page {props.location.getPageIndex()}</span>
        </div>;
        }
        else if (props.location.getType() === "media-fragment") {
            return <div class="preview-media-fragment">
          {props.showPosition && ((_b = (_a = props.resource) === null || _a === void 0 ? void 0 : _a.mimetype) === null || _b === void 0 ? void 0 : _b.match(/^image/))
                    ? <div class="preview-media-fragment-position">{Icons.image}
              <span>Image selection at {this.mediaRect.x},{this.mediaRect.y}</span>
            </div>
                    : props.showPosition
                        ? <div class="preview-media-fragment-position">{Icons.headphones}
              <span>From {(0, temporal_js_1.toClockTime)(props.location.getIntervalStart() / 1000)} to {(0, temporal_js_1.toClockTime)(props.location.getIntervalEnd() / 1000)}</span>
            </div>
                        : null}
          {((_d = (_c = props.resource) === null || _c === void 0 ? void 0 : _c.mimetype) === null || _d === void 0 ? void 0 : _d.match(/^audio/))
                    ? <div class="preview-media-fragment-audio">
              <audio src={state.mediaSrc} ref={this.mediaElement} onloadeddata={this.handleLoadedData} ontimeupdate={this.handleTimeUpdate}/>
              {state.stream
                            ? <preact_1.Fragment>
                  {//workaround for firefox bug: https://bugzilla-dev.allizom.org/show_bug.cgi?id=1178751
                                this.mediaElement.current.mozCaptureStream ? <audio ref={this.secondaryAudio} srcObject={state.stream}/> : null}
                  <audioVisualizer_js_1.default onclick={this.handleMediaClick} height={100} width={500} stream={state.stream}/> 
                </preact_1.Fragment>
                            : null}
            </div>
                    : ((_f = (_e = props.resource) === null || _e === void 0 ? void 0 : _e.mimetype) === null || _f === void 0 ? void 0 : _f.match(/^video/))
                        ? <div class="preview-media-fragment-video">
              <video src={state.mediaSrc} ref={this.mediaElement} onloadedmetadata={this.handleLoadedMetadata} onseeked={this.refreshCanvas} ontimeupdate={this.handleTimeUpdate}/>
              <canvas width={(_g = this.mediaRect) === null || _g === void 0 ? void 0 : _g.width} height={(_h = this.mediaRect) === null || _h === void 0 ? void 0 : _h.height} onclick={this.handleMediaClick} ref={this.canvasElement}/>
            </div>
                        : ((_k = (_j = props.resource) === null || _j === void 0 ? void 0 : _j.mimetype) === null || _k === void 0 ? void 0 : _k.match(/^image/))
                            ? <div class="preview-media-fragment-image">
              <img src={state.mediaSrc} ref={this.mediaElement} onload={this.refreshCanvas}/>
              <canvas width={(_l = this.mediaRect) === null || _l === void 0 ? void 0 : _l.width} height={(_m = this.mediaRect) === null || _m === void 0 ? void 0 : _m.height} ref={this.canvasElement}/>
            </div>
                            : null}
        </div>;
        }
    };
    return LocationPreview;
}(preact_1.Component));
exports.default = LocationPreview;

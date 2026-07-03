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
var resource_js_1 = require("./utils/resource.js");
var location_js_1 = require("./utils/location.js");
var client_js_1 = require("./client.js");
var Matrix = require("matrix-js-sdk");
var alerts_js_1 = require("./utils/alerts.js");
require("./styles/imageContent.css");
var constants_js_1 = require("./constants.js");
var ImageContent = /** @class */ (function (_super) {
    __extends(ImageContent, _super);
    function ImageContent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.drawImage = function (imageUrl) {
            var theImage = new Image();
            theImage.src = imageUrl;
            theImage.onload = function (_) {
                _this.props.setContentDimensions(theImage.height, theImage.width);
                var widthRatio = _this.props.contentContainer.current.offsetWidth / theImage.width;
                if (widthRatio < 1)
                    _this.props.setZoom(function (_) { return widthRatio; });
                _this.setState({ imageUrl: imageUrl });
            };
        };
        _this.createSelection = function (e) {
            if (_this.longPressTimeout)
                return;
            var initialOffsetX = e.offsetX;
            var initialOffsetY = e.offsetY;
            // Firefox doesn't keep the offsets of the pointer event around, for some
            // reason, so we store them here.
            _this.longPressTimeout = setTimeout(function (_) {
                _this.setState({
                    selection: new ImageAnnotation({
                        x: Math.round(initialOffsetX),
                        y: Math.round(initialOffsetY),
                        h: 100,
                        w: 100,
                        imageWidth: _this.props.contentWidthPx,
                        imageHeight: _this.props.contentHeightPx,
                    })
                }, function (_) { return document.dispatchEvent(new Event("selectionchange")); });
            }, 500);
        };
        _this.handlePointerCancel = function (_) {
            clearTimeout(_this.longPressTimeout);
            delete _this.longPressTimeout;
        };
        _this.clearSelection = function (_) {
            _this.setState({
                selection: null
            }, function (_) { return document.dispatchEvent(new Event("selectionchange")); });
            // XXX If the clear is the result of a two-finger zoom gesture, this
            // prevents the second finger from triggering a new selection
            _this.longPressTimeout = setTimeout(function (_) { });
        };
        _this.generateLocation = function (_) {
            var _a;
            return _a = {},
                _a[constants_js_1.mscMediaFragment] = {
                    x: _this.state.selection.x,
                    y: _this.state.selection.y,
                    w: _this.state.selection.w,
                    h: _this.state.selection.h
                },
                _a[constants_js_1.populusHighlight] = {
                    activityStatus: "pending",
                    creator: client_js_1.default.client.getUserId()
                },
                _a;
        };
        _this.zoomMax = 10;
        _this.commitRegion = function (_) {
            var _a, _b;
            if (!(0, alerts_js_1.onlineOrAlert)())
                return;
            var theDomain = client_js_1.default.client.getDomain();
            var theRoomState = _this.props.room.getLiveTimeline().getState(Matrix.EventTimeline.FORWARDS);
            var theLevels = theRoomState.getStateEvents(Matrix.EventType.RoomPowerLevels, "");
            var locationData = _this.generateLocation();
            return client_js_1.default.client.createRoom({
                visibility: "private",
                name: "selected region at ".concat(_this.state.selection.x, ",").concat(_this.state.selection.y),
                power_level_content_override: {
                    users: Object.assign({}, theLevels.getContent().users, (_a = {},
                        _a[client_js_1.default.client.getUserId()] = 100,
                        _a))
                },
                initial_state: [{
                        type: Matrix.EventType.RoomJoinRules,
                        state_key: "",
                        content: { join_rule: "public" }
                    },
                    {
                        type: Matrix.EventType.SpaceParent, // we indicate that the current room is the parent
                        content: (_b = { via: [theDomain] }, _b[constants_js_1.mscLocation] = locationData, _b),
                        state_key: _this.props.room.roomId
                    }
                ]
            }).then(function (roominfo) {
                var _a;
                // set child event in pdfRoom State
                _this.clearSelection();
                var childContent = (_a = { via: [theDomain] }, _a[constants_js_1.mscLocation] = locationData, _a);
                // We focus on a new fake placeholder event to potentially insert the highlight immediately
                var fakeEvent = new Matrix.MatrixEvent({
                    type: Matrix.EventType.SpaceChild,
                    origin_server_ts: new Date().getTime(),
                    room_id: _this.props.room.roomId,
                    sender: client_js_1.default.client.getUserId(),
                    state_key: roominfo.room_id,
                    content: childContent
                });
                client_js_1.default.client.sendStateEvent(_this.props.room.roomId, Matrix.EventType.SpaceChild, childContent, roominfo.room_id);
                _this.props.setFocus(new location_js_1.default(fakeEvent));
                _this.props.showChat();
            });
        };
        return _this;
    }
    ImageContent.prototype.componentDidMount = function () {
        this.fetchImage();
    };
    ImageContent.prototype.fetchImage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var theImage;
            var _this = this;
            return __generator(this, function (_a) {
                theImage = new resource_js_1.default(this.props.room);
                if (!ImageContent.ImageStore[theImage.url]) {
                    ImageContent.ImageStore[theImage.url] = window.fetch(theImage.httpUrl)
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var theClone, contentLength, reader, accumulator, _a, done, value, blob;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    theClone = response.clone();
                                    contentLength = +response.headers.get('Content-Length');
                                    reader = response.body.getReader();
                                    accumulator = 0;
                                    _b.label = 1;
                                case 1:
                                    if (!true) return [3 /*break*/, 3];
                                    return [4 /*yield*/, reader.read()];
                                case 2:
                                    _a = _b.sent(), done = _a.done, value = _a.value;
                                    if (done) {
                                        return [3 /*break*/, 3];
                                    }
                                    accumulator = accumulator + value.length;
                                    this.props.setImageLoadingStatus(accumulator / contentLength);
                                    return [3 /*break*/, 1];
                                case 3: return [4 /*yield*/, theClone.blob()];
                                case 4:
                                    blob = _b.sent();
                                    return [2 /*return*/, URL.createObjectURL(blob)];
                            }
                        });
                    }); })
                        .catch(this.catchFetchImageError);
                }
                else {
                    console.log("found file for ".concat(this.props.room.name, " in store"));
                }
                ImageContent.ImageStore[theImage.url].then(function (url) { return _this.props.resource.resolveFetch(url); });
                ImageContent.ImageStore[theImage.url].then(this.drawImage);
                return [2 /*return*/];
            });
        });
    };
    ImageContent.prototype.hasSelection = function () { return !!this.state.selection; };
    Object.defineProperty(ImageContent.prototype, "zoomMin", {
        get: function () {
            if (!this.props.contentWidthPx)
                return 0;
            return Math.min(1, this.props.contentContainer.current.offsetWidth / this.props.contentWidthPx, this.props.contentContainer.current.offsetHeight / this.props.contentHeightPx);
        },
        enumerable: false,
        configurable: true
    });
    ImageContent.prototype.getAnnotations = function () {
        var _this = this;
        return this.props.filteredAnnotationContents.map(function (loc) {
            var _a;
            return new ImageAnnotation({
                location: loc,
                // we pass in focus so that it will be recalculated with renders
                focused: loc.getChild() === ((_a = _this.props.focus) === null || _a === void 0 ? void 0 : _a.getChild()),
                imageWidth: _this.props.contentWidthPx,
                imageHeight: _this.props.contentHeightPx,
                setFocus: _this.props.setFocus
            });
        });
    };
    ImageContent.prototype.render = function (props, state) {
        if (!props.contentWidthPx)
            return;
        return <div id="image-view-wrapper">
      <div data-image-selecting={!!state.selection} id="image-view">
        <img src={state.imageUrl}/>
        <ImageOverlay focus={props.focus} handlePointerCancel={this.handlePointerCancel} handlePointerDown={state.selection ? this.clearSelection : this.createSelection} contentWidthPx={props.contentWidthPx} contentHeightPx={props.contentHeightPx}>{this.state.selection
                ? this.state.selection
                : this.getAnnotations()}
        </ImageOverlay>
      </div>
    </div>;
    };
    ImageContent.ImageStore = {};
    return ImageContent;
}(preact_1.Component));
exports.default = ImageContent;
// XXX We don't use a component here since this should control two different
// <rect>s that need to appear in different places
var ImageAnnotation = /** @class */ (function () {
    function ImageAnnotation(_a) {
        var x = _a.x, y = _a.y, h = _a.h, w = _a.w, location = _a.location, focused = _a.focused, setFocus = _a.setFocus, imageHeight = _a.imageHeight, imageWidth = _a.imageWidth;
        var _this = this;
        this.focusAnnotation = function (e) {
            e.stopPropagation(); //prevent a secondary seek
            _this.setFocus(_this.location);
        };
        this.startDrag = function (e) {
            e.stopPropagation();
            if (_this.initialPointer)
                return;
            _this.initialX = _this.x;
            _this.initialY = _this.y;
            _this.initialOffsetX = e.offsetX;
            _this.initialOffsetY = e.offsetY;
            _this.initialPointer = e.pointerId;
            _this.rectRef.current.setPointerCapture(e.pointerId);
            _this.rectRef.current.addEventListener('pointermove', _this.handleDrag);
            _this.rectRef.current.addEventListener('pointerup', function (e) {
                var _a, _b;
                if (e.pointerId !== _this.initialPointer)
                    return;
                delete _this.initialX;
                delete _this.initialY;
                delete _this.initialPointer;
                delete _this.initialOffsetX;
                delete _this.initialOffsetY;
                (_a = _this.rectRef.current) === null || _a === void 0 ? void 0 : _a.releasePointerCapture(e.pointerId);
                (_b = _this.rectRef.current) === null || _b === void 0 ? void 0 : _b.removeEventListener('pointermove', _this.handleDrag);
            });
        };
        this.handleDrag = function (e) {
            e.preventDefault();
            if (e.pointerId !== _this.initialPointer)
                return;
            _this.x = Math.round(Math.min(Math.max(0, _this.initialX + (e.offsetX - _this.initialOffsetX)), _this.imageWidth - _this.w));
            _this.y = Math.round(Math.min(Math.max(0, _this.initialY + (e.offsetY - _this.initialOffsetY)), _this.imageHeight - _this.h));
            requestAnimationFrame(_this.updateSizes);
        };
        this.updateSizes = function (_) {
            _this.rectRef.current.setAttribute("x", _this.x);
            _this.rectRef.current.setAttribute("y", _this.y);
            _this.rectRef.current.setAttribute("width", _this.w - 20);
            _this.rectRef.current.setAttribute("height", _this.h - 20);
            _this.maskRef.current.setAttribute("x", _this.x);
            _this.maskRef.current.setAttribute("y", _this.y);
            _this.maskRef.current.setAttribute("width", _this.w);
            _this.maskRef.current.setAttribute("height", _this.h);
            _this.rectResizeWRef.current.setAttribute("y", _this.y);
            _this.rectResizeWRef.current.setAttribute("x", _this.x + _this.w - 20);
            _this.rectResizeWRef.current.setAttribute("height", _this.h - 20);
            _this.rectResizeHRef.current.setAttribute("x", _this.x);
            _this.rectResizeHRef.current.setAttribute("width", _this.w);
            _this.rectResizeHRef.current.setAttribute("y", _this.y + _this.h - 20);
        };
        this.startResizeW = function (e) {
            e.stopPropagation();
            if (_this.initialPointer)
                return;
            _this.rectResizeWRef.current.setPointerCapture(e.pointerId);
            _this.initialWidth = _this.w;
            _this.initialOffsetX = e.offsetX;
            _this.initialPointer = e.pointerId;
            _this.rectResizeWRef.current.addEventListener('pointermove', _this.handleResizeW);
            _this.rectResizeWRef.current.addEventListener('pointerup', function (e) {
                var _a, _b;
                if (e.pointerId !== _this.initialPointer)
                    return;
                delete _this.initialPointer;
                delete _this.initialWidth;
                delete _this.initialOffsetX;
                (_a = _this.rectResizeWRef.current) === null || _a === void 0 ? void 0 : _a.releasePointerCapture(e.pointerId);
                (_b = _this.rectResizeWRef.current) === null || _b === void 0 ? void 0 : _b.removeEventListener('pointermove', _this.handleResizeW);
            });
        };
        this.startResizeH = function (e) {
            e.stopPropagation();
            if (_this.initialPointer)
                return;
            _this.rectResizeHRef.current.setPointerCapture(e.pointerId);
            _this.initialHeight = _this.h;
            _this.initialOffsetY = e.offsetY;
            _this.initialPointer = e.pointerId;
            _this.rectResizeHRef.current.addEventListener('pointermove', _this.handleResizeH);
            _this.rectResizeHRef.current.addEventListener('pointerup', function (_) {
                var _a, _b;
                if (e.pointerId !== _this.initialPointer)
                    return;
                delete _this.initialHeight;
                delete _this.initialOffsetY;
                delete _this.initialPointer;
                (_a = _this.rectResizeHRef.current) === null || _a === void 0 ? void 0 : _a.releasePointerCapture(e.pointerId);
                (_b = _this.rectResizeHRef.current) === null || _b === void 0 ? void 0 : _b.removeEventListener('pointermove', _this.handleResizeH);
            });
        };
        this.handleResizeW = function (e) {
            e.preventDefault();
            if (e.pointerId !== _this.initialPointer)
                return;
            //the 40px minimum here accomodates the handles
            _this.w = Math.round(Math.min(_this.imageWidth - _this.x, Math.max(40, _this.initialWidth + (e.offsetX - _this.initialOffsetX))));
            _this.updateSizes();
        };
        this.handleResizeH = function (e) {
            e.preventDefault();
            if (e.pointerId !== _this.initialPointer)
                return;
            //the 40px minimum here accomodates the handles
            _this.h = Math.round(Math.min(_this.imageHeight - _this.y, Math.max(40, _this.initialHeight + (e.offsetY - _this.initialOffsetY))));
            _this.updateSizes();
        };
        var rect = location === null || location === void 0 ? void 0 : location.getMediaRect();
        this.x = (rect === null || rect === void 0 ? void 0 : rect.x) || x;
        this.y = (rect === null || rect === void 0 ? void 0 : rect.y) || y;
        this.h = (rect === null || rect === void 0 ? void 0 : rect.height) || h;
        this.w = (rect === null || rect === void 0 ? void 0 : rect.width) || w;
        this.location = location;
        this.imageHeight = imageHeight;
        this.selection = !location;
        this.setFocus = setFocus;
        this.imageWidth = imageWidth;
        this.focused = focused;
        this.maskRef = (0, preact_1.createRef)();
        this.rectRef = (0, preact_1.createRef)();
        this.rectResizeHRef = (0, preact_1.createRef)();
        this.rectResizeWRef = (0, preact_1.createRef)();
        this.key = Date.now();
    }
    return ImageAnnotation;
}());
var ImageOverlay = /** @class */ (function (_super) {
    __extends(ImageOverlay, _super);
    function ImageOverlay() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getMasks = function (_) { var _a; return (_a = _this.props.children) === null || _a === void 0 ? void 0 : _a.map(_this.toMask); };
        _this.toMask = function (child) { return <rect key={child.key} ref={child.maskRef} x={child.x} y={child.y} width={child.w} height={child.h}/>; };
        _this.getRects = function (_) { var _a; return (_a = _this.props.children) === null || _a === void 0 ? void 0 : _a.map(_this.toRect); };
        _this.toRect = function (child) {
            if (child.focused)
                _this.focusedRect = child.rectRef;
            return <rect key={child.key + 1} ref={child.rectRef} mask="url(#mask)" onpointerdown={child.focusAnnotation} class="image-annotation-rect" x={child.x} y={child.y} width={child.w} height={child.h} data-annotation-focused={child.focused}/>;
        };
        _this.toSelection = function (child) { return <preact_1.Fragment>
    <rect key={child.key + 2} ref={child.rectRef} mask="url(#mask)" class="image-annotation-rect-drag" x={child.x} y={child.y} onpointerdown={child.startDrag} width={child.w - 20} height={child.h - 20}/>
    <rect key={child.key + 3} ref={child.rectResizeWRef} mask="url(#mask)" class="image-annotation-rect-resize-w" x={child.x + child.w - 20} y={child.y} onpointerdown={child.startResizeW} width={20} height={child.h - 20}/>
    <rect key={child.key + 4} ref={child.rectResizeHRef} mask="url(#mask)" class="image-annotation-rect-resize-h" x={child.x} y={child.y + child.h - 20} onpointerdown={child.startResizeH} width={child.w} height={20}/>
  </preact_1.Fragment>; };
        return _this;
    }
    ImageOverlay.prototype.componentDidUpdate = function (prevProps) {
        var _a, _b, _c, _d;
        if (((_a = prevProps.focus) === null || _a === void 0 ? void 0 : _a.getChild()) !== ((_b = this.props.focus) === null || _b === void 0 ? void 0 : _b.getChild())) {
            (_d = (_c = this.focusedRect) === null || _c === void 0 ? void 0 : _c.current) === null || _d === void 0 ? void 0 : _d.scrollIntoView({ block: "center", inline: "center" });
        }
    };
    ImageOverlay.prototype.render = function (props, state) {
        var _a, _b;
        var outerPath = "M0 0 h".concat(props.contentWidthPx, " v").concat(props.contentHeightPx, " h-").concat(props.contentWidthPx, "z");
        return <svg onPointerCancel={props.handlePointerCancel} onPointerUp={props.handlePointerCancel} onPointerDown={props.handlePointerDown} id="image-overlay">
      <defs>
        <mask id="mask">
          <path fill="white" d={outerPath}/>
          {((_a = props.children) === null || _a === void 0 ? void 0 : _a.selection)
                ? this.toMask(props.children)
                : this.getMasks()}
        </mask>
      </defs>
      <path mask="url(#mask)" fill="black" d={outerPath}/>
      {((_b = props.children) === null || _b === void 0 ? void 0 : _b.selection)
                ? this.toSelection(props.children)
                : this.getRects()}
    </svg>;
    };
    return ImageOverlay;
}(preact_1.Component));

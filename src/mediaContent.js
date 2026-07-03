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
var toast_js_1 = require("./toast.js");
var history_js_1 = require("./history.js");
var wavesurfer_js_1 = require("wavesurfer.js");
var client_js_1 = require("./client.js");
var math_js_1 = require("./utils/math.js");
var Matrix = require("matrix-js-sdk");
var colors_js_1 = require("./utils/colors.js");
var alerts_js_1 = require("./utils/alerts.js");
var regions_1 = require("wavesurfer.js/src/plugin/regions/");
require("./styles/mediaContent.css");
var constants_js_1 = require("./constants.js");
var MediaContent = /** @class */ (function (_super) {
    __extends(MediaContent, _super);
    function MediaContent(props) {
        var _this = _super.call(this, props) || this;
        _this.mediaView = (0, preact_1.createRef)();
        _this.videoElement = (0, preact_1.createRef)();
        _this.videoOverlay = (0, preact_1.createRef)();
        _this.video = (0, preact_1.createRef)();
        _this.createSelection = function (start, end) {
            var userId = client_js_1.default.client.getUserId();
            var color = new colors_js_1.UserColor(userId).solid;
            _this.clearSelection();
            _this.pause();
            var selection = _this.wavesurfer.addRegion({
                start: start,
                end: end,
                color: color,
                drag: false,
                id: "active-selection"
            });
            _this.setState({ selection: selection }, function (_) { return document.dispatchEvent(new Event("selectionchange")); });
        };
        _this.clearSelection = function (_) {
            var _a;
            if (_this.state.selection) {
                _this.state.selection.remove();
                (_a = _this.video.current) === null || _a === void 0 ? void 0 : _a.clearOverlayPosition();
                _this.setState({ selection: null }, function (_) { return document.dispatchEvent(new Event("selectionchange")); });
            }
        };
        _this.generateLocation = function (_) {
            var _a;
            return _a = {},
                _a[constants_js_1.mscMediaFragment] = __assign({ start: Math.floor(_this.state.selection.start * 1000), end: Math.ceil(_this.state.selection.end * 1000) }, (_this.videoOverlay.current
                    ? {
                        x: _this.videoOverlay.current.spotlightX,
                        y: _this.videoOverlay.current.spotlightY,
                        w: _this.videoOverlay.current.spotlightWidth,
                        h: _this.videoOverlay.current.spotlightHeight,
                    }
                    : null)),
                _a[constants_js_1.populusHighlight] = {
                    activityStatus: "pending",
                    creator: client_js_1.default.client.getUserId()
                },
                _a;
        };
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
                name: "highlighted interval from ".concat(_this.state.selection.start, " to ").concat(_this.state.selection.end),
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
        _this.handlePointerdown = function (e) {
            var _a;
            if (e.target.tagName === "WAVE") {
                clearTimeout(_this.longPressTimeout);
                var percentAcross_1 = (e.clientX + e.target.scrollLeft) / e.target.scrollWidth;
                _this.longPressTimeout = setTimeout(function (_) {
                    _this.wavesurfer.seekTo(percentAcross_1);
                    _this.createSelection(percentAcross_1 * _this.wavesurfer.getDuration(), percentAcross_1 * _this.wavesurfer.getDuration() + 5);
                }, 500);
            }
            else if (["REGION", "HANDLE"].includes(e.target.tagName))
                return;
            else {
                if (e.noClear || ((_a = _this.video.current) === null || _a === void 0 ? void 0 : _a.base.contains(e.target)))
                    return;
                clearTimeout(_this.longPressTimeout);
                _this.clearSelection();
            }
        };
        _this.getCurrentLocations = function (_) {
            var currentSec = _this.wavesurfer.getCurrentTime();
            return _this.props.filteredAnnotationContents
                .filter(function (loc) {
                if (currentSec < (loc.getIntervalStart() / 1000))
                    return false;
                if (currentSec > (loc.getIntervalEnd() / 1000))
                    return false;
                return _this.filterAnnotations(loc);
            });
        };
        _this.cancelPointer = function (_) { return clearTimeout(_this.longPressTimeout); };
        _this.waveform = (0, preact_1.createRef)();
        _this.play = function (_) {
            if (_this.state.selection) {
                _this.state.selection.play();
            }
            else {
                _this.wavesurfer.seekAndCenter(_this.wavesurfer.getCurrentTime() / _this.wavesurfer.getDuration());
                //this gets a little dicy, just because you want all the repositioning to
                //be done *before* there's any risk of scroll events unsetting the autoCenter
                _this.lastLeft = _this.wavesurfer.drawer.wrapper.scrollLeft;
                _this.wavesurfer.drawer.params.autoCenter = true;
                _this.wavesurfer.play();
            }
        };
        _this.pause = function (_) { return _this.wavesurfer.pause(); };
        _this.playPause = function (_) {
            if (_this.wavesurfer.isPlaying())
                _this.pause();
            else
                _this.play();
        };
        _this.scrubRight = function (_) {
            clearTimeout(_this.inertiaTimeout);
            _this.wavesurfer.skip(1 * _this.rightInertia * (1 / _this.zoomFactor));
            _this.leftInertia = 1;
            _this.rightInertia += .1;
            _this.inertiaTimeout = setTimeout(_this.resetInertia, 500);
        };
        _this.scrubLeft = function (_) {
            clearTimeout(_this.inertiaTimeout);
            _this.wavesurfer.skip(-1 * _this.leftInertia * (1 / _this.zoomFactor));
            _this.rightInertia = 1;
            _this.leftInertia += .1;
            _this.inertiaTimeout = setTimeout(_this.resetInertia, 500);
        };
        _this.resetInertia = function (_) {
            _this.leftInertia = 1;
            _this.rightInertia = 1;
        };
        _this.selRight = function (e) {
            e.preventDefault();
            if (_this.state.selection) {
                clearTimeout(_this.inertiaTimeout);
                if (e.shiftKey) {
                    _this.state.selection.onResize(.2 * _this.rightInertia * (1 / _this.zoomFactor), "start");
                    _this.wavesurfer.seekAndCenter(_this.state.selection.start / _this.wavesurfer.getDuration());
                }
                else {
                    _this.state.selection.onResize(.2 * _this.rightInertia * (1 / _this.zoomFactor));
                    _this.wavesurfer.seekAndCenter(_this.state.selection.end / _this.wavesurfer.getDuration());
                }
                _this.leftInertia = 1;
                _this.rightInertia += .1;
                _this.inertiaTimeout = setTimeout(_this.resetInertia, 500);
            }
            else
                _this.scrubRight();
        };
        _this.selLeft = function (e) {
            e.preventDefault();
            if (_this.state.selection) {
                clearTimeout(_this.inertiaTimeout);
                if (e.shiftKey) {
                    _this.state.selection.onResize(-.2 * _this.leftInertia * (1 / _this.zoomFactor), "start");
                    _this.wavesurfer.seekAndCenter(_this.state.selection.start / _this.wavesurfer.getDuration());
                }
                else {
                    _this.state.selection.onResize(-.2 * _this.leftInertia * (1 / _this.zoomFactor));
                    _this.wavesurfer.seekAndCenter(_this.state.selection.end / _this.wavesurfer.getDuration());
                }
                _this.rightInertia = 1;
                _this.leftInertia += .1;
                _this.inertiaTimeout = setTimeout(_this.resetInertia, 500);
            }
            else
                _this.scrubLeft();
        };
        _this.centerLocation = function (loc) {
            _this.wavesurfer.seekAndCenter(loc.getIntervalStart() / (_this.wavesurfer.getDuration() * 1000));
        };
        _this.setZoom = function (n) {
            _this.zoomFactor = Math.max(1, Math.min(n, 200));
            _this.wavesurfer.zoom(15 * _this.zoomFactor);
        };
        _this.handleBadTimeStamp = function (_) {
            var newTS = Math.floor(_this.props.timeStamp < 0 ? 0 : _this.wavesurfer.getDuration());
            history_js_1.default.replace("/".concat(encodeURIComponent(_this.props.resourceAlias)) +
                "/".concat(newTS) +
                "".concat(_this.props.roomFocused ? "/".concat(_this.props.roomFocused) : "") +
                "".concat(_this.props.eventFocused ? "/".concat(_this.props.eventFocused) : ""));
        };
        _this.stampMatchesFocus = function (_) {
            return _this.props.timeStamp == Math.floor(_this.props.focus.getIntervalStart() / 1000);
        };
        _this.catchFetchMediaError = function (e) {
            toast_js_1.default.set(<preact_1.Fragment>
      <h3 id="toast-header">Couldn't fetch the {_this.isVideo ? "audio file" : "video"}...</h3>
      <div>Tried to fetch: </div>
      <pre>{_this.props.resourceAlias}</pre>
      <div>Here's the error message:</div>
      <pre>{e.message}</pre>
    </preact_1.Fragment>);
            history_js_1.default.push('/');
            _this.errorCondition = true;
        };
        _this.drawMedia = function (pcm) { return function (mediaUrl) { return __awaiter(_this, void 0, void 0, function () {
            var prng, i;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.props.setMediaLoadingStatus("Rendering waveform...");
                        this.wavesurfer = new wavesurfer_js_1.default.create({
                            container: '#waveform',
                            backend: 'MediaElement',
                            barWidth: 5,
                            scrollParent: true,
                            plugins: [regions_1.default.create()],
                        });
                        if (!!pcm) return [3 /*break*/, 1];
                        pcm = [];
                        prng = (0, math_js_1.mulberry32)((0, math_js_1.hashString)(this.props.resourceAlias));
                        for (i = 0; i < 2048; i++)
                            pcm.push((prng() * 2) - 1);
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, pcm];
                    case 2:
                        pcm = _a.sent();
                        _a.label = 3;
                    case 3:
                        if (this.isVideo)
                            this.videoElement.current.src = mediaUrl;
                        this.wavesurfer.load(this.videoElement.current || mediaUrl, pcm);
                        this.wavesurfer.on('ready', function (_) {
                            _this.wavesurfer.zoom(15);
                            _this.props.setMediaLoadingStatus(null);
                            var width = document.body.clientWidth;
                            var height = document.body.clientHeight;
                            var duration = Math.ceil(_this.wavesurfer.getDuration());
                            _this.props.setMediaDuration(duration);
                            if ("timeStamp" in _this.props) {
                                if (_this.props.timeStamp < 0 || _this.props.timeStamp > duration)
                                    _this.handleBadTimeStamp();
                                else if (_this.props.focus && _this.stampMatchesFocus())
                                    _this.centerLocation(_this.props.focus);
                                else
                                    _this.wavesurfer.seekAndCenter(_this.props.timeStamp / duration);
                            }
                            _this.props.setContentDimensions(height, width);
                            _this.setState({ ready: true });
                        });
                        this.wavesurfer.on('seek', function (_) {
                            if (_this.state.ready) {
                                clearTimeout(_this.seekTimeout);
                                _this.seekTimeout = setTimeout(function (_) {
                                    var _a, _b;
                                    var timeSec = Math.floor(_this.wavesurfer.getCurrentTime());
                                    if (timeSec !== _this.props.timeStamp)
                                        history_js_1.default.push("/".concat(encodeURIComponent(_this.props.resourceAlias)) +
                                            "/".concat(timeSec) +
                                            "".concat(_this.props.roomFocused ? "/".concat(_this.props.roomFocused) : "") +
                                            "".concat(_this.props.eventFocused ? "/".concat(_this.props.eventFocused) : ""));
                                    if (_this.hasSelection) {
                                        var currentSec = _this.wavesurfer.getCurrentTime();
                                        if (currentSec < ((_a = _this.state.selection) === null || _a === void 0 ? void 0 : _a.start) - .01)
                                            _this.clearSelection();
                                        if (currentSec > ((_b = _this.state.selection) === null || _b === void 0 ? void 0 : _b.end) + .01)
                                            _this.clearSelection();
                                    }
                                }, 250);
                            }
                            _this.updateSavedLocation();
                            _this.updateVideoLocation();
                        });
                        this.wavesurfer.on('scroll', function (e) {
                            if (Math.abs(_this.lastLeft - e.target.scrollLeft) > 25) {
                                _this.wavesurfer.drawer.params.autoCenter = false;
                                _this.cancelPointer();
                            }
                            else {
                                _this.lastLeft = e.target.scrollLeft;
                            }
                        });
                        this.wavesurfer.on("audioprocess", function (_) {
                            _this.updateSavedLocation();
                            !_this.updateVideoLocationLocked && _this.updateVideoLocation();
                        });
                        return [2 /*return*/];
                }
            });
        }); }; };
        _this.filterAnnotations = function (loc) { return loc.getType() === "media-fragment"; };
        _this.setVideo = function (videoLocation) { return _this.setState({ videoLocation: videoLocation }); };
        _this.updateSavedLocation = function (_) {
            // we only save if you've stopped zipping around for more than a second
            clearTimeout(_this.saveLocationTimeout);
            _this.saveLocationTimeout = setTimeout(function (_) {
                client_js_1.default.client.setRoomAccountData(_this.props.room.roomId, constants_js_1.lastViewed, {
                    deviceId: client_js_1.default.deviceId,
                    position: _this.props.timeStamp
                });
            }, 1500);
        };
        _this.updateVideoLocation = function (_) {
            var locations = _this.getCurrentLocations();
            if (locations.length == 0)
                _this.setVideo(null);
            else {
                locations.sort(function (a, b) {
                    if (a.getIntervalStart() > b.getIntervalStart())
                        return -1;
                    if (a.getIntervalStart() < b.getIntervalStart())
                        return 1;
                    return 0;
                });
                _this.setVideo(locations[0]);
            }
            _this.updateVideoLocationLocked = true;
            //tiny debouncer in case this gets expensive with lots of highlights
            setTimeout(function (_) { return _this.updateVideoLocationLocked = false; }, 250);
        };
        _this.hasFetched = new Promise(function (resolve, reject) {
            _this.resolveFetch = resolve;
            _this.rejectFetch = reject;
        });
        // inertia for keyboard selection
        _this.isVideo = props.mimetype.match(/^video/);
        _this.rightInertia = 1;
        _this.leftInertia = 1;
        _this.zoomFactor = 1;
        return _this;
    }
    // we expose this method so that we can unformly sanatize position-strings
    // before passing them to components that expect timestamps
    MediaContent.positionToTimestamp = function (pos, room) {
        var _a;
        var tryLastPosition = (_a = room === null || room === void 0 ? void 0 : room.getAccountData(constants_js_1.lastViewed)) === null || _a === void 0 ? void 0 : _a.getContent().position;
        var tryParse = parseInt(pos, 10);
        return Number.isInteger(tryParse)
            ? tryParse
            // need isInteger because 0 is falsey
            : Number.isInteger(tryLastPosition)
                ? tryLastPosition
                : 0;
    };
    MediaContent.prototype.componentDidMount = function () {
        this.fetchMedia();
    };
    MediaContent.prototype.componentWillUnmount = function () {
        clearTimeout(this.inertiaTimeout);
        clearTimeout(this.longPressTimeout);
        clearTimeout(this.saveLocationTimeout);
        if (this.wavesurfer)
            this.wavesurfer.destroy();
    };
    MediaContent.prototype.componentDidUpdate = function (prev) {
        var _a, _b, _c, _d;
        if (this.state.ready) {
            var duration = this.wavesurfer.getDuration();
            var timeSec = this.wavesurfer.getCurrentTime();
            if (this.props.focus && ((_a = this.props.focus) === null || _a === void 0 ? void 0 : _a.getChild()) !== ((_b = prev.focus) === null || _b === void 0 ? void 0 : _b.getChild())) {
                // focusing new annotation: jump to that 
                if (this.stampMatchesFocus())
                    this.centerLocation(this.props.focus);
                // if the timestamp is the same as the one we get from the focus, we center the beginning of the focus on the nose
                else if (this.props.timeStamp < 0 || this.props.timeStamp > duration)
                    this.handleBadTimeStamp();
                // if the timestamp is invalid, we handle it
                else
                    this.wavesurfer.seekAndCenter(this.props.timeStamp / duration);
                // otherwise we center based on the timestamp
            }
            else if ("timeStamp" in this.props &&
                Math.abs(this.props.timeStamp - prev.timeStamp) > 2 && //timestamp changed signifiantly, and
                Math.abs(this.props.timeStamp - timeSec) > 2 //we're not already at the location
            ) {
                // If there's no focus, we center based on the timestamp (use "in"
                // since 0 is falsey), assuming it's changed by enough
                if (this.props.timeStamp < 0 || this.props.timeStamp > duration)
                    this.handleBadTimeStamp();
                // if the timestamp is invalid, we handle it
                else
                    this.wavesurfer.seekAndCenter(this.props.timeStamp / duration);
                // otherwise we center based on the timestamp
            }
            else if (this.props.secondaryFocus && ((_c = this.props.secondaryFocus) === null || _c === void 0 ? void 0 : _c.getIntervalStart()) !== ((_d = prev.secondaryFocus) === null || _d === void 0 ? void 0 : _d.getIntervalStart())) {
                // and if the only thing that has changed is the secondary focus, we jump to that.
                this.centerLocation(this.props.secondaryFocus);
            }
            if (prev.filteredAnnotationContents.length !== this.props.filteredAnnotationContents.length) {
                // annotation added or deleted
                this.updateVideoLocation();
            }
        }
    };
    MediaContent.prototype.hasSelection = function () { return !!this.state.selection; };
    MediaContent.prototype.fetchMedia = function () {
        return __awaiter(this, void 0, void 0, function () {
            var theMedia;
            var _this = this;
            return __generator(this, function (_a) {
                theMedia = new resource_js_1.default(this.props.room);
                if (!MediaContent.MediaStore[theMedia.url]) {
                    MediaContent.MediaStore[theMedia.url] = window.fetch(theMedia.httpUrl)
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
                                    this.props.setMediaLoadingStatus(accumulator / contentLength);
                                    return [3 /*break*/, 1];
                                case 3: return [4 /*yield*/, theClone.blob()
                                    // XXX someday, most browsers will let <video> use a blob as an srcObj, and then this can be simplified
                                ];
                                case 4:
                                    blob = _b.sent();
                                    // XXX someday, most browsers will let <video> use a blob as an srcObj, and then this can be simplified
                                    return [2 /*return*/, URL.createObjectURL(blob)];
                            }
                        });
                    }); })
                        .catch(this.catchFetchMediaError);
                }
                else {
                    console.log("found file for ".concat(this.props.room.name, " in store"));
                }
                if (theMedia.pcm && !MediaContent.MediaStore[theMedia.pcm]) {
                    MediaContent.PCMStore[theMedia.pcm] = window.fetch(client_js_1.default.client.getHttpUriForMxcFromHS(theMedia.pcm))
                        .then(function (response) { return response.json(); })
                        .catch(function (err) { return console.log("Couldn't fetch PCM data", err); });
                }
                else if (theMedia.pcm) {
                    console.log("found PCM for ".concat(this.props.room.name, " in store"));
                }
                if (this.isVideo)
                    this.props.setMobileButtonColor("var(--contrast-text)");
                if (this.errorCondition)
                    return [2 /*return*/];
                MediaContent.MediaStore[theMedia.url].then(function (mediaUrl) { return _this.props.resource.resolveFetch(mediaUrl); });
                MediaContent.MediaStore[theMedia.url].then(this.drawMedia(MediaContent.PCMStore[theMedia.pcm]));
                return [2 /*return*/];
            });
        });
    };
    MediaContent.prototype.getAnnotations = function () {
        var _this = this;
        var didFocus = false;
        var annotationData = this.props.filteredAnnotationContents
            .filter(function (loc) {
            var _a;
            if (loc.getChild() === ((_a = _this.props.focus) === null || _a === void 0 ? void 0 : _a.getChild()))
                didFocus = true;
            return _this.filterAnnotations(loc);
        }).sort(function (a, b) {
            if (a.getIntervalStart() > b.getIntervalStart())
                return 1;
            if (a.getIntervalStart() < b.getIntervalStart())
                return -1;
            return 0;
        });
        // We add the secondary focus
        if (this.props.secondaryFocus && this.filterAnnotations(this.props.secondaryFocus))
            annotationData.push(this.props.secondaryFocus);
        // We add the focus back in if it's on the page but got screened out of filteredAnnotationContents
        if (this.props.focus && this.filterAnnotations(this.props.focus) && !didFocus)
            annotationData.push(this.props.focus);
        var gutter = {};
        var annotations = annotationData.map(function (loc) {
            var _a;
            for (var key_1 in gutter) {
                if (gutter[key_1].getIntervalEnd() <= loc.getIntervalStart())
                    delete gutter[key_1];
            }
            var key = 0;
            while (true) {
                if (gutter[key])
                    key++;
                else {
                    gutter[key] = loc;
                    break;
                }
            }
            return <WaveRegion setFocus={_this.props.setFocus} wavesurfer={_this.wavesurfer} gutterDepth={key} key={loc.event.getId()} focused={((_a = _this.props.focus) === null || _a === void 0 ? void 0 : _a.getChild()) === loc.getChild()} location={loc}/>;
        });
        return annotations;
    };
    MediaContent.prototype.render = function (props, state) {
        return <div id="media-view" ref={this.mediaView} onPointerdown={this.handlePointerdown} onPointerup={this.cancelPointer} onPointerout={this.cancelPointer} data-media-is-video={this.isVideo}>
      {this.isVideo
                ? <MediaViewVideo ref={this.video} videoLocation={state.videoLocation} wavesurfer={this.wavesurfer} videoOverlay={this.videoOverlay} hasSelection={!!state.selection} createSelection={this.createSelection} clearSelection={this.clearSelection} videoElement={this.videoElement}/>
                : null}
      <div ref={this.waveform} data-annotations-focused={this.props.focus} id="waveform">
        {state.ready ? this.getAnnotations() : null}
      </div>
    </div>;
    };
    MediaContent.MediaStore = {};
    MediaContent.PCMStore = {};
    return MediaContent;
}(preact_1.Component));
exports.default = MediaContent;
var WaveRegion = /** @class */ (function (_super) {
    __extends(WaveRegion, _super);
    function WaveRegion() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.setFocus = function (e) {
            if (!_this.props.focused)
                e.stopPropagation(); //prevent a secondary seek
            _this.props.setFocus(_this.props.location);
        };
        return _this;
    }
    WaveRegion.prototype.componentDidMount = function () {
        var color = new colors_js_1.UserColor(this.props.location.getCreator()).solid;
        this.region = this.props.wavesurfer.addRegion({
            start: this.props.location.getIntervalStart() / 1000,
            end: this.props.location.getIntervalEnd() / 1000,
            drag: false,
            resize: false,
            id: this.props.location.event.getId(),
            color: "rgba(0,0,0,0)"
        });
        this.region.element.style.setProperty('--user_solid', color);
        this.region.element.style.setProperty('--gutter_level', this.props.gutterDepth);
        if (this.props.focused)
            this.region.element.dataset.focused = true;
        this.region.on("click", this.setFocus);
    };
    WaveRegion.prototype.componentDidUpdate = function () {
        if (this.props.focused)
            this.region.element.dataset.focused = true;
        else
            delete this.region.element.dataset.focused;
        this.region.element.style.setProperty('--gutter_level', this.props.gutterDepth);
    };
    WaveRegion.prototype.componentWillUnmount = function () {
        this.region.remove();
    };
    WaveRegion.prototype.render = function () { };
    return WaveRegion;
}(preact_1.Component));
var MediaViewVideo = /** @class */ (function (_super) {
    __extends(MediaViewVideo, _super);
    function MediaViewVideo() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.setOverlayPosition = function (e) {
            var time = _this.props.wavesurfer.getCurrentTime();
            if (!_this.props.hasSelection)
                _this.props.createSelection(time, time + 1);
            var boundingRect = _this.props.videoElement.current.getBoundingClientRect();
            var videoWidth = _this.props.videoElement.current.videoWidth;
            var videoHeight = _this.props.videoElement.current.videoHeight;
            var videoScale = boundingRect.width / videoWidth;
            _this.setState({
                initialPosition: new DOMRect(Math.min(videoWidth - ((100 / videoScale)), Math.round(e.offsetX / videoScale)), Math.min(videoHeight - ((100 / videoScale)), Math.round(e.offsetY / videoScale)), Math.round(100 / videoScale), Math.round(100 / videoScale))
            });
        };
        _this.clearOverlayPosition = function (e) {
            if (e)
                e.noClear = true;
            // we prevent any associated event from clearing the audio range selection
            _this.setState({ initialPosition: null });
        };
        return _this;
    }
    MediaViewVideo.prototype.render = function (props, state) {
        var _a;
        return <div id="media-view-video">
      <div id="media-view-video-wrapper">
        <video onclick={this.setOverlayPosition} ref={props.videoElement}/>
        {props.hasSelection
                ? state.initialPosition
                    ? <MediaViewVideoOverlay mutable={true} ref={props.videoOverlay} videoElement={props.videoElement} clear={this.props.clearSelection} initialPosition={state.initialPosition}/>
                    : null
                : ((_a = props.videoLocation) === null || _a === void 0 ? void 0 : _a.getMediaRect())
                    ? <MediaViewVideoOverlay mutable={false} ref={props.videoOverlay} videoElement={props.videoElement} initialPosition={props.videoLocation.getMediaRect()}/>
                    : props.videoOverlay.current = null}
      </div>
    </div>;
    };
    return MediaViewVideo;
}(preact_1.Component));
var MediaViewVideoOverlay = /** @class */ (function (_super) {
    __extends(MediaViewVideoOverlay, _super);
    function MediaViewVideoOverlay(props) {
        var _this = _super.call(this, props) || this;
        _this.overlay = (0, preact_1.createRef)();
        _this.handleVideoResize = function (_) {
            _this.spotlightScale = _this.props.videoElement.current.getBoundingClientRect().width / _this.props.videoElement.current.videoWidth;
            _this.overlay.current.style.setProperty("--spotlightScale", "".concat(_this.spotlightScale));
        };
        _this.handleDrag = function (e) {
            e.preventDefault();
            var videoWidth = _this.props.videoElement.current.videoWidth;
            var videoHeight = _this.props.videoElement.current.videoHeight;
            _this.spotlightX = Math.round(Math.min(Math.max(0, _this.initialX + ((e.clientX - _this.initialClientX) / _this.spotlightScale)), videoWidth - _this.spotlightWidth));
            _this.spotlightY = Math.round(Math.min(Math.max(0, _this.initialY + ((e.clientY - _this.initialClientY) / _this.spotlightScale)), videoHeight - _this.spotlightHeight));
            _this.overlay.current.style.setProperty("--spotlightX", "".concat(_this.spotlightX, "px"));
            _this.overlay.current.style.setProperty("--spotlightY", "".concat(_this.spotlightY, "px"));
        };
        _this.handleResizeX = function (e) {
            e.preventDefault();
            var videoWidth = _this.props.videoElement.current.videoWidth;
            //the 40px minimum here accomodates the handles
            _this.spotlightWidth = Math.round(Math.min(videoWidth - _this.spotlightX, Math.max(40, _this.initialWidth + ((e.clientX - _this.initialClientX) / _this.spotlightScale))));
            _this.overlay.current.style.setProperty("--spotlightWidth", "".concat(_this.spotlightWidth, "px"));
        };
        _this.handleResizeY = function (e) {
            e.preventDefault();
            var videoHeight = _this.props.videoElement.current.videoHeight;
            //the 40px minimum here accomodates the handles
            _this.spotlightHeight = Math.round(Math.min(videoHeight - _this.spotlightY, Math.max(40, _this.initialHeight + ((e.clientY - _this.initialClientY) / _this.spotlightScale))));
            _this.overlay.current.style.setProperty("--spotlightHeight", "".concat(_this.spotlightHeight, "px"));
        };
        _this.startDrag = function (e) {
            e.preventDefault();
            _this.initialX = _this.spotlightX;
            _this.initialY = _this.spotlightY;
            _this.initialClientX = e.clientX;
            _this.initialClientY = e.clientY;
            _this.overlay.current.setPointerCapture(e.pointerId);
            _this.overlay.current.addEventListener('pointermove', _this.handleDrag);
            _this.overlay.current.addEventListener('pointerup', function (e2) {
                var _a, _b;
                delete _this.initialX;
                delete _this.initialY;
                delete _this.initialClientX;
                delete _this.initialClientY;
                (_a = _this.overlay.current) === null || _a === void 0 ? void 0 : _a.releasePointerCapture(e.pointerId);
                (_b = _this.overlay.current) === null || _b === void 0 ? void 0 : _b.removeEventListener('pointermove', _this.handleDrag);
            });
        };
        _this.startResizeX = function (e) {
            e.preventDefault();
            _this.overlay.current.setPointerCapture(e.pointerId);
            _this.initialWidth = _this.spotlightWidth;
            _this.initialClientX = e.clientX;
            _this.overlay.current.addEventListener('pointermove', _this.handleResizeX);
            _this.overlay.current.addEventListener('pointerup', function (e2) {
                var _a, _b;
                delete _this.initialWidth;
                delete _this.initialClientX;
                (_a = _this.overlay.current) === null || _a === void 0 ? void 0 : _a.releasePointerCapture(e.pointerId);
                (_b = _this.overlay.current) === null || _b === void 0 ? void 0 : _b.removeEventListener('pointermove', _this.handleResizeX);
            });
        };
        _this.startResizeY = function (e) {
            e.preventDefault();
            _this.overlay.current.setPointerCapture(e.pointerId);
            _this.initialHeight = _this.spotlightHeight;
            _this.initialClientY = e.clientY;
            _this.overlay.current.addEventListener('pointermove', _this.handleResizeY);
            _this.overlay.current.addEventListener('pointerup', function (e2) {
                var _a, _b;
                delete _this.initialHeight;
                delete _this.initialClientY;
                (_a = _this.overlay.current) === null || _a === void 0 ? void 0 : _a.releasePointerCapture(e.pointerId);
                (_b = _this.overlay.current) === null || _b === void 0 ? void 0 : _b.removeEventListener('pointermove', _this.handleResizeY);
            });
        };
        _this.spotlightScale = props.videoElement.current.getBoundingClientRect().width / props.videoElement.current.videoWidth;
        _this.spotlightWidth = props.initialPosition.width;
        _this.spotlightHeight = props.initialPosition.height;
        _this.spotlightX = props.initialPosition.x;
        _this.spotlightY = props.initialPosition.y;
        return _this;
    }
    MediaViewVideoOverlay.prototype.componentDidUpdate = function (prev) {
        // we want to upday only when we start selection or when we're not mutable
        // and the playback location changes
        if (prev.mutable !== this.props.mutable || !this.props.mutable) {
            this.spotlightWidth = this.props.initialPosition.width;
            this.spotlightHeight = this.props.initialPosition.height;
            this.spotlightX = this.props.initialPosition.x;
            this.spotlightY = this.props.initialPosition.y;
            this.overlay.current.style.setProperty("--spotlightX", "".concat(this.spotlightX, "px"));
            this.overlay.current.style.setProperty("--spotlightY", "".concat(this.spotlightY, "px"));
            this.overlay.current.style.setProperty("--spotlightWidth", "".concat(this.spotlightWidth, "px"));
            this.overlay.current.style.setProperty("--spotlightHeight", "".concat(this.spotlightHeight, "px"));
        }
    };
    MediaViewVideoOverlay.prototype.componentDidMount = function () {
        this.resizeObserver = new ResizeObserver(this.handleVideoResize);
        this.resizeObserver.observe(this.props.videoElement.current);
    };
    MediaViewVideoOverlay.prototype.componentWillUnmount = function () {
        this.resizeObserver.disconnect();
    };
    MediaViewVideoOverlay.prototype.render = function (props, state) {
        var styleVars = {
            "--spotlightX": "".concat(this.spotlightX, "px"),
            "--spotlightY": "".concat(this.spotlightY, "px"),
            "--spotlightWidth": "".concat(this.spotlightWidth, "px"),
            "--spotlightHeight": "".concat(this.spotlightHeight, "px"),
            "--spotlightScale": this.spotlightScale,
        };
        return <div id="media-view-video-overlay" data-media-selection-mutable={props.mutable} style={styleVars} ref={this.overlay}>
      <div onpointerdown={props.mutable && props.clear} id="media-view-video-overlay-header"/>
      <div onpointerdown={props.mutable && props.clear} id="media-view-video-overlay-left"/>
      <div onpointerdown={props.mutable && this.startDrag} id="media-view-video-overlay-overlight"/>
      <div onpointerdown={props.mutable && this.startDrag} id="media-view-video-overlay-leftlight"/>
      <div onpointerdown={props.mutable && this.startResizeX} id="media-view-video-overlay-rightlight"/>
      <div onpointerdown={props.mutable && this.startResizeY} id="media-view-video-overlay-underlight"/>
      <div onpointerdown={props.mutable && this.startDrag} id="media-view-video-overlay-spotlight"/>
      <div onpointerdown={props.mutable && props.clear} id="media-view-video-overlay-right"/>
      <div onpointerdown={props.mutable && props.clear} id="media-view-video-overlay-footer"/>
    </div>;
    };
    return MediaViewVideoOverlay;
}(preact_1.Component));

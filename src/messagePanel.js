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
var Icons = require("./icons.js");
var Matrix = require("matrix-js-sdk");
var preact_1 = require("preact");
var CommonMark = require("commonmark");
var media_js_1 = require("./utils/media.js");
var constants_js_1 = require("./constants.js");
var processRegex_js_1 = require("./processRegex.js");
var colors_js_1 = require("./utils/colors.js");
var math_js_1 = require("./utils/math.js");
var download_js_1 = require("./utils/download.js");
var client_js_1 = require("./client.js");
var modal_js_1 = require("./modal.js");
var tooltip_js_1 = require("./utils/tooltip.js");
var audioVisualizer_js_1 = require("./audioVisualizer.js");
var PopupMenu = require("./popUpMenu.js");
var roomSettings_js_1 = require("./roomSettings.js");
var MessagePanel = /** @class */ (function (_super) {
    __extends(MessagePanel, _super);
    function MessagePanel(props) {
        var _this = _super.call(this, props) || this;
        _this.userColor = new colors_js_1.UserColor(client_js_1.default.client.getUserId());
        _this.theInput = (0, preact_1.createRef)();
        _this.setModeDefault = function (_) { return _this.setState({ mode: "Default" }); };
        _this.setModeSendFile = function (_) { return _this.setState({ mode: "SendFile" }); };
        _this.setFile = function (file) { return _this.setState({ file: file }); };
        _this.setModeRecordVideo = function (_) {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                alert("Your browser looks like it doesn't support accessing the webcam...");
            }
            else
                _this.setState({ mode: "RecordVideo" });
        };
        _this.setModeRecordAudio = function (_) {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                alert("Your browser looks like it doesn't support accessing the webcam...");
            }
            else
                _this.setState({ mode: "RecordAudio" });
        };
        _this.showMore = function (_) { return _this.setState({ buttons: _this.state.buttons + 1 }); };
        _this.showLess = function (_) { return _this.setState({ buttons: _this.state.buttons - 1 }); };
        _this.submitCurrentInput = function (_) {
            if (_this.theInput.current)
                _this.theInput.current.submitInput();
            // need the conditional here because of occasional apparent timing issues with the callback
        };
        _this.openPendingAnnotation = function (theContent, eventInterface) {
            var _a, _b;
            var theDomain = client_js_1.default.client.getDomain();
            if (_this.props.focus.getStatus() === "pending") {
                var newHighlight = Object.assign({}, _this.props.focus.location[constants_js_1.populusHighlight], {
                    activityStatus: "open",
                    rootEventId: eventInterface.event_id,
                    rootContent: theContent
                });
                var locationData = Object.assign({}, _this.props.focus.location, (_a = {},
                    _a[constants_js_1.populusHighlight] = newHighlight,
                    _a));
                var newContent = (_b = { via: [theDomain] }, _b[constants_js_1.mscLocation] = locationData, _b);
                client_js_1.default.client
                    .sendStateEvent(_this.props.resourceId, Matrix.EventType.SpaceChild, newContent, _this.props.focus.getChild())
                    .catch(function (e) { return alert(e); });
                client_js_1.default.client
                    .sendStateEvent(_this.props.focus.getChild(), Matrix.EventType.SpaceParent, newContent, _this.props.resourceId)
                    .catch(function (e) { return alert(e); });
            }
        };
        _this.sendSelection = function (_) { return __awaiter(_this, void 0, void 0, function () {
            var locationData, theContent, eventI;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        locationData = this.props.generateLocation();
                        theContent = (_a = {
                                body: "created an annotation",
                                msgtype: "m.emote"
                            },
                            _a[constants_js_1.mscMarkupMsgKey] = (_b = {}, _b[constants_js_1.mscParent] = this.props.resourceId, _b[constants_js_1.mscLocation] = locationData, _b),
                            _a);
                        return [4 /*yield*/, client_js_1.default.client.sendMessage(this.props.focus.getChild(), theContent)];
                    case 1:
                        eventI = _c.sent();
                        this.openPendingAnnotation(theContent, eventI);
                        return [2 /*return*/];
                }
            });
        }); };
        _this.openSettings = function (_) {
            var theRoom = client_js_1.default.client.getRoom(_this.props.focus.getChild());
            modal_js_1.default.set(<roomSettings_js_1.default joinLink resource={_this.props.resource} room={theRoom}/>, "Room Settings", "for ".concat(theRoom.name));
        };
        _this.state = {
            mode: "Default",
            buttons: 1
        };
        return _this;
    }
    MessagePanel.prototype.getInput = function () {
        var theProps = {
            ref: this.theInput,
            submit: this.submitCurrentInput,
            roomId: this.props.focus.getChild(),
            handlePending: this.openPendingAnnotation,
            done: this.setModeDefault
        };
        switch (this.state.mode) {
            case 'Default': return <TextMessageInput {...theProps}/>;
            case 'SendFile': return <FileUploadInput setFile={this.setFile} file={this.state.file} {...theProps}/>;
            case 'RecordVideo': return <RecordVideoInput {...theProps}/>;
            case 'RecordAudio': return <RecordAudioInput {...theProps}/>;
        }
    };
    MessagePanel.prototype.render = function (props, state) {
        var theRoom = client_js_1.default.client.getRoom(props.focus.getChild());
        var userMember = theRoom === null || theRoom === void 0 ? void 0 : theRoom.getMember(client_js_1.default.client.getUserId());
        var isAdmin = userMember ? userMember.powerLevel >= 100 : false;
        if (theRoom && !theRoom.maySendMessage())
            return <div id="message-panel-disabled">Read-only Discussion</div>;
        return <div style={this.userColor.styleVariables} id="messageComposer">
      {this.getInput()}
      <div id="submit-button-wrapper">
        {state.mode === "Default"
                ? state.buttons === 1
                    ? <preact_1.Fragment>
                <button id="submitButton" onclick={this.submitCurrentInput}>Submit</button>
                <tooltip_js_1.default key="record-audio" content="Record audio message">
                  <button onclick={this.setModeRecordAudio}>{Icons.mic}</button>
                </tooltip_js_1.default>
                <tooltip_js_1.default key="record-video" content="Record video message">
                  <button onclick={this.setModeRecordVideo}>{Icons.video}</button>
                </tooltip_js_1.default>
                <tooltip_js_1.default key="more-options" content="More options">
                  <button ref={this.showMoreButton} onclick={this.showMore}>{Icons.moreHorizontal}</button>
                </tooltip_js_1.default>
            </preact_1.Fragment>
                    : <preact_1.Fragment>
                <tooltip_js_1.default key="more-options-2" content="More options">
                  <button ref={this.showLessButton} onclick={this.showLess}>{Icons.moreHorizontal}</button>
                </tooltip_js_1.default>
                <tooltip_js_1.default key="quote-highlighted" content="Quote highlighted">
                  <button id="quote-button" disabled={!props.hasSelection} onclick={this.sendSelection}>{Icons.quote}</button>
                </tooltip_js_1.default>
                <tooltip_js_1.default key="Upload-file" content="Upload file">
                  <button onclick={this.setModeSendFile}>{Icons.upload}</button>
                </tooltip_js_1.default>
                {isAdmin
                            ? <tooltip_js_1.default key="configure-room" content="Configure room settings">
                    <button onclick={this.openSettings}>{Icons.settings}</button>
                  </tooltip_js_1.default>
                            : null}
            </preact_1.Fragment>
                : <preact_1.Fragment>
              <button id="submitButton" onclick={this.submitCurrentInput}>Submit</button>
              <button id="cancelButton" onclick={this.setModeDefault}>Cancel</button>
          </preact_1.Fragment>}
      </div>
    </div>;
    };
    return MessagePanel;
}(preact_1.Component));
exports.default = MessagePanel;
var FileUploadInput = /** @class */ (function (_super) {
    __extends(FileUploadInput, _super);
    function FileUploadInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.fileLoader = (0, preact_1.createRef)();
        _this.theForm = (0, preact_1.createRef)();
        _this.secondaryAudio = (0, preact_1.createRef)();
        _this.getFile = function (_) { return _this.props.file || _this.fileLoader.current.files[0]; };
        _this.setFileFromInput = function (_) { return _this.validateFile(_this.fileLoader.current.files[0]); };
        _this.validateFile = function (file) {
            var limit = client_js_1.default.mediaConfig["m.upload.size"];
            if (file.size >= limit) {
                alert("Sorry, this file is too large to be uploaded. Your current server limits uploads to ".concat((0, math_js_1.formatBytes)(limit), "."));
                _this.props.done();
            }
            else if (/^video/.test(file.type)) {
                _this.setState({
                    previewUrl: URL.createObjectURL(file),
                    mediaType: "video",
                });
            }
            else if (/^image/.test(file.type)) {
                _this.setState({
                    previewUrl: URL.createObjectURL(file),
                    mediaType: "image",
                });
            }
            else if (/^audio/.test(file.type)) {
                (0, media_js_1.loadMediaElement)(file, "audio").then(function (elt) {
                    var _a;
                    _this.mediaElement = elt;
                    var stream = ((_a = elt.mozCaptureStream) === null || _a === void 0 ? void 0 : _a.call(elt)) || elt.captureStream();
                    _this.setState({
                        stream: stream,
                        previewUrl: URL.createObjectURL(file),
                        mediaType: "audio",
                    });
                });
            }
            else {
                _this.setState({ mediaType: "default" });
            }
        };
        _this.submitInput = function (_) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.state.mediaType) return [3 /*break*/, 9];
                        _a = this.state.mediaType;
                        switch (_a) {
                            case "image": return [3 /*break*/, 1];
                            case "video": return [3 /*break*/, 3];
                            case "audio": return [3 /*break*/, 5];
                            case "default": return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 9];
                    case 1: return [4 /*yield*/, this.submitImage()];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 3: return [4 /*yield*/, this.submitVideo()];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 5: return [4 /*yield*/, this.submitAudio()];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, this.submitDefault()];
                    case 8:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 9:
                        this.props.done();
                        return [2 /*return*/];
                }
            });
        }); };
        _this.handleMediaClick = function (_) {
            var _a, _b;
            console.log(_this.mediaElement.current);
            if (_this.mediaElement.paused) {
                _this.mediaElement.currentTime = 0;
                _this.mediaElement.play();
                (_a = _this.secondaryAudio.current) === null || _a === void 0 ? void 0 : _a.play();
            }
            else {
                _this.mediaElement.pause();
                (_b = _this.secondaryAudio.current) === null || _b === void 0 ? void 0 : _b.pause();
            }
        };
        _this.submitDefault = function (_) { return __awaiter(_this, void 0, void 0, function () {
            var theFile, mxc, theContent, eventI;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        theFile = this.getFile();
                        return [4 /*yield*/, client_js_1.default.client.uploadContent(theFile, { progressHandler: this.progressHandler }).catch(function (e) { return console.log(e); })];
                    case 1:
                        mxc = _a.sent();
                        theContent = {
                            body: theFile.name,
                            filename: theFile.name,
                            info: {
                                mimetype: theFile.type ? theFile.type : "application/octet-stream",
                                size: theFile.size
                            },
                            msgtype: "m.file",
                            url: mxc
                        };
                        return [4 /*yield*/, client_js_1.default.client.sendMessage(this.props.roomId, theContent)];
                    case 2:
                        eventI = _a.sent();
                        this.props.handlePending(theContent, eventI);
                        return [2 /*return*/];
                }
            });
        }); };
        _this.submitVideo = function (_) { return __awaiter(_this, void 0, void 0, function () {
            var theVideo, videoElt, thumbContent, thumbMxc, blurhash, videoMxc, duration, theContent, eventI;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        theVideo = this.getFile();
                        return [4 /*yield*/, (0, media_js_1.loadMediaElement)(theVideo, "video")];
                    case 1:
                        videoElt = _a.sent();
                        return [4 /*yield*/, (0, media_js_1.createThumbnail)(videoElt, videoElt.videoWidth, videoElt.videoHeight, "image/jpeg")];
                    case 2:
                        thumbContent = _a.sent();
                        return [4 /*yield*/, client_js_1.default.client.uploadContent(thumbContent.thumbnail, {
                                name: "".concat(theVideo.name, "_800x600"),
                                type: "image/jpeg",
                                progressHandler: this.progressHandler
                            })];
                    case 3:
                        thumbMxc = _a.sent();
                        return [4 /*yield*/, (0, media_js_1.blurhashFromFile)(thumbContent.thumbnail)];
                    case 4:
                        blurhash = _a.sent();
                        console.log("upload video");
                        return [4 /*yield*/, client_js_1.default.client.uploadContent(theVideo, { progressHandler: this.progressHandler })];
                    case 5:
                        videoMxc = _a.sent();
                        duration = Math.round(videoElt.duration * 1000);
                        theContent = {
                            body: theVideo.name,
                            info: {
                                h: thumbContent.info.h,
                                w: thumbContent.info.w,
                                mimetype: theVideo.type,
                                size: theVideo.size,
                                blurhash: blurhash,
                                thumbnail_url: thumbMxc,
                                thumbnail_info: thumbContent.info.thumbnail_info
                            },
                            msgtype: "m.video",
                            url: videoMxc
                        };
                        if (duration < Infinity)
                            theContent.duration = duration;
                        return [4 /*yield*/, client_js_1.default.client.sendMessage(this.props.roomId, theContent)];
                    case 6:
                        eventI = _a.sent();
                        this.props.handlePending(theContent, eventI);
                        return [2 /*return*/];
                }
            });
        }); };
        _this.submitAudio = function (_) { return __awaiter(_this, void 0, void 0, function () {
            var theAudio, audioMxc, duration, theContent, eventI;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        theAudio = this.getFile();
                        console.log("upload audio");
                        return [4 /*yield*/, client_js_1.default.client.uploadContent(theAudio, { progressHandler: this.progressHandler })];
                    case 1:
                        audioMxc = _a.sent();
                        duration = Math.round(this.mediaElement.duration * 1000);
                        theContent = {
                            body: theAudio.name,
                            info: {
                                mimetype: theAudio.type,
                                size: theAudio.size
                            },
                            msgtype: "m.audio",
                            url: audioMxc,
                        };
                        if (duration < Infinity)
                            theContent.duration = duration;
                        return [4 /*yield*/, client_js_1.default.client.sendMessage(this.props.roomId, theContent)];
                    case 2:
                        eventI = _a.sent();
                        this.props.handlePending(theContent, eventI);
                        return [2 /*return*/];
                }
            });
        }); };
        _this.submitImage = function (_) { return __awaiter(_this, void 0, void 0, function () {
            var theImage, _a, width, height, img, blurhash, thumbType, thumbContent, thumbMxc, imageMxc, theContent, eventI;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        theImage = this.getFile();
                        return [4 /*yield*/, (0, media_js_1.loadImageElement)(theImage)];
                    case 1:
                        _a = _b.sent(), width = _a.width, height = _a.height, img = _a.img;
                        return [4 /*yield*/, (0, media_js_1.blurhashFromFile)(theImage)];
                    case 2:
                        blurhash = _b.sent();
                        thumbType = theImage.type === "image/jpeg" ? "image/jpeg" : "image/png";
                        return [4 /*yield*/, (0, media_js_1.createThumbnail)(img, width, height, thumbType)];
                    case 3:
                        thumbContent = _b.sent();
                        return [4 /*yield*/, client_js_1.default.client.uploadContent(thumbContent.thumbnail, {
                                name: "".concat(theImage.name, "_800x600"),
                                type: thumbType,
                                progressHandler: this.progressHandler
                            })];
                    case 4:
                        thumbMxc = _b.sent();
                        return [4 /*yield*/, client_js_1.default.client.uploadContent(theImage, { progressHandler: this.progressHandler })];
                    case 5:
                        imageMxc = _b.sent();
                        theContent = {
                            body: theImage.name,
                            info: {
                                h: height,
                                w: width,
                                mimetype: theImage.type,
                                size: theImage.size,
                                blurhash: blurhash,
                                thumbnail_url: thumbMxc,
                                thumbnail_info: thumbContent.info.thumbnail_info
                            },
                            msgtype: "m.image",
                            url: imageMxc
                        };
                        return [4 /*yield*/, client_js_1.default.client.sendMessage(this.props.roomId, theContent)];
                    case 6:
                        eventI = _b.sent();
                        this.props.handlePending(theContent, eventI);
                        return [2 /*return*/];
                }
            });
        }); };
        _this.progressHandler = function (progress) { return _this.setState({ progress: progress }); };
        return _this;
    }
    FileUploadInput.prototype.componentDidMount = function () {
        if (this.props.file)
            this.validateFile(this.props.file);
        else
            this.fileLoader.current.click();
    };
    FileUploadInput.prototype.componentWillUnmount = function () {
        this.props.setFile(null);
    };
    FileUploadInput.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.file !== this.props.file)
            this.validateFile(this.props.file);
    };
    FileUploadInput.prototype.render = function (props, state) {
        return <form ref={this.theForm}>
      <input id="file-uploader-input" ref={this.fileLoader} oninput={this.setFileFromInput} type="file"/>
      {state.mediaType === "video"
                ? <video ref={this.mediaPreview} class="video-message-preview media-message-thumbnail" controls src={state.previewUrl}/>
                : state.mediaType === "image"
                    ? <img ref={this.mediaPreview} class="image-message-preview media-message-thumbnail" src={this.state.previewUrl}/>
                    : state.mediaType === "audio" && state.stream
                        ? <preact_1.Fragment>
          {//workaround for firefox bug: https://bugzilla-dev.allizom.org/show_bug.cgi?id=1178751
                            this.mediaElement.mozCaptureStream ? <audio ref={this.secondaryAudio} srcObject={state.stream}/> : null}
          <audioVisualizer_js_1.default class="audio-message-preview media-message-thumbnail" height="100" onclick={this.handleMediaClick} stream={state.stream}/>
        </preact_1.Fragment>
                        : state.mediaType === "default"
                            ? <div id="file-uploader-preview">
          <span>{Icons.file}</span>
          <span>{this.getFile().name}</span>
          <span>{(0, math_js_1.formatBytes)(this.getFile().size)} </span>
        </div>
                            : null}
      {this.state.progress
                ? <div id="file-uploader-progress">
          <span>Uploading file</span>
          <progress class="styled-progress" max={state.progress.total} value={state.progress.loaded}/>
        </div>
                : null}
    </form>;
    };
    return FileUploadInput;
}(preact_1.Component));
var TextMessageInput = /** @class */ (function (_super) {
    __extends(TextMessageInput, _super);
    function TextMessageInput(props) {
        var _this = _super.call(this, props) || this;
        _this.currentInput = (0, preact_1.createRef)();
        _this.startTyping = function (_) {
            // send a "typing" notification with a 30 second timeout
            client_js_1.default.client.sendTyping(_this.props.roomId, true, 30000);
            // lock sending further typing notifications
            _this.typingLock = true;
            // Release lock (to allow sending another typing notification) after 10 seconds
            _this.resetLockTimeout = setTimeout(function (_) { _this.typingLock = false; }, 10000);
        };
        _this.stopTyping = function (_) {
            // return to "waiting for typing" state
            _this.typingLock = false;
            clearTimeout(_this.resetLockTimeout);
            clearTimeout(_this.typingTimeout);
            // send a "not typing" notification
            client_js_1.default.client.sendTyping(_this.props.roomId, false);
        };
        _this.handleInput = function (event) {
            if (event.target.value === "")
                _this.stopTyping();
            _this.setValue(event.target.value);
            _this.currentInput.current.style.height = 'auto';
            _this.currentInput.current.style.height = "".concat(_this.currentInput.current.scrollHeight, "px");
        };
        _this.setValue = function (value, cb) { return _this.setState({ value: value }, cb); };
        _this.handleKeydown = function (e) {
            e.stopPropagation(); // don't propagate to global keypress handlers
            clearTimeout(_this.typingTimeout);
            _this.typingTimeout = setTimeout(function (_) { return _this.stopTyping(); }, 5000);
            // send "stopped typing" after 5 seconds of inactivity
            if (e.code === "Enter" && e.ctrlKey) {
                e.preventDefault();
                // the below is a bit indirect, but it lets us use a single method to
                // capture all the side-effects of sending the message
                _this.props.submit();
            }
            else if (!_this.typingLock)
                _this.startTyping();
        };
        _this.submitInput = function (_) {
            if (_this.props.roomId) {
                _this.stopTyping();
                // don't send empty messages
                if (!_this.state.value.replace(/\s/g, '').length)
                    return;
                // bail out of message is only whitespace
                var parsed = _this.reader.parse((0, processRegex_js_1.processRegex)(_this.state.value));
                var rendered = _this.writer.render(parsed);
                var theContent_1 = {
                    body: _this.state.value,
                    msgtype: "m.text",
                    format: "org.matrix.custom.html",
                    formatted_body: rendered
                };
                client_js_1.default.client.sendMessage(_this.props.roomId, theContent_1).then(function (eventI) {
                    _this.props.handlePending(theContent_1, eventI);
                });
                _this.currentInput.current.style.height = null;
                _this.setValue("");
            }
        };
        _this.popupActions = {
            "@": function (props) { return <PopupMenu.Members roomId={_this.props.roomId} {...props}/>; },
            ":": function (props) { return <PopupMenu.Emojis {...props}/>; }
        };
        _this.state = { value: "" };
        _this.reader = new CommonMark.Parser();
        _this.writer = new CommonMark.HtmlRenderer();
        return _this;
    }
    TextMessageInput.prototype.render = function (props, state) {
        return <preact_1.Fragment>
      <PopupMenu.Menu textValue={state.value} textarea={this.currentInput} setTextValue={this.setValue} actions={this.popupActions}/>
      <textarea ref={this.currentInput} value={state.value} onkeydown={this.handleKeydown} oninput={this.handleInput} onblur={this.stopTyping} data-gramm="false" // disable grammarly
        />
    </preact_1.Fragment>;
    };
    return TextMessageInput;
}(preact_1.Component));
var RecordMediaInput = /** @class */ (function (_super) {
    __extends(RecordMediaInput, _super);
    function RecordMediaInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mediaPreview = (0, preact_1.createRef)();
        _this.countdownToRecord = function (_) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initialization];
                    case 1:
                        _a.sent();
                        if (!this.state.countdown)
                            this.setState({ countdown: 3, recording: "countdown" });
                        setTimeout(function (_) {
                            var newCount = _this.state.countdown - 1;
                            _this.setState({ countdown: newCount });
                            if (newCount === 0)
                                return _this.startRecord();
                            _this.countdownToRecord();
                        }, 1500);
                        return [2 /*return*/];
                }
            });
        }); };
        _this.startRecord = function (_) {
            _this.mediaRecorder.start();
            _this.setState({ recording: "started" });
        };
        _this.finishRecord = function (_) {
            _this.mediaRecorder.stop();
            _this.teardownStream();
            _this.setState({ recording: "done" });
        };
        _this.progressHandler = function (progress) { return _this.setState({ progress: progress }); };
        _this.recordingIcon = function (_) {
            switch (_this.state.recording) {
                case "started": return <div aria-label="Stop recording" data-recording-state={_this.state.recording} id={_this.captionId}>{Icons.pause}</div>;
                case "countdown": return <div data-recording-state={_this.state.recording} id={_this.captionId}>{_this.state.countdown}</div>;
                case "done": return null;
                default: return <div aria-label="Start recording" data-recording-state={_this.state.recording} id={_this.captionId}>{_this.icon}</div>;
            }
        };
        _this.clickHandler = function () {
            switch (_this.state.recording) {
                case "started": return _this.finishRecord();
                case "countdown": return null;
                case "done": return null;
                default: return _this.countdownToRecord();
            }
        };
        return _this;
    }
    RecordMediaInput.prototype.componentDidMount = function () {
        this.initStream();
    };
    RecordMediaInput.prototype.componentWillUnmount = function () {
        this.teardownStream();
    };
    RecordMediaInput.prototype.initStream = function () {
        return __awaiter(this, void 0, void 0, function () {
            var initialized_1, _a, err_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        this.initialization = new Promise(function (resolve) { initialized_1 = resolve; });
                        _a = this;
                        return [4 /*yield*/, navigator.mediaDevices.getUserMedia(this.constraints)];
                    case 1:
                        _a.stream = _b.sent();
                        this.mediaPreview.current.srcObject = this.stream;
                        this.mediaRecorder = new MediaRecorder(this.stream, this.recorderOptions);
                        this.mediaRecorder.ondataavailable = function (ev) {
                            _this.recordingBlob = ev.data;
                            var limit = client_js_1.default.mediaConfig["m.upload.size"];
                            if (_this.recordingBlob.size > limit) {
                                if (confirm("Sorry, this recording is too large to be uploaded. Your current server limits uploads to ".concat((0, math_js_1.formatBytes)(limit), ". Would you like to save the recording locally?"))) {
                                    (0, download_js_1.downloadBlob)(_this.recordingBlob, "populus-recording-toobig.webm", _this.recorderOptions.mimetype);
                                }
                                _this.setState({ recording: null });
                                _this.initStream();
                                return;
                            }
                            _this.setState({ recordingAvailable: true });
                            _this.mediaPreview.current.srcObject = null;
                            _this.mediaPreview.current.setAttribute("controls", "");
                            _this.mediaPreview.current.src = URL.createObjectURL(ev.data);
                        };
                        initialized_1();
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _b.sent();
                        alert(err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RecordMediaInput.prototype.teardownStream = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initialization];
                    case 1:
                        _a.sent();
                        this.stream.getTracks().forEach(function (track) { return track.stop(); });
                        return [2 /*return*/];
                }
            });
        });
    };
    return RecordMediaInput;
}(preact_1.Component));
var RecordVideoInput = /** @class */ (function (_super) {
    __extends(RecordVideoInput, _super);
    function RecordVideoInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.constraints = {
            audio: true,
            video: { facingMode: "user" },
            uploading: ""
        };
        _this.recorderOptions = {
            mimeType: "video/webm",
            videoBitsPerSecond: 1000000 // 1 mbps
        };
        _this.icon = Icons.video;
        _this.captionId = "videoCaption";
        return _this;
    }
    RecordVideoInput.prototype.submitInput = function () {
        return __awaiter(this, void 0, void 0, function () {
            var videoElt, thumbContent, thumbMxc, blurhash, videoMxc, duration, theContent, eventI;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.state.recording === "done")) return [3 /*break*/, 6];
                        videoElt = this.mediaPreview.current;
                        return [4 /*yield*/, (0, media_js_1.createThumbnail)(videoElt, videoElt.videoWidth, videoElt.videoHeight, "image/jpeg")];
                    case 1:
                        thumbContent = _a.sent();
                        this.setState({ uploading: "thumbnail" });
                        return [4 /*yield*/, client_js_1.default.client.uploadContent(thumbContent.thumbnail, {
                                name: "".concat(client_js_1.default.client.getUserId(), "_").concat(Date.now(), "_thumbnail"),
                                type: "image/jpeg",
                                progressHandler: this.progressHandler
                            })];
                    case 2:
                        thumbMxc = _a.sent();
                        return [4 /*yield*/, (0, media_js_1.blurhashFromFile)(thumbContent.thumbnail)];
                    case 3:
                        blurhash = _a.sent();
                        this.setState({ uploading: "video" });
                        return [4 /*yield*/, client_js_1.default.client.uploadContent(this.recordingBlob, { progressHandler: this.progressHandler })];
                    case 4:
                        videoMxc = _a.sent();
                        this.setState({ uploading: "" });
                        duration = Math.round(videoElt.duration * 1000);
                        theContent = {
                            body: "".concat(client_js_1.default.client.getUserId(), "_").concat(Date.now()),
                            info: {
                                h: thumbContent.info.h,
                                w: thumbContent.info.w,
                                mimetype: "video/webm",
                                size: this.recordingBlob.size,
                                blurhash: blurhash,
                                thumbnail_url: thumbMxc,
                                thumbnail_info: thumbContent.info.thumbnail_info
                            },
                            msgtype: "m.video",
                            url: videoMxc
                        };
                        if (duration < Infinity)
                            theContent.info.duration = duration;
                        return [4 /*yield*/, client_js_1.default.client.sendMessage(this.props.roomId, theContent)];
                    case 5:
                        eventI = _a.sent();
                        this.props.handlePending(theContent, eventI);
                        this.props.done();
                        return [3 /*break*/, 7];
                    case 6:
                        alert("Before submitting, you need to record something.");
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    RecordVideoInput.prototype.render = function (props, state) {
        return <div id="videoRecordingWrapper">
      <video autoplay onclick={this.clickHandler} muted={!(state.recording === "done")} ref={this.mediaPreview} class="video-message-preview media-message-thumbnail"/>
      {this.recordingIcon()}
      {this.state.progress
                ? <div id="media-uploader-progress">
          <span>Uploading recording</span>
          <progress class="styled-progress" max={state.progress.total} value={state.progress.loaded}/>
        </div>
                : null}
    </div>;
    };
    return RecordVideoInput;
}(RecordMediaInput));
var RecordAudioInput = /** @class */ (function (_super) {
    __extends(RecordAudioInput, _super);
    function RecordAudioInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.constraints = {
            audio: true,
            video: false
        };
        _this.recorderOptions = { mimeType: "audio/webm" };
        _this.icon = Icons.mic;
        _this.captionId = "audioCaption";
        return _this;
    }
    RecordAudioInput.prototype.submitInput = function () {
        return __awaiter(this, void 0, void 0, function () {
            var audioElt, duration, audioMxc, theContent, eventI;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.state.recording === "done")) return [3 /*break*/, 3];
                        audioElt = this.mediaPreview.current;
                        duration = Math.round(audioElt.duration * 1000);
                        return [4 /*yield*/, client_js_1.default.client.uploadContent(this.recordingBlob, { progressHandler: this.progressHandler })];
                    case 1:
                        audioMxc = _a.sent();
                        theContent = {
                            body: "".concat(client_js_1.default.client.getUserId(), "_").concat(Date.now()),
                            info: {
                                mimetype: "audio/webm",
                                size: this.recordingBlob.size
                            },
                            msgtype: "m.audio",
                            url: audioMxc
                        };
                        if (duration < Infinity)
                            theContent.info.duration = duration;
                        return [4 /*yield*/, client_js_1.default.client.sendMessage(this.props.roomId, theContent)];
                    case 2:
                        eventI = _a.sent();
                        this.props.handlePending(theContent, eventI);
                        this.props.done();
                        return [3 /*break*/, 4];
                    case 3:
                        alert("Before submitting, you need to record something");
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    RecordAudioInput.prototype.render = function (props, state) {
        return <preact_1.Fragment>
      <div onclick={this.clickHandler} id="audioRecordingWrapper">
        <audio style={{ display: state.recordingAvailable ? "block" : "none" }} ref={this.mediaPreview}/>
        {state.recording === "started" ? <audioVisualizer_js_1.default stream={this.stream}/> : null}
        {this.recordingIcon()}
      </div>
      {this.state.progress
                ? <div id="media-uploader-progress">
          <span>Uploading recording</span>
          <progress class="styled-progress" max={state.progress.total} value={state.progress.loaded}/>
        </div>
                : null}
    </preact_1.Fragment>;
    };
    return RecordAudioInput;
}(RecordMediaInput));

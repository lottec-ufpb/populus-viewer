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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var preact_1 = require("preact");
require("./styles/fileUpload.css");
var constants_js_1 = require("./constants.js");
var alerts_js_1 = require("./utils/alerts.js");
var pdfCanvas_js_1 = require("./pdfCanvas.js");
var PDFJS = require("pdfjs-dist/webpack");
var Matrix = require("matrix-js-sdk");
var wavesurfer_js_1 = require("wavesurfer.js");
var tooltip_js_1 = require("./utils/tooltip.js");
var avatarSelector_js_1 = require("./avatarSelector.js");
var colors_js_1 = require("./utils/colors.js");
var math_js_1 = require("./utils/math.js");
var Icons = require("./icons.js");
var client_js_1 = require("./client.js");
var FileUpload = /** @class */ (function (_super) {
    __extends(FileUpload, _super);
    function FileUpload(props) {
        var _this = _super.call(this, props) || this;
        _this.queryAliasTimeout = null;
        _this.mainForm = (0, preact_1.createRef)();
        _this.fileLoader = (0, preact_1.createRef)();
        _this.roomTopicInput = (0, preact_1.createRef)();
        _this.avatarSelector = (0, preact_1.createRef)();
        _this.submitButton = (0, preact_1.createRef)();
        _this.uploadPreview = (0, preact_1.createRef)();
        _this.progressHandler = function (progress) { return _this.setState({ progress: progress }); };
        _this.keydownHandler = function (e) { return e.stopPropagation(); };
        _this.chooseFile = function (_) { return _this.fileLoader.current.click(); };
        _this.clearFile = function (_) { return _this.setState({ fileValid: false }, _this.fileLoader.current.reset); };
        _this.nameInputHandler = function (e) {
            e.stopPropagation();
            _this.setState({ name: e.target.value }, _this.validateAlias);
        };
        _this.topicInputHandler = function (e) {
            e.stopPropagation();
            _this.roomTopicInput.current.style.height = "auto";
            _this.roomTopicInput.current.style.height = "".concat(_this.roomTopicInput.current.scrollHeight, "px");
        };
        _this.handleToggle = function (_) { return _this.setState(function (oldState) { return { details: !oldState.details }; }); };
        _this.aliasInputHandler = function (e) {
            e.stopPropagation();
            _this.setState({ alias: _this.toAlias(e.target.value) }, _this.validateAlias);
        };
        _this.externalURLInputHandler = function (e) {
            e.stopPropagation();
            _this.setState({ externalURL: e.target.value }, _this.validateURL);
        };
        _this.validateAlias = function () {
            clearTimeout(_this.queryAliasTimeout);
            _this.setState({ queryingAlias: true });
            var alias = _this.state.alias.length > 0 ? _this.state.alias : _this.toAlias(_this.state.name);
            _this.queryAliasTimeout = setTimeout(function (_) {
                client_js_1.default.client.getRoomIdForAlias("#".concat(alias, ":").concat(client_js_1.default.client.getDomain()))
                    .then(function (_) { return _this.setState({ queryingAlias: false, aliasAvailable: false }); })
                    .catch(function (err) {
                    if (alias === "")
                        _this.setState({ queryingAlias: false, aliasAvailable: false });
                    else if (err.errcode === "M_NOT_FOUND")
                        _this.setState({ queryingAlias: false, aliasAvailable: true });
                    else
                        alert(err);
                });
            }, 1000);
        };
        _this.validateURL = function () {
            clearTimeout(_this.queryURLTimeout);
            var urlValid = _this.state.externalURL.match(/^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/);
            if (!urlValid) {
                _this.setState({ urlDefect: "Invalid URL", queryingURL: false });
                return;
            }
            _this.setState({ urlDefect: null, queryingURL: true });
            _this.queryURLTimeout = setTimeout(function (_) {
                fetch(_this.state.externalURL, { method: "HEAD" })
                    .then(function (response) {
                    var urlContentType = response.headers.get("content-type");
                    var fileTypeValid = _this.validateFileType(urlContentType);
                    _this.setState({
                        urlDefect: fileTypeValid ? null : "Found ".concat(urlContentType, " \u2014 not an annotatable file type"),
                        queryingURL: false,
                        urlContentType: urlContentType,
                    });
                })
                    .catch(function (e) { return _this.setState({
                    urlDefect: "Couldn't connect — Likely cross-domain access is forbidden",
                    queryingURL: false,
                    urlContentType: null
                }, console.log(e)); });
            }, 1000);
        };
        _this.validateFile = function () {
            var theFile = _this.fileLoader.current.files[0];
            var limit = client_js_1.default.mediaConfig["m.upload.size"];
            var fileValid = _this.validateFileType(theFile.type) && !(theFile.size >= limit);
            _this.setState({ fileValid: fileValid });
            if (!fileValid) {
                if (theFile.size >= limit)
                    alert("Sorry, this file is too large to be uploaded. Your current server limits uploads to ".concat((0, math_js_1.formatBytes)(limit), "."));
                else
                    alert("It looks like you might be uploading an unsupported filetype. Please make sure that the file you're uploading is of a supported filetype and has the right extension at the end of its name.");
                _this.mainForm.current.reset();
            }
        };
        _this.uploadError = function (e) {
            alert("Something went wrong while uploading. here's the message: ".concat(e.message));
            _this.submitButton.current.setAttribute("disabled", false);
        };
        _this.uploadHandler = function (e) { return __awaiter(_this, void 0, void 0, function () {
            var room_id, _a, theRoom;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        e.preventDefault();
                        if (!(0, alerts_js_1.onlineOrAlert)())
                            return [2 /*return*/];
                        this.submitButton.current.setAttribute("disabled", true);
                        if (!this.state.fileValid) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.uploadFile()];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.uploadExternalLink()];
                    case 3:
                        _a = _b.sent();
                        _b.label = 4;
                    case 4:
                        room_id = _a;
                        return [4 /*yield*/, client_js_1.default.client.getRoomWithState(room_id)];
                    case 5:
                        theRoom = _b.sent();
                        return [4 /*yield*/, this.avatarSelector.current.uploadAvatar(theRoom)];
                    case 6:
                        _b.sent();
                        this.mainForm.current.reset();
                        this.props.showMainView();
                        return [2 /*return*/];
                }
            });
        }); };
        _this.uploadFile = function () { return __awaiter(_this, void 0, void 0, function () {
            var theFile, waveformMxc, response, room_id;
            var _a, _b;
            var _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        theFile = this.fileLoader.current.files[0];
                        if (!((_d = (_c = this.uploadPreview) === null || _c === void 0 ? void 0 : _c.current) === null || _d === void 0 ? void 0 : _d.pcm)) return [3 /*break*/, 2];
                        return [4 /*yield*/, client_js_1.default.client.uploadContent(JSON.stringify((_f = (_e = this.uploadPreview) === null || _e === void 0 ? void 0 : _e.current) === null || _f === void 0 ? void 0 : _f.pcm), { progressHandler: this.progressHandler })
                                .catch(this.uploadError)];
                    case 1:
                        waveformResponse = _g.sent();
                        _g.label = 2;
                    case 2: return [4 /*yield*/, client_js_1.default.client.uploadContent(theFile, { progressHandler: this.progressHandler })
                            .catch(this.uploadError)];
                    case 3:
                        response = _g.sent();
                        return [4 /*yield*/, client_js_1.default.client.createRoom({
                                room_alias_name: this.state.alias.length > 0
                                    ? this.state.alias
                                    : this.toAlias(this.state.name),
                                visibility: "private",
                                name: this.state.name,
                                topic: this.roomTopicInput.current.value,
                                // We declare the room a space
                                creation_content: (_a = {
                                        type: "m.space"
                                    },
                                    _a[constants_js_1.mscResourceData] = {
                                        "m.file": {
                                            url: response.content_uri,
                                            name: theFile.name,
                                            mimetype: theFile.type,
                                            size: theFile.size
                                        }
                                    },
                                    _a),
                                initial_state: __spreadArray([
                                    // we allow anyone to join, by default, for now
                                    {
                                        type: Matrix.EventType.RoomJoinRules,
                                        state_key: "",
                                        content: { join_rule: "public" }
                                    }
                                ], (waveformMxc
                                    ? [{
                                            type: constants_js_1.populusWaveformPCM,
                                            state_key: "",
                                            content: { mxc: waveformResponse.content_uri },
                                        }]
                                    : []), true),
                                power_level_content_override: {
                                    events: (_b = {},
                                        // we allow anyone to annotate, by default, for now
                                        _b[Matrix.EventType.SpaceChild] = 0,
                                        _b)
                                }
                            }).catch(alert)
                            // make sure we've got the room before returning to the main view
                        ];
                    case 4:
                        room_id = (_g.sent()).room_id;
                        // make sure we've got the room before returning to the main view
                        return [2 /*return*/, room_id];
                }
            });
        }); };
        _this.uploadExternalLink = function () { return __awaiter(_this, void 0, void 0, function () {
            var room_id;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, client_js_1.default.client.createRoom({
                            room_alias_name: this.state.alias.length > 0
                                ? this.state.alias
                                : this.toAlias(this.state.name),
                            visibility: "private",
                            name: this.state.name,
                            topic: this.roomTopicInput.current.value,
                            // We declare the room a space
                            creation_content: (_a = {
                                    type: "m.space"
                                },
                                _a[constants_js_1.mscResourceData] = {
                                    url: this.state.externalURL,
                                    mimetype: this.state.urlContentType,
                                },
                                _a),
                            initial_state: [
                                // we allow anyone to join, by default, for now
                                {
                                    type: Matrix.EventType.RoomJoinRules,
                                    state_key: "",
                                    content: { join_rule: "public" }
                                },
                            ],
                            power_level_content_override: {
                                events: (_b = {},
                                    // we allow anyone to annotate, by default, for now
                                    _b[Matrix.EventType.SpaceChild] = 0,
                                    _b)
                            }
                        }).catch(alert)
                        // make sure we've got the room before returning to the main view
                    ];
                    case 1:
                        room_id = (_c.sent()).room_id;
                        // make sure we've got the room before returning to the main view
                        return [2 /*return*/, room_id];
                }
            });
        }); };
        _this.state = {
            queryingAlias: false,
            aliasAvailable: false,
            urlDefect: "Invalid URL",
            fileValid: false,
            name: "",
            alias: "",
            details: false
        };
        return _this;
    }
    FileUpload.prototype.validateFileType = function (type) {
        switch (type) {
            case "application/pdf": return true;
            case "audio/wav": return true;
            case "audio/mpeg": return true;
            case "audio/mp4": return true;
            case "audio/x-m4a": return true;
            case "audio/aac": return true;
            case "audio/aacp": return true;
            case "audio/flac": return true;
            case "video/mp4": return true;
            case "video/mpeg": return true;
            case "video/webm": return true;
        }
        if (type === null || type === void 0 ? void 0 : type.match(/^image/))
            return true;
        return false;
    };
    FileUpload.prototype.toAlias = function (s) {
        // replace forbidden characters
        return s.replace(/[\s:]/g, '_');
    };
    FileUpload.prototype.render = function (_, state) {
        return <div id="file-upload">
      <h2> Upload a new file</h2>
      <hr class="styled-rule"/>
      {state.fileValid
                ? <preact_1.Fragment>
          <FileUploadPreview uploadPreview={this.uploadPreview} file={this.fileLoader.current.files[0]}/> 
          <hr class="styled-rule"/>
        </preact_1.Fragment>
                : null}
      <form id="file-upload-form" ref={this.mainForm} onsubmit={this.uploadHandler}>
        <label for="file">File to Discuss</label>
        <div id="file-upload-chooser"> {state.fileValid
                ? <preact_1.Fragment>
              <span>{this.fileLoader.current.files[0].name}</span>
              <button type="button" onclick={this.clearFile} class="small-icon">{Icons.close}</button>
            </preact_1.Fragment>
                : <button type="button" class="styled-button" onclick={this.chooseFile}>Click to Choose a File</button>}
          <input name="file" oninput={this.validateFile} ref={this.fileLoader} accept="application/pdf, audio/wav, audio/mpeg, audio/x-m4a, audio/mp4, audio/aac, audio/aacp, audio/flac, video/mp4, video/mpeg, video/webm, image/*" type="file"/>
        </div>
        <div class="file-upload-form-detail">
          {state.fileValid
                ? (0, math_js_1.formatBytes)(this.fileLoader.current.files[0].size)
                : <span>&nbsp;</span>}
        </div>
        <label for="discussion">Name for Discussion</label>
        <input class="styled-input" name="discussion" value={state.name} onkeydown={this.keydownHandler} oninput={this.nameInputHandler} type="text"/>
        {state.details
                ? null
                : <div class="file-upload-form-detail">{state.queryingAlias
                        ? "querying..."
                        : state.aliasAvailable
                            ? "name available"
                            : "name unavailable"}
          </div>}
        <label class="top-aligned-label" for="topic">Room Avatar</label>
        <avatarSelector_js_1.default ref={this.avatarSelector} progressHandler={this.progressHandler}/>
        <div class="file-upload-form-detail">Add an image to display with this discussion</div>
        <label class="top-aligned-label" for="topic">Topic of Discussion</label>
        <textarea class="styled-input" name="topic" onkeydown={this.keydownHandler} oninput={this.topicInputHandler} ref={this.roomTopicInput} type="text" data-gramm="false" // disable grammarly
        />
        <details open={state.details} ontoggle={this.handleToggle}>
          <summary>Advanced Settings</summary>
          <div class="file-upload-details-wrapper">
            <label for="discussion">Canonical Alias</label>
            <input class="styled-input" name="discussion" value={state.alias} placeholder={this.toAlias(state.name)} oninput={this.aliasInputHandler} type="text"/>
            {!state.details
                ? null
                : <div class="file-upload-form-detail">{state.queryingAlias
                        ? "querying..."
                        : state.aliasAvailable
                            ? "alias available"
                            : "alias unavailable"}
              </div>}
            <label for="external-url">External URL</label>
            <input class="styled-input" name="external-url" value={state.externalURL} placeholder={"URL to an external resource"} onkeydown={this.keydownHandler} oninput={this.externalURLInputHandler} type="text"/>
            {!state.details
                ? null
                : <div class="file-upload-form-detail">{state.fileValid
                        ? "Remove file selection to use external URL"
                        : state.queryingURL
                            ? "Checking url..."
                            : state.urlDefect
                                ? state.urlDefect
                                : "Valid URL - found ".concat(state.urlContentType)}
              </div>}
          </div>
        </details>
        <div id="file-upload-form-submit">
          <button disabled={state.progress || state.queryingAlias || !state.aliasAvailable || !(state.fileValid || !state.urlDefect)} class="styled-button" ref={this.submitButton} type="submit">
            {state.progress ? "Uploading..." : "Create Discussion"}
          </button>
        </div>
        {state.progress
                ? <div id="file-upload-form-progress">
            <progress class="styled-progress" max={state.progress.total} value={state.progress.loaded}/>
          </div>
                : null}
      </form>
    </div>;
    };
    return FileUpload;
}(preact_1.Component));
exports.default = FileUpload;
var FileUploadPreview = /** @class */ (function (_super) {
    __extends(FileUploadPreview, _super);
    function FileUploadPreview() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FileUploadPreview.prototype.render = function (props) {
        if (props.file.type === "application/pdf")
            return <PdfUploadPreview ref={props.uploadPreview} key={props.file.name} file={props.file}/>;
        if (props.file.type.match(/^image/))
            return <ImageUploadPreview ref={props.uploadPreview} key={props.file.name} file={props.file}/>;
        if (props.file.type.match(/^audio|^video/))
            return <MediaUploadPreview ref={props.uploadPreview} key={props.file.name} file={props.file}/>;
        return <GenericUploadPreview ref={props.uploadPreview} file={props.file}/>;
    };
    return FileUploadPreview;
}(preact_1.Component));
var PdfUploadPreview = /** @class */ (function (_super) {
    __extends(PdfUploadPreview, _super);
    function PdfUploadPreview(props) {
        var _this = _super.call(this, props) || this;
        _this.textLayer = (0, preact_1.createRef)();
        _this.nextPage = function (_) {
            if (_this.state.pdfPage < _this.state.totalPages)
                _this.setState(function (oldState) { return { pdfPage: oldState.pdfPage + 1 }; });
        };
        _this.prevPage = function (_) {
            if (_this.state.pdfPage > 1)
                _this.setState(function (oldState) { return { pdfPage: oldState.pdfPage - 1 }; });
        };
        _this.setPdfDimensions = function (pdfHeightPx, pdfWidthPx) { return _this.setState({ pdfWidthPx: pdfWidthPx, pdfHeightPx: pdfHeightPx }); };
        _this.setPdfFitRatio = function (pdfFitRatio) { return _this.setState({ pdfFitRatio: pdfFitRatio }); };
        _this.userColor = new colors_js_1.UserColor(client_js_1.default.client.getUserId());
        _this.pdfUrl = URL.createObjectURL(_this.props.file);
        _this.state = {
            pdfPromise: PDFJS.getDocument(_this.pdfUrl).promise,
            pdfPage: 1
        };
        return _this;
    }
    PdfUploadPreview.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pdf;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.state.pdfPromise];
                    case 1:
                        pdf = _a.sent();
                        this.setState({ totalPages: pdf.numPages });
                        return [2 /*return*/];
                }
            });
        });
    };
    PdfUploadPreview.prototype.componentWillUnmount = function () { URL.revokeObjectURL(this.pdfUrl); };
    PdfUploadPreview.prototype.render = function (_props, state) {
        var dynamicDocumentStyle = {
            "--pdfFitRatio": state.pdfFitRatio,
            "--pdfWidthPx": "".concat(state.pdfWidthPx, "px"),
            "--pdfHeightPx": "".concat(state.pdfHeightPx, "px"),
            "--selectColor": this.userColor.solid,
        };
        return <div id="pdf-upload-preview">
        <div id="pdf-upload-preview-outer-wrapper" style={dynamicDocumentStyle}>
          <div id="pdf-upload-preview-wrapper" style={dynamicDocumentStyle}>
          <pdfCanvas_js_1.default pdfScale={1} setPdfDimensions={this.setPdfDimensions} setPdfFitRatio={this.setPdfFitRatio} hasFetched={true} pdfPromise={state.pdfPromise} textLayer={this.textLayer} pageFocused={state.pdfPage} setPdfLoadingStatus={function (_) { }}/>
        </div>
      </div>
      <div id="pdf-upload-preview-controls">
        <button onClick={this.prevPage} id="document-preview-prev">{Icons.chevronLeft}</button>
        <button onClick={this.nextPage} id="document-preview-next">{Icons.chevronRight}</button>
      </div>
    </div>;
    };
    return PdfUploadPreview;
}(preact_1.Component));
var MediaUploadPreview = /** @class */ (function (_super) {
    __extends(MediaUploadPreview, _super);
    function MediaUploadPreview(props) {
        var _this = _super.call(this, props) || this;
        _this.videoElement = (0, preact_1.createRef)();
        _this.generatePeaks = function (_) {
            if (!confirm("Warning: this operation is memory intensive, and may not work well on mobile devices. Continue?"))
                return;
            _this.wavesurfer.once('waveform-ready', function (_) {
                _this.wavesurfer.exportPCM(_this.wavesurfer.getDuration() * 6, 10000, true).then(function (pcm) {
                    _this.pcm = pcm;
                    setTimeout(function (_) {
                        _this.wavesurfer.load(_this.videoElement.current || _this.mediaUrl, _this.pcm), 1000;
                    });
                });
            });
            _this.wavesurfer.load(_this.videoElement.current || _this.mediaUrl);
        };
        _this.playPause = function (_) {
            if (_this.state.playing) {
                _this.setState({ playing: false });
                _this.wavesurfer.pause();
            }
            else {
                _this.wavesurfer.seekAndCenter(_this.wavesurfer.getCurrentTime() / _this.wavesurfer.getDuration());
                //setting lastLeft is necessary to prevent the jump from canceling autocenter
                _this.lastLeft = _this.wavesurfer.drawer.wrapper.scrollLeft;
                _this.wavesurfer.drawer.params.autoCenter = true;
                _this.wavesurfer.play();
                _this.setState({ playing: true });
            }
        };
        _this.state = { playing: false };
        _this.mediaUrl = URL.createObjectURL(props.file);
        _this.isVideo = props.file.type.match(/^video/);
        return _this;
    }
    MediaUploadPreview.prototype.componentDidMount = function () {
        var _this = this;
        var pcm = [];
        var prng = (0, math_js_1.mulberry32)((0, math_js_1.hashString)(this.props.file.name));
        if (this.isVideo)
            this.videoElement.current.src = this.mediaUrl;
        for (var i = 0; i < 2048; i++)
            pcm.push((prng() * 2) - 1);
        this.wavesurfer = new wavesurfer_js_1.default.create({
            container: '#media-upload-preview-waveform',
            backend: 'MediaElement',
            barWidth: 5,
            scrollParent: true,
        });
        this.wavesurfer.on('scroll', function (e) {
            if (Math.abs(_this.lastLeft - e.target.scrollLeft) > 25) {
                _this.wavesurfer.drawer.params.autoCenter = false;
            }
            else {
                _this.lastLeft = e.target.scrollLeft;
            }
        });
        this.wavesurfer.load(this.videoElement.current || this.mediaUrl, pcm);
    };
    MediaUploadPreview.prototype.componentWillUnmount = function () {
        if (this.wavesurfer)
            this.wavesurfer.destroy();
        URL.revokeObjectURL(this.mediaUrl);
    };
    MediaUploadPreview.prototype.render = function (_props, state) {
        return <div id="media-upload-preview">
      {this.isVideo ? <video ref={this.videoElement}/> : null}
      <div id="media-upload-preview-waveform">
      </div>
      <div id="media-upload-preview-controls">
        <tooltip_js_1.default content={state.playing ? "Pause preview" : "Play preview"}>
          <button onClick={this.playPause}>{state.playing ? Icons.pauseButton : Icons.playButton}</button>
        </tooltip_js_1.default>
        <tooltip_js_1.default content={"Improve waveform"}>
          <button onClick={this.generatePeaks}>{Icons.waveform}</button>
        </tooltip_js_1.default>
      </div>
    </div>;
    };
    return MediaUploadPreview;
}(preact_1.Component));
var ImageUploadPreview = /** @class */ (function (_super) {
    __extends(ImageUploadPreview, _super);
    function ImageUploadPreview(props) {
        var _this = _super.call(this, props) || this;
        _this.imageUrl = URL.createObjectURL(_this.props.file);
        return _this;
    }
    ImageUploadPreview.prototype.componentWillUnmount = function () {
        URL.revokeObjectURL(this.imageUrl);
    };
    ImageUploadPreview.prototype.render = function () {
        return <div id="image-upload-preview">
      <img src={this.imageUrl}/>
    </div>;
    };
    return ImageUploadPreview;
}(preact_1.Component));
var GenericUploadPreview = /** @class */ (function (_super) {
    __extends(GenericUploadPreview, _super);
    function GenericUploadPreview() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GenericUploadPreview.prototype.render = function (props) {
        return <div id="generic-upload-preview">
      <span>{Icons.file}</span>{props.file.name} : {props.file.size} bytes
    </div>;
    };
    return GenericUploadPreview;
}(preact_1.Component));

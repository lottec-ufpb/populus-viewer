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
exports.AudioMessage = exports.VideoMessage = exports.ImageMessage = exports.FileMessage = exports.NoticeMessage = exports.AnnotationMessage = exports.EmoteMessage = exports.TextMessage = void 0;
exports.DisplayContent = DisplayContent;
var preact_1 = require("preact");
var sanitize_html_1 = require("sanitize-html");
var latex_js_1 = require("./latex.js");
var colors_js_1 = require("./utils/colors.js");
var constants_js_1 = require("./constants.js");
var links_js_1 = require("./links.js");
var temporal_js_1 = require("./utils/temporal.js");
var math_js_1 = require("./utils/math.js");
var userInfoHeader_js_1 = require("./userInfoHeader.js");
var messageFrame_js_1 = require("./messageFrame.js");
var mediaModal_js_1 = require("./mediaModal.js");
var blurhashCanvas_js_1 = require("./blurhashCanvas.js");
var location_js_1 = require("./utils/location.js");
var client_js_1 = require("./client.js");
var locationPreview_js_1 = require("./locationPreview.js");
var Replies = require("./utils/replies.js");
var Icons = require("./icons.js");
require("./styles/message.css");
var TextMessage = /** @class */ (function (_super) {
    __extends(TextMessage, _super);
    function TextMessage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.messageBody = (0, preact_1.createRef)();
        return _this;
    }
    TextMessage.prototype.componentDidMount = function () {
        (0, latex_js_1.renderLatexInElement)(this.messageBody.current);
        (0, links_js_1.processLinks)(this.messageBody.current);
    };
    TextMessage.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.replacingEventId !== this.props.replacingEventId) {
            (0, latex_js_1.renderLatexInElement)(this.messageBody.current);
            (0, links_js_1.processLinks)(this.messageBody.current);
        }
    };
    TextMessage.prototype.render = function (props) {
        var content = this.props.event.getContent();
        var isReply = Replies.isReply(content);
        return <messageFrame_js_1.default canEdit={true} displayOnly={props.displayOnly} reactions={props.reactions} canRedact={props.canRedact} event={props.event}>
      <div ref={this.messageBody} class="message-body">
        {isReply ? <ReplyPreview resourceAlias={props.resourceAlias} reactions={props.reactions} event={props.event}/> : null}
        <DisplayContent content={content}/>
      </div>
    </messageFrame_js_1.default>;
    };
    return TextMessage;
}(preact_1.Component));
exports.TextMessage = TextMessage;
var EmoteMessage = /** @class */ (function (_super) {
    __extends(EmoteMessage, _super);
    function EmoteMessage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.messageBody = (0, preact_1.createRef)();
        _this.sender = client_js_1.default.client.getUser(_this.props.event.getSender());
        _this.userColor = new colors_js_1.UserColor(_this.props.event.getSender());
        return _this;
    }
    EmoteMessage.prototype.componentDidMount = function () {
        (0, latex_js_1.renderLatexInElement)(this.messageBody.current);
        (0, links_js_1.processLinks)(this.messageBody.current);
    };
    EmoteMessage.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.reactions[this.props.event.getId()] !== prevProps.reactions[prevProps.event.getId()]) {
            (0, latex_js_1.renderLatexInElement)(this.messageBody.current);
            (0, links_js_1.processLinks)(this.messageBody.current);
        }
    };
    EmoteMessage.prototype.render = function (props) {
        var content = props.event.getContent();
        return <messageFrame_js_1.default displayOnly={props.displayOnly} reactions={props.reactions} event={props.event}>
      <div ref={this.messageBody} class="message-body">
        <div class="emote-banner" style={this.userColor.styleVariables}>
          {this.sender.displayName}:
        </div>
        <DisplayContent content={content}/>
      </div>
    </messageFrame_js_1.default>;
    };
    return EmoteMessage;
}(preact_1.Component));
exports.EmoteMessage = EmoteMessage;
var AnnotationMessage = /** @class */ (function (_super) {
    __extends(AnnotationMessage, _super);
    function AnnotationMessage() {
        var _a;
        var _this = _super.apply(this, arguments) || this;
        _this.handleClick = function (_) {
            if (_this.hasFocus())
                _this.props.setSecondaryFocus(null);
        };
        _this.handleLinkClick = function (e) {
            e.stopPropagation();
            if (!_this.hasFocus())
                _this.props.setSecondaryFocus(_this.location);
        };
        _this.sender = client_js_1.default.client.getUser(_this.props.event.getSender());
        _this.userColor = new colors_js_1.UserColor(_this.props.event.getSender());
        _this.location = new location_js_1.default(_this.props.event);
        _this.hasFocus = function (_) { return _this.location === _this.props.secondaryFocus; };
        _this.mediaRect = (_a = _this.location) === null || _a === void 0 ? void 0 : _a.getMediaRect();
        return _this;
    }
    AnnotationMessage.prototype.render = function (props) {
        var _a, _b;
        var locationType = this.location.getType();
        if (!locationType)
            return;
        return <messageFrame_js_1.default styleOverride={this.hasFocus() ? __assign({ background: this.userColor.ultralight }, this.userColor.styleVariables) : null} reactions={props.reactions} event={props.event} getCurrentEdit={this.getCurrentEdit}>
      <div onClick={this.handleClick} class="message-body">
          {locationType === "highlight" || locationType == "text"
                ? <span class="annotation-banner">
                  <span>On </span>
                  <a onClick={this.handleLinkClick} href={"".concat(window.location.origin).concat(window.location.pathname, "#/").concat(encodeURIComponent(props.resourceAlias), "/").concat(this.location.getPageIndex(), "/").concat(this.props.roomId)}>
                    page {this.location.getPageIndex()}
                  </a>:
              </span>
                : locationType == "media-fragment"
                    ? <span class="annotation-banner">
                {((_b = (_a = props.resource) === null || _a === void 0 ? void 0 : _a.mimetype) === null || _b === void 0 ? void 0 : _b.match(/^image/))
                            ? <preact_1.Fragment>
                    <span>Image selection at </span>
                    <a onClick={this.handleLinkClick} href={"".concat(window.location.origin).concat(window.location.pathname, "#/").concat(encodeURIComponent(props.resourceAlias), "/").concat(Math.floor(this.location.getIntervalStart() / 1000), "/").concat(this.props.roomId)}>
                      {this.mediaRect.x},{this.mediaRect.y}
                    </a>:
                  </preact_1.Fragment>
                            : <preact_1.Fragment>
                    <span>From </span>
                    <a onClick={this.handleLinkClick} href={"".concat(window.location.origin).concat(window.location.pathname, "#/").concat(encodeURIComponent(props.resourceAlias), "/").concat(Math.floor(this.location.getIntervalStart() / 1000), "/").concat(this.props.roomId)}>
                      {(0, temporal_js_1.toClockTime)(this.location.getIntervalStart() / 1000)} to {(0, temporal_js_1.toClockTime)(this.location.getIntervalEnd() / 1000)}
                    </a>:
                  </preact_1.Fragment>}
              </span>
                    : null}
          <locationPreview_js_1.default resource={props.resource} location={this.location}/>
        </div>
    </messageFrame_js_1.default>;
    };
    return AnnotationMessage;
}(preact_1.Component));
exports.AnnotationMessage = AnnotationMessage;
var ReplyPreview = /** @class */ (function (_super) {
    __extends(ReplyPreview, _super);
    // eventually will want a mechanism for refreshing on receipt of edits
    function ReplyPreview(props) {
        var _this = _super.call(this, props) || this;
        _this.replyPreview = (0, preact_1.createRef)();
        _this.handleLoad = function (_) { return _this.setState({ loaded: true }); };
        _this.fromLiveEvent = function (_) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            var content = (_a = _this.state.liveEvent) === null || _a === void 0 ? void 0 : _a.getContent();
            if (!content)
                return;
            var hasHtml = (content.format === "org.matrix.custom.html") && content.formatted_body;
            var isReply = Replies.isReply(content);
            var replyUrl = content.msgtype
                ? "".concat(window.location.origin).concat(window.location.pathname, "#/") +
                    "".concat(encodeURIComponent(_this.props.resourceAlias), "/_/") +
                    "".concat(_this.state.liveEvent.getRoomId(), "/") +
                    "".concat(_this.state.liveEvent.getId())
                : null; //redacted
            var senderColors = new colors_js_1.UserColor(_this.state.liveEvent.getSender());
            var displayBody;
            if (!_this.state.liveEvent.getContent().msgtype) {
                displayBody = <div class="redacted-preview">Original Message Deleted</div>;
            }
            else {
                switch (_this.state.liveEvent.getContent().msgtype) {
                    case "m.video": {
                        var info = ((_b = _this.state.liveEvent.getContent()) === null || _b === void 0 ? void 0 : _b.info.thumbnail_info) || ((_d = (_c = props.event) === null || _c === void 0 ? void 0 : _c.getContent()) === null || _d === void 0 ? void 0 : _d.info);
                        var blurhash = (_f = (_e = _this.state.liveEvent.getContent()) === null || _e === void 0 ? void 0 : _e.info) === null || _f === void 0 ? void 0 : _f.blurhash;
                        var thumbUrl = _this.state.liveEvent.getContent().info.thumbnail_url;
                        var poster = thumbUrl ? client_js_1.default.client.getHttpUriForMxcFromHS(thumbUrl) : null;
                        displayBody = <preact_1.Fragment>
            <video class="media-message-thumbnail" controls poster={poster} onloadedmetadata={_this.handleLoad} preload="metadata" src={client_js_1.default.client.getHttpUriForMxcFromHS(_this.state.liveEvent.getContent().url)}/>
            <blurhashCanvas_js_1.default height={info.h} width={info.w} blurhash={blurhash} class="media-message-blurhash"/>
          </preact_1.Fragment>;
                        break;
                    }
                    case "m.image": {
                        var info = ((_g = _this.state.liveEvent.getContent()) === null || _g === void 0 ? void 0 : _g.info.thumbnail_info) || ((_j = (_h = props.event) === null || _h === void 0 ? void 0 : _h.getContent()) === null || _j === void 0 ? void 0 : _j.info);
                        var blurhash = (_l = (_k = _this.state.liveEvent.getContent()) === null || _k === void 0 ? void 0 : _k.info) === null || _l === void 0 ? void 0 : _l.blurhash;
                        var thumbUrl = _this.state.liveEvent.getContent().info.thumbnail_url;
                        var url = thumbUrl ? client_js_1.default.client.getHttpUriForMxcFromHS(thumbUrl) : null;
                        displayBody = <preact_1.Fragment>
            <img onLoad={_this.handleLoad} loading="lazy" class="media-message-thumbnail" src={url}/>
            <blurhashCanvas_js_1.default height={info.h} width={info.w} blurhash={blurhash} class="media-message-blurhash"/>
          </preact_1.Fragment>;
                        break;
                    }
                    case "m.audio": {
                        displayBody = <audio controls src={client_js_1.default.client.getHttpUriForMxcFromHS(_this.state.liveEvent.getContent().url)}/>;
                        break;
                    }
                    case "m.file": {
                        displayBody = <div class="file-upload">
            <span>{Icons.file}</span>
            <a href={client_js_1.default.client.getHttpUriForMxcFromHS(_this.state.liveEvent.getContent().url)}>
              {_this.state.liveEvent.getContent().filename}
            </a>
            <span>{(0, math_js_1.formatBytes)((_m = _this.state.liveEvent.getContent().info) === null || _m === void 0 ? void 0 : _m.size)}</span>
          </div>;
                        break;
                    }
                    case "m.text": {
                        var displayPlain = isReply ? Replies.stripFallbackPlainString(content.body) : content.body;
                        var truncate = displayPlain.length > 375 && _this.state.truncate;
                        if (isReply && hasHtml) {
                            var displayHtml = (0, sanitize_html_1.default)(content.formatted_body, Replies.stripReply);
                            displayBody = <div onclick={_this.clearTruncate} data-truncate-reply={truncate} dangerouslySetInnerHTML={{ __html: displayHtml }}/>;
                        }
                        else if (hasHtml) {
                            displayBody = <div onclick={_this.clearTruncate} data-truncate-reply={truncate} dangerouslySetInnerHTML={{ __html: content.formatted_body }}/>;
                        }
                        else {
                            displayBody = <div onclick={_this.clearTruncate} data-truncate-reply={truncate}>{displayPlain}</div>;
                        }
                        break;
                    }
                    case "m.notice": {
                        var displayPlain = isReply ? Replies.stripFallbackPlainString(content.body) : content.body;
                        var truncate = displayPlain.length > 375 && _this.state.truncate;
                        if (isReply && hasHtml) {
                            var displayHtml = (0, sanitize_html_1.default)(content.formatted_body, Replies.stripReply);
                            displayBody = <div onclick={_this.clearTruncate} data-truncate-reply={truncate} dangerouslySetInnerHTML={{ __html: displayHtml }}/>;
                        }
                        else if (hasHtml) {
                            displayBody = <div onclick={_this.clearTruncate} data-truncate-reply={truncate} dangerouslySetInnerHTML={{ __html: content.formatted_body }}/>;
                        }
                        else {
                            displayBody = <div onclick={_this.clearTruncate} data-truncate-reply={truncate}>{displayPlain}</div>;
                        }
                    }
                }
            }
            return <preact_1.Fragment>
      <div class="reply-preface">
        <a href={replyUrl}>In reply to</a>:
      </div>
      <userInfoHeader_js_1.default isReply userId={_this.state.liveEvent.getSender()}/>
      <div ref={_this.replyPreview} data-media-message-loaded={_this.state.loaded} style={senderColors.styleVariables} class="reply-preview">
        {displayBody}
      </div>
    </preact_1.Fragment>;
        };
        _this.clearTruncate = function (_) {
            _this.setState({ truncate: false });
        };
        _this.fallbackPreview = function (_) {
            var content = _this.props.event.getContent();
            var hasHtml = (content.format === "org.matrix.custom.html") && content.formatted_body;
            var style = { '--user_light': 'lightgray' };
            return hasHtml
                ? <div style={style} class="reply-preview reply-fallback" dangerouslySetInnerHTML={{ __html: Replies.getFallbackHtml(content) }}/>
                : <div style={style} class="reply-preview reply-fallback">{Replies.getFallbackPlain(content)}</div>;
        };
        _this.state = { truncate: true };
        return _this;
    }
    ReplyPreview.prototype.componentDidMount = function () {
        this.getLiveEvent();
        (0, latex_js_1.renderLatexInElement)(this.replyPreview.current);
        (0, links_js_1.processLinks)(this.replyPreview.current);
    };
    ReplyPreview.prototype.componentDidUpdate = function () {
        this.getLiveEvent();
        (0, latex_js_1.renderLatexInElement)(this.replyPreview.current);
        (0, links_js_1.processLinks)(this.replyPreview.current);
    };
    ReplyPreview.prototype.getLiveEvent = function () {
        return __awaiter(this, void 0, void 0, function () {
            var inReplyToId, roomId, theRoom, inReplyTo, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.state.liveEvent) return [3 /*break*/, 4];
                        inReplyToId = this.props.event.getContent()["m.relates_to"]["m.in_reply_to"].event_id;
                        roomId = this.props.event.getRoomId();
                        theRoom = client_js_1.default.client.getRoom(roomId);
                        if (!theRoom)
                            return [2 /*return*/]; // room state not ready
                        inReplyTo = theRoom.findEventById(inReplyToId);
                        if (inReplyTo)
                            this.setState({ liveEvent: inReplyTo });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        console.log("trying to retrive live event");
                        return [4 /*yield*/, client_js_1.default.client.getEventTimeline(theRoom.getUnfilteredTimelineSet(), inReplyToId)];
                    case 2:
                        _a.sent();
                        console.log("retrived");
                        this.setState({ liveEvent: theRoom.findEventById(inReplyToId) });
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        // the above uses the event-context route, which isn't implemented yet in Dendrite:
                        //
                        // https://github.com/matrix-org/dendrite/issues/670
                        //
                        // Hence, 404s right now.
                        console.log("couldn't retrieve - is this a dendrite server? see https://github.com/matrix-org/dendrite/issues/670");
                        console.log(e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ReplyPreview.prototype.render = function (_props, state) {
        if (state.liveEvent)
            return this.fromLiveEvent();
        return this.fallbackPreview();
    };
    return ReplyPreview;
}(preact_1.Component));
var NoticeMessage = /** @class */ (function (_super) {
    __extends(NoticeMessage, _super);
    function NoticeMessage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.messageBody = (0, preact_1.createRef)();
        _this.noticeStyle = {
            "--user_ultralight": "hsl(0,0%, 95%)",
            "--user_light": "hsl(0,0%, 80%)",
            "--user_solid": "hsl(0,0%, 50%)",
            "--user_dark": "hsl(0,0%, 20%)"
        };
        return _this;
    }
    NoticeMessage.prototype.componentDidMount = function () {
        (0, latex_js_1.renderLatexInElement)(this.messageBody.current);
    };
    NoticeMessage.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.reactions[this.props.event.getId()] !== prevProps.reactions[prevProps.event.getId()]) {
            (0, latex_js_1.renderLatexInElement)(this.messageBody.current);
        }
    };
    NoticeMessage.prototype.render = function (props) {
        var content = props.event.getContent();
        var isReply = Replies.isReply(content);
        return <messageFrame_js_1.default displayOnly={props.displayOnly} reactions={props.reactions} canRedact={props.canRedact} styleOverride={this.noticeStyle} event={props.event}>
      <div ref={this.messageBody} class="message-body">
        {isReply ? <ReplyPreview resourceAlias={props.resourceAlias} reactions={props.reactions} event={props.event}/> : null}
        <DisplayContent content={content}/>
      </div>
    </messageFrame_js_1.default>;
    };
    return NoticeMessage;
}(preact_1.Component));
exports.NoticeMessage = NoticeMessage;
function DisplayContent(props) {
    var content = props.content;
    var isReply = Replies.isReply(content);
    var isEmoji = /^\s*(\p{Extended_Pictographic}\p{Emoji_Component}*){1,3}\s*$/u.test(content.body);
    if ((!isEmoji && content.format === "org.matrix.custom.html") && content.formatted_body) {
        return <div dangerouslySetInnerHTML={{ __html: (0, sanitize_html_1.default)(isReply
                    ? (0, sanitize_html_1.default)(content.formatted_body, Replies.stripReply)
                    : content.formatted_body, constants_js_1.sanitizeHtmlParams)
            }}/>;
    }
    else {
        return <div class={isEmoji ? "large-emoji-display" : null}>
      {isReply
                ? Replies.stripFallbackPlainString(content.body)
                : content.body}
    </div>;
    }
}
var FileMessage = /** @class */ (function (_super) {
    __extends(FileMessage, _super);
    function FileMessage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.userColor = new colors_js_1.UserColor(_this.props.event.getSender());
        _this.isMe = _this.props.event.getSender() === client_js_1.default.client.getUserId();
        _this.url = client_js_1.default.client.getHttpUriForMxcFromHS(_this.props.event.getContent().url);
        return _this;
    }
    FileMessage.prototype.render = function (props) {
        var _a;
        var filename = props.event.getContent().filename;
        var size = (_a = props.event.getContent().info) === null || _a === void 0 ? void 0 : _a.size;
        return <messageFrame_js_1.default displayOnly={props.displayOnly} reactions={props.reactions} canRedact={props.canRedact} event={props.event}>
        <div class="message-body">
          <div class="file-upload">
            <span>{Icons.file}</span>
            <a href={this.url} download={filename}>{filename}</a>
            <span> {(0, math_js_1.formatBytes)(size)} </span>
          </div>
        </div>
    </messageFrame_js_1.default>;
    };
    return FileMessage;
}(preact_1.Component));
exports.FileMessage = FileMessage;
var ImageMessage = /** @class */ (function (_super) {
    __extends(ImageMessage, _super);
    function ImageMessage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.userColor = new colors_js_1.UserColor(_this.props.event.getSender());
        _this.isMe = _this.props.event.getSender() === client_js_1.default.client.getUserId();
        _this.url = _this.props.event.getContent().info.thumbnail_url
            ? client_js_1.default.client.getHttpUriForMxcFromHS(_this.props.event.getContent().info.thumbnail_url)
            : client_js_1.default.client.getHttpUriForMxcFromHS(_this.props.event.getContent().url);
        _this.showPreview = function (_) {
            var url = client_js_1.default.client.getHttpUriForMxcFromHS(_this.props.event.getContent().url);
            mediaModal_js_1.default.set(<img src={url}/>, url);
        };
        _this.handleLoad = function (_) { return _this.setState({ loaded: true }); };
        return _this;
    }
    // TODO need some sort of modal popup providing a preview of the full video
    ImageMessage.prototype.render = function (props, state) {
        var _a, _b, _c, _d, _e, _f;
        var info = ((_a = props.event.getContent()) === null || _a === void 0 ? void 0 : _a.info.thumbnail_info) || ((_c = (_b = props.event) === null || _b === void 0 ? void 0 : _b.getContent()) === null || _c === void 0 ? void 0 : _c.info);
        var blurhash = (_f = (_e = (_d = props.event) === null || _d === void 0 ? void 0 : _d.getContent()) === null || _e === void 0 ? void 0 : _e.info) === null || _f === void 0 ? void 0 : _f.blurhash;
        return <messageFrame_js_1.default displayOnly={props.displayOnly} reactions={props.reactions} canRedact={props.canRedact} event={props.event}>
        <div class="message-body media-message" data-media-message-loaded={state.loaded}>
          <img onclick={this.showPreview} onLoad={this.handleLoad} loading="lazy" class="media-message-thumbnail" src={this.url}/>
          <blurhashCanvas_js_1.default height={info.h} width={info.w} blurhash={blurhash} class="media-message-blurhash"/>
        </div>
    </messageFrame_js_1.default>;
    };
    return ImageMessage;
}(preact_1.Component));
exports.ImageMessage = ImageMessage;
var VideoMessage = /** @class */ (function (_super) {
    __extends(VideoMessage, _super);
    function VideoMessage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.userColor = new colors_js_1.UserColor(_this.props.event.getSender());
        _this.isMe = _this.props.event.getSender() === client_js_1.default.client.getUserId();
        _this.content = _this.props.event.getContent();
        _this.poster = _this.content.info.thumbnail_url
            ? client_js_1.default.client.getHttpUriForMxcFromHS(_this.content.info.thumbnail_url)
            : null;
        _this.handleLoad = function (_) { return _this.setState({ loaded: true }); };
        _this.url = client_js_1.default.client.getHttpUriForMxcFromHS(_this.content.url);
        return _this;
    }
    VideoMessage.prototype.render = function (props, state) {
        var _a, _b, _c, _d, _e, _f;
        var info = ((_a = props.event.getContent()) === null || _a === void 0 ? void 0 : _a.info.thumbnail_info) || ((_c = (_b = props.event) === null || _b === void 0 ? void 0 : _b.getContent()) === null || _c === void 0 ? void 0 : _c.info);
        var blurhash = (_f = (_e = (_d = props.event) === null || _d === void 0 ? void 0 : _d.getContent()) === null || _e === void 0 ? void 0 : _e.info) === null || _f === void 0 ? void 0 : _f.blurhash;
        return <messageFrame_js_1.default displayOnly={props.displayOnly} reactions={props.reactions} canRedact={props.canRedact} event={props.event}>
        <div class="message-body media-message" data-media-message-loaded={state.loaded}>
          <video class="media-message-thumbnail" controls poster={this.poster} onloadedmetadata={this.handleLoad} preload="metadata" src={this.url}/>
          <blurhashCanvas_js_1.default height={info.h} width={info.w} blurhash={blurhash} class="media-message-blurhash"/>
        </div>
    </messageFrame_js_1.default>;
    };
    return VideoMessage;
}(preact_1.Component));
exports.VideoMessage = VideoMessage;
var AudioMessage = /** @class */ (function (_super) {
    __extends(AudioMessage, _super);
    function AudioMessage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.userColor = new colors_js_1.UserColor(_this.props.event.getSender());
        _this.isMe = _this.props.event.getSender() === client_js_1.default.client.getUserId();
        _this.content = _this.props.event.getContent();
        _this.url = client_js_1.default.client.getHttpUriForMxcFromHS(_this.content.url);
        return _this;
    }
    AudioMessage.prototype.render = function (props) {
        return <messageFrame_js_1.default displayOnly={props.displayOnly} reactions={props.reactions} canRedact={props.canRedact} event={props.event}>
        <div class="message-body media-message">
          <audio controls src={this.url}/>
        </div>
    </messageFrame_js_1.default>;
    };
    return AudioMessage;
}(preact_1.Component));
exports.AudioMessage = AudioMessage;

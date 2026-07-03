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
require("./styles/chat.css");
var Matrix = require("matrix-js-sdk");
var message_js_1 = require("./message.js");
var messagePanel_js_1 = require("./messagePanel.js");
var colors_js_1 = require("./utils/colors.js");
var constants_js_1 = require("./constants.js");
var userInfoHeader_js_1 = require("./userInfoHeader.js");
var client_js_1 = require("./client.js");
var toast_js_1 = require("./toast.js");
var Icons = require("./icons.js");
var history_js_1 = require("./history.js");
var location_js_1 = require("./utils/location.js");
var locationPreview_js_1 = require("./locationPreview.js");
var tooltip_js_1 = require("./utils/tooltip.js");
var Chat = /** @class */ (function (_super) {
    __extends(Chat, _super);
    function Chat(props) {
        var _this = _super.call(this, props) || this;
        _this.chatWrapper = (0, preact_1.createRef)();
        _this.chatPanel = (0, preact_1.createRef)();
        _this.scrollAnchorTop = (0, preact_1.createRef)();
        _this.scrollAnchorBottom = (0, preact_1.createRef)();
        _this.messagePanel = (0, preact_1.createRef)();
        _this.resizeObserver = new ResizeObserver(function (_) {
            var chatWrapper = _this.chatWrapper.current;
            var heightDiff = chatWrapper.scrollHeight - _this.prevScrollHeight;
            if (_this.elementFixed)
                _this.elementFixed.scrollIntoView({ block: "center" });
            else if (_this.bottomFilling)
                chatWrapper.scrollTop = chatWrapper.scrollTop - heightDiff;
            _this.prevScrollHeight = chatWrapper.scrollHeight;
        });
        // Room.timeline passes in more params
        _this.handleTimeline = function (e) {
            var _a;
            if (((_a = _this.props.focus) === null || _a === void 0 ? void 0 : _a.getChild()) === e.getRoomId() && _this.state.fullyScrolledDown) {
                _this.timelinePromise
                    .then(function (_) { return _this.timelineWindow.paginate(Matrix.EventTimeline.FORWARDS, 1, false); })
                    .then(_this.updateEvents);
            }
        };
        _this.handleDragenter = function (e) {
            _this.setState({ droppable: true });
        };
        _this.handleDragleave = function (e) {
            if (e.target.id === "chat-drop-overlay")
                _this.setState({ droppable: false });
        };
        _this.handleDrop = function (e) {
            e.preventDefault();
            if (e.dataTransfer.files[0])
                _this.messagePanel.current.setState({ mode: "SendFile", file: e.dataTransfer.files[0] });
            _this.setState({ droppable: false });
        };
        _this.handleDragover = function (e) { return e.preventDefault(); };
        _this.tryTopfill = function (_) {
            _this.topFilling = true;
            if (!_this.state.fullyScrolledUp && _this.scrollAnchorTop.current.isVisible) {
                if (!_this.timelineWindow.canPaginate(Matrix.EventTimeline.BACKWARDS)) {
                    var indexExists = _this.timelineWindow.getTimelineIndex(Matrix.EventTimeline.BACKWARDS);
                    //if we can't paginate, we make sure that the timelineindex
                    //has actually loaded, and if so we say we're done scrolling
                    if (indexExists)
                        _this.setState({ fullyScrolledUp: true }, _this.finishTopFill());
                    else
                        setTimeout(_this.tryTopfill, 100);
                }
                else {
                    _this.timelineWindow.paginate(Matrix.EventTimeline.BACKWARDS, 10)
                        .then(function (_) { return setTimeout(function (_) {
                        _this.setState({ events: _this.timelineWindow.getEvents() }, _this.tryTopfill);
                    }, 100); });
                }
            }
            else
                _this.finishTopFill();
        };
        _this.finishTopFill = function (_) {
            _this.topFilling = false;
            if (!_this.bottomFilling)
                setTimeout(function (_) { return delete _this.elementFixed; }, 250);
        };
        _this.tryBottomfill = function (_) {
            _this.bottomFilling = true;
            if (!_this.state.fullyScrolledDown && _this.scrollAnchorBottom.current.isVisible) {
                if (!_this.timelineWindow.canPaginate(Matrix.EventTimeline.FORWARDS)) {
                    //if we can't paginate, we make sure that the timelineindex
                    //has actually loaded, and if so we say we're done scrolling
                    var indexExists = _this.timelineWindow.getTimelineIndex(Matrix.EventTimeline.FORWARDS);
                    if (indexExists)
                        _this.setState({ fullyScrolledDown: true }, _this.finishBottomFill);
                    else
                        setTimeout(_this.tryBottomfill, 100);
                }
                else {
                    _this.timelineWindow.paginate(Matrix.EventTimeline.FORWARDS, 10)
                        .then(function (_) { return setTimeout(function (_) {
                        _this.setState({ events: _this.timelineWindow.getEvents() }, _this.tryBottomfill);
                    }, 100); });
                }
            }
            else
                _this.finishBottomFill();
        };
        _this.finishBottomFill = function (_) {
            _this.bottomFilling = false;
            if (!_this.topFilling)
                setTimeout(function (_) { return delete _this.elementFixed; }, 250);
        };
        _this.getTopic = function (_) {
            var _a;
            return ((_a = _this.room.getLiveTimeline()
                .getState(Matrix.EventTimeline.FORWARDS)
                .getStateEvents("m.room.topic", "")) === null || _a === void 0 ? void 0 : _a.getContent().topic) || "";
        };
        _this.updateEvents = function (_) {
            _this.setState({
                topic: _this.getTopic(),
                events: _this.timelineWindow.getEvents()
            }, _this.updateReadReceipt);
        };
        _this.handleFocusNotFound = function (e) {
            toast_js_1.default.set(<preact_1.Fragment>
      <h3 id="toast-header">Something wasn't available</h3>
      <div>Here's the error message:</div>
      <pre>{e.message}</pre>
    </preact_1.Fragment>);
            history_js_1.default.replace("/".concat(_this.props.resourceAlias, "/"));
        };
        _this.state = {
            events: [],
            topic: "",
            fullyScrolledUp: false,
            fullyScrolledDown: !props.eventFocused
        };
        _this.handleTimeline = _this.handleTimeline.bind(_this);
        return _this;
    }
    Chat.prototype.componentDidMount = function () {
        client_js_1.default.client.on("Room.timeline", this.handleTimeline); // this also handles redactions, although they have their own event.
        client_js_1.default.client.on("Room.localEchoUpdated", this.updateEvents);
        this.prevScrollHeight = this.chatWrapper.current.scrollHeight;
        this.resizeObserver.observe(this.chatPanel.current);
        this.resetFocus();
    };
    Chat.prototype.componentWillUnmount = function () {
        client_js_1.default.client.off("Room.timeline", this.handleTimeline);
        client_js_1.default.client.off("Room.localEchoUpdated", this.updateEvents);
        this.resizeObserver.disconnect();
    };
    Chat.prototype.componentDidUpdate = function (prevProps) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (prevProps.focus.getChild() !== this.props.focus.getChild() ||
                    prevProps.eventFocused !== this.props.eventFocused) {
                    this.resetFocus();
                    //TODO: just scroll to event when focus doesn't change
                }
                return [2 /*return*/];
            });
        });
    };
    Chat.prototype.loadTimelineWindow = function (roomId) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, client_js_1.default.client.joinRoom(this.props.focus.getChild(), { viaServers: this.props.focus.getVia() })];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _b.sent();
                        alert(err_1);
                        this.props.unsetFocus();
                        return [2 /*return*/];
                    case 3:
                        _a = this;
                        return [4 /*yield*/, client_js_1.default.client.getRoomWithState(roomId)];
                    case 4:
                        _a.room = _b.sent();
                        this.timelineWindow = new Matrix.TimelineWindow(client_js_1.default.client, this.room.getUnfilteredTimelineSet());
                        return [2 /*return*/, this.timelineWindow.load(this.props.eventFocused)];
                }
            });
        });
    };
    Chat.prototype.updateReadReceipt = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                clearTimeout(this.updateReadReceiptDebounce);
                this.updateReadReceiptDebounce = setTimeout(function (_) {
                    var lastEvent = _this.state.events[_this.state.events.length - 1];
                    if (!lastEvent)
                        return; // we bail out if the events haven't loaded
                    if (lastEvent.getAssociatedStatus())
                        return; // or if the event hasn't been echoed yet
                    var lastEventId = lastEvent.getId();
                    var currentReceiptId = _this.room.getEventReadUpTo(client_js_1.default.client.getUserId(), true);
                    // fire if last read event is different from last event
                    var differsFromLast = currentReceiptId !== lastEventId;
                    // and last event hasn't already had a receipt sent for it.
                    var isUnsent = lastEventId !== _this.lastReceiptSentId;
                    if (differsFromLast && isUnsent) {
                        console.log("sending receipt");
                        client_js_1.default.client.setRoomReadMarkers(_this.room.roomId, lastEventId, lastEvent).catch(console.log);
                        client_js_1.default.client.sendReadReceipt(lastEvent).then(function (_) {
                            // faster to zero these manually than waiting for the server
                            _this.room.setUnreadNotificationCount('total', 0);
                            _this.room.setUnreadNotificationCount('highlight', 0);
                            _this.lastReceiptSentId = lastEventId;
                        }).catch(console.log);
                    }
                }, 200);
                return [2 /*return*/];
            });
        });
    };
    Chat.prototype.resetFocus = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.chatWrapper.current.scrollTop = 0;
                        this.timelinePromise = this.loadTimelineWindow(this.props.focus.getChild());
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.timelinePromise];
                    case 2:
                        _a.sent();
                        this.setState({
                            fullyScrolledUp: false,
                            fullyScrolledDown: false,
                            topic: this.getTopic(),
                            events: this.timelineWindow.getEvents()
                        }, function (_) {
                            _this.updateReadReceipt();
                            _this.prevScrollHeight = _this.chatWrapper.current.scrollHeight;
                            _this.elementFixed = document.getElementById(_this.props.eventFocused);
                            _this.tryTopfill();
                            _this.tryBottomfill();
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        switch (e_1.name) {
                            case "M_NOT_FOUND": return [2 /*return*/, this.handleFocusNotFound(e_1)];
                            default: console.log(e_1);
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Chat.prototype.render = function (props, state) {
        var _a, _b;
        var userMember = (_a = props.resource.room) === null || _a === void 0 ? void 0 : _a.getMember(client_js_1.default.client.getUserId());
        var canRedact = !!((_b = props.resource.room) === null || _b === void 0 ? void 0 : _b.getLiveTimeline().getState(Matrix.EventTimeline.FORWARDS).hasSufficientPowerLevelFor("redact", userMember.powerLevel));
        var reactions = {};
        // XXX need to be able to handle other message types
        var messages = state.events.filter(function (e) { return e.getType() === "m.room.message" && !e.isRelation("m.replace") && !e.isRelation("m.thread") &&
            (e.getContent().msgtype === "m.text" ||
                e.getContent().msgtype === "m.emote" ||
                e.getContent().msgtype === "m.notice" ||
                e.getContent().msgtype === "m.file" ||
                e.getContent().msgtype === "m.image" ||
                e.getContent().msgtype === "m.video" ||
                e.getContent().msgtype === "m.audio" ||
                Object.keys(e.getContent()).length === 0); });
        var prev = null;
        var messagedivs = messages.reduce(function (accumulator, event) {
            if (!prev || prev.getSender() !== event.getSender()) {
                accumulator.push(<userInfoHeader_js_1.default key={"".concat(event.getId(), "-userinfo")} userId={event.getSender()} isMe={event.getSender() === client_js_1.default.client.getUserId()}/>);
                prev = event;
            }
            switch (event.getContent().msgtype) {
                case "m.text": {
                    accumulator.push(<message_js_1.TextMessage reactions={reactions} key={event.getId()} resourceAlias={props.resourceAlias} canRedact={canRedact} event={event}/>);
                    break;
                }
                case "m.notice": {
                    accumulator.push(<message_js_1.NoticeMessage reactions={reactions} key={event.getId()} resourceAlias={props.resourceAlias} canRedact={canRedact} event={event}/>);
                    break;
                }
                case "m.file": {
                    accumulator.push(<message_js_1.FileMessage reactions={reactions} key={event.getId()} canRedact={canRedact} event={event}/>);
                    break;
                }
                case "m.emote": {
                    if (event.getContent()[constants_js_1.mscMarkupMsgKey]) {
                        accumulator.push(<message_js_1.AnnotationMessage reactions={reactions} resource={props.resource} resourceAlias={props.resourceAlias} secondaryFocus={props.secondaryFocus} setSecondaryFocus={props.setSecondaryFocus} roomId={props.focus.getChild()} key={event.getId()} canRedact={canRedact} event={event}/>);
                    }
                    else {
                        accumulator.push(<message_js_1.EmoteMessage reactions={reactions} key={event.getId()} canRedact={canRedact} event={event}/>);
                    }
                    break;
                }
                case "m.image": {
                    accumulator.push(<message_js_1.ImageMessage reactions={reactions} key={event.getId()} canRedact={canRedact} event={event}/>);
                    break;
                }
                case "m.video": {
                    accumulator.push(<message_js_1.VideoMessage reactions={reactions} key={event.getId()} canRedact={canRedact} event={event}/>);
                    break;
                }
                case "m.audio": {
                    accumulator.push(<message_js_1.AudioMessage reactions={reactions} key={event.getId()} canRedact={canRedact} event={event}/>);
                    break;
                }
                case undefined: {
                    if (prev.getSender() === event.getSender() &&
                        accumulator.length > 1 &&
                        accumulator[accumulator.length - 1].type === RedactedMessage) {
                        accumulator[accumulator.length - 1].props.count = accumulator[accumulator.length - 1].props.count + 1;
                    }
                    else {
                        accumulator.push(<RedactedMessage count={1} key={event.getId()} username={event.getSender()} isMe={event.getSender() === client_js_1.default.client.getUserId()}/>);
                    }
                    break;
                }
            }
            return accumulator;
        }, []);
        // sort reactions by event reacted-to
        state.events.forEach(function (e) {
            var _a, _b;
            if (e.getType() === "m.reaction" && ((_b = (_a = e.getContent()) === null || _a === void 0 ? void 0 : _a["m.relates_to"]) === null || _b === void 0 ? void 0 : _b.event_id)) { // content might be redacted
                if (reactions[e.getContent()["m.relates_to"].event_id])
                    reactions[e.getContent()["m.relates_to"].event_id].push(e);
                else
                    reactions[e.getContent()["m.relates_to"].event_id] = [e];
            }
        });
        // has height set, so that we don't need to set height on the flexbox element
        return <div ref={this.chatWrapper} id="chat-wrapper" class={props.class} ondragenter={this.handleDragenter} data-droppable={state.droppable}>
      {state.droppable
                ? <div id="chat-drop-overlay" ondrop={this.handleDrop} ondragover={this.handleDragover} ondragleave={this.handleDragleave}/>
                : null}
      <div ref={this.chatPanel} id="chat-panel">
        <Anchor ref={this.scrollAnchorBottom} chatWrapper={this.chatWrapper} tryFill={this.tryBottomfill} fullyScrolled={state.fullyScrolledDown}>
          <messagePanel_js_1.default ref={this.messagePanel} hasSelection={props.hasSelection} generateLocation={props.generateLocation} resource={props.resource} resourceId={props.resource.room.roomId} focus={props.focus}/>
        </Anchor>
        <div id="messages">
          {messagedivs}
          <TypingIndicator key={props.focus.getChild()} roomId={props.focus.getChild()}/>
          {/* The key prop here ensures that typing state is reset when the room changes */}
        </div>
        <Anchor ref={this.scrollAnchorTop} chatWrapper={this.chatWrapper} tryFill={this.tryTopfill} fullyScrolled={state.fullyScrolledUp}>
            <TopAnchor focus={props.focus} resource={props.resource} topic={state.topic}/>
        </Anchor>
      </div>
    </div>;
    };
    return Chat;
}(preact_1.Component));
exports.default = Chat;
var RedactedMessage = /** @class */ (function (_super) {
    __extends(RedactedMessage, _super);
    function RedactedMessage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.userColor = new colors_js_1.UserColor(_this.props.username);
        return _this;
    }
    RedactedMessage.prototype.render = function (props) {
        return props.isMe
            ? <div class="redacted message-frame message-from-user" style={this.userColor.styleVariables}>
        <div class="message-decoration"/>
        <div class="message-body">{props.count > 1 ? "".concat(props.count, " messages deleted") : "message deleted"}</div>
      </div>
            : <div class="redacted message-frame" style={this.userColor.styleVariables}>
        <div class="message-decoration"/>
        <div class="message-body">{props.count > 1 ? "".concat(props.count, " messages deleted") : "message deleted"}</div>
      </div>;
    };
    return RedactedMessage;
}(preact_1.Component));
var Anchor = /** @class */ (function (_super) {
    __extends(Anchor, _super);
    function Anchor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.scrollAnchorDiv = (0, preact_1.createRef)();
        _this.intersectionObserver = new IntersectionObserver(function (entries) {
            if (entries.some(function (entry) { return entry.isIntersecting; })) {
                _this.isVisible = true;
            }
            else {
                _this.isVisible = false;
            }
            _this.props.tryFill();
        }, {
            root: _this.props.chatWrapper.current,
        });
        return _this;
    }
    Anchor.prototype.componentDidMount = function () {
        this.isVisible = true;
        this.intersectionObserver.observe(this.scrollAnchorDiv.current);
    };
    Anchor.prototype.componentWillUnmount = function () { this.intersectionObserver.disconnect(); };
    Anchor.prototype.render = function (props) {
        return <div ref={this.scrollAnchorDiv} id={props.fullyScrolled ? null : "scroll-anchor"}>
      {props.fullyScrolled
                ? props.children
                : <svg width="350px" height="80px" viewBox="0 0 350 80">
          <rect x="0" y="1" width="120" height="20" ry="10" rx="10"/>
          <rect x="130" y="1" width="180" height="20" ry="10" rx="10"/>
          <rect x="0" y="30" width="180" height="20" ry="10" rx="10"/>
          <rect x="190" y="30" width="120" height="20" ry="10" rx="10"/>
          <rect x="0" y="60" width="50" height="20" ry="10" rx="10"/>
          <rect x="60" y="60" width="150" height="20" ry="10" rx="10"/>
        </svg>} 
    </div>;
    };
    return Anchor;
}(preact_1.Component));
function TopAnchor(props) {
    return <preact_1.Fragment>
    <div id="anchor-preview-wrapper">
      <locationPreview_js_1.default showPosition={true} resource={props.resource} location={props.focus}/>
    </div>
    <FlagSelector focus={props.focus}/>
    <div id="scroll-done">
      {props.focus.getStatus() === "pending"
            ? "Awaiting your comment..."
            : null}
    </div>
  </preact_1.Fragment>;
}
var FlagSelector = /** @class */ (function (_super) {
    __extends(FlagSelector, _super);
    function FlagSelector() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleError = function (e) {
            toast_js_1.default.set(<preact_1.Fragment>
      <h3 id="toast-header">Couldn't mark as question</h3>
      <div>Maybe you don't have permission to edit this annotation? Here's the error message:</div>
      <pre>{e.message}</pre>
    </preact_1.Fragment>);
        };
        _this.toggleQuestion = function (_) {
            var _a, _b;
            var chatRoomState = client_js_1.default.client
                .getRoom(_this.props.focus.getChild())
                .getLiveTimeline()
                .getState(Matrix.EventTimeline.FORWARDS);
            if (!chatRoomState.maySendStateEvent(Matrix.EventType.SpaceParent, client_js_1.default.client.getUserId()))
                return;
            var spaceParentEvents = chatRoomState.getStateEvents(Matrix.EventType.SpaceParent);
            for (var _i = 0, spaceParentEvents_1 = spaceParentEvents; _i < spaceParentEvents_1.length; _i++) {
                var spaceParentEvent = spaceParentEvents_1[_i];
                var theLocation = new location_js_1.default(spaceParentEvent);
                if (!theLocation.isValid())
                    continue;
                var newLocation = Object.assign({}, theLocation.location, { motivation: "questioning" });
                if (_this.props.focus.isQuestion())
                    delete newLocation.motivation; // toggle
                var newParentContent = (_a = {
                        via: spaceParentEvent.getContent().via
                    },
                    _a[constants_js_1.mscLocation] = newLocation,
                    _a);
                client_js_1.default.client
                    .sendStateEvent(_this.props.focus.getChild(), Matrix.EventType.SpaceParent, newParentContent, _this.props.focus.getParent())
                    .catch(function (e) { return alert(e); });
                var spaceChildEvent = client_js_1.default.client
                    .getRoom(_this.props.focus.getParent())
                    .getLiveTimeline()
                    .getState(Matrix.EventTimeline.FORWARDS)
                    .getStateEvents(Matrix.EventType.SpaceChild, theLocation.getChild());
                var newChildContent = (_b = {
                        via: spaceChildEvent.getContent().via
                    },
                    _b[constants_js_1.mscLocation] = newLocation,
                    _b);
                if (newChildContent.via)
                    client_js_1.default.client
                        .sendStateEvent(_this.props.focus.getParent(), Matrix.EventType.SpaceChild, newChildContent, _this.props.focus.getChild()) // should be conditional on room visible
                        .catch(function (e) { return _this.handleError(e); });
            }
        };
        return _this;
    }
    FlagSelector.prototype.render = function (props) {
        var _a, _b;
        return <div id="anchor-chat-flags">
      <tooltip_js_1.default content={((_a = props.focus) === null || _a === void 0 ? void 0 : _a.isQuestion()) ? "unmark as question" : "mark as question"}>
        <button class="small-icon" onclick={this.toggleQuestion} data-active-flag={(_b = props.focus) === null || _b === void 0 ? void 0 : _b.isQuestion()}> {Icons.question}</button>
      </tooltip_js_1.default>
    </div>;
    };
    return FlagSelector;
}(preact_1.Component));
var TypingIndicator = /** @class */ (function (_super) {
    __extends(TypingIndicator, _super);
    function TypingIndicator(props) {
        var _this = _super.call(this, props) || this;
        _this.handleTypingNotification = function (event, member) {
            if (member.roomId === _this.props.roomId) {
                // ^^^ we have to check the originating room in an odd way because
                // the roomId for the typing events isn't set for some reason.
                var myId_1 = client_js_1.default.client.getUserId();
                var typingOtherThanMe = event.getContent().user_ids.filter(function (x) { return x !== myId_1; });
                _this.setState({ typing: typingOtherThanMe });
            }
        };
        _this.handleTypingNotifications = _this.handleTypingNotification.bind(_this);
        _this.state = { typing: [] };
        return _this;
    }
    TypingIndicator.prototype.componentDidMount = function () {
        client_js_1.default.client.on("RoomMember.typing", this.handleTypingNotification);
    };
    TypingIndicator.prototype.componentWillUnmount = function () {
        client_js_1.default.client.off("RoomMember.typing", this.handleTypingNotification);
    };
    TypingIndicator.prototype.render = function (props, state) {
        var displayNames = state.typing.map(function (typer) { return client_js_1.default.client.getUser(typer).displayName; });
        var howMany = displayNames.length;
        if (howMany === 0)
            return <div class="typing-indicator">&nbsp;</div>;
        else if (howMany === 1)
            return <div class="typing-indicator">{displayNames[0]} is typing</div>;
        else if (howMany === 2)
            return <div class="typing-indicator">{displayNames[0]} and {displayNames[1]} are typing</div>;
        return <div class="typing-indicator">several people are typing</div>;
    };
    return TypingIndicator;
}(preact_1.Component));

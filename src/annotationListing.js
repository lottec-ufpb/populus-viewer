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
require("./styles/annotationListing.css");
var Matrix = require("matrix-js-sdk");
var latex_js_1 = require("./latex.js");
var links_js_1 = require("./links.js");
var constants_js_1 = require("./constants.js");
var client_js_1 = require("./client.js");
var memberPill_js_1 = require("./memberPill.js");
var colors_js_1 = require("./utils/colors.js");
var search_js_1 = require("./search.js");
var message_js_1 = require("./message.js");
var locationPreview_js_1 = require("./locationPreview.js");
var Icons = require("./icons.js");
var PopupMenu = require("./popUpMenu.js");
var AnnotationListing = /** @class */ (function (_super) {
    __extends(AnnotationListing, _super);
    function AnnotationListing(props) {
        var _this = _super.call(this, props) || this;
        _this.handleTypingNotification = function (event, member) {
            var theRoomState = client_js_1.default.client.getRoom(_this.props.roomId).getLiveTimeline().getState(Matrix.EventTimeline.FORWARDS);
            var theChildRelation = theRoomState.getStateEvents(Matrix.EventType.SpaceChild, member.roomId);
            // We use nested state here because we want to pass this part of the state to a child
            if (theChildRelation) {
                _this.setState(function (prevState) {
                    var _a;
                    var myId = client_js_1.default.client.getUserId();
                    var typingOtherThanMe = event.getContent().user_ids.filter(function (x) { return x !== myId; });
                    return { typing: __assign(__assign({}, prevState.typing), (_a = {}, _a[member.roomId] = typingOtherThanMe, _a)) };
                });
            }
        };
        _this.handleKeydown = function (e) {
            if (e.altKey && !e.shiftKey && e.key === 'Tab')
                _this.props.focusNext();
            if (e.altKey && e.shiftKey && e.key === 'Tab')
                _this.props.focusPrev();
        };
        _this.setFocus = function (searchFocus) { return _this.setState({ searchFocus: searchFocus }); };
        _this.searchInput = (0, preact_1.createRef)();
        _this.byCreation = function (a, b) {
            if (a.event.getTs() > b.event.getTs())
                return -1;
            if (a.event.getTs() < b.event.getTs())
                return 1;
            return 0;
        };
        _this.byPage = function (a, b) {
            if (a.getPageIndex() > b.getPageIndex())
                return 1;
            if (a.getPageIndex() < b.getPageIndex())
                return -1;
            return 0;
        };
        _this.byActivity = function (a, b) {
            var room1 = client_js_1.default.client.getRoom(a.getChild());
            var room2 = client_js_1.default.client.getRoom(b.getChild());
            // XXX might not be a member of both rooms, hence unable to get timestamps
            if (room1 && room2) {
                var ts1 = room1.getLastActiveTimestamp();
                var ts2 = room2.getLastActiveTimestamp();
                if (ts1 > ts2)
                    return -1;
                else if (ts1 < ts2)
                    return 1;
                return 0;
            }
            if (room1)
                return -1;
            if (room2)
                return 1;
            return 0;
            // should warn that unjoined rooms are last
        };
        _this.sortByActivity = function (_) {
            var initialSort = _this.state.sort;
            if (initialSort === "Activity")
                _this.setState(function (oldState) { return { sortOrder: oldState.sortOrder * -1 }; });
            else
                _this.setState({ sort: "Activity" });
        };
        _this.sortByPage = function (_) {
            var initialSort = _this.state.sort;
            if (initialSort === "Page")
                _this.setState(function (oldState) { return { sortOrder: oldState.sortOrder * -1 }; });
            else
                _this.setState({ sort: "Page" });
        };
        _this.sortByCreation = function (_) {
            var initialSort = _this.state.sort;
            if (initialSort === "Creation")
                _this.setState(function (oldState) { return { sortOrder: oldState.sortOrder * -1 }; });
            else
                _this.setState({ sort: "Creation" });
        };
        _this.flipSort = function (_) { return _this.setState(function (oldState) { return { sortOrder: oldState.sortOrder * -1 }; }); };
        _this.flags = [
            { keyword: "me", description: "my annotations" },
            { keyword: "hour", description: "annotations from the last hour" },
            { keyword: "day", description: "annotations from the last day" },
            { keyword: "week", description: "annotations from the last week" },
            { keyword: "unread", description: "unread annotations" },
            { keyword: "question", description: "annotations asking questions" }
        ];
        _this.popupActions = {
            "@": function (props) { return <PopupMenu.Members roomId={_this.props.roomId} {...props}/>; },
            "~": function (props) { return <PopupMenu.Flags flags={_this.flags} {...props}/>; }
        };
        _this.state = {
            typing: {},
            sort: "Activity",
            sortOrder: 1,
            searchFocus: false
        };
        _this.handleTypingNotification = _this.handleTypingNotification.bind(_this);
        return _this;
    }
    AnnotationListing.prototype.componentDidMount = function () {
        client_js_1.default.client.on("RoomMember.typing", this.handleTypingNotification);
        document.addEventListener('keydown', this.handleKeydown);
    };
    AnnotationListing.prototype.componentWillUnmount = function () {
        client_js_1.default.client.off("RoomMember.typing", this.handleTypingNotification);
        document.removeEventListener('keydown', this.handleKeydown);
    };
    AnnotationListing.prototype.getSortFunc = function () {
        switch (this.state.sort) {
            case 'Page': return this.byPage;
            case 'Activity': return this.byActivity;
            case 'Creation': return this.byCreation;
        }
    };
    AnnotationListing.prototype.render = function (props, state) {
        var theAnnotations = [];
        var initialDate = Date.now();
        var currentDate = initialDate;
        var thePage = 1;
        var looped = false;
        for (var _i = 0, _a = props.filteredAnnotationContents.sort(this.getSortFunc()); _i < _a.length; _i++) {
            var loc = _a[_i];
            var divider = void 0;
            if (looped) {
                switch (state.sort) {
                    case "Page": {
                        if (thePage < loc.getPageIndex()) {
                            var newPage = loc.getPageIndex();
                            divider = <div class="annotation-listing-divider">
                <span>Page {state.sortOrder === 1 ? newPage : thePage}</span>
              </div>;
                            thePage = newPage;
                        }
                        else
                            divider = <div class="annotation-listing-divider"/>;
                        break;
                    }
                    case "Activity": {
                        var room = client_js_1.default.client.getRoom(loc.getChild());
                        if (room && state.sortOrder === 1) { // TODO handle times for reverse sort
                            var age = initialDate - room.getLastActiveTimestamp();
                            var dateDelta = currentDate - room.getLastActiveTimestamp();
                            if (age < 300000 && dateDelta > 60000) {
                                currentDate = room.getLastActiveTimestamp();
                                var minutes = Math.floor(age / 60000);
                                var plural = minutes === 1 ? "" : "s";
                                divider = <div class="annotation-listing-divider">
                  <span>{"".concat(minutes, " minute").concat(plural, " ago")}</span>
                </div>;
                            }
                            else if (age < 3600000 && dateDelta > 600000) {
                                currentDate = room.getLastActiveTimestamp();
                                var minutes = Math.floor(age / 60000);
                                var plural = minutes === 1 ? "" : "s";
                                divider = <div class="annotation-listing-divider">
                  <span>{"".concat(minutes, " minute").concat(plural, " ago")}</span>
                </div>;
                            }
                            else if (age < 86400000 && dateDelta > 3600000) {
                                currentDate = room.getLastActiveTimestamp();
                                var hours = Math.floor(age / 3600000);
                                var plural = hours === 1 ? "" : "s";
                                divider = <div class="annotation-listing-divider">
                  <span>{"".concat(hours, " hour").concat(plural, " ago")}</span>
                </div>;
                            }
                            else if (dateDelta > 86400000) {
                                currentDate = room.getLastActiveTimestamp();
                                var dateObject = new Date(currentDate);
                                divider = <div class="annotation-listing-divider">
                  <span>{"on ".concat(dateObject.toLocaleDateString('en-US', {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                    }))}</span></div>;
                            }
                            else
                                divider = <div class="annotation-listing-divider"/>;
                            break;
                        }
                    }
                    case "Creation": {
                        if (state.sortOrder === 1) { // TODO handle times for reverse sort
                            var age = initialDate - loc.event.getTs();
                            var dateDelta = currentDate - loc.event.getTs();
                            if (age < 300000 && dateDelta > 60000) {
                                currentDate = loc.event.getTs();
                                var minutes = Math.floor(age / 60000);
                                var plural = minutes === 1 ? "" : "s";
                                divider = <div class="annotation-listing-divider">
                  <span>{"".concat(minutes, " minute").concat(plural, " ago")}</span>
                </div>;
                            }
                            else if (age < 3600000 && dateDelta > 600000) {
                                currentDate = loc.event.getTs();
                                var minutes = Math.floor(age / 60000);
                                var plural = minutes === 1 ? "" : "s";
                                divider = <div class="annotation-listing-divider">
                  <span>{"".concat(minutes, " minute").concat(plural, " ago")}</span>
                </div>;
                            }
                            else if (age < 86400000 && dateDelta > 3600000) {
                                currentDate = loc.event.getTs();
                                var hours = Math.floor(age / 3600000);
                                var plural = hours === 1 ? "" : "s";
                                divider = <div class="annotation-listing-divider">
                  <span>{"".concat(hours, " hour").concat(plural, " ago")}</span>
                </div>;
                            }
                            else if (dateDelta > 86400000) {
                                currentDate = loc.event.getTs();
                                var dateObject = new Date(currentDate);
                                divider = <div class="annotation-listing-divider">
                  <span>{"on ".concat(dateObject.toLocaleDateString('en-US', {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                    }))}</span></div>;
                            }
                            else
                                divider = <div class="annotation-listing-divider"/>;
                            break;
                        }
                    }
                    default: divider = <div class="annotation-listing-divider"/>;
                }
            }
            else
                looped = true;
            theAnnotations.push(divider);
            theAnnotations.push(<AnnotationListingEntry key={loc.getChild()} typing={state.typing[loc.getChild()]} resource={props.resource} annotationLocation={loc} focusByRoomId={props.focusByRoomId} focus={props.focus} parentRoom={props.room}/>);
        }
        return <div id="annotation-panel" class={props.class}>
              <div id="annotation-entries-wrapper" tabindex="-1">
                <div id="annotation-controls">
                  <button class="small-icon" style="cursor: pointer" onClick={this.flipSort}>
                    {state.sortOrder === 1
                ? Icons.sortDesc
                : Icons.sortAsc}
                  </button>
                  <button data-current-button={state.sort === "Activity"} onClick={this.sortByActivity} class="styled-button">Activity</button>
                  <button data-current-button={state.sort === "Creation"} onClick={this.sortByCreation} class="styled-button">Creation</button>
                  {props.mimetype === "application/pdf"
                ? <button data-current-button={state.sort === "Page"} onClick={this.sortByPage} class="styled-button">Page</button>
                : null}
                </div>
                  {Object.values(props.annotationContents).length === 0
                ? <div class="empty-marker"><b>No annotations yet available</b></div>
                : props.filteredAnnotationContents.length === 0
                    ? <div class="empty-marker"><b>No annotations matching search</b></div>
                    : state.sortOrder === 1 ? theAnnotations : theAnnotations.reverse()}
              </div>
              <div id="annotation-panel-button-wrapper" data-mode={state.searchFocus ? "search" : "navigation"}>
                <PopupMenu.Menu textValue={props.annotationFilter} textarea={this.searchInput} actions={this.popupActions} setTextValue={props.setAnnotationFilter}/>
                <search_js_1.default hint="/" searchInput={this.searchInput} search={props.annotationFilter} setSearch={props.setAnnotationFilter} setFocus={this.setFocus}/>
              </div>
            </div>;
    };
    return AnnotationListing;
}(preact_1.Component));
exports.default = AnnotationListing;
var AnnotationListingEntry = /** @class */ (function (_super) {
    __extends(AnnotationListingEntry, _super);
    function AnnotationListingEntry(props) {
        var _this = _super.call(this, props) || this;
        _this.handleTimeline = function (_event, room) {
            var _a;
            if (room.roomId === ((_a = _this.room) === null || _a === void 0 ? void 0 : _a.roomId))
                _this.setState({});
        };
        _this.comment = (0, preact_1.createRef)();
        _this.entry = (0, preact_1.createRef)();
        _this.handleClick = function (_) {
            _this.props.focusByRoomId(_this.props.annotationLocation.getChild());
        };
        _this.creator = _this.props.parentRoom.getMember(_this.props.annotationLocation.getCreator());
        _this.userColor = new colors_js_1.UserColor(_this.creator.userId);
        _this.state = {
            topic: props.annotationLocation.getText()
        };
        return _this;
    }
    AnnotationListingEntry.prototype.componentDidMount = function () {
        (0, latex_js_1.renderLatexInElement)(this.comment.current);
        client_js_1.default.client.on("Room.timeline", this.handleTimeline);
        client_js_1.default.client.on("Room.accountData", this.handleTimeline);
        (0, links_js_1.processLinks)(this.comment.current);
        this.setTopic();
    };
    AnnotationListingEntry.prototype.componentWillUnmount = function () {
        client_js_1.default.client.off("Room.timeline", this.handleTimeline);
        client_js_1.default.client.off("Room.accountData", this.handleTimeline);
    };
    AnnotationListingEntry.prototype.componentDidUpdate = function (prevProps) {
        var _a, _b;
        if (((_a = prevProps.focus) === null || _a === void 0 ? void 0 : _a.getChild()) !== this.props.annotationLocation.getChild() &&
            ((_b = this.props.focus) === null || _b === void 0 ? void 0 : _b.getChild()) === this.props.annotationLocation.getChild()) {
            this.entry.current.scrollIntoView();
        }
    };
    AnnotationListingEntry.prototype.setTopic = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, client_js_1.default.client.getRoomWithState(this.props.annotationLocation.getChild())];
                    case 1:
                        _a.room = _c.sent();
                        this.setState({
                            topic: ((_b = this.room.getLiveTimeline()
                                .getState(Matrix.EventTimeline.FORWARDS)
                                .getStateEvents("m.room.topic", "")) === null || _b === void 0 ? void 0 : _b.getContent().topic) || this.props.annotationLocation.getText()
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    AnnotationListingEntry.prototype.render = function (props, state) {
        var _a;
        var typing = typeof (props.typing) === "object" && Object.keys(props.typing).length > 0 ? true : null;
        var focused = ((_a = props.focus) === null || _a === void 0 ? void 0 : _a.getChild()) === props.annotationLocation.getChild();
        return <div style={this.userColor.styleVariables} data-annotation-entry-typing={typing} data-annotation-entry-focused={focused} ref={this.entry} onclick={this.handleClick} class="annotation-listing-entry">
      <locationPreview_js_1.default showPosition={true} resource={props.resource} location={props.annotationLocation}/>
      <AnnotationListingComment creator={this.creator} unread={props.annotationLocation.getUnread()} commentRef={this.comment} annotationLocation={props.annotationLocation}/>
    </div>;
    };
    return AnnotationListingEntry;
}(preact_1.Component));
function AnnotationListingComment(props) {
    var content = props.annotationLocation.getRootContent();
    if (content) {
        var body = void 0;
        switch (content.msgtype) {
            case "m.text":
                body = (0, message_js_1.DisplayContent)({ content: content });
                break;
            case "m.notice":
                body = <div class="annotation-listing-fallback"><p>Sent a notice</p></div>;
                break;
            case "m.image":
                body = <div class="annotation-listing-fallback"><p>Sent a file</p></div>;
                break;
            case "m.video":
                body = <div class="annotation-listing-fallback"><p>Sent a video</p></div>;
                break;
            case "m.audio":
                body = <div class="annotation-listing-fallback"><p>Sent an audio recording</p></div>;
                break;
            case "m.emote": {
                if (content[constants_js_1.mscMarkupMsgKey])
                    body = <div class="annotation-listing-fallback"><p>Sent an annotation</p></div>;
                else
                    body = <div class="annotation-listing-fallback"><p>Sent a message</p></div>;
                break;
            }
            default:
                body = <div class="annotation-listing-fallback"><p>Sent a message</p></div>;
        }
        return <preact_1.Fragment>
      <div ref={props.commentRef} class={props.unread
                ? "annotation-listing-comment-unread"
                : "annotation-listing-comment"}> {body} </div>
      <div class="annotation-listing-info">
        <div class="annotation-listing-features">
          {props.annotationLocation.isQuestion() ? Icons.question : null}
          {props.annotationLocation.isPrivate() ? Icons.lock : null}
          {props.annotationLocation.getOrientation() === "parent" ? Icons.eyeOff : null}
        </div>
        <div class="annotation-listing-creator"><memberPill_js_1.default member={props.creator}/></div>
      </div>
    </preact_1.Fragment>;
    }
    else if (props.annotationLocation.getStatus() === "pending") {
        return <div class="annotation-listing-pending">awaiting your comment... </div>;
    }
}

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
var Matrix = require("matrix-js-sdk");
var colors_js_1 = require("./utils/colors.js");
var message_js_1 = require("./message.js");
var unread_js_1 = require("./utils/unread.js");
var temporal_js_1 = require("./utils/temporal.js");
var location_js_1 = require("./utils/location.js");
require("./styles/notifications.css");
var client_js_1 = require("./client.js");
var history_js_1 = require("./history.js");
var Icons = require("./icons.js");
var NotificationListing = /** @class */ (function (_super) {
    __extends(NotificationListing, _super);
    function NotificationListing(props) {
        var _this = _super.call(this, props) || this;
        _this.scrollAnchor = (0, preact_1.createRef)();
        _this.updateEvents = function (_) { return _this.setState({ events: _this.notificationWindow.getEvents().reverse() }); };
        _this.tryBackfill = function (_) {
            var anchor = _this.scrollAnchor.current.base;
            if (!_this.state.fullyLoaded && (window.innerHeight - anchor.getBoundingClientRect().top) > 0) {
                if (!_this.notificationWindow.canPaginate(Matrix.EventTimeline.BACKWARDS)) {
                    _this.setState({ fullyLoaded: true });
                }
                else {
                    _this.notificationWindow.paginate(Matrix.EventTimeline.BACKWARDS, 10)
                        .then(function (_) { return setTimeout(function (_) {
                        _this.setState({ events: _this.notificationWindow.getEvents().reverse() }, _this.tryBackfill);
                    }, 200); });
                }
            }
        };
        _this.handleTimeline = function (_, room) {
            if (!room) {
                _this.notificationPromise
                    .then(function (_) { return _this.notificationWindow.paginate(Matrix.EventTimeline.FORWARDS, 1, false); })
                    .then(_this.updateEvents);
            }
        };
        _this.handleRoom = function (_) {
            clearTimeout(_this.inviteDebounceTimeout);
            _this.inviteDebounceTimeout = setTimeout(function (_) {
                _this.setState({ invites: _this.getInvites() });
            }, 500);
        };
        _this.handleScroll = function (_) {
            clearTimeout(_this.scrollDebounceTimeout);
            _this.scrollDebounceTimeout = setTimeout(function (_) { _this.tryBackfill(); }, 200);
        };
        _this.toMilestone = function (msg) { return <div class="notification-date-indicator">{msg}</div>; };
        _this.toNotification = function (ev) {
            switch (ev.getContent().msgtype) {
                case "m.text": return <TextNotification event={ev} key={ev.getId()}/>;
                default: return null;
            }
        };
        _this.state = {
            events: [],
            invites: _this.getInvites(),
            fullyLoaded: false
        };
        _this.notificationPromise = _this.loadNotificationWindow();
        _this.handleScroll = _this.handleScroll.bind(_this);
        return _this;
    }
    NotificationListing.prototype.componentDidMount = function () {
        document.addEventListener("scroll", this.handleScroll);
        client_js_1.default.client.on("Room", this.handleRoom);
        client_js_1.default.client.on("RoomState.events", this.handleRoom); // needed to update when creation event arrives
        client_js_1.default.client.on("Room.timeline", this.handleTimeline); // this also handles redactions, although they have their own event.
        this.notificationPromise.then(this.updateEvents).then(this.tryBackfill);
    };
    NotificationListing.prototype.componentWillUnmount = function () {
        document.removeEventListener("scroll", this.handleScroll);
        client_js_1.default.client.off("Room", this.handleRoom);
        client_js_1.default.client.off("RoomState.events", this.handleRoom);
        client_js_1.default.client.off("Room.timeline", this.handleTimeline);
    };
    NotificationListing.prototype.loadNotificationWindow = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.notificationWindow = new Matrix.TimelineWindow(client_js_1.default.client, client_js_1.default.client.getNotifTimelineSet());
                        return [4 /*yield*/, this.notificationWindow.load()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationListing.prototype.getInvites = function () {
        var _this = this;
        var invites = client_js_1.default.client.getVisibleRooms().filter(function (room) { return room.getMyMembership() === "invite"; });
        return invites
            .filter(function (room) {
            var _a, _b;
            return ((_b = (_a = room
                .getLiveTimeline()
                .getState(Matrix.EventTimeline.FORWARDS)
                .getStateEvents("m.room.create", "")) === null || _a === void 0 ? void 0 : _a.getContent()) === null || _b === void 0 ? void 0 : _b.type) === "m.space";
        })
            .map(function (room) { return <InviteEntry handleRoom={_this.handleRoom} key={room.roomId} room={room}/>; });
    };
    NotificationListing.prototype.render = function (_props, state) {
        return <div id="notifications-listing">
      {state.invites}
      {(0, temporal_js_1.dateReducer)(state.events, this.toMilestone, this.toNotification)}
      <Anchor ref={this.scrollAnchor} fullyLoaded={state.fullyLoaded}/>
    </div>;
    };
    return NotificationListing;
}(preact_1.Component));
exports.default = NotificationListing;
function Anchor(props) {
    return props.fullyLoaded
        ? <div>
      <div id="scroll-done">All notifications loaded</div>
    </div>
        : <div id="scroll-anchor">loading...</div>;
}
function TextNotification(props) {
    return <Notification event={props.event}>
    <message_js_1.TextMessage reactions={{}} displayOnly={true} event={props.event}/>
  </Notification>;
}
var Notification = /** @class */ (function (_super) {
    __extends(Notification, _super);
    function Notification(props) {
        var _a, _b, _c;
        var _this = _super.call(this, props) || this;
        _this.userColor = new colors_js_1.UserColor(_this.props.event.getSender());
        _this.userDisplayName = client_js_1.default.client.getUser(_this.props.event.getSender()).displayName;
        _this.avatarUrl = client_js_1.default.client.getUser(_this.props.event.getSender()).avatarUrl;
        _this.avatarHttpURI = client_js_1.default.client.getHttpUriForMxcFromHS(_this.avatarUrl, 20, 20, "crop");
        _this.originRoom = client_js_1.default.client.getRoom(_this.props.event.getRoomId());
        _this.originResource = (_a = _this.originRoom
            .getLiveTimeline().getState(Matrix.EventTimeline.BACKWARDS)
            .getStateEvents(Matrix.EventType.SpaceParent)[0]) === null || _a === void 0 ? void 0 : _a.getStateKey();
        _this.originAlias = _this.originResource
            ? (_b = client_js_1.default.client.getRoom(_this.originResource)) === null || _b === void 0 ? void 0 : _b.getCanonicalAlias()
            : null;
        _this.originAnnotation = _this.originResource
            ? (_c = client_js_1.default.client.getRoom(_this.originResource)) === null || _c === void 0 ? void 0 : _c.getLiveTimeline().getState(Matrix.EventTimeline.BACKWARDS).getStateEvents(Matrix.EventType.SpaceChild, _this.originRoom.roomId)
            : null;
        _this.originLocation = _this.originAnnotation ? new location_js_1.default(_this.originAnnotation) : null;
        _this.getTopic = function (_) {
            switch (_this.originLocation.getType()) {
                case "highlight": return _this.originLocation.getText();
                case "text": return <span class="non-text-topic">{Icons.pin}<span> a section of page {_this.originLocation.getPageIndex()}</span></span>;
                case "media-fragment": return <span class="non-text-topic">{Icons.headphones}<span>an interval from {_this.originLocation.getIntervalStart()} to {_this.originLocation.getIntervalEnd()}</span></span>;
            }
        };
        _this.handleClick = function (_) {
            var origin = _this.originLocation;
            var alias = encodeURIComponent(_this.originAlias.slice(1));
            var eventId = _this.props.event.getId();
            console.log(origin.event.getId());
            switch (_this.originLocation.getType()) {
                case "highlight":
                    history_js_1.default.push("/".concat(alias, "/").concat(origin.getPageIndex(), "/").concat(origin.getChild(), "/").concat(eventId));
                    break;
                case "text":
                    history_js_1.default.push("/".concat(alias, "/").concat(origin.getPageIndex(), "/").concat(origin.getChild(), "/").concat(eventId));
                    break;
                case "media-fragment":
                    history_js_1.default.push("/".concat(alias, "/").concat(_this.originLocation.getIntervalStart(), "/").concat(origin.getChild(), "/").concat(eventId));
                    break;
                default: console.log("unrecognized location type: ".concat(JSON.stringify(_this.originLocation)));
            }
        };
        _this.state = {
            unread: (0, unread_js_1.isUnread)(props.event)
        };
        _this.checkUnread = _this.checkUnread.bind(_this);
        return _this;
    }
    Notification.prototype.componentDidMount = function () {
        client_js_1.default.client.on("Room.accountData", this.checkUnread);
        // State events might cause excessive rerendering, but we can optimize for that later
    };
    Notification.prototype.componentWillUnmount = function () {
        client_js_1.default.client.off("Room.accountData", this.checkUnread);
    };
    Notification.prototype.checkUnread = function (_event, room) {
        if ((room === null || room === void 0 ? void 0 : room.roomId) === this.props.event.getRoomId()) {
            this.setState({ unread: (0, unread_js_1.isUnread)(this.props.event) });
        }
    };
    Notification.prototype.render = function (props, state) {
        var _a;
        // can sometimes take a second for these to sync with newly joined rooms. We don't render in that case
        if (client_js_1.default.client.getRoom(this.originResource) && this.originLocation) {
            return <div onclick={this.originAlias ? this.handleClick : null} class={state.unread ? "notification unread-notification" : "notification"} style={this.userColor.styleVariables}>
        {((_a = client_js_1.default.client.getRoom(this.originResource)) === null || _a === void 0 ? void 0 : _a.name)
                    ? <div class="discussion-intro">In <b>{client_js_1.default.client.getRoom(this.originResource).name}</b>, discussing</div>
                    : <div class="discussion-intro">Discussing</div>}
        <div class="discussion-topic">{this.getTopic()}</div>
        <div class="notification-header">
          {this.avatarHttpURI ? <img src={this.avatarHttpURI}/> : null}
          <span class="sender">{this.userDisplayName}</span>
          &nbsp;said:
        </div>
        <div class="notification-contents">
          {props.children}
        </div>
      </div>;
        }
    };
    return Notification;
}(preact_1.Component));
var InviteEntry = /** @class */ (function (_super) {
    __extends(InviteEntry, _super);
    function InviteEntry() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.accept = function (_) {
            client_js_1.default.client.joinRoom(_this.props.room.roomId);
            setTimeout(_this.props.handleRoom, 1000);
            // XXX the updates get grouped in such a way that the redraw misses the state
            // update that comes with the join. So we need to do a second update to the
            // room listing, here.
        };
        _this.decline = function (_) {
            client_js_1.default.client.leave(_this.props.room.roomId);
            setTimeout(_this.props.handleRoom, 1000);
        };
        return _this;
    }
    InviteEntry.prototype.render = function (props) {
        // TODO We can also get the room avatar, we should use that.
        return <div class="invite-entry">
      <div class="invite-heading">
        You are invited to join the discussion {props.room.name}.
      </div>
      <div class="invite-buttons">
        <button class="styled-button" onclick={this.accept}>Accept</button>
        <button class="styled-button" onclick={this.decline}>Decline</button>
      </div>
    </div>;
    };
    return InviteEntry;
}(preact_1.Component));

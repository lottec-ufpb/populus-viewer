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
var client_js_1 = require("./client.js");
var Matrix = require("matrix-js-sdk");
var location_js_1 = require("./utils/location.js");
var resource_js_1 = require("./utils/resource.js");
var Icons = require("./icons.js");
var PopupMenu = require("./popUpMenu.js");
var modal_js_1 = require("./modal.js");
var copyButton_js_1 = require("./utils/copyButton.js");
var avatarSelector_js_1 = require("./avatarSelector.js");
var constants_js_1 = require("./constants.js");
require("./styles/roomSettings.css");
var RoomSettings = /** @class */ (function (_super) {
    __extends(RoomSettings, _super);
    function RoomSettings(props) {
        var _a, _b, _c, _d, _e, _f, _g;
        var _this = _super.call(this, props) || this;
        _this.resizeObserver = new ResizeObserver(function (_) { return _this.resize(); });
        _this.settingsFormWrapper = (0, preact_1.createRef)();
        _this.settingsForm = (0, preact_1.createRef)();
        _this.avatarSelector = (0, preact_1.createRef)();
        _this.roomTopicTextarea = (0, preact_1.createRef)();
        _this.resize = function (_) {
            clearTimeout(_this.allowOverflow);
            _this.settingsFormWrapper.current.style.height = "".concat(_this.settingsForm.current.scrollHeight, "px");
            // we pause and reactivate overflow to allow the popup menu to overflow the box.
            _this.settingsFormWrapper.current.style.overflowY = "hidden";
            _this.allowOverflow = setTimeout(function (_) { return _this.settingsFormWrapper.current.style.overflowY = "visible"; }, 250);
        };
        _this.handleJoinRuleChange = function (e) { return _this.setState({ joinRule: e.target.value }); };
        _this.handleReadabilityChange = function (e) { return _this.setState({ readability: e.target.value }); };
        _this.handleSpaceVisibilityChange = function (e) { return _this.setState({ spaceVisibility: e.target.value }); };
        _this.handleNameInput = function (e) { return _this.setState({ roomName: e.target.value }); };
        _this.handleTopicInput = function (e) {
            _this.setState({ roomTopic: e.target.value });
            _this.roomTopicTextarea.current.style.height = "auto";
            _this.roomTopicTextarea.current.style.height = "".concat(_this.roomTopicTextarea.current.scrollHeight, "px");
        };
        _this.handleKeydown = function (e) { return e.stopPropagation(); }; // don't go to global keypress handler
        _this.handleDiscoveryChange = function (e) { return _this.setState({ discovery: e.target.value }); };
        _this.progressHandler = function (progress) { return _this.setState({ progress: progress }); };
        _this.avatarUpdateHandler = function () { return _this.setState({ avatarUpdated: true }); };
        _this.roleToPowerLevel = function (role) { return role === "admin" ? 100
            : role === "mod" ? 50
                : 0; }; // should never be called on "custom" power level
        _this.powerLevelsUpdated = function (_) {
            return !!_this.state.invite ||
                !!_this.state.ban ||
                !!_this.state.kick ||
                !!_this.state.redact ||
                !!_this.state.events_default ||
                !!_this.state[Matrix.EventType.SpaceChild] ||
                _this.rolesUpdated();
        };
        _this.rolesUpdated = function (_) {
            var _a, _b, _c, _d, _e, _f;
            for (var user in _this.state.users) {
                if (!(user in ((_a = _this.powerLevels) === null || _a === void 0 ? void 0 : _a.users)))
                    return true;
                if (_this.state.users[user] !== ((_c = (_b = _this.powerLevels) === null || _b === void 0 ? void 0 : _b.users) === null || _c === void 0 ? void 0 : _c[user]))
                    return true;
            }
            for (var user in (_d = _this.powerLevels) === null || _d === void 0 ? void 0 : _d.users) {
                if (!(user in _this.state.users))
                    return true;
                if (_this.state.users[user] !== ((_f = (_e = _this.powerLevels) === null || _e === void 0 ? void 0 : _e.users) === null || _f === void 0 ? void 0 : _f[user]))
                    return true;
            }
            return false;
        };
        _this.handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
            var allowList, newRule;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        e.preventDefault();
                        this.setState({ progress: "updating settings..." });
                        this.forceUpdate();
                        if (!(this.state.discovery !== this.initialDiscovery)) return [3 /*break*/, 2];
                        return [4 /*yield*/, client_js_1.default.client.setRoomDirectoryVisibility(this.props.room.roomId, this.state.discovery).catch(this.raiseErr)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(this.state.joinRule !== this.initialJoinRule)) return [3 /*break*/, 4];
                        allowList = this.props.resource
                            ? [{ type: "m.room_membership", room_id: this.props.resource.room.roomId }]
                            : this.roomState.getStateEvents(spaceParent).map(function (ev) { return ({ type: "m.room_membership", room_id: ev.getStateKey() }); });
                        newRule = __assign({ join_rule: this.state.joinRule }, (this.state.joinRule === "restricted" && { allow: allowList }));
                        return [4 /*yield*/, client_js_1.default.client.sendStateEvent(this.props.room.roomId, Matrix.EventType.RoomJoinRules, newRule, "").catch(this.raiseErr)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (this.state.spaceVisibility !== this.initialSpaceVisibility)
                            this.state.spaceVisibility === "visible" ? this.publishReferences() : this.hideReferences();
                        if (!(this.state.roomName !== this.initialRoomName)) return [3 /*break*/, 6];
                        return [4 /*yield*/, client_js_1.default.client.setRoomName(this.props.room.roomId, this.state.roomName).catch(this.raiseErr)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        if (!(this.state.roomTopic !== this.initialRoomTopic)) return [3 /*break*/, 8];
                        return [4 /*yield*/, client_js_1.default.client.setRoomTopic(this.props.room.roomId, this.state.roomTopic).catch(this.raiseErr)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        if (!(this.state.readability !== this.initialReadability)) return [3 /*break*/, 10];
                        return [4 /*yield*/, client_js_1.default.client.sendStateEvent(this.props.room.roomId, Matrix.EventType.RoomHistoryVisibility, {
                                history_visibility: this.state.readability
                            }).catch(this.raiseErr)];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10:
                        if (!this.powerLevelsUpdated()) return [3 /*break*/, 12];
                        if (this.state.invite)
                            this.powerLevels.invite = this.roleToPowerLevel(this.state.invite);
                        if (this.state.ban)
                            this.powerLevels.ban = this.roleToPowerLevel(this.state.ban);
                        if (this.state.kick)
                            this.powerLevels.kick = this.roleToPowerLevel(this.state.kick);
                        if (this.state.redact)
                            this.powerLevels.redact = this.roleToPowerLevel(this.state.redact);
                        if (this.state.events_default)
                            this.powerLevels.events_default = this.roleToPowerLevel(this.state.events_default);
                        if (this.state[Matrix.EventType.SpaceChild])
                            this.powerLevels.events[Matrix.EventType.SpaceChild] = this.roleToPowerLevel(this.state[Matrix.EventType.SpaceChild]);
                        if (this.rolesUpdated())
                            this.powerLevels.users = this.state.users;
                        return [4 /*yield*/, client_js_1.default.client.sendStateEvent(this.props.room.roomId, Matrix.EventType.RoomPowerLevels, this.powerLevels).catch(this.raiseErr)];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12: return [4 /*yield*/, this.avatarSelector.current.uploadAvatar()];
                    case 13:
                        _a.sent();
                        modal_js_1.default.hide();
                        return [2 /*return*/];
                }
            });
        }); };
        _this.raiseErr = function (_) { return alert("Something went wrong. You may not have permission to adjust some of these settings."); };
        _this.showAppearance = function (_) { return _this.setState({ view: "APPEARANCE" }); };
        _this.showAccess = function (_) { return _this.setState({ view: "ACCESS" }); };
        _this.showLinks = function (_) { return _this.setState({ view: "LINKS" }); };
        _this.showRoles = function (_) { return _this.setState({ view: "ROLES" }); };
        _this.showPermissions = function (_) { return _this.setState({ view: "PERMISSIONS" }); };
        _this.setPowerLevelRole = function (s, role) {
            var _a;
            return _this.setState((_a = {}, _a[s] = role, _a));
        };
        _this.setUsers = function (users) { return _this.setState({ users: users }); };
        _this.cancel = function (e) {
            e.preventDefault();
            modal_js_1.default.hide();
        };
        _this.roomState = props.room.getLiveTimeline().getState(Matrix.EventTimeline.FORWARDS);
        _this.resourceState = (_a = props.resource) === null || _a === void 0 ? void 0 : _a.room.getLiveTimeline().getState(Matrix.EventTimeline.FORWARDS);
        _this.initialJoinRule = _this.roomState.getJoinRule();
        _this.mayChangeJoinRule = _this.roomState.maySendStateEvent(Matrix.EventType.RoomJoinRules, client_js_1.default.client.getUserId());
        _this.mayChangeAvatar = _this.roomState.maySendStateEvent(Matrix.EventType.RoomAvatar, client_js_1.default.client.getUserId());
        _this.initialRoomName = props.room.name;
        _this.mayChangeRoomName = _this.roomState.maySendStateEvent(Matrix.EventType.RoomName, client_js_1.default.client.getUserId());
        _this.initialRoomTopic = (_c = (_b = _this.roomState.getStateEvents(Matrix.EventType.RoomTopic, "")) === null || _b === void 0 ? void 0 : _b.getContent()) === null || _c === void 0 ? void 0 : _c.topic;
        _this.mayChangeRoomTopic = _this.roomState.maySendStateEvent(Matrix.EventType.RoomTopic, client_js_1.default.client.getUserId());
        _this.initialReadability = props.room.getHistoryVisibility();
        if (_this.resourceState) {
            _this.initialSpaceVisibility = ((_e = (_d = _this.resourceState.getStateEvents(Matrix.EventType.SpaceChild, props.room.roomId)) === null || _d === void 0 ? void 0 : _d.getContent()) === null || _e === void 0 ? void 0 : _e.via)
                ? "visible"
                : "hidden";
            _this.mayChangeSpaceVisibility = _this.resourceState.maySendStateEvent(Matrix.EventType.SpaceChild, client_js_1.default.client.getUserId());
        }
        _this.restrictedAvailable = !["1", "2", "3", "4", "5", "6", "7"].includes(props.room.getVersion()) &&
            _this.roomState.getStateEvents(Matrix.EventType.SpaceChild).length > 0;
        _this.mayChangeReadability = _this.roomState.maySendStateEvent(Matrix.EventType.RoomHistoryVisibility, client_js_1.default.client.getUserId());
        _this.joinLink = "".concat(window.location.protocol, "//").concat(window.location.hostname).concat(window.location.pathname) +
            "?join=".concat(encodeURIComponent(props.room.roomId), "&via=").concat(client_js_1.default.client.getDomain());
        _this.powerLevels = (_f = _this.roomState.getStateEvents(Matrix.EventType.RoomPowerLevels, "")) === null || _f === void 0 ? void 0 : _f.getContent();
        // TODO: add a warning for the case where the powerLevels event is missing
        _this.member = props.room.getMember(client_js_1.default.client.getUserId());
        _this.state = {
            previewUrl: props.room.getAvatarUrl(client_js_1.default.client.getHomeserverUrl(), 400, 400, "crop"),
            joinRule: _this.initialJoinRule,
            roomName: _this.initialRoomName,
            readability: _this.initialReadability,
            spaceVisibility: _this.initialSpaceVisibility,
            roomTopic: _this.initialRoomTopic,
            users: ((_g = _this.powerLevels) === null || _g === void 0 ? void 0 : _g.users) || {},
            discovery: null,
            references: null,
            view: "APPEARANCE"
        };
        return _this;
    }
    RoomSettings.prototype.componentDidMount = function () {
        this.initialize();
        this.resizeObserver.observe(this.settingsForm.current);
        this.roomTopicTextarea.current.style.height = 'auto';
        this.roomTopicTextarea.current.style.height = "".concat(this.roomTopicTextarea.current.scrollHeight, "px");
    };
    RoomSettings.prototype.componentWillUnmount = function () {
        this.resizeObserver.disconnect();
        clearTimeout(this.allowOverflow);
    };
    RoomSettings.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sendStatePowerLevel, pl, discovery, references;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        sendStatePowerLevel = 50;
                        if (this.powerLevels) {
                            pl = (_a = this.powerLevels) === null || _a === void 0 ? void 0 : _a.state_default;
                            if (Number.isSafeInteger(pl))
                                sendStatePowerLevel = pl;
                        }
                        if (this.member.powerLevel >= sendStatePowerLevel)
                            this.mayChangeDiscovery = true;
                        return [4 /*yield*/, client_js_1.default.client.getRoomDirectoryVisibility(this.props.room.roomId)];
                    case 1:
                        discovery = _b.sent();
                        this.initialDiscovery = discovery.visibility;
                        references = this.roomState.getStateEvents(Matrix.EventType.SpaceParent);
                        this.setState({ references: references, discovery: discovery.visibility });
                        return [2 /*return*/];
                }
            });
        });
    };
    RoomSettings.prototype.publishReferences = function () {
        var _a;
        var theDomain = client_js_1.default.client.getDomain();
        for (var _i = 0, _b = this.state.references; _i < _b.length; _i++) {
            var reference = _b[_i];
            var theLocation = new location_js_1.default(reference);
            if (!theLocation.isValid())
                continue;
            var childContent = (_a = {
                    via: [theDomain]
                },
                _a[constants_js_1.mscLocation] = theLocation.location,
                _a);
            client_js_1.default.client
                .sendStateEvent(theLocation.getParent(), Matrix.EventType.SpaceChild, childContent, this.props.room.roomId)
                .catch(function (e) { return alert(e); });
        }
    };
    RoomSettings.prototype.hideReferences = function () {
        for (var _i = 0, _a = this.state.references; _i < _a.length; _i++) {
            var reference = _a[_i];
            var theLocation = new location_js_1.default(reference);
            if (!theLocation.isValid())
                continue;
            var childContent = {};
            client_js_1.default.client
                .sendStateEvent(theLocation.getParent(), Matrix.EventType.SpaceChild, childContent, this.props.room.roomId)
                .catch(function (e) { return alert(e); });
        }
    };
    RoomSettings.prototype.render = function (props, state) {
        var _a, _b, _c;
        var updated = this.powerLevelsUpdated() ||
            this.state.discovery !== this.initialDiscovery ||
            this.state.joinRule !== this.initialJoinRule ||
            this.state.roomName !== this.initialRoomName ||
            this.state.roomTopic !== this.initialRoomTopic ||
            this.state.readability !== this.initialReadability ||
            this.state.spaceVisibility !== this.initialSpaceVisibility ||
            this.state.avatarUpdated;
        return <preact_1.Fragment>
      <div id="room-settings-select-view" class="select-view">
        <button onClick={this.showAppearance} data-current-button={state.view === "APPEARANCE"}>Appearance</button>
        <button onClick={this.showAccess} data-current-button={state.view === "ACCESS"}>Access</button>
        <button onClick={this.showRoles} data-current-button={state.view === "ROLES"}>Roles</button>
        <button onClick={this.showPermissions} data-current-button={state.view === "PERMISSIONS"}>Permissions</button>
        {props.joinLink ? <button onClick={this.showLinks} data-current-button={state.view === "LINKS"}>Links</button> : null}
      </div>
      <div ref={this.settingsFormWrapper} id="room-settings-form-wrapper">
        <form ref={this.settingsForm} id="room-settings-form">
          {state.view === "APPEARANCE"
                ? <preact_1.Fragment>
              <avatarSelector_js_1.default ref={this.avatarSelector} previewUrl={state.previewUrl} room={props.room} progressHandler={this.progressHandler} handleUpdate={this.avatarUpdateHandler}/>
              <div class="room-settings-info"/>
              <label htmlFor="room-name">Room Name</label>
              <input name="room-name" type="text" class="styled-input" value={state.roomName} disabled={!this.mayChangeRoomName} onkeydown={this.handleKeydown} onInput={this.handleNameInput}/>
              <div class="room-settings-info"></div>
              <label class="top-aligned-label" htmlFor="room-topic">Topic</label>
              <textarea ref={this.roomTopicTextarea} name="room-topic" class="styled-input" value={state.roomTopic} disabled={!this.mayChangeRoomTopic} onkeydown={this.handleKeydown} onInput={this.handleTopicInput}/>
              <div class="room-settings-info"/>
            </preact_1.Fragment>
                : state.view === "ACCESS"
                    ? <preact_1.Fragment>
              <label htmlFor="discovery">Discovery</label>
              <select disabled={!state.discovery || !this.mayChangeDiscovery} class="styled-input" value={state.discovery} name="discovery" onchange={this.handleDiscoveryChange}>
                <option value="private">Private</option>
                <option value="public">Publicly Listed</option>
              </select>
              <div class="room-settings-info">
                {state.discovery === "public"
                            ? "the room will appear in room search results"
                            : "the room will not appear in room search results"}
              </div>
              <label htmlFor="joinRule">Join Rule</label>
              <select class="styled-input" value={state.joinRule} name="joinRule" onchange={this.handleJoinRuleChange}>
                <option value="public">Public</option>
                <option value="invite">Invite-Only</option>
                <option disabled={!this.restrictedAvailable} value="restricted">Restricted</option>
              </select>
              <div class="room-settings-info">
                {state.joinRule === "public" ? "anyone who can find the room may join"
                            : state.joinRule === "invite" ? "an explicit invitation is required before joining"
                                : props.resource ? "only someone with access to the resource being annotated may join"
                                    : "only someone with access to a collection containing this resource may join"}
              </div>
              <label htmlFor="readability">Readability</label>
              <select class="styled-input" value={state.readability} disabled={!this.mayChangeReadability} name="readability" onchange={this.handleReadabilityChange}>
                <option value="shared">Members Only</option>
                <option value="world_readable">World Readable</option>
              </select>
              <div class="room-settings-info">
                {state.readability === "world_readable"
                            ? "anyone can see what's happening in the room"
                            : "only room members can see what's happening in the room"}
              </div>
              {this.initialSpaceVisibility
                            ? <preact_1.Fragment>
                  <label htmlFor="spaceVisibility">Visibility</label>
                  <select class="styled-input" value={state.spaceVisibility} disabled={!this.mayChangeSpaceVisibility} name="spaceVisibility" onchange={this.handleSpaceVisibilityChange}>
                    <option value="visible">Visible </option>
                    <option value="hidden">Hidden</option>
                  </select>
                  <div class="room-settings-info">
                    {state.spaceVisibility === "visible"
                                    ? "the annotation is visible to everyone"
                                    : "the annotation is hidden unless you've already seen it"}
                  </div>
                </preact_1.Fragment>
                            : null}
            </preact_1.Fragment>
                    : state.view === "LINKS" ? <preact_1.Fragment>
                <label>Join Link</label>
                <div class="room-settings-link-group">
                  <pre id="room-settings-join-link">{this.joinLink} </pre>
                  <copyButton_js_1.default copy={this.joinLink}/>
                </div>
                <div class="room-settings-info">
                  Clicking this link will cause an attempt to join this room
                </div>
              </preact_1.Fragment>
                        : state.view === "ROLES" ? <preact_1.Fragment>
                <AdminList initialUsers={(_a = this.powerLevels) === null || _a === void 0 ? void 0 : _a.users} users={this.state.users} setUsers={this.setUsers} room={props.room}/>
                <ModList initialUsers={(_b = this.powerLevels) === null || _b === void 0 ? void 0 : _b.users} users={this.state.users} setUsers={this.setUsers} room={props.room}/>
                <OtherRoleList users={this.state.users}/>
            </preact_1.Fragment>
                            : state.view === "PERMISSIONS" ? <preact_1.Fragment>
                <ConfigurePowerForKey setPowerLevelRole={this.setPowerLevelRole} powerLevels={this.powerLevels} powerKey="invite" requiredRole={state.invite} label="Invite" member={this.member} act="invite new members"/>
                <ConfigurePowerForKey setPowerLevelRole={this.setPowerLevelRole} powerLevels={this.powerLevels} powerKey="kick" label="Kick" requiredRole={state.kick} member={this.member} act="remove users from the room"/>
                <ConfigurePowerForKey setPowerLevelRole={this.setPowerLevelRole} powerLevels={this.powerLevels} powerKey="ban" label="Ban" requiredRole={state.ban} member={this.member} act="remove users and ban them from rejoining"/>
                <ConfigurePowerForKey setPowerLevelRole={this.setPowerLevelRole} powerLevels={this.powerLevels} powerKey="redact" label="Redact" requiredRole={state.redact} member={this.member} act="remove any message from the room"/>
                {props.room.getType() === Matrix.RoomType.Space
                                    ? null
                                    : <ConfigurePowerForKey setPowerLevelRole={this.setPowerLevelRole} powerLevels={this.powerLevels} powerKey="events_default" label="Message" requiredRole={state.events_default} member={this.member} act="send messages"/>}
               {resource_js_1.default.hasResource(props.room)
                                    ? <ConfigurePowerForState setPowerLevelRole={this.setPowerLevelRole} powerLevels={this.powerLevels} type={Matrix.EventType.SpaceChild} requiredRole={state[Matrix.EventType.SpaceChild]} label="Annotate" member={this.member} act="create annotations"/>
                                    : null}
            </preact_1.Fragment>
                                : null}
          <div id="room-settings-submit-wrapper">
            <button disabled={!updated} className="styled-button" onClick={this.handleSubmit}>Save Changes</button>
            <button className="styled-button" onClick={this.cancel}>Cancel</button>
          </div>
          {typeof (state.progress) === "string"
                ? <div id="room-settings-progress">
              {state.progress}
            </div>
                : ((_c = state.progress) === null || _c === void 0 ? void 0 : _c.total)
                    ? <div id="room-settings-progress">
              <progress class="styled-progress" max={state.progress.total} value={state.progress.loaded}/>
            </div>
                    : null}
        </form>
      </div>
    </preact_1.Fragment>;
    };
    return RoomSettings;
}(preact_1.Component));
exports.default = RoomSettings;
var ConfigurePowerForState = /** @class */ (function (_super) {
    __extends(ConfigurePowerForState, _super);
    function ConfigurePowerForState(props) {
        var _this = _super.call(this, props) || this;
        _this.getPowerLevelForStateEvent = function (_) {
            var _a, _b;
            if (_this.props.type in ((_a = _this.props.powerLevels) === null || _a === void 0 ? void 0 : _a.events))
                return _this.props.powerLevels.events[_this.props.type];
            var sendStatePowerLevel = 50;
            if (_this.props.powerLevels) {
                var pl = (_b = _this.props.powerLevels) === null || _b === void 0 ? void 0 : _b.state_default;
                if (Number.isSafeInteger(pl))
                    sendStatePowerLevel = pl;
            }
            return sendStatePowerLevel;
        };
        _this.handleChange = function (e) {
            if (e.target.value === _this.initialRole)
                _this.props.setPowerLevelRole(_this.props.type, undefined);
            else
                _this.props.setPowerLevelRole(_this.props.type, e.target.value);
        };
        // but the maximum you can change it to is your own power level
        _this.mayChangePowerLevelForStateEvent = function (_) {
            var _a;
            if (Matrix.EventType.RoomPowerLevels in ((_a = _this.props.powerLevels) === null || _a === void 0 ? void 0 : _a.events)) {
                // forbidden if it's already set higher than your own level
                if (_this.props.member.powerLevel < getPowerLevelForStateEvent(_this.props.type))
                    return false;
                // or if you can't send power level events
                var toAdjustPowerLevels = _this.props.powerLevels.events[Matrix.EventType.RoomPowerLevels];
                return (_this.props.member.powerLevel >= toAdjustPowerLevels);
            }
            return true;
        };
        _this.mayChangePowerLevel = _this.mayChangePowerLevelForStateEvent();
        _this.initialPowerLevel = _this.getPowerLevelForStateEvent();
        _this.initialRole = _this.initialPowerLevel >= 100 ? "admin"
            : _this.initialPowerLevel >= 50 ? "mod"
                : _this.initialPowerLevel === 0 ? "member"
                    : "custom";
        return _this;
    }
    ConfigurePowerForState.prototype.render = function (props) {
        var currentRole = props.requiredRole || this.initialRole;
        return <preact_1.Fragment>
        <label htmlFor={props.label}>{props.label}</label>
        <select class="styled-input" value={currentRole} disabled={!this.mayChangePowerLevel} name={props.label} onchange={this.handleChange}>
          <option disabled={props.member.powerLevels < 100} value="admin">Administrators only</option>
          <option disabled={props.member.powerLevels < 50} value="mod">Moderators and above</option>
          <option value="member">Any member</option>
          {this.initialRole === "custom" ? <option value="custom">Custom Value</option> : null}
        </select>
        <div class="room-settings-info">
          {currentRole === "admin" ? "Only admins can ".concat(props.act)
                : currentRole === "mod" ? "Admins and moderators can ".concat(props.act)
                    : currentRole === "member" ? "Any room member can ".concat(props.act)
                        : "Powerlevel ".concat(this.initialPowerLevel, " is required to ").concat(props.act)}
        </div>
      </preact_1.Fragment>;
    };
    return ConfigurePowerForState;
}(preact_1.Component));
var ConfigurePowerForKey = /** @class */ (function (_super) {
    __extends(ConfigurePowerForKey, _super);
    function ConfigurePowerForKey(props) {
        var _this = _super.call(this, props) || this;
        _this.getPowerLevelForKey = function (_) {
            if (_this.props.powerKey in _this.props.powerLevels)
                return _this.props.powerLevels[_this.props.powerKey];
            if (_this.props.powerKey === "events_default")
                return 0;
            // if there's no powerlevel event, the state_default is zero, but that's
            // irrelevant because mayChange below will return true.
            return 50;
        };
        _this.handleChange = function (e) {
            if (e.target.value === _this.initialRole)
                _this.props.setPowerLevelRole(_this.props.powerKey, undefined);
            else
                _this.props.setPowerLevelRole(_this.props.powerKey, e.target.value);
        };
        // but the maximum you can change it to is your own power level
        _this.mayChangePowerLevelForKey = function (_) {
            var _a;
            if (Matrix.EventType.RoomPowerLevels in ((_a = _this.props.powerLevels) === null || _a === void 0 ? void 0 : _a.events)) {
                // forbidden if your powerlevel is lower than the current value
                if (_this.props.member.powerLevel < _this.getPowerLevelForKey(_this.props.powerKey))
                    return false;
                // or if you can't send power level events
                var toAdjustPowerLevels = _this.props.powerLevels.events[Matrix.EventType.RoomPowerLevels];
                return (_this.props.member.powerLevel >= toAdjustPowerLevels);
            }
            return true;
        };
        _this.mayChangePowerLevel = _this.mayChangePowerLevelForKey();
        _this.initialPowerLevel = _this.getPowerLevelForKey();
        _this.initialRole = _this.initialPowerLevel === 100 ? "admin"
            : _this.initialPowerLevel === 50 ? "mod"
                : _this.initialPowerLevel === 0 ? "member"
                    : "custom";
        return _this;
    }
    ConfigurePowerForKey.prototype.render = function (props) {
        var currentRole = props.requiredRole || this.initialRole;
        return <preact_1.Fragment>
        <label htmlFor={props.label}>{props.label}</label>
        <select class="styled-input" value={currentRole} disabled={!this.mayChangePowerLevel} name={props.label} onchange={this.handleChange}>
          <option value="admin">Administrators only</option>
          <option value="mod">Moderators and above</option>
          <option value="member">Any member</option>
          {this.initialRole === "custom" ? <option value="custom">Custom Value</option> : null}
        </select>
        <div class="room-settings-info">
          {currentRole === "admin" ? "Only admins can ".concat(props.act)
                : currentRole === "mod" ? "Admins and moderators can ".concat(props.act)
                    : currentRole === "member" ? "Any room member can ".concat(props.act)
                        : "Powerlevel ".concat(this.initialPowerLevel, " is required to ").concat(props.act)}
        </div>
      </preact_1.Fragment>;
    };
    return ConfigurePowerForKey;
}(preact_1.Component));
var AdminList = /** @class */ (function (_super) {
    __extends(AdminList, _super);
    function AdminList(props) {
        var _this = _super.call(this, props) || this;
        _this.getAdmins = function (_) {
            var admins = [];
            for (var user in _this.props.users) {
                if (_this.props.users[user] === 100) {
                    var activated = !(user in _this.props.initialUsers) ||
                        _this.props.initialUsers[user] !== _this.props.users[user];
                    admins.push(<RoleListing activated={activated} toggleRole={_this.toggleAdmin} room={_this.props.room} key={user} user={user}/>);
                }
            }
            for (var user in _this.props.initialUsers) {
                if (_this.props.initialUsers[user] === 100 && !(user in _this.props.users))
                    admins.push(<RoleListing deactivated toggleRole={_this.toggleAdmin} room={_this.props.room} key={user} user={user}/>);
            }
            if (admins.length > 0)
                return admins;
            else
                return <div class="room-settings-role-empty">No admins!</div>;
        };
        _this.toggleAdmin = function (user) {
            var newUsers = Object.assign({}, _this.props.users);
            if (newUsers[user] !== 100)
                newUsers[user] = 100;
            else
                delete newUsers[user];
            _this.props.setUsers(newUsers);
        };
        _this.addAdmin = function (user) {
            var newUsers = Object.assign({}, _this.props.users);
            if (newUsers[user] !== 100)
                newUsers[user] = 100;
            _this.props.setUsers(newUsers);
        };
        _this.canAdd = _this.props.room.getMember(client_js_1.default.client.getUserId()).powerLevel >= 50;
        _this.state = { search: "" };
        return _this;
    }
    AdminList.prototype.render = function (props) {
        return <div class="room-settings-role-list">
      <h5>Administrators</h5>
      {this.getAdmins()}
      {this.canAdd ? <AddRole users={props.users} addRole={this.addAdmin} room={props.room}/> : null}
    </div>;
    };
    return AdminList;
}(preact_1.Component));
var AddRole = /** @class */ (function (_super) {
    __extends(AddRole, _super);
    function AddRole(props) {
        var _this = _super.call(this, props) || this;
        _this.searchInput = (0, preact_1.createRef)();
        _this.handleInput = function (e) { return _this.setState({ search: e.target.value }); };
        _this.setSearch = function (search) { return _this.setState({ search: search }); };
        _this.popupActions = { "@": function (props) { return <PopupMenu.Members roomId={_this.props.room.roomId} {...props}/>; }, };
        _this.addRole = function (userId) {
            _this.setSearch("");
            if (client_js_1.default.client.getUserId() !== userId.trim()) {
                var theirPower = _this.props.room.getMember(userId.trim()).powerLevel;
                var myPower = _this.props.room.getMember(client_js_1.default.client.getUserId()).powerLevel;
                if (theirPower >= myPower)
                    return; // TODO could trigger a transitent explainer here.
            }
            _this.props.addRole(userId.trim());
        };
        _this.state = { search: "" };
        return _this;
    }
    AddRole.prototype.render = function (props, state) {
        return <div class="room-settings-add-role">
      <span class="small-icon">{Icons.userPlus}</span>
      <div class="room-settings-add-role-input-wrapper">
        <input ref={this.searchInput} oninput={this.handleInput} value={state.search} type="text" class="styled-input"/>
        <PopupMenu.Menu below={true} textValue={state.search} textarea={this.searchInput} actions={this.popupActions} getSelection={this.addRole}/>
      </div>
    </div>;
    };
    return AddRole;
}(preact_1.Component));
var ModList = /** @class */ (function (_super) {
    __extends(ModList, _super);
    function ModList() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getMods = function (_) {
            var mods = [];
            for (var user in _this.props.users) {
                if (_this.props.users[user] === 50) {
                    var activated = !(user in _this.props.initialUsers) ||
                        _this.props.initialUsers[user] !== _this.props.users[user];
                    mods.push(<RoleListing activated={activated} toggleRole={_this.toggleMod} key={user} room={_this.props.room} user={user} power={50}/>);
                }
            }
            for (var user in _this.props.initialUsers) {
                if (_this.props.initialUsers[user] === 50 && !(user in _this.props.users))
                    mods.push(<RoleListing deactivated toggleRole={_this.toggleMod} key={user} room={_this.props.room} user={user} power={50}/>);
            }
            if (mods.length > 0)
                return mods;
            else
                return <div class="room-settings-role-empty">None</div>;
        };
        _this.toggleMod = function (user) {
            var newUsers = Object.assign({}, _this.props.users);
            if (newUsers[user] !== 50)
                newUsers[user] = 50;
            else
                delete newUsers[user];
            _this.props.setUsers(newUsers);
        };
        _this.addMod = function (user) {
            var newUsers = Object.assign({}, _this.props.users);
            if (newUsers[user] !== 50)
                newUsers[user] = 50;
            _this.props.setUsers(newUsers);
        };
        _this.canAdd = _this.props.room.getMember(client_js_1.default.client.getUserId()).powerLevel >= 50;
        return _this;
    }
    ModList.prototype.render = function (props) {
        return <div class="room-settings-role-list">
      <h5>Moderators</h5>
      {this.getMods()}
      {this.canAdd ? <AddRole users={props.users} addRole={this.addMod} room={props.room}/> : null}
    </div>;
    };
    return ModList;
}(preact_1.Component));
var RoleListing = /** @class */ (function (_super) {
    __extends(RoleListing, _super);
    function RoleListing() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleClick = function (_) { _this.props.toggleRole(_this.props.user); };
        _this.canToggle = _this.props.user === client_js_1.default.client.getUserId() ||
            _this.props.activated ||
            _this.props.power < _this.props.room.getMember(client_js_1.default.client.getUserId()).powerLevel;
        return _this;
    }
    RoleListing.prototype.render = function (props) {
        return <button type="button" data-role-deactivated={props.deactivated} data-role-toggleable={this.canToggle} onclick={this.canToggle ? this.handleClick : null} class="room-settings-role-listing">
        <span class="small-icon">{props.deactivated ? Icons.userPlus : Icons.userMinus}</span>
        <span class="room-settings-role-user"> {props.user}</span>
        {props.activated ? <span class="room-settings-role-change-info">will be added to this role</span> : null}
        {props.deactivated ? <span class="room-settings-role-change-info">will be removed from this role</span> : null}
        {(props.deactivated || props.activated) && client_js_1.default.client.getUserId() === props.user
                ? <span style={{ marginTop: "5px", color: "red" }} class="room-settings-role-change-info">
                <b>Warning</b>: changing your own role can be irreversible, and can cause you to lose control of the room.
            </span>
                : null}
      </button>;
    };
    return RoleListing;
}(preact_1.Component));
var OtherRoleList = /** @class */ (function (_super) {
    __extends(OtherRoleList, _super);
    function OtherRoleList() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getOtherRoles = function (_) {
            var others = [];
            for (var user in _this.props.users) {
                if (_this.props.users[user] !== 100 && _this.props.users[user] !== 50)
                    others.push(<div class="room-settings-otherrole-listing" key={user}>{user}</div>);
            }
            if (others.length > 0)
                return others;
            else
                return null;
        };
        return _this;
    }
    OtherRoleList.prototype.render = function () {
        if (!this.getOtherRoles())
            return null;
        else
            return <div class="room-settings-role-list">
      <h5>Other Roles</h5>
      {this.getOtherRoles()}
    </div>;
    };
    return OtherRoleList;
}(preact_1.Component));

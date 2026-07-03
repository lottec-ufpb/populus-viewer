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
var userPill_js_1 = require("./userPill.js");
var memberPill_js_1 = require("./memberPill.js");
var Matrix = require("matrix-js-sdk");
var client_js_1 = require("./client.js");
var search_js_1 = require("./search.js");
var Icons = require("./icons.js");
require("./styles/invite.css");
var ManageMembership = /** @class */ (function (_super) {
    __extends(ManageMembership, _super);
    function ManageMembership(props) {
        var _this = _super.call(this, props) || this;
        _this.inviteSelect = (0, preact_1.createRef)();
        _this.inviteSelectWrapper = (0, preact_1.createRef)();
        _this.resize = function (_) { return _this.inviteSelectWrapper.current.style.height = "".concat(_this.inviteSelect.current.scrollHeight, "px"); };
        _this.updateMembership = function (event) {
            if (event.getRoomId() === _this.props.room.roomId)
                _this.setState({
                    joins: _this.getSortedMembership("join"),
                    invites: _this.getSortedMembership("invite"),
                    bans: _this.getSortedMembership("ban"),
                    leaves: _this.getSortedMembership("leave"),
                    knocks: _this.getSortedMembership("knocks")
                });
        };
        _this.filterMembers = function (search) { return _this.setState({ search: search }); };
        _this.joinMembers = function (_) { return _this.setState({ view: "JOINING" }); };
        _this.kickMembers = function (_) { return _this.setState({ view: "KICKING" }); };
        _this.banMembers = function (_) { return _this.setState({ view: "BANNING" }); };
        _this.unbanMembers = function (_) { return _this.setState({ view: "UNBANNING" }); };
        _this.getSortedMembership = function (membership) { return _this.props.room.getMembersWithMembership(membership)
            .sort(function (u1, u2) { return u1.name.toUpperCase() > u2.name.toUpperCase() ? 1 : -1; }); };
        _this.isInvitable = function (userId) {
            if (_this.state.joins.some(function (join) { return join.userId === userId; }))
                return false;
            if (_this.state.invites.some(function (invite) { return invite.userId === userId; }))
                return false;
            if (_this.state.bans.some(function (ban) { return ban.userId === userId; }))
                return false;
            return true;
        };
        _this.isKnocking = function (userId) { return _this.state.knocks.some(function (knock) { return knock.userId == userId; }); };
        _this.getRemovalListing = function (_) { return _this.state.joins
            .filter(function (m) { return m.name.toUpperCase().includes(_this.state.search.toUpperCase()); }); };
        _this.getDisinviteListing = function (_) { return _this.state.invites
            .filter(function (m) { return m.name.toUpperCase().includes(_this.state.search.toUpperCase()); }); };
        _this.getBanListing = function (_) { return _this.state.joins
            .filter(function (m) { return m.name.toUpperCase().includes(_this.state.search.toUpperCase()); }); };
        _this.getInviteListing = function (_) { return client_js_1.default.client.getUsers()
            .filter(function (u) { return _this.isInvitable(u.userId); })
            .filter(function (u) { return !_this.isKnocking(u.userId); })
            .filter(function (u) { return u.displayName.toUpperCase().includes(_this.state.search.toUpperCase()); })
            .sort(function (u1, u2) { return u1.displayName.toUpperCase() > u2.displayName.toUpperCase() ? 1 : -1; }); };
        _this.getKnockResponseListing = function (_) { return _this.state.knocks
            .filter(function (m) { return m.name.toUpperCase().includes(_this.state.search.toUpperCase()); }); };
        _this.state = {
            view: "JOINING",
            joins: _this.getSortedMembership("join"),
            invites: _this.getSortedMembership("invite"),
            bans: _this.getSortedMembership("ban"),
            knocks: _this.getSortedMembership("knock"),
            search: ""
        };
        return _this;
    }
    ManageMembership.prototype.componentDidMount = function () {
        client_js_1.default.client.on("RoomMember.membership", this.updateMembership);
        this.resize();
    };
    ManageMembership.prototype.componentWillUnmount = function () {
        client_js_1.default.client.off("RoomMember.membership", this.updateMembership);
    };
    ManageMembership.prototype.componentDidUpdate = function () {
        this.resize();
    };
    ManageMembership.prototype.render = function (props, state) {
        var roomState = props.room.getLiveTimeline()
            .getState(Matrix.EventTimeline.FORWARDS);
        var userMember = props.room.getMember(client_js_1.default.client.getUserId());
        var canInvite = roomState.hasSufficientPowerLevelFor("invite", userMember.powerLevel);
        var canKick = roomState.hasSufficientPowerLevelFor("kick", userMember.powerLevel);
        var canBan = roomState.hasSufficientPowerLevelFor("ban", userMember.powerLevel);
        var canUnban = roomState.hasSufficientPowerLevelFor("unban", userMember.powerLevel);
        var inviteListing = this.getInviteListing();
        return <preact_1.Fragment>
      <search_js_1.default search={state.search} setSearch={this.filterMembers}/>
      <div id="invite-select-view" class="select-view">
        <button disabled={!canInvite} onClick={this.joinMembers} data-current-button={state.view === "JOINING"}>Invite</button> 
        <button disabled={!canKick} onClick={this.kickMembers} data-current-button={state.view === "KICKING"}>Remove</button> 
        <button disabled={!canBan} onClick={this.banMembers} data-current-button={state.view === "BANNING"}>Ban</button> 
        <button disabled={!canUnban} onClick={this.unbanMembers} data-current-button={state.view === "UNBANNING"}>Unban</button> 
      </div>
      <div ref={this.inviteSelectWrapper} id="invite-select-wrapper">
        {state.view === "JOINING"
                ? <div ref={this.inviteSelect} id="invite-join-members">
            <div>
              {this.getKnockResponseListing().map(function (m) { return <KnockResponse member={m} room={props.room} key={m.userId}/>; })}
              {inviteListing.map(function (u) { return <Invitation user={u} room={props.room} key={u.userId}/>; })}
            </div>
            <ServerResults resize={this.resize} search={state.search} isInvitable={this.isInvitable} inviteListing={inviteListing} room={props.room}/>
          </div>
                : state.view === "KICKING"
                    ? <div ref={this.inviteSelect} id="invite-kick-members">
            {this.getRemovalListing().map(function (m) { return <Removal member={m} userMember={userMember} room={props.room} key={m.userId}/>; })}
            {this.getDisinviteListing().map(function (m) { return <Disinvitation member={m} userMember={userMember} room={props.room} key={m.userId}/>; })}
          </div>
                    : state.view === "BANNING"
                        ? <div ref={this.inviteSelect} id="invite-ban-members">
            {this.getBanListing().map(function (m) { return <Ban member={m} userMember={userMember} room={props.room} key={m.userId}/>; })}
          </div>
                        : state.view === "UNBANNING"
                            ? <div ref={this.inviteSelect} id="invite-unban-members">
            {this.state.bans.map(function (m) { return <Unban member={m} room={props.room} key={m.userId}/>; })}
          </div>
                            : null}
      </div>
    </preact_1.Fragment>;
    };
    return ManageMembership;
}(preact_1.Component));
exports.default = ManageMembership;
var Invitation = /** @class */ (function (_super) {
    __extends(Invitation, _super);
    function Invitation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.invite = function (_) { return client_js_1.default.client
            .invite(_this.props.room.roomId, _this.props.user.userId || _this.props.user.user_id)
            // ^^^ handles raw results from the user directory which have user_id rather than userId
            .catch(alert); };
        return _this;
    }
    Invitation.prototype.render = function (props) {
        return <button class="invite-candidate" onclick={this.invite}>
      <span class="small-icon">{Icons.userPlus}</span>
      <span><userPill_js_1.default user={props.user}/></span>
    </button>;
    };
    return Invitation;
}(preact_1.Component));
var KnockResponse = /** @class */ (function (_super) {
    __extends(KnockResponse, _super);
    function KnockResponse() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.invite = function (_) { return client_js_1.default.client
            .invite(_this.props.room.roomId, _this.props.member.userId)
            // ^^^ handles raw results from the user directory which have user_id rather than userId
            .catch(alert); };
        return _this;
    }
    KnockResponse.prototype.render = function (props) {
        return <button class="invite-candidate" onclick={this.invite}>
      <span class="small-icon">{Icons.userPlus}</span>
      <span><memberPill_js_1.default user={props.member}/></span>
      <span class="invite-candidate-knocked">has requested an invitation</span>
    </button>;
    };
    return KnockResponse;
}(preact_1.Component));
var Disinvitation = /** @class */ (function (_super) {
    __extends(Disinvitation, _super);
    function Disinvitation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.kick = function (_) { return client_js_1.default.client
            .kick(_this.props.room.roomId, _this.props.member.userId)
            .catch(alert); };
        return _this;
    }
    Disinvitation.prototype.render = function (props) {
        if (props.userMember.powerLevel <= props.member.powerLevel)
            return null;
        return <button class="disinvite-candidate" onclick={this.kick}>
      <span class="small-icon">{Icons.userMinus}</span>
      <span><memberPill_js_1.default member={props.member}/></span>
    </button>;
    };
    return Disinvitation;
}(preact_1.Component));
var Removal = /** @class */ (function (_super) {
    __extends(Removal, _super);
    function Removal() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.kick = function (_) { return client_js_1.default.client
            .kick(_this.props.room.roomId, _this.props.member.userId)
            .catch(alert); };
        return _this;
    }
    Removal.prototype.render = function (props) {
        if (props.userMember.powerLevel <= props.member.powerLevel)
            return null;
        return <button class="removal-candidate" onclick={this.kick}>
      <span class="small-icon">{Icons.userMinus}</span>
      <span><memberPill_js_1.default member={props.member}/></span>
    </button>;
    };
    return Removal;
}(preact_1.Component));
var Ban = /** @class */ (function (_super) {
    __extends(Ban, _super);
    function Ban() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ban = function (_) { return client_js_1.default.client
            .ban(_this.props.room.roomId, _this.props.member.userId)
            .catch(alert); };
        return _this;
    }
    Ban.prototype.render = function (props) {
        if (props.userMember.powerLevel <= props.member.powerLevel)
            return null;
        return <button class="ban-candidate" onclick={this.ban}>
      <span class="small-icon">{Icons.userX}</span>
      <span><memberPill_js_1.default member={props.member}/></span>
    </button>;
    };
    return Ban;
}(preact_1.Component));
var Unban = /** @class */ (function (_super) {
    __extends(Unban, _super);
    function Unban() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.unban = function (_) { return client_js_1.default.client
            .unban(_this.props.room.roomId, _this.props.member.userId)
            .catch(alert); };
        return _this;
    }
    Unban.prototype.render = function (props) {
        return <button class="unban-candidate" onclick={this.unban}>
      <span class="small-icon">{Icons.userCheck}</span>
      <span><memberPill_js_1.default member={props.member}/></span>
    </button>;
    };
    return Unban;
}(preact_1.Component));
var ServerResults = /** @class */ (function (_super) {
    __extends(ServerResults, _super);
    function ServerResults(props) {
        var _this = _super.call(this, props) || this;
        _this.serverSearch = function (_) { return __awaiter(_this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setState({ pending: true });
                        return [4 /*yield*/, client_js_1.default.client.searchUserDirectory({ term: this.props.search })];
                    case 1:
                        results = (_a.sent()).results;
                        this.setState({ results: results, fired: true, pending: false }, this.props.resize);
                        return [2 /*return*/];
                }
            });
        }); };
        _this.state = {
            results: [],
            pending: false,
            fired: false
        };
        return _this;
    }
    ServerResults.prototype.render = function (props, state) {
        var buttonStyle = {
            visibility: props.search ? "visible" : "hidden"
        };
        var candidates = state.results
            .filter(function (u) { return !props.inviteListing.map(function (a) { return a.userId; }).includes(u.user_id); })
            .filter(function (u) { return props.isInvitable(u.user_id); })
            .filter(function (u) { return u.display_name
            ? u.display_name.toUpperCase().includes(props.search.toUpperCase())
            : u.user_id.toUpperCase().includes(props.search.toUpperCase()); });
        return <preact_1.Fragment>
      {state.fired && candidates.length > 0 ? <hr id="invite-search-divider"/> : null}
      {candidates.map(function (u) { return <Invitation key={u.user_id} user={u} room={props.room}/>; })}
      <div>
        <button style={buttonStyle} id="invite-search-directory" class="styled-button" disabled={state.pending} onclick={this.serverSearch}>
          {state.fired
                ? "Search again?"
                : "Search for more people?"}
        </button>
      </div>
    </preact_1.Fragment>;
    };
    return ServerResults;
}(preact_1.Component));

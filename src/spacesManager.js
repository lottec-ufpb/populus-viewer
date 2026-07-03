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
var client_js_1 = require("./client.js");
require("./styles/spacesManager.css");
var modal_js_1 = require("./modal.js");
var alerts_js_1 = require("./utils/alerts.js");
var manageMembership_js_1 = require("./manageMembership.js");
var resource_js_1 = require("./utils/resource.js");
var roomSettings_js_1 = require("./roomSettings.js");
var search_js_1 = require("./search.js");
var leaveRoom_js_1 = require("./leaveRoom.js");
var archiveRoom_js_1 = require("./archiveRoom.js");
var addCollection_js_1 = require("./addCollection.js");
var roomIcon_js_1 = require("./roomIcon.js");
var tooltip_js_1 = require("./utils/tooltip.js");
var roomIcon_js_2 = require("./roomIcon.js");
var Icons = require("./icons.js");
var colors_js_1 = require("./utils/colors.js");
var constants_js_1 = require("./constants.js");
var SpacesManager = /** @class */ (function (_super) {
    __extends(SpacesManager, _super);
    function SpacesManager(props) {
        var _this = _super.call(this, props) || this;
        _this.handleRoom = function (_) {
            clearTimeout(_this.roomDebounceTimeout);
            _this.roomDebounceTimeout = setTimeout(function (_) {
                _this.setState({
                    spaces: client_js_1.default.client.getVisibleRooms()
                        .filter(function (room) { return room.getMyMembership() === "join"; })
                        .filter(_this.isActiveCollection)
                });
            });
        };
        _this.filterToggle = function (s) {
            var newItems = _this.props.filterItems.filter(function (item) { return item.value !== s.value; });
            if (newItems.length === _this.props.filterItems.length)
                newItems.push(s);
            _this.props.setFilterItems(newItems);
            _this.props.showMainView
                ? _this.props.showMainView()
                : null;
        };
        _this.addCollection = function (_) {
            modal_js_1.default.set(<addCollection_js_1.default />, "Add New Collection");
        };
        SpacesManager.init();
        _this.state = {
            spaces: client_js_1.default.client.getVisibleRooms()
                .filter(function (room) { return room.getMyMembership() === "join"; })
                .filter(_this.isActiveCollection)
        };
        return _this;
    }
    SpacesManager.init = function () {
        if (SpacesManager.initialized)
            return;
        SpacesManager.initialized = true;
        SpacesManager.spaces = {};
        client_js_1.default.client.on("RoomState.events", function (e) {
            if (SpacesManager.spaces[e.getRoomId()] && e.getType() === Matrix.EventType.SpaceChild) {
                if (e.getContent().via) {
                    var responsePromise = client_js_1.default.client.getRoomHierarchy(e.getStateKey(), 1, 0);
                    responsePromise.then(function (response) {
                        var child = response.rooms[0];
                        SpacesManager.spaces[e.getRoomId()].children[child.room_id] = child;
                        SpacesManager.spaces[e.getRoomId()].via[e.getStateKey()] = e.getContent().via;
                    }).then(function (_) { return client_js_1.default.client.emit("Space.update", e.getRoomId()); });
                }
                else {
                    delete SpacesManager.spaces[e.getRoomId()].children[e.getStateKey()];
                    client_js_1.default.client.emit("Space.update", e.getRoomId());
                }
            }
        });
    };
    SpacesManager.prototype.componentDidMount = function () {
        client_js_1.default.client.on("Room", this.handleRoom);
        client_js_1.default.client.on("Room.name", this.handleRoom);
        client_js_1.default.client.on("Room.accountData", this.handleRoom);
    };
    SpacesManager.prototype.componentWillUnmount = function () {
        client_js_1.default.client.off("Room", this.handleRoom);
        client_js_1.default.client.off("Room.name", this.handleRoom);
        client_js_1.default.client.off("Room.accountData", this.handleRoom);
    };
    SpacesManager.prototype.isActiveCollection = function (room) {
        var _a;
        var roomState = room.getLiveTimeline().getState(Matrix.EventTimeline.FORWARDS);
        var creation = roomState.getStateEvents("m.room.create", "");
        var isSpace = ((_a = creation === null || creation === void 0 ? void 0 : creation.getContent()) === null || _a === void 0 ? void 0 : _a.type) === "m.space";
        var isActive = !room.tags["m.lowpriority"];
        return isSpace && isActive && !resource_js_1.default.hasResource(room);
    };
    SpacesManager.prototype.render = function (props, state) {
        var _this = this;
        return <div id="spaces-manager">
      <h1>Collections</h1>
      <hr class="styled-rule"/>
      <div id="spaces-list">
        {state.spaces.map(function (room) { return <SpaceListing filterToggle={_this.filterToggle} oneColumn={props.oneColumn} key={room.roomId} room={room}/>; })}
      </div>
      <div>
        <button onclick={this.addCollection} id="add-space">Add Collection</button>
      </div>
    </div>;
    };
    return SpacesManager;
}(preact_1.Component));
exports.default = SpacesManager;
var SpaceListing = /** @class */ (function (_super) {
    __extends(SpaceListing, _super);
    function SpaceListing(props) {
        var _this = _super.call(this, props) || this;
        _this.handleSpaceUpdate = function (roomId) {
            if (roomId === _this.props.room.roomId) {
                var children = SpacesManager.spaces[_this.props.room.roomId].children;
                var via = SpacesManager.spaces[_this.props.room.roomId].via;
                _this.setState({ via: via, children: children }, _this.refreshModal);
            }
        };
        _this.loadChildren = function (_) { return __awaiter(_this, void 0, void 0, function () {
            var nextBatch, response, via, _i, _a, childState, children, _b, _c, child;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        nextBatch = SpacesManager.spaces[this.props.room.roomId].nextBatch;
                        return [4 /*yield*/, client_js_1.default.client.getRoomHierarchy(this.props.room.roomId, 30, 1, false, nextBatch)];
                    case 1:
                        response = _e.sent();
                        via = SpacesManager.spaces[this.props.room.roomId].via;
                        for (_i = 0, _a = (_d = response.rooms[0]) === null || _d === void 0 ? void 0 : _d.children_state; _i < _a.length; _i++) {
                            childState = _a[_i];
                            via[childState.state_key] = childState.content.via;
                        }
                        children = SpacesManager.spaces[this.props.room.roomId].children;
                        for (_b = 0, _c = response.rooms; _b < _c.length; _b++) {
                            child = _c[_b];
                            if (child.room_id !== this.props.room.roomId)
                                children[child.room_id] = child;
                        }
                        nextBatch = response.next_batch;
                        SpacesManager.spaces[this.props.room.roomId] = { via: via, children: children, nextBatch: nextBatch };
                        this.setState({ via: via, children: children }, this.refreshModal);
                        return [2 /*return*/];
                }
            });
        }); };
        _this.pageChildren = function (_) { return __awaiter(_this, void 0, void 0, function () {
            var nextBatch;
            return __generator(this, function (_a) {
                nextBatch = SpacesManager.spaces[this.props.room.roomId].nextBatch;
                if (nextBatch)
                    this.loadChildren();
                return [2 /*return*/];
            });
        }); };
        _this.addChildren = function (_) {
            var limit = _this.state.limit + 15;
            if (limit > Object.keys(_this.state.children).length)
                _this.pageChildren();
            _this.setState({ limit: limit });
        };
        _this.refreshModal = function (_) { return modal_js_1.default.getTitle() === "Manage Discussions"
            ? modal_js_1.default.set(<AddChild children={Object.values(_this.state.children)} nextBatch={_this.state.nextBatch} pageChildren={_this.pageChildren} room={_this.props.room}/>, "Manage Discussions", "to ".concat(_this.props.room.name))
            : null; };
        _this.searchMe = function (_) { return _this.props.filterToggle({
            display: <preact_1.Fragment><span class="small-icon">{Icons.collection}</span>{_this.props.room.name}</preact_1.Fragment>,
            value: "*".concat(_this.props.room.name)
        }); };
        _this.toggleActions = function (_) { return _this.setState(function (oldState) { return { actionsVisible: !oldState.actionsVisible }; }); };
        _this.addChild = function (_) {
            _this.setState({ actionsVisible: false });
            modal_js_1.default.set(<AddChild 
            // the root is always first in the listing
            children={Object.values(_this.state.children)} nextBatch={_this.state.nextBatch} pageChildren={_this.pageChildren} room={_this.props.room}/>, "Manage Discussions", "in ".concat(_this.props.room.name));
        };
        _this.joinChild = function (roomId) { return client_js_1.default.client.joinRoom(roomId, { viaServers: _this.state.via[roomId] })
            .catch((0, alerts_js_1.toastError)("Couldn't join this discussion")); };
        _this.toggleChild = function (roomId, name) { return _this.props.filterToggle({
            value: roomId,
            display: <preact_1.Fragment><span class="small-icon">{Icons.page}</span>{name}</preact_1.Fragment>
        }); };
        _this.openSettings = function (_) {
            _this.setState({ actionsVisible: false });
            modal_js_1.default.set(<roomSettings_js_1.default joinLink={true} room={_this.props.room}/>, "Room Settings", "for ".concat(_this.props.room.name));
        };
        _this.openMembership = function (_) {
            _this.setState({ actionsVisible: false });
            modal_js_1.default.set(<manageMembership_js_1.default room={_this.props.room}/>, "Manage Membership", "for ".concat(_this.props.room.name));
        };
        _this.handleClose = function (_) { return modal_js_1.default.set(<leaveRoom_js_1.default room={_this.props.room}/>, "Leave Room?", "for ".concat(_this.props.room.name)); };
        _this.archiveRoom = function (_) { return modal_js_1.default.set(<archiveRoom_js_1.default room={_this.props.room}/>, "Archive Collection?", "for ".concat(_this.props.room.name)); };
        _this.roomColor = new colors_js_1.RoomColor(_this.props.room.name);
        if (!SpacesManager.spaces[_this.props.room.roomId]) {
            SpacesManager.spaces[_this.props.room.roomId] = {
                via: {},
                children: {},
                nextBatch: null
            };
        }
        _this.initialChildCount = props.room.getLiveTimeline()
            .getState(Matrix.EventTimeline.FORWARDS)
            .getStateEvents("m.space.child")
            .filter(function (childEvent) { var _a; return (_a = childEvent.getContent()) === null || _a === void 0 ? void 0 : _a.via; })
            .length;
        _this.state = {
            actionsVisible: false,
            // We use an array here to avoid duplicating children
            children: SpacesManager.spaces[_this.props.room.roomId].children,
            limit: 30,
            via: SpacesManager.spaces[_this.props.room.roomId].via
        };
        return _this;
    }
    SpaceListing.prototype.componentDidMount = function () {
        client_js_1.default.client.on("Space.update", this.handleSpaceUpdate);
        if (this.state.limit > Object.keys(this.state.children).length)
            this.loadChildren();
    };
    SpaceListing.prototype.componentWillUnmount = function () {
        client_js_1.default.client.off("Space.update", this.handleSpaceUpdate);
    };
    SpaceListing.prototype.render = function (props, state) {
        var _this = this;
        var userMember = props.room.getMember(client_js_1.default.client.getUserId());
        var isAdmin = userMember.powerLevel >= 100;
        var canInvite = props.room.getLiveTimeline()
            .getState(Matrix.EventTimeline.FORWARDS)
            .hasSufficientPowerLevelFor("invite", userMember.powerLevel);
        // should do this in a more fine-grained way with hasSufficientPowerLevelFor
        return <div style={this.roomColor.styleVariables} class="space-listing">
      <h3>
        <span onclick={this.searchMe}>{props.room.name}</span>
        <button data-narrow-view={props.oneColumn} onclick={this.toggleActions}>{Icons.moreVertical}</button>
      </h3>
      {state.actionsVisible
                ? <div class="space-listing-actions">
          {isAdmin
                        ? <tooltip_js_1.default content="Add new discussion">
              <button class="small-icon" onclick={this.addChild}>{Icons.newDiscussion}</button> 
            </tooltip_js_1.default>
                        : null}
          {canInvite
                        ? <tooltip_js_1.default content="Manage membership">
              <button class="small-icon" onclick={this.openMembership}>{Icons.userPlus}</button> 
            </tooltip_js_1.default>
                        : null}
          {isAdmin
                        ? <tooltip_js_1.default content="Configure settings">
                <button class="small-icon" onclick={this.openSettings}>{Icons.settings}</button> 
              </tooltip_js_1.default>
                        : null}
          <tooltip_js_1.default content="Hide and archive">
            <button class="small-icon" onclick={this.archiveRoom}>{Icons.archive}</button>
          </tooltip_js_1.default>
          <tooltip_js_1.default content="Leave collection">
            <button class="small-icon" onclick={this.handleClose}>{Icons.exit}</button>
          </tooltip_js_1.default>
        </div>
                : null}
      <div class="space-listing-children">
      {Object.values(state.children).length > 0
                // the root is always first in the listing
                ? Object.values(state.children).slice(0, state.limit).map(function (child) {
                    var _a;
                    return <roomIcon_js_1.default key={child.room_id} size={50} inactiveClick={_this.joinChild} activeClick={_this.toggleChild} roomId={child.room_id} avatarUrl={child.avatar_url} numJoinedMembers={child.num_joined_members} joinRule={child.join_rule} topic={child.topic} name={child.name || ((_a = child === null || child === void 0 ? void 0 : child.canonical_alias) === null || _a === void 0 ? void 0 : _a.slice(1)) || "?"}/>;
                })
                : Array(Math.min(state.limit, this.initialChildCount)).fill().map(function (_, idx) { return <roomIcon_js_2.RoomIconPlaceholder key={idx} size={50}/>; })}
        {(state.nextBatch || state.limit < Object.values(state.children).length)
                ? <div class="space-listing-more" onclick={this.addChildren}>...</div>
                : null}
      </div>
    </div>;
    };
    return SpaceListing;
}(preact_1.Component));
var AddChild = /** @class */ (function (_super) {
    __extends(AddChild, _super);
    function AddChild(props) {
        var _this = _super.call(this, props) || this;
        _this.currentList = (0, preact_1.createRef)();
        _this.currentListWrapper = (0, preact_1.createRef)();
        _this.handleScroll = function (_) {
            clearTimeout(_this.debounceTimeout);
            _this.debounceTimeout = setTimeout(function (_) {
                var list = _this.currentList.current;
                if (list.scrollTop + list.clientHeight + 10 >= list.scrollHeight) {
                    _this.props.pageChildren();
                }
            }, 500);
        };
        _this.updateHeight = function (_) { return _this.currentListWrapper.current.style.height = "".concat(_this.currentList.current.scrollHeight, "px"); };
        _this.addDiscussions = function (_) { return _this.setState({ adding: true }); };
        _this.removeDiscussions = function (_) { return _this.setState({ adding: false }); };
        _this.filterDiscussions = function (search) {
            _this.setState({
                search: search,
                discussions: client_js_1.default.client
                    .getVisibleRooms()
                    .filter(function (room) {
                    return resource_js_1.default.hasResource(room) &&
                        room.name.toLowerCase().includes(search.toLowerCase());
                })
            });
        };
        props.children.map(function (child) { return child.name; });
        _this.state = {
            search: "",
            adding: true,
            discussions: client_js_1.default.client
                .getVisibleRooms()
                .filter(function (room) { return resource_js_1.default.hasResource(room); })
        };
        return _this;
    }
    AddChild.prototype.componentDidMount = function () {
        this.updateHeight();
    };
    AddChild.prototype.componentDidUpdate = function () {
        this.updateHeight();
    };
    AddChild.prototype.render = function (props, state) {
        var childIds = this.props.children.map(function (child) { return child.room_id; });
        var availableDiscussions = state.adding && state.discussions.filter(function (room) { return !childIds.includes(room.roomId); });
        var currentDiscussions = !state.adding && props.children.filter(function (child) { return child.name.toLowerCase().includes(state.search.toLowerCase()); });
        return <preact_1.Fragment>
      <search_js_1.default search={state.search} setSearch={this.filterDiscussions}/>
      <div id="manage-discussion-select-view" class="select-view">
        <button onClick={this.addDiscussions} data-current-button={state.adding}>Add Discussions</button>
        <button onClick={this.removeDiscussions} data-current-button={!state.adding}>Remove Discussions</button>
      </div>
      <div id="manage-discussion-list-wrapper" ref={this.currentListWrapper}>
        {state.adding
                ? <div ref={this.currentList} id="available-discussions-list">
            {availableDiscussions.map(function (room) { return <AvailableDiscussionListing key={room.roomId} room={room} collection={props.room}/>; })}
          </div>
                : <div onscroll={this.handleScroll} ref={this.currentList} id="current-discussions-list">
            {currentDiscussions.map(function (child) { return <CurrentDiscussionListing key={child.room_id} child={child} collection={props.room}/>; })}
          </div>}
      </div>
    </preact_1.Fragment>;
    };
    return AddChild;
}(preact_1.Component));
var CurrentDiscussionListing = /** @class */ (function (_super) {
    __extends(CurrentDiscussionListing, _super);
    function CurrentDiscussionListing() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.removeMe = function (_) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setState({ pending: true });
                        return [4 /*yield*/, client_js_1.default.client
                                .sendStateEvent(this.props.collection.roomId, Matrix.EventType.SpaceChild, {}, this.props.child.room_id)
                                .catch((0, alerts_js_1.toastError)("Couldn't remove discussion from collection"))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, client_js_1.default.client
                                .sendStateEvent(this.props.child.room_id, Matrix.EventType.SpaceParent, {}, this.props.collection.roomId)
                                .catch((0, alerts_js_1.toastError)("Couldn't remove collection as parent of discussion"))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        return _this;
    }
    CurrentDiscussionListing.prototype.render = function (props, state) {
        return <button data-change-pending={state.pending} class="discussion-listing" onclick={this.removeMe}>
        <span>{Icons.trash}</span>
        <span>{props.child.name}</span>
      </button>;
    };
    return CurrentDiscussionListing;
}(preact_1.Component));
var AvailableDiscussionListing = /** @class */ (function (_super) {
    __extends(AvailableDiscussionListing, _super);
    function AvailableDiscussionListing() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.addMe = function (_) { return __awaiter(_this, void 0, void 0, function () {
            var theDomain, childContent, parentContent;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.setState({ pending: true });
                        theDomain = client_js_1.default.client.getDomain();
                        childContent = (_a = {
                                via: [theDomain]
                            },
                            _a[constants_js_1.populusCollectionChild] = true,
                            _a);
                        parentContent = { via: [theDomain] };
                        return [4 /*yield*/, client_js_1.default.client
                                .sendStateEvent(this.props.collection.roomId, Matrix.EventType.SpaceChild, childContent, this.props.room.roomId)
                                .catch((0, alerts_js_1.toastError)("Couldn't add discussion to collection"))];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, client_js_1.default.client
                                .sendStateEvent(this.props.room.roomId, Matrix.EventType.SpaceParent, parentContent, this.props.collection.roomId)
                                .catch((0, alerts_js_1.toastError)("Couldn't add collection as parent of discussion"))];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        return _this;
    }
    AvailableDiscussionListing.prototype.render = function (props, state) {
        return <button aria-label={"add ".concat(props.room.name, " to discussion")} data-change-pending={state.pending} class="discussion-listing" onclick={this.addMe}>
        <span>{Icons.newDiscussion}</span>
        <span>{props.room.name}</span>
    </button>;
    };
    return AvailableDiscussionListing;
}(preact_1.Component));

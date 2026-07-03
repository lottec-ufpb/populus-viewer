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
Object.defineProperty(exports, "__esModule", { value: true });
var preact_1 = require("preact");
var constants_js_1 = require("./constants.js");
var blurhash_1 = require("blurhash");
var resource_js_1 = require("./utils/resource.js");
var location_js_1 = require("./utils/location.js");
var Matrix = require("matrix-js-sdk");
var memberPill_js_1 = require("./memberPill.js");
var client_js_1 = require("./client.js");
var modal_js_1 = require("./modal.js");
var manageMembership_js_1 = require("./manageMembership.js");
var leaveRoom_js_1 = require("./leaveRoom.js");
var tagEditor_js_1 = require("./tagEditor.js");
var tooltip_js_1 = require("./utils/tooltip.js");
var roomSettings_js_1 = require("./roomSettings.js");
var colors_js_1 = require("./utils/colors.js");
var strings_js_1 = require("./utils/strings.js");
var Icons = require("./icons.js");
var history_js_1 = require("./history.js");
require("./styles/roomList.css");
var RoomList = /** @class */ (function (_super) {
    __extends(RoomList, _super);
    function RoomList(props) {
        var _this = _super.call(this, props) || this;
        _this.roomList = (0, preact_1.createRef)();
        _this.roomListener = function (_) {
            clearTimeout(_this.roomDebounceTimeout);
            _this.roomDebounceTimeout = setTimeout(function (_) {
                _this.setState({
                    rooms: client_js_1.default.client.getVisibleRooms()
                        .filter(resource_js_1.default.hasResource)
                        .filter(function (room) { return room.getMyMembership() === "join"; })
                });
            }, 1000);
        };
        _this.resizeListener = function (_) {
            clearTimeout(_this.resizeDebounceTimeout);
            _this.resizeDebounceTimeout = setTimeout(_this.resetMemberLimit, 500);
        };
        _this.resetMemberLimit = function (_) {
            if (_this.roomList.current) {
                _this.roomList.current.clientWidth > 500 ? _this.setState({ memberLimit: 15 })
                    : _this.roomList.current.clientWidth > 300 ? _this.setState({ memberLimit: 5 })
                        : _this.setState({ memberLimit: 2 });
            }
        };
        _this.byActivity = function (a, b) {
            var ts1 = a.getLastActiveTimestamp();
            var ts2 = b.getLastActiveTimestamp();
            if (ts1 < ts2)
                return 1 * _this.state.sortOrder;
            else if (ts2 < ts1)
                return -1 * _this.state.sortOrder;
            return 0;
        };
        _this.byName = function (a, b) {
            var n1 = a.name;
            var n2 = b.name;
            if (n1 < n2)
                return 1 * _this.state.sortOrder;
            else if (n2 < n1)
                return -1 * _this.state.sortOrder;
            return 0;
        };
        _this.byCreation = function (a, b) {
            var c1 = a.getLiveTimeline()
                .getState(Matrix.EventTimeline.FORWARDS)
                .getStateEvents(Matrix.EventType.RoomCreate, "")
                .getTs();
            var c2 = b.getLiveTimeline()
                .getState(Matrix.EventTimeline.FORWARDS)
                .getStateEvents(Matrix.EventType.RoomCreate, "")
                .getTs();
            if (c1 < c2)
                return 1 * _this.state.sortOrder;
            else if (c2 < c1)
                return -1 * _this.state.sortOrder;
            return 0;
        };
        _this.sortByActivity = function (_) {
            _this.setState(function (oldState) {
                return oldState.sort === "ACTIVITY"
                    ? { sortOrder: oldState.sortOrder * -1 }
                    : { sort: "ACTIVITY" };
            });
        };
        _this.sortByName = function (_) {
            _this.setState(function (oldState) {
                return oldState.sort === "NAME"
                    ? { sortOrder: oldState.sortOrder * -1 }
                    : { sort: "NAME" };
            });
        };
        _this.sortByCreation = function (_) {
            _this.setState(function (oldState) {
                return oldState.sort === "CREATION"
                    ? { sortOrder: oldState.sortOrder * -1 }
                    : { sort: "CREATION" };
            });
        };
        _this.flipSort = function (_) {
            _this.setState(function (oldState) {
                return { sortOrder: oldState.sortOrder * -1 };
            });
        };
        _this.searchRooms = function (searchWords) {
            // TODO: We're going to want to have different subcategories of rooms,
            // for actual pdfs, and for annotation discussions
            var searchNames = [];
            var searchTags = [];
            var searchMembers = [];
            var searchFlags = [];
            var searchParents = [];
            var searchIds = [];
            for (var _i = 0, searchWords_1 = searchWords; _i < searchWords_1.length; _i++) {
                var word = searchWords_1[_i];
                if (word.slice(0, 1) === '#')
                    searchTags.push(word.slice(1));
                else if (word.slice(0, 1) === '@')
                    searchMembers.push(word.slice(1));
                else if (word.slice(0, 1) === '*')
                    searchParents.push(word.slice(1));
                else if (word.slice(0, 1) === '~')
                    searchFlags.push(word.slice(1));
                else if (word.slice(0, 1) === '!')
                    searchIds.push(word);
                else
                    searchNames.push(word);
            }
            // XXX ↓ very naive implementation, watch for speed
            return _this.state.rooms.filter(function (room) {
                var flagged = true;
                if (searchFlags.includes("fav")) {
                    flagged = flagged && !!room.tags["m.favourite"];
                }
                var tags = Object.keys(room.tags).filter(function (tag) { return tag.slice(0, 2) === 'u.'; });
                var state = room.getLiveTimeline().getState(Matrix.EventTimeline.FORWARDS);
                // TODO: could make the below smarter to search by displayname as well as userID.
                var inRoom = state.getMembers().filter(function (u) { return u.membership === "join" || u.membership === "invite"; });
                var roomMemberIds = inRoom.map(function (m) { return m.userId; });
                var roomMemberNames = inRoom.map(function (m) { return m.name; });
                var roomMembers = roomMemberIds.concat(roomMemberNames);
                var parents = state.getStateEvents("m.space.parent")
                    .filter(function (e) { return !!e.getContent().via; })
                    .map(function (e) { var _a; return (_a = client_js_1.default.client.getRoom(e.getStateKey())) === null || _a === void 0 ? void 0 : _a.name; })
                    .filter(function (e) { return e; });
                return searchNames.every(function (name) { return room.name.toLowerCase().includes(name.toLowerCase()); }) &&
                    (searchIds.length > 0 ? searchIds.some(function (id) { return room.roomId === id; }) : true) &&
                    searchMembers.every(function (member) { return roomMembers.some(function (roomMember) { return roomMember.toLowerCase().includes(member.toLowerCase()); }); }) &&
                    searchTags.every(function (searchTag) { return tags.some(function (tag) { return tag.toLowerCase().includes(searchTag.toLowerCase()); }); }) &&
                    searchParents.every(function (searchParent) { return parents.some(function (parent) { return parent.toLowerCase().includes(searchParent.toLowerCase()); }); }) &&
                    flagged;
            });
        };
        _this.sortRooms = function (rooms) {
            return rooms.sort(_this.getSortFunc())
                .map(function (room) {
                var resource = new resource_js_1.default(room);
                var result = null;
                if (room.getMyMembership() === "join" && resource.url) {
                    result = <RoomEntry memberLimit={_this.state.memberLimit} room={room} key={room.roomId}/>;
                }
                return result;
            }).filter(function (room) { return room !== null; });
        };
        _this.state = {
            rooms: client_js_1.default.client.getVisibleRooms().filter(resource_js_1.default.hasResource),
            sort: "ACTIVITY",
            sortOrder: 1,
            memberLimit: 15
        };
        return _this;
    }
    RoomList.prototype.componentDidMount = function () {
        client_js_1.default.client.on("Room", this.roomListener);
        client_js_1.default.client.on("Room.name", this.roomListener);
        client_js_1.default.client.on("RoomState.events", this.roomListener);
        client_js_1.default.client.on("Room.accountData", this.roomListener);
        // State events might cause excessive rerendering, but we can optimize for that later
        this.resetMemberLimit();
        window.addEventListener("resize", this.resizeListener);
    };
    RoomList.prototype.componentWillUnmount = function () {
        client_js_1.default.client.off("Room", this.roomListener);
        client_js_1.default.client.off("Room.name", this.roomListener);
        client_js_1.default.client.off("RoomState.events", this.roomListener);
        client_js_1.default.client.off("Room.accountData", this.roomListener);
        window.removeEventListener("resize", this.resizeListener);
    };
    RoomList.prototype.getSortFunc = function () {
        switch (this.state.sort) {
            case 'CREATION': return this.byCreation;
            case 'ACTIVITY': return this.byActivity;
            case 'NAME': return this.byName;
        }
    };
    RoomList.prototype.render = function (props, state) {
        return <div id="room-list" ref={this.roomList}>
      <div id="select-sort">
        <button class="small-icon" style="cursor: pointer" onClick={this.flipSort}>
          {state.sortOrder === 1
                ? Icons.sortDesc
                : Icons.sortAsc}
        </button>
        <button data-current-button={state.sort === "ACTIVITY"} onClick={this.sortByActivity} class="styled-button">Activity</button>
        <button data-current-button={state.sort === "NAME"} onClick={this.sortByName} class="styled-button">Name</button>
        <button data-current-button={state.sort === "CREATION"} onClick={this.sortByCreation} class="styled-button">Creation</button>
      </div>
      <FilterList setFilterItems={props.setFilterItems} filterItems={props.filterItems}/>
      {/* TODO: We're probably going to need to debounce this rather than searching with each render, for longer lists of rooms */}
      <div>{this.sortRooms(this.searchRooms((0, strings_js_1.toWords)(props.searchFilter).concat(props.filterItems.map(function (item) { return item.value; }))))}</div>
    </div>;
    };
    return RoomList;
}(preact_1.Component));
exports.default = RoomList;
var FilterList = /** @class */ (function (_super) {
    __extends(FilterList, _super);
    function FilterList() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.removeFilter = function (item) { return _this.props.setFilterItems(_this.props.filterItems.filter(function (x) { return x.value !== item.value; })); };
        return _this;
    }
    FilterList.prototype.render = function (props) {
        var _this = this;
        if (props.filterItems.length > 0) {
            return <div id="room-filters">
        Filters: {props.filterItems.map(function (item) {
                    return <FilterListing removeFilter={_this.removeFilter} key={item.value} filter={item}/>;
                })}
      </div>;
        }
    };
    return FilterList;
}(preact_1.Component));
var FilterListing = /** @class */ (function (_super) {
    __extends(FilterListing, _super);
    function FilterListing() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.removeMe = function (_) { _this.props.removeFilter(_this.props.filter); };
        return _this;
    }
    FilterListing.prototype.render = function (props) {
        return <span class="room-filter-listing">
      <span class="room-filter-content">{props.filter.display}</span>
      <button onclick={this.removeMe} class="small-icon-badge">{Icons.close}</button>
    </span>;
    };
    return FilterListing;
}(preact_1.Component));
var RoomEntry = /** @class */ (function (_super) {
    __extends(RoomEntry, _super);
    function RoomEntry(props) {
        var _this = _super.call(this, props) || this;
        _this.roomColor = new colors_js_1.RoomColor(_this.props.room.roomId);
        _this.toggleButtons = function (_) { return _this.setState(function (oldState) { return { buttonsVisible: !oldState.buttonsVisible }; }); };
        _this.openMembership = function (_) { return modal_js_1.default.set(<manageMembership_js_1.default room={_this.props.room}/>, "Manage Membership", "for ".concat(_this.props.room.name)); };
        _this.openSettings = function (_) { return modal_js_1.default.set(<roomSettings_js_1.default joinLink={true} room={_this.props.room}/>, "Room Settings", "for ".concat(_this.props.room.name)); };
        _this.handleEditTags = function (_) { return modal_js_1.default.set(<tagEditor_js_1.TagEditor room={_this.props.room}/>, "Edit Tags", "for ".concat(_this.props.room.name)); };
        _this.toggleFavorite = function (_) {
            if (_this.props.room.tags["m.favourite"])
                client_js_1.default.client.deleteRoomTag(_this.props.room.roomId, "m.favourite");
            else
                client_js_1.default.client.setRoomTag(_this.props.room.roomId, "m.favourite", { order: 0.5 });
        };
        _this.handleClose = function (_) { return modal_js_1.default.set(<leaveRoom_js_1.default room={_this.props.room}/>, "Leave Room?", "for ".concat(_this.props.room.name)); };
        _this.state = { buttonsVisible: false };
        return _this;
    }
    RoomEntry.prototype.render = function (props, state) {
        var _a;
        var userMember = props.room.getMember(client_js_1.default.client.getUserId());
        var isAdmin = userMember.powerLevel >= 100;
        var canInvite = props.room.getLiveTimeline()
            .getState(Matrix.EventTimeline.FORWARDS)
            .hasSufficientPowerLevelFor("invite", userMember.powerLevel);
        var canonicalAlias = (_a = props.room.getCanonicalAlias()) === null || _a === void 0 ? void 0 : _a.slice(1);
        if (canonicalAlias)
            return <div style={this.roomColor.styleVariables} class="room-listing-entry" id={props.room.roomId}>
      <AvatarPanel room={props.room}/>
      <div data-room-entry-buttons-visible={state.buttonsVisible} class="room-listing-body">
        <div class="room-listing-heading">
          {props.room.tags["m.favourite"] ? <span class="fav-star"> {Icons.star} </span> : null}
          <a href={"".concat(window.location.origin).concat(window.location.pathname, "#/").concat(encodeURIComponent(canonicalAlias), "/")}>{props.room.name}</a>
        </div>
        <div class="room-listing-data">
          <RoomTagListing room={props.room}/>
          <MemberListing room={props.room} memberLimit={props.memberLimit}/>
        </div>
        <div class="room-listing-entry-buttons">
          {state.buttonsVisible ? null : <tooltip_js_1.default placement="right" content="Toggle buttons"><button onClick={this.toggleButtons}>{Icons.moreVertical}</button></tooltip_js_1.default>}
          {state.buttonsVisible ? <tooltip_js_1.default placement="right" content="Toggle buttons"><button onClick={this.toggleButtons}>{Icons.close}</button> </tooltip_js_1.default> : null}
          {state.buttonsVisible ? <tooltip_js_1.default placement="right" content="Toggle favorite"><button onClick={this.toggleFavorite}>{Icons.star}</button></tooltip_js_1.default> : null}
          {state.buttonsVisible ? <tooltip_js_1.default placement="right" content="Leave conversation"><button onClick={this.handleClose}>{Icons.exit}</button></tooltip_js_1.default> : null}
          {state.buttonsVisible ? <tooltip_js_1.default placement="right" content="Edit room tags"><button onClick={this.handleEditTags}>{Icons.tag}</button></tooltip_js_1.default> : null}
          {state.buttonsVisible && canInvite ? <tooltip_js_1.default placement="right" content="Manage membership"><button onClick={this.openMembership}>{Icons.userPlus}</button></tooltip_js_1.default> : null}
          {state.buttonsVisible && isAdmin ? <tooltip_js_1.default placement="right" content="Configure room settings"><button onClick={this.openSettings}>{Icons.settings}</button></tooltip_js_1.default> : null}
        </div>
      </div>
    </div>;
    };
    return RoomEntry;
}(preact_1.Component));
var AvatarPanel = /** @class */ (function (_super) {
    __extends(AvatarPanel, _super);
    function AvatarPanel(props) {
        var _a;
        var _this = _super.call(this, props) || this;
        _this.avatarCanvas = (0, preact_1.createRef)();
        _this.handleStateUpdate = function (e) {
            if (e.getRoomId() === _this.props.room.roomId && e.getType() === "m.room.avatar") {
                _this.setState({
                    avatarEvent: e,
                    avatarUrl: e.getContent().url
                        ? client_js_1.default.client.getHttpUriForMxcFromHS(e.getContent().url, 800, 600, "scale")
                        : null
                }, _this.drawBlurhash);
            }
        };
        _this.handleLoad = function (_) { return _this.setState({ loaded: true }); };
        _this.drawBlurhash = function (_) {
            var _a, _b;
            var avatarInfo = (_b = (_a = _this.state.avatarEvent) === null || _a === void 0 ? void 0 : _a.getContent()) === null || _b === void 0 ? void 0 : _b.info;
            if (!(avatarInfo === null || avatarInfo === void 0 ? void 0 : avatarInfo.h) || !(avatarInfo === null || avatarInfo === void 0 ? void 0 : avatarInfo.w) || !(avatarInfo === null || avatarInfo === void 0 ? void 0 : avatarInfo.blurhash))
                return;
            var ctx = _this.avatarCanvas.current.getContext("2d");
            ctx.clearRect(0, 0, _this.avatarCanvas.current.wdith, _this.avatarCanvas.current.height);
            // we draw them small and scale up in CSS, following blurhash developer's advice
            var width = 32;
            var height = Math.floor(32 * (avatarInfo.h / avatarInfo.w));
            _this.avatarCanvas.current.width = width;
            _this.avatarCanvas.current.height = height;
            var imageData = ctx.createImageData(width, height);
            var pixels = (0, blurhash_1.decode)(avatarInfo.blurhash, width, height);
            imageData.data.set(pixels);
            ctx.putImageData(imageData, 0, 0);
        };
        var avatarEvent = props.room.getLiveTimeline()
            .getState(Matrix.EventTimeline.FORWARDS)
            .getStateEvents("m.room.avatar", "");
        _this.state = {
            avatarEvent: avatarEvent,
            loaded: false,
            avatarUrl: ((_a = avatarEvent === null || avatarEvent === void 0 ? void 0 : avatarEvent.getContent()) === null || _a === void 0 ? void 0 : _a.url)
                ? client_js_1.default.client.getHttpUriForMxcFromHS(avatarEvent.getContent().url, 800, 600, "scale")
                : null
        };
        return _this;
    }
    AvatarPanel.prototype.componentDidMount = function () {
        client_js_1.default.client.on("RoomState.events", this.handleStateUpdate);
        this.drawBlurhash();
    };
    AvatarPanel.prototype.componentWillUnmount = function () {
        client_js_1.default.client.off("RoomState.events", this.handleStateUpdate);
    };
    AvatarPanel.prototype.render = function (props, state) {
        var _a, _b;
        var avatarInfo = (_b = (_a = state.avatarEvent) === null || _a === void 0 ? void 0 : _a.getContent()) === null || _b === void 0 ? void 0 : _b.info;
        // using max/min here rather than setting the height directly so that the height doesn't affect the object-fit: cover of the image,
        // But so that the div is still the right size prior to image-load
        var avatarListingStyle = avatarInfo
            ? { "min-height": Math.min(300, avatarInfo.h), "max-height": Math.min(300, avatarInfo.h) }
            : null;
        var avatarCanvasStyle = avatarInfo
            ? { "min-height": Math.min(300, avatarInfo.h), "max-height": Math.min(300, avatarInfo.h), "width": "100%" }
            : null;
        return <div style={avatarListingStyle} data-has-avatar={!!state.avatarUrl} class="room-listing-avatar">
      {state.avatarUrl
                ? <preact_1.Fragment>
          <canvas ref={this.avatarCanvas} style={avatarCanvasStyle} class="room-listing-avatar-canvas"/>
          <img src={state.avatarUrl} onLoad={this.handleLoad} class="room-listing-avatar-img" data-avatar-loaded={state.loaded} loading="lazy" alt="room avatar"/>
        </preact_1.Fragment>
                : null}
      <AnnotationData room={props.room}/>
    </div>;
    };
    return AvatarPanel;
}(preact_1.Component));
function RoomTagListing(props) {
    var tagCount = Object.keys(props.room.tags).filter(function (tag) { return tag.slice(0, 2) === 'u.'; }).length;
    return tagCount > 0
        ? <div class="room-listing-data-row">
      <span class="room-data-icon">{Icons.tag}</span>
      <tagEditor_js_1.TagList room={props.room}/>
    </div>
        : null;
}
var MemberListing = /** @class */ (function (_super) {
    __extends(MemberListing, _super);
    function MemberListing(props) {
        var _this = _super.call(this, props) || this;
        _this.toggleMemberList = function (_) { return _this.setState(function (oldState) { return { open: !oldState.open }; }); };
        _this.state = { open: false };
        return _this;
    }
    MemberListing.prototype.render = function (props, state) {
        var members = props.room.getMembersWithMembership("join");
        var invites = props.room.getMembersWithMembership("invite");
        var memberPills = state.open
            ? members.map(function (member) { return <memberPill_js_1.default key={member.userId} member={member}/>; })
            : members.slice(0, props.memberLimit).map(function (member) { return <memberPill_js_1.default key={member.userId} member={member}/>; });
        var invitePills = invites.map(function (invite) { return <span key={invite.userId} class="invite-pill"><memberPill_js_1.default member={invite}/></span>; });
        return <div class="room-listing-data-row">
      <span class="room-data-icon">{Icons.userMany}</span><preact_1.Fragment>{memberPills}</preact_1.Fragment><preact_1.Fragment>{invitePills}</preact_1.Fragment>
      {members.length <= props.memberLimit
                ? null
                : state.open
                    ? <button onclick={this.toggleMemberList} class="room-toggle-members">{Icons.close}</button>
                    : <button onclick={this.toggleMemberList} class="room-toggle-members">and {members.length - props.memberLimit} more.</button>}
    </div>;
    };
    return MemberListing;
}(preact_1.Component));
var AnnotationData = /** @class */ (function (_super) {
    __extends(AnnotationData, _super);
    function AnnotationData(props) {
        var _this = _super.call(this, props) || this;
        _this.updateAnnotations = function (_) {
            var annotations = _this.props.room.getLiveTimeline()
                .getState(Matrix.EventTimeline.FORWARDS).getStateEvents(Matrix.EventType.SpaceChild)
                .map(function (ev) { return new location_js_1.default(ev); })
                .filter(function (loc) { return loc.isValid() && loc.getStatus() === "open"; });
            _this.setState({ annotations: annotations });
        };
        _this.handleStateUpdate = function (e) {
            if (e.getRoomId() === _this.props.room.roomId && e.getType() === Matrix.EventType.SpaceChild) {
                _this.updateAnnotations();
            }
        };
        _this.handleLoadNew = function (_) {
            var _a;
            var canonicalAlias = (_a = _this.props.room.getCanonicalAlias()) === null || _a === void 0 ? void 0 : _a.slice(1);
            if (canonicalAlias)
                history_js_1.default.push("/".concat(encodeURIComponent(canonicalAlias), "/"), { searchString: "~unread" });
        };
        _this.getUnreadCount = function (_) { return _this.state.annotations.filter(function (loc) { return loc.getUnread(); }).length; };
        _this.state = {
            annotations: []
        };
        _this.handleTimeline = _this.handleTimeline.bind(_this);
        _this.handleStateUpdate = _this.handleStateUpdate.bind(_this);
        _this.handleInitialSync = _this.handleInitialSync.bind(_this);
        return _this;
    }
    AnnotationData.prototype.componentDidMount = function () {
        client_js_1.default.client.on("RoomState.events", this.handleStateUpdate);
        client_js_1.default.client.on("Room.accountData", this.handleTimeline);
        client_js_1.default.client.on("Room.timeline", this.handleTimeline);
        client_js_1.default.client.on("sync.initial", this.handleInitialSync);
        // We let the initialSyncHandler manage this if we're not syncing yet.
        if (client_js_1.default.client.getSyncState() !== "PREPARED")
            this.updateAnnotations();
    };
    AnnotationData.prototype.componentWillUnmount = function () {
        client_js_1.default.client.off("RoomState.events", this.handleStateUpdate);
        client_js_1.default.client.off("Room.accountData", this.handleTimeline);
        client_js_1.default.client.off("sync.initial", this.handleInitialSync);
        client_js_1.default.client.off("Room.timeline", this.handleTimeline);
    };
    AnnotationData.prototype.handleInitialSync = function () {
        // Need this extra step, since I don't think account data update events are
        // fired by the initial sync
        this.updateAnnotations();
    };
    AnnotationData.prototype.handleTimeline = function (_event, room) {
        var childIds = this.state.annotations.map(function (loc) { return loc.getChild(); });
        if ((room === null || room === void 0 ? void 0 : room.roomId) in childIds)
            this.updateAnnotations();
    };
    AnnotationData.prototype.render = function () {
        var unread = this.getUnreadCount();
        return <div class="room-annotation-data">
      {unread < 1
                ? null
                : <tooltip_js_1.default placement="right" content="Unread conversations">
          <span onClick={this.handleLoadNew}>
            <button class="small-icon">{Icons.annotation}</button>
            <span class="small-icon-badge">{unread}</span>
          </span>
        </tooltip_js_1.default>}
    </div>;
    };
    return AnnotationData;
}(preact_1.Component));

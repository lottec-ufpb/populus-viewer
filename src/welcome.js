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
var Matrix = require("matrix-js-sdk");
var colors_js_1 = require("./utils/colors.js");
var fileUpload_js_1 = require("./fileUpload.js");
var roomList_js_1 = require("./roomList.js");
var spacesManager_js_1 = require("./spacesManager.js");
var client_js_1 = require("./client.js");
var search_js_1 = require("./search.js");
var strings_js_1 = require("./utils/strings.js");
var tooltip_js_1 = require("./utils/tooltip.js");
var PopupMenu = require("./popUpMenu.js");
var profileInformation_js_1 = require("./profileInformation.js");
var notifications_js_1 = require("./notifications.js");
var Icons = require("./icons.js");
var syncIndicator_js_1 = require("./syncIndicator.js");
var constants_js_1 = require("./constants.js");
require("./styles/welcome.css");
var WelcomeView = /** @class */ (function (_super) {
    __extends(WelcomeView, _super);
    function WelcomeView(props) {
        var _this = _super.call(this, props) || this;
        _this.resizeListener = function (_) {
            clearTimeout(_this.resizeDebounceTimeout);
            _this.resizeDebounceTimeout = setTimeout(function (_) {
                if (document.body.offsetWidth > 750) {
                    if (_this.state.layout !== "wide") {
                        _this.setState({
                            view: _this.state.view === "COLLECTION" ? null : _this.state.view,
                            layout: "wide"
                        });
                    }
                }
                else if (document.body.offsetWidth > 400) {
                    if (_this.state.layout !== "narrow")
                        _this.setState({ layout: "narrow" });
                }
                else if (document.body.offsetWidth <= 400) {
                    if (_this.state.layout !== "phone")
                        _this.setState({ layout: "phone" });
                }
            }, 500);
        };
        _this.searchInput = (0, preact_1.createRef)();
        _this.popupMenu = (0, preact_1.createRef)();
        _this.setSearch = function (s) { return _this.setState({ searchFilter: s }); };
        _this.setFilterItems = function (s) { return _this.setState({ filterItems: s }); };
        _this.submitSearch = function (_) {
            if (_this.popupMenu.current.state.active)
                return;
            _this.setState(function (oldState) {
                return {
                    searchFilter: "",
                    filterItems: oldState.filterItems.concat((0, strings_js_1.toWords)(oldState.searchFilter).map(function (word) { return { display: word, value: word }; }))
                };
            });
        };
        _this.flags = [
            { keyword: "fav", description: "favorite discussions" },
        ];
        _this.popupActions = {
            "@": function (props) { return <PopupMenu.Users {...props}/>; },
            "~": function (props) { return <PopupMenu.Flags flags={_this.flags} {...props}/>; }
        };
        _this.setFocus = function (b) { return _this.setState({
            inputFocus: b,
            view: null
        }); };
        _this.toggleUploadVisible = function (_) { return _this.setState(function (oldState) {
            return oldState.view === "UPLOAD"
                ? { view: null }
                : { view: "UPLOAD" };
        }); };
        _this.toggleProfileVisible = function (_) { return _this.setState(function (oldState) {
            return oldState.view === "PROFILE"
                ? { view: null }
                : { view: "PROFILE" };
        }); };
        _this.toggleNotifVisible = function (_) { return _this.setState(function (oldState) {
            return oldState.view === "NOTIF"
                ? { view: null }
                : { view: "NOTIF" };
        }); };
        _this.toggleCollectionVisible = function (_) { return _this.setState(function (oldState) {
            return oldState.view === "COLLECTION"
                ? { view: null }
                : { view: "COLLECTION" };
        }); };
        _this.showMainView = function (_) { return _this.setState({ view: null }); };
        _this.state = {
            view: null,
            inputFocus: false,
            searchFilter: "",
            filterItems: [],
            layout: document.body.offsetWidth > 750
                ? "wide"
                : document.body.offsetWidth > 400
                    ? "narrow"
                    : "phone"
        };
        return _this;
    }
    WelcomeView.prototype.componentDidMount = function () {
        window.addEventListener("resize", this.resizeListener);
    };
    WelcomeView.prototype.componentWillUnmount = function () {
        window.removeEventListener("resize", this.resizeListener);
    };
    WelcomeView.prototype.render = function (props, state) {
        return <preact_1.Fragment key="welcome-fragment">
      <header id="welcome-header">
        <div id="welcome-header-content">
          <div id="welcome-search-wrapper">
            <search_js_1.default search={state.searchFilter} setSearch={this.setSearch} searchInput={this.searchInput} submit={this.submitSearch} hint="/" setFocus={this.setFocus}/>
            <PopupMenu.Menu below={true} ref={this.popupMenu} textValue={state.searchFilter} textarea={this.searchInput} actions={this.popupActions} setTextValue={this.setSearch}/>
          </div>
          {(!state.inputFocus || !(state.layout !== "wide")) && <preact_1.Fragment>
            {state.layout !== "wide"
                    ? <tooltip_js_1.default placement="below" content="Collection View">
                <button data-active={state.view === "COLLECTION"} id="welcome-collection" onClick={this.toggleCollectionVisible}>
                  {Icons.collection}
                </button>
              </tooltip_js_1.default>
                    : null}
            <UploadIcon active={state.view === "UPLOAD"} toggleUploadVisible={this.toggleUploadVisible}/>
            <WelcomeIcon active={state.view === "NOTIF"} toggleNotifVisible={this.toggleNotifVisible}/>
            <WelcomeProfile active={state.view === "PROFILE"} toggleProfileVisible={this.toggleProfileVisible}/>
          </preact_1.Fragment>}
        </div>
      </header>
      <div id="welcome-container">
        {state.view === "UPLOAD"
                ? <fileUpload_js_1.default showMainView={this.showMainView}/>
                : state.view === "PROFILE"
                    ? <profileInformation_js_1.default logoutHandler={props.logoutHandler} showMainView={this.showMainView}/>
                    : state.view === "NOTIF"
                        ? <notifications_js_1.default />
                        : state.view === "COLLECTION"
                            ? <div class="welcome-column">
                  <spacesManager_js_1.default oneColumn showMainView={this.showMainView} setFilterItems={this.setFilterItems} filterItems={state.filterItems}/>
                </div>
                            : state.layout !== "wide"
                                ? <div class="welcome-column">
                    <roomList_js_1.default setFilterItems={this.setFilterItems} filterItems={state.filterItems} searchFilter={state.searchFilter}/>
                  </div>
                                : <div id="welcome-split">
                    <roomList_js_1.default setFilterItems={this.setFilterItems} filterItems={state.filterItems} searchFilter={state.searchFilter}/>
                    <div>
                      <spacesManager_js_1.default setFilterItems={this.setFilterItems} filterItems={state.filterItems}/>
                      <AboutCard />
                    </div>
                  </div>}
      </div>
      <syncIndicator_js_1.default />
    </preact_1.Fragment>;
    };
    return WelcomeView;
}(preact_1.Component));
exports.default = WelcomeView;
var WelcomeIcon = /** @class */ (function (_super) {
    __extends(WelcomeIcon, _super);
    function WelcomeIcon(props) {
        var _this = _super.call(this, props) || this;
        var unread = client_js_1.default.client.getVisibleRooms()
            .reduce(function (acc, room) { return acc + (room.getUnreadNotificationCount("highlight") || 0); }, 0);
        var invites = client_js_1.default.client.getVisibleRooms()
            .filter(function (room) { return room.getMyMembership() === "invite"; })
            .filter(function (room) {
            var _a, _b;
            return ((_b = (_a = room
                .getLiveTimeline()
                .getState(Matrix.EventTimeline.FORWARDS)
                .getStateEvents("m.room.create", "")) === null || _a === void 0 ? void 0 : _a.getContent()) === null || _b === void 0 ? void 0 : _b.type) === "m.space";
        })
            .length;
        _this.state = { count: unread + invites };
        _this.updateCount = _this.updateCount.bind(_this);
        return _this;
    }
    WelcomeIcon.prototype.componentDidMount = function () {
        client_js_1.default.client.on("sync", this.updateCount);
        client_js_1.default.client.on("RoomState.events", this.updateCount); // needed to update when creation event arrives
    };
    WelcomeIcon.prototype.componentWillUnmount = function () {
        client_js_1.default.client.off("sync", this.updateCount);
        client_js_1.default.client.off("RoomState.events", this.updateCount); // needed to update when creation event arrives
    };
    WelcomeIcon.prototype.updateCount = function () {
        var unread = client_js_1.default.client.getVisibleRooms()
            .reduce(function (acc, room) { return acc + (room.getUnreadNotificationCount("highlight") || 0); }, 0);
        var invites = client_js_1.default.client.getVisibleRooms()
            .filter(function (room) { return room.getMyMembership() === "invite"; })
            .filter(function (room) {
            var _a, _b;
            return (_b = (_a = room
                .getLiveTimeline()
                .getState(Matrix.EventTimeline.FORWARDS)
                .getStateEvents("m.room.create", "")) === null || _a === void 0 ? void 0 : _a.getContent()) === null || _b === void 0 ? void 0 : _b[constants_js_1.mscResourceData];
        })
            .length;
        this.setState({ count: unread + invites });
    };
    WelcomeIcon.prototype.render = function (props, state) {
        return <tooltip_js_1.default position="below" content="View notifications">
        <button data-active={props.active} id="welcome-notifications" onClick={props.toggleNotifVisible}>
        {Icons.bell}
        {state.count > 0 ? <span class="small-icon-badge">{state.count}</span> : null}
      </button>
    </tooltip_js_1.default>;
    };
    return WelcomeIcon;
}(preact_1.Component));
var WelcomeProfile = /** @class */ (function (_super) {
    __extends(WelcomeProfile, _super);
    function WelcomeProfile(props) {
        var _this = _super.call(this, props) || this;
        _this.profileListener = function (_) {
            _this.setState({
                avatarUrl: client_js_1.default.client.getHttpUriForMxcFromHS(_this.user.avatarUrl, 30, 30, "crop")
            });
        };
        _this.displayInitial = function (_) {
            return _this.user.displayName.slice(0, 1) === '@'
                ? _this.user.displayName.slice(1, 2)
                : _this.user.displayName.slice(0, 1);
        };
        var userId = client_js_1.default.client.getUserId();
        _this.user = client_js_1.default.client.getUser(userId);
        _this.userColor = new colors_js_1.UserColor(userId);
        _this.state = {
            avatarUrl: client_js_1.default.client.getHttpUriForMxcFromHS(_this.user.avatarUrl, 30, 30, "crop")
        };
        return _this;
    }
    WelcomeProfile.prototype.componentDidMount = function () {
        client_js_1.default.client.on("sync", this.profileListener);
    };
    WelcomeProfile.prototype.componentWillUnmount = function () {
        client_js_1.default.client.off("sync", this.profileListener);
    };
    WelcomeProfile.prototype.render = function (props, state) {
        return <tooltip_js_1.default position="below" content="View profile">
      <button data-active={props.active} id="welcome-profile" onClick={props.toggleProfileVisible} style={this.userColor.styleVariables}>
        {state.avatarUrl
                ? <img id="welcome-img" src={state.avatarUrl}/>
                : <span id="welcome-initial">{this.displayInitial()}</span>}
      </button>
    </tooltip_js_1.default>;
    };
    return WelcomeProfile;
}(preact_1.Component));
function UploadIcon(props) {
    return <tooltip_js_1.default position="below" content="Upload file">
    <button data-active={props.active} id="welcome-upload" onClick={props.toggleUploadVisible}>{Icons.newFile}</button>
  </tooltip_js_1.default>;
}
function AboutCard(props) {
    return <div id="welcome-about-card">
    <div>Populus-Viewer</div>
    <hr class="styled-rule"/>
    <div id="welcome-about-card-icons">
      <div><span class="small-icon">{Icons.matrix}</span> <a target="_blank" href="https://matrix.to/#/#opentower:matrix.org">Chat with developers</a></div>
      <div><span class="small-icon">{Icons.github}</span> <a target="_blank" href="https://github.com/opentower/populus-viewer/issues">Report a bug or request a feature</a></div>
    </div>
    <hr class="styled-rule"/>
    <div> Open-Tower © 2022. All Rights Reserved</div>
  </div>;
}

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
Object.defineProperty(exports, "__esModule", { value: true });
var preact_1 = require("preact");
var Icons = require("./icons.js");
var Matrix = require("matrix-js-sdk");
var location_js_1 = require("./utils/location.js");
var tooltip_js_1 = require("./utils/tooltip.js");
var colors_js_1 = require("./utils/colors.js");
require("./styles/navbar.css");
var history_js_1 = require("./history.js");
var resource_js_1 = require("./utils/resource.js");
var client_js_1 = require("./client.js");
var modal_js_1 = require("./modal.js");
var manageMembership_js_1 = require("./manageMembership.js");
var DocumentNavbar = /** @class */ (function (_super) {
    __extends(DocumentNavbar, _super);
    function DocumentNavbar(props) {
        var _this = _super.call(this, props) || this;
        _this.handleKeydown = function (e) {
            if (e.shiftKey)
                return; // don't capture shift-modified arrow keys, these change the text selection
            if (e.key === 'j' || e.key === "ArrowRight") {
                e.preventDefault(); // block default scrolling behavior
                _this.nextPage();
            }
            if (e.key === 'k' || e.key === "ArrowLeft") {
                e.preventDefault(); // block default scrolling behavior
                _this.prevPage();
            }
            if (e.key === "ArrowUp") {
                e.preventDefault(); // block default scrolling behavior
                _this.props.contentContainer.current.scroll({
                    top: _this.props.contentContainer.current.scrollTop - 100,
                    left: _this.props.contentContainer.current.scrollLeft
                });
            }
            if (e.key === "ArrowDown") {
                e.preventDefault(); // block default scrolling behavior
                _this.props.contentContainer.current.scroll({
                    top: _this.props.contentContainer.current.scrollTop + 100,
                    left: _this.props.contentContainer.current.scrollLeft
                });
            }
        };
        _this.pageTotal = (0, preact_1.createRef)();
        _this.pageInput = (0, preact_1.createRef)();
        _this.bottomWrapper = (0, preact_1.createRef)();
        _this.toolTipOffset = [0, 30];
        _this.handleInput = function (e) {
            if (/^[0-9]*$/.test(e.target.value))
                _this.setState({ value: e.target.value });
            else
                _this.setState({ value: "" });
        };
        _this.prevPage = function (_) {
            var sparePages = _this.props.content.current.state.showSecondary ? 1 : 0;
            if (_this.props.pageFocused > 1) {
                history_js_1.default.push("/".concat(encodeURIComponent(_this.props.resourceAlias)) +
                    "/".concat(Math.max(1, _this.props.pageFocused - (1 + sparePages))) +
                    "".concat(_this.props.roomFocused ? "/" + _this.props.roomFocused : "") +
                    "".concat(_this.props.eventFocused ? "/" + _this.props.eventFocused : ""));
            }
        };
        _this.nextPage = function (_) {
            var sparePages = _this.props.content.current.state.showSecondary ? 1 : 0;
            if (_this.props.pageFocused + sparePages < _this.props.total) {
                history_js_1.default.push("/".concat(encodeURIComponent(_this.props.resourceAlias)) +
                    "/".concat(Math.max(1, _this.props.pageFocused + (1 + sparePages))) +
                    "".concat(_this.props.roomFocused ? "/" + _this.props.roomFocused : "") +
                    "".concat(_this.props.eventFocused ? "/" + _this.props.eventFocused : ""));
            }
        };
        _this.handlePageFocus = function (_) { return _this.setState({ pageFocused: true, value: "" }); };
        _this.handlePageBlur = function (_) { return _this.setState({ pageFocused: false, value: _this.props.pageFocused }); };
        _this.handleSubmit = function (ev) {
            ev.preventDefault();
            var currentPage = Number.isNaN(parseInt(_this.state.value, 10)) ? 1 : parseInt(_this.state.value, 10);
            if (currentPage > 0 && currentPage <= _this.props.total)
                history_js_1.default.push("/".concat(encodeURIComponent(_this.props.resourceAlias), "/").concat(currentPage, "/"));
            else
                alert("Out of range");
        };
        _this.handleClick = function (e) { return history_js_1.default.push("/".concat(encodeURIComponent(_this.props.resourceAlias), "/").concat(parseInt(e.target.value, 10))); };
        _this.togglePageNav = function (_) { return _this.setState({ pageViewVisible: !_this.state.pageViewVisible }); };
        _this.toggleMoreOptions = function (_) {
            if (_this.state.moreOptionsVisible)
                _this.props.setNavHeight(75);
            else
                _this.props.setNavHeight(150);
            _this.setState(function (oldState) { return { moreOptionsVisible: !oldState.moreOptionsVisible }; });
        };
        _this.mainMenu = function (_) { return history_js_1.default.push("/"); };
        _this.download = function (_) {
            if (confirm("do you want to download the file you're annotating?")) {
                var file = new resource_js_1.default(_this.props.room);
                window.open(file.httpUrl);
            }
        };
        _this.openMembership = function (_) { return modal_js_1.default.set(<manageMembership_js_1.default room={_this.props.room}/>, "Manage Membership", "for ".concat(_this.props.room.name)); };
        _this.zoomOut = function (_) { return _this.props.setZoom(function (zoomFactor) { return zoomFactor - 0.1; }); };
        _this.zoomIn = function (_) { return _this.props.setZoom(function (zoomFactor) { return zoomFactor + 0.1; }); };
        // Could add a listener to update this live
        var roomState = props.room.getLiveTimeline().getState(Matrix.EventTimeline.FORWARDS);
        _this.canAnnotate = roomState.maySendStateEvent(Matrix.EventType.SpaceChild, client_js_1.default.client.getUserId());
        _this.state = {
            value: props.pageFocused,
            pageViewVisible: false,
            moreOptionsVisible: false,
            pageFocused: false,
        };
        return _this;
    }
    DocumentNavbar.prototype.componentDidMount = function () {
        document.addEventListener('keydown', this.handleKeydown);
    };
    DocumentNavbar.prototype.componentWillUnmount = function () {
        document.removeEventListener('keydown', this.handleKeydown);
    };
    DocumentNavbar.prototype.componentDidUpdate = function () {
        if (this.pageInput.current)
            this.pageInput.current.style.width = "".concat(this.pageTotal.current.scrollWidth, "px");
    };
    DocumentNavbar.prototype.render = function (props, state) {
        var _a, _b;
        if (props.contentWidthPx) { // don't render until width is set
            return <nav id="page-nav">
          <Pages total={props.total} handleClick={this.handleClick} room={props.room} currentPageElement={this.currentPageElement} visibility={state.pageViewVisible} typing={state.typing} current={props.pageFocused}/>
        <div id="nav-background"/>
        <div class="nav-button-wrapper top-wrapper">
          <tooltip_js_1.default content="Go to main menu (ESC)" offset={this.toolTipOffset}>
            <button onclick={this.mainMenu}>{Icons.home}</button>
          </tooltip_js_1.default>
          <tooltip_js_1.default content="Add annotation (Alt + a)" offset={this.toolTipOffset}>
            <button disabled={this.canAnnotate && (props.hasSelection || ((_a = props.pindropMode) === null || _a === void 0 ? void 0 : _a.x)) ? null : "disabled"} onclick={props.openAnnotation}>{Icons.addAnnotation}
            </button>
          </tooltip_js_1.default>
          <tooltip_js_1.default content="Go to previous annotation (Alt + Shift + Tab)" offset={this.toolTipOffset}>
            <button disabled={!props.hasAnnotations} onclick={props.focusPrev}>{Icons.chevronsLeft}
            </button>
          </tooltip_js_1.default>
          <tooltip_js_1.default content="Go to previous page (k, ←)" offset={this.toolTipOffset}>
            <button disabled={props.pageFocused > 1 ? null : "disabled"} onclick={this.prevPage}>{Icons.chevronLeft}
            </button>
          </tooltip_js_1.default>
          <form class="nav-position" onSubmit={this.handleSubmit}>
            <tooltip_js_1.default content="Show page navigation" offset={this.toolTipOffset}>
              <button type="button" class={state.pageViewVisible ? "nav-toggled" : null} onclick={this.togglePageNav}>{Icons.page}
              </button>
            </tooltip_js_1.default>
            <input type="text" id="nav-page-input" ref={this.pageInput} value={state.pageFocused ? state.value : props.pageFocused} onblur={this.handlePageBlur} onfocus={this.handlePageFocus} oninput={this.handleInput}/>
            <span>/</span>
            <span ref={this.pageTotal} id="nav-total-pages">{props.total}</span>
          </form>
          <tooltip_js_1.default content="Go to next page (j, →)" offset={this.toolTipOffset}>
            <button disabled={props.total > props.pageFocused ? null : "disabled"} onclick={this.nextPage}>{Icons.chevronRight}
            </button>
          </tooltip_js_1.default>
          <tooltip_js_1.default content="Go to next annotation (Alt + Tab)" offset={[0, 30]}>
            <button disabled={!props.hasAnnotations} onclick={props.focusNext}>{Icons.chevronsRight}
            </button>
          </tooltip_js_1.default>
          <tooltip_js_1.default content="Remove annotation (Alt + r)" offset={this.toolTipOffset}>
            <button disabled={this.canAnnotate && props.focus && !props.hasSelection ? null : "disabled"} onclick={props.closeAnnotation}>{Icons.removeAnnotation}
            </button>
          </tooltip_js_1.default>
          <tooltip_js_1.default content="More options" offset={this.toolTipOffset}>
            <button onClick={this.toggleMoreOptions}>{Icons.moreVertical}</button>
          </tooltip_js_1.default>
        </div>
        <div inert={!state.moreOptionsVisible} ref={this.bottomWrapper} class="nav-button-wrapper bottom-wrapper">
          <tooltip_js_1.default content="Manage membership" theme="bordered">
            <button tabIndex={state.moreOptionsVisible ? 0 : -1} onClick={this.openMembership}>{Icons.userPlus}
            </button>
          </tooltip_js_1.default>
          <tooltip_js_1.default content="Download PDF" theme="bordered">
            <button tabIndex={state.moreOptionsVisible ? 0 : -1} onClick={this.download}>{Icons.download} </button>
          </tooltip_js_1.default>
          <tooltip_js_1.default content="Zoom out (-)" theme="bordered">
            <button tabIndex={state.moreOptionsVisible ? 0 : -1} onClick={this.zoomOut}>{Icons.zoomout}</button>
          </tooltip_js_1.default>
          <tooltip_js_1.default content="Zoom in (+)" theme="bordered">
            <button tabIndex={state.moreOptionsVisible ? 0 : -1} onClick={this.zoomIn}>{Icons.zoomin}</button>
          </tooltip_js_1.default>
          <tooltip_js_1.default content="Toggle annotation visibility (Alt + v)" theme="bordered">
            <button tabIndex={state.moreOptionsVisible ? 0 : -1} onClick={props.toggleAnnotations}>{props.annotationsVisible ? Icons.eyeOff : Icons.eye}</button>
          </tooltip_js_1.default>
          <tooltip_js_1.default content="Add Pin" theme="bordered">
            <button tabIndex={state.moreOptionsVisible ? 0 : -1} onClick={props.startPindrop}>{Icons.pin}</button>
          </tooltip_js_1.default>
          <tooltip_js_1.default content="Toggle Two-Up View" theme="bordered">
            <button tabIndex={state.moreOptionsVisible ? 0 : -1} onClick={(_b = props.content.current) === null || _b === void 0 ? void 0 : _b.toggleSecondary}>{Icons.columns}</button>
          </tooltip_js_1.default>
          <tooltip_js_1.default content="Search Within PDF" theme="bordered">
            <button tabIndex={state.moreOptionsVisible ? 0 : -1} onClick={props.showSearch}>{Icons.search}</button>
          </tooltip_js_1.default>
        </div>
      </nav>;
        }
    };
    return DocumentNavbar;
}(preact_1.Component));
exports.default = DocumentNavbar;
var Pages = /** @class */ (function (_super) {
    __extends(Pages, _super);
    function Pages(props) {
        var _this = _super.call(this, props) || this;
        _this.handleTypingNotification = function (ev, member) {
            var _a;
            var theRoomState = client_js_1.default.client.getRoom((_a = _this.props.room) === null || _a === void 0 ? void 0 : _a.roomId).getLiveTimeline().getState(Matrix.EventTimeline.FORWARDS);
            var theChildRelation = theRoomState.getStateEvents(Matrix.EventType.SpaceChild, member.roomId);
            // We use nested state here because we want to pass this part of the state to a child
            if (theChildRelation) {
                _this.setState(function (prevState) {
                    var _a;
                    var location = new location_js_1.default(theChildRelation);
                    var typingKey = location.location;
                    return { typing: __assign(__assign({}, prevState.typing), (_a = {}, _a[typingKey] = ev.getContent().user_ids, _a)) };
                });
            }
        };
        _this.currentPageElement = (0, preact_1.createRef)();
        _this.state = { typing: {} };
        _this.handleTypingNotifications = _this.handleTypingNotification.bind(_this);
        return _this;
    }
    Pages.prototype.componentDidUpdate = function () {
        var _a;
        (_a = this.currentPageElement.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ inline: "center" });
    };
    Pages.prototype.componentDidMount = function () {
        client_js_1.default.client.on("RoomMember.typing", this.handleTypingNotification);
    };
    Pages.prototype.componentWillUnmount = function () {
        client_js_1.default.client.off("RoomMember.typing", this.handleTypingNotification);
    };
    Pages.prototype.render = function (props, state) {
        var pagenos = Array.from({ length: props.total }, function (_, index) { return index + 1; });
        var pages = pagenos.map(function (page) {
            var theClass, theUserColor;
            if (state.typing[page] && state.typing[page][0]) {
                theClass = "typing";
                theUserColor = new colors_js_1.UserColor(state.typing[page][0]);
            }
            return <button value={page} key={page} class={theClass} tabIndex={props.visibility ? 0 : -1} style={theUserColor === null || theUserColor === void 0 ? void 0 : theUserColor.styleVariables} onclick={props.handleClick}>{page}</button>;
        });
        pages[props.current - 1] = <button ref={this.currentPageElement} tabIndex={props.visibility ? 0 : -1} class="currentpage">{props.current}</button>;
        return <div class={props.visibility ? null : "nav-hidden"} id="nav-pages">
        {pages}
      </div>;
    };
    return Pages;
}(preact_1.Component));

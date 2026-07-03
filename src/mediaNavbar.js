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
var Icons = require("./icons.js");
var Matrix = require("matrix-js-sdk");
var tooltip_js_1 = require("./utils/tooltip.js");
require("./styles/navbar.css");
var history_js_1 = require("./history.js");
var resource_js_1 = require("./utils/resource.js");
var client_js_1 = require("./client.js");
var temporal_js_1 = require("./utils/temporal.js");
var modal_js_1 = require("./modal.js");
var manageMembership_js_1 = require("./manageMembership.js");
var MediaNavbar = /** @class */ (function (_super) {
    __extends(MediaNavbar, _super);
    function MediaNavbar(props) {
        var _this = _super.call(this, props) || this;
        _this.handleKeydown = function (e) {
            if (e.key === 'j')
                _this.props.content.current.scrubRight();
            if (e.key === 'k')
                _this.props.content.current.scrubLeft();
            if (e.key === "ArrowRight")
                _this.props.content.current.selRight(e);
            if (e.key === "ArrowLeft")
                _this.props.content.current.selLeft(e);
            if (e.key === ' ' || e.key === "Spacebar")
                _this.props.content.current.playPause();
        };
        _this.timeCurrent = (0, preact_1.createRef)();
        _this.timeTotal = (0, preact_1.createRef)();
        _this.toolTipOffset = [0, 30];
        _this.mainMenu = function (_) { return history_js_1.default.push("/"); };
        _this.download = function (_) {
            if (confirm("do you want to download the file you're annotating?")) {
                var file = new resource_js_1.default(_this.props.room);
                window.open(file.httpUrl);
            }
        };
        _this.play = function (_) { return _this.props.content.current.play(); };
        _this.pause = function (_) { return _this.props.content.current.pause(); };
        _this.zoomIn = function (_) { return _this.props.content.current.setZoom(_this.props.content.current.zoomFactor + .1); };
        _this.zoomOut = function (_) { return _this.props.content.current.setZoom(_this.props.content.current.zoomFactor - .1); };
        _this.toggleMoreOptions = function (_) {
            if (_this.state.moreOptionsVisible)
                _this.props.setNavHeight(75);
            else
                _this.props.setNavHeight(150);
            _this.setState(function (oldState) { return { moreOptionsVisible: !oldState.moreOptionsVisible }; });
        };
        _this.openMembership = function (_) { return modal_js_1.default.set(<manageMembership_js_1.default room={_this.props.room}/>, "Manage Membership", "for ".concat(_this.props.room.name)); };
        // Could add a listener to update this live
        var roomState = props.room.getLiveTimeline().getState(Matrix.EventTimeline.FORWARDS);
        _this.canAnnotate = roomState.maySendStateEvent(Matrix.EventType.SpaceChild, client_js_1.default.client.getUserId());
        return _this;
    }
    MediaNavbar.prototype.componentDidMount = function () {
        document.addEventListener('keydown', this.handleKeydown);
    };
    MediaNavbar.prototype.componentWillUnmount = function () {
        document.removeEventListener('keydown', this.handleKeydown);
    };
    MediaNavbar.prototype.render = function (props, state) {
        var annotationStatus = !props.hasSelection
            ? "Long press on waveform to select"
            : !this.canAnnotate
                ? "Annotation restricted"
                : false;
        if (props.contentWidthPx) { // don't render until width is set
            return <nav id="page-nav">
        <div id="nav-background"/>
        <div class="nav-button-wrapper top-wrapper">
          <tooltip_js_1.default content="Go to main menu (ESC)" offset={this.toolTipOffset}>
            <button onclick={this.mainMenu}>{Icons.home}</button>
          </tooltip_js_1.default>
          <tooltip_js_1.default content={annotationStatus || "Add annotation (Alt + a)"} offset={this.toolTipOffset}>
            <div class="nav-button-tip-wrapper">
              <button disabled={annotationStatus ? "disabled" : null} onclick={props.openAnnotation}>{Icons.addAnnotation}
              </button>
            </div>
          </tooltip_js_1.default>
          <tooltip_js_1.default content="Go to previous annotation (Alt + Shift + Tab)" offset={this.toolTipOffset}>
            <button disabled={!props.hasAnnotations} onclick={props.focusPrev}>{Icons.chevronsLeft}
            </button>
          </tooltip_js_1.default>
          <tooltip_js_1.default content="Play" offset={this.toolTipOffset}>
            <button onclick={this.play}>{Icons.playButton}
            </button>
          </tooltip_js_1.default>
          <Progress resourceAlias={props.resourceAlias} eventFocused={props.eventFocused} timeStamp={props.timeStamp} content={props.content} total={props.total} roomFocused={props.roomFocused}/>
          <tooltip_js_1.default content="Pause" offset={this.toolTipOffset}>
            <button onclick={this.pause}>{Icons.pauseButton}
            </button>
          </tooltip_js_1.default>
          <tooltip_js_1.default content="Go to next annotation (Alt + Tab)" offset={[0, 30]}>
            <button disabled={!props.hasAnnotations} onclick={props.focusNext}>{Icons.chevronsRight}
            </button>
          </tooltip_js_1.default>
          <tooltip_js_1.default content="Remove annotation (Alt + r)" offset={this.toolTipOffset}>
            <button disabled={props.focus && !props.hasSelection ? null : "disabled"} onclick={props.closeAnnotation}>{Icons.removeAnnotation}
            </button>
          </tooltip_js_1.default>
          <tooltip_js_1.default content="More options" offset={this.toolTipOffset}>
            <button onClick={this.toggleMoreOptions}>{Icons.moreVertical}</button>
          </tooltip_js_1.default>
        </div>
        <div ref={this.bottomWrapper} data-searchFocused={state.searchFocused} class="nav-button-wrapper bottom-wrapper">
          <tooltip_js_1.default content="Manage membership" theme="bordered">
            <button tabIndex={state.moreOptionsVisible ? 0 : -1} onClick={this.openMembership}>{Icons.userPlus}
            </button>
          </tooltip_js_1.default>
          <tooltip_js_1.default content="Download Media" theme="bordered">
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
        </div>
      </nav>;
        }
    };
    return MediaNavbar;
}(preact_1.Component));
exports.default = MediaNavbar;
var Progress = /** @class */ (function (_super) {
    __extends(Progress, _super);
    function Progress() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.updateTime = function (_) {
            if (_this.updateLock)
                return;
            _this.updateLock = true;
            var timeSec = Math.floor(_this.props.content.current.wavesurfer.getCurrentTime());
            history_js_1.default.push("/".concat(encodeURIComponent(_this.props.resourceAlias)) +
                "/".concat(timeSec) +
                "".concat(_this.props.roomFocused ? "/" + _this.props.roomFocused : "") +
                "".concat(_this.props.eventFocused ? "/" + _this.props.eventFocused : ""));
            setTimeout(function (_) { return _this.updateLock = false; }, 1000);
        };
        return _this;
    }
    Progress.prototype.componentDidMount = function () {
        this.props.content.current.wavesurfer.on("audioprocess", this.updateTime);
        // don't need to take off, wavesurfer is destroyed when view changes
    };
    Progress.prototype.render = function (props) {
        var timeStamp = (0, temporal_js_1.toClockTime)(props.timeStamp);
        var timeTotal = (0, temporal_js_1.toClockTime)(props.total);
        return <div class="nav-position">
      <span ref={this.timeCurrent} style={{ width: "".concat(timeStamp.length + .5, "ch") }} id="nav-time-elapsed">{timeStamp}</span>
      <span>/</span>
      <span ref={this.timeTotal} style={{ width: "".concat(timeTotal.length + .5, "ch") }} id="nav-time-total">{timeTotal}</span>
    </div>;
    };
    return Progress;
}(preact_1.Component));

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
var modal_js_1 = require("./modal.js");
var manageMembership_js_1 = require("./manageMembership.js");
var ImageNavbar = /** @class */ (function (_super) {
    __extends(ImageNavbar, _super);
    function ImageNavbar(props) {
        var _this = _super.call(this, props) || this;
        _this.handleKeydown = function (e) { };
        _this.timeCurrent = (0, preact_1.createRef)();
        _this.timeTotal = (0, preact_1.createRef)();
        _this.toolTipOffset = [0, 30];
        _this.mainMenu = function (_) { return history_js_1.default.push("/"); };
        _this.download = function (_) {
            if (confirm("do you want to download the image you're annotating?")) {
                var file = new resource_js_1.default(_this.props.room);
                window.open(file.httpUrl);
            }
        };
        _this.play = function (_) { return _this.props.content.current.play(); };
        _this.pause = function (_) { return _this.props.content.current.pause(); };
        _this.zoomOut = function (_) { return _this.props.setZoom(function (zoomFactor) { return zoomFactor - 0.1; }); };
        _this.zoomIn = function (_) { return _this.props.setZoom(function (zoomFactor) { return zoomFactor + 0.1; }); };
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
    ImageNavbar.prototype.componentDidMount = function () {
        document.addEventListener('keydown', this.handleKeydown);
    };
    ImageNavbar.prototype.componentWillUnmount = function () {
        document.removeEventListener('keydown', this.handleKeydown);
    };
    ImageNavbar.prototype.render = function (props, state) {
        var annotationStatus = !props.hasSelection
            ? "Select an area to annotate"
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
          <tooltip_js_1.default content="Zoom out (-)" theme="bordered">
            <button tabIndex={state.moreOptionsVisible ? 0 : -1} onClick={this.zoomOut}>{Icons.zoomout}</button>
          </tooltip_js_1.default>
          <tooltip_js_1.default content="Zoom in (+)" theme="bordered">
            <button tabIndex={state.moreOptionsVisible ? 0 : -1} onClick={this.zoomIn}>{Icons.zoomin}</button>
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
          <tooltip_js_1.default content="Toggle annotation visibility (Alt + v)" theme="bordered">
            <button tabIndex={state.moreOptionsVisible ? 0 : -1} onClick={props.toggleAnnotations}>{props.annotationsVisible ? Icons.eyeOff : Icons.eye}</button>
          </tooltip_js_1.default>
        </div>
      </nav>;
        }
    };
    return ImageNavbar;
}(preact_1.Component));
exports.default = ImageNavbar;

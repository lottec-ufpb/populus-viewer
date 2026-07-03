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
var Layout = require("./utils/layout.js");
var Matrix = require("matrix-js-sdk");
var colors_js_1 = require("./utils/colors.js");
var quadPoints_js_1 = require("./utils/quadPoints.js");
var client_js_1 = require("./client.js");
require("./styles/annotation-layer.css");
var Icons = require("./icons.js");
var AnnotationLayer = /** @class */ (function (_super) {
    __extends(AnnotationLayer, _super);
    function AnnotationLayer(props) {
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
        _this.filterAnnotations = function (loc) { return loc.getPageIndex() === parseInt(_this.props.pageFocused, 10); };
        _this.sortAnnotations = function (a, b) {
            if (!a.getRect() || !b.getRect())
                return 0;
            if (a.getRect().top < b.getRect().top)
                return 1;
            if (b.getRect().top < a.getRect().top)
                return -1;
            return 0;
        };
        _this.state = { typing: {} };
        _this.handleTypingNotification = _this.handleTypingNotification.bind(_this);
        return _this;
    }
    AnnotationLayer.prototype.componentDidMount = function () {
        client_js_1.default.client.on("RoomMember.typing", this.handleTypingNotification);
    };
    AnnotationLayer.prototype.componentDidUnmount = function () {
        client_js_1.default.client.off("RoomMember.typing", this.handleTypingNotification);
    };
    AnnotationLayer.prototype.updateGutter = function (gutter, loc) {
        for (var key_1 in gutter) {
            if (gutter[key_1].getRect().bottom >= loc.getRect().top)
                delete gutter[key_1];
        }
        var key = 0;
        while (true) {
            if (gutter[key]) {
                key++;
                continue;
            }
            gutter[key] = loc;
            return key;
        }
    };
    AnnotationLayer.prototype.getAnnotations = function () {
        var _this = this;
        var _a;
        var theRoom = client_js_1.default.client.getRoom(this.props.roomId);
        var focusId = (_a = this.props.focus) === null || _a === void 0 ? void 0 : _a.getChild();
        var annotations = [];
        if (theRoom) {
            var didFocus_1 = false;
            // We filter to include only the annotations on the page
            var annotationData = this.props.filteredAnnotationContents
                .filter(function (loc) {
                var _a;
                if (loc.getChild() === ((_a = _this.props.focus) === null || _a === void 0 ? void 0 : _a.getChild()))
                    didFocus_1 = true;
                return _this.filterAnnotations(loc);
            }).sort(this.sortAnnotations);
            // We add the secondary focus
            if (this.props.secondaryFocus && this.filterAnnotations(this.props.secondaryFocus))
                annotationData.push(this.props.secondaryFocus);
            // We add the focus back in if it's on the page but got screened out of filteredAnnotationContents
            if (this.props.focus && this.filterAnnotations(this.props.focus) && !didFocus_1)
                annotationData.push(this.props.focus);
            // We turn the array into annontation components
            var leftGutter_1 = {};
            var rightGutter_1 = {};
            annotations = annotationData.map(function (loc) {
                var annotationId = loc.getChild();
                var rightSide = _this.props.fixedSide
                    ? _this.props.fixedSide === "right"
                    : null;
                switch (loc.getType()) {
                    case 'text': return <Pindrop key={loc.event.getId()} focused={focusId === annotationId} typing={_this.state.typing[annotationId]} pdfWidthAdjustedPx={_this.props.pdfWidthAdjustedPx} pdfHeightAdjustedPx={_this.props.pdfHeightAdjustedPx} setFocus={_this.props.setFocus} location={loc}/>;
                    case 'highlight': {
                        var gutterDepth = void 0;
                        if (rightSide)
                            gutterDepth = _this.updateGutter(rightGutter_1, loc);
                        else
                            gutterDepth = _this.updateGutter(leftGutter_1, loc);
                        return <Highlight zoomFactor={_this.props.zoomFactor} key={loc.event.getId()} focused={focusId === annotationId} typing={_this.state.typing[annotationId]} rightSide={rightSide} gutterDepth={gutterDepth} setFocus={_this.props.setFocus} pdfWidthAdjustedPx={_this.props.pdfWidthAdjustedPx} pdfHeightAdjustedPx={_this.props.pdfHeightAdjustedPx} location={loc}/>;
                    }
                }
            });
        }
        return annotations;
    };
    AnnotationLayer.prototype.render = function (props) {
        var _a;
        return (<div ref={props.annotationLayerWrapper} data-annotation-focused={!!props.focus} class="annotation-layer">
        {this.getAnnotations()}
        {((_a = props.pindropMode) === null || _a === void 0 ? void 0 : _a.x) ? <PindropPreview coordinates={props.pindropMode}/> : null}
      </div>);
    };
    return AnnotationLayer;
}(preact_1.Component));
exports.default = AnnotationLayer;
function PindropPreview(props) {
    var style = {
        left: "".concat(props.coordinates.x, "px"),
        top: "".concat(props.coordinates.y, "px")
    };
    return <span class="annotation-pindrop annotation-pindrop-preview" data-annotation style={style}>
    {Icons.pin}
  </span>;
}
var Pindrop = /** @class */ (function (_super) {
    __extends(Pindrop, _super);
    function Pindrop() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.setFocus = function (_) { return _this.props.setFocus(_this.props.location); };
        _this.userColor = new colors_js_1.UserColor(_this.props.location.getCreator());
        _this.left = _this.props.location.getRect().left;
        _this.top = _this.props.pdfHeightAdjustedPx - _this.props.location.getRect().top;
        return _this;
    }
    Pindrop.prototype.shouldComponentUpdate = function (nextProps) {
        if (nextProps.pdfWidthAdjusted === 0)
            return false;
        if (nextProps.pdfHeightAdjustedPx === this.props.pdfHeightAdjustedPx)
            return;
        if (!this.positioned) {
            this.left = this.props.location.getRect().left;
            this.top = nextProps.pdfHeightAdjustedPx - this.props.location.getRect().top;
        }
    };
    Pindrop.prototype.render = function (props) {
        var typing = typeof (props.typing) === "object" && Object.keys(props.typing).length > 0 ? true : null;
        return <span onclick={this.setFocus} class="annotation-pindrop" data-focused={props.focused} data-annotation-typing={typing} data-annotation style={__assign({ left: "".concat(this.left, "px"), top: "".concat(this.top, "px") }, this.userColor.styleVariables)}>
      {Icons.pin}
    </span>;
    };
    return Pindrop;
}(preact_1.Component));
var Highlight = /** @class */ (function (_super) {
    __extends(Highlight, _super);
    function Highlight(props) {
        var _this = _super.call(this, props) || this;
        _this.setFocus = function (_) { return _this.props.setFocus(_this.props.location); };
        _this.roomId = _this.props.location.getChild();
        _this.clientRects = _this.props.location.getQuadPoints().map(function (qp) {
            return quadPoints_js_1.default.fromQuadArray(qp).toDOMRectInHeight(_this.props.pdfHeightAdjustedPx);
        });
        _this.boundingRect = new DOMRect(_this.props.location.getRect().left, _this.props.pdfHeightAdjustedPx - _this.props.location.getRect().top, _this.props.location.getRect().right - _this.props.location.getRect().left, _this.props.location.getRect().top - _this.props.location.getRect().bottom);
        _this.userColor = new colors_js_1.UserColor(_this.props.location.getCreator());
        _this.state = { rightSide: _this.calculateSide(props) };
        return _this;
    }
    Highlight.prototype.calculateSide = function (props) {
        if (props.pdfWidthAdjustedPx > this.boundingRect.width * 2) {
            var rightMargin = props.pdfWidthAdjustedPx - (this.boundingRect.width + this.boundingRect.x);
            if (rightMargin < this.boundingRect.x)
                return true;
            else
                return false;
        }
        else {
            return props.location.getChild().charCodeAt(1) % 2 === 1;
        }
    };
    Highlight.prototype.shouldComponentUpdate = function (nextProps) {
        if (nextProps.pdfWidthAdjustedPx === 0)
            return false;
        if (nextProps.pdfHeightAdjustedPx === this.props.pdfHeightAdjustedPx)
            return;
        if (!this.positioned) {
            this.boundingRect = new DOMRect(this.props.location.getRect().left, nextProps.pdfHeightAdjustedPx - this.props.location.getRect().top, this.props.location.getRect().right - this.props.location.getRect().left, this.props.location.getRect().top - this.props.location.getRect().bottom);
            this.clientRects = this.props.location.getQuadPoints().map(function (qp) {
                return quadPoints_js_1.default.fromQuadArray(qp).toDOMRectInHeight(nextProps.pdfHeightAdjustedPx);
            });
            this.setState({ rightSide: this.calculateSide(nextProps) });
        }
    };
    Highlight.prototype.render = function (props, state) {
        var _this = this;
        var _a;
        if (!this.props.pdfWidthAdjustedPx)
            return null;
        var spans = this.clientRects.map(function (rect) { return <RectSpan pdfWidthAdjustedPx={_this.props.pdfWidthAdjustedPx} key={rect} zoomFactor={_this.props.zoomFactor} setFocus={_this.setFocus} rect={rect}/>; });
        var typing = typeof (props.typing) === "object" && Object.keys(props.typing).length > 0 ? true : null;
        return <div style={this.userColor.styleVariables} data-annotation-typing={typing} data-focused={props.focused} id={this.roomId}>
      <BarTab pdfWidthAdjustedPx={props.pdfWidthAdjustedPx} rightSide={(_a = props.rightSide) !== null && _a !== void 0 ? _a : state.rightSide} gutterDepth={props.gutterDepth} rect={this.boundingRect} zoomFactor={props.zoomFactor} setFocus={this.setFocus}/>
      <div class="inline-annotations">
        {spans}
      </div>
    </div>;
    };
    return Highlight;
}(preact_1.Component));
var BarTab = /** @class */ (function (_super) {
    __extends(BarTab, _super);
    function BarTab() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ref = (0, preact_1.createRef)();
        _this.getTabRect = function (_) {
            return _this.props.rightSide
                ? new DOMRect(_this.props.pdfWidthAdjustedPx - 10 + (_this.props.gutterDepth * 10), _this.props.rect.y, 3, _this.props.rect.height)
                : new DOMRect(5 - (_this.props.gutterDepth * 10), _this.props.rect.y, 3, _this.props.rect.height);
        };
        return _this;
    }
    BarTab.prototype.componentDidMount = function () {
        Layout.positionRelativeAt(this.getTabRect(), this.ref.current, 1);
    };
    BarTab.prototype.componentDidUpdate = function () {
        Layout.positionRelativeAt(this.getTabRect(), this.ref.current, this.props.zoomFactor);
    };
    BarTab.prototype.render = function (props) {
        return <span onclick={props.setFocus} class="annotation-bartab" data-annotation ref={this.ref}/>;
    };
    return BarTab;
}(preact_1.Component));
var RectSpan = /** @class */ (function (_super) {
    __extends(RectSpan, _super);
    function RectSpan() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ref = (0, preact_1.createRef)();
        return _this;
    }
    RectSpan.prototype.componentDidMount = function () {
        Layout.positionRelativeAt(this.props.rect, this.ref.current, this.props.zoomFactor);
    };
    RectSpan.prototype.componentDidUpdate = function () {
        Layout.positionRelativeAt(this.props.rect, this.ref.current, this.props.zoomFactor);
    };
    RectSpan.prototype.render = function (props) {
        return <span onclick={props.setFocus} data-annotation ref={this.ref}/>;
    };
    return RectSpan;
}(preact_1.Component));

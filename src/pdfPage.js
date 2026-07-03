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
var annotation_js_1 = require("./annotation.js");
var client_js_1 = require("./client.js");
var pdfCanvas_js_1 = require("./pdfCanvas.js");
var quadPoints_js_1 = require("./utils/quadPoints.js");
var Matrix = require("matrix-js-sdk");
var layout_js_1 = require("./utils/layout.js");
var alerts_js_1 = require("./utils/alerts.js");
var selection_js_1 = require("./utils/selection.js");
var constants_js_1 = require("./constants.js");
var PdfPage = /** @class */ (function (_super) {
    __extends(PdfPage, _super);
    function PdfPage(props) {
        var _this = _super.call(this, props) || this;
        _this.textLayer = (0, preact_1.createRef)();
        _this.annotationLayer = (0, preact_1.createRef)();
        _this.annotationLayerWrapper = (0, preact_1.createRef)();
        _this.isTarget = function (e) { return e.target === _this.annotationLayer.current.base; };
        _this.setPdfFitRatio = function (pdfFitRatio) { return _this.setState({ pdfFitRatio: pdfFitRatio }); };
        _this.generateLocation = function (sel) {
            var _a;
            var theSelectedText = (0, selection_js_1.textFromPdfSelection)(sel);
            var clientRects = (0, selection_js_1.rectsFromPdfSelection)(sel, _this.annotationLayerWrapper.current, _this.state.pdfFitRatio * _this.props.zoomFactor);
            var boundingClientRect = (0, layout_js_1.unionRects)(clientRects);
            var clientQuads = clientRects.map(function (rect) { return quadPoints_js_1.default.fromRectIn(rect, _this.annotationLayerWrapper.current); });
            var boundingQuad = quadPoints_js_1.default.fromRectIn(boundingClientRect, _this.annotationLayerWrapper.current);
            // ↑ We've set the dimensions of the text layer in such a way that it's 72dpi, scaled up with a CSS transform.
            // So we can omit the DPI parameter here.
            return _a = {},
                _a[constants_js_1.mscPdfHighlight] = {
                    page_index: _this.props.pageFocused,
                    rect: boundingQuad.getBoundingRect(),
                    quad_points: clientQuads.map(function (quad) { return quad.getArray(); }),
                    contents: "", // highlight contents, per PDF spec. Fill this with the first chat message text, or fallback text
                    text_content: theSelectedText // the actual highlighted text
                },
                _a[constants_js_1.populusHighlight] = {
                    activityStatus: "pending",
                    creator: client_js_1.default.client.getUserId()
                },
                _a;
        };
        _this.commitHighlight = function (_) {
            var _a, _b;
            if (!(0, alerts_js_1.onlineOrAlert)())
                return;
            var theSelection = window.getSelection();
            if (theSelection.isCollapsed)
                return;
            var theSelectedText = (0, selection_js_1.textFromPdfSelection)(theSelection);
            // ↑ We've set the dimensions of the text layer in such a way that it's 72dpi, scaled up with a CSS transform.
            // So we can omit the DPI parameter here.
            var theDomain = client_js_1.default.client.getDomain();
            var theRoomState = _this.props.room.getLiveTimeline().getState(Matrix.EventTimeline.FORWARDS);
            var theLevels = theRoomState.getStateEvents("m.room.power_levels");
            var locationData = _this.generateLocation(theSelection);
            // TODO: we should set room_alias_name and name, in a useful way based on the selection
            return client_js_1.default.client.createRoom({
                visibility: "private",
                name: "highlighted passage on page ".concat(_this.props.pageFocused),
                power_level_content_override: {
                    users: Object.assign({}, theLevels[0].getContent().users, (_a = {},
                        _a[client_js_1.default.client.getUserId()] = 100,
                        _a))
                },
                topic: theSelectedText,
                initial_state: [{
                        type: "m.room.join_rules",
                        state_key: "",
                        content: { join_rule: "public" }
                    },
                    {
                        type: Matrix.EventType.SpaceParent, // we indicate that the current room is the parent
                        content: (_b = { via: [theDomain] }, _b[constants_js_1.mscLocation] = locationData, _b),
                        state_key: _this.props.room.roomId
                    }
                ]
            }).then(function (roominfo) {
                var _a;
                // set child event in pdfRoom State
                theSelection.removeAllRanges();
                var childContent = (_a = { via: [theDomain] }, _a[constants_js_1.mscLocation] = locationData, _a);
                // We focus on a new fake placeholder event to insert the highlight immediately
                var fakeEvent = new Matrix.MatrixEvent({
                    type: "m.space.child",
                    origin_server_ts: new Date().getTime(),
                    room_id: _this.props.room.roomId,
                    sender: client_js_1.default.client.getUserId(),
                    state_key: roominfo.room_id,
                    content: childContent
                });
                client_js_1.default.client.sendStateEvent(_this.props.room.roomId, Matrix.EventType.SpaceChild, childContent, roominfo.room_id);
                return fakeEvent;
            });
        };
        _this.commitPin = function (theX, theY) {
            var _a, _b, _c;
            if (!(0, alerts_js_1.onlineOrAlert)())
                return;
            var theDomain = client_js_1.default.client.getDomain();
            var theRoomState = _this.props.room.getLiveTimeline().getState(Matrix.EventTimeline.FORWARDS);
            var theLevels = theRoomState.getStateEvents("m.room.power_levels");
            var newY = _this.annotationLayerWrapper.current.scrollHeight - theY;
            var locationData = (_a = {},
                _a[constants_js_1.mscPdfText] = {
                    page_index: _this.props.pageFocused,
                    rect: {
                        left: theX,
                        right: theX + 10,
                        top: newY,
                        bottom: newY - 10
                    },
                    name: "Comment",
                    contents: "" // highlight contents, per PDF spec. TODO Fill this with the first chat message text, or fallback text
                },
                _a[constants_js_1.populusHighlight] = {
                    activityStatus: "pending",
                    creator: client_js_1.default.client.getUserId()
                },
                _a);
            return client_js_1.default.client.createRoom({
                visibility: "private",
                name: "pindrop on page ".concat(_this.props.pageFocused),
                power_level_content_override: {
                    users: Object.assign({}, theLevels[0].getContent().users, (_b = {},
                        _b[client_js_1.default.client.getUserId()] = 100,
                        _b))
                },
                initial_state: [{
                        type: "m.room.join_rules",
                        state_key: "",
                        content: { join_rule: "public" }
                    },
                    {
                        type: Matrix.EventType.SpaceParent, // we indicate that the current room is the parent
                        content: (_c = {
                                via: [theDomain]
                            },
                            _c[constants_js_1.mscLocation] = locationData,
                            _c),
                        state_key: _this.props.room.roomId
                    }
                ]
            }).then(function (roominfo) {
                var _a;
                // set child event in pdfRoom State
                var childContent = (_a = {
                        via: [theDomain]
                    },
                    _a[constants_js_1.mscLocation] = locationData,
                    _a);
                var fakeEvent = new Matrix.MatrixEvent({
                    type: "m.space.child",
                    origin_server_ts: new Date().getTime(),
                    room_id: _this.props.room.roomId,
                    sender: client_js_1.default.client.getUserId(),
                    state_key: roominfo.room_id,
                    content: childContent
                });
                client_js_1.default.client.sendStateEvent(_this.props.room.roomId, Matrix.EventType.SpaceChild, childContent, roominfo.room_id);
                return fakeEvent;
            }).catch(function (e) { return alert(e); });
        };
        _this.state = { pdfFitRatio: 1 };
        _this.pdfScale = 3;
        return _this;
        // single source of truth for PDF scale, pdfcanvas w/h are pdf dimensions (in userspace units) times scale
    }
    PdfPage.prototype.hasSelection = function () {
        return !window.getSelection().isCollapsed &&
            this.textLayer.current.contains(window.getSelection().getRangeAt(0).endContainer) &&
            this.textLayer.current.contains(window.getSelection().getRangeAt(0).startContainer);
    };
    PdfPage.prototype.render = function (props, state) {
        var dynamicDocumentStyle = {
            "--pdfFitRatio": state.pdfFitRatio,
            "--pdfWidthPx": "".concat(props.pdfWidthPx, "px"),
            "--pdfHeightPx": "".concat(props.pdfHeightPx, "px")
        };
        return <div class="page-wrapper" style={dynamicDocumentStyle}>
      <pdfCanvas_js_1.default setPdfDimensions={props.setPdfDimensions} setPdfFitRatio={this.setPdfFitRatio} pdfScale={this.pdfScale} annotationLayer={this.annotationLayer} hasFetched={props.hasFetched} pdfPromise={props.pdfPromise} textLayer={this.textLayer} searchString={props.searchString} pageFocused={props.pageFocused} setPdfLoadingStatus={props.setPdfLoadingStatus}/>
      <annotation_js_1.default ref={this.annotationLayer} pindropMode={props.pindropMode} annotationLayerWrapper={this.annotationLayerWrapper} filteredAnnotationContents={props.filteredAnnotationContents} pdfWidthAdjustedPx={props.pdfWidthPx / state.pdfFitRatio} pdfHeightAdjustedPx={props.pdfHeightPx / state.pdfFitRatio} fixedSide={props.fixedSide} zoomFactor={props.zoomFactor} pageFocused={props.pageFocused} roomId={props.room.roomId} setFocus={props.setFocus} focus={props.focus} secondaryFocus={props.secondaryFocus}/>
    </div>;
    };
    return PdfPage;
}(preact_1.Component));
exports.default = PdfPage;

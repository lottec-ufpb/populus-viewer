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
require("./styles/pdfView.css");
var PDFJS = require("pdfjs-dist/webpack");
require("./styles/text-layer.css");
var PdfCanvas = /** @class */ (function (_super) {
    __extends(PdfCanvas, _super);
    function PdfCanvas(props) {
        var _this = _super.call(this, props) || this;
        _this.canvas = (0, preact_1.createRef)();
        _this.pendingRender = null;
        _this.pendingTextRender = null;
        _this.hasRendered = false; // we allow one initial render, but then require a page change for a redraw
        return _this;
    }
    PdfCanvas.prototype.componentDidUpdate = function (prevProps) {
        var _this = this;
        if (!this.hasRendered || (prevProps.pageFocused !== this.props.pageFocused)) {
            var control = this.grabControl();
            this.drawPdf(control).then(function (_) { var _a; 
            // need to do this to take into account positioning changes caused by rescaling
            return (_a = _this.props.annotationLayer) === null || _a === void 0 ? void 0 : _a.current.forceUpdate(); }).then(function (_) { return _this.highlightText(_this.props.searchString); });
        }
        if (prevProps.searchString !== this.props.searchString) {
            this.highlightText(this.props.searchString);
        }
    };
    PdfCanvas.prototype.componentDidMount = function () {
        this.props.textLayer.current.addEventListener('click', function (e) {
            e.preventDefault(); // this should prevent touch-to-search on mobile chrome
            var mouseEvent = new MouseEvent(e.type, e);
            document.elementsFromPoint(e.clientX, e.clientY).forEach(function (elt) {
                if (elt.hasAttribute("data-annotation"))
                    elt.dispatchEvent(mouseEvent);
            });
        });
    };
    // because rendering is async, we need a way to cancel pending render tasks and
    // to make sure that pending drawPdf calls don't proceed. That's what this function does.
    PdfCanvas.prototype.grabControl = function () {
        var controlToken = {};
        // we spawn a new control token - this is just an empty object, the
        // important thing is that it's a *new* empty object, since previous
        // drawPdf calls will check to see if the control token is the same as
        // the one that they were spawned with
        this.controlToken = controlToken;
        // now that we're sure we won't spawn any unintended renders, we cancel
        // any pending renders
        try {
            this.pendingRender.cancel();
        }
        catch (err) {
            console.log(err);
        }
        try {
            this.pendingTextRender.cancel();
        }
        catch (err) {
            console.log(err);
        }
        // and we clear the textlayer.
        this.cleanText = "";
        this.props.textLayer.current.innerHTML = '';
        return controlToken;
    };
    PdfCanvas.prototype.drawPdf = function (control) {
        return __awaiter(this, void 0, void 0, function () {
            var theCanvas, pdf, page, scale, viewport, pdfWidthPx, pdfHeightPx, canvasContext, renderContext, text;
            var _this = this;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        // since we've started rendering, we want to block subsequent render attempts
                        this.hasRendered = true;
                        theCanvas = this.canvas.current;
                        return [4 /*yield*/, this.props.hasFetched];
                    case 1:
                        _e.sent();
                        this.props.setPdfLoadingStatus("Rendering PDF");
                        return [4 /*yield*/, this.props.pdfPromise
                            // exit early if someone else has grabbed control
                        ];
                    case 2:
                        pdf = _e.sent();
                        // exit early if someone else has grabbed control
                        if (control !== this.controlToken)
                            return [2 /*return*/];
                        return [4 /*yield*/, pdf.getPage(this.props.pageFocused).catch(console.log)];
                    case 3:
                        page = _e.sent();
                        if (!page)
                            return [2 /*return*/];
                        console.log('Page loaded');
                        scale = this.props.pdfScale;
                        viewport = page.getViewport({ scale: scale });
                        // Prepare canvas using PDF page dimensions
                        //
                        // These are PDF userspace units (aka "points", 72 per inch) times viewport scale
                        theCanvas.height = viewport.height;
                        theCanvas.width = viewport.width;
                        pdfWidthPx = Math.min(viewport.width / scale, window.innerWidth);
                        pdfHeightPx = (pdfWidthPx / viewport.width) * viewport.height;
                        (_b = (_a = this.props).setPdfDimensions) === null || _b === void 0 ? void 0 : _b.call(_a, pdfHeightPx, pdfWidthPx);
                        (_d = (_c = this.props).setPdfFitRatio) === null || _d === void 0 ? void 0 : _d.call(_c, Math.min(1, window.innerWidth / (viewport.width / scale)));
                        canvasContext = theCanvas.getContext('2d');
                        renderContext = { canvasContext: canvasContext, viewport: viewport };
                        if (control !== this.controlToken)
                            return [2 /*return*/];
                        // clear canvas (prevents occasional flickering on firefox)
                        canvasContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
                        this.pendingRender = page.render(renderContext);
                        return [4 /*yield*/, this.pendingRender.promise.catch(function (err) {
                                return err.name === "RenderingCancelledException" ? console.log(err.message) : console.log(err);
                            })];
                    case 4:
                        _e.sent();
                        console.log('Page rendered');
                        return [4 /*yield*/, page.getTextContent()];
                    case 5:
                        text = _e.sent();
                        if (control !== this.controlToken)
                            return [2 /*return*/];
                        if (!this.props.textLayer.current)
                            return [2 /*return*/];
                        // insert the pdf text into the text layer
                        this.pendingTextRender = PDFJS.renderTextLayer({
                            textContent: text,
                            container: this.props.textLayer.current,
                            viewport: page.getViewport({ scale: 1 }),
                            textDivs: []
                        });
                        this.pendingTextRender.promise.then(function (_) { _this.cleanText = _this.props.textLayer.current.innerHTML; });
                        return [2 /*return*/];
                }
            });
        });
    };
    PdfCanvas.prototype.highlightText = function (word) {
        return __awaiter(this, void 0, void 0, function () {
            var spans, text, start, end, counter, before, after, _i, spans_1, span, prior, pre, within, post, _a, _b, letter;
            return __generator(this, function (_c) {
                if (!this.props.textLayer.current)
                    return [2 /*return*/];
                this.props.textLayer.current.innerHTML = this.cleanText;
                if (!word || word.length < 3)
                    return [2 /*return*/];
                spans = this.props.textLayer.current.children;
                text = Array.from(spans).map(function (span) { return span.innerText; }).join("").replace(/[^a-zA-Z0-9]/gm, "").toLowerCase();
                word = word.replace(/[^a-zA-Z0-9]/gm, "").toLowerCase();
                start = text.indexOf(word);
                end = start + word.length;
                counter = 0;
                before = true;
                after = false;
                for (_i = 0, spans_1 = spans; _i < spans_1.length; _i++) {
                    span = spans_1[_i];
                    prior = "";
                    pre = "";
                    within = "";
                    post = "";
                    for (_a = 0, _b = span.innerText; _a < _b.length; _a++) {
                        letter = _b[_a];
                        if (counter === start) {
                            before = false;
                        }
                        else if (counter === end) {
                            after = true;
                            start = text.indexOf(word, end);
                            if (start >= 0) {
                                prior += "".concat(pre, "<mark>").concat(within, "</mark>").concat(post);
                                pre = "";
                                within = "";
                                post = "";
                                end = start + word.length;
                                before = true;
                                after = false;
                            }
                        }
                        if (before) {
                            pre += letter;
                        }
                        else if (after) {
                            post += letter;
                        }
                        else {
                            within += letter;
                        }
                        if (letter.match(/[a-zA-Z0-9]/))
                            counter++;
                    }
                    if (within !== "") {
                        span.innerHTML = "".concat(prior).concat(pre, "<mark>").concat(within, "</mark>").concat(post);
                    }
                    else if (prior !== "") {
                        span.innerHTML = "".concat(prior).concat(pre).concat(within).concat(post);
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    PdfCanvas.prototype.render = function (props) {
        return (<preact_1.Fragment>
        <canvas ref={this.canvas} data-page={props.pageFocused} class="pdf-canvas"/>
        <div style="z-index:3" ref={this.props.textLayer} class="text-layer"/>
      </preact_1.Fragment>);
    };
    return PdfCanvas;
}(preact_1.Component));
exports.default = PdfCanvas;

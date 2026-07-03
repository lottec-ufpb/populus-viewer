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
var pdfPage_js_1 = require("./pdfPage.js");
var resource_js_1 = require("./utils/resource.js");
var client_js_1 = require("./client.js");
var toast_js_1 = require("./toast.js");
var location_js_1 = require("./utils/location.js");
var PDFJS = require("pdfjs-dist/webpack");
var history_js_1 = require("./history.js");
var constants_js_1 = require("./constants.js");
var PdfContent = /** @class */ (function (_super) {
    __extends(PdfContent, _super);
    function PdfContent(props) {
        var _this = _super.call(this, props) || this;
        _this.updateSavedLocation = function (_) {
            // we only save if you've stopped zipping around for more than a second
            clearTimeout(_this.saveLocationTimeout);
            _this.saveLocationTimeout = setTimeout(function (_) {
                client_js_1.default.client.setRoomAccountData(_this.props.room.roomId, constants_js_1.lastViewed, {
                    deviceId: client_js_1.default.deviceId,
                    position: _this.props.pageFocused
                });
            }, 1500);
        };
        _this.handleBadPage = function (_) {
            if (_this.props.resourceLength) {
                console.log("fired");
                var newPage = _this.props.pageFocused < _this.props.resourceLength ? 1 : _this.props.resourceLength;
                history_js_1.default.replace("/".concat(encodeURIComponent(_this.props.resourceAlias)) +
                    "/".concat(newPage) +
                    "".concat(_this.props.roomFocused ? "/".concat(_this.props.roomFocused) : "") +
                    "".concat(_this.props.eventFocused ? "/".concat(_this.props.eventFocused) : ""));
            }
        };
        _this.mainPage = (0, preact_1.createRef)();
        _this.secondaryPage = (0, preact_1.createRef)();
        _this.getSecondaryHeight = function (_) { return _this.state.showSecondary
            ? (_this.state.secondaryPageHeightPx || 0)
            : 0; };
        _this.getSecondaryWidth = function (_) { return _this.state.showSecondary
            ? (_this.state.secondaryPageWidthPx || 0)
            : 0; };
        _this.setMainPageDimensions = function (mainPageHeightPx, mainPageWidthPx) {
            _this.setState({ mainPageHeightPx: mainPageHeightPx, mainPageWidthPx: mainPageWidthPx }, _this.refreshDimensions);
        };
        _this.setSecondaryPageDimensions = function (secondaryPageHeightPx, secondaryPageWidthPx) {
            _this.setState({ secondaryPageHeightPx: secondaryPageHeightPx, secondaryPageWidthPx: secondaryPageWidthPx }, _this.refreshDimensions);
        };
        _this.refreshDimensions = function (_) { return _this.props.setContentDimensions(Math.max(_this.state.mainPageHeightPx, _this.getSecondaryHeight()), _this.state.mainPageWidthPx + _this.getSecondaryWidth()); };
        _this.toggleSecondary = function (_) {
            _this.setState(function (oldState) { return { showSecondary: !oldState.showSecondary }; }, _this.refreshDimensions);
        };
        _this.catchFetchPdfError = function (e) {
            toast_js_1.default.set(<preact_1.Fragment>
      <h3 id="toast-header">Couldn't fetch the PDF...</h3>
      <div>Tried to fetch: </div>
      <pre>{_this.props.resourceAlias}</pre>
      <div>Here's the error message:</div>
      <pre>{e.message}</pre>
    </preact_1.Fragment>);
            history_js_1.default.push('/');
            _this.errorCondition = true;
        };
        _this.gatherText = function (_) { return __awaiter(_this, void 0, void 0, function () {
            var pdf, pdfText, i, page, content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.props.setPdfText) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.state.pdfPromise];
                    case 1:
                        pdf = _a.sent();
                        pdfText = {};
                        i = 1;
                        _a.label = 2;
                    case 2:
                        if (!(i < pdf.numPages + 1)) return [3 /*break*/, 6];
                        return [4 /*yield*/, pdf.getPage(i)];
                    case 3:
                        page = _a.sent();
                        return [4 /*yield*/, page.getTextContent()];
                    case 4:
                        content = _a.sent();
                        pdfText[i] = content.items.map(function (item) { return item.str; }).join(" ");
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 2];
                    case 6:
                        this.props.setPdfText(pdfText);
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        _this.releasePin = function (e) {
            var _a, _b;
            var page;
            if (_this.mainPage.current.isTarget(e))
                page = "primary";
            else if ((_b = (_a = _this.secondaryPage) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.isTarget(e))
                page = "secondary";
            else {
                document.removeEventListener("click", _this.releasePin);
                _this.props.setPindropMode(null);
                return;
            }
            var theX = e.altKey
                ? Math.round((e.offsetX - 14) / 14) * 14
                : e.offsetX - 14;
            var theY = e.altKey
                ? Math.round((e.offsetY - 14) / 14) * 14
                : e.offsetY - 14;
            _this.props.setPindropMode({ x: theX, y: theY, page: page });
        };
        _this.commitHighlight = function (_) {
            var _a, _b;
            var thePage;
            if (_this.mainPage.current.hasSelection())
                thePage = _this.mainPage.current;
            else if ((_b = (_a = _this.secondaryPage) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.hasSelection())
                thePage = _this.secondaryPage.current;
            else
                return;
            thePage.commitHighlight()
                .then(function (fakeEvent) {
                _this.props.setFocus(new location_js_1.default(fakeEvent));
                _this.props.showChat();
            }).catch(function (e) { return alert(e); });
        };
        _this.commitPin = function (theX, theY, thePage) {
            if (thePage === "primary")
                thePage = _this.mainPage.current;
            else if (thePage === "secondary")
                thePage = _this.secondaryPage.current;
            else
                return;
            thePage.commitPin(theX, theY)
                .then(function (fakeEvent) {
                _this.props.setFocus(new location_js_1.default(fakeEvent));
                _this.props.showChat();
            }).catch(function (e) { return alert(e); });
            document.removeEventListener("click", _this.releasePin);
            _this.props.setPindropMode(null);
        };
        _this.generateLocation = function (_) {
            var _a, _b, _c, _d;
            var theSelection = window.getSelection();
            if (theSelection.isCollapsed)
                return;
            if (_this.mainPage.current.hasSelection())
                return _this.mainPage.current.generateLocation(theSelection);
            if ((_b = (_a = _this.secondaryPage) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.hasSelection())
                return (_d = (_c = _this.secondaryPage) === null || _c === void 0 ? void 0 : _c.current) === null || _d === void 0 ? void 0 : _d.generateLocation(theSelection);
        };
        _this.zoomMin = 1;
        _this.zoomMax = 5;
        _this.hasSelection = function (_) {
            var _a, _b;
            return _this.mainPage.current.hasSelection() || ((_b = (_a = _this.secondaryPage) === null || _a === void 0 ? void 0 : _a.current) === null || _b === void 0 ? void 0 : _b.hasSelection());
        };
        _this.state = {
            showSecondary: false,
            mainPageWidthPx: null,
            mainPageHeightPx: null,
            secondaryPageWidthPx: null,
            secondaryPageHeightPx: null
        };
        _this.hasFetched = new Promise(function (resolve, reject) {
            _this.resolveFetch = resolve;
            _this.rejectFetch = reject;
        });
        return _this;
    }
    // we expose this method so that we can unformly sanatize position-strings
    // before passing them to components that expect timestamps
    PdfContent.positionToPage = function (pos, room) {
        var _a;
        var tryLastPosition = (_a = room === null || room === void 0 ? void 0 : room.getAccountData(constants_js_1.lastViewed)) === null || _a === void 0 ? void 0 : _a.getContent().position;
        var tryParse = parseInt(pos, 10);
        // need isInteger because 0 is falsey
        return Number.isInteger(tryParse)
            ? tryParse
            : Number.isInteger(tryLastPosition)
                ? tryLastPosition
                : 1;
    };
    PdfContent.prototype.componentDidMount = function () {
        this.fetchPdf();
        // fetch will fail if the initial sync isn't complete, but that should be handled by the splash page
    };
    PdfContent.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.resourceLength !== prevProps.resourceLength || // on length becoming known
            prevProps.pageFocused !== this.props.pageFocused // on page focus changing
        ) {
            if (this.props.pageFocused < 1 || this.props.pageFocused > this.props.resourceLength)
                this.handleBadPage();
            else {
                this.updateSavedLocation();
                if (this.props.pageFocused > prevProps.pageFocused)
                    this.props.contentContainer.current.scrollTop = 0;
                else if (this.props.pageFocused < prevProps.pageFocused)
                    this.props.contentContainer.current.scrollTop = this.props.contentContainer.current.scrollHeight;
            }
        }
    };
    PdfContent.prototype.fetchPdf = function () {
        return __awaiter(this, void 0, void 0, function () {
            var thePdf;
            var _this = this;
            return __generator(this, function (_a) {
                thePdf = new resource_js_1.default(this.props.room);
                if (!PdfContent.PDFStore[thePdf.url]) {
                    PdfContent.PDFStore[thePdf.url] = window.fetch(thePdf.httpUrl)
                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                        var theClone, contentLength, reader, accumulator, _a, done, value;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    theClone = response.clone();
                                    contentLength = +response.headers.get('Content-Length');
                                    reader = response.body.getReader();
                                    accumulator = 0;
                                    _b.label = 1;
                                case 1:
                                    if (!true) return [3 /*break*/, 3];
                                    return [4 /*yield*/, reader.read()];
                                case 2:
                                    _a = _b.sent(), done = _a.done, value = _a.value;
                                    if (done) {
                                        return [3 /*break*/, 3];
                                    }
                                    accumulator = accumulator + value.length;
                                    this.props.setPdfLoadingStatus(accumulator / contentLength);
                                    return [3 /*break*/, 1];
                                case 3: return [2 /*return*/, theClone.arrayBuffer()];
                            }
                        });
                    }); })
                        .then(function (array) { return PDFJS.getDocument(array).promise; })
                        .catch(this.catchFetchPdfError);
                }
                else {
                    console.log("found pdf for ".concat(this.props.room.name, " in store"));
                }
                if (this.errorCondition)
                    return [2 /*return*/];
                this.setState({
                    pdfPromise: PdfContent.PDFStore[thePdf.url]
                }, function (_) { return PdfContent.PDFStore[thePdf.url] // we resolve fetch in the callback here to guarantee that the pdf promise is available before we try to draw anything
                    .then(function (pdf) { return _this.props.setTotalPages(pdf.numPages); })
                    .then(_this.resolveFetch)
                    .then(_this.gatherText); });
                return [2 /*return*/];
            });
        });
    };
    PdfContent.prototype.render = function (props, state) {
        var _a, _b;
        var secondaryPageVisible = state.showSecondary && props.pageFocused < props.totalPages;
        var primaryPindrop = ((_a = props.pindropMode) === null || _a === void 0 ? void 0 : _a.page) === "primary" ? props.pindropMode : null;
        var secondaryPindrop = ((_b = props.pindropMode) === null || _b === void 0 ? void 0 : _b.page) === "secondary" ? props.pindropMode : null;
        var hideUntilWidthAvailable = { visibility: state.mainPageHeightPx ? null : "hidden" };
        return <div style={hideUntilWidthAvailable} id="document-view">
      <pdfPage_js_1.default filteredAnnotationContents={props.filteredAnnotationContents} focus={props.focus} pageFocused={props.pageFocused} pdfHeightPx={state.mainPageHeightPx} pdfWidthPx={state.mainPageWidthPx} fixedSide={secondaryPageVisible ? "left" : null} hasFetched={this.hasFetched} pdfPromise={state.pdfPromise} pindropMode={primaryPindrop} ref={this.mainPage} room={props.room} searchString={props.searchString} secondaryFocus={props.secondaryFocus} setFocus={props.setFocus} setPdfDimensions={this.setMainPageDimensions} setPdfLoadingStatus={props.setPdfLoadingStatus} zoomFactor={props.zoomFactor}/>
      {secondaryPageVisible
                ? <pdfPage_js_1.default filteredAnnotationContents={props.filteredAnnotationContents} focus={props.focus} fixedSide={secondaryPageVisible ? "right" : null} hasFetched={this.hasFetched} pdfPromise={state.pdfPromise} pageFocused={props.pageFocused + 1} pdfHeightPx={state.secondaryPageHeightPx} pdfWidthPx={state.secondaryPageWidthPx} pindropMode={secondaryPindrop} ref={this.secondaryPage} room={props.room} searchString={props.searchString} secondaryFocus={props.secondaryFocus} setFocus={props.setFocus} setPdfDimensions={this.setSecondaryPageDimensions} setPdfLoadingStatus={props.setPdfLoadingStatus} zoomFactor={props.zoomFactor}/>
                : null}
    </div>;
    };
    // we store downloaded PDFs here in order to avoid excessive downloads.
    // Could alternatively use localstorage or some such eventually. We don't
    // use preact state since changes here aren't relevent to UI.
    PdfContent.PDFStore = {};
    return PdfContent;
}(preact_1.Component));
exports.default = PdfContent;

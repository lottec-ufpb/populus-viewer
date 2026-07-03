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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var preact_1 = require("preact");
require("./styles/pdfView.css");
require("./styles/content-container.css");
var Matrix = require("matrix-js-sdk");
var chat_js_1 = require("./chat.js");
var roomIcon_js_1 = require("./roomIcon.js");
var annotationListing_js_1 = require("./annotationListing.js");
var searchResults_js_1 = require("./searchResults.js");
var pdfContent_js_1 = require("./pdfContent.js");
var mediaContent_js_1 = require("./mediaContent.js");
var imageContent_js_1 = require("./imageContent.js");
var history_js_1 = require("./history.js");
var client_js_1 = require("./client.js");
var documentNavbar_js_1 = require("./documentNavbar.js");
var mediaNavbar_js_1 = require("./mediaNavbar.js");
var imageNavbar_js_1 = require("./imageNavbar.js");
var constants_js_1 = require("./constants.js");
var location_js_1 = require("./utils/location.js");
var resource_js_1 = require("./utils/resource.js");
var syncIndicator_js_1 = require("./syncIndicator.js");
var toast_js_1 = require("./toast.js");
var mediaModal_js_1 = require("./mediaModal.js");
var tooltip_js_1 = require("./utils/tooltip.js");
var Icons = require("./icons.js");
var colors_js_1 = require("./utils/colors.js");
var ContentView = /** @class */ (function (_super) {
    __extends(ContentView, _super);
    function ContentView(props) {
        var _this = _super.call(this, props) || this;
        _this.handleStateUpdate = function (e) {
            var _a, _b, _c, _d;
            if (e.getStateKey() === ((_a = _this.state.room) === null || _a === void 0 ? void 0 : _a.roomId) && e.getType() === Matrix.EventType.SpaceParent) {
                _this.updateAnnotation(new location_js_1.default(e));
                if (e.getRoomId() === ((_b = _this.state.focus) === null || _b === void 0 ? void 0 : _b.getChild()))
                    _this.refreshFocus();
            }
            if (e.getRoomId() === ((_c = _this.state.room) === null || _c === void 0 ? void 0 : _c.roomId) && e.getType() === Matrix.EventType.SpaceChild) {
                _this.updateAnnotation(new location_js_1.default(e));
                if (e.getStateKey() === ((_d = _this.state.focus) === null || _d === void 0 ? void 0 : _d.getChild()))
                    _this.refreshFocus();
            }
        };
        _this.handleAccountData = function (e, room) {
            var _a;
            if (room.roomId === ((_a = _this.state.room) === null || _a === void 0 ? void 0 : _a.roomId) && _this.props.resourcePosition && e.getType() === constants_js_1.lastViewed) {
                var theContent_1 = e.getContent();
                var tryParse = parseInt(_this.props.resourcePosition, 10);
                if (Number.isInteger(tryParse) && theContent_1.position !== tryParse && theContent_1.deviceId !== client_js_1.default.deviceId) {
                    toast_js_1.default.set(<preact_1.Fragment>
            <h3 id="toast-header">Hey!</h3>
            <div>Another device is viewing a different position.</div>
            <div style="margin-top:10px">
              <button onclick={function (_) {
                            history_js_1.default.push("/".concat(encodeURIComponent(_this.props.resourceAlias), "/").concat(theContent_1.page, "/"));
                            toast_js_1.default.set(null);
                        }} class="styled-button">
                Jump to there →
              </button>
            </div>
          </preact_1.Fragment>);
                }
            }
        };
        _this.handleTouchStart = function (e) {
            _this.contentContainer.current.dataset.touches = e.touches.length;
            if (e.touches.length === 2) {
                // if two fingers are down, start a pinch
                _this.initialDistance = Math.sqrt(Math.pow((e.touches[0].clientX - e.touches[1].clientX), 2) + Math.pow((e.touches[0].clientY - e.touches[1].clientY), 2));
                _this.initialZoom = _this.state.zoomFactor;
            }
        };
        _this.handleTouchEnd = function (e) { return _this.contentContainer.current.dataset.touches = e.touches.length; };
        _this.handleTouchMove = function (e) {
            if (e.touches.length === 2) {
                // if two fingers are down, handle a pinch update
                var newDistance_1 = Math.sqrt(Math.pow((e.touches[0].clientX - e.touches[1].clientX), 2) + Math.pow((e.touches[0].clientY - e.touches[1].clientY), 2));
                _this.setZoom(function (_) { return _this.initialZoom * (newDistance_1 / _this.initialDistance); });
            }
        };
        _this.contentContainer = (0, preact_1.createRef)();
        _this.content = (0, preact_1.createRef)();
        _this.touchCache = [];
        _this.setNavHeight = function (px) { return _this.setState({ navHeight: px }); };
        _this.catchFetchResourceError = function (e) {
            toast_js_1.default.set(<preact_1.Fragment>
      <h3 id="toast-header">Couldn't fetch the resource...</h3>
      <div>Tried to fetch: </div>
      <pre>{_this.props.resourceAlias}</pre>
      <div>Here's the error message:</div>
      <pre>{e.message}</pre>
    </preact_1.Fragment>);
            history_js_1.default.push('/');
            _this.errorCondition = true;
        };
        _this.fetchResource = function (_) { return __awaiter(_this, void 0, void 0, function () {
            var aliasResponse, room_id, servers, room, resource, mimetype;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (res) { return _this.setState({ room: null,
                            mimetype: null,
                            contentWidthPx: null,
                            contentHeightPx: null,
                            zoomFactor: null,
                            resourceLength: null,
                            loadingStatus: "loading...",
                        }, res); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, client_js_1.default.client.getRoomIdForAlias("#".concat(this.props.resourceAlias)).catch(this.catchFetchResourceError)];
                    case 2:
                        aliasResponse = _a.sent();
                        if (this.errorCondition)
                            return [2 /*return*/];
                        room_id = aliasResponse.room_id, servers = aliasResponse.servers;
                        return [4 /*yield*/, client_js_1.default.client.joinRoom(room_id, { viaServers: servers }).catch(this.catchFetchResourceError)];
                    case 3:
                        _a.sent();
                        if (this.errorCondition)
                            return [2 /*return*/];
                        return [4 /*yield*/, client_js_1.default.client.getRoomWithState(room_id).catch(this.catchFetchResourceError)];
                    case 4:
                        room = _a.sent();
                        if (this.errorCondition)
                            return [2 /*return*/];
                        resource = new resource_js_1.default(room);
                        mimetype = resource.mimetype;
                        this.setState({ room: room, resource: resource, mimetype: mimetype }, function (_) {
                            _this.initializeAnnotations(); //careful, these need to be initialized before we can focus by roomId
                            if (_this.props.roomFocused)
                                _this.focusByRoomId(_this.props.roomFocused, _this.props.eventFocused);
                        });
                        return [2 /*return*/];
                }
            });
        }); };
        _this.startPindrop = function (_) {
            setTimeout(function (_) {
                _this.setState({ pindropMode: {} });
                document.addEventListener("click", _this.content.current.releasePin);
            }, 200);
        };
        _this.setContentDimensions = function (contentHeightPx, contentWidthPx) {
            var width = document.body.clientWidth;
            var height = document.body.clientHeight - _this.state.navHeight - 10;
            var heightratio = height / contentHeightPx;
            var widthratio = width / contentWidthPx;
            var zoomFactor = _this.state.zoomFactor || Math.max(Math.min(heightratio, widthratio, 5), 1);
            _this.setState({ contentHeightPx: contentHeightPx, contentWidthPx: contentWidthPx, zoomFactor: zoomFactor });
        };
        _this.setSearchText = function (searchText) { _this.searchText = searchText; };
        // XXX : may need to debounce eventually
        _this.setAnnotationFilter = function (annotationFilter) {
            var mergedLocations = Object.assign({}, _this.annotationParentEvents, _this.annotationChildEvents);
            _this.setState({
                annotationFilter: annotationFilter,
                filteredAnnotationContents: _this.filterAnnotations(annotationFilter, mergedLocations)
            });
        };
        _this.setResourceLength = function (resourceLength) { return _this.setState({ resourceLength: resourceLength }); };
        _this.setLoadingStatus = function (loadingStatus) { return _this.setState({ loadingStatus: loadingStatus }); };
        _this.setSearch = function (searchString) { return _this.setState({ searchString: searchString }); };
        _this.showSearch = function (_) {
            _this.setState({ listingType: "search" });
            _this.showListing();
        };
        _this.endSearch = function (_) { return _this.setState({ listingType: null }); };
        _this.toggleAnnotations = function (_) { return _this.setState(function (oldState) {
            return { annotationsVisible: !oldState.annotationsVisible };
        }); };
        _this.setMobileButtonColor = function (mobileButtonColor) { return _this.setState({ mobileButtonColor: mobileButtonColor }); };
        _this.setZoom = function (zoomFunction) {
            var zoomFactor = zoomFunction(_this.state.zoomFactor);
            if (zoomFactor < _this.content.current.zoomMin)
                _this.setState({ zoomFactor: _this.content.current.zoomMin });
            else {
                zoomFactor = Math.min(zoomFactor, _this.content.current.zoomMax);
                var unscaledInternalOffsetX = (_this.contentContainer.current.clientWidth / 2);
                var scaledInternalOffsetX = ((_this.contentContainer.current.clientWidth / 2) / _this.state.zoomFactor) * zoomFactor;
                var scaledLeft = (_this.contentContainer.current.scrollLeft / _this.state.zoomFactor) * zoomFactor;
                var unscaledInternalOffsetY = (_this.contentContainer.current.clientHeight / 2);
                var scaledInternalOffsetY = ((_this.contentContainer.current.clientHeight / 2) / _this.state.zoomFactor) * zoomFactor;
                var scaledTop = (_this.contentContainer.current.scrollTop / _this.state.zoomFactor) * zoomFactor;
                var newX = scaledLeft + scaledInternalOffsetX - unscaledInternalOffsetX;
                var newY = scaledTop + scaledInternalOffsetY - unscaledInternalOffsetY;
                _this.contentContainer.current.scrollTo(newX, newY);
                _this.setState({ zoomFactor: zoomFactor });
            }
        };
        _this.focusByRoomId = function (roomId, eventId) {
            var mergedLocations = Object.assign({}, _this.annotationParentEvents, _this.annotationChildEvents);
            if (mergedLocations[roomId]) {
                var focus_1 = mergedLocations[roomId];
                history_js_1.default.push("/".concat(encodeURIComponent(_this.props.resourceAlias), "/").concat(focus_1.getResourcePosition(), "/").concat(roomId).concat(eventId ? "/" + eventId : ""));
                var listingVisible = document.body.offsetWidth <= 600 ? false : _this.state.listingVisible;
                _this.setState({ focus: focus_1, secondaryFocus: null, chatVisible: true, listingVisible: listingVisible });
            }
        };
        _this.focusNextInArray = function (array) {
            var reachedFocus = !_this.state.focus;
            if (!array)
                return;
            for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
                var annot = array_1[_i];
                var theId = annot.getChild();
                if (reachedFocus) {
                    _this.focusByRoomId(theId);
                    return;
                }
                reachedFocus = _this.state.focus.getChild() === theId;
            }
            _this.focusByRoomId(array[0].getChild());
        };
        _this.focusNext = function (_) {
            _this.focusNextInArray(_this.state.filteredAnnotationContents);
        };
        _this.focusPrev = function (_) {
            var clone = __spreadArray([], _this.state.filteredAnnotationContents, true);
            _this.focusNextInArray(clone.reverse());
        };
        _this.hideChat = function (_) { return _this.setState({ chatVisible: false }); };
        _this.showChat = function (_) {
            var narrow = document.body.offsetWidth <= 768;
            if (narrow)
                _this.setState({ listingVisible: false, chatVisible: true });
            else
                _this.setState({ chatVisible: true });
        };
        _this.toggleChat = function (_) { return _this.setState(function (oldState) {
            if (oldState.chatVisible)
                _this.hideChat();
            else
                _this.showChat();
        }); };
        _this.setPindropMode = function (mode) { return _this.setState({ pindropMode: mode }); };
        _this.hideListing = function (_) { return _this.setState({ listingVisible: false }); };
        _this.showListing = function (_) {
            var narrow = document.body.offsetWidth <= 768;
            if (narrow)
                _this.setState({ listingVisible: true, chatVisible: false });
            else
                _this.setState({ listingVisible: true });
        };
        _this.toggleListing = function (_) { return _this.setState(function (oldState) {
            if (oldState.listingVisible)
                _this.hideListing();
            else
                _this.showListing();
        }); };
        _this.openSidebar = function (_) { return _this.setState(function (_) {
            if (_this.focus)
                return { chatVisible: true };
            return { listingVisible: true };
        }); };
        _this.checkForSelection = function (_) {
            var _a;
            var hasSelection = !!((_a = _this.content.current) === null || _a === void 0 ? void 0 : _a.hasSelection());
            if (_this.state.hasSelection !== hasSelection)
                _this.setState({ hasSelection: hasSelection });
        };
        _this.handleKeydown = function (e) {
            if (e.altKey && e.key === 'a')
                _this.openAnnotation();
            if (e.altKey && e.key === 'r')
                _this.closeAnnotation();
            if (e.altKey && e.key === 'v')
                _this.toggleAnnotations();
            if (_this.state.mimetype === "application/pdf" && e.altKey && e.key === "/")
                _this.showSearch();
            if (e.ctrlKey || e.altKey || e.metaKey)
                return; // Don't catch browser shortcuts
            if (e.key === '+' || e.key === '=')
                _this.setZoom(function (zoomFactor) { return zoomFactor + 0.1; });
            if (e.key === '-')
                _this.setZoom(function (zoomFactor) { return zoomFactor - 0.1; });
            if (e.key === "Esc" || e.key === "Escape")
                history_js_1.default.push("/");
        };
        _this.openAnnotation = function (_) {
            var _a, _b;
            _this.setState({ annotationsVisible: true });
            if (_this.state.mimetype === "application/pdf") {
                if ((_a = _this.state.pindropMode) === null || _a === void 0 ? void 0 : _a.x)
                    _this.content.current.commitPin(_this.state.pindropMode.x, _this.state.pindropMode.y, _this.state.pindropMode.page);
                else
                    _this.content.current.commitHighlight();
            }
            else if ((_b = _this.state.mimetype) === null || _b === void 0 ? void 0 : _b.match(/^audio|^video|^image/)) {
                _this.content.current.commitRegion();
            }
        };
        _this.closeAnnotation = function (_) {
            var isCreator = client_js_1.default.client.getUserId() === _this.state.focus.getCreator();
            var isMod = _this.state.room.getMember(client_js_1.default.client.getUserId()).powerLevel >= 50;
            if (!confirm('Are you sure you want to close this annotation?'))
                return;
            if (!isCreator && !isMod) {
                alert("Only moderators can close annotations that they didn't create");
                return;
            }
            var discussionId = _this.state.focus.getChild();
            var resourceId = _this.state.room.roomId;
            client_js_1.default.client.sendStateEvent(resourceId, Matrix.EventType.SpaceChild, {}, discussionId);
            client_js_1.default.client.sendStateEvent(discussionId, Matrix.EventType.SpaceParent, {}, resourceId)
                .catch(function (e) {
                switch (e) {
                    case "M_FORBIDDEN": {
                        toast_js_1.default.set(<preact_1.Fragment>
              <div>Annotation still visible to creator</div>
              <div style="margin-top:10px">
                Because you're not a moderator for that annotation you just
                removed, it has been detatched but not deleted: it will remain
                visible to its creator and members, although it won't be
                visible to other viewers of this resource.
              </div>
            </preact_1.Fragment>);
                        break;
                    }
                    default: console.log(e);
                }
            });
            _this.unsetFocus();
        };
        _this.unsetFocus = function (opts) {
            // XXX breaking this up into two updates makes the animation work properly.
            // If you replace the element AND unset chat visibility in one update, then
            // the annotation panel jumps to the left
            _this.setState({ secondaryFocus: null, focus: null }, function (_) { return _this.setState({ chatVisible: false }); });
            if (opts === null || opts === void 0 ? void 0 : opts.replace)
                history_js_1.default.replace("/".concat(encodeURIComponent(_this.props.resourceAlias), "/").concat(_this.props.resourcePosition, "/"));
            else
                history_js_1.default.push("/".concat(encodeURIComponent(_this.props.resourceAlias), "/").concat(_this.props.resourcePosition));
        };
        _this.setFocus = function (focus, opts) {
            if (opts === null || opts === void 0 ? void 0 : opts.replace)
                history_js_1.default.replace("/".concat(encodeURIComponent(_this.props.resourceAlias), "/").concat((opts === null || opts === void 0 ? void 0 : opts.holdPosition) ? _this.props.resourcePosition : focus.getResourcePosition(), "/").concat(focus.getChild(), "/"));
            else
                history_js_1.default.push("/".concat(encodeURIComponent(_this.props.resourceAlias), "/").concat((opts === null || opts === void 0 ? void 0 : opts.holdPosition) ? _this.props.resourcePosition : focus.getResourcePosition(), "/").concat(focus.getChild()));
            _this.setState({ secondaryFocus: null, focus: focus, chatVisible: true });
        };
        _this.refreshFocus = function (_) {
            if (!_this.state.room)
                return;
            if (!_this.props.roomFocused)
                _this.unsetFocus({ replace: true });
            else {
                var mergedLocations = Object.assign({}, _this.annotationParentEvents, _this.annotationChildEvents);
                var theAnnotation = mergedLocations[_this.props.roomFocused];
                if (theAnnotation)
                    _this.setFocus(theAnnotation, { replace: true, holdPosition: true });
            }
        };
        _this.setSecondaryFocus = function (secondaryFocus) { return _this.setState({ secondaryFocus: secondaryFocus }); };
        _this.updateAnnotation = function (loc) {
            var eventStore;
            if (loc.getOrientation() === "child")
                eventStore = _this.annotationChildEvents;
            else if (loc.getOrientation() === "parent")
                eventStore = _this.annotationParentEvents;
            _this.setState(function (oldState) {
                var filteredLoc = _this.filterAnnotations(oldState.annotationFilter, { null: loc });
                var isInsertable = _this.insertable(loc);
                if (isInsertable)
                    eventStore[loc.getChild()] = loc;
                else
                    delete eventStore[loc.getChild()];
                var filteredAnnotationContents = __spreadArray([], oldState.filteredAnnotationContents, true);
                if (filteredLoc.length > 0 && isInsertable) { // if it passes the filter
                    // check if it's already there, and either replace (where appropriate) or insert it
                    var idx = filteredAnnotationContents.findIndex(function (annot) { return annot.getChild() === loc.getChild(); });
                    if (idx > -1) {
                        // we don't replace children with parents - children are higher priority
                        if (filteredAnnotationContents[idx].getOrientation() === "parent")
                            filteredAnnotationContents[idx] = loc;
                        if (loc.getOrientation() === "child")
                            filteredAnnotationContents[idx] = loc;
                    }
                    else
                        filteredAnnotationContents.push(filteredLoc[0]);
                }
                else { // if it doesn't pass, check if it's already there
                    var idx = filteredAnnotationContents.findIndex(function (annot) { return annot.getChild() === loc.getChild(); });
                    if (idx > -1 && filteredAnnotationContents[idx].getOrientation() === loc.getOrientation()) {
                        // if it is there, replace with an appropriate fallback, or just remove it,
                        switch (loc.getOrientation()) {
                            case "child": {
                                // If there's a fallback parent available, use that
                                var maybeParent = _this.annotationParentEvents[loc.getChild()];
                                if (maybeParent)
                                    filteredAnnotationContents[idx] = maybeParent;
                                else
                                    filteredAnnotationContents = filteredAnnotationContents.filter(function (annot) { return annot.getChild() !== loc.getChild(); });
                                break;
                            }
                            case "parent": {
                                // If there's a fallback child available, use that
                                var maybeChild = _this.annotationChildEvents[loc.getChild()];
                                if (maybeChild)
                                    filteredAnnotationContents[idx] = maybeChild;
                                else
                                    filteredAnnotationContents = filteredAnnotationContents.filter(function (annot) { return annot.getChild() !== loc.getChild(); });
                                break;
                            }
                        }
                    }
                }
                return { filteredAnnotationContents: filteredAnnotationContents };
            });
        };
        _this.initializeAnnotations = function (_) {
            if (_this.state.room) {
                _this.annotationParentEvents = {};
                _this.annotationChildEvents = {};
                var allParents = client_js_1.default.client.getVisibleRooms()
                    .map(function (room) { return room.getLiveTimeline(); })
                    .map(function (timeline) { return timeline.getState(Matrix.EventTimeline.FORWARDS).getStateEvents(Matrix.EventType.SpaceParent); });
                for (var _i = 0, _a = [].concat.apply([], allParents); _i < _a.length; _i++) {
                    var parent_1 = _a[_i];
                    if (parent_1.getStateKey() === _this.state.room.roomId) {
                        if (parent_1.getTs() < 1648936377334)
                            continue; // don't load old parents, for legacy compatibility
                        var loc = new location_js_1.default(parent_1);
                        if (_this.insertable(loc))
                            _this.annotationParentEvents[loc.getChild()] = loc;
                    }
                }
                var locations = _this.state.room.getLiveTimeline()
                    .getState(Matrix.EventTimeline.FORWARDS).getStateEvents(Matrix.EventType.SpaceChild)
                    .map(function (ev) { return new location_js_1.default(ev); })
                    .filter(_this.insertable);
                for (var _b = 0, locations_1 = locations; _b < locations_1.length; _b++) {
                    var loc = locations_1[_b];
                    _this.annotationChildEvents[loc.getChild()] = loc;
                }
                var mergedLocations = Object.assign({}, _this.annotationParentEvents, _this.annotationChildEvents);
                _this.setState({ filteredAnnotationContents: _this.filterAnnotations(_this.state.annotationFilter, mergedLocations) });
            }
            else
                setTimeout(_this.initializeAnnotations, 500); // keep polling until the room is available
        };
        _this.filterAnnotations = function (search, annotations) {
            var locations = Object.values(annotations);
            var searchText = [];
            var searchMembers = [];
            var searchFlags = [];
            var searchWords = search.split(" ");
            for (var _i = 0, searchWords_1 = searchWords; _i < searchWords_1.length; _i++) {
                var word = searchWords_1[_i];
                if (word.slice(0, 1) === '@')
                    searchMembers.push(word.slice(1));
                else if (word.slice(0, 1) === '~')
                    searchFlags.push(word.slice(1));
                else
                    searchText.push(word);
            }
            return locations.filter(function (loc) {
                var flagged = true;
                if (searchFlags.includes("me")) {
                    flagged = flagged && loc.getCreator() === client_js_1.default.client.getUserId();
                }
                if (searchFlags.includes("hour")) {
                    flagged = flagged && (loc.event.getTs() > (Date.now() - 3600000));
                }
                if (searchFlags.includes("day")) {
                    flagged = flagged && (loc.event.getTs() > (Date.now() - 86400000));
                }
                if (searchFlags.includes("week")) {
                    flagged = flagged && (loc.event.getTs() > (Date.now() - 604800000));
                }
                if (searchFlags.includes("question")) {
                    flagged = flagged && loc.isQuestion();
                }
                if (searchFlags.includes("unread")) {
                    flagged = flagged && loc.getUnread();
                }
                var membered = searchMembers.length
                    ? searchMembers.some(function (member) { return loc.getCreator().toLowerCase().includes(member.toLowerCase()); })
                    : true;
                return membered && flagged && searchText.every(function (term) {
                    var _a, _b;
                    return (!loc.getText() && !loc.getRootContent()) ||
                        ((_a = loc.getText()) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(term.toLowerCase())) ||
                        ((_b = loc.getRootContent()) === null || _b === void 0 ? void 0 : _b.body.toLowerCase().includes(term.toLowerCase()));
                });
            });
        };
        var maybeState = history_js_1.default.history.location.state;
        _this.state = {
            focus: null,
            secondaryFocus: null, // for temporarily focusing an extra location
            resourceLength: null,
            navHeight: 75,
            chatVisible: false,
            listingType: null,
            listingVisible: maybeState ? !!maybeState.searchString : false,
            hasSelection: false,
            annotationsVisible: true,
            filteredAnnotationContents: [],
            pindropMode: null,
            annotationFilter: maybeState ? maybeState.searchString : "",
            searchString: "",
            loadingStatus: "loading...",
            contentWidthPx: null,
            contentHeightPx: null,
            zoomFactor: null,
        };
        _this.annotationChildEvents = {};
        _this.annotationParentEvents = {};
        _this.prevScrollTop = 0;
        _this.userColor = new colors_js_1.UserColor(client_js_1.default.client.getUserId());
        return _this;
    }
    ContentView.prototype.componentDidMount = function () {
        document.addEventListener("selectionchange", this.checkForSelection);
        document.addEventListener('keydown', this.handleKeydown);
        client_js_1.default.client.on("RoomState.events", this.handleStateUpdate);
        client_js_1.default.client.on("Room.accountData", this.handleAccountData);
        this.fetchResource();
    };
    ContentView.prototype.componentWillUnmount = function () {
        document.removeEventListener("selectionchange", this.checkForSelection);
        document.removeEventListener('keydown', this.handleKeydown);
        client_js_1.default.client.off("RoomState.events", this.handleStateUpdate);
        client_js_1.default.client.off("Room.accountData", this.handleAccountData);
    };
    ContentView.prototype.componentDidUpdate = function (prevProps, prevState) {
        // on change of resource, fetch new resource
        if (prevProps.resourceAlias !== this.props.resourceAlias)
            this.fetchResource();
        // on change of focused room, refresh relevant UI
        if (prevProps.roomFocused !== this.props.roomFocused)
            this.refreshFocus();
    };
    ContentView.prototype.getLoadingStatus = function () {
        if (this.state.contentHeightPx)
            return null;
        if (typeof this.state.loadingStatus === "string") {
            return <div id="document-view-loading">{this.state.loadingStatus}</div>;
        }
        if (typeof this.state.loadingStatus === "number") {
            return <div id="document-view-loading">
          <span>Downloading...</span>
          <progress class="styled-progress" max="1" value={this.state.loadingStatus}/>
        </div>;
        }
    };
    ContentView.prototype.insertable = function (loc) {
        return loc.isValid() &&
            // we infer that you are a member if you have unread. TODO Should do this more directly.
            (!loc.isPrivate() || loc.getUnread() !== "All") &&
            (loc.getStatus() !== "pending" ||
                (loc.getStatus() === "pending" && loc.getCreator() === client_js_1.default.client.getUserId()));
    };
    ContentView.prototype.getContentComponent = function () {
        var _a, _b;
        if (this.state.mimetype === "application/pdf") {
            var page = pdfContent_js_1.default.positionToPage(this.props.resourcePosition, this.state.room);
            if (this.props.resourcePosition != page) { //important to allow type coercion via `=!` here.
                history_js_1.default.replace("/".concat(encodeURIComponent(this.props.resourceAlias)) +
                    "/".concat(page) +
                    "".concat(this.props.roomFocused ? "/" + this.props.roomFocused : "") +
                    "".concat(this.props.eventFocused ? "/" + this.props.eventFocused : ""));
            }
            // TODO: Could DRY props here if the names were more uniform
            return <pdfContent_js_1.default filteredAnnotationContents={this.state.filteredAnnotationContents} ref={this.content} focus={this.state.focus} pageFocused={page} totalPages={this.state.resourceLength} key={this.props.resourceAlias} // tear this down when resource changes
             resourceAlias={this.props.resourceAlias} resourceLength={this.state.resourceLength} pindropMode={this.state.pindropMode} setPindropMode={this.setPindropMode} room={this.state.room} roomFocused={this.props.roomFocused} eventFocused={this.props.eventFocused} searchString={this.state.searchString} secondaryFocus={this.state.secondaryFocus} setFocus={this.setFocus} contentContainer={this.contentContainer} setContentDimensions={this.setContentDimensions} setPdfLoadingStatus={this.setLoadingStatus} setPdfText={this.setSearchText} setTotalPages={this.setResourceLength} showChat={this.showChat} zoomFactor={this.state.zoomFactor}/>;
        }
        else if ((_a = this.state.mimetype) === null || _a === void 0 ? void 0 : _a.match(/^audio|^video/)) {
            var timestamp = mediaContent_js_1.default.positionToTimestamp(this.props.resourcePosition, this.state.room);
            if (this.props.resourcePosition != timestamp) { //important to allow type coercion via `=!` here.
                history_js_1.default.replace("/".concat(encodeURIComponent(this.props.resourceAlias)) +
                    "/".concat(timestamp) +
                    "".concat(this.props.roomFocused ? "/" + this.props.roomFocused : "") +
                    "".concat(this.props.eventFocused ? "/" + this.props.eventFocused : ""));
            }
            return <mediaContent_js_1.default filteredAnnotationContents={this.state.filteredAnnotationContents} ref={this.content} key={this.props.resourceAlias} // tear this down when resource changes
             resourceAlias={this.props.resourceAlias} resource={this.state.resource} timeStamp={timestamp} room={this.state.room} roomFocused={this.props.roomFocused} eventFocused={this.props.eventFocused} secondaryFocus={this.state.secondaryFocus} mimetype={this.state.mimetype} setFocus={this.setFocus} setMobileButtonColor={this.setMobileButtonColor} unsetFocus={this.unsetFocus} focus={this.state.focus} showChat={this.showChat} setMediaDuration={this.setResourceLength} setContentDimensions={this.setContentDimensions} setMediaLoadingStatus={this.setLoadingStatus}/>;
        }
        else if ((_b = this.state.mimetype) === null || _b === void 0 ? void 0 : _b.match(/^image/)) {
            return <imageContent_js_1.default filteredAnnotationContents={this.state.filteredAnnotationContents} ref={this.content} key={this.props.resourceAlias} // tear this down when resource changes
             resourceAlias={this.props.resourceAlias} resource={this.state.resource} room={this.state.room} roomFocused={this.props.roomFocused} eventFocused={this.props.eventFocused} secondaryFocus={this.state.secondaryFocus} mimetype={this.state.mimetype} setFocus={this.setFocus} setMobileButtonColor={this.setMobileButtonColor} unsetFocus={this.unsetFocus} focus={this.state.focus} showChat={this.showChat} setContentDimensions={this.setContentDimensions} contentContainer={this.contentContainer} contentHeightPx={this.state.contentHeightPx} contentWidthPx={this.state.contentWidthPx} setImageLoadingStatus={this.setLoadingStatus} zoomFactor={this.state.zoomFactor} setZoom={this.setZoom}/>;
        }
        else
            return null;
    };
    ContentView.prototype.getNavComponent = function () {
        var _a, _b;
        if (this.state.mimetype === "application/pdf") {
            var page = pdfContent_js_1.default.positionToPage(this.props.resourcePosition, this.state.room);
            return <documentNavbar_js_1.default hasSelection={this.state.hasSelection} annotationsVisible={this.state.annotationsVisible} openAnnotation={this.openAnnotation} closeAnnotation={this.closeAnnotation} hasAnnotations={this.state.filteredAnnotationContents.length > 0} pageFocused={page} resourceAlias={this.props.resourceAlias} total={this.state.resourceLength} focus={this.state.focus} roomFocused={this.props.roomFocused} eventFocused={this.props.eventFocused} focusNext={this.focusNext} focusPrev={this.focusPrev} room={this.state.room} content={this.content} contentContainer={this.contentContainer} contentWidthPx={this.state.contentWidthPx} toggleAnnotations={this.toggleAnnotations} setNavHeight={this.setNavHeight} showSearch={this.showSearch} startPindrop={this.startPindrop} pindropMode={this.state.pindropMode} setZoom={this.setZoom}/>;
        }
        else if ((_a = this.state.mimetype) === null || _a === void 0 ? void 0 : _a.match(/^audio|^video/)) {
            var timestamp = mediaContent_js_1.default.positionToTimestamp(this.props.resourcePosition, this.state.room);
            return <mediaNavbar_js_1.default hasSelection={this.state.hasSelection} annotationsVisible={this.state.annotationsVisible} openAnnotation={this.openAnnotation} closeAnnotation={this.closeAnnotation} hasAnnotations={this.state.filteredAnnotationContents.length > 0} timeStamp={timestamp} resourceAlias={this.props.resourceAlias} total={this.state.resourceLength} focus={this.state.focus} eventFocused={this.props.eventFocused} focusNext={this.focusNext} focusPrev={this.focusPrev} room={this.state.room} roomFocused={this.props.roomFocused} content={this.content} contentContainer={this.contentContainer} contentWidthPx={this.state.contentWidthPx} toggleAnnotations={this.toggleAnnotations} setNavHeight={this.setNavHeight}/>;
        }
        else if ((_b = this.state.mimetype) === null || _b === void 0 ? void 0 : _b.match(/^image/)) {
            return <imageNavbar_js_1.default hasSelection={this.state.hasSelection} annotationsVisible={this.state.annotationsVisible} openAnnotation={this.openAnnotation} closeAnnotation={this.closeAnnotation} hasAnnotations={this.state.filteredAnnotationContents.length > 0} resourceAlias={this.props.resourceAlias} total={this.state.resourceLength} focus={this.state.focus} eventFocused={this.props.eventFocused} focusNext={this.focusNext} focusPrev={this.focusPrev} room={this.state.room} roomFocused={this.props.roomFocused} content={this.content} contentContainer={this.contentContainer} contentWidthPx={this.state.contentWidthPx} toggleAnnotations={this.toggleAnnotations} setNavHeight={this.setNavHeight} setZoom={this.setZoom}/>;
        }
        else
            return null;
    };
    ContentView.prototype.render = function (props, state) {
        var _a, _b, _c, _d;
        var dynamicDocumentStyle = {
            "--zoomFactor": state.zoomFactor,
            "--navHeight": "".concat(state.navHeight, "px"),
            "--contentWidthPx": "".concat(state.contentWidthPx, "px"),
            "--contentHeightPx": "".concat(state.contentHeightPx, "px"),
            "--chatVisible": state.chatVisible ? 1 : 0,
            "--listingVisible": state.listingVisible ? 1 : 0,
            "--chatFocused": state.focus ? 1 : 0,
            "--selectColor": this.userColor.solid,
            "--mobileButtonColor": state.mobileButtonColor,
        };
        return <div style={dynamicDocumentStyle} id="content-container" ref={this.contentContainer} onTouchStart={this.handleTouchStart} onTouchEnd={this.handleTouchEnd} onTouchMove={this.handleTouchMove} onTouchCancel={this.handleTouchEnd} data-annotations-hidden={!state.annotationsVisible} data-pindrop-mode={state.pindropMode
                ? (((_a = state.pindropMode) === null || _a === void 0 ? void 0 : _a.x) && "placed") || "unplaced"
                : false} onPointerMove={this.handlePointerMove}>
      <mediaModal_js_1.default />
      {this.getLoadingStatus()}
      {this.getContentComponent()}
      <div id="sidepanel">
        <PanelHandle visible={state.chatVisible} id="panel-handle-1" offsetVar="--dragOffset-1" contentContainer={this.contentContainer}/>
        {state.focus
                ? <chat_js_1.default class="panel-widget-1" setSecondaryFocus={this.setSecondaryFocus} unsetFocus={this.unsetFocus} resource={state.resource} resourceAlias={props.resourceAlias} eventFocused={props.eventFocused} hasSelection={state.hasSelection} generateLocation={this.content.current.generateLocation} secondaryFocus={state.secondaryFocus} focus={state.focus}/>
                : <div class="panel-widget-1"/>}
        <PanelHandle visible={state.listingVisible} id="panel-handle-2" offsetVar="--dragOffset-2" contentContainer={this.contentContainer}/>
        {state.listingType === "search"
                ? <searchResults_js_1.default class="panel-widget-2" searchString={state.searchString} setSearch={this.setSearch} endSearch={this.endSearch} hideListing={this.hideListing} pdfText={this.searchText} resourceAlias={props.resourceAlias} roomFocused={props.roomFocused}/>
                : <annotationListing_js_1.default roomId={(_b = state.room) === null || _b === void 0 ? void 0 : _b.roomId} class="panel-widget-2" focus={state.focus} mimetype={state.mimetype} setAnnotationFilter={this.setAnnotationFilter} annotationFilter={state.annotationFilter} annotationContents={Object.assign({}, this.annotationParentEvents, this.annotationChildEvents)} filteredAnnotationContents={state.filteredAnnotationContents} focusByRoomId={this.focusByRoomId} focusNext={this.focusNext} focusPrev={this.focusPrev} resource={this.state.resource} room={state.room}/>}
        <div class="panel-widget-controls">
          {state.room ? <roomIcon_js_1.default roomId={state.room.roomId} size={42} topic={(_d = (_c = state.room.getLiveTimeline().getState(Matrix.EventTimeline.FORWARDS)
                    .getStateEvents(Matrix.EventType.RoomTopic, "")) === null || _c === void 0 ? void 0 : _c.getContent()) === null || _d === void 0 ? void 0 : _d.topic} name={state.room.name} avatarUrl={state.room.getMxcAvatarUrl()}/> : null}
          <hr />
          <tooltip_js_1.default placement="left" content="Show chat">
            <button data-active={state.chatVisible} disabled={!state.focus} id="show-chat" onclick={this.toggleChat}>
              {Icons.annotation}
            </button>
          </tooltip_js_1.default>
          <tooltip_js_1.default placement="left" content="Show annotation list">
            <button data-active={state.listingVisible} id="show-annotations" onclick={this.toggleListing}>
              {Icons.list}
            </button>
          </tooltip_js_1.default>
        </div>
      </div>
      {this.getNavComponent()}
      <div id="content-mobile-buttons">
        <button title="open options" id="panel-toggle" onclick={this.openSidebar}>
          {state.chatVisible || state.listingVisible ? null : Icons.menu}
        </button>
      </div>
      <syncIndicator_js_1.default />
    </div>;
    };
    return ContentView;
}(preact_1.Component));
exports.default = ContentView;
var PanelHandle = /** @class */ (function (_super) {
    __extends(PanelHandle, _super);
    function PanelHandle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.dragOffset = 0;
        _this.handlePointerMove = function (e) {
            if (e.clientX < 20 || _this.startingClientX - e.clientX < 0)
                return;
            _this.dragOffset = _this.startingClientX - e.clientX;
            _this.props.contentContainer.current.style.setProperty(_this.props.offsetVar, "".concat(_this.dragOffset, "px"));
        };
        _this.startDrag = function (e) {
            _this.props.contentContainer.current.style.setProperty('--transitionSizing', "unset");
            _this.props.contentContainer.current.setPointerCapture(e.pointerId);
            _this.startingClientX = e.clientX + _this.dragOffset;
            _this.props.contentContainer.current.addEventListener('pointermove', _this.handlePointerMove);
            _this.props.contentContainer.current.addEventListener('pointerup', function (_) {
                _this.props.contentContainer.current.style.removeProperty('--transitionSizing');
                _this.props.contentContainer.current.releasePointerCapture(e.pointerId);
                _this.props.contentContainer.current.removeEventListener('pointermove', _this.handlePointerMove);
            });
        };
        return _this;
    }
    PanelHandle.prototype.render = function (props) {
        if (props.visible)
            return <div id={props.id} onpointerdown={this.startDrag} class="panel-handle"><div>{Icons.handleVertical}</div></div>;
    };
    return PanelHandle;
}(preact_1.Component));

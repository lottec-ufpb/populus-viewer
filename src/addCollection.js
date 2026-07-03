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
var client_js_1 = require("./client.js");
var Matrix = require("matrix-js-sdk");
var Icons = require("./icons.js");
var resource_js_1 = require("./utils/resource.js");
var modal_js_1 = require("./modal.js");
require("./styles/addCollection.css");
var AddCollection = /** @class */ (function (_super) {
    __extends(AddCollection, _super);
    function AddCollection(props) {
        var _this = _super.call(this, props) || this;
        _this.handleRoom = function (_) {
            clearTimeout(_this.roomDebounceTimeout);
            _this.roomDebounceTimeout = setTimeout(function (_) {
                var archived = client_js_1.default.client.getVisibleRooms()
                    .filter(function (room) { return room.getMyMembership() === "join"; })
                    .filter(_this.isArchived);
                _this.setState({
                    creating: _this.state.creating || archived.length === 0,
                    archived: archived
                });
            });
        };
        _this.currentListWrapper = (0, preact_1.createRef)();
        _this.updateHeight = function (_) { return _this.currentListWrapper.current.style.height = "".concat(_this.currentList.current.scrollHeight, "px"); };
        _this.createCollection = function (_) { return _this.setState({ creating: true }); };
        _this.unarchiveCollection = function (_) { return _this.setState({ creating: false }); };
        _this.state = {
            creating: true,
            archived: client_js_1.default.client.getVisibleRooms()
                .filter(function (room) { return room.getMyMembership() === "join"; })
                .filter(_this.isArchived)
        };
        return _this;
    }
    AddCollection.prototype.componentDidMount = function () {
        client_js_1.default.client.on("Room.accountData", this.handleRoom);
    };
    AddCollection.prototype.componentWillUnmount = function () {
        client_js_1.default.client.off("Room.accountData", this.handleRoom);
    };
    AddCollection.prototype.isArchived = function (room) {
        var _a;
        var roomState = room.getLiveTimeline().getState(Matrix.EventTimeline.FORWARDS);
        var creation = roomState.getStateEvents("m.room.create", "");
        var isSpace = ((_a = creation === null || creation === void 0 ? void 0 : creation.getContent()) === null || _a === void 0 ? void 0 : _a.type) === "m.space";
        var isArchived = room.tags["m.lowpriority"];
        return isSpace && isArchived && !resource_js_1.default.hasResource(room);
    };
    AddCollection.prototype.render = function (props, state) {
        return <>
      <div id="add-collection-select-view" class="select-view">
        <button onClick={this.createCollection} data-current-button={state.creating}>Create Collection</button>
        <button onClick={this.unarchiveCollection} disabled={state.archived.length === 0} data-current-button={!state.creating}>Restore from Archive</button>
      </div>
      <div id="add-collection-list-wrapper" ref={this.currentListWrapper}>
        {state.creating
                ? <CreateCollection />
                : <div id="add-collection-unarchive-list" ref={this.currentList}>
            {state.archived.map(function (room) { return <UnarchiveCollection room={room}/>; })}
          </div>}
      </div>
    </>;
    };
    return AddCollection;
}(preact_1.Component));
exports.default = AddCollection;
var CreateCollection = /** @class */ (function (_super) {
    __extends(CreateCollection, _super);
    function CreateCollection(props) {
        var _this = _super.call(this, props) || this;
        _this.mainForm = (0, preact_1.createRef)();
        _this.collectionNameInput = (0, preact_1.createRef)();
        _this.collectionTopicInput = (0, preact_1.createRef)();
        // DRY duplication with pdfUpload
        _this.validateName = function (_) {
            clearTimeout(_this.namingTimeout);
            _this.setState({ querying: true });
            _this.namingTimeout = setTimeout(function (_) {
                client_js_1.default.client.getRoomIdForAlias("#".concat(_this.toAlias(_this.collectionNameInput.current.value), ":").concat(client_js_1.default.client.getDomain()))
                    .then(function (_) { return _this.setState({ querying: false, nameavailable: false }); })
                    .catch(function (err) {
                    if (_this.collectionNameInput.current.value === "")
                        _this.setState({ querying: false, nameavailable: false });
                    else if (err.errcode === "M_NOT_FOUND")
                        _this.setState({ querying: false, nameavailable: true });
                    else
                        alert(err);
                });
            }, 1000);
        };
        _this.handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
            var theName, theAlias, theTopic;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        e.preventDefault();
                        theName = this.collectionNameInput.current.value;
                        theAlias = this.toAlias(theName);
                        theTopic = this.collectionTopicInput.current.value;
                        return [4 /*yield*/, client_js_1.default.client.createRoom({
                                room_alias_name: theAlias,
                                visibility: "private",
                                name: theName,
                                topic: theTopic,
                                // We declare the room a space
                                creation_content: { type: "m.space" },
                                initial_state: [
                                    // we allow anyone to join, by default, for now
                                    {
                                        type: "m.room.join_rules",
                                        state_key: "",
                                        content: { join_rule: "public" }
                                    }
                                ]
                            }).catch(function (err) { alert(err); })];
                    case 1:
                        _a.sent();
                        modal_js_1.default.hide();
                        return [2 /*return*/];
                }
            });
        }); };
        _this.state = {
            querying: false,
            nameavailable: false
        };
        return _this;
    }
    CreateCollection.prototype.toAlias = function (s) {
        // replace forbidden characters
        return s.replace(/[\s:]/g, '_');
    };
    CreateCollection.prototype.render = function (_props, state) {
        return <preact_1.Fragment>
      <form ref={this.mainForm} onSubmit={this.handleSubmit} id="create-collection">
        <label for="name">Collection Name</label>
        <input name="name" class="styled-input" oninput={this.validateName} ref={this.collectionNameInput}/>
        <div class="name-validation-detail">{state.querying
                ? "querying..."
                : state.nameavailable
                    ? "name available"
                    : "name unavailable"}
        </div>
        <label for="topic">Collection Topic</label>
        <textarea name="topic" class="styled-input" ref={this.collectionTopicInput}/>
        <div id="create-collection-submit">
          <button disabled={state.querying || !state.nameavailable} class="styled-button" ref={this.submitButton} type="submit">
            Create Collection
          </button>
        </div>
      </form>
    </preact_1.Fragment>;
    };
    return CreateCollection;
}(preact_1.Component));
var UnarchiveCollection = /** @class */ (function (_super) {
    __extends(UnarchiveCollection, _super);
    function UnarchiveCollection() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.unarchive = function (_) {
            _this.setState({ pending: true });
            client_js_1.default.client.deleteRoomTag(_this.props.room.roomId, "m.lowpriority");
        };
        return _this;
    }
    UnarchiveCollection.prototype.render = function (props, state) {
        return <button class="unarchive-collection" data-change-pending={state.pending} onclick={this.unarchive}>
      <span class="small-icon">{Icons.archive}</span>
      <span>{props.room.name}</span>
    </button>;
    };
    return UnarchiveCollection;
}(preact_1.Component));

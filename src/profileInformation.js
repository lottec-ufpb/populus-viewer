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
require("./styles/profileInformation.css");
var alerts_js_1 = require("./utils/alerts.js");
var client_js_1 = require("./client.js");
var ProfileInfomation = /** @class */ (function (_super) {
    __extends(ProfileInfomation, _super);
    function ProfileInfomation(props) {
        var _this = _super.call(this, props) || this;
        _this.displayNameInput = (0, preact_1.createRef)();
        _this.avatarImageInput = (0, preact_1.createRef)();
        _this.scrollbarVisibleSelect = (0, preact_1.createRef)();
        _this.submitButton = (0, preact_1.createRef)();
        _this.mainForm = (0, preact_1.createRef)();
        _this.progressHandler = function (progress) { return _this.setState({ progress: progress }); };
        _this.chooseAvatar = function (_) { return _this.avatarImageInput.current.click(); };
        _this.removeAvatar = function (_) { return _this.setState({ previewUrl: null }); };
        _this.handleKeydown = function (e) {
            e.stopPropagation(); // don't go to global keypress handler
        };
        _this.updatePreview = function (_) {
            var theImage = _this.avatarImageInput.current.files[0];
            if (theImage && /^image/.test(theImage.type)) {
                _this.setState({ previewUrl: URL.createObjectURL(_this.avatarImageInput.current.files[0]) });
            }
        };
        _this.updateProfile = function (e) { return __awaiter(_this, void 0, void 0, function () {
            var theImage, theDisplayName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        e.preventDefault();
                        if (!(0, alerts_js_1.onlineOrAlert)())
                            return [2 /*return*/];
                        theImage = this.avatarImageInput.current.files[0];
                        theDisplayName = this.displayNameInput.current.value;
                        this.submitButton.current.setAttribute("disabled", true);
                        localStorage.setItem("scrollbars", this.scrollbarVisibleSelect.current.value);
                        document.documentElement.dataset.scrollbars = this.scrollbarVisibleSelect.current.value;
                        if (!theDisplayName) return [3 /*break*/, 2];
                        return [4 /*yield*/, client_js_1.default.client.setDisplayName(theDisplayName)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(theImage && /^image/.test(theImage.type))) return [3 /*break*/, 4];
                        return [4 /*yield*/, client_js_1.default.client.uploadContent(theImage, { progressHandler: this.progressHandler })
                                .then(function (e) { return client_js_1.default.client.setAvatarUrl(e); })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        if (!!this.state.previewUrl) return [3 /*break*/, 6];
                        return [4 /*yield*/, client_js_1.default.client.setAvatarUrl("null")
                            // XXX this is a pretty awful hack. Discussion at https://github.com/matrix-org/matrix-doc/issues/1674
                        ];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        this.mainForm.current.reset();
                        this.props.showMainView();
                        return [2 /*return*/];
                }
            });
        }); };
        var me = client_js_1.default.client.getUser(client_js_1.default.client.getUserId());
        _this.state = {
            previewUrl: client_js_1.default.client.getHttpUriForMxcFromHS(me.avatarUrl, 180, 180, "crop"),
            displayName: me.displayName
        };
        if (localStorage.getItem("scrollbars") === "visible")
            _this.scrollbarsVisible = true;
        return _this;
    }
    ProfileInfomation.prototype.render = function (props, state) {
        // We include some key attributes here, because the removal and
        // insertion of divs causes click events to get handled by the wrong
        // elements as they bubble up through the DOM otherwise
        return <div id="profile-information">
      <h2>Update Your Profile</h2>
      <hr class="styled-rule"/>
      <form id="profileInformationForm" ref={this.mainForm} onsubmit={this.updateProfile}>
        <label>My User Id</label>
        <div id="profile-information-userid">
          {client_js_1.default.client.getUserId()}
        </div>
        <label>My Display Name</label>
        <input class="styled-input" onkeydown={this.handleKeydown} placeholder={state.displayName} ref={this.displayNameInput} type="text"/>
        <label class="top-aligned-label">My Avatar</label>
        {state.previewUrl
                ? <img onclick={this.chooseAvatar} id="profileSelector" src={state.previewUrl}/>
                : <div key="profileSelector" onclick={this.chooseAvatar} id="profileSelector"/>}
        <input id="profileInformationFormHidden" onchange={this.updatePreview} ref={this.avatarImageInput} accept="image/*" type="file"/>
        <details>
          <summary>Display Options</summary>
          <div id="profile-display-options">
            <label for="scrollbar-visibility">Scrollbars</label>
            <select class="styled-input" ref={this.scrollbarVisibleSelect} name="scrollbar-visibility">
              <option value="hidden">Hidden</option>
              <option selected={this.scrollbarsVisible} value="visible">Visible</option>
            </select>
          </div>
        </details>
        <details>
          <summary>Advanced Options</summary>
          <div id="profile-advanced-options">
            <label>My Access Token</label>
            <pre>{client_js_1.default.client.getAccessToken()}</pre>
          </div>
        </details>
        <div key="profileInformationFormSubmit" id="profileInformationFormSubmit">
          <button class="styled-button" ref={this.submitButton} type="submit">Update Profile</button>
          {state.previewUrl ? <button class="styled-button" type="button" onclick={this.removeAvatar}>Remove Avatar</button> : null}
          <button class="styled-button" type="button" onclick={props.logoutHandler}>Logout</button>
        </div>
        {this.state.progress
                ? <div id="profileInformationFormProgress">
            <progress class="styled-progress" max={state.progress.total} value={state.progress.loaded}/>
          </div>
                : null}
      </form>
    </div>;
    };
    return ProfileInfomation;
}(preact_1.Component));
exports.default = ProfileInfomation;

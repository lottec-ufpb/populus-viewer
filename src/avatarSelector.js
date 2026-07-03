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
require("./styles/avatarSelector.css");
var media_js_1 = require("./utils/media.js");
var AvatarSelector = /** @class */ (function (_super) {
    __extends(AvatarSelector, _super);
    function AvatarSelector(props) {
        var _this = _super.call(this) || this;
        _this.avatarImageInput = (0, preact_1.createRef)();
        _this.chooseAvatar = function (_) { return _this.avatarImageInput.current.click(); };
        _this.removeAvatar = function (_) {
            var _a, _b;
            _this.setState({ previewUrl: null });
            delete _this.avatarImage;
            (_b = (_a = _this.props).handleUpdate) === null || _b === void 0 ? void 0 : _b.call(_a);
        };
        _this.updatePreview = function (_) {
            var _a, _b;
            _this.avatarImage = _this.avatarImageInput.current.files[0];
            if (_this.avatarImage && /^image/.test(_this.avatarImage.type)) {
                _this.setState({ previewUrl: URL.createObjectURL(_this.avatarImage) });
            }
            (_b = (_a = _this.props).handleUpdate) === null || _b === void 0 ? void 0 : _b.call(_a);
        };
        _this.state = {
            previewUrl: props.previewUrl || undefined
        };
        return _this;
    }
    AvatarSelector.prototype.uploadAvatar = function (room) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, width_1, height_1, blurhash_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        room = room || this.props.room;
                        if (!(this.avatarImage && /^image/.test(this.avatarImage.type))) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, media_js_1.loadImageElement)(this.avatarImage)];
                    case 1:
                        _a = _b.sent(), width_1 = _a.width, height_1 = _a.height;
                        this.setState({ progress: "generating blurhash..." });
                        return [4 /*yield*/, (0, media_js_1.blurhashFromFile)(this.avatarImage)];
                    case 2:
                        blurhash_1 = _b.sent();
                        return [4 /*yield*/, client_js_1.default.client.uploadContent(this.avatarImage, { progressHandler: this.props.progressHandler })
                                .then(function (e) { return client_js_1.default.client
                                .sendStateEvent(room.roomId, Matrix.EventType.RoomAvatar, {
                                info: {
                                    w: width_1,
                                    h: height_1,
                                    mimetype: _this.avatarImage.type ? _this.avatarImage.type : "application/octet-stream",
                                    size: _this.avatarImage.size,
                                    blurhash: blurhash_1
                                },
                                url: e
                            }, ""); })];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        if (!(this.state.previewUrl === null && this.props.room)) return [3 /*break*/, 6];
                        return [4 /*yield*/, client_js_1.default.client.sendStateEvent(this.props.room.roomId, Matrix.EventType.RoomAvatar, {}, "")];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    AvatarSelector.prototype.render = function (props, state) {
        return <div id="select-avatar-wrapper">
        {state.previewUrl
                ? <img onclick={this.chooseAvatar} id="select-avatar-selector" src={state.previewUrl}/>
                : <div key="select-avatar-selector" onclick={this.chooseAvatar} id="select-avatar-selector"/>}
        {state.previewUrl ? <button id="select-avatar-change-avatar" type="button" onclick={this.removeAvatar}>Remove Avatar</button> : null}
        {!state.previewUrl ? <button id="select-avatar-change-avatar" type="button" onclick={this.chooseAvatar}>Add Avatar</button> : null}
        <input id="select-avatar-selector-hidden" onchange={this.updatePreview} ref={this.avatarImageInput} accept="image/*" type="file"/>
      </div>;
    };
    return AvatarSelector;
}(preact_1.Component));
exports.default = AvatarSelector;

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
var queryParameters_js_1 = require("./utils/queryParameters.js");
require("./styles/splash.css");
var client_js_1 = require("./client.js");
var SplashView = /** @class */ (function (_super) {
    __extends(SplashView, _super);
    function SplashView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.pollInitialized = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (client_js_1.default.client && ["PREPARED", "SYNCING", "ERROR"].includes(client_js_1.default.client.getSyncState())) {
                    // in case of error, we still let the user into the app, for offline usage
                    this.props.setInitializationStage("initialized");
                    (0, queryParameters_js_1.handleLaunchParameters)(this.props.logoutHandler); // clear query parameters
                }
                else {
                    setTimeout(this.pollInitialized, 1000);
                }
                return [2 /*return*/];
            });
        }); };
        return _this;
    }
    SplashView.prototype.componentDidMount = function () { this.pollInitialized(); };
    SplashView.prototype.render = function (props) {
        return <div id="splash-wrapper">
      <PopulusLogo />
      <div id="splash-loader">{props.initializationStage}</div>
    </div>;
    };
    return SplashView;
}(preact_1.Component));
exports.default = SplashView;
function PopulusLogo() {
    return <svg id="splash-logo" width="31mm" height="31mm" version="1.1" viewBox="-4.5 -4.5 40 40" xmlns="http://www.w3.org/2000/svg">
   <g transform="translate(-15.196 -28.116)">
    <circle id="splash-logo-back" cx="30.696" cy="43.616" r="15" style="paint-order:stroke fill markers"/>
    <circle cx="30.696" cy="43.616" r="15" fill="#fff" stroke-linejoin="round" style="paint-order:stroke fill markers"/>
    <g stroke-width=".38504" aria-label="P">
     <path d="m27.477 32.835h4.066q1.9714 0 3.3883 0.70847t2.187 2.0638q0.77008 1.3245 0.77008 3.1727 0 1.4169-0.55445 2.5566-0.55445 1.1089-1.4785 1.879t-2.0946 1.1705q-1.1705 0.36964-2.4334 0.27723-1.2321-0.09241-2.4026-0.70847v-0.30803t0.52365 0.09241q0.52365 0.06161 1.3245 0.0308 0.83168-0.06161 1.725-0.33883 0.92409-0.30803 1.6942-1.0473 0.80088-0.73927 1.2013-2.0638 0.09241-0.33883 0.15402-0.83168 0.06161-0.52365 0.0308-1.0165-0.0308-2.1254-1.1089-3.4191-1.0781-1.2937-3.0495-1.2937h-3.6348t-0.09241-0.21562q-0.06161-0.24642-0.15402-0.46204-0.06161-0.24642-0.06161-0.24642zm0.40044 0v21.562h-2.0022v-21.562zm-1.9098 19.313v2.2486h-2.4642v-0.30803t0.18482 0q0.21562 0 0.21562 0 0.80088 0 1.3553-0.55445 0.58526-0.58526 0.61606-1.3861zm0-17.065h-0.09241q0-0.80088-0.58526-1.3553-0.58526-0.58526-1.3861-0.58526 0 0-0.18482 0t-0.18482 0l-0.0308-0.30803h2.4642zm1.8174 17.065h0.09241q0.0308 0.80088 0.58526 1.3861 0.58526 0.55445 1.3861 0.55445 0 0 0.18482 0 0.21562 0 0.21562 0v0.30803h-2.4642z"/>
    </g>
   </g>
  </svg>;
}

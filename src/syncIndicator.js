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
var client_js_1 = require("./client.js");
require("./styles/syncIndicator.css");
var SyncIndicator = /** @class */ (function (_super) {
    __extends(SyncIndicator, _super);
    function SyncIndicator(prop) {
        var _this = _super.call(this, prop) || this;
        _this.state = {
            syncStatus: _this.fromState(client_js_1.default.client.getSyncState())
        };
        _this.handleSync = _this.handleSync.bind(_this);
        return _this;
    }
    SyncIndicator.prototype.fromState = function (syncState) {
        // TODO Icons?
        switch (syncState) {
            case "PREPARED": return "loading data...";
            case "CATCHUP": return "loading data...";
            case "ERROR": return "no connection - working offline";
            default: return null;
        }
    };
    SyncIndicator.prototype.componentDidMount = function () {
        client_js_1.default.client.on("sync", this.handleSync);
    };
    SyncIndicator.prototype.componentWillUnmount = function () {
        client_js_1.default.client.off("sync", this.handleSync);
    };
    SyncIndicator.prototype.handleSync = function (syncState, prevSyncState) {
        if (prevSyncState === "PREPARED")
            client_js_1.default.client.emit("sync.initial");
        this.setState({ syncStatus: this.fromState(syncState) });
    };
    SyncIndicator.prototype.render = function (props, state) {
        return state.syncStatus
            ? <div class={props.class} id="sync-indicator">{state.syncStatus}</div>
            : null;
    };
    return SyncIndicator;
}(preact_1.Component));
exports.default = SyncIndicator;

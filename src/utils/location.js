"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_js_1 = require("../client.js");
var Matrix = require("matrix-js-sdk");
var constants_js_1 = require("../constants.js");
var Location = /** @class */ (function () {
    function Location(theEvent) {
        var _a;
        this.event = theEvent;
        this.location = this.event.getContent()[constants_js_1.mscLocation] ||
            ((_a = this.event.getContent()[constants_js_1.mscMarkupMsgKey]) === null || _a === void 0 ? void 0 : _a[constants_js_1.mscLocation]);
    }
    Location.prototype.isValid = function () {
        if (!this.location)
            return false;
        if (!this.getStatus())
            return false;
        if (!this.getCreator())
            return false;
        // if (!this.getType()) return false
        return true;
    };
    Location.prototype.getUnread = function () {
        var room = client_js_1.default.client.getRoom(this.getChild());
        if (room)
            return room.getUnreadNotificationCount();
        return "All";
    };
    Location.prototype.getVia = function () {
        return this.event.getContent().via;
    };
    Location.prototype.isQuestion = function () {
        var _a;
        if (((_a = this.location) === null || _a === void 0 ? void 0 : _a.motivation) === "questioning")
            return true;
        return false;
    };
    Location.prototype.getType = function () {
        var _a, _b, _c;
        if ((_a = this.location) === null || _a === void 0 ? void 0 : _a[constants_js_1.mscPdfHighlight])
            return "highlight";
        if ((_b = this.location) === null || _b === void 0 ? void 0 : _b[constants_js_1.mscPdfText])
            return "text";
        if ((_c = this.location) === null || _c === void 0 ? void 0 : _c[constants_js_1.mscMediaFragment])
            return "media-fragment";
        return null;
    };
    Location.prototype.getOrientation = function () {
        if (this.event.getType() === Matrix.EventType.SpaceParent)
            return "parent";
        if (this.event.getType() === Matrix.EventType.SpaceChild)
            return "child";
    };
    Location.prototype.getParent = function () {
        var _a;
        if (this.event.getType() === Matrix.EventType.SpaceParent)
            return this.event.getStateKey();
        if (this.event.getType() === Matrix.EventType.SpaceChild)
            return this.event.getRoomId();
        if (this.event.getType() === "m.room.message") {
            return (_a = this.event.getContent()[constants_js_1.mscMarkupMsgKey]) === null || _a === void 0 ? void 0 : _a[constants_js_1.mscParent];
        }
    };
    Location.prototype.getChild = function () {
        if (this.event.getType() === Matrix.EventType.SpaceParent)
            return this.event.getRoomId();
        if (this.event.getType() === Matrix.EventType.SpaceChild)
            return this.event.getStateKey();
        if (this.event.getType() === "m.room.message")
            return this.event.getRoomId();
    };
    Location.prototype.getResourcePosition = function () {
        var _a, _b, _c;
        if ((_a = this.location) === null || _a === void 0 ? void 0 : _a[constants_js_1.mscPdfHighlight])
            return this.getPageIndex();
        if ((_b = this.location) === null || _b === void 0 ? void 0 : _b[constants_js_1.mscPdfText])
            return this.getPageIndex();
        if ((_c = this.location) === null || _c === void 0 ? void 0 : _c[constants_js_1.mscMediaFragment])
            return Math.floor(this.getIntervalStart() / 1000);
    };
    Location.prototype.getResourceFragment = function () {
        var _a;
        if ((_a = this.location) === null || _a === void 0 ? void 0 : _a[constants_js_1.mscMediaFragment]) {
            var temporal = this.location[constants_js_1.mscMediaFragment].start || this.location[constants_js_1.mscMediaFragment].start
                ? "t=".concat(this.getIntervalStart() / 1000, ",").concat(this.getIntervalEnd() / 1000)
                : "";
            var spatial = this.location[constants_js_1.mscMediaFragment].x
                ? "xywh=".concat(this.location[constants_js_1.mscMediaFragment].x, ",").concat(this.location[constants_js_1.mscMediaFragment].y, ",").concat(this.location[constants_js_1.mscMediaFragment].w, ",").concat(this.location[constants_js_1.mscMediaFragment].h)
                : "";
            if (temporal) {
                if (spatial) {
                    return "".concat(temporal, "&").concat(spatial);
                }
                return temporal;
            }
            else
                return spatial;
        }
    };
    //PDF specific
    Location.prototype.getText = function () {
        var _a, _b;
        return (_b = (_a = this.location) === null || _a === void 0 ? void 0 : _a[constants_js_1.mscPdfHighlight]) === null || _b === void 0 ? void 0 : _b.text_content;
    };
    Location.prototype.getPageIndex = function () {
        var _a, _b, _c, _d;
        return ((_b = (_a = this.location) === null || _a === void 0 ? void 0 : _a[constants_js_1.mscPdfHighlight]) === null || _b === void 0 ? void 0 : _b.page_index) ||
            ((_d = (_c = this.location) === null || _c === void 0 ? void 0 : _c[constants_js_1.mscPdfText]) === null || _d === void 0 ? void 0 : _d.page_index);
    };
    Location.prototype.getRect = function () {
        var _a, _b, _c, _d;
        return ((_b = (_a = this.location) === null || _a === void 0 ? void 0 : _a[constants_js_1.mscPdfHighlight]) === null || _b === void 0 ? void 0 : _b.rect) ||
            ((_d = (_c = this.location) === null || _c === void 0 ? void 0 : _c[constants_js_1.mscPdfText]) === null || _d === void 0 ? void 0 : _d.rect);
    };
    Location.prototype.getQuadPoints = function () {
        var _a, _b;
        return (_b = (_a = this.location) === null || _a === void 0 ? void 0 : _a[constants_js_1.mscPdfHighlight]) === null || _b === void 0 ? void 0 : _b.quad_points;
    };
    //Media specific
    Location.prototype.getIntervalStart = function () {
        if (this.location[constants_js_1.mscMediaFragment]) {
            return this.location[constants_js_1.mscMediaFragment].start || 0;
        }
    };
    Location.prototype.getIntervalEnd = function () {
        if (this.location[constants_js_1.mscMediaFragment]) {
            return this.location[constants_js_1.mscMediaFragment].end || "end";
        }
    };
    Location.prototype.getMediaRect = function () {
        if (this.location[constants_js_1.mscMediaFragment] &&
            this.location[constants_js_1.mscMediaFragment].x &&
            this.location[constants_js_1.mscMediaFragment].y &&
            this.location[constants_js_1.mscMediaFragment].w &&
            this.location[constants_js_1.mscMediaFragment].h) {
            return new DOMRect(this.location[constants_js_1.mscMediaFragment].x, this.location[constants_js_1.mscMediaFragment].y, this.location[constants_js_1.mscMediaFragment].w, this.location[constants_js_1.mscMediaFragment].h);
        }
    };
    // populus specific methods
    Location.prototype.isPrivate = function () {
        var _a, _b;
        if ((_b = (_a = this.location) === null || _a === void 0 ? void 0 : _a[constants_js_1.populusHighlight]) === null || _b === void 0 ? void 0 : _b.private)
            return true;
        return false;
    };
    Location.prototype.getRootContent = function () {
        var _a, _b;
        return (_b = (_a = this.location) === null || _a === void 0 ? void 0 : _a[constants_js_1.populusHighlight]) === null || _b === void 0 ? void 0 : _b.rootContent;
    };
    Location.prototype.getCreator = function () {
        var _a, _b;
        return (_b = (_a = this.location) === null || _a === void 0 ? void 0 : _a[constants_js_1.populusHighlight]) === null || _b === void 0 ? void 0 : _b.creator;
    };
    Location.prototype.getStatus = function () {
        var _a, _b;
        return (_b = (_a = this.location) === null || _a === void 0 ? void 0 : _a[constants_js_1.populusHighlight]) === null || _b === void 0 ? void 0 : _b.activityStatus;
    };
    return Location;
}());
exports.default = Location;

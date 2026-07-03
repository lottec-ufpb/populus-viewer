"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Matrix = require("matrix-js-sdk");
var client_js_1 = require("../client.js");
var constants_js_1 = require("../constants.js");
var Resource = /** @class */ (function () {
    function Resource(theRoom) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        var roomState = theRoom.getLiveTimeline().getState(Matrix.EventTimeline.FORWARDS);
        var legacyMxc = (_b = (_a = roomState.getStateEvents(constants_js_1.pdfStateType, "")) === null || _a === void 0 ? void 0 : _a.getContent()) === null || _b === void 0 ? void 0 : _b.mxc;
        var resourceContent = (_d = (_c = roomState.getStateEvents("m.room.create", "")) === null || _c === void 0 ? void 0 : _c.getContent()) === null || _d === void 0 ? void 0 : _d[constants_js_1.mscResourceData];
        this.file = resourceContent === null || resourceContent === void 0 ? void 0 : resourceContent["m.file"];
        this.room = theRoom;
        this.pcm = (_f = (_e = roomState.getStateEvents(constants_js_1.populusWaveformPCM, "")) === null || _e === void 0 ? void 0 : _e.getContent()) === null || _f === void 0 ? void 0 : _f.mxc;
        this.mimetype = (resourceContent === null || resourceContent === void 0 ? void 0 : resourceContent.mimetype) || ((_g = this.file) === null || _g === void 0 ? void 0 : _g.mimetype) || "application/pdf";
        this.url = (resourceContent === null || resourceContent === void 0 ? void 0 : resourceContent.url) || ((_h = this.file) === null || _h === void 0 ? void 0 : _h.url) || legacyMxc;
        this.schema = (_j = this.url) === null || _j === void 0 ? void 0 : _j.match(/^\w*/)[0];
        this.hasFetched = new Promise(function (resolve, reject) {
            _this.resolveFetch = resolve;
            _this.rejectFetch = reject;
        });
    }
    Resource.hasResource = function (theRoom) {
        var _a, _b, _c, _d;
        var roomState = theRoom.getLiveTimeline().getState(Matrix.EventTimeline.FORWARDS);
        var resourceContent = (_b = (_a = roomState.getStateEvents("m.room.create", "")) === null || _a === void 0 ? void 0 : _a.getContent()) === null || _b === void 0 ? void 0 : _b[constants_js_1.mscResourceData];
        var legacyMxc = (_d = (_c = roomState.getStateEvents(constants_js_1.pdfStateType, "")) === null || _c === void 0 ? void 0 : _c.getContent()) === null || _d === void 0 ? void 0 : _d.mxc;
        return !!(resourceContent || legacyMxc);
    };
    Object.defineProperty(Resource.prototype, "httpUrl", {
        get: function () {
            if (this.schema === "mxc")
                return client_js_1.default.client.getHttpUriForMxcFromHS(this.url);
            if (this.schema === "http")
                return this.url;
            if (this.schema === "https")
                return this.url;
            return null;
        },
        enumerable: false,
        configurable: true
    });
    return Resource;
}());
exports.default = Resource;

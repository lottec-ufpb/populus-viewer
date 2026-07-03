"use strict";
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
var Matrix = require("matrix-js-sdk");
function getRoomWithState(roomId) {
    var _this = this;
    var checkForState = function (resolve) { return function (_) {
        var room = _this.getRoom(roomId);
        if (room)
            resolve(room);
        else
            setTimeout(checkForState(resolve), 500);
    }; };
    return new Promise(function (resolve) { return checkForState(resolve)(); });
}
function getHttpUriForMxcFromHS(mxc, width, height, resizeMethod, allowDirectLinks, allowRedirects, useAuthentication) {
    return Matrix.getHttpUriForMxc(this.getHomeserverUrl(), mxc, width, height, resizeMethod, allowDirectLinks, true, true);
}
var Client = /** @class */ (function () {
    function Client() {
    }
    Client.isResumable = function () {
        return !!localStorage.getItem('accessToken') &&
            !!localStorage.getItem('userId') &&
            !!localStorage.getItem('baseUrl');
    };
    Client.initClient = function () {
        return __awaiter(this, void 0, void 0, function () {
            var indexedDB, clientOpts, notifTimelineSet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        try {
                            indexedDB = window.indexedDB;
                        }
                        catch (e) { }
                        clientOpts = {
                            baseUrl: localStorage.getItem('baseUrl'),
                            userId: localStorage.getItem('userId'),
                            accessToken: localStorage.getItem('accessToken'),
                            timelineSupport: true
                        };
                        if (!indexedDB) return [3 /*break*/, 2];
                        console.log("using indexedDB");
                        clientOpts.store = new Matrix.IndexedDBStore({
                            indexedDB: indexedDB,
                            localStorage: localStorage,
                            dbName: "populus-web-sync",
                            workerScript: './indexeddb-worker.js'
                        });
                        return [4 /*yield*/, clientOpts.store.startup()];
                    case 1:
                        _a.sent();
                        Client.client = Matrix.createClient(clientOpts);
                        return [3 /*break*/, 3];
                    case 2:
                        Client.client = Matrix.createClient(clientOpts);
                        _a.label = 3;
                    case 3:
                        Client.client.getRoomWithState = getRoomWithState.bind(Client.client);
                        Client.client.getHttpUriForMxcFromHS = getHttpUriForMxcFromHS.bind(Client.client);
                        notifTimelineSet = new Matrix.EventTimelineSet(null, { timelineSupport: true });
                        notifTimelineSet.getLiveTimeline().setPaginationToken("", Matrix.EventTimeline.BACKWARDS);
                        // XXX: following
                        // https://github.com/matrix-org/matrix-react-sdk/blob/2d1d42b90e8418017348cae1bd17a8a92340fdfb/src/MatrixClientPeg.ts#L296
                        // for original pagination token though this might not be correct.
                        Client.client.setNotifTimelineSet(notifTimelineSet);
                        return [2 /*return*/, Client.client];
                }
            });
        });
    };
    Client.restart = function () {
        Client.client.stopClient();
        Client.client.logout();
        Client.client.store.deleteAllData();
        Client.initClient();
    };
    // XXX Currently unsure whether this is good enough for the deviceId of the
    // client, since that has some crypto dimensions
    Client.deviceId = Math.random().toString(16).substr(2, 14);
    return Client;
}());
exports.default = Client;

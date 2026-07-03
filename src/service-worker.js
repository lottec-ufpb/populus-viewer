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
var workbox_routing_1 = require("workbox-routing");
var workbox_strategies_1 = require("workbox-strategies");
var workbox_cacheable_response_1 = require("workbox-cacheable-response");
var workbox_expiration_1 = require("workbox-expiration");
var workbox_precaching_1 = require("workbox-precaching");
// extra precaching
self.addEventListener("install", function (event) {
    self.skipWaiting();
    event.waitUntil(caches.open("static").then(function (cache) {
        cache.add("https://rsms.me/inter/font-files/InterVariable.woff2?v=4.1");
        cache.add("https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&display=swap");
        cache.add("https://cdn.jsdelivr.net/npm/katex@0.13.2/dist/katex.min.css");
    }));
});
self.addEventListener("activate", function (event) {
    // bring all browser tabs under our control
    event.waitUntil(clients.claim());
});
(0, workbox_precaching_1.precacheAndRoute)(self.__WB_MANIFEST);
// We store the auth token in memory. IndexedDB would provide more
// permanent storage. Would probably be overengineering though. May
// revisit latter.
var authToken = null;
// Listen for auth token from the main thread
self.addEventListener('message', function (event) {
    if (event.data && event.data.type === 'SET_AUTH_TOKEN') {
        authToken = event.data.token;
        console.log("Auth token recieved in service worker.");
    }
});
// Function to add authorization header, as per MSC3916
var addAuthorizationHeader = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var headers;
    var request = _b.request;
    return __generator(this, function (_c) {
        if (authToken) {
            headers = new Headers(request.headers);
            headers.append('Authorization', "Bearer ".concat(authToken));
            return [2 /*return*/, new Request(request, {
                    mode: 'cors',
                    credentials: 'omit',
                    headers: headers
                })];
        }
        return [2 /*return*/, request]; // if authToken is unavailable, we return the request untouched
    });
}); };
(0, workbox_routing_1.registerRoute)(
// dynamically cache thumbnails
function (_a) {
    var request = _a.request;
    return request.url.includes('_matrix/client/v1/media/thumbnail/') && request.destination === 'image';
}, new workbox_strategies_1.CacheFirst({
    // Put all cached files in a cache named 'images'
    cacheName: 'images',
    plugins: [
        {
            requestWillFetch: addAuthorizationHeader
        },
        new workbox_cacheable_response_1.CacheableResponsePlugin({ statuses: [200] }),
        new workbox_expiration_1.ExpirationPlugin({
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24 * 30 // 30 Days
        })
    ]
}));
// network-first caching of aliases, roomHierarchy, and server data
(0, workbox_routing_1.registerRoute)(function (_a) {
    var request = _a.request;
    return request.url.includes('_matrix/client/v3/directory/room/') ||
        request.url.includes('_matrix/client/versions') ||
        request.url.includes('_matrix/client/v1/rooms/');
}, new workbox_strategies_1.NetworkFirst({
    cacheName: 'aliases',
    plugins: [
        new workbox_cacheable_response_1.CacheableResponsePlugin({ statuses: [200] })
    ]
}));
(0, workbox_routing_1.registerRoute)(function (_a) {
    var request = _a.request;
    return request.url.includes('_matrix/client/v1/media/download/');
}, new workbox_strategies_1.CacheFirst({
    cacheName: 'media',
    plugins: [
        {
            requestWillFetch: addAuthorizationHeader
        },
        new workbox_cacheable_response_1.CacheableResponsePlugin({
            statuses: [200],
            headers: { "content-type": "application/pdf" }
        }),
        new workbox_expiration_1.ExpirationPlugin({ maxEntries: 10 })
    ]
}));

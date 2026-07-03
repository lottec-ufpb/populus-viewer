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
exports.createThumbnail = createThumbnail;
exports.loadImageElement = loadImageElement;
exports.loadMediaElement = loadMediaElement;
exports.blurhashFromFile = blurhashFromFile;
var png_chunks_extract_1 = require("png-chunks-extract");
var blurhash_1 = require("blurhash");
// The below is based on https://github.com/matrix-org/matrix-react-sdk/blob/develop/src/ContentMessages.tsx
// scraped out of a macOS hidpi (5660ppm) screenshot png
//                  5669 px (x-axis)      , 5669 px (y-axis)      , per metre
var PHYS_HIDPI = [0x00, 0x00, 0x16, 0x25, 0x00, 0x00, 0x16, 0x25, 0x01];
var MAX_WIDTH = 800;
var MAX_HEIGHT = 600;
function imagePromiseFromFile(imageFile) {
    // Load the file into an html element
    var img = new Image();
    var objectUrl = URL.createObjectURL(imageFile);
    var imgPromise = new Promise(function (resolve, reject) {
        img.onload = function (_) {
            URL.revokeObjectURL(objectUrl);
            resolve(img);
        };
        img.onerror = function (e) { return reject(e); };
    });
    img.src = objectUrl;
    return imgPromise;
}
function createThumbnail(element, inputWidth, inputHeight, mimeType) {
    return new Promise(function (resolve) {
        var targetWidth = inputWidth;
        var targetHeight = inputHeight;
        if (targetHeight > MAX_HEIGHT) {
            targetWidth = Math.floor(targetWidth * (MAX_HEIGHT / targetHeight));
            targetHeight = MAX_HEIGHT;
        }
        if (targetWidth > MAX_WIDTH) {
            targetHeight = Math.floor(targetHeight * (MAX_WIDTH / targetWidth));
            targetWidth = MAX_WIDTH;
        }
        var canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        canvas.getContext("2d").drawImage(element, 0, 0, targetWidth, targetHeight);
        canvas.toBlob(function (thumbnail) {
            resolve({
                info: {
                    thumbnail_info: {
                        w: targetWidth,
                        h: targetHeight,
                        mimetype: thumbnail.type,
                        size: thumbnail.size
                    },
                    w: inputWidth,
                    h: inputHeight
                },
                thumbnail: thumbnail
            });
        }, mimeType);
    });
}
function loadImageElement(imageFile) {
    return __awaiter(this, void 0, void 0, function () {
        var imgPromise, parsePromise, headers, _a, hidpi, img, width, height;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    imgPromise = imagePromiseFromFile(imageFile);
                    if (imageFile.type === "image/png") {
                        headers = imageFile // .slice(0, 0x1000)
                        ;
                        parsePromise = readFileAsArrayBuffer(headers).then(function (arrayBuffer) {
                            var buffer = new Uint8Array(arrayBuffer);
                            var chunks = (0, png_chunks_extract_1.default)(buffer);
                            for (var _i = 0, chunks_1 = chunks; _i < chunks_1.length; _i++) {
                                var chunk = chunks_1[_i];
                                if (chunk.name === 'pHYs') {
                                    if (chunk.data.byteLength !== PHYS_HIDPI.length)
                                        return;
                                    return chunk.data.every(function (val, i) { return val === PHYS_HIDPI[i]; });
                                }
                            }
                            return false;
                        });
                    }
                    return [4 /*yield*/, Promise.all([parsePromise, imgPromise])];
                case 1:
                    _a = _b.sent(), hidpi = _a[0], img = _a[1];
                    width = hidpi ? (img.width >> 1) : img.width;
                    height = hidpi ? (img.height >> 1) : img.height;
                    return [2 /*return*/, { width: width, height: height, img: img }];
            }
        });
    });
}
function readFileAsArrayBuffer(file) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onload = function (e) { return resolve(e.target.result); };
        reader.onerror = function (e) { return reject(e); };
        reader.readAsArrayBuffer(file);
    });
}
function loadMediaElement(mediaFile, tag) {
    return new Promise(function (resolve, reject) {
        // Load the file into an html element
        var element = document.createElement(tag);
        var theUrl = URL.createObjectURL(mediaFile);
        element.src = theUrl;
        // Once ready, returns its size
        // Wait until we have enough data to thumbnail the first frame, or get metadata
        element.onloadeddata = function (_) {
            URL.revokeObjectURL(theUrl);
            resolve(element);
        };
        // XXX: this was previously using FileReader and a data URL, but an
        // apparent bug in firefox 98 seems to prevent FileReader-generated data
        // urls from being used with video elements
        element.onerror = function (e) { return reject(e); };
    });
}
function blurhashFromFile(imageFile) {
    return __awaiter(this, void 0, void 0, function () {
        var imgPromise, img, targetWidth, targetHeight, canvas, context, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    imgPromise = imagePromiseFromFile(imageFile);
                    return [4 /*yield*/, imgPromise];
                case 1:
                    img = _a.sent();
                    targetWidth = img.width;
                    targetHeight = img.height;
                    if (targetHeight > 100) {
                        targetWidth = Math.floor(targetWidth * (100 / targetHeight));
                        targetHeight = 100;
                    }
                    if (targetWidth > 100) {
                        targetHeight = Math.floor(targetHeight * (100 / targetWidth));
                        targetWidth = 100;
                    }
                    canvas = document.createElement("canvas");
                    canvas.width = targetWidth;
                    canvas.height = targetHeight;
                    context = canvas.getContext("2d");
                    context.drawImage(img, 0, 0, targetWidth, targetHeight);
                    data = context.getImageData(0, 0, targetWidth, targetHeight);
                    return [2 /*return*/, (0, blurhash_1.encode)(data.data, data.width, data.height, 4, 4)];
            }
        });
    });
}

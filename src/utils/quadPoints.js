"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var QuadPoints = /** @class */ (function () {
    function QuadPoints(x1, y1, x2, y2, x3, y3, x4, y4) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.x3 = x3;
        this.y3 = y3;
        this.x4 = x4;
        this.y4 = y4;
    }
    QuadPoints.fromQuadArray = function (_a) {
        var x1 = _a[0], y1 = _a[1], x2 = _a[2], y2 = _a[3], x3 = _a[4], y3 = _a[5], x4 = _a[6], y4 = _a[7];
        return new QuadPoints(x1, y1, x2, y2, x3, y3, x4, y4);
    };
    QuadPoints.fromRectIn = function (rect, elt, maybeDPI) {
        var dpi = maybeDPI || 72;
        var scale = 72 / dpi;
        var bottomLeftX = rect.x;
        var bottomLeftY = elt.scrollHeight - rect.y - rect.height;
        var topLeftX = rect.x;
        var topLeftY = elt.scrollHeight - rect.y;
        var topRightX = rect.x + rect.width;
        var topRightY = elt.scrollHeight - rect.y;
        var bottomRightX = rect.x + rect.width;
        var bottomRightY = elt.scrollHeight - rect.y - rect.height;
        return new QuadPoints(bottomLeftX * scale, bottomLeftY * scale, topLeftX * scale, topLeftY * scale, topRightX * scale, topRightY * scale, bottomRightX * scale, bottomRightY * scale);
    };
    QuadPoints.prototype.toDOMRectInHeight = function (height, maybeDPI) {
        var dpi = maybeDPI || 72;
        var scale = 72 / dpi;
        var rect = this.getBoundingRect();
        return new DOMRect(rect.left * scale, (height - rect.top) * scale, (rect.right - rect.left) * scale, (rect.top - rect.bottom) * scale);
    };
    QuadPoints.prototype.getArray = function () {
        return [this.x1, this.y1, this.x2, this.y2, this.x3, this.y3, this.x4, this.y4]
            .map(Math.round);
    };
    QuadPoints.prototype.getBoundingRect = function () {
        return {
            left: Math.round(Math.min(this.x1, this.x2, this.x3, this.x4)),
            right: Math.round(Math.max(this.x1, this.x2, this.x3, this.x4)),
            top: Math.round(Math.max(this.y1, this.y2, this.y3, this.y4)),
            bottom: Math.round(Math.min(this.y1, this.y2, this.y3, this.y4))
        };
    };
    return QuadPoints;
}());
exports.default = QuadPoints;

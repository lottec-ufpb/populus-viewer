"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.positionRelativeAt = positionRelativeAt;
exports.rectRelativeTo = rectRelativeTo;
exports.sanitizeRects = sanitizeRects;
exports.unionRects = unionRects;
function positionRelativeAt(rect, elt, zoomFactor) {
    var parent = elt.offsetParent;
    elt.style.left = "".concat(rect.left - (parent.offsetLeft / zoomFactor), "px");
    elt.style.top = "".concat(rect.top - (parent.offsetTop / zoomFactor), "px");
    elt.style.height = "".concat(rect.height, "px");
    elt.style.width = "".concat(rect.width, "px");
}
// take boundingClientRect, in coordinates relative to the viewport,
// with a factor for a CSS transform originating at 0,0 and produce
// a rect in coordinates relative to the given element
function rectRelativeTo(elt, rect, zoomFactor) {
    var eltRect = elt.getBoundingClientRect();
    return new DOMRect((rect.x - eltRect.x) / zoomFactor, (rect.y - eltRect.y) / zoomFactor, rect.width / zoomFactor, rect.height / zoomFactor);
}
// take an array of rects and sanitize them, 
// - removing zero width artifacts, and padding width
// TODO: fuse relevantly overlapping rects
function sanitizeRects(rects) {
    return rects.filter(function (rect) { return rect.width > 1; }).map(function (rect) {
        rect.x = rect.x - 5;
        rect.width = rect.width + 10;
        return rect;
    });
}
// take an array of rects and return the minimal rect containing all of them
function unionRects(rects) {
    var xs = rects.map(function (rect) { return rect.x; });
    var ys = rects.map(function (rect) { return rect.y; });
    var rights = rects.map(function (rect) { return rect.right; });
    var bottoms = rects.map(function (rect) { return rect.bottom; });
    var theX = Math.min.apply(Math, xs);
    var theY = Math.min.apply(Math, ys);
    return new DOMRect(theX, theY, Math.max.apply(Math, rights) - theX, Math.max.apply(Math, bottoms) - theY);
}

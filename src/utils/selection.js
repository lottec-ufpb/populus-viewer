"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textFromPdfSelection = textFromPdfSelection;
exports.rectsFromPdfSelection = rectsFromPdfSelection;
var Layout = require("./layout.js");
function textFromPdfSelection(sel) {
    var theRange = sel.getRangeAt(0);
    var theContents = Array.from(theRange.cloneContents().childNodes);
    return theContents.map(function (child) {
        return child.nodeType === 3 // Text node
            ? child.data
            : child.nodeType === 1 // Element Node
                ? child.innerText
                : "";
    }).join(' ').replace(/(.)-\s+/g, "$1"); // join nodes with spaces, clean any linebreak dashes
}
// get rects in CSS pixel coordinatates relative to the given elt, correcting for a css zoom originating at 0,0
function rectsFromPdfSelection(sel, elt, zoom) {
    var theRange = sel.getRangeAt(0);
    var rects = [];
    if (theRange.startContainer !== theRange.endContainer) {
        if (theRange.startContainer.nodeType === 1) { // starts in an element
            var startRangeChildren = Array.from(theRange.startContainer.childNodes).slice(theRange.startOffset);
            var startRangeChildrenText = startRangeChildren.map(gatherTextNodesBelow).reduce(function (acc, next) { return acc.concat(next); }, []);
            rects = rects.concat(startRangeChildrenText.map(function (node) { return textNodeToRect(node); }));
        }
        if (theRange.startContainer.nodeType === 3) { // starts in a text element
            rects.push(textNodeToRect(theRange.startContainer, theRange.startOffset));
        }
        if (theRange.endContainer.nodeType === 1) { // ends in an element
            var endRangeChildren = Array.from(theRange.endContainer.childNodes).slice(0, theRange.endOffset);
            var endRangeChildrenText = endRangeChildren.map(gatherTextNodesBelow).reduce(function (acc, next) { return acc.concat(next); }, []);
            rects = rects.concat(endRangeChildrenText.map(function (node) { return textNodeToRect(node); }));
        }
        if (theRange.endContainer.nodeType === 3 && theRange.endOffset > 0) { // ends in a text element
            rects.push(textNodeToRect(theRange.endContainer, 0, theRange.endOffset));
        }
        rects = rects.concat(gatherTextNodesBetween(theRange.startContainer, theRange.endContainer).map(function (node) { return textNodeToRect(node); }));
    }
    else {
        if (theRange.startContainer.nodeType === 1) { // starts and ends in an element
            var startRangeChildren = Array.from(theRange.startContainer.childNodes).slice(theRange.startOffset, theRange.endOffset);
            var startRangeChildrenText = startRangeChildren.map(gatherTextNodesBelow).reduce(function (acc, next) { return acc.concat(next); }, []);
            rects = rects.concat(startRangeChildrenText.map(function (node) { return textNodeToRect(node); }));
        }
        if (theRange.startContainer.nodeType === 3) { // starts and ends in a text element
            rects.push(textNodeToRect(theRange.startContainer, theRange.startOffset, theRange.endOffset));
        }
    }
    return Layout.sanitizeRects(rects.map(function (rect) { return Layout.rectRelativeTo(elt, rect, zoom); }));
}
// find the next (inclusive) node satisfying predicate in the DOM, in a preorder traversal.
//
// Note, JS generally doesn't have tail call optimization, so maybe we should
// use a trampoline here to prevent stack overflow someday.
//
// cf https://stackoverflow.com/questions/54719548/tail-call-optimization-implementation-in-javascript-engines
function findNextInDOM(node, predicate, ascending) {
    if (ascending) {
        if (node.nextSibling)
            return findNextInDOM(node.nextSibling, predicate);
        if (node.parentNode)
            return findNextInDOM(node.parentNode, predicate, true);
        return null;
    }
    if (predicate(node))
        return node;
    if (node.firstChild)
        return findNextInDOM(node.firstChild, predicate);
    if (node.nextSibling)
        return findNextInDOM(node.nextSibling, predicate);
    if (node.parentNode)
        return findNextInDOM(node.parentNode, predicate, true);
    return null;
}
// gather the text nodes below a given node, inclusive
function gatherTextNodesBelow(top) {
    var nodes = [];
    var predicate = function (node) { return node.nodeType === 3 || node === top; };
    var focus = findNextInDOM(top, predicate);
    if (focus === top)
        return [top]; // if top is a text node
    nodes.push(focus);
    while ((focus = findNextInDOM(focus, predicate, true)) !== top) {
        nodes.push(focus);
    }
    return nodes;
}
// gather the text nodes in between start and end (excluding both start and end)
function gatherTextNodesBetween(start, end) {
    var nodes = [];
    var predicate = function (node) { return node.nodeType === 3 || node === end; };
    var focus = start;
    while ((focus = findNextInDOM(focus, predicate, true)) !== end) {
        nodes.push(focus);
    }
    return nodes;
}
function textNodeToRect(textNode, start, end) {
    var range = document.createRange();
    range.selectNode(textNode);
    if (start)
        range.setStart(textNode, start);
    if (end)
        range.setEnd(textNode, end);
    return range.getBoundingClientRect();
}

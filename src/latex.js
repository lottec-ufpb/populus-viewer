"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.latexInlineToReplacement = latexInlineToReplacement;
exports.latexDisplayToReplacement = latexDisplayToReplacement;
exports.renderLatexInElement = renderLatexInElement;
var katex_1 = require("katex");
function latexInlineToReplacement(match) {
    var replacement = document.createElement('span');
    replacement.dataset.mxMaths = match;
    replacement.innerText = match;
    return replacement.outerHTML;
}
function latexDisplayToReplacement(match) {
    var replacement = document.createElement('div');
    replacement.dataset.mxMaths = match;
    replacement.innerText = match;
    return replacement.outerHTML;
}
function renderLatexInElement(element) {
    if (element) {
        var latexArray = Array.from(element.querySelectorAll("[data-mx-maths]"));
        latexArray.forEach(function (elt) {
            if (elt.tagName === "DIV")
                katex_1.default.render(elt.dataset.mxMaths, elt, { displayMode: true, throwOnError: false });
            else
                katex_1.default.render(elt.dataset.mxMaths, elt, { throwOnError: false });
        });
    }
}

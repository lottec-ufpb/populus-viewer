"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processRegex = processRegex;
var latex_js_1 = require("./latex.js");
var client_js_1 = require("./client.js");
var escapedDollar = /\\\$/;
var latexInlineRegex = /\$(([^$]|\\\\$)*)\$/;
var latexDisplayRegex = /\$\$(([^$]|\\\\$)*)\$\$/;
var mentionRegex = /@\S*:\S*/;
function processRegex(string) {
    var theRegex = new RegExp("".concat(escapedDollar.source, "|").concat(latexDisplayRegex.source, "|").concat(latexInlineRegex.source, "|").concat(mentionRegex.source), "gm");
    return string.replaceAll(theRegex, matchDispatch);
}
function mentionToReplacement(match) {
    var user = client_js_1.default.client.getUser(match);
    if (!user)
        return match;
    var replacement = document.createElement('a');
    replacement.href = "https://matrix.to/#/".concat(user.userId);
    replacement.innerText = user.displayName || user.userId;
    return replacement.outerHTML;
}
function matchDispatch(match) {
    // we need to start from te beginning again and transform the first capture group we encounter
    // we need to use fresh RegExp to strip the global flag
    if (latexDisplayRegex.test(match))
        return (0, latex_js_1.latexDisplayToReplacement)(match.match(latexDisplayRegex)[1]);
    if (latexInlineRegex.test(match))
        return (0, latex_js_1.latexInlineToReplacement)(match.match(latexInlineRegex)[1]);
    if (mentionRegex.test(match))
        return mentionToReplacement(match);
    if (escapedDollar.test(match))
        return "$";
}

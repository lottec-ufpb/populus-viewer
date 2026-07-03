"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripReply = void 0;
exports.isReply = isReply;
exports.stripFallbackPlain = stripFallbackPlain;
exports.stripFallbackPlainString = stripFallbackPlainString;
exports.generateFallbackPlain = generateFallbackPlain;
exports.generateFallbackHtml = generateFallbackHtml;
exports.getFallbackHtml = getFallbackHtml;
exports.getFallbackPlain = getFallbackPlain;
exports.getReplyPrefixHtml = getReplyPrefixHtml;
exports.getReplyPrefixPlain = getReplyPrefixPlain;
var sanitize_html_1 = require("sanitize-html");
function isReply(content) {
    return !!(content['m.relates_to'] && content['m.relates_to']['m.in_reply_to']);
}
function stripFallbackPlain(lines) {
    // Removes lines beginning with `> ` until you reach one that doesn't.
    while (lines.length && lines[0].startsWith('> '))
        lines.shift();
    // Reply fallback has a blank line after it, so remove it to prevent leading newline
    if (lines[0] === '')
        lines.shift();
}
function stripFallbackPlainString(string) {
    var lines = string.trim().split('\n');
    // Removes lines beginning with `> ` until you reach one that doesn't.
    while (lines.length && lines[0].startsWith('> '))
        lines.shift();
    // Reply fallback has a blank line after it, so remove it to prevent leading newline
    if (lines[0] === '')
        lines.shift();
    return lines.join('\n');
}
function generateFallbackPlain(event) {
    var lines;
    var targetSender = event.getSender();
    switch (event.getContent().msgtype) {
        case "m.file": {
            lines = ["sent a file"];
            break;
        }
        case "m.audio": {
            lines = ["sent an audio file"];
            break;
        }
        case "m.video": {
            lines = ["sent a video"];
            break;
        }
        default: {
            var targetBody = event.getContent().body;
            lines = targetBody.trim().split('\n');
            // strip previous fallback, if replying to a reply
            if (isReply(event.getContent()))
                stripFallbackPlain(lines);
        }
    }
    if (lines.length > 0) {
        lines[0] = "<".concat(targetSender, "> ").concat(lines[0]);
    }
    return "".concat(lines.map(function (line) { return "> ".concat(line); }).join('\n'), "\n\n");
}
function generateFallbackHtml(event) {
    var replyHtml;
    var targetSender = event.getSender();
    switch (event.getContent().msgtype) {
        case "m.file": {
            replyHtml = "sent a file";
            break;
        }
        case "m.audio": {
            replyHtml = "sent an audio file";
            break;
        }
        case "m.video": {
            replyHtml = "sent a video";
            break;
        }
        default: {
            var targetHTML = event.getContent().formatted_body || event.getContent().body.replace(/\n/g, '<br>');
            replyHtml = (0, sanitize_html_1.default)(targetHTML, exports.stripReply);
        }
    }
    return ("<mx-reply><blockquote><a href=\"https://matrix.to/#/".concat(event.getRoomId(), "/").concat(event.getId(), "\">In reply to</a>") +
        " <a href=\"https://matrix.to/#/".concat(targetSender, "\">").concat(targetSender, "</a>") +
        "<br>".concat(replyHtml, "</blockquote></mx-reply>"));
}
// for fallback when no live event is available - strips mx-reply tag
function getFallbackHtml(content) {
    var html = content.formatted_body;
    if (!html)
        return '';
    var rootNode = new DOMParser().parseFromString(html, 'text/html').body;
    var blockQuote = rootNode.querySelector('mx-reply > blockquote');
    // remove the usual boilerplate to avoid unwanted redirection to https://matrix.to
    blockQuote === null || blockQuote === void 0 ? void 0 : blockQuote.removeChild(rootNode.querySelector('a'));
    blockQuote === null || blockQuote === void 0 ? void 0 : blockQuote.removeChild(rootNode.querySelector('a'));
    blockQuote === null || blockQuote === void 0 ? void 0 : blockQuote.removeChild(rootNode.querySelector('br'));
    return blockQuote ? blockQuote.outerHTML : '';
}
function getFallbackPlain(content) {
    return getReplyPrefixPlain(content);
}
function getReplyPrefixHtml(content) {
    var html = content.formatted_body;
    if (!html)
        return '';
    var rootNode = new DOMParser().parseFromString(html, 'text/html').body;
    return rootNode.querySelector('mx-reply').outerHTML;
}
function getReplyPrefixPlain(content) {
    var body = content.body;
    var lines = body.trim().split('\n');
    if (lines.length > 2 && lines[0].startsWith('> <')) {
        var header = [];
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            if (line.startsWith('> '))
                header.push(line);
            else
                break;
        }
        return "".concat(header.join('\n'), "\n\n");
    }
    return '';
}
exports.stripReply = {
    allowedTags: false, // false means allow everything
    allowedAttributes: false,
    // we somehow can't allow all schemes, so we allow all that we
    // know of and mxc (for img tags)
    allowedSchemes: ['http', 'https', 'ftp', 'mailto', 'magnet', 'mxc'],
    exclusiveFilter: function (frame) { return frame.tag === 'mx-reply'; }
};

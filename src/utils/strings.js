"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toWords = toWords;
function toWords(s) {
    var words = [];
    var regex = /[^\s"]+|"([^"]*)"/gi;
    var match;
    do {
        match = regex.exec(s);
        if (match != null)
            words.push(match[1] ? match[1] : match[0]);
    } while (match != null);
    return words;
}

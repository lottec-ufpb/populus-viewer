"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processLinks = processLinks;
var history_js_1 = require("./history.js");
var client_js_1 = require("./client.js");
var colors_js_1 = require("./utils/colors.js");
function processLinks(elt) {
    if (elt) {
        var linkArray = Array.from(elt.querySelectorAll("a[href]"));
        linkArray
            .forEach(function (link) {
            try {
                var url = new URL(link.getAttribute("href"));
                if (url.host === window.location.host && url.pathname === window.location.pathname) {
                    var hash_1 = new URL(link.getAttribute("href")).hash;
                    link.addEventListener("click", function (e) {
                        e.preventDefault();
                        history_js_1.default.push(hash_1.slice(1));
                    });
                }
                else if (url.host === "matrix.to") {
                    var user = client_js_1.default.client.getUser(url.hash.slice(2));
                    link.addEventListener("click", function (e) { return e.preventDefault(); }); // do nothing until we have DMS worked out
                    if (user) {
                        var colors = new colors_js_1.UserColor(user.userId);
                        link.style.setProperty('--user_dark', colors.dark);
                    }
                }
            }
            catch (e) { }
        });
    }
}

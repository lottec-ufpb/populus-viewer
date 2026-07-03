"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var history_1 = require("history");
var preact_router_1 = require("preact-router");
var History = /** @class */ (function () {
    function History() {
    }
    History.push = function (theRoute, message) {
        // the second argument means we only push if we're not already at the path
        // in question. Otherwise we replace.
        (0, preact_router_1.route)(theRoute, this.history.location.pathname == theRoute);
        this.history.replace(theRoute, message);
    };
    History.replace = function (theRoute, message) {
        (0, preact_router_1.route)(theRoute, true);
        this.history.replace(theRoute, message);
    };
    History.setPath = function (componentNumber, value) {
        var pathparts = this.history.location.pathname.split("/");
        pathparts[componentNumber] = value;
        History.push(pathparts.join("/"));
    };
    History.history = (0, history_1.createHashHistory)();
    History.message = {};
    return History;
}());
exports.default = History;

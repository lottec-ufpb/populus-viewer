"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toastError = toastError;
exports.onlineOrAlert = onlineOrAlert;
var preact_1 = require("preact");
var client_js_1 = require("../client.js");
var toast_js_1 = require("../toast.js");
function toastError(headline) {
    return function (e) {
        toast_js_1.default.set(<preact_1.Fragment>
      <h3 id="toast-header">{headline}</h3>
      <div>Here's the error message:</div>
      <pre>{e.message}</pre>
    </preact_1.Fragment>);
    };
}
function onlineOrAlert() {
    if (client_js_1.default.client.getSyncState() === "ERROR") {
        toast_js_1.default.set(<preact_1.Fragment>
      <h3 id="toast-header">It looks like you're offline</h3>
      <div>
        This operation requires a network connection. Try again once you're back online.
      </div>
    </preact_1.Fragment>);
        return false;
    }
    return true;
}

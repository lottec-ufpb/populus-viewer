"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLaunchParameters = handleLaunchParameters;
var preact_1 = require("preact");
var client_js_1 = require("../client.js");
var toast_js_1 = require("../toast.js");
// this handles query parameters that should be present at the application launch
function handleLaunchParameters(logoutHandler) {
    var queryParameters = new URLSearchParams(window.location.search);
    var toJoin = queryParameters.get("join");
    var joinVia = queryParameters.getAll("via");
    var server = queryParameters.get('server');
    if (toJoin && joinVia.length > 0)
        client_js_1.default.client.joinRoom(toJoin, { viaServers: joinVia });
    if (server && server !== client_js_1.default.client.getDomain()) {
        toast_js_1.default.set(<preact_1.Fragment>
      <h3 id="toast-header">You might be in the wrong place</h3>
      <div>
        The link that brought you here requested
        <pre>{server}</pre>
        but you're already logged in to
        <pre>{client_js_1.default.client.getDomain()}</pre>
        If you want join the server requested by the link you followed, log out
        and then follow the link again.
      </div>
      <div style="margin-top:10px">
        <button onclick={function (_) {
                toast_js_1.default.set(null);
                logoutHandler();
            }} class="styled-button">
          Log out
        </button>
      </div>
    </preact_1.Fragment>);
    }
    window.history.replaceState({ toastWarning: true }, '', window.location.pathname + window.location.hash);
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ArchiveRoom;
var preact_1 = require("preact");
var client_js_1 = require("./client.js");
var modal_js_1 = require("./modal.js");
function ArchiveRoom(props) {
    return <>
    <p>
      Doing so will remove the collection from your main list, but you'll still
      be able to restore it using the "Add Collection" button.
    </p>
    <button onClick={function () {
            client_js_1.default.client.setRoomTag(props.room.roomId, "m.lowpriority", { order: 0.5 });
            modal_js_1.default.hide();
        }} class="styled-button">Archive this room</button>
  </>;
}

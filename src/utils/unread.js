"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateUnread = calculateUnread;
exports.isUnread = isUnread;
var client_js_1 = require("../client.js");
function calculateUnread(roomId) {
    var room = client_js_1.default.client.getRoom(roomId);
    if (room)
        return room.getUnreadNotificationCount();
    return "All";
}
function isUnread(event) {
    var roomIfJoined = client_js_1.default.client.getRoom(event.getRoomId());
    if (roomIfJoined) {
        var events = roomIfJoined.getLiveTimeline().getEvents();
        var maybeRead = roomIfJoined.getAccountData('m.fully_read');
        var currentFullyReadId = maybeRead ? maybeRead.getContent().event_id : null;
        if (currentFullyReadId) {
            for (var i = (events.length - 1); i >= 0; --i) {
                if (currentFullyReadId === events[i].getId())
                    return false;
                if (event.getId() === events[i].getId())
                    return true;
            }
        }
    }
    return true;
}

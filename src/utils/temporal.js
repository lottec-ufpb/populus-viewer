"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateReducer = dateReducer;
exports.toClockTime = toClockTime;
// for accumlation of date labels
function dateReducer(array, milestone, mile) {
    var initialDate = Date.now();
    var currentDate = initialDate;
    return array.reduce(function (accumulator, ev) {
        var theMile = mile(ev);
        var age = initialDate - ev.getTs();
        var dateDelta = currentDate - ev.getTs();
        if (theMile) {
            var message = void 0;
            if (age < 300000 && dateDelta > 60000) {
                currentDate = ev.getTs();
                var minutes = Math.floor(age / 60000);
                var plural = minutes === 1 ? "" : "s";
                message = "".concat(minutes, " minute").concat(plural, " ago");
            }
            else if (age < 3600000 && dateDelta > 600000) {
                currentDate = ev.getTs();
                var minutes = Math.floor(age / 60000);
                var plural = minutes === 1 ? "" : "s";
                message = "".concat(minutes, " minute").concat(plural, " ago");
            }
            else if (age < 86400000 && dateDelta > 3600000) {
                currentDate = ev.getTs();
                var hours = Math.floor(age / 3600000);
                var plural = hours === 1 ? "" : "s";
                message = "".concat(hours, " hour").concat(plural, " ago");
            }
            else if (dateDelta > 86400000) {
                currentDate = ev.getTs();
                var dateObject = new Date(currentDate);
                message = "on ".concat(dateObject.toLocaleDateString('en-US', {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }));
            }
            if (message)
                accumulator.push(milestone(message));
            accumulator.push(theMile);
        }
        return accumulator;
    }, []);
}
function toClockTime(sec) {
    if (sec >= 3600)
        return "".concat(Math.floor(sec / 3600), ":").concat(Math.floor((sec % 3600) / 60), ":").concat(Math.floor(sec % 60));
    return "".concat(Math.floor(sec / 60), ":").concat(sec % 60 <= 9 ? 0 : "").concat(Math.floor(sec % 60));
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadBlob = downloadBlob;
function downloadBlob(blob, filename, mimetype) {
    // slice here lets us potentially avoid creating another copy of the blob
    // just to change the mimetype
    var url = window.URL.createObjectURL(blob.slice(0, blob.size, mimetype));
    var a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
}

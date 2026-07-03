"use strict";
// based on https://github.com/vector-im/element-web/blob/develop/src/vector/indexeddb-worker.js
Object.defineProperty(exports, "__esModule", { value: true });
var indexeddb_worker_js_1 = require("matrix-js-sdk/lib/indexeddb-worker.js");
var remoteWorker = new indexeddb_worker_js_1.IndexedDBStoreWorker(self.postMessage);
global.onmessage = remoteWorker.onMessage;

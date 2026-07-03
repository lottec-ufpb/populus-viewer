"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var preact_1 = require("preact");
require("./styles/mediaModal.css");
var Icons = require("./icons.js");
var MediaModal = /** @class */ (function (_super) {
    __extends(MediaModal, _super);
    function MediaModal(props) {
        var _this = _super.call(this, props) || this;
        _this.hideMediaModal = function (_) {
            delete document.body.dataset.modalVisible; // prevents scrolling
            _this.setState({ content: null, url: null });
        };
        _this.setContent = function (content, url) {
            document.body.dataset.modalVisible = true;
            _this.setState({ content: content, url: url });
        };
        _this.catchClick = function (e) { return e.stopPropagation(); };
        _this.state = { content: null };
        MediaModal.set = _this.setContent;
        MediaModal.hide = _this.hideMediaModal;
        MediaModal.isVisible = function (_) { return _this.state.content !== null; };
        return _this;
    }
    MediaModal.prototype.render = function (_, state) {
        return state.content
            ? <div id="media-modal">
          <div id="media-modal-background" onclick={this.hideMediaModal}/>
          <button id="media-modal-close" onclick={this.hideMediaModal}>
            {Icons.close}
          </button>
          {state.url ?
                    <a id="media-modal-download" download target="_blank" href={state.url}>
              {Icons.download}
            </a>
                    : null}
          <div id="media-modal-content">
            {state.content}
          </div>
        </div>
            : null;
    };
    return MediaModal;
}(preact_1.Component));
exports.default = MediaModal;

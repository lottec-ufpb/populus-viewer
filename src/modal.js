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
require("./styles/modal.css");
var Icons = require("./icons.js");
var Modal = /** @class */ (function (_super) {
    __extends(Modal, _super);
    function Modal(props) {
        var _this = _super.call(this, props) || this;
        _this.hideModal = function (_) {
            delete document.body.dataset.modalVisible;
            _this.setState({ content: null, title: null });
        };
        _this.setContent = function (content, title, subtitle) {
            document.body.dataset.modalVisible = true;
            _this.setState({ content: content, title: title, subtitle: subtitle });
        };
        _this.state = { content: null };
        Modal.set = _this.setContent;
        Modal.hide = _this.hideModal;
        Modal.isVisible = function (_) { return _this.state.content !== null; };
        Modal.getTitle = function (_) { return _this.state.title; };
        return _this;
    }
    //TODO: implement focus-trap to prevent focus from escaping modal
    Modal.prototype.render = function (_, state) {
        return state.content
            ? <div id="modal-popup">
        <div id="modal-background" onclick={this.hideModal}/>
        <div role="dialog" aria-modal="true" id="modal-content">
          <div id="modal-header">
            <h3 id="modal-title">
              {state.title}
            </h3>
            <button id="dismiss-modal" onclick={this.hideModal}>
              {Icons.close}
            </button>
            {state.subtitle ? <span id="modal-subtitle">{state.subtitle}</span> : null}
          </div>
          {state.content}
        </div>
      </div>
            : null;
    };
    return Modal;
}(preact_1.Component));
exports.default = Modal;

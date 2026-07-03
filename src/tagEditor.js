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
exports.TagEditor = void 0;
exports.TagList = TagList;
var preact_1 = require("preact");
var client_js_1 = require("./client.js");
var Icons = require("./icons.js");
require("./styles/tagEditor.css");
var TagEditor = /** @class */ (function (_super) {
    __extends(TagEditor, _super);
    function TagEditor(props) {
        var _this = _super.call(this, props) || this;
        _this.newTagInput = (0, preact_1.createRef)();
        _this.handleBlur = function (_) { return _this.setState({ newTag: "" }); };
        _this.handleKeyup = function (e) {
            if (e.key === "Enter") {
                client_js_1.default.client.setRoomTag(_this.props.room.roomId, "u.".concat(_this.newTagInput.current.value), { order: 0.5 });
                _this.setState({ newTag: "" });
            }
            else
                _this.setState({ newTag: _this.newTagInput.current.value });
        };
        _this.handleClick = function (name) { return function (_) {
            client_js_1.default.client.deleteRoomTag(_this.props.room.roomId, name);
        }; };
        _this.state = {
            newTag: "",
            tags: Object.keys(props.room.tags)
        };
        _this.accountListener = _this.accountListener.bind(_this);
        return _this;
    }
    TagEditor.prototype.componentDidMount = function () {
        client_js_1.default.client.on("Room.accountData", this.accountListener);
    };
    TagEditor.prototype.componentWillUnmount = function () {
        client_js_1.default.client.off("Room.accountData", this.accountListener);
    };
    TagEditor.prototype.accountListener = function () {
        this.setState({ tags: Object.keys(this.props.room.tags) });
    };
    TagEditor.prototype.render = function (props, state) {
        var _this = this;
        var roomTags = state.tags
            .filter(function (tag) { return tag.slice(0, 2) === 'u.'; })
            .map(function (tag) { return <preact_1.Fragment key={"".concat(props.room.roomId, "\"-tag-\"").concat(tag)}>
        <span onclick={_this.handleClick(tag)} class="room-tag-delete-icon">{Icons.trash}</span>
        <Tag room={props.room} tag={tag}/>
      </preact_1.Fragment>; });
        return <preact_1.Fragment>
        <div class="tag-editor">
          <preact_1.Fragment>{roomTags}</preact_1.Fragment>
          <input ref={this.newTagInput} class="styled-input tag-input" value={state.newTag} onkeyup={this.handleKeyup} onblur={this.handleBlur} placeholder="new tag"/>
        </div>
      </preact_1.Fragment>;
    };
    return TagEditor;
}(preact_1.Component));
exports.TagEditor = TagEditor;
function Tag(props) {
    return <span class="room-tag">{props.tag.slice(2)}</span>;
}
function TagList(props) {
    var roomTags = Object.keys(props.room.tags)
        .filter(function (tag) { return tag.slice(0, 2) === 'u.'; })
        .map(function (tag) { return <Tag key={"".concat(props.room.roomId, "\"-tag-\"").concat(props.tag)} room={props.room} tag={tag}/>; });
    return <preact_1.Fragment>{roomTags}</preact_1.Fragment>;
}

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
var colors_js_1 = require("./utils/colors.js");
var Icons = require("./icons.js");
var PopupMenu = require("./popUpMenu.js");
var Replies = require("./utils/replies.js");
var processRegex_js_1 = require("./processRegex.js");
var client_js_1 = require("./client.js");
var tooltip_js_1 = require("./utils/tooltip.js");
require("emoji-picker-element");
var CommonMark = require("commonmark");
require("./styles/messageFrame.css");
var MessageFrame = /** @class */ (function (_super) {
    __extends(MessageFrame, _super);
    function MessageFrame(props) {
        var _this = _super.call(this, props) || this;
        _this.handleStatus = function (_, status) { _this.setState({ status: status }); };
        _this.userColor = new colors_js_1.UserColor(_this.props.event.getSender());
        _this.openEditor = function () { return _this.setState({ responding: true }); };
        _this.closeEditor = function () { return _this.setState({ responding: false }); };
        _this.resend = function (_) { return client_js_1.default.client.resendEvent(_this.props.event); };
        _this.redactMessage = function () {
            // XXX also need to redact all subsequent edits that replace the original
            client_js_1.default.client.redactEvent(_this.props.event.getRoomId(), _this.props.event.getId());
        };
        _this.state = ({
            responding: false,
            status: props.event.getAssociatedStatus()
        });
        return _this;
    }
    MessageFrame.prototype.componentDidMount = function () {
        if (this.props.event.getAssociatedStatus())
            this.props.event.on("Event.status", this.handleStatus);
    };
    MessageFrame.prototype.componentWillUnmount = function () { this.props.event.off("Event.status", this.handleStatus); };
    MessageFrame.prototype.render = function (props, state) {
        // there's some cleverness involving involving the unstable clientside
        // relation aggregation mechanism that we're not taking advantage of
        // here. Element doesn't seem to use this for replacements yet either.
        var reactions = props.reactions[props.event.getId()]
            ? props.reactions[props.event.getId()]
                .filter(function (event) { return event.getContent()["m.relates_to"].rel_type === "m.annotation"; })
            : [];
        var isUser = client_js_1.default.client.getUserId() === props.event.getSender();
        return <preact_1.Fragment>
      <div data-event-status={isUser ? state.status : null} id={props.event.getId()} style={props.styleOverride || this.userColor.styleVariables} class={isUser ? "message-frame message-from-user" : "message-frame"}>
          {props.children}
          {state.status === "not_sent"
                ? <div class="message-frame-status">
              message not sent - <a onclick={this.resend}>resend?</a>
            </div>
                : null}
          <MessageDecoration event={props.event} reactions={reactions}>
            {/* XXX Should probably handle action menu visibility in state rather than CSS */}
            {props.displayOnly
                ? null
                : isUser
                    ? <ActionsOnOwnMessages canEdit={props.canEdit} responding={state.responding} openEditor={this.openEditor} redactMessage={this.redactMessage}/>
                    : <ActionsOnOthersMessages responding={state.responding} openEditor={this.openEditor} event={props.event} redactMessage={this.props.canRedact ? this.redactMessage : null} reactions={reactions}/>}
          </MessageDecoration>
      </div>
      {state.responding
                ? isUser
                    ? <MessageEditor closeEditor={this.closeEditor} event={props.event}/>
                    : <ReplyComposer closeEditor={this.closeEditor} getCurrentEdit={this.getCurrentEdit} event={props.event}/>
                : null}
    </preact_1.Fragment>;
    };
    return MessageFrame;
}(preact_1.Component));
exports.default = MessageFrame;
var MessageDecoration = /** @class */ (function (_super) {
    __extends(MessageDecoration, _super);
    function MessageDecoration() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MessageDecoration.prototype.shouldComponentUpdate = function (nextProps) {
        return (this.props.reactions.length !== nextProps.reactions.length);
    };
    MessageDecoration.prototype.render = function (props) {
        var _a, _b;
        var rtable = {};
        for (var _i = 0, _c = props.reactions; _i < _c.length; _i++) {
            var reaction = _c[_i];
            var emoji = (_b = (_a = reaction.getContent()) === null || _a === void 0 ? void 0 : _a["m.relates_to"]) === null || _b === void 0 ? void 0 : _b.key;
            if (!emoji)
                continue;
            rtable[emoji]
                ? rtable[emoji] = rtable[emoji] + 1
                : rtable[emoji] = 1;
        }
        var badges = [];
        for (var rkey in rtable) {
            badges.push(<Badge reactions={props.reactions} event={props.event} rtable={rtable} rkey={rkey}/>);
        }
        return <div class="message-decoration">
      {badges.length < 1
                ? null
                : <div class="message-reactions">
          <div>
            {badges}
          </div>
        </div>}
      {props.children}
    </div>;
    };
    return MessageDecoration;
}(preact_1.Component));
var Badge = /** @class */ (function (_super) {
    __extends(Badge, _super);
    function Badge() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.checkEmoji = function (_) { return _this.props.reactions.find(function (react) {
            var _a, _b;
            return react.getSender() === client_js_1.default.client.getUserId() &&
                ((_b = (_a = react.getContent()) === null || _a === void 0 ? void 0 : _a["m.relates_to"]) === null || _b === void 0 ? void 0 : _b.key) === _this.props.rkey;
        }); };
        _this.increment = function (_) {
            client_js_1.default.client.sendEvent(_this.props.event.getRoomId(), "m.reaction", {
                "m.relates_to": {
                    rel_type: "m.annotation",
                    event_id: _this.props.event.getId(),
                    key: _this.props.rkey
                }
            });
        };
        _this.decrement = function (reaction) {
            client_js_1.default.client.redactEvent(reaction.getRoomId(), reaction.getId());
        };
        _this.onClick = function (_) {
            var isMarked = _this.checkEmoji();
            if (isMarked)
                _this.decrement(isMarked);
            else
                _this.increment();
        };
        return _this;
    }
    Badge.prototype.render = function (props) {
        return <div onClick={this.onClick} class="emoji-badge"><span>{props.rtable[props.rkey]}</span><span>{props.rkey}</span></div>;
    };
    return Badge;
}(preact_1.Component));
var ActionsOnOthersMessages = /** @class */ (function (_super) {
    __extends(ActionsOnOthersMessages, _super);
    function ActionsOnOthersMessages(props) {
        var _this = _super.call(this, props) || this;
        _this.checkEmoji = function (emoji) { return _this.props.reactions.some(function (react) {
            var _a, _b;
            return react.getSender() === client_js_1.default.client.getUserId() &&
                ((_b = (_a = react.getContent()) === null || _a === void 0 ? void 0 : _a["m.relates_to"]) === null || _b === void 0 ? void 0 : _b.key) === emoji;
        }); };
        _this.actions = (0, preact_1.createRef)();
        _this.picker = (0, preact_1.createRef)();
        // necessary to clear component on mobile
        _this.clearCarefully = function (e) {
            if (e.target === _this.actions.current)
                return;
            if (_this.actions.current.contains(e.target))
                return;
            if (!document.body.contains(e.target))
                return;
            _this.clearSelecting();
        };
        _this.react = function (emoji) { return function (_) {
            _this.clearSelecting();
            if (_this.checkEmoji(emoji))
                return;
            // we bail out if there's already a reaction from me.
            client_js_1.default.client.sendEvent(_this.props.event.getRoomId(), "m.reaction", {
                "m.relates_to": {
                    rel_type: "m.annotation",
                    event_id: _this.props.event.getId(),
                    key: emoji
                }
            });
        }; };
        _this.handleEmojiClick = function (click) { return _this.react(click.detail.unicode)(); };
        _this.selectEmoji = function (_) { return _this.setState({ selecting: "emoji" }); };
        _this.pickEmoji = function (_) { return _this.setState({ selecting: "emoji-picker" }, function (_) { return _this.picker.current.shadowRoot.querySelector("input").focus(); }); };
        _this.handleEmojiKeydown = function (e) { return e.stopPropagation(); };
        _this.clearSelecting = function (_) { return _this.setState({ selecting: null }); };
        _this.state = { selecting: null };
        return _this;
    }
    ActionsOnOthersMessages.prototype.componentDidUpdate = function (_, prevState) {
        if (!prevState.selecting && this.state.selecting) {
            window.addEventListener('click', this.clearCarefully);
        }
        if (!prevState.selecting && !this.state.selecting) {
            window.removeEventListener('click', this.clearCarefully);
        }
    };
    ActionsOnOthersMessages.prototype.render = function (props, state) {
        switch (state.selecting) {
            case "emoji-picker": return <div ref={this.actions} onKeydown={this.handleEmojiKeydown} data-active class="message-actions">
          <emoji-picker ref={this.picker} onemoji-click={this.handleEmojiClick}/>
          <button key="a" style={{ position: "relative", left: "250px" }} onclick={this.clearSelecting}>{Icons.close}</button>
        </div>;
            case "emoji": return <div ref={this.actions} data-active class="message-actions">
          <button key="b" onclick={this.react("👍")}>👍</button>
          <button key="c" onclick={this.react("❤")}>❤</button>
          <button key="f" onclick={this.react("😲")}>😲</button>
          <button key="d" onclick={this.react("🤣")}>🤣</button>
          <button key="e" onclick={this.react("🤔")}>🤔</button>
          <button key="g" onclick={this.pickEmoji}>{Icons.moreHorizontal}</button>
        </div>;
            default: return <div ref={this.actions} class="message-actions">
          {!props.responding && <tooltip_js_1.default placement="top-start" theme="small" content="reply to this message">
            <button key="h" onclick={props.openEditor}>
              {Icons.reply}
            </button>
          </tooltip_js_1.default>}
          <tooltip_js_1.default placement="top-start" theme="small" content="React to this message">
            <button key="i" class="reaction" onclick={this.selectEmoji}>
            {Icons.like}
            </button>
          </tooltip_js_1.default>
          {props.redactMessage
                    ? <tooltip_js_1.default placement="top-end" theme="small" content="Delete this message">
                <button onclick={props.redactMessage} class="redact">
                {Icons.trash}
              </button>
              </tooltip_js_1.default>
                    : null}
        </div>;
        }
    };
    return ActionsOnOthersMessages;
}(preact_1.Component));
function ActionsOnOwnMessages(props) {
    return <div class="message-actions">
    {!props.responding && props.canEdit &&
            <tooltip_js_1.default placement="top-end" theme="small" content="Edit this message">
        <button onclick={props.openEditor}>
        {Icons.edit}
        </button>
      </tooltip_js_1.default>}
    <tooltip_js_1.default placement="top-end" theme="small" content="Delete this message">
      <button onclick={props.redactMessage} class="redact">
      {Icons.trash}
      </button>
    </tooltip_js_1.default>
  </div>;
}
var MessageEditor = /** @class */ (function (_super) {
    __extends(MessageEditor, _super);
    function MessageEditor(props) {
        var _this = _super.call(this, props) || this;
        _this.input = (0, preact_1.createRef)();
        _this.handleKeydown = function (e) {
            e.stopPropagation(); // don't propagate to global keypress handlers
            if (e.key === "Enter" && e.ctrlKey) {
                e.preventDefault();
                _this.sendResponse();
            }
        };
        _this.handleInput = function (event) { return _this.setValue(event.target.value, _this.resize()); };
        _this.setValue = function (value, cb) { return _this.setState({ value: value }, cb); };
        _this.resize = function () {
            _this.input.current.style.height = 'auto';
            _this.input.current.style.height = "".concat(_this.input.current.scrollHeight, "px");
        };
        _this.sendResponse = function () {
            var reader = new CommonMark.Parser();
            var writer = new CommonMark.HtmlRenderer();
            var parsed = reader.parse((0, processRegex_js_1.processRegex)(_this.state.value));
            var rendered = writer.render(parsed);
            var theReplacementContent = {
                body: _this.state.value,
                msgtype: "m.text",
                format: "org.matrix.custom.html",
                // TODO sanitize formattedBody before use
                formatted_body: rendered
            };
            if (Replies.isReply(_this.currentContent)) {
                theReplacementContent["m.relates_to"] = _this.currentContent["m.relates_to"];
                theReplacementContent.body = Replies.getReplyPrefixPlain(_this.currentContent) + theReplacementContent.body;
                theReplacementContent.formatted_body = Replies.getReplyPrefixHtml(_this.currentContent) + theReplacementContent.formatted_body;
            }
            var theEditEventContent = {
                // fallback for clients that don't handle edits.
                body: "* ".concat(_this.currentContent.body),
                msgtype: "m.text",
                "m.new_content": theReplacementContent,
                "m.relates_to": {
                    rel_type: "m.replace",
                    event_id: _this.props.event.getId()
                }
            };
            client_js_1.default.client.sendEvent(_this.props.event.getRoomId(), "m.room.message", theEditEventContent).then(function (_) { return _this.props.closeEditor(); });
        };
        _this.popupActions = {
            "@": function (props) { return <PopupMenu.Members roomId={_this.props.event.getRoomId()} {...props}/>; },
            ":": function (props) { return <PopupMenu.Emojis {...props}/>; }
        };
        _this.currentContent = props.event.getContent();
        _this.state = {
            value: Replies.isReply(_this.currentContent)
                ? Replies.stripFallbackPlainString(_this.currentContent.body)
                : _this.currentContent.body
        };
        return _this;
    }
    MessageEditor.prototype.componentDidMount = function () {
        //We need to toggle these to get everything computed so that the second resize works
        this.input.current.style.height = 'auto';
        this.input.current.style.height = "".concat(this.input.current.scrollHeight, "px");
        this.resize();
    };
    MessageEditor.prototype.render = function (_props, state) {
        return <div class="messageEditor">
      <PopupMenu.Menu textValue={state.value} textarea={this.input} actions={this.popupActions} setTextValue={this.setValue}/>
      <textarea ref={this.input} value={state.value} onkeydown={this.handleKeydown} oninput={this.handleInput} data-gramm="false" // disable grammarly
        />
      <button onclick={this.sendResponse}>Submit Changes</button>
      <button onclick={this.props.closeEditor}>Cancel</button>
    </div>;
    };
    return MessageEditor;
}(preact_1.Component));
var ReplyComposer = /** @class */ (function (_super) {
    __extends(ReplyComposer, _super);
    function ReplyComposer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.input = (0, preact_1.createRef)();
        _this.handleKeydown = function (e) {
            e.stopPropagation(); // don't propagate to global keypress handlers
            if (e.key === "Enter" && e.ctrlKey) {
                e.preventDefault();
                _this.sendResponse();
            }
        };
        _this.handleInput = function (event) {
            _this.setValue(event.target.value);
            _this.input.current.style.height = 'auto';
            _this.input.current.style.height = "".concat(_this.input.current.scrollHeight, "px");
        };
        _this.setValue = function (value, cb) { return _this.setState({ value: value }, cb); };
        _this.sendResponse = function () {
            var reader = new CommonMark.Parser();
            var writer = new CommonMark.HtmlRenderer();
            var parsed = reader.parse((0, processRegex_js_1.processRegex)(_this.state.value));
            var rendered = writer.render(parsed);
            client_js_1.default.client.sendMessage(_this.props.event.getRoomId(), {
                body: Replies.generateFallbackPlain(_this.props.event) + _this.state.value,
                formatted_body: Replies.generateFallbackHtml(_this.props.event) + rendered,
                format: "org.matrix.custom.html",
                msgtype: "m.text",
                "m.relates_to": {
                    "m.in_reply_to": {
                        event_id: _this.props.event.getId()
                    }
                }
            }).then(function (_) { return _this.props.closeEditor(); });
        };
        _this.popupActions = {
            "@": function (props) { return <PopupMenu.Members roomId={_this.props.event.getRoomId()} {...props}/>; },
            ":": function (props) { return <PopupMenu.Emojis {...props}/>; }
        };
        return _this;
    }
    ReplyComposer.prototype.render = function (_props, state) {
        return <div class="replyComposer">
      <PopupMenu.Menu textValue={state.value} textarea={this.input} setTextValue={this.setValue} actions={this.popupActions}/>
      <textarea ref={this.input} value={state.value} onkeydown={this.handleKeydown} oninput={this.handleInput} data-gramm="false" // disable grammarly
        />
      <button onclick={this.sendResponse}>Send Reply</button>
      <button onclick={this.props.closeEditor}>Cancel</button>
    </div>;
    };
    return ReplyComposer;
}(preact_1.Component));

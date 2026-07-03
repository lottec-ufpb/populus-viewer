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
exports.Flags = exports.Members = exports.Users = exports.Emojis = exports.Menu = void 0;
var preact_1 = require("preact");
var client_js_1 = require("./client.js");
var colors_js_1 = require("./utils/colors.js");
var emoji_picker_element_1 = require("emoji-picker-element");
require("./styles/popUpMenu.css");
var Menu = /** @class */ (function (_super) {
    __extends(Menu, _super);
    function Menu() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.cancel = function (_) { return _this.setState({ active: null }); };
        _this.handleInput = function (e) { return _this.props.actions[e.data]
            ? _this.setState({ active: _this.props.actions[e.data] })
            : null; };
        _this.insert = function (insertion, regex) {
            if (_this.props.setTextValue) {
                var selstart = _this.props.textarea.current.selectionStart;
                var selend = _this.props.textarea.current.selectionEnd;
                if (selstart === selend) {
                    var initialSegment = _this.props.textValue.slice(0, selend);
                    var terminalSegment = _this.props.textValue.slice(selend);
                    var newSegment_1 = initialSegment.replace(regex, insertion);
                    _this.props.setTextValue("".concat(newSegment_1).concat(terminalSegment), function (_) {
                        _this.props.textarea.current.focus();
                        _this.props.textarea.current.selectionEnd = newSegment_1.length;
                    });
                }
            }
            if (_this.props.getSelection)
                _this.props.getSelection(insertion);
            _this.cancel();
        };
        return _this;
    }
    Menu.prototype.componentDidMount = function () {
        var _a;
        if ((_a = this.props.textarea) === null || _a === void 0 ? void 0 : _a.current) {
            this.props.textarea.current.addEventListener("input", this.handleInput);
            this.props.textarea.current.addEventListener("click", this.cancel);
            this.props.textarea.current.addEventListener("blur", this.cancel);
        }
    };
    Menu.prototype.componentWillUnmount = function () {
        var _a;
        if ((_a = this.props.textarea) === null || _a === void 0 ? void 0 : _a.current) {
            this.props.textarea.current.removeEventListener("input", this.handleInput);
            this.props.textarea.current.removeEventListener("click", this.cancel);
            this.props.textarea.current.removeEventListener("blur", this.cancel);
        }
    };
    Menu.prototype.render = function (props, state) {
        if (state.active) {
            return state.active({
                insert: this.insert,
                cancel: this.cancel,
                textarea: props.textarea,
                textValue: props.textValue,
                below: props.below
            });
        }
    };
    return Menu;
}(preact_1.Component));
exports.Menu = Menu;
var Emojis = /** @class */ (function (_super) {
    __extends(Emojis, _super);
    function Emojis(props) {
        var _this = _super.call(this, props) || this;
        _this.handleKeydown = function (e) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                if (_this.state.selection + 1 < _this.state.popupItems.length) {
                    _this.setState(function (oldState) { return { selection: oldState.selection + 1 }; });
                }
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                if (_this.state.selection > 0) {
                    _this.setState(function (oldState) { return { selection: oldState.selection - 1 }; });
                }
            }
            if ((e.key === "Enter" || e.key === ":") &&
                _this.state.popupItems.length > 0) {
                e.preventDefault();
                _this.insertSelection();
            }
        };
        _this.handleKeyup = function (_) {
            var selstart = _this.props.textarea.current.selectionStart;
            var selend = _this.props.textarea.current.selectionEnd;
            if (selstart === selend) {
                var matches = _this.props.textValue.slice(0, selend).match(/:\S*$/);
                if (matches) {
                    var match_1 = matches[0].slice(1);
                    if (match_1.length < 2)
                        return _this.setState({ popupItems: [] });
                    _this.database.getEmojiBySearchQuery(match_1).then(function (emojis) {
                        _this.setState({
                            popupItems: emojis
                                .filter(function (emoji) { return emoji.version < 13; }) // For compatibility with older devices
                                .sort(function (a, b) {
                                if (a.shortcodes[0] === match_1)
                                    return -1;
                                if (b.shortcodes[0] === match_1)
                                    return 1;
                                return a.shortcodes[0].includes(match_1)
                                    ? (b.shortcodes[0].includes(match_1) ? 0 : -1)
                                    : (b.shortcodes[0].includes(match_1) ? 1 : 0);
                            }).slice(0, 3).map(function (emoji, idx) {
                                return <Emoji key={emoji.unicode} emoji={emoji} insert={_this.props.insert} selected={_this.state.selection === idx}/>;
                            })
                        });
                    });
                    return;
                }
            }
            _this.props.cancel();
        };
        _this.insertSelection = function (_) {
            var emoji = _this.state.popupItems[_this.state.selection].props.emoji.unicode;
            _this.props.insert(emoji, /:\S*$/);
        };
        _this.state = {
            popupItems: [],
            selection: 0
        };
        // not sure if this is too inefficient
        _this.database = new emoji_picker_element_1.Database();
        return _this;
    }
    Emojis.prototype.componentDidMount = function () {
        if (this.props.textarea) {
            this.props.textarea.current.addEventListener("keydown", this.handleKeydown);
            this.props.textarea.current.addEventListener("keyup", this.handleKeyup);
        }
    };
    Emojis.prototype.componentWillUnmount = function () {
        if (this.props.textarea) {
            this.props.textarea.current.removeEventListener("keydown", this.handleKeydown);
            this.props.textarea.current.removeEventListener("keyup", this.handleKeyup);
        }
    };
    Emojis.prototype.render = function (props, state) {
        if (this.state.popupItems.length > 0) {
            // We use a relatively positioned wrapper to keep the PUM in the document flow
            return <div style={{ top: "".concat(state.popupItems.length * 40, "px") }} id="popup-wrapper">
        <div id="popup-menu" style={props.below ? { top: "0px" } : { bottom: "0px" }}>
          {this.state.popupItems}
        </div>
      </div>;
        }
    };
    return Emojis;
}(preact_1.Component));
exports.Emojis = Emojis;
var Emoji = /** @class */ (function (_super) {
    __extends(Emoji, _super);
    function Emoji() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.insertEmoji = function (e) {
            e.preventDefault(); // try to prevent textarea losing focus
            _this.props.insert(_this.props.emoji.unicode, /:\S*$/);
        };
        return _this;
    }
    Emoji.prototype.render = function (props) {
        return <div onmousedown={this.insertEmoji} class={props.selected ? "popup-menu-item-selected-emoji popup-menu-item" : "popup-menu-item"}>
      <span class="popup-menu-item-emojishortcode"> :{props.emoji.shortcodes[0]}: </span>
      <span>•</span>
      <span class="popup-menu-item-emojiglyph"> {props.emoji.unicode} </span>
    </div>;
    };
    return Emoji;
}(preact_1.Component));
var Users = /** @class */ (function (_super) {
    __extends(Users, _super);
    function Users(props) {
        var _this = _super.call(this, props) || this;
        _this.handleKeydown = function (e) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                if (_this.state.selection + 1 < _this.state.popupItems.length) {
                    _this.setState(function (oldState) { return { selection: oldState.selection + 1 }; });
                }
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                if (_this.state.selection > 0) {
                    _this.setState(function (oldState) { return { selection: oldState.selection - 1 }; });
                }
            }
            if (e.key === "Enter" && _this.state.popupItems.length > 0) {
                e.preventDefault();
                _this.insertSelection();
            }
        };
        _this.insertSelection = function (_) {
            var userId = _this.state.popupItems[_this.state.selection].props.user.userId;
            _this.props.insert("".concat(userId, " "), /@\S*$/);
        };
        _this.handleKeyup = function (_) {
            var selstart = _this.props.textarea.current.selectionStart;
            var selend = _this.props.textarea.current.selectionEnd;
            if (selstart === selend) {
                var matches = _this.props.textValue.slice(0, selend).match(/@\S*$/);
                if (matches) {
                    var popupItems = _this.generatePopupItems(matches[0].substring(1));
                    var newState = { popupItems: popupItems };
                    if (popupItems.length < _this.state.selection + 1) {
                        newState.selection = Math.max(popupItems.length - 1, 0);
                    }
                    _this.setState(newState);
                    return;
                }
            }
            _this.props.cancel();
        };
        _this.state = {
            popupItems: [],
            selection: 0
        };
        return _this;
    }
    Users.prototype.componentDidMount = function () {
        if (this.props.textarea) {
            this.props.textarea.current.addEventListener("keydown", this.handleKeydown);
            this.props.textarea.current.addEventListener("keyup", this.handleKeyup);
        }
    };
    Users.prototype.componentWillUnmount = function () {
        if (this.props.textarea) {
            this.props.textarea.current.removeEventListener("keydown", this.handleKeydown);
            this.props.textarea.current.removeEventListener("keyup", this.handleKeyup);
        }
    };
    Users.prototype.generatePopupItems = function (value) {
        var _this = this;
        return client_js_1.default.client.getUsers()
            .filter(function (user) {
            return user.userId.includes(value.toLowerCase()) ||
                user.displayName.toLowerCase().includes(value.toLowerCase());
        })
            .slice(0, 3) // top 3
            .map(function (user, idx) { return <User insert={_this.props.insert} key={user.userId} selected={_this.state.selection === idx} user={user}/>; });
    };
    Users.prototype.render = function (props, state) {
        if (this.state.popupItems.length > 0) {
            // We use a relatively positioned wrapper to keep the PUM in the document flow
            return <div style={{ top: "".concat(state.popupItems.length * 40, "px") }} id="popup-wrapper">
        <div id="popup-menu" style={props.below ? { top: "0px" } : { bottom: "0px" }}>
          {this.state.popupItems}
        </div>
      </div>;
        }
    };
    return Users;
}(preact_1.Component));
exports.Users = Users;
var User = /** @class */ (function (_super) {
    __extends(User, _super);
    function User() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.colorFromId = new colors_js_1.UserColor(_this.props.user.userId);
        _this.insertUserId = function (e) {
            e.preventDefault(); // try to prevent textarea losing focus
            _this.props.insert("".concat(_this.props.user.userId, " "), /@\S*$/);
        };
        return _this;
    }
    User.prototype.render = function (props) {
        return <div onmousedown={this.insertUserId} style={this.colorFromId.styleVariables} class={props.selected ? "popup-menu-item-selected-user popup-menu-item" : "popup-menu-item"}>
      <span class="popup-menu-item-userid"> @{props.user.userId.split(":")[0].substring(1)} </span>
      <span>•</span>
      <span class="popup-menu-item-username"> {props.user.displayName} </span>
    </div>;
    };
    return User;
}(preact_1.Component));
var Members = /** @class */ (function (_super) {
    __extends(Members, _super);
    function Members(props) {
        var _this = _super.call(this, props) || this;
        _this.handleKeydown = function (e) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                if (_this.state.selection + 1 < _this.state.popupItems.length) {
                    _this.setState(function (oldState) { return { selection: oldState.selection + 1 }; });
                }
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                if (_this.state.selection > 0) {
                    _this.setState(function (oldState) { return { selection: oldState.selection - 1 }; });
                }
            }
            if (e.key === "Enter" && _this.state.popupItems.length > 0) {
                e.preventDefault();
                _this.insertSelection();
            }
        };
        _this.insertSelection = function (_) {
            var userId = _this.state.popupItems[_this.state.selection].props.member.userId;
            _this.props.insert("".concat(userId, " "), /@\S*$/);
        };
        _this.handleKeyup = function (_) {
            var selstart = _this.props.textarea.current.selectionStart;
            var selend = _this.props.textarea.current.selectionEnd;
            if (selstart === selend) {
                var matches = _this.props.textValue.slice(0, selend).match(/@\S*$/);
                if (matches) {
                    var popupItems = _this.generatePopupItems(matches[0].substring(1));
                    var newState = { popupItems: popupItems };
                    if (popupItems.length < _this.state.selection + 1) {
                        newState.selection = Math.max(popupItems.length - 1, 0);
                    }
                    _this.setState(newState);
                    return;
                }
            }
            _this.props.cancel();
        };
        _this.state = {
            popupItems: [],
            selection: 0
        };
        return _this;
    }
    Members.prototype.componentDidMount = function () {
        if (this.props.textarea) {
            this.props.textarea.current.addEventListener("keydown", this.handleKeydown);
            this.props.textarea.current.addEventListener("keyup", this.handleKeyup);
        }
    };
    Members.prototype.componentWillUnmount = function () {
        if (this.props.textarea) {
            this.props.textarea.current.removeEventListener("keydown", this.handleKeydown);
            this.props.textarea.current.removeEventListener("keyup", this.handleKeyup);
        }
    };
    Members.prototype.generatePopupItems = function (value) {
        var _this = this;
        var room = client_js_1.default.client.getRoom(this.props.roomId);
        if (room) {
            return room.getMembersWithMembership("join")
                .filter(function (member) {
                return member.userId.includes(value.toLowerCase()) ||
                    member.name.toLowerCase().includes(value.toLowerCase());
            })
                .slice(0, 3) // top 3
                .map(function (member, idx) { return <Member insert={_this.props.insert} key={member.userId} selected={_this.state.selection === idx} member={member}/>; });
        }
        return [];
    };
    Members.prototype.render = function (props, state) {
        if (this.state.popupItems.length > 0) {
            // We use a relatively positioned wrapper to keep the PUM in the document flow
            return <div style={{ top: "".concat(state.popupItems.length * 40, "px") }} id="popup-wrapper">
        <div id="popup-menu" style={props.below ? { top: "0px" } : { bottom: "0px" }}>
          {this.state.popupItems}
        </div>
      </div>;
        }
    };
    return Members;
}(preact_1.Component));
exports.Members = Members;
var Member = /** @class */ (function (_super) {
    __extends(Member, _super);
    function Member() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.colorFromId = new colors_js_1.UserColor(_this.props.member.userId);
        _this.insertUserId = function (e) {
            e.preventDefault(); // try to prevent textarea losing focus
            _this.props.insert("".concat(_this.props.member.userId, " "), /@\S*$/);
        };
        return _this;
    }
    Member.prototype.render = function (props) {
        return <div onmousedown={this.insertUserId} style={this.colorFromId.styleVariables} class={props.selected ? "popup-menu-item-selected-user popup-menu-item" : "popup-menu-item"}>
      <span class="popup-menu-item-userid"> @{props.member.userId.split(":")[0].substring(1)} </span>
      <span>•</span>
      <span class="popup-menu-item-username"> {props.member.name} </span>
    </div>;
    };
    return Member;
}(preact_1.Component));
var Flags = /** @class */ (function (_super) {
    __extends(Flags, _super);
    function Flags(props) {
        var _this = _super.call(this, props) || this;
        _this.handleKeydown = function (e) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                if (_this.state.selection + 1 < _this.state.popupItems.length) {
                    _this.setState(function (oldState) { return { selection: oldState.selection + 1 }; });
                }
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                if (_this.state.selection > 0) {
                    _this.setState(function (oldState) { return { selection: oldState.selection - 1 }; });
                }
            }
            if (e.key === "Enter" && _this.state.popupItems.length > 0) {
                e.preventDefault();
                _this.insertSelection();
            }
        };
        _this.insertSelection = function (_) {
            var keyword = _this.state.popupItems[_this.state.selection].props.flag.keyword;
            _this.props.insert("~".concat(keyword, " "), /~\S*$/);
        };
        _this.handleKeyup = function (_) {
            var selstart = _this.props.textarea.current.selectionStart;
            var selend = _this.props.textarea.current.selectionEnd;
            if (selstart === selend) {
                var matches = _this.props.textValue.slice(0, selend).match(/~\S*$/);
                if (matches) {
                    var popupItems = _this.generatePopupItems(matches[0].substring(1));
                    var newState = { popupItems: popupItems };
                    if (popupItems.length < _this.state.selection + 1) {
                        newState.selection = Math.max(popupItems.length - 1, 0);
                    }
                    _this.setState(newState);
                    return;
                }
            }
            _this.props.cancel();
        };
        _this.state = {
            popupItems: [],
            selection: 0
        };
        return _this;
    }
    Flags.prototype.componentDidMount = function () {
        if (this.props.textarea) {
            this.props.textarea.current.addEventListener("keydown", this.handleKeydown);
            this.props.textarea.current.addEventListener("keyup", this.handleKeyup);
        }
    };
    Flags.prototype.componentWillUnmount = function () {
        if (this.props.textarea) {
            this.props.textarea.current.removeEventListener("keydown", this.handleKeydown);
            this.props.textarea.current.removeEventListener("keyup", this.handleKeyup);
        }
    };
    Flags.prototype.generatePopupItems = function (value) {
        var _this = this;
        return this.props.flags
            .filter(function (flag) { return flag.keyword.includes(value); })
            .slice(0, 3) // top 3
            .map(function (flag, idx) { return <Flag insert={_this.props.insert} key={flag.keyword} selected={_this.state.selection === idx} flag={flag}/>; });
    };
    Flags.prototype.render = function (props, state) {
        if (this.state.popupItems.length > 0) {
            // We use a relatively positioned wrapper to keep the PUM in the document flow
            return <div style={{ top: "".concat(state.popupItems.length * 40, "px") }} id="popup-wrapper">
        <div id="popup-menu" style={props.below ? { top: "0px" } : { bottom: "0px" }}>
          {this.state.popupItems}
        </div>
      </div>;
        }
    };
    return Flags;
}(preact_1.Component));
exports.Flags = Flags;
var Flag = /** @class */ (function (_super) {
    __extends(Flag, _super);
    function Flag() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.insertFlag = function (e) {
            e.preventDefault(); // try to prevent textarea losing focus
            _this.props.insert("~".concat(_this.props.flag.keyword, " "), /~\S*$/);
        };
        return _this;
    }
    Flag.prototype.render = function (props) {
        return <div onmousedown={this.insertFlag} class={props.selected ? "popup-menu-item-selected-flag popup-menu-item" : "popup-menu-item"}>
      <span class="popup-menu-item-flag"> ~{props.flag.keyword} </span>
      <span>•</span>
      <span class="popup-menu-item-flag-description"> {props.flag.description} </span>
    </div>;
    };
    return Flag;
}(preact_1.Component));

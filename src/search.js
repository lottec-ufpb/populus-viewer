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
var Icons = require("./icons.js");
require("./styles/search.css");
var SearchBar = /** @class */ (function (_super) {
    __extends(SearchBar, _super);
    function SearchBar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.searchInput = _this.props.searchInput || (0, preact_1.createRef)();
        _this.keydownHandler = function (e) {
            var searchPredicate = _this.props.searchPredicate ||
                (function (e) { return e.key === "/" && !e.altKey && !e.ctrlKey; });
            if (searchPredicate(e)) {
                e.preventDefault();
                _this.searchInput.current.focus();
            }
        };
        _this.handleClear = function (e) {
            e.preventDefault();
            _this.props.setSearch("");
            _this.searchInput.current.focus();
        };
        _this.handleInputBlur = function (e) {
            _this.props.setFocus ? _this.props.setFocus(false) : null;
            _this.props.onBlur ? _this.props.onBlur(e) : null;
        };
        _this.handleInputFocus = function (e) {
            _this.props.setFocus ? _this.props.setFocus(true) : null;
            _this.props.onFocus ? _this.props.onFocus(e) : null;
        };
        _this.handleInputKeydown = function (e) {
            if (!e.altKey && !e.ctrlKey)
                e.stopPropagation(); // don't propagate to global keypress handlers
            if (e.key === "Esc" || e.key === "Escape")
                _this.searchInput.current.blur();
            if (e.key === "Enter" && _this.props.submit)
                _this.props.submit(_this.props.search);
        };
        _this.handleInput = function (e) { return _this.props.setSearch(e.target.value); };
        return _this;
    }
    SearchBar.prototype.componentDidMount = function () {
        document.addEventListener('keydown', this.keydownHandler);
    };
    SearchBar.prototype.componentWillUnmount = function () {
        document.removeEventListener('keydown', this.keydownHandler);
    };
    SearchBar.prototype.render = function (props, _) {
        return <div title={props.title} class="search-bar">
      <input ref={this.searchInput} value={props.search} onkeydown={this.handleInputKeydown} onInput={this.handleInput} onBlur={this.handleInputBlur} onFocus={this.handleInputFocus}/>
      <div class={"search-icon"}>{Icons.search}</div>
      <div onmousedown={this.handleClear} title={props.search ? "Clear current search" : null} class={"right-decoration"}>
        {props.search
                ? Icons.close
                : props.hint ? <span class="search-hint">{props.hint}</span> : null}
      </div>
    </div>;
    };
    return SearchBar;
}(preact_1.Component));
exports.default = SearchBar;

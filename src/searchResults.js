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
require("./styles/searchResults.css");
var Icons = require("./icons.js");
var history_js_1 = require("./history.js");
var search_js_1 = require("./search.js");
var SearchResults = /** @class */ (function (_super) {
    __extends(SearchResults, _super);
    function SearchResults(props) {
        var _this = _super.call(this, props) || this;
        _this.resultListing = (0, preact_1.createRef)();
        _this.searchInput = (0, preact_1.createRef)();
        _this.setFocus = function (focus) { return _this.setState({ focusedResult: focus }); };
        _this.focusNext = function (_) {
            if (_this.state.focusedResult === null)
                _this.setFocus(0);
            else if (_this.state.focusedResult + 1 < _this.state.searchResults.length)
                _this.setFocus(_this.state.focusedResult + 1);
        };
        _this.focusPrev = function (_) {
            if (_this.state.focusedResult === null)
                _this.setFocus(_this.state.searchResults.length - 1);
            if (_this.state.focusedResult > 0)
                _this.setFocus(_this.state.focusedResult - 1);
        };
        _this.handleScroll = function (_) {
            var toBottom = _this.resultListing.current.scrollHeight - _this.resultListing.current.clientHeight - _this.resultListing.current.scrollTop;
            if (toBottom < 100 && !_this.limitRaised) {
                _this.limitRaised = true;
                _this.setState(function (oldState) { return { searchLimit: oldState.searchLimit + 20 }; });
            }
        };
        _this.handleKeydown = function (e) {
            if (e.altKey && !e.shiftKey && e.key === 'Tab')
                _this.focusNext();
            if (e.altKey && e.shiftKey && e.key === 'Tab')
                _this.focusPrev();
        };
        _this.handleBlur = function (_) {
            if (_this.props.searchString.length < 1)
                _this.props.endSearch();
        };
        _this.state = {
            searchResults: [],
            searchLimit: 20,
            focusedResult: null
        };
        return _this;
    }
    SearchResults.prototype.componentDidMount = function () {
        this.initializeSearch();
        document.addEventListener('keydown', this.handleKeydown);
        this.searchInput.current.focus();
    };
    SearchResults.prototype.componentWillUnmount = function () {
        document.removeEventListener('keydown', this.handleKeydown);
    };
    SearchResults.prototype.componentDidUpdate = function (prevProps, prevState) {
        if (this.props.searchString !== prevProps.searchString && this.props.pdfText)
            this.initializeSearch();
        else if (this.state.searchLimit > prevState.searchLimit && this.props.pdfText)
            this.expandSearch();
    };
    SearchResults.prototype.resetSearch = function () {
        this.setState({
            searchResults: [],
            searchLimit: 20,
            focusedResult: null
        });
    };
    SearchResults.prototype.initializeSearch = function () {
        if (this.props.searchString.length < 3) {
            this.resetSearch();
            return;
        }
        var searchResults = [];
        // We strip out all non-alphanumerics, for fuzzy search
        var word = this.props.searchString.toLowerCase().replace(/[^a-zA-Z0-9]/gm, "");
        for (var _i = 0, _a = Object.entries(this.props.pdfText); _i < _a.length; _i++) {
            var _b = _a[_i], page = _b[0], text = _b[1];
            var cleantext = text.toLowerCase().replace(/[^a-zA-Z0-9]/gm, "");
            var contexts = [];
            var idx = cleantext.indexOf(word);
            var idx2 = idx + word.length;
            while (idx > -1) {
                var before = true;
                var start = 0;
                var end = 0;
                var counter = 0;
                for (var _c = 0, text_1 = text; _c < text_1.length; _c++) {
                    var letter = text_1[_c];
                    if (before && counter === idx)
                        before = false;
                    if (!before && counter === idx2) {
                        contexts.push(text.slice(Math.max(0, start - 15), end + 40));
                        idx = cleantext.indexOf(word, idx + 1);
                        idx2 = idx + word.length;
                        break;
                    }
                    if (before)
                        start++;
                    if (letter.match(/[a-zA-Z0-9]/))
                        counter++;
                    end++;
                }
            }
            if (contexts.length > 0)
                searchResults.push({ page: page, contexts: contexts });
            if (searchResults.length > 20)
                break;
        }
        this.setState({ focusedResult: null, searchResults: searchResults, searchLimit: 20 });
    };
    SearchResults.prototype.expandSearch = function () {
        var _this = this;
        if (this.props.searchString.length < 3) {
            this.resetSearch();
            return;
        }
        var searchResults = this.state.searchResults;
        var oldPage = searchResults.slice(-1)[0].page;
        var word = this.props.searchString.toLowerCase().replace(/[^a-zA-Z0-9]/gm, "");
        for (var _i = 0, _a = Object.entries(this.props.pdfText); _i < _a.length; _i++) {
            var _b = _a[_i], page = _b[0], text = _b[1];
            if (parseInt(page, 10) > parseInt(oldPage, 10)) {
                var cleantext = text.toLowerCase().replace(/[^a-zA-Z0-9]/gm, "");
                var idx = cleantext.indexOf(word);
                var idx2 = idx + word.length;
                var contexts = [];
                while (idx > -1) {
                    var before = true;
                    var start = 0;
                    var end = 0;
                    var counter = 0;
                    for (var _c = 0, text_2 = text; _c < text_2.length; _c++) {
                        var letter = text_2[_c];
                        if (before && counter === idx)
                            before = false;
                        if (!before && counter === idx2) {
                            contexts.push(text.slice(Math.max(0, start - 15), end + 40));
                            idx = cleantext.indexOf(word, idx + 1);
                            idx2 = idx + word.length;
                            break;
                        }
                        if (before)
                            start++;
                        if (letter.match(/[a-zA-Z0-9]/))
                            counter++;
                        end++;
                    }
                }
                if (contexts.length > 0)
                    searchResults.push({ page: page, contexts: contexts });
                if (searchResults.length > this.state.searchLimit)
                    break;
            }
        }
        this.setState({ searchResults: searchResults }, function (_) {
            _this.limitRaised = false;
        });
    };
    SearchResults.prototype.render = function (props, state) {
        var _this = this;
        return <div ref={this.resultListing} id="pdf-search-result-panel" onscroll={this.handleScroll} class={props.class}>
      {this.props.pdfText
                ? <preact_1.Fragment>
          <div id="pdf-search-term">
            <div><b>Search Results For:</b></div>
            <search_js_1.default hint="Alt-/" searchInput={this.searchInput} onBlur={this.handleBlur} search={props.searchString} setSearch={props.setSearch}/>
          </div>
          {state.searchResults.map(function (result, idx) { return <SearchResult roomFocused={props.roomFocused} resourceAlias={props.resourceAlias} key={result.page} result={result} hideListing={props.hideListing} focusedResult={state.focusedResult} setFocus={_this.setFocus} index={idx}/>; })}
        </preact_1.Fragment>
                : <div id="pdf-search-warn"><b>Indexing Pdf, Please Wait...</b></div>}
    </div>;
    };
    return SearchResults;
}(preact_1.Component));
exports.default = SearchResults;
var SearchResult = /** @class */ (function (_super) {
    __extends(SearchResult, _super);
    function SearchResult() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.focus = function (_) {
            _this.props.setFocus(_this.props.index);
            var newUrl = "/".concat(encodeURIComponent(_this.props.resourceAlias), "/").concat(_this.props.result.page, "/").concat(_this.props.roomFocused ? _this.props.roomFocused : "");
            history_js_1.default.push(newUrl);
            _this.result.current.scrollIntoView();
            var narrow = document.body.offsetWidth <= 600;
            if (narrow)
                _this.props.hideListing();
        };
        _this.result = (0, preact_1.createRef)();
        return _this;
    }
    SearchResult.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.focusedResult !== prevProps.focusedResult &&
            this.props.index === this.props.focusedResult) {
            this.focus();
        }
    };
    SearchResult.prototype.render = function (props) {
        return <div ref={this.result} onClick={this.focus} data-focused-result={props.index === props.focusedResult} class="pdf-search-result">
      {props.result.contexts.map(function (context, idx) {
                return <div key={"".concat(props.result.page, "-").concat(idx)} class="result-context">… {context} …</div>;
            })}
      <div class="page-data">page: {props.result.page} </div>
    </div>;
    };
    return SearchResult;
}(preact_1.Component));

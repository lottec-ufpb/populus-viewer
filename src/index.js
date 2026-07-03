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
var preact_router_1 = require("preact-router");
var welcome_js_1 = require("./welcome.js");
var login_js_1 = require("./login.js");
var contentView_js_1 = require("./contentView.js");
var splash_js_1 = require("./splash.js");
var modal_js_1 = require("./modal.js");
var toast_js_1 = require("./toast.js");
var history_js_1 = require("./history.js");
var client_js_1 = require("./client.js");
require("./assets.js");
require("./styles/global.css");
require("./styles/colors.css");
var PopulusViewer = /** @class */ (function (_super) {
    __extends(PopulusViewer, _super);
    function PopulusViewer() {
        var _this = _super.call(this) || this;
        _this.setInitializationStage = function (s) { return _this.setState({ initializationStage: s }); };
        _this.logoutHandler = function (_) {
            localStorage.clear();
            client_js_1.default.restart();
            _this.setState({ loggedIn: false });
        };
        _this.loginHandler = function (_) {
            client_js_1.default.client.on("Session.logged_out", _this.logoutHandler);
            localStorage.setItem('accessToken', client_js_1.default.client.getAccessToken());
            localStorage.setItem('userId', client_js_1.default.client.getUserId());
            client_js_1.default.client.startClient().then(function (_) {
                client_js_1.default.client.getMediaConfig().then(function (conf) { return client_js_1.default.mediaConfig = conf; });
                _this.setState({
                    initializationStage: "performing initial sync",
                    loggedIn: true
                });
            });
        };
        _this.state = {
            initializationStage: "connecting to database",
            loggedIn: true
            // the presumption is that we're logged in until it's clear that we're
            // not. This avoids flashing the login view while verifying that we're
            // logged in.
        };
        var queryParameters = new URLSearchParams(window.location.search);
        _this.loginToken = queryParameters.get('loginToken');
        if (localStorage.getItem('scrollbars'))
            document.documentElement.dataset.scrollbars = localStorage.getItem('scrollbars');
        else
            document.documentElement.dataset.scrollbars = "hidden";
        if (client_js_1.default.isResumable())
            client_js_1.default.initClient().then(_this.loginHandler);
        else if (_this.loginToken) {
            client_js_1.default.initClient().then(function (_) { return client_js_1.default.client.loginWithToken(_this.loginToken, _this.loginHandler); });
        }
        else
            _this.setState({ loggedIn: false });
        return _this;
    }
    PopulusViewer.prototype.render = function (_props, state) {
        var content = !state.loggedIn
            ? <login_js_1.default loginHandler={this.loginHandler}/>
            : !(state.initializationStage === "initialized")
                ? <splash_js_1.default initializationStage={state.initializationStage} setInitializationStage={this.setInitializationStage} logoutHandler={this.logoutHandler}/>
                : <preact_router_1.default history={history_js_1.default.history}>
          <welcome_js_1.default path="/" logoutHandler={this.logoutHandler}/>
          <contentView_js_1.default path="/:resourceAlias/:resourcePosition?/:roomFocused?/:eventFocused?"/>
        </preact_router_1.default>;
        return <preact_1.Fragment>
        <modal_js_1.default />
        <toast_js_1.default />
        {content}
    </preact_1.Fragment>;
    };
    return PopulusViewer;
}(preact_1.Component));
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('service-worker.js').then(function (_) {
            console.log('[Service Worker] registered');
        }).catch(function (registrationError) {
            console.log('[Service Worker] failed to register: ', registrationError);
        });
    });
    navigator.serviceWorker.ready.then(function (registration) {
        registration.active.postMessage({
            type: 'SET_AUTH_TOKEN',
            token: localStorage.getItem('accessToken'),
        });
        console.log("Auth token sent to service worker.");
    });
}
function recaptchaHandler(recaptchaToken) {
    window.dispatchEvent(new CustomEvent('recaptcha', { detail: recaptchaToken }));
}
window.recaptchaHandler = recaptchaHandler; // needs to be global for the google callback
(0, preact_1.render)(<PopulusViewer />, document.body);

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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var preact_1 = require("preact");
require("./styles/login.css");
var constants_js_1 = require("./constants.js");
var client_js_1 = require("./client.js");
var colors_js_1 = require("./utils/colors.js");
var toast_js_1 = require("./toast.js");
var Matrix = require("matrix-js-sdk");
var Icons = require("./icons.js");
function discoverServer(domain) {
    return __awaiter(this, void 0, void 0, function () {
        var clientConfig;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Matrix.AutoDiscovery.findClientConfig(domain)];
                case 1:
                    clientConfig = _a.sent();
                    if (!(clientConfig["m.homeserver"].state !== "SUCCESS")) return [3 /*break*/, 3];
                    if (!domain.includes("://"))
                        domain = "https://" + domain;
                    console.log(domain);
                    return [4 /*yield*/, Matrix.AutoDiscovery.fromDiscoveryConfig({ "m.homeserver": { "base_url": domain } })];
                case 2:
                    clientConfig = _a.sent();
                    _a.label = 3;
                case 3:
                    if (clientConfig["m.homeserver"].state !== "SUCCESS")
                        throw Error("failed autodiscovery");
                    localStorage.setItem("baseUrl", clientConfig["m.homeserver"].base_url);
                    return [2 /*return*/];
            }
        });
    });
}
var LoginView = /** @class */ (function (_super) {
    __extends(LoginView, _super);
    function LoginView(props) {
        var _this = _super.call(this, props) || this;
        _this.switchView = function (switchTo) { return function (e) {
            if (e)
                e.preventDefault();
            _this.setState({ registering: switchTo });
        }; };
        _this.setServer = function (server, callback) { return _this.setState({ server: server }, callback); };
        _this.setName = function (name) { return _this.setState({ name: name }); };
        _this.setPassword = function (password) { return _this.setState({ password: password }); };
        _this.loginWrapper = (0, preact_1.createRef)();
        _this.loginElement = (0, preact_1.createRef)();
        _this.resizeObserver = new ResizeObserver(function (_) { return _this.resize(); });
        _this.resize = function (_) { _this.loginWrapper.current.style.height = "".concat(_this.loginElement.current.scrollHeight, "px"); };
        var queryParameters = new URLSearchParams(window.location.search);
        _this.state = {
            name: "",
            password: "",
            server: queryParameters.get('server') || ""
        };
        return _this;
    }
    LoginView.prototype.componentDidUpdate = function () {
        this.resizeObserver.disconnect();
        this.resizeObserver.observe(this.loginElement.current);
    };
    LoginView.prototype.componentWillUnmount = function () { this.resizeObserver.disconnect(); };
    LoginView.prototype.render = function (props, state) {
        var theProps = {
            setServer: this.setServer,
            server: state.server,
            setName: this.setName,
            name: state.name,
            setPassword: this.setPassword,
            password: state.password,
            loginHandler: props.loginHandler,
            switchView: this.switchView,
            loginElement: this.loginElement,
        };
        var mainCard = state.registering === "register"
            ? <Registration {...theProps}/>
            : <Login {...theProps}/>;
        return <div id="login-container"><BackgroundDecorations /><div id="login-wrapper" ref={this.loginWrapper}>{mainCard}</div></div>;
    };
    return LoginView;
}(preact_1.Component));
exports.default = LoginView;
function BackgroundDecorations() {
    var _this = this;
    clearTimeout(this.debounceLockTimeout);
    this.debounceLockTimeout = setTimeout(function (_) { return _this.debounceLock = false; }, 500);
    if (this.debounceLock)
        return this.memo;
    this.debounceLock = true;
    var circles = [];
    if (document.body.offsetWidth > 600)
        for (var i = 0; i < (document.body.offsetWidth / 10); i++) {
            var roll = Math.random();
            var color = new colors_js_1.UserColor(roll.toString());
            var width = Math.max(600 * roll, 100);
            var offset = Math.max(50 * Math.random());
            circles.push(<svg height="50" width={width + 50}>
      <rect x={offset} width={width} height={25} style={"opacity:.1; fill: ".concat(roll < .60 ? color.solid : "transparent")}/>
    </svg>);
        }
    this.memo = <div id="login-backdrop">{circles}</div>;
    return this.memo;
}
var Login = /** @class */ (function (_super) {
    __extends(Login, _super);
    function Login(props) {
        var _this = _super.call(this, props) || this;
        _this.handleSubmit = function (e) {
            e.preventDefault();
            _this.setState({ submitting: true });
            (_this.props.server
                ? discoverServer(_this.props.server)
                : Promise.resolve(localStorage.setItem("baseUrl", constants_js_1.serverRoot))).then(function () { return client_js_1.default.initClient(); })
                .then(function (client) { return client.loginWithPassword(_this.props.name.toLowerCase(), _this.props.password); })
                .then(_this.props.loginHandler)
                .catch(function (e) {
                _this.setState({ submitting: false });
                window.alert(e);
            });
        };
        _this.queryServers = function (_) {
            // we spawn a control token here to be sure to only mark things as failed
            // if there's not another query already going
            var flowControlToken = {};
            _this.flowControl = flowControlToken;
            (_this.props.server
                ? discoverServer(_this.props.server)
                : Promise.resolve(localStorage.setItem("baseUrl", constants_js_1.serverRoot))).then(function () { return client_js_1.default.initClient(); })
                .then(function (client) { return client.loginFlows(); })
                .then(_this.handleFlows)
                .catch(function () { return _this.flowControl === flowControlToken
                ? _this.setState({ loading: "failed" })
                : null; });
        };
        _this.handleFlows = function (flows) {
            var theSSO = flows.flows.find(function (flow) { return flow.type === "m.login.sso"; });
            if (!theSSO) {
                _this.setState({ loading: null });
                return;
            }
            _this.setState({
                loading: null,
                SSOProviders: theSSO.identity_providers
            });
        };
        _this.trySSO = function (idpId, server, e) {
            e === null || e === void 0 ? void 0 : e.preventDefault();
            (server ? discoverServer(server) : Promise.resolve(null))
                .then(function () { return client_js_1.default.client || client_js_1.default.initClient(); })
                .then(function (client) { return window.location.replace(client.getSsoLoginUrl(window.location.href, "sso", idpId)); });
        };
        _this.setServer = function (v) {
            clearTimeout(_this.serverTimeout);
            if (v.match(/[^/]*\.[^/]*/) || v === "") {
                _this.setState({
                    SSOProviders: [],
                    loading: "loading"
                });
                _this.props.setServer(v, function (_) {
                    _this.serverTimeout = setTimeout(_this.queryServers, 200);
                });
            }
            else {
                _this.props.setServer(v);
                _this.setState({
                    SSOProviders: [],
                    loading: v.length > 0 ? "badurl" : null
                });
            }
        };
        _this.canSubmit = function (_) {
            if (_this.state.loading)
                return false;
            if (_this.props.password.length < 8)
                return false;
            if (/[^a-zA-Z0-9._=/]/.test(_this.props.name))
                return false;
            return true;
        };
        var queryParameters = new URLSearchParams(window.location.search);
        _this.state = {
            SSOProviders: [],
            loading: false
        };
        if (_this.props.server && queryParameters.get("sso")) {
            _this.doingSSO = true;
            _this.trySSO(queryParameters.get("sso"), queryParameters.get("server"));
        }
        return _this;
    }
    Login.prototype.componentDidMount = function () {
        if (this.props.server)
            this.queryServers();
    };
    Login.prototype.render = function (props, state) {
        var _this = this;
        var connectionMessage = state.loading === "loading"
            ? "loading server information..."
            : state.loading === "failed"
                ? "couldn't connect to server"
                : state.loading === "badurl"
                    ? "the server name should look like 'matrix.org'"
                    : null;
        if (this.doingSSO)
            return <div id="login-sso-loader">Redirecting...</div>;
        return <div ref={props.loginElement} id="login">
      <h3>Login To Populus</h3>
      <form id="loginForm" onSubmit={this.handleSubmit}>
        <UserData connectionMessage={connectionMessage} setServer={this.setServer} server={props.server} setPassword={props.setPassword} password={props.password} setName={props.setName} name={props.name}/>
        <div>
          <button disabled={!this.canSubmit()} class="styled-button">Login</button>
        </div>
      </form>
      {state.SSOProviders.length > 0
                ? <preact_1.Fragment>
            <h4>Or, login via:</h4>
            <div id="login-sso-providers">
              {state.SSOProviders.map(function (provider) {
                        var iconHttpURI = null;
                        if (provider.icon)
                            iconHttpURI = Matrix.getHttpUriForMxc(localStorage.getItem("baseUrl"), provider.icon, 40, 40, "crop");
                        return <div onclick={function (e) { return _this.trySSO(provider.id, null, e); }} class="login-sso-listing" key={provider.id}>
                      {iconHttpURI
                                ? <img class="sso-icon" width="40" height="40" src={iconHttpURI}/>
                                : Icons.login}
                      <a class="sso-name" href={"?server=".concat(encodeURIComponent(props.server), "&sso=").concat(encodeURIComponent(provider.id))}>
                      {provider.name}
                      </a>
                      </div>;
                    })}
            </div>
          </preact_1.Fragment>
                : null}
      <div id="login-options">
        <hr class="styled-rule"/>
        <span>Don't have an account? </span>
        <a disabled={state.submitting} onClick={props.switchView("register")}>Register</a>
      </div>
    </div>;
    };
    return Login;
}(preact_1.Component));
var Registration = /** @class */ (function (_super) {
    __extends(Registration, _super);
    function Registration(props) {
        var _this = _super.call(this, props) || this;
        _this.beginRegistrationFlow = function (e) { return __awaiter(_this, void 0, void 0, function () {
            var err_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        e.preventDefault();
                        this.setState({ registrationStage: "retrieving-auth" });
                        if (!this.props.server) return [3 /*break*/, 2];
                        return [4 /*yield*/, discoverServer(this.props.server)];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        localStorage.setItem("baseUrl", constants_js_1.serverRoot);
                        _b.label = 3;
                    case 3: return [4 /*yield*/, client_js_1.default.initClient()];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        _b.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, client_js_1.default.client.register(this.props.name.toLowerCase(), this.props.password, undefined, {})];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        err_1 = _b.sent();
                        if (((_a = err_1.data) === null || _a === void 0 ? void 0 : _a.session) && err_1.data.params["m.login.recaptcha"]) {
                            console.log(err_1.data);
                            this.authSession = err_1.data.session;
                            this.recaptchaKey = err_1.data.params["m.login.recaptcha"].public_key;
                            this.setState({ registrationStage: "awaiting-recaptcha" });
                        }
                        else {
                            switch (err_1.name) {
                                // should analyze for other errors here.
                                case "ConnectionError": {
                                    toast_js_1.default.set(<preact_1.Fragment>
              <h3 id="toast-header">Can't connect</h3>
              <div><p>Tried to connect to a server at {client_js_1.default.client.getHomeserverUrl()}</p><p> Double-check that address?</p></div>
              </preact_1.Fragment>);
                                    break;
                                }
                                case "M_USER_IN_USE": {
                                    toast_js_1.default.set(<preact_1.Fragment>
              <h3 id="toast-header">Can't register</h3>
              <div><p>Sorry, the name <code>{this.props.name}</code> is already in use at <code>{client_js_1.default.client.getHomeserverUrl()}</code></p><p> Try a different name or server?</p></div>
              </preact_1.Fragment>);
                                    this.props.setName("");
                                    break;
                                }
                                default:
                                    toast_js_1.default.set(<preact_1.Fragment>
              <h3 id="toast-header">Something went wrong</h3>
              <div>Sorry, here's the error</div>
              <pre>{err_1.name}: {err_1.message}</pre>
              </preact_1.Fragment>);
                            }
                            this.setState({ registrationStage: "awaiting-server" });
                        }
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        }); };
        _this.recaptchaHandler = function (e) {
            e.preventDefault();
            _this.setState({ registrationStage: "registering" });
            client_js_1.default.client.register(_this.props.name.toLowerCase(), _this.props.password, _this.authSession, {
                type: "m.login.recaptcha",
                response: e.detail
            }).catch(_this.handleDummy)
                .then(function (_) { return client_js_1.default.client.loginWithPassword(_this.props.name.toLowerCase(), _this.props.password); })
                .then(_this.props.loginHandler)
                .catch(window.alert);
        };
        _this.canSubmit = function (_) {
            if (_this.props.password.length < 8)
                return false;
            if (/[^a-zA-Z0-9._=/]/.test(_this.props.name))
                return false;
            return true;
        };
        _this.handleDummy = function (err) {
            console.log(err.data);
            var dummyAvailable = function (data) {
                if (data.flows && data.completed) {
                    return data.flows.some(function (flow) {
                        var remaining = flow.stages.filter(function (x) { return !data.completed.includes(x); });
                        return remaining.length === 1 && remaining.includes("m.login.dummy");
                    });
                }
                return false;
            };
            if (dummyAvailable(err.data)) {
                return client_js_1.default.client.register(_this.props.name.toLowerCase(), _this.password, _this.authSession, {
                    type: "m.login.dummy"
                });
            }
            throw new Error("Error: can't complete this registration flow");
        };
        _this.state = {
            registrationStage: "awaiting-server"
        };
        _this.recaptchaHandler = _this.recaptchaHandler.bind(_this);
        return _this;
    }
    Registration.prototype.componentDidMount = function () { window.addEventListener('recaptcha', this.recaptchaHandler); };
    Registration.prototype.componentWillUnmount = function () { window.removeEventListener('recaptcha', this.recaptchaHandler); };
    Registration.prototype.render = function (props, state) {
        switch (state.registrationStage) {
            case "retrieving-auth": {
                return <div ref={props.loginElement} id="registration">
          <div id="registeringFeedback">Retrieving Authentication Procedures...</div>
        </div>;
            }
            case "registering": {
                return <div ref={props.loginElement} id="registration">
          <div id="registeringFeedback">Registering Account...</div>
        </div>;
            }
            case "awaiting-recaptcha": {
                return <div ref={props.loginElement} id="registration">
          <form id="registerForm">
            <div id="theRecaptcha">
              Complete this Recaptcha to finish registration
              <div class="g-recaptcha" data-sitekey={this.recaptchaKey} data-callback="recaptchaHandler"/>
            </div>
            <hl style="styled-rule"/>
            <div>OR, <button class="styled-button" onClick={props.switchView("login")}>Login With Existing Account</button></div>
            <script src="https://www.google.com/recaptcha/api.js" async defer/>
          </form>
        </div>;
            }
            case "awaiting-server": {
                return <div ref={props.loginElement} id="registration">
          <h3>Register an account</h3>
          <form onSubmit={this.beginRegistrationFlow} id="registerForm">
            <UserData newAccount={true} setServer={props.setServer} server={props.server} setPassword={props.setPassword} password={props.password} setName={props.setName} name={props.name}/>
            <div><button disabled={!this.canSubmit()} class="styled-button">Register a New Account</button></div>
            <div id="login-options">
              <hr class="styled-rule"/>
              <span>Already have an account? </span>
              <a onClick={props.switchView("login")}>
                Login With Existing Account
              </a>
            </div>
          </form>
        </div>;
            }
        }
    };
    return Registration;
}(preact_1.Component));
var UserData = /** @class */ (function (_super) {
    __extends(UserData, _super);
    function UserData() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.usernameInput = (0, preact_1.createRef)();
        _this.passwordInput = (0, preact_1.createRef)();
        _this.validateUsername = function (e) {
            _this.props.setName(e.target.value);
            if (/[^a-zA-Z0-9._=/]/.test(e.target.value)) {
                _this.usernameInput.current.setCustomValidity("Bad Character");
                _this.setState({ usernameMessage: "Usernames can include only a-z, 0-9, =, _ or '.'" });
            }
            else {
                _this.usernameInput.current.setCustomValidity("");
                _this.setState({ usernameMessage: null });
            }
        };
        _this.validatePassword = function (e) {
            _this.props.setPassword(e.target.value);
            if (e.target.value.length < 8 && e.target.value.length > 0) {
                _this.passwordInput.current.setCustomValidity("Bad Password");
                _this.setState({ passwordMessage: "Passwords must be at least 8 characters" });
            }
            else {
                _this.passwordInput.current.setCustomValidity("");
                _this.setState({ passwordMessage: null });
            }
        };
        _this.handleFocus = function (e) { window.innerHeight < 450 && e.target.scrollIntoView({ block: "center" }); };
        _this.handleServerInput = function (e) { return _this.props.setServer(e.target.value); };
        return _this;
    }
    UserData.prototype.render = function (props, state) {
        return (<preact_1.Fragment>
        <label htmlFor="servername">Server</label>
        <input class="styled-input" value={props.server} onfocus={this.handleFocus} oninput={this.handleServerInput} type="text" id="servername" name="servername" placeholder="example.org"/>
        <div class="userdata-form-info">{props.connectionMessage}</div>
        <label htmlFor="username">Username</label>
        <input class="styled-input" autocomplete="username" value={props.name} onfocus={this.handleFocus} onInput={this.validateUsername} type="text" ref={this.usernameInput} id="username" name="username"/>
        <div class="userdata-form-info">{state.usernameMessage}</div>
        <label htmlFor="password">Password</label>
        <input class="styled-input" autocomplete={props.newAccount ? "new-password" : "current-password"} onfocus={this.handleFocus} value={props.password} oninput={this.validatePassword} type="password" ref={this.passwordInput} id="password" name="password"/>
        <div class="userdata-form-info">{state.passwordMessage}</div>
      </preact_1.Fragment>);
    };
    return UserData;
}(preact_1.Component));

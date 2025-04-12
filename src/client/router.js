"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
var header_js_1 = require("./header.js");
var Router = /** @class */ (function () {
    function Router(routes) {
        this.routes = routes;
        this.init();
    }
    Router.prototype.init = function () {
        var _this = this;
        window.addEventListener("DOMContentLoaded", function () {
            var path = location.hash.slice(1) || "/";
            console.log("[INFO] initial page load: ".concat(path));
            _this.loadRoute(path);
        });
        window.addEventListener("hashchange", function () {
            console.log("[INFO] Navigating to: ".concat(location.hash.slice(1)));
            _this.loadRoute(location.hash.slice(1));
        });
        window.addEventListener("popstate", function () {
            console.log("[INFO] Navigating to: ".concat(location.hash.slice(1)));
            _this.loadRoute(location.hash.slice(1));
        });
    };
    Router.prototype.navigate = function (path) {
        location.hash = path;
        this.loadRoute(path);
    };
    Router.prototype.loadRoute = function (path) {
        var _this = this;
        console.log("[INFO] Loading route: ".concat(path));
        var basePath = path.split("#")[0];
        // extract known route
        if (basePath.includes("edit")) {
            basePath = "/edit";
        }
        console.log(basePath, ": base path");
        if (!this.routes[path]) {
            console.error("[WARN] Route not found ".concat(basePath, ", redirecting to 404"));
            location.hash = "/404";
            path = "/404";
        }
        fetch(this.routes[basePath])
            .then(function (res) {
            if (!res.ok)
                throw new Error("[INFO] Failed to load ".concat(_this.routes[basePath]));
            return res.text();
        })
            .then(function (html) {
            var mainElement = document.createElement("main");
            if (mainElement)
                mainElement.innerHTML = html;
            else
                console.error("Main element not found");
            (0, header_js_1.loadHeader)().then(function () {
                // Dispatch a custom event to notify that a new route have been loaded.
                document.dispatchEvent(new CustomEvent("routeLoaded", { detail: basePath }));
            });
        })
            .catch(function (err) {
            console.error("[ERROR] Error loading page: ".concat(err));
        });
    };
    return Router;
}());
exports.Router = Router;

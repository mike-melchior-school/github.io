"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateActiveNavLink = exports.loadHeader = void 0;
/**
 * loads the header from an external local file
 * @returns {Promise<void>}
 */
var loadHeader = function () {
    console.log('[INFO] loadHeader Called');
    return fetch('views/components/header.html')
        .then(function (response) { return response.text(); })
        .then(function (data) {
        var headerElement = document.querySelector('header');
        if (headerElement)
            headerElement.innerHTML = data;
        else
            console.warn("No header element found");
        (0, exports.updateActiveNavLink)();
        checkLogin();
    })
        .catch(function (error) { return console.log("[ERROR] Unable to load header"); });
};
exports.loadHeader = loadHeader;
var updateActiveNavLink = function () {
    console.log("[INFO] updateActiveNavLink called");
    var currentPath = location.hash.slice(1) || "/";
    var navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(function (link) {
        var _a;
        var linkPath = (_a = link.getAttribute('href')) === null || _a === void 0 ? void 0 : _a.replace("#", "");
        if (currentPath === linkPath)
            link.classList.add('active');
        else
            link.classList.remove('active');
    });
};
exports.updateActiveNavLink = updateActiveNavLink;
var handleLogout = function (e) {
    e.preventDefault();
    sessionStorage.removeItem("user");
    console.log("[INFO] User logged out, Update UI...");
    (0, exports.loadHeader)().then(function () {
        location.hash = "/";
    });
};
var checkLogin = function () {
    console.log("[INFO] checking user login status");
    var loginNav = document.getElementById("login");
    if (!loginNav) {
        console.warn("[WARN] login nav link element not found in the dom, skipping checkLogin().");
        return;
    }
    var userSession = sessionStorage.getItem("user");
    if (userSession) {
        loginNav.innerHTML = "<i class=\"fas fa-sign-out-alt\"></i> Logout";
        loginNav.href = "#";
        loginNav.removeEventListener("click", handleLogout);
        loginNav.addEventListener("click", handleLogout);
    }
    else {
        loginNav.innerHTML = "<i class=\"fas fa-sign-in-alt\"></i> Login";
        loginNav.removeEventListener("click", handleLogout);
        loginNav.addEventListener("click", function () { return location.hash = "/login"; });
    }
};

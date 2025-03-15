'use strict';

let sessionTimeout;

const resetSessionTimeout = () => {
    clearTimeout(sessionTimeout);
    sessionTimeout = setTimeout(() => {
        console.warn(`[WARN] Session expired due to inactivity.`);
        sessionStorage.removeItem("user");
        window.dispatchEvent(new CustomEvent("sessionExpired"));

    }, 15 * 60 * 1000); // timeout of 15 minutes
}

document.addEventListener("mousemove", resetSessionTimeout);
document.addEventListener("keypress", resetSessionTimeout);

export const authGuard = () => {

    const user = sessionStorage.getItem("user");
    const protectedRoutes = [
        '/contact-list',
        '/edit'
    ]

    if (!user && protectedRoutes.includes(location.hash.slice(1))) {
        console.warn("[AUTHGUARD] Unauthorized access detected. Redirecting to login page");
        window.dispatchEvent(new CustomEvent("sessionExpired"));
    } else {
        resetSessionTimeout()
    }
}
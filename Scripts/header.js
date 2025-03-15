"use strict";


/**
 * loads the header from an external local file
 * @returns {Promise<void>}
 */
export const loadHeader = () => {
    console.log('[INFO] loadHeader Called')

    return fetch('views/components/header.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('header').innerHTML = data;
            updateActiveNavLink();
            checkLogin();
        })
        .catch(error => console.log("[ERROR] Unable to load header"));


}

export const updateActiveNavLink = () => {
    console.log("[INFO] updateActiveNavLink called");
    const currentPath = location.hash.slice(1) || "/";
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach((link) => {

        const linkPath = link.getAttribute('href').replace("#", "");
        if (currentPath === linkPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    })

}

const handleLogout = (e) => {
    e.preventDefault();
    sessionStorage.removeItem("user");
    console.log(`[INFO] User logged out, Update UI...`)

    loadHeader().then(() => {
        location.hash = "/";
    })
}

const checkLogin = () => {
    console.log("[INFO] checking user login status");

    const loginNav = document.getElementById("login");

    if (!loginNav) {
        console.warn("[WARN] login nav link element not found in the dom, skipping checkLogin().")
        return;
    }

    const userSession = sessionStorage.getItem("user");

    if (userSession) {
        loginNav.innerHTML = `<i class="fas fa-sign-out-alt"></i> Logout`
        loginNav.href = "#";
        loginNav.removeEventListener("click", handleLogout);
        loginNav.addEventListener("click", handleLogout);
    } else {
        loginNav.innerHTML = `<i class="fas fa-sign-in-alt"></i> Login`
        loginNav.removeEventListener("click", handleLogout);
        loginNav.addEventListener("click", () => location.hash = "/login");
    }
}
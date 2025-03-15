"use strict";

import {loadHeader} from "./header.js";

export class Router {
    constructor(routes) {
        this.routes = routes;
        this.init();
    }

    init() {

        window.addEventListener("DOMContentLoaded", () => {
            const path = location.hash.slice(1) || "/";
            console.log(`[INFO] initial page load: ${path}`);
            this.loadRoute(path);
        })

        window.addEventListener("popstate", () => {
            console.log(`[INFO] Navigating to: ${location.hash.slice(1)}`)
            this.loadRoute(location.hash.slice(1));
        })
    }

    navigate(path) {
        location.hash = path;


        this.loadRoute(path);
    }

    loadRoute(path) {
        console.log(`[INFO] Loading route: ${path}`);

        let basePath = path.split("#")[0];
        // extract known route
        if (basePath.includes("edit")) {
            basePath = "/edit";
        }

        if (!this.routes[basePath]) {
            console.error(`[WARN] Route not found ${basePath}, redirecting to 404`);
            location.hash = "/404";
            path = "/404";
        }

        fetch(this.routes[basePath])
            .then(res => {
                if (!res.ok) throw new Error(`[INFO] Failed to load ${this.routes(basePath)}`);
                return res.text();
            })
            .then(html => {
                document.querySelector("main").innerHTML = html;

                loadHeader().then(() => {
                    // Dispatch a custom event to notify that a new route have been loaded.
                    document.dispatchEvent(new CustomEvent("routeLoaded", {detail: basePath}));
                })
            })
            .catch(err => {
                console.error(`[ERROR] Error loading page: ${err}`);
            })


    }

}
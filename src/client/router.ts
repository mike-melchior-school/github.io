"use strict";

import {loadHeader} from "./header.js";

type RouteMap = {[key:string]: string};

export class Router {

    private routes: RouteMap;

    constructor(routes: RouteMap) {
        this.routes = routes;
        this.init();
    }

    init() {

        window.addEventListener("DOMContentLoaded", () => {
            const path = location.hash.slice(1) || "/";
            console.log(`[INFO] initial page load: ${path}`);
            this.loadRoute(path);
        })

        window.addEventListener("hashchange", () => {
            console.log(`[INFO] Navigating to: ${location.hash.slice(1)}`);
            this.loadRoute(location.hash.slice(1));
        });

        window.addEventListener("popstate", () => {
            console.log(`[INFO] Navigating to: ${location.hash.slice(1)}`)
            this.loadRoute(location.hash.slice(1));
        })
    }

    navigate(path:string) {
        location.hash = path;
        this.loadRoute(path);
    }

    loadRoute(path: string) {
        console.log(`[INFO] Loading route: ${path}`);

        let basePath = path.split("#")[0];
        if (basePath.includes("edit")) {
            basePath = "/edit";
        }

        console.log(`"${basePath}": base path`);

        if (!this.routes[basePath]) {
            console.error(`[WARN] Route not found "${basePath}", redirecting to 404`);
            location.hash = "/404";
        }

        fetch(this.routes[basePath])
            .then(res => {
                if (!res.ok) throw new Error(`[INFO] Failed to load ${this.routes[basePath]}`);
                return res.text();
            })
            .then(html => {
                const mainElement = document.createElement("main");
                mainElement.classList.add("container", "text-center", "my-5");
                mainElement.innerHTML = html;

                // Append or replace the main element in the DOM
                const existingMain = document.querySelector("main");
                if (existingMain) {
                    existingMain.replaceWith(mainElement); // Replace existing <main>
                } else {
                    document.body.appendChild(mainElement); // Append if no <main> exists
                }
                console.log("[INFO] Loaded HTML into DOM:", mainElement);

                loadHeader().then(() => {
                    document.dispatchEvent(new CustomEvent("routeLoaded", { detail: basePath }));
                });
            })
            .catch(err => {
                console.error(`[ERROR] Error loading page: ${err}`);
            });
    }
}
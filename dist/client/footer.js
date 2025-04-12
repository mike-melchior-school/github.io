"use strict";
export const loadFooter = () => {
    return fetch("./views/components/footer.html")
        .then(response => response.text())
        .then(html => {
        const footerElement = document.querySelector("footer");
        if (footerElement)
            footerElement.innerHTML = html;
        else
            console.warn("No footer found in the DOM");
    })
        .catch(error => console.error(`[ERROR] Failed to load footer: ${error}`));
};
//# sourceMappingURL=footer.js.map
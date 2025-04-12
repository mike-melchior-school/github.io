'use strict';
// IIFE
import { loadHeader } from "./header.js";
import { Router } from "./router.js";
import { loadFooter } from "./footer.js";
import { authGuard } from "./authguard.js";
import { Contact } from "./contact.js";
const routes = {
    "/": "views/pages/home.html",
    "home": "views/pages/home.html",
    "/about": "views/pages/about.html",
    "/contact": "views/pages/contact.html",
    "/products": "views/pages/products.html",
    "/services": "views/pages/services.html",
    "/contact-list": "views/pages/contact-list.html",
    "/edit": "views/pages/edit.html",
    "/login": "views/pages/login.html",
    "/404": "views/pages/404.html",
    "/register": "views/pages/register.html",
};
const pageTitles = {
    "/": "Home",
    "home": "Home",
    "/about": "About Us",
    "/contact": "Contact Us",
    "/products": "Products",
    "/services": "Services",
    "/contact-list": "Contact List",
    "/edit": "Edit Contact",
    "/login": "Login",
    "/404": "Page Not Found",
    "/register": "Register",
};
const router = new Router(routes);
(function () {
    /**
     * redirect the user back to the contact list page
     * @returns {string}
     */
    const handleCancelClick = () => router.navigate("/contact-list");
    /**
     * handles the process of editing an existing contact
     * @param event
     * @param contact contact to update
     * @param page unique contact identifier
     */
    const handleEditClick = (event, contact, page) => {
        // prevent default form submission
        event.preventDefault();
        if (!validateForm()) {
            alert("Invalid data! Please check your input");
            return;
        }
        const fullName = document.getElementById('fullName').value;
        const contactNumber = document.getElementById('contactNumber').value;
        const emailAddress = document.getElementById('emailAddress').value;
        // update the contact object with the new values
        contact.fullName = fullName;
        contact.emailAddress = emailAddress;
        contact.contactNumber = contactNumber;
        localStorage.setItem(page, contact.serialize()); // save the updated contact in local storage
        router.navigate("/contact-list");
    };
    /**
     * handles the process of adding a new contact
     * @param event the event object to prevent default form submission
     */
    const handleAddClick = (event) => {
        // prevent the default form submission
        event.preventDefault();
        if (!validateForm()) {
            alert("Form contains errors, please correct the before submitting");
            return;
        }
        const fullName = document.getElementById('fullName').value;
        const contactNumber = document.getElementById('contactNumber').value;
        const emailAddress = document.getElementById('emailAddress').value;
        AddContact(fullName, contactNumber, emailAddress);
        //redirection
        router.navigate("/contact-list");
    };
    /**
     *  Validate the entire frm by checking the validity of each input
     * @returns {boolean}
     */
    const validateForm = () => {
        return (validateInput("fullName")
            && validateInput("contactNumber")
            && validateInput("emailAddress"));
    };
    /**
     * attaches validation event listeners to form input fields dynamically
     * @param elementID
     * @param event
     * @param handler
     */
    const addEventListenerOnce = (elementID, event, handler) => {
        const element = document.getElementById(elementID);
        if (element) {
            // remove any existing event listeners
            element.removeEventListener(event, handler);
            // attach the new (latest) event for that element
            element.addEventListener(event, handler);
        }
        else {
            console.warn(`[WARN] Element with ID "${elementID}" not found.`);
        }
    };
    const attachValidationListeners = () => {
        console.log("[INFO] Attaching validation listeners...");
        Object.keys(VALIDATION_RULES).forEach(fieldID => {
            const field = document.getElementById(fieldID);
            if (!field) {
                console.warn(`[WARN] Field "${fieldID}" not found. Skipping listener`);
                return;
            }
            // Attach event listener using a centralized validation method
            addEventListenerOnce(fieldID, "input", () => validateInput(fieldID));
        });
    };
    /**
     * Validation on input based on a predefined validation rule
     * @param fieldID
     * @returns {boolean}
     */
    const validateInput = (fieldID) => {
        const field = document.getElementById(fieldID);
        const errorElement = document.getElementById(`${fieldID}-error`);
        const rule = VALIDATION_RULES[fieldID];
        if (!field || !errorElement || !rule) {
            console.log(`input: ${field}, error element: ${errorElement}, input id: ${fieldID}`);
            console.warn(`[WARN] Validation rules not found for: ${fieldID}`);
            return false;
        }
        // check if the input is empty
        if (field.value.trim() === "") {
            errorElement.textContent = "This field is required";
            errorElement.style.display = "block";
            return false;
        }
        // check field against regex
        if (!rule.regex.test(field.value)) {
            errorElement.textContent = rule.errorMessage;
            errorElement.style.display = "block";
            return false;
        }
        errorElement.textContent = "";
        errorElement.style.display = "none";
        return true;
    };
    /**
     * Centralized validation rules for input fields
     * @type {{fullName: {regex: RegExp, errorMessage: string}, contactNumber: {regex: RegExp, errorMessage: string},
     * emailAddress: {regex: RegExp, errorMessage: string}}}
     */
    const VALIDATION_RULES = {
        fullName: {
            regex: /^[A-Za-z\s]+$/, // Allows for only letters and spaces
            errorMessage: "Full Name must contain only letters and spaces"
        },
        contactNumber: {
            regex: /^\d{3}-\d{3}-\d{4}$/,
            errorMessage: "Contact Number must be in format ###-###-####"
        },
        emailAddress: {
            regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            errorMessage: "Invalid email address format"
        },
    };
    const AddContact = (fullName, contactNumber, emailAddress) => {
        console.log("[DEBUG] AddContact() triggered.");
        if (!validateForm()) {
            alert("Form contains errors, please correct them before submitting");
            return;
        }
        let contact = new Contact(fullName, contactNumber, emailAddress);
        let serializedContact = contact.serialize();
        if (serializedContact) {
            let key = `contact_${Date.now()}`;
            localStorage.setItem(key, serializedContact);
            console.log(`[INFO] Contact added: ${key}`);
        }
        else {
            console.error(`[ERROR] Contact serialization failed`);
        }
        // redirection
        router.navigate("/contact-list");
    };
    const displayWeather = async () => {
        const apiKey = "c28cb34329450efa7e2a81852ca52147";
        const city = "Oshawa";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        try {
            const res = await fetch(url);
            if (!res.ok)
                throw new Error("Failed to fetch weather data");
            const data = await res.json();
            const weatherDataElement = document.getElementById("weatherData");
            if (weatherDataElement) {
                weatherDataElement.innerHTML = `
                    <strong>City:</strong> ${city} <br>
                    <strong>Temperature</strong> ${data.main.temp}°C<br>
                    <strong>Weather</strong> ${data.weather[0].description}<br>`;
            }
            else {
                console.error("[ERROR] Element with ID weatherData not found");
            }
        }
        catch (e) {
            console.error("Error fetching data from openweathermap");
            const weatherDataElement = document.getElementById("weatherData");
            if (weatherDataElement)
                weatherDataElement.textContent = "Unable to fetch weather data";
        }
    };
    const displayHomePage = () => {
        console.log("Calling DisplayHomePage");
        const aboutUsButton = document.getElementById("AboutUsBtn");
        if (aboutUsButton) {
            aboutUsButton.addEventListener("click", () => {
                router.navigate("/about");
            });
        }
        displayWeather();
    };
    const displayProductsPage = () => {
        console.log("displaying products page");
    };
    const displayServicesPage = () => {
        console.log("displaying services page");
    };
    const displayContactPage = () => {
        console.log("displaying contacts page");
        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");
        const contactListButton = document.getElementById("showContactList");
        if (!sendButton) {
            console.error("[ERROR] Element with ID sendButton not found");
            return;
        }
        sendButton.addEventListener("click", (e) => {
            e.preventDefault();
            if (!validateForm()) {
                alert("Please fix errors before submitting");
                return;
            }
            if (subscribeCheckbox && subscribeCheckbox.checked) {
                AddContact(document.getElementById("fullName").value, document.getElementById("contactNumber").value, document.getElementById("emailAddress").value);
                alert("Form successfully submitted, contact has been added.");
                router.navigate("/");
            }
        });
        if (contactListButton) {
            contactListButton.addEventListener("click", (e) => {
                e.preventDefault();
                router.navigate("/contact-list");
            });
        }
    };
    const displayContactsListPage = () => {
        console.log("displaying contact list page");
        let contactList = document.getElementById("contactList");
        if (!contactList) {
            console.error("[ERROR] Unable to locate element with ID contactList");
            return;
        }
        let data = "";
        let keys = Object.keys(localStorage);
        let index = 1;
        if (localStorage.length > 0) {
            keys.forEach((key) => {
                if (key.startsWith("contact_")) {
                    let contactData = localStorage.getItem(key);
                    if (!contactData) {
                        console.error(`[ERROR] No data found for key: ${key}`);
                        return;
                    }
                    try {
                        const contact = new Contact();
                        contact.deserialize(contactData);
                        data += `<tr>
                                    <th scope="row" class="text-center">${index}</th>
                                    <td>${contact.fullName}</td>
                                    <td>${contact.contactNumber}</td>
                                    <td>${contact.emailAddress}</td>
                                    
                                    <td class="text-center">
                                        <button value="${key}" class="btn btn-warning btn-sm edit">
                                            <i class="fa-solid fa-user-pen"></i> Edit
                                        </button>
                                    </td>
                                    <td class="text-center">
                                        <button value="${key}" class="btn btn-danger btn-sm delete">
                                            <i class="fa-solid fa-trash"></i> Delete
                                        </button>
                                    </td>
                                 </tr>`;
                        index++;
                    }
                    catch (e) {
                        console.error(`Error deserializing contact data: ${e}`);
                    }
                }
                else {
                    console.warn(`[WARN] Skipping non-contact key: ${key}`);
                }
            });
            contactList.innerHTML = data;
        }
        const addButton = document.getElementById("addButton");
        addButton?.addEventListener("click", () => {
            router.navigate("/edit#add");
        });
        const editButtons = document.querySelectorAll('button.edit');
        editButtons.forEach((button) => {
            button.addEventListener("click", function () {
                router.navigate(`/edit/${this.value}`);
                console.log(this.value);
            });
        });
        // editButtons.forEach((button) => {
        //     button.addEventListener("click", (e) => {
        //         router.navigate(`/edit/${e.target.value}`);
        //
        //     })
        // })
        const deleteButtons = document.querySelectorAll('button.delete');
        deleteButtons.forEach(button => {
            button.addEventListener("click", function () {
                const contactKey = this.value;
                console.log(`[DEBUG] Deleting contact with Contact ID: ${contactKey}`);
                if (!contactKey.startsWith("contact_")) {
                    console.error("[ERROR] Invalid contact key format");
                    return;
                }
                if (confirm("Delete contact?")) {
                    localStorage.removeItem(this.value);
                    displayContactsListPage();
                }
            });
        });
    };
    const displayAboutPage = () => {
        console.log("displaying about page");
    };
    const displayEditContactPage = () => {
        console.log("displaying edit contact page");
        const hashParts = location.hash.split('#');
        const page = hashParts.length > 2 ? hashParts[2] : "";
        const editButton = document.getElementById("editButton");
        const pageTitle = document.querySelector("main > h1");
        const cancelButton = document.getElementById("cancelButton");
        if (!pageTitle) {
            console.error("[ERROR] main page title element not found");
            return;
        }
        if (page === "add") {
            document.title = "Add Contact";
            pageTitle.textContent = "Add Contact";
            if (editButton) {
                editButton.innerHTML = `<i class="fa-solid fa-user-plus"></i> Add Contact`;
                editButton.classList.remove("btn-primary");
                editButton.classList.add("btn-success");
            }
            addEventListenerOnce('editButton', 'click', handleAddClick);
            addEventListenerOnce('cancelButton', 'click', handleCancelClick);
        }
        else {
            if (!pageTitle) {
                console.error("[ERROR] main page title element not found");
                return;
            }
            // parse the contact ID out of the path
            const contactID = page.split("/")[page.split("/").length - 1];
            const contactData = localStorage.getItem(contactID);
            if (!contactData) {
                console.error("[ERROR] no contact data found for id");
            }
            const contact = new Contact();
            if (contactData)
                contact.deserialize(contactData);
            document.getElementById("fullName").value = contact.fullName;
            document.getElementById("contactNumber").value = contact.contactNumber;
            document.getElementById("emailAddress").value = contact.emailAddress;
            if (editButton) {
                editButton.innerHTML = `<i class="fa fa-edit fa-lg"></i> Edit Contact`;
                editButton.classList.remove("btn-success");
                editButton.classList.add("btn-primary");
            }
            // attach event listeners
            addEventListenerOnce('editButton', 'click', (event) => handleEditClick(event, contact, contactID));
            // addEventListenerOnce('cancelButton', 'click', handleCancelClick())
            if (cancelButton) {
                // remove any existing event listeners
                cancelButton.removeEventListener('click', handleCancelClick);
                // attach the new (latest) event for that element
                cancelButton.addEventListener('click', handleCancelClick);
            }
            else {
                console.warn(`[WARN] Element with ID "cancelButton" not found.`);
            }
        }
    };
    const displayLoginPage = () => {
        console.log("[INFO] displaying login page");
        if (sessionStorage.getItem("user")) {
            router.navigate("/contact-list");
            return;
        }
        const messageArea = document.getElementById('messageArea');
        const loginButton = document.getElementById('loginButton');
        const cancelButton = document.getElementById('cancelButton');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        // if error is showing, remove it if the user changes the input in the username or password field
        usernameInput.addEventListener('input', () => messageArea.style.display = 'none');
        passwordInput.addEventListener('input', () => messageArea.style.display = 'none');
        messageArea.style.display = "none";
        if (!loginButton) {
            console.error("[ERROR] loginButton not found");
            return;
        }
        loginButton.addEventListener("click", async (e) => {
            e.preventDefault();
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            try {
                const response = await fetch('../data/users.json');
                if (!response.ok) {
                    throw new Error(`[ERROR] HTTP error: Status: ${response.status}`);
                }
                const jsonData = await response.json();
                // console.log("[DEBUG] fetched json data:", jsonData);
                const users = jsonData.users;
                if (!Array.isArray(users)) {
                    throw new Error(`[ERROR] json data does not contain a valid array`);
                }
                let success = false;
                let authenticatedUser = null;
                for (const user of users) {
                    if (user.Username === username && user.Password === password) {
                        success = true;
                        authenticatedUser = user;
                        break;
                    }
                }
                if (success) {
                    sessionStorage.setItem("user", JSON.stringify({
                        DisplayName: authenticatedUser?.displayName,
                        EmailAddress: authenticatedUser?.emailAddress,
                        Username: authenticatedUser?.displayName,
                    }));
                    messageArea.style.display = "none";
                    messageArea.classList.remove("alert", "alert-danger");
                    loadHeader().then(() => {
                        router.navigate("/contact-list");
                    });
                }
                else {
                    messageArea.style.display = "block";
                    messageArea.classList.add("alert", "alert-danger");
                    messageArea.textContent = "Invalid username or password. Please try again";
                    usernameInput.focus();
                    usernameInput.select();
                }
            }
            catch (e) {
                console.error(`Login failed: ${e.message}`);
            }
        });
        cancelButton.addEventListener("click", () => {
            document.getElementById("loginForm").reset();
            router.navigate("/");
        });
    };
    const displayRegisterPage = () => {
        console.log("[INFO] displaying register page");
    };
    const handlePageLogic = (path) => {
        document.title = pageTitles[path] || "Untitled Page";
        const protectedRoutes = [
            "/contact-list",
            "/edit",
        ];
        if (protectedRoutes.includes(path)) {
            authGuard();
        }
        switch (path) {
            case "/":
            case "home":
                displayHomePage();
                break;
            case "/contact":
                displayContactPage();
                attachValidationListeners();
                break;
            case "/about":
                displayAboutPage();
                break;
            case "/contact-list":
                displayContactsListPage();
                break;
            case "/services":
                displayServicesPage();
                break;
            case "/products":
                displayProductsPage();
                break;
            case "/edit":
                displayEditContactPage();
                attachValidationListeners();
                break;
            case "/login":
                displayLoginPage();
                break;
            case "/register":
                displayRegisterPage();
                break;
            default:
                console.warn(`No display logic for route ${path}`);
        }
    };
    const Start = async () => {
        console.log('Starting app...');
        await loadHeader();
        await loadFooter();
        authGuard();
        const currentPath = location.hash.slice(1) || "/";
        router.navigate(currentPath);
        handlePageLogic(currentPath);
    };
    document.addEventListener("routeLoaded", (e) => {
        if (!(e instanceof CustomEvent) || typeof e.detail !== 'string') {
            console.warn("[WARNING] Recieved an invalid 'routeLoaded event");
            return;
        }
        const newPath = e.detail;
        console.log(`[INFO] New route loaded: ${newPath}`);
        loadHeader().then(() => {
            handlePageLogic(newPath);
        });
    });
    window.addEventListener('sessionExpired', () => {
        console.warn(`[SESSION] Redirecting the user due to inactivity`);
        router.navigate("/login");
    });
    window.addEventListener('DOMContentLoaded', () => {
        console.log("DOM Fully loaded and parsed");
        Start();
    });
})();
//# sourceMappingURL=app.js.map
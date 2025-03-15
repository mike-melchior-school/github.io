'use strict';

// IIFE
import {loadHeader} from "./header.js";
import {Router} from "./router.js";
import {loadFooter} from "./footer.js";
import {authGuard} from "./authguard.js";


const routes = {
    "/": "views/pages/home.html",
    "home": "views/pages/home.html",
    "/about": "views/pages/about.html",
    "/contact": "views/pages/contact.html",
    "/products": "views/pages/products.html",
    "/services": "views/pages/services.html",
    "/contact-list": "views/pages/contact-list.html",
    "/edit": "views/pages/edit.html",
    "/add": "views/pages/edit.html",
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

(function() {


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
            alert("Invalid data! Please check your input")
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
    }

    /**
     * handles the process of adding a new contact
     * @param event the event object to prevent default form submission
     */
    const handleAddClick = (event) => {
        // prevent the default form submission
        event.preventDefault();

        if (!validateForm()) {
            alert("Form contains errors, please correct the before submitting")
            return;
        }

        const fullName = document.getElementById('fullName').value;
        const contactNumber = document.getElementById('contactNumber').value;
        const emailAddress = document.getElementById('emailAddress').value;

        AddContact(fullName, contactNumber, emailAddress);

        //redirection
        router.navigate("/contact-list");
    }

    /**
     *  Validate the entire frm by checking the validity of each input
     * @returns {boolean}
     */
    const validateForm = () => {
        return(
            validateInput("fullName")
            && validateInput("contactNumber")
            && validateInput("emailAddress")
        )
    }

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
        } else {
            console.warn(`[WARN] Element with ID "${elementID}" not found.`);
        }
    }

    const attachValidationListeners = () => {
        console.log("[INFO] Attaching validation listeners...");

        Object.keys(VALIDATION_RULES).forEach(fieldID => {
            const field = document.getElementById(fieldID)
            if (!field) {
                console.warn(`[WARN] Field "${fieldID}" not found. Skipping listener`);
                return;
            }

            // Attach event listener using a centralized validation method
            addEventListenerOnce(fieldID, "input", () => validateInput(fieldID));
        })

    }

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

    }

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
    }

    const AddContact = (fullName, contactNumber, emailAddress) => {
        console.log("[DEBUG] AddContact() triggered.");

        if (!validateForm()) {
            alert("Form contains errors, please correct them before submitting")
            return;
        }

        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if (contact.serialize()) {
            let key = `contact_${Date.now()}`;
            localStorage.setItem(key, contact.serialize());
            console.log(`[INFO] Contact added: ${key}`)
        } else {
            console.error(`[ERROR] Contact serialization failed`);
        }

        // redirection
        router.navigate("/contact-list");
    }

    const displayWeather = async () => {
        const apiKey = "c28cb34329450efa7e2a81852ca52147"
        const city = "Oshawa";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        try {
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error("Failed to fetch weather data");
            }

            const data = await res.json();
            // console.log(data);

            const weatherDataElement = document.getElementById("weatherData")
            weatherDataElement.innerHTML = `<strong>City:</strong> ${city} <br>
                                            <strong>Temperature</strong> ${data.main.temp}°C<br>
                                            <strong>Weather</strong> ${data.weather[0].description}<br>`;
        } catch (e) {
            console.error("Error fetching data from openweathermap");
        }

    }

    const displayHomePage = () => {
        // console.log("displaying home page");
        //
        // document.getElementById('aboutUsBtn').addEventListener('click', () => {
        //     location.href = "about.html";
        // })
        //
        // displayWeather();
        //
        // document.querySelector("main").insertAdjacentHTML(
        //     'beforeend',
        //     `<p id="mainParagraph" class="mt-5">This is my first main paragraph</p>`
        // )
        //
        // document.body.insertAdjacentHTML(
        //     "beforeend",
        //     `<article class="container">
        //                 <p id="articleParagraph" class="mt-3">This is my first article paragraph</p>
        //               </article>`
        // )
        console.log("Calling DisplayHomePage");

        const main = document.querySelector("main");
        main.innerHTML = "";

        main.insertAdjacentHTML(
            "beforeend",
            `<h1 class="mb-5">Welcome to the site</h1>
                  <button id="AboutUsBtn" class="btn btn-primary">About Us</button>
                 
                  <div id="weather" class="mb-5">
                     <h3>Weather Information</h3>
                     <p id="weatherData">Fetching Weather Data</p>
                  </div>
                  
                  <p id="MainParagraph" class="mt-5"> This is my main paragraph</p>
                  <article>
                     <p id="ArticleParagraph" class="mt-3">This is my article paragraph</p>
                  </article>
                  `
        );

        displayWeather();

        let AboutUsButton = document.getElementById("AboutUsBtn");
        AboutUsButton.addEventListener("click", () => {
            router.navigate("/about");
        });
    }

    const displayProductsPage = () => {
        console.log("displaying products page");
    }

    const displayServicesPage = () => {
        console.log("displaying services page");
    }

    const displayContactPage = () => {
        console.log("displaying contacts page");

        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");

        sendButton.addEventListener("click", () => {
            if (subscribeCheckbox.checked) {
                AddContact(
                    document.getElementById("fullName").value,
                    document.getElementById("contactNumber").value,
                    document.getElementById("emailAddress").value
                );
                alert("Form successfully submitted, contact has been added.");
                router.navigate("/");
            }
        })

        const contactListButton = document.getElementById("showContactList");
        if (contactListButton) {
            contactListButton.addEventListener("click", (e) => {
                e.preventDefault();
                router.navigate("/contact-list");
            });
        }
    }

    const displayContactsListPage = () => {
        console.log("displaying contact list page");

        if (localStorage.length > 0) {
            let contactList = document.getElementById("contactList");
            let data = "";
            let keys = Object.keys(localStorage);
            let index = 1;

            keys.forEach((key) => {
                if (key.startsWith("contact_")) {
                    let contactData = localStorage.getItem(key);

                    try {
                        let contact = new core.Contact();
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
                    } catch(e) {
                        console.error(`Error deserializing contact data: ${e}`);
                    }
                } else {
                    console.warn(`Skipping non-contact key: ${key}`);
                }
            })
            contactList.innerHTML = data;
        }

        const addButton = document.getElementById("addButton");
        addButton.addEventListener("click", () => {
            router.navigate("/edit#add");
        })

        const editButtons = document.querySelectorAll('button.edit');
        editButtons.forEach((button) => {
            button.addEventListener("click", function() {
                router.navigate(`/edit/${this.value}`)
            })
        })

        // editButtons.forEach((button) => {
        //     button.addEventListener("click", (e) => {
        //         router.navigate(`/edit/${e.target.value}`);
        //
        //     })
        // })


        const deleteButtons = document.querySelectorAll('button.delete');
        deleteButtons.forEach(button => {
            button.addEventListener("click", function()  {

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
            })
        })
        // deleteButtons.forEach(button => {
        //     button.addEventListener("click", (e) => {
        //         if (confirm("Delete contact?")) {
        //             localStorage.removeItem(e.currentTarget.value);
        //             location.href = "contact-list.html";
        //         }
        //     })
        // })
    }

    const displayAboutPage = () => {
        console.log("displaying about page");
    }

    const displayEditContactPage = () => {
        console.log("displaying edit contact page");

        const page = location.hash.substring(1);
        const editButton = document.getElementById("editButton");
        const cancelButton = document.getElementById("cancelButton");

        switch (page) {
            case "/edit#add":
                document.title = "Add Contact";
                document.querySelector('main>h1').textContent = "Add Contact";

                if (editButton) {
                    editButton.innerHTML = `<i class="fa-solid fa-user-plus"></i> Add Contact`;
                    editButton.classList.remove("btn-primary");
                    editButton.classList.add("btn-success");
                }

                addEventListenerOnce('editButton', 'click', handleAddClick);
                addEventListenerOnce('cancelButton', 'click', handleCancelClick);

                break;
            default:
                // edit an existing contact
                const contact = new core.Contact();
                // parse the contact ID out of the path
                const contactID = page.split("/")[page.split("/").length - 1];

                const contactData = localStorage.getItem(contactID);

                if (contactData) contact.deserialize(contactData);

                // Prepopulate contact data into form
                document.getElementById("fullName").value = contact.fullName;
                document.getElementById("contactNumber").value = contact.contactNumber;
                document.getElementById("emailAddress").value = contact.emailAddress;


                if (editButton) {
                    editButton.innerHTML = `<i class="fa fa-edit fa-lg"></i> Edit Contact`;
                    editButton.classList.remove("btn-success");
                    editButton.classList.add("btn-primary");
                }

                // attach event listeners
                addEventListenerOnce('editButton', 'click',
                    (event) => handleEditClick(event, contact, contactID));

                if (cancelButton) {
                    // remove any existing event listeners
                    cancelButton.removeEventListener('click', handleCancelClick);

                    // attach the new (latest) event for that element
                    cancelButton.addEventListener('click', handleCancelClick);
                } else {
                    console.warn(`[WARN] Element with ID "cancelButton" not found.`);
                }
                break;
        }
    }

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
        usernameInput.addEventListener('input', e => messageArea.style.display = 'none');
        passwordInput.addEventListener('input', e => messageArea.style.display = 'none');

        messageArea.style.display = "none";

        if (!loginButton) {
            console.error("[ERROR] loginButton not found");
            return;
        }

        loginButton.addEventListener("click", async(e) => {
            e.preventDefault();

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

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
                    })

                } else {
                    messageArea.style.display = "block";
                    messageArea.classList.add("alert", "alert-danger");
                    messageArea.textContent = "Invalid username or password. Please try again";

                    document.getElementById("username").focus();
                    document.getElementById("username").select();
                }



            } catch (e) {
                console.error(`Login failed: ${e.message}`);
            }
        });

        cancelButton.addEventListener("click", () => {
            document.getElementById("loginForm").reset();
            router.navigate("/");
        });


    }

    const displayRegisterPage = () => {
        console.log("[INFO] displaying register page");
    }

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
                console.warn(`No display logic for route ${path}`)
        }
    }

    const Start = async () => {
        console.log('Starting app...');
        await loadHeader();
        await loadFooter();
        authGuard();

        const currentPath = location.hash.slice(1) || "/"
        router.navigate(currentPath);

        handlePageLogic(currentPath);
    }

    document.addEventListener("routeLoaded", (e) => {
        const newPath = e.detail;
        console.log(`New route loaded: ${newPath}`);

        loadHeader().then(() => {
            handlePageLogic(newPath);
        })
    });

    window.addEventListener('sessionExpired', () => {
        console.warn(`[SESSION] Redirecting the user due to inactivity`);
        router.navigate("/login");
    })

    window.addEventListener('DOMContentLoaded', () => {
        console.log("DOM Fully loaded and parsed")
        Start()
    });
})();
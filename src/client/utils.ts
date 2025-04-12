import {Contact} from "./contact.js";
import {Router} from "./router.js";
import {createContact, updateContact} from "./api/index.js";


/**
 * Centralized validation rules for input fields
 * @type {{fullName: {regex: RegExp, errorMessage: string}, contactNumber: {regex: RegExp, errorMessage: string},
 * emailAddress: {regex: RegExp, errorMessage: string}}}
 */
const VALIDATION_RULES:{[key:string]: {regex: RegExp; errorMessage: string}} = {
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

/**
 * Validation on input based on a predefined validation rule
 * @param fieldID
 * @returns {boolean}
 */
export const validateInput = (fieldID: string): boolean => {

    const field = document.getElementById(fieldID) as HTMLInputElement;
    const errorElement = document.getElementById(`${fieldID}-error`) as HTMLElement;
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
 *  Validate the entire frm by checking the validity of each input
 * @returns {boolean}
 */
export const validateForm = (): boolean => {
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
export const addEventListenerOnce = (elementID: string, event: string, handler: EventListener) => {

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

export const attachValidationListeners = () => {
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

export const displayWeather = async () => {
    const apiKey = "c28cb34329450efa7e2a81852ca52147"
    const city = "Oshawa";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch weather data");

        const data: {name: string; main: {temp:number}; weather: {description:string}[] } = await res.json();

        const weatherDataElement = document.getElementById("weatherData");
        if (weatherDataElement) {
            weatherDataElement.innerHTML = `
                    <strong>City:</strong> ${city} <br>
                    <strong>Temperature</strong> ${data.main.temp}°C<br>
                    <strong>Weather</strong> ${data.weather[0].description}<br>`;
        } else {
            console.error("[ERROR] Element with ID weatherData not found");
        }
    } catch (e) {
        console.error("Error fetching data from openweathermap");

        const weatherDataElement = document.getElementById("weatherData");
        if (weatherDataElement) weatherDataElement.textContent = "Unable to fetch weather data";
    }

}

/**
 * redirect the user back to the contacts list page
 * @returns {string}
 */
export const handleCancelClick = (router: Router): void => router.navigate("/contact-list");

/**
 * handles the process of editing an existing contacts
 * @param event
 * @param contactID
 * @param router
 */
export const handleEditClick = async (event: Event, contactID: string, router: Router): Promise<void> => {
    event.preventDefault();

    if (!validateForm()) {
        alert("Invalid data! Please check your input")
        return;
    }

    const fullName = (document.getElementById('fullName') as HTMLInputElement).value;
    const contactNumber = (document.getElementById('contactNumber') as HTMLInputElement).value;
    const emailAddress = (document.getElementById('emailAddress') as HTMLInputElement).value;

    try {
        await updateContact(contactID, {fullName, contactNumber, emailAddress});
        router.navigate("/contact-list");
    } catch (e) {
        console.error(`[ERROR] failed to update contact: ${e}`);
    }
}

export const AddContact = async (fullName: string, contactNumber: string, emailAddress: string, router: Router) => {
    console.log("[DEBUG] AddContact() triggered.");

    if (!validateForm()) {
        alert("Form contains errors, please correct them before submitting")
        return;
    }

    try {
        const newContact = { fullName, contactNumber, emailAddress };
        await createContact(newContact);
        router.navigate("/contact-list");
    } catch (e) {
        console.error("[ERROR] Error adding contact", e);
        router.navigate("/contact");
    }
}

export const removeFromStorage = (key: string): void => {
    try {
        if (localStorage.getItem(key)) {
            localStorage.removeItem(key)
            console.log(`[INFO] Successfully removed contact from local storage`)
        } else {
            console.warn(`[WARN] Key '${key}' not found in local storage`)
        }

    } catch (e) {
        console.error(`[ERROR] Failed to remove from storage: ${key}`);
    }
}

export const saveToStorage = (key: string, value: any) => {
    try {


    let storageValue : string;

    if (key.startsWith("contact_") && value instanceof Contact) {
        const serialized = value.serialize();
        if (!serialized) {
            console.error(`[ERROR] Failed to serialize contact for key ${key}`);
            return;
        }
        storageValue = serialized;
    } else {
        // Otherwise store the value as JSON
        storageValue = JSON.stringify(value);
    }

    localStorage.setItem(key, storageValue);
    console.log(`[INFO] Data saved with key ${key} stored to local storage`);
    }  catch (e) {
        console.error(`[ERROR] Error saving storage key ${key}: ${e}`);
    }

}

export const getFromStorage = <T>(key: string): T|null => {
    try{
        const data = localStorage.getItem(key);
        if (!data) return null;

        if (key.startsWith("contact_")) {
            const contact = new Contact();
            contact.deserialize(data);
            return contact as unknown as T;
        }

        return JSON.parse(data) as T;
    } catch (e) {
        console.error(`[ERROR] Failed to get data associated with key '${key}'`);
        return null;
    }
}
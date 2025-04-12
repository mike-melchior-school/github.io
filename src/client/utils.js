"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFromStorage = exports.saveToStorage = exports.removeFromStorage = exports.AddContact = exports.handleEditClick = exports.handleCancelClick = exports.displayWeather = exports.attachValidationListeners = exports.addEventListenerOnce = exports.validateForm = exports.validateInput = void 0;
var contact_js_1 = require("./contact.js");
/**
 * Centralized validation rules for input fields
 * @type {{fullName: {regex: RegExp, errorMessage: string}, contactNumber: {regex: RegExp, errorMessage: string},
 * emailAddress: {regex: RegExp, errorMessage: string}}}
 */
var VALIDATION_RULES = {
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
/**
 * Validation on input based on a predefined validation rule
 * @param fieldID
 * @returns {boolean}
 */
var validateInput = function (fieldID) {
    var field = document.getElementById(fieldID);
    var errorElement = document.getElementById("".concat(fieldID, "-error"));
    var rule = VALIDATION_RULES[fieldID];
    if (!field || !errorElement || !rule) {
        console.log("input: ".concat(field, ", error element: ").concat(errorElement, ", input id: ").concat(fieldID));
        console.warn("[WARN] Validation rules not found for: ".concat(fieldID));
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
exports.validateInput = validateInput;
/**
 *  Validate the entire frm by checking the validity of each input
 * @returns {boolean}
 */
var validateForm = function () {
    return ((0, exports.validateInput)("fullName")
        && (0, exports.validateInput)("contactNumber")
        && (0, exports.validateInput)("emailAddress"));
};
exports.validateForm = validateForm;
/**
 * attaches validation event listeners to form input fields dynamically
 * @param elementID
 * @param event
 * @param handler
 */
var addEventListenerOnce = function (elementID, event, handler) {
    var element = document.getElementById(elementID);
    if (element) {
        // remove any existing event listeners
        element.removeEventListener(event, handler);
        // attach the new (latest) event for that element
        element.addEventListener(event, handler);
    }
    else {
        console.warn("[WARN] Element with ID \"".concat(elementID, "\" not found."));
    }
};
exports.addEventListenerOnce = addEventListenerOnce;
var attachValidationListeners = function () {
    console.log("[INFO] Attaching validation listeners...");
    Object.keys(VALIDATION_RULES).forEach(function (fieldID) {
        var field = document.getElementById(fieldID);
        if (!field) {
            console.warn("[WARN] Field \"".concat(fieldID, "\" not found. Skipping listener"));
            return;
        }
        // Attach event listener using a centralized validation method
        (0, exports.addEventListenerOnce)(fieldID, "input", function () { return (0, exports.validateInput)(fieldID); });
    });
};
exports.attachValidationListeners = attachValidationListeners;
var displayWeather = function () { return __awaiter(void 0, void 0, void 0, function () {
    var apiKey, city, url, res, data, weatherDataElement, e_1, weatherDataElement;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                apiKey = "c28cb34329450efa7e2a81852ca52147";
                city = "Oshawa";
                url = "https://api.openweathermap.org/data/2.5/weather?q=".concat(city, "&appid=").concat(apiKey, "&units=metric");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, fetch(url)];
            case 2:
                res = _a.sent();
                if (!res.ok)
                    throw new Error("Failed to fetch weather data");
                return [4 /*yield*/, res.json()];
            case 3:
                data = _a.sent();
                weatherDataElement = document.getElementById("weatherData");
                if (weatherDataElement) {
                    weatherDataElement.innerHTML = "\n                    <strong>City:</strong> ".concat(city, " <br>\n                    <strong>Temperature</strong> ").concat(data.main.temp, "\u00B0C<br>\n                    <strong>Weather</strong> ").concat(data.weather[0].description, "<br>");
                }
                else {
                    console.error("[ERROR] Element with ID weatherData not found");
                }
                return [3 /*break*/, 5];
            case 4:
                e_1 = _a.sent();
                console.error("Error fetching data from openweathermap");
                weatherDataElement = document.getElementById("weatherData");
                if (weatherDataElement)
                    weatherDataElement.textContent = "Unable to fetch weather data";
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.displayWeather = displayWeather;
/**
 * redirect the user back to the contact list page
 * @returns {string}
 */
var handleCancelClick = function (router) { return router.navigate("/contact-list"); };
exports.handleCancelClick = handleCancelClick;
/**
 * handles the process of editing an existing contact
 * @param event
 * @param contact contact to update
 * @param page unique contact identifier
 * @param router
 */
var handleEditClick = function (event, contact, page, router) {
    // prevent default form submission
    event.preventDefault();
    if (!(0, exports.validateForm)()) {
        alert("Invalid data! Please check your input");
        return;
    }
    var fullName = document.getElementById('fullName').value;
    var contactNumber = document.getElementById('contactNumber').value;
    var emailAddress = document.getElementById('emailAddress').value;
    // update the contact object with the new values
    contact.fullName = fullName;
    contact.emailAddress = emailAddress;
    contact.contactNumber = contactNumber;
    (0, exports.saveToStorage)(page, contact);
    router.navigate("/contact-list");
};
exports.handleEditClick = handleEditClick;
var AddContact = function (fullName, contactNumber, emailAddress, router) {
    console.log("[DEBUG] AddContact() triggered.");
    if (!(0, exports.validateForm)()) {
        alert("Form contains errors, please correct them before submitting");
        return;
    }
    var contact = new contact_js_1.Contact(fullName, contactNumber, emailAddress);
    var key = "contact_".concat(Date.now());
    (0, exports.saveToStorage)(key, contact);
    router.navigate("/contact-list");
};
exports.AddContact = AddContact;
var removeFromStorage = function (key) {
    try {
        if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
            console.log("[INFO] Successfully removed contact from local storage");
        }
        else {
            console.warn("[WARN] Key '".concat(key, "' not found in local storage"));
        }
    }
    catch (e) {
        console.error("[ERROR] Failed to remove from storage: ".concat(key));
    }
};
exports.removeFromStorage = removeFromStorage;
var saveToStorage = function (key, value) {
    try {
        var storageValue = void 0;
        if (key.startsWith("contact_") && value instanceof contact_js_1.Contact) {
            var serialized = value.serialize();
            if (!serialized) {
                console.error("[ERROR] Failed to serialize contact for key ".concat(key));
                return;
            }
            storageValue = serialized;
        }
        else {
            // Otherwise store the value as JSON
            storageValue = JSON.stringify(value);
        }
        localStorage.setItem(key, storageValue);
        console.log("[INFO] Data saved with key ".concat(key, " stored to local storage"));
    }
    catch (e) {
        console.error("[ERROR] Error saving storage key ".concat(key, ": ").concat(e));
    }
};
exports.saveToStorage = saveToStorage;
var getFromStorage = function (key) {
    try {
        var data = localStorage.getItem(key);
        if (!data)
            return null;
        if (key.startsWith("contact_")) {
            var contact = new contact_js_1.Contact();
            contact.deserialize(data);
            return contact;
        }
        return JSON.parse(data);
    }
    catch (e) {
        console.error("[ERROR] Failed to get data associated with key '".concat(key, "'"));
        return null;
    }
};
exports.getFromStorage = getFromStorage;

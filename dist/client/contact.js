'use strict';
/**
 *
 * Represents a contacts with a name, contacts number and email address
 */
export class Contact {
    /**
     * Constructs a new Contact instance
     * @param id
     * @param fullName
     * @param contactNumber
     * @param emailAddress
     */
    constructor(id = "", fullName = "", contactNumber = "", emailAddress = "") {
        this._id = id;
        this._fullName = fullName;
        this._contactNumber = contactNumber;
        this._emailAddress = emailAddress;
    }
    get id() {
        return this.id;
    }
    set id(id) {
        this.id = id;
    }
    /**
     * returns the full nama of the contacts
     * @returns {string}
     */
    get fullName() {
        return this._fullName;
    }
    /**
     * sets the full name of the contacts after validating the data
     * @param fullName
     */
    set fullName(fullName) {
        if (typeof fullName !== "string" || fullName.trim() === "") {
            throw new Error("Invalid full name: must ne a non-empty string");
        }
        this._fullName = fullName;
    }
    /**
     * returns the contacts number of the contacts
     * @returns {string}
     */
    get contactNumber() {
        return this._contactNumber;
    }
    /**
     * sets the contacts number of the contacts after validating the data
     * @param contactNumber
     */
    set contactNumber(contactNumber) {
        const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
        if (!phoneRegex.test(contactNumber)) {
            throw new Error("Invalid contactNumber number: must be in the format of ###-###-####");
        }
        this._contactNumber = contactNumber;
    }
    /**
     * returns the email address of the contacts
     * @returns {string}
     */
    get emailAddress() {
        return this._emailAddress;
    }
    /**
     * sets the email of the contacts after validating the data
     * @param address
     */
    set emailAddress(address) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(address)) {
            throw new Error("Invalid email address" + address);
        }
        this._emailAddress = address;
    }
    /**
     * returns a formatted string of the contacts
     * @returns {string}
     */
    toString() {
        return `Full Name: ${this._fullName}\n
                Contact Number: ${this.contactNumber}\n
                Email Address: ${this.emailAddress}`;
    }
    /**
     * Serializes the contacts details into a string (csv) format suitable for storage
     * @returns {string|null}
     */
    serialize() {
        if (!this._fullName || !this._contactNumber || !this._emailAddress) {
            console.error("One or more Contact Properties are missing or invalid.");
            return null;
        }
        return `${this._fullName},${this._contactNumber},${this._emailAddress}`;
    }
    /**
     * Deserializes a csv string of contacts details and updates the contacts properties
     * @param data
     * @returns {null}
     */
    deserialize(data) {
        if (typeof data !== "string" || data.split(",").length !== 3) {
            console.error("The provided data is invalid.");
            return;
        }
        const propertyArray = data.split(",");
        this._fullName = propertyArray[0];
        this._contactNumber = propertyArray[1];
        this._emailAddress = propertyArray[2];
    }
}
//# sourceMappingURL=contact.js.map
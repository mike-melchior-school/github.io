'use strict';



(function (core) {
    /**
     *
     * Represents a contact with a name, contact number and email address
     */
    class Contact {

        /**
         * Constructs a new Contact instance
         * @param fullName
         * @param contactNumber
         * @param emailAddress
         */
        constructor(fullName = "", contactNumber = "", emailAddress = "") {
            this._fullName = fullName;
            this._contactNumber = contactNumber;
            this._emailAddress = emailAddress;
        }

        /**
         * returns the full nama of the contact
         * @returns {string}
         */
        get fullName() {
            return this._fullName;
        }

        /**
         * sets the full name of the contact after validating the data
         * @param fullName
         */
        set fullName(fullName) {
            if (typeof fullName !== "string" || fullName.trim() === "") {
                throw new Error("Invalid full name: must ne a non-empty string");
            }
            this._fullName = fullName;
        }

        /**
         * returns the contact number of the contact
         * @returns {string}
         */
        get contactNumber() {
            return this._contactNumber;
        }

        /**
         * sets the contact number of the contact after validating the data
         * @param contactNumber
         */
        set contactNumber(contactNumber) {
            const phoneRegex = /^\d{3}-\d{3}-\d{4}$/
            if (!phoneRegex.test(contactNumber)) {
                throw new Error("Invalid contactNumber number: must be in the format of ###-###-####");
            }
            this._contactNumber = contactNumber;
        }

        /**
         * returns the email address of the contact
         * @returns {string}
         */
        get emailAddress() {
            return this._emailAddress
        }

        /**
         * sets the email of the contact after validating the data
         * @param address
         */
        set emailAddress(address) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            if (!emailRegex.test(address)) {
                throw new Error("Invalid email address" + address);
            }
            this._emailAddress = address;
        }

        /**
         * returns a formatted string of the contact
         * @returns {string}
         */
        toString = () => {
            return `Full Name: ${this._fullName}\n
                    Contact Number: ${this.contactNumber}\n
                    Email Address: ${this.emailAddress}`;
        }

        /**
         * Serializes the contact details into a string (csv) format suitable for storage
         * @returns {string|null}
         */
        serialize = () => {
            if (!this._fullName || !this._contactNumber || !this._emailAddress) {
                console.error("One or more Contact Properties are missing or invalid.");
                return null;
            }
            return `${this._fullName},${this._contactNumber},${this._emailAddress}`;
        }

        /**
         * Deserializes a csv string of contact details and updates the contact properties
         * @param data
         * @returns {null}
         */
        deserialize = (data) => {
            if (typeof data !== "string" || data.split(",").length !== 3) {
                console.error("The provided data is invalid.");
                return null;
            }
            const propertyArray = data.split(",");
            this._fullName = propertyArray[0];
            this._contactNumber = propertyArray[1];
            this._emailAddress = propertyArray[2];
        }

    }

    core.Contact = Contact;

})(core || (core = {}));
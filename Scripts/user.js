


(function (core) {

    class User {

        constructor(displayName = "", emailAddress = "", username = "", password = "") {
            this._displayName = displayName;
            this._emailAddress = emailAddress;
            this._username = username;
            this._password = password
        }

        get displayName() {
            return this._displayName;
        }

        get emailAddress() {
            return this._emailAddress;
        }

        get username() {
            return this._username;
        }

        set displayName(displayName) {
            this._displayName = displayName;
        }

        set emailAddress(emailAddress) {
            this._emailAddress = this.emailAddress;
        }

        set username(username) {
            this._username = username;
        }





        toString = () => {
            return `Display Name: ${this._displayName}\nEmail Adrress: ${this._emailAddress}\nUsername: ${this._username}`
        }

        serialize = () => {
            if (this._displayName !== "" && this._emailAddress !== "" && this._username !== "") {
                return `${this._displayName},${this._emailAddress},${this._username}`
            }
            console.error("[ERROR] Serialization failed! One or more user properties are missing.")
            return null;
        }

        deserialize = (data) => {
            let propertyArray = data.split(",");
            this._displayName = propertyArray[0];
            this._emailAddress = propertyArray[1];
            this._username = propertyArray[2];
        }

        toJSON = () => {
            return {
                DisplayName: this._displayName,
                EmailAddress: this._emailAddress,
                Username: this._username,
                Password: this._password,
            }
        }

        fromJSON = (json) => {
            this._displayName = json.DisplayName;
            this._emailAddress = json.EmailAddress;
            this._username = json.Username;
            this._password = json.Password;
        }



    }



    core.User = User;
})(core || (core = {}));
namespace core {

    export class User {

        private  _displayName: string;
        private _emailAddress: string;
        private _username: string;
        private _password: string;

        constructor(displayName: string = "", emailAddress: string = "", username: string = "", password: string = "") {
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

        set displayName(displayName: string) {
            this._displayName = displayName;
        }

        set emailAddress(emailAddress: string) {
            this._emailAddress = emailAddress;
        }

        set username(username: string) {
            this._username = username;
        }


        toString(): string {
            return `Display Name: ${this._displayName}\nEmail Adrress: ${this._emailAddress}\nUsername: ${this._username}`
        }

        serialize(): string | null{
            if (this._displayName !== "" && this._emailAddress !== "" && this._username !== "") {
                return `${this._displayName},${this._emailAddress},${this._username}`
            }
            console.error("[ERROR] Serialization failed! One or more user properties are missing.")
            return null;
        }

        deserialize(data: string) {
            let propertyArray = data.split(",");
            this._displayName = propertyArray[0];
            this._emailAddress = propertyArray[1];
            this._username = propertyArray[2];
        }

        toJSON(): Record<string, string> {
            return {
                DisplayName: this._displayName,
                EmailAddress: this._emailAddress,
                Username: this._username,
                Password: this._password,
            }
        }

        fromJSON(
            json: {
                DisplayName: string,
                EmailAddress: string,
                Username: string,
                Password: string,
            }
        ){
            this._displayName = json.DisplayName;
            this._emailAddress = json.EmailAddress;
            this._username = json.Username;
            this._password = json.Password;
        }
    }
}
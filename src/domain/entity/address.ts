export default class Address {
    private _street: string;
    private _number: number = 0;
    private _zip: string;
    private _city: string;

    private validate() {
        if (this._street.length === 0){
            throw new Error("Street is required")
        }
        if (this._number === 0){
            throw new Error("Number is required")
        }

        if (this._zip.length === 0){
            throw new Error("Zip is required")
        }

        if (this._city.length === 0){
            throw new Error("City is required")
        }
    }
    
    constructor(street: string, number: number, zip: string, city: string){
        this._street = street;
        this._number = number;
        this._zip = zip;
        this._city = city;

        this.validate();
    }

    get Street(): string{
        return this._street;
    }

    get Number(): number{
        return this._number;
    }

    get Zipcode(): string{
        return this._zip;
    }

    get City(): string{
        return this._city;
    }


    toString(): string {
        return `${this._street} - ${this._number}, ${this._city} - ${this._zip}`
    }

}
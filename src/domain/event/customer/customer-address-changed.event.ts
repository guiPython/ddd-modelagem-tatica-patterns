import Address from "../../entity/address";
import IEvent from "../@shared/event.interface";

export interface ICustomerAddressChanged {
    id: string,
    name: string,
    address: Address
}

export class CustomerAddressChanged implements IEvent{
    dataTimeOccurred: Date;
    eventData: ICustomerAddressChanged;

    constructor(eventData: ICustomerAddressChanged){
        this.eventData = eventData;
        this.dataTimeOccurred = new Date();
    }
}
import IEventHandler from "../../@shared/event-handler.interface";
import { CustomerAddressChanged } from "../customer-address-changed.event";

export default class SendConsoleLogWhenCustomerAddressChanged implements IEventHandler<CustomerAddressChanged>{
    handle(event: CustomerAddressChanged): void {
        console.log(`Endereço do cliente: 
        ${event.eventData.id}, 
        ${event.eventData.name} alterado para: ${event.eventData.address.toString()}`)
    }
}
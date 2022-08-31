import IEventHandler from "../../@shared/event-handler.interface";
import { CustomerCreated } from "../customer-created.event";

export default class SendConsoleLog1WhenCustomerCreated implements IEventHandler<CustomerCreated>{
    handle(_: CustomerCreated): void {
        console.log("Esse é o segundo console.log do evento: CustomerCreated");
    }
}
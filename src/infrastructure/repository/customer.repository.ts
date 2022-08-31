import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import ICustomerRepository from "../../domain/repository/customer-repository";
import CustomerModel from "../database/sequelize/model/customer.model";

export default class CustomerRepository implements ICustomerRepository {
    async create(entity: Customer): Promise<void> {
        await CustomerModel.create({
            id: entity.Id,
            name: entity.Name,
            active: entity.isActive(),
            rewards: entity.RewardPoints,
            street: entity.Address.Street,
            number: entity.Address.Number,
            zipcode: entity.Address.Zipcode,
            city: entity.Address.City
        });
    }

    async update(entity: Customer): Promise<void> {
        await CustomerModel.update({
            name: entity.Name,
            active: entity.isActive(),
            rewards: entity.RewardPoints,
            street: entity.Address.Street,
            number: entity.Address.Number,
            zipcode: entity.Address.Zipcode,
            city: entity.Address.City
        }, {
            where: {
                id: entity.Id
            },
        });
    }

    async find(id: string): Promise<Customer> {
        let customerModel;
        try{
            customerModel = await CustomerModel.findByPk(id, {rejectOnEmpty: true});
        }catch {
            throw new Error("Customer not found")
        }
        const customer = new Customer(customerModel.id, customerModel.name);
        const address = new Address(customerModel.street, customerModel.number, customerModel.zipcode, customerModel.city);
        customer.changeAddress(address);
        if(customerModel.active) customer.activate();
        return customer;
    }

    async findAll(): Promise<Customer[]> {
        const CustomerModels = await CustomerModel.findAll();
        return CustomerModels.map(customerModel => {
            const customer = new Customer(customerModel.id, customerModel.name);
            const address = new Address(customerModel.street, customerModel.number, customerModel.zipcode, customerModel.city);
            customer.changeAddress(address);
            if(customerModel.active) customer.activate();
            return customer;
        });
    }
}
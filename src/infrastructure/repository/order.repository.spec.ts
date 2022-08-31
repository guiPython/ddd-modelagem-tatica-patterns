import { Sequelize } from "sequelize-typescript";
import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import Product from "../../domain/entity/product";
import CustomerModel from "../database/sequelize/model/customer.model";
import OrderItemModel from "../database/sequelize/model/order-item.model";
import OrderModel from "../database/sequelize/model/order.model";
import ProductModel from "../database/sequelize/model/product.model";
import CustomerRepository from "./customer.repository";
import OrderRepository from "./order.repository";
import ProductRepository from "./product.repository";

describe("Customer repository tests", () => {
    let sequelize: Sequelize;
    jest.setTimeout(10_000);
    
    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        });

        sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
        await sequelize.sync();
    });

    it("should create a new order", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("1", "Some...", 150);
        const other = new Product("2","Other...", 100);

        await productRepository.create(product);
        await productRepository.create(other);
        const item = new OrderItem("1",product.Id, product.Name, product.Price, 2);
        const otherItem = new OrderItem("2",other.Id, other.Name, other.Price, 3);
        const items = [item, otherItem];

        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Guilherme");
        const address = new Address("Rua 7", 59, "123-456", "São Paulo");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const orderRepository = new OrderRepository();
        const order = new Order("1", customer.Id, items);
        await orderRepository.create(order);

        const orderModel = await OrderModel.findByPk(order.Id, {
            include:["items"]
        });
        expect(orderModel.toJSON()).toStrictEqual({
            id: order.Id,
            customer_id: customer.Id,
            total: order.total(),
            items:[
                {
                    id: item.Id,
                    order_id: order.Id,
                    product_id: item.ProductId,
                    name: item.Name,
                    quantity: item.Quantity,
                    price: item.Price,
                },
                {
                    id: otherItem.Id,
                    order_id: order.Id,
                    product_id: otherItem.ProductId,
                    name: otherItem.Name,
                    quantity: otherItem.Quantity,
                    price: otherItem.Price,
                },
            ],
        });
    })

    it("should update a order", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("1", "Some...", 150);
        const otherProduct = new Product("2","Other...", 100);

        await productRepository.create(product);
        await productRepository.create(otherProduct);
        const item = new OrderItem("1",product.Id, product.Name, product.Price, 2);
        const items = [item];

        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Guilherme");
        const address = new Address("Rua 7", 59, "123-456", "São Paulo");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const orderRepository = new OrderRepository();
        const order = new Order("1", customer.Id, items);
        await orderRepository.create(order);

        order.addProduct(product);
        order.addProduct(otherProduct);
        await orderRepository.update(order);

        const orderModel = await OrderModel.findByPk(order.Id, {
            include:["items"]
        });

        expect(orderModel.toJSON()).toMatchObject({
            id: order.Id,
            customer_id: customer.Id,
            total: order.total(),
            items:[
                {
                    id: item.Id,
                    order_id: order.Id,
                    product_id: item.ProductId,
                    name: item.Name,
                    quantity: 3,
                    price: item.Price,
                },
                {
                    order_id: order.Id,
                    product_id: otherProduct.Id,
                    name: otherProduct.Name,
                    quantity: 1,
                    price: otherProduct.Price * 1,
                },
            ],
        });
    })

    it("should find a order", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("1", "Some...", 150);
        const otherProduct = new Product("2","Other...", 100);

        await productRepository.create(product);
        await productRepository.create(otherProduct);
        const item = new OrderItem("1",product.Id, product.Name, product.Price, 2);
        const otherItem = new OrderItem("2",otherProduct.Id, otherProduct.Name, otherProduct.Price, 3);
        const items = [item, otherItem];

        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Guilherme");
        const address = new Address("Rua 7", 59, "123-456", "São Paulo");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const orderRepository = new OrderRepository();
        const order = new Order("1", customer.Id, items);
        await orderRepository.create(order);

        const foundOrder = await orderRepository.find(order.Id);
        expect(foundOrder).toStrictEqual(order);
    })

    it("should find all orders", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("1", "Some...", 150);
        const otherProduct = new Product("2","Other...", 100);

        await productRepository.create(product);
        await productRepository.create(otherProduct);
        const item = new OrderItem("1",product.Id, product.Name, product.Price, 2);
        const otherItem = new OrderItem("2",otherProduct.Id, otherProduct.Name, otherProduct.Price, 3);

        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Guilherme");
        const address = new Address("Rua 7", 59, "123-456", "São Paulo");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const orderRepository = new OrderRepository();
        const order = new Order("1", customer.Id, [item]);
        const otherOrder = new Order("2", customer.Id, [otherItem]);
        await orderRepository.create(order);
        await orderRepository.create(otherOrder);

        const orders = await orderRepository.findAll();

        expect(orders).toEqual([order, otherOrder]);
    })
    
})
import CustomerChangedAddressEvent from "../../customer/event/customer-changed-address.event";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import SendConsoleLogWhenCustomerAddressWasChangedHandler from "../../customer/event/handler/send-console-log-when-customer-address-was-changed.handler";
import SendConsoleLog1WhenCustomerWasCreatedHandler from "../../customer/event/handler/send-console-log1-when-customer-was-created.handler";
import SendConsoleLog2WhenCustomerWasCreatedHandler from "../../customer/event/handler/send-console-log2-when-customer-was-created.handler";
import CustomerFactory from "../../customer/factory/customer.factory";
import Address from "../../customer/value-object/address";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const SendEmailEventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spySendEmailHandler = jest.spyOn(SendEmailEventHandler, "handle");

    const SendConsoleLog1CustomerCreated = new SendConsoleLog1WhenCustomerWasCreatedHandler();
    const spyConsoleLog1CreatedCustomer = jest.spyOn(SendConsoleLog1CustomerCreated, "handle");

    const SendConsoleLog2CustomerCreated = new SendConsoleLog2WhenCustomerWasCreatedHandler();
    const spyConsoleLog2CreatedCustomer = jest.spyOn(SendConsoleLog2CustomerCreated, "handle");

    const SendConsoleLogChangeCustomerAddress = new SendConsoleLogWhenCustomerAddressWasChangedHandler();
    const spyConsoleLogChangeCustomerAddress = jest.spyOn(SendConsoleLogChangeCustomerAddress, "handle");


    eventDispatcher.register("ProductCreatedEvent", SendEmailEventHandler);
    eventDispatcher.register("CustomerCreatedEvent", SendConsoleLog1CustomerCreated);
    eventDispatcher.register("CustomerCreatedEvent", SendConsoleLog2CustomerCreated);
    eventDispatcher.register("CustomerChangedAddressEvent", SendConsoleLogChangeCustomerAddress);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(SendEmailEventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(SendConsoleLog1CustomerCreated);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(SendConsoleLog2CustomerCreated);

    expect(
      eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]
    ).toMatchObject(SendConsoleLogChangeCustomerAddress);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    const customer = CustomerFactory.create("John")
    const customerCreatedEvent = new CustomerCreatedEvent(customer);

    const address = new Address("Street", 1, "13330-250", "São Paulo");
    const costumerWithAddress = CustomerFactory.createWithAddress("Marie", address)
    const customerCreatedWithAddressEvent = new CustomerChangedAddressEvent(costumerWithAddress);

    eventDispatcher.notify(productCreatedEvent);
    eventDispatcher.notify(customerCreatedEvent);
    eventDispatcher.notify(customerCreatedWithAddressEvent);

    expect(spySendEmailHandler).toHaveBeenCalled();
    expect(spyConsoleLog1CreatedCustomer).toHaveBeenCalled();
    expect(spyConsoleLog2CreatedCustomer).toHaveBeenCalled();
    expect(spyConsoleLogChangeCustomerAddress).toHaveBeenCalled();
  });
});

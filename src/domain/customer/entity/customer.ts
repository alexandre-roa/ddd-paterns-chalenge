import CustomerChangedAddressEvent from "../event/customer-changed-address.event";
import CustomerCreatedEvent from "../event/customer-created.event";
import SendConsoleLogWhenCustomerAddressWasChangedHandler from "../event/handler/send-console-log-when-customer-address-was-changed.handler";
import SendConsoleLog1WhenCustomerWasCreatedHandler from "../event/handler/send-console-log1-when-customer-was-created.handler";
import SendConsoleLog2WhenCustomerWasCreatedHandler from "../event/handler/send-console-log2-when-customer-was-created.handler";
import Address from "../value-object/address";

export default class Customer {
  private _id: string;
  private _name: string = "";
  private _address!: Address;
  private _active: boolean = false;
  private _rewardPoints: number = 0;

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
    this.validate();
    this.createdCustomerEvent(this)
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  validate() {
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }
    if (this._name.length === 0) {
      throw new Error("Name is required");
    }
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  get Address(): Address {
    return this._address;
  }
  
  changeAddress(address: Address) {
    this._address = address;
    this.changedCustomerAddressEvent(this)
  }

  isActive(): boolean {
    return this._active;
  }

  activate() {
    if (this._address === undefined) {
      throw new Error("Address is mandatory to activate a customer");
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }

  set Address(address: Address) {
    this._address = address;
  }

  private changedCustomerAddressEvent(customer: Customer) {
    const event = new CustomerChangedAddressEvent(customer)
    new SendConsoleLogWhenCustomerAddressWasChangedHandler().handle(event)
  }

  private createdCustomerEvent(newCustomer: Customer) {
    const event = new CustomerCreatedEvent(newCustomer)
    new SendConsoleLog1WhenCustomerWasCreatedHandler().handle(event)
    new SendConsoleLog2WhenCustomerWasCreatedHandler().handle(event)
  }
}

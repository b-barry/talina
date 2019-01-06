import {charges, orders} from 'stripe';

export interface CreateOrder {
  items: OrderItems[];
  email: string;
  shipping: Shipping;
  currency?;
}

export interface UpdateOrder  {
  metadata: { status: string }
}

export interface CreateCharge {
  sourceId: string;
  idempotencyKey: string;
  currency: string;
  email: string;
  amount: string | number;
}

export enum OrderStatus {
  CREATED = 'created',
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

export enum SourceStatus {
  CHARGEABLE = 'chargeable',
}
export enum ChargeStatus {
  SUCCEEDED = 'succeeded',
}


export interface Order extends orders.IOrder {
}

export interface Charge extends charges.ICharge {
}

export interface OrderItems {
  type: string;
  quantity: string | number;
  skuId: string;
}

export interface CreateOrderRequest {
  cartId: string;
  email: string;
  shipping: Shipping;
  createIntent: boolean;
}

export interface Shipping {
  name: string;
  address: Address;
}

export interface Address {
  line1: string;
  city: string;
  postal_code: string;
  country: string;
}

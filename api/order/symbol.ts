import {orders} from 'stripe';

export interface CreateOrder {
  items: OrderItems[];
  email: string;
  shipping: Shipping;
  currency?;
}

export enum OrderStatus {
  CREATED = 'created',
}

export interface Order extends orders.IOrder {
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

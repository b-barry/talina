import { stripe } from './config';
import { orders } from 'stripe';
import {
  CreateOrder,
  Order,
  OrderStatus,
  UpdateOrder,
} from '../../order/symbol';

export const getById = (id: string): Promise<orders.IOrder> => {
  return stripe.orders.retrieve(id);
};

export const create = ({
  items,
  email,
  shipping,
  currency = 'eur',
}: CreateOrder): Promise<orders.IOrder> => {
  const data = {
    email,
    shipping,
    currency,
    items: items.map(({ skuId, ...rest }) => ({ ...rest, parent: skuId })),
    metadata: {
      status: OrderStatus.CREATED,
    },
  };
  return stripe.orders.create(data);
};

export const update = async (
  orderId: string,
  properties: UpdateOrder
): Promise<Order> => {
  return stripe.orders.update(orderId, properties);
};

import { stripe } from './config';
import { orders } from 'stripe';
import { CreateOrder, OrderStatus } from '../../order/symbol';

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
  console.log('order::create::data', JSON.stringify(data, null, 1));
  return stripe.orders.create(data);
};

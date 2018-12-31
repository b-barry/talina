import { stripe } from './config';
import { customers, skus } from 'stripe';

export const create = (
  data: customers.ICustomerCreationOptions
): Promise<customers.ICustomer> => {
  return stripe.customers.create(data);
};

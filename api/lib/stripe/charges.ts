import {stripe} from './config';
import {charges} from 'stripe';

export const create = (
  data: charges.IChargeCreationOptions
): Promise<charges.ICharge> => {
  return stripe.charges.create(data);
};

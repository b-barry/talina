import {stripe} from './config';
import {skus} from 'stripe';

export const getSkusWithProduct = (id): Promise<skus.ISku> => {
  return stripe.skus.retrieve(id, {
    expand: ['product']
  })
};

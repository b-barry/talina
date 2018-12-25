import { stripe } from './config';
import { skus } from 'stripe';

export const getSkusWithProduct = (id): Promise<skus.ISku> => {
  return stripe.skus.retrieve(id, {
    expand: ['product'],
  });
};

export const isSkuValid = async (id): Promise<boolean> => {
  try {
    const data = await stripe.skus.retrieve(id);
    return !!data;
  } catch (e) {
    return false;
  }
};

export const hasInStock = async (
  id: string,
  quantity: string
): Promise<boolean> => {
  try {
    const data = await stripe.skus.retrieve(id);
    return data.inventory.quantity >= quantity;
  } catch (e) {
    return false;
  }
};

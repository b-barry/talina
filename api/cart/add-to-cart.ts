import { responseJson } from '../lib/util';
import parse from 'url-parse';
import { getSkusWithProduct, isSkuValid } from '../lib/stripe';
import {addToCart} from '../lib/db/cart-item-queries';

module.exports = async (req, res) => {
  const { query } = parse(req.url || '', true);
  if (!query || !query.customerCartId) {
    return responseJson(res, { error: 'customerCartId is required' }, 400);
  }

  if (!query || !query.skuId) {
    return responseJson(res, { error: 'skuId is required' }, 400);
  }

  const { customerCartId, skuId } = query;

  if (!(await isSkuValid(skuId))) {
    return responseJson(res, { error: 'skuId is not valid' }, 400);
  }

  const record = await addToCart(customerCartId, skuId);
  return responseJson(res, {
    ...record,
    sku: await getSkusWithProduct(record.skuId),
  });
};

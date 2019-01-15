import { responseJson, to } from '../lib/util';
import { getSkusWithProduct, hasInStock } from '../lib/stripe';
import parse from 'url-parse';
import { updateQuantity } from '../lib/db/cart-item-queries';

module.exports = async (req, res) => {
  const { query } = parse(req.url || '', true);
  if (!query || !query.customerCartId) {
    return responseJson(res, { error: 'customerCartId is required' }, 400);
  }

  if (!query || !query.skuId) {
    return responseJson(res, { error: 'skuId is required' }, 400);
  }

  if (!query || !query.quantity) {
    return responseJson(res, { error: 'quantity is required' }, 400);
  }

  const { customerCartId, skuId, quantity } = query;

  if (!(await hasInStock(skuId, quantity))) {
    return responseJson(res, { error: 'insufficient stock' }, 400);
  }

  const [updateQuantityError, record] = await to(
    updateQuantity(customerCartId, skuId, parseInt(quantity, 10))
  );

  if (updateQuantityError || !record) {
    return responseJson(res, { error: 'impossible to update quantity' }, 400);
  }

  responseJson(res, {
    ...record,
    sku: await getSkusWithProduct(record.skuId),
  });
};

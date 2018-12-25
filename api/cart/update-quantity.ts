import { responseJson } from '../lib/util';
import { getSkusWithProduct, hasInStock, isSkuValid } from '../lib/stripe';
import { addToCart, updateQuantity } from '../lib/airtable';
import parse from 'url-parse';

module.exports = async (req, res) => {
  const { query } = parse(req.url || '', true);
  if (!query || !query.customerCartId) {
    responseJson(res, { error: 'customerCartId is required' }, 400);
    return;
  }

  if (!query || !query.skuId) {
    responseJson(res, { error: 'skuId is required' }, 400);
    return;
  }

  if (!query || !query.quantity) {
    responseJson(res, { error: 'quantity is required' }, 400);
    return;
  }

  const { customerCartId, skuId, quantity } = query;

  if (!(await hasInStock(skuId, quantity))) {
    responseJson(res, { error: 'insufficient stock' }, 400);
    return;
  }

  const record = await updateQuantity(
    customerCartId,
    skuId,
    parseInt(quantity, 10)
  );
  if (!record) {
    responseJson(res, { error: 'impossible to update quantity' }, 400);
    return;
  }
  responseJson(res, {
    ...record.fields,
    sku: await getSkusWithProduct(record.fields.stripeSkuId),
  });
};

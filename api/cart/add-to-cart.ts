import { responseJson } from '../lib/util';
import { addToCart } from '../lib/airtable';
import parse from 'url-parse';
import { getSkusWithProduct, isSkuValid } from '../lib/stripe';

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

  const { customerCartId, skuId } = query;

  if (!(await isSkuValid(skuId))) {
    responseJson(res, { error: 'skuId is not valid' }, 400);
    return;
  }

  const record = await addToCart(customerCartId, skuId);
  responseJson(res, {
    ...record.fields,
    sku: await getSkusWithProduct(record.fields.stripeSkuId),
  });
};

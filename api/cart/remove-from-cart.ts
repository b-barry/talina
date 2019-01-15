import { responseJson, to } from '../lib/util';
import parse from 'url-parse';
import { removeByCartIdAndSkuId } from '../lib/db/cart-item-queries';

module.exports = async (req, res) => {
  const { query } = parse(req.url || '', true);
  if (!query || !query.customerCartId) {
    return responseJson(res, { error: 'customerCartId is required' }, 400);
  }

  if (!query || !query.skuId) {
    return responseJson(res, { error: 'skuId is required' }, 400);
  }

  const { customerCartId, skuId } = query;

  const [error] = await to(removeByCartIdAndSkuId(customerCartId, skuId));
  if (error) {
    return responseJson(res, {}, 400);
  }
  responseJson(res, {}, 200);
};

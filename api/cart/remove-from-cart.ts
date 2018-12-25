import {responseJson} from '../lib/util';
import {removeByCartIdAndSkuId} from '../lib/airtable';
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

  const { customerCartId, skuId } = query;


  const success = await removeByCartIdAndSkuId(customerCartId, skuId);
  responseJson(res, {}, success ? 200 : 400);
};

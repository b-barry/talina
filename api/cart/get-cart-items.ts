import {responseJson} from '../lib/util';
import {AirtableApiResponse, AirtableCartItems, getAllCartItemsByCartId,} from '../lib/airtable';
import {getSkusWithProduct} from '../lib/stripe';
import parse from 'url-parse';

module.exports = async (req, res) => {
  const { query } = parse(req.url || '', true);
  if (!query || !query.customerCartId) {
    responseJson(res, { error: 'customerCartId is required' }, 400);
    return;
  }

  const cartItems: AirtableApiResponse<AirtableCartItems>[] = await getAllCartItemsByCartId(query.customerCartId);

  const cartItemsWithSku = await Promise.all(
    cartItems.map(async (item: AirtableApiResponse<AirtableCartItems>) => {
      return {
        ...item.fields,
        sku: await getSkusWithProduct(item.fields.stripeSkuId),
      };
    })
  );

  responseJson(res, cartItemsWithSku);
};

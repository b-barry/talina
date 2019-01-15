import {responseJson} from '../lib/util';

import {getSkusWithProduct} from '../lib/stripe';
import parse from 'url-parse';
import {CartItemEntity} from '../lib/db/cart-item-model';
import {getAllCartItemsByCartId} from '../lib/db/cart-item-queries';

module.exports = async (req, res) => {
  const { query } = parse(req.url || '', true);
  if (!query || !query.customerCartId) {
    return responseJson(res, { error: 'customerCartId is required' }, 400);
  }

  const cartItems: CartItemEntity[] = await getAllCartItemsByCartId(
    query.customerCartId
  );
  console.log('cartItems', JSON.stringify(cartItems, null, 1))
  const cartItemsWithSku = await Promise.all(
    cartItems.map(async (item: CartItemEntity) => {
      return {
        ...item,
        sku: await getSkusWithProduct(item.skuId),
      };
    })
  );

  return responseJson(res, cartItemsWithSku);
};

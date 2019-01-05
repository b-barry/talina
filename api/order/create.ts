import {createError, isOptions, isPost, responseError, responseJson, to,} from '../lib/util';
import {CreateOrderRequest, Order, OrderItems} from './symbol';
import {getAllCartItemsByCartId} from '../lib/airtable';
import {create} from '../lib/stripe/orders';

module.exports = async (req, res) => {
  if (isOptions(req)) {
    return responseJson(res, {});
  }
  const [postError, body] = await to(isPost(req));
  if (postError) {
    return responseError(res, postError);
  }

  // TODO: check if cart is valid i.e it was not paid yet
  const [cartItemsError, cartItems] = await to(
    getAllCartItemsByCartId(body.cartId)
  );

  if (cartItemsError) {
    console.log('Error::cartItemsError', cartItemsError);
    return responseError(
      res,
      createError(400, 'Impossible to retrieve cart items')
    );
  }

  if (cartItems.length === 0) {
    return responseError(
      res,
      createError(400, 'Impossible to create an order for an empty cart')
    );
  }
  const orderItems: OrderItems[] = cartItems.map(item => {
    return {
      type: 'sku',
      skuId: item.fields.stripeSkuId,
      quantity: item.fields.quantity,
    };
  });
  const { cartId, ...rest } = body as CreateOrderRequest;
  const [createOrderError, orderCreated] = await to<Order, Error>(
    create({ ...rest, items: orderItems })
  );

  if (createOrderError) {
    console.log('Error::createOrderError', createOrderError);
    return responseError(
      res,
      createError(400, 'Impossible to create the order')
    );
  }

  responseJson(res, orderCreated, 200);
};

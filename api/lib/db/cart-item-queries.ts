import { CartItemEntity, getCartItemModel } from './cart-item-model';
import { to } from '../util';
import { getCartModel } from './cart-model';

export const getAllCartItemsByCartId = async (
  cartId: string
): Promise<CartItemEntity[]> => {
  const CartItemModel = await getCartItemModel();
  const CartModel = await getCartModel();
  const [getCartError, cart] = await to(
    CartModel.findOne({ customerCartId: cartId }).exec()
  );

  if (getCartError) {
    console.log('Error::addToCart::getCartError', getCartError);
    throw getCartError;
  }

  const [getCartItemError, cartItems] = await to(
    CartItemModel.find({
      cart: cart.id,
    }).exec()
  );

  if (getCartItemError || !cartItems) {
    console.log(
      'Error::getAllCartItemsByCartId',
      cartId,
      getCartItemError || cartItems
    );
    return [];
  }
  return cartItems.map(i => i.toClient()) || [];
};

export const addToCart = async (
  customerCartId: string,
  skuId: string,
  quantity: number = 1
): Promise<CartItemEntity> => {
  const CartItemModel = await getCartItemModel();
  const CartModel = await getCartModel();

  const [getCartError, cart] = await to(
    CartModel.findOne({ customerCartId: customerCartId }).exec()
  );

  if (getCartError || !cart) {
    console.log('Error::addToCart::getCartError', getCartError);
    throw getCartError || new Error('no-cart-found');
  }

  let [getCartItemError, record] = await to(
    CartItemModel.findOne({ cart: cart.id, skuId }).exec()
  );

  if (getCartItemError) {
    console.log('Error::addToCart::getCartItemError', getCartItemError);
    throw getCartItemError;
  }

  if (record) {
    record.quantity = record.quantity + 1;
  }

  if (!record) {
    record = new CartItemModel({
      skuId,
      quantity,
      cart: cart.id,
    });
  }

  const [updateRecordError, updatedRecord] = await to(record.save());

  if (updateRecordError) {
    console.log('Error::addToCart::updateRecordError', updateRecordError);
    throw updateRecordError;
  }

  return updatedRecord.toClient();
};

export const updateQuantity = async (
  customerCartId: string,
  skuId: string,
  quantity: number = 1
): Promise<CartItemEntity> => {
  const CartItemModel = await getCartItemModel();
  const CartModel = await getCartModel();

  const [getCartError, cart] = await to(
    CartModel.findOne({ customerCartId: customerCartId }).exec()
  );

  if (getCartError || !cart) {
    console.log('Error::addToCart::getCartError', getCartError);
    throw getCartError || new Error('no-cart-found');
  }

  let [getCartItemError, record] = await to(
    CartItemModel.findOne({ cart: cart.id, skuId }).exec()
  );

  if (getCartItemError || !record) {
    console.log(
      'Error::updateQuantity::getCartItemError',
      getCartItemError,
      record
    );
    throw getCartItemError || new Error('no-cart-item-found');
  }

  if (quantity <= 0) {
    quantity = 1;
  }

  record.quantity = quantity;

  const [updateRecordError, updatedRecord] = await to(record.save());

  if (updateRecordError) {
    console.log('Error::updateQuantity::updateRecordError', updateRecordError);
    throw updateRecordError;
  }

  return updatedRecord.toClient();
};

export const removeById = async (id: string): Promise<boolean> => {
  const CartItemModel = await getCartItemModel();
  const [error] = await to(CartItemModel.deleteOne({ _id: id }).exec());
  return !error;
};

export const removeByCartIdAndSkuId = async (
  customerCartId: string,
  skuId: string
): Promise<boolean> => {
  const CartItemModel = await getCartItemModel();
  const CartModel = await getCartModel();

  const [getCartError, cart] = await to(
    CartModel.findOne({ customerCartId: customerCartId }).exec()
  );

  if (getCartError || !cart) {
    console.log('Error::addToCart::getCartError', getCartError);
    throw getCartError || new Error('no-cart-found');
  }

  const [error, record] = await to(
    CartItemModel.deleteOne({ cart: cart.id, skuId }).exec()
  );

  return !error;
};

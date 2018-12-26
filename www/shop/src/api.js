import { isProductionEnvironment } from './utils';

const API_BASE_URL = process.env.api_base_url;

export const fetchQuantityAvailable = async (skuId = '') => {
  if (!isProductionEnvironment()) {
    return 100;
  }
  // perform real fetching
};

export const fetchCartItems = async cartId => {
  const r = await fetch(
    `${API_BASE_URL}/cart/get-cart-items.js?customerCartId=${cartId}`
  );

  return r.json();
};

export const addToCart = async (cartId, skuId) => {
  const r = await fetch(
    `${API_BASE_URL}/cart/add-to-cart.js?customerCartId=${cartId}&skuId=${skuId}`
  );

  return r.json();
};

export const updateQuantity = async (cartId, skuId, quantity) => {
  const r = await fetch(
    `${API_BASE_URL}/cart/update-quantity.js?customerCartId=${cartId}&skuId=${skuId}&quantity=${quantity}`
  );

  return r.json();
};


export const removeFromCart = async (cartId, skuId) => {
  const r = await fetch(
    `${API_BASE_URL}/cart/remove-from-cart.js?customerCartId=${cartId}&skuId=${skuId}`
  );

  return r.json();
};

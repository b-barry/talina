import React from 'react';
import {
  addToCart,
  createOrder,
  fetchCartItems,
  getOrderById,
  removeFromCart,
  updateQuantity,
} from './api';
import { generateCartId, to } from './utils';

export const CART_ID_KEY = 'talina-cart-id';
export const ORDER_ID_KEY = 'talina-order-id';

export const getPersistedCartIdFromLocalStorage = () => {
  return localStorage.getItem(CART_ID_KEY);
};

export const persistCartIdToLocalStorage = cartId => {
  localStorage.setItem(CART_ID_KEY, cartId);
};

export const getPersistedOrderIdFromLocalStorage = () => {
  return localStorage.getItem(ORDER_ID_KEY);
};

export const persistOrderIdToLocalStorage = id => {
  localStorage.setItem(ORDER_ID_KEY, id);
};

export const StoreContext = React.createContext({
  cart: [],
  addToCart: async sku => {},
  updateQuantity: async (skuId, quantity) => {},
  removeFromCart: async skuId => {},
  createOrder: async () => {},
  order: null,
  isLoading: false,
  isLoaded: false,
  err: null,
});

class Provider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cartId: this.getCartId(),
      cart: [],
      addToCart: this.addToCart,
      updateQuantity: this.updateQuantity,
      removeFromCart: this.removeFromCart,
      createOrder: this.createOrder,
      order: null,
      isLoading: false,
      isLoaded: false,
      err: null,
    };
  }

  async componentDidMount() {
    const cart = await fetchCartItems(this.state.cartId);

    this.setState(state => ({
      cart,
    }));
  }

  render() {
    return (
      <StoreContext.Provider value={this.state}>
        {this.props.children}
      </StoreContext.Provider>
    );
  }

  getCartId() {
    const id = getPersistedCartIdFromLocalStorage() || generateCartId();
    persistCartIdToLocalStorage(id);
    return id;
  }

  addToCart = async sku => {
    const record = await addToCart(this.state.cartId, sku.id);
    this.setState(state => {
      return {
        ...state,
        cart: state.cart
          .filter(product => product.id !== record.id)
          .concat([record]),
      };
    });
  };

  updateQuantity = async (skuId, quantity) => {
    const record = await updateQuantity(this.state.cartId, skuId, quantity);
    this.setState(state => {
      let cart = [...state.cart];
      const productIndexInCart = cart.findIndex(item => item.id === record.id);
      cart[productIndexInCart] = record;

      return {
        ...state,
        cart,
      };
    });
  };

  removeFromCart = async skuId => {
    await removeFromCart(this.state.cartId, skuId);

    this.setState(state => {
      return {
        ...state,
        cart: state.cart.filter(item => item.sku.id !== skuId),
      };
    });
  };

  createOrder = async (cartId = this.state.cartId, email, shipping) => {
    const [err, order] = await to(createOrder(cartId, email, shipping));
    if (err) {
      throw err;
    }

    persistOrderIdToLocalStorage(order.id);
    return order;
  };

  getOrderById = async id => {
    return getOrderById(id);
  };
}

export const StoreProvider = Provider;

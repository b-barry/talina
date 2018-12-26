import React from 'react';
import {addToCart, fetchCartItems, removeFromCart, updateQuantity} from './api';
import { generateCartId } from './utils';

export const CART_ID_KEY = 'talina-cart-id';

export const getPersistedCartIdFromLocalStorage = () => {
  return localStorage.getItem(CART_ID_KEY);
};

export const persistCartIdToLocalStorage = cartId => {
  localStorage.setItem(CART_ID_KEY, cartId);
};

export const AppContext = React.createContext({
  cart: [],
  addToCart: (sku) => {},
  updateQuantity: (skuId, quantity) => {},
  removeFromCart: (skuId) => {},
});

class Provider extends React.Component {
  constructor(props) {
    super(props);
    this.addToCart = this.addToCart.bind(this);
    this.updateQuantity = this.updateQuantity.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);

    this.state = {
      cartId: this.getCartId(),
      cart: [],
      addToCart: this.addToCart,
      updateQuantity: this.updateQuantity,
      removeFromCart: this.removeFromCart,
    };
  }

  getCartId() {
    const id = getPersistedCartIdFromLocalStorage() || generateCartId();
    persistCartIdToLocalStorage(id);
    return id;
  }

  async componentDidMount() {
    const cart = await fetchCartItems(this.state.cartId);

    this.setState(state => ({
      cart,
    }));
  }

  async addToCart(sku) {
    const record = await addToCart(this.state.cartId, sku.id);
    this.setState(state => {
      return {
        ...state,
        cart: state.cart
          .filter(product => product.id !== record.id)
          .concat([record]),
      };
    });
  }

  async updateQuantity(skuId, quantity) {
    const record = await updateQuantity(this.state.cartId, skuId, quantity);
    this.setState(
      state => {
        let cart = [...state.cart];
        const productIndexInCart = cart.findIndex(item => item.id === record.id);
        cart[productIndexInCart] = record;

        return {
          ...state,
          cart,
        };
      });
  }

  async removeFromCart(skuId) {
    await removeFromCart(this.state.cartId, skuId);

    this.setState(
      state => {
        return {
          ...state,
          cart: state.cart.filter(item => item.sku.id !== skuId),
        };
      });
  }

  render() {
    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export const AppProvider = Provider;

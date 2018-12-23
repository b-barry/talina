import React from 'react'

export const CART_STORAGE_KEY = 'TALINA_CART_PERSIST'

export const getPersistedCartFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem(CART_STORAGE_KEY))
}

export const persistCartToLocalStorage = (cart = []) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
}

export const AppContext = React.createContext({
  cart: getPersistedCartFromLocalStorage() || [],
  addToCart: (product, quantity) => {},
  updateQuantity: (id, quantity) => {},
  removeFromCart: (id, quantity) => {},
})

class Provider extends React.Component {
  constructor(props) {
    super(props)
    this.addToCart = this.addToCart.bind(this)
    this.updateQuantity = this.updateQuantity.bind(this)
    this.removeFromCart = this.removeFromCart.bind(this)

    this.state = {
      cart: getPersistedCartFromLocalStorage() || [],
      addToCart: this.addToCart,
      updateQuantity: this.updateQuantity,
      removeFromCart: this.removeFromCart,
    }
  }

  addToCart(product, quantity) {
    this.setState(
      state => {
        let cart = [...state.cart]

        const productIndexInCart = cart.findIndex(
          item => item.id === product.id
        )

        if (productIndexInCart !== -1) {
          const productInCart = cart[productIndexInCart]
          cart[productIndexInCart] = {
            ...productInCart,
            quantity: productInCart.quantity + quantity,
          }
        } else {
          cart = [
            ...cart,
            {
              ...product,
              quantity,
            },
          ]
        }
        return {
          ...state,
          cart,
        }
      },
      () => {
        persistCartToLocalStorage(this.state.cart)
      }
    )
  }

  updateQuantity(id, quantity) {
    this.setState(
      state => {
        let cart = [...state.cart]
        const productIndexInCart = cart.findIndex(item => item.id === id)
        const productInCart = cart[productIndexInCart]
        cart[productIndexInCart] = {
          ...productInCart,
          quantity: parseInt(quantity, 10),
        }

        return {
          ...state,
          cart,
        }
      },
      () => {
        persistCartToLocalStorage(this.state.cart)
      }
    )
  }

  removeFromCart(id) {
    this.setState(
      state => {
        return {
          ...state,
          cart: state.cart.filter(item => item.id !== id),
        }
      },
      () => {
        persistCartToLocalStorage(this.state.cart)
      }
    )
  }

  render() {
    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    )
  }
}

export const AppProvider = Provider

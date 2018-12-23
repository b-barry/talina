import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { AppContext } from '../app-context'
import CartPage from '../pages/cart'
import { sumCartQuantities } from '../utils'
import CartDeliveryInfo from './cart-delivery-info'
import CartPaymentInfo from './cart-payment-info'
import CartRow from './cart-row'

class CartList extends Component {
  render() {
    const { cart, updateQuantity, removeFromCart } = this.context
    const count = sumCartQuantities(cart)
    return (
      <div className="w-full mt-4 mb-6 lg:mb-0 lg:w-2/3 px-4 flex flex-col">
        <div className="flex flex-col">
          <div className="mb-4 flex-grow flex flex-col bg-white border border-grey-lighter overflow-hidden">
            <div className="px-6 mb-2">
              <p className="text-black pt-4 font-bold text-2xl flex flex-wrap justify-between">
                <span>Mon panier </span> <span> {count} articles </span>
              </p>
            </div>
            <ul className="list-reset px-6">
              {cart.map(item => {
                return (
                  <CartRow
                    key={item.id}
                    {...item}
                    onUpdateQuantity={updateQuantity}
                    onRemoveFromCart={removeFromCart}
                  />
                )
              })}
            </ul>
            <div className="px-6 py-4">
              <div className="text-left font-normal text-sm text-blue-dark">
                Les articles dans le panier ne sont pas réservés.
              </div>
            </div>
          </div>
          <CartDeliveryInfo />
          <CartPaymentInfo />
        </div>
      </div>
    )
  }
}

CartList.contextType = AppContext

export default CartList

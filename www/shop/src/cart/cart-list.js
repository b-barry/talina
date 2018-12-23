import PropTypes from 'prop-types'
import React from 'react'
import { sumCartQuantities } from '../utils'
import CartDeliveryInfo from './cart-delivery-info'
import CartPaymentInfo from './cart-payment-info'
import CartRow from './cart-row'

function CartList({ cart, onRemoveFromCart, onUpdateQuantity }) {
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
                  onUpdateQuantity={onUpdateQuantity}
                  onRemoveFromCart={onRemoveFromCart}
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

CartList.propTypes = {
  onUpdateQuantity: PropTypes.func,
  onRemoveFromCart: PropTypes.func,
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      price: PropTypes.number,
      attributes: PropTypes.shape({
        size: PropTypes.string,
        pack: PropTypes.string,
      }),
      object: PropTypes.string,
      inventory: PropTypes.shape({
        quantity: PropTypes.number,
        type: PropTypes.string,
      }),
      currency: PropTypes.string,
      quantity: PropTypes.number,
    })
  ).isRequired,
}

export default CartList

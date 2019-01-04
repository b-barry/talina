import React from 'react'
import { StoreContext } from '../store-context'
import CartList from '../cart/cart-list'
import CartSummary from '../cart/cart-summary'

import Layout from '../components/layout'
import SEO from '../components/seo'
import { sumCartPrices } from '../utils'

function CartPage() {
  return (
    <Layout>
      <SEO title="Cart" keywords={[`shop`, `talina`, `hubiscu`]} />
      <div className="flex flex-wrap justify-between mt-5 bg-grey-lighter">
        <StoreContext.Consumer>
          {context => {
            const { cart, updateQuantity, removeFromCart } = context
            return (
              <>
                <CartList
                  cart={cart}
                  onUpdateQuantity={updateQuantity}
                  onRemoveFromCart={removeFromCart}
                />
                <CartSummary subtotal={sumCartPrices(cart)} shippingFee="490"  itemsCount={cart.length}/>
              </>
            )
          }}
        </StoreContext.Consumer>
      </div>
    </Layout>
  )
}

export default CartPage

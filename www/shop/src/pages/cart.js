import React from 'react'
import { AppContext } from '../app-context'
import CartList from '../cart/cart-list'
import CartSummary from '../cart/cart-summary'

import Layout from '../components/layout'
import SEO from '../components/seo'

function CartPage() {
  return (
    <Layout>
      <SEO title="Cart" keywords={[`shop`, `talina`, `hubiscu`]} />
      <div className="flex flex-wrap justify-between mt-5 bg-grey-lighter">
        <CartList />
        <CartSummary />
      </div>
    </Layout>
  )
}

export default CartPage

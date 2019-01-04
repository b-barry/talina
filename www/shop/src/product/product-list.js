import { graphql, StaticQuery } from 'gatsby'
import React, { Component } from 'react'
import { StoreContext } from '../store-context'
import Product from './product'

const query = graphql`
  query ProductListQuery {
    products: allStripeProduct {
      edges {
        node {
          id
          name
          caption
          description
          skus {
            object
            total_count
            data {
              id
              price
              attributes {
                size
                pack
              }
              object
              inventory {
                quantity
                type
              }
              currency
            }
          }
        }
      }
    }
  }
`

class ProductList extends Component {
  render() {
    const { addToCart } = this.context
    return (
      <StaticQuery
        query={query}
        render={data => {
          return data.products.edges.map(edge => (
            <Product
              key={edge.node.id}
              data={edge.node}
              addToCart={addToCart}
            />
          ))
        }}
      />
    )
  }
}

ProductList.contextType = StoreContext

export default ProductList

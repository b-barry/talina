import { graphql, StaticQuery } from 'gatsby'
import React from 'react'
import { groupBy } from '../utils'
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

const ProductList = () => {
  return (
    <StaticQuery
      query={query}
      render={data => {
        return data.products.edges.map(edge => <Product key={edge.node.id} data={edge.node} />)
      }}
    />
  )
}

export default ProductList

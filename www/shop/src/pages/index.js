import React from 'react'

import Layout from '../components/layout'
import ProductList from '../product/product-list'
import SEO from '../components/seo'

const IndexPage = () => (
  <Layout>
    <SEO title="Home" keywords={[`shop`, `talina`, `hubiscu`]} />
    <ProductList />
  </Layout>
)

export default IndexPage

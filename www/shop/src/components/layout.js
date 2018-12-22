import PropTypes from 'prop-types'
import React from 'react'

import Header from './header'

const Layout = ({ children }) => (
  <>
    <Header />
    <div className="container mx-auto">{children}</div>
  </>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout

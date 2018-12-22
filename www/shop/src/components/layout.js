import PropTypes from 'prop-types'
import React from 'react'
import {AppProvider} from '../app-context';

import Header from './header'

const Layout = ({ children }) => (
  <AppProvider>
    <Header />
    <div className="container mx-auto">{children}</div>
  </AppProvider>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout

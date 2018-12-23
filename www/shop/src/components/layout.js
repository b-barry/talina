import PropTypes from 'prop-types'
import React from 'react'
import { AppProvider } from '../app-context'
import Container from './container'

import Header from './header'

const Layout = ({ children }) => (
  <AppProvider>
    <Header />
    <Container>{children}</Container>
  </AppProvider>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout

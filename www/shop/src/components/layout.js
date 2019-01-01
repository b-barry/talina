import PropTypes from 'prop-types';
import React from 'react';
import Container from './container';

import Header from './header';

const Layout = ({ children }) => (
  <>
    <Header />
    <Container>{children}</Container>
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;

import PropTypes from 'prop-types';
import React from 'react';
import Container from './container';

import Header from './header';

const Layout = ({ children }) => (
  <div style={{height: '100vh'}}>
    <Header />
    <div className="bg-grey-lighter w-full h-full">
      <Container>{children}</Container>
    </div>
  </div>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;

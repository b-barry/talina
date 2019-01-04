/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */
import React from 'react';

import { StoreProvider } from './src/store-context';
import { UserProvider } from './src/user-context';

require('./src/styles/global.css');

export const wrapRootElement = ({ element }) => (
  <UserProvider>{<StoreProvider>{element}</StoreProvider>}</UserProvider>
);

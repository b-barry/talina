import React from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';
import { AppContext } from '../app-context';
import CheckoutForm from '../checkout/checkout-form';

import Layout from '../components/layout';
import SEO from '../components/seo';

function CheckoutPage() {
  return (
    <Layout>
      <SEO title="Cart" keywords={[`shop`, `talina`, `hubiscu`]} />
      <AppContext.Consumer>
        {context => {
          const { cart } = context;
          return (
            <StripeProvider apiKey={process.env.STRIPE_PAYEMENT}>
              <Elements>
                <CheckoutForm cart={cart} />
              </Elements>
            </StripeProvider>
          );
        }}
      </AppContext.Consumer>
    </Layout>
  );
}

export default CheckoutPage;

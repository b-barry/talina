import React from 'react';
import {Elements, StripeProvider} from 'react-stripe-elements';
import CheckoutForm from '../checkout/checkout-form';

import Layout from '../components/layout';
import SEO from '../components/seo';

function CheckoutPage() {
  return (
    <Layout>
      <SEO title="Cart" keywords={[`shop`, `talina`, `hubiscu`]}/>
      <StripeProvider apiKey={process.env.STRIPE_PAYEMENT}>
        <Elements>
          <CheckoutForm />
        </Elements>
      </StripeProvider>
    </Layout>
  );
}

export default CheckoutPage;

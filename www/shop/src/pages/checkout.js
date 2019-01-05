import React from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';
import { StoreContext } from '../store-context';
import CheckoutForm from '../checkout/checkout-form';

import Layout from '../components/layout';
import SEO from '../components/seo';
import { UserContext } from '../user-context';

function CheckoutPage() {
  return (
    <Layout>
      <SEO title="Cart" keywords={[`shop`, `talina`, `hubiscu`]} />
      <UserContext.Consumer>
        {userContext => (
          <StoreContext.Consumer>
            {storeContext => {
              return (
                <StripeProvider apiKey={process.env.STRIPE_PAYEMENT}>
                  <Elements>
                    <CheckoutForm storeContext={storeContext} userContext={userContext}/>
                  </Elements>
                </StripeProvider>
              );
            }}
          </StoreContext.Consumer>
        )}
      </UserContext.Consumer>
    </Layout>
  );
}

export default CheckoutPage;

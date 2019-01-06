import { Location } from '@reach/router';
import React from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';
import CheckoutForm from '../checkout/checkout-form';

import Layout from '../components/layout';
import SEO from '../components/seo';
import { StoreContext } from '../store-context';
import { UserContext } from '../user-context';

function CheckoutPage() {
  return (
    <Layout>
      <SEO title="Cart" keywords={[`shop`, `talina`, `hubiscu`]} />
      <UserContext.Consumer>
        {userContext => (
          <StoreContext.Consumer>
            {storeContext => (
              <Location>
                {({location}) => (
                  <StripeProvider apiKey={process.env.STRIPE_PAYEMENT}>
                    <Elements>
                      <CheckoutForm
                        location={location}
                        storeContext={storeContext}
                        userContext={userContext}
                      />
                    </Elements>
                  </StripeProvider>
                )}
              </Location>
            )}
          </StoreContext.Consumer>
        )}
      </UserContext.Consumer>
    </Layout>
  );
}

export default CheckoutPage;

import React, { Component } from 'react';
import { injectStripe } from 'react-stripe-elements';
import AccountStep from '../checkout/account-step';
import PaymentStep from '../checkout/payment-step';
import { If } from '../components/if';
import { getTotalPrice, mb, sumCartPrices, to } from '../utils';
import AccountFilledStep from './account-filled-step';
import AddressStep from './address-step';
import CheckoutSummary from './checkout-summary';
import DisabledStep from './disabled-step';

export const CARD_TYPE = 'card';
export const BANCONTACT_TYPE = 'bancontact';

export const getEmailFromUserContext = mb(['data', 'idTokenPayload', 'email']);
export const getPasswordlessCodeFromUserContext = mb([
  'passwordless',
  'err',
  'code',
]);

const invalidUserPasswordErrorCode = 'invalid_user_password';

class CheckoutForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deliveryAddressInfo: {
        firstName: '',
        lastName: '',
        deliveryAddress: '',
      },
      isProcessing: false,
      paymentProcess: {
        order: null,
        source: null,
      },
    };

    this.deliveryAddressInfoChange = this.deliveryAddressInfoChange.bind(this);
    this.placeOrder = this.placeOrder.bind(this);
    this.emailChange = this.emailChange.bind(this);
  }

  getShippingInfo(state) {
    const {
      deliveryAddressInfo: { firstName, lastName, deliveryAddress },
    } = state;

    return {
      name: `${firstName} ${lastName}`,
      address: {
        line1: deliveryAddress,
        city: '',
        postal_code: '',
        country: '',
      },
      email: getEmailFromUserContext(this.props.userContext),
    };
  }

  async placeOrder(paymentType) {
    if (!this.props.stripe) {
      console.log("Stripe.js hasn't loaded yet.");
      return;
    }

    if (paymentType === CARD_TYPE) {
      const [err, payload] = await to(this.processCardSource());
      if (err) {
        console.log('Error::placeOrder::processCardSource', err);
        return;
      }

      this.setState(state => ({
        ...state,
        paymentProcess: { ...state.paymentProcess, source: payload.source },
      }));
    }

    this.setState({ isProcessing: true });

    await this.createOrder();

    console.log('this.state', this.state);

    await this.handleOrder(
      this.state.paymentProcess.order,
      this.state.paymentProcess.source
    );
  }

  async createOrder() {
    const { cartId, createOrder } = this.props.storeContext;
    const { email, ...shipping } = this.getShippingInfo(this.state);
    const [err, order] = await to(createOrder(cartId, email, shipping));
    if (err) {
      console.log('createOrder::error', err);
      return;
    }
    console.log('order', order);

    this.setState(state => ({
      ...state,
      paymentProcess: { ...state.paymentProcess, order },
    }));
  }

  async handleOrder(order, source) {
    switch (order.metadata.status) {
      case 'created':
        switch (source.status) {
          case 'chargeable':
            const response = await this.props.storeContext.payOrder(
              order,
              source
            );
            //await this.handleOrder(response.order, response.source);
            break;
          case 'failed':
          case 'canceled':
            // Authentication failed, offer to select another payment method.
            break;
          default:
            // Order is received, pending payment confirmation.
            break;
        }
        break;

      case 'pending':
        // Success! Now waiting for payment confirmation. Update the interface to display the confirmation screen.
        // Update the note about receipt and shipping (the payment is not yet confirmed by the bank).
        break;

      case 'failed':
        // Payment for the order has failed.
        break;

      case 'paid':
        break;
    }
  }

  async processCardSource() {
    const owner = this.getShippingInfo(this.state);

    const [err, payload] = await to(
      this.props.stripe.createSource({
        type: 'card',
        owner,
      })
    );
    if (err || payload.error) {
      console.log('processCardSource', err || payload.error);
      throw err || payload.error;
    }
    return payload;
  }

  deliveryAddressInfoChange(e) {
    this.setState({
      deliveryAddressInfo: {
        ...this.state.deliveryAddressInfo,
        [e.target.name]: e.target.value,
      },
    });
  }

  emailChange(email) {
    this.setState({
      email,
    });
  }

  isAccountStepDone() {
    return !!this.props.userContext.loggedIn;
  }

  isAddressStepDone() {
    const {
      firstName,
      deliveryAddress,
      lastName,
    } = this.state.deliveryAddressInfo;
    return !!firstName && !!deliveryAddress && !!lastName;
  }

  getItemsFromCart(cart = []) {
    return cart.map(({ id, quantity, sku: { price, product, attributes } }) => {
      return {
        id,
        quantity,
        price,
        size: attributes.size,
        pack: attributes.pack,
        label: product.name,
      };
    });
  }

  onCodeSubmit = (email, code) => {
    this.props.userContext.passwordlessVerify(email, code, '/checkout');
  };

  render() {
    const { isProcessing } = this.state;
    return !isProcessing ? this.renderForm() : this.renderPaymentProcessing();
  }

  renderForm() {
    const {
      storeContext: { cart },
      userContext,
    } = this.props;
    const passwordlessCodeError = getPasswordlessCodeFromUserContext(
      userContext
    );

    const subTotal = sumCartPrices(cart);
    const shippingFee = '490';
    return (
      <div className="flex flex-wrap justify-between mt-5 bg-grey-lighter">
        <div className="w-full mt-4 mb-6 lg:mb-0 lg:w-2/3 px-4 flex flex-col">
          <div className="flex flex-col">
            <If
              condition={!this.isAccountStepDone()}
              then={
                <AccountStep
                  onEmailSubmit={userContext.passwordlessStart}
                  onCodeSubmit={this.onCodeSubmit}
                >
                  <If
                    condition={
                      passwordlessCodeError === invalidUserPasswordErrorCode
                    }
                    then={
                      <span className="pt-1 px-3 text-sm font-semibold text-red-light ">
                        Veuillez entrer un valid code
                      </span>
                    }
                  />
                </AccountStep>
              }
              else={
                <AccountFilledStep
                  email={getEmailFromUserContext(userContext)}
                />
              }
            />

            <If
              condition={this.isAccountStepDone()}
              then={
                <AddressStep
                  title={'Address Delivery'}
                  value={this.state.deliveryAddressInfo}
                  onInputChange={this.deliveryAddressInfoChange}
                />
              }
              else={<DisabledStep title={'Address Delivery'} />}
            />
            <If
              condition={this.isAddressStepDone()}
              then={
                <PaymentStep
                  title={'Payment'}
                  totalAmount={getTotalPrice(subTotal, shippingFee)}
                  onSubmit={this.placeOrder}
                  disabled={this.state.isProcessing}
                />
              }
              else={<DisabledStep title={'Payment'} />}
            />
          </div>
        </div>
        <CheckoutSummary
          items={this.getItemsFromCart(cart)}
          subtotal={subTotal}
          shippingFee={shippingFee}
          itemsCount={cart.length}
        />
      </div>
    );
  }

  renderPaymentProcessing() {
    return (
      <div className="flex flex-wrap justify-between mt-5 bg-grey-lighter">
        <p>Payment Processing</p>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);

import React, { Component } from 'react';
import { injectStripe } from 'react-stripe-elements';
import AccountStep from '../checkout/account-step';
import PaymentStep from '../checkout/payment-step';
import { If } from '../components/if';
import {getTotalPrice, sumCartPrices, to} from '../utils';
import AccountFilledStep from './account-filled-step';
import AddressStep from './address-step';
import CheckoutSummary from './checkout-summary';
import DisabledStep from './disabled-step';

export const CARD_TYPE = 'card';
export const BANCONTACT_TYPE = 'bancontact';

class CheckoutForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      deliveryAddressInfo: {
        firstName: '',
        lastName: '',
        deliveryAddress: '',
      },
      isProcessing: false,
    };

    this.deliveryAddressInfoChange = this.deliveryAddressInfoChange.bind(this);
    this.placeOrder = this.placeOrder.bind(this);
    this.emailChange = this.emailChange.bind(this);
  }

  async placeOrder(paymentType) {
    if (!this.props.stripe) {
      console.log("Stripe.js hasn't loaded yet.");
      return;
    }
    this.setState({ isProcessing: true });
    if (paymentType === CARD_TYPE) {
      await this.processCard();
      return;
    }
  }

  async processCard() {
    const [err, payload] = await to(this.props.stripe.createToken());
    this.setState({ isProcessing: false });
    if (err) {
      console.log("Stripe.js hasn't loaded yet.");
      return;
    }
    console.log('payload', payload);
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
    return !!this.state.email;
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

  render() {
    const { cart } = this.props;
    const subTotal=sumCartPrices(cart);
    const shippingFee="490";
    return (
      <div className="flex flex-wrap justify-between mt-5 bg-grey-lighter">
        <div className="w-full mt-4 mb-6 lg:mb-0 lg:w-2/3 px-4 flex flex-col">
          <div className="flex flex-col">
            <If
              condition={!this.isAccountStepDone()}
              then={
                <AccountStep
                  defaultEmail={this.state.email}
                  onSubmit={this.emailChange}
                />
              }
              else={
                <AccountFilledStep
                  email={this.state.email}
                  onEdit={() => this.emailChange(null)}
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
                  totalAmount={getTotalPrice(subTotal,shippingFee)}
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
}

export default injectStripe(CheckoutForm);

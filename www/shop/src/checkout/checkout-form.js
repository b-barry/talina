import React, { Component } from 'react';
import { injectStripe } from 'react-stripe-elements';
import AccountStep from '../checkout/account-step';
import PaymentStep from '../checkout/payment-step';
import Stepper from '../checkout/stepper';

class CheckoutForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      paymentInfo: {
        name: '',
        address: '',
      },
    };

    this.handlePaymentInfoChange = this.handlePaymentInfoChange.bind(this);
  }

  handleSubmit = ev => {
    ev.preventDefault();
    if (this.props.stripe) {
      this.props.stripe
        .createToken()
        .then(payload => console.log('[token]', payload));
    } else {
      console.log("Stripe.js hasn't loaded yet.");
    }
  };

  handlePaymentInfoChange(e) {
    console.log('handlePaymentInfoChange', e);
    this.setState({
      paymentInfo: {
        ...this.state.paymentInfo,
        [e.target.name]: e.target.value,
      },
    });
  }

  render() {
    return (
      <>
        <Stepper />
        <AccountStep />
        <PaymentStep
          value={this.state.paymentInfo}
          amount={this.props.amount}
          onInputChange={this.handlePaymentInfoChange}
          onSubmit={this.handleSubmit}
        />
      </>
    );
  }
}

export default injectStripe(CheckoutForm);

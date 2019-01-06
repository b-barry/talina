import {navigate} from '@reach/router';
import React, {Component} from 'react';
import {injectStripe} from 'react-stripe-elements';
import AccountStep from '../checkout/account-step';
import PaymentStep from '../checkout/payment-step';
import {If} from '../components/if';
import {getPersistedOrderIdFromLocalStorage, persistOrderIdToLocalStorage,} from '../store-context';
import {getTotalPrice, mb, sumCartPrices, to} from '../utils';
import AccountFilledStep from './account-filled-step';
import AddressStep from './address-step';
import CheckoutSummary from './checkout-summary';
import DisabledStep from './disabled-step';

export const CARD_TYPE = 'card';
export const BANCONTACT_TYPE = 'bancontact';
const shippingFee = '490';

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

  async componentDidMount() {
    const orderId = getPersistedOrderIdFromLocalStorage();
    if (!(orderId && this.props.location.search.includes('source'))) {
      return;
    }

    this.setState({isProcessing: true});
    await this.pollOrderStatus(orderId);
  }

  getShippingInfo(state) {
    const {
      deliveryAddressInfo: {firstName, lastName, deliveryAddress},
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
      console.log('Stripe.js hasn\'t loaded yet.');
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
        paymentProcess: {...state.paymentProcess, source: payload.source},
      }));

      return;
    }

    await this.createOrder();

    const [err, payload] = await to(this.processBancontactSource());
    if (err) {
      console.log('Error::placeOrder::processBancontactSource', err);
      return;
    }

    await this.handleOrder(this.state.paymentProcess.order, payload.source);
  }

  async createOrder() {
    const {cartId, createOrder} = this.props.storeContext;
    const {email, ...shipping} = this.getShippingInfo(this.state);
    const [err, order] = await to(createOrder(cartId, email, shipping));
    if (err) {
      console.log('createOrder::error', err);
      return;
    }
    console.log('order', order);

    this.setState(state => ({
      ...state,
      paymentProcess: {...state.paymentProcess, order},
    }));
  }

  handleOrder = async (order, source) => {
    switch (order.metadata.status) {
      case 'created':
        switch (source.status) {
          case 'chargeable':
            const response = await this.props.storeContext.payOrder(
              order,
              source
            );
            await this.handleOrder(response.order, response.source);
            break;
          case 'pending':
            switch (source.flow) {
              case 'redirect':
                // Immediately redirect the customer.
                navigate(source.redirect.url);
                break;
              default:
                // Order is received, pending payment confirmation.
                break;
            }
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
        // Failed! Payment failded. Update the interface to display the error screen.
        console.log(
          'Order::paid',
          'Failed! Payment failded. Update the interface to display the error screen.'
        );

        break;

      case 'paid':
        // Success! Payment is confirmed. Update the interface to display the confirmation screen.
        console.log(
          'Order::paid',
          'Success! Payment is confirmed. Update the interface to display the confirmation screen.'
        );
        persistOrderIdToLocalStorage(null);
        break;
    }
  };

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

  async processBancontactSource() {
    const {
      deliveryAddressInfo: {firstName, lastName},
    } = this.state;

    const data = {
      type: 'bancontact',
      amount: parseInt(
        getTotalPrice(sumCartPrices(this.props.storeContext.cart), shippingFee),
        10
      ),
      currency: 'eur',
      owner: {
        name: `${firstName} ${lastName}`,
      },
      redirect: {
        return_url: this.props.location.href,
      },
      metadata: {
        order: this.state.paymentProcess.order.id,
      },
    };

    const [err, payload] = await to(this.props.stripe.createSource(data));
    if (err || payload.error) {
      console.log('processBancontactSource', err || payload.error);
      throw err || payload.error;
    }
    return payload;
  }

  pollOrderStatus = async (
    orderId,
    timeout = 30000,
    interval = 500,
    start = null
  ) => {
    start = start ? start : Date.now();
    const endStates = ['paid', 'failed'];
    // Retrieve the latest order status.
    const [getOrderByIdError, order] = await to(this.props.storeContext.getOrderById(orderId));
    if (getOrderByIdError) {
      // TODO: handle error redirection
      this.setState(state => ({
        ...state,
        paymentProcess: {...state.paymentProcess, err: getOrderByIdError},
      }));
      return;
    }
    this.setState(state => ({
      ...state,
      paymentProcess: {...state.paymentProcess, err: null, order},
    }));

    await this.handleOrder(order, {status: null});
    if (
      !endStates.includes(order.metadata.status) &&
      Date.now() < start + timeout
    ) {

      // Not done yet. Let's wait and check again.
      setTimeout(
        this.pollOrderStatus,
        interval,
        orderId,
        timeout,
        interval,
        start
      );
    } else {
      if (!endStates.includes(order.metadata.status)) {
        // Status has not changed yet. Let's time out.
        console.warn(new Error('Polling timed out.'));
      }
    }
  };

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
    return cart.map(({id, quantity, sku: {price, product, attributes}}) => {
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
    const {isProcessing} = this.state;
    return !isProcessing ? this.renderForm() : this.renderPaymentProcessing();
  }

  renderForm() {
    const {
      storeContext: {cart},
      userContext,
    } = this.props;
    const passwordlessCodeError = getPasswordlessCodeFromUserContext(
      userContext
    );

    const subTotal = sumCartPrices(cart);
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
              else={<DisabledStep title={'Address Delivery'}/>}
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
              else={<DisabledStep title={'Payment'}/>}
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

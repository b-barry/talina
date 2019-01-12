import { navigate } from '@reach/router';
import React, { Component } from 'react';
import { injectStripe } from 'react-stripe-elements';
import AccountStep from '../checkout/account-step';
import PaymentStep from '../checkout/payment-step';
import { If } from '../components/if';
import {
  getPersistedOrderIdFromLocalStorage,
  persistOrderIdToLocalStorage,
} from '../store-context';
import { getTotalPrice, mb, sumCartPrices, to } from '../utils';
import AccountFilledStep from './account-filled-step';
import AddressStep from './address-step';
import CheckoutSummary from './checkout-summary';
import DisabledStep from './disabled-step';

export const CARD_TYPE = 'card';
export const BANCONTACT_TYPE = 'bancontact';
const shippingFee = '490';

export const NO_PROCESSING_STATE = '';
export const START_PROCESSING_STATE = 'start_processing';
export const PENDING_PROCESSING_STATE = 'pending_processing';
export const SUCCESS_PROCESSING_STATE = 'success_processing';
export const FAILED_PROCESSING_STATE = 'failed_processing';

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
      processingState: NO_PROCESSING_STATE,
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

    this.setState({ processingState: PENDING_PROCESSING_STATE });
    await this.pollOrderStatus(orderId);
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
      return;
    }

    this.setState({ processingState: START_PROCESSING_STATE }, async () => {
      const [orderCreateError, order] = await to(this.createOrder());
      if (orderCreateError) {
        this.setState({ processingState: FAILED_PROCESSING_STATE });
        return;
      }

      let source = null;

      if (paymentType === CARD_TYPE) {
        const [err, payload] = await to(this.processCardSource());
        if (err) {
          this.setState({ processingState: FAILED_PROCESSING_STATE });
          return;
        }

        source = payload.source;
      }

      if (paymentType === BANCONTACT_TYPE) {
        const [err, payload] = await to(this.processBancontactSource(order));
        if (err) {
          this.setState({ processingState: FAILED_PROCESSING_STATE });
          return;
        }
        source = payload.source;
      }
      this.setState(state => ({
        ...state,
        paymentProcess: { ...state.paymentProcess, order, source },
      }));

      await this.handleOrder(order, source);
    });
  }

  async createOrder() {
    const { cartId, createOrder } = this.props.storeContext;
    const { email, ...shipping } = this.getShippingInfo(this.state);
    const [err, order] = await to(createOrder(cartId, email, shipping));
    if (err) {
      throw err;
    }
    return order;
  }

  handleOrder = async (order, source) => {
    switch (order.metadata.status) {
      case 'created':
        switch (source.status) {
          case 'chargeable':
            const [err, response] = await to(
              this.props.storeContext.payOrder(order, source)
            );

            if (err) {
              return this.setState({
                processingState: FAILED_PROCESSING_STATE,
              });
            }
            this.setState({ processingState: PENDING_PROCESSING_STATE });

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
        this.setState({ processingState: PENDING_PROCESSING_STATE });

        // Success! Now waiting for payment confirmation. Update the interface to display the confirmation screen.
        // Update the note about receipt and shipping (the payment is not yet confirmed by the bank).
        break;

      case 'failed':
        this.setState({ processingState: FAILED_PROCESSING_STATE });

        break;

      case 'paid':
        persistOrderIdToLocalStorage(null);
        this.setState({ processingState: SUCCESS_PROCESSING_STATE });

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
      throw err || payload.error;
    }
    return payload;
  }

  async processBancontactSource(order) {
    const {
      deliveryAddressInfo: { firstName, lastName },
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
        order: order.id,
      },
    };

    const [err, payload] = await to(this.props.stripe.createSource(data));
    if (err || payload.error) {
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
    const [getOrderByIdError, order] = await to(
      this.props.storeContext.getOrderById(orderId)
    );
    if (getOrderByIdError) {
      // TODO: handle error redirection
      this.setState(state => ({
        ...state,
        paymentProcess: { ...state.paymentProcess, err: getOrderByIdError },
      }));
      return;
    }
    this.setState(state => ({
      ...state,
      paymentProcess: { ...state.paymentProcess, err: null, order },
    }));

    await this.handleOrder(order, { status: null });
    if (
      !endStates.includes(order.metadata.status) &&
      Date.now() < start + timeout
    ) {
      // Not done yet. Let's wait and check again.
      return setTimeout(
        this.pollOrderStatus,
        interval,
        orderId,
        timeout,
        interval,
        start
      );
    }
    if (!endStates.includes(order.metadata.status)) {
      // Status has not changed yet. Let's time out.
      this.setState({ processingState: FAILED_PROCESSING_STATE });
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
    const { processingState } = this.state;
    const hiddenClass = 'hidden';
    return (
      <>
        <div className={processingState ? hiddenClass : ''}>
          {this.renderForm()}
        </div>
        <div className={processingState ? '' : hiddenClass}>
          {this.renderPaymentProcessing()}
        </div>
      </>
    );
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
    const { processingState } = this.state;
    return (
      <div className="mt-4 bg-grey-lighter py-16">
        <If
          condition={processingState === START_PROCESSING_STATE}
          then={
            <div className="flex flex-row flex-wrap max-w-2xl bg-white mx-auto rounded-sm border-grey-lighter shadow-md">
              <div className="flex mx-8 my-8 px-8 py-8">
                <svg
                  width="100px"
                  height="100px"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="xMidYMid"
                  className="lds-eclipse"
                  style={{ background: 'none' }}
                >
                  <path
                    stroke="none"
                    d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50"
                    fill="#28292f"
                    transform="rotate(125.793 50 51)"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      calcMode="linear"
                      values="0 50 51;360 50 51"
                      keyTimes="0;1"
                      dur="1s"
                      begin="0s"
                      repeatCount="indefinite"
                    />
                  </path>
                </svg>
              </div>
              <div className="flex flex-col justify-center  mt-4 w-3/4">
                <h1 className="mb-8">Payment proccessing</h1>
                <p className="mb-4 text-grey-dark">
                  You may be redirecting you
                </p>
              </div>
            </div>
          }
        />
        <If
          condition={processingState === PENDING_PROCESSING_STATE}
          then={
            <div className="flex flex-row flex-wrap max-w-2xl bg-white mx-auto rounded-sm border-grey-lighter shadow-md">
              <div className="flex mx-8 my-8 px-8 py-8">
                <svg
                  width="100px"
                  height="100px"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="xMidYMid"
                  className="lds-eclipse"
                  style={{ background: 'none' }}
                >
                  <path
                    stroke="none"
                    d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50"
                    fill="#28292f"
                    transform="rotate(125.793 50 51)"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      calcMode="linear"
                      values="0 50 51;360 50 51"
                      keyTimes="0;1"
                      dur="1s"
                      begin="0s"
                      repeatCount="indefinite"
                    />
                  </path>
                </svg>
              </div>
              <div className="flex flex-col justify-center  mt-4 w-3/4">
                <h1 className="mb-8">Pending proccessing</h1>
                <p className="mb-4 text-grey-dark">
                  You may be redirecting you
                </p>
              </div>
            </div>
          }
        />
        <If
          condition={processingState === SUCCESS_PROCESSING_STATE}
          then={
            <div className="flex flex-row flex-wrap max-w-2xl bg-white mx-auto rounded-sm border-grey-lighter shadow-md">
              <div className="flex mx-8 my-8 px-8 py-8">
                <svg
                  width="100px"
                  height="100px"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="xMidYMid"
                  className="lds-eclipse"
                  style={{ background: 'none' }}
                >
                  <path
                    stroke="none"
                    d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50"
                    fill="#28292f"
                    transform="rotate(125.793 50 51)"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      calcMode="linear"
                      values="0 50 51;360 50 51"
                      keyTimes="0;1"
                      dur="1s"
                      begin="0s"
                      repeatCount="indefinite"
                    />
                  </path>
                </svg>
              </div>
              <div className="flex flex-col justify-center  mt-4 w-3/4">
                <h1 className="mb-8">Thanks for your order!</h1>
                <p className="mb-4 text-grey-dark">
                  Woot! You successfully made a payment with Stripe.
                </p>
                <p className="mb-4 text-grey-dark">
                  We just sent your receipt to your email address, and your
                  items will be on their way shortly.
                </p>
              </div>
            </div>
          }
        />
        <If
          condition={processingState === FAILED_PROCESSING_STATE}
          then={
            <div className="flex flex-row flex-wrap max-w-2xl bg-white mx-auto rounded-sm border-grey-lighter shadow-md">
              <div className="flex mx-8 my-8 px-8 py-8">
                <svg
                  width="100px"
                  height="100px"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="xMidYMid"
                  className="lds-eclipse"
                  style={{ background: 'none' }}
                >
                  <path
                    stroke="none"
                    d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50"
                    fill="#28292f"
                    transform="rotate(125.793 50 51)"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      calcMode="linear"
                      values="0 50 51;360 50 51"
                      keyTimes="0;1"
                      dur="1s"
                      begin="0s"
                      repeatCount="indefinite"
                    />
                  </path>
                </svg>
              </div>
              <div className="flex flex-col justify-center  mt-4 w-3/4">
                <h1 className="mb-8">Oops, payment failed.</h1>
                <p className="mb-4 text-grey-dark">
                  It looks like your order could not be paid at this time.
                  Please try again or select a different payment option.{' '}
                </p>
                <p className="mb-4 text-grey-dark">
                  <button>Ressayez</button>
                </p>
              </div>
            </div>
          }
        />
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);

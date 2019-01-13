import { navigate } from '@reach/router';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { injectStripe } from 'react-stripe-elements';
import AccountStep from '../checkout/account-step';
import PaymentStep from '../checkout/payment-step';
import { Hidden } from '../components/hidden';
import { If } from '../components/if';
import {
  getPersistedOrderIdFromLocalStorage,
  persistOrderIdToLocalStorage,
} from '../store-context';
import {
  getEmailFromUserContext,
  getPasswordlessCodeFromUserContext,
  invalidUserPasswordErrorCode,
} from '../user-context';
import { getTotalPrice, sumCartPrices, to } from '../utils';
import AccountFilledStep from './account-filled-step';
import AddressStep from './address-step';
import CheckoutSummary from './checkout-summary';
import {
  BANCONTACT_TYPE,
  CARD_TYPE,
  FAILED_PROCESSING_STATE,
  NO_PROCESSING_STATE, PENDING_PROCESSING_STATE,
  SHIPPING_FEE,
  START_PROCESSING_STATE, SUCCESS_PROCESSING_STATE
} from './constant';
import DisabledStep from './disabled-step';
import {
  PaymentProcessingState,
  } from './payment-processing-state';

const getItemsFromCart = (cart = []) => {
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
};

class CheckoutContainer extends Component {
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

  placeOrder = async paymentType => {
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
  };

  createOrder = async () => {
    const { cartId, createOrder } = this.props.storeContext;
    const { email, ...shipping } = this.getShippingInfo(this.state);
    const [err, order] = await to(createOrder(cartId, email, shipping));
    if (err) {
      throw err;
    }
    return order;
  };

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
            if (source.flow === 'redirect') {
              navigate(source.redirect.url);
            }

            break;
          case 'failed':
          case 'canceled':
            this.setState({ processingState: FAILED_PROCESSING_STATE });

            break;
          default:
            // Order is received, pending payment confirmation.
            break;
        }
        break;

      case 'pending':
        this.setState({ processingState: PENDING_PROCESSING_STATE });
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

  processCardSource = async () => {
    const owner = this.getShippingInfo(this.state);

    const [err, payload] = await to(
      this.props.stripe.createSource({
        type: CARD_TYPE,
        owner,
      })
    );
    if (err || payload.error) {
      throw err || payload.error;
    }
    return payload;
  };

  processBancontactSource = async order => {
    const {
      deliveryAddressInfo: { firstName, lastName },
    } = this.state;

    const data = {
      type: BANCONTACT_TYPE,
      amount: parseInt(
        getTotalPrice(
          sumCartPrices(this.props.storeContext.cart),
          SHIPPING_FEE
        ),
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
  };

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
      this.setState(state => ({
        ...state,
        processingState: FAILED_PROCESSING_STATE,
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

  deliveryAddressInfoChange = e => {
    this.setState({
      deliveryAddressInfo: {
        ...this.state.deliveryAddressInfo,
        [e.target.name]: e.target.value,
      },
    });
  };

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

  onCodeSubmit = (email, code) => {
    this.props.userContext.passwordlessVerify(email, code, '/checkout');
  };

  render() {
    const { processingState } = this.state;
    return (
      <>
        <Hidden condition={processingState}>{this.renderForm()}</Hidden>
        <Hidden condition={!processingState}>
          <PaymentProcessingState state={processingState} />
        </Hidden>
      </>
    );
  }

  renderForm() {
    const {
      storeContext: { cart },
      userContext,
      intl,
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
                        <FormattedMessage
                          id="error.invalid-user-password-code"
                          defaultMessage="##error.invalid-user-password-code"
                        />
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
                  title={intl.formatMessage({
                    id: 'checkout.address-info-title',
                  })}
                  value={this.state.deliveryAddressInfo}
                  onInputChange={this.deliveryAddressInfoChange}
                />
              }
              else={
                <DisabledStep
                  title={intl.formatMessage({
                    id: 'checkout.address-info-title',
                  })}
                />
              }
            />
            <If
              condition={this.isAddressStepDone()}
              then={
                <PaymentStep
                  title={intl.formatMessage({
                    id: 'checkout.payment-info-title',
                  })}
                  totalAmount={getTotalPrice(subTotal, SHIPPING_FEE)}
                  onSubmit={this.placeOrder}
                />
              }
              else={
                <DisabledStep
                  title={intl.formatMessage({
                    id: 'checkout.payment-info-title',
                  })}
                />
              }
            />
          </div>
        </div>
        <CheckoutSummary
          items={getItemsFromCart(cart)}
          subtotal={subTotal}
          shippingFee={SHIPPING_FEE}
          itemsCount={cart.length}
        />
      </div>
    );
  }
}

export default injectIntl(injectStripe(CheckoutContainer));

import * as PropTypes from 'prop-types';
import React, { Component } from 'react';
import { CardElement } from 'react-stripe-elements';
import { priceFormat } from '../utils';
import { BANCONTACT_TYPE, CARD_TYPE } from './checkout-form';

const active = 'border-b-2 border-black -mb-4';
const inactive = 'text-grey-dark hover:text-black';

class PaymentStep extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: BANCONTACT_TYPE,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  isActive(tab) {
    return this.state.activeTab === tab;
  }

  setActive(activeTab) {
    this.setState({ activeTab });
  }

  handleSubmit(ev) {
    ev.preventDefault();
    this.props.onSubmit(this.state.activeTab);
  }

  render() {
    let { totalAmount, title } = this.props;
    return (
      <div className="flex-grow flex flex-col bg-white border border-grey-lighter overflow-hidden mb-4">
        <div className="px-4 mb-2">
          <p className="text-black pt-4 font-bold text-xl">{title}</p>
        </div>
        <form className="font-sans text-sm  w-full max-w-md px-4 pt-3 pb-4">
          <section className="w-2/3 bg-white  font-sans">
            <div className="container m-auto max-w-xl flex items-baseline justify-start border-b-2 border-grey-light mb-5">
              <h2
                onClick={e => this.setActive(BANCONTACT_TYPE)}
                className={`text-sm font-bold tracking-wide uppercase py-2 mr-3 cursor-pointer ${
                  this.isActive(BANCONTACT_TYPE) ? active : inactive
                }`}
              >
                Bancontact
              </h2>
              <h2
                onClick={e => this.setActive(CARD_TYPE)}
                className={`text-sm font-bold tracking-wide uppercase py-2 mr-3 cursor-pointer ${
                  this.isActive(CARD_TYPE) ? active : inactive
                }`}
              >
                Credit Card
              </h2>
            </div>
          </section>
          {this.isActive(BANCONTACT_TYPE) ? (
            <section className={`w-2/3 bg-white py-1 font-sans`}>
              <div className="flex justify-between items-center">
                <div className="w-full flex flex-col ">
                  <span className="my-2 text-grey text-sm">
                    You’ll be redirected to the banking site to complete your
                    payment.
                  </span>
                  <button
                    onClick={this.handleSubmit}
                    className="w-full mx-auto px-4 py-2 uppercase font-bold text-xs text-white bg-black lg:text-black lg:bg-white border-2 border-black border-solid hover:text-black hover:bg-white"
                  >
                    Payer {priceFormat(totalAmount)} avec Bancontact
                  </button>
                </div>
              </div>
            </section>
          ) : (
            <section className={`w-2/3 bg-white py-4 font-sans `}>
              <div className="relative border  mb-4  appearance-none label-floating">
                <CardElement
                  className="w-full py-2 px-3 text-grey-darker leading-normal "
                  hidePostalCode={true}
                />
              </div>
              <div className="flex justify-between items-center mb-8">
                <div className="w-full items-center">
                  <button
                    onClick={this.handleSubmit}
                    className="w-full mx-auto px-4 py-2 uppercase font-bold text-xs text-white bg-black lg:text-black lg:bg-white border-2 border-black border-solid hover:text-black hover:bg-white"
                  >
                    Payer {priceFormat(totalAmount)}
                  </button>
                </div>
              </div>
            </section>
          )}
        </form>
      </div>
    );
  }
}

PaymentStep.propTypes = { totalAmount: PropTypes.string };

PaymentStep.defaultProps = { amount: '0' };

export default PaymentStep;

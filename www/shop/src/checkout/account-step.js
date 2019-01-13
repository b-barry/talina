import * as PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { If } from '../components/if';

const isValidEmail = email => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

class AccountStep extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      code: '',
      isEmailTouched: false,
      isEmailSubmitted: false,
    };
  }

  emailChange = ev => {
    ev.preventDefault();
    const email = ev.target.value;

    this.setState({
      email,
      isEmailSubmitted: false,
      isEmailTouched: true,
    });
  };

  codeChange = ev => {
    ev.preventDefault();
    const code = ev.target.value;

    this.setState({
      code,
    });
  };

  emailSubmit = ev => {
    ev.preventDefault();
    const { email } = this.state;
    this.setState({ isEmailSubmitted: true, isEmailTouched: true });

    if (email && isValidEmail(email)) {
      this.props.onEmailSubmit(this.state.email);
    }
  };

  codeSubmit = ev => {
    ev.preventDefault();

    this.props.onCodeSubmit(this.state.email, this.state.code);
  };

  render() {
    let { email, code, isEmailSubmitted, isEmailTouched } = this.state;
    let { children, intl } = this.props;
    return (
      <div className="mb-4 flex-grow flex flex-col  bg-white border border-grey-lighter overflow-hidden">
        <div className="px-4 mb-2">
          <p className="text-black pt-4 font-bold text-xl">
            <FormattedMessage
              id="checkout.account-title"
              defaultMessage="##checkout.account-title"
            />
          </p>
        </div>
        <form className="font-sans text-sm rounded w-full max-w-md  mb-4 px-4 pt-3 pb-4 flex content-between flex-wrap">
          <If
            condition={!(isValidEmail(email) && isEmailSubmitted)}
            then={
              <>
                <div className="w-3/5 relative border  appearance-none label-floating mr-2">
                  <input
                    className="w-full py-2 px-3 text-grey-darker leading-normal rounded"
                    id="email"
                    type="email"
                    value={email}
                    onChange={this.emailChange}
                    placeholder={intl.formatMessage({
                      id: 'checkout.email-field-label',
                    })}
                  />
                  <label
                    className="absolute block text-grey-darker pin-t pin-l w-full px-3 py-2 leading-normal"
                    htmlFor="email"
                  >
                    <FormattedMessage
                      id="checkout.email-field-label"
                      defaultMessage="##checkout.email-field-label"
                    />
                  </label>
                </div>
                <div className="w-2/4 max-w-sm   sm:flex">
                  <button
                    onClick={this.emailSubmit}
                    className="uppercase text-sm text-white focus:outline-0 w-full sm:w-auto bg-black hover:bg-grey-darkest focus:bg-grey-light tracking-wide px-6"
                  >
                    <FormattedMessage
                      id="checkout.email-field-button"
                      defaultMessage="##checkout.email-field-button"
                    />
                  </button>
                </div>
              </>
            }
            else={
              <>
                <span className="mb-2 text-grey text-sm">
                  <FormattedMessage
                    id="checkout.email-sent-info"
                    defaultMessage="##checkout.email-sent-info"
                  />{' '}
                  <span className="font-bold">{email}</span>.
                </span>
                <div className="w-3/5 relative border  appearance-none label-floating mr-2">
                  <input
                    className="w-full py-2 px-3 text-grey-darker leading-normal rounded"
                    id="code"
                    value={code}
                    type="code"
                    onChange={this.codeChange}
                    placeholder={intl.formatMessage({
                      id: 'checkout.code-field-label',
                    })}
                  />
                  <label
                    className="absolute block text-grey-darker pin-t pin-l w-full px-3 py-2 leading-normal"
                    htmlFor="code"
                  >
                    <FormattedMessage
                      id="checkout.code-field-label"
                      defaultMessage="##checkout.code-field-label"
                    />
                  </label>
                </div>
                <div className="w-2/4 max-w-sm   sm:flex">
                  <button
                    onClick={this.codeSubmit}
                    className="uppercase text-sm text-white focus:outline-0 w-full sm:w-auto bg-black hover:bg-grey-darkest focus:bg-grey-light tracking-wide px-6"
                  >
                    <FormattedMessage
                      id="app.submit"
                      defaultMessage="##app.submit"
                    />
                  </button>
                </div>
              </>
            }
          />
          <If
            condition={
              !isValidEmail(email) && !isEmailSubmitted && isEmailTouched
            }
            then={
              <span className="pt-1 px-3 text-sm font-semibold text-red-light ">
                <FormattedMessage
                  id="error.email"
                  defaultMessage="##error.email"
                />
              </span>
            }
          />
          {children}
        </form>
      </div>
    );
  }
}

AccountStep.propTypes = {
  value: PropTypes.string,
  onSubmit: PropTypes.func,
  intl: PropTypes.object,
};

export default injectIntl(AccountStep);

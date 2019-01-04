import * as PropTypes from 'prop-types';
import React, { Component } from 'react';
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
    let { children } = this.props;
    return (
      <div className="mb-4 flex-grow flex flex-col  bg-white border border-grey-lighter overflow-hidden">
        <div className="px-4 mb-2">
          <p className="text-black pt-4 font-bold text-xl">Account</p>
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
                    placeholder="Email"
                  />
                  <label
                    className="absolute block text-grey-darker pin-t pin-l w-full px-3 py-2 leading-normal"
                    htmlFor="email"
                  >
                    Email
                  </label>
                </div>
                <div className="w-2/4 max-w-sm   sm:flex">
                  <button
                    onClick={this.emailSubmit}
                    className="uppercase text-sm text-white focus:outline-0 w-full sm:w-auto bg-black hover:bg-grey-darkest focus:bg-grey-light tracking-wide px-6"
                  >
                    Add your email
                  </button>
                </div>
              </>
            }
            else={
              <>
                <span className="mb-2 text-grey text-sm">
                  An email with the code has been sent to{' '}
                  <span className="font-bold">{email}</span>.
                </span>
                <div className="w-3/5 relative border  appearance-none label-floating mr-2">
                  <input
                    className="w-full py-2 px-3 text-grey-darker leading-normal rounded"
                    id="code"
                    value={code}
                    type="code"
                    onChange={this.codeChange}
                    placeholder="Code"
                  />
                  <label
                    className="absolute block text-grey-darker pin-t pin-l w-full px-3 py-2 leading-normal"
                    htmlFor="code"
                  >
                    Code
                  </label>
                </div>
                <div className="w-2/4 max-w-sm   sm:flex">
                  <button
                    onClick={this.codeSubmit}
                    className="uppercase text-sm text-white focus:outline-0 w-full sm:w-auto bg-black hover:bg-grey-darkest focus:bg-grey-light tracking-wide px-6"
                  >
                    Submit
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
                Veuillez entrer un valid email
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
};

export default AccountStep;

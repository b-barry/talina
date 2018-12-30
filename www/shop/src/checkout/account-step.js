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
      email: props.defaultEmail,
      isEmailValid: false,
      showError: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(ev) {
    ev.preventDefault();
    const email = ev.target.value;

    this.setState({
      isEmailValid: isValidEmail(email),
      email,
      showError: false,
    });
  }

  handleSubmit(ev) {
    ev.preventDefault();
    const { email, isEmailValid } = this.state;
    this.setState({ showError: !isEmailValid });

    if (email && isEmailValid) {
      this.props.onSubmit(this.state.email);
    }
  }

  render() {
    let { value } = this.props;
    let { showError } = this.state;
    return (
      <div className="mb-4 flex-grow flex flex-col  bg-white border border-grey-lighter overflow-hidden">
        <div className="px-4 mb-2">
          <p className="text-black pt-4 font-bold text-xl">Email address</p>
        </div>
        <form className="font-sans text-sm rounded w-full max-w-md  mb-4 px-4 pt-3 pb-4 flex content-between flex-wrap">
          <div className="w-3/5 relative border  appearance-none label-floating mr-2">
            <input
              className="w-full py-2 px-3 text-grey-darker leading-normal rounded"
              id="email"
              type="email"
              value={value}
              onChange={this.handleChange}
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
              onClick={this.handleSubmit}
              className="uppercase text-sm text-white focus:outline-0 w-full sm:w-auto bg-black hover:bg-grey-darkest focus:bg-grey-light tracking-wide px-6"
            >
              Add your email
            </button>
          </div>
          <If
            condition={showError}
            then={
              <span className="pt-1 px-3 text-sm font-semibold text-red-light ">
                Veuillez entrer un valid email
              </span>
            }
          />
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

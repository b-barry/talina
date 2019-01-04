import {WebAuth} from 'auth0-js';
import React from 'react';
import {nope} from './utils';

const talinaRedirectUrlAfterAuth = 'talina-redirect-url-after-auth';
export const setRedirectedUrl = (url) => localStorage.setItem(talinaRedirectUrlAfterAuth, url);
const getRedirectedUrl = () => localStorage.getItem(talinaRedirectUrlAfterAuth);

export const defaultUserContext = {
  loggedIn: false,
  data: null,
  err: null,
  passwordlessStart: nope,
  passwordlessVerify: nope,
  logout: nope,
  onLogin: nope,
  passwordless: {
    initiated: false,
    err: null,
  },
};

const defaultAuthOptions = {
  responseType: 'token id_token',
  scope: 'openid email profile',
};

export const UserContext = React.createContext(defaultUserContext);

class Provider extends React.Component {
  constructor(props) {
    super(props);

    this.webAuth = new WebAuth({
      clientID: process.env.auth0_clientId,
      domain: process.env.auth0_domain,
      redirectUri: process.env.auth0_redirectUri,
      ...defaultAuthOptions,
    });

    this.state = {
      ...defaultUserContext,
      passwordlessStart: this.passwordlessStart,
      passwordlessVerify: this.passwordlessVerify,
      logout: this.logout,
      onLogin: this.onLogin,
    };
  }

  async componentDidMount() {
    this.renewToken();
  }

  passwordlessStart = email => {
    this.setState(state => ({
      ...state,
      passwordless: {
        ...state.passwordless,
        initiated: true,
      },
    }));
    this.webAuth.passwordlessStart(
      {
        connection: 'email',
        send: 'code',
        email: email,
      },
      (err, res) => {
        this.setState(state => ({
          ...state,
          passwordless: {
            ...state.passwordless,
            err,
          },
        }));
      }
    );
  };
  passwordlessVerify = (email, code, redirectUrl = '/') => {
    setRedirectedUrl(redirectUrl);
    this.webAuth.passwordlessVerify(
      {
        connection: 'email',
        email,
        verificationCode: code,
      },
      (err, res) => {
        console.log('err',err);
        this.setState(state => ({
          ...state,
          passwordless: {
            ...state.passwordless,
            err,
          },
        }));
      }
    );
  };

  onLogin = (cb) => {
    this.webAuth.parseHash((err, res) => {
      if (err) {
        this.setState({
          loggedIn: false,
          data: null,
          err,
        });
        return;
      }
      this.setState(state => ({
        ...state,
        loggedIn: true,
        data: {...state.data, ...res},
        err: null,
      }));
      cb(err, getRedirectedUrl());
    });
  };

  logout = () => {
    this.webAuth.logout({
      clientID: 'sJlfpWnqSjf3wrhSZrRBVi9M8EVZBSNx',
      returnTo: `http://localhost:8000/logout-callback`,
    });
  };

  renewToken() {
    this.webAuth.checkSession({}, (err, res) => {
      this.setState({
        loggedIn: !!res,
        data: res || null,
        err: err || null,
      });
    });
    // Re-new again in 15 mins
    setTimeout(() => this.renewToken(), 15 * 60 * 1000);
  }

  render() {
    return (
      <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export const UserProvider = Provider;

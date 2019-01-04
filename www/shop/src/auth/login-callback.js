import { navigate } from '@reach/router';
import React, { Component } from 'react';
import { setRedirectedUrl, UserContext } from '../user-context';

class LoginCallbackInner extends Component {
  componentDidMount() {
    this.props.context.onLogin((err, redirectUrl) => {
      setRedirectedUrl(null);

      navigate(redirectUrl);
    });
  }

  render() {
    return null;
  }
}

export default class LoginCallback extends Component {
  render() {
    return (
      <UserContext.Consumer>
        {context => <LoginCallbackInner context={context} />}
      </UserContext.Consumer>
    );
  }
}

import {Redirect} from '@reach/router';
import React, {Component} from 'react';

export default class LogoutCallback extends Component {
  render() {
    return <Redirect to="/" noThrow/>;
  }
}

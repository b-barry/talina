import * as PropTypes from 'prop-types';
import React, { Component } from 'react';

import places from 'places.js';

class Places extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    let options = {
      container: this.inputRef.current,
      language: this.props.language,
      useDeviceLocation: this.props.useDeviceLocation,
    };

    const optionnalPropsKeys = [
      'type',
      'countries',
      'aroundLatLng',
      'aroundRadius',
      'templates',
      'appId',
      'apiKey',
      'apiKey',
    ];

    for (let optionnalPropKey of optionnalPropsKeys) {
      if (this.props[optionnalPropKey]) {
        options[optionnalPropKey] = this.props[optionnalPropKey];
      }
    }

    const autocomplete = places(options);
    autocomplete.on('change', e => this.props.onChange(e));
  }

  render() {
    return <input disabled={this.props.disabled} ref={this.inputRef} />;
  }
}

Places.propTypes = {
  apiKey: PropTypes.string,
  appId: PropTypes.string,
  aroundLatLng: PropTypes.string,
  aroundRadius: PropTypes.number,
  countries: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool,
  language: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  templates: PropTypes.object,
  type: PropTypes.oneOf([
    'city',
    'country',
    'address',
  ]),
  useDeviceLocation: PropTypes.bool,
};

Places.defaultProps = {
  disabled: false,
  language: navigator.language,
  useDeviceLocation: false,
  onChange: e => console.log(e),
};

export default Places;

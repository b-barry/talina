import * as PropTypes from 'prop-types';
import React from 'react';

export function Hidden(props) {
  const condition = props.condition || false;
  const hiddenClass = 'hidden';
  return <div className={condition ? hiddenClass : ''}>{props.children}</div>;
}

Hidden.propTypes = {
  condition: PropTypes.any,
  children: PropTypes.node,
};

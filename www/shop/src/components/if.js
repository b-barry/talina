import * as PropTypes from 'prop-types';

export function If(props) {
  const condition = props.condition || false;
  const positive = props.then || null;
  const negative = props.else || null;

  return condition ? positive : negative;
}

If.propTypes = {
  condition: PropTypes.any,
  then: PropTypes.any,
  else: PropTypes.any
}

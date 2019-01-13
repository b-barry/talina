import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {FormattedMessage} from 'react-intl';
import { priceFormat } from '../utils';

class ProductItem extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    this.props.addToCart();
  }

  render() {
    let {
      price,
      attributes: { size, pack },
    } = this.props;
    return (
      <div className="w-full sm:w-1/2 md:w-1/3 flex flex-col items-center justify-center h-48 md:h-64 border-grey-lightest border-r border-b hover:shadow-md hover:border-0 bg-white hover:transform-scale-subtle transition-normal hover:show-child">
        <h1
          htmlFor=""
          className="uppercase tracking-loose font-bold text-5xl my-2"
        >
          {priceFormat(price)}
        </h1>
        <p className="my-2 text-grey-darker">
          <strong className="text-black pr-2">{pack}</strong>{' '}
          <FormattedMessage
            id="app.bottles"
            defaultMessage="##app.bottles"
          />
        </p>
        <p className="my-2 text-grey-darker">
          <strong className="text-black pr-2">{size}</strong>cl
        </p>
        <div className="mt-4 text-center text-grey-dark leading-normal px-6 lg:hidden hover:block">
          <button
            onClick={this.handleSubmit}
            className="bg-transparent hover:bg-black text-black-dark font-semibold hover:text-white py-2 px-4 border border-black hover:border-transparent"
          >
            <FormattedMessage
              id="cart.add-to-cart"
              defaultMessage="##cart.add-to-cart"
            />
          </button>
        </div>
      </div>
    );
  }
}

ProductItem.propTypes = {
  addToCart: PropTypes.func,
  id: PropTypes.string,
  price: PropTypes.number,
  attributes: PropTypes.shape({
    size: PropTypes.string,
    pack: PropTypes.string,
  }),
  object: PropTypes.string,
  inventory: PropTypes.shape({
    quantity: PropTypes.number,
    type: PropTypes.string,
  }),
  currency: PropTypes.string,
};

export default ProductItem;

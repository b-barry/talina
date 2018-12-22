import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {priceFormat} from '../utils';

class ProductItem extends Component {
  constructor(props) {
    super(props);
    this.state = {quantity: 1};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({quantity: event.target.value});
  }

  handleSubmit() {
    this.props.addToCart(this.state.quantity);
  }

  render() {
    let {price, attributes: {size, pack}} = this.props;
    return (
      <div
        className="w-full sm:w-1/2 md:w-1/3 flex flex-col items-center justify-center h-48 md:h-64 border-grey-lightest border-r border-b hover:shadow-md hover:border-0 bg-white hover:transform-scale-subtle transition-normal hover:show-child">
        <h1
          htmlFor=""
          className="uppercase tracking-loose font-bold text-5xl my-2"
        >
          {priceFormat(price)}
        </h1>
        <p className="my-2 text-grey-darker">
          <strong className="text-black pr-2">{pack}</strong>bouteilles
        </p>
        <p className="my-2 text-grey-darker">
          <strong className="text-black pr-2">{size}</strong>cl
        </p>
        <div className="mt-4 text-center text-grey-dark leading-normal px-6 lg:hidden hover:block">
          <input className="text-center focus:outline-0 border border-black bg-white py-2 px-2 mb-2 mr-1 sm:mb-0"
                 type="number" min="1" max="15"
                 value={this.state.quantity} onChange={this.handleChange}/>
          <button
            onClick={this.handleSubmit}
            className="bg-transparent hover:bg-black text-black-dark font-semibold hover:text-white py-2 px-4 border border-black hover:border-transparent">
            Add to cart
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

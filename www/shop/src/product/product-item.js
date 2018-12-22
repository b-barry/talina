import PropTypes from 'prop-types';
import React from 'react';
import {priceFormat} from '../utils';

const ProductItem = ({currency, price, attributes: {size, pack}}) => {
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
      <p className="mt-4 text-center text-grey-dark leading-normal px-6 hidden hover:block">
        <button
          className="bg-transparent hover:bg-black text-black-dark font-semibold hover:text-white py-2 px-4 border border-black hover:border-transparent">
          Add to cart
        </button>
      </p>
    </div>
  );
};

ProductItem.propTypes = {
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

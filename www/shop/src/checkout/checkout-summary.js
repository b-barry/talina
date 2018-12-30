import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import { getTotalPrice, priceFormat } from '../utils';

function CheckoutSummary({
  subtotal,
  shippingFee,
  isShippingFree = false,
  items = [],
}) {
  return (
    <div
      className="w-full mt-4 mb-6 lg:mb-0 lg:w-1/3 px-4 flex flex-col"
      style={{ height: 'fit-content' }}
    >
      <div className="flex-grow flex flex-col bg-white border border-grey-lighter overflow-hidden mb-4">
        <div className="px-6 mb-2 flex flex-row justify-between ">
          <p className="text-black py-4 font-bold text-2xl">{items.length} items</p>
          <Link
            to="/cart"
            className="inline-block py-5 text-grey-darkest hover:text-grey-dark "
          >
            Edit
          </Link>
        </div>
        {items.map(item => {
          return (
            <div key={item.id} className="flex flex-col mb-4 pl-6">
              <div className="w-full flex flex-col items-start mb-4">
                <div className="w-full pr-6 flex flex-row justify-between">
                  <span className="inline-block font-bold font-normal text-normal">
                    {priceFormat(item.price)}
                  </span>
                  <span className="inline-block font-semi-bold text-grey-darker font-normal">
                    x {item.quantity}
                  </span>
                </div>
                <span className="py-1 inline-block font-semi-bold text-grey-light font-normal">
                  {item.label}
                </span>
                <span className="inline-block font-semi-bold text-grey-darker font-normal">
                  {item.pack} x {item.size} cl
                </span>
              </div>
            </div>
          );
        })}
        <div className="flex justify-between items-center mb-4">
          <div className="w-3/4 pl-6 flex items-center">
            <div className="w-full flex border-b border-t border-grey-lighter-lighter py-4">
              <span className="text-sm">Livraison </span>
            </div>
          </div>
          <div className="w-1/4 pr-6 flex items-center text-right">
            <div className="w-full flex border-b border-t border-grey-lighter-lighter py-4">
              <span className="text-sm">
                {isShippingFree ? 'gratuit' : priceFormat(shippingFee)}{' '}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mb-8">
          <div className="w-3/4 pl-6 flex items-center">
            <div className="w-full flex">
              <span className="text-sm font-bold">Total (TVA incluse)</span>
            </div>
          </div>
          <div className="w-1/4 pr-6 flex items-center text-right">
            <div className="w-full flex">
              <span className="text-sm font-bold">
                {priceFormat(
                  getTotalPrice(subtotal, shippingFee, isShippingFree)
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

CheckoutSummary.propTypes = {
  subtotal: PropTypes.number,
  shippingFee: PropTypes.string,
  isShippingFree: PropTypes.string,
};

export default CheckoutSummary;

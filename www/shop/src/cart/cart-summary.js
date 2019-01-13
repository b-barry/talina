import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { If } from '../components/if';
import { getTotalPrice, priceFormat } from '../utils';

function CartSummary({
  subtotal,
  shippingFee,
  isShippingFree = false,
  itemsCount = 0,
}) {
  return (
    <div
      className="w-full mt-4 mb-6 lg:mb-0 lg:w-1/3 px-4 flex flex-col"
      style={{ height: 'fit-content' }}
    >
      <div className="flex-grow flex flex-col bg-white border border-grey-lighter overflow-hidden">
        <div className="px-6 mb-2">
          <p className="text-black py-4 font-bold text-2xl">
            <FormattedMessage id="cart.total" defaultMessage="##cart.total" />
          </p>
        </div>
        <div className="flex justify-between items-center mb-8">
          <div className="w-3/4 pl-6 flex items-center">
            <div className="w-full flex">
              <span className="text-sm">
                <FormattedMessage
                  id="cart.sub-total"
                  defaultMessage="##cart.sub-total"
                />
              </span>
            </div>
          </div>
          <div className="w-1/4 pr-6 flex items-center text-right">
            <div className="w-full flex">
              <span className="text-sm">{priceFormat(subtotal)}</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="w-3/4 pl-6 flex items-center">
            <div className="w-full flex border-b border-grey-lighter-lighter pb-4">
              <span className="text-sm">
                <FormattedMessage
                  id="cart.shipping"
                  defaultMessage="##cart.shipping"
                />
              </span>
            </div>
          </div>
          <div className="w-1/4 pr-6 flex items-center text-right">
            <div className="w-full flex border-b border-grey-lighter-lighter pb-4">
              <span className="text-sm">
                {isShippingFree ? 'gratuit' : priceFormat(shippingFee)}
              </span>
            </div>
          </div>
        </div>
        <div />
        <div className="flex justify-between items-center mb-8">
          <div className="w-3/4 pl-6 flex items-center">
            <div className="w-full flex">
              <span className="text-sm font-bold">
                <FormattedMessage
                  id="cart.total-with-vat"
                  defaultMessage="##cart.total-with-vat"
                />
              </span>
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
        <If
          condition={itemsCount > 0}
          then={
            <div className="flex justify-between items-center mb-8">
              <div className="w-full px-6 flex items-center">
                <Link
                  to="/checkout"
                  className="w-full mx-auto px-4 py-2 uppercase font-bold text-xs text-white bg-black lg:text-black lg:bg-white border-2 border-black border-solid hover:text-black hover:bg-white"
                >
                  <FormattedMessage
                    id="cart.order"
                    defaultMessage="##cart.order"
                  />
                </Link>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}

CartSummary.propTypes = {
  subtotal: PropTypes.number,
  itemsCount: PropTypes.number,
  shippingFee: PropTypes.string,
  isShippingFree: PropTypes.string,
};

export default CartSummary;

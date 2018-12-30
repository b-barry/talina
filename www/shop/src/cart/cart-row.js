import React from 'react';
import PropTypes from 'prop-types';
import {priceFormat} from '../utils';
import CartSelectQuantity from './cart-select-quantity';

function CartRow({
  id,
  sku: {
    id: skuId,
    attributes: { size, pack },
    product,
    price
  },
  quantity,
  onUpdateQuantity,
  onRemoveFromCart,
}) {
  return (
    <li className="inline-block border-b border-grey-lighter flex justify-between flex-wrap py-4">
      <div className="flex items-start w-4/5">
        <div className="flex-1 overflow-hidden">
          <div className="pb-2">
            <span className="text-sm font-normal">{product.name}</span>
          </div>
          <p className="text-sm font-normal text-grey-dark">Size: {size} cl</p>
          <p className="text-sm font-normal text-grey-dark">
            Quantitée: {pack}
          </p>
        </div>
      </div>
      <CartSelectQuantity
        skuId={skuId}
        quantity={quantity}
        onUpdateQuantity={onUpdateQuantity}
      />
      <div className="w-full flex flex-row justify-between">
        <div className="w-full pt-1 flex items-center hover:underline">
          <svg
            className="w-3 h-3 text-blue-lighter fill-current"
            role="img"
            width="48px"
            height="48px"
            viewBox="0 0 24 24"
            aria-labelledby="binIconTitle binIconDesc"
            stroke="#12283A"
            strokeWidth={1}
            strokeLinecap="square"
            strokeLinejoin="miter"
            fill="none"
            color="#12283A"
          >
            <desc>Icon of a bin (trash)</desc>
            <path d="M19 6H5m9-1h-4m-4 5v10c0 .667.333 1 1 1h10c.667 0 1-.333 1-1V10" />
          </svg>
          <button
            className="text-xs text-blue-darkest pt-1"
            onClick={e => onRemoveFromCart(skuId)}
          >
            Supprimer
          </button>
        </div>
        <span className="inline-block font-black font-normal">{priceFormat(price)}</span>
      </div>
    </li>
  );
}

CartRow.propTypes = {
  stripeSkuId: PropTypes.string,
  quantity: PropTypes.number,
  customerCartId: PropTypes.string,
  id: PropTypes.string,
  createdAt: PropTypes.string,
  sku: PropTypes.shape({
    id: PropTypes.string,
    object: PropTypes.string,
    active: PropTypes.bool,
    attributes: PropTypes.shape({
      size: PropTypes.string,
      pack: PropTypes.string,
    }),
    created: PropTypes.number,
    currency: PropTypes.string,
    image: PropTypes.any,
    inventory: PropTypes.shape({
      quantity: PropTypes.number,
      type: PropTypes.string,
      value: PropTypes.any,
    }),
    livemode: PropTypes.bool,
    metadata: PropTypes.shape({}),
    package_dimensions: PropTypes.any,
    price: PropTypes.number,
    product: PropTypes.shape({
      id: PropTypes.string,
      object: PropTypes.string,
      active: PropTypes.bool,
      attributes: PropTypes.arrayOf(PropTypes.string),
      caption: PropTypes.string,
      created: PropTypes.number,
      deactivate_on: PropTypes.array,
      description: PropTypes.string,
      images: PropTypes.arrayOf(PropTypes.string),
      livemode: PropTypes.bool,
      metadata: PropTypes.shape({
        shipping_fee_25_cl: PropTypes.string,
        shipping_fee_1_l: PropTypes.string,
      }),
      name: PropTypes.string,
      package_dimensions: PropTypes.any,
      shippable: PropTypes.bool,
      skus: PropTypes.shape({
        object: PropTypes.string,
        data: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string,
            object: PropTypes.string,
            active: PropTypes.bool,
            attributes: PropTypes.shape({
              size: PropTypes.string,
              pack: PropTypes.string,
            }),
            created: PropTypes.number,
            currency: PropTypes.string,
            image: PropTypes.any,
            inventory: PropTypes.shape({
              quantity: PropTypes.number,
              type: PropTypes.string,
              value: PropTypes.any,
            }),
            livemode: PropTypes.bool,
            metadata: PropTypes.shape({}),
            package_dimensions: PropTypes.any,
            price: PropTypes.number,
            product: PropTypes.string,
            updated: PropTypes.number,
          })
        ),
        has_more: PropTypes.bool,
        total_count: PropTypes.number,
        url: PropTypes.string,
      }),
      type: PropTypes.string,
      updated: PropTypes.number,
      url: PropTypes.string,
    }),
    updated: PropTypes.number,
  }),
};

export default CartRow;

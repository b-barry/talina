import React from 'react'
import PropTypes from 'prop-types'
import CartSelectQuantity from './cart-select-quantity'

function CartRow({
  productName,
  id,
  attributes: { size, pack },
  quantity,
  onUpdateQuantity,
  onRemoveFromCart,
}) {
  console.log('onRemoveFromCart', id)
  return (
    <li className="inline-block border-b border-grey-lighter flex justify-between flex-wrap py-4">
      <div className="flex items-start w-4/5">
        <div className="flex-1 overflow-hidden">
          <div className="pb-2">
            <span className="text-sm font-normal">{productName}</span>
          </div>
          <p className="text-sm font-normal text-grey-dark">Size: {size} cl</p>
          <p className="text-sm font-normal text-grey-dark">
            Quantitée: {pack}
          </p>
        </div>
      </div>
      <CartSelectQuantity
        skuId={id}
        quantity={quantity}
        onUpdateQuantity={onUpdateQuantity}
      />
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
          onClick={e => onRemoveFromCart(id)}
        >
          Supprimer
        </button>
      </div>
    </li>
  )
}

CartRow.propTypes = {
  productName: PropTypes.string,
  onUpdateQuantity: PropTypes.func,
  onRemoveFromCart: PropTypes.func,
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
  quantity: PropTypes.number,
}

export default CartRow

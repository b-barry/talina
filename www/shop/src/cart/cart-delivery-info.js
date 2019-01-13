import React from 'react'
import {FormattedMessage} from 'react-intl';

function CartDeliveryInfo() {
  return (
    <div className="mb-4 flex-grow flex flex-col bg-white border border-grey-lighter overflow-hidden">
      <div className="px-6 mb-2">
        <p className="text-black py-4 font-bold text-2xl">
          <FormattedMessage
            id="cart.shipping-time-info-title"
            defaultMessage="##shipping-time-info-title"
          />
        </p>
      </div>
      <div className="px-6 pb-4">
        <div className="text-left font-normal text-sm text-black">
          <FormattedMessage
            id="cart.shipping-time-info-label"
            defaultMessage="##shipping-time-info-label"
          />
        </div>
      </div>
    </div>
  )
}

export default CartDeliveryInfo

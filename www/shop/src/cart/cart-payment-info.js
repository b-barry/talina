import React from 'react';
import { FormattedMessage } from 'react-intl';

function CartPaymentInfo() {
  return (
    <div className="flex-grow flex flex-col bg-white border border-grey-lighter overflow-hidden">
      <div className="px-6 mb-2">
        <p className="text-black py-4 font-bold text-2xl">
          <FormattedMessage
            id="cart.payment-info-title"
            defaultMessage="##cart.payment-info-title"
          />
        </p>
      </div>
      <div className="px-6 py-4">
        <FormattedMessage
          id="cart.payment-info-label"
          defaultMessage="##cart.payment-info-label"
        />
      </div>
    </div>
  );
}

export default CartPaymentInfo;

import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

function AddressStep({ value, onInputChange,title, intl }) {
  return (
    <div className="mb-4 flex-grow flex flex-col bg-white border border-grey-lighter overflow-hidden">
      <div className="px-4 mb-2">
        <p className="text-black pt-4 font-bold text-xl">{title}</p>
      </div>
      <form className="font-sans text-sm  w-full max-w-md mb-4 px-4 pt-3 pb-4">
        <div className="w-2/3 relative border  mb-4  appearance-none label-floating">
          <input
            className="w-full py-2 px-3 text-grey-darker leading-normal "
            id="firstName"
            name="firstName"
            type="text"
            placeholder={intl.formatMessage({
              id: 'checkout.first-name-field-label',
            })}
            value={value.firstName}
            onChange={onInputChange}
          />
          <label
            className="absolute block text-grey-darker pin-t pin-l w-full px-3 py-2 leading-normal"
            htmlFor="firstName"
          >
            <FormattedMessage
              id="checkout.first-name-field-label"
              defaultMessage="##checkout.first-name-field-label"
            />
          </label>
        </div>
        <div className="w-2/3 relative border  mb-4  appearance-none label-floating">
          <input
            className="w-full py-2 px-3 text-grey-darker leading-normal "
            id="lastName"
            name="lastName"
            type="text"
            placeholder={intl.formatMessage({
              id: 'checkout.last-name-field-label',
            })}
            value={value.lastName}
            onChange={onInputChange}
          />
          <label
            className="absolute block text-grey-darker pin-t pin-l w-full px-3 py-2 leading-normal"
            htmlFor="lastName"
          >
            <FormattedMessage
              id="checkout.last-name-field-label"
              defaultMessage="##checkout.last-name-field-label"
            />
          </label>
        </div>
        <div className="w-2/3 relative border  mb-4  appearance-none label-floating">
          <input
            className="w-full py-2 px-3 text-grey-darker leading-normal "
            id="deliveryAddress"
            name="deliveryAddress"
            type="text"
            placeholder={intl.formatMessage({
              id: 'checkout.delivery-address-name-field-label',
            })}
            value={value.deliveryAddress}
            onChange={onInputChange}
          />
          <label
            className="absolute block text-grey-darker pin-t pin-l w-full px-3 py-2 leading-normal"
            htmlFor="deliveryAddress"
          >
            <FormattedMessage
              id="checkout.delivery-address-name-field-label"
              defaultMessage="##checkout.delivery-address-name-field-label"
            />
          </label>
        </div>
      </form>
    </div>
  );
}

export default injectIntl(AddressStep);

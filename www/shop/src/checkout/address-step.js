import React from 'react';

function AddressStep({ value, onInputChange }) {
  return (
    <div className="mb-4 flex-grow flex flex-col bg-white border border-grey-lighter overflow-hidden">
      <div className="px-4 mb-2">
        <p className="text-black pt-4 font-bold text-xl">Delivery Address</p>
      </div>
      <form className="font-sans text-sm  w-full max-w-md mb-4 px-4 pt-3 pb-4">
        <div className="w-2/3 relative border  mb-4  appearance-none label-floating">
          <input
            className="w-full py-2 px-3 text-grey-darker leading-normal "
            id="firstName"
            name="firstName"
            type="text"
            placeholder="First Name"
            value={value.firstName}
            onChange={onInputChange}
          />
          <label
            className="absolute block text-grey-darker pin-t pin-l w-full px-3 py-2 leading-normal"
            htmlFor="firstName"
          >
            First Name
          </label>
        </div>
        <div className="w-2/3 relative border  mb-4  appearance-none label-floating">
          <input
            className="w-full py-2 px-3 text-grey-darker leading-normal "
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Last Name"
            value={value.lastName}
            onChange={onInputChange}
          />
          <label
            className="absolute block text-grey-darker pin-t pin-l w-full px-3 py-2 leading-normal"
            htmlFor="lastName"
          >
            Last Name
          </label>
        </div>
        <div className="w-2/3 relative border  mb-4  appearance-none label-floating">
          <input
            className="w-full py-2 px-3 text-grey-darker leading-normal "
            id="deliveryAddress"
            name="deliveryAddress"
            type="text"
            placeholder="Address de livraison"
            value={value.deliveryAddress}
            onChange={onInputChange}
          />
          <label
            className="absolute block text-grey-darker pin-t pin-l w-full px-3 py-2 leading-normal"
            htmlFor="deliveryAddress"
          >
            Address de livraison
          </label>
        </div>
      </form>
    </div>
  );
}

export default AddressStep;

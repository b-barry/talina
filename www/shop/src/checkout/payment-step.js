import React from 'react';
import { CardElement } from 'react-stripe-elements';
import { priceFormat } from '../utils';

function PaymentStep({ amount = '0', value, onInputChange }) {
  return (
    <section className="font-sans flex justify-between mt-6 mx-auto max-w-xl">
      <form className="font-sans text-sm rounded w-full max-w-md mx-auto my-8 px-8 pt-6 pb-8">
        <div className="relative border rounded mb-4 shadow appearance-none label-floating">
          <input
            className="w-full py-2 px-3 text-grey-darker leading-normal rounded"
            id="name"
            name="name"
            type="text"
            placeholder="Name"
            value={value.name}
            onChange={onInputChange}
          />
          <label
            className="absolute block text-grey-darker pin-t pin-l w-full px-3 py-2 leading-normal"
            htmlFor="name"
          >
            Name
          </label>
        </div>
        <div className="relative border rounded mb-4 shadow appearance-none label-floating">
          <input
            className="w-full py-2 px-3 text-grey-darker leading-normal rounded"
            id="address"
            name="address"
            type="text"
            placeholder="Address"
            value={value.address}
            onChange={onInputChange}
          />
          <label
            className="absolute block text-grey-darker pin-t pin-l w-full px-3 py-2 leading-normal"
            htmlFor="address"
          >
            Address de livraison
          </label>
        </div>
        <section className="bg-white py-4 font-sans">
          <div className="container m-auto max-w-xl flex items-baseline justify-start border-b-2 border-grey-light mb-5">
            <h2 className="text-grey-dark  hover:text-black text-sm font-bold tracking-wide uppercase py-2 mr-3 cursor-pointer">
              Card
            </h2>
            <h2 className="text-sm font-bold tracking-wide uppercase py-2 mr-3 border-b-2 border-black -mb-4 cursor-pointer">
              Bancontact
            </h2>
          </div>
        </section>
        <section className="bg-white py-4 font-sans">
          <div className="relative border rounded mb-4 shadow appearance-none label-floating">
            <CardElement
              className="w-full py-2 px-3 text-grey-darker leading-normal rounded"
              hidePostalCode={true}
            />
          </div>
          <div className="flex justify-between items-center mb-8">
            <div className="w-full px-6 flex items-center">
              <button className="w-full mx-auto px-4 py-2 uppercase font-bold text-xs text-white bg-black lg:text-black lg:bg-white border-2 border-black border-solid hover:text-black hover:bg-white">
                Payer {priceFormat(amount)}
              </button>
            </div>
          </div>
        </section>
        <section className="bg-white py-1 font-sans">
          <div className="flex justify-between items-center mb-8">
            <div className="w-full px-6 flex flex-col items-center">
              <span className="my-2 text-grey">
                You’ll be redirected to the banking site to complete your
                payment.
              </span>
              <button className="w-full mx-auto px-4 py-2 uppercase font-bold text-xs text-white bg-black lg:text-black lg:bg-white border-2 border-black border-solid hover:text-black hover:bg-white">
                Payer {priceFormat(amount)} avec Bancontact
              </button>
            </div>
          </div>
        </section>
      </form>
    </section>
  );
}

export default PaymentStep;

import React from 'react';
import { AppContext } from '../app-context';

import Layout from '../components/layout';
import SEO from '../components/seo';

function AccountStep() {
  return (
    <section className="font-sans flex justify-between mt-6 mx-auto max-w-xl">
      <form className="font-sans text-sm rounded w-full max-w-md mx-auto my-8 px-8 pt-6 pb-8">
        <div className="relative border rounded mb-4 shadow appearance-none label-floating">
          <input
            className="w-full py-2 px-3 text-grey-darker leading-normal rounded"
            id="email"
            type="text"
            placeholder="Email"
          />
          <label
            className="absolute block text-grey-darker pin-t pin-l w-full px-3 py-2 leading-normal"
            htmlFor="email"
          >
            Email
          </label>
        </div>
      </form>
    </section>
  );
}

export default AccountStep;

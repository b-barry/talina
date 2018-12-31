import * as PropTypes from 'prop-types';
import React from 'react';

function AccountFilledStep({ email, onEdit }) {
  return (
    <div className="mb-4 flex-grow flex flex-col  bg-white border border-grey-lighter overflow-hidden">
      <div className="px-4 flex flex-row justify-between">
        <p className="text-black pt-4 font-bold text-xl">Email address</p>
        <button
          onClick={onEdit}
          className="inline-block py-5 text-grey-darkest hover:text-grey-dark underline "
        >
          Edit
        </button>
      </div>
      <div className="px-4 mb-4">
        <p className="font-sans text-base text-black">{email}</p>
      </div>
    </div>
  );
}

AccountFilledStep.propTypes = {
  email: PropTypes.string,
  onEdit: PropTypes.func,
};

export default AccountFilledStep;

import React from 'react';

function DisabledStep({ title }) {
  return (
    <div className="mb-4 border border-grey-light overflow-hidden">
      <div className="px-4 my-2">
        <p className="text-grey py-2 font-bold text-lg ">{title}</p>
      </div>
    </div>
  );
}

export default DisabledStep;

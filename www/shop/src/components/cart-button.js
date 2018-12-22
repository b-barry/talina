import {Link} from 'gatsby';
import React from 'react';

const CartButton = ({count}) => (
  <Link to="/cart/" className="flex px-6 items-center cursor-pointer">
    <h2>{count}</h2>
    <svg role="link"
         className="fill-current w-4 h-4 text-white w-10 h-10"
         width="48px" height="48px" viewBox="0 0 24 24" aria-labelledby="bagIconTitle bagIconDesc"
         stroke="#000" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" fill="none" color="#000">
      <desc>Icon of a shopping bag</desc>
      <rect width={14} height={12} x={5} y={7}/>
      <path d="M8 7a4 4 0 1 1 8 0"/>
    </svg>
  </Link>
);

export default CartButton;

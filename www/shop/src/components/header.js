import React from 'react'
import { AppContext } from '../app-context'
import CartButton from './cart-button'

const Header = props => {
  return (
    <nav className="font-sans bg-white text-center flex justify-between my-4 mx-auto container overflow-hidden items-center">
      <div className="flex items-center">
        <a href="/" className="w-16">
          <img
            src="https://www.talina.be/wp-content/uploads/2018/06/Logo_Talina.png"
            className="rounded-full w-full"
            alt="logo"
          />
        </a>
        <ul className="text-sm text-grey-dark list-reset flex items-center">
          <li>
            <a
              href="#"
              className="inline-block py-2 px-3 text-grey-darkest hover:text-grey-dark no-underline"
            >
              Particuliers
            </a>
          </li>
          <li>
            <a
              href="#"
              className="inline-block py-2 px-3 text-grey-darkest hover:text-grey-dark no-underline"
            >
              Professionelles
            </a>
          </li>
        </ul>
      </div>
      <AppContext.Consumer>
        {({ cart }) => {
          return <CartButton count={cart.length} />
        }}
      </AppContext.Consumer>
    </nav>
  )
}

export default Header

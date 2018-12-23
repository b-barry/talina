import { Link } from 'gatsby'
import React from 'react'
import { AppContext } from '../app-context'
import { sumCartQuantities } from '../utils'
import CartButton from './cart-button'

const Header = () => {
  return (
    <nav className="font-sans bg-white text-center flex justify-between my-4 mx-auto container overflow-hidden items-center">
      <div className="flex items-center">
        <Link to="/" className="w-16">
          <img
            src="https://www.talina.be/wp-content/uploads/2018/06/Logo_Talina.png"
            className="rounded-full w-full"
            alt="logo"
          />
        </Link>
        <ul className="text-sm text-grey-dark list-reset flex items-center">
          <li>
            <Link
              to="/"
              className="inline-block py-2 px-3 text-grey-darkest hover:text-grey-dark no-underline"
            >
              Particuliers
            </Link>
          </li>
          <li>
            <Link
              to="#"
              className="inline-block py-2 px-3 text-grey-darkest hover:text-grey-dark no-underline"
            >
              Professionelles
            </Link>
          </li>
        </ul>
      </div>
      <AppContext.Consumer>
        {({ cart }) => {
          return <CartButton count={sumCartQuantities(cart)} />
        }}
      </AppContext.Consumer>
    </nav>
  )
}

export default Header

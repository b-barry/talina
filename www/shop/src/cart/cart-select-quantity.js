import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { fetchQuantityAvailable } from '../api'
import { isNull, range } from '../utils'

class CartSelectQuantity extends Component {
  static getDerivedStateFromProps(props, state) {
    if (props.skuId !== state.previousSkuId) {
      return {
        quantityAvailable: null,
        previousSkuId: props.skuId,
      }
    }

    return null
  }

  constructor(props) {
    super(props)

    this.state = {
      quantityAvailable: null,
    }

    this.handleUpdateQuantity = this.handleUpdateQuantity.bind(this)
  }

  async componentDidMount() {
    const quantityAvailable = await fetchQuantityAvailable(this.props.skuId)
    this.setState({ quantityAvailable: quantityAvailable })
  }

  async componentDidUpdate(prevProps, prevState) {
    if (isNull(this.state.quantityStillAvailable)) {
      const quantityAvailable = await fetchQuantityAvailable(this.props.skuId)
      this.setState({ quantityAvailable: quantityAvailable })
    }
  }

  handleUpdateQuantity(event) {
    console.log('handleUpdateQuantity', this.props, event.target.value)
    this.props.onUpdateQuantity(this.props.skuId, event.target.value)
  }

  render() {
    const { quantity } = this.props
    const { quantityAvailable } = this.state
    const optionsCount = range(
      quantityAvailable > 10 ? 10 : quantityAvailable,
      1
    )

    return (
      <div className="w-1/5 text-right relative">
        <select
          value={quantity}
          onChange={this.handleUpdateQuantity}
          className="appearance-none bg-white border-solid rounded-none border border-grey-light text-black py-2 px-4 pr-8 focus:outline-none focus:bg-white focus:border-black"
        >
          {optionsCount.map(value => {
            return (
              <option key={value} value={value}>
                {value}
              </option>
            )
          })}
        </select>
        <div className="pointer-events-none absolute pin-y pin-r flex items-center px-2 pb-5 text-black">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    )
  }
}

CartSelectQuantity.propTypes = {
  onUpdateQuantity: PropTypes.func,
  quantity: PropTypes.number,
  skuId: PropTypes.string,
}

export default CartSelectQuantity

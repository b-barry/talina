import PropTypes from 'prop-types'
import React from 'react'

const Container = ({ children }) => (
  <div className="container mx-auto">{children}</div>
)

Container.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Container

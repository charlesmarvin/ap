import React, { Component } from 'react'
import PropTypes from 'prop-types'

class TitleBar extends Component {
  render () {
    return (
      <div className='row cards'>
        <div className='eleven columns'>
          <h4>{this.props.title}</h4>
        </div>
        <div className='one columns'>
          {this.props.link}
        </div>
      </div>
    )
  }
}
TitleBar.propTypes = {
  link: PropTypes.node,
  title: PropTypes.node.isRequired
}
export default TitleBar

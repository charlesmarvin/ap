import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

class Card extends PureComponent {
  render () {
    const btnClass = classnames({
      'button-primary': this.props.selected
    })
    return (
      <div>
        <button
          className={btnClass}
          onClick={() => this.props.onSelect(this.props.label)}>
          {this.props.label}
        </button>
        <style jsx>{`
          button {
            float: left;
            margin: 1em;
            width: 100px;
            height: 100px;
          }
        `}</style>
      </div>
    )
  }
}

Card.propTypes = {
  label: PropTypes.node.isRequired,
  onSelect: PropTypes.func,
  selected: PropTypes.bool
}

export default Card

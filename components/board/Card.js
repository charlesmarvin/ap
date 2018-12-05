import React, {PureComponent} from 'react'
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

export default Card

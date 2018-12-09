import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'

class Vote extends PureComponent {
  render () {
    return (
      <div>
        <p>
          {this.props.label}
        </p>
        <style jsx>{`
          p {
            float: left;
            background: #EEE;
            border-radius: 3em;
            padding: 2em;
            margin-left: 1em;
          }
        `}</style>
      </div>
    )
  }
}

Vote.propTypes = {
  label: PropTypes.node.isRequired
}

export default Vote

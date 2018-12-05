import React, {PureComponent} from 'react'

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

export default Vote

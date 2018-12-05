import React, { PureComponent } from 'react'
import Vote from './Vote'

class Votes extends PureComponent {
  constructor (props) {
    super(props)
    this.handleRevealVotes = this.handleRevealVotes.bind(this)
  }

  handleRevealVotes () {
    this.props.onReveal()
  }

  _renderReveal () {
    if (this.props.votes.every((element) => element.voted)) {
      return <button className='button-primary' onClick={this.handleRevealVotes}>Reveal Votes</button>
    }
  }

  _renderVotes () {
    return this.props.votes.map(element => (
      <Vote
        label={this.props.revealed ? element.vote : element.voted ? '\u2713' : '\u292C'}
        key={element.userId}
      />
    ))
  }

  render () {
    return (
      <div className='row votes'>
        <h4>Votes</h4>
        <div className='column'>
          {this._renderVotes()}
        </div>
        <div className='column'>
          {this._renderReveal()}
        </div>
        <style jsx>{`
          .votes {
            margin-top: 4em
          }
        `}</style>
      </div>
    )
  }
}

export default Votes

import fetch from 'isomorphic-unfetch'
import React from 'react'
import classnames from 'classnames'

const CARDS_BY_BOARD_TYPES = {
  standard: [ 0, '1/2', 1, 2, 3, 5, 8, 13, 20, 40, 100, '?' ],
  fibonacci: [ 0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, '?' ],
  tshirt: [ 'XS', 'S', 'M', 'L', 'XL', 'XXL', '?' ]
}
class Vote extends React.Component {
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
            border-radius: 100px;
            padding: 2em;
            margin-left: 1em;
          }
        `}</style>
      </div>
    )
  }
}
class Card extends React.Component {
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
export default class Board extends React.Component {
  static async getInitialProps (context) {
    const { id } = context.query
    const res = await fetch(`http://localhost:3000/api/boards/${id}`)
    return {
      board: res.ok ? await res.json() : null
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      cards: props.board ? CARDS_BY_BOARD_TYPES[props.board.boardType] : null,
      selection: null,
      socket: null,
      votes: [],
      revealed: false
    }
    this.handleSelectionUpdate = this.handleSelectionUpdate.bind(this)
    this.revealVotes = this.revealVotes.bind(this)
  }

  async handleSelectionUpdate (selection) {
    const {id} = this.props.board
    this.state.socket.send(JSON.stringify({
      action: 'CAST_VOTE',
      params: {
        boardId: id,
        selection
      }
    }))
    this.setState({selection})
  }

  _updateVotes (members) {
    const votes = []
    for (let id in members) {
      votes.push(members[id])
    }
    this.setState({votes})
  }

  _toggleReveal () {
    this.setState({revealed: !this.state.revealed})
  }

  componentDidMount () {
    if (!this.props.board) return
    // Create WebSocket connection.
    const socket = new WebSocket('ws://localhost:3000/ws')
    this.setState({socket})
    // Connection opened
    socket.addEventListener('open', (event) => {
      const subscription = {
        action: 'JOIN_BOARD',
        params: {
          boardId: this.props.board.id
        }
      }
      socket.send(JSON.stringify(subscription))
      console.log('socket opened')
    })

    // Listen for messages
    socket.addEventListener('message', (message) => {
      // console.log('Message from server ', message.data)
      const event = JSON.parse(message.data)
      switch (event.type) {
        case 'NEW_MEMBER':
        case 'PARTICIPANTS_UPDATED':
        case 'NEW_VOTE': {
          this._updateVotes(event.params.members)
          break
        }
        case 'BOARD_REVEALED': {
          this._toggleReveal()
          break
        }
        default:
          console.log('Skipping unknown eventType: ', event)
          break
      }
    })
  }

  componentWillUnmount () {
    console.log('Closing connection')
    if (this.state.socket) {
      this.state.socket.close()
    }
  }

  revealVotes () {
    const event = {
      action: 'REVEAL_BOARD',
      params: {
        boardId: this.props.board.id
      }
    }
    this.state.socket.send(JSON.stringify(event))
  }

  _renderVotes () {
    return this.state.votes.map(element => (
      <Vote
        label={this.state.revealed ? element.vote : element.voted ? '\u2713' : '\u292C'}
        key={element.userId}
      />
    ))
  }

  _renderReveal () {
    if (this.state.votes.every((element) => element.voted)) {
      return <button className='button-primary' onClick={this.revealVotes}>Reveal Votes</button>
    }
  }

  _renderCards () {
    return this.state.cards.map(label => (
      <Card
        label={label}
        key={label}
        selected={this.state.selection === label}
        onSelect={this.handleSelectionUpdate}
      />
    ))
  }

  render () {
    if (!this.state.cards) {
      return (<div>Board not found</div>)
    }
    return (
      <div>
        <div className='row cards'>
          <h4>{this.props.board.boardName}</h4>
          <div className='column'>
            {this._renderCards()}
          </div>
        </div>

        <div className='row votes'>
          <h4>Votes</h4>
          <div className='column'>
            {this._renderVotes()}
          </div>
          <div className='column'>
            {this._renderReveal()}
          </div>
        </div>
        <style jsx>{`
          .cards {
            margin-top: 4em;
          }
          .votes {
            margin-top: 4em;
          }
        `}</style>
      </div>
    )
  }
}

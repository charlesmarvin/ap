import React from 'react'
import fetch from 'isomorphic-unfetch'
import Votes from '../components/board/Votes'
import Cards from '../components/board/Cards'

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
      revealed: false,
      selectedCard: null,
      votes: []
    }
    this.handleReveal = this.handleReveal.bind(this)
    this.handleSelectionUpdate = this.handleSelectionUpdate.bind(this)
  }

  componentDidMount () {
    if (!this.props.board) return
    // Create WebSocket connection.
    this.ws = new WebSocket('ws://localhost:3000/ws')
    // Connection opened
    this.ws.addEventListener('open', (event) => {
      const subscription = {
        action: 'JOIN_BOARD',
        params: {
          boardId: this.props.board.id
        }
      }
      this.ws.send(JSON.stringify(subscription))
      console.log('socket opened')
    })

    // Listen for messages
    this.ws.addEventListener('message', (message) => {
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
    if (this.ws) {
      this.ws.close()
    }
  }

  handleSelectionUpdate (selection) {
    const {id} = this.props.board
    this.ws.send(JSON.stringify({
      action: 'CAST_VOTE',
      params: {
        boardId: id,
        selection
      }
    }))
    this.setState({selectedCard: selection})
  }

  handleReveal () {
    this.ws.send(JSON.stringify({
      action: 'REVEAL_BOARD',
      params: {
        boardId: this.props.board.id
      }
    }))
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

  render () {
    console.log(this.state)
    if (!this.props.board) {
      return (<div>Board not found</div>)
    }
    return (
      <div>
        <Cards
          selection={this.state.selectedCard}
          title={this.props.board.boardName}
          type={this.props.board.boardType}
          onSelect={this.handleSelectionUpdate}
        />

        <Votes
          votes={this.state.votes}
          revealed={this.state.revealed}
          onReveal={this.handleReveal}
        />
      </div>
    )
  }
}

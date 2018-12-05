import React, { PureComponent } from 'react'
import Card from './Card'

const CARDS_BY_BOARD_TYPES = {
  standard: [ 0, '1/2', 1, 2, 3, 5, 8, 13, 20, 40, 100, '?' ],
  fibonacci: [ 0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, '?' ],
  tshirt: [ 'XS', 'S', 'M', 'L', 'XL', 'XXL', '?' ]
}

class Cards extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      cards: CARDS_BY_BOARD_TYPES[props.type]
    }
    this.handleSelectionUpdate = this.handleSelectionUpdate.bind(this)
  }

  handleSelectionUpdate (selection) {
    this.props.onSelect(selection)
  }

  _renderCards () {
    return this.state.cards.map(label => (
      <Card
        label={label}
        key={label}
        selected={this.props.selection === label}
        onSelect={this.handleSelectionUpdate}
      />
    ))
  }

  render () {
    return (
      <div className='row cards'>
        <h4>{this.props.title} <a title='Create New Board'>{'\u27A4'}</a></h4>
        <div className='column'>
          {this._renderCards()}
        </div>
        <style jsx>{`
          .cards {
            margin-top: 4em
          }
        `}</style>
      </div>
    )
  }
}

export default Cards

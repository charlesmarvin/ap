import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
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
        <div className='column'>
          {this.props.title}
        </div>
        <div className='column u-max-full-width'>
          {this._renderCards()}
        </div>
        <style jsx>{`
          .cards {
            
          }
        `}</style>
      </div>
    )
  }
}

Cards.propTypes = {
  selection: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  title: PropTypes.oneOfType([
    PropTypes.node
  ]),
  type: PropTypes.oneOf(['standard', 'fibonacci', 'tshirt']).isRequired
}

export default Cards

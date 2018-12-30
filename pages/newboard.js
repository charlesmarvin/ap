import React from 'react'
import fetch from 'isomorphic-unfetch'
import Router from 'next/router'

export default class NewBoardForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      boardName: '',
      boardType: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange (event) {
    const update = {}
    update[event.target.name] = event.target.value
    this.setState(update)
  }

  async handleSubmit (event) {
    console.log('Form submitted', this.state)
    event.preventDefault()
    if (this.state.boardName && this.state.boardType) {
      try {
        const res = await fetch('/api/boards', {
          method: 'POST',
          body: JSON.stringify(this.state),
          headers: { 'Content-Type': 'application/json' }
        })
        const board = await res.json()
        Router.replace(`/b/${board.id}`)
      } catch (err) {
        console.error('Error: ', err)
      }
    }
  }

  render () {
    return (
      <form id='create-board-form' onSubmit={this.handleSubmit}>
        <div className='row'>
          <div className='six columns'>
            <label htmlFor='board-name-input'>Board Name</label>
            <input className='u-full-width' type='text' name='boardName' placeholder='Sprint 23' id='board-name-input' onChange={this.handleChange} />
          </div>
          <div className='three columns'>
            <label htmlFor='board-type-input'>Board Type</label>
            <select className='u-full-width' name='boardType' id='board-type-input' onChange={this.handleChange}>
              <option>Select</option>
              <option value='standard'>Standard</option>
              <option value='fibonacci'>Fibonacci</option>
              <option value='tshirt'>T-Shirt</option>
            </select>
          </div>
          <div className='three columns'>
            <label>&nbsp;</label>
            <input className='button-primary' type='submit' value='Submit' />
          </div>
        </div>
      </form>
    )
  }
}

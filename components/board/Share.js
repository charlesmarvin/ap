import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

class Share extends PureComponent {
  constructor (props) {
    super(props)
    this.handleShare = this.handleShare.bind(this)
  }

  handleShare (event) {
    console.log('share clicked')
    event.preventDefault()
    if (this.props.id) {
      console.log(`copied link ${this.props.id} to the clipboard`)
    }
  }
  render () {
    return (
      <a title='Share Board' onClick={this.handleShare}>
        <img
          alt='SHARE'
          width='26'
          height='26'
          src='data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwIDEzYTUgNSAwIDAgMCA3LjU0LjU0bDMtM2E1IDUgMCAwIDAtNy4wNy03LjA3bC0xLjcyIDEuNzEiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Ik0xNCAxMWE1IDUgMCAwIDAtNy41NC0uNTRsLTMgM2E1IDUgMCAwIDAgNy4wNyA3LjA3bDEuNzEtMS43MSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+' />
      </a>
    )
  }
}

Share.propTypes = {
  id: PropTypes.string
}

export default Share

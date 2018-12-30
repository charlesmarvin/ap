const linkStyle = {
  textDecoration: 'none',
  fontSize: '2rem'
}

export default ({onClick}) => (
  <a style={linkStyle} title='Create New Board'>{'\u002B'}</a>
)

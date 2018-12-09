import App, {Container} from 'next/app'
import Link from 'next/link'
import '../styles/lib/normalize.css'
import '../styles/lib/skeleton.css'

const linkStyle = {
  marginRight: 15,
  textDecoration: 'none'
}

export default class ApApp extends App {
  static async getInitialProps ({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render () {
    const {Component, pageProps} = this.props
    return <Container>
      <div className='container' id='app'>

        <div className='row'>
          <div className='column' style={{marginRight: 1 + 'em'}}>
            <h1>a p | <Link href='/newboard'><a style={linkStyle} title='Create New Board'>{'\u002B'}</a></Link></h1>
          </div>
          <div className='column'>
            <app-alerts />
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <Component {...pageProps} />
          </div>
        </div>
      </div>
    </Container>
  }
}

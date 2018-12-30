const { PHASE_PRODUCTION_SERVER } =
  process.env.NODE_ENV === 'development'
    ? {}
    : process.env.NOW_REGION
      ? require('next-server/constants')
      : require('next/constants')

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_PRODUCTION_SERVER) {
    return {
      /* production only config */
    }
  }

  const withCSS = require('@zeit/next-css')
  return withCSS()
}

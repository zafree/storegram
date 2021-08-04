export default ({app, isHMR}) => {
  if (isHMR || process.server) return
  app.FB && app.FB.AppEvents.logPageView()
}

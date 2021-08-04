import {
  WINDOW_EVENT_NAVIGATION_CANCELLED,
  SET_NAVIGATING_ROUTE_PATH
} from '~/store/constants.yaml'

import animatedScrollTo from '~/utils/animated_scroll_to'

let appMounted = false

export default (ctx) => {
  const {app, store, isHMR} = ctx

  if (isHMR || process.server) return

  app.mounted = [app.mounted, function () {
    this.$on('routeChanged', function (to, from) {
      setTimeout(() => {
        this.$store.commit(SET_NAVIGATING_ROUTE_PATH, null)
        this.$loading.finish()
      }, 0)
    })
    appMounted = true
  }]

  app.router.beforeEach((to, from, next) => {
    if (store.state.navigatingRoutePath && store.state.navigatingRoutePath !== to.fullPath) {
      window.dispatchEvent(
        new CustomEvent(WINDOW_EVENT_NAVIGATION_CANCELLED, {
          detail: {
            routePath: store.state.navigatingRoutePath
          }
        })
      )
    }

    if (appMounted) {
      store.commit(SET_NAVIGATING_ROUTE_PATH, to.fullPath)
      const headerElement = document.querySelector('header')
      animatedScrollTo('main', headerElement ? headerElement.offsetHeight : 0, 5)
    }
    next()
  })
}

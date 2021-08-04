import createPersistedState from 'vuex-persistedstate'
import {
  APP_MOUNTED,
  SET_ATTEMPTED_PATH,
  LOAD_CART_ITEMS,
  LOAD_CATEGORIES,
  LOAD_LOCATIONS_WITH_AREA,
  BASE_DATA_RELOAD_INTERVAL,
  SET_IS_OFFLINE,
  SET_CART_ITEMS_FROM_BACKUP
} from '~/store/constants.yaml'

export default ({store, isHMR, redirect, route, params}) => {
  if (isHMR) return
  window.onNuxtReady((nuxt) => {
    nuxt.$loading.start()
    if (store.getters.isCustomerMode) {
      let paths = [
        'cart.items',
        'cart.cart_items_backup',
        'cart.updated_at',
        'cart.coupon_code',
        'cart.applied_coupon',
        'selectedPreferredAddress'
      ]
      createPersistedState({paths})(store)
    }

    let pathsForSessionStorage
    if (store.getters.isAgentMode) {
      pathsForSessionStorage = [
        'cart.items',
        'cart.cart_items_backup',
        'cart.updated_at',
        'ui.overlayContext',
        'ui.openCartAfterReload',
        'agentProfileAccessInfo'
      ]
    } else {
      pathsForSessionStorage = ['fbLoginAttempted']
    }

    createPersistedState({
      paths: pathsForSessionStorage,
      storage: window.sessionStorage
    })(store)

    window.addEventListener('online', () => {
      store.commit(SET_IS_OFFLINE, false)
    })

    window.addEventListener('offline', () => {
      store.commit(SET_IS_OFFLINE, true)
    })

    store.commit(APP_MOUNTED)

    let categoriesLoadInterval = parseInt(BASE_DATA_RELOAD_INTERVAL, 10) * 1000

    store.dispatch(LOAD_LOCATIONS_WITH_AREA)

    setInterval(function () {
      store.dispatch(LOAD_CATEGORIES, store.getters.agentToken)
      store.dispatch(LOAD_LOCATIONS_WITH_AREA)
    }, categoriesLoadInterval)

    if (store.state.attemptedPath && store.state.customer) {
      let attemptedPath = store.state.attemptedPath
      store.commit(SET_ATTEMPTED_PATH, null)
      redirect(attemptedPath)
    }

    if (store.state.cart.cart_items_backup && store.state.cart.cart_items_backup.length) {
      store.commit(SET_CART_ITEMS_FROM_BACKUP)
    }
    store.dispatch(LOAD_CART_ITEMS, !!store.state.customer)
  })
}

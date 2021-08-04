import cloneDeep from 'lodash/cloneDeep'
import {
  SET_PAGE_MODE,
  LOGOUT_CUSTOMER,
  SET_PROFILE_ACCESS_INFO
} from '~/store/constants.yaml'

export default function ({ store, route, redirect, hotReload }) {
  // Check if middleware called from hot-reloading, ignore
  if (hotReload) return
  let currentPageMode = cloneDeep(store.state.pageMode)

  // HOME PAGE
  currentPageMode.homePage = route.name === 'index' || route.name === 'lang'

  // SPECIAL MODE
  currentPageMode.specialMode = route.name === 'special-slug' || route.name === 'lang-special-slug'

  // PRDUCT DETAILS MODE
  currentPageMode.productDetailsMode = route.name && route.name.includes('product-product_slug')

  // PAYMENT MODE
  currentPageMode.paymentMode = route.name && route.name === 'checkout-payment-order_id' || route.name === 'lang-checkout-payment-order_id'

  // CHEKCOUT MODE
  const isCheckoutRoute = route.name.includes('checkout')
  const isAgentMode = store.getters.isAgentMode
  const isCustomerLoggedIn = store.state.customer

  if (store.state.pageMode.checkoutMode !== isCheckoutRoute) {
    currentPageMode.checkoutMode = isCheckoutRoute
    if (!isCheckoutRoute && isAgentMode && isCustomerLoggedIn) {
      store.dispatch(LOGOUT_CUSTOMER)
    }
  }

  // PROFILE MODE
  const isProfileRoute = /^(lang-)?(customer|agent)-/.test(route.name)
  const isAgentProfileRoute = /^(lang-)?(agent)-/.test(route.name)

  if (store.state.pageMode.profileMode !== isProfileRoute) {
    currentPageMode.profileMode = isProfileRoute
  }

  if (!isAgentProfileRoute) {
    store.commit(SET_PROFILE_ACCESS_INFO, null)
  }

  store.commit(SET_PAGE_MODE, currentPageMode)
}

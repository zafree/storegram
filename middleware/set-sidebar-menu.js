import {
  SET_SIDE_BAR_MENU,
  SIDE_BAR_MENU_CATALOG,
  SIDE_BAR_MENU_PROFILE
} from '~/store/constants.yaml'

const checkoutRouteRE = /^(lang-)?customer-/

export default function ({ store, route, redirect, hotReload }) {
  // Check if middleware called from hot-reloading, ignore
  if (hotReload) return

  const isCustomerPage = checkoutRouteRE.test(route.name)

  const menuType = isCustomerPage ? SIDE_BAR_MENU_PROFILE : SIDE_BAR_MENU_CATALOG

  if (store.state.ui.activeSideBarMenu !== menuType) {
    store.commit(SET_SIDE_BAR_MENU, menuType)
  }
}

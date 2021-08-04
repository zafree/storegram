import {
  APP_MODE,
  APP_MOUNTED,
  SET_SELECTED_PREFERRED_ADDRESS,
  SET_PREFERRED_DELIVERY_METHOD,
  SET_PREFERRED_DELIVERY_MODAL_FOR_CHECKOUT,
  SET_ALL_CATEGORIES,
  SET_CURRENT_CATEGORY,
  SET_ALL_LOCATIONS,
  SET_LANG,
  SET_ATTEMPTED_PATH,
  SET_PAGE_NOTIFICATION,
  SET_IS_OFFLINE,
  SET_CUSTOMER_LOGIN_INFO,
  SET_AGENT_LOGIN_INFO,
  SET_PROFILE_ACCESS_INFO,
  UPDATE_AGENT_PROFILE_ACCESS_TIMESTAMP,
  ADD_LINE_ITEM_TO_CART,
  ADD_LINE_ITEM_INFO_TO_STORE,
  REMOVE_LINE_ITEM_FROM_CART,
  REMOVE_DATA_FROM_CART,
  INCREASE_LINE_ITEM_QTY,
  DECREASE_LINE_ITEM_QTY,
  LOAD_CART_ITEM_INFO,
  UPDATE_CART,
  SET_COUPON_RESPONSE,
  REMOVE_COUPON,
  SET_UPDATED_LINE_ITEM_PRICE_QTY,
  UPDATE_CART_TIMESTAMP,
  UPDATE_CART_ERROR_STATE,

  OPEN_OVERLAY,
  CLOSE_OVERLAY,
  SET_OVERLAY_CONTEXT,

  SET_SIDE_BAR_MENU,
  SET_CUSTOMER,
  MARK_FB_SDK_READY,
  SET_APP_MODE,
  SET_NAVIGATING_ROUTE_PATH,
  SET_PAGE_MODE,

  UPDATE_NAME,
  UPDATE_INVOICE_EMAIL,
  ADD_NEW_CUSTOMER_MOBILE,
  REMOVE_CUSTOMER_MOBILE,
  REMOVE_CUSTOMER_LAST_DELIVERY_ADDRESS,
  REMOVE_CUSTOMER_FACEBOOK_CONNECTION_FROM_STORE,
  UPDATE_PRIMARY_MOBILE_NUMBER_IN_STORE,
  UPDATE_ADDRESS,
  UPDATE_LAST_DELIVERY_ADDRESS_ID,
  ADD_NEW_ADDRESS,
  REMOVE_CUSTOMER_ADDRESS,

  OPEN_PRODUCT_VARIANT_MODAL,
  CLOSE_PRODUCT_VARIANT_MODAL,
  CUSTOMER_COOKIE_NAME,
  AGENT_COOKIE_NAME,
  TOGGLE_COMMISSION,

  SET_CART_PREOPEN_FLAG,
  SET_PLATFORM,
  SET_LAST_FB_LOGIN_TIMESTAMP,
  SET_CART_ITEMS_FROM_BACKUP,
  RESET_CART_ITEMS_FOR_EMI,
  UPDATE_COLLAPSED_TREE,
  CHANGE_COLLAPDESD_STATE,
  SET_MOST_USED_COMPONENTS_I18NKEYS
} from '~/store/constants.yaml'

import get from 'lodash/get'
import findIndex from 'lodash/findIndex'
import find from 'lodash/find'
import parseInt from 'lodash/parseInt'
import cloneDeep from 'lodash/cloneDeep'
import Vue from 'vue'
import Cookies from 'js-cookie'
// import logger from '~/utils/logger'

function removeLineItem (state, lineItem) {
  let index = findIndex(state.cart.items, (li) => li.id === lineItem.id)
  if (index > -1) {
    state.cart.items.splice(index, 1)
  }

  // Remove from cartItemsDisplayInfo too!
  index = findIndex(state.cart.cart_items_display_info, (li) => li.id === lineItem.id)
  if (index > -1) {
    state.cart.cart_items_display_info.splice(index, 1)
  }
}

function findCartItemDisplayInfo (state, item) {
  return find(state.cart.cart_items_display_info, (li) => li.id === item.id)
}

function increaseLineItemQty (state, lineItem) {
  let itemInfo = findCartItemDisplayInfo(state, lineItem)
  if (lineItem.qty < itemInfo.available_qty) {
    lineItem.qty += 1
  }
}

function removeMobileNumber (state, deleteMobileObject) {
  let index = findIndex(state.customer.mobiles, (mn) => mn.id === deleteMobileObject.id)
  if (index > -1) {
    state.customer.mobiles.splice(index, 1)
  }
}

function updatePrimaryNumber (state, primaryMobileId) {
  let indexOfNewPrimary = findIndex(state.customer.mobiles, (mn) => mn.id === primaryMobileId)
  state.customer.mobiles[indexOfNewPrimary].is_primary = 1

  let indexOfOldPrimary = findIndex(state.customer.mobiles, (mn) => mn.is_primary === 1)
  if (indexOfOldPrimary) {
    state.customer.mobiles[indexOfOldPrimary].is_primary = 0
  }
}

function updateCustomerAddress (state, newAddress) {
  let indexOfUpdatedAddress = findIndex(state.customer.addresses, (a) => a.id === newAddress.id)
  state.customer.addresses[indexOfUpdatedAddress] = newAddress
}

function updateCollapsedState (catTree, wantedId, value) {
  if (Array.isArray(catTree)) {
    for (let i = 0; i < catTree.length; i++) {
      if (catTree[i].id === wantedId) {
        catTree[i].collapsed = value
      } else {
        updateCollapsedState(catTree[i], wantedId, value)
      }
    }
  } else if (catTree.id === wantedId) {
    catTree.collapsed = value
  } else if (Array.isArray(catTree.children)) {
    catTree.children = updateCollapsedState(catTree.children, wantedId, value)
  }
  return catTree
}

const mutations = {
  [SET_LANG] (state, locale) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale
    }
  },

  [SET_ALL_LOCATIONS] (state, locations) {
    state.allLocations = locations
  },

  [SET_SELECTED_PREFERRED_ADDRESS] (state, address) {
    state.selectedPreferredAddress = address
  },

  [SET_PREFERRED_DELIVERY_METHOD] (state, method) {
    state.preferredDeliveryMethod = method
  },

  [SET_PREFERRED_DELIVERY_MODAL_FOR_CHECKOUT] (state, flag) {
    state.usePreferredDeliveryModalForCheckout = flag
  },

  [SET_ALL_CATEGORIES] (state, categories) {
    state.allCategories = categories
  },

  [SET_CURRENT_CATEGORY] (state, currentCategory) {
    state.currentCategory = currentCategory
  },

  [UPDATE_COLLAPSED_TREE] (state, categories) {
    state.allCategories = categories
  },

  [CHANGE_COLLAPDESD_STATE] (state, {id, value}) {
    let x = cloneDeep(state.allCategories)
    state.allCategories = updateCollapsedState(x, id, value)
  },

  [SET_APP_MODE] (state, value) {
    state.appMode = value
  },

  [SET_PAGE_MODE] (state, value) {
    state.pageMode = value
  },

  [SET_NAVIGATING_ROUTE_PATH] (state, value) {
    state.navigatingRoutePath = value
  },

  [SET_PAGE_NOTIFICATION] (state, value) {
    state.ui.pageNotification = value
  },

  [SET_IS_OFFLINE] (state, value) {
    state.ui.isOffline = value
  },

  [OPEN_PRODUCT_VARIANT_MODAL] (state) {
    state.ui.showVariantModal = true
  },

  [CLOSE_PRODUCT_VARIANT_MODAL] (state) {
    state.ui.showVariantModal = false
  },

  [ADD_LINE_ITEM_TO_CART] (state, item) {
    let lineItem = state.cart.items.find((li) => li.id === item.id)
    if (lineItem) {
      increaseLineItemQty(state, lineItem)
    } else {
      item.qty = 1
      state.cart.items.push(item)
      state.cart.updated_at = Date.now()
    }
  },

  [ADD_LINE_ITEM_INFO_TO_STORE] (state, itemInfo) {
    let lineItemInfoIndex = findIndex(state.cart.cart_items_display_info, { id: itemInfo.id })
    if (lineItemInfoIndex < 0) {
      state.cart.cart_items_display_info.push(itemInfo)
    } else {
      state.cart.cart_items_display_info[lineItemInfoIndex] = itemInfo
    }
  },

  [REMOVE_LINE_ITEM_FROM_CART] (state, lineItem) {
    removeLineItem(state, lineItem)
    state.cart.updated_at = Date.now()
  },

  [REMOVE_DATA_FROM_CART] (state) {
    state.cart.delivery_rule = null
    state.cart.items = []
    state.cart.cart_items_display_info = []
  },

  [UPDATE_CART_TIMESTAMP] (state) {
    state.cart.updated_at = Date.now()
  },

  [UPDATE_CART_ERROR_STATE] (state) {
    let error = false
    for (let item of state.cart.cart_items_display_info) {
      if (item.error) {
        error = true
        break
      }
    }
    state.cart.cartError = error
  },

  [INCREASE_LINE_ITEM_QTY] (state, lineItem) {
    let itemInfo = findCartItemDisplayInfo(state, lineItem)
    if (lineItem.qty < itemInfo.available_qty) {
      lineItem.qty += 1
      state.cart.updated_at = Date.now()
    }
  },

  [DECREASE_LINE_ITEM_QTY] (state, lineItem) {
    if (lineItem.qty > 0) {
      lineItem.qty -= 1
      state.cart.updated_at = Date.now()
    }

    if (lineItem.qty <= 0) {
      removeLineItem(state, lineItem)
    }
  },

  [LOAD_CART_ITEM_INFO] (state, cartItemsDisplayInfo) {
    state.cart.cart_items_display_info = cartItemsDisplayInfo
  },

  [SET_UPDATED_LINE_ITEM_PRICE_QTY] (state, { clonedCartItem, cartItem, cartItemInfo }) {
    Object.assign(cartItem, clonedCartItem)

    if (state.appMode === APP_MODE.AGENT) {
      cartItem.commision = cartItemInfo.commision
      cartItem.commision_rule_id = cartItemInfo.commision_rule_id
    }

    Vue.delete(cartItemInfo, 'error')
  },

  [UPDATE_CART] (state, response) {
    state.cart.items = response.items.map(i => i.request_item)

    state.cart.cart_items_display_info = response.items.map(i => {
      i.item_details.error = i.error
      return i.item_details
    })

    let erroItem = response.items.find(i => !!i.error)
    state.cart.cartError = erroItem ? !!erroItem.error : false

    state.cart.sub_total = response.sub_total
  },

  [SET_COUPON_RESPONSE] (state, cart) {
    if (cart.applied_coupon) {
      state.cart.applied_coupon = cart.applied_coupon
    } else {
      state.cart.applied_coupon = null
      state.cart.coupon_code = null
    }

    if (cart.user_coupon) {
      state.cart.user_coupon = cart.user_coupon
      state.cart.coupon_code = cart.user_coupon.code
    } else {
      state.cart.user_coupon = null
      state.cart.coupon_code = null
    }
  },

  [REMOVE_COUPON] (state) {
    const isUserAppliedCoupon = !!(state.cart.applied_coupon && state.cart.user_coupon && state.cart.applied_coupon.id === state.cart.user_coupon.id) || !!state.cart.user_coupon
    if (!state.cart.user_coupon || !isUserAppliedCoupon) {
      state.cart.applied_coupon = null
    } else if (isUserAppliedCoupon) {
      state.cart.applied_coupon = null
      state.cart.coupon_code = null
      state.cart.user_coupon = null
    }
  },

  [SET_OVERLAY_CONTEXT] (state, context) {
    state.ui.overlayContext = context
  },

  [OPEN_OVERLAY] (state, overlayName) {
    state.ui.activeOverlay = overlayName
  },

  [CLOSE_OVERLAY] (state) {
    state.ui.activeOverlay = null
  },

  [SET_SIDE_BAR_MENU] (state, menuName) {
    state.ui.activeSideBarMenu = menuName
  },

  // Login/Logout
  [SET_CUSTOMER] (state, userInfo) {
    state.customer = userInfo
  },

  [SET_PLATFORM] (state, platform) {
    state.platform = platform
  },

  [SET_LAST_FB_LOGIN_TIMESTAMP] (state, flag) {
    state.fbLoginAttempted = flag
  },

  [SET_CUSTOMER_LOGIN_INFO] (state, loginInfo) {
    if (loginInfo) {
      if (process.browser) {
        Cookies.set(CUSTOMER_COOKIE_NAME, loginInfo.access_token, { expires: 365 })
      }
      state.customer_access_token = loginInfo.access_token
      state.customer = loginInfo.customer
    } else {
      if (process.browser) {
        Cookies.remove(CUSTOMER_COOKIE_NAME)
      }
      state.customer_access_token = null
      state.customer = null
    }
  },

  [SET_AGENT_LOGIN_INFO] (state, loginInfo) {
    if (loginInfo) {
      if (loginInfo.access_token) {
        if (process.browser) {
          Cookies.set(AGENT_COOKIE_NAME, loginInfo.access_token, { expires: 365 })
        }
        state.agent_access_token = loginInfo.access_token
      }
      if (loginInfo.agent) {
        state.agent = loginInfo.agent
      }
    } else {
      if (process.browser) {
        Cookies.remove(AGENT_COOKIE_NAME)
      }
      state.agent_access_token = null
      state.agent = null
    }
  },

  [SET_PROFILE_ACCESS_INFO] (state, accessInfo) {
    state.agentProfileAccessInfo = accessInfo
  },

  [UPDATE_AGENT_PROFILE_ACCESS_TIMESTAMP] (state, newTimeStamp) {
    state.agentProfileAccessInfo.access_timestamp = newTimeStamp
  },

  [MARK_FB_SDK_READY] (state) {
    state.isFbSdkReady = true
  },

  [APP_MOUNTED] (state) {
    state.isAppMounted = true
  },

  [SET_ATTEMPTED_PATH] (state, attemptedPath) {
    state.attemptedPath = attemptedPath
  },

  [UPDATE_NAME] (state, name) {
    state.customer.name = name
  },

  [UPDATE_INVOICE_EMAIL] (state, invoiceEmail) {
    state.customer.invoice_email = invoiceEmail
  },

  [ADD_NEW_CUSTOMER_MOBILE] (state, newMobileObject) {
    state.customer.mobiles.push(newMobileObject)
  },

  [UPDATE_PRIMARY_MOBILE_NUMBER_IN_STORE] (state, newMobileObject) {
    updatePrimaryNumber(state, newMobileObject)
  },

  [REMOVE_CUSTOMER_MOBILE] (state, deleteMobileObject) {
    removeMobileNumber(state, deleteMobileObject)
  },

  [ADD_NEW_ADDRESS] (state, newAddress) {
    state.customer.addresses.push(newAddress)
  },

  [UPDATE_ADDRESS] (state, newAddress) {
    updateCustomerAddress(state, newAddress)
  },

  [UPDATE_LAST_DELIVERY_ADDRESS_ID] (state, id) {
    state.customer.last_delivery_address_id = id
  },

  [REMOVE_CUSTOMER_ADDRESS] (state, id) {
    const index = findIndex(state.customer.addresses, { id: parseInt(id) })
    state.customer.addresses.splice(index, 1)
  },

  [REMOVE_CUSTOMER_LAST_DELIVERY_ADDRESS] (state) {
    state.customer.last_delivery_address_id = null
    state.customer.lastDeliveryAddress = null
  },

  [REMOVE_CUSTOMER_FACEBOOK_CONNECTION_FROM_STORE] (state) {
    state.customer.facebook_id = null
  },

  [TOGGLE_COMMISSION] (state) {
    state.toggleCommission = !state.toggleCommission
  },

  [SET_CART_PREOPEN_FLAG] (state, flag) {
    state.ui.openCartAfterReload = flag
  },

  [RESET_CART_ITEMS_FOR_EMI] (state) {
    state.cart.cart_items_backup = cloneDeep(state.cart.items)
    state.cart.items = []
    state.cart.cart_items_display_info = []
    state.cart.is_emi = true
  },

  [SET_CART_ITEMS_FROM_BACKUP] (state) {
    state.cart.items = cloneDeep(state.cart.cart_items_backup)
    state.cart.cart_items_backup = []
    state.cart.cart_items_display_info = []
    state.cart.is_emi = false
  },

  [SET_MOST_USED_COMPONENTS_I18NKEYS] (state, config) {
    let i18nKeys = {}
    const i18nKeyFile = require('~/static/' + state.locale + '.yaml')
    for (let maps in config) {
      i18nKeys[maps] = {}
      for (let key in config[maps]) {
        i18nKeys[maps][key] = get(i18nKeyFile, config[maps][key])
      }
    }
    state.i18nText = i18nKeys
  }
}

export default mutations

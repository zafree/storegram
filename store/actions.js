import {
  SET_APP_MODE,
  LOAD_CATEGORIES,
  SET_ALL_CATEGORIES,
  SET_SELECTED_PREFERRED_ADDRESS,
  LOAD_LOCATIONS_WITH_AREA,
  SET_ALL_LOCATIONS,
  SET_CUSTOMER_LOGIN_INFO,
  SET_AGENT_LOGIN_INFO,
  SET_PROFILE_ACCESS_INFO,
  ADD_PRODUCT_TO_CART,
  INCREASE_LINE_ITEM_QTY,
  DECREASE_LINE_ITEM_QTY,
  REMOVE_LINE_ITEM_FROM_CART,
  ADD_LINE_ITEM_INFO_TO_STORE,
  HANDLE_APPLIED_COUPON,
  REMOVE_COUPON,
  SET_COUPON_RESPONSE,
  SAVE_CART,
  VALIDATE_COUPON,
  LOAD_CART_ITEM_INFO,
  RAISE_ERROR_IF_LINEITEMS_NOT_AGENT_DELIVERABLE,
  RAISE_ERROR_IF_LINEITEMS_NOT_LOCKER_DELIVERABLE,
  UPDATE_CART,
  UPDATE_CART_ERROR_STATE,
  CLEAR_CART,
  REMOVE_DATA_FROM_CART,
  LOAD_CART_ITEMS,
  SET_PAGE_NOTIFICATION,

  LOAD_AGENT_COMMISSION,

  UPDATE_ADDRESS,
  ADD_NEW_ADDRESS,
  ADD_NEW_CUSTOMER_MOBILE,

  /* auth related constants */
  SAVE_CUSTOMER_MOBILE,
  SET_CUSTOMER,
  LOAD_CUSTOMER_BY_CUSTOMER_TOKEN,
  LOAD_AGENT_BY_AGENT_TOKEN,
  REQUEST_NEW_OTP,
  LOGIN_WITH_OTP,
  LOGIN_WITH_PASSWORD,
  CHANGE_PASSWORD,
  VERIFY_AGENT_WITH_PASSWORD,
  TRY_AUTOMATIC_LOGIN_WITH_FACEBOOK,
  CONNECT_FACEBOOK,
  DISCONNECT_FACEBOOK,
  REGISTER_WITH_OTP,
  SAVE_CUSTOMER_INFO,
  LOGOUT_CUSTOMER,
  LOGOUT_AGENT,
  DELETE_CUSTOMER_MOBILE,
  REMOVE_CUSTOMER_MOBILE,
  REMOVE_CUSTOMER_ADDRESS,
  CUSTOMER_COOKIE_NAME,
  AGENT_COOKIE_NAME,
  PLATFORM_COOKIE_NAME,
  SET_PLATFORM,
  APP_MODE,
  EVENT_SAVE_CART_RESPONSE_IN_CART,
  UPDATE_LINE_ITEM_PRICE_QTY,
  SET_UPDATED_LINE_ITEM_PRICE_QTY,
  API_ERRORS,
  SET_LAST_FB_LOGIN_TIMESTAMP,
  ADD_PRODUCT_TO_EMI_CART,
  RESET_CART_ITEMS_FOR_EMI,
  RESTORE_CART_ITEMS_FROM_BACKUP,
  SET_CART_ITEMS_FROM_BACKUP,
  LOGIN_BY_FACEBOOK_SUCCESSFUL,
  LOAD_MOST_USED_COMPONENTS_I18NKEYS,
  SET_MOST_USED_COMPONENTS_I18NKEYS
} from '~/store/constants.yaml'

import {
  getCategories,
  getLocationsWithArea,
  getUserByAuthToken,
  getAgentByAuthToken,
  createOtp,
  loginWithOTP,
  loginWithPassword,
  checkFbStatusAndSigninOrUp,
  registerWithOTP,
  changePassword,
  connectLoginOrRegisterWithFacebook,
  facebookDisconnect,
  updateCustomer,
  saveOrValidateCart,
  saveNewCustomerMobile,
  deleteCustomerMobile,
  saveCustomerAddress,
  deleteCustomerAddress,
  getAgentCommission
} from '~/api'

import {
  getCookieValue
} from '~/utils'

import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
import findIndex from 'lodash/findIndex'
import find from 'lodash/find'
import has from 'lodash/has'
import forEach from 'lodash/forEach'
import logger from '~/utils/logger'

let saveCartPromise = null

const actions = {
  nuxtServerInit ({ getters, commit, dispatch }, { req, env }) {
    let actions = []
    const isServer = process.server
    env.appMode ? commit(SET_APP_MODE, env.appMode) : commit(SET_APP_MODE, APP_MODE.CUSTOMER)

    let customerAccessToken = getCookieValue(CUSTOMER_COOKIE_NAME, isServer, req)
    if (customerAccessToken) {
      actions.push(dispatch(LOAD_CUSTOMER_BY_CUSTOMER_TOKEN, customerAccessToken))
    }

    let agentAccessToken = null
    if (getters.isAgentMode) {
      agentAccessToken = getCookieValue(AGENT_COOKIE_NAME, isServer, req)
      if (agentAccessToken) {
        actions.push(dispatch(LOAD_AGENT_BY_AGENT_TOKEN, agentAccessToken))
      }
    }

    let platform = getCookieValue(PLATFORM_COOKIE_NAME, isServer, req)
    if (platform) {
      commit(SET_PLATFORM, parseInt(platform))
    }
    actions.push(dispatch(LOAD_CATEGORIES, agentAccessToken))
    return Promise.all(actions)
  },

  [LOAD_MOST_USED_COMPONENTS_I18NKEYS] ({commit}) {
    let ProductCardThumbnail = require('../components/catalog/ProductCardThumbnail.i18n.yaml')
    let ProductDetails = require('../components/catalog/ProductDetails.i18n.yaml')
    let Cart = require('../components/layouts/Cart.i18n.yaml')

    commit(SET_MOST_USED_COMPONENTS_I18NKEYS, {
      ProductCardThumbnail,
      ProductDetails,
      Cart
    })
  },

  [LOAD_CART_ITEMS] ({state, dispatch}, customerWasLoggedIn) {
    let persistedCartItems = cloneDeep(state.cart && state.cart.items && state.cart.items.length ? state.cart.items : [])
    let customerCartItems = cloneDeep(state.customer && state.customer.cart && state.customer.cart.items && state.customer.cart.items.length ? state.customer.cart.items : [])

    if (customerWasLoggedIn) return dispatch(SAVE_CART, { items: customerCartItems })

    if (customerCartItems.length === 0) {
      return dispatch(SAVE_CART, { items: persistedCartItems })
    } else if (persistedCartItems.length === 0) {
      return dispatch(SAVE_CART, { items: customerCartItems })
    }
    let finalCart = cloneDeep(state.customer && state.customer.cart && state.customer.cart.items && state.customer.cart.items.length ? state.customer.cart.items : [])

    for (let item of persistedCartItems) {
      let similarItemIndex = customerCartItems.findIndex(cid => cid.id === item.id)
      if (similarItemIndex >= 0) {
        finalCart[similarItemIndex].qty += item.qty
      } else {
        finalCart.push(item)
      }
    }
    return dispatch(SAVE_CART, { items: finalCart })
  },

  [LOAD_CATEGORIES] ({commit, state}, authToken) {
    return getCategories(authToken)
      .then(
        (categories) => {
          if (!isEqual(state.allCategories, categories)) {
            commit(SET_ALL_CATEGORIES, categories)
          }
          return Promise.resolve(categories)
        }
      )
  },
  [LOAD_LOCATIONS_WITH_AREA] ({commit, state}) {
    return getLocationsWithArea()
      .then(
        (locations) => {
          if (!isEqual(state.allLocations, locations)) {
            commit(SET_ALL_LOCATIONS, locations)
          }
        }
      )
  },

  [ADD_PRODUCT_TO_CART] ({state, getters, commit, dispatch}, productInfo) {
    let lineItem = {
      id: productInfo.id,
      stock_record_id: productInfo.stock_record_id,
      discounted_price: productInfo.discounted_price,
      discount_rule_id: productInfo.discount_rule_id || null,
      qty: 1
    }

    if (state.cart.is_emi) {
      lineItem.emi_tenures = productInfo.emi_tenures
    }

    if (getters.isAgentMode) {
      lineItem.commission = productInfo.commission
      lineItem.commission_rule_id = productInfo.commission_rule_id
    }

    let checkIfAllreadyAddedIndex = findIndex(state.cart.items, { id: lineItem.id })
    let cart = cloneDeep(state.cart)

    if (checkIfAllreadyAddedIndex < 0) {
      cart.items.push(lineItem)
    } else {
      cart.items[checkIfAllreadyAddedIndex].qty++
    }

    if (cart.coupon_code === null) {
      delete cart.coupon_code
    }
    return dispatch(SAVE_CART, cart)
      .then(response => {
        return {message: 'item is added/increased and cart saved in the server'}
      })
      .catch(error => {
        logger.error(SAVE_CART, error)
      })
  },

  [INCREASE_LINE_ITEM_QTY] ({ state, commit, dispatch }, item) {
    let cartItems = cloneDeep(state.cart)
    let index = findIndex(state.cart.items, { id: item.id })
    cartItems.items[index].qty += 1

    dispatch(SAVE_CART, cartItems)
      .then(response => {
        return {message: 'cart item increased and saved in the server'}
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },

  [DECREASE_LINE_ITEM_QTY] ({ state, commit, dispatch }, item) {
    let cartItems = cloneDeep(state.cart)
    let index = findIndex(cartItems.items, { id: item.id })
    if (item.qty > 1) {
      cartItems.items[index].qty -= 1
      dispatch(SAVE_CART, cartItems)
        .then(response => {
          return {message: 'cart item decreased and saved in the server'}
        })
        .catch(error => {
          logger.error(SAVE_CART, error)
        })
    } else {
      // TODO: replace alert with tooltip in future
      // alert('remove the item, don\'t just click this button ')
    }
  },

  [REMOVE_LINE_ITEM_FROM_CART] ({ state, commit, dispatch }, cartItem) {
    commit(REMOVE_LINE_ITEM_FROM_CART, cartItem)
    dispatch(SAVE_CART, state.cart)
  },

  [ADD_LINE_ITEM_INFO_TO_STORE] ({ commit }, productInfo) {
    commit(ADD_LINE_ITEM_INFO_TO_STORE, productInfo)
    commit(UPDATE_CART_ERROR_STATE)
  },

  [UPDATE_LINE_ITEM_PRICE_QTY] ({ state, commit, dispatch }, { cartItem, cartItemInfo }) {
    let clonedCartItem = cloneDeep(cartItem)
    clonedCartItem.discounted_price = cartItemInfo.discounted_price || cartItemInfo.unit_price

    if (cartItemInfo.error === API_ERRORS.NOT_ENOUGH_QTY) {
      clonedCartItem.qty = cartItemInfo.available_qty
    }

    commit(SET_UPDATED_LINE_ITEM_PRICE_QTY, {
      clonedCartItem,
      cartItem: cartItem,
      cartItemInfo: cartItemInfo
    })
    dispatch(SAVE_CART, state.cart)
      .then(response => {
        let savedItem = find(response.items, { request_item: { id: cartItem.id } })
        dispatch(ADD_LINE_ITEM_INFO_TO_STORE, savedItem.item_details)
        commit(UPDATE_CART_ERROR_STATE)
      })
      .catch(error => {
        logger.error(SAVE_CART, error.error)
      })
  },

  [HANDLE_APPLIED_COUPON] ({ commit }, cart) {
    if (!cart) {
      commit(REMOVE_COUPON)
    } else {
      commit(SET_COUPON_RESPONSE, cart)
    }
  },

  [SAVE_CART] ({ state, getters, commit, dispatch }, cart) {
    if (saveCartPromise && saveCartPromise.cancel) {
      saveCartPromise.cancel()
    }

    let clonedCart = {
      items: cart.items,
      updated_at: cart.updated_at,
      is_emi: cart.is_emi
    }

    if (has(cart, 'coupon_code')) {
      clonedCart.coupon_code = cart.coupon_code
    }

    const authToken = state.customer ? state.customer_access_token : null

    saveCartPromise = saveOrValidateCart(clonedCart, authToken, getters.isAgentMode)
      .then(response => {
        response.items = response.items.filter(i => i.error !== API_ERRORS.NOT_FOUND)
        if (process.browser && window.$nuxt) {
          window.$nuxt.$root.$emit(EVENT_SAVE_CART_RESPONSE_IN_CART, response)
        }
        commit(UPDATE_CART, response)
        dispatch(HANDLE_APPLIED_COUPON, response)
        return response
      })
    return saveCartPromise
  },

  [VALIDATE_COUPON] ({ state, commit, dispatch }, couponCode) {
    let cart = cloneDeep(state.cart)
    cart.coupon_code = couponCode
    commit(SET_PAGE_NOTIFICATION, null)
    return dispatch(SAVE_CART, cart)
  },

  [RAISE_ERROR_IF_LINEITEMS_NOT_AGENT_DELIVERABLE] ({ state, commit }, flag) {
    let lineItemsInfo = cloneDeep(state.cart.cart_items_display_info)
    forEach(lineItemsInfo, function (item) {
      if (!item.is_deliverable_to_agent && flag) {
        item.error = 'NOT_DELIVERABLE_TO_AGENT'
      } else {
        item.error = ''
      }
    })
    commit(LOAD_CART_ITEM_INFO, lineItemsInfo)
    commit(UPDATE_CART_ERROR_STATE)
  },

  [RAISE_ERROR_IF_LINEITEMS_NOT_LOCKER_DELIVERABLE] ({ state, commit }, flag) {
    let lineItemsInfo = cloneDeep(state.cart.cart_items_display_info)
    forEach(lineItemsInfo, function (item) {
      if (!item.is_deliverable_to_locker && flag) {
        item.error = 'NOT_DELIVERABLE_TO_LOCKER'
      } else {
        item.error = ''
      }
    })
    commit(LOAD_CART_ITEM_INFO, lineItemsInfo)
    commit(UPDATE_CART_ERROR_STATE)
  },

  [CLEAR_CART] ({commit, dispatch}) {
    commit(REMOVE_DATA_FROM_CART)
    commit(UPDATE_CART_ERROR_STATE)
    return Promise.resolve({response: 'cart cleared'})
  },

  [LOAD_CUSTOMER_BY_CUSTOMER_TOKEN] ({ commit }, accessToken) {
    return getUserByAuthToken(accessToken)
      .then((customer) => {
        commit(SET_CUSTOMER_LOGIN_INFO, {
          access_token: accessToken,
          customer: customer
        })
        return customer
      })
      .catch((error) => {
        // TODO: find a better way to preserve customer's data
        // rather than bluntly deleting it
        commit(SET_CUSTOMER_LOGIN_INFO, null)
        return error
      })
  },

  [LOAD_AGENT_BY_AGENT_TOKEN] ({ commit }, accessToken) {
    return getAgentByAuthToken(accessToken)
      .then((agent) => {
        if (agent && !!agent.is_active) {
          commit(SET_AGENT_LOGIN_INFO, {
            access_token: accessToken,
            agent: agent
          })
          return agent
        }
        return Promise.reject()
      })
      .catch((error) => {
        // TODO: find a better way to preserve agent's data
        // rather than bluntly deleting it
        commit(SET_AGENT_LOGIN_INFO, null)
        return error
      })
  },

  [REQUEST_NEW_OTP] ({state, getters}, { authToken, phoneNumber, facebookId }) {
    return createOtp(authToken, phoneNumber, facebookId)
  },

  [DELETE_CUSTOMER_MOBILE] ({state, commit}, id) {
    return deleteCustomerMobile(state.customer_access_token, id)
      .then((response) => {
        commit(REMOVE_CUSTOMER_MOBILE, response)
        return response
      })
  },

  [REMOVE_CUSTOMER_ADDRESS] ({state, commit}, id) {
    return deleteCustomerAddress(state.customer_access_token, id)
      .then((response) => {
        commit(REMOVE_CUSTOMER_ADDRESS, response.id)
        return Promise.resolve(response)
      })
      .catch(error => {
        logger.error(REMOVE_CUSTOMER_ADDRESS, error)
        return Promise.reject(error)
      })
  },

  [TRY_AUTOMATIC_LOGIN_WITH_FACEBOOK] ({commit}, sdk) {
    return checkFbStatusAndSigninOrUp(sdk)
      .then((customerInfo) => {
        commit(SET_CUSTOMER_LOGIN_INFO, customerInfo)
        return customerInfo
      })
      .catch(e => {})
  },

  [CONNECT_FACEBOOK] ({state, getters, dispatch, commit}, sdk) {
    if (getters.isPlatformCordova && !state.customer) {
      commit(SET_LAST_FB_LOGIN_TIMESTAMP, true)
    }

    return connectLoginOrRegisterWithFacebook(sdk, state.customer_access_token)
      .then((customerInfo) => {
        let customer = customerInfo
        if (customerInfo && customerInfo.customer) {
          customer = customerInfo.customer
          customer.is_connected = true
          commit(SET_CUSTOMER_LOGIN_INFO, customerInfo)
          if (getters.isCustomerMode) {
            dispatch(LOAD_CART_ITEMS)
          }
          window.$nuxt.$emit(LOGIN_BY_FACEBOOK_SUCCESSFUL)
        } else if (customerInfo.primary_mobile_number && customerInfo.addresses) {
          commit(SET_CUSTOMER, customerInfo)
        }
        return customer
      })
      .catch((response) => {
        return Promise.reject(response)
      })
      .finally(() => {
        if (state.selectedPreferredAddress && getters.isCustomerMode) {
          return dispatch(SAVE_CUSTOMER_INFO, { preferred_delivery_address_id: state.selectedPreferredAddress.id })
        }
      })
  },

  [DISCONNECT_FACEBOOK] ({state, commit}) {
    return facebookDisconnect(state.customer_access_token)
    .then((response) => {
      commit(SET_CUSTOMER, response)
    })
  },

  [VERIFY_AGENT_WITH_PASSWORD] ({state, commit, dispatch}, password) {
    return dispatch(LOGIN_WITH_PASSWORD, {
      mobileNumber: state.agent.mobile,
      password: password
    })
    .then((response) => {
      if (!state.ui.overlayContext) {
        let profileAccessInfo = {
          access_token: response.access_token,
          access_timestamp: Date.now()
        }
        commit(SET_PROFILE_ACCESS_INFO, profileAccessInfo)
      }
      return response
    })
    .catch((error) => {
      return Promise.reject(error)
    })
  },

  [LOGIN_WITH_PASSWORD] ({ commit }, {mobileNumber, password}) {
    return loginWithPassword(mobileNumber, password)
      .then((loginResponse) => {
        if (loginResponse && loginResponse.agent && !!loginResponse.agent.is_active) {
          commit(SET_AGENT_LOGIN_INFO, loginResponse)
          return loginResponse
        }
        return Promise.reject()
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },

  [CHANGE_PASSWORD] ({state}, data) {
    if (state.agent_access_token) {
      return changePassword(state.agent_access_token, data)
    } else {
      return Promise.reject({error: 'AGENT_NOT_LOGGED_IN'})
    }
  },

  [LOGIN_WITH_OTP] ({state, getters, dispatch, commit}, {mobileNumber, otp, agentToken, accessToken, userId}) {
    return loginWithOTP(mobileNumber, otp, agentToken, accessToken, userId)
      .then((loginResponse) => {
        const customer = loginResponse.customer
        commit(SET_CUSTOMER_LOGIN_INFO, loginResponse)
        if (getters.isCustomerMode) {
          dispatch(LOAD_CART_ITEMS)
            .then(() => {
              return customer
            })
        } else {
          return customer
        }
      })
      .catch((error) => {
        return Promise.reject(error)
      })
      .finally(() => {
        if (state.selectedPreferredAddress && getters.isCustomerMode) {
          return dispatch(SAVE_CUSTOMER_INFO, { preferred_delivery_address_id: state.selectedPreferredAddress.id })
        }
      })
  },

  [REGISTER_WITH_OTP] ({state, getters, commit, dispatch}, {name, mobileNumber, otp, agentToken, userId, accessToken}) {
    return registerWithOTP(name, mobileNumber, otp, agentToken, userId, accessToken)
      .then((customerInfo) => {
        commit(SET_CUSTOMER_LOGIN_INFO, customerInfo)
        return customerInfo
      })
      .catch((response) => {
        commit(SET_CUSTOMER_LOGIN_INFO, null)
        return Promise.reject(response)
      })
      .finally(() => {
        if (state.selectedPreferredAddress && getters.isCustomerMode) {
          return dispatch(SAVE_CUSTOMER_INFO, { preferred_delivery_address_id: state.selectedPreferredAddress.id })
        }
      })
  },

  [SAVE_CUSTOMER_INFO] ({state, commit}, attributes) {
    if (!state.customer) {
      return Promise.reject({
        code: 401,
        error: 'NOT_LOGGED_IN'
      })
    }
    return updateCustomer(state.customer_access_token, attributes)
      .then((updatedUser) => {
        commit(SET_CUSTOMER, updatedUser)
        return updatedUser
      })
  },
  [LOGOUT_CUSTOMER] ({state, commit, dispatch}) {
    commit(SET_CUSTOMER_LOGIN_INFO, null)
    dispatch(HANDLE_APPLIED_COUPON, null)
    commit(SET_SELECTED_PREFERRED_ADDRESS, null)
    return Promise.resolve()
  },

  [LOGOUT_AGENT] ({commit, dispatch}) {
    commit(SET_CUSTOMER_LOGIN_INFO, null)
    commit(SET_AGENT_LOGIN_INFO, null)
    commit(SET_SELECTED_PREFERRED_ADDRESS, null)
    dispatch(CLEAR_CART)
    return dispatch(LOAD_CATEGORIES)
  },

  [SAVE_CUSTOMER_MOBILE] ({state, commit}, attributes) {
    let accessToken = state.customer_access_token
    if (!state.customer && !accessToken) {
      return Promise.reject({
        code: 401,
        error: 'NOT_LOGGED_IN'
      })
    }
    return saveNewCustomerMobile(accessToken, attributes)
    .then((response) => {
      if (response) {
        commit(ADD_NEW_CUSTOMER_MOBILE, response)
      }
      return response
    })
  },

  [DELETE_CUSTOMER_MOBILE] ({state, commit}, id) {
    return deleteCustomerMobile(state.customer_access_token, id)
      .then((response) => {
        commit(REMOVE_CUSTOMER_MOBILE, response)
        return response
      })
  },

  [UPDATE_ADDRESS] ({state, commit}, attributes) {
    let accessToken = state.customer_access_token
    if (!state.customer && !accessToken) {
      return Promise.reject({
        code: 401,
        error: 'NOT_LOGGED_IN'
      })
    }
    return saveCustomerAddress(accessToken, attributes.address)
    .then((response) => {
      if (response) {
        if (attributes.address.id) {
          commit(UPDATE_ADDRESS, response)
        } else {
          commit(ADD_NEW_ADDRESS, response)
        }
      }
      return response
    })
  },

  [LOAD_AGENT_COMMISSION] ({getters}) {
    if (getters.agentToken) {
      return getAgentCommission(getters.agentToken)
        .then(commission => {
          return Promise.resolve(commission)
        })
    } else {
      return Promise.reject({
        error: 'Agent not Logged in'
      })
    }
  },

  [ADD_PRODUCT_TO_EMI_CART] ({commit, dispatch}, productWithEMI) {
    if (productWithEMI.emi_tenures) {
      commit(RESET_CART_ITEMS_FOR_EMI, productWithEMI)
      return dispatch(ADD_PRODUCT_TO_CART, productWithEMI)
    }
  },

  [RESTORE_CART_ITEMS_FROM_BACKUP] ({state, commit, dispatch}) {
    commit(SET_CART_ITEMS_FROM_BACKUP)
    return dispatch(SAVE_CART, state.cart)
  }
}

export default actions

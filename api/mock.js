import axios from '~/plugins/axios'
import location from '~/api/mock/location.json'
import { categories } from '~/api/mock/categories'
import { mockSaveCart, mockValidateCart } from './mock/cart'
import { getCategoryProducts } from '~/api/mock/products/getCategoryProducts'

import {
  API_END_POINTS as API,
  FB_LOGIN_ERROR,
  WINDOW_EVENT_NAVIGATION_CANCELLED
} from '~/store/constants.yaml'

import isString from 'lodash/isString'
import extend from 'lodash/extend'
import omit from 'lodash/omit'
import get from 'lodash/get'
// import some from 'lodash/some'
// import map from 'lodash/map'
import trim from 'lodash/trim'

import logger from '~/utils/logger'

import {
  getUrlFromTemplate
} from '~/utils'

function cancellableRequest (requestConfig) {
  if (requestConfig.cancellable === false || !process.browser) {
    return axios.request(requestConfig)
  }

  var cancel
  requestConfig.cancelToken = new axios.CancelToken((c) => {
    // An executor function receives a cancel function as a parameter
    cancel = c.bind(promise)
  })

  var promise = axios.request(requestConfig)

  promise.cancel = cancel

  window.addEventListener(WINDOW_EVENT_NAVIGATION_CANCELLED, function () {
    cancel('Request cancelled due to navigation change')
  })

  promise['finally'](() => {
    promise.cancel = null
  })

  return chainCancellable(promise)
}

function chainCancellable (promise) {
  if (!promise.cancel || typeof promise.cancel !== 'function') {
    return promise
  }

  function wrapMethod (method) {
    var originalMethod = promise[method]

    promise[method] = function () {
      var args = [].slice.call(arguments, 0)
      var newPromise = originalMethod.apply(promise, args)
      newPromise.cancel = promise.cancel
      return chainCancellable(newPromise)
    }
  }

  const wrappedMethods = ['then', 'catch', 'finally', 'success', 'error']

  for (var i = 0; i < wrappedMethods.length; i++) {
    var methodName = wrappedMethods[i]
    if (promise[methodName] && typeof promise[methodName] !== 'function') {
      wrapMethod(methodName)
    }
  }
  return promise
}

let cacheInvalidatingTimestamp = Date.now()

function callApi (requestConfig) {
  if (process.env.API_ROOT) {
    if (isString(requestConfig)) {
      requestConfig = {
        url: requestConfig
      }
    }
    requestConfig.method = requestConfig.method || (requestConfig.data ? 'post' : 'get')

    if (requestConfig.method === 'get' && (!process.env.DISABLE_API_CACHE || process.env.DISABLE_API_CACHE !== 'true')) {
      logger.info('cacheInvalidatingTimestamp', cacheInvalidatingTimestamp)
      requestConfig.params = extend({
        'ts': cacheInvalidatingTimestamp
      }, requestConfig.params)
    }

    requestConfig.headers = { 'x-dg-platform': 'web/*' }

    if (requestConfig.access_token) {
      requestConfig.headers['Authorization'] = `Bearer ${requestConfig.access_token}`
      delete requestConfig.access_token
    }

    if (requestConfig.localization) {
      requestConfig.headers['X-DG-Localization'] = requestConfig.localization
      delete requestConfig.localization
    }

    logger.info('callApi', omit(requestConfig, ['headers']))
    return cancellableRequest(requestConfig)
      .then((result) => {
        return get(result, 'data', null)
      }).catch((error) => {
        if (axios.isCancel(error)) {
          logger.debug(error.message)
          return Promise.resolve([])
        }
        logger.error('api error', {
          request: omit(requestConfig, ['headers']),
          response: get(error, 'response', error)
        })
        return Promise.reject(get(error, 'response.data', null) || get(error, 'response', null) || error)
      })
  }
  throw new Error('process.env.API_ROOT must be defined')
}
export function callMockApi (requestConfig) {
  switch (requestConfig.name) {
    case 'getLocationsWithArea':
      return getLocationsWithArea()
    case 'getCategories':
      return getCategories()
    case 'getBrands':
      // return getBrands()
      return callApi(requestConfig)
    case 'getBrandDetailsBySlug':
      // return getBrandDetailsBySlug()
      return callApi(requestConfig)
    case 'getProductBySlug':
      // return getProductBySlug()
      return callApi(requestConfig)
    case 'getCategoryProducts':
      return getCategoryProducts()
      // return callApi(requestConfig)
    case 'getSpecialCategoryProducts':
      console.log('am i getting called?')
      console.log('getCategoryProducts', getCategoryProducts())
      return getCategoryProducts()
      // return callApi(requestConfig)
    case 'createOtp':
      // return createOtp()
      return callApi(requestConfig)
    case 'changePassword':
      // return changePassword()
      return callApi(requestConfig)
    case 'getAgentByAuthToken':
      // return getAgentByAuthToken()
      return callApi(requestConfig)
    case 'getUserByAuthToken':
      // return getUserByAuthToken()
      return callApi(requestConfig)
    case 'loginWithOTP':
      // return loginWithOTP()
      return callApi(requestConfig)
    case 'loginWithPassword':
      // return loginWithPassword()
      return callApi(requestConfig)
    case 'facebookConnect':
      // return facebookConnect()
      return callApi(requestConfig)
    case 'facebookDisconnect':
      // return facebookDisconnect()
      return callApi(requestConfig)
    case 'registerWithOTP':
      // return registerWithOTP()
      return callApi(requestConfig)
    case 'saveCustomerAddress':
      // return saveCustomerAddress()
      return callApi(requestConfig)
    case 'deleteCustomerAddress':
      // return deleteCustomerAddress()
      return callApi(requestConfig)
    case 'deleteCustomerMobile':
      // return deleteCustomerMobile()
      return callApi(requestConfig)
    case 'saveNewCustomerMobile':
      // return saveNewCustomerMobile()
      return callApi(requestConfig)
    case 'updateCustomer':
      // return updateCustomer()
      return callApi(requestConfig)
    case 'saveOrValidateCart':
      return saveOrValidateCart(requestConfig)
    case 'getPickupPoints':
      // return getPickupPoints()
      return callApi(requestConfig)
    case 'getOrderSummaries':
      // return getOrderSummaries()
      return callApi(requestConfig)
    case 'getOrderSummaryById':
      // return getOrderSummaryById()
      return callApi(requestConfig)
    case 'createOrder':
      // return createOrder()
      return callApi(requestConfig)
    case 'confirmPaymentMethod':
      // return confirmPaymentMethod()
      return callApi(requestConfig)
    case 'createPortWalletInvoice':
      // return createPortWalletInvoice()
      return callApi(requestConfig)
    case 'verifyBkashPaymentWithRef':
      // return verifyBkashPaymentWithRef()
      return callApi(requestConfig)
    case 'verifyBkashPaymentWithTrxId':
      // return verifyBkashPaymentWithTrxId()
      return callApi(requestConfig)
    case 'productRequest':
      // return productRequest()
      return callApi(requestConfig)
    case 'getSearchItems':
      // return getSearchItems()
      return callApi(requestConfig)
    case 'getAgentCommission':
      // return getAgentCommission()
      return callApi(requestConfig)
    case 'getSupportRequests':
      // return getSupportRequests()
      return callApi(requestConfig)
    case 'getRequestDetailsById':
      // return getRequestDetailsById()
      return callApi(requestConfig)
    case 'updateSupportRequestById':
      // return updateSupportRequestById()
      return callApi(requestConfig)
    case 'reSendOtp':
      // return reSendOtp()
      return callApi(requestConfig)
    case 'verifyOrderForPickupWithOTP':
      // return verifyOrderForPickupWithOTP()
      return callApi(requestConfig)
    case 'collectDonation':
      // return collectDonation()
      return callApi(requestConfig)
    case 'getServiceReview':
      // return getServiceReview()
      return callApi(requestConfig)
    case 'updateServiceReview':
      // return updateServiceReview()
      return callApi(requestConfig)
    case 'getBlocks':
      // return getBlocks()
      return callApi(requestConfig)
  }
}

export function invalidateApiCache () {
  cacheInvalidatingTimestamp = Date.now()
}

export function getLocationsWithArea () {
  return Promise.resolve(location)
}

export function getCategories (authToken) {
  return Promise.resolve(categories)
  .then(response => {
    return injectCollapsed(response)
  })
}

export function getBrands (params) {
  let requestConfig = {
    url: API.BRAND,
    params
  }
  return callApi(requestConfig)
}

export function getBrandDetailsBySlug (slug) {
  let requestConfig = {
    url: getUrlFromTemplate(API.BRAND_DETAILS, { slug })
  }
  return callApi(requestConfig)
}

function injectCollapsed (catTree) {
  if (Array.isArray(catTree)) {
    for (let i = 0; i < catTree.length; i++) {
      catTree[i].collapsed = true
      injectCollapsed(catTree[i])
    }
  } else if (Array.isArray(catTree.children) && catTree.children.length) {
    catTree.children = injectCollapsed(catTree.children)
  } else {
    catTree.collapsed = true
  }
  return catTree
}

export function getProductBySlug (slug, authToken) {
  let requestConfig = {
    url: getUrlFromTemplate(API.PRODUCT_BY_SLUG, {slug})
  }
  authToken ? requestConfig.access_token = authToken : null
  return callApi(requestConfig)
}

// export function getCategoryProducts (currentCategory, specialCategories, subCategories, authToken) {
//   const requestConfig = {
//     url: getUrlFromTemplate(API.PRODUCTS_BY_CATEGORY, {categoryId: (currentCategory ? currentCategory.id : null)}),
//     params: {
//       special_categories: map(specialCategories, 'id'),
//       sub_categories: map(subCategories, 'id')
//     }
//   }
//   authToken ? requestConfig.access_token = authToken : null

//   return callApi(requestConfig)
// }

export function getSpecialCategoryProducts (specialCategory, currentCategory, authToken, from, take, brandId) {
  const requestConfig = {
    url: getUrlFromTemplate(API.PRODUCTS_BY_CATEGORY, {categoryId: specialCategory.id}),
    params: {
      context_id: (currentCategory ? currentCategory.id : null),
      from,
      take,
      brand_id: brandId
    }
  }
  authToken ? requestConfig.access_token = authToken : null

  return callApi(requestConfig)
}

export function createOtp (authToken, mobileNumber, facebookId) {
  return callApi({
    access_token: authToken,
    url: API.CUSTOMER_OTP,
    method: 'post',
    data: {
      number: mobileNumber,
      facebook_id: facebookId
    }
  })
}

export function changePassword (authToken, data) {
  return callApi({
    access_token: authToken,
    url: API.CHANGE_PASSWORD,
    method: 'post',
    data: data
  })
}

export function getAgentByAuthToken (authToken) {
  return callApi({
    access_token: authToken,
    url: API.AGENT
  })
}

export function getUserByAuthToken (authToken) {
  return callApi({
    access_token: authToken,
    url: API.USER
  })
}

export function loginWithOTP (number, otp, agentToken, accessToken, userId) {
  return callApi({
    access_token: agentToken,
    url: API.CUSTOMER_LOGIN,
    method: 'post',
    data: {
      number,
      otp,
      facebook_access_token: accessToken,
      facebook_id: userId

    }
  })
}

export function loginWithPassword (mobile, password) {
  return callApi({
    url: API.AGENT_LOGIN,
    method: 'post',
    data: {
      mobile,
      password
    }
  })
}

function facebookConnect (data, authToken, resolve, reject) {
  const req = {
    access_token: authToken,
    url: API.FACEBOOK_CONNECT,
    method: 'post',
    data: data
  }
  return callApi(req)
    .then((userInfo) => {
      if (resolve) {
        return resolve(userInfo)
      }
      return userInfo
    })
    .catch((reason) => {
      if (reject) {
        return reject(reason)
      }
      return Promise.reject(reason)
    })
}

export function checkFbStatusAndSigninOrUp (sdk, authToken) {
  return new Promise((resolve, reject) => {
    sdk.getLoginStatus((loginStatusResponse) => {
      if (loginStatusResponse.status === 'connected') {
        facebookConnect(loginStatusResponse.authResponse, null, resolve, reject)
      }
    }, true)
  }).catch((reason) => {
    if (reason.error === FB_LOGIN_ERROR || authToken) {
      return Promise.reject(reason)
    }

    // fb login was successful but connect api resulted error
    // so, we should try registering user
    return new Promise((resolve, reject) => {
      sdk.api('/me', (fbUserInfo) => {
        if (fbUserInfo && !fbUserInfo.error) {
          const data = extend({}, reason.query, {name: fbUserInfo.name})
          facebookConnect(data, null, resolve, reject)
        } else {
          reject(reason)
        }
      })
    })
  })
}

export function connectLoginOrRegisterWithFacebook (sdk, authToken) {
  return new Promise((resolve, reject) => {
    sdk.getLoginStatus((loginStatusResponse) => {
      if (loginStatusResponse.status === 'connected') {
        facebookConnect(loginStatusResponse.authResponse, authToken, resolve, reject)
      } else {
        sdk.login((loginResponse) => {
          if (loginResponse.status === 'connected') {
            facebookConnect(loginResponse.authResponse, authToken, resolve, reject)
          } else {
            reject({
              error: FB_LOGIN_ERROR,
              details: loginResponse
            })
          }
        })
      }
    }, true)
  }).catch((reason) => {
    if (reason.error === FB_LOGIN_ERROR || authToken) {
      return Promise.reject(reason)
    }

    // fb login was successful but connect api resulted error
    // so, we should try registering user
    return new Promise((resolve, reject) => {
      sdk.api('/me', (fbUserInfo) => {
        if (fbUserInfo && !fbUserInfo.error) {
          const data = extend({}, reason.query, {name: fbUserInfo.name, is_connected: false})
          // facebookConnect(data, null, resolve, reject)
          resolve(data)
        } else {
          reject(reason)
        }
      })
    })
  })
}

export function facebookDisconnect (authToken) {
  return callApi({
    access_token: authToken,
    url: API.FACEBOOK_DISCONNECT,
    method: 'post'
  })
}

export function registerWithOTP (name, number, otp, agentToken, userId, accessToken) {
  return callApi({
    access_token: agentToken,
    url: API.CUSTOMER_REGISTER,
    method: 'post',
    data: {
      name,
      number,
      otp,
      facebook_access_token: accessToken,
      facebook_id: userId
    }
  })
}

//  --------- newly created API Functions ----------------//

export function saveCustomerAddress (authToken, data) {
  const url = data.id ? `${API.ADDRESS}/${data.id}` : API.ADDRESS
  const method = data.id ? 'put' : 'post'
  return callApi({
    access_token: authToken,
    url,
    method,
    data
  })
}

export function deleteCustomerAddress (authToken, id) {
  return callApi({
    access_token: authToken,
    url: `${API.ADDRESS}/${id}`,
    method: 'delete'
  })
}

export function deleteCustomerMobile (authToken, id) {
  return callApi({
    access_token: authToken,
    url: `${API.MOBILE}/${id}`,
    method: 'delete'
  })
}

export function saveNewCustomerMobile (authToken, data) {
  return callApi({
    access_token: authToken,
    url: API.MOBILE,
    method: 'post',
    data
  })
}

export function updateCustomer (authToken, attributes) {
  return callApi({
    access_token: authToken,
    url: API.USER,
    method: 'put',
    data: attributes
  })
}

function validateCartItemsOfLocalStorage (authToken, cart) {
  const response = mockValidateCart(cart)
  return Promise.resolve(response)
}

function saveCart (authToken, cart) {
  const response = mockSaveCart(cart)
  return Promise.resolve(response)
}

export function saveOrValidateCart (requestConfig) {
  if (!requestConfig.data.is_emi && requestConfig.access_token) {
    return saveCart(requestConfig.access_token, requestConfig.data)
  }
  return validateCartItemsOfLocalStorage(requestConfig.access_token, requestConfig.data)
}

export function getPickupPoints (params) {
  return callApi({
    url: API.PICKUP_POINT,
    params
  })
}

export function getOrderSummaries (authToken, params) {
  return callApi({
    access_token: authToken,
    url: API.ORDER,
    params
  })
}

export function getOrderSummaryById (authToken, orderId) {
  return callApi({
    access_token: authToken,
    url: `${API.ORDER}/${orderId}`
  })
}

export function createOrder (authToken, orderAttributes) {
  const requestConfig = {
    access_token: authToken,
    url: API.ORDER,
    method: 'post',
    data: orderAttributes
  }
  return callApi(requestConfig).catch((error) => {
    invalidateApiCache()
    return Promise.reject(error)
  })
}

export function confirmPaymentMethod (authToken, id, prefferedPaymentChannel) {
  const requestConfig = {
    access_token: authToken,
    url: getUrlFromTemplate(API.CONFIRM_PAYMENT_CHANNEL, {id}),
    method: 'post',
    data: {
      preferred_payment_channel: prefferedPaymentChannel
    }
  }
  return callApi(requestConfig)
}

export function cancelOrder (attr) {
  /* TODO: when the cancel order api will be deployed  */
  return new Promise(function (resolve, reject) {
    resolve({
      success: true
    })
  })
}

export function createPortWalletInvoice (authToken, orderId, data) {
  const requestConfig = {
    access_token: authToken,
    url: getUrlFromTemplate(API.CREATE_PORT_WALLET_INVOICE, {orderId}),
    method: 'post',
    data
  }
  return callApi(requestConfig)
}

export function verifyBkashPaymentWithRef (authToken, orderId, refNo, amount) {
  const requestConfig = {
    access_token: authToken,
    url: getUrlFromTemplate(API.VERIFY_BKASH_PAYMENT, {orderId}),
    method: 'post',
    data: {
      amount,
      ref_no: refNo
    }
  }
  return callApi(requestConfig)
}

export function verifyBkashPaymentWithTrxId (authToken, orderId, trxId, refNo, amount) {
  const requestConfig = {
    access_token: authToken,
    url: getUrlFromTemplate(API.VERIFY_BKASH_PAYMENT, {orderId}),
    method: 'post',
    data: {
      amount,
      trx_id: trxId,
      ref_no: refNo
    }
  }
  return callApi(requestConfig)
}

// Request Product

export function productRequest (authToken, productId) {
  const requestConfig = {
    access_token: authToken,
    url: getUrlFromTemplate(API.PRODUCT_REQUEST, {id: productId}),
    method: 'post'
  }
  return callApi(requestConfig)
}

// Search

export function getSearchItems (query, params, authToken) {
  if (!query || trim(query) === '') {
    return Promise.resolve([])
  }
  const requestConfig = {
    url: getUrlFromTemplate(API.PRODUCTS_BY_QUERY, { query })
  }
  params && params.limit === 0 && params.offset === 0 ? requestConfig.params = params : null
  authToken ? requestConfig.access_token = authToken : null

  return callApi(requestConfig)
}

export function getAgentCommission (authToken) {
  const requestConfig = {
    url: API.AGENT_COMMISSION,
    access_token: authToken
  }
  return callApi(requestConfig)
}

// support requests

export function getSupportRequests (authToken) {
  const requestConfig = {
    url: API.SUPPORT_TICKETS,
    access_token: authToken
  }
  return callApi(requestConfig)
}

export function getRequestDetailsById (authToken, id, localization) {
  const requestConfig = {
    url: getUrlFromTemplate(API.TICKET_BY_ID, { id }),
    access_token: authToken,
    localization: localization
  }
  return callApi(requestConfig)
  .then(response => {
    if (response instanceof Object) {
      response.pickup_address.area = response.pickup_address.area.name
      response.delivery_address.area = response.delivery_address.area.name
    }
    return response
  })
}

export function updateSupportRequestById (authToken, id, receive) {
  const requestConfig = {
    method: 'post',
    access_token: authToken,
    url: getUrlFromTemplate(API.TICKET_BY_ID, { id }),
    data: {
      receive
    }
  }
  return callApi(requestConfig)
}

export function reSendOtp (orderId, authToken) {
  return callApi({
    access_token: authToken,
    url: API.RESEND_OTP,
    method: 'post',
    data: {
      order_id: orderId
    }
  })
}

export function verifyOrderForPickupWithOTP (authToken, orderId, otp) {
  return callApi({
    access_token: authToken,
    url: API.VERIFY_ORDER,
    method: 'post',
    data: {
      order_id: orderId,
      otp
    }
  })
}

export function collectDonation (authToken, orderId, donationStatus) {
  return callApi({
    access_token: authToken,
    url: getUrlFromTemplate(API.CONFIRM_DONATION, {orderId}),
    method: 'post',
    data: {
      collect_donation: donationStatus
    }
  })
}

export function getServiceReview (authToken) {
  return callApi({
    access_token: authToken,
    url: API.SERVICE_REVIEW,
    method: 'get'
  })
}

export function updateServiceReview (authToken, reviewId, params) {
  return callApi({
    access_token: authToken,
    url: getUrlFromTemplate(API.SERVICE_REVIEW_BY_ID, {reviewId}),
    method: 'put',
    data: params
  })
}

export function getBlocks (contextType, contextValue, section) {
  let requestConfig = {
    url: `${API.BLOCKS}/${contextType}/${contextValue}/${section}`
  }

  return callApi(requestConfig)
}

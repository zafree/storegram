import Cookies from 'js-cookie'
import each from 'lodash/each'
import get from 'lodash/get'
import isFinite from 'lodash/isFinite'
import cloneDeep from 'lodash/cloneDeep'
import extend from 'lodash/extend'
import omit from 'lodash/omit'
import findIndex from 'lodash/findIndex'

import {
  SET_OVERLAY_CONTEXT,
  OPEN_OVERLAY,
  CLOSE_OVERLAY,
  OVERLAY_ASIDE_1,
  OVERLAY_ASIDE_2,
  OVERLAY_ASIDE_3,
  OVERLAY_PREFERRED_DELIVERY_POINT_MODAL,
  OVERLAY_LOGIN_MODAL,
  OVERLAY_BKASH_DIAGRAM_MODAL,
  OVERLAY_BKASH_VERIFICATION_MODAL,
  OVERLAY_REQUEST_MODAL,
  OVERLAY_CANCEL_ORDER_MODAL,
  OVERLAY_AGENT_PASSWORD_MODAL,
  OVERLAY_SERVICE_REVIEW,
  OVERLAY_EMI_VIEW_PLANS,
  OVERLAY_DONATION_MODAL,
  SET_ATTEMPTED_PATH,
  EVENT_OVERLAY_OPENING,
  EVENT_OVERLAY_OPENED,
  EVENT_OVERLAY_CLOSING,
  EVENT_OVERLAY_CLOSED,
  SET_CART_PREOPEN_FLAG,
  CSS_COLOR_CLASS,
  UPDATE_AGENT_PROFILE_ACCESS_TIMESTAMP,
  SET_PROFILE_ACCESS_INFO,
  AGENT_PROFILE_ACCESS_TIMEOUT
} from '~/store/constants.yaml'

import { mapGetters, mapState } from 'vuex'
import { CouponDiscountType } from '~/utils/enums.yaml'

import stringHash from 'string-hash'

const reApiUrlParam = /\/(:(\w+)(\??))/g

export function getCookieValue (cookieName, isServer, req) {
  let value = null
  if (!isServer) {
    value = Cookies.get(cookieName)
  } else {
    let cookie = valueOrDefault(req, 'headers.cookie')
    if (cookie) {
      cookie = cookie.split(';').find(c => c.trim().startsWith(cookieName + '='))
      if (cookie) {
        value = cookie.split('=')[1]
      }
    }
  }
  return value
}

export function getUrlFromTemplate (urlTemplate, params = {}) {
  let result = urlTemplate
  let match = reApiUrlParam.exec(result)
  while (match) {
    const paramName = match[2]
    const paramValue = params[paramName] || ''
    const isOptional = (match[3] === '?')
    const paramPlaceholder = isOptional && paramValue === '' ? match[0] : match[1]

    if (!isOptional && paramValue === '') {
      throw new Error(`required parameter [${paramName}] missing for url template [${urlTemplate}]`)
    }
    result = result.replace(paramPlaceholder, paramValue)
    match = reApiUrlParam.exec(result)
  }
  return result
}

export function TypeOf (obj) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
}

export function makeDefaultImageMeta (url, width = 800) {
  return {
    url,
    srcset: [url],
    width
  }
}

export function i18nMixin (i18nKeys) {
  return {
    computed: {
      i18nText: function () {
        if (typeof i18nKeys === 'string') {
          return this.$store.state.i18nText[i18nKeys]
        }
        let messages = {}
        each(i18nKeys, (i18nKey, computedKey) => {
          messages[computedKey] = this.$t(i18nKey)
        })
        return messages
      }
    }
  }
}

export function valueOrDefault (data, accessor, defaultValue = null) {
  return get(data, accessor, defaultValue)
  // const value = accessor ? at(data, accessor)[0] : data
  // return isUndefined(value) ? defaultValue : value
}

export const cartCalculationMixin = {
  data () {
    return {
      deliveryCharge: null
    }
  },
  computed: {
    showCouponDescription () {
      if (this.cart.is_emi) {
        return false
      }
      return this.customer && (this.cart.applied_coupon || this.minSubTotalCtx.minSubtotalRequired)
    },
    showCouponDiscount () {
      return this.customer && this.cart.applied_coupon && !this.cart.is_emi
    },
    showCouponField () {
      return this.customer && !this.cart.applied_coupon && !this.cart.is_emi
    },
    subTotal () {
      return this.$store.state.cart.sub_total
    },
    isFreeDelivery () {
      if (this.cart.applied_coupon && this.cart.applied_coupon.discount_type && !this.cart.is_emi) {
        return this.cart.applied_coupon.discount_type === CouponDiscountType.FREE_DELIVERY &&
          this.subTotal >= parseFloat(this.cart.applied_coupon.min_subtotal)
      }
      return false
    },
    appliedCouponCode () {
      return this.cart.applied_coupon ? this.cart.applied_coupon.code : null
    },
    couponDiscount () {
      if (this.cart.applied_coupon && !this.cart.is_emi) {
        let discountAmount = parseFloat(this.cart.applied_coupon.discounted_amount)
        if (discountAmount) {
          return discountAmount
        }
      }
      return 0
    },
    cartTotal () {
      let _deliveryCharge = 0
      let _tempDeliveryCharge = parseFloat(this.deliveryCharge)
      _deliveryCharge = !_tempDeliveryCharge || this.isFreeDelivery ? 0 : _tempDeliveryCharge

      let _couponDiscount = 0
      let _tempCouponDiscount = parseFloat(this.couponDiscount)
      _couponDiscount = !_tempCouponDiscount ? 0 : _tempCouponDiscount

      let total = parseFloat(this.subTotal)
      total += _deliveryCharge
      total -= _couponDiscount
      return Math.floor(total)
    }
  }
}

export const overlayMixin = {
  data () {
    return {
      overlays: {
        aside1: OVERLAY_ASIDE_1,
        aside2: OVERLAY_ASIDE_2,
        aside3: OVERLAY_ASIDE_3,
        preferredDeliveryPointModal: OVERLAY_PREFERRED_DELIVERY_POINT_MODAL,
        loginModal: OVERLAY_LOGIN_MODAL,
        bkashDiagramModal: OVERLAY_BKASH_DIAGRAM_MODAL,
        bkashVerificationModal: OVERLAY_BKASH_VERIFICATION_MODAL,
        requestModal: OVERLAY_REQUEST_MODAL,
        cancelOrderModal: OVERLAY_CANCEL_ORDER_MODAL,
        agentPasswordModal: OVERLAY_AGENT_PASSWORD_MODAL,
        emiViewPlans: OVERLAY_EMI_VIEW_PLANS,
        donationModal: OVERLAY_DONATION_MODAL,
        serviceReviewModal: OVERLAY_SERVICE_REVIEW
      }
    }
  },
  computed: {
    ...mapState([
      'ui'
    ])
  },
  methods: {
    isOverlayOpen (overlayName) {
      return overlayName ? this.ui.activeOverlay === overlayName : this.ui.activeOverlay
    },
    openOverlay (overlayName) {
      this.$root.$emit(EVENT_OVERLAY_OPENING, overlayName)
      this.$store.commit(OPEN_OVERLAY, overlayName)
      this.$root.$emit(EVENT_OVERLAY_OPENED, overlayName)
    },
    closeOverlayIfOpen (overlayName) {
      if (this.isOverlayOpen(overlayName)) {
        this.$root.$emit(EVENT_OVERLAY_CLOSING, overlayName)
        this.$store.commit(SET_OVERLAY_CONTEXT, null)
        this.$store.commit(SET_CART_PREOPEN_FLAG, false)
        this.$store.commit(CLOSE_OVERLAY)
        this.$root.$emit(EVENT_OVERLAY_CLOSED, overlayName)
        return true
      }
      return false
    },
    toggleOverlay (overlayName) {
      if (!this.closeOverlayIfOpen(overlayName)) {
        this.openOverlay(overlayName)
      }
    },
    closeAnyOverlayIfOpen () {
      if (this.ui.activeOverlay !== null) {
        let overlayName = this.ui.activeOverlay
        this.$root.$emit(EVENT_OVERLAY_CLOSING, overlayName)
        this.$store.commit(SET_OVERLAY_CONTEXT, null)
        this.$store.commit(CLOSE_OVERLAY)
        this.$root.$emit(EVENT_OVERLAY_CLOSED, overlayName)
      }
    },
    closeAside1 () {
      this.closeOverlayIfOpen(OVERLAY_ASIDE_1)
    },
    closeAside2 () {
      this.closeOverlayIfOpen(OVERLAY_ASIDE_2)
    },
    closeAside3 () {
      this.closeOverlayIfOpen(OVERLAY_ASIDE_3)
    },
    closePreferredDeliveryPointModal () {
      this.closeOverlayIfOpen(OVERLAY_PREFERRED_DELIVERY_POINT_MODAL)
    },
    closeBkashDigramModal () {
      this.closeOverlayIfOpen(OVERLAY_BKASH_DIAGRAM_MODAL)
    },
    closeBkashVerificationModal () {
      this.closeOverlayIfOpen(OVERLAY_BKASH_VERIFICATION_MODAL)
    },
    closeRequestModal () {
      this.closeOverlayIfOpen(OVERLAY_REQUEST_MODAL)
    },
    closeCancelOrderModal () {
      this.closeOverlayIfOpen(OVERLAY_CANCEL_ORDER_MODAL)
    },
    closeAgentPasswordModal () {
      this.closeOverlayIfOpen(OVERLAY_AGENT_PASSWORD_MODAL)
    },
    closeEmiViewModal () {
      this.closeAnyOverlayIfOpen(OVERLAY_EMI_VIEW_PLANS)
    },
    closeDonationModal () {
      this.closeAnyOverlayIfOpen(OVERLAY_DONATION_MODAL)
    },
    closeServiceReviewModal () {
      this.closeAnyOverlayIfOpen(OVERLAY_SERVICE_REVIEW)
    }
  }
}

export function i18nRedirect ({store, redirect, route}, routePath, saveAttempted = true) {
  if (saveAttempted) {
    store.commit(SET_ATTEMPTED_PATH, route.fullPath)
  }
  return redirect(store.state.locale === 'en' ? routePath : `/${store.state.locale}${routePath}`)
}

export function translateModelAttr (attr, locale) {
  if (!attr || !(typeof (attr) === 'object')) return attr
  if (attr[locale]) return attr[locale]
  return attr['en']
}

export const deliveryMethodsPermissionMixin = {
  computed: {
    isAgentDeliveryEnabledForCustomer () {
      return !this.isAgentMode && process.env.DISABLE_AGENT_DELIVERY_IN_CUSTOMER_MODE !== 'true'
    },
    isLockerDeliveryEnabledForCustomer () {
      return process.env.DISABLE_LOCKER_DELIVERY !== 'true'
    },
    isHubDeliveryEnabledForCustomer () {
      return process.env.DISABLE_HUB_DELIVERY !== 'true'
    }
  }
}

export function translateCurrencyAttr (value, locale) {
  value = parseFloat(value)
  if (!isFinite(value)) return ''
  if (locale === 'bn') {
    return value.toLocaleString('bn')
  }
  return value.toLocaleString('en-IN')
}

export function ensureI18nValueInAttributes (variant) {
  if (!variant.attributes) return variant
  each(variant.attributes, (a) => {
    a.i18n_unit = a.i18n_unit || a.unit
    if (a.i18n_value === null && isFinite(a.value)) {
      a.i18n_value = {}
      each(['en', 'bn'], function (locale) {
        a.i18n_value[locale] = translateCurrencyAttr(a.value, locale)
      })
    } else {
      a.i18n_value = a.i18n_value || a.value
    }
  })
  return variant
}

export function mergeProductVariantWithBase (productInfo, variantInfo) {
  let variant = cloneDeep(extend({}, omit(productInfo, ['attributes']), omit(variantInfo, ['attributes'])))

  variant.attributes = cloneDeep(productInfo.attributes || [])

  if (variantInfo.attributes && variantInfo.attributes.length) {
    each(variantInfo.attributes, (a) => {
      let i = findIndex(variant.attributes, (e) => {
        return e.code === a.code
      })
      if (i !== -1) {
        extend(variant.attributes[i], a)
      } else {
        variant.attributes.push(a)
      }
    })
  }
  return ensureI18nValueInAttributes(variant)
}

export function getRandomColorCssClass (name) {
  const randomKey = name ? stringHash(name) % CSS_COLOR_CLASS.length : 0
  return CSS_COLOR_CLASS[randomKey]
}

export const debug = process.env.NODE_ENV !== 'production'

export const agentVerificationMixin = {
  data () {
    return {
      showAgentPasswordVerification: true
    }
  },
  computed: {
    ...mapState([
      'agentProfileAccessInfo'
    ]),
    ...mapGetters([
      'isValidTokenForAgentVerification'
    ])
  },
  watch: {
    agentProfileAccessInfo: {
      handler: function (newVal, oldVal) {
        if (!this.agentProfileAccessInfo) {
          this.showAgentPasswordVerification = true
        } else if (this.isValidTokenForAgentVerification) {
          let timeDifference = Date.now() - this.agentProfileAccessInfo.access_timestamp
          if (timeDifference < AGENT_PROFILE_ACCESS_TIMEOUT) {
            this.showAgentPasswordVerification = false
            this.$store.commit(UPDATE_AGENT_PROFILE_ACCESS_TIMESTAMP, Date.now())
          } else {
            this.$store.commit(SET_PROFILE_ACCESS_INFO, null)
          }
        } else {
          this.$store.commit(SET_PROFILE_ACCESS_INFO, null)
        }
      },
      immediate: true
    }
  }
}

export function calculateEmi (price, emiTenures) {
  const totalPrice = parseInt(price)
  const longestEMIPeriod = Math.max.apply(null, emiTenures)
  return Math.ceil(totalPrice / longestEMIPeriod)
}

export function partialAsteriskSensoredPhoneNumber (phoneNumber) {
  return phoneNumber.split('')
    .reverse()
    .map((x, i) => {
      if (i === 2 || i === 3 || i === 4 || i === 5) return '*'
      return x
    })
    .reverse()
    .reduce((acc, curr) => acc + curr)
}

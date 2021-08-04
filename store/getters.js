import cloneDeep from 'lodash/cloneDeep'
import filter from 'lodash/filter'
// import uniqBy from 'lodash/uniqBy'
import split from 'lodash/split'

import {valueOrDefault} from '~/utils'
import {
  APP_MODE,
  ADDRESS_TYPES,
  CASHBACK
} from '~/store/constants.yaml'
import { Platform } from '~/utils/enums.yaml'

const getters = {
  vacationPeriod (state) {
    if (process.env.NEXT_VACATION_PERIOD) {
      const dates = process.env.NEXT_VACATION_PERIOD.split(/\s*,\s*/)
      if (!dates[0]) {
        return false
      }
      const start = new Date(dates[0] + 'T00:00:00.000+0600')
      let end = new Date(dates[0] + 'T00:00:00.000+0600')
      if (dates.length > 1) {
        end = new Date(dates[1] + 'T00:00:00.000+0600')
      }

      if (start.getTime() === end.getTime()) {
        end.setTime(end.getTime() + 24 * 60 * 60 * 1000) // add one day
      }

      return {
        start,
        end
      }
    }
    return false
  },
  isVacationMode (state, getters) {
    if (!getters.vacationPeriod) {
      return false
    }

    const now = Date.now()

    return getters.vacationPeriod.start.getTime() < now && getters.vacationPeriod.end.getTime() > now
  },
  isPlatformBrowser (state) {
    return state.platform === Platform.BROWSER
  },
  isPlatformRBP (state) {
    return state.platform === Platform.RBP
  },
  isPlatformCordova (state) {
    return state.platform === Platform.CORDOVA
  },
  authToken (state) {
    if (state.appMode === APP_MODE.CUSTOMER) return state.customer_access_token
    else if (state.appMode === APP_MODE.AGENT) return state.agent_access_token
    else {
      if (state.agent_access_token) return state.agent_access_token
      else if (state.customer_access_token) return state.customer_access_token
      else return null
    }
  },
  customerToken (state) {
    return state.customer_access_token
  },
  agentToken (state) {
    return state.agent_access_token
  },
  isLoggedIn (state, getters) {
    if (getters.isCustomerMode) return !!(state.customer && getters.authToken)
    else if (getters.isAgentMode) return !!(state.agent && getters.authToken)
    else return false
  },
  loggedInAgentAddress (state) {
    if (!state.agent) return
    return state.agent.address
  },
  isCustomerMode (state) {
    return state.appMode === APP_MODE.CUSTOMER
  },
  isAgentMode (state) {
    return state.appMode === APP_MODE.AGENT
  },
  categoryByContainer (state) {
    return (container) => state.allCategories.filter((c) => {
      return c.display_in && c.display_in.indexOf(container) !== -1
    })
  },
  categoryBySlug (state, getters) {
    return (slug) => {
      const findCategoryInGivenLevel = (category) => {
        if (Array.isArray(category)) {
          for (let c of category) {
            let result = findCategoryInGivenLevel(c)
            if (result) return result
          }
        } else if (category.slug === slug) {
          return category
        } else if (Array.isArray(category.children)) {
          return findCategoryInGivenLevel(category.children)
        }
      }
      return findCategoryInGivenLevel(state.allCategories)
    }
  },
  categoryById (state) {
    return (id) => {
      const findCategoryInGivenLevel = (category) => {
        if (Array.isArray(category)) {
          for (let c of category) {
            let result = findCategoryInGivenLevel(c)
            if (result) return result
          }
        } else if (category.id === id) {
          return category
        } else if (Array.isArray(category.children)) {
          return findCategoryInGivenLevel(category.children)
        }
      }
      return findCategoryInGivenLevel(state.allCategories)
    }
  },
  categoryChildren (state, getters) {
    return (container, parent) => getters.categoryByContainer(container).filter(c => c.parent_id === (parent && parent.id ? parent.id : null))
  },
  categoryParent (state, getters) {
    return (category) => category && category.parent_id ? getters.categoryById(category.parent_id) : null
  },
  categoryAncestors (state, getters) {
    return (category) => {
      let ancestors = []
      let parent = getters.categoryParent(category)
      while (parent) {
        ancestors.push(parent)
        parent = getters.categoryParent(parent)
      }
      return ancestors.reverse()
    }
  },
  ensureChildrensAttributes (state, getters) {
    return (children) => {
      return children.filter(c => {
        return c && Array.isArray(c.display_in) && c.display_in.length > 0 && c.hasOwnProperty('id') && c.hasOwnProperty('parent_id')
      })
    }
  },
  specialCategories (state, getters) {
    return (container) => {
      return getters.ensureChildrensAttributes(state.allCategories).filter(c => c.display_in.includes(container))
    }
  },
  featuredCategories (state, getters) {
    if (state.currentCategory && state.currentCategory.featured_categories) {
      return state.currentCategory.featured_categories
    } else {
      return state.allCategories && state.allCategories.length ? state.allCategories[0].featured_categories : []
    }
  },
  cart (state) {
    return state.cart
  },
  cartErrorExists (state) {
    return state.cart.cartError
  },
  cartWarningExists (state, getters) {
    if (getters.preferredDeliveryAddress) {
      let addressTYpe = getters.preferredDeliveryAddress.owner_type
      for (let item of state.cart.cart_items_display_info) {
        if ((addressTYpe === ADDRESS_TYPES.AGENT && !item.is_deliverable_to_agent) || (addressTYpe === ADDRESS_TYPES.LOCKER && !item.is_deliverable_to_locker)) {
          return true
        }
      }
    }
    return false
  },
  cartItemsDisplayInfo (state) {
    return state.cart.cart_items_display_info
  },
  userHasVerifiedNumbers (state) {
    return state.customer && state.customer.mobiles && state.customer.mobiles.length > 0
  },
  user (state) {
    return state.customer
  },
  sortByName () {
    return (list) => {
      let clonedList = cloneDeep(list)
      return clonedList.sort((a, b) => {
        if (a.name.en[0] < b.name.en[0]) { return -1 }
        if (a.name.en[0] > b.name.en[0]) { return 1 }
        return 0
      })
    }
  },
  allActiveDeliveryLocation (state) {
    return filter(state.allLocations, (al) => al.is_active)
  },
  allDeliveryLocationsSorted (state, getters) {
    if (state.allLocations && state.allLocations.length > 0) {
      let allActiveDeliveryLocation = cloneDeep(getters.allActiveDeliveryLocation)
      return getters.sortByName(allActiveDeliveryLocation)
    }
    return []
  },
  customerAddresses (state) {
    return valueOrDefault(state, 'customer.addresses', [])
  },
  customerAddressesByAreaId (state, getters) {
    return function (areaId) {
      return getters.customerAddresses
        .filter(a => a.area_id === areaId)
        .sort((a, b) => {
          if (a.owner_name[0] < b.owner_name[0]) { return -1 }
          if (a.owner_name[0] > b.owner_name[0]) { return 1 }
          return 0
        })
    }
  },
  lastDeliveryAddress (state, getters) {
    const addressId = valueOrDefault(state, 'customer.last_delivery_address_id')
    if (addressId) {
      return getters.customerAddresses.find(a => a.id === addressId)
    }
    return null
  },
  isValidTokenForAgentVerification (state) {
    if (state.agentProfileAccessInfo && state.agentProfileAccessInfo.access_token) {
      let loggedInTokenInfoList = split(state.agent_access_token, '.')
      let verificationTokenInfoList = split(state.agentProfileAccessInfo.access_token, '.')

      if (!(loggedInTokenInfoList.length === 3 && verificationTokenInfoList.length === 3)) return false

      let permanentTokenHeader, temporaryTokenHeader, permanentTokenBody, temporaryTokenBody

      try {
        permanentTokenHeader = JSON.parse(atob(loggedInTokenInfoList[0]))
        temporaryTokenHeader = JSON.parse(atob(verificationTokenInfoList[0]))
        permanentTokenBody = JSON.parse(atob(loggedInTokenInfoList[1]))
        temporaryTokenBody = JSON.parse(atob(verificationTokenInfoList[1]))
      } catch (e) {
        return false
      }

      if (!(permanentTokenHeader && temporaryTokenHeader)) return false
      if (!(
        permanentTokenHeader.typ === temporaryTokenHeader.typ &&
        permanentTokenHeader.alg === temporaryTokenHeader.alg
        )) return false

      if (!(permanentTokenBody && temporaryTokenBody)) return false
      if (
        permanentTokenBody.iss === temporaryTokenBody.iss &&
        permanentTokenBody.sub === temporaryTokenBody.sub
        ) return true
    } else return false
  },
  preferredDeliveryAddress (state, getters) {
    let preferredAddress = null
    if (getters.isCustomerMode) {
      if (state.customer && state.customer.preferred_delivery_address) {
        preferredAddress = cloneDeep(state.customer.preferred_delivery_address)
      } else if (state.selectedPreferredAddress) {
        preferredAddress = cloneDeep(state.selectedPreferredAddress)
      }

      if (preferredAddress) {
        preferredAddress.max_delivery_time = state.cart.cart_items_display_info.map(x => {
          if (preferredAddress.location === 'Dhaka') {
            return x.fix_delivery_time && x.fix_delivery_time.min ? x.fix_delivery_time.min : 0
          } else {
            return x.fix_delivery_time && x.fix_delivery_time.max ? x.fix_delivery_time.max : 0
          }
        })
        .sort((x, y) => x > y)
        preferredAddress.max_delivery_time = preferredAddress.max_delivery_time.length > 0 ? preferredAddress.max_delivery_time[0] : 0
      }

      if (preferredAddress && preferredAddress.owner_type === ADDRESS_TYPES.AGENT) {
        if (process.env.DISABLE_AGENT_DELIVERY_IN_CUSTOMER_MODE === 'true') {
          preferredAddress = null
        }
      }

      if (preferredAddress && preferredAddress.owner_type === ADDRESS_TYPES.LOCKER) {
        if (process.env.DISABLE_LOCKER_DELIVERY === 'true') {
          preferredAddress = null
        }
      }
    } else if (getters.isAgentMode) {
      preferredAddress = getters.loggedInAgentAddress
    }
    return preferredAddress
  },
  showAgentPickUpAdvance () {
    return !process.env.ENABLE_ADVANCE_PAYMENT_AGENT_PICKUP || process.env.ENABLE_ADVANCE_PAYMENT_AGENT_PICKUP === 'true'
  },
  showDonation () {
    return !!process.env.SHOW_DONATION && process.env.SHOW_DONATION === 'true'
  },
  bkashPaymentUrl () {
    return process.env.BKASH_PAYMENT_URL
  },
  bkashCashBack (state, getters) {
    return getters.bkashPaymentUrl && process.env.BKASH_CASHBACK_OFFER === 'true'
  },
  cityBankAmericanExpressCashBack (state, getters) {
    return process.env.CITYBANK_AMERICAN_EXPRESS_CASHBACK_OFFER === 'true'
  },
  eblCashBack (state, getters) {
    return process.env.EBL_CASHBACK_OFFER === 'true'
  },
  masterCardCashBack (state, getters) {
    return process.env.MASTERCARD_CASHBACK_OFFER === 'true'
  },
  cashBackList (state, getters) {
    let arr = []
    if (getters.bkashCashBack) {
      arr.push(CASHBACK.BKASH)
    }
    if (getters.cityBankAmericanExpressCashBack) {
      arr.push(CASHBACK.CITYBANK)
    }
    if (getters.eblCashBack) {
      arr.push(CASHBACK.EBL)
    }
    if (getters.masterCardCashBack) {
      arr.push(CASHBACK.MASTERCARD)
    }
    return arr
  }
}

export default getters

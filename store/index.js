import Vuex from 'vuex'

import getters from './getters'
import mutations from './mutations'
import actions from './actions'

import { Platform } from '~/utils/enums.yaml'

import {
  SIDE_BAR_MENU_CATALOG
} from '~/store/constants.yaml'

import { debug } from '~/utils'

const plugins = []

export default () => {
  return new Vuex.Store({
    state: {
      locales: ['en', 'bn'],
      locale: 'en',
      i18nText: null,
      appMode: null,
      platform: Platform.BROWSER,
      allLocations: null,
      selectedPreferredAddress: null,
      preferredDeliveryMethod: null,
      usePreferredDeliveryModalForCheckout: false,
      allCategories: null,
      currentCategory: null,
      categoryIdUncollapsed: null,
      customer: null,
      customer_access_token: null,
      agent: null,
      agent_access_token: null,
      apiError: null,
      fbLoginAttempted: false,
      toggleCommission: false,
      agentProfileAccessInfo: null,
      cart: {
        items: [], // item : { product_id, product_url, i18n_name, sku, discounted_price, price, discount_rule, quantity, available_qty }
        cart_items_backup: [],
        is_emi: false,
        sub_total: 0,
        cart_items_display_info: [],
        cartError: false,
        coupon_code: null,
        applied_coupon: null, // { id, code, discount_amount }
        delivery_rule: null, // { rule_id, amount }
        updated_at: null
      },
      ui: {
        isOffline: false,
        activeOverlay: null,
        activeSideBarMenu: SIDE_BAR_MENU_CATALOG,
        showVariantModal: false,
        overlayContext: null,
        pageNotification: null,
        cartItemBeforeAgentLogin: null,
        openCartAfterReload: false,
        donationFlag: false
      },
      pageMode: {
        homePage: false,
        specialMode: false,
        paymentMode: false,
        profileMode: false,
        productDetailsMode: false,
        checkoutMode: false
      },
      isFbSdkReady: false,
      isAppMounted: false,
      navigatingRoutePath: null,
      attemptedPath: null
    },
    getters,
    mutations,
    actions,
    plugins,
    strict: debug
  })
}

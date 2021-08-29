<template>
  <div :class="$style.checkout">
    <h1 :class="$style.checkoutPageTitle">Checkout</h1>
    <div :class="$style.checkoutRow">
      <div :class="$style.checkoutCol1">
        <cart :class="[$style.checkoutStep, $style.checkoutStepCart]"></cart>
      </div>
      <div :class="$style.checkoutCol2">
        <div :class="[$style.checkoutStep, $style.checkoutStepActive]">
          <div :class="$style.checkoutStepTitle">{{ i18nText.customerDetails }}</div>
          <div :class="$style.checkoutStepBody">
            <login :success-callback="nextStep"></login>
          </div>
        </div>
        <div :class="$style.checkoutStep">
          <div :class="$style.checkoutStepTitle">{{ i18nText.deliveryDetails }}</div>
        </div>
        <div :class="$style.checkoutStep">
          <div :class="$style.checkoutStepTitle">{{ i18nText.payment }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Cart from '~/components/layouts/Cart'
  import Login from '~/components/Login/LoginCustomer'
  import CustomerLoginWithAgent from '~/components/Login/CustomerLoginWithAgent'
  import i18nKeys from '~/pages/_lang/checkout/verify-user.i18n.yaml'
  import { mapGetters } from 'vuex'

  import {
    i18nMixin,
    i18nRedirect
  } from '~/utils'

  import {
    gaEnhancedEcom
  } from '~/utils/ga-ec'

  import { UPDATE_CART_TIMESTAMP } from '~/store/constants.yaml'
  const deliveryDetailsPath = '/checkout/delivery-option'

  export default {
    mixins: [i18nMixin(i18nKeys), gaEnhancedEcom],
    fetch (context) {
      let {store} = context
      if (store.state.cart.items.length === 0) {
        return i18nRedirect(context, '/')
      }

      if (store.getters.userHasVerifiedNumbers) {
        return i18nRedirect(context, deliveryDetailsPath)
      }
    },
    mounted () {
      // *************************************************************************
      // Measuring checkout steps
      // if (this.cart.cart_items_display_info && this.cart.cart_items_display_info.length) {
      //   this.addProductForCheckoutMeasurement(this.cart.cart_items_display_info, 2)
      // }
      // *************************************************************************
    },
    methods: {
      nextStep () {
        this.$store.commit(UPDATE_CART_TIMESTAMP)
        return i18nRedirect(this.$ctx, deliveryDetailsPath, false)
      }
    },
    components: {
      Cart,
      Login,
      CustomerLoginWithAgent
    },
    data () {
      return {
        brandLogo: '/clients/' + process.env.PROJECT_NAME + '/svg/brand-logo.svg'
      }
    },
    computed: {
      ...mapGetters([
        'isAgentMode',
        'cart'
      ])
    }
  }
</script>

<style lang="sass" module>
  @import "shared/checkout/checkout"
</style>

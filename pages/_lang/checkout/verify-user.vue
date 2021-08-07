<template>
  <div :class="$style.checkout">
    <div :class="$style.checkoutContainer">
      <div :class="$style.checkoutRow">
        <div :class="[$style.checkoutStep, $style.process]">
            <div :class="[$style.processTitle, $style.title, $style.active]">
              <div :class="$style.titleStep">{{ i18nText.step1 }}</div>
              <div :class="$style.titleText">{{ i18nText.customerDetails }}</div>
            </div>
            <div :class="$style.process__body">
              <div :class="$style.verify">
                <login :success-callback="nextStep"></login>
              </div>
            </div>
        </div>
        <div :class="[$style.checkoutStep, $style.process]">
            <div :class="[$style.processTitle, $style.title]">
              <div :class="$style.titleStep">{{ i18nText.step2 }}</div>
              <div :class="$style.titleText">{{ i18nText.deliveryDetails }}</div>
            </div>
        </div>
        <div :class="[$style.checkoutStep, $style.process]">
            <div :class="[$style.processTitle, $style.title]">
              <div :class="$style.titleStep">{{ i18nText.step3 }}</div>
              <div :class="$style.titleText">{{ i18nText.payment }}</div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
      if (this.cart.cart_items_display_info && this.cart.cart_items_display_info.length) {
        this.addProductForCheckoutMeasurement(this.cart.cart_items_display_info, 2)
      }
      // *************************************************************************
    },
    methods: {
      nextStep () {
        this.$store.commit(UPDATE_CART_TIMESTAMP)
        return i18nRedirect(this.$ctx, deliveryDetailsPath, false)
      }
    },
    components: {
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
  @import "sass/shared/checkout/checkout.sass"
  .heroImage
    position: absolute
    top: 0
    right: 0
    height: 100%
    max-width: 1000px
    width: auto
    +widescreen
      margin-right: -10px

  .verify
    position: relative
    +tablet
      padding-left: 32px + 40
    // border: 1px solid red
    // display: flex
    // flex-flow: column wrap
    // +tablet
    //   flex-flow: row wrap
    //   padding: 0 10px
    // &__hero
    //   display: none
    //   +tablet
    //     // background-color: $primary
    //     position: relative
    //     overflow: hidden
    //     display: flex
    //     justify-content: flex-end
    //     align-items: center
    //     flex: 1
    //     width: 320px
    //     max-width: 320px
    //   +desktop
    //     width: 420px
    //     max-width: 420px
    //   +widescreen
    //     width: 320px
    //     max-width: 320px

    // &__body
    //   +tablet
    //     flex: 1
    // &__contain
    //   +tablet
    //     padding: 20px 0 20px 30px

</style>

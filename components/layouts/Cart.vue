<template>
  <div :class="$style.cart">

    <h3 v-if="cart.cart_items_display_info.length" :class="$style.cartTitle">{{ i18nText.cartTitle }}</h3>
    <template v-else>
      <h3 :class="$style.cartTitle">{{ i18nText.noItemTitle }}</h3>
      <p :class="$style.cartCopy">{{ i18nText.noItemText }}</p>
      <button :class="[$style.btn, $style.btnPrimary]" @click="backToShop()">{{ i18nText.backShopButton }}</button>
    </template>

    <template v-if="cart.cart_items_display_info.length">
      <!-- <div :class="[$style.cartList, { [$style.listNotCheckout]: !pageMode.checkoutMode}, { [$style.listCheckout]: pageMode.checkoutMode}]"> -->
      <p :class="$style.cartError" v-if="cart.cartError">{{ i18nText.issueWarning }}</p>
      <line-item v-for="item in cart.cart_items_display_info" :cartItemInfo="item" :key="'line-item-' + item.id"></line-item>
      <template v-if="!pageMode.checkoutMode">
        <button v-if="$store.state.cart.cartError" :class="[$style.btnPlaceOrder, $style.btn, $style.btnMuted]" disabled>{{ i18nText.placeOrder }}</button>
        <i18n-link v-else :class="[$style.btnPlaceOrder, $style.btn, $style.btnPrimary]" @click.native="placeOrderButtonHandler()" :to="'/checkout/verify-user'">{{ i18nText.placeOrder }}</i18n-link>
      </template>
      <template v-if="!pageMode.checkoutMode">
        <div :class="$style.coupon">
          <div :class="$style.couponInfo">
            <p :class="$style.couponInfoCopy">{{ i18nText.couponGuide }}</p>
          </div>
        </div>
      </template>

      <template v-if="pageMode.checkoutMode">
        <div :class="[$style.copy, $style.copySubTotal]">
          <span :class="$style.copyLeft">{{ i18nText.subTotal }}</span>
          <span :class="$style.copyRight">Tk. {{ __$(subTotal) }}</span>
        </div>
        <template v-if="!isFreeDelivery && deliveryCharge !== null">
          <div :class="$style.copy">
            <span :class="$style.copyLeft">{{ i18nText.deliveryCharge }}</span>
            <span :class="$style.copyRight" v-if="deliveryCharge !== 0">Tk. {{ __$(deliveryCharge) }}</span>
            <span :class="$style.copyRight" v-else>{{ i18nText.freeDelivery }}</span>
          </div>
        </template>

        <div :class="$style.copy" v-if="showCouponDiscount">
          <span :class="$style.copyLeft">{{ i18nText.couponDiscount }}</span>
          <span :class="$style.copyRight" v-if="isFreeDelivery">{{ i18nText.freeDelivery }}</span>
          <span :class="$style.copyRight" v-else>Tk. {{ __$(couponDiscount) }}</span>
        </div>
        <div :class="[$style.copy, $style.copyTotal]">
          <span :class="$style.copyLeft">{{ i18nText.cartTotal }}</span>
          <span :class="$style.copyRight">Tk. {{ __$(cartTotal) }}</span>
        </div>

        <template v-if="minSubTotalCtx.minSubtotalRequired">
          <div :class="$style.coupon">
            <div :class="$style.couponInfo">
              <p :class="$style.couponInfoTitle">{{ $t(minSubTotalCtx.trMsg, minSubTotalCtx) }}</p>
            </div>
          </div>
        </template>
        <template v-if="showCouponField">
          <div :class="$style.coupon">
            <div :class="$style.couponInfo">
              <div :class="[$style.field, $style.fieldCoupon, {[$style.fieldError]: errors.coupon}, {[$style.fieldSuccess]: errors.coupon === false}]">
                <label :class="$style.fieldLabel">Coupon code</label>
                <div :class="$style.fieldControl">
                  <input :class="$style.fieldInput" type="text" v-model="couponCode" @keyup.enter="applyCoupon" :placeholder="i18nText.promoCodePlaceholder" >
                </div>
                <p :class="$style.fieldValidation" v-if="errors.coupon">{{ __e(errors.coupon) }}</p>
              </div>
            </div>
            <button :class="[$style.couponBtn, $style.btn, $style.btnBlack]" @click="applyCoupon()">Apply coupon</button>
          </div>
        </template>
        <template v-if="cart.applied_coupon">
          <div :class="$style.coupon">
            <div :class="$style.couponInfo">
              <h4 :class="$style.couponInfoTitle">Coupon applied — {{ appliedCouponCode }}</h4>
              <p :class="$style.couponInfoCopy">{{ couponDescription }}</p>
            </div>
            <button :class="[$style.couponBtn, $style.btn]" @click="removeCoupon">Remove coupon</button>
          </div>
        </template>


      </template>

      <!-- <div :class="$style.copy">
        <span :class="$style.copyLeft">copy</span>
        <span :class="$style.copyRight">copy</span>
      </div> -->
    </template>

  </div>
</template>

<script>
  import LineItem from '~/components/layouts/cart/LineItem'
  import { mixin as onClickOutside } from 'vue-on-click-outside'
  import i18nLink from '~/components/i18nLink'
  import animatedScrollTo from '~/utils/animated_scroll_to'
  import {
    overlayMixin,
    cartCalculationMixin,
    i18nMixin,
    i18nRedirect
  } from '~/utils'

  import {
    ga
  } from '~/utils/ga'

  import {
    gaEnhancedEcom
  } from '~/utils/ga-ec'

  import { CouponDiscountType } from '~/utils/enums.yaml'

  import { mapGetters, mapState } from 'vuex'
  // import logger from '~/utils/logger'

  import {
    API_ERRORS,
    OVERLAY_ASIDE_2,
    // EVENT_AGENT_BALANCE,
    // EVENT_ADJUSTED_BALANCE
    EVENT_DELIVERY_CHARGE_CALCULATED,
    EVENT_SAVE_CART_RESPONSE_IN_CART,
    COUPON_ERROR_DISAPPEAR_INTERVAL,
    VALIDATE_COUPON,
    SET_PAGE_NOTIFICATION,
    HANDLE_APPLIED_COUPON,
    SAVE_CART,
    ADDRESS_TYPES
  } from '~/store/constants.yaml'

  export default {
    mixins: [i18nMixin('Cart'), onClickOutside, overlayMixin, cartCalculationMixin, ga, gaEnhancedEcom],
    mounted () {
      this.$root.$on(EVENT_SAVE_CART_RESPONSE_IN_CART, (response) => {
        this.handleSaveCartResponse(response)
      })
      this.$root.$on(EVENT_DELIVERY_CHARGE_CALCULATED, this.deliveryChargeChanged)
      // this.$root.$on(EVENT_AGENT_BALANCE, this.setAgentBalance)
    },
    data () {
      return {
        agentCommissionbalance: 0,
        couponCode: null,
        errors: {
          coupon: null
        },
        minSubTotalCtx: {
          restAmount: null,
          discountAmount: null,
          maxDiscountmount: null,
          trMsg: null,
          minSubtotalRequired: false,
          discountType: null
        }
      }
    },
    watch: {
      preOpenCart: function (val, OldVal) {
        if (val) {
          this.openOverlay(OVERLAY_ASIDE_2)
        }
      }
    },
    computed: {
      ...mapGetters([
        'cart',
        'isAgentMode',
        'isCustomerMode',
        'preferredDeliveryAddress',
        'cartWarningExists'
      ]),
      ...mapState([
        'isAppMounted',
        'pageMode',
        'ui',
        'customer',
        'agent'
      ]),
      preferredDeliveryPointType () {
        if (this.preferredDeliveryAddress && this.preferredDeliveryAddress.owner_type === ADDRESS_TYPES.AGENT) return this.i18nText.agentStore
        else if (this.preferredDeliveryAddress && this.preferredDeliveryAddress.owner_type === ADDRESS_TYPES.LOCKER) return this.i18nText.locker
      },
      couponDescription () {
        if (this.errors.minimumSubtotalNotMet) {
          return this.errors.minimumSubtotalNotMet
        }
        return this.cart.applied_coupon ? this.cart.applied_coupon.description : null
      },
      preOpenCart () {
        return this.ui.openCartAfterReload
      }
      // adjustedBalance () {
      //   let adjustedBalance
      //   if (this.cartTotal > this.agentCommissionbalance) {
      //     adjustedBalance = this.agentCommissionbalance
      //   } else {
      //     adjustedBalance = this.cartTotal
      //   }
      //   this.$root.$emit(EVENT_ADJUSTED_BALANCE, adjustedBalance)
      //   return adjustedBalance
      // },
      // netPayable () {
      //   if (this.cartTotal > this.agentCommisionbalance) {
      //     return Math.round(parseFloat(this.cartTotal) - parseFloat(this.agentCommisionbalance))
      //   } else {
      //     return 0
      //   }
      // }
    },
    components: {
      LineItem,
      i18nLink
    },
    methods: {
      backToShop () {
        this.closeAside2()
        if (this.pageMode.checkoutMode || this.pageMode.profileMode) {
          i18nRedirect(this.$ctx, '/')
        }
      },
      loginAgent () {
        this.openOverlay(this.overlays.loginModal)
      },
      placeOrderButtonHandler () {
        this.gaTrackForPlacedOrderClick()
        // *************************************************************************
        // Measuring checkout steps
        // if (this.cart.cart_items_display_info && this.cart.cart_items_display_info.length) {
        //   this.addProductForCheckoutMeasurement(this.cart.cart_items_display_info, 1)
        // }
        // *************************************************************************
        if (this.isAgentMode && !this.agent) {
          this.loginAgent()
        }
      },
      // setAgentBalance (agentCommisionbalance) {
      //   this.agentCommisionbalance = agentCommisionbalance
      // },
      deliveryChargeChanged (deliveryCharge) {
        deliveryCharge = parseInt(deliveryCharge)
        if (isNaN(deliveryCharge)) {
          this.deliveryCharge = null
          return
        }
        this.deliveryCharge = deliveryCharge
      },
      placeOrder () {
        this.$router.push('/checkout')
      },
      applyCoupon () {
        if (!this.couponCode) {
          this.errors.coupon = API_ERRORS.INVALID_COUPON
          setTimeout(() => {
            this.errors.coupon = null
          }, COUPON_ERROR_DISAPPEAR_INTERVAL * 100)
          return
        }
        this.$store.dispatch(VALIDATE_COUPON, this.couponCode)
          .then((response) => {
            this.handleCouponError(response)
          })
        this.resetErrorWarningState()
      },
      resetErrorWarningState () {
        this.errors.coupon = null
        this.minSubTotalCtx.minSubtotalRequired = false
        this.minSubTotalCtx.restAmount = null
        this.minSubTotalCtx.discountAmount = null
        this.minSubTotalCtx.maxDiscountmount = null
        this.minSubTotalCtx.discountType = null
        this.minSubTotalCtx.trMsg = null
      },
      handleMinimumSubtotalInfo (response) {
        const minSubTotalNotMatchCoupon = response.suggestion ? response.suggestion : response.user_coupon
        this.minSubTotalCtx.minSubtotalRequired = true
        this.minSubTotalCtx.restAmount = parseInt(minSubTotalNotMatchCoupon.min_subtotal) - response.sub_total
        this.minSubTotalCtx.discountAmount = parseInt(minSubTotalNotMatchCoupon.amount)
        this.minSubTotalCtx.maxDiscountmount = parseInt(minSubTotalNotMatchCoupon.max_amount)
        this.minSubTotalCtx.discountType = parseInt(minSubTotalNotMatchCoupon.discount_type)

        this.minSubTotalCtx.restAmount = this.__$(this.minSubTotalCtx.restAmount, true)
        this.minSubTotalCtx.discountAmount = this.__$(this.minSubTotalCtx.discountAmount, true)
        this.minSubTotalCtx.maxDiscountmount = this.__$(this.minSubTotalCtx.maxDiscountmount, true)

        switch (minSubTotalNotMatchCoupon.discount_type) {
          case CouponDiscountType.FIXED:
            this.minSubTotalCtx.trMsg = 'api_errors.fixed_coupon_min_subtotal_not_match'
            break
          case CouponDiscountType.FREE_DELIVERY:
            this.minSubTotalCtx.trMsg = 'api_errors.free_delivery_coupon_min_subtotal_not_match'
            break
          case CouponDiscountType.PERCENTAGE_OF_SUBTOTAL:
            this.minSubTotalCtx.trMsg = 'api_errors.percentage_of_subtotal_coupon_min_subtotal_not_match'
            break
          case CouponDiscountType.PERCENTAGE_OR_MAX_OF_SUBTOTAL:
            this.minSubTotalCtx.trMsg = 'api_errors.percentage_of_subtotal_or_max_coupon_min_subtotal_not_match'
            break
        }
      },
      handleCouponError (response) {
        switch (response && response.coupon_error) {
          case API_ERRORS.INVALID_COUPON:
            this.errors.coupon = API_ERRORS.INVALID_COUPON
            break
          case API_ERRORS.COUPON_EXPIRED:
            this.errors.coupon = API_ERRORS.COUPON_EXPIRED
            break
          case API_ERRORS.TOTAL_USAGE_LIMIT_EXCEEDED:
            this.errors.coupon = API_ERRORS.TOTAL_USAGE_LIMIT_EXCEEDED
            break
          case API_ERRORS.USER_USAGE_LIMIT_EXCEEDED:
            this.errors.coupon = API_ERRORS.USER_USAGE_LIMIT_EXCEEDED
            break
          case API_ERRORS.USER_COUPON_NOT_MATCH_WITH_PRODUCTS:
            this.errors.coupon = API_ERRORS.USER_COUPON_NOT_MATCH_WITH_PRODUCTS
            break
          case API_ERRORS.COUPON_RULES_VALIDATION_FAILS:
            this.errors.coupon = API_ERRORS.COUPON_RULES_VALIDATION_FAILS
            break
          case API_ERRORS.COUPON_MIN_SUBTOTAL_NOT_MATCH:
            this.handleMinimumSubtotalInfo(response)
            break
          default:
            break
        }
      },
      handleSaveCartResponse (response) {
        if (
          response &&
          (
            !response.applied_coupon &&
            response.user_coupon &&
            response.coupon_error &&
            response.coupon_error !== API_ERRORS.COUPON_MIN_SUBTOTAL_NOT_MATCH
          ) ||
          (
            !response.applied_coupon &&
            response.suggestion
          )
        ) {
          this.removeCoupon()
        }

        this.resetErrorWarningState()
        this.handleCouponError(response)

        if (response.suggestion) {
          this.handleMinimumSubtotalInfo(response)
        }

        this.couponCode = !this.appliedCouponCode && !this.errors.coupon ? null : this.couponCode

        if (response && response.coupon_error) {
          this.couponCode = response.applied_coupon ? response.applied_coupon.code : this.couponCode

          let shouldShowPageNotifcation = (!this.pageMode.checkoutMode ||
            (this.pageMode.checkoutMode && this.ui.activeOverlay !== OVERLAY_ASIDE_2)) &&
            (response.coupon_error !== API_ERRORS.COUPON_MIN_SUBTOTAL_NOT_MATCH)

          if (shouldShowPageNotifcation) {
            this.$store.commit(SET_PAGE_NOTIFICATION, { type: 'error', key: response.coupon_error.toLowerCase(), field: this.couponCode })
            setTimeout(() => {
              const rootElement = document.querySelector('html')
              animatedScrollTo('main', rootElement ? rootElement.offsetHeight : 0, 5)
            }, 0)
          }
        }
      },
      removeCoupon () {
        const isUserAppliedCoupon = (this.cart.applied_coupon &&
          this.cart.user_coupon &&
          this.cart.applied_coupon.id === this.cart.user_coupon.id) || this.cart.user_coupon
        const isAutoAppliedCoupon = !!(this.cart.applied_coupon && this.cart.applied_coupon.is_auto_applicable)

        this.$store.dispatch(HANDLE_APPLIED_COUPON, null)
        this.resetErrorWarningState()
        this.couponCode = null
        if (isUserAppliedCoupon && !isAutoAppliedCoupon) {
          this.$store.dispatch(SAVE_CART, this.cart)
        }
      },
      openPreferredDeliveryPointModal (deliveryMethod) {
        if (this.isCustomerMode) {
          this.openOverlay(this.overlays.preferredDeliveryPointModal)
        }
      }
    }
  }
</script>

<style lang="sass" module>
  @import "shared/button"
  @import "shared/field"
  @import "shared/cart"
</style>

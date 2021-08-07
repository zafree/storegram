<template>
  <aside-content>
    <div class="wrapper">
      <div :class="$style.title">{{ i18nText.cartTitle }}</div>

      <template v-if="cart.cart_items_display_info.length">
        <div :class="[$style.list, { [$style.listNotCheckout]: !pageMode.checkoutMode}, { [$style.listCheckout]: pageMode.checkoutMode}]">
          <div :class="$style.cartGlobalError" v-if="cart.cartError">
            <p :class="$style.cartGlobalErrorText">{{ i18nText.issueWarning }}</p>
          </div>
          <line-item v-for="item in cart.cart_items_display_info" :cartItemInfo="item" :key="'line-item-' + item.id"></line-item>
        </div>

        <div :class="$style.actions">

          <!-- Subtotal -->
          <!-- <div :class="[$style.summary, {[$style.summaryFocus]: !pageMode.checkoutMode}, {[$style.summarySubtotal]: !pageMode.checkoutMode}]"> -->
          <div :class="[$style.summary, {[$style.summaryLast]: !pageMode.checkoutMode || !(pageMode.checkoutMode && customer)}]">
            <label :class="$style.summaryTitle">{{ i18nText.subTotal }}</label>
            <span :class="$style.summaryAmount">Tk. {{ __$(subTotal) }}</span>
          </div>

          <!-- if checkout mode only -->
          <template v-if="pageMode.checkoutMode && customer">
            <!-- Delivery charge -->
            <div :class="$style.summary" v-if="!isFreeDelivery && deliveryCharge !== null">
              <label :class="$style.summaryTitle">{{ i18nText.deliveryCharge }}</label>
              <span :class="$style.summaryAmount" v-if="deliveryCharge !== 0">Tk. {{ __$(deliveryCharge) }}</span>
              <span :class="[$style.summaryAmount, $style.summaryAmountRed]" v-else>{{ i18nText.freeDelivery }}</span>
            </div>
            <!-- Coupon discount -->
            <div :class="$style.summary" v-if="showCouponDiscount">
              <label :class="$style.summaryTitle">{{ i18nText.couponDiscount }}</label>
              <span :class="[$style.summaryAmount, $style.summaryAmountRed]" v-if="isFreeDelivery">{{ i18nText.freeDelivery }}</span>
              <span :class="[$style.summaryAmount, $style.summaryAmountRed]" v-else>Tk. {{ __$(couponDiscount) }}</span>
            </div>
            <!-- Total -->
            <div :class="[$style.summary, $style.summaryFocus, , $style.summaryLast]" v-if="deliveryCharge === 0 || deliveryCharge">
              <label :class="$style.summaryTitle">{{ i18nText.cartTotal }}</label>
              <span :class="$style.summaryAmount">Tk. {{ __$(cartTotal) }}</span>
            </div>

            <!-- Coupon -->
            <div :class="[$style.field, $style.fieldCoupon, {[$style.fieldError]: errors.coupon}, {[$style.fieldSuccess]: errors.coupon === false}]" v-if="showCouponField">
              <div :class="$style.fieldControl">
                <input :class="$style.fieldInput" type="text" v-model="couponCode" @keyup.enter="applyCoupon" :placeholder="i18nText.promoCodePlaceholder" >
                <button :class="$style.button" @click="applyCoupon()">{{ i18nText.applyCouponButton }}</button>
              </div>
              <p :class="$style.fieldValidation" v-if="errors.coupon">{{ __e(errors.coupon) }}</p>
            </div>
            <!-- Coupon applied :: make it translatable-->
            <div :class="$style.appliedCoupon" v-if="showCouponDescription">
              <template v-if="cart.applied_coupon">
                <h4 :class="$style.appliedCouponTitle">{{ i18nText.appliedCoupon }} — <span :class="$style.appliedCouponCode">{{ appliedCouponCode }}</span>
                </h4>
                <p :class="$style.appliedCouponCopy">{{ couponDescription }}</p>
                <button :class="[$style.button, $style.appliedCouponRemoveButton]" @click="removeCoupon">{{ i18nText.removeAppliedCoupon }}</button>
              </template>
              <p :class="[$style.appliedCouponCopy, $style.appliedCouponCopyInfo]" v-if="minSubTotalCtx.minSubtotalRequired">{{ $t(minSubTotalCtx.trMsg, minSubTotalCtx) }}</p>
            </div>

            <!-- Agent balance, adjusted balance, net payable  -->
            <!-- <template v-if="isAgentMode">
              <div :class="$style.currentBalance">
                <span :class="$style.currentBalanceText">{{ $t('sidebar.cart.current_balance')}}:</span>
                <span :class="$style.currentBalanceMoney">Tk. {{agentCommissionbalance}}</span>
              </div>
              <div :class="$style.adjustedBalance">
                <span :class="$style.adjustedBalanceText">{{ $t('sidebar.cart.adjusted_balance')}}:</span>
                <span :class="$style.adjustedBalanceMoney">Tk. {{adjustedBalance}}</span>
              </div>
              <div :class="$style.netPayable">
                <span :class="$style.netPayableText">{{ $t('sidebar.cart.net_payable')}}:</span>
                <span :class="$style.netPayableMoney">Tk. {{netPayable}}</span>
              </div>
            </template> -->
          </template>

          <!-- desktop only alert -->
          <div class="Alert Alert--warning Alert--desktopOnly" v-if="!pageMode.checkoutMode && !cart.cartError && cartWarningExists">
            <p class="Alert__copy">
              <span v-if="isCustomerMode">{{ $t('sidebar.cart.line_item_deliverable_warning_1', { field: preferredDeliveryPointType } ) }}</span>
              <span v-else>{{ $t('sidebar.cart.line_item_deliverable_warning_1_agentmode', { field: preferredDeliveryPointType } ) }}</span>
              <span>&nbsp;</span>
              <span :class="[{'underline': isCustomerMode}]" @click="openPreferredDeliveryPointModal">{{ i18nText.deliverableWarning2 }}</span>
              {{ i18nText.deliverableWarning3 }}
            </p>
          </div>

          <!-- Coupon applied in checkout -->
          <div :class="$style.couponGuideText" v-if="!pageMode.checkoutMode || !customer">
            <p :class="$style.couponGuideTextCopy">{{ i18nText.couponGuide }}</p>
            <!-- <i18n-link v-if="!pageMode.checkoutMode && !cart.cartError" :to="'/checkout/verify-user'" :class="[$style.button, $style.couponGuideTextLink]">{{ i18nText.applyCoupon }}</i18n-link>
            <button v-else type="button" :class="[$style.button, $style.couponGuideTextLink, $style.buttonDisable]" disabled>{{ i18nText.applyCoupon }}</button> -->
          </div>

          <div :class="$style.orderAction" v-if="!pageMode.checkoutMode">
            <i18n-link
              @click.native="placeOrderButtonHandler()"
              v-if="!$store.state.cart.cartError && isCustomerMode"
              :to="'/checkout/verify-user'"
              :class="[$style.button, $style.buttonPlaceOrder]"
            >
              {{ i18nText.placeOrder }}
            </i18n-link>

            <i18n-link
              @click.native="placeOrderButtonHandler()"
              v-else-if="!$store.state.cart.cartError && isAgentMode && agent"
              :to="'/checkout/verify-user'"
              :class="[$style.button, $style.buttonPlaceOrder]"
            >
              {{ i18nText.placeOrder }}
            </i18n-link>

            <button
              v-else-if="!$store.state.cart.cartError && isAgentMode && !agent"
              @click="placeOrderButtonHandler()"
              :class="[$style.button, $style.buttonPlaceOrder]"
            >
              {{ i18nText.placeOrder }}
            </button>

            <button
              v-if="$store.state.cart.cartError"
              type="button"
              :class="[$style.button, $style.buttonPlaceOrder, $style.buttonDisable]"
              disabled
            >
              {{ i18nText.placeOrder }}
            </button>
          </div>
        </div>
      </template>

      <!-- Cart empty -->
      <div v-else :class="$style.empty">
        <div :class="$style.emptyIcon">
          <!-- <img src="/svg/cart-empty.svg" alt=""> -->
          <svg viewBox="0 0 32 32">
            <path d="M28.8,11.3l-2.4,6.9c-0.1,0.4-0.5,0.6-0.9,0.6l-14.2,0.1c-0.5,0-0.8-0.3-0.9-0.8l0,0l-1.2-6.7L8.4,7.6l-1-5.4L0.6,0L0,1.8
              l5.8,1.9l3.1,17c0.2,1.2,0.9,2.2,1.8,2.9C9.1,25,9,27.3,10.3,28.9s3.7,1.7,5.3,0.4c1.4-1.2,1.7-3.2,0.8-4.7h4.8
              c-0.3,0.6-0.5,1.2-0.5,1.9c0,2.1,1.7,3.8,3.8,3.8s3.8-1.7,3.8-3.8s-1.7-3.8-3.8-3.8h-11c-1.2,0-2.3-0.8-2.6-1.9
              c0.1,0,0.3,0.1,0.4,0.1h14.3c1.2,0,2.3-0.8,2.7-1.9L32,7.6l-2,0L28.8,11.3z M25,5.5c-0.3-0.8-0.7-1.6-1.3-2.3
              c-0.5-0.6-1.2-1.2-2-1.5c-1.6-0.7-3.4-0.7-4.9,0c-0.7,0.4-1.4,0.9-1.9,1.5c-0.6,0.7-1,1.5-1.3,2.3c-0.6,1.9-0.6,3.9,0,5.8
              c0.3,0.8,0.7,1.6,1.3,2.3c0.5,0.6,1.2,1.1,1.9,1.5c1.6,0.7,3.4,0.7,4.9,0c0.8-0.4,1.4-0.9,2-1.5c0.6-0.7,1-1.5,1.3-2.3
              C25.6,9.4,25.6,7.4,25,5.5L25,5.5z M22,10.2c-0.1,0.5-0.3,0.9-0.6,1.4c-0.2,0.4-0.6,0.7-0.9,0.9c-0.4,0.2-0.8,0.3-1.2,0.3
              c-0.4,0-0.8-0.1-1.2-0.3c-0.4-0.2-0.7-0.5-0.9-0.9c-0.3-0.4-0.5-0.9-0.6-1.4c-0.1-0.6-0.2-1.2-0.2-1.7c0-0.6,0.1-1.2,0.2-1.8
              c0.1-0.5,0.3-1,0.6-1.4c0.2-0.4,0.6-0.7,0.9-0.9c0.4-0.2,0.8-0.3,1.2-0.3c0.4,0,0.8,0.1,1.2,0.3c0.4,0.2,0.7,0.5,0.9,0.9
              c0.3,0.4,0.5,0.9,0.6,1.4c0.1,0.6,0.2,1.2,0.2,1.8C22.2,9,22.2,9.6,22,10.2z"/>
          </svg>
        </div>
        <div :class="$style.emptyText">
          <!-- {{ $t('sidebar.cart.no_item') }} -->
          <h4 :class="$style.emptyTextTitle">{{ i18nText.noItemTitle }}</h4>
          <p :class="$style.emptyTextSub">{{ i18nText.noItemText }}</p>
          <button :class="[$style.button, $style.buttonBackToShopping]" @click="backToShop()">{{ i18nText.backShopButton }}</button>
        </div>
      </div>
    </div>
  </aside-content>
</template>

<script>
  import AsideContent from '~/components/layouts/AsideContent'
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
      AsideContent,
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
        if (this.cart.cart_items_display_info && this.cart.cart_items_display_info.length) {
          this.addProductForCheckoutMeasurement(this.cart.cart_items_display_info, 1)
        }
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

<style scoped>
  .underline {
    text-decoration: underline;
    cursor: pointer;
  }
</style>

<style lang="sass" scoped>
  .wrapper
    margin-top: 26px
    padding-left: 40px
    padding-right: 40px
    +tablet
      margin-top: 66px
</style>


<style lang="sass" scoped>
  @import "shared/alerts"

  .Alert
    &--desktopOnly
      display: none
      +desktop
        display: block
        margin-top: 10px
</style>


<style lang="sass" module>
  @import "shared/cart-contain"
  @import "shared/form/field"
  @import "shared/button"
  @import "shared/summary"

  .disabled
    background: red

  // markup hide
  .adjustedBalance
    position: relative
    display: flex
    flex-direction: row
    justify-content: flex-end
    align-items: center
    padding-top: 15px
    padding-bottom: 15px
    border-top: 1px solid #ddd
    color: #777
    &__text
      font-size: 14px
      // font-weight: 700
      line-height: 1
      padding-right: 10px
    &__money
      font-size: 18px
      line-height: 1

  // markup hide
  .netPayable
    position: relative
    display: flex
    flex-direction: row
    justify-content: flex-end
    align-items: center
    padding-top: 15px
    padding-bottom: 15px
    border-top: 1px solid #ddd
    &__text
      font-size: 16px
      font-weight: 700
      line-height: 1
      padding-right: 10px
    &__money
      font-size: 20px
      line-height: 1


  .Button
    &--placeOrder
      +button
      border-radius: 50em
      font-size: 14px
      font-weight: $weight-medium
      padding: 0 40px
      height: 48px
      text-transform: uppercase
      display: flex
      justify-content: center
      align-items: center
      margin-top: 20px
    &--backToShopping
      +button
      width: 100%
      font-size: 16px
      height: 56px
      border-radius: 0

  .Empty
    display: flex
    flex-flow: column wrap
    align-items: center
    // padding: 0 15px
    &__icon
      display: block
      width: 100px
      height: 100px
      fill: #ddd
      margin-left: -20px
      margin-top: 50px
      margin-bottom: 50px
    &__text
      text-align: center
      &__title
        font-size: 21px
        color: $text
        // margin-top: 20px
      &__sub
        font-size: 16px
        line-height: 1.4
        color: #bbbbbb
        margin-top: 10px
        margin-bottom: 20px
        max-width: 220px

  .CartGlobalError
    display: block
    font-size: 14px
    margin-top: 6px
    margin-bottom: 0
    color: $white
    fill: $white
    background-color: $red
    border-radius: 2px
    padding: 14px 20px
    margin-bottom: 30px
    &__text
      font-size: inherit
      color: inherit
      fill: inherit

  .Field
    &--coupon
      margin-top: 30px
      padding-bottom: 30px
      .Field__input
        padding-left: 12px
        padding-right: 65px
        border-color: #777
      &.Field--error
        .Field__input
          border-color: $red
      .Button
        position: absolute
        top: 0
        right: 0
        padding: 0 15px
        font-size: 12px
        background-color: #333
        color: $white
        margin-top: 2px
        margin-right: 2px
        height: 32px
        &:hover
          color: $white
          background-color: #222
        &:focus,
        &:active
          color: $white
          background-color: #111

</style>

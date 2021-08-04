<template>
  <aside-content>
    <div :class="$style.contain">
      <div :class="$style.title" v-if="pageMode.checkoutMode">{{ i18nText.orderSummary }}</div>
      <template v-else>{{ '' }}</template>
      <!-- <div :class="$style.title" v-else>{{ '' }}</div> -->
    </div>
    <div :class="[$style.list, { [$style.listNotCheckout]: !pageMode.checkoutMode}, { [$style.listCheckout]: pageMode.checkoutMode}]">
      <line-item v-for="item in lineItems" :item="item" :key="'line-item-' + item.id"></line-item>
    </div>

    <div :class="$style.actions" v-if="lineItems.length">
      <!-- Subtotal -->
      <div :class="$style.summary" v-if="subTotal">
        <label :class="$style.summaryTitle">{{ i18nText.subTotal }}</label>
        <span :class="$style.summaryAmount">Tk. {{ __$(subTotal) }}</span>
      </div>

      <!-- Delivery charge -->
      <div :class="$style.summary" v-if="!isFreeDelivery">
        <label :class="$style.summaryTitle">{{ i18nText.deliveryCharge }}</label>
        <span :class="[$style.summaryAmount, $style.summaryAmountRed]" v-if="deliveryCharge === 0">{{ i18nText.freeDelivery }}</span>
        <span :class="$style.summaryAmount" v-else>Tk. {{ __$(deliveryCharge) }}</span>
      </div>

      <!-- Coupon discount -->
      <div :class="$style.summary" v-if="orderSummary.coupon_rule">
        <label :class="$style.summaryTitle">{{ i18nText.couponDiscount }}</label>
        <span :class="[$style.summaryAmount, $style.summaryAmountRed]" v-if="isFreeDelivery">{{ i18nText.freeDelivery }}</span>
        <span :class="[$style.summaryAmount, $style.summaryAmountRed]" v-else>Tk. {{ __$(couponDiscount) }}</span>
      </div>

      <!-- Total -->
      <div :class="[$style.summary, $style.summaryFocus, $style.summaryLast]">
        <label :class="$style.summaryTitle">{{ i18nText.total }}</label>
        <span :class="$style.summaryAmount">Tk. {{ __$(total) }}</span>
      </div>

    </div>
  </aside-content>
</template>

<script>
  import LineItem from '~/components/OrderDetailsLineItem'
  import AsideContent from '~/components/layouts/AsideContent'
  import i18nKeys from '~/components/layouts/checkout/OrderSummary.i18n.yaml'
  import {
    i18nMixin
  } from '~/utils'

  import { CouponDiscountType } from '~/utils/enums.yaml'

  import { mapState } from 'vuex'

  export default {
    mixins: [i18nMixin(i18nKeys)],
    props: ['orderSummary'],
    computed: {
      ...mapState([
        'pageMode'
      ]),
      lineItems () {
        return this.orderSummary && this.orderSummary.line_items ? this.orderSummary.line_items : []
      },
      subTotal () {
        return this.orderSummary && this.orderSummary.sub_total ? this.orderSummary.sub_total : 0
      },
      total () {
        return this.orderSummary && this.orderSummary.total ? this.orderSummary.total : 0
      },
      couponDiscount () {
        return this.orderSummary && this.orderSummary.coupon_discount ? this.orderSummary.coupon_discount : 0
      },
      isFreeDelivery () {
        return this.orderSummary.coupon_rule && this.orderSummary.coupon_rule.discount_type === CouponDiscountType.FREE_DELIVERY &&
          parseFloat(this.orderSummary.sub_total) >= parseFloat(this.orderSummary.coupon_rule.min_subtotal)
      },
      deliveryCharge () {
        return this.orderSummary && this.orderSummary.delivery_charge ? parseInt(this.orderSummary.delivery_charge) : 0
      }
    },
    components: {
      AsideContent,
      LineItem
    }
  }
</script>

<style scoped>

</style>

<style lang="sass" module>
  @import "shared/cart-contain"
  @import "shared/button"
  @import "shared/summary"
</style>

<template>
  <div :class="$style.cart">
    <h3 :class="$style.cartTitle">{{ i18nText.orderSummary }}</h3>
    <line-item v-for="item in lineItems" :item="item" :key="'line-item-' + item.id"></line-item>

    <template v-if="lineItems.length">
      <div :class="[$style.copy, $style.copySubTotal]">
        <span :class="$style.copyLeft">{{ i18nText.subTotal }}</span>
        <span :class="$style.copyRight">Tk. {{ __$(subTotal) }}</span>
      </div>
      <div :class="$style.copy" v-if="!isFreeDelivery">
        <span :class="$style.copyLeft">{{ i18nText.deliveryCharge }}</span>
        <span :class="$style.copyRight" v-if="deliveryCharge === 0">{{ i18nText.freeDelivery }}</span>
        <span :class="$style.copyRight" v-else>Tk. {{ __$(deliveryCharge) }}</span>
      </div>
      <div :class="$style.copy" v-if="orderSummary.coupon_rule">
        <span :class="$style.copyLeft">{{ i18nText.couponDiscount }}</span>
        <span :class="$style.copyRight" v-if="isFreeDelivery">{{ i18nText.freeDelivery }}</span>
        <span :class="$style.copyRight" v-else>Tk. {{ __$(couponDiscount) }}</span>
      </div>
      <div :class="[$style.copy, $style.copyTotal]">
        <span :class="$style.copyLeft">{{ i18nText.total }}</span>
        <span :class="$style.copyRight">Tk. {{ __$(total) }}</span>
      </div>
    </template>
  </div>
</template>

<script>
  import LineItem from '~/components/OrderDetailsLineItem'
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
      LineItem
    }
  }
</script>

<style lang="sass" module>
  @import "shared/button"
  @import "shared/cart"
</style>

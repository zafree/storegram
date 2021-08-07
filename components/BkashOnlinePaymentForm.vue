<template>
  <form :action="bkashPaymentUrl" method="POST">
    <input type="hidden" name="ref_no" :value="paymentInfo.ref_no">
    <input type="hidden" name="order_id" :value="paymentInfo.order_id">
    <input type="hidden" name="amount" :value="paymentInfo.amount">
    <input type="hidden" name="success_url" :value="paymentInfo.success_url">
    <input type="hidden" name="failure_url" :value="paymentInfo.failure_url">
    <input type="hidden" name="user_token" :value="authToken">
    <button :class="['Button', bkashButtonModifier]" type="submit" value="Submit">
      <slot></slot>
    </button>
  </form>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: ['bkashPaymentUrl', 'paymentInfo'],
  computed: {
    ...mapGetters([
      'authToken',
      'bkashCashBack'
    ]),
    bkashButtonModifier () {
      return this.bkashCashBack ? 'Button--bKashCheckoutGreen' : 'Button--bKashCheckout'
    }
  }
}
</script>


<style lang="sass" scoped>
  .Button
    display: inline-flex
    align-items: center
    &--bKashCheckout
      // background-color: #EE3B3C
      background-color: #EC005F
      color: $white
      padding: 0 10px
      border-radius: 6px
      font-size: 13px
      font-weight: $weight-medium
      letter-spacing: -0.06em
      height: 26px
      margin-bottom: 25px
      +button
    &--bKashCheckoutGreen
      justify-content: center
      width: 100%
      font-size: 15px
      height: 44px
      padding: 0 15px
      +button
</style>

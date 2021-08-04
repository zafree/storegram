<template>
  <div class="di">
    <div class="di__list">
      <div class="di__item">
        <div class="di__imgWrapper">
          <img src="/svg/delivery-info/icon-agentPickup.svg" alt="">
        </div>
        <div class="di__copy1">{{ $t('shipping_info.agent_pickup')}}</div>
        <div class="di__copy2">{{ agentPickupCharge === 0 ? $t('shipping_info.free') : '৳ ' + __$(agentPickupCharge)}}</div>
      </div>
      <div class="di__item">
        <div class="di__imgWrapper">
          <img src="/svg/delivery-info/icon-homeDelivery.svg" alt="">
        </div>
        <div class="di__copy1">{{ $t('shipping_info.home_delivery') }}</div>
        <div class="di__copy2">{{ homeDeliveryCharge === 0 ? $t('shipping_info.free') : '৳ ' + __$(homeDeliveryCharge) }}</div>
      </div>
    </div>
    <div class="di__label">{{ $t('shipping_info.estimated_title') }}</div>
    <div class="di__list">
      <div class="di__item">
        <div class="di__imgWrapper">
          <img src="/svg/delivery-info/icon-insideDhaka.svg" alt="">
        </div>
        <div class="di__copy1">{{ $t('shipping_info.inside_dhaka') }}</div>
        <div class="di__copy2">{{ (deliveryTime.min <= 1 ? $t('shipping_info.one_day') : $t('shipping_info.multiple_days', {days: __$(deliveryTime.min)})) }}</div>
      </div>
      <div class="di__item">
        <div class="di__imgWrapper">
          <img src="/svg/delivery-info/icon-outsideDhaka.svg" alt="">
        </div>
        <div class="di__copy1">{{ $t('shipping_info.outside_dhaka') }}</div>
        <div class="di__copy2">{{ (deliveryTime.max <= 1 ? $t('shipping_info.one_day') : $t('shipping_info.multiple_days', {days: __$(deliveryTime.max)})) }}</div>
      </div>
    </div>
    <button class="di__setPickupPoint Button" @click="redirectToPDA">{{ $t('shipping_info.set_point') }}</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { overlayMixin } from '~/utils'
export default {
  props: {
    deliveryTime: {
      type: Object,
      required: false
    }
  },
  mixins: [overlayMixin],
  computed: {
    ...mapState([
      'selectedPreferredAddress'
    ]),
    agentPickupCharge () {
      if (this.selectedPreferredAddress && this.selectedPreferredAddress.agent_pickup_charge) {
        return this.selectedPreferredAddress.agent_pickup_charge
      }
      return parseInt(process.env.AGENT_PICKUP)
    },
    homeDeliveryCharge () {
      if (this.selectedPreferredAddress && this.selectedPreferredAddress.home_delivery_charge) {
        return this.selectedPreferredAddress.home_delivery_charge
      }
      return parseInt(process.env.HOME_DELIVERY)
    }
  },
  methods: {
    redirectToPDA () {
      console.log(typeof this.insideDhaka)
      console.log(typeof this.outsideDhaka)
      this.openOverlay(this.overlays.preferredDeliveryPointModal)
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "shared/button.sass"
  .di
    position: relative
    &__setPickupPoint
      border: 1px solid #ddd
      width: 100%
      height: 36px
      font-size: 14px
      color: $black
      border-radius: 50em
      margin-top: 20px
      margin-bottom: 10px
      position: relative
      &::before
        content: ""
        width: 21px
        height: 21px
        position: absolute
        top: 0
        left: 0
        margin-top: 7px
        margin-left: 6px
        background-image: url(/svg/icons/icon-map-fill.svg)
    &__label
      font-size: 16px
      color: rgba($black, 0.64)
      line-height: 1.11
      margin-top: 20px
      text-decoration: underline
      margin-bottom: 15px
    &__list
      display: flex
      flex-flow: row wrap
      margin-top: 10px
    &__item
      position: relative
      width: 50%
    &__imgWrapper
      width: 32px
      height: 32px
      // background-color: rgba($black, 0.1)
      float: left
    &__copy1,
    &__copy2
      padding-left: 32px + 10
    &__copy1
      font-size: 12px
      line-height: 1.11
      text-transform: uppercase
      color: rgba($black, 0.34)
      font-weight: 700
    &__copy2
      color: $black
      font-size: 20px
      line-height: 1
      letter-spacing: 0.02em
</style>

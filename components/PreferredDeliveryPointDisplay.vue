<template>
  <address class="address">
    <label class="address__h4">{{ addressTitle }}</label>
    <template v-if="showDeliveryCharge">
      <p class="address__deliveryCharge" v-if="!isFreeDelivery">{{ $t('sidebar.cart.delivery_charge') }}: ৳ {{ __$(address.delivery_charge) }}</p>
      <p class="address__deliveryCharge" v-else-if="isFreeDelivery">{{ $t('sidebar.cart.delivery_charge') }}: {{ $t('delivery_process.free_delivery') }}</p>
    </template>

    <!-- <p class="address__deliveryCharge" v-if="preferredDeliveryAddress && preferredDeliveryAddress.max_delivery_time">{{ $t('shipping_info.estimated_title') }}:
      {{ (preferredDeliveryAddress.max_delivery_time <= 1 ? $t('shipping_info.one_day') : $t('shipping_info.multiple_days', {days: __$(preferredDeliveryAddress.max_delivery_time)})) }}
    </p> -->

    <div class="address__glance">
      <div class="address__images">
        <div class="address__images__shopImage" :class="bannerRandomColor">
          <computed-image v-if="address.banner_image" :src="address.banner_image"/>
        </div>
        <div class="address__images__personImage" :class="profileRandomColor">
          <img v-if="address.owner_type === 'Customer' && isLoggedIn && customer.avatar_url" :src="customer.avatar_url" :alt="customer.name">
          <computed-image v-else-if="address.profile_image" :src="address.profile_image"/>
          <img class="address__images__personImage__avatar" src="/svg/delivery-point/dgMan.svg" alt="">
        </div>
      </div>
      <div class="address__text">
        <p class="address__p" v-if="showContacts">{{ address.contact_name }} ({{ address.contact_number }})</p>
        <p class="address__p" v-else>{{ __(address.owner_name) }}</p>
        <p class="address__p">{{ address.address }}</p>
        <p class="address__p">{{ address.area }}, {{ address.location }}</p>
      </div>
    </div>
  </address>
</template>

<script>
  import ComputedImage from '~/components/ComputedImage'
  import { ADDRESS_TYPES, EVENT_SAVE_CART_RESPONSE_IN_CART } from '~/store/constants.yaml'
  import { i18nMixin, getRandomColorCssClass } from '~/utils'
  import i18nKeys from '~/pages/_lang/checkout/delivery-option.i18n.yaml'
  import enumMixinFactory from '~/utils/enum_mixin_factory.js'
  import { CouponDiscountType } from '~/utils/enums.yaml'
  import { mapState, mapGetters } from 'vuex'

  export default {
    mixins: [i18nMixin(i18nKeys), enumMixinFactory('CouponDiscountType')],
    props: ['address', 'showDeliveryCharge'],
    data () {
      return {
        isFreeDeliveryByCoupon: false
      }
    },
    mounted () {
      this.$root.$on(EVENT_SAVE_CART_RESPONSE_IN_CART, (response) => {
        if (response && response.user_coupon && response.user_coupon.discount_type === CouponDiscountType.FREE_DELIVERY) {
          this.isFreeDeliveryByCoupon = true
        } else {
          this.isFreeDeliveryByCoupon = false
        }
      })
    },
    components: {
      ComputedImage
    },
    computed: {
      ...mapState([
        'customer'
      ]),
      ...mapGetters([
        'preferredDeliveryAddress',
        'isLoggedIn'
      ]),
      deliveryCharge () {
        return parseInt(this.address.delivery_charge)
      },
      isFreeDelivery () {
        return this.isFreeDeliveryByCoupon || this.deliveryCharge === 0
      },
      addressTitle () {
        let addressTitle = null
        switch (this.address.owner_type) {
          case ADDRESS_TYPES.AGENT:
            addressTitle = this.i18nText.AgentsDeliveryLabel
            break
          case ADDRESS_TYPES.LOCKER:
            addressTitle = this.i18nText.LockerDeliveryLabel
            break
          case ADDRESS_TYPES.HUB:
            addressTitle = this.i18nText.pickupLabel
            break
          case ADDRESS_TYPES.CUSTOMER:
            addressTitle = this.i18nText.homeDeliveryLabel
            break
        }
        return addressTitle
      },
      bannerRandomColor () {
        return getRandomColorCssClass(this.address.address)
      },
      profileRandomColor () {
        return getRandomColorCssClass(this.address.contact_name)
      },
      showContacts () {
        return (this.$store.getters.isAgentMode && this.address.owner_type === ADDRESS_TYPES.AGENT) || this.address.owner_type === ADDRESS_TYPES.CUSTOMER
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import "shared/banner"

  .address
    position: relative
    font-style: normal
    line-height: 1.44
    color: #333333
    &__h4
      font-size: 16px
      font-weight: 400
      color: inherit
      display: block
    &__deliveryCharge
      font-size: 15px
      color: #999

    &__glance
      position: relative
      margin-top: 8px
      display: flex
      flex-flow: row nowrap
    &__images
      position: relative
      &__shopImage
        width: 80px
        height: 80px
        border-radius: 8px
        overflow: hidden
        // background-color: #eee
      &__personImage
        width: 50px
        height: 50px
        border: 5px solid $white
        border-radius: 38px
        // background-color: #ccc
        position: absolute
        top: 0
        right: 0
        margin-top: 35px
        margin-right: -5px
        overflow: hidden
        &__avatar
          width: 100%
    &__text
      position: relative
      color: inherit
      line-height: 1.66
      flex: 1
      padding-left: 10px
      overflow: hidden
      margin-top: 3px

    &__p
      font-weight: 400
      font-size: 14px
      color: inherit
</style>

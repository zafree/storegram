<template>
  <div>
    <div class="StreamAddress__glance">
      <div class="StreamAddress__images">
        <div class="StreamAddress__images__shopImage" :class="address.banner_random_color_class">
          <computed-image v-if="address.banner_image" :src="address.banner_image" @imageLoaded="bannerImageIsLoaded = true"/>
        </div>
        <div class="StreamAddress__images__personImage" :class="address.profile_random_color_class">
          <img v-if="isCustomerMode && isDeliveryMethodHome && isLoggedIn && customer.avatar_url" :src="customer.avatar_url" :alt="customer.name">
          <computed-image v-else-if="address.profile_image" :src="address.profile_image" @imageLoaded="profileImageIsLoaded = true"/>
          <img v-else src="/svg/delivery-point/dgMan.svg" alt="">
        </div>
      </div>
      <div class="StreamAddress__content">
        <h5 class="StreamAddress__content__shopName">{{ __(ownerNameOrContactName) }}</h5>
        <p class="StreamAddress__content__briefAddress" v-if="!isDeliveryMethodHome || (isDeliveryMethodHome && showSelectButton)">{{ address.address }}</p>
        <p class="StreamAddress__content__location">{{ __(address.area) + ', ' + __(address.location) }}</p>
        <p class="StreamAddress__content__personName" v-if="isDeliveryMethodHome">{{ __(address.contact_name) }} ({{ __(address.contact_number) }})</p>
      </div>
    </div>
    <div class="StreamAddress__action" v-if="!(preferredDeliveryAddress && address.id === preferredDeliveryAddress.id) && showSelectButton">
      <button class="Button Button--setDeliveryPoint" type="button" @click="updatePreferredDeliveryAddress(address)">{{ $t('preferred_delivery_point.set_delivery_point')}}</button>
    </div>
  </div>
</template>

<script>
  import i18nLink from '~/components/i18nLink'
  import Modal from '~/components/Modal'
  import AddressDisplay from '~/components/AddressDisplay'
  import ComputedImage from '~/components/ComputedImage'
  import DeliveryPoint from '~/components/DeliveryPoint'
  import { mapState, mapGetters } from 'vuex'
  import {
    overlayMixin,
    i18nMixin,
    deliveryMethodsPermissionMixin
  } from '~/utils'
  import i18nKeys from '~/pages/_lang/checkout/delivery-option.i18n.yaml'

  import {
    SAVE_CUSTOMER_INFO,
    PICKED_DELIVERY_METHODS,
    SET_SELECTED_PREFERRED_ADDRESS,
    EVENT_DELIVERY_ADDRESS_SELECTED_FROM_PDA_MODAL
  } from '~/store/constants.yaml'

  export default {
    props: {
      address: {
        type: Object,
        required: true
      },
      location: {
        type: Object,
        required: false
      },
      showSelectButton: {
        type: Boolean,
        required: true
      }
    },
    mixins: [overlayMixin, i18nMixin(i18nKeys), deliveryMethodsPermissionMixin],
    components: {
      Modal,
      AddressDisplay,
      i18nLink,
      ComputedImage,
      DeliveryPoint
    },
    data () {
      return {
        pickedDeliveryMethod: null,
        bannerImageIsLoaded: false,
        profileImageIsLoaded: false
      }
    },
    computed: {
      ...mapState([
        'usePreferredDeliveryModalForCheckout',
        'customer'
      ]),
      ...mapGetters([
        'isCustomerMode',
        'preferredDeliveryAddress',
        'isLoggedIn'
      ]),
      // UI
      isDeliveryMethodHome () {
        return this.pickedDeliveryMethod === PICKED_DELIVERY_METHODS.CUSTOMER
      },
      ownerNameOrContactName () {
        return this.address.owner_type === 'Customer' ? this.address.contact_name : this.address.owner_name
      }
    },
    methods: {
      updatePreferredDeliveryAddress (address) {
        let preferredDeliveryAddress = {
          ...address,
          home_delivery_charge: this.location && parseInt(this.location.home_delivery_charge) ? parseInt(this.location.home_delivery_charge) : parseInt(process.env.HOME_DELIVERY),
          agent_pickup_charge: this.location && parseInt(this.location.agent_delivery_charge) ? parseInt(this.location.agent_delivery_charge) : parseInt(process.env.AGENT_PICKUP)
        }
        this.$store.commit(SET_SELECTED_PREFERRED_ADDRESS, preferredDeliveryAddress)

        // if (this.usePreferredDeliveryModalForCheckout) {
        //   this.closePreferredDeliveryPointModal()
        // } else if (this.isLoggedIn) {
        this.$store.dispatch(SAVE_CUSTOMER_INFO, { preferred_delivery_address_id: address.id })
          .then(updatedUser => {
            this.$root.$emit(EVENT_DELIVERY_ADDRESS_SELECTED_FROM_PDA_MODAL, address)
            this.closePreferredDeliveryPointModal()
          })
          .catch(reason => {
            console.log(reason)
          })
        // } else {
        //   this.closePreferredDeliveryPointModal()
        // }
      }
    }
  }
</script>


<style lang="sass" scoped>
  @import "shared/banner"
  @import "shared/button"
  @import "shared/form/field"
  .Button
    &--setDeliveryPoint
      +btnPurple
      height: 40px
      font-size: 14px
      display: block
      width: 100%
      border-radius: 6px
      font-weight: $weight-medium
      +phablet
        font-size: 16px
        height: 44px  
  .StreamAddress
    &__glance
      display: flex
      flex-flow: row nowrap
    &__images
      position: relative
      &__shopImage
        width: 60px
        height: 60px
        border-radius: 6px
        overflow: hidden
        // background-color: #eee
      &__personImage
        width: 38px
        height: 38px
        border: 4px solid $white
        border-radius: 38px
        // background-color: #ccc
        position: absolute
        top: 0
        right: 0
        margin-top: 26px
        margin-right: -4px
        overflow: hidden
    &__content
      position: relative
      flex: 1
      line-height: 1.33
      padding-left: 5px
      overflow: hidden
      &__shopName
        font-size: 14px
        color: $dark
        line-height: inherit
        margin-top: 3px
        margin-bottom: 1px
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap
      &__briefAddress,
      &__location,
      &__personName
        font-size: 12px
        color: $light
        line-height: 1.55
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap

    &__action
      position: relative
      padding: 5px 0 0 
</style>


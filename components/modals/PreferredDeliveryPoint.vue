<template>
  <modal>
    <template slot="title">{{ $t('preferred_delivery_point.set_delivery_point') }}</template>
    <div class="SetDeliveryPoint">
      <div class="SetDeliveryPoint__Container">
        <div v-if="showMultiSelectors" class="Field Field--info Field--multiselect">
          <label :class="['Field__label', {'Field__label--red': (!deliveryLocation || !deliveryArea)}]">{{ $t('preferred_delivery_point.select_location_and_area_multiselect') }}</label>
          <div class="Field__control Field__control--multiselect">
            <custom-multiselect
              class="multiselect--location"
              :selected="deliveryLocation"
              :options="allDeliveryLocationsSorted"
              :placeholder="$t('preferred_delivery_point.place_location')"
              @setSelectedOption="setSelectedLocationFromChild"
            ></custom-multiselect>

            <custom-multiselect
              class="multiselect--area"
              :selected="deliveryArea"
              :options="allAreas"
              :placeholder="$t('preferred_delivery_point.place_area')"
              @setSelectedOption="setSelectedAreaFromChild"
            ></custom-multiselect>

          </div>
          <p class="Field__validation" v-if="isLocationNotActive">{{ $t('location_selector.no_service_message', {field: __(deliveryLocation.name)}) }}</p>
        </div>
        <template v-if="!isLocationNotActive">
          <div class="Field">
            <label class="Field__label">{{ $t('preferred_delivery_point.select_delivery_point') }}</label>
            <div class="Field__control">
              <div class="carouselRadio">
                <div class="carouselRadio__list">
                  <!-- add "agentAddresses.length" this conditional logic inside class -->
                  <div id="Agent" class="carouselRadio__item radio" v-if="isAgentDeliveryEnabledForCustomer">
                    <input class="radio__input" id="radioDeliveryPoint0" type="radio" name="deliveryPoint" v-model="pickedDeliveryMethod" value="Agent">
                    <label :class="['radio__label', 'Button', {'radio__label--isActive' : isDeliveryMethodAgent}, {'radio__label--isMuted': !isAgentAvailable}]" for="radioDeliveryPoint0">
                      <span class="radio__dgIcon">
                        <img v-if="!isAgentAvailable" src="/svg/delivery-point/icon-muted-dgAgent.svg" alt="">
                        <img v-else src="/svg/delivery-point/icon-dgAgent.svg" alt="">
                      </span>
                      <span class="radio__dgText">
                        <img v-if="!isAgentAvailable" src="/svg/delivery-point/text-muted-dgAgent.svg" alt="">
                        <img v-else src="/svg/delivery-point/text-dgAgent.svg" alt="">
                      </span>
                    </label>
                  </div>
                  <!-- add "lockerAddresses.length" this conditional logic inside class -->
                  <div id="Locker" class="carouselRadio__item radio" v-if="isLockerDeliveryEnabledForCustomer">
                    <input class="radio__input" id="radioDeliveryPoint1" type="radio" name="deliveryPoint" v-model="pickedDeliveryMethod" value="Locker">
                    <label :class="['radio__label', 'Button', {'radio__label--isActive' : isDeliveryMethodLocker}, {'radio__label--isMuted': !isLockerAvailable}]" for="radioDeliveryPoint1">
                      <span class="radio__dgIcon">
                        <img v-if="!isLockerAvailable" src="/svg/delivery-point/icon-muted-dgLocker.svg" alt="">
                        <img v-else src="/svg/delivery-point/icon-dgLocker.svg" alt="">
                      </span>
                      <span class="radio__dgText">
                        <img v-if="!isLockerAvailable" src="/svg/delivery-point/text-muted-dgLocker.svg" alt="">
                        <img v-else src="/svg/delivery-point/text-dgLocker.svg" alt="">
                      </span>
                    </label>
                  </div>
                  <!-- add "hubAddresses.length" this conditional logic inside class -->
                  <div id="Hub" class="carouselRadio__item radio" v-if="isHubDeliveryEnabledForCustomer">
                    <input class="radio__input" id="radioDeliveryPoint2" type="radio" name="deliveryPoint" v-model="pickedDeliveryMethod" value="Hub">
                    <label :class="['radio__label', 'Button', {'radio__label--isActive' : isDeliveryMethodHub}, {'radio__label--isMuted': !isHubAvailable}]" for="radioDeliveryPoint2">
                      <strong style="color:#333">Outlet</strong>
                    </label>
                  </div>
                  <div id="Customer" class="carouselRadio__item">
                    <input class="radio__input" id="radioDeliveryPoint3" type="radio" name="deliveryPoint" v-model="pickedDeliveryMethod" value="Customer">
                    <label :class="['radio__label', 'Button', {'radio__label--isActive' : isDeliveryMethodHome}]" for="radioDeliveryPoint3">
                      <strong style="color:#333">Home</strong>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="StreamAddress">
            <!-- preferred selected address display -->
            <template v-if="preferredDeliveryAddress">
              <p class="StreamAddress__note StreamAddress__note--isSelected">
                <slot v-if="preferredDeliveryAddress.owner_type === 'Customer'">{{ $t('preferred_delivery_point.selected_home_delivery_address') }}</slot>
                <slot v-else>{{ $t('preferred_delivery_point.selected_address', { deliveryMethod: $t('preferred_delivery_point.' + preferredDeliveryAddress.owner_type) } ) }}</slot>
              </p>
              <div :class="['StreamAddress__item', 'StreamAddress__item--isSelected']">
                <div class="StreamAddress__glance">
                  <div class="StreamAddress__images">
                    <div class="StreamAddress__images__shopImage" :class="pdaRandomBannerCssClass">
                      <computed-image v-if="preferredDeliveryAddress.banner_image" :src="preferredDeliveryAddress.banner_image" @imageLoaded="bannerImageIsLoaded = true"/>
                    </div>
                    <div class="StreamAddress__images__personImage" :class="pdaRandProfileCssClass">
                      <!-- <img v-if="preferredDeliveryAddress.owner_type === 'Customer' && isCustomerMode && isDeliveryMethodHome && isLoggedIn && customer.avatar_url" :src="customer.avatar_url" :alt="customer.name"> -->
                      <computed-image v-if="preferredDeliveryAddress.profile_image" :src="preferredDeliveryAddress.profile_image" @imageLoaded="profileImageIsLoaded = true"/>
                      <img src="/svg/delivery-point/dgMan.svg" alt=""> 
                    </div>
                  </div>
                  <div class="StreamAddress__content">
                    <h5 class="StreamAddress__content__shopName">{{ __(preferredDeliveryAddress.owner_name) }}</h5>
                    <p class="StreamAddress__content__briefAddress">{{ preferredDeliveryAddress.address }}</p>
                    <p class="StreamAddress__content__location">{{ __(preferredDeliveryAddress.area) + ', ' + __(preferredDeliveryAddress.location) }}</p>
                    <p class="StreamAddress__content__personName" v-if="preferredDeliveryAddress.owner_type === 'Customer'">{{ __(preferredDeliveryAddress.contact_name) }} ({{ __(preferredDeliveryAddress.contact_number) }})</p>
                  </div>
                </div>
              </div>
            </template>

            <!-- no agent/locker/hub address in selected location/area  -->
            <p v-if="deliveryLocation && selectedPickMethodAddressListWithPagination.length < 1 && !isDeliveryMethodHome" class="StreamAddress__note">
              {{ $t('preferred_delivery_point.no_address_found',
                {
                  deliveryMethod: $t('preferred_delivery_point.' + pickedDeliveryMethod),
                  place: deliveryArea ? __(deliveryArea.name) : __(deliveryLocation.name)
                })
              }}
              <a class="Button Button--link" href="mailto:hello@deligram.com">hello@deligram.com</a>
            </p>

            <template v-if="showAddressList">
              <p v-if="!deliveryLocation && !deliveryArea && !isDeliveryMethodHome" class="StreamAddress__note StreamAddress__note--info">
                {{ $t('preferred_delivery_point.select_location_and_area', { deliveryMethod: $t('preferred_delivery_point.' + pickedDeliveryMethod) }) }}
              </p>

              <p v-if="deliveryLocation && !deliveryArea && !!selectedPickMethodAddressListWithPagination.length && !isDeliveryMethodHome" class="StreamAddress__note StreamAddress__note--info">
                  {{ $t('preferred_delivery_point.select_area', { deliveryMethod: $t('preferred_delivery_point.' + pickedDeliveryMethod) }) }}
              </p>

              <!-- one or multiple agent/locker/hub address in selected location/area  -->
              <p v-if="(deliveryLocation && deliveryArea) && selectedPickMethodAddressListWithPagination.length > 0 && !isDeliveryMethodHome" class="StreamAddress__note">
                {{ $t('preferred_delivery_point.address_found',
                  {
                    deliveryMethod: $t('preferred_delivery_point.' + pickedDeliveryMethod),
                    place: deliveryArea ? __(deliveryArea.name) : __(deliveryLocation.name)
                  })
                }}
              </p>

              <!-- open login modal option if customer is not logged in and picked method is home delivery -->
              <template v-if="!isLoggedIn && isDeliveryMethodHome">
                <p class="StreamAddress__note">{{ $t('preferred_delivery_point.login_to_see_home_addresses') }}</p>
                <button class="Button Button--line" @click="openLoginModal" type="button">{{ $t('sidebar.nav.sign_in') + ' ' + $t('sidebar.nav.sign_up') }}</button>
              </template>

              <!-- go to add home address page in profile if customer is logged in and picked method is home delivery -->
              <template v-if="isLoggedIn && selectedPickMethodAddressListWithPagination.length === 0 && isDeliveryMethodHome">
                <p class="StreamAddress__note">{{ $t('preferred_delivery_point.found_no_home_address', { place: deliveryArea ? __(deliveryArea.name) : $t('preferred_delivery_point.place_area') }) }}</p>
                <i18n-link class="Button Button--line" :to="'/customer/delivery-addresses'">{{ $t('preferred_delivery_point.click_here_to_create_home_address') }}</i18n-link>
              </template>

              <p v-if="isLoggedIn && selectedPickMethodAddressListWithPagination.length > 0 && isDeliveryMethodHome" class="StreamAddress__note">
                {{ $t('preferred_delivery_point.your_home_addresses') }}
              </p>

              <ul class="StreamAddress__list">
                <li :class="['StreamAddress__item', { 'StreamAddress__item--isActive': key !== addressToBeSelectedKey }]" v-for="(address, key) in selectedPickMethodAddressListWithPagination" :key="key" @click="showAddressSelectButton(key)">
                  <delivery-point :address="address" :location="deliveryLocation" :showSelectButton="key === addressToBeSelectedKey"></delivery-point>
                </li>
              </ul>
            </template>
          </div>
        </template>
      </div>
    </div>
    <template slot="actions">
      <button :class="[$style.button, $style.buttonModalClose]" type="button" name="button" @click="closePreferredDeliveryPointModal">
        <img :class="[$style.buttonIconSvg, $style.buttonIconSvgLeft ]" src="/svg/icon-emi.svg" alt=""> 
      </button>
    </template>
    <span v-observe-visibility="visibilityChanged" height="1px" width="1px"></span>
  </modal>
</template>

<script>
  import { getPickupPoints } from '~/api'
  import cloneDeep from 'lodash/cloneDeep'
  import i18nLink from '~/components/i18nLink'
  import { ObserveVisibility } from 'vue-observe-visibility'
  import Modal from '~/components/Modal'
  import AddressDisplay from '~/components/AddressDisplay'
  import CustomMultiselect from '~/components/CustomMultiselect'
  import ComputedImage from '~/components/ComputedImage'
  import DeliveryPoint from '~/components/DeliveryPoint'
  import { mapState, mapGetters } from 'vuex'
  import { overlayMixin, i18nMixin, getRandomColorCssClass, deliveryMethodsPermissionMixin } from '~/utils'
  import i18nKeys from '~/pages/_lang/checkout/delivery-option.i18n.yaml'

  import {
    SAVE_CUSTOMER_INFO,
    SET_SELECTED_PREFERRED_ADDRESS,
    PICKED_DELIVERY_METHODS,
    SET_PREFERRED_DELIVERY_METHOD,
    SET_OVERLAY_CONTEXT,
    SET_PREFERRED_DELIVERY_MODAL_FOR_CHECKOUT,
    EVENT_DELIVERY_ADDRESS_SELECTED_FROM_PDA_MODAL
  } from '~/store/constants.yaml'

  const PAGINATION_LIMIT = 10

  export default {
    mixins: [overlayMixin, i18nMixin(i18nKeys), deliveryMethodsPermissionMixin],
    components: {
      CustomMultiselect,
      Modal,
      AddressDisplay,
      i18nLink,
      ComputedImage,
      DeliveryPoint
    },
    directives: {
      ObserveVisibility
    },
    watch: {
      pickedDeliveryMethod: {
        handler: function (nval, oval) {
          if (this.initialized) {
            this.addressToBeSelectedKey = null
            this.enableVisibilityChanged = false
            this.listStartsFrom = 0
            this.endOfResult = false
            this.addressToBeSelectedKey = null
            this.selectedPickMethodAddressListWithPagination = []
            this.getPickupPoints(`pickedDeliveryMethod ${nval}`)
          }
        },
        immediate: false
      },
      deliveryLocation: {
        handler: function (nval, oval) {
          if (this.initialized) {
            this.enableVisibilityChanged = false
            this.deliveryArea = null
            this.listStartsFrom = 0
            this.endOfResult = false
            this.addressToBeSelectedKey = null
            this.selectedPickMethodAddressListWithPagination = []
            this.getPickupPoints(`deliveryLocation ${nval}`)
          }
        },
        immediate: false
      },
      deliveryArea: {
        handler: function (nval, oval) {
          if (this.initialized && nval) {
            this.enableVisibilityChanged = false
            this.listStartsFrom = 0
            this.addressToBeSelectedKey = null
            this.endOfResult = false
            this.selectedPickMethodAddressListWithPagination = []
            this.getPickupPoints(`deliveryArea ${nval}`)
          }
        },
        immediate: false
      }
    },
    created () {
      this.init()
      this.getPickupPoints('created')
        .finally(() => {
          if (this.preferredDeliveryAddress) {
            this.pdaRandomBannerCssClass = getRandomColorCssClass(this.preferredDeliveryAddress.address)
            this.pdaRandProfileCssClass = getRandomColorCssClass(this.preferredDeliveryAddress.contact_name)
          }
        })
    },
    beforeDestroy () {
      this.$store.commit(SET_PREFERRED_DELIVERY_METHOD, null)
      this.$store.commit(SET_PREFERRED_DELIVERY_MODAL_FOR_CHECKOUT, false)
    },
    data () {
      return {
        enableVisibilityChanged: false,
        deliveryLocation: null,
        deliveryArea: null,
        pickedDeliveryMethod: null,
        addressToBeSelectedKey: null,
        listStartsFrom: 0,
        apiCallInProgress: false,
        endOfResult: false,
        initialized: false,
        pdaRandomBannerCssClass: null,
        pdaRandProfileCssClass: null,
        selectedPickMethodAddressListWithPagination: [],
        profileImageIsLoaded: false,
        bannerImageIsLoaded: false
      }
    },
    computed: {
      ...mapState([
        'allLocations',
        'allPickupPoints',
        'preferredDeliveryMethod',
        'usePreferredDeliveryModalForCheckout',
        'customer'
      ]),
      ...mapGetters([
        'isAgentMode',
        'isCustomerMode',
        'sortByName',
        'allDeliveryLocationsSorted',
        'preferredDeliveryAddress',
        'isLoggedIn'
      ]),
      // UI
      showAddressList () {
        // when preferred delivery address for certain delivery method, and area-location (if selected) is available and in
        // that certain delivery method, and area-location (if selected), only one address available (the preferred delivery address itself)
        let pdaMatchedWithPickedMethod = this.preferredDeliveryAddress && this.preferredDeliveryAddress.owner_type === this.pickedDeliveryMethod
        let pdaMatchedWithDeliveryArea = (this.deliveryArea && this.preferredDeliveryAddress && this.preferredDeliveryAddress.area_id === this.deliveryArea.id)
        let pdaMatchedWithDeliveryLocation = (this.deliveryLocation && this.preferredDeliveryAddress && this.preferredDeliveryAddress.location_id === this.deliveryLocation.id)
        let addressListEmpty = this.selectedPickMethodAddressListWithPagination.length < 1
        return !(pdaMatchedWithPickedMethod && (pdaMatchedWithDeliveryArea || pdaMatchedWithDeliveryLocation) && addressListEmpty)
      },
      isDeliveryMethodAgent () {
        return this.pickedDeliveryMethod === PICKED_DELIVERY_METHODS.AGENT
      },
      isDeliveryMethodHub () {
        return this.pickedDeliveryMethod === PICKED_DELIVERY_METHODS.HUB
      },
      isDeliveryMethodLocker () {
        return this.pickedDeliveryMethod === PICKED_DELIVERY_METHODS.LOCKER
      },
      isDeliveryMethodHome () {
        return this.pickedDeliveryMethod === PICKED_DELIVERY_METHODS.CUSTOMER
      },
      isAgentAvailable () {
        if (this.deliveryArea) {
          return this.deliveryArea.agent_available
        } else if (this.deliveryLocation) {
          return this.deliveryLocation.agent_available
        } else return true
      },
      isLockerAvailable () {
        if (this.deliveryArea) {
          return this.deliveryArea.locker_available
        } else if (this.deliveryLocation) {
          return this.deliveryLocation.locker_available
        } else return true
      },
      isHubAvailable () {
        if (this.deliveryArea) {
          return this.deliveryArea.hub_available
        } else if (this.deliveryLocation) {
          return this.deliveryLocation.hub_available
        } else return true
      },
      allAreas () {
        return (this.deliveryLocation && parseInt(this.deliveryLocation.is_active)) ? this.sortByName(this.deliveryLocation.areas.filter(a => parseInt(a.is_delivery_area))) : []
      },
      customerAddresses () {
        if (this.customer) {
          let sortedAddress = cloneDeep(this.customer.addresses).sort((a, b) => {
            if (a.owner_name < b.owner_name) { return -1 }
            if (a.owner_name > b.owner_name) { return 1 }
            return 0
          })
          if (this.isAgentMode && this.deliveryArea) {
            sortedAddress = sortedAddress.filter(a => a.area_id === this.deliveryArea.id)
          }
          return sortedAddress
        }
        return []
      },
      isLocationNotActive () {
        if (this.deliveryLocation) {
          return !(this.deliveryLocation.is_active)
        }
      },
      showMultiSelectors () {
        return this.isCustomerMode
      }
    },
    methods: {
      init () {
        if (this.usePreferredDeliveryModalForCheckout) {
          this.deliveryLocation = this.allLocations.find(l => l.id === this.usePreferredDeliveryModalForCheckout.location_id)
          this.deliveryArea = this.allAreas.find(a => a.id === this.usePreferredDeliveryModalForCheckout.area_id)
        } else if (this.preferredDeliveryAddress) {
          this.deliveryLocation = this.allLocations.find(l => l.id === this.preferredDeliveryAddress.location_id)
          this.deliveryArea = this.allAreas.find(a => a.id === this.preferredDeliveryAddress.area_id)
        }

        if (this.preferredDeliveryMethod) {
          switch (this.preferredDeliveryMethod) {
            case PICKED_DELIVERY_METHODS.AGENT:
              this.pickedDeliveryMethod = PICKED_DELIVERY_METHODS.AGENT
              break
            case PICKED_DELIVERY_METHODS.LOCKER:
              this.pickedDeliveryMethod = PICKED_DELIVERY_METHODS.LOCKER
              break
            case PICKED_DELIVERY_METHODS.HUB:
              this.pickedDeliveryMethod = PICKED_DELIVERY_METHODS.HUB
              break
            case PICKED_DELIVERY_METHODS.CUSTOMER:
              this.pickedDeliveryMethod = PICKED_DELIVERY_METHODS.CUSTOMER
              break
          }
        } else {
          this.pickedDeliveryMethod = this.preferredDeliveryAddress ? this.preferredDeliveryAddress.owner_type : PICKED_DELIVERY_METHODS.AGENT
        }

        // this.setFallbackPickedDeliveryMethod()

        let elementToScrollIntoView = document.getElementById(this.pickedDeliveryMethod)
        if (elementToScrollIntoView) {
          elementToScrollIntoView.scrollIntoView(false)
        }

        setTimeout(() => { this.initialized = true }, 0)
      },
      sortByOwnerName (list) {
        let clonedList = cloneDeep(list)
        return clonedList.sort((a, b) => {
          if (a.owner_name.en[0] < b.owner_name.en[0]) { return -1 }
          if (a.owner_name.en[0] > b.owner_name.en[0]) { return 1 }
          return 0
        })
      },
      updatePreferredDeliveryAddress (address) {
        this.$store.commit(SET_SELECTED_PREFERRED_ADDRESS, address)

        if (this.usePreferredDeliveryModalForCheckout) {
          this.$root.$emit(EVENT_DELIVERY_ADDRESS_SELECTED_FROM_PDA_MODAL, address)
          this.closePreferredDeliveryPointModal()
        } else if (this.isLoggedIn) {
          this.$store.dispatch(SAVE_CUSTOMER_INFO, { preferred_delivery_address_id: address.id })
            .then(updatedUser => {
              this.closePreferredDeliveryPointModal()
            })
            .catch(reason => {
              console.log(reason)
            })
        } else {
          this.closePreferredDeliveryPointModal()
        }
      },
      showAddressSelectButton (key) {
        this.addressToBeSelectedKey = key
      },
      translatedValue (deliveryLocation) {
        if (deliveryLocation) {
          return this.__(deliveryLocation.name)
        } return null
      },
      visibilityChanged (isVisible, entry) {
        if (!this.enableVisibilityChanged) {
          this.enableVisibilityChanged = true
          return
        }
        if (isVisible && !this.apiCallInProgress && !this.endOfResult) {
          this.apiCallInProgress = true
          this.listStartsFrom += PAGINATION_LIMIT
          this.getPickupPoints('visibilityChanged')
        }
      },
      getPickupPoints (from) {
        if (this.isDeliveryMethodHome) {
          this.selectedPickMethodAddressListWithPagination = this.customerAddresses.filter(a => a.id !== this.preferredDeliveryAddress.id)
          for (let address of this.selectedPickMethodAddressListWithPagination) {
            address.profile_random_color_class = getRandomColorCssClass(address.address)
            address.banner_random_color_class = getRandomColorCssClass(address.contact_name)
          }
          return Promise.resolve()
        }
        return getPickupPoints({
          owner_type: this.pickedDeliveryMethod ? (this.pickedDeliveryMethod).toLowerCase() : null,
          location_id: this.deliveryLocation ? this.deliveryLocation.id : null,
          area_id: this.deliveryArea ? this.deliveryArea.id : null,
          from: this.listStartsFrom,
          take: PAGINATION_LIMIT
        })
        .then(response => {
          if (this.preferredDeliveryAddress) {
            response = response.filter(a => a.id !== this.preferredDeliveryAddress.id)
          }
          this.selectedPickMethodAddressListWithPagination = [...this.selectedPickMethodAddressListWithPagination, ...response]

          // if (this.preferredDeliveryAddress && this.preferredDeliveryAddress.owner_type === this.pickedDeliveryMethod && this.selectedPickMethodAddressListWithPagination.length > 0) {
            // shifting the preferred delivery address to the top
            // listWithPagination = listWithPagination.filter((a) => a.id !== this.preferredDeliveryAddress.id)
            // listWithPagination = [this.preferredDeliveryAddress, ...listWithPagination]
          // }

          for (let address of this.selectedPickMethodAddressListWithPagination) {
            address.profile_random_color_class = getRandomColorCssClass(address.address)
            address.banner_random_color_class = getRandomColorCssClass(address.contact_name)
          }
          this.endOfResult = response.length < PAGINATION_LIMIT
        })
        .finally(() => {
          this.apiCallInProgress = false
        })
      },
      openLoginModal () {
        this.$store.commit(SET_OVERLAY_CONTEXT, { openPreferredDeliveryPointModalAfterLogin: true })
        this.openOverlay(this.overlays.loginModal)
      },
      setSelectedLocationFromChild (option) {
        this.deliveryLocation = option
      },
      setSelectedAreaFromChild (option) {
        this.deliveryArea = option
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import "shared/banner"
  @import "shared/button"
  @import "shared/form/field"

  .Button
    &--link
      padding: 0
      color: $purple
    &--line
      border: 1px solid #d9d9d9
      height: 36px
      padding: 0 10px
      font-size: 14px
      color: $dark
      fill: $dark
      display: inline-flex
      align-items: center
  .Field
    &--multiselect
      z-index: 10
    &__label
      padding-left: 0
      padding-right: 0
      color: $light
      font-size: 13px
      margin-bottom: 10px
      &--red
        color: $red

  .radio
    $root: &;
    &:not(:first-child)
      margin-top: 0
    &__label
      width: 110px
      min-height: 40px
      height: auto
      border-radius: 3px
      padding: 10px
      display: flex
      flex-direction: column
      align-items: center
      background-color: $white
      color: $white
      font-size: 16px
      border: 3px solid #dddddd
      &:hover,
      &:focus
        // color: $white
        border-color: $black
      &--isActive
        border-color: $purple
        &:hover,
        &:focus
          border-color: $purple
      &--isMuted
        border-color: #ddd
        &.radio__label--isActive
          border-color: #777
    &__dgIcon
      width: 80px
      height: 80px
    &__dgText
      flex: 1 100%
      margin-top: 2px


  .carouselRadio
    &__list
      display: flex
      flex-direction: row
      margin-left: -15px
      margin-right: -15px
      padding-left: 15px
      padding-bottom: 10px
      margin-bottom: -5px
      overflow-x: auto
      +phablet
        margin-left: -30px
        margin-right: -30px
        padding-left: 30px

    &__item
      position: relative
      margin-right: 5px
      &:last-child
        box-sizing: content-box
        padding-right: 15px
        +phablet
          padding-right: 30px


  .SetDeliveryPoint
    position: relative
    margin: -30px -30px 0
    +phablet
      margin: 0
    &__Container
      position: relative
      padding: 15px
      +phablet
        padding: 0

  .StreamAddress
    position: relative

    $root: &;

    &__note
      color: $light
      line-height: 1.33
      font-size: 13px
      margin-bottom: 10px
      &--info
        color: darken($cyan, 20%)
      &--isSelected
        margin-top: -10px
        color: $purple

    &__list
      list-style: none
      padding: 0
      margin: 0
      position: relative
    &__item
      position: relative
      border: 1px solid #ddd
      padding: 5px
      border-radius: 8px
      margin-bottom: 10px
      cursor: pointer
      &--isActive
        #{$root}__content
          &__shopName,
          &__briefAddress,
          &__location,
          &__personName
            text-overflow: initial
            white-space: normal
      &--isSelected
        border-width: 2px
        border-color: lighten($purple, 40%)
        background-color: lighten($purple, 58%)
        margin-bottom: 20px
        .StreamAddress__images__personImage
          border-color: lighten($purple, 55%)

        // display: flex
        // flex-flow: row wrap
        // #{$root}__glance
        //   flex: 1
        // #{$root}__action
        //   // width: 40px
        //   padding: 0
        //   display: inline-flex
        //   align-items: center
        //   // background-color: rgba(black, .1)
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

<style lang="sass" module>
  @import "shared/button"

  .Button
    &--modalClose
      color: #777
      fill: #777
      &:hover,
      &:focus
        color: #555
        fill: #555

  .SvgIcon
    &--logo
      margin-right: 170px
    &--elements
      position: absolute
</style>

<style scoped>
  .address_list {
    height: 50vh;
    overflow: scroll;
  }
</style>


<template>
  <div :class="$style.checkout">
    <h1 :class="$style.checkoutPageTitle">Checkout</h1>
    <div :class="$style.checkoutRow">
      <div :class="$style.checkoutCol1">
        <cart :class="[$style.checkoutStep, $style.checkoutStepCart]"></cart>
      </div>
      <div :class="$style.checkoutCol2">
        <div :class="$style.checkoutStep">
          <div :class="$style.checkoutStepTitle">
            <span>{{ i18nText.checkoutStepsCustomerDetails }}</span>
            <span :class="$style.checkoutStepDone">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                <use xlink:href="/svg/icons.svg?#i-done"></use>
              </svg>
            </span>
          </div>
        </div>
        <div :class="[$style.checkoutStep, $style.checkoutStepActive]">
          <div :class="$style.checkoutStepTitle">
            <span>{{ i18nText.checkoutStepsDeliveryDetails }}</span>
          </div>
          <div :class="$style.checkoutStepBody">


            <!-- Alert -->
            <div class="Alert Alert--danger Alert--hasCartError" v-if="cartErrorExists">
              <p class="Alert__copy" v-html="i18nText.cartIssueWarning"></p>
            </div>

            <!-- <address-display addressTitle="PreferredDeliveryAddress" :address="preferredDeliveryAddress"/> -->
            <template v-if="preferredDeliveryAddress && usePreferredDeliveryAddress">
              <!-- Alert -->
              <div class="Alert Alert--danger Alert--preferredDeliveryAddress" v-if="preferredDeliveryAddress && preferredDeliveryAddress.owner_type === 'Locker' && !preferredDeliveryAddress.accept_new_orders">
                <p class="Alert__copy" v-html="i18nText.LockerErrorSingle"></p>
              </div>
              <preferred-delivery-point-display :showDeliveryCharge="true" :address="preferredDeliveryAddress" />
              <button :class="[$style.btn, $style.btnUseDiffAddress]" @click="togglePreferredAddress">{{ $t('delivery_process.use_different_delivery_point') }}</button>
            </template>
            <!-- v-if="usePreferredDeliveryAddress" -->

            <!--Delivery Location-->
            <template v-else>

              <!-- go back to pda button -->
              <button :class="[$style.btn, $style.btnBack]" v-if="preferredDeliveryAddress" @click="togglePreferredAddress">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                  <use xlink:href="/svg/icons.svg?#i-arrow"></use>
                </svg>
                <span>{{ $t('delivery_process.go_back') }}</span>
              </button>

              <!-- guided text -->
              <div :class="$style.field" v-if="!(deliveryLocation && deliveryArea)">
                <p :class="$style.fieldInfo">{{ $t('delivery_process.select_location_area_to_see_delivery_options') }}</p>
              </div>
              <div :class="$style.field">
                <label :class="$style.fieldLabel">{{ i18nText.locationLabel }}</label>
                <custom-multiselect
                  :selected="deliveryLocation"
                  :options="allDeliveryLocationsSorted"
                  :placeholder="i18nText.locationSelectorPlaceholder"
                  @setSelectedOption="setSelectedLocationFromChild"
                ></custom-multiselect>
                <p :class="$style.fieldValidation" v-if="isLocationNotActive">{{noServiceMessage}}</p>
              </div>

              <div :class="$style.field">
                <label :class="$style.fieldLabel">{{ i18nText.areaLabel }}</label>
                <custom-multiselect
                  :selected="deliveryArea"
                  :options="allAreas"
                  :placeholder="i18nText.areaSelectorPlaceholder"
                  @setSelectedOption="setSelectedAreaFromChild"
                ></custom-multiselect>
              </div>


              <!-- NWEEEEEEEEEEEEEEEEEEEEE -->
              <!-- NWEEEEEEEEEEEEEEEEEEEEE -->
              <!-- NWEEEEEEEEEEEEEEEEEEEEE -->
              <template v-if="deliveryArea">
                <div :class="$style.field">
                  <label :class="$style.fieldLabel">{{ i18nText.deliveryMethod }}</label>
                  <div :class="$style.dmOption">
                    <button :class="[$style.dmOptionBtn, $style.btn, $style.btnLine, {[$style.dmOptionBtnActive]: isDeliveryMethodHome}]" @click="pickedDeliveryMethod = 'Customer'">Home Delivery</button>
                    <button :class="[$style.dmOptionBtn, $style.btn, $style.btnLine, {[$style.dmOptionBtnActive]: isDeliveryMethodPickup}, {[$style.btnMuted]: !deliveryArea.hub_available}]" :disabled="!deliveryArea.hub_available" @click="pickedDeliveryMethod = 'Hub'">Pickup from outlet</button>
                  </div>

                  <template  v-if="isDeliveryMethodHome">
                    <div :class="$style.dmOptionBody">
                      <p :class="[$style.copy, $style.copyDeliveryCharge]">Delivery charge Tk. {{ __$(homeDeliveryCharge) }}</p>
                      <div :class="[$style.field, {[$style.fieldError]: errors.delivery_address }, {[$style.fieldSuccess]: errors.delivery_address === false }]">
                        <label :class="$style.fieldLabel">{{ i18nText.homeDeliveryAddressLabel }}</label>
                        <div :class="$style.fieldControl">
                          <textarea :class="[$style.fieldInput, $style.fieldInputTextarea]" :placeholder="i18nText.homeDeliveryAddressPlaceholder" v-model="newDeliveryAddress.address" :rows="3"></textarea>
                        </div>
                        <p :class="$style.fieldValidation" v-if="errors.delivery_address">{{ errors.delivery_address }}</p>
                      </div>
                      <div :class="[$style.field, {[$style.fieldError]: errors.contact_name }, {[$style.fieldSuccess]: errors.contact_name === false }]">
                        <label :class="$style.fieldLabel">{{ i18nText.homeDeliveryRecieverName }}</label>
                        <div :class="$style.fieldControl">
                          <input :class="$style.fieldInput" type="text" :placeholder="i18nText.homeDeliveryRecieverNamePlaceholder" v-model="newDeliveryAddress.contact_name">
                        </div>
                        <p :class="$style.fieldValidation" v-if="errors.contact_name">{{ errors.contact_name }}</p>
                      </div>
                      <div :class="[$style.field, {[$style.fieldError]: errors.receiver_number }, {[$style.fieldSuccess]: errors.receiver_number === false }]">
                        <label :class="$style.fieldLabel">{{ i18nText.homeDeliveryMobileNumber }}</label>
                        <div :class="$style.fieldControl">
                          <select :class="$style.fieldInput" v-model="newDeliveryAddress.contact_number" v-if="hasCustomerMultipleNumbers">
                            <option
                              v-for="number in mobileNumbers"
                              :key="number.id"
                              :value="number.number">{{ number.number }}</option>
                            <option value="ADD_ANOTHER">{{ i18nText.useAnother }}</option>
                          </select>
                          <input v-else :class="$style.fieldInput" type="text" :placeholder="i18nText.homeDeliveryMobileNumberPlaceholder" v-model="newDeliveryAddress.contact_number">
                        </div>
                        <p :class="$style.fieldValidation" v-if="errors.receiver_number">{{ errors.receiver_number }}</p>
                      </div>
                    </div>
                  </template>
                  <template v-if="isDeliveryMethodPickup">
                    <div :class="$style.dmOptionBody">
                      <p :class="[$style.copy, $style.copyDeliveryCharge]" v-if="hubDeliveryCharge">Delivery charge Tk. {{ __$(hubDeliveryCharge) }}</p>
                      <p :class="[$style.copy, $style.copyDeliveryCharge]" v-else>{{ i18nText.freeDelivery }}</p>
                    </div>
                  </template>
                  <!-- <div v-if="isDeliveryMethodPickup">Input field</div> -->
                </div>
              </template>

              <!-- <div :class="$style.field">
                <label :class="$style.fieldLabel">{{ i18nText.areaLabel }}</label>
                <div :class="$style.fieldControl">
                  <input :class="$style.fieldInput" type="text" placeholder="Enter you delivery address">
                </div>
                <p :class="$style.fieldValidation">Error</p>
              </div> -->
            </template>

            <template v-if="isDeliveryMethodHome || isDeliveryMethodPickup">
              <div :class="$style.field">
                <label :class="$style.fieldLabel">{{ i18nText.additionalNote }}</label>
                <div :class="$style.fieldControl">
                  <textarea :class="[$style.fieldInput, $style.fieldInputTextarea]" :placeholder="i18nText.additionalNotePlaceHolder" v-model="additional_note" :rows="1"></textarea>
                </div>
              </div>
              <div :class="$style.field">
                <input id="invoice_permission" :class="$style.fieldCheckbox" type="checkbox" v-model="customerWantsInvoice">
                <label for="invoice_permission" :class="$style.fieldLabel">{{ i18nText.sendInvoice }}</label>
              </div>
              <div v-if="customerWantsInvoice" :class="[$style.field, $style.mt0, {[$style.fieldError]: errors.invoice_email}, {[$style.fieldSuccess]: errors.invoice_email === false}]">
                <label :class="$style.fieldLabel">{{ i18nText.invoiceEmail }}</label>
                <div :class="$style.fieldControl">
                  <input :class="$style.fieldInput" type="text" :placeholder="i18nText.invoiceEmailPlaceholder" v-model="invoiceEmailData">
                </div>
                <p :class="$style.fieldValidation" v-if="errors.invoice_email">{{ errors.invoice_email }}</p>
              </div>
              <div :class="$style.field">
                <button :class="[$style.btn, $style.btnPrimary, {[$style.btnMuted]: disableConfirmOrder}]" @click="confirmOrder()" :disabled="disableConfirmOrder">{{ i18nText.confirmOrder }}</button>
              </div>
            </template>

          </div>
        </div>
        <div :class="$style.checkoutStep">
          <div :class="$style.checkoutStepTitle">
            <span>{{ i18nText.checkoutStepsPayment }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Cart from '~/components/layouts/Cart'
  import isEmpty from 'lodash/isEmpty'
  import find from 'lodash/find'
  import last from 'lodash/last'
  // import head from 'lodash/head'

  import logger from '~/utils/logger'

  import i18nLink from '~/components/i18nLink'
  import CustomMultiselect from '~/components/CustomMultiselect'
  import AddressDisplay from '~/components/AddressDisplay'
  import PreferredDeliveryPointDisplay from '~/components/PreferredDeliveryPointDisplay'

  import {
    i18nMixin,
    i18nRedirect,
    cartCalculationMixin,
    deliveryMethodsPermissionMixin,
    overlayMixin,
    partialAsteriskSensoredPhoneNumber
  } from '~/utils'

  import {
    gaEnhancedEcom
  } from '~/utils/ga-ec'

  import {
    ga
  } from '~/utils/ga'

  import {
    PICKED_DELIVERY_METHODS,
    ADDRESS_TYPES,
    CLEAR_CART,
    SAVE_CART,
    HANDLE_APPLIED_COUPON,
    EVENT_DELIVERY_CHARGE_CALCULATED,
    EVENT_SAVE_CART_RESPONSE_IN_CART,
    EVENT_DELIVERY_ADDRESS_SELECTED_FROM_PDA_MODAL,
    SAVE_CUSTOMER_INFO,
    LOGOUT_CUSTOMER,
    LOAD_AGENT_COMMISSION,
    EVENT_AGENT_BALANCE,
    // EVENT_ADJUSTED_BALANCE,
    LOAD_CART_ITEM_INFO,
    RAISE_ERROR_IF_LINEITEMS_NOT_AGENT_DELIVERABLE,
    RAISE_ERROR_IF_LINEITEMS_NOT_LOCKER_DELIVERABLE,
    UPDATE_CART_ERROR_STATE,
    API_ERRORS,
    SET_PAGE_NOTIFICATION,
    SET_PREFERRED_DELIVERY_METHOD,
    SET_PREFERRED_DELIVERY_MODAL_FOR_CHECKOUT,
    LOGOUT_AGENT
  } from '~/store/constants.yaml'

  import {
    createOrder
  } from '~/api'

  import { ENHANCE_ECOM } from '~/utils/ga-meta.yaml'

  import { mapState, mapGetters } from 'vuex'

  import i18nKeys from '~/pages/_lang/checkout/delivery-option.i18n.yaml'

  const verifyUserPath = '/checkout/verify-user'
  // const rePhoneNumber = /^01[3-9]\d{8}$/
  const reContactNumber = /^\d{4,11}$/
  const reEmail = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

  export default {
    mixins: [i18nMixin(i18nKeys), cartCalculationMixin, deliveryMethodsPermissionMixin, overlayMixin, gaEnhancedEcom, ga],
    fetch (context) {
      let {store} = context
      if (store.state.cart.items.length === 0) {
        return i18nRedirect(context, '/')
      }

      if (!store.getters.userHasVerifiedNumbers) {
        return i18nRedirect(context, verifyUserPath)
      }
    },
    created () {
      if (this.$store.state.cart.is_emi) {
        this.$store.commit(SET_PAGE_NOTIFICATION, {
          type: 'info',
          key: this.$store.state.cart.cart_items_backup.length ? 'emi_cart_with_backup' : 'emi_cart_with_no_backup'
        })
      }
    },
    mounted () {
      this.$root.$on(EVENT_DELIVERY_ADDRESS_SELECTED_FROM_PDA_MODAL, this.addressSelectedFromPDAModal)
      this.$root.$emit(EVENT_DELIVERY_CHARGE_CALCULATED, null)
      this.initStates()
      // *************************************************************************
      // Measuring checkout steps
      // if (this.cart.cart_items_display_info && this.cart.cart_items_display_info.length) {
      //   this.addProductForCheckoutMeasurement(this.cart.cart_items_display_info, 3)
      // }
      // *************************************************************************

      this.$store.dispatch(SAVE_CART, this.$store.state.cart)

      // this.$root.$on(EVENT_ADJUSTED_BALANCE, this.setAdjustedBalance)
      // this.loadAndBroadCastAgentBalance()
    },
    beforeDestroy () {
      this.$root.$emit(EVENT_DELIVERY_CHARGE_CALCULATED, null)
      this.$store.dispatch(RAISE_ERROR_IF_LINEITEMS_NOT_AGENT_DELIVERABLE, false)
      this.$store.dispatch(RAISE_ERROR_IF_LINEITEMS_NOT_LOCKER_DELIVERABLE, false)
      if (this.isAgentMode) {
        return this.$store.dispatch(LOGOUT_CUSTOMER)
      }
    },
    destroyed () {
      this.$store.dispatch(SAVE_CART, this.$store.state.cart)
    },
    data () {
      return {
        usePreferredDeliveryAddress: true,
        disableInteractions: false,
        locationChangedByPDA: false,
        deliveryLocation: null,
        areaChangedByPDA: false,
        deliveryArea: null,
        newDeliveryAddress: {
          area_id: null,
          address: null,
          contact_name: null,
          contact_number: null
        },
        invoiceEmailData: null,
        customerWantsInvoice: false,
        selectedAddress: null,
        pickedDeliveryMethod: null,
        additional_note: null,
        orderConfirmed: false,
        // UI
        hasCustomerMultipleNumbers: false,
        shouldDeliveryAddressFormShow: false,
        // Errors
        errors: {
          delivery_address: null,
          contact_name: null,
          receiver_number: null,
          invoice_email: null
        }
      }
    },
    watch: {
      customerWantsInvoice: function (newVal, oldVal) {
        if (newVal) {
          if (this.errors.invoice_email || this.invoiceEmailData) {
            this.errors.invoice_email = null
            this.invoiceEmailData = this.invoiceEmail ? this.invoiceEmail : null
          }
        }
      },
      'cart.items': function (val, oldVal) {
        if (isEmpty(val) && !this.orderConfirmed) {
          return i18nRedirect(this.$ctx, '/')
        }
      },
      deliveryLocation: function (location, oldLocation) {
        if (this.locationChangedByPDA) {
          this.locationChangedByPDA = false
          return
        }
        if (location) {
          if (this.isAgentMode) {
            this.deliveryArea = find(this.allAreas, {id: this.loggedInAgentAddress.area_id})
          } else if (this.preferredDeliveryAddress && this.preferredDeliveryAddress.location_id === location.id) {
            this.deliveryArea = find(this.allAreas, {id: this.preferredDeliveryAddress.area_id})
          } else {
            this.deliveryArea = null
          }
        }
      },
      deliveryArea: function (newArea, oldArea) {
        if (this.areaChangedByPDA) {
          this.areaChangedByPDA = false
          return
        }
        this.setDeliveryCharge(null)
        this.pickedDeliveryMethod = null
        this.selectedAddress = null
      },
      selectedAddress: function (newAddress, oldAddress) {
        if (newAddress) {
          this.setDeliveryCharge(this.selectedAddress.delivery_charge)
        } else if (this.isDeliveryMethodHome) {
          this.setDeliveryCharge(this.homeDeliveryCharge)
        } else {
          this.setDeliveryCharge(null)
        }
      },
      pickedDeliveryMethod: function (newMethod, oldMethod) {
        if (this.preferredDeliveryAddress && this.usePreferredDeliveryAddress) {
          return
        }

        this.$store.dispatch(RAISE_ERROR_IF_LINEITEMS_NOT_AGENT_DELIVERABLE, false)
        this.$store.dispatch(RAISE_ERROR_IF_LINEITEMS_NOT_LOCKER_DELIVERABLE, false)

        if (this.deliveryArea) {
          switch (newMethod) {
            case PICKED_DELIVERY_METHODS.AGENT:
              this.$store.dispatch(RAISE_ERROR_IF_LINEITEMS_NOT_AGENT_DELIVERABLE, true)
              this.deliveryCharge = this.loggedInAgentAddress.delivery_charge
              break
            case PICKED_DELIVERY_METHODS.AGENTS:
              this.$store.dispatch(RAISE_ERROR_IF_LINEITEMS_NOT_AGENT_DELIVERABLE, true)
              this.deliveryCharge = this.agentDeliveryCharge
              break
            case PICKED_DELIVERY_METHODS.HUB:
              this.deliveryCharge = this.hubDeliveryCharge
              break
            case PICKED_DELIVERY_METHODS.LOCKER:
              this.$store.dispatch(RAISE_ERROR_IF_LINEITEMS_NOT_LOCKER_DELIVERABLE, true)
              this.deliveryCharge = this.lockerDeliveryCharge
              break
            case PICKED_DELIVERY_METHODS.CUSTOMER:
              let customerAddressesInSelectedArea = this.customerAddresses.filter(a => a.area_id === this.deliveryArea.id)
              if (customerAddressesInSelectedArea.length) {
                this.shouldDeliveryAddressFormShow = false
                if (this.deliveryArea && this.lastDeliveryAddress && (this.deliveryArea.id === this.lastDeliveryAddress.area_id)) {
                  this.selectedAddress = this.lastDeliveryAddress
                } else {
                  this.selectedAddress = last(customerAddressesInSelectedArea)
                }
              } else {
                this.shouldDeliveryAddressFormShow = true
              }
              this.deliveryCharge = this.homeDeliveryCharge
              break
          }
        }
        this.setDeliveryCharge(this.deliveryCharge)

        if (this.preferredDeliveryAddress && this.deliveryArea && this.preferredDeliveryAddress.area_id === this.deliveryArea.id) {
          let specialCaseForAgentInCustomer = this.pickedDeliveryMethod === ADDRESS_TYPES.AGENT || this.pickedDeliveryMethod === PICKED_DELIVERY_METHODS.AGENTS
          let pdaOwnerTypeMatchedWithPickedMethod = this.preferredDeliveryAddress.owner_type === this.pickedDeliveryMethod
          if (specialCaseForAgentInCustomer || pdaOwnerTypeMatchedWithPickedMethod) {
            this.selectedAddress = this.preferredDeliveryAddress
          }
        }
      },
      customer: function (val, oldVal) {
        this.initStates()
      },
      'newDeliveryAddress.contact_number': function (val, oldVal) {
        if (val === 'ADD_ANOTHER') {
          this.newDeliveryAddress.contact_number = null
          this.hasCustomerMultipleNumbers = false
        }
      }
    },
    computed: {
      ...mapState([
        'agent',
        'customer'
      ]),
      ...mapGetters([
        'sortByName',
        'allDeliveryLocationsSorted',
        'isAgentMode',
        'isCustomerMode',
        'agentToken',
        'customerToken',
        'loggedInAgentAddress',
        'cart',
        'cartErrorExists',
        'lastDeliveryAddress',
        'customerAddressesByAreaId',
        'preferredDeliveryAddress',
        'showAgentPickUpAdvance'
      ]),
      customerInfoInAgentMode () {
        let customerName, customerMobile
        if (this.customer) {
          customerName = this.customer.name
          customerMobile = this.customer.mobiles.find(m => m.is_primary === 1)
          customerMobile = customerMobile ? partialAsteriskSensoredPhoneNumber(customerMobile.number) : null
        }
        return {
          name: customerName,
          mobile: customerMobile
        }
      },
      disableConfirmOrder () {
        let interactionDisabled = this.disableInteractions
        let cartError = this.cartErrorExists
        let noNewOrderInSelectedLocker = (this.isDeliveryMethodLocker && (this.selectedAddress && !this.selectedAddress.accept_new_orders))
        let noNewOrderInSelectedPreferredLocker = (this.isDeliveryMethodLocker && (this.usePreferredDeliveryAddress && this.preferredDeliveryAddress && !this.preferredDeliveryAddress.accept_new_orders))

        let noAddressSelected = (!this.usePreferredDeliveryAddress && !this.selectedAddress && !this.isDeliveryMethodHome)
        let selectedAddressIsNotPickedMethod = !this.usePreferredDeliveryAddress && this.selectedAddress && !(this.selectedAddress.owner_type === this.pickedDeliveryMethod)

        let specialConditionForAgentsInCustomer = !(this.isCustomerMode && this.selectedAddress && this.selectedAddress.owner_type === PICKED_DELIVERY_METHODS.AGENT && this.pickedDeliveryMethod === PICKED_DELIVERY_METHODS.AGENTS)
        return interactionDisabled || cartError || noNewOrderInSelectedLocker || noNewOrderInSelectedPreferredLocker || noAddressSelected || selectedAddressIsNotPickedMethod && specialConditionForAgentsInCustomer
      },
      customerAddresses () {
        if (this.deliveryArea) {
          return this.customerAddressesByAreaId(this.deliveryArea.id)
        }
        return []
      },
      allAreas () {
        let allAreasBySelectedLocation = (this.deliveryLocation && parseInt(this.deliveryLocation.is_active)) ? this.deliveryLocation.areas.filter(a => parseInt(a.is_delivery_area)) : []
        return this.sortByName(allAreasBySelectedLocation)
      },
      mobileNumbers () {
        if (this.customer && this.customer.mobiles) {
          return this.customer.mobiles
        }
      },
      invoiceEmail () {
        if (this.customer && this.customer.invoice_email) {
          return this.customer.invoice_email
        }
      },
      // UI
      isDeliveryMethodAgent () {
        return this.pickedDeliveryMethod === PICKED_DELIVERY_METHODS.AGENT
      },
      isDeliveryMethodPickup () {
        return this.pickedDeliveryMethod === PICKED_DELIVERY_METHODS.HUB
      },
      isDeliveryMethodAgents () {
        return this.pickedDeliveryMethod === PICKED_DELIVERY_METHODS.AGENTS
      },
      isDeliveryMethodLocker () {
        return this.pickedDeliveryMethod === PICKED_DELIVERY_METHODS.LOCKER
      },
      isDeliveryMethodHome () {
        return this.pickedDeliveryMethod === PICKED_DELIVERY_METHODS.CUSTOMER
      },
      hubDeliveryCharge () {
        return this.selectedAddress && this.selectedAddress.owner_type === ADDRESS_TYPES.HUB ? this.selectedAddress.delivery_charge : this.calculateDeliveryCharge(ADDRESS_TYPES.HUB)
      },
      agentDeliveryCharge () {
        if (this.loggedInAgentAddress) return this.loggedInAgentAddress.delivery_charge
        else if (this.selectedAddress && this.selectedAddress.owner_type === ADDRESS_TYPES.AGENT) return this.selectedAddress.delivery_charge
        return this.calculateDeliveryCharge(ADDRESS_TYPES.AGENT)
      },
      lockerDeliveryCharge () {
        return this.selectedAddress && this.selectedAddress.owner_type === ADDRESS_TYPES.LOCKER ? this.selectedAddress.delivery_charge : this.calculateDeliveryCharge(ADDRESS_TYPES.LOCKER)
      },
      homeDeliveryCharge () {
        return this.selectedAddress && this.selectedAddress.owner_type === ADDRESS_TYPES.CUSTOMER ? this.selectedAddress.delivery_charge : this.deliveryArea.home_delivery_charge
      },
      formToggleButton () {
        return this.shouldDeliveryAddressFormShow ? this.i18nText.homeDeliveryUsePreviousAddress : this.i18nText.homeDeliveryUseAnotherAddress
      },
      isLocationNotActive () {
        if (this.deliveryLocation) {
          return !(this.deliveryLocation.is_active)
        }
      },
      noServiceMessage () {
        if (this.isLocationNotActive) {
          return this.$t('location_selector.no_service_message', {field: this.__(this.deliveryLocation.name)})
        }
      },
      primaryNumberObject () {
        if (this.mobileNumbers) {
          return find(this.mobileNumbers, 'is_primary')
        }
      }
    },
    methods: {
      initStates () {
        if (this.invoiceEmail) {
          this.customerWantsInvoice = true
          this.invoiceEmailData = this.invoiceEmail
        }

        if (this.preferredDeliveryAddress && this.usePreferredDeliveryAddress) {
          this.pickedDeliveryMethod = this.preferredDeliveryAddress.owner_type
          this.setDeliveryCharge(this.preferredDeliveryAddress.delivery_charge)

          switch (this.preferredDeliveryAddress.owner_type) {
            case ADDRESS_TYPES.AGENT:
              this.$store.dispatch(RAISE_ERROR_IF_LINEITEMS_NOT_AGENT_DELIVERABLE, true)
              break
            case ADDRESS_TYPES.LOCKER:
              this.$store.dispatch(RAISE_ERROR_IF_LINEITEMS_NOT_LOCKER_DELIVERABLE, true)
              break
          }
          return
        } else {
          this.setDeliveryCharge(null)
          this.pickedDeliveryMethod = null
        }

        if (this.customer && this.customer.name) {
          this.newDeliveryAddress.contact_name = this.customer.name
        }

        if (this.mobileNumbers) {
          if (this.mobileNumbers && this.mobileNumbers.length === 1 && this.primaryNumberObject) {
            this.newDeliveryAddress.contact_number = this.primaryNumberObject.number
          } else if (this.mobileNumbers && this.mobileNumbers.length > 1 && this.primaryNumberObject) {
            this.newDeliveryAddress.contact_number = this.primaryNumberObject.number
            this.hasCustomerMultipleNumbers = true
          }
        }

        if (this.preferredDeliveryAddress) {
          this.deliveryLocation = find(this.allDeliveryLocationsSorted, {id: this.preferredDeliveryAddress.location_id})
          this.deliveryArea = find(this.allAreas, {id: this.preferredDeliveryAddress.area_id})
        } else if (this.lastDeliveryAddress) {
          this.deliveryLocation = find(this.allDeliveryLocationsSorted, {id: this.lastDeliveryAddress.location_id})
          this.deliveryArea = find(this.allAreas, {id: this.lastDeliveryAddress.area_id})
        } else if (this.isAgentMode) {
          this.deliveryLocation = find(this.allDeliveryLocationsSorted, {id: this.loggedInAgentAddress.location_id})
        }
      },
      setSelectedLocationFromChild (option) {
        this.deliveryLocation = option
      },
      setSelectedAreaFromChild (option) {
        this.deliveryArea = option
      },
      addressSelectedFromPDAModal (address) {
        this.selectedAddress = address
        this.pickedDeliveryMethod = address.owner_type
        if (this.isCustomerMode && this.pickedDeliveryMethod === ADDRESS_TYPES.AGENT) {
          this.pickedDeliveryMethod = PICKED_DELIVERY_METHODS.AGENTS
        }

        this.locationChangedByPDA = true
        this.deliveryLocation = find(this.allDeliveryLocationsSorted, { id: address.location_id })

        this.areaChangedByPDA = true
        this.deliveryArea = find(this.allAreas, { id: address.area_id })
      },
      openPreferredDeliveryPointModal (deliveryMethod) {
        this.$store.commit(SET_PREFERRED_DELIVERY_MODAL_FOR_CHECKOUT, {
          location_id: this.deliveryLocation.id,
          area_id: this.deliveryArea.id
        })
        this.$store.commit(SET_PREFERRED_DELIVERY_METHOD, deliveryMethod)
        this.openOverlay(this.overlays.preferredDeliveryPointModal)
      },
      setDeliveryCharge (deliveryCharge) {
        this.deliveryCharge = parseInt(deliveryCharge)
        this.$root.$emit(EVENT_DELIVERY_CHARGE_CALCULATED, this.deliveryCharge)
      },
      togglePreferredAddress () {
        if (this.preferredDeliveryAddress) {
          this.usePreferredDeliveryAddress = !this.usePreferredDeliveryAddress
          this.initStates()
        }
      },
      calculateDeliveryCharge (type) {
        if (this.selectedAddress && this.selectedAddress.owner_type === type) {
          return parseInt(this.selectedAddress.delivery_charge)
        } else if (this.deliveryArea) {
          switch (type) {
            case ADDRESS_TYPES.AGENT:
              return parseInt(this.deliveryArea.agent_delivery_charge)
            case ADDRESS_TYPES.LOCKER:
              return parseInt(this.deliveryArea.locker_delivery_charge)
            case ADDRESS_TYPES.HUB:
              return parseInt(this.deliveryArea.hub_delivery_charge)
            case ADDRESS_TYPES.CUSTOMER:
              return parseInt(this.deliveryArea.home_delivery_charge)
          }
        } else return null
      },
      setAdjustedBalance (commissionAdjustment) {
        this.commissionAdjustment = commissionAdjustment
      },
      loadAndBroadCastAgentBalance () {
        this.isAgentMode ? this.$store.dispatch(LOAD_AGENT_COMMISSION)
          .then(commission => {
            this.$root.$emit(EVENT_AGENT_BALANCE, commission.balance)
          })
          .catch(error => {
            logger.error(error)
          }) : null
      },
      shouldDeliveryAddressFormShowToggle () {
        this.shouldDeliveryAddressFormShow = !this.shouldDeliveryAddressFormShow
        if (this.mobileNumbers && this.mobileNumbers.length > 1 && this.primaryNumberObject) {
          this.newDeliveryAddress.contact_number = this.primaryNumberObject.number
          this.hasCustomerMultipleNumbers = true
        }
      },
      translatedValue (deliveryLocation) {
        if (deliveryLocation) {
          return this.__(deliveryLocation.name)
        } return null
      },
      measureGaEcomPurchaseAction (orderSummary) {
        // *************************************************************************
        // Measuring Purchase
        let purchaseData = {
          'id': orderSummary.code,
          'affiliation': 'Store Front',
          'revenue': orderSummary.total,
          'shipping': orderSummary.delivery_charge
        }

        if (orderSummary.coupon_rule && orderSummary.coupon_rule.code) {
          purchaseData.coupon = orderSummary.coupon_rule.code
        }

        this.gaEcSetAction(ENHANCE_ECOM.ACTIONS.PURCHASE, purchaseData)
        this.gaEcPageViewSend()
      // *************************************************************************
      },
      confirmOrder () {
        this.$store.commit(SET_PAGE_NOTIFICATION, null)
        if (this.disableInteractions) return
        if (this.customerWantsInvoice) {
          if (!this.emailValidate()) return
        }

        if (this.isDeliveryMethodHome && this.shouldDeliveryAddressFormShow) {
          if (!this.validate()) return
        }

        let orderAttributes = {
          items: this.cart.items,
          is_emi: this.cart.is_emi,
          sub_total: this.subTotal,
          delivery_charge: this.deliveryCharge,
          total: this.isFreeDelivery ? this.subTotal : this.cartTotal,
          order_remarks: this.additional_note
        }

        if (!this.cart.is_emi) {
          orderAttributes.coupon_discount = this.isFreeDelivery ? this.deliveryCharge : this.couponDiscount
          orderAttributes.coupon_code = this.appliedCouponCode
        }

        if (this.customerWantsInvoice) {
          orderAttributes.invoice_email = this.invoiceEmailData
        } else {
          orderAttributes.invoice_email = null
        }

        if (this.preferredDeliveryAddress && this.usePreferredDeliveryAddress) {
          orderAttributes.delivery_address_id = this.preferredDeliveryAddress.id
        } else if (this.pickedDeliveryMethod) {
          // Delivery Address Logic
          if (this.isDeliveryMethodHome && this.shouldDeliveryAddressFormShow) {
            if (!this.validate()) return
            this.newDeliveryAddress.area_id = this.deliveryArea.id
            orderAttributes.delivery_address = this.newDeliveryAddress
          } else if (this.selectedAddress && this.selectedAddress.id) {
            orderAttributes.delivery_address_id = this.selectedAddress.id
          }
        }

        if (this.isAgentMode) {
          orderAttributes.agent_token = this.agentToken
          orderAttributes.agent_id = this.agent.id
          // orderAttributes.commission_adjustment = this.commissionAdjustment
        }

        this.disableInteractions = true

        return createOrder(this.customerToken, orderAttributes)
          .then((data) => {
            this.orderConfirmed = true
            this.$store.dispatch(CLEAR_CART)
            this.$store.dispatch(HANDLE_APPLIED_COUPON, null)
            if (this.isAgentMode) {
              this.$store.dispatch(LOGOUT_CUSTOMER)
            } else if (this.isCustomerMode) {
              this.$store.dispatch(SAVE_CUSTOMER_INFO, { preferred_delivery_address_id: data.delivery_address.id })
            }

            // =====> ANALYTICS
            this.gaEvent({
              eventCategory: this.gaCategoriesMeta.DELIVERY_OPTION.NAME,
              eventAction: this.gaCategoriesMeta.DELIVERY_OPTION.ACTIONS.CONFIRM_ORDER,
              eventLabel: this.gaCategoriesMeta.DELIVERY_OPTION.ACTIONS.CONFIRM_ORDER
            })
            this.measureGaEcomPurchaseAction(data)
            // =====> ANALYTICS

            return i18nRedirect(this.$ctx, `/checkout/payment/${data.id}`)
          })
          .catch(reason => {
            switch (reason.error) {
              case API_ERRORS.INVALID_DELIVERY_ADDRESS:
                this.$store.commit(SET_PAGE_NOTIFICATION, { type: 'error', key: reason.error.toLowerCase() })
                break
              case API_ERRORS.CART_ITEM_MISMATCH:
              case API_ERRORS.INVALID_SUB_TOTAL:
                const vm = this
                const updatedlineItemInfosWithErr = reason.details.items.map(function (item) {
                  item.item_details.error = item.error
                  return item.item_details
                })
                this.$store.commit(LOAD_CART_ITEM_INFO, updatedlineItemInfosWithErr)
                this.$store.commit(UPDATE_CART_ERROR_STATE)

                if (reason.details.items.find(item => item.error === API_ERRORS.NOT_DELIVERABLE_TO_CHOSEN_ADDRESS)) {
                  switch (vm.pickedDeliveryMethod) {
                    case PICKED_DELIVERY_METHODS.AGENT:
                    case PICKED_DELIVERY_METHODS.AGENTS:
                      vm.$store.dispatch(RAISE_ERROR_IF_LINEITEMS_NOT_AGENT_DELIVERABLE, true)
                      break
                    case PICKED_DELIVERY_METHODS.LOCKER:
                      vm.$store.dispatch(RAISE_ERROR_IF_LINEITEMS_NOT_LOCKER_DELIVERABLE, true)
                      break
                  }
                } else {
                  this.$store.commit(SET_PAGE_NOTIFICATION, { type: 'error', key: reason.error.toLowerCase() })
                  this.$store.dispatch(HANDLE_APPLIED_COUPON, null)
                }
                break
              case API_ERRORS.INVALID_COUPON_DISCOUNT:
                this.$root.$emit(EVENT_SAVE_CART_RESPONSE_IN_CART, {
                  applied_coupon: reason.details,
                  coupon_error: reason.error
                })
                this.$store.dispatch(HANDLE_APPLIED_COUPON, reason.details)
                break
              case API_ERRORS.INVALID_COUPON:
              case API_ERRORS.COUPON_EXPIRED:
              case API_ERRORS.TOTAL_USAGE_LIMIT_EXCEEDED:
              case API_ERRORS.USER_USAGE_LIMIT_EXCEEDED:
              case API_ERRORS.INVALID_TOTAL_PRICE:
                this.$root.$emit(EVENT_SAVE_CART_RESPONSE_IN_CART, {
                  applied_coupon: reason.details,
                  coupon_error: reason.error
                })
                this.$store.dispatch(HANDLE_APPLIED_COUPON, null)
                this.$store.dispatch(SAVE_CART, this.cart)
                break
              case API_ERRORS.AGENT_NOT_FOUND:
                return this.$store.dispatch(LOGOUT_AGENT)
                  .then(() => {
                    this.$router.go({
                      path: this.$router.path,
                      query: {
                        ts: Date.now()
                      }
                    })
                  })
              default:
                logger.error('createOrder', reason)
                break
            }
          })
          .finally(() => {
            // logger.debug('enabling interactions')
            this.disableInteractions = false
          })
      },
      emailValidate () {
        this.errors.invoice_email = null

        if (!this.invoiceEmailData) {
          this.errors.invoice_email = this.$t('validation.required', {field: this.$t('delivery_process.invoice_email')})
        } else if (!reEmail.test(this.invoiceEmailData)) {
          this.errors.invoice_email = this.$t('validation.invalid_email', {value: this.invoiceEmailData})
        } else {
          this.errors.invoice_email = false
        }

        return !(this.errors.invoice_email)
      },
      validate () {
        this.errors.delivery_address = null
        this.errors.contact_name = null
        this.errors.receiver_number = null

        if (!this.newDeliveryAddress.address) {
          this.errors.delivery_address = this.$t('validation.required', {field: this.i18nText.homeDeliveryAddressLabel})
        } else {
          this.errors.delivery_address = false
        }

        if (!this.newDeliveryAddress.contact_name) {
          this.errors.contact_name = this.$t('validation.required', {field: this.i18nText.homeDeliveryRecieverName})
        } else {
          this.errors.contact_name = false
        }

        if (!this.newDeliveryAddress.contact_number) {
          this.errors.receiver_number = this.$t('validation.required', {field: this.i18nText.homeDeliveryMobileNumber})
        } else if (!reContactNumber.test(this.newDeliveryAddress.contact_number)) {
          this.errors.receiver_number = this.$t('validation.invalid_mobile_number', {value: this.newDeliveryAddress.contact_number})
        } else {
          this.errors.receiver_number = false
        }

        return !(this.errors.delivery_address || this.errors.contact_name || this.errors.receiver_number)
      },
      logoutCustomer () {
        return this.$store.dispatch(LOGOUT_CUSTOMER)
          .then(() => {
            return i18nRedirect(this.$ctx, verifyUserPath)
          })
      }
    },
    components: {
      Cart,
      CustomMultiselect,
      i18nLink,
      AddressDisplay,
      PreferredDeliveryPointDisplay
    }
  }
</script>


<style lang="sass" module>
  @import "shared/button"
  @import "shared/field"
  @import "shared/checkout/checkout"

  .dm-option
    position: relative
    display: flex
    flex-direction: row
    &-btn
      width: auto
      padding-left: $gutter
      padding-right: $gutter
      margin-right: $gutter/2
      border-radius: 500em
      height: 38px
      font-weight: $weight-medium
      &-active
        border-color: $primary
        // background-color: $black


  .title,
  .sub-title
    font-size: 14px
    font-weight: $weight-bold
  .sub-title
    color: rgba($black, .55)
  .copy
    font-size: 14px
    font-weight: $weight-medium
    &-delivery-charge
      margin-top: 10px
      padding-left: $gutter
      color: rgba($black, .55)

  .btn
    &-use-diff-address
      border-radius: 0 0 $gutter/2 $gutter/2
    &--back
      width: auto
      padding-left: $gutter
      padding-right: $gutter*1.5
      svg
        transform: rotate(180deg)

  .mt0
    margin-top: 0 !important
</style>

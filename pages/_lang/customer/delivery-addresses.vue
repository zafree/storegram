<template>
  <div class="CustomerAddress">
    <div class="CustomerAddress__container">
      <div class="CustomerAddress__row">
        <div class="CustomerAddress__title">{{ i18nText.yourAddress }}</div>
        <div class="CustomerAddress__body">
          <address v-for="(address, index) in addresses" :key="address.id"
            :class="['address', {'address--editable': currentAddress && (currentAddress.id === address.id)}]">

            <!-- editable fields -->
            <template v-if="currentAddress && currentAddress === address">
              <label class="address__label">{{ $t('user_info.address_label', {index: __$(index + 1)}) }}:</label>
              <!-- editable fields -->
              <div class="address__fields">
                <!--Location-->
                <div class="DeliveryLocation">
                  <div class="DeliveryLocation__city">

                    <div v-if="isAddressEditMode" :class="['Field', {'Field--error': errors.location, 'Field--success': errors.location === false}]">
                      <label v-html="i18nText.locationLabel" class="Field__label Field__label--uppercase Field__label--bold Field__label--12px"></label>
                      <div class="Field__control">
                        <input :value="__(selectedDeliveryLocation.name)" class="Field__input" type="text" disabled>
                      </div>
                    </div>

                    <div v-else :class="['Field', {'Field--error': errors.location, 'Field--success': errors.location === false}]">
                      <label class="Field__label Field__label--uppercase Field__label--bold" v-html="i18nText.locationLabel"></label>
                      <div class="Field__control Field__control--multiselect">

                        <custom-multiselect
                          :selected="selectedDeliveryLocation"
                          :options="allDeliveryLocationsSorted"
                          :placeholder="i18nText.locationPlaceholder"
                          @setSelectedOption="setSelectedLocationFromChild"
                        ></custom-multiselect>

                      </div>
                      <p v-if="errors.location" class="Field__validation">{{errors.location}}</p>
                    </div>
                  </div>

                  <div class="DeliveryLocation__area">
                    <div v-if="isAddressEditMode" :class="['Field', {'Field--error': errors.area, 'Field--success': errors.area === false}]">
                      <label class="Field__label Field__label--uppercase Field__label--bold Field__label--12px" v-html="i18nText.areaLabel"></label>
                      <div class="Field__control">
                        <input :value="__(selectedDeliveryArea.name)" class="Field__input" type="text" disabled>
                      </div>
                    </div>

                    <div v-else :class="['Field', {'Field--error': errors.area, 'Field--success': errors.area === false}]">
                      <label class="Field__label Field__label--uppercase Field__label--bold" v-html="i18nText.areaLabel"></label>
                      <div class="Field__control Field__control--multiselect">
                        <custom-multiselect
                          :selected="selectedDeliveryArea"
                          :options="allAreas"
                          :placeholder="i18nText.areaPlaceholder"
                          @setSelectedOption="setSelectedAreaFromChild"
                          ></custom-multiselect>
                      </div>
                      <p v-if="errors.area" class="Field__validation">{{errors.area}}</p>
                    </div>
                  </div>

                </div>

                <!-- delivery address -->
                <div :class="['Field', {'Field--error': errors.address, 'Field--success': errors.address === false}]">
                  <label class="Field__label Field__label--uppercase Field__label--bold Field__label--12px">{{ i18nText.homeDeliveryAddressLabel }}</label>
                  <div class="Field__control">
                    <textarea v-model="currentAddress.address" class="Field__input Field__input--textarea" :placeholder=" i18nText.homeDeliveryAddressPlaceholder " rows="3"></textarea>
                  </div>
                  <p v-if="errors.address" class="Field__validation">{{errors.address}}</p>
                </div>
                <!-- reciever -->
                <div class="reciver">
                  <div class="reciver__name">
                    <!-- reciever name -->
                    <div :class="['Field', {'Field--error': errors.contact_name, 'Field--success': errors.contact_name === false}]">
                      <label class="Field__label Field__label--uppercase Field__label--bold Field__label--12px">{{ i18nText.homeDeliveryContactName }}</label>
                      <div class="Field__control">
                        <input class="Field__input" type="text" :placeholder="i18nText.homeDeliveryContactNamePlaceholder" v-model="currentAddress.contact_name">
                      </div>
                      <p v-if="errors.contact_name" class="Field__validation">{{errors.contact_name}}</p>
                    </div>
                  </div>
                  <div class="reciver__phone">
                    <!-- reciever phone number -->
                    <div :class="['Field', {'Field--error': errors.contact_number, 'Field--success': errors.contact_number === false}]">
                      <label class="Field__label Field__label--uppercase Field__label--bold Field__label--12px">{{ i18nText.homeDeliveryMobileNumber }}</label>

                      <!-- if not hasCustomerMultipleNumbers -->
                      <template v-if="(mobileNumbers.length < 2 || addNewMobileNumber)">
                        <div class="Field__control">
                          <input class="Field__input" type="text" :placeholder="i18nText.homeDeliveryMobileNumberPlaceholder" v-model="currentAddress.contact_number">
                        </div>
                      </template>
                      <!-- if hasCustomerMultipleNumbers -->
                      <template v-else>
                        <div class="Field__control Field__control--select">
                          <select v-model="currentAddress.contact_number" class="Field__input Field__input--select">
                            <option
                              :value="number.number"
                              v-for="number in mobileNumbers"
                              :key="number.id"
                            >
                              {{number.number}}
                            </option>
                            <option value="ADD_NEW_MOBILE_NUMBER">{{ i18nText.useAnother }}</option>
                          </select>
                        </div>
                      </template>
                      <p v-if="errors.contact_number" class="Field__validation">{{errors.contact_number}}</p>
                    </div>
                  </div>
                </div>
              </div>
              <!-- editable address -->
              <div class="address__actions">
                <button @click="saveAddress(address)" class="Button Button--save" type="button">{{ i18nText.save }}</button>
                <button @click="cancelActiveOperation()" class="Button Button--cancel" type="button">{{ i18nText.cancel }}</button>
              </div>
            </template>

            <!-- static -->
            <template v-else>
              <!-- address static -->
              <div v-if="addressToDelete && addressToDelete === address && errors.address" :class="['Field', {'Field--error': errors.address, 'Field--success': errors.address === false}]">
                <p class="Field__validation">{{errors.address}}</p>
              </div>
              <address-display :addressTitle="$t('user_info.address_label', {index: __$(index + 1)})" :address="address"/>
              <!--actions-->
              <div class="address__state" v-if="!hasActiveOperation">
                <button @click="editAddress(address)" class="Button Button--edit" type="button">{{ i18nText.edit }}</button>
                <span class="Button-divider">|</span>
                <button @click="deleteAddress(address)" class="Button Button--delete" type="button">{{ i18nText.delete }}</button>
              </div>
              <!--delete warning-->
              <div v-if="addressToDelete && addressToDelete === address && !errors.address" class="address__deleteState deleteState">
                <div class="deleteState__text">{{ i18nText.deleteAddressWarning }}</div>
                <div class="deleteState__actions">
                  <button @click="onDeleteConfirmed()" class="Button Button--yes" type="button">{{ i18nText.yes }}</button>
                  <button @click="cancelActiveOperation()" class="Button Button--no" type="button">{{ i18nText.no }}</button>
                </div>
              </div>
            </template>
          </address>
          <template v-if="!hasActiveOperation">
            <p class="initext" v-if="!addresses.length">{{ i18nText.addressInitMessage }}</p>
            <button class="Button" type="button" @click="addNewAddress()">{{ addressAddingButtonLabel }}</button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import trim from 'lodash/trim'
  import cloneDeep from 'lodash/cloneDeep'
  import find from 'lodash/find'
  import remove from 'lodash/remove'

  import { mapGetters, mapState } from 'vuex'
  // import i18nKeys from '~/pages/_lang/checkout/delivery-option.i18n.yaml'
  import i18nKeys from '~/pages/_lang/customer/delivery-addresses.i18n.yaml'
  import AddressDisplay from '~/components/AddressDisplay'
  import CustomMultiselect from '~/components/CustomMultiselect'

  import {
    UPDATE_ADDRESS,
    REMOVE_CUSTOMER_ADDRESS,
    API_ERRORS,
    ADD_NEW_MOBILE_NUMBER
  } from '~/store/constants.yaml'

  import {
    i18nRedirect,
    i18nMixin
  } from '~/utils'

  const rePhoneNumber = /^01[3-9]\d{8}$/

  export default {
    mixins: [i18nMixin(i18nKeys)],
    fetch (context) {
      let {store} = context
      if (!store.state.customer) {
        return i18nRedirect(context, '/')
      }
    },
    created () {
      this.loadAddressesFromStore()
    },
    data () {
      return {
        addresses: [],
        addNewMobileNumber: false,
        addressToDelete: null,
        currentAddress: null,
        mobileNumbers: [],
        selectedDeliveryArea: null,
        selectedDeliveryLocation: null,
        ui: {},
        errors: {
          location: null,
          area: null,
          address: null,
          contact_name: null,
          contact_number: null
        }
      }
    },
    watch: {
      selectedDeliveryLocation: function (val, oldVal) {
        if (!oldVal) return
        if (val !== oldVal) {
          this.selectedDeliveryArea = null
        }
      },
      'currentAddress.contact_number': function (val, oldVal) {
        if (val === ADD_NEW_MOBILE_NUMBER) {
          this.addNewMobileNumber = true
          this.currentAddress.contact_number = null
        }
      }
    },
    computed: {
      ...mapState([
        'customer'
      ]),
      ...mapGetters([
        'sortByName',
        'allDeliveryLocationsSorted'
      ]),
      addressAddingButtonLabel () {
        return this.addresses.length ? this.$t('profile.add_another') : this.$t('profile.add_address')
      },
      hasActiveOperation () {
        return !!(this.currentAddress || this.addressToDelete)
      },
      isAddressEditMode () {
        return (this.currentAddress && this.currentAddress.id)
      },
      allAreas () {
        return this.selectedDeliveryLocation ? this.sortByName(this.selectedDeliveryLocation.areas.filter(a => parseInt(a.is_delivery_area))) : []
      }
    },
    methods: {
      setSelectedAreaFromChild (option) {
        this.selectedDeliveryArea = option
      },
      setSelectedLocationFromChild (option) {
        this.selectedDeliveryLocation = option
      },
      loadAddressesFromStore () {
        if (this.customer && this.customer.addresses) {
          this.addresses = cloneDeep(this.customer.addresses)
        }
      },
      validate () {
        this.errors.location = null
        this.errors.area = null
        this.errors.address = null
        this.errors.contact_name = null
        this.errors.contact_number = null

        if (!this.selectedDeliveryLocation) {
          this.errors.location = this.$t('validation.required', {field: this.i18nText.locationLabel})
        } else {
          this.errors.location = false
        }

        if (!this.selectedDeliveryArea) {
          this.errors.area = this.$t('validation.required', {field: this.i18nText.areaLabel})
        } else {
          this.errors.area = false
        }

        if (!trim(this.currentAddress.address)) {
          this.errors.address = this.$t('validation.required', {field: this.i18nText.homeDeliveryAddressLabel})
        } else {
          this.errors.address = false
        }

        if (!trim(this.currentAddress.contact_name)) {
          this.errors.contact_name = this.$t('validation.required', {field: this.i18nText.homeDeliveryRecieverName})
        } else {
          this.errors.contact_name = false
        }

        if (!trim(this.currentAddress.contact_number)) {
          this.errors.contact_number = this.$t('validation.required', {field: this.i18nText.homeDeliveryMobileNumber})
        } else if (!rePhoneNumber.test((this.currentAddress.contact_number))) {
          this.errors.contact_number = this.$t('validation.invalid_mobile_number', {value: this.currentAddress.contact_number})
        } else {
          this.errors.contact_number = false
        }

        return !(this.errors.area || this.errors.location || this.errors.address || this.errors.contact_name || this.errors.contact_number)
      },
      deleteAddress (address) {
        this.addressToDelete = address
      },
      editAddress (address) {
        this.currentAddress = address
        this.selectedDeliveryLocation = find(this.allDeliveryLocationsSorted, (l) => l.id === address.location_id)
        this.selectedDeliveryArea = find(this.selectedDeliveryLocation.areas, (a) => a.id === address.area_id)
        this.mobileNumbers = cloneDeep(this.customer.mobiles)

        let isCurrentContactNumberExist = !!(find(this.customer.mobiles, {'number': address.contact_number}))
        if (!isCurrentContactNumberExist) {
          let currentContactNumber = {
            number: address.contact_number
          }
          this.mobileNumbers.push(currentContactNumber)
        }
      },
      addNewAddress () {
        const newAddress = {
          address: null,
          contact_name: this.customer.name
        }

        if (this.customer.mobiles.length) {
          const primaryMobile = find(this.customer.mobiles, 'is_primary')
          if (primaryMobile) {
            newAddress.contact_number = primaryMobile.number
          }
          this.mobileNumbers = cloneDeep(this.customer.mobiles)
        }

        this.addresses.push(newAddress)
        this.currentAddress = newAddress
      },
      saveAddress (address) {
        if (!this.validate()) {
          return
        }
        address.area_id = this.selectedDeliveryArea.id
        return this.$store.dispatch(UPDATE_ADDRESS, { ...{address} })
        .then(() => {
          this.cancelActiveOperation()
        })
      },
      removeUnsavedAddress () {
        return remove(this.addresses, function (a) {
          return !a.id
        })
      },
      onDeleteConfirmed () {
        this.$store.dispatch(REMOVE_CUSTOMER_ADDRESS, this.addressToDelete.id)
        .then(response => {
          this.cancelActiveOperation()
        })
        .catch(reason => {
          switch (reason.error) {
            case API_ERRORS.CANNOT_DELETE_ADDRESS:
              this.errors.address = this.__e(reason.error)
              break
            default:
              this.errors.address = this.__e(API_ERRORS.DEFAULT_ERROR)
          }
          setTimeout(() => {
            this.cancelActiveOperation()
          }, 5000)
        })
      },
      cancelActiveOperation () {
        this.removeUnsavedAddress()
        this.loadAddressesFromStore()
        this.addNewMobileNumber = false
        this.addressToDelete = null
        this.currentAddress = null
        this.selectedDeliveryLocation = null
        this.selectedDeliveryArea = null
        this.errors.location = null
        this.errors.area = null
        this.errors.address = null
        this.errors.contact_name = null
        this.errors.contact_number = null
      },
      translateNameProperty (obj) {
        return this.__(obj.name)
      }
    },
    components: {
      AddressDisplay, CustomMultiselect
    }
  }
</script>

<style lang="sass" scoped>
  @import "shared/form/field"
  @import "shared/button"

  .initext
    margin-bottom: 10px
  .Button
    border: 1px solid #d9d9d9
    height: 32px
    padding: 0 10px
    font-size: 13px
    color: #333
    fill: #333
    &:hover,
    &:focus,
    &:active
      color: #333
      fill: #333
      border-color: #777

    &--save
      margin-right: 5px
      border-color: $primary
      background-color: $primary
      color: $black
      fill: $black
      &:hover,
      &:focus,
      &:active
        border-color: $black
        background-color: $black
        color: $primary
        fill: $primary

    &--edit,
    &--delete
      font-size: 12px
      height: 22px
      padding: 0 5px
      border: none
      color: #777
      fill: #777
      &:hover,
      &:focus,
      &:active
        color: #777
        fill: #777
        text-decoration: underline
    &--edit
      margin-right: 2px
    &--delete
      margin-left: 2px
    &-divider
      color: #777
      fill: #777
      margin-top: 3px

    &--yes,
    &--no
      color: $white
      fill: $white
      border: none
      &:hover,
      &:focus,
      &:active
        color: $white
        fill: $white
    &--yes
      background-color: $red
      margin-right: 5px
    &--no
      background-color: #252525


  .CustomerAddress
    background-color: $white
    padding-top: 30px
    +tablet
      padding-top: 50px
    &__container
      +container
    &__row
      position: relative
    &__title
      font-size: 24px
      font-weight: 400
      color: #333
      line-height: 1.3
      margin-bottom: 10px
    &__body
      position: relative
      margin-top: 20px

  .DeliveryLocation
    display: flex
    flex-flow: row wrap
    &__city
      flex: 1 100%
      margin-bottom: 20px
      +tablet
        flex: 1
        padding-right: 10px
    &__area
      flex: 1 100%
      margin-bottom: 20px
      +tablet
        flex: 1
        padding-left: 10px

  .address
    position: relative
    max-width: 735px
    background-color: #f5f5f5
    padding: 13px 15px
    font-style: normal
    line-height: 1.5
    &:not(:last-child)
      margin-bottom: 20px
    &__label
      font-size: 13px
      font-weight: 700
      color: #555
      display: block
      text-decoration: underline
      margin-bottom: 5px
    &__text
      padding-right: 100px
    &__p
      font-weight: 400
      font-size: 13px
    &__state
      position: absolute
      // bottom: 0
      // margin-bottom: 12px
      top: 0
      margin-top: 12px
      margin-right: 10px
      right: 0
      display: inline-flex
      align-items: center

    &__fields
      position: relative
      padding: 10px 15px 10px
    &__actions
      text-align: right
      padding: 0 30px 30px

    &__deleteState
      position: absolute
      top: 0
      bottom: 0
      left: 0
      right: 0
      background-color: rgba(#fde7ec, 0.85)
      border: 1px solid #fac4d0

    &--editable
      background-color: $white
      border: 1px solid #e5e5e5
      box-shadow: 0 1px 3px rgba($black, 0.1)
      .address
        &__label
          text-decoration: none
          color: #ccc

  .deleteState
    display: flex
    justify-content: flex-end
    align-items: center
    padding: 15px
    &__text
      color: $red
    &__actions
      margin-left: 20px



  .reciver
    display: flex
    flex-flow: row wrap
    &__name
      flex: 1 100%
      margin-bottom: 20px
      +tablet
        flex: 1
        padding-right: 10px
    &__phone
      flex: 1 100%
      margin-bottom: 20px
      +tablet
        flex: 1
        padding-left: 10px
</style>

<style scoped>
  .address-block {
    padding: 15px;
    background: #fff;
    border: 1px solid red;
  }
  .delete-warning {
    background: yellow;
    padding: 15px;
  }
  .form-error {
    color: red;
  }
</style>

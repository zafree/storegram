<template>
  <div class="CustomerProfile">
    <div class="CustomerProfile__container">
      <div class="CustomerProfile__row">
        <div class="CustomerProfile__title">{{i18nText.yourProfile}}</div>
        <div class="CustomerProfile__body">
          <div class="user">
            <!-- <div class="user__image">
              <div v-if="customerAvatar" class="user__avatar">
                <img width="150" height="150" :src="customerAvatar">
              </div>
              <div v-else class="user__avatar">
                <img class="user__avatar__svgIcon" src="/svg/delivery-point/dgMan.svg" alt="">
              </div>
              <div v-if="errors.facebook" class="Field--error">
                <p class="Field__validation Field--error">{{ errors.facebook }}</p>
              </div>
              <div class="user__connect" v-if="isCustomerFbConnected">
                <button class="Button Button--continueWithFacebook" @click="disconnectWithFacebook()">
                  <img class="Button__iconFacebook15x15" src="/svg/socials/facebook.svg" alt="">
                  <span class="Button__label">{{ i18nText.fbDisconnect }}</span>
                </button>
              </div>
              <div class="user__connect" v-else>
                <button class="Button Button--continueWithFacebook" @click="connectWithFacebook()">
                  <img class="Button__iconFacebook15x15" src="/svg/socials/facebook.svg" alt="">
                  <span class="Button__label">{{ i18nText.fbConnect }}</span>
                </button>
              </div>
            </div> -->
            <div class="user__content">

              <!-- name new -->
              <div class="user__name">
              <div :class="['Field', {'Field--error': errors.name}]">
                  <div class="Field__control" v-if="uiOption.chooseToeditName">
                    <input
                      v-model="customerNameData"
                      v-focus
                      @keyup.enter="updateCustomerName()"
                      class="Field__input Field__input--name"
                      type="text"
                    >
                    <div class="Field__inlineButton">
                      <button class="Button Button--save" type="button" @click="updateCustomerName()">{{i18nText.save}}</button>
                      <button class="Button Button--cancel" type="button" @click="cancelActiveOperations()">{{i18nText.cancel}}</button>
                    </div>
                  </div>
                  <div class="Field__control" v-else>
                    <div class="Field__input Field__input--name Field__input--justText">{{ customerName }}</div>
                    <div class="Field__inlineButton">
                      <button :class="['Button', 'Button--edit', { 'Button--disabled': uiOption.hasActiveOperations }]" type="button" @click="editName()">{{i18nText.edit}}</button>
                    </div>
                  </div>
                  <p class="Field__validation" v-if="errors.name">{{errors.name}}</p>
                </div>
              </div>

              <!-- mobile -->
              <div class="user__mobile">

                <div :class="['Field', {'Field--error': errors.mobileNumber}]">
                  <label class="Field__label Field__label--bold">{{i18nText.mobileNumber}}</label>

                  <!-- added -->
                  <div class="Field__control" v-for="number in customerMobileNumbers" :key="number.id">
                    <div v-if="number.is_primary" class="Field__input Field__input--mobile Field__input--justText">{{ number.number }}</div>
                    <template v-else>
                      <div class="Field__input Field__input--mobile Field__input--justText">{{ number.number }}</div>
                      <!-- state -->
                      <div class="Field__state" v-if="!uiOption.hasActiveOperations">
                        <button class="Button Button--delete" type="button" @click="deleteMobileNumber(number)">{{i18nText.delete}}</button>
                        <span class="Button-divider">|</span>
                        <button class="Button Button--setPrimary" type="button" @click="changePrimaryNumber(number.id)">{{i18nText.setPrimary}}</button>
                      </div>
                      <!-- delete state -->
                      <div class="Field__deleteState deleteState" v-if="numberToDelete && (numberToDelete.number === number.number)">
                        <div class="deleteState__text">{{i18nText.deleteWarning}}</div>
                        <div class="deleteState__actions">
                          <button class="Button Button--yes" type="button" @click="mobileNumberOnDeleteConfirmed()">{{i18nText.yes}}</button>
                          <button class="Button Button--no" type="button" @click="cancelActiveOperations()">{{i18nText.no}}</button>
                        </div>
                      </div>
                    </template>
                  </div>

                  <!-- add new -->
                  <div class="Field__control" v-if="uiOption.showAddNewNumberForm">
                    <input
                      class="Field__input"
                      type="text"
                      :placeholder="i18nText.mobileNumberPlaceholder"
                      v-model="unverifiedNewNumber"
                      @keyup.enter="showOtpFormToVerifyNewNumber()"
                      v-focus
                    >
                    <div class="Field__inlineButton" v-if="!uiOption.showOtpForm">
                      <button
                        class="Button Button--save"
                        type="button"
                        @click="showOtpFormToVerifyNewNumber()"
                      >
                        {{i18nText.save}}
                      </button>
                      <button class="Button Button--cancel" type="button" @click="cancelActiveOperations()">{{i18nText.cancel}}</button>
                    </div>
                  </div>
                  <p class="Field__validation" v-if="errors.mobileNumber">{{errors.mobileNumber}}</p>

                  <!-- pin -->
                  <div class="Field__secondary" v-if="uiOption.showOtpForm">
                    <div :class="['Field', {'Field--error': errors.otp}]">
                      <label class="Field__label Field__label--bold">{{i18nText.otpLabel}}</label>
                      <div class="Field__control">
                        <input
                          class="Field__input"
                          type="text"
                          :placeholder="i18nText.otpPlaceholder"
                          v-model="otp"
                          @keyup.enter="addUnverifiedMobileNumber()"
                          v-focus
                        >
                        <div class="Field__inlineButton">
                          <button
                            class="Button Button--verify"
                            type="button"
                            @click="addUnverifiedMobileNumber()"
                          >
                            {{i18nText.verify}}
                          </button>
                        </div>
                      </div>
                      <p class="Field__validation" v-if="errors.otp">{{errors.otp}}</p>
                      <p class="Field__help" v-if="showAnotherOTPRequest">
                        {{i18nText.otpSentMessage}} {{unverifiedNewNumber}}. {{i18nText.notGetOtp}}.
                        <a :class="['link', {'link--muted': waitingForOtpLinkTobeActive}]" @click="requestForAnotherOTP">
                          <span v-if="waitingForOtpLinkTobeActive">{{ $t('profile.request_otp_again_after', { field: countDown}) }}</span>
                          <span v-else>{{i18nText.requestOtpAgain}}</span>
                        </a>
                      </p>
                    </div>
                  </div>

                  <!-- initial -->
                  <div class="Field__control" v-if="uiOption.showAddNewNumberBtn">
                    <div
                      class="Field__brief"
                      v-if="!hasCustomerAnyPhoneNumber"
                    >
                      {{i18nText.mobileNumberMessage}}
                    </div>
                    <button
                      @click="showingAddNewNumberForm()" :class="['Button', 'Button--add', { 'Button--disabled': uiOption.hasActiveOperations }]" type="button"
                    >
                      {{ addNumberButtonLabel }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- preferred delivery point -->
              <div class="user__deliveryPoint">
                <div class="Field">
                  <label class="Field__label Field__label--bold">{{ i18nText.preferredDeliveryPoint }}</label>
                  <div class="Field__control" v-if="!preferredDeliveryAddress">
                    <div class="Field__brief">{{ i18nText.preferredDeliveryPointGuidedText }}</div>
                  </div>
                  <div class="Field__control" v-else>
                    <preferred-delivery-point-display :showDeliveryCharge="false" :address="preferredDeliveryAddress" />
                  </div>
                  <div class="Field__control">
                    <button type="button" :class="['Button', 'Button--add', { 'Button--disabled': uiOption.hasActiveOperations }]" v-if="!preferredDeliveryAddress" @click="openPreferredDeliveryPointModal">{{ i18nText.setDeliveryPoint }}</button>
                    <button type="button" :class="['Button', 'Button--add', { 'Button--disabled': uiOption.hasActiveOperations }]" v-else @click="openPreferredDeliveryPointModal">{{ i18nText.useDifferentDeliveryPoint }}</button>
                  </div>

                </div>
              </div>

              <!-- invoice -->
              <div class="user__email">
                <div :class="['Field', {'Field--error': errors.email}]">
                  <label class="Field__label Field__label--bold">{{i18nText.invoiceEmail}}</label>

                  <div class="Field__control">
                    <!-- initial -->
                    <template v-if="!customerInvoiceEmail && !uiOption.showEmailForm">
                      <div class="Field__brief">{{ i18nText.invoiceEmailMessage }}</div>
                      <div class="Field__inlineButton">
                        <button :class="['Button', 'Button--add', { 'Button--disabled': uiOption.hasActiveOperations }]" type="button" @click="editEmail()">{{i18nText.add}}</button>
                      </div>
                    </template>

                    <template v-if="customerInvoiceEmail && !uiOption.showEmailForm">
                      <div class="Field__input Field__input--email Field__input--justText">
                        {{ customerInvoiceEmail }}
                      </div>
                      <div class="Field__inlineButton">
                        <button :class="['Button', 'Button--edit', { 'Button--disabled': uiOption.hasActiveOperations }]" type="button" @click="editEmail()">
                          {{i18nText.edit}}
                        </button>
                      </div>
                    </template>

                    <!-- add -->
                    <template v-if="uiOption.showEmailForm">
                      <input
                        class="Field__input"
                        type="email"
                        :placeholder="i18nText.invoiceEmailPlaceholder"
                        v-model="customerInvoiceEmailData"
                        @keyup.enter="updateInvoiceEmail()"
                        v-focus
                      >
                      <div class="Field__inlineButton">
                        <button class="Button Button--save" type="button" @click="updateInvoiceEmail()">{{i18nText.save}}</button>
                        <button class="Button Button--cancel" type="button" @click="cancelActiveOperations()">{{i18nText.cancel}}</button>
                      </div>
                      <!-- <p class="Field__validation" v-if="errors.email">{{errors.email}}</p> -->
                    </template>
                  </div>

                  <p class="Field__validation" v-if="errors.email">{{errors.email}}</p>

                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    i18nMixin,
    i18nRedirect,
    overlayMixin
  } from '~/utils'

  import { otpCountdown } from '~/utils/otp_countdown_mixin'

  import {
    API_ERRORS,
    CONNECT_FACEBOOK,
    REQUEST_NEW_OTP,
    SAVE_CUSTOMER_MOBILE,
    DELETE_CUSTOMER_MOBILE,
    DISCONNECT_FACEBOOK,
    // Profiles
    SAVE_CUSTOMER_INFO

  } from '~/store/constants.yaml'

  import i18nKeys from '~/pages/_lang/customer/profile.i18n.yaml'
  import PreferredDeliveryPointDisplay from '~/components/PreferredDeliveryPointDisplay'

  import trim from 'lodash/trim'
  import replace from 'lodash/replace'
  import find from 'lodash/find'
  import get from 'lodash/get'

  import { mapGetters, mapState } from 'vuex'

  // This email regex is used by HTML 5 email type
  const reEmail = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  const rePhoneNumber = /^01[3-9]\d{8}$/
  const reOtp = /^\d{6}$/
  const reName = /^[a-zA-Z ]{1,50}$/

  export default {
    mixins: [i18nMixin(i18nKeys), otpCountdown, overlayMixin],
    fetch (context) {
      let {store} = context
      if (!store.state.customer) {
        return i18nRedirect(context, '/')
      }
    },
    directives: {
      focus: {
        inserted: function (el) {
          el.focus()
        }
      }
    },
    data () {
      return {
        customerNameData: null,
        customerInvoiceEmailData: null,
        unverifiedNewNumber: null,
        numberToDelete: null,
        otp: null,
        uiOption: {
          showAddNewNumberBtn: true,
          showAddNewNumberForm: false,
          showOtpForm: false,
          chooseToeditName: false,
          showEmailForm: false,
          hasActiveOperations: false
        },
        errors: {
          name: null,
          email: null,
          mobileNumber: null,
          otp: null,
          facebook: null
        }
      }
    },
    watch: {
      unverifiedNewNumber: function (val, oldVal) {
        if (!oldVal) return
        if ((val !== oldVal) && this.uiOption.showOtpForm) {
          this.uiOption.showAddNewNumberForm = true
          this.uiOption.showOtpForm = false
        }
      }
    },
    computed: {
      ...mapState([
        'customer'
      ]),
      ...mapGetters([
        'authToken',
        'customerToken',
        'preferredDeliveryAddress',
        'isLoggedIn'
      ]),
      customerAvatar () {
        return this.customer && (this.customer.facebook_avatar || this.customer.avatar_url) ? (this.customer.facebook_avatar || this.customer.avatar_url) + '?width=150&height=150' : null
      },
      isCustomerFbConnected () {
        return this.isLoggedIn && !!this.customer.facebook_id
      },
      customerName () {
        return get(this.customer, 'name', 'Guest')
      },
      customerInvoiceEmail () {
        return get(this.customer, 'invoice_email')
      },
      addNumberButtonLabel () {
        if (!this.customerMobileNumbers) return
        return this.customerMobileNumbers.length ? this.$t('profile.add_another') : this.$t('profile.add')
      },
      customerMobileNumbers () {
        return get(this.customer, 'mobiles', [])
      },
      hasCustomerAnyPhoneNumber () {
        return (this.customerMobileNumbers && this.customerMobileNumbers.length)
      }
    },
    methods: {
      validate (whichValidation) {
        this.errors.name = null
        this.errors.email = null
        this.errors.mobileNumber = null
        this.errors.otp = null

        if (whichValidation === 'name') {
          this.customerNameData = trim(this.customerNameData)
          if (!this.customerNameData) {
            this.errors.name = this.$t('validation.required', {field: this.$t('profile.name_field')})
          } else if (this.customerNameData.length > 50) {
            this.errors.name = this.$t('validation.name_length')
          } else if (!reName.test(this.customerNameData)) {
            this.errors.name = this.$t('validation.name_contain')
          } else {
            this.errors.name = false
          }
        }

        if (whichValidation === 'email') {
          if (!this.customerInvoiceEmailData) {
            this.errors.email = this.$t('validation.required', {field: this.$t('profile.invoice_email')})
          } else if (!reEmail.test(this.customerInvoiceEmailData)) {
            this.errors.email = this.$t('validation.invalid_email', {value: this.customerInvoiceEmailData})
          } else {
            this.errors.email = false
          }
        }

        if (whichValidation === 'mobileNumber') {
          this.unverifiedNewNumber = replace(this.unverifiedNewNumber, /\D/g, '') // remove all non digit character
          let result = find(this.customerMobileNumbers, {'number': this.unverifiedNewNumber})
          if (result) {
            this.errors.mobileNumber = this.$t('validation.number_in_use', {value: this.unverifiedNewNumber})
          } else if (!this.unverifiedNewNumber) {
            this.errors.mobileNumber = this.$t('validation.required', {field: this.$t('profile.mobile_number')})
          } else if (!rePhoneNumber.test(this.unverifiedNewNumber)) {
            this.errors.mobileNumber = this.$t('validation.invalid_mobile_number', {value: this.unverifiedNewNumber})
          } else {
            this.errors.mobileNumber = false
          }
        }

        if (whichValidation === 'otp') {
          if (!this.otp) {
            this.errors.otp = this.$t('validation.required', {field: this.$t('profile.otp_label')})
          } else if (!reOtp.test(this.otp)) {
            this.errors.otp = this.$t('validation.otp_length', {field: this.$t('profile.otp_label')})
          } else {
            this.errors.otp = false
          }
        }

        return !(this.errors.name || this.errors.email || this.errors.mobileNumber || this.errors.otp)
      },
      requestForAnotherOTP () {
        if (!this.waitingForOtpLinkTobeActive) {
          this.requestOTPForNewNumber()
          this.startTimer()
        }
      },
      requestOTPForNewNumber () {
        this.$store.dispatch(REQUEST_NEW_OTP, {
          authToken: this.authToken,
          phoneNumber: this.unverifiedNewNumber
        })
        .then((result) => {
          this.otp = null
          this.uiOption.showOtpForm = true
        })
        .catch(reason => {
          switch (reason.error) {
            case API_ERRORS.NUMBER_IN_USE:
              this.errors.mobileNumber = this.__e(API_ERRORS.NUMBER_IN_USE, { field: this.unverifiedNewNumber })
              break
            default:
              this.errors.mobileNumber = this.__e(API_ERRORS.DEFAULT_ERROR)
          }
        })
      },
      connectWithFacebook () {
        this.$store.dispatch(CONNECT_FACEBOOK, this.$fbsdk)
        .catch(reason => {
          switch (reason.error) {
            case API_ERRORS.FACEBOOK_EXISTS:
              this.errors.facebook = this.__e(API_ERRORS.FACEBOOK_EXISTS)
              break
          }
        })
      },
      disconnectWithFacebook () {
        this.$store.dispatch(DISCONNECT_FACEBOOK)
      },
      updateCustomerName () {
        if (!this.validate('name')) return
        if (this.customerNameData === this.customerName) {
          this.cancelActiveOperations()
          return
        }
        return this.$store.dispatch(SAVE_CUSTOMER_INFO, {
          name: this.customerNameData
        })
        .then(() => {
          this.cancelActiveOperations()
        })
      },
      editName () {
        this.customerNameData = this.customerName
        this.uiOption.chooseToeditName = true
        this.uiOption.hasActiveOperations = true
      },
      addUnverifiedMobileNumber () {
        if (!this.validate('otp')) return
        this.$store.dispatch(SAVE_CUSTOMER_MOBILE, {
          number: this.unverifiedNewNumber,
          otp: this.otp
        })
        .then((result) => {
          this.cancelActiveOperations()
        })
        .catch((reason) => {
          switch (reason.error) {
            case API_ERRORS.NUMBER_IN_USE:
              this.errors.mobileNumber = this.__e(API_ERRORS.NUMBER_IN_USE, { field: this.unverifiedNewNumber })
              this.uiOption.showOtpForm = false
              break
            case API_ERRORS.OTP_MISMATCH:
              this.errors.otp = this.__e(API_ERRORS.OTP_MISMATCH, {field: this.$t('profile.otp_label')})
              break
            default:
              this.errors.mobileNumber = this.__e(API_ERRORS.DEFAULT_ERROR)
              this.uiOption.showOtpForm = false
          }
        })
      },
      deleteMobileNumber (number) {
        this.numberToDelete = number
        this.uiOption.hasActiveOperations = true
      },
      mobileNumberOnDeleteConfirmed () {
        this.$store.dispatch(DELETE_CUSTOMER_MOBILE, this.numberToDelete.id)
        .then(() => {
          this.cancelActiveOperations()
        })
      },
      changePrimaryNumber (id) {
        return this.$store.dispatch(SAVE_CUSTOMER_INFO, {
          primary_mobile_id: id
        })
      },
      updateInvoiceEmail () {
        this.errors.email = null
        if (!this.validate('email')) return
        if (this.customerInvoiceEmailData === this.customerInvoiceEmail) {
          this.cancelActiveOperations()
          return
        }
        return this.$store.dispatch(SAVE_CUSTOMER_INFO, {
          invoice_email: this.customerInvoiceEmailData
        })
        .then(() => {
          this.cancelActiveOperations()
        })
        .catch(reason => {
          switch (reason.error) {
            case (API_ERRORS.VALIDATION_FAILED):
              this.errors.email = this.__e(API_ERRORS.VALIDATION_FAILED)
              break
            default:
              this.errors.email = this.__e(API_ERRORS.DEFAULT_ERROR)
          }
        })
      },
      editEmail () {
        this.customerInvoiceEmailData = this.customerInvoiceEmail
        this.uiOption.showEmailForm = true
        this.uiOption.hasActiveOperations = true
      },
      showingAddNewNumberForm () {
        this.uiOption.showAddNewNumberBtn = false
        this.uiOption.showAddNewNumberForm = true
        this.uiOption.hasActiveOperations = true
      },
      showOtpFormToVerifyNewNumber () {
        if (!this.validate('mobileNumber')) return
        this.requestOTPForNewNumber()
        this.startTimer()
      },
      cancelActiveOperations () {
        this.customerNameData = null
        this.customerInvoiceEmailData = null
        this.unverifiedNewNumber = null
        this.numberToDelete = null
        this.otp = null

        this.uiOption.showAddNewNumberBtn = true
        this.uiOption.showAddNewNumberForm = false
        this.uiOption.showOtpForm = false
        this.uiOption.chooseToeditName = false
        this.uiOption.showEmailForm = false
        this.uiOption.hasActiveOperations = false

        this.errors.name = null
        this.errors.email = null
        this.errors.mobileNumber = null
        this.errors.otp = null
      },
      openPreferredDeliveryPointModal () {
        this.openOverlay(this.overlays.preferredDeliveryPointModal)
      }
    },
    components: {
      PreferredDeliveryPointDisplay
    }
  }
</script>

<style lang="sass" scoped>
  @import "shared/button"
  @import "shared/form/field"

  .Field
    &__label
      padding: 0

    &__control
      display: flex
      flex-flow: row wrap
      &:not(:last-child)
        margin-bottom: 10px
    &__brief,
    &__input
      flex: 1
    &__inlineButton
      flex: 0 auto
      margin-left: 5px

    &__brief
      line-height: 1.55

    &__input
      height: 32px
      &--name
        font-size: 15px
        font-weight: 700
        background-color: $white
        padding: 0 15px
      &--justText
        border: none
        padding: 0
      &--mobile
        padding: 0 15px
        margin-right: 0
        background-color: #f5f5f5
        &:focus,
        &:active
          background-color: #f5f5f5

      &--email
        padding: 0
        background-color: $white

    &__state
      position: absolute
      top: 50%
      right: 0
      margin-right: 10px
      transform: translateY(-50%)
      display: flex
      align-items: center

    &__secondary
      margin-top: 15px
      padding-bottom: 20px
      .Field__label
        font-size: 13px
        padding: 0 15px

    &__deleteState
      position: absolute
      top: 0
      bottom: 0
      left: 0
      right: 0
      background-color: rgba(#fde7ec, 0.85)
      border: 1px solid #fac4d0

  .deleteState
    display: flex
    justify-content: flex-end
    align-items: center
    &__text
      color: $red
    &__actions
      margin-left: 10px

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
    &__iconFacebook15x15
      width: 15px
      height: 15px
      position: relative
    &--continueWithFacebook
      border: none
      background-color: #3b5997
      display: inline-flex
      align-items: center
      text-align: left
      padding: 0 15px
      color: #fff
      fill: #fff
      &:hover,
      &:focus
        color: #fff
        fill: #fff
        background-color: darken(#3b5997, 5%)

      .Button__label
        margin-left: 7px
        letter-spacing: .02em

    &--save,
    &--verify
      border-color: $primary
      color: $primary
      fill: $primary
      &:hover,
      &:focus,
      &:active
        border-color: darken($primary, 10%)
        color: $primary
        fill: $primary
    &--save
      margin-right: 5px

    &--delete,
    &--setPrimary
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
    &--delete
      margin-right: 2px
    &--setPrimary
      margin-left: 2px
    &-divider
      color: #777
      fill: #777

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
      margin-right: 1px
    &--no
      background-color: #252525
    &--disabled
      pointer-events: none
      opacity: .55

  .CustomerProfile
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

  .user
    position: relative
    +tablet
      max-width: 610px
      display: flex
      flex-flow: row-reverse wrap

    &__image
      margin-bottom: 30px
      +tablet
        max-width: 150px
        margin-bottom: 0
        flex: 1
        display: flex
        flex-flow: column wrap
    &__avatar
      width: 150px
      height: 150px
      background-color: rgba($primary, .24)
      border-radius: 50%
      overflow: hidden
      margin-left: auto
      margin-right: auto
      color: $white
      fill: $white
      &__svgIcon
        width: 100%
    &__connect
      margin-top: 10px
      text-align: center

    &__content
      position: relative
      // background-color: rgba($black, .1)
      +tablet
        flex: 1
        margin-right: 70px


    &__name

    &__mobile,
    &__email,
    &__deliveryPoint
      margin-top: 25px

    &__email
      margin-bottom: 50px
</style>

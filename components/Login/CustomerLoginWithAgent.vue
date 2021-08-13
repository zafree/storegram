<template>
  <div>
      <p :class="$style.oneClickStatement" v-if="userNeedsUpdate" v-html="verificationHint"></p>
      <p :class="$style.oneClickStatement" v-if="requestedProduct" v-html="requestedProductVerificationHint"></p>
      <div :class="[$style.field, {[$style.fieldError]: errors.phoneNumber, [$style.fieldSuccess]: errors.phoneNumber === false}]">
          <label :class="$style.fieldLabel">{{ i18nText.phoneLabel }}</label>
          <div :class="$style.fieldControl">
              <input :class="$style.fieldInput" type="tel" :value="phoneNumber" :placeholder="i18nText.agentPhonePlaceHolder" @keyup.enter="processRequest()" @input="updatePhoneNumber" v-focus>
          </div>
          <p :class="$style.fieldValidation" v-if="errors.phoneNumber">{{errors.phoneNumber}}</p>
      </div>

      <div v-if="requiredName" :class="[$style.Field, {[$style.fieldError]: errors.name, [$style.fieldSuccess]: errors.name === false}]">
          <label :class="$style.fieldLabel">{{ i18nText.nameLabel }}</label>
          <div :class="$style.fieldControl">
              <input ref="name" :class="$style.fieldInput" type="text" v-model="name" :placeholder="i18nText.namePlaceholder" @keyup.enter="processRequest()">
          </div>
          <p v-if="errors.name" :class="$style.fieldValidation">{{errors.name}}</p>
      </div>

      <div :class="$style.field">
        <button :class="[$style.button, $style.buttonLogin]" @click="processRequest()">{{ processButtonLabel }}</button>
      </div>

  </div>
</template>

<script>
  import {
    LOGIN_WITH_OTP,
    SAVE_CUSTOMER_INFO,
    REQUEST_NEW_OTP,
    REGISTER_WITH_OTP,
    SET_PREFERRED_DELIVERY_METHOD,
    PICKED_DELIVERY_METHODS
  } from '~/store/constants.yaml'

  import replace from 'lodash/replace'
  import { mapGetters, mapState } from 'vuex'
  import { i18nMixin, overlayMixin } from '~/utils'
  import logger from '~/utils/logger'
  import { mixin as onClickOutside } from 'vue-on-click-outside'
  import i18nKeys from '~/components/Login.i18n.yaml'

  const rePhoneNumber = /^01[3-9]\d{8}$/
  const reOtp = /^\d{6}$/

  export default {
    mixins: [onClickOutside, i18nMixin(i18nKeys), overlayMixin],
    props: {
      successCallback: {
        type: Function,
        required: false,
        default: null
      },
      requestedProduct: {
        type: Object,
        required: false,
        default: null
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
        phoneNumberMode: false,
        errors: {
          phoneNumber: null,
          name: null
        },
        gotOTP: null,
        phoneNumber: null,
        name: null,
        requiredName: false,
        checkForUserExistance: false,
        userFound: false,
        lastPhoneNumberTried: null,
        previousLoggedInUsersFbInfo: null
      }
    },
    computed: {
      ...mapState([
        'pageMode',
        'ui',
        'customer'
      ]),
      ...mapGetters([
        'agentToken'
      ]),
      isThisTheLastNumberTried () {
        return this.lastPhoneNumberTried === this.phoneNumber
      },
      requestedProductVerificationHint () {
        if (this.requestedProduct) {
          return this.$t('login_modal.product_request_verification_hint', {field: this.requestedProduct.name})
        }
      },
      processButtonLabel () {
        let computedLabel = null
        if (!this.customer) {
          computedLabel = !this.requireOtp ? this.i18nText.buttonTextSignInUp : (this.userFound ? this.i18nText.buttonTextSignin : this.i18nText.buttonTextSignUp)
        } else {
          computedLabel = !this.requireOtp ? this.i18nText.buttonTextContinue : this.i18nText.buttonTextVerify
        }
        return computedLabel
      },
      hasVerifiedMobile () {
        return this.$store.getters.userHasVerifiedNumbers
      },
      requireName () {
        if (this.pageMode.checkoutMode && this.customer) {
          return this.requireOtp && this.userNeedsUpdate
        }
        return this.requireOtp && !this.userFound
      },
      userNeedsUpdate () {
        return this.pageMode.checkoutMode && !this.hasVerifiedMobile && !this.userFound
      },
      verificationHint () {
        if (this.isAgentMode) return this.i18nText.agentVerificationHint
        else return this.i18nText.verificationHint
      },
      agentPhonePlaceHolder () {
        return this.i18nText.agentPhonePlaceHolder
      },
      isLoggedIn () {
        return !!this.customer
      }
    },
    methods: {
      tryLogin () {
        return this.$store.dispatch(LOGIN_WITH_OTP, {
          mobileNumber: this.phoneNumber,
          otp: this.gotOTP,
          agentToken: this.agentToken
        })
        .then(this.onRequestSuccess)
        .catch((reason) => {
          logger.error('tryLogin', reason)
        })
      },
      registrationFromAgent () {
        return this.$store.dispatch(REGISTER_WITH_OTP, {
          name: this.name,
          mobileNumber: this.phoneNumber,
          otp: this.gotOTP,
          agentToken: this.agentToken
        })
        .then(this.onRequestSuccess)
        .catch((reason) => {
          logger.error('tryLogin', reason)
        })
      },
      updatePhoneNumber ($event) {
        const newValue = $event.target.value
        this.phoneNumber = newValue
        if (this.phoneNumber !== this.lastPhoneNumberTried) {
          this.requiredName = false
        } else {
          this.requiredName = true
        }
      },
      validate () {
        this.errors.phoneNumber = null
        this.errors.name = null
        this.errors.otp = null
        this.phoneNumber = replace(this.phoneNumber, /\D/g, '') // remove all non digit character

        if (!this.phoneNumber) {
          this.errors.phoneNumber = this.$t('validation.required', {field: this.i18nText.phoneLabel})
        } else if (!rePhoneNumber.test(this.phoneNumber)) {
          this.errors.phoneNumber = this.$t('validation.invalid_mobile_number', {value: this.phoneNumber})
        } else {
          this.errors.phoneNumber = false
        }

        if (this.requireOtp) {
          if (!this.otp) {
            this.errors.otp = this.$t('validation.required', {field: this.i18nText.otpLabel})
          } else if (!reOtp.test(this.otp)) {
            this.errors.otp = this.$t('validation.otp_length', {field: this.i18nText.otpLabel})
          } else {
            this.errors.otp = false
          }
        }

        if (this.requiredName) {
          if (!this.name) {
            this.errors.name = this.$t('validation.required', {field: this.i18nText.nameLabel})
          } else {
            this.errors.name = false
          }
        }

        return !(this.errors.phoneNumber || this.errors.name || this.errors.otp)
      },
      processRequest () {
        if (!this.validate()) return

        if (!this.checkForUserExistance || (this.lastPhoneNumberTried && (this.lastPhoneNumberTried !== this.phoneNumber))) {
          return this.checkExistance(false)
        }

        if (!this.isLoggedIn) {
          return this.registrationFromAgent()
        }

        if (this.pageMode.checkoutMode || this.requestedProduct) {
          return this.updateCustomer()
        }
      },
      checkExistance (validate) {
        if (validate && !this.validate()) return
        this.$store.dispatch(REQUEST_NEW_OTP, {
          authToken: this.agentToken,
          phoneNumber: this.phoneNumber
        })
        .then((result) => {
          this.gotOTP = result.otp
          if (!result.customer_exists) {
            this.userFound = result.customer_exists
            this.requiredName = !result.customer_exists
            this.checkForUserExistance = true
            this.lastPhoneNumberTried = this.phoneNumber
          } else {
            this.tryLogin()
          }
        })
        .catch((reason) => {
          console.log('Error occured')
        })
      },
      onRequestSuccess (data) {
        if (this.ui.overlayContext && this.ui.overlayContext.openPreferredDeliveryPointModalAfterLogin) {
          this.$store.commit(SET_PREFERRED_DELIVERY_METHOD, PICKED_DELIVERY_METHODS.CUSTOMER)
          this.openOverlay(this.overlays.preferredDeliveryPointModal)
        }
        if (this.hasVerifiedMobile || !(this.pageMode.checkoutMode || this.requestedProduct)) {
          if (this.userFound) {
            this.$store.dispatch(SAVE_CUSTOMER_INFO, this.previousLoggedInUsersFbInfo)
          }
          return this.successCallback && this.successCallback(data)
        } else if (this.customer) {
          this.name = this.customer.name
        }
      },
      updateCustomer () {
        return this.$store.dispatch(SAVE_CUSTOMER_INFO, {
          number: this.phoneNumber,
          otp: null,
          name: this.name
        })
        .then(this.onRequestSuccess)
        .catch((reason) => {
        })
      }
    },
    mounted () {
      if (this.customer) {
        this.name = this.customer.name
      }
      this.phoneNumberMode = this.isAgentMode
    }
  }
</script>

<style lang="sass" module>
  @import "shared/button"
  @import "shared/form/field"

  .LinkPurple
    color: $primary
    fill: $primary
  
  .SvgIconFacebook
    width: 22px
    height: 22px

  .Button
    &--continueWithFacebook
      height: 52px
      background-color: #3b5997
      display: inline-flex
      align-items: center
      width: 100%
      text-align: left
      padding: 0 20px
      color: #fff
      fill: #fff
      font-size: 14px
      font-weight: 400
      &:hover,
      &:focus
        color: #fff
        fill: #fff
        background-color: darken(#3b5997, 5%)

      .Button__label
        margin-left: 10px
        letter-spacing: .02em

    &--loginWithPhone
      display: flex
      align-items: center
      justify-content: center
      margin-top: 18px
      color: #41b468
      fill: #41b468
      &:hover,
      &:focus
        color: darken(#41b468, 5%)
        fill: darken(#41b468, 5%)
        text-decoration: underline

    &--loginWithFacebook
      display: flex
      align-items: center
      justify-content: center
      margin-top: 18px
      color: #3b5997
      fill: #3b5997
      &:hover,
      &:focus
        color: darken(#3b5997, 5%)
        fill: darken(#3b5997, 5%)
        text-decoration: underline

    &--login
      display: flex
      justify-content: center
      align-item: center
      width: 100%
      +button

  .oneClickStatement
    font-size: 13px
    color: #aaa
    margin-top: 0
    margin-bottom: 16px

</style>

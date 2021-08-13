<template>
  <div :class="$style.loginWrapper">
    <template v-if="!phoneNumberMode && !customer">
      <p :class="$style.copy" v-if="!requestedProduct" v-html="i18nText.facebookLoginHint"></p>
      <p :class="$style.copy" v-if="requestedProduct" v-html="i18nText.productRequestLoginHint"></p>
      <button :class="[$style.loginBtn, $style.btn, $style.btnPrimary]" @click.prevent="switchToPhoneNumberMode()">{{ i18nText.signInUpWithPhone }}</button>

    </template>
    <template v-else>
      <p :class="$style.copy" v-if="userNeedsUpdate" v-html="verificationHint"></p>
      <p :class="$style.copy" v-if="requestedProduct" v-html="requestedProductVerificationHint"></p>

      <div :class="[$style.field, $style.fieldFirst, {[$style.fieldError]: errors.phoneNumber, [$style.fieldSuccess]: errors.phoneNumber === false}]">
        <label :class="$style.fieldLabel">{{ i18nText.phoneLabel }}</label>
        <div :class="$style.fieldControl">
          <input :class="$style.fieldInput" type="tel" :value="phoneNumber" :placeholder="i18nText.customerPhonePlaceHolder" @keyup.enter="processRequest()" @input="updatePhoneNumber" v-focus>
        </div>
        <p :class="$style.fieldValidation" v-if="errors.phoneNumber">{{errors.phoneNumber}}</p>
      </div>

      <div v-if="requireName" :class="[$style.field, {[$style.fieldError]: errors.name, [$style.fieldSuccess]: errors.name === false}]">
        <label :class="$style.fieldLabel">{{ i18nText.nameLabel }}</label>
        <div :class="$style.fieldControl">
          <input ref="name" :class="$style.fieldInput" type="text" v-model="name" :placeholder="i18nText.namePlaceholder" @keyup.enter="processRequest()">
        </div>
        <p v-if="errors.name" :class="$style.fieldValidation">{{errors.name}}</p>
      </div>

      <div v-if="requireOtp" :class="[$style.field, {[$style.fieldError]: errors.otp, [$style.fieldSuccess]: errors.otp === false}]">
        <label :class="$style.fieldLabel">{{ i18nText.otpLabel }}</label>
        <div :class="$style.fieldControl">
          <input :class="$style.fieldInput" type="number" v-model="otp" :placeholder="i18nText.otpPlaceholder" @keyup.enter="processRequest()">
        </div>
        <p v-if="errors.otp" :class="$style.fieldValidation">{{errors.otp}}</p>
        <div :class="$style.fieldHelp">
          <p :class="$style.fieldHelpText"> {{ i18nText.otpSentMessage }} {{ phoneNumber }}. {{ i18nText.didNotGetOtp }}</p>
          <button :class="[$style.fieldHelpBtn, $style.btn, {[$style.btnMuted]: waitingForOtpLinkTobeActive}]" @click="requestForAnotherOTP(false)" >
            <span v-if="waitingForOtpLinkTobeActive">{{ $t('login_modal.request_otp_again_after') }}</span>
            <span v-else>{{ i18nText.requestOtpAgain }}</span>
          </button>
        </div>
      </div>

      <div :class="$style.field">
        <button :class="[$style.btn, $style.btnPrimary]" @click="processRequest()">{{ processButtonLabel }}</button>
      </div>
    </template>
  </div>
</template>

<script>
  import {
    LOGIN_WITH_OTP,
    REGISTER_WITH_OTP,
    SAVE_CUSTOMER_INFO,
    REQUEST_NEW_OTP,
    CONNECT_FACEBOOK,
    API_ERRORS,
    SET_PREFERRED_DELIVERY_METHOD,
    PICKED_DELIVERY_METHODS,
    LOGIN_BY_FACEBOOK_SUCCESSFUL,
    OTP_REQUEST_COUNT_DOWN
  } from '~/store/constants.yaml'

  import { mapGetters, mapState } from 'vuex'
  import { i18nMixin, overlayMixin } from '~/utils'
  import logger from '~/utils/logger'
  import pick from 'lodash/pick'
  import replace from 'lodash/replace'
  import { mixin as onClickOutside } from 'vue-on-click-outside'
  import i18nKeys from '~/components/Login.i18n.yaml'

  const rePhoneNumber = /^01[3-9]\d{8}$/
  const reOtp = /^\d{6}$/

  function tryLogin (vm) {
    let loginObj = {
      mobileNumber: vm.phoneNumber,
      otp: vm.otp
    }

    if (vm.shouldLoginWithFacebookInfo) {
      loginObj.accessToken = vm.customerInfoAfterFacebookLoginTry.accessToken
      loginObj.userId = vm.customerInfoAfterFacebookLoginTry.userID
    }

    return vm.$store.dispatch(LOGIN_WITH_OTP, loginObj)
    .then(vm.onRequestSuccess)
    .catch((reason) => {
      switch (reason.error) {
        case API_ERRORS.NUMBER_NOT_FOUND:
        case API_ERRORS.USER_NOT_FOUND:
          vm.errors.phoneNumber = vm.__e(API_ERRORS.USER_NOT_FOUND, {field: vm.i18nText.phoneLabel})
          break
        case API_ERRORS.OTP_MISMATCH:
          vm.errors.otp = vm.__e(API_ERRORS.OTP_MISMATCH, {field: vm.i18nText.otpLabel})
          break
      }
      logger.error('tryLogin', reason)
    })
  }

  function tryRegistration (vm) {
    let registrationObj = {
      mobileNumber: vm.phoneNumber,
      otp: vm.otp,
      name: vm.name
    }
    if (vm.shouldLoginWithFacebookInfo) {
      registrationObj.accessToken = vm.customerInfoAfterFacebookLoginTry.accessToken
      registrationObj.userId = vm.customerInfoAfterFacebookLoginTry.userID
    }
    return vm.$store.dispatch(REGISTER_WITH_OTP, registrationObj)
    .then(vm.onRequestSuccess)
    .catch((reason) => {
      switch (reason.error) {
        case API_ERRORS.NUMBER_IN_USE:
          vm.errors.phoneNumber = vm.__e(API_ERRORS.NUMBER_IN_USE, {field: vm.i18nText.phoneLabel})
          break
        case API_ERRORS.NUMBER_NOT_FOUND:
          vm.errors.phoneNumber = vm.__e(API_ERRORS.NUMBER_NOT_FOUND, {field: vm.i18nText.phoneLabel})
          break
        case API_ERRORS.OTP_MISMATCH:
          vm.errors.otp = vm.__e(API_ERRORS.OTP_MISMATCH, {field: vm.i18nText.otpLabel})
          break
      }
      logger.error('tryRegistration', reason)
    })
  }

  function updateCustomer (vm) {
    return vm.$store.dispatch(SAVE_CUSTOMER_INFO, {
      number: vm.phoneNumber,
      otp: vm.otp,
      name: vm.name
    })
    .then(vm.onRequestSuccess)
    .catch((reason) => {
      switch (reason.error) {
        case API_ERRORS.USER_NOT_FOUND:
        case API_ERRORS.NUMBER_NOT_FOUND:
          vm.errors.phoneNumber = vm.__e(API_ERRORS.NUMBER_NOT_FOUND, {field: vm.i18nText.phoneLabel})
          break
        case API_ERRORS.OTP_MISMATCH:
          vm.errors.otp = vm.__e(API_ERRORS.OTP_MISMATCH, {field: vm.i18nText.otpLabel})
          break
        case API_ERRORS.NUMBER_IN_USE:
          vm.errors.phoneNumber = vm.__e(API_ERRORS.NUMBER_IN_USE, {field: vm.i18nText.phoneLabel})
          break
      }
      logger.error('updateCustomer', reason)
    })
  }

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
    created () {
      this.$root.$on(LOGIN_BY_FACEBOOK_SUCCESSFUL, () => {
        this.successCallback()
      })
    },
    data () {
      return {
        phoneNumberMode: false,
        errors: {
          phoneNumber: null,
          name: null,
          otp: null
        },
        phoneNumber: null,
        otp: null,
        name: null,
        requireOtp: false,
        userFound: false,
        lastPhoneNumberWithOtp: null,
        previousLoggedInUsersFbInfo: null,
        waitingForOtpLinkTobeActive: false,
        customerInfoAfterFacebookLoginTry: null
      }
    },
    computed: {
      ...mapState([
        'pageMode',
        'ui',
        'customer'
      ]),
      ...mapGetters([
        'isAgentMode',
        'customerToken'
      ]),
      shouldLoginWithFacebookInfo () {
        if (!this.customerInfoAfterFacebookLoginTry) return
        return this.customerInfoAfterFacebookLoginTry.hasOwnProperty('is_connected')
      },
      requestedProductVerificationHint () {
        if (this.requestedProduct) {
          return this.$t('login_modal.product_request_verification_hint', {field: this.requestedProduct.name})
        }
      },
      isFbSdkReady () {
        return this.$store.state.isFbSdkReady && this.$fbsdk
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
      facebookLoginText () {
        return this.phoneNumberMode ? this.i18nText.signInUpWithFacebook : this.i18nText.continueWithFacebook
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
        if (this.isAgentMode) return this.i18nText.agentPhonePlaceHolder
        else return this.i18nText.customerPhonePlaceHolder
      },
      isLoggedIn () {
        return !!this.customer
      }
    },
    methods: {
      updatePhoneNumber ($event) {
        const newValue = $event.target.value
        this.phoneNumber = newValue
        this.requireOtp = this.lastPhoneNumberWithOtp && this.lastPhoneNumberWithOtp === newValue
      },
      loginWithFacebook () {
        this.$store.dispatch(CONNECT_FACEBOOK, this.$fbsdk)
          .then((customer) => {
            this.customerInfoAfterFacebookLoginTry = customer
            if (customer.is_connected) {
              this.successCallback()
            } else {
              this.switchToPhoneNumberMode()
            }
          })
      },
      switchToPhoneNumberMode () {
        this.phoneNumberMode = true
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

        if (this.requireName) {
          if (!this.name) {
            this.errors.name = this.$t('validation.required', {field: this.i18nText.nameLabel})
          } else {
            this.errors.name = false
          }
        }

        return !(this.errors.phoneNumber || this.errors.name || this.errors.otp)
      },
      handleWaitingForOtpLinkTobeActive () {
        if (!this.waitingForOtpLinkTobeActive) {
          this.waitingForOtpLinkTobeActive = true
          setTimeout(() => {
            this.waitingForOtpLinkTobeActive = false
          }, parseInt(OTP_REQUEST_COUNT_DOWN) * 1000)
        }
      },
      requestForAnotherOTP (validate) {
        if (!this.waitingForOtpLinkTobeActive) {
          this.requestNewOtp(validate, this.customerToken)
          this.handleWaitingForOtpLinkTobeActive()
        }
      },
      requestNewOtp (validate, customerToken) {
        if (validate && !this.validate()) return
        this.$store.dispatch(REQUEST_NEW_OTP, {
          authToken: null,
          phoneNumber: this.phoneNumber,
          facebookId: this.customerInfoAfterFacebookLoginTry ? this.customerInfoAfterFacebookLoginTry.userID : null
        })
        .then((result) => {
          this.lastPhoneNumberWithOtp = this.phoneNumber
          this.userFound = result.customer_exists
          // Populating name to register a new customer when s/he is tring to login with facebook
          if (!result.customer_exists && (this.customerInfoAfterFacebookLoginTry && this.customerInfoAfterFacebookLoginTry.name)) {
            this.name = this.customerInfoAfterFacebookLoginTry.name
          }
          this.requireOtp = true
          this.otp = null
        })
        .catch((reason) => {
          let i18nContext = null
          switch (reason.error) {
            case API_ERRORS.NUMBER_IN_USE:
            case API_ERRORS.NUMBER_EXISTS:
              i18nContext = {field: this.i18nText.phoneLabel}
          }
          this.errors.phoneNumber = this.__e(reason.error, i18nContext)
        })
      },

      processRequest () {
        if (!this.validate()) return

        this.handleWaitingForOtpLinkTobeActive()
        if (!this.requireOtp) {
          return this.requestNewOtp(false, this.customerToken)
        }

        if (!this.isLoggedIn) {
          if (this.userFound) {
            return tryLogin(this)
          } else {
            return tryRegistration(this)
          }
        } else if (this.isLoggedIn && this.userFound) {
          this.previousLoggedInUsersFbInfo = pick(this.customer, ['facebook_access_token', 'facebook_avatar', 'facebook_id'])
          return tryLogin(this)
        }

        if (this.pageMode.checkoutMode || this.requestedProduct) {
          return updateCustomer(this)
        }
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
  @import "shared/field"
  .login
    &-wrapper
      position: relative
    &-btn
      margin-top: $gutter*1.25
  .copy
    font-size: 14px
    padding-right: $gutter*2
</style>

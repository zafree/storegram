<template>
  <div :class="$style.login">
    <template v-if="!phoneNumberMode && !customer">
      <p :class="$style.oneClickStatement" v-if="!requestedProduct" v-html="i18nText.facebookLoginHint"></p>
      <p :class="$style.oneClickStatement" v-if="requestedProduct" v-html="i18nText.productRequestLoginHint"></p>
      <!-- <button :class="[$style.button, $style.buttonContinueWithFacebook]" v-if="isFbSdkReady" @click="loginWithFacebook">
        <svg viewBox="0 0 28 28">
          <g>
            <path fill="#FFFFFF" d="M28,14c0-7.7-6.3-14-14-14S0,6.3,0,14c0,6.9,5,12.8,11.8,13.8V18H8.3v-4h3.6v-3.1
              c0-3.5,2.1-5.4,5.3-5.4c1,0,2.1,0.1,3.1,0.3v3.4h-1.8c-1.1-0.1-2.1,0.6-2.3,1.7c0,0.1,0,0.3,0,0.4V14h3.9l-0.6,4h-3.3v9.8
              C23,26.8,28,20.9,28,14z"/>
            <path fill="#1878F2" d="M19.4,18l0.6-4h-3.9v-2.6c-0.1-1.1,0.7-2.1,1.8-2.2c0.1,0,0.3,0,0.4,0h1.8V5.7
              c-1-0.2-2.1-0.3-3.1-0.3c-3.2,0-5.3,1.9-5.3,5.4V14H8.3v4h3.6v9.8c1.4,0.2,2.9,0.2,4.4,0V18L19.4,18z"/>
          </g>
        </svg>
        <span>{{ facebookLoginText }}</span>
      </button> -->
      <button :class="[$style.button, $style.buttonLoginWithPhone]" @click.prevent="switchToPhoneNumberMode()">
        {{ i18nText.signInUpWithPhone }}
      </button>
    </template>
    <template v-else>
      <p :class="$style.oneClickStatement" v-if="userNeedsUpdate" v-html="verificationHint"></p>
      <p :class="$style.oneClickStatement" v-if="requestedProduct" v-html="requestedProductVerificationHint"></p>

      <div :class="[$style.field, {[$style.fieldError]: errors.phoneNumber, [$style.fieldSuccess]: errors.phoneNumber === false}]">
          <label :class="$style.fieldLabel">{{ i18nText.phoneLabel }}</label>
          <div :class="$style.fieldControl">
            <input :class="$style.fieldInput" type="tel" :value="phoneNumber" :placeholder="i18nText.customerPhonePlaceHolder" @keyup.enter="processRequest()" @input="updatePhoneNumber" v-focus>
          </div>
          <p :class="$style.fieldValidation" v-if="errors.phoneNumber">{{errors.phoneNumber}}</p>
      </div>

      <div v-if="requireName" :class="[$style.Field, {[$style.fieldError]: errors.name, [$style.fieldSuccess]: errors.name === false}]">
          <label :class="$style.fieldLabel">{{ i18nText.nameLabel }}</label>
          <div :class="$style.fieldControl">
              <input ref="name" :class="$style.fieldInput" type="text" v-model="name" :placeholder="i18nText.namePlaceholder" @keyup.enter="processRequest()">
          </div>
          <p v-if="errors.name" :class="$style.fieldValidation">{{errors.name}}</p>
      </div>

      <div v-if="requireOtp" :class="[$style.Field, {[$style.fieldError]: errors.otp, [$style.fieldSuccess]: errors.otp === false}]">
          <label :class="$style.fieldLabel">{{ i18nText.otpLabel }}</label>
          <div :class="$style.fieldControl">
              <input :class="$style.fieldInput" type="number" v-model="otp" :placeholder="i18nText.otpPlaceholder" @keyup.enter="processRequest()">
          </div>
          <p v-if="errors.otp" :class="$style.fieldValidation">{{errors.otp}}</p>
          <p :class="$style.fieldHelp">
            {{ i18nText.otpSentMessage }} {{ phoneNumber }}. {{ i18nText.didNotGetOtp }}
            <a :class="[$style.link, {[$style.linkMuted]: waitingForOtpLinkTobeActive} ]" href="#" @click="requestForAnotherOTP(false)">
              <span v-if="waitingForOtpLinkTobeActive">{{ $t('login_modal.request_otp_again_after') }}</span>
              <span v-else>{{ i18nText.requestOtpAgain }}</span>
            </a>
          </p>
      </div>

      <div :class="$style.field">
        <button :class="[$style.button, $style.buttonLogin]" @click="processRequest()">{{ processButtonLabel }}</button>
        <!-- <template v-if="isFbSdkReady && !customer && !isAgentMode && !customerInfoAfterFacebookLoginTry">
          <button :class="[$style.button, $style.buttonLoginWithFacebook]" @click="loginWithFacebook">
            <svg viewBox="0 0 28 28">
              <g>
                <path fill="#FFFFFF" d="M28,14c0-7.7-6.3-14-14-14S0,6.3,0,14c0,6.9,5,12.8,11.8,13.8V18H8.3v-4h3.6v-3.1
                  c0-3.5,2.1-5.4,5.3-5.4c1,0,2.1,0.1,3.1,0.3v3.4h-1.8c-1.1-0.1-2.1,0.6-2.3,1.7c0,0.1,0,0.3,0,0.4V14h3.9l-0.6,4h-3.3v9.8
                  C23,26.8,28,20.9,28,14z"/>
                <path fill="#1878F2" d="M19.4,18l0.6-4h-3.9v-2.6c-0.1-1.1,0.7-2.1,1.8-2.2c0.1,0,0.3,0,0.4,0h1.8V5.7
                  c-1-0.2-2.1-0.3-3.1-0.3c-3.2,0-5.3,1.9-5.3,5.4V14H8.3v4h3.6v9.8c1.4,0.2,2.9,0.2,4.4,0V18L19.4,18z"/>
              </g>
            </svg>
            <span>{{ facebookLoginText }}</span>
          </button>
        </template> -->
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
  @import "shared/form/field"

  .login
    position: relative
    .Field__label
      padding-left: 0
      font-size: 16px
      margin-bottom: 10px
      letter-spacing: 0
    .Field__input
      height: 44px
      font-size: 16px
      border-radius: 0
      background-color: $white
      border-color: #777
      // border-color: $black
      &:focus
        border-color: $primary
    .Field__help
      padding-left: 0

  .LinkPurple
    color: $purple
    fill: $purple

  .SvgIconFacebook
    width: 22px
    height: 22px

  .Button
    &--continueWithFacebook
      height: 56px
      background-color: #1878F2
      display: inline-flex
      align-items: center
      justify-content: center
      font-size: 18px
      font-weight: 400
      color: $white
      width: 100%
      border-radius: 0
      padding: 0 20px
      svg
        position: absolute
        left: 0
        top: 50%
        width: 28px
        height: 28px
        transform: translateY(-50%)
        margin-left: 12px
      &:hover,
      &:focus
        color: $white

    &--loginWithPhone
      +buttonPrimary
      height: 56px
      width: 100%
      font-size: 18px
      font-weight: 400
      margin-top: 10px
      &:hover,
      &:focus
        color: $white

    &--loginWithFacebook
      margin-top: 10px
      height: 56px
      background-color: #1878F2
      display: inline-flex
      align-items: center
      justify-content: center
      font-size: 18px
      font-weight: 400
      color: $white
      width: 100%
      border-radius: 0
      padding: 0 20px
      svg
        position: absolute
        left: 0
        top: 50%
        width: 28px
        height: 28px
        transform: translateY(-50%)
        margin-left: 12px
      &:hover,
      &:focus
        color: $white

    &--login
      +buttonPrimary
      border-radius: 0
      height: 56px
      width: 100%
      font-size: 18px
      padding: 0 20px

  .oneClickStatement
    font-size: 14px
    line-height: 1.66
    color: #999
    // margin-top: 0
    margin-bottom: 15px
    // max-width: 330px

</style>

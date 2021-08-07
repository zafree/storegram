<template>
<div>
    <p :class="$style.oneClickStatement" v-if="requestedProduct" v-html="requestedProductVerificationHint"></p>
    <div :class="[$style.field, {[$style.fieldError]: errors.phoneNumber, [$style.fieldSuccess]: errors.phoneNumber === false}]">
      <label :class="$style.fieldLabel">{{ i18nText.phoneLabel }}</label>
      <div :class="$style.fieldControl">
        <input :class="$style.fieldInput" type="tel" v-model="phoneNumber" :placeholder="i18nText.phonePlaceholder" @keyup.enter="loginRequest(true)" v-focus>
      </div>
      <p :class="$style.fieldValidation" v-if="errors.phoneNumber">{{errors.phoneNumber}}</p>
    </div>
    <div :class="[$style.field, {[$style.fieldError]: errors.password, [$style.fieldSuccess]: errors.password === false}]">
      <label :class="$style.fieldLabel">{{ i18nText.passwordLabel }}</label>
      <div :class="$style.fieldControl">
        <input :class="$style.fieldInput" type="password" v-model="password" :placeholder="i18nText.passwordPlaceholder" @keyup.enter="loginRequest(true)">
      </div>
      <p :class="$style.fieldValidation" v-if="errors.password">{{errors.password}}</p>
    </div>
    <a v-if="!showPasswordResetHint" :class="[$style.button, $style.buttonLoginWithPhone]" href="#" @click="showPasswordResetHint = true">{{ i18nText.forgotPasswordHint }}</a>
    <div v-if="showPasswordResetHint">
      <a :class="[$style.button, $style.buttonLoginWithPhone]" :href="'tel:' + supportCenter">{{ $t('login_modal.change_password_info') }}</a>
    </div>
    <div :class="$style.field">
      <button :class="[$style.button, $style.buttonLogin]" @click="loginRequest(true)">{{ i18nText.buttonTextSignin }}</button>
    </div>
</div>
</template>

<script>
import {
  ADD_TO_CART,
  BUY_NOW,
  BUY_NOW_WITH_EMI,
  LOGIN_WITH_PASSWORD,
  API_ERRORS,
  SUPPORT_CENTER,
  OVERLAY_ASIDE_2,
  ADD_PRODUCT_TO_CART,
  SET_CART_PREOPEN_FLAG,
  ADD_PRODUCT_TO_EMI_CART,
  LOAD_CATEGORIES
} from '~/store/constants.yaml'

import { mapState } from 'vuex'

import replace from 'lodash/replace'
import find from 'lodash/find'
import { overlayMixin, i18nMixin, i18nRedirect } from '~/utils'
import i18nKeys from '~/components/Login.i18n.yaml'
import logger from '~/utils/logger'

import {
  getProductBySlug
} from '~/api'

const rePhoneNumber = /^01[3-9]\d{8}$/

function tryLogin (vm) {
  return vm.$store.dispatch(LOGIN_WITH_PASSWORD, {
    mobileNumber: vm.phoneNumber,
    password: vm.password
  })
  .then(vm.onRequestSuccess)
  .catch((reason) => {
    switch (reason.error) {
      case API_ERRORS.INVALID_MOBILE_NUMBER:
        vm.errors.phoneNumber = vm.__e(API_ERRORS.INVALID_MOBILE_NUMBER, {field: vm.phoneNumber})
        break
      case API_ERRORS.AGENT_NOT_FOUND:
        vm.errors.phoneNumber = vm.__e(API_ERRORS.AGENT_NOT_FOUND, {field: vm.i18nText.phoneLabel})
        break
      case API_ERRORS.MISMATCH_PASSWORD:
        vm.errors.password = vm.__e(API_ERRORS.MISMATCH_PASSWORD, {field: vm.i18nText.passwordLabel})
        break
    }
    logger.error('tryLogin', reason)
  })
}

export default {
  mixins: [i18nMixin(i18nKeys), overlayMixin],
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
  data () {
    return {
      supportCenter: SUPPORT_CENTER,
      phoneNumber: null,
      password: null,
      showPasswordResetHint: false,
      errors: {
        phoneNumber: null,
        password: null
      }
    }
  },
  computed: {
    ...mapState([
      'ui'
    ]),
    requestedProductVerificationHint () {
      if (this.requestedProduct) {
        return this.$t('login_modal.product_request_verification_hint', {field: this.requestedProduct.name})
      }
    },
    productAddToCart () {
      return this.ui.overlayContext && this.ui.overlayContext.choosedAction === ADD_TO_CART ? this.ui.overlayContext.cartItemBeforeAgentLogin : null
    },
    productBuyNow () {
      return this.ui.overlayContext && this.ui.overlayContext.choosedAction === BUY_NOW ? this.ui.overlayContext.cartItemBeforeAgentLogin : null
    },
    productBuyNowWithEMI () {
      return this.ui.overlayContext && this.ui.overlayContext.choosedAction === BUY_NOW_WITH_EMI ? this.ui.overlayContext.emiCartItemBeforeAgentLogin : null
    }
  },
  methods: {
    loginRequest (validate) {
      if (validate && !this.validate()) return
      else {
        return tryLogin(this)
      }
    },
    validate () {
      this.errors.phoneNumber = null
      this.errors.password = null

      this.phoneNumber = replace(this.phoneNumber, /\D/g, '') // remove all non digit character

      if (!this.phoneNumber) {
        this.errors.phoneNumber = this.$t('validation.required', {field: this.i18nText.phoneLabel})
      } else if (!rePhoneNumber.test(this.phoneNumber)) {
        this.errors.phoneNumber = this.$t('validation.invalid_mobile_number', {value: this.phoneNumber})
      } else {
        this.errors.phoneNumber = false
      }

      if (!this.password) {
        this.errors.password = this.$t('validation.required', {field: this.i18nText.passwordLabel})
      } else {
        this.errors.password = false
      }

      return !(this.errors.phoneNumber || this.errors.password)
    },
    reloadPage () {
      this.$router.go({
        path: this.$router.path,
        query: {
          ts: Date.now()
        }
      })
    },
    onRequestSuccess () {
      let productInfo = this.productBuyNowWithEMI ? this.productBuyNowWithEMI
        : this.productAddToCart ? this.productAddToCart
        : this.productBuyNow ? this.productBuyNow : null

      if (productInfo) {
        this.$store.dispatch(LOAD_CATEGORIES, this.$store.getters.agentToken)
        getProductBySlug(productInfo.slug, this.$store.getters.agentToken)
          .then((product) => {
            // Adding commission and commission_rule_id attribute to currentVariant for agent
            const variant = product.variants ? find(product.variants, { variant_slug: productInfo.variant_slug }) : product
            productInfo.commission = variant.commission
            productInfo.commission_rule_id = variant.commission_rule_id

            if (this.productBuyNowWithEMI) {
              this.$store.dispatch(ADD_PRODUCT_TO_EMI_CART, productInfo)
                .catch(error => {
                  logger.error(error)
                  this.openOverlay(OVERLAY_ASIDE_2)
                })
                .finally(() => {
                  this.successCallback()
                  i18nRedirect(this.$ctx, '/checkout/verify-user', false)
                })
            } else {
              this.$store.dispatch(ADD_PRODUCT_TO_CART, productInfo)
                .then(response => {
                  if (this.productAddToCart) {
                    this.successCallback()
                    this.$store.commit(SET_CART_PREOPEN_FLAG, true)
                  } else if (this.productBuyNow) {
                    this.successCallback()
                    i18nRedirect(this.$ctx, '/checkout/verify-user', false)
                  }
                })
                .catch(error => {
                  logger.error(error)
                  this.openOverlay(OVERLAY_ASIDE_2)
                })
            }
          })
      } else {
        this.successCallback()
        this.reloadPage()
      }
    }
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  }

}
</script>

<style lang="sass" module>
  @import "shared/button"
  @import "shared/form/field"

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

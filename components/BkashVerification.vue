<template>
  <div class="bkash">
    <p class="bkash__hint">
      {{ $t('bkash_verification.bkash_hint') }}
    </p>

    <div :class="['Field', {'Field--error': errors.trxId, 'Field--success': errors.trxId === false}]">
        <label class="Field__label">{{ $t('bkash_verification.trxid') }}</label>
        <div class="Field__control">
          <input
            class="Field__input"
            type="text"
            v-model="trxId"
            @keyup.enter="tryTrxVerification()"
            :placeholder="$t('bkash_verification.trxid_placeholder')">
        </div>
        <p class="Field__validation" v-if="errors.trxId">{{errors.trxId}}</p>
    </div>

    <div class="Field">
      <button class="Button Button--tryagain" @click="tryTrxVerification()">{{ $t('bkash_verification.try_again') }}</button>
    </div>

  </div>
</template>

<script>

import {
  verifyBkashPaymentWithTrxId
} from '~/api'

import {
  EVENT_OVERLAY_CLOSED
} from '~/store/constants.yaml'

import { i18nRedirect } from '~/utils'

import logger from '~/utils/logger'

import { mapState, mapGetters } from 'vuex'

const reTrxId = /^.{10}$/
const reAlphaNumeric = /^([a-zA-Z0-9]+)$/
export default {
  props: {
    successCallback: {
      type: Function
    }
  },
  data () {
    return {
      trxId: null,
      errors: {
        trxId: null
      }
    }
  },
  computed: {
    ...mapState([
      'ui'
    ]),
    ...mapGetters([
      'authToken'
    ])
  },
  methods: {
    validate () {
      this.errors.trxId = null

      if (!this.trxId) {
        this.errors.trxId = this.$t('validation.required', {field: 'TrxId'})
      } else if (!reTrxId.test(this.trxId)) {
        this.errors.trxId = this.$t('validation.trxid_length', {field: 'TrxId'})
      } else if (!reAlphaNumeric.test(this.trxId)) {
        this.errors.trxId = this.$t('bkash_verification.invalid')
      } else {
        this.errors.trxId = false
      }

      return !(this.errors.trxId)
    },
    tryTrxVerification () {
      if (!this.validate()) return
      const orderId = this.ui.overlayContext.orderId
      const amount = this.ui.overlayContext.paymentAmount
      const refNo = this.ui.overlayContext.currentRefNo
      const orderPageUrl = `/customer/orders/${orderId}`

      const redirectTo = (toUrl) => {
        if (this.successCallback) {
          this.$root.$once(EVENT_OVERLAY_CLOSED, (modalName) => {
            // logger.info('closed modal', modalName)
            i18nRedirect(this.$ctx, toUrl)
          })
          return this.successCallback()
        }
        i18nRedirect(this.$ctx, toUrl)
      }

      const onPaymentSuccess = () => {
        redirectTo(`${orderPageUrl}?n_type=success&n_key=payment_done`)
      }

      const onPaymentError = (reason) => {
        logger.error('bkash api error', reason)
        let i18nContext = {}
        switch (reason.error) {
          case 'REFERENCE_MISMATCH':
            return redirectTo(`${orderPageUrl}?n_type=warning&n_key=ref_mismatch`)
          case 'AMOUNT_MISMATCH':
            return redirectTo(`${orderPageUrl}?n_type=warning&n_key=amount_mismatch`)
          case 'BKASH_ERROR_PENDING':
            return redirectTo(`${orderPageUrl}?n_type=warning&n_key=payment_pending`)
          case 'BKASH_SYSTEM_ERROR':
            return redirectTo(this.$route.fullPath + '?n_type=error&n_key=bkash_server')
          case 'WAIT_BEFORE_NEXT_CALL':
            i18nContext.minutes = Math.floor(reason.details.wait_seconds / 60)
            i18nContext.seconds = reason.details.wait_seconds % 60
            break
          case 'PAYMENT_EXISTS':
            i18nContext.field = 'TrxId'
        }
        this.errors.trxId = this.__e(reason.error, i18nContext)
      }

      verifyBkashPaymentWithTrxId(this.authToken, orderId, this.trxId, refNo, amount)
      .then(onPaymentSuccess)
      .catch(onPaymentError)
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "shared/form/field"
  .bkash
    // margin-left: auto
    // margin-right: auto
    // background-color: #f5f5f5
    &__hint
      font-size: 13px
      margin-bottom: 30px
  .Button
    display: inline-block
    position: relative
    text-align: center
    text-decoration: none
    cursor: pointer
    border: 0
    border-radius: 2px
    background-color: transparent
    vertical-align: top
    white-space: nowrap
    text-rendering: auto
    user-select: none
    letter-spacing: 0
    font-weight: 400
    font-style: normal
    box-shadow: none
    padding: 0
    height: 36px
    color: rgba($black,.44)
    fill: rgba($black,.44)
    transition: all .2s ease
    &:hover,
    &:focus
        color: rgba($black,.66)
        fill: rgba($black,.66)

    &:focus,
    &:active
        outline: none
    &--tryagain
      display: flex
      justify-content: center
      align-item: center
      width: 100%
      font-weight: $weight-medium
      font-size: 15px
      +btnRed
</style>

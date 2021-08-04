<template>
  <tr class="tableList__tr">
    <td class="tableList__td" data-th="Order #">
      <span class="tableList__text">
        <button class="Button Button--orderLink" type="button" @click="showOrderDetails(order.id)">{{order.code}}</button>
      </span>
    </td>
    <td class="tableList__td" data-th="Name">
      <span class="tableList__text">{{ order.customer.name }} ({{ customerSensoredPhoneNumber(order.customer.mobile)}})</span> 
    </td>
    <td class="tableList__td" data-th="Total">
      <span class="tableList__text">৳ {{ __$(order.total) }}</span>
    </td>
    <td class="tableList__td" data-th="Due">
        <span class="tableList__text">৳ {{ dueAmount(order.total, order.paid_amount) }} </span>
    </td>
    <td class="tableList__td" data-th="Actions">
        <span class="tableList__text">
          <div :class="['Field', 'Field--otp', {'Field--error': errors.otp}]">
          <!-- <div class="Field, Field--otp, Field--error--"> -->
              <div class="Field__control">
                <input v-model="otp"  @keyup.enter="verifyCustomerWithOtp(order.id)" class="Field__input" type="text" :placeholder="i18nText.enterOtp">
                <div class="Field__inlineButton">
                  <button class="Button Button--verify" type="button" @click="verifyCustomerWithOtp(order.id)">{{ i18nText.verify }}</button>
                </div>
              </div>
              <p class="Field__validation" v-if="errors.otp">{{ errors.otp }} 
              <!-- --- <b @click="resetOtpError()">[x]</b> -->
                <button class="Button, Button--close" @click="resetOtpError()">
                  <img class="Button__iconSvg Button__iconSvg--orderList" src="/svg/icon-pickuplist.svg" alt="">
                </button>
              </p>
              <p class="Field__help" v-else>
                <a :class="['link', {'link--muted': waitingForOtpLinkTobeActive}]" @click="requestNewOtp(order.id)">
                  <span v-if="waitingForOtpLinkTobeActive">{{ $t('profile.request_otp_again_after', { field: countDown}) }}</span>
                  <!-- <span v-else-if="!waitingForOtpLinkTobeActive">Re-send OTP</span> -->
                  <span v-else>{{ i18nText.resendOtp }}</span>
                </a>
              </p>
          </div>
        </span>
    </td>
  </tr>
</template>

<script>

  import {
    API_ERRORS
  } from '~/store/constants.yaml'

  import {
    verifyOrderForPickupWithOTP,
    reSendOtp
  } from '~/api'

  import { mapGetters } from 'vuex'
  
  import { otpCountdown } from '~/utils/otp_countdown_mixin'
  import i18nKeys from '~/pages/_lang/agent/ready-for-pickup-orders.i18n.yaml'
  import {
    i18nMixin,
    i18nRedirect,
    partialAsteriskSensoredPhoneNumber
  } from '~/utils'

  const reOtp = /^\d{6}$/

  export default {
    mixins: [i18nMixin(i18nKeys), otpCountdown],
    props: ['order'],
    data () {
      return {
        otp: null,
        errors: {
          otp: null
        }
      }
    },
    methods: {
      customerSensoredPhoneNumber (phoneNumber) {
        return partialAsteriskSensoredPhoneNumber(phoneNumber)
      },
      dueAmount (total, paidAmount) {
        return total - paidAmount
      },
      showOrderDetails (orderId) {
        return i18nRedirect(this.$ctx, `/agent/orders/${orderId}`)
      },
      validateOtp () {
        this.errors.otp = null
        if (!this.otp) {
          this.errors.otp = this.$t('validation.required', {field: 'OTP'})
        } else if (!reOtp.test(this.otp)) {
          this.errors.otp = this.$t('validation.otp_length', {field: 'OTP'})
        } else {
          this.errors.otp = null
        }
        return !(this.errors.otp)
      },
      verifyCustomerWithOtp (orderId) {
        if (!this.validateOtp()) return
        verifyOrderForPickupWithOTP(this.$store.getters.agentToken, orderId, this.otp)
          .then((response) => {
            this.$emit('updateOrderList', response)
            this.otp = null
            this.clearTimer()
          })
          .catch((response) => {
            switch (response.error) {
              case API_ERRORS.OTP_MISMATCH:
                this.errors.otp = this.__e(API_ERRORS.OTP_MISMATCH_PICKUP_ORDERS, {field: this.$t('profile.otp_label')})
                break
              case API_ERRORS.ORDER_NOT_FOUND:
                this.errors.otp = this.__e(API_ERRORS.ORDER_NOT_FOUND)
                break
              case API_ERRORS.ORDER_NOT_IN_PICKUP_READY_STATUS:
                this.errors.otp = this.__e(API_ERRORS.ORDER_NOT_IN_PICKUP_READY_STATUS)
                break
            }
          })
      },
      resetOtpError () {
        this.errors.otp = null
        this.otp = null
      },
      requestNewOtp (orderId) {
        if (this.waitingForOtpLinkTobeActive) return
        this.startTimer()
        reSendOtp(orderId, this.$store.getters.agentToken)
          .catch((response) => {
            switch (response.error) {
              case API_ERRORS.ORDER_NOT_IN_PICKUP_READY_STATUS:
                this.errors.otp = this.__e(API_ERRORS.ORDER_NOT_IN_PICKUP_READY_STATUS)
                break
            }
          })
      }
    },
    computed: {
      ...mapGetters([
        'isAgentMode',
        'isCustomerMode'
      ])
    }
  }
</script>

<style lang="sass" scoped>
  .tableList
    margin: 0
    width: 100%
    border-spacing: 0
    border-collapse: collapse
    &__tr
      display: block
      padding: 20px 0
      border-bottom: 1px solid rgba($black, .06)
      &:last-child
        border-bottom: none
      +tablet
        display: flex
        flex-flow: row wrap
        align-items: top
        min-height: 50px
        padding: 0 20px
        border-bottom: none
      &:hover
        background-color: rgba($black, .04)

    &__td
      font-size: 14px
      display: flex
      line-height: 1.5
      vertical-align: top
      +tablet
        display: table-cell
        flex: 1
        // width: 20%
        padding-right: 15px
        line-height: 1.3
        &:last-child
          text-align: right
          padding-right: 0
      &::before
        content: attr(data-th)
        display: inline-block
        flex: 0 0 30%
        padding-right: 10px
        color: rgba(0,0,0,.4)
        font-weight: 400
        font-size: 13px
        margin-top: 1px
        +tablet
          display: none

    &__text
      flex: 0 0 67%
      display: block
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      +tablet
        flex: 0 0 70%
      &--link
        color: #3a8bbb

  [data-th="Order #"]
    +tablet
      min-width: 90px
      max-width: 90px
    +desktop
      min-width: 20%
      max-width: 20%
  [data-th="Name"]
    +tablet
      min-width: 120px
      max-width: 120px
    +desktop
      min-width: 30%
      max-width: 30%
  [data-th="Total"]
    +tablet
      min-width: 100px
      max-width: 100px
    +desktop
      min-width: 15%
      max-width: 15%
  [data-th="Due"]
    +tablet
      min-width: 100px
      max-width: 100px
    +desktop
      min-width: 15%
      max-width: 15%
  [data-th="Actions"]
    +desktop
      min-width: 20%
      max-width: 20%

  @import "shared/form/field"
  @import "shared/button"
  @import "shared/button.sass"

  .Field
    $root: &;
    &--Search
      max-width: 300px
    &--otp
      #{$root}__label
        padding: 0

      #{$root}__control
        display: flex
        flex-flow: row wrap
        +tablet
          justify-content: flex-end
        &:not(:last-child)
          margin-bottom: 5px
      #{$root}__input
        flex: 1
        height: 26px
        padding: 3px 6px
        max-width: 100px
        +tablet
          max-width: 300px
      #{$root}__inlineButton
        flex: 0 auto
        margin-left: 5px
      #{$root}__help
        padding-left: 0
        padding-right: 0
      #{$root}__validation,
      #{$root}__help
        text-align: left
        

    &--error
      #{$root}__validation
        padding: 3px 6px
        position: relative 
        display: flex 
        align-items: center
        justify-content: space-between
        white-space: normal

  .Button
    display: inline-flex
    flex-flow: row wrap
    align-items: center
    padding: 0 10px
    height: 24px
    border-radius: 2px
    font-size: 13px
    background-color: rgba($black, .25)

    &--close
      margin-right: -8px
      background-color: transparent
      background-color: none 
      border: none 
      // margin-top: -10px
      flex: 0
      +widescreen
        background-color: transparent
        border: none 
    &:not(:first-child)
      margin-left: 5px
    &--orderLink
      padding: 0
      background-color: transparent
      color: #3a8bbb
      +tablet
        width: 100%
        display: block
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
        text-align: left
      &:hover
        text-decoration: underline
        color: darken(#3a8bbb, 3%)
      &:focus,
      &:active
        text-decoration: underline
        color: darken(#3a8bbb, 5%)
    &--verify
      +btnYellow
    &__iconSvg
      width: 12px
      height: 12px
      +phablet 
        margin-top: 1px
      &--orderList
        margin-right: 10px
</style>


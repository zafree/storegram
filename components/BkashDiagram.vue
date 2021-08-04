<template>
  <div :class="$style.bkash">
    <!-- <p class="bkash__hint">Please follow the steps below to make your payment through any bKash Personal Account.</p> -->
    <ul :class="$style.bkashInstruction">
      <li :class="$style.bkashStep">
        <div :class="$style.diagram">
          <label :class="$style.diagramLabel">{{ $t('bkash_diagram.step', {value: __$(1, true)}) }}</label>
          <div :class="$style.diagramScreen">
            <div :class="[$style.diagramMessage, $style.message, $style.messageCenter]">
              <span :class="[$style.gighlight, $style.gighlightDial]">*247#</span>
            </div>
          </div>
          <div :class="$style.diagramBrief">{{ i18nText.dial }} <span :class="$style.highlight">*247#</span></div>
        </div>
      </li>
      <li :class="$style.bkashStep">
        <div :class="$style.diagram">
          <label :class="$style.diagramLabel">{{ $t('bkash_diagram.step', {value: __$(2, true)}) }}</label>
          <div :class="$style.diagramScreen">
            <div :class="[$style.diagramMessage, $style.message]">
              <label :class="$style.messageLabel">bKash</label>
              <div :class="$style.messageText">
                <ol :class="$style.orderList">
                  <li :class="$style.orderListItem">Send Money</li>
                  <li :class="$style.orderListItem">Buy Airtime</li>
                  <li :class="[$style.orderListItem, $style.orderListItemActive]">Payment</li>
                  <li :class="$style.orderListItem">Cash Out</li>
                  <li :class="$style.orderListItem">My bKash</li>
                  <li :class="$style.orderListItem">Helpline</li>
                </ol>
              </div>
            </div>
          </div>
          <div :class="$style.diagramBrief">{{ i18nText.stepTwo1 }} <span :class="$style.highlight">3</span> {{ i18nText.stepTwo2  }}</div>
        </div>
      </li>
      <li :class="$style.bkashStep">
        <div :class="$style.diagram">
          <label :class="$style.diagramLabel">{{ $t('bkash_diagram.step', {value: __$(3, true)}) }}</label>
          <div :class="$style.diagramScreen">
            <div :class="[$style.diagramMessage, $style.message]">
              <label :class="$style.messageLabel">Enter Merchant bKash Account (Wallet) number</label>
              <div :class="$style.messageText"><span :class="$style.gighlight">01847453111</span></div>
            </div>
          </div>
          <div :class="$style.diagramBrief">{{ i18nText.stepThree1 }} <span :class="$style.highlight">01847453111</span>  {{ i18nText.stepThree2 }}</div>
        </div>
      </li>
      <li :class="$style.bkashStep">
        <div :class="$style.diagram">
          <label :class="$style.diagramLabel">{{ $t('bkash_diagram.step', {value: __$(4, true)}) }}</label>
          <div :class="$style.diagramScreen">
            <div :class="[$style.diagramMessage, $style.message]">
              <label :class="$style.messageLabel">Enter Amount:</label>
              <div :class="$style.messageText"><span :class="$style.gighlight">{{ payableAmount }}</span></div>
            </div>
          </div>
          <div :class="$style.diagramBrief">{{ i18nText.stepFour1 }} <span :class="$style.highlight">{{ payableAmount }}</span> {{ i18nText.stepFour2 }}</div>
        </div>
      </li>
      <li :class="$style.bkashStep">
        <div :class="$style.diagram">
          <label :class="$style.diagramLabel">{{ $t('bkash_diagram.step', {value: __$(5, true)}) }}</label>
          <div :class="$style.diagramScreen">
            <div :class="[$style.diagramMessage, $style.message]">
              <label :class="$style.messageLabel">Enter Reference:</label>
              <div :class="$style.messageText"><span :class="$style.gighlight">{{ refNumber }}</span></div>
            </div>
          </div>
          <div :class="$style.diagramBrief">{{ i18nText.stepFive1 }} <span :class="$style.highlight">{{ refNumber }}</span> {{ i18nText.stepFive2 }}</div>
        </div>
      </li>
      <li :class="$style.bkashStep">
        <div :class="$style.diagram">
          <label :class="$style.diagramLabel">{{ $t('bkash_diagram.step', {value: __$(6, true)}) }}</label>
          <div :class="$style.diagramScreen">
            <div :class="[$style.diagramMessage, $style.message]">
              <label :class="$style.messageLabel">Enter Counter No:</label>
              <div :class="$style.messageText"><span :class="$style.gighlight">1</span></div>
            </div>
          </div>
          <div :class="$style.diagramBrief">{{ i18nText.stepSix1 }} <span :class="$style.highlight">1</span> {{ i18nText.stepSix2 }}</div>
        </div>
      </li>
      <li :class="$style.bkashStep">
        <div :class="$style.diagram">
          <label :class="$style.diagramLabel">{{ $t('bkash_diagram.step', {value: __$(7, true)}) }}</label>
          <div :class="$style.diagramScreen">
            <div :class="[$style.diagramMessage, $style.message]">
              <label :class="$style.messageLabel">Enter PIN:</label>
              <div :class="$style.messageText"><span :class="$style.gighlight">XXXX</span></div>
            </div>
          </div>
          <div :class="$style.diagramBrief">{{ i18nText.enterSecretPin }}</div>
          <div :class="$style.diagramBrief">{{ i18nText.waitConfirmation }}</div>
        </div>
      </li>
      <li :class="$style.bkashStep">
        <div :class="$style.diagram">
          <label :class="$style.diagramLabel">{{ $t('bkash_diagram.step', {value: __$(8, true)}) }}</label>
          <div :class="$style.diagramScreenButton">
            <button @click="verifyBkashPayment" class="Button Button--paywithBkash">{{ i18nText.paymentConfirmation }} </button>
            <p :class="$style.agreeStatement">
              {{ i18nText.termsService1 }}
              <i18n-link :class="$style.link" :to="'/docs/terms'" target="_blank">{{ i18nText.termsService2  }}</i18n-link>
              {{ i18nText.termsService3 }}
            </p>
          </div>
        </div>
      </li>
      <!-- <li :class="$style.bkashStep">
        <div :class="$style.diagram">
          <label :class="$style.diagramLabel">{{ $t('bkash_diagram.step', {value: __$(8, true)}) }}</label>
          <div :class="$style.diagramScreen">
            <div :class="[$style.diagramMessage, $style.message]">
              <div :class="$style.messageText">
                Payment Tk {{ payableAmount }} to 01847453111 successful. Ref {{ refNumber }} Counter 1. Fee Tk 0.00. Balance Tk XXXXX. TrxID XXXXXXX at 26/01/2018 15:12
              </div>
            </div>
          </div>
          <div :class="$style.diagramBrief">{{ $t('bkash_diagram.final_step_message') }}</div>
        </div>
      </li> -->
    </ul>
  </div>
</template>

<script>
  import cloneDeep from 'lodash/cloneDeep'
  import partial from 'lodash/partial'

  import i18nLink from '~/components/i18nLink'
  import i18nKeys from '~/components/BkashDiagram.i18n.yaml'
  import { i18nMixin, overlayMixin, i18nRedirect } from '~/utils'
  import { verifyBkashPaymentWithRef } from '~/api'
  import { SET_OVERLAY_CONTEXT } from '~/store/constants.yaml'

  import { mapState, mapGetters } from 'vuex'

  export default {
    beforeDestroy () {
      this.closeOverlayIfOpen(this.overlays.bkashDiagramModal)
    },
    mixins: [i18nMixin(i18nKeys), overlayMixin],
    components: {
      i18nLink
    },
    computed: {
      ...mapState([
        'ui'
      ]),
      ...mapGetters([
        'authToken'
      ]),
      payableAmount () {
        return this.ui.overlayContext && this.ui.overlayContext.paymentAmount ? this.ui.overlayContext.paymentAmount : null
      },
      refNumber () {
        return this.ui.overlayContext && this.ui.overlayContext.refNo ? this.ui.overlayContext.refNo : null
      }
    },
    methods: {
      redirectToOrderDetails (urlExtra = '') {
        return i18nRedirect(this.$ctx, `/customer/orders/${this.ui.overlayContext.orderId}${urlExtra}`)
      },
      verifyBkashPayment () {
        const overlayContext = cloneDeep(this.ui.overlayContext)
        verifyBkashPaymentWithRef(this.authToken, overlayContext.orderId, overlayContext.refNo, overlayContext.paymentAmount)
          .then(partial(this.redirectToOrderDetails, '?n_type=success&n_key=payment_done'))
          .catch((reason) => {
            switch (reason.error) {
              case 'REFERENCE_MISMATCH':
                return this.redirectToOrderDetails('?n_type=warning&n_key=ref_mismatch')
              case 'AMOUNT_MISMATCH':
                return this.redirectToOrderDetails('?n_type=warning&n_key=amount_mismatch')
              case 'BKASH_ERROR_PENDING':
                return this.redirectToOrderDetails('?n_type=warning&n_key=payment_pending')
              case 'BKASH_SYSTEM_ERROR':
                return i18nRedirect(this.$ctx, this.$route.fullPath + '?n_type=error&n_key=bkash_server')
            }
            overlayContext.prevError = reason
            this.$store.commit(SET_OVERLAY_CONTEXT, overlayContext)
            this.openOverlay(this.overlays.bkashVerificationModal)
          })
      }
    }
  }
</script>

<style lang="sass" scoped>
  .Button
    display: inline-flex
    align-items: center
    &--paywithBkash
      width: 100%
      justify-content: center
      margin-top: 5px
      margin-bottom: 10px
      white-space: normal
      text-align: left
      padding: 5px 10px
      border-radius: 6px
      font-size: 15px
      font-weight: $weight-medium
      letter-spacing: -0.06em
      min-height: 26px
      +btnRed
</style>

<style lang="sass" module>
  .bkash
    width: 250px
    margin-left: auto
    margin-right: auto
    // background-color: #f5f5f5
    &__hint
      font-size: 13px
      margin-bottom: 30px
    &__instruction
      list-style: none
      margin: 0
      padding: 0

    &__step
      list-style: none
      margin-bottom: 50px
      &:last-child 
        margin-left: -25px 
        margin-right: -25px

  .diagram
    &__label
      font-size: 12px
      color: #aaa
      // background-color: #eee
      display: block
      padding-left: 25px
    &__screen
      position: relative
      width: 200px
      height: 230px
      // border: 1px solid #e5e5e5
      border: 2px solid $red
      border-radius: 10px
      margin-top: 5px
      margin-bottom: 10px
      // display: flex
      // flex-flow: row wrap
      // justify-content: center
      // align-items: center
      // align-content: stretch
      margin-left: auto
      margin-right: auto
      overflow: hidden
      &::after
        content: ''
        position: absolute
        height: 30px
        bottom: 0
        left: 0
        right: 0
        background-color: rgba($black, .15)

    &__screenButton
      position: relative
      width: 100%
      border-radius: 10px
      margin-top: 5px
      margin-bottom: 10px
      margin-left: auto
      margin-right: auto
      overflow: hidden

    &__message
      // width: 100%
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 0
      margin-bottom: 30px
      padding: 12px 15px

    &__foo
      // width: 100%
      font-size: 13px
      height: 30px
      display: inline-flex
      flex-flow: row wrap
      align-items: center
      align-self: flex-end
      justify-content: space-between
      background-color: rgba($black, .15)
      position: absolute
      bottom: 0
      left: 0
      right: 0
      padding-left: 15px
      padding-right: 15px

    &__brief
      text-align: center
      color: #333

  .highlight
    background-color: rgba($red, .15)
    color: $red
    padding: 1px 5px
    border-radius: 4px
    letter-spacing: .06em
    margin: 0 2px
  .gighlight
    color: $red
    font-size: 16px
    font-weight: 700
    letter-spacing: 0.06em
    &--dial
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
      font-size: 30px
      line-height: 1.33

  .message
    &::before
      content: 'Send'
      position: absolute
      bottom: 0
      left: 0
      font-size: 13px
      padding-left: 15px
      margin-bottom: -25px
    &::after
      content: 'Exit'
      position: absolute
      bottom: 0
      right: 0
      font-size: 13px
      padding-right: 15px
      margin-bottom: -25px
    &__label
      font-weight: 700
      font-size: 14px
    &__text
      display: block
      margin-top: 7px

  .orderList
    list-style: none
    margin: 0
    padding: 0
    &__item
      list-style: inside decimal
      margin-left: -15px
      margin-right: -15px
      padding: 2px 15px
      &--active
        background-color: $red
        color: $white

  .AgreeStatement
    font-size: 13px
    color: rgba($black, .44)
    fill: rgba($black, .44)
    .Link
      font-size: inherit
      color: inherit
      fill: inherit
      text-decoration: underline

</style>

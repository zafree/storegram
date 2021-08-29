<template>
  <div :class="$style.checkout">
    <h1 :class="$style.checkoutPageTitle">Checkout</h1>
    <div :class="$style.checkoutRow">
      <div :class="$style.checkoutCol1">
        <order-summary :class="[$style.checkoutStep, $style.checkoutStepCart]" :orderSummary="orderSummary"></order-summary>
      </div>
      <div :class="$style.checkoutCol2">
        <div :class="$style.checkoutStep">
          <div :class="$style.checkoutStepTitle">
            <span>{{ i18nText.customerDetails }}</span>
            <span :class="$style.checkoutStepDone">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                <use xlink:href="/svg/icons.svg?#i-done"></use>
              </svg>
            </span>
          </div>
        </div>
        <div :class="$style.checkoutStep">
          <div :class="$style.checkoutStepTitle">
            <span>{{ i18nText.deliveryDetails }}</span>
            <span :class="$style.checkoutStepDone">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                <use xlink:href="/svg/icons.svg?#i-done"></use>
              </svg>
            </span>
          </div>
        </div>
        <div :class="[$style.checkoutStep, $style.checkoutStepActive]">
          <div :class="$style.checkoutStepTitle">
            <span>{{ i18nText.payment }}</span>
          </div>
          <div :class="$style.checkoutStepBody">
            <!-- Error message -->
            <div :class="[$style.announcement, $style.announcementError]" v-if="paymentError">
              <div :class="$style.announcementContainer">
                <div :class="$style.announcementRow">
                  <div :class="$style.announcementColumn">
                    <p :class="$style.announcementText">{{ i18nText.paymentUnsuccessful }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="Alert Alert--info" v-if="isLockerDelivery">
              <p class="Alert__copy">{{ i18nText.advancedPaymentLocker }}</p>
            </div>
            <div class="Alert Alert--info" v-if="showAgentPickUpAdvance && isAgentDelivery">
              <p class="Alert__copy">{{ i18nText.advancedPaymentAgent }}</p>
            </div>
            <!-- Payment -->
            <div class="payment">
              <!-- Payment options-->
              <div class="payment__col1">
                <div class="field">
                  <label class="field__label">{{ i18nText.paymentOption }}</label>
                  <div class="field__control">
                    <!-- radio EMI checkout  -->
                    <div class="radio option" v-if="isEmi && !partialEmiIsPaid">
                      <div class="option__check" :class="{'option__check--active': paymentOption === PaymentOptions.EMI}"></div>
                      <div class="option__title">
                        <input v-model="paymentOption" v-bind:value="PaymentOptions.EMI" class="radio__input" type="radio" id="emiPayment" >
                        <label class="radio__label label lable--withSpanLabel" for="emiPayment">
                          <div class="lable__title">{{ i18nText.emiLabel }}</div>
                          <div class="lable__sub">{{ $t('payment.emi_sub_label', { amount: __$(lowestEmi)}) }}</div>
                        </label>
                      </div>
                      <div class="option__body" v-if="paymentOption === PaymentOptions.EMI">
                        <p class="option__hint" v-if="paidAmount > 0 && dueAmount > 0">{{ $t('payment.emi_due_payment', { paidAmount: __$(paidAmount), dueAmount: __$(dueAmount) }) }}</p>
                        <template v-if="mininumPartialEmiAmount && paymentOption === PaymentOptions.EMI">

                          <div class="bkash__option">
                            <label class="bkash__optionLabel" for="fullEmi">{{ $t('payment.full_emi') }}</label>
                            <div class="bkash__optionBody radio option">
                              <div :class="['option__check', {'option__check--active': !partialEmi}]"></div>
                              <input class="radio__input" type="radio" v-model="partialEmi" :value="false" name="partialEmi" id="fullEmi">
                              <label for="fullEmi" class="bkash__hint radio__label">{{ $t('payment.emi_sub_label', { amount: __$(lowestEmi)}) }}</label>
                            </div>
                          </div>
                          <div class="bkash__option">
                            <label class="bkash__optionLabel" for="fullEmi">{{ $t('payment.partial_emi') }}</label>
                            <div class="bkash__optionBody radio option">
                              <div :class="['option__check', {'option__check--active': partialEmi}]"></div>
                              <input class="radio__input" type="radio" v-model="partialEmi" :value="true" name="partialEmi" id="partialEmi">
                              <label for="partialEmi" class="bkash__hint radio__label">{{ $t('payment.emi_sub_label', { amount: __$(partialEmiStartsFrom)}) }}</label>
                              <input v-if="partialEmi" class="option__labelInput" type="number" :value="partialEmiAmount"  @input="updatePartialEmiAmount">
                              <p class="option__error" v-if="partialEmiAmountError">{{ $t('payment.partial_emi_error', { totalAmount: __$(totalAmount), mininumPartialEmiAmount: __$(mininumPartialEmiAmount) }) }}</p>
                            </div>
                          </div>
                        </template>
                      </div>
                    </div>

                    <!-- radio DUE AMOUNT-->
                    <div class="radio option" v-if="dueMode && !isDeliveryMethodLocker">
                      <div class="option__check" :class="{'option__check--active': paymentOption === PaymentOptions.DUE_AMOUNT}"></div>
                      <div class="option__title">
                        <input v-model="paymentOption" v-bind:value="PaymentOptions.DUE_AMOUNT" class="radio__input" type="radio" id="duePayment" name="paymentOption">
                        <label class="radio__label label lable--withSpanLabel" for="duePayment">
                          <div class="lable__title">{{ i18nText.duePaymentLabel }}</div>
                          <div class="lable__sub">{{ i18nText.duePaymentSubLabel }}</div>
                          <div class="lable__price"><span class="lable__price__paynow">{{ i18nText.payNow }}</span>Tk. {{ __$(dueAmount) }}</div>
                        </label>
                      </div>
                    </div>

                    <!-- radio FULL PAYMENT-->
                    <div class="radio option" v-if="!dueMode">
                      <div class="option__check" :class="{'option__check--active': paymentOption === PaymentOptions.FULL_PAYMENT}"></div>
                      <div class="option__title">
                        <input v-model="paymentOption" v-bind:value="PaymentOptions.FULL_PAYMENT" class="radio__input" type="radio" id="fullPayment" name="paymentOption">
                        <label class="radio__label label lable--withSpanLabel" for="fullPayment">
                          <div class="lable__title">{{ i18nText.fullPaymentLabel }}</div>
                          <div class="lable__sub">{{ i18nText.fullPaymentSubLabel }}</div>
                          <div class="lable__price"><span class="lable__price__paynow">{{ i18nText.payNow }}</span>Tk. {{ __$(totalAmount) }}</div>
                        </label>
                      </div>
                    </div>

                    <!-- radio PARTIAL PAYMENT-->
                    <div class="radio option" v-if="bookingEnabled && !codEnabled && !isDeliveryMethodLocker && !isCustomerModeDeliveryMethodAgent">
                      <div class="option__check" :class="{'option__check--active': paymentOption === PaymentOptions.PARTIAL_PAYMENT}"></div>
                      <div class="option__title">
                        <input v-model="paymentOption" v-bind:value="PaymentOptions.PARTIAL_PAYMENT" class="radio__input" type="radio" id="bookWithAmount" name="paymentOption">
                        <label class="radio__label label lable--withSpanLabel" for="bookWithAmount">
                          <div class="lable__title">{{ i18nText.bookingPaymentLabel }}</div>
                          <div class="lable__sub">{{ $t('payment.booking_payment_sub_label', {value: `Tk. ${__$(remainingAmount)}` }) }} </div>
                          <div class="lable__price"><span class="lable__price__paynow">{{ i18nText.payNow }}</span>Tk. {{ __$(bookingAmount) }}</div>
                        </label>
                      </div>
                    </div>

                    <!-- radio CASH ON DELIVERY-->
                    <div class="radio option" v-if="codEnabled && !isDeliveryMethodLocker && !isCustomerModeDeliveryMethodAgent">
                      <div class="option__check" :class="{'option__check--active': paymentOption === PaymentOptions.CASH_ON_DELIVERY}"></div>
                      <div class="option__title">
                        <input v-model="paymentOption" v-bind:value="PaymentOptions.CASH_ON_DELIVERY" class="radio__input" type="radio" id="cashOnDelivery" name="paymentOption">
                        <label class="radio__label label lable--withSpanLabel" for="cashOnDelivery">
                          <div class="lable__title">{{ i18nText.cashDeliveryLabel }}</div>
                          <div class="lable__sub">{{ i18nText.cashDeliverySubLabel }}</div>
                          <div class="lable__price"><span class="lable__price__paynow">{{ i18nText.payNow }}</span>Tk. {{ __$(0) }}</div>
                        </label>
                      </div>
                    </div>

                    <!-- radio BKASH CASH ON DELIVERY-->
                    <div class="radio option" v-if="bodEnabled && codEnabled && !isDeliveryMethodLocker && !isCustomerModeDeliveryMethodAgent && !isAgentDelivery">
                      <div class="option__check "  :class="{'option__check--active': paymentOption === PaymentOptions.BKASH_ON_DELIVERY}"></div>
                      <div class="option__title">
                        <input v-model="paymentOption" v-bind:value="PaymentOptions.BKASH_ON_DELIVERY" class="radio__input" type="radio" id="bKashOnDelivery" name="paymentOption">

                        <label class="radio__label label lable--withSpanLabel" for="bKashOnDelivery">
                          <div class="lable__title">{{ i18nText.bkashDeliveryLabel }}</div>
                          <div class="lable__sub">{{ i18nText.bkashDeliverySubLabel }}</div>
                          <div class="lable__price"><span class="lable__price__paynow">{{ i18nText.payNow }}</span>Tk. {{ __$(0) }}</div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="paymentOption === PaymentOptions.CASH_ON_DELIVERY">
                  <button :class="[$style.btn, $style.btnPrimary]" @click="confirmPaymentMethod(PrefferedPaymentChannel.CASH_ON_DELIVERY)">{{ i18nText.confirmCashDelivery }}</button>
                </div>
                <div  v-else-if="paymentOption === PaymentOptions.BKASH_ON_DELIVERY">
                  <button :class="[$style.btn, $style.btnPrimary]" @click="confirmPaymentMethod(PrefferedPaymentChannel.BKASH_ON_DELIVERY)">{{ i18nText.confirmBkashashDelivery }}</button>
                </div>
              </div>

              <!-- Payment methods -->
              <div class="payment__col2">
                <div class="field" v-if="showPaymentMethods">
                  <label class="field__label">{{ i18nText.paymentMethod }}</label>
                  <div class="field__control">
                    <!-- radio payment method card -->
                    <div class="radio option">
                      <div class="option__check" :class="{'option__check--active': isPaymentMethodCard}"></div>
                      <div class="option__title">
                        <input v-model="paymentMethod" v-bind:value="PaymentMethods.CARD" class="radio__input" type="radio" id="paymentCard" name="paymentMethod">
                        <label class="radio__label label" for="paymentCard">
                          <div class="lable__title">{{ i18nText.creditDebitCardLabel }}</div>
                          <!-- <div class="lable__sub">{{ $t('payment.credit_debit_card_sub_label') }}</div> -->
                          <!-- <div class="lable__image lable__image--portwallet"></div> -->
                          <div class="lable__imageGroup">
                            <div class="cc">
                              <div class="cc__option cc__option--bkash"></div>
                              <div class="cc__option cc__option--rocket"></div>
                              <div class="cc__option cc__option--ccVisa"></div>
                              <div class="cc__option cc__option--ccMastercard"></div>
                              <div class="cc__option cc__option--ccAmex"></div>
                            </div>
                          </div>
                        </label>
                      </div>
                      <div class="option__body" v-if="isPaymentMethodCard">
                        <div class="checkbox">
                          <input class="checkbox__input" type="checkbox" id="agree_terms" v-model="agreedOnTermsAndService">
                          <label class="checkbox__label" for="agree_terms">{{ i18nText.termsService1 }} <i18n-link :class="$style.link" :to="'/docs/terms'" target="_blank">{{ i18nText.termsService2 }}</i18n-link> {{ i18nText.termsService3 }}</label>
                        </div>
                        <button :class="[$style.btn, $style.btnPrimary, {[$style.btnMuted]: !agreedOnTermsAndService}]" @click="payViaGateway" :disabled="!agreedOnTermsAndService">{{ i18nText.payCreditDebitCard }}</button>
                        <!-- <p :class="$style.agreeStatement">
                          {{ i18nText.termsService1 }}
                          <i18n-link :class="$style.link" :to="'/docs/terms'" target="_blank">{{ i18nText.termsService2 }}</i18n-link>
                          {{ i18nText.termsService3 }}
                        </p> -->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- <donation v-if="showDonation" :prop-donation-status="currentDonationStatus" :order-id="orderSummary.id"></donation> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Cart from '~/components/layouts/Cart'
  import logger from '~/utils/logger'
  import parseInt from 'lodash/parseInt'
  import get from 'lodash/get'
  import has from 'lodash/has'
  import partial from 'lodash/partial'

  import {
    SET_OVERLAY_CONTEXT,
    PICKED_DELIVERY_METHODS,
    ADDRESS_TYPES,
    BKASH_DIAGRAM_OPEN_DELAY,
    BKASH_DIAGRAM_CLOSE_DELAY
  } from '~/store/constants.yaml'

  import { OrderPaymentStatus, PaymentOptions, PaymentMethods, BkashPaymentMethods, PrefferedPaymentChannel } from '~/utils/enums.yaml'

  import { mapGetters, mapState } from 'vuex'

  import {
    getOrderSummaryById,
    confirmPaymentMethod,
    createPortWalletInvoice
  } from '~/api'

  import BkashOnlinePaymentForm from '~/components/BkashOnlinePaymentForm'
  import i18nLink from '~/components/i18nLink'
  import Donation from '~/components/Donation'
  import i18nKeys from '~/pages/_lang/checkout/payment/_order_id/index.i18n.yaml'
  import { i18nMixin, overlayMixin, i18nRedirect, calculateEmi } from '~/utils'
  import {
    gaEnhancedEcom
  } from '~/utils/ga-ec'

  export default {
    mixins: [i18nMixin(i18nKeys), overlayMixin, gaEnhancedEcom],
    fetch (context) {
      let {store} = context
      if (!(store.state.customer || store.state.agent)) {
        return i18nRedirect(context, '/')
      }
    },
    validate ({params}) {
      return params.order_id && parseInt(params.order_id)
    },
    asyncData (context) {
      let {params, store, error, route} = context
      return getOrderSummaryById(store.getters.authToken, params.order_id)
        .then((orderSummary) => {
          const paymentStatus = get(orderSummary, 'payment_status', 0)
          const isEmi = get(orderSummary, 'is_emi', false)
          const partialEmiIsPaid = get(orderSummary, 'partial_emi_is_paid', false)
          if (paymentStatus === 3) {
            return i18nRedirect(context, '/customer/orders/' + params.order_id)
          }
          const dueMode = paymentStatus > 0
          const paymentOption = isEmi ? PaymentOptions.EMI : dueMode ? PaymentOptions.DUE_AMOUNT : PaymentOptions.FULL_PAYMENT
          const currentDonationStatus = get(orderSummary, 'collect_donation', false)

          let minimumEmiAmount = get(orderSummary, 'minimum_emi_amount', 0)
          const mininumPartialEmiAmount = minimumEmiAmount > 0 ? Math.ceil(minimumEmiAmount) : minimumEmiAmount
          const bodEnabled = process.env.ENABLE_BKASH_ON_DELIVERY && process.env.ENABLE_BKASH_ON_DELIVERY === 'true'

          return {
            paymentError: has(route, 'query.error'),
            paymentStatus,
            dueMode,
            isEmi,
            partialEmiIsPaid,
            paymentOption,
            orderSummary,
            currentDonationStatus,
            mininumPartialEmiAmount,
            bodEnabled
          }
        })
        .catch((reason) => {
          logger.error('getOrderSummaryById', reason)
          error({
            statusCode: 404,
            message: 'Order not found'
          })
        })
    },
    watch: {
      activeOverlay: function (newValue, oldValue) {
        if (oldValue === this.overlays.bkashDiagramModal && !this.newValue) {
          setTimeout(() => {
            this.bkashPaymentMethod = this.BkashPaymentMethods.ONLINE
          }, BKASH_DIAGRAM_CLOSE_DELAY)
        }
      },
      partialEmiAmount: function (nval, oval) {
        this.checkPartialEmiValidity(nval)
      },
      partialEmi: function (nval, oval) {
        if (!nval) {
          this.partialEmiAmount = this.mininumPartialEmiAmount
          this.partialEmiAmountError = null
        }
      }
    },
    data () {
      return {
        // constants
        PaymentOptions,
        PaymentMethods,
        BkashPaymentMethods,
        PrefferedPaymentChannel,
        // ui
        paymentMethod: PaymentMethods.CARD,
        bkashPaymentMethod: BkashPaymentMethods.ONLINE,
        // data
        orderSummary: null,
        // partial emi
        partialEmiAmount: null,
        partialEmiAmountError: null,
        partialEmi: false,
        // new
        interactionDisabled: false,
        agreedOnTermsAndService: false
      }
    },
    mounted () {
      // *************************************************************************
      // Measuring checkout steps
      // if (this.orderSummary && this.orderSummary.line_items && this.orderSummary.line_items.length) {
      //   this.addProductForCheckoutMeasurement(this.orderSummary.line_items, 4)
      // }
      // *************************************************************************
      logger.info('this.$route.fullPath', this.urlOrigin + this.$route.fullPath)
      this.partialEmiAmount = this.mininumPartialEmiAmount
    },
    computed: {
      ...mapState([
        'ui'
      ]),
      ...mapGetters([
        'authToken',
        'isCustomerMode',
        'showAgentPickUpAdvance',
        'bkashPaymentUrl',
        'bkashCashBack',
        'showDonation'
      ]),
      activeOverlay () {
        return this.ui.activeOverlay
      },
      codEnabled () {
        return parseFloat(this.bookingAmount) === 0.00 || this.paymentStatus === OrderPaymentStatus.PARTIALLY_PAID
      },
      bookingEnabled () {
        return !this.dueMode && this.remainingAmount > 0
      },
      dueAmount () {
        return this.totalAmount - this.paidAmount
      },
      remainingAmount () {
        return this.dueAmount - this.bookingAmount
      },
      paidAmount () {
        return parseFloat(get(this.orderSummary, 'paid_amount', 0))
      },
      totalAmount () {
        return parseFloat(get(this.orderSummary, 'total', 0))
      },
      bookingAmount () {
        return parseFloat(get(this.orderSummary, 'pre_payment_amount', 0))
      },
      paymentAmount () {
        switch (this.paymentOption) {
          case PaymentOptions.DUE_AMOUNT:
          case PaymentOptions.EMI:
            return this.dueAmount
          case PaymentOptions.FULL_PAYMENT:
            return this.totalAmount
        }
        return this.bookingAmount
      },
      showPaymentMethods () {
        if (this.isPaymentOptionEmi && this.partialEmiAmountError) return false
        return this.paymentOption !== this.PaymentOptions.CASH_ON_DELIVERY && this.paymentOption !== this.PaymentOptions.BKASH_ON_DELIVERY
      },
      isPaymentMethodBkash () {
        return this.paymentMethod === PaymentMethods.BKASH
      },
      isPaymentMethodCard () {
        return this.paymentMethod === PaymentMethods.CARD
      },
      isPaymentOptionEmi () {
        return this.paymentOption === PaymentOptions.EMI
      },
      isPaymentMethodBkashOnline () {
        return this.isPaymentMethodBkash && this.bkashPaymentMethod === BkashPaymentMethods.ONLINE
      },
      isPaymentMethodBkashMenu () {
        return this.isPaymentMethodBkash && this.bkashPaymentMethod === BkashPaymentMethods.MENU
      },
      isDeliveryMethodLocker () {
        return this.orderSummary.delivery_address.owner_type === PICKED_DELIVERY_METHODS.LOCKER
      },
      isDeliveryMethodAgent () {
        return this.orderSummary.delivery_address.owner_type === PICKED_DELIVERY_METHODS.AGENT
      },
      isCustomerModeDeliveryMethodAgent () {
        return this.isCustomerMode && this.isDeliveryMethodAgent && this.showAgentPickUpAdvance
      },
      urlOrigin () {
        let origin = ''
        if (process.browser) {
          origin = get(window.location, 'origin')
          if (!origin) {
            origin = `${window.location.protocol}//${window.location.host}`
          }
        }
        return origin
      },
      isAgentDelivery () {
        return this.orderSummary.delivery_address.owner_type === ADDRESS_TYPES.AGENT
      },
      isLockerDelivery () {
        return this.orderSummary.delivery_address.owner_type === ADDRESS_TYPES.LOCKER
      },
      orderDetailUrlPrefix () {
        return this.isCustomerMode ? `/customer/orders` : `/agent/orders`
      },
      bkashOnlinePaymentInfo () {
        return {
          ref_no: this.orderSummary.ref_no,
          order_id: this.orderSummary.id,
          amount: this.paymentAmount,
          success_url: this.urlOrigin + this.i18nUrl(`${this.orderDetailUrlPrefix}/${this.orderSummary.id}`),
          failure_url: this.urlOrigin + this.$route.fullPath
        }
      },
      emiTenures () {
        return this.orderSummary.line_items[0].emi_tenures ? this.orderSummary.line_items[0].emi_tenures : null
      },
      partialEmiStartsFrom () {
        if (!this.emiTenures || !Array.isArray(this.emiTenures) || this.partialEmiAmount === 0) return null
        return calculateEmi(this.partialEmiAmount, this.emiTenures)
      },
      lowestEmi () {
        return calculateEmi(this.dueAmount, this.emiTenures)
      },
      bKashCashBackLogo () {
        if (Array.isArray(this.orderSummary.offers) && this.orderSummary.offers.length) {
          let bKashCashBack = this.orderSummary.offers.filter(x => x.title && x.title.en && x.title.en.toLowerCase().includes('bkash'))
          if (bKashCashBack.length) {
            return bKashCashBack[0].logo_image
          }
        }
        return null
      }
    },
    methods: {
      updatePartialEmiAmount ($event) {
        this.partialEmiAmount = Math.ceil($event.target.value)
      },
      i18nUrl (routePath) {
        return this.$store.state.locale === 'en' ? routePath : `/${this.$store.state.locale}${routePath}`
      },
      checkPartialEmiValidity (partialEmiAmount) {
        partialEmiAmount = parseFloat(partialEmiAmount)
        if (partialEmiAmount > this.totalAmount || partialEmiAmount < this.mininumPartialEmiAmount) {
          this.partialEmiAmountError = true // `partial emi amount must be between ${this.totalAmount} and ${this.mininumPartialEmiAmount}`
        } else {
          this.partialEmiAmountError = null
        }
      },
      redirectToOrderDetails (urlExtra = '') {
        return i18nRedirect(this.$ctx, `/customer/orders/${this.orderSummary.id}${urlExtra}`)
      },
      confirmPaymentMethod (paymentChannel) {
        const paymentConfirmationKey = paymentChannel === PrefferedPaymentChannel.CASH_ON_DELIVERY ? 'cod_confirmed' : 'bod_confirmed'
        confirmPaymentMethod(this.authToken, this.orderSummary.id, paymentChannel)
          .then(partial(this.redirectToOrderDetails, `?n_type=success&n_key=${paymentConfirmationKey}`))
          .catch((reason) => {
            this.showPageNotification('error')
            logger.error('confirmPaymentMethod', reason)
          })
      },
      payViaGateway () {
        if (!process.browser) return

        this.checkPartialEmiValidity(this.partialEmiAmount)
        if (this.partialEmiAmountError) return

        let decideFullPath = this.$route.fullPath
        if (this.$route.fullPath && this.$route.fullPath.includes('n_type=error&n_key=payment_failed')) {
          decideFullPath = this.$route.fullPath.split('?')[0]
        }
        let portwalletPaymentInfo = {
          amount: this.paymentAmount,
          success_url: this.urlOrigin + this.i18nUrl(`${this.orderDetailUrlPrefix}/${this.orderSummary.id}`),
          fail_url: this.urlOrigin + decideFullPath
        }

        if (this.isPaymentOptionEmi) {
          portwalletPaymentInfo.is_emi = this.isEmi
          portwalletPaymentInfo.emi_tenures = this.emiTenures
          if (this.partialEmi) {
            portwalletPaymentInfo.amount = this.partialEmiAmount
          }
        }

        createPortWalletInvoice(this.authToken, this.orderSummary.id, portwalletPaymentInfo)
          .then((result) => {
            window.location.href = result.payment_url
          })
          .catch((reason) => {
            logger.error('createPortWalletInvoice', reason)
          })
      },
      selectBkashShowDetailsMenu () {
        this.bkashPaymentMethod = BkashPaymentMethods.MENU
        this.openBkashDiagramModal()
      },
      openBkashDiagramModal () {
        let contextObj = {
          refNo: this.orderSummary.current_ref_no,
          orderId: this.orderSummary.id,
          currentRefNo: this.orderSummary.current_ref_no,
          paymentAmount: parseFloat(this.paymentAmount)
        }
        this.$store.commit(SET_OVERLAY_CONTEXT, contextObj)
        setTimeout(() => {
          this.openOverlay(this.overlays.bkashDiagramModal)
        }, BKASH_DIAGRAM_OPEN_DELAY)
      }
    },
    components: {
      Cart,
      i18nLink,
      BkashOnlinePaymentForm,
      Donation,
      OrderSummary: () => import('~/components/layouts/checkout/OrderSummary')
    }
  }
</script>

<style lang="sass" module>
  @import "shared/button"
  @import "shared/field"
  @import "shared/checkout/checkout"
</style>

<style lang="sass" scoped>
  @import "shared/alerts"
  @import "shared/field"
  @import "shared/form/field"

  .checkbox
    position: relative
    &__input[type=checkbox]
      position: absolute
      z-index: 1
      top: 50%
      left: 0
      transform: translateY(-50%)
    &__label
      display: inline-block
      position: relative
      cursor: pointer
      padding: 10px 20px
      font-size: 12px
      a
        color: $text

  .option
    position: relative
    &__body
      // padding-left: 55px
    &__emi
      border: 1px solid green
      position: relative
      display: flex
      padding: 5px 15px 5px 0
      &--input
        margin-right: 10px
    &__labelInput
      width: 130px
      height: 30px
      padding: 0 5px
      margin: 7px 0
      border: 1px solid #ddd
      border-radius: 3px
      cursor: pointer
      &:active,
      &:focus
        outline: none
    &__error
      color: $red
      fill: $red
      background-color: rgba($red, 0.12)
      border: 1px solid rgba($red, 0.2)
      border-radius: 2px
      padding: 8px 15px
  .Alert
    margin-bottom: 15px

  .payment
    overflow: hidden
    +desktop
      display: flex
      flex-flow: row wrap
    &__col1
      margin-bottom: 20px
      +desktop
        width: 50%
        flex: 1
        padding-right: 10px
    &__col2
      margin-bottom: 20px
      +desktop
        width: 50%
        flex: 1
        padding-left: 10px

  .bkash
    &__option
      position: relative
      &Label
        color: #0094FF
        border-bottom: 2px solid #0094FF
        font-size: 13px
        font-weight: $weight-medium
        display: block
        padding-bottom: 5px
      &Body
        position: relative
        border: none
        .option__check
          margin-top: 10px
          margin-left: -17px
          border-width: 2px
          border-color: #0094FF
          background-color: $white
          width: 12px
          height: 12px
          cursor: pointer
          border-radius: 50px
          &::before,
          &::after
            display: none
          &--active
            border-width: 4px
    &__hint
      font-size: 13px
      line-height: 1.33
      padding-top: 7px
      padding-bottom: 7px
      margin-bottom: 8px
      &--paddingTop0
        padding-top: 0
      &.radio__label
        margin-left: -17px
        padding-left: 17px
        padding-right: 0
    &__clickOn
      font-size: 13px
      margin-bottom: 20px
      display: flex
      flex-flow: row wrap
      align-items: center
    &__instruction
      list-style: none
      margin: 0
      padding: 0
      position: relative
      display: block
    &__step
      list-style: outside decimal
      padding-left: 5px
      margin-left: -5px
      color: #ccc
      margin-bottom: 7px
      line-height: 1.33
      font-size: 13px

    &__text
      color: #333
      display: block

    &__verifyText
      font-size: 13px
      color: #aaa
      margin-top: 20px
    &__ondelivery
      padding: 15px 15px 15px 40px
  .finally
    position: relative
    border: 1px solid rgba($black, .5)
    // border: 1px solid rgba($red, .5)
    // background-color: rgba($red, .03)
    padding: 15px 15px 14px 20px
    margin-left: -20px
    margin-top: 25px
    border-radius: $gutter/4
    &__title
      position: absolute
      color: $red
      letter-spacing: .06em
      top: 0
      left: 0
      background-color: #fcfcfc
      padding: 2px 5px
      margin-left: 14px
      margin-top: -12px
    &__msg

    &__icon
      position: absolute
      top: 50%
      left: 0
      transform: translateY(-50%)
      margin-left: 10px

  .diagram
    position: relative
    margin-left: -20px

  .highlight
      background-color: rgba($red, .15)
      color: $red
      padding: 1px 5px
      border-radius: $gutter/4
      letter-spacing: .06em
      margin: 0 2px


  .cc
    position: relative
    display: flex
    flex-flow: row wrap
    &__option
      position: relative
      border: 1px solid #ddd
      background-color: #fff
      overflow: hidden
      // border-radius: 6px
      margin-bottom: 10px
      background-position: 0
      background-repeat: no-repeat
      background-size: 46px auto
      display: inline-block
      vertical-align: middle
      height: 32px
      width: 48px
      &:not(:last-child)
        margin-right: 5px
      &--bkash
        background-image: url(/svg/payment/bkash.svg)
      &--rocket
        background-image: url(/svg/payment/rocket.svg)
      &--ccDbbl
        background-image: url(/svg/payment/cc-dbbl.svg)
      &--ccVisa
        background-image: url(/svg/payment/cc-visa.svg)
      &--ccMastercard
        background-image: url(/svg/payment/cc-mastercard.svg)
      &--ccAmex
        background-image: url(/svg/payment/cc-amex.svg)
      &--cashOnDelivery
        background-image: url(/svg/payment/cash-on-delivery.svg)

    // &__option
    //   padding: 0
    //   position: relative
    //   border: 1px solid #ddd
    //   background-color: #fff
    //   overflow: hidden
    //   border-radius: 6px
    //   margin-bottom: 5px
    //   background-position: left top
    //   background-repeat: no-repeat
    //   background-size: 46px auto
    //   display: inline-block
    //   vertical-align: middle
    //   height: 32px
    //   width: 48px
    //   &:not(:last-child)
    //     margin-right: 5px
    //   &--rocket
    //     background-image: url(/svg/payment/rocket.svg)
    //   &--ccDbbl
    //     background-image: url(/svg/payment/cc-dbbl.svg)
    //   &--ccVisa
    //     background-image: url(/svg/payment/cc-visa.svg)
    //   &--ccMastercard
    //     background-image: url(/svg/payment/cc-mastercard.svg)
    //   &--ccAmex
    //     background-image: url(/svg/payment/cc-amex.svg)

  .Button
    display: inline-flex
    align-items: center
    &__icon
      margin-right: 8px
      fill: $red
    &--bKashCheckout
      background-color: #EC005F
      color: $white
      padding: 0 10px
      border-radius: 6px
      font-size: 13px
      font-weight: $weight-medium
      letter-spacing: -0.06em
      height: 26px
      margin-bottom: 25px
      +button

    &--inlineLink
      padding: 0
      color: $text
      text-decoration: underline
      line-height: inherit
    &--diagram
      width: 100%
      padding: 15px
      border: 1px solid rgba($black, .5)
      color: $red
      fill: $red
      border-radius: $gutter/4
      margin-top: 20px
      white-space: normal
      text-align: left
      &:hover
        color: darken($red, 5%)
        fill: darken($red, 5%)

    &--paywithBkash
      justify-content: flex-start
      max-width: 100%
      min-height: 26px
      padding: 5px 10px
      margin-bottom: 10px
      white-space: normal
      text-align: left
      border-radius: 6px
      font-size: 13px
      font-weight: $weight-medium
      +button

    &--paywithCard
      +button
      justify-content: center
      width: 100%
      font-size: 15px
      height: 44px
      padding: 0 15px
      margin-bottom: 10px
    &--bkashShowDetailsModal
      +button
      justify-content: center
      width: 100%
      font-size: 15px
      height: 44px
      padding: 0 15px
    &--disable
      cursor: not-allowed
      opacity: .5

  .label
    position: relative
    &__bkashsvg
      top: 50%
      right: 0
      transform: translateY(-50%)
      border: 1px solid #ddd
      background-color: $white
      overflow: hidden
      border-radius: $gutter/4
      background-position: 0 center
      background-repeat: no-repeat
      background-size: 56px auto
      display: inline-block
      vertical-align: middle
      height: 36px
      width: 58px
      &--bkash20PercentOff
        width: 107px
        height: 40px
        display: inline-flex
        flex-direction: column
        justify-content: center
        align-items: center
        overflow: visible
        .SvgIconBkash
          position: absolute
          bottom: 0
          left: 0
          &--logo
            top: 0
            margin-top: -4px
            bottom: auto
            z-index: 1

</style>

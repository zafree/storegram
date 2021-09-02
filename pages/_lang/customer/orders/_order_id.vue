<template>
  <div class="CustomerOrderDetails">
    <div class="CustomerOrderDetails__container">
      <div class="CustomerOrderDetails__row">

        <button class="Button Button--back" @click="$router.go(-1)">
          <img src="/svg/back-orderid.svg" alt="">
        </button>
        <div class="CustomerOrderDetails__header">
          <div class="CustomerOrderDetails__title">
            {{ i18nText.order }} #<br>
            {{orderSummary.code}}<br>
            {{ i18nOrderStatus }}
          </div>
          <!-- <div class="CustomerOrderDetails__type">{{ i18nText.orderType }}: {{ orderType }}</div> -->
          <div class="CustomerOrderDetails__date">{{ i18nText.orderDate }} :  {{ createdAt }}</div>
        </div>
        <div class="CustomerOrderDetails__body">
          <div class="CustomerOrderDetails__col1">
            <div class="col">
              <div class="col__title">{{ i18nText.orderDetails }}</div>
              <div class="col__body col__body--orderDetails">
                <order-summary v-if="orderSummary" :orderSummary="orderSummary">
                  <template slot="title"></template>
                </order-summary>
              </div>
            </div>
            <!--Payment Details-->
            <div class="col">
              <div class="col__title">{{ i18nText.paymentDetails }}</div>
              <div class="col__body payment">
                <div class="payment__status">{{ i18nText.paymentStatus}} — {{ i18nPaymentStatus }}</div>
                <div class="payment__financialStatements">
                  <!-- if no payments -->
                  <p v-if="(!hasAnyPayment && !isOrderCancelled) && isCustomerMode">{{ i18nText.noPaymentYet }}</p>

                  <!-- if payments -->
                  <table class="tableList" v-if="hasAnyPayment">
                    <thead class="tableList__thead">
                      <tr class="tableList__tr">
                        <th class="tableList__th">{{ i18nText.paidAt }}</th>
                        <th class="tableList__th">{{ i18nText.method }}</th>
                        <th class="tableList__th">{{ i18nText.amount }}</th>
                      </tr>
                    </thead>
                    <tbody class="tableList__tbody"  v-if="hasAnyPayment">
                      <tr class="tableList__tr" v-for="payment in payments" :key="payment.id">
                        <td class="tableList__td" data-th="Paid at">
                          <span class="tableList__text tableList__text--dateAndTime">
                            <span class="payment__date">{{ formatDate(payment.paid_at) }}</span>
                            <span class="payment__time">{{ formatTime(payment.paid_at) }}</span>
                          </span>
                        </td>
                        <td class="tableList__td" data-th="Method">
                          <span class="tableList__text">{{ payment.i18nPaymentMethod }}</span>
                        </td>
                        <td class="tableList__td" data-th="Amount">
                          <span class="tableList__text">Tk. {{ __$(payment.amount) }}</span>
                        </td>
                      </tr>
                      <tr class="tableList__tr" v-if="paidAmount">
                        <td class="tableList__td">
                          <span
                            :class="['tableList__text', 'tableList__text--amount', {'tableList__text--hasDue': !isPaymentComplete}]"
                          >
                            {{ i18nText.paidAmount }}: Tk. {{ __$(paidAmount) }}
                          </span>
                        </td>
                      </tr>
                      <tr class="tableList__tr">
                        <td class="tableList__td">
                          <span
                            class="tableList__text tableList__text--amount"
                            v-if="!isPaymentComplete && !isOrderCancelled"
                          >
                            {{ i18nText.dueAmount }}: Tk. {{ __$(dueAmount) }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="payment__action">
                  <!-- if payments -->
                  <button
                    v-if="hasAnyPayment && !isPaymentComplete && !isOrderCancelled"
                    @click="payForThisOrder(orderSummary.id)"
                    class="Button Button--pay Button--due"
                  >
                    {{ i18nText.payDueAmount }}
                  </button>
                  <!-- if no payments -->
                  <button
                    v-if="showPayNow"
                    @click="payForThisOrder(orderSummary.id)"
                    class="btn btn--primary btn--auto"
                  >
                    {{ i18nText.payNow }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="CustomerOrderDetails__col2">
            <!-- Customer information if agent mode -->
            <div class="col" v-if="isAgentMode">
              <div class="col__title">{{ i18nText.customerInformation }}</div>
              <div class="col__body">
                <div class="customerInfo">
                  <div class="customerInfo__name">{{ orderSummary.customer.name }}</div>
                  <div class="customerInfo__number">{{ orderSummary.customer.mobile }}</div>
                </div>
              </div>
            </div>
            <!--Delivery Information-->
            <div class="col">
              <div class="col__title">{{ i18nText.deliveryInformation }}</div>
              <div class="col__body">
                <div class="delivery">

                  <!-- if any notice has -->
                  <!--<p class="delivery__notice">Approximate delivery date 27/03/2017</p>-->

                  <!-- delivery method -->
                  <div class="delivery__method">
                    <div class="method">
                      <div class="method__title">{{deliveryMethod.title}}</div>
                      <div class="method__sub">{{deliveryMethod.tagMsg}}</div>
                    </div>
                  </div>

                  <!-- estimated delivery time -->
                  <div class="delivery__method" v-if="showDeliveryTime">
                    <div class="method">
                      <div class="method__title">{{ $t('shipping_info.estimated_title') }}:
                        {{ (orderSummary.max_delivery_time <= 1 ? $t('shipping_info.one_day') : $t('shipping_info.multiple_days', {days: __$(orderSummary.max_delivery_time)})) }}
                      </div>
                    </div>
                  </div>

                  <!-- delivery address -->
                  <div class="delivery__address">
                    <address-display :addressTitle="addressTitle" :address="orderSummary.delivery_address"/>
                  </div>

                </div>
              </div>
            </div>
            <!--If cancelable order-->
            <!-- <div class="col" v-if="showCancelOption">
              <button
                v-if="isOrderCancellable && !isOrderCancelled"
                @click="cancelOrder(orderSummary.id)"
                class="Button"
              >
                {{ i18nText.payDueAmount }}
              </button>
            </div> -->
          </div>
        </div>
        <i18n-link class="Button Button--back Button--hiddenOnTablet" :to="'/customer/orders'">
          <img src="/svg/back-orderid.svg" alt="">
          <span class="Button__label">{{ i18nText.goBackOrders }}</span>
        </i18n-link>

      </div>
    </div>
  </div>
</template>

<script>
  import i18nLink from '~/components/i18nLink'
  import OrderSummary from '~/components/layouts/checkout/OrderSummary'
  import AddressDisplay from '~/components/AddressDisplay'
  import AgentPassword from '~/components/modals/AgentPassword'
  import i18nKeys from '~/pages/_lang/customer/orders/_order_id.i18n.yaml'
  import parseInt from 'lodash/parseInt'
  import subtract from 'lodash/subtract'
  import { mapGetters } from 'vuex'

  import {
    SET_OVERLAY_CONTEXT,
    ADDRESS_TYPES
  } from '~/store/constants.yaml'

  import { ENHANCE_ECOM } from '~/utils/ga-meta.yaml'

  import {
    getOrderSummaryById
  } from '~/api'

  import {
    debug,
    i18nMixin,
    i18nRedirect,
    overlayMixin
  } from '~/utils'

  import {
    gaEnhancedEcom
  } from '~/utils/ga-ec'

  import {
    ga
  } from '~/utils/ga'

  import enumMixinFactory from '~/utils/enum_mixin_factory'

  import {
    formatDate,
    formatTime
  } from '~/utils/date'

  import {
    getOrderStatus
  } from '~/utils/map_order_status'

  export default {
    mixins: [ga, gaEnhancedEcom, i18nMixin(i18nKeys), getOrderStatus, overlayMixin, enumMixinFactory('OrderPaymentStatus', 'PaymentChannel', 'OrderStatus', 'FrontEndOrderStatus', 'PrefferedPaymentChannel', 'SupportTicketOrderStatus')],
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
      let {params, store, error} = context
      return getOrderSummaryById(store.getters.authToken, params.order_id)
        .then((orderSummary) => {
          return {
            orderSummary
          }
        })
        .catch((e) => {
          error({
            statusCode: 404,
            message: 'Order not found'
          })
        })
    },
    mounted () {
      if (this.$route.hash !== ENHANCE_ECOM.TEXT.STOP_GA_WHEN_RELOAD) {
        this.gaEvent({
          eventCategory: this.gaCategoriesMeta.TRANSACTIONS.NAME,
          eventAction: this.gaCategoriesMeta.TRANSACTIONS.ACTIONS.PAID_TRANSACTION,
          eventLabel: this.gaCategoriesMeta.TRANSACTIONS.ACTIONS.PAID_TRANSACTION
        })
      }

      if (this.isSuccessfulPaymentNotificationActive) {
        window.location.hash = ENHANCE_ECOM.TEXT.STOP_GA_WHEN_RELOAD
      }
    },
    data () {
      return {
        showCancelOption: debug
      }
    },
    computed: {
      ...mapGetters([
        'isCustomerMode',
        'isAgentMode'
      ]),
      showPayNow () {
        let primaryCondition = !this.hasAnyPayment && !this.isPaymentComplete && !this.isOrderCancelled && !this.isOrderStatusAfterPickupReady
        if (this.isAgentMode) {
          return this.orderSummary.type === 'regular' && primaryCondition
        }
        return primaryCondition
      },
      orderType () {
        return this.i18nInvertedEnums.SupportTicketOrderStatus[this.orderSummary.type]
      },
      createdAt () {
        return this.formatDate(this.orderSummary.created_at)
      },
      payments () {
        if (this.orderSummary && this.orderSummary.payments) {
          return this.orderSummary.payments.map((payment) => {
            payment.i18nPaymentMethod = this.i18nInvertedEnums.PaymentChannel[payment.channel]
            return payment
          })
        }
        return []
      },
      hasAnyPayment () {
        return this.payments.length > 0
      },
      isPaymentComplete () {
        return this.enums.OrderPaymentStatus.COMPLETE === this.orderSummary.payment_status
      },
      paidAmount () {
        return this.orderSummary.paid_amount
      },
      dueAmount () {
        return subtract(this.orderSummary.total, this.paidAmount)
      },
      deliveryMethod () {
        let title, tagMsg
        if (this.orderSummary && this.orderSummary.delivery_address) {
          if (this.orderSummary.delivery_address.owner_type === ADDRESS_TYPES.CUSTOMER) {
            title = this.i18nText.homeDelivery
            // tagMsg = this.$t('delivery_process.home_delivery_sub_label')
            tagMsg = null
          } else if (this.orderSummary.delivery_address.owner_type === ADDRESS_TYPES.HUB) {
            title = this.i18nText.pickupLabel
            tagMsg = this.i18nText.pickupSubLabel
          } else if (this.orderSummary.delivery_address.owner_type === ADDRESS_TYPES.AGENT) {
            title = this.i18nText.agentPickupLabel
            tagMsg = this.i18nText.agentPickupSubLabel
          } else if (this.orderSummary.delivery_address.owner_type === ADDRESS_TYPES.LOCKER) {
            title = this.i18nText.lockerPickupLabel
            tagMsg = this.i18nText.lockerPickupSubLabel
          }
        }
        return { title, tagMsg }
      },
      address () {
        if (this.orderSummary && this.orderSummary.delivery_address) {
          return this.orderSummary.delivery_address.address
        }
      },
      isOrderCancellable () {
        return this.isOrderPending && !this.hasAnyPayment
      },
      isOrderPending () {
        return this.frontEndOrderStatus === this.enums.FrontEndOrderStatus.PENDING
      },
      isOrderCancelled () {
        return this.frontEndOrderStatus === this.enums.FrontEndOrderStatus.CANCELLED
      },
      isOrderStatusAfterPickupReady () {
        return this.orderSummary.status >= this.enums.OrderStatus.PICK_UP_READY
      },
      addressTitle () {
        return this.i18nText.address
      },
      i18nPaymentStatus () {
        if (this.orderSummary.payment_status === this.enums.OrderPaymentStatus.CONFIRMED) {
          return this.i18nInvertedEnums.PrefferedPaymentChannel[this.orderSummary.preferred_payment_channel]
        }
        return this.i18nInvertedEnums.OrderPaymentStatus[this.orderSummary.payment_status]
      },
      frontEndOrderStatus () {
        return this.mapOrderStatus(this.orderSummary.status)
      },
      i18nOrderStatus () {
        return this.i18nInvertedEnums.FrontEndOrderStatus[this.frontEndOrderStatus]
      },
      isSuccessfulPaymentNotificationActive () {
        return this.$route.query.n_key === 'payment_done' && this.$route.query.n_type === 'success'
      },
      showDeliveryTime () {
        return this.enums.FrontEndOrderStatus.DELIVERED !== this.frontEndOrderStatus &&
          this.enums.FrontEndOrderStatus.CANCELLED !== this.frontEndOrderStatus &&
          this.orderSummary.max_delivery_time
      }
    },
    methods: {
      formatDate (dateValue) {
        return formatDate(dateValue, this.$i18n.locale)
      },
      formatTime (dateValue) {
        return formatTime(dateValue, this.$i18n.locale)
      },
      payForThisOrder (orderId) {
        return i18nRedirect(this.$ctx, `/checkout/payment/${orderId}`)
      },
      cancelOrder (orderId) {
        // return cancelOrder(orderId)
        //   .then((response) => {
        //     return i18nRedirect(this.$ctx, '/customer/orders')
        //   })
        let contextObj = {
          orderId: orderId
        }
        this.$store.commit(SET_OVERLAY_CONTEXT, contextObj)
        this.openOverlay(this.overlays.cancelOrderModal)
      }
    },
    components: {
      OrderSummary,
      AddressDisplay,
      i18nLink,
      AgentPassword
    }
  }
</script>

<style lang="sass" scoped>
  @import "shared/button"
  .Button
    &--back
      color: #ddd
      fill: #ddd
      &:hover,
      &:focus,
      &:active
        color: #aaa
        fill: #aaa
      .Button__label
        padding-left: 30px
        margin-top: -37px
        // color: #ccc
        // fill: #ccc
    &--hiddenOnTablet
      +tablet
        display: none
    &--pay
      height: 32px
      padding: 0 20px
      font-size: 15px
      +button
    &--due
      margin-left: auto
      display: block


  .CustomerOrderDetails
    background-color: $white
    height: 100%
    &__container
      +container
    &__row
      position: relative
    &__header
      position: relative
    &__title
      font-size: 16px
      font-weight: 400
      color: $black
      line-height: 1.3
      margin-top: 20px
      // +phablet
        font-size: 18px
    &__type,
    &__date
      font-size: 14px
      color: #999
      line-height: 1.5

    &__body
      position: relative
      margin-top: 30px
      +tablet
        display: flex
        flex-flow: row wrap
    &__col1,
    &__col2
      position: relative
      +tablet
        flex: 1
    &__col1
      +tablet
        margin-right: 80px
    &__col2

  .col
    position: relative
    margin-bottom: 50px
    +clearfix
    &__title
      font-size: 16px
      color: $red
      line-height: 1.3
      margin-bottom: 10px
    &__body
      position: relative
      &--orderDetails
        max-width: 280px
        // margin-top: -35px
        // margin-left: -15px
        // margin-right: -15px
        // // +phablet
        //   margin-top: -45px

  .payment
    position: relative
    &__status
      font-size: 16px
      color: #333
      line-height: 1.3
    &__financialStatements
      margin-top: 25px
      p
        font-size: 14px
    &__date
      display: block
    &__time
      display: block
    &__action
      margin-top: 10px

  .tableList
    margin: 0
    width: 100%
    border-spacing: 0
    border-collapse: collapse
    &__thead
      display: block
      .tableList__th
        min-height: 30px
    &__tbody
      .tableList__tr
        min-height: 45px
        border-top: 1px solid rgba($black, .06)
        &:hover
          background-color: rgba($black, .04)

    &__tr
      display: flex
      flex-flow: row wrap
      align-items: center


    &__th
      flex: 1
      display: table-cell
      padding-right: 15px
      width: 33.3333333%
      line-height: 1.3
      font-size: 13px
      color: rgba(0,0,0,.4)
      font-weight: 400
      text-align: left
      &:last-child
        text-align: right
        padding-right: 0

    &__td
      font-size: 14px
      line-height: 1.5
      display: table-cell
      vertical-align: middle
      flex: 1
      width: 33.3333333%
      padding-right: 15px
      line-height: 1.3
      &:last-child
        text-align: right
        padding-right: 0

    &__text
      flex: 0 0 70%
      display: block
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      &--dateAndTime
        font-size: 12px
      &--amount
        font-size: 16px
      &--hasDue
        color: #999


  .delivery
    &__notice
      color: #777
      margin-bottom: 35px
    &__method
      position: relative
      margin-bottom: 20px
    &__address
      position: relative

  .method
    &__title
      font-size: 14px
      font-weight: 700
      color: #555
      fill: #555
    &__sub
      font-size: 13px
      font-weight: 400
      color: #aaa
      fill: #aaa

  .address
    position: relative
    font-style: normal
    line-height: 1.5
    font-size: 14px
    &__label
      font-weight: 400
      color: #555
      display: block
      text-decoration: underline
    &__text
      position: relative


</style>

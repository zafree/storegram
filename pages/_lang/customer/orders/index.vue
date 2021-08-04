<template>
  <div>
    <slot name="agentVerify" v-if="isAgentMode && showAgentPasswordVerification">
      <transition name="fade">
        <agent-password ></agent-password>
      </transition>
    </slot>
    <div class="CustomerOrder" v-else>
      <div class="CustomerOrder__container">
        <div class="CustomerOrder__row">

          <div class="CustomerOrder__title">
            {{ i18nText.orderPageTitle }}
          </div>
          <div class="CustomerOrder__body">
            <select v-if="hasAnyOrder" v-model="selectedOrderStatus">
              <option :value="enums.FrontEndOrderStatus.ALL">
                {{i18nEnums.FrontEndOrderStatus.ALL}}
              </option>
              <option :value="enums.FrontEndOrderStatus.PENDING">
                {{ i18nEnums.FrontEndOrderStatus.PENDING }}
              </option>
              <option :value="enums.FrontEndOrderStatus.CONFIRMED">
                {{ i18nEnums.FrontEndOrderStatus.CONFIRMED }}
              </option>
              <!-- <option :value="enums.FrontEndOrderStatus.SHIPPED">
                {{ i18nEnums.FrontEndOrderStatus.SHIPPED }}
              </option> -->
              <option :value="enums.FrontEndOrderStatus.DELIVERED">
                {{ i18nEnums.FrontEndOrderStatus.DELIVERED }}
              </option>
              <option :value="enums.FrontEndOrderStatus.CANCELLED">
                {{ i18nEnums.FrontEndOrderStatus.CANCELLED }}
              </option>
            </select>
            <table :class="['tableList']">
              <thead class="tableList__thead">
                <tr class="tableList__tr">
                  <th class="tableList__th" data-th="Order #">{{ i18nText.order }} #</th>
                  <th class="tableList__th" data-th="Date">{{ i18nText.date }}</th>
                  <th class="tableList__th" data-th="Total">{{ i18nText.total }}</th>
                  <th class="tableList__th" data-th="Status">{{ i18nText.orderStatus }}</th>
                  <!-- <th class="tableList__th" data-th="Order Type">{{ i18nText.orderType }}</th> -->
                  <th class="tableList__th" data-th="Actions">{{ i18nText.action }}</th>
                </tr>
              </thead>
              <template v-if="hasAnyOrder">
                <template v-if="filteredOrderSummaries && filteredOrderSummaries.length">
                  <tbody class="tableList__tbody">
                    <tr class="tableList__tr" v-for="(orderSummary, index) in filteredOrderSummaries" :key="orderSummary.order_id">
                      <td class="tableList__td" data-th="Order #">
                        <span class="tableList__text">
                          <button class="Button Button--orderLink" type="button" @click="showOrderDetails(orderSummary.id)">{{orderSummary.code}}</button>
                        </span>
                      </td>
                      <td class="tableList__td" data-th="Date">
                        <span class="tableList__text">{{ formatDate(orderSummary.created_at) }}</span>
                      </td>
                      <td class="tableList__td" data-th="Total">
                        <span class="tableList__text">৳ {{ __$(orderSummary.total) }}</span>
                      </td>
                      <td class="tableList__td" data-th="Status">
                        <span class="tableList__text">{{ orderSummary.i18nStatus }}</span>
                      </td>
                      <!-- <td class="tableList__td" data-th="Order Type">
                        <span class="tableList__text">{{ orderType(index) }}</span>
                      </td> -->
                      <td class="tableList__td" data-th="Actions">
                        <span class="tableList__text">
                          <button class="Button Button--pay" @click="payForThisOrder(orderSummary.id)" v-if="canPay(orderSummary) && showPayNow(index)">{{ i18nText.payNow }}</button>
                          <button class="Button Button--details" type="button" @click="showOrderDetails(orderSummary.id)">{{ i18nText.details }}</button>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </template>
                <template v-else>
                  <empty-list i18n-key="cusotmer_orders.no_order_yet"></empty-list>
                </template>
              </template>
            </table>
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
    agentVerificationMixin
  } from '~/utils'

  import { formatDate } from '~/utils/date'
  import { mapGetters } from 'vuex'

  import orderBy from 'lodash/orderBy'
  import filter from 'lodash/filter'

  import {
    getOrderSummaries
  } from '~/api'

  import enumMixinFactory from '~/utils/enum_mixin_factory'

  import {
    getOrderStatus
  } from '~/utils/map_order_status'

  import EmptyList from '~/components/EmptyList'
  import AgentPassword from '~/components/modals/AgentPassword'
  import i18nKeys from '~/pages/_lang/customer/orders/index.i18n.yaml'

  export default {
    mixins: [i18nMixin(i18nKeys), getOrderStatus, agentVerificationMixin, enumMixinFactory('OrderStatus', 'OrderPaymentStatus', 'FrontEndOrderStatus', 'SupportTicketOrderStatus')],
    asyncData ({store}) {
      return getOrderSummaries(store.getters.authToken, {
        from: 0,
        take: 10
      }).then((orderSummaries) => {
        return {
          orderSummaries
        }
      })
    },
    fetch (context) {
      let {store} = context
      if (!(store.state.customer || store.state.agent)) {
        return i18nRedirect(context, '/')
      }
    },
    created () {
      this.selectedOrderStatus = this.enums.FrontEndOrderStatus.ALL
      this.callNextOrders()
    },
    data () {
      return {
        selectedOrderStatus: null,
        orderSummaries: null,
        getNextTenOrders: true
      }
    },
    computed: {
      ...mapGetters([
        'isCustomerMode',
        'isAgentMode'
      ]),
      orderSummariesWithI18nOrderStatus () {
        if (this.orderSummaries) {
          let newOrderSummaries = this.orderSummaries.map((orderSummary) => {
            let mappedOrderStatus = this.mapOrderStatus(orderSummary.status)
            orderSummary.i18nStatus = this.i18nInvertedEnums.FrontEndOrderStatus[mappedOrderStatus]
            return orderSummary
          })
          return orderBy(newOrderSummaries, ['created_at'], ['desc'])
        }
        return []
      },
      hasAnyOrder () {
        return this.orderSummariesWithI18nOrderStatus && this.orderSummariesWithI18nOrderStatus.length
      },
      filteredOrderSummaries () {
        if (this.selectedOrderStatus === this.enums.FrontEndOrderStatus.ALL) {
          return this.orderSummariesWithI18nOrderStatus
        } else {
          let filteredData = filter(this.orderSummariesWithI18nOrderStatus, (o) => {
            return (this.selectedOrderStatus === this.mapOrderStatus(o.status))
          })
          return filteredData
        }
      }
    },
    methods: {
      async callNextOrders () {
        let from = 10
        while (this.getNextTenOrders) {
          let arr = []
          await getOrderSummaries(this.$store.getters.authToken, {
            from,
            take: 10
          })
          .then(response => {
            arr = response
            if (arr.length < 10) {
              this.getNextTenOrders = false
            }
          })
          this.orderSummaries = [...this.orderSummaries, ...arr]
          from = from + 10
        }
      },
      showPayNow (index) {
        if (this.isAgentMode) {
          return this.filteredOrderSummaries[index].type === 'regular'
        }
        return true
      },
      orderType (index) {
        console.log('i18nInvertedEnums.SupportTicketOrderStatus ==>', this.i18nInvertedEnums.SupportTicketOrderStatus)
        return this.i18nInvertedEnums.SupportTicketOrderStatus[this.orderSummaries[index].type]
      },
      canPay (orderSummary) {
        let result1 = (
          orderSummary.payment_status === this.enums.OrderPaymentStatus.COMPLETE ||
          orderSummary.payment_status === this.enums.OrderPaymentStatus.REFUNDED ||
          orderSummary.status === this.enums.OrderStatus.REJECTED ||
          orderSummary.status === this.enums.OrderStatus.CANCELLED ||
          orderSummary.status === this.enums.OrderStatus.REFUNDED ||
          orderSummary.status === this.enums.OrderStatus.REFUND_PENDING ||
          orderSummary.status >= this.enums.OrderStatus.PICK_UP_READY
        )
        let result2
        if (this.isAgentMode) {
          result2 = orderSummary.type === 'regular'
        } else {
          result2 = true
        }
        return !result1 && result2
      },
      showOrderDetails (orderId) {
        if (this.isCustomerMode) {
          return i18nRedirect(this.$ctx, `/customer/orders/${orderId}`)
        } else if (this.isAgentMode) {
          return i18nRedirect(this.$ctx, `/agent/orders/${orderId}`)
        } else {
          return i18nRedirect(this.$ctx, '/')
        }
      },
      payForThisOrder (orderId) {
        return i18nRedirect(this.$ctx, `/checkout/payment/${orderId}`)
      },
      formatDate (date) {
        return formatDate(date, this.$i18n.locale)
      }
    },
    beforeDestroy () {
      this.getNextTenOrders = false
    },
    components: {
      EmptyList,
      AgentPassword
    }
  }
</script>

<style>
  /* .order-block{
    border: 1px solid red;
    background-color: #fff;
    padding: 15px;
  } */
</style>
<style lang="sass" scoped>
  .CustomerOrder
    background-color: $white
    height: 100%
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
      // margin-top: 20px

  .tableList
    margin: 0
    width: 100%
    border-spacing: 0
    border-collapse: collapse
    &__thead
      display: none
      +tablet
        display: block
    &__tbody

    &__tr
      display: block
      padding: 20px 0
      border-bottom: 1px solid rgba($black, .06)
      &:last-child
        border-bottom: none
      +tablet
        display: flex
        flex-flow: row wrap
        align-items: center
        min-height: 50px
        padding: 0 10px
        border-bottom: none
      +desktop
        padding: 0 20px
      &:hover
        background-color: rgba($black, .04)

    &__th
      display: none
      +tablet
        flex: 1
        display: table-cell
        padding-right: 15px
        // width: 20%
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
      flex: 0 0 70%
      display: block
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      &--link
        color: #3a8bbb

  [data-th="Order #"]
    +tablet
      min-width: 155px
      max-width: 155px
    +desktop
      min-width: 20%
      max-width: 20%
  [data-th="Date"]
    +tablet
      min-width:  93px
      max-width:  93px
    +desktop
      min-width: 17%
      max-width: 17%
  [data-th="Total"]
    +tablet
      min-width:  75px
      max-width:  75px
    +desktop
      min-width: 17%
      max-width: 17%
  [data-th="Status"]
    +tablet
      min-width:  87px
      max-width:  87px
    +desktop
      min-width: 17%
      max-width: 17%
  [data-th="Order Type"]
    +tablet
      min-width:  100px
      max-width:  100px
    +desktop
      min-width: 11%
      max-width: 11%

  @import "shared/button"

  .Button
    display: inline-flex
    flex-flow: row wrap
    align-items: center
    padding: 0 10px
    height: 24px
    border-radius: 2px
    font-size: 13px
    background-color: rgba($black, .25)
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
    &--pay
      +buttonPrimary

    &--details
      +btnDark

</style>


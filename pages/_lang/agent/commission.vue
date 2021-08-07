<template>
  <div>
    <slot name="agentVerify" v-if="showAgentPasswordVerification">
      <transition name="fade">
        <agent-password ></agent-password>
      </transition>
    </slot>
    <div class="AgentCommission" v-else>
      <div class="AgentCommission__title">
        {{ i18nText.commissionPageTitle }}
      </div>
      <agent-commission-summary-view></agent-commission-summary-view>
      <div class="AgentCommission__body">
        <select v-if="hasAnyOrder" v-model="selectedCommissionStatus">
          <option :value="-1" selected>
            {{ i18nText.all }}
          </option>
          <option v-for="(text, status) of commissionStatus" :key="status" :value="status">
            {{ text }}
          </option>
        </select>
        <table class="tableList">
          <thead class="tableList__thead">
            <tr class="tableList__tr">
              <th class="tableList__th" data-th="Order #">{{ i18nText.order }} #</th>
              <th class="tableList__th" data-th="Date">{{ i18nText.date }}</th>
              <th class="tableList__th" data-th="Online Order?">{{ i18nText.onlineOrder }}</th>
              <th class="tableList__th" data-th="Sales Commission">{{ i18nText.salesCommission }}</th>
              <th class="tableList__th" data-th="Delivery Commission">{{ i18nText.deliveryCommission }}</th>
            </tr>
          </thead>
          <template v-if="hasAnyOrder">
            <template v-if="filteredOrderSummaries && filteredOrderSummaries.length">
              <tbody class="tableList__tbody tableList__tbody--contentHolder">
                <tr class="tableList__tr" v-for="orderSummary in filteredOrderSummaries" :key="orderSummary.order_id">
                  <td class="tableList__td" data-th="Order #">
                    <span class="tableList__text">
                      <button class="Button Button--orderLink" type="button" @click="showOrderDetails(orderSummary.id)">{{orderSummary.code}}</button>
                    </span>
                  </td>
                  <td class="tableList__td" data-th="Date">
                    <span class="tableList__text">{{ formatDate(orderSummary.created_at) }}</span>
                  </td>
                  <td class="tableList__td" data-th="Online Order?">
                    <span class="tableList__text">{{ i18nBool(orderSummary.is_online_order) }}</span>
                  </td>
                  <td class="tableList__td" data-th="Sales">
                    <span class="tableList__text">
                      ৳ {{ __$(orderSummary.order_commission) }}
                      ({{ __enumValue('OrderCommissionStatus', orderSummary.commission_status) }})</span>
                  </td>
                  <td class="tableList__td" data-th="Delivery">
                    <span class="tableList__text">
                      ৳ {{ __$(orderSummary.delivery_commission) }}
                      ({{ __enumValue('OrderCommissionStatus', orderSummary.commission_status) }})</span>
                  </td>
                </tr>
              </tbody>
              <tbody class="tableList__tbody tableList__tbody--total">
                <tr class="tableList__tr">
                  <td class="tableList__td" data-th="Total">{{ i18nText.total}}</td>
                  <td class="tableList__td" data-th="Date"></td>
                  <td class="tableList__td" data-th="Sales">
                    <span v-if="allSelected">
                      ৳ {{ __$(totalCommission.sales_paid) }} {{ i18nText.paid }}
                      ( ৳ {{ __$(totalCommission.sales_pending) }} {{ i18nText.pending }})
                    </span>
                    <span v-else-if="paidSelected">
                      ৳ {{ __$(totalCommission.sales_paid) }} ({{ i18nText.paid }})
                    </span>
                    <span v-if="pendingSelected">
                      ৳ {{ __$(totalCommission.sales_pending) }} ({{ i18nText.pending }})
                    </span>
                    <span v-else-if="cancellSelected">
                      ৳ {{ __$(totalCommission.sales_cancelled) }} ({{ i18nText.cancelled}})
                    </span>
                  </td>
                  <td class="tableList__td" data-th="Delivery">
                    <span v-if="allSelected">
                      ৳ {{ __$(totalCommission.delivery_paid) }} {{ i18nText.paid }}
                      ( ৳ {{ __$(totalCommission.delivery_pending) }} {{i18nText.pending }})
                    </span>
                    <span v-if="paidSelected">
                      ৳ {{ __$(totalCommission.delivery_paid) }} ({{ i18nText.paid }})
                    </span>
                    <span v-if="pendingSelected">
                      ৳ {{ __$(totalCommission.delivery_pending) }} ({{ i18nText.pending }})
                    </span>
                    <span v-else-if="cancellSelected">
                      ৳ {{ __$(totalCommission.delivery_cancelled) }} ({{ i18nText.cancelled}})</span>
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
</template>

<script>
  import {
    i18nMixin,
    i18nRedirect,
    agentVerificationMixin
  } from '~/utils'

  import enumMixinFactory from '~/utils/enum_mixin_factory'

  import {formatDate} from '~/utils/date'
  import { mapGetters } from 'vuex'

  import {
    getOrderSummaries
  } from '~/api'
  import logger from '~/utils/logger'

  import AgentCommissionSummaryView from '~/components/AgentCommissionSummaryView'
  import EmptyList from '~/components/EmptyList'
  import AgentPassword from '~/components/modals/AgentPassword'
  import i18nKeys from '~/pages/_lang/agent/commission.i18n.yaml'

  export default {
    mixins: [i18nMixin(i18nKeys), agentVerificationMixin, enumMixinFactory('OrderCommissionStatus')],
    asyncData ({store}) {
      return getOrderSummaries(store.getters.authToken)
      .then(orderSummaries => {
        return {
          orderSummaries
        }
      })
      .catch(reason => {
        logger.error(reason)
      })
    },
    fetch (context) {
      let {store} = context
      if (!store.state.agent) {
        return i18nRedirect(context, '/')
      }
    },
    data () {
      return {
        selectedCommissionStatus: -1,
        orderSummaries: null
      }
    },
    computed: {
      ...mapGetters([
        'isCustomerMode',
        'isAgentMode'
      ]),
      commissionStatus () {
        return this.i18nInvertedEnums.OrderCommissionStatus
      },
      totalCommission () {
        if (this.orderSummaries.length) {
          const commissionStatuses = this.enums.OrderCommissionStatus
          return {
            sales_pending: this.orderSummaries
              .filter(o => o.commission_status === commissionStatuses.PENDING)
              .reduce((acc, o) => (acc + parseFloat(o.order_commission)), 0),
            sales_paid: this.orderSummaries
              .filter(o => o.commission_status === commissionStatuses.PAID)
              .reduce((acc, o) => (acc + parseFloat(o.order_commission)), 0),
            sales_cancelled: this.orderSummaries
              .filter(o => o.commission_status === commissionStatuses.CANCELLED)
              .reduce((acc, o) => (acc + parseFloat(o.order_commission)), 0),
            delivery_pending: this.orderSummaries
              .filter(o => o.commission_status === commissionStatuses.PENDING)
              .reduce((acc, o) => (acc + parseFloat(o.delivery_commission)), 0),
            delivery_paid: this.orderSummaries
              .filter(o => o.commission_status === commissionStatuses.PAID)
              .reduce((acc, o) => (acc + parseFloat(o.delivery_commission)), 0),
            delivery_cancelled: this.orderSummaries
              .filter(o => o.commission_status === commissionStatuses.CANCELLED)
              .reduce((acc, o) => (acc + parseFloat(o.delivery_commission)), 0)
          }
        }
        return {}
      },
      selectedFilter () {
        return parseInt(this.selectedCommissionStatus)
      },
      allSelected () {
        return this.selectedFilter === -1
      },
      pendingSelected () {
        return this.selectedFilter === this.enums.OrderCommissionStatus.PENDING
      },
      paidSelected () {
        return this.selectedFilter === this.enums.OrderCommissionStatus.PAID
      },
      cancellSelected () {
        return this.selectedFilter === this.enums.OrderCommissionStatus.CANCELLED
      },
      hasAnyOrder () {
        return this.orderSummaries && this.orderSummaries.length
      },
      filteredOrderSummaries () {
        if (this.selectedFilter === -1) {
          return this.orderSummaries
        }
        return this.orderSummaries
              .filter(o => o.commission_status === this.selectedFilter)
      }
    },
    methods: {
      showOrderDetails (orderId) {
        return i18nRedirect(this.$ctx, `/agent/orders/${orderId}`)
      },
      formatDate (date) {
        return formatDate(date, this.$i18n.locale)
      },
      i18nBool (value) {
        return this.$t('boolean.' + (value ? 'yes' : 'no'))
      }
    },
    components: {
      EmptyList,
      AgentCommissionSummaryView,
      AgentPassword
    }
  }
</script>

<style lang="sass" scoped>
  .AgentCommission
    background-color: $white
    padding: 15px 15px 30px
    box-shadow: 0 1px 3px rgba($black, 0.1)
    margin-left: -15px
    margin-right: -15px
    height: 100%
    // +phablet
      margin-left: 0
      margin-right: 0
      padding: 20px 30px 30px
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
        border-bottom: 2px solid #ddd
    &__tbody
      .tableList__tr
        +tablet
          &:nth-child(2n+1)
            background-color: rgba($black, .04)
      &--contentHolder
        +tablet
          max-height: calc(100vh - 450px)
          display: block
          overflow-y: auto
      &--total
        border-top: 2px solid #ddd
        font-weight: bold
        .tableList__tr
          background-color: transparent !important
          [data-th="Date"]
            display: none
            +tablet
              display: block

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
        padding: 0 20px
        border-bottom: none

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
        flex: 0 0 35%
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

    [data-th="Total"]
      // +tablet
      //   min-width: 20%
      //   max-width: 20%
    [data-th="Order #"]
      // +tablet
      //   min-width: 20%
      //   max-width: 20%
    [data-th="Date"]
      // +tablet
      //   min-width: 20%
      //   max-width: 20%

    [data-th="From Order"]
      +tablet
        min-width: 20%
        max-width: 20%
    [data-th="From Delivery"]
      +tablet
        min-width: 15%
        max-width: 15%
    [data-th="Total Pending"]
      +tablet
        min-width: 10%
        max-width: 10%
    [data-th="Pending"]
      +tablet
        min-width: 20%
        max-width: 20%
    [data-th="Earned"]
      +tablet
        min-width: 15%
        max-width: 15%
    [data-th="Spent"]
      +tablet
        min-width: 10%
        max-width: 10%

    [data-th="Pending Commission"]
      +tablet
        min-width: 18%
        max-width: 18%
    [data-th="Earned Commission"],
    [data-th="Spent Commission"]
      // +tablet
      //   min-width: 30%
      //   max-width: 30%

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
      +button

    &--details
      +button

</style>

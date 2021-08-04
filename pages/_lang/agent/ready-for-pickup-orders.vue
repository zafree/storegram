<template>
  <div>
    <slot name="agentVerify" v-if="isAgentMode && showAgentPasswordVerification">
      <transition name="fade">
        <agent-password ></agent-password>
      </transition>
    </slot>
    <div class="ReadyFoPickup" v-else>
      <div class="ReadyFoPickup__title">
        {{ i18nText.orderPageTitle }}
      </div>
      <div class="ReadyFoPickup__body">
        <div class="Field Field--Search">
          <div class="Field__control">
            <input v-model="searchedOrder" class="Field__input" type="text" :placeholder="i18nText.searchPlaceholder" >
          </div>
          <!-- <p class="Field__validation">Error</p> -->
          <!-- <p class="Field__help">
            <a class="link">
              <span>Re-send OTP</span>
            </a>
          </p> -->
        </div>
        <table :class="['tableList']">
          <thead class="tableList__thead">
            <tr class="tableList__tr">
              <th class="tableList__th" data-th="Order #"> {{ i18nText.order }} #</th>
              <th class="tableList__th" data-th="Name">{{ i18nText.name }}</th>
              <th class="tableList__th" data-th="Total">{{ i18nText.orderTotal }}</th>
              <th class="tableList__th" data-th="Due">{{ i18nText.dueAmount }}</th>
              <th class="tableList__th" data-th="Actions">{{ i18nText.action }}</th>
            </tr>
          </thead>
          <template v-if="filteredOrderSummaries && filteredOrderSummaries.length">
            <tbody class="tableList__tbody">
              <pickup-ready-order-list v-for="(order) in filteredOrderSummaries" :key="order.order_id" :order="order" @updateOrderList="removeVerifiedOrder"></pickup-ready-order-list>
            </tbody>
          </template>
          <template v-else>
            <empty-list :i18n-key="i18nText.noOrder"></empty-list>
          </template>
        </table>
      </div>
    </div>
  </div>
</template>

<script>

  import uniqBy from 'lodash/uniqBy'
  import filter from 'lodash/filter'
  import findIndex from 'lodash/findIndex'
  import parseInt from 'lodash/parseInt'

  import {
    i18nMixin,
    i18nRedirect,
    agentVerificationMixin
  } from '~/utils'

  import { SET_PAGE_NOTIFICATION } from '~/store/constants.yaml'
  import { OrderStatus } from '~/utils/enums.yaml'
  import { mapGetters } from 'vuex'

  import {
    getOrderSummaries
  } from '~/api'

  import PickupReadyOrderList from '~/components/PickupReadyOrderList'
  import EmptyList from '~/components/EmptyList'
  import AgentPassword from '~/components/modals/AgentPassword'
  import i18nKeys from '~/pages/_lang/agent/ready-for-pickup-orders.i18n.yaml'

  export default {
    mixins: [i18nMixin(i18nKeys), agentVerificationMixin],
    asyncData ({store}) {
      return getOrderSummaries(store.getters.authToken, { status: OrderStatus.PICK_UP_READY })
        .then((orderSummaries) => {
          return {
            orderSummaries
          }
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
        searchedOrder: null
      }
    },
    computed: {
      ...mapGetters([
        'isAgentMode'
      ]),
      filteredOrderSummaries () {
        if (this.searchedOrder) {
          return uniqBy(filter(this.orderSummaries, (order) => {
            return order.code.toLowerCase().includes(this.searchedOrder.toLowerCase()) ||
            order.customer.mobile.includes(this.searchedOrder)
          }))
        } else {
          return this.orderSummaries
        }
      }
    },
    methods: {
      removeVerifiedOrder (response) {
        let index = findIndex(this.orderSummaries, { id: parseInt(response.order_id) })
        let orderCode = this.orderSummaries[index].code
        this.orderSummaries.splice(index, 1)
        this.$store.commit(SET_PAGE_NOTIFICATION, { type: 'success', key: response.pickup_order_verified.toLowerCase(), field: orderCode })
      }
    },
    components: {
      EmptyList,
      AgentPassword,
      PickupReadyOrderList
    }
  }
</script>

<style lang="sass" scoped>
  .ReadyFoPickup
    background-color: $white
    padding: 15px 15px 30px
    box-shadow: 0 1px 3px rgba($black, 0.1)
    margin-left: -15px
    margin-right: -15px
    height: 100%
    +phablet
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
        align-items: top
        min-height: 50px
        padding: 0 20px
        border-bottom: none
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
    &--verify
      +btnYellow
      

</style>


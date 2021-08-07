<template>
  <div class="SupportRequests">
    <div class="SupportRequests__title">{{ ticketsTitle }}</div>
    <div class="SupportRequests__body">
      <table class="tableList">
        <thead class="tableList__thead">
          <tr class="tableList__tr">
            <th class="tableList__th" data-th="Request #">{{ i18nText.request }} #</th>
            <th class="tableList__th" data-th="Update">{{ i18nText.update }}</th>
            <th class="tableList__th" data-th="UPC">{{ i18nText.upc }}</th>
            <th class="tableList__th" data-th="Requested for">{{ i18nText.requestedFor }}</th>
            <th v-if="!editable" class="tableList__th" data-th="Approved for">{{ i18nText.approvedFor }}</th>
            <th class="tableList__th" data-th="Status">{{ i18nText.status }}</th>
            <th  class="tableList__th" data-th="Actions">{{ i18nText.action }}</th>
          </tr>
        </thead>
        <tbody class="tableList__tbody">
          <tr class="tableList__tr" v-for="(supportRequest, index) in tickets" :key="index">
            <td class="tableList__td" data-th="Request #">
              <span class="tableList__text">
                <button class="button button--orderLink" @click="redirectToeditOrDetails(supportRequest.id)">{{ supportRequest.code }}</button>
              </span>
            </td>
            <td class="tableList__td" data-th="Update">
              <span class="tableList__text">{{ formatDate(supportRequest.updated_at) }}</span>
            </td>
            <td class="tableList__td" data-th="UPC">
              <span class="tableList__text">{{ supportRequest.upc }}</span>
            </td>
            <td class="tableList__td" data-th="Requested for">
              <span class="tableList__text">{{requestedFor(index)}}</span>
            </td>
            <td v-if="!editable" class="tableList__td" data-th="Approved for">
              <span class="tableList__text">
                {{approvedFor(index)}}
              </span>
            </td>
            <td class="tableList__td" data-th="Status">
              <span class="tableList__text">{{ orderStatus(index) }}</span>
            </td>
            <td v-if="editable" class="tableList__td" data-th="Actions">
              <span class="tableList__text">
                <button class="button button--update" @click="redirectToeditOrDetails(supportRequest.id)">
                  <span class="button--arrowEdit">
                    <img src="/svg/arrow-edit.svg">
                  </span>
                  {{i18nText.update}}
                </button>
              </span>
            </td>
            <td v-else class="tableList__td" data-th="Actions">
              <span class="tableList__text">
                <button class="button button--details" @click="redirectToeditOrDetails(supportRequest.id)">{{ i18nText.details }}
                </button>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { i18nRedirect, i18nMixin } from '~/utils'
import i18nLink from '~/components/i18nLink'
import enumMixinFactory from '~/utils/enum_mixin_factory'
import { mapGetters } from 'vuex'
import { formatDate } from '~/utils/date'
import i18nKeys from '~/components/SupportTickets.i18n.yaml'

export default {
  mixins: [enumMixinFactory('SupportTicketStatus', 'SupportTicketsApprovedStatus'), i18nMixin(i18nKeys)],
  props: {
    editable: {
      type: Boolean,
      default: true
    },
    tickets: {
      type: Array,
      required: true
    },
    ticketsTitle: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters(['isAgentMode']),
    agentOrCustomer () {
      return this.isAgentMode ? 'agent' : 'customer'
    }
  },
  methods: {
    supportRequestStatus (index) {
      return this.tickets[index].status
    },
    redirectToeditOrDetails (id) {
      i18nRedirect(this.$ctx, `/${this.agentOrCustomer}/support-tickets/${id}`)
    },
    requestedFor (index) {
      return this.i18nInvertedEnums.SupportTicketsApprovedStatus[this.tickets[index].requested_type]
    },
    approvedFor (index) {
      return this.i18nInvertedEnums.SupportTicketsApprovedStatus[this.tickets[index].approval_type]
    },
    orderStatus (index) {
      return this.i18nInvertedEnums.SupportTicketStatus[this.tickets[index].status]
    },
    formatDate (date) {
      return formatDate(date, this.$i18n.locale)
    }
  },
  components: {
    i18nLink
  }
}
</script>

<style lang="sass" scoped>
  @import "shared/form/field"
  @import "shared/button"
  .SupportRequests
    background-color: $white
    padding: 15px 15px 30px
    box-shadow: 0 1px 3px rgba($black, 0.1)
    height: 100%
    // +phablet
      margin-left: 0
      margin-right: 0
      padding: 20px 30px 30px
    &__title,
    &__body
      position: relative
      +tablet
        margin-left: -15px
        margin-right: -15px
    &__title
      font-size: 24px
      font-weight: 400
      color: #333
      line-height: 1.3
      margin-bottom: 10px
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
        padding-right: 10px
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
  [data-th="Request #"]
    +tablet
      min-width: 160px
      max-width: 160px
    +desktop
      min-width: 20%
      max-width: 20%
  [data-th="Update"]
    +tablet
      min-width: 90px
      max-width: 90px
    +desktop
      min-width: 15%
      max-width: 15%
  [data-th="UPC"]
    +tablet
      min-width: 122px
      max-width: 122px
    +desktop
      min-width: 15%
      max-width: 15%
  [data-th="Requested for"]
    +tablet
      min-width: 75px
      max-width: 75px
    +desktop
      min-width: 13%
      max-width: 13%
  [data-th="Approved for"]
    +tablet
      min-width: 75px
      max-width: 75px
    +desktop
      min-width: 13%
      max-width: 13%
  [data-th="Status"]
    +tablet
      min-width: 90px
      max-width: 90px
    +desktop
      min-width: 15%
      max-width: 15%
  .button
    display: inline-flex
    flex-flow: row wrap
    align-items: center
    padding: 0 10px
    height: 24px
    border-radius: 2px
    font-size: 13px
    background-color: transparent
    border: none
    cursor: pointer
    &:focus,
    &:active
      outline: none
    &--orderLink
      padding: 0
      background-color: transparent
      color: #3a8bbb
      width: 100%
      display: block
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      text-align: left
    &--update
      color: #fff
      fill: #fff
      background-color: #333
      background-color: #BFBFBF
      box-shadow: inset 0 1px 0 hsla(0,0%,100%,.4)
      &:hover
        color: #fff
        fill: #fff
        background-color: #BFBFBF
    &--arrowEdit
      margin-right: 5px
    &--details
      +button

</style>

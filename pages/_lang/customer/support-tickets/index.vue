<template>
  <div>
    <slot name="agentVerify" v-if="isAgentMode && showAgentPasswordVerification">
      <transition name="fade">
        <agent-password :requests="requests"></agent-password>
      </transition>
    </slot>
    <div v-else>
      <support-tickets v-if="isAgentMode" :tickets="supportRequests" :ticketsTitle="i18nText.receivedRequests" :editable="true"></support-tickets>
      <support-tickets :tickets="requests" :ticketsTitle="i18nText.supportTickets" :editable="false"></support-tickets>
    </div>
  </div>
</template>

<script>
  import AgentPassword from '~/components/modals/AgentPassword'
  import i18nLink from '~/components/i18nLink'
  import SupportTickets from '~/components/SupportTickets.vue'
  import { getSupportRequests } from '~/api'
  import { mapGetters } from 'vuex'
  import { i18nRedirect, agentVerificationMixin, i18nMixin } from '~/utils'
  import enumMixinFactory from '~/utils/enum_mixin_factory'
  import i18nKeys from '~/pages/_lang/customer/support-tickets/index.i18n.yaml'

  export default {
    fetch (context) {
      let {store} = context
      if (!store.getters.agentToken && !store.getters.customerToken) {
        return i18nRedirect(context, '/')
      }
    },
    asyncData ({ store }) {
      const token = store.getters.agentToken ? store.getters.agentToken : store.getters.customerToken
      const localization = store.state.locale
      return getSupportRequests(token, localization)
      .then(requests => {
        return {
          requests
        }
      })
    },
    mixins: [agentVerificationMixin, enumMixinFactory('SupportTicketStatus'), i18nMixin(i18nKeys)],
    computed: {
      ...mapGetters(['isAgentMode']),
      supportRequests () {
        return this.requests.filter(r => {
          return r.status === 0
        })
      }
    },
    methods: {
      supportRequestStatus (index) {
        return this.requests[index].status
      },
      redirectToedit (id) {
        i18nRedirect(this.$ctx, `/agent/support-tickets/${id}`)
      }
    },
    components: {
      AgentPassword,
      i18nLink,
      SupportTickets
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
  [data-th="Request #"]
    +tablet
      min-width: 90px
      max-width: 90px
    +desktop
      min-width: 17%
      max-width: 17%
  [data-th="Update"]
    +tablet
      min-width: 110px
      max-width: 110px
    +desktop
      min-width: 17%
      max-width: 17%
  [data-th="UPC"]
    +tablet
      min-width: 120px
      max-width: 120px
    +desktop
      min-width: 20%
      max-width: 20%
  [data-th="Requested for"]
    +tablet
      min-width: 120px
      max-width: 120px
    +desktop
      min-width: 20%
      max-width: 20%
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
    &--update
      color: #fff
      fill: #fff
      background-color: #333
      border: 1px solid #BFBFBF
      background-color: #BFBFBF
      box-shadow: inset 0 1px 0 hsla(0,0%,100%,.4)
      &:hover
        color: #fff
        fill: #fff
        background-color: #BFBFBF
    &--arrowEdit
      margin-right: 5px
</style>

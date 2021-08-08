<template>
  <div :class="$style.btn">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
      <use xlink:href="/svg/icons.svg?#i-avatar"></use>
    </svg>
    <ul v-if="isCustomerMode" :class="$style.dropdown" role="tabs">
      <li><i18n-link class="url" :to="'/customer/profile'">{{ i18nText.hi }} {{customer.name}}</i18n-link></li>
      <li :class="$style.separator"><i18n-link class="url" :to="'/customer/profile'">{{ i18nText.yourProfile }}</i18n-link></li>
      <li><i18n-link class="url" :to="'/customer/orders'">{{ i18nText.yourOrders }}</i18n-link></li>
      <li><i18n-link class="url" :to="'/customer/delivery-addresses'">{{ i18nText.yourAddress }}</i18n-link></li>
      <!-- <li><i18n-link class="url" :to="'/customer/support-tickets'" >{{ $t('user_info.support_tickets') }}</i18n-link></li> -->
      <li><a rel="nofollow" href="#" @click.prevent="logoutCustomer()">{{ i18nText.signOut }}</a></li>
    </ul>
  </div>
</template>

<script>
  import i18nLink from '~/components/i18nLink'
  import i18nKeys from '~/components/layouts/header/UserInfo.i18n.yaml'
  import { mapState, mapGetters } from 'vuex'

  import {
    i18nMixin,
    i18nRedirect,
    overlayMixin
  } from '~/utils'

  import {
    LOGOUT_CUSTOMER,
    LOGOUT_AGENT,
    TOGGLE_COMMISSION,
    SET_OVERLAY_CONTEXT,
    SYNC_COMMISSION_SHOW,
    AGENT_PROFILE_ACCESS_TIMEOUT,
    UPDATE_AGENT_PROFILE_ACCESS_TIMESTAMP
  } from '~/store/constants.yaml'

  export default {
    mixins: [overlayMixin, i18nMixin(i18nKeys)],
    created () {
      this.$root.$on(SYNC_COMMISSION_SHOW, () => {
        this.toggleCommissionChecked = this.toggleCommission
      })
    },
    watch: {
      toggleCommission: function (newValue, oldValue) {
        this.toggleCommissionChecked = newValue
      }
    },
    data () {
      return {
        toggleCommissionChecked: false
      }
    },
    computed: {
      ...mapState([
        'toggleCommission',
        'agentProfileAccessInfo',
        'pageMode',
        'customer',
        'agent'
      ]),
      ...mapGetters([
        'isAgentMode',
        'isCustomerMode'
      ]),
      userName () {
        if (this.agent) return this.__(this.agent.name)
        else if (this.customer) return this.customer.name
        else return null
      },
      userAvatar () {
        if (this.isCustomerMode && this.customer && (this.customer.facebook_avatar || this.customer.avatar_url)) return (this.customer.facebook_avatar || this.customer.avatar_url)
        else if (this.isAgentMode && this.agent && this.agent.address && this.agent.address.profile_image) return this.agent.address.profile_image
        else return null
      },
      commisionAction () {
        if (this.toggleCommission) return 'profile.hide'
        else return 'profile.show'
      },
      timeDifference () {
        if (!this.agentProfileAccessInfo) return
        return Date.now() - this.agentProfileAccessInfo.access_timestamp
      }
    },
    methods: {
      toggle () {
        if (this.pageMode.profileMode && this.timeDifference && (this.timeDifference < AGENT_PROFILE_ACCESS_TIMEOUT)) {
          this.$store.commit(UPDATE_AGENT_PROFILE_ACCESS_TIMESTAMP, Date.now())
          this.$store.commit(TOGGLE_COMMISSION)
        } else if (this.toggleCommissionChecked) {
          let contextObj = {
            isPasswordModalOpenedByCommission: true
          }
          this.$store.commit(SET_OVERLAY_CONTEXT, contextObj)
          this.openOverlay(this.overlays.agentPasswordModal)
        } else {
          this.$store.commit(TOGGLE_COMMISSION)
        }
      },
      logoutCustomer () {
        this.$store.dispatch(LOGOUT_CUSTOMER).then(() => {
          i18nRedirect(this.$ctx, '/', false)
        })
      },
      logoutAgent () {
        this.$store.dispatch(LOGOUT_AGENT).then(() => {
          this.$router.go({
            path: this.$router.path,
            query: {
              ts: Date.now()
            }
          })
        })
      }
    },
    components: {
      i18nLink
    }
  }
</script>

<style lang="sass" module>
  @import "shared/button"
  .btn
    overflow: visible
    width: 44px
    border-radius: 500em
    &:hover,
    &:focus,
    &:active
      border-color: $green
      .dropdown
        visibility: visible
        opacity: 1

  .dropdown
    position: absolute
    // display: none
    float: left
    top: 100%
    right: 0
    width: 180px
    margin-top: 10px
    padding: 10px 0 15px
    background-color: $black
    border-radius: 6px
    // box-shadow: 1px 1px 1px rgba($black, 0.3)
    z-index: 999
    font-size: 14px
    font-weight: $weight-medium
    visibility: hidden
    opacity: 0
    transition: all $speed $easing
    &::before
      content: " "
      position: absolute
      width: 44px
      height: 10px
      top: 0
      right: 0
      margin-top: -10px
      background-color: $red
    &::after
      content: " "
      position: absolute
      width: 0
      height: 0
      top: 0
      right: 0
      margin-top: -10px
      margin-right: 11px
      border-left: 10px solid transparent
      border-right: 10px solid transparent
      border-bottom: 10px solid $black
    li
      clear: left
      border: 0
      display: inline-block
      list-style: none
      width: 100%
      a
        color: #aaa
        display: block
        padding: 5px 20px
        background: none
        box-shadow: none
        text-decoration: none
        &:hover
          color: $white
          background-color: rgba($white, .1)

      &.separator
        border-top: 1px solid rgba($white, .14)
        margin-top: 5px
        padding-top: 5px
</style>


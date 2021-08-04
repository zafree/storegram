<template>
  <div :class="$style.userAvatar">
    <div :class="$style.profileLink">
      <div :class="$style.avatar">
        <svg :class="$style.avatarSvgIcon" viewBox="0 0 14 14">
          <circle cx="7" cy="3.5" r="3.5"/>
          <path d="M8.2,7H5.8C2.6,7,0,9.6,0,12.8V14h14v-1.2C14,9.6,11.4,7,8.2,7C8.2,7,8.2,7,8.2,7z"/>
        </svg>
        <!-- <img v-if="userAvatar" :src="userAvatar" :alt="userName">
        <img :class="$style.avatarSvgIcon" src="/svg/delivery-point/dgMan.svg" alt=""> -->
      </div>
    </div>
    <ul v-if="isCustomerMode" :class="$style.profileMenu" role="tabs">
        <li><i18n-link class="url" :to="'/customer/profile'">{{ i18nText.hi }} {{customer.name}}</i18n-link></li>
        <li :class="$style.separator"><i18n-link class="url" :to="'/customer/profile'">{{ i18nText.yourProfile }}</i18n-link></li>
        <li><i18n-link class="url" :to="'/customer/orders'">{{ i18nText.yourOrders }}</i18n-link></li>
        <li><i18n-link class="url" :to="'/customer/delivery-addresses'">{{ i18nText.yourAddress }}</i18n-link></li>
        <!-- <li><i18n-link class="url" :to="'/customer/support-tickets'" >{{ $t('user_info.support_tickets') }}</i18n-link></li> -->
        <li><a rel="nofollow" href="#" @click.prevent="logoutCustomer()">{{ i18nText.signOut }}</a></li>
    </ul>
    <ul v-if="isAgentMode && !pageMode.checkoutMode" :class="$style.profileMenu" role="tabs">
        <li><i18n-link class="url" :to="'/agent/profile'">{{ i18nText.hi }} {{ __(agent.name) }}</i18n-link></li>
        <li :class="$style.separator"><i18n-link class="url" :to="'/agent/profile'">{{ i18nText.yourProfile }}</i18n-link></li>
        <li><i18n-link class="url" :to="'/agent/orders'">{{ i18nText.yourOrders }}</i18n-link></li>
        <li><i18n-link class="url" :to="'/agent/commission'">{{ i18nText.yourCommission }}</i18n-link></li>
        <li><i18n-link class="url" :to="'/agent/ready-for-pickup-orders'">{{ i18nText.readyForPickupOrders }}</i18n-link></li>
        <li><i18n-link class="url" :to="'/agent/support-tickets'" >{{ $t('user_info.support_tickets') }}</i18n-link></li>
        <li :class="$style.separator">
          <div :class="$style.checkbox">
            <input :class="$style.checkboxInput" type="checkbox" id="checkbox_showOrHideProductCommision" @change="toggle" v-model="toggleCommissionChecked">
            <label :class="$style.checkboxLabel" for="checkbox_showOrHideProductCommision">{{ i18nText.commissionLabel }}<small>({{ $t(commisionAction) }})</small></label>
          </div>
        </li>
        <!-- <li><i18n-link class="url" :to="'/agent/support-requests'" >{{ $t('user_info.support_requests') }}</i18n-link></li> -->
        <li><a rel="nofollow" href="#" @click.prevent="logoutAgent()">{{ i18nText.signOut }}</a></li>
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

  .userAvatar
    position: relative
    height: 44px
    width: 44px
    display: flex
    flex-flow: row wrap
    justify-content: center
    align-items: center
    cursor: pointer
    margin-right: -6px
    +tablet
      height: 56px
      width: 56px
      margin-right: -10px
    &:hover,
    &:focus,
    &:active
      .profileMenu
        visibility: visible
        opacity: 1

  .profileMenu
    position: absolute
    // display: none
    float: left
    top: 100%
    right: 0
    width: 180px
    margin-right: 1px
    margin-top: 10px
    padding: 10px 0 15px
    // background-color: rgba(47, 47, 47, .98)
    background-color: $black
    border-radius: 6px
    // border-top-left-radius: 0
    // border-top-right-radius: 0
    box-shadow: 1px 1px 1px rgba($black, 0.3)
    background-clip: padding-box
    z-index: 999
    font-size: 13px
    font-weight: 400
    visibility: hidden
    opacity: 0
    transition: all $speed $easing
    +tablet
      margin-right: 6px
    &::before
      content: " "
      position: absolute
      width: 45px
      height: 10px
      top: 0
      right: 0
      margin-top: -10px
      background-color: transparent
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

  .profileLink
    display: flex
    // flex-flow: row wrap
    justify-content: center
    align-items: center
    height: 32px
    width: 32px
    border-radius: 50%
    border: 1px solid rgba($black, 0.66)
    background-color: rgba($primary, 1)
    +tablet
      height: 36px
      width: 36px
    .avatar
      height: 20px
      width: 20px
      position: relative
      border-radius: 50%
      overflow: hidden
      white-space: nowrap
      text-overflow: ellipsis
      color: $white
      fill: $white
      &__svgIcon
        fill: $black

  .checkbox
    position: relative
    &__input[type=checkbox]
      position: absolute
      z-index: 1
      top: 0
      left: 0
      margin-left: 15px
      margin-top: 8px
    &__label
      display: block
      position: relative
      cursor: pointer
      padding: 5px 15px 5px 32px
      color: #aaa
</style>


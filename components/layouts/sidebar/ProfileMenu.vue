<template>
  <div :class="[$style.sidebar, {[$style.isActive]: isActive}, {[$style.notInCustomerPages]: !pageMode.profileMode}, {[$style.isInCustomerPages]: pageMode.profileMode}]">
    <!-- <h3 :class="$style.sidebarTitle">
      <i18nLink :class="$style.sidebarTitleLink" to="/">{{ i18nText.backShop }}</i18nLink>
    </h3> -->
    <div :class="$style.nav">
      <ul v-if="isCustomerMode" :class="$style.navList">
        <li :class="$style.navItem"><i18n-link :class="$style.navLink" :to="'/customer/profile'" >{{ i18nText.yourProfile }}</i18n-link></li>
        <li :class="$style.navItem"><i18n-link :class="$style.navLink" :to="'/customer/orders'" >{{ i18nText.yourOrders }}</i18n-link></li>
        <li :class="$style.navItem"><i18n-link :class="$style.navLink" :to="'/customer/delivery-addresses'" >{{ i18nText.yourAddress }}</i18n-link></li>
        <!-- <li :class="$style.navItem"><i18n-link :class="$style.navLink" :to="'/customer/support-tickets'" >{{ $t('user_info.support_tickets') }}</i18n-link></li> -->
        <li :class="$style.navItem"><a :class="$style.navLink" rel="nofollow" href="#" @click.prevent="toggleOverlay(overlays.aside1) + logoutUser()">{{ i18nText.signOut }}</a></li>
      </ul>
      <ul v-if="isAgentMode" :class="$style.navList">
        <li :class="$style.navItem"><i18n-link :class="$style.navLink" :to="'/agent/profile'" >{{ i18nText.yourProfile }}</i18n-link></li>
        <li :class="$style.navItem"><i18n-link :class="$style.navLink" :to="'/agent/orders'" >{{ i18nText.yourOrders  }}</i18n-link></li>
        <li :class="$style.navItem"><i18n-link :class="$style.navLink" :to="'/agent/commission'" >{{ i18nText.yourCommission }}</i18n-link></li>
        <li :class="$style.navItem"><i18n-link :class="$style.navLink" :to="'/agent/ready-for-pickup-orders'" >{{ i18nText.readyForPickupOrders }}</i18n-link></li>
        <li :class="$style.navItem"><i18n-link :class="$style.navLink" :to="'/agent/support-tickets'" >{{ $t('user_info.support_tickets') }}</i18n-link></li>
        <li :class="$style.navItem">
          <div :class="$style.checkbox">
            <input :class="$style.checkboxInput" type="checkbox" id="showOrHideProductCommision" @change="toggle" v-model="toggleCommissionChecked">
            <label :class="$style.checkboxLabel" for="showOrHideProductCommision">{{ i18nText.commissionLabel }}<small>({{ $t(commisionAction) }})</small></label>
          </div>
        </li>
        <!-- <li :class="$style.navItem"><i18n-link :class="$style.navLink" :to="'/agent/support-requests'" >{{ $t('user_info.support_requests') }}</i18n-link></li> -->
        <li :class="$style.navItem"><a :class="$style.navLink" rel="nofollow" href="#" @click.prevent="toggleOverlay(overlays.aside1) + logoutUser()">{{ i18nText.signOut }}</a></li>
      </ul>
    </div>
  </div>
</template>

<script>
  import i18nLink from '~/components/i18nLink'
  import i18nKeys from '~/components/layouts/sidebar/ProfileMenu.i18n.yaml'

  import {
    LOGOUT_CUSTOMER,
    LOGOUT_AGENT,
    SIDE_BAR_MENU_PROFILE,
    SET_SIDE_BAR_MENU,
    SIDE_BAR_MENU_CATALOG,
    TOGGLE_COMMISSION,
    SET_OVERLAY_CONTEXT,
    SYNC_COMMISSION_SHOW,
    AGENT_PROFILE_ACCESS_TIMEOUT,
    UPDATE_AGENT_PROFILE_ACCESS_TIMESTAMP
  } from '~/store/constants.yaml'

  import {
    i18nMixin,
    i18nRedirect,
    overlayMixin
  } from '~/utils'
  import { mapState, mapGetters } from 'vuex'

  export default {
    mixins: [i18nMixin(i18nKeys), overlayMixin],
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
        'ui'
      ]),
      ...mapGetters([
        'isCustomerMode',
        'isAgentMode'
      ]),
      isStaticMode () {
        return (this.$route.name === 'docs-page_name' || this.$route.name === 'lang-docs-page_name')
      },
      isActive () {
        if (this.isStaticMode) return this.isStaticMode
        return this.ui.activeSideBarMenu === SIDE_BAR_MENU_PROFILE
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
    components: {
      i18nLink
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
      showCatalogMenu () {
        this.$store.commit(SET_SIDE_BAR_MENU, SIDE_BAR_MENU_CATALOG)
      },
      logoutUser () {
        let actionName
        if (this.isCustomerMode) actionName = LOGOUT_CUSTOMER
        else if (this.isAgentMode) actionName = LOGOUT_AGENT
        this.$store.dispatch(actionName).then(() => {
          this.showCatalogMenu()
          if (this.isAgentMode) {
            this.$router.go({
              path: this.$router.path,
              query: {
                ts: Date.now()
              }
            })
          } else {
            i18nRedirect(this.$ctx, '/', false)
          }
        })
      }
    }
  }
</script>

<style lang="sass" module>
  .Sidebar
    position: relative
    display: none
    margin-top: 30px
    &__title
      display: none
      // +phablet
        display: block
        font-size: 16px
      &__link
        padding: 15px
        min-height: 54px
        text-decoration: none
        color: $text
        fill: $text
        flex: 1 100%
        margin: 0
        display: flex
        align-items: center
        flex-flow: row wrap
        &:hover
          background-color: rgba($black, .02)
  .isActive
    display: block
    // // +phablet
    //   display: none
    // &::before
    //   content: ""
    //   position: absolute
    //   top: 0
    //   right: 0
    //   width: 50%
    //   border-top: 1px solid $white
    //   z-index: 2

  // .notInCustomerPages
  //   // border: 1px solid pink
  //    display: none
  //   // // +phablet
  //   //   display: none

  // .isInCustomerPages
  //   // border: 1px solid orange
  //   display: block
  //   // // +phablet
  //   //   display: block

  .Nav
    position: relative
    display: block
    border-bottom: 1px solid $white
    z-index: 1
    // // +phablet
      // display: none
    &__list
      padding: 0
      margin: 0
      border: 0
      list-style: none
    &__item
      position: relative
      // display: flex
      // flex-flow: row wrap
      &:not(:first-child)
        border-top: 1px solid #ebebeb
    &__link
      +button
      min-height: 62px
      color: inherit
      fill: inherit
      font-size: 16px
      text-decoration: none
      // padding: 11px 15px
      // font-weight: 400
      flex: 1
      display: flex
      align-items: center
      color: $black
      &:hover
        color: $primary


  .checkbox
    position: relative
    &__input[type=checkbox]
      position: absolute
      z-index: 1
      top: 0
      left: 0
      margin-left: 15px
      margin-top: 19px
    &__label
      position: relative
      cursor: pointer
      min-height: 50px
      color: inherit
      fill: inherit
      font-size: 13px
      padding: 11px 15px 11px 32px
      font-weight: 400
      flex: 1
      display: flex
      align-items: center
      small
        padding-left: 3px
</style>

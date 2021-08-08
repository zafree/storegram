<template>
  <div :class="[$style.list, {[$style.listActive]: isActive}]">
    <i18n-link :class="[$style.listBtn ,$style.btn]" :to="'/customer/profile'">
      <span>{{ i18nText.yourProfile }}</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
        <use xlink:href="/svg/icons.svg?#i-arrow"></use>
      </svg>
    </i18n-link>
    <i18n-link :class="[$style.listBtn ,$style.btn]" :to="'/customer/orders'">
      <span>{{ i18nText.yourOrders }}</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
        <use xlink:href="/svg/icons.svg?#i-arrow"></use>
      </svg>
    </i18n-link>
    <i18n-link :class="[$style.listBtn ,$style.btn]" :to="'/customer/delivery-addresses'">
      <span>{{ i18nText.yourAddress }}</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
        <use xlink:href="/svg/icons.svg?#i-arrow"></use>
      </svg>
    </i18n-link>
    <button :class="[$style.listBtn, $style.listBtnSignOut, $style.btn]" @click.prevent="toggleOverlay(overlays.aside1) + logoutUser()">{{ i18nText.signOut }}</button>
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
  @import "shared/button"
  .list
    display: none
    position: relative
    padding: $gutter*2 0
    &-btn
      justify-content: space-between
      padding-left: $gutter
      padding-right: $gutter*.625
      // background-color: $white
      font-weight: $weight-medium
      margin-bottom: $gutter*.5
      &-sign-out
        width: auto
        padding-right: $gutter
        margin-top: $gutter*2
        background-color: $white
        border: 2px solid $light
    &--active
      display: block
</style>

<template>
  <header :class="$style.header">
    <button
      :class="[$style.headerHamburger, $style.btn]"
      id="Menu"
      type="button" name="button"
      @click.stop="toggleOverlay(overlays.aside1)">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
        <use xlink:href="/svg/icons.svg?#i-menu"></use>
      </svg>
      <span :class="$style.btnLabel">Catalog</span>
    </button>
    <div :class="$style.headerLogoComponent">
      <logo></logo>
    </div>
    <button :class="[$style.headerSearch, $style.btn]" v-if="!pageMode.checkoutMode" @click.stop="toggleOverlay(overlays.aside3)">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
        <use xlink:href="/svg/icons.svg?#i-search"></use>
      </svg>
      <span :class="$style.btnLabel">Search</span>
    </button>

    <slot name="cartIcon" v-if="!isStaticMode">
      <cart-icon :class="[$style.headerCart, $style.btn]"></cart-icon>
    </slot>

    <template v-if="(isCustomerMode && !customer) || (isAgentMode && !agent)">
      <login-link :class="[$style.headerSignIn, $style.btn, $style.btnPrimary]" v-if="!pageMode.checkoutMode"></login-link>
    </template>
    <template v-if="(isCustomerMode && customer)">
      <user-info class="user"></user-info>
    </template>
  </header>
</template>

<script>
  import Search from '~/components/layouts/header/Search.vue'
  import LanguageSwitcher from '~/components/layouts/header/LanguageSwitcher.vue'
  import Location from '~/components/layouts/header/Location.vue'
  import CartIcon from '~/components/layouts/header/CartIcon.vue'
  import LoginLink from '~/components/layouts/header/LoginLink.vue'
  import UserInfo from '~/components/layouts/header/UserInfo.vue'
  import Logo from '~/components/layouts/header/Logo.vue'
  import i18nLink from '~/components/i18nLink'
  import { mapGetters, mapState } from 'vuex'
  import { overlayMixin } from '~/utils'

  export default {
    mixins: [overlayMixin],
    computed: {
      ...mapState([
        'pageMode',
        'customer',
        'agent'
      ]),
      ...mapGetters([
        'preferredDeliveryAddress',
        'isAgentMode',
        'isCustomerMode'
      ]),
      isStaticMode () {
        return (this.$route.name === 'docs-page_name' || this.$route.name === 'lang-docs-page_name')
      },
      getImage () {
        return this.isOverlayOpen(this.overlays.aside1) ? '/svg/hamburger-active.svg' : '/svg/hamburger.svg'
      }
    },
    components: {
      Search,
      LanguageSwitcher,
      Location,
      CartIcon,
      LoginLink,
      UserInfo,
      Logo,
      i18nLink
    },
    methods: {
      goBackPrevPage () {
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="sass" module>
  @import "shared/button"
  .header
    // background-color: rgba($black, 0.03)
    +container
    width: 100%
    height: 100%
    display: flex
    align-items: center
    &__hamburger
      // background-color: rgba($black, 0.1)
      position: relative
      width: 44px
      margin-right: $gutter
      color: $text
      fill: $text
      font-weight: $weight-medium
      +tablet
        width: auto
        padding-left: 12px
        padding-right: 16px
      .btn__label
        display: none
        +tablet
          display: block
    &__logo-component
      // background-color: rgba($black, 0.1)
      position: relative
      display: inline-flex
      margin-right: auto
      align-items: center
    &__search
      // background-color: rgba($black, 0.1)
      position: relative
      width: 44px
      margin-right: $gutter
      font-weight: $weight-medium
      +tablet
        width: auto
        padding-left: 12px
        padding-right: 14px
      .btn__label
        display: none
        +tablet
          display: block
    &__cart
      // background-color: rgba($black, 0.1)
      position: relative
      width: 44px
      overflow: visible
      +tablet
        margin-right: $gutter

      // border-radius: 500em
    &__signIn
      position: relative
      padding-left: 20px
      padding-right: 20px
      width: auto
      display: none
      +tablet
        display: block
</style>

<template>
  <header :class="$style.header">
    <div :class="$style.headerMenuComponent">
      <button
        :class="[$style.btn]"
        id="Menu"
        type="button" name="button"
        @click.stop="toggleOverlay(overlays.aside1)">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
          <use xlink:href="/svg/icons.svg?#i-menu"></use>
        </svg>
        <span>Menu</span>
      </button>
    </div>
    <div :class="$style.headerLogoComponent">
      <svg viewBox="0 0 40 40" height="44" width="44"></svg>
    </div>
    <div :class="$style.headerUserBlock">
      <button :class="[$style.headerSearch, $style.button]" v-if="!pageMode.checkoutMode" @click.stop="toggleOverlay(overlays.aside3)">
        <svg viewBox="0 0 32 32" width="32" height="32">
          <path d="M25.1,30l-6.9-6.9c-4.9,2.7-11.1,1-13.9-3.9S3.3,8,8.2,5.3c4.9-2.7,11.1-1,13.9,3.9
            c1.7,3.1,1.7,6.9,0,9.9l6.9,6.9L25.1,30z M13.2,5.9c-4.6,0-8.3,3.7-8.3,8.3c0,4.6,3.7,8.3,8.3,8.3s8.3-3.7,8.3-8.3l0,0
            C21.5,9.6,17.8,5.9,13.2,5.9z"/>
        </svg>
      </button>

      <slot name="cartIcon" v-if="!isStaticMode">
        <cart-icon :class="[$style.headerCart, $style.btn]"></cart-icon>
      </slot>

      <template v-if="(isCustomerMode && !customer) || (isAgentMode && !agent)">
        <login-link :class="[$style.headerSignIn, $style.btn]" v-if="!pageMode.checkoutMode"></login-link>
      </template>
      <template v-if="(isCustomerMode && customer)">
        <user-info class="user"></user-info>
      </template>
    </div>
  </header>
  <!-- <div class="wrapper">
    <div class="col">
      <button v-if="pageMode.checkoutMode"
        type="button" name="button"
        class="link back"
        @click="goBackPrevPage()">
        <svg viewBox="0 0 32 32" width="32px" height="32px">
          <path d="M28,14.5H9.7l8.4-8.4L16,4L4,16l12,12l2.1-2.1l-8.4-8.4H28V14.5z"/>
        </svg>
        <span>Back</span>
      </button>
      <template v-if="!pageMode.checkoutMode">
        <button
          id="Menu"
          type="button" name="button"
          class="link hamburger"
          @click.stop="toggleOverlay(overlays.aside1)">
          <svg viewBox="0 0 32 32" width="32px" height="32px">
            <g>
              <rect x="3" y="26" width="26" height="3"/>
              <rect x="3" y="14.5" width="26" height="3"/>
              <rect x="3" y="3" width="26" height="3"/>
            </g>
          </svg>
          <span>Categories</span>
        </button>
        <i18n-link class="link store" to="/docs/about">About</i18n-link>
      </template>
    </div>
    <div :class="['col', 'center', {'sm': pageMode.checkoutMode}]">
      <logo></logo>
    </div>
    <div :class="['col', {'isCart': pageMode.checkoutMode}]">
      <template v-if="(isCustomerMode && !customer) || (isAgentMode && !agent)">
        <login-link v-if="!pageMode.checkoutMode"></login-link>
      </template>

      <button class="link search" v-if="!pageMode.checkoutMode" @click.stop="toggleOverlay(overlays.aside3)">
        <svg viewBox="0 0 32 32" width="32px" height="32px">
          <path d="M25.1,30l-6.9-6.9c-4.9,2.7-11.1,1-13.9-3.9S3.3,8,8.2,5.3c4.9-2.7,11.1-1,13.9,3.9
            c1.7,3.1,1.7,6.9,0,9.9l6.9,6.9L25.1,30z M13.2,5.9c-4.6,0-8.3,3.7-8.3,8.3c0,4.6,3.7,8.3,8.3,8.3s8.3-3.7,8.3-8.3l0,0
            C21.5,9.6,17.8,5.9,13.2,5.9z"/>
        </svg>
      </button>

      <slot name="cartIcon" v-if="!isStaticMode">
        <cart-icon></cart-icon>
      </slot>

      <template v-if="(isCustomerMode && customer)">
        <user-info class="user"></user-info>
      </template>
    </div>
  </div> -->
  <!-- <div :class="[$style.appHeaderInner, {[$style.appHeaderInnerIsStaticMode]: isStaticMode}]">
    <div :class="[$style.hamburger, { [$style.hamburgerIsStaticMode]: isStaticMode }]" v-if="!pageMode.checkoutMode">
      <button
        id="Menu"
        type="button" name="button"
        :class="[$style.hamburgerButton, {[$style.isActive]: isOverlayOpen(overlays.aside1)}]"
        @click.stop="toggleOverlay(overlays.aside1)"
      >
        <img :src="getImage" alt="">
      </button>
    </div>
    <button
      id="Menu"
      type="button" name="button"
      :class="$style.hamburger"
      @click.stop="toggleOverlay(overlays.aside1)">
      <svg viewBox="0 0 32 32" width="32px" height="32px"></svg>
    </button>

    <div v-if="pageMode.checkoutMode" :class="$style.back">
      <button type="button" name="button" @click="goBackPrevPage()" :class="$style.backButton">
        <img src="/svg/back.svg" alt="">
      </button>
    </div>

    <div :class="[$style.logo, {[$style.uPaddingLeft0]: pageMode.checkoutMode}]">
      <logo></logo>
    </div>

    <ul :class="$style.nav">
      <template v-if="!pageMode.checkoutMode">
        <li :class="$style.navSearch" role="search" v-if="!isStaticMode">
          <location v-show="!isAgentMode"></location>
          <search></search>
        </li>

        <li :class="$style.navLanguageSwitcher" role="language switcher">
          <language-switcher></language-switcher>
        </li>

        <li v-if="(isCustomerMode && !customer) || (isAgentMode && !agent)" :class="$style.navSignin" role="Sign in or sign up">
          <login-link></login-link>
        </li>

        <li v-else :class="[$style.navProfile, $style.navProfileHasSub]" role="profile">
          <user-info></user-info>
        </li>
      </template>
    </ul>

    <slot name="cartIcon" v-if="!isStaticMode">
      <cart-icon></cart-icon>
    </slot>

  </div> -->
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
    background-color: rgba($black, 0.1)
    height: 100%
    display: flex
    align-items: center
    &__menu-component
      position: relative
      height: 44px
      margin-right: 5px
      background-color: rgba($black, 0.3)
      color: $white
      fill: $white
      .btn
        height: 100%
        background-color: transparent

    &__logo-component
      position: relative
      height: 44px
      margin-right: 5px
      background-color: rgba($black, 0.3)
    &__user-block
      position: relative
      background-color: rgba($black, 0.3)
      display: flex
    &__search
      position: relative
      height: 44px
      margin-right: 5px
      background-color: rgba($black, 0.3)
    &__cart
      position: relative
      width: 44px
      height: 44px
      margin-right: 5px
      background-color: rgba($black, 0.1)
    &__signIn
      position: relative
      height: 44px
      background-color: rgba($white, 1)
      color: $primary
      font-size: 14px



</style>

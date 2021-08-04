<template>
  <div :class="$style.root">
    <div :class="$style.rootKernel" :style="kernelStyles">
      <div :class="$style.app">
        <!-- header -->
        <header :class="$style.appHeader">
          <div class="wrapper">
            <div class="col logo">
              <logo></logo>
            </div>
            <div class="col login">
              <!-- <button class="link ">Sign In</button> -->
              <template v-if="(isCustomerMode && !customer)">
                <login-link></login-link>
              </template>
              <template v-else>
                <user-info></user-info>
              </template>

            </div>
            <!-- <div class="col nav">
              <div class="nav__wrapper">
                <i18n-link class="link" to="/docs/about">About</i18n-link>
                <i18n-link class="link active--" to="/docs/store-finder">Store Finder</i18n-link>
                <i18n-link class="link" to="/docs/franchise">Franchise</i18n-link>
              </div>
            </div> -->
          </div>
        </header>

        <main :class="$style.appStatic">
          <div :class="[{'u-goAway': isNavigating}]"><nuxt></nuxt></div>
          <loading-animation :class="[{'u-goAway': !isNavigating}]"></loading-animation>
        </main>

        <!-- Login -->
        <slot name="login" v-if="!pageMode.checkoutMode">
          <transition name="fade">
            <login v-if="isOverlayOpen(overlays.loginModal)"></login>
          </transition>
        </slot>

        <!-- Footer -->
        <footer :class="$style.appFooter" v-if="!pageMode.checkoutMode">
          <site-footer></site-footer>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>

  import Logo from '~/components/layouts/header/Logo.vue'
  import LoginLink from '~/components/layouts/header/LoginLink.vue'
  import UserInfo from '~/components/layouts/header/UserInfo.vue'

  import SiteHeader from '~/components/layouts/SiteHeader'
  import Sidebar from '~/components/layouts/Sidebar'
  import Login from '~/components/modals/Login'
  import SiteFooter from '~/components/layouts/SiteFooter'
  import i18nLink from '~/components/i18nLink'
  import LoadingAnimation from '~/components/LoadingAnimation'

  import { mapState, mapGetters } from 'vuex'
  import { mixin as onClickOutside } from 'vue-on-click-outside'
  import { overlayMixin } from '~/utils'

  export default {
    mixins: [onClickOutside, overlayMixin],
    computed: {
      isNavigating () {
        return this.$store.state.navigatingRoutePath !== null
      },
      kernelStyles () {
        return this.kernelTop ? {top: `-${this.kernelTop}px`} : null
      },
      ...mapState([
        'isAppMounted',
        'pageMode',
        'customer'
      ]),
      ...mapGetters([
        'isCustomerMode',
        'isAgentMode',
        'isPlatformRBP'
      ])
    },
    data () {
      return {
        kernelTop: null
      }
    },
    components: {
      Logo,
      LoginLink,
      UserInfo,
      LoadingAnimation,
      SiteHeader,
      Sidebar,
      Login,
      SiteFooter,
      i18nLink
    }
  }

</script>

<style lang="sass">
  @import "sass/static/static"
</style>

<style lang="sass" scoped>
  .wrapper
    +container
    display: flex
    flex-flow: row wrap
    justify-content: space-between
    align-items: flex-end

  .col
    display: flex
    flex-flow: row wrap
    align-items: center

  .logo
    width: 72px
    height: 45px
    // background-color: rgba(green, 0.2)
    +phablet
      order: 1
    +tablet
      width: 144px
      height: 90px


  .login
    height: 44px
    // background-color: rgba(blue, 0.2)
    +phablet
      order: 3
    +tablet
      height: 56px
      margin-bottom: 20px
    .link
      height: 32px
      padding: 0 20px
      border: 1px solid rgba($primary, 0.5)
      background-color: rgba($primary, 0.03)
      font-size: 12px
      border-radius: 40px
      +tablet
        height: 36px
        font-size: 14px
        padding: 0 30px
        margin-bottom: 0

  .nav
    height: 44px
    width: 100%
    margin-top: 10px
    // background-color: rgba(pink, 0.2)
    +phablet
      order: 2
      flex: 1
      padding-left: 30px
      margin-top: 0
    +tablet
      height: 56px
      padding-left: 60px
      margin-bottom: 20px
    &__wrapper
      margin-left: -12px
      margin-right: -12px
      +tablet
        margin-left: -20px
        margin-right: -20px
    .link
      margin-left: 12px
      margin-right: 12px
      +tablet
        margin-left: 20px
        margin-right: 20px

  .link
    +button
    display: inline-flex
    align-items: center
    justify-content: center
    height: 44px
    // background-color: rgba($primary, 0.1)
    font-size: 14px
    color: $black
    fill: $black
    // font-family: $family-display
    +tablet
      height: 56px
      font-size: 1.6em
    &.active
      &::before
        content: ""
        position: absolute
        bottom: 5px
        left: 0
        width: 100%
        height: 1px
        background-color: $primary
      &::after
        content: ""
        position: absolute
        bottom: 0
        left: 50%
        width: 0px
        height: 0px
        border-left: 6px solid transparent
        border-right: 6px solid transparent
        border-top: 5px solid $primary
        transform: translateX(-50%)
</style>

<style lang="sass" module>
  .Root
    position: relative
    &__kernel
      position: relative
      display: block

  .App
    position: relative
    +clearfix

    $root: &;

    &__header
      position: relative
      padding-top: 20px
      padding-bottom: 30px
      +tablet
        padding-top: 30px
        padding-bottom: 40px

    &__static
      position: relative

</style>

<template>
  <div :class="$style.wrapper">
    <logo class="logosm"></logo>
    <div class="quicklink">
      <i18n-link to="/docs/about">About</i18n-link>
      <!-- <i18n-link to="/docs/franchise">Franchise</i18n-link> -->
    </div>
    <sidebar-mobile-nav></sidebar-mobile-nav>
    <sidebar-catalog-menu v-if="!isStaticMode"></sidebar-catalog-menu>
    <sidebar-profile-menu v-if="customer || agent"></sidebar-profile-menu>
  </div>
</template>

<script>
import SidebarMobileNav from '~/components/layouts/sidebar/MobileNav.vue'
import SidebarCatalogMenu from '~/components/layouts/sidebar/CatalogMenu.vue'
import SidebarProfileMenu from '~/components/layouts/sidebar/ProfileMenu.vue'
import Logo from '~/components/layouts/header/Logo.vue'
import i18nLink from '~/components/i18nLink'
import { mapState } from 'vuex'

export default {
  components: {
    SidebarMobileNav,
    SidebarCatalogMenu,
    SidebarProfileMenu,
    Logo,
    i18nLink
  },
  computed: {
    ...mapState([
      'customer',
      'agent'
    ]),
    isStaticMode () {
      return (this.$route.name === 'docs-page_name' || this.$route.name === 'lang-docs-page_name')
    }
  }
}
</script>

<style lang="sass" module>
  .wrapper
    margin-top: 40px
    padding-left: 40px
    padding-right: 40px
</style>

<style lang="sass" scoped>
  .logosm
    display: inline-flex
    fill: $primary
    margin-bottom: 50px
    margin-top: 8px
    width: 80px
    height: 50px

  .quicklink
    display: flex
    flex-flow: row wrap
    position: absolute
    top: 0
    left: 0
    margin-top: 55px
    margin-left: 20px + 60 + 20 + 30
    +desktop
      display: none
    a
      display: inline-flex
      height: 44px
      align-items: center
      // background-color: rgba(red, 0.1)
      margin-left: 20px
      font-size: 14px
      color: $black
      text-decoration: none
</style>

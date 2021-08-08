<template>
  <div :class="$style.padder">
    <!-- <logo></logo> -->
    <sidebar-mobile-nav></sidebar-mobile-nav>
    <sidebar-catalog-menu></sidebar-catalog-menu>
    <sidebar-profile-menu></sidebar-profile-menu>
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
  .padder
    position: relative
    padding: $gutter $gutter*2 $gutter*2
    // border: 1px solid $light
</style>

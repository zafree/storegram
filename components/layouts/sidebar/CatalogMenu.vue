<template>
  <div :class="[$style.category, {[$style.categoryActive]: isActive}]">
    <category-menu></category-menu>
    <side-bar-categories></side-bar-categories>
  </div>
  <!-- <div :class="[$style.sidebar, {[$style.isActive]: isActive}, {[$style.isInCustomerPages]: pageMode.profileMode}]">
    <p>Category menu</p>
    <div :class="$style.sidebarTitle">
      <i18nLink :class="$style.sidebarTitleLink" to="/">{{ $t('catalog.all_categories') }} hello</i18nLink>
    </div>
    <category-menu></category-menu>
    <side-bar-categories></side-bar-categories>
  </div> -->
</template>

<script>
  import CategoryMenu from '~/components/layouts/CategoryMenu'
  import SideBarCategories from '~/components/layouts/SideBarCategories'
  import i18nLink from '~/components/i18nLink'
  import { mapState } from 'vuex'

  import {
    SIDE_BAR_MENU_CATALOG
  } from '~/store/constants.yaml'

  export default {
    computed: {
      ...mapState([
        'pageMode',
        'ui'
      ]),
      isStaticMode () {
        return (this.$route.name === 'docs-page_name' || this.$route.name === 'lang-docs-page_name')
      },
      isActive () {
        // console.log(this)
        if (this.isStaticMode) return !this.isStaticMode
        return this.ui.activeSideBarMenu === SIDE_BAR_MENU_CATALOG
      }
    },
    components: {
      CategoryMenu,
      i18nLink,
      SideBarCategories
    }
  }
</script>

<style lang="sass" module>
  .category
    display: none
    position: relative
    padding: $gutter*2 0
    &--active
      display: block
</style>

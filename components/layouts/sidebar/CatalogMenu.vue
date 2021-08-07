<template>
  <div :class="['wrapper', {'isActive': isActive}]">
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

<style lang="sass" scoped>
  .wrapper
    position: relative
    margin-top: 30px
    padding-bottom: 120px
    display: none
    &.isActive
      display: block

</style>

<style lang="sass" module>
  // .Sidebar
  //   position: relative
  //   display: none
  //   &__title
  //     font-size: 13px
  //     font-weight: $weight-medium
  //     // +phablet
  //       font-size: 16px
  //     &__link
  //       padding: 15px
  //       min-height: 54px
  //       text-decoration: none
  //       color: $text
  //       fill: $text
  //       flex: 1 100%
  //       margin: 0
  //       display: flex
  //       align-items: center
  //       flex-flow: row wrap
  //       &:hover
  //         background-color: rgba($black, .02)

  //   // hidden on phablet, laptop, desktop and widescreen

  // .isActive
  //   display: block

  // .isInCustomerPages
  //   // border: 1px solid blue
  //   // +phablet
  //     display: none
</style>

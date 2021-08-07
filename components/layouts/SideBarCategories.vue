<template>
  <ul :class="$style.menuList">
    <!-- <p>Menu list 2</p> -->
    <li :class="$style.menuItem" v-for="route in linkRoutes" :key="route.id">
      <i18n-link :class="$style.menuLink" :to="route.path">{{route.text}}</i18n-link>
    </li>
  </ul>
</template>
<script>
  import {
      CONTAINER_SIDE_BAR
  } from '~/store/constants.yaml'

  import i18nLink from '~/components/i18nLink'

  import { mapState } from 'vuex'

  export default {
    computed: {
      ...mapState([
        'currentCategory'
      ]),
      specialCategories () {
        return this.$store.getters.specialCategories(CONTAINER_SIDE_BAR)
      },
      linkRoutes () {
        const vm = this
        let routes = []
        vm.specialCategories.forEach((c) => {
          routes.push({
            text: vm.__(c.name),
            path: '/special/' + c.slug + (this.currentCategory ? '/' + this.currentCategory.slug : ''),
            id: 'side-bar-category-' + c.id
          })
        })
        return routes
      }
    },
    components: {
      i18nLink
    }
  }
</script>

<style lang="sass" module>
  .Menu
    &__list
      padding: 0
      margin: 0
    &__item
      list-style: none
      position: relative
    &__link
      display: flex
      width: 100%
      flex-flow: row nowrap
      align-items: center
      position: relative
      text-align: center
      text-decoration: none
      color: $black
      line-height: 1.5
      min-height: 50px
      padding: 11px 15px
      font-size: 13px
      border-top: 1px solid #ebebeb
</style>

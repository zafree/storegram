<template>
  <ul :class="$style.list">
    <li :class="$style.item" v-for="route in linkRoutes" :key="route.id">
      <i18n-link :class="[$style.itemLink, $style.btn]" :to="route.path">
        <span>{{route.text}}</span>
      </i18n-link>
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
  @import "shared/button"
  @import "shared/sidebar-category-list"
  .item-link
    background-color: $white
</style>

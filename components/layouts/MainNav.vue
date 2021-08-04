<template>
  <ul class="main-nav">
    <li v-for="route in linkRoutes" :key="route.id"><i18n-link :to="route.path">{{route.text}}</i18n-link></li>
  </ul>
</template>
<script>
import {
    CONTAINER_MAIN_NAV
} from '~/store/constants.yaml'

import i18nLink from '~/components/i18nLink'
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'currentCategory'
    ]),
    specialCategories () {
      return this.$store.getters.specialCategories(CONTAINER_MAIN_NAV)
    },
    linkRoutes () {
      const vm = this
      let routes = [
        {
          text: vm.$t('catalog.all_categories'),
          path: '/',
          id: 'main-nav-category-root'
        }
      ]
      vm.specialCategories.forEach((c) => {
        routes.push({
          text: vm.__(c.name),
          path: '/special/' + c.slug + (this.currentCategory ? '/' + this.currentCategory.slug : ''),
          id: 'main-nav-category-' + c.id
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
<style>
.main-nav li {
  margin-right: 20px;
}
</style>

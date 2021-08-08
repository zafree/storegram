<template>
    <ul itemprop="main-list" :class="$style.list" v-if="ensuredDisplayInItems.length > 0">
      <category-list-item v-for="item in ensuredDisplayInItems" :key="item.id" :item="item"></category-list-item>
    </ul>
    <!-- <ul itemprop="main-list" v-if="ensuredDisplayInItems.length > 0" :class="$style.menuList">
      <category-list-item v-for="item in ensuredDisplayInItems" :key="item.id" :item="item"></category-list-item>
    </ul> -->
</template>

<script>
  import { CONTAINER_CATEGORY_MENU } from '~/store/constants.yaml'
  import CategoryListItem from '~/components/layouts/category-menu/CategoryListItem'

  export default {
    props: ['items'],
    components: {
      CategoryListItem
    },
    computed: {
      ensuredDisplayInItems (category) {
        return this.items.filter(category => {
          return category && Array.isArray(category.display_in) &&
            (category.display_in.includes(CONTAINER_CATEGORY_MENU))
        })
      }
    }
  }
</script>

<style lang="sass" module>
  @import "shared/sidebar-category-list"
</style>

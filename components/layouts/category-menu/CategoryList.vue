<template>
    <ul v-if="ensuredDisplayInItems.length > 0" :class="$style.menuList">
      <category-list-item v-for="item in ensuredDisplayInItems" :key="item.id" :item="item"></category-list-item>
    </ul>
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
  .Menu-list
    padding: 0
    margin: 0
    // border: 1px solid red
    // border-bottom: 1px solid #e5e5e5
    .Menu-list
      // border: 1px solid green
      padding-left: 20px
      padding-bottom: 20px
      // border-bottom: none
</style>

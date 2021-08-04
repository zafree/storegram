<template>
  <category-list :items="topCategories"></category-list>
</template>

<script>
import CategoryList from '~/components/layouts/category-menu/CategoryList.vue'
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState([
      'allCategories'
    ]),
    topCategories () {
      return this.$store.getters.ensureChildrensAttributes(this.allCategories)
    }
  },
  components: {
    CategoryList
  }
}
</script>

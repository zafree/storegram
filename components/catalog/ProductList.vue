<template>
  <section :class="$style.section">
    <div :class="$style.sectionList">
      <template v-if="hasAnyProducts">
        <product-card-thumbnail
          v-for="product in categoryProducts"
          :key="'product-list-product-' + product.slug + product.variant_slug"
          :product="product"
          :potraitMode="category ? !!category.is_portrait_enable : null"
          :cashbackindex="currentCashbackIndex">
        </product-card-thumbnail>
      </template>
      <template v-else>
        <empty-list i18n-key="no_product.in_category"></empty-list>
      </template>
    </div>
  </section>
</template>

<script>
  import ProductCardThumbnail from '~/components/catalog/ProductCardThumbnail'
  import EmptyList from '~/components/EmptyList'

  import {
    ga
  } from '~/utils/ga'

  import {
    cashbackInterval
  } from '~/utils/cashback-interval'

  export default {
    mixins: [cashbackInterval, ga],
    props: ['category', 'products'],
    data () {
      return {
        categoryProducts: this.products
      }
    },
    computed: {
      hasAnyProducts () {
        if (this.categoryProducts && this.categoryProducts.length) {
          return this.categoryProducts.length
        }
      }
    },
    components: {
      ProductCardThumbnail,
      EmptyList
    }
  }
</script>

<style lang="sass" module>
  @import "shared/button"
  @import "shared/category_summary/product_contain"
</style>


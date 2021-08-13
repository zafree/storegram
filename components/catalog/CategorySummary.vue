<template>
  <section :class="$style.section">
    <template v-if="products">
      <div v-if="showBanner" :class="[$style.banner]">
        <i18n-link :class="$style.bannerLink" :to="linkPath">
          <div :class="$style.bannerImage">
            <computed-image :src="bannerImageUrl"/>
          </div>
        </i18n-link>
      </div>
      <heading :name="name" :link-path="linkPath" :show-full-list-in-summary="showFullListInSummary"></heading>
      <div :class="$style.sectionList">
        <product-card-thumbnail
          v-for="product in products"
          :key="'pc-' + category.slug + '-' + product.slug"
          :product="product"
          :cashbackindex="currentCashbackIndex"
          :potraitMode="!!category.is_portrait_enable">
        </product-card-thumbnail>
      </div>
    </template>
    <template v-else>
      <empty-list i18n-key="no_product.in_category"></empty-list>
    </template>
  </section>
</template>

<script>

  import ProductCardThumbnail from '~/components/catalog/ProductCardThumbnail'
  import Heading from '~/components/catalog/CategorySummaryHeading'
  import i18nLink from '~/components/i18nLink'
  import EmptyList from '~/components/EmptyList'
  import ComputedImage from '~/components/ComputedImage'
  import {
    getRandomColorCssClass
  } from '~/utils'

  import {
    cashbackInterval
  } from '~/utils/cashback-interval'

  import get from 'lodash/get'

  export default {
    mixins: [cashbackInterval],
    props: ['category', 'products'],
    computed: {
      name () {
        return this.__(this.category.name)
      },
      linkPath () {
        return '/category/' + this.category.slug
      },
      description () {
        return this.__(this.category.description)
      },
      bannerImageUrl () {
        return this.category && this.category.banner_image_url
          ? this.category.banner_image_url
          : null
      },
      bannerBgColor () {
        return this.$style[getRandomColorCssClass(get(this.category, 'name.en'))]
      },
      showFullListInSummary () {
        return (this.category && this.category.full_list_in_summary)
      },
      showBanner () {
        return this.bannerImageUrl && !this.category.hide_banner_in_category_summary
      }
    },
    components: {
      ProductCardThumbnail,
      Heading,
      i18nLink,
      ComputedImage,
      EmptyList
    }
  }
</script>

<style lang="sass" module>
  @import "shared/banner"
  @import "shared/category_summary/product_contain"
</style>

<template>
  <section :class="$style.section">
    <div :class="$style.sectionRow">
      <template v-if="products && products.length">
        <div v-if="showBanner" :class="[$style.banner]">
          <i18n-link :class="$style.bannerLink" :to="linkPath">
            <div :class="$style.bannerImage">
              <computed-image :src="bannerImageUrl"/>
            </div>
          </i18n-link>
        </div>
        <heading :name="name" :link-path="linkPath" :show-full-list-in-summary="showFullListInSummary"></heading>
        <div :class="$style.contain">
          <div :class="$style.row">
            <product-card-thumbnail
              v-for="product in products"
              :key="category.slug + '-' + product.slug"
              :product="product"
              :potraitMode="!!category.is_portrait_enable"
              :cashbackindex="currentCashbackIndex"
            ></product-card-thumbnail>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script>

  import ProductCardThumbnail from '~/components/catalog/ProductCardThumbnail'
  import Heading from '~/components/catalog/CategorySummaryHeading'
  import i18nLink from '~/components/i18nLink'
  import ComputedImage from '~/components/ComputedImage'
  import { mapState } from 'vuex'

  import {
    cashbackInterval
  } from '~/utils/cashback-interval'

  export default {
    mixins: [cashbackInterval],
    props: ['category', 'products'],
    computed: {
      ...mapState([
        'currentCategory'
      ]),
      name () {
        return this.__(this.category.name)
      },
      linkPath () {
        return '/special/' + this.category.slug + (this.currentCategory ? '/' + this.currentCategory.slug : '')
      },
      description () {
        return this.__(this.category.description)
      },
      showFullListInSummary () {
        return (this.category && this.category.full_list_in_summary)
      },
      bannerImageUrl () {
        return this.category && this.category.banner_image_url
          ? this.category.banner_image_url
          : null
      },
      showBanner () {
        return this.bannerImageUrl && !this.category.hide_banner_in_category_summary
      }
    },
    components: {
      Heading,
      ComputedImage,
      ProductCardThumbnail,
      i18nLink
    }
  }
</script>

<style lang="sass" module>
  @import "shared/banner"
  @import "shared/category_summary/product_contain"
</style>

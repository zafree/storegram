<template>
  <div v-if="specialCategory">
    <div :class="$style.breadcrumb">
      <div :class="$style.breadcrumbContainer">
        <div :class="$style.breadcrumbTitle">{{ heading }}</div>
        <breadcrumb></breadcrumb>
      </div>
    </div>

    <div :class="$style.categoryBanner">
      <div :class="$style.categoryBannerContainer">
        <div :class="$style.categoryBannerRow">
          <template>
            <div :class="$style.banner" v-if="currentCategory && currentCategoryBannerImg">
              <div :class="$style.bannerImage">
                <img :src="currentCategoryBannerImg" alt="banner image">
              </div>
            </div>

            <div :class="$style.banner" v-if="!currentCategory && specialCategoryBannerImg">
              <div :class="$style.bannerImage">
                <img :src="specialCategoryBannerImg" alt="banner image">
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <product-list v-if="categoryProducts[specialCategory.id]" :products="categoryProducts[specialCategory.id]" :category="specialCategory"></product-list>

    <!--product loading message -->
    <loading-animation v-if="loadingProduct"></loading-animation>
  </div>
</template>

<script>
  import LoadingAnimation from '~/components/LoadingAnimation'

  import ProductList from '~/components/catalog/ProductList'
  import Breadcrumb from '~/components/catalog/Breadcrumb'

  import { mapState } from 'vuex'

  import { metaMixin, removeHtmlTags } from '~/utils/meta'
  import loadCategoriesByChunk from '~/utils/load_category_products_chunk'

  export default {
    mixins: [metaMixin],
    asyncData ({ store, params }) {
      const currentCategory = store.state.currentCategory
      const specialCategory = store.getters.categoryBySlug(params.slug)
      if (process.server && store.getters.isCustomerMode) {
        return loadCategoriesByChunk(currentCategory, specialCategory, null, store.getters.agentToken)
          .then((result) => {
            const categoryProducts = result
            return {
              specialCategory,
              categoryProducts,
              dataLoadedInSSR: true
            }
          })
      }
      return {
        specialCategory,
        dataLoadedInSSR: false,
        loadingProduct: false
      }
    },
    data () {
      return {
        categoryProducts: {},
        cancellApiCalls: false,
        loadingProduct: false
      }
    },
    mounted () {
      if (!this.dataLoadedInSSR) {
        loadCategoriesByChunk(this.currentCategory, this.specialCategory, null, this.$store.getters.agentToken, this)
          .finally(() => {
            this.loadingProduct = false
          })
      }
    },
    beforeDestroy () {
      this.cancellApiCalls = true
    },
    computed: {
      ...mapState([
        'currentCategory'
      ]),
      products () {
        return this.categoryProducts[this.specialCategory.id] || []
      },
      heading () {
        let heading = this.__(this.specialCategory.name)
        if (this.currentCategory) {
          heading += ' (' + this.__(this.currentCategory.name) + ')'
        }
        return heading
      },
      currentCategoryBannerImg () {
        return this.currentCategory && this.currentCategory.banner_image_url ? this.currentCategory.banner_image_url : ('/svg/default-category-banner.svg')
      },
      specialCategoryBannerImg () {
        return this.specialCategory && this.specialCategory.banner_image_url ? this.specialCategory.banner_image_url : null
      },
      pageMetas () {
        if (!this.specialCategory) return

        let specialCategory = this.specialCategory
        let pageMetas = {}

        if (specialCategory && specialCategory.description && (specialCategory.description.en || specialCategory.description.bn)) {
          pageMetas.description = pageMetas.ogDescription = removeHtmlTags(this.__(specialCategory.description))
        }

        specialCategory.name ? pageMetas.ogTitle = this.__(specialCategory.name) : null
        this.specialCategoryBannerImg ? pageMetas.ogImage = this.specialCategoryBannerImg : null
        specialCategory.slug ? pageMetas.ogUrl = process.env.BASE_URL + this.$route.path : null

        return pageMetas
      }
    },
    components: {
      ProductList,
      Breadcrumb,
      LoadingAnimation
    }
  }
</script>

<style lang="sass" module>
  @import "shared/breadcrumb"
  @import "shared/banner"
</style>

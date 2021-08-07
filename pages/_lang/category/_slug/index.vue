<template>
  <div :class="$style.wrapper">

    <home-page-top-block v-if="!currentCategory"></home-page-top-block>

    <featured-slider
      v-if="showFeaturedCategories"
      :featuredList="featuredCategoriesForSlider"
      :defaultImageSvg="'/svg/default-category-banner.svg'"
      :imageWrapperModifier="'Square'"></featured-slider>
    <featured-slider
      v-if="showBrands"
      :featuredList="brands"
      :defaultImageSvg="'/svg/default-brand-logo.svg'"
      :imageWrapperModifier="'Circle'"></featured-slider>

    <header v-if="currentCategory" :class="$style.breadcrumb">
      <div :class="$style.breadcrumbTitle">{{ __(currentCategory.name) }}</div>
      <breadcrumb></breadcrumb>
    </header>

    <!--Banner image for current category-->
    <div :class="$style.categoryBanner" v-if="currentCategory">
      <div :class="$style.categoryBannerContainer">
        <div :class="$style.categoryBannerRow">
          <template>
            <div :class="[$style.banner, {[bannerBgColor]: !currentCategory.banner_image_url}]">
              <div :class="$style.bannerImage">
                <computed-image :src="bannerImageUrl"/>
              </div>
              <div :class="$style.bannerImageText" v-if="!currentCategory.banner_image_url">
                {{ __(currentCategory.name) }}
              </div>
            </div>
          </template>
      </div>
      </div>
    </div>

    <template v-if="specialCategories && specialCategories.length">
      <special-category-summary
        v-for="category in specialCategories"
        :key="'special-category-' + category.id"
        :category="category"
        :products="categoryProducts[category.id]"
        v-if="categoryProducts[category.id] && categoryProducts[category.id].length"
      >
      </special-category-summary>
    </template>

    <template v-if="subCategories && subCategories.length">
      <category-summary
        v-for="category in subCategories"
        :key="'category-summary-' + category.id"
        :category="category"
        :products="categoryProducts[category.id]"
        v-if="categoryProducts[category.id] && categoryProducts[category.id].length"
      >
      </category-summary>
    </template>

    <template v-else-if="currentCategory && categoryProducts[currentCategory.id] && categoryProducts[currentCategory.id].length">
      <product-list :category="currentCategory" :products="categoryProducts[currentCategory.id]"></product-list>
    </template>


    <!-- Category summary view loading placeholder -->
    <loading-animation v-if="loadingProduct"></loading-animation>

    <!--product loading message -->
    <template v-if="!loadingProduct && (subCategories && subCategories.length) && noProducts">
      <empty-list i18n-key="no_product.in_category"></empty-list>
    </template>

  </div>
</template>

<script>
  import HomePageTopBlock from '~/components/blocks/HomePageTopBlock'
  import HomePageMidBlock from '~/components/blocks/HomePageMidBlock'

  import FeaturedSlider from '~/components/catalog/FeaturedSlider'
  import Breadcrumb from '~/components/catalog/Breadcrumb'
  import LoadingAnimation from '~/components/LoadingAnimation'

  import SpecialCategorySummary from '~/components/catalog/SpecialCategorySummary'
  import CategorySummary from '~/components/catalog/CategorySummary'
  import ProductList from '~/components/catalog/ProductList'
  import EmptyList from '~/components/EmptyList'
  import ComputedImage from '~/components/ComputedImage'

  import cloneDeep from 'lodash/cloneDeep'
  import isEqual from 'lodash/isEqual'
  import get from 'lodash/get'
  import find from 'lodash/find'

  import {
    CONTAINER_CATALOG,
    CONTAINER_AGENT_CATALOG,
    CONTAINER_CATEGORY_MENU
  } from '~/store/constants.yaml'

  import {
    getCategoryProducts,
    getBrands
  } from '~/api'

  import { getRandomColorCssClass, makeDefaultImageMeta } from '~/utils'
  import { metaMixin, removeHtmlTags } from '~/utils/meta'
  import loadCategoriesByChunk from '~/utils/load_category_products_chunk'
  import { mapState } from 'vuex'

  const DEFAULT_IMAGE_SVG = ('/svg/default-category-banner.svg')

  function getSpecialCategories (store) {
    const catalogName = store.getters.isAgentMode ? CONTAINER_AGENT_CATALOG : CONTAINER_CATALOG
    return store.getters.specialCategories(catalogName)
  }

  function getSubCategories (store, currentCategory) {
    const subCategories = currentCategory ? currentCategory.children : store.state.allCategories
    return store.getters.ensureChildrensAttributes(subCategories).filter(c => {
      return Array.isArray(c.display_in) && c.display_in.includes(CONTAINER_CATEGORY_MENU)
    })
  }

  export default {
    mixins: [metaMixin],
    asyncData ({ store }) {
      const currentCategoryId = store.state.currentCategory ? store.state.currentCategory.id : null
      return getBrands({show_featured: 1, category_id: currentCategoryId})
        .then(response => {
          if (!currentCategoryId) response = response.filter(x => x.is_featured)
          let brands = response
              .map(x => {
                x.link = `/brand/${x.slug}`
                x.featured_image_url = x.logo_url
                return x
              })
          if (Array.isArray(brands) && brands.length > 0) {
            brands = [{ name: { en: 'All Brands', bn: 'সকল ব্র্যান্ড' }, link: '/brand', featured_image_url: '/svg/icons/icon-all-brands.svg' }, ...brands]
          }
          return { brands }
        })
    },
    watch: {
      'specialCategories': 'reloadDataIfRequired',
      'subCategories': 'reloadDataIfRequired'
    },
    data () {
      return {
        loadedCategory: null,
        loadingProduct: true,
        categoryProducts: {},
        cancellApiCalls: false
      }
    },
    mounted () {
      this.loadedCategory = cloneDeep(this.currentCategory)
      if (!this.dataLoadedInSSR) {
        this.categoryProducts = {}
        const currentCategory = this.$store.state.currentCategory
        const specialCategories = getSpecialCategories(this.$store)
        const subCategories = getSubCategories(this.$store, currentCategory)
        loadCategoriesByChunk(currentCategory, specialCategories, subCategories, this.$store.getters.agentToken, this)
          .finally(() => {
            this.loadingProduct = false
          })
      }
    },
    beforeDestroy () {
      this.cancellApiCalls = true
    },
    computed: {
      featuredCategoriesForSlider () {
        return this.$store.getters.featuredCategories.map(category => {
          let isSpecialCategory = !!(find(this.specialCategories, { 'id': category.id }))
          category.link = isSpecialCategory ? '/special/' + category.slug : '/category/' + category.slug
          return category
        })
      },
      specialCategories () {
        return getSpecialCategories(this.$store)
      },
      subCategories () {
        return getSubCategories(this.$store, this.currentCategory)
      },
      ...mapState([
        'ui',
        'currentCategory'
      ]),
      noProducts () {
        return Object.keys(this.categoryProducts).filter((key) => !this.categoryProducts[key] || (this.categoryProducts[key].length !== 0)).length === 0
      },
      bannerBgColor () {
        return this.$style[getRandomColorCssClass(get(this.currentCategory, 'name.en'))]
      },
      pageMetas () {
        if (!this.currentCategory) return
        let currentCategory = this.currentCategory
        let pageMetas = {}
        if (currentCategory.description) {
          pageMetas.description = removeHtmlTags(this.__(currentCategory.description))
        }
        pageMetas.ogTitle = this.__(currentCategory.name)
        pageMetas.ogImage = currentCategory && currentCategory.banner_image_url ? currentCategory.banner_image_url : null
        pageMetas.ogUrl = process.env.BASE_URL + this.$route.path

        return pageMetas
      },
      bannerImageUrl () {
        return this.currentCategory && this.currentCategory.banner_image_url
          ? this.currentCategory.banner_image_url
          : makeDefaultImageMeta(DEFAULT_IMAGE_SVG, 1200).url
      },
      showFeaturedCategories () {
        return this.$store.getters.featuredCategories && this.$store.getters.featuredCategories.length
      },
      showBrands () {
        return this.brands && this.brands.length
      }
    },
    methods: {
      reloadDataIfRequired: function (newValue, oldValue) {
        if (!oldValue || isEqual(newValue, oldValue)) return
        if (!isEqual(this.loadedCategory, this.currentCategory)) return
        getCategoryProducts(this.currentCategory, this.specialCategories, this.subCategories, this.$store.getters.agentToken)
        .then((categoryProducts) => {
          this.categoryProducts = categoryProducts
        })
      }
    },
    components: {
      HomePageTopBlock,
      HomePageMidBlock,
      FeaturedSlider,
      SpecialCategorySummary,
      ComputedImage,
      Breadcrumb,
      LoadingAnimation,
      ProductList,
      CategorySummary,
      EmptyList
    }
  }
</script>

<style lang="sass" module>
  @import "shared/breadcrumb"
  @import "shared/banner"

  .wrapper
    +container
</style>


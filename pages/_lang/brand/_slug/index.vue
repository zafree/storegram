<template>
  <section :class="$style.section">
    <template>
      <div  :class="[$style.banner, {[bannerBgColor]: !brand.banner_url}]">
        <div :class="$style.bannerImage">
          <computed-image v-if="brand && brand.banner_url" :src="bannerImageInfo(brand.banner_url)" alt=""></computed-image>
        </div>
        <div :class="$style.bannerImageText" v-if="!brand.banner_url">
          {{ __(brand.name) }}
        </div>
      </div>
      <header class="Brand">
        <div class="Brand__Infos">
          <div class="Brand__image">
          <img :src="logoImageInfo(brand.logo_url)" alt="">
          </div>
          <div class="Brand__name">{{ __(brand.name) }}</div>
          <div v-if="brand.tagline" class="Brand__label">{{ __(brand.tagline) }}</div>
        </div>
        <div :class="$style.carousel">
          <div :class="$style.carouselScroll">
            <div :class="$style.carouselSliders">
              <div :class="$style.carouselCell" v-for="(category,index) in brand.categories" :key="index">
                <div :class="$style.carouselLink" href="#link" @click="selectCategory(index, category.id)">
                  <h4 :class="[$style.carouselTitle, {[$style.carouselTitleActive]: activeCategoryIndex === index}]">{{ __(category.name) }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </template>
    <product-list class="Wrapper" v-if="products.length" :products="products" :category="currentSelectedCategory"></product-list>
    <loading-animation v-if="loadingProduct"></loading-animation>
  </section>
</template>

<script>
import ProductList from '~/components/catalog/ProductList'
import LoadingAnimation from '~/components/LoadingAnimation'
import ComputedImage from '~/components/ComputedImage'
import { getBrandDetailsBySlug, getSpecialCategoryProducts } from '~/api'
import { getRandomColorCssClass, makeDefaultImageMeta } from '~/utils'

async function loadAllProductsOfCategoryByBrand (vm) {
  for (let index = 1; index < vm.brand.categories.length; index++) {
    await loadProductsOfCategoryByBrand(vm, index, false)
  }
}

async function loadProductsOfCategoryByBrand (vm, categoryIndex, resetProducts) {
  let keepLoadingBrands = true
  let from = 0
  let take = 20
  let category = vm.brand.categories[categoryIndex]
  let brandId = vm.brand.id
  vm.cancelCurrentApiCall = false
  vm.loadingProduct = true
  if (resetProducts) {
    vm.products = []
    vm.uniqProductsKey = {}
  }

  while (keepLoadingBrands && !vm.cancelCurrentApiCall) {
    const result = await getSpecialCategoryProducts(category, null, vm.$store.getters.agentToken, from, take, brandId)
    keepLoadingBrands = result[category.id].length === take
    from += take
    result[category.id].forEach(x => {
      if (x && x.id && !vm.uniqProductsKey.hasOwnProperty(x.id)) {
        vm.uniqProductsKey[x.id] = null
        vm.products.push(x)
      }
    })
  }
  vm.loadingProduct = false
}
const DEFAULT_LOGO_SVG = ('/svg/default-brand-logo.svg')
const DEFAULT_BANNER_SVG = ('/svg/default-category-banner.svg')

export default {
  asyncData ({ route }) {
    return getBrandDetailsBySlug(route.params.slug)
      .then(response => {
        let allCategories = { name: { en: 'Show all', bn: 'সব দেখুন' } }
        response.categories = [allCategories, ...response.categories]
        return {
          brand: response,
          loadingProduct: false,
          products: [],
          uniqProductsKey: {}
        }
      })
  },
  mounted () {
    loadAllProductsOfCategoryByBrand(this)
  },
  data () {
    return {
      activeCategoryIndex: 0,
      loadingProduct: true,
      cancelCurrentApiCall: false
    }
  },
  computed: {
    bannerBgColor () {
      return this.$style[getRandomColorCssClass(this.brand.slug)]
    },
    currentSelectedCategory () {
      if (this.activeCategoryIndex === 0) {
        return { is_portrait_enable: this.brand.is_portrait_enable }
      }
      return this.brand.categories[this.activeCategoryIndex]
    }
  },
  methods: {
    selectCategory (index, categoryId) {
      this.activeCategoryIndex = index
      if (this.activeCategoryIndex === 0) {
        loadAllProductsOfCategoryByBrand(this)
      } else {
        loadProductsOfCategoryByBrand(this, this.activeCategoryIndex, true)
      }
    },
    logoImageInfo (url) {
      return url || makeDefaultImageMeta(DEFAULT_LOGO_SVG, 800).url
    },
    bannerImageInfo (url) {
      return url || makeDefaultImageMeta(DEFAULT_BANNER_SVG, 800).url
    }
  },
  beforeDestroy () {
    this.cancelCurrentApiCall = true
  },
  components: {
    ProductList,
    LoadingAnimation,
    ComputedImage
  }
}
</script>

<style lang="sass" module>
  @import "shared/banner"
  @import "shared/button"
  @import "shared/carousel"
  .Section
    border: 1px solid pink
  .Carousel
    padding-top: 0
    padding-bottom: 0
    margin-bottom: 0
    box-shadow: none
    border-top: 1px solid #E5E5E5
    +phablet
      margin: 0
    &__sliders
      padding-bottom: 0
    &__cell
      &:not(:first-child)
        margin-left: 26px
    &__link
      height: 46px
      line-height: 46px
      margin-top: 0
    &__title
      margin-top: 0
      font-size: 14px
      color: #96979B
      max-width: 150px
      cursor: pointer
      &--active
        color: $purple
        &::after
          content: ""
          position: absolute
          bottom: 0
          left: 0
          right: 0
          height: 2px
          margin-left: -10px
          margin-right: -10px
          background-color: $purple
</style>

<style lang="sass" scoped>
  .Wrapper
    // border: 1px solid red
    background-color: $white
    padding-top: 0
    margin-top: 15px + 9
  .Brand
    position: relative
    &__Infos
      position: relative
      padding-left: 12px
      padding-right: 12px
      background-color: $white
      padding-top: 10px
      padding-bottom: 10px
      margin-left: -15px
      margin-right: -15px
      +clearfix
      +phablet
        margin: 0
    &__image
      width: 64px
      height: 64px
      border: 1px solid #D9D9D9
      float: left
      border-radius: 500em
      overflow: hidden
    &__name
      font-size: 18px
      line-height: 1.33
      // color: $text
      margin-left: 64px
      padding-left: 10px
      margin-top: 13px
    &__label
      font-size: 13px
      letter-spacing: -0.06em
      color: #979797
      margin-left: 64px
      padding-left: 10px
</style>

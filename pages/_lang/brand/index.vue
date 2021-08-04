<template>
  <div>
    <div>
      <div class="searchbar">
        <input type="text" :placeholder="$t('user_info.search_for_brands')" class="searchbar__input" :value="searchKey"
          @input="searchKeyUpdated" @keyup.enter="searchBrands">
        <img src="/svg/icons/icon-search.svg" alt="Search" class="searchbar__icon">
        <!-- <button class="searchbar__enter" @click="searchBrands">{{ $t('user_info.enter') }}</button> -->
        <button class="searchbar__clearButton" v-if="showRemoveButton" @click="reset">
          <img src="/svg/icons/icon-cancel.svg" alt="Cancel" class="searchbar__clearButtonInnerImage">
        </button>
      </div>
      <!-- <button class="searchbar__enter" @click="searchBrands">{{ $t('user_info.enter') }}</button> -->
      <div class="brand">
        <i18n-link class="brand__link" :to="`/brand/${brand.slug}`" v-for="(brand, index) in computedBrands" :key="index">
          <div class="brand__imageWrapper">
            <div class="brand__image">
              <img :src="featuredImageInfo(brand)" :alt="__(brand.name)" />
            </div>
          </div>
          <h4 class="brand__name">{{ __(brand.name) }}</h4>
        </i18n-link>
      </div>
      <div class="emptyState" v-if="computedBrands && computedBrands.length === 0">
        <h4 class="emptyState__title">{{ $t('user_info.no_brand_found') }}</h4>
      </div>
    </div>
    <span v-observe-visibility="visibilityChanged" height="1px" width="1px"></span>
  </div>
</template>

<script>
import i18nLink from '~/components/i18nLink'
import { getBrands } from '~/api'
import { makeDefaultImageMeta } from '~/utils'
import { ObserveVisibility } from 'vue-observe-visibility'
import debounce from 'lodash/debounce'

const DEFAULT_IMAGE_SVG = ('/svg/default-brand-logo.svg')

async function loadBrandsChunkByChunk (vm) {
  if (!vm.cancelCurrentApiCall && vm.keepLoadingBrands) {
    let chunkedBrand = await getBrands({ from: vm.from, take: 50 })
    vm.brands = [...vm.brands, ...chunkedBrand]
    if (chunkedBrand.length < 50) {
      vm.keepLoadingBrands = false
    }
    vm.from += 50
    vm.reset()
  }
  vm.reset()
}

export default {
  asyncData () {
    return getBrands({from: 0, take: 50})
      .then(response => {
        return {
          brands: response
        }
      })
  },
  directives: {
    ObserveVisibility
  },
  created () {
    this.reset()
  },
  data () {
    return {
      searchKey: null,
      showRemoveButton: false,
      computedBrands: [],
      clickedOnTheInput: false,
      cancelCurrentApiCall: false,
      enableVisibilityChanged: false,
      keepLoadingBrands: true,
      from: 50
    }
  },
  methods: {
    featuredImageInfo (item) {
      return item && item.logo_url
        ? item.logo_url
        : makeDefaultImageMeta(DEFAULT_IMAGE_SVG).url
    },
    searchKeyUpdated ($event) {
      this.showRemoveButton = false
      if ($event.target.value) {
        this.searchKey = $event.target.value
        this.searchBrands()
        this.showSearchButton = true
      } else this.reset()
    },
    reset () {
      this.searchKey = null
      this.showRemoveButton = false
      this.computedBrands = this.brands
    },
    searchBrands: debounce(function () {
      this.showSearchButton = false
      this.showRemoveButton = true
      getBrands({query: this.searchKey})
      .then(Response => {
        this.computedBrands = Response
      })
    }, 1000),
    visibilityChanged (isVisible, entry) {
      if (isVisible && !this.searchKey) {
        loadBrandsChunkByChunk(this)
      }
    }
  },
  components: {
    i18nLink
  }
}
</script>

<style lang="sass" scoped>
  @import "sass/shared/emptyState"
  .brand
    padding-top: 10px
    padding-bottom: 10px
    position: relative
    background-color: $white
    display: flex
    flex-flow: row wrap
    justify-content: center
    &::after
      content: ""
      position: fixed
      top: 0
      left: 0
      right: 0
      bottom: 0
      background-color: $white
      z-index: -1
    &__link
      display: block
      cursor: pointer
      color: $text
      text-decoration: none
      width: 64px
      margin: 10px
      +phablet
        width: 82px
        margin: 15px
    &__imageWrapper
      width: 64px
      height: 64px
      border: 1px solid #E2DFE3
      position: relative
      // padding: 3px
      border-radius: 500em
      +phablet
        width: 82px
        height: 82px
    &__image
      position: relative
      width: 100%
      height: 100%
      background-color: #E2DFE3
      border-radius: 500em
      overflow: hidden
    &__name
      font-size: 13px
      letter-spacing: -0.06em
      line-height: 1.22
      text-align: center
      color: inherit
      text-decoration: inherit
      margin-top: 5px
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      +phablet
        font-size: 14px
        margin-top: 8px
  .searchbar
    padding-top: 15px
    background-color: rgba($white, 1)
    padding-left: 55px
    padding-right: 55px
    &__input
      align-items: center
      border: 1px solid transparent
      border-radius: 500px
      box-shadow: none
      height: 44px
      padding: 7px 70px 7px 50px
      line-height: 1.5
      position: relative
      vertical-align: top
      background-color: #f0f0f0
      max-width: 90%
      width: 90%
      font-size: 14px
      font-weight: 400
      &:focus,
      &:active
        box-shadow: none
        outline: none
      +placeholder
        color: #999999
      +tablet 
        padding-left: 45px
      +desktop 
        padding-left: 55px 
      +widescreen
        padding-left: 45px 
    &__icon
      position: absolute
      top: 0
      left: 0
      width: 26px
      height: 26px
      margin-top: 25px 
      margin-left: 20px + 55
      opacity: 0.34
      cursor: pointer 
      // background-color: rgba($red, .3)
      border-radius: 50%
      +phablet 
        margin-left: 20px + 55
      +tablet
        margin-left: 20px + 45
      +desktop 
        margin-left: 20px + 65
    &__enter
      // +button
      color: #999999
      position: absolute
      top: 0
      right: 0
      height: 44px
      margin-right: 55px
      font-size: 12px
      margin-top: 15px 
      text-transform: uppercase
      border-radius: 500px
      padding-left: 16px
      padding-right: 16px
      // background-color: rgba(green, 0.2)
    &__clearButton
      // +button
      position: absolute
      top: 0
      right: 0
      width: 44px
      height: 44px
      margin-right: 105px
      opacity: 0.74
      border-radius: 500px
      border: none 
      margin-top: 15px 
      background-color: transparent
      +phablet 
        margin-right: 110px
      +tablet 
        margin-right: 125px
      +desktop 
        margin-right: 150px 
    &__clearButtonInnerImage
      width: 20px
      height: 20px
      background-color: rgba($black, .1)
      border-radius: 50px
      margin-left: auto
      margin-right: auto
</style>

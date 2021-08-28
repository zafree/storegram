<template>
  <div :class="$style.search">
    <!-- isSearchingActive -->
    <div :class="$style.searchInput">
      <input
        :value="searchInput"
        @input="searchInput = $event.target.value"
        type="text"
        :class="[$style.fieldInput, $style.searchInputInput]"
        :placeholder="searchPlaceholder"
        @keyup.enter="redirection()"
        @focus="showSearchResult = searchResult.length"
        v-on-click-outside="clickOutsideHandler"
        ref="searchInputField">
      <!-- <span v-if="showSpinner" class="multiselect__spinner Search__loading">spinner</span> -->
      <button v-if="showSearchResult" :class="[$style.btn, $style.btnAuto, $style.btnPrimary, $style.searchInputBtn]" @click="redirectToSearchListPage()">Enter</button>
    </div>
    <div :class="$style.searchList" v-if="isSearchingActive">
        <div :class="$style.copy" v-if="isSearching">
          <span>{{$t('search.searching')}}</span>
        </div>
        <div :class="$style.copy" v-if="noProductFound">
          <span>{{$t('search.no_result')}}</span>
        </div>
      <template v-if="showSearchResult">
        <div :class="[$style.item, {[$style.active]: currentItem === index}]"
            v-for="(search, index) in searchResult"
            :key="search.id"
            @mouseover="onHover(index)"
            :id="'item' + index">
          <i18n-link :to="productUrl(search)" @click.native="resetOnProductClick()" :class="$style.itemLink">

            <div :class="[$style.itemImg, $style.img]">
              <div :class="$style.imgAspectRatio">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                  <use xlink:href="/svg/icons.svg?#i-camera"></use>
                </svg>
              </div>
              <div :class="$style.imgImage">
                <computed-image :meta="search.image_info[0]"/>
              </div>
            </div>
            <div :class="$style.itemInfo">
              <h3 :class="$style.itemInfoTitle">{{ __(search.name) }}</h3>
            </div>
          </i18n-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import debounce from 'lodash/debounce'
import { mixin as onClickOutside } from 'vue-on-click-outside'
import ComputedImage from '~/components/ComputedImage'
import i18nLink from '~/components/i18nLink'

import { i18nRedirect, overlayMixin } from '~/utils'

const productRouteRE = /^(lang-)?product-/
const searchRouteRE = /^(lang-)?search-/

import {
  getSearchItems
} from '~/api'

export default {
  mixins: [onClickOutside, overlayMixin],
  data () {
    return {
      searchInput: null,
      tempSearchInput: null,
      searchResult: [],
      currentItem: -1,
      isSearching: false,
      showSpinner: false,
      noProductFound: false,
      showSearchResult: false,
      stopDebounceOnRedirection: false,
      clearSearchKeyWordUsingBackSpace: false
    }
  },
  mounted () {
    document.addEventListener('keydown', this.nextItem)
  },
  computed: {
    ...mapGetters([
      'agentToken',
      'isAgentMode'
    ]),
    isSearchingActive () {
      return (this.searchInput && this.searchResult.length) || this.isSearching || this.noProductFound
    },
    searchPlaceholder () {
      return this.$t('search.title')
    },
    isCurrentItemInSearchResult () {
      if (!this.searchResult.length || this.currentItem === -1) return
      return !!this.searchResult.find((r) => {
        return r.id === this.searchResult[this.currentItem].id
      })
    },
    stopDebounce () {
      if (!this.searchInput) {
        return true
      } else if (this.isCurrentItemInSearchResult || this.stopDebounceOnRedirection) {
        return true
      } else if (this.searchResult.length && (this.searchInput === this.tempSearchInput)) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    clickOutsideHandler () {
      this.showSearchResult = false
      this.isSearching = false
      this.noProductFound = false
    },
    resetOnProductClick () {
      this.resetSearchField()
      this.searchInput = null
      this.tempSearchInput = null
    },
    resetSearchField () {
      this.searchResult = []
      this.showSearchResult = false
      this.isSearching = false
      this.noProductFound = false
      this.stopDebounceOnRedirection = true
      this.showSpinner = false
      this.clearSearchKeyWordsUsingBackSpace = false
    },
    redirectToSearchListPage () {
      if (this.$route.params.query === this.searchInput) return
      if (!this.searchInput || this.isSearching) return
      this.resetSearchField()
      i18nRedirect(this.$ctx, `/search/${this.searchInput}`)
      this.searchInput = null
      this.$refs.searchInputField.blur()
    },
    redirection () {
      if (!this.searchInput || this.isSearching) return
      this.tempSearchInput = null
      if (this.currentItem === -1) {
        this.redirectToSearchListPage()
      } else if (this.currentItem > -1) {
        this.goToSelectedResultPage(this.searchResult[this.currentItem])
      }
      this.closeAnyOverlayIfOpen()
    },
    goToSelectedResultPage (value) {
      let clonedValue = cloneDeep(value)
      let url = clonedValue.variant_slug ? `${clonedValue.slug}/${clonedValue.variant_slug}` : `${clonedValue.slug}`
      this.resetSearchField()
      this.searchInput = null
      this.$refs.searchInputField.blur()
      return i18nRedirect(this.$ctx, `/product/${url}`)
    },
    productUrl (item) {
      let url = item.variant_slug ? `${item.slug}/${item.variant_slug}` : `${item.slug}`
      return `/product/${url}`
    },
    onHover (searchResultIndex) {
      this.currentItem = searchResultIndex
    },
    nextItem () {
      let item = document.getElementById('item' + this.currentItem)

      if (event.keyCode === 38 && this.currentItem > -1) {
        // UP ARROW
        this.currentItem--
        if (item) {
          item.scrollIntoView(false)
        }
      } else if (event.keyCode === 40 && this.currentItem < (this.searchResult.length - 1)) {
        // DOWN ARROW
        this.currentItem++
        if (item) {
          item.scrollIntoView(true)
        }
      } else if (event.keyCode === 8 && this.searchResult.length) {
        // BACK SPACE
        this.clearSearchKeyWordsUsingBackSpace = true
        this.tempSearchInput = null
      }
    },
    searchTextUpdated: debounce(function () {
      if (this.stopDebounce && !this.clearSearchKeyWordsUsingBackSpace) return
      if (!this.clearSearchKeyWordsUsingBackSpace) {
        this.currentItem = -1
      }
      this.resetSearchField()
      this.isSearching = true
      let params = { limit: 10 }
      getSearchItems(this.searchInput, params, this.agentToken)
        .then((data) => {
          this.tempSearchInput = this.searchInput
          this.searchResult = data
          this.showSearchResult = true
        })
        .catch(() => {
          this.searchResult = []
        })
        .finally(() => {
          this.isSearching = false
          this.noProductFound = !this.searchResult.length
        })
    }, 1000)
  },
  watch: {
    searchInput: {
      handler: function (newVal, oldVal) {
        if (!newVal) {
          this.resetSearchField()
        } else {
          this.stopDebounceOnRedirection = false
          this.searchTextUpdated()
          if (!this.stopDebounce || this.clearSearchKeyWordsUsingBackSpace) {
            this.showSpinner = true
          }
        }
      },
      immediate: true
    },
    '$route' (to, from) {
      if (searchRouteRE.test(to.name) || productRouteRE.test(to.name)) return
      this.searchInput = null
    },
    currentItem: function (newVal, oldVal) {
      if (newVal === -1 && this.tempSearchInput) {
        this.searchInput = this.tempSearchInput
      }
    }
  },
  components: {
    ComputedImage,
    i18nLink
  }
}
</script>

<style lang="sass" module>
  @import "shared/field"
  @import "shared/button"
  @import "shared/img"

  .copy
    font-size: 14px
    color: $text

  .search
    position: relative
    padding: $gutter $gutter 0
    &-input
      position: relative
      margin-top: -($gutter + 44)
      margin-right: 44 + $gutter/2
      display: flex
      &-input
        height: 44px
        // margin-bottom: 0
      &-btn
        margin-left: $gutter/2

    &-list
      position: relative
      padding: $gutter 0

  .item
    position: relative
    padding: $gutter/2
    border-radius: $gutter/2
    &.active
      background-color: lighten($light, 5%)
    &-link
      display: flex
      align-items: center
      text-decoration: none

    &-img
      width: 50px
    &-info
      padding-left: $gutter
      &-title
        text-decoration: none
        color: $text
        font-size: 14px
</style>

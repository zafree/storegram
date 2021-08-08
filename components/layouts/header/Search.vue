<template>
  <div class="Search">
    <div class="Search__wrapper" :class="{'isActive': isSearchingActive}">
      <input
        :value="searchInput"
        @input="searchInput = $event.target.value"
        type="text"
        class="Search__input Search__input--isactive"
        :placeholder="searchPlaceholder"
        @keyup.enter="redirection()"
        @focus="showSearchResult = searchResult.length"
        v-on-click-outside="clickOutsideHandler"
        ref="searchInputField">
      <span v-if="showSpinner" class="multiselect__spinner Search__loading"></span>
      <button v-if="showSearchResult" class="Search__enter" @click="redirectToSearchListPage()">
        <span>Enter</span>
      </button>
    </div>
    <div class="item-list" v-if="isSearchingActive">
        <div class="copy" v-if="isSearching">
          <span>{{$t('search.searching')}}</span>
        </div>
        <div class="copy primary" v-if="noProductFound">
          <span>{{$t('search.no_result')}}</span>
        </div>
      <template v-if="showSearchResult">

        <div class="item-wrapper"
            v-for="(search, index) in searchResult"
            :class='{"active": currentItem === index}'
            :key="search.id"
            @mouseover="onHover(index)"
            :id="'item' + index">
          <i18n-link :to="productUrl(search)" @click.native="resetOnProductClick()" class="item">
            <div class="item__image">
              <template v-if="search.image_info && search.image_info.length">
                <computed-image :meta="search.image_info[0]"/>
              </template>
              <template v-else>
                <img src="/clients/bronx/icons/default-image-sm.svg" alt="default image">
              </template>
            </div>
            <div class="item__content">
              <h3 class="item__title">{{ __(search.name) }}</h3>
            </div>
          </i18n-link>
        </div>

        <!-- <ul class="Search__productlist--content">
          <li
            class="list"
            v-for="(search, index) in searchResult"
            :class='{"list__products--isActive": currentItem === index}'
            :key="search.id"
            @mouseover="onHover(index)"
            :id="'item' + index">
            <i18n-link :to="productUrl(search)" @click.native="resetOnProductClick()" class="list__products">
              <div class="list__products--hero">
                <template v-if="search.image_info && search.image_info.length">
                  <computed-image :meta="search.image_info[0]"/>
                </template>
                <template v-else>
                  <img class="list__products--image" src="/clients/bronx/icons/default-image.svg" alt="default image">
                </template>
              </div>
              <span class="list__products--option">
                <span>{{ __(search.name) }}</span>
              </span>
            </i18n-link>
          </li>
        </ul> -->
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

<style lang="sass" scoped>
  // @import "sass/shared/button"
  // @import "sass/global/_vue-multiselect"

  // .Search
  //   position: relative
  //   width: 100%
  //   // overflow-x: hidden
  //   +desktop
  //     padding-right: 10px
  //     padding-left: 10px
  //   &__wrapper
  //     +container
  //     padding-top: 32px
  //     padding-bottom: 30px
  //     padding-left: 44px + 16
  //     padding-right: 30px
  //     position: fixed
  //     top: 0
  //     left: 0
  //     width: 100%
  //     z-index: 9
  //     display: flex
  //     background-color: $white
  //     +desktop
  //       position: absolute
  //       padding-top: 10px
  //       padding-bottom: 10px
  //       padding-left: 10px
  //       padding-right: 10px
  //       margin-top: -64px

  //     &.isActive
  //       border-bottom: 1px solid #ddd
  //   &__input
  //     padding-left: 30px
  //     position: relative
  //     vertical-align: top
  //     border: 1px solid $black
  //     background-color: $white
  //     border-radius: 500em
  //     box-shadow: none
  //     height: 44px
  //     padding-left: 20px
  //     padding-right: 62px
  //     color: #333
  //     fill: #333
  //     box-shadow: none
  //     max-width: 100%
  //     width: 100%
  //     font-size: 16px
  //     font-weight: 400
  //     line-height: 1.5
  //     transition: all 0.1s ease-out
  //     +desktop
  //       // height: 56px

  //     &:focus,
  //     &:active
  //       // border-color: #777
  //       border-color: $primary
  //       box-shadow: none
  //       outline: none
  //       background-color: #fff

  //     +placeholder
  //       color: #bbbbbb

  //   &__enter
  //     +button
  //     margin-top: 32px
  //     margin-right: 30px
  //     height: 44px
  //     position: absolute
  //     right: 0
  //     top: 0
  //     font-size: 10px
  //     color: $black
  //     // background-color: rgba(blue, 0.5)
  //     border-radius: 22px
  //     padding-right: 20px
  //     padding-left: 20px
  //     +desktop
  //       margin-top: 10px
  //       margin-right: 10px
  //   &__loading
  //     // background-color: rgba(green, 0.5)
  //     z-index: 10
  //     height: 36px
  //     width: 44px
  //     margin-top: 34px
  //     margin-right: 32px
  //     border-radius: 50px
  //     +desktop
  //       margin-top: 12px
  //       margin-right: 12px
  //     &::after,
  //     &::before
  //       border-color: $primary transparent transparent


  // .item-list
  //   position: relative
  //   // padding-bottom: 40px
  //   margin-left: -5px
  //   margin-right: -5px
  //   padding-left: 20px
  //   padding-right: 20px
  //   +desktop
  //     +desktop
  //       // border: 10px solid red
  //       // padding-top: 44px + 20
  //       max-height: 380px - 44 - 20
  //       overflow-y: auto
  // .item-wrapper
  //   position: relative
  //   margin-top: 20px
  //   border-radius: 2px
  //   &:last-child
  //     margin-bottom: 40px
  //   +desktop
  //     margin-top: 10px
  //   &.active
  //     cursor: pointer
  //     background-color: #f9f9f9
  //     // border-color: $primary

  // .item
  //   padding: 5px
  //   position: relative
  //   display: flex
  //   flex-flow: row wrap
  //   text-decoration: none
  //   color: $black
  //   // background-color: rgba($black, 0.03)
  //   &__image
  //     width: 70px
  //     height: 70px
  //     min-width: 70px
  //     min-height: 70px
  //     background-color: #f9f9f9
  //   &__content
  //     flex: 1
  //     position: relative
  //     // background-color: rgba($black, 0.03)
  //     width: 100%
  //     padding-left: 10px
  //     padding-top: 6px
  //   &__title
  //     font-size: 14px
  //     line-height: 1.33
  //     max-width: 160px

  // .copy
  //   padding: 20px 0 40px
  //   line-height: 16px
  //   font-size: 14px
  //   text-decoration: none
  //   text-transform: none
  //   position: relative
  //   cursor: pointer
  //   white-space: nowrap
  //   &.primary
  //     color: $primary
</style>


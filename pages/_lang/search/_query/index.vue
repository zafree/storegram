<template>
  <div :class="$style.wrapper">
    <section :class="$style.section">
      <header :class="$style.header">
        <h1>{{ $t('search.key_title') }}: <span>{{ searchKey }}</span></h1>
        <p>{{ $t('search.result', {field: __(searchResult.length)}) }}</p>
      </header>
    </section>
    <template v-if="searchResult.length > 0">
      <product-list :products="searchResult"></product-list>
    </template>
    <template v-else>
      <div :class="$style.emptyState">
        <h4 :class="$style.emptyStateTitle">{{ $t('search.no_result') }}</h4>
      </div>
    </template>
  </div>
</template>

<script>
  import ProductList from '~/components/catalog/ProductList'
  import logger from '~/utils/logger'
  import {
    getSearchItems
  } from '~/api'

  import { metaMixin } from '~/utils/meta'

  export default {
    mixins: [metaMixin],
    asyncData ({ route, store }) {
      let searchKey = route.params.query
      return getSearchItems(searchKey, null, store.getters.agentToken)
        .then((data) => {
          let searchResult = data || []
          return {
            searchKey,
            searchResult
          }
        })
        .catch((error) => {
          let searchResult = []
          logger.error('getSearchItems', error)
          return {
            searchKey,
            searchResult
          }
        })
    },
    data () {
      return {
        searchKey: null,
        searchResult: []
      }
    },
    computed: {
      pageMetas () {
        if (!this.searchKey) return
        let pageMetas = {}
        pageMetas.ogTitle = this.$t('search.key_title') + ':' + this.searchKey
        pageMetas.ogUrl = process.env.BASE_URL + this.$route.path
        return pageMetas
      }
    },
    components: {
      ProductList
    }
  }
</script>

<style lang="sass" module>
  @import "shared/category_summary/product_contain"
  @import "sass/shared/emptyState"

  .wrapper
    +container

  .section
    border-bottom: none !important

  .header
    h1
      font-size: 1.6em
      line-height: 1.33
      color: $black
      letter-spacing: 0.01em
      font-weight: 400
      +desktop
        font-size: 2.4em
      span
        color: $primary
    p
      margin-top: 10px
      font-size: 1.2em
      line-height: 1.33
      color: rgba($black, 0.55)
      letter-spacing: 0.01em
      font-weight: 400
      +desktop
        font-size: 1.4em
</style>

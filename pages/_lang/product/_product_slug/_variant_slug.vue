<template>
    <div :class="$style.product" v-if="product">
      <div :class="$style.productContainer">
        <div :class="$style.productRow">
          <product-details :product="product"
            :current-variant="currentVariant">
          </product-details>
        </div>
      </div>
    </div>
</template>

<script>
  import map from 'lodash/map'
  import find from 'lodash/find'
  import get from 'lodash/get'
  import { mapGetters } from 'vuex'
  import { getProductBySlug } from '~/api'
  import { gaEnhancedEcom } from '~/utils/ga-ec'
  import { ENHANCE_ECOM } from '~/utils/ga-meta.yaml'
  import { fbPixelEvents } from '~/utils/fb-pixel-analytics'
  import { EVENTS } from '~/utils/fb-pixel-analytics-meta.yaml'
  import ProductDetails from '~/components/catalog/ProductDetails'
  import ShippingInfo from '~/components/ShippingInfo.vue'
  import VueMarkdown from 'vue-markdown'

  import {
    mergeProductVariantWithBase,
    ensureI18nValueInAttributes
  } from '~/utils'

  import { metaMixin, removeHtmlTags } from '~/utils/meta'

  export default {
    mixins: [fbPixelEvents, gaEnhancedEcom, metaMixin],
    asyncData ({ params, store, error }) {
      return getProductBySlug(params.product_slug, store.getters.agentToken)
        .then((product) => {
          if (product) {
            let currentVariant
            if (product.variants) {
              let baseProductInfo = Object.assign({}, product)
              delete baseProductInfo['variants']
              product.variants = map(product.variants, (variantInfo) => mergeProductVariantWithBase(baseProductInfo, variantInfo))
              if (params.variant_slug) {
                currentVariant = find(product.variants, {variant_slug: params.variant_slug})
              }
            } else {
              currentVariant = ensureI18nValueInAttributes(product)
            }
            return {
              product: product,
              currentVariant: currentVariant
            }
          }
        })
        .catch((reason) => {
          const message = reason.error ? this.__e(reason.error) : 'Product not found'
          const statusCode = reason.error_code || 404
          return error({
            statusCode,
            message
          })
        })
    },
    mounted () {
      // PIXEL
      let pixelParams = {
        eventName: EVENTS.VIEW_CONTENT,
        dataObject: {
          content_name: this.currentVariant.name.en,
          content_ids: this.currentVariant.id,
          content_type: 'Product',
          value: this.currentVariant.unit_price,
          currency: 'BDT'
        }
      }
      this.fbPixelEvent(pixelParams)

      let addProductData = [{
        id: this.currentVariant.id,
        name: this.currentVariant.name,
        variant_name: this.currentVariant.variant_name,
        unit_price: this.currentVariant.unit_price
      }]
      this.gaEcAddProduct(addProductData)
      this.gaEcSetAction(ENHANCE_ECOM.ACTIONS.DETAIL)
      this.gaEcPageViewSend()
    },
    data () {
      return {
        product: null,
        currentVariant: null
      }
    },
    computed: {
      ...mapGetters([
        'bkashCashBack',
        'cityBankAmericanExpressCashBack',
        'eblCashBack',
        'masterCardCashBack'
      ]),
      productName () {
        return this.__(this.currentVariant.name)
      },
      description () {
        return this.__(this.currentVariant.description)
      },
      descriptionMd () {
        return this.__(this.currentVariant.description_md)
      },
      isDescriptionAvailable () {
        return !!(this.description || this.descriptionMd)
      },
      offers () {
        return this.currentVariant.offers || []
      },
      sortedOffers () {
        return this.product.offers.sort((a, b) => {
          return (a.sort_position - b.sort_position)
        })
      },
      productMetaObj () {
        return this.currentVariant && this.currentVariant.meta ? this.currentVariant.meta : null
      },
      pageMetas () {
        if (!this.currentVariant) return
        let pageMetas = {}

        pageMetas.keywords = get(this, 'productMetaObj.keywords')
        pageMetas.description = pageMetas.ogDescription = get(this, 'productMetaObj.description')

        if (!pageMetas.description && this.description) {
          pageMetas.description = pageMetas.ogDescription = removeHtmlTags(this.description)
        }

        pageMetas.ogTitle = this.productName

        pageMetas.ogImage = get(this, 'currentVariant.images.0')

        pageMetas.ogUrl = process.env.BASE_URL + this.$route.path

        return pageMetas
      },
      offerCount () {
        let offerCount = 0
        offerCount += this.bkashCashBack ? 1 : 0
        offerCount += this.cityBankAmericanExpressCashBack ? 1 : 0
        offerCount += this.eblCashBack ? 1 : 0
        offerCount += this.masterCardCashBack ? 1 : 0
        offerCount += Array.isArray(this.currentVariant.emi_tenures) && this.currentVariant.emi_tenures.length ? 1 : 0
        return offerCount
      }
    },
    components: {
      ProductDetails,
      VueMarkdown,
      ShippingInfo
    }
  }
</script>

<style lang="sass" scoped>
  .ProductDetailsNote
    margin-top: 80px
    padding: 50px 30px
    background-color: #F9F9F9
    +tablet
      margin-top: 100px
      padding: 60px
      display: flex
      flex-flow: row wrap
      justify-content: space-around
    +desktop
      justify-content: space-between
    &__item
      max-width: 250px
      +tablet
        width: 250px
      &:not(:last-child)
        margin-bottom: 30px
        +tablet
          // margin-bottom: 0
        +desktop
          margin-bottom: 0
    svg
      float: left
    h3
      font-size: 18px
      padding-left: 32px + 18
      color: $black
    p
      font-size: 14px
      margin-top: 10px
      padding-left: 32px + 18
      color: #666666

  .offers
    &:not(:last-child)
      padding-bottom: 0
    &__heading
      margin-top: 10px
      margin-bottom: 10px
      font-size: 14px
      font-weight: $weight-bold
    &__list
      padding-left: 15px
      margin: 0
      // +phablet
        padding-left: 30px
    &__item
      margin-bottom: 10px
      line-height: 1.33

</style>

<style lang="sass" module>
  .Product
    position: relative
    &__container
      +container
    &__row
      position: relative
      +clearfix

    &__row1
      position: relative
      display: flex
      flex-flow: row wrap
      // margin-top: 70px
    &__col1
      width: 100%
      +desktop
        width: 50%
        padding-right: 60px
    &__col2
      width: 100%
      margin-top: 70px
      +desktop
        margin-top: 0
        width: 50%
        padding-left: 60px


  .ProductDetails
    display: flex
    flex-flow: row wrap
    margin-top: 20px
    // +phablet
      padding-left: 15px
      padding-right: 15px
    +tablet
      margin-top: 5px
    &__column
      background-color: $white
      margin-bottom: 20px
      box-shadow: 0 1px 3px rgba($black, .1)

    &__title
      font-size: 32px
      font-weight: $weight-black
      color: $black
      line-height: 1.22
      // font-family: $family-display
    &__body
      margin-top: 20px
      color: $black
      font-size: 16px
      article
        max-width: 100%
        h1,
        h2,
        h3,
        h4
          margin-bottom: 20px
          margin-top: 50px
        p
          font-size: 16px
          line-height: 1.8
        ul
          li
            margin-bottom: 10px
            line-height: 1.33


  // unordered list
  .unorderedList
    padding: 0
    margin: 0
    &__item
      list-style: none
      padding: 0 0 8px 16px
      position: relative
      &::after
        content: ''
        height: 6px
        width: 6px
        position: absolute
        top: 6px
        left: 0
        border-radius: 50%
        background: #bbb

  .orderedList
    padding: 0
    margin: 0
    &__item
      margin: 5px 0
      list-style: inside decimal

  // ul
  .attrList
    margin: 0
    padding: 0
    list-style: none

    // li
    &__row
      display: flex
      flex-flow: row wrap
      width: 100%
      padding: 19px 0 18px
      &:not(:last-child)
        border-bottom: 1px solid #ebebeb
    &__title
      color: #777
      width: 35%
      padding-right: 10px
      // +tablet
      //   width: 25%
    // ul ul
    &__body
      padding: 0
      margin: 0
      width: 65%
      line-height: 1.4
      // +tablet
      //   width: 75%

    // ul ul li
    &__brief
      list-style: none
</style>

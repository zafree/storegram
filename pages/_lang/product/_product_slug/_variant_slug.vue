<template>
    <div :class="$style.product" v-if="product">

      <div :class="$style.productContainer">
        <div :class="$style.productRow">
          <product-details :product="product"
            :current-variant="currentVariant">
          </product-details>
        </div>
      </div>

      <!-- details -->
      <!-- <div :class="$style.productDetails">
        <div :class="$style.productDetailsColumn" v-if="currentVariant && !currentVariant.out_of_stock">
          <div :class="$style.productDetailsTitle">Delivery info</div>
          <div :class="$style.productDetailsBody">
            <shipping-info :deliveryTime="currentVariant.fix_delivery_time"></shipping-info>
          </div>
        </div>
      </div> -->

      <div v-if="this.offers.length || this.currentVariant.coupon_details" :class="$style.productDetailsColumn">
        <div :class="$style.productDetailsTitle">{{ $t('product.offers') }}</div>
        <div v-if="offers && offers.length && !currentVariant.out_of_stock" :class="$style.productDetailsColumn">
          <!-- <div :class="$style.productDetailsTitle">{{ $t('product.offers') }}</div> -->
          <div v-for="(offer, index) in offers" :key="index" :class="$style.productDetailsBody" class="offers">
            <h3 class="offers__heading">{{ __(offer.title) }}</h3>
            <span v-html="__(offer.details)"></span>
          </div>
        </div>
      </div>

      <!-- <div :class="$style.productContainer">
        <div :class="$style.productRow">
          <div class="ProductDetailsNote">
            <div class="ProductDetailsNote__item">
              <svg viewBox="0 0 32 32" width="32px" height="32px">
                <path d="M32,4H5.4v8.2C1.1,13.8-1.1,18.6,0.5,23s6.5,6.5,10.8,4.9c3-1.1,5-3.8,5.4-6.9H32V4z M7.3,5.9
                  h22.8v9.4H15.3c-1.8-2.6-4.9-4-8-3.6V5.9z M8.4,26.6c-3.6,0-6.5-2.9-6.5-6.5s2.9-6.5,6.5-6.5s6.5,2.9,6.5,6.5
                  C14.9,23.6,12,26.6,8.4,26.6z M16.7,19.1c-0.1-0.7-0.2-1.3-0.5-1.9h13.8v1.9L16.7,19.1z"/>
                <path d="M7.2,20.9L5.3,19l-1.2,1.2l3,3l4.7-4.7l-1.2-1.2L7.2,20.9z"/>
                <path d="M19.8,8.6h7.6v1.9h-7.6V8.6z"/>
              </svg>
              <h3>Secure payment</h3>
              <p>Don’t worry your money is in secure places</p>
            </div>
            <div class="ProductDetailsNote__item">
              <svg viewBox="0 0 32 32" width="32px" height="32px">
                <path d="M21.9,24.5c0.5,1.4,2,2.2,3.4,1.8c0.8-0.3,1.5-0.9,1.8-1.8H30v-7l-3.5-7.4h-6.2V5.6H2v19h2.9
                  c0.5,1.4,2,2.2,3.4,1.8c0.8-0.3,1.5-0.9,1.8-1.8H21.9z M27.9,16.9h-3.5v-5.2h1.1L27.9,16.9z M18.7,7.2V18H3.6V7.2L18.7,7.2z
                  M7.5,24.8c-0.6,0-1.1-0.5-1.1-1.1c0-0.6,0.5-1.1,1.1-1.1s1.1,0.5,1.1,1.1l0,0C8.5,24.3,8.1,24.8,7.5,24.8z M10.1,22.9
                  c-0.5-1.4-2-2.2-3.4-1.8c-0.8,0.3-1.5,0.9-1.8,1.8H3.6v-3.2h15.1v3.2H10.1z M24.5,24.8c-0.6,0-1.1-0.5-1.1-1.1
                  c0-0.6,0.5-1.1,1.1-1.1c0.6,0,1.1,0.5,1.1,1.1l0,0C25.6,24.3,25.1,24.8,24.5,24.8L24.5,24.8z M27.1,22.9c-0.5-1.4-2-2.2-3.4-1.8
                  c-0.8,0.3-1.5,0.9-1.8,1.8h-1.6V11.7h2.4v6.8h5.6v4.3L27.1,22.9z"/>
              </svg>
              <h3>Fast &amp; free delivery</h3>
              <p>Home delivery Tk 20. For free delivery order over Tk 2,000</p>
            </div>
            <div class="ProductDetailsNote__item">
              <svg viewBox="0 0 32 32" width="32px" height="32px">
                <path d="M22.6,2.3V0l-3.3,3.3l3.3,3.3V4.1c3.7,0,5.8,2.1,5.8,5.8c0,1.9-0.8,3.8-2.3,5.1v-4.8H7V26h19.1
                  v-8.9c2.5-1.5,4.1-4.3,4.1-7.2C30.2,5.2,27.3,2.3,22.6,2.3z M15.7,11.9h1.7v4.5l-1.7-1.2L15.7,11.9z M24.4,24.3H8.7V11.9h5.2v4.2
                  l5.2,3.5v-7.7h5.2L24.4,24.3z"/>
              </svg>
              <h3>Return policy</h3>
              <p>No hassle return policy</p>
            </div>
          </div>
        </div>
      </div> -->

      <div :class="$style.productContainer">
        <div :class="$style.productRow1">

          <div v-if="currentVariant.attributes && currentVariant.attributes.length" :class="$style.productCol1">
            <div :class="$style.productDetailsTitle">{{$t('product.features_label')}}</div>
            <div :class="$style.productDetailsBody">
              <ul :class="$style.attrList">
                <li :class="$style.attrListRow" v-for="(attr, index) in currentVariant.attributes" :key="index">
                  <h4 :class="$style.attrListTitle">{{ __(attr.name) }}</h4>
                  <ul :class="$style.attrListBody">
                    <li :class="$style.attrListBrief">
                      <template v-if="attr.value_prefix">
                        {{ __(attr.value_prefix) }}
                      </template>
                      {{ __(attr.i18n_value)}} {{ __(attr.i18n_unit) }}
                      <template v-if="attr.value_suffix">
                        {{ __(attr.value_suffix) }}
                      </template>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>

          <div v-if="isDescriptionAvailable" :class="$style.productCol2">
            <div :class="$style.productDetailsTitle">{{$t('product.description_label')}}</div>
            <div :class="$style.productDetailsBody">
              <template v-if="descriptionMd">
                <article>
                  <vue-markdown>{{ descriptionMd }}</vue-markdown>
                </article>
              </template>
              <template v-else>
                <article v-html="description"></article>
              </template>
            </div>
          </div>

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

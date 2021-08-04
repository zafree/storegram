<template>
  <div :class="$style.item" v-if="product">
    <i18n-link :class="$style.product" :to="detailPageUrl">
      <!-- hero -->
      <div :class="[$style.hero, {[$style.heroPortrait]: potraitMode}]">
        <!-- <div :class="[$style.heroImageAspectRatio, randomColorClass]"></div> -->
        <div :class="[$style.heroImageAspectRatio]"></div>
        <computed-image v-if="productImages.length"
          :class="[$style.heroImage, {[$style.heroImageIsLoaded]: imageIsLoaded}]"
          :meta="productImages[0]"
          :animate="false"
          :alt="__(product.name)"
          :title="__(product.name)"
          @imageLoaded="imageIsLoaded = true"/>
      </div>

      <!-- stream -->
      <div :class="$style.stream">
        <!-- product id -->
        <span :class="$style.id" v-if="isAgentMode">ID# {{product.id}}</span>
        <!-- coupon  -->
        <span :class="$style.coupon" v-if="product.coupon_details">
          <span :class="$style.couponText">{{ i18nText.coupon }}</span>
        </span>
        <!-- product offers -->
        <div :class="$style.offers" v-if="product.offers && product.offers.length">
          <div v-for="(offer,index) in product.offers" :key="index" :class="[$style.offersItem, { [$style.offersItemIsActive]: index === currentIndexOfferImage }]">
            <offer-logo-image v-if="offer.logo_image" :imageLink="offer.logo_image"></offer-logo-image>
          </div>
        </div>

        <!-- product title -->
        <h4 :class="$style.title">{{__(product.name)}}</h4>
        <!-- product price -->
        <div :class="$style.price">
          <!-- <span :class="$style.priceDiscounted">৳{{ __$(product.discounted_price) }}</span> -->
          <span :class="$style.priceDiscounted">Tk. {{ __$(product.discounted_price) }}</span>
          <template v-if="!product.out_of_stock && discount">
            <del :class="$style.priceUnit">{{ __$(product.unit_price) }}</del>
            <span :class="$style.priceDiscount">{{ i18nText.save }} {{ __$(discount) }}</span>
          </template>
          <span :class="$style.priceStockOut" v-if="product.out_of_stock">{{ i18nText.outStock  }}</span>
          <span :class="$style.priceAgentCommission" v-else-if="toggleCommission && !product.out_of_stock">{{ i18nText.commissionLabel }} {{ __$(product.commission) }}</span>
        </div>

        <!-- product emi -->
        <div :class="$style.emi" v-if="emiStartsFrom && !product.out_of_stock">
          <span :class="$style.emiBadge">{{ $t('product.emi_from',{ amount: __$(emiStartsFrom)}) }}</span>
        </div>

        <!-- product variants -->
        <div :class="$style.supplemental" v-if="product.variant_count">
          <span :class="$style.supplementalOptions">
            +{{ product.variant_count - 1 }} {{ i18nText.more }} {{ i18nText.option }}
          </span>

        </div>
      </div>
    </i18n-link>
  </div>
</template>

<script>
  import i18nLink from '~/components/i18nLink'
  import ComputedImage from '~/components/ComputedImage'
  import OfferLogoImage from '~/components/catalog/OfferLogoImage.vue'

  import {
    overlayMixin,
    i18nMixin,
    makeDefaultImageMeta,
    getRandomColorCssClass,
    calculateEmi
  } from '~/utils'

  import { mapState, mapGetters } from 'vuex'

  const DEFAULT_IMAGE_SVG = ('/clients/bronx/icons/default-image-md.svg')

  export default {
    mixins: [i18nMixin('ProductCardThumbnail'), overlayMixin],
    props: {
      'potraitMode': {
        type: Boolean,
        default: false
      },
      'product': {
        type: Object,
        required: true
      },
      'cashbackindex': {
        type: Number
      }
    },
    data () {
      return {
        imageIsLoaded: false
      }
    },
    computed: {
      ...mapState([
        'toggleCommission'
      ]),
      ...mapGetters([
        'isAgentMode',
        'bkashCashBack',
        'cityBankAmericanExpressCashBack',
        'eblCashBack',
        'masterCardCashBack',
        'cashBackList'
      ]),
      currentIndexOfferImage () {
        return this.cashbackindex % this.product.offers.length
      },
      detailPageUrl () {
        return `/product/${this.product.slug}` + (this.product.variant_slug ? `/${this.product.variant_slug}` : '')
      },
      discount () {
        return this.product.discounted_price ? (this.product.unit_price - this.product.discounted_price) : null
      },
      emi () {
        if (!this.product.emi_tenures) return null
        return this.product.emi_tenures.map(month => {
          const amount = (this.product.discounted_price / month).toFixed(2)
          return {
            month,
            amount
          }
        })
      },
      emiStartsFrom () {
        if (this.product && this.product.emi_tenures) {
          const emiTenures = this.product.emi_tenures
          if (!emiTenures || !Array.isArray(emiTenures) || !emiTenures.length) return null

          return calculateEmi(this.product.discounted_price, emiTenures)
        }
        return null
      },
      productImages () {
        if (this.product && this.product.image_info && this.product.image_info.length) {
          return this.product.image_info
        } else {
          return [
            makeDefaultImageMeta(DEFAULT_IMAGE_SVG)
          ]
        }
      },
      randomColorClass () {
        return this.$style[getRandomColorCssClass(this.name)]
      }
    },
    components: {
      ComputedImage,
      i18nLink,
      'offer-logo-image': OfferLogoImage
    }
  }
</script>

<style lang="sass" module>
  @import "shared/banner"
  @import "shared/button"
  @import "shared/category_summary/product_thumbnail"
</style>

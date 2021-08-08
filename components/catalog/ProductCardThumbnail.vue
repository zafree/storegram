<template>
  <div :class="$style.item" v-if="product">
    <i18n-link :class="$style.product" :to="detailPageUrl">
      <!-- hero -->
      <div :class="[$style.img]">
        <div :class="$style.imgAspectRatio">
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50">
            <use xlink:href="/svg/icons.svg?#i-camera"></use>
          </svg>
        </div>
        <div :class="$style.imgImage">
          <computed-image v-if="productImages.length"
            :class="[$style.heroImage, {[$style.heroImageIsLoaded]: imageIsLoaded}]"
            :meta="productImages[0]"
            :animate="false"
            :alt="__(product.name)"
            :title="__(product.name)"
            @imageLoaded="imageIsLoaded = true"/>
        </div>
      </div>

      <!-- stream -->
      <div :class="$style.productInfo">
        <div :class="$style.productInfoItem">
          <h4 :class="$style.productTitle">{{__(product.name)}}</h4>
        </div>
        <div :class="$style.productInfoItem" v-if="!product.out_of_stock && discount">
          <span :class="$style.productUnit">Tk. {{ __$(product.unit_price) }}</span>
        </div>
        <div :class="$style.productInfoItem">
          <span :class="$style.productDiscounted">Tk. {{ __$(product.discounted_price) }}</span>
        </div>
        <div :class="$style.productInfoItem" v-if="!product.out_of_stock && discount">
          <span :class="$style.productDiscount">{{ i18nText.save }} Tk. {{ __$(discount) }}</span>
        </div>
        <div :class="$style.productInfoItem" v-if="product.out_of_stock">
          <span :class="$style.productStockOut" >{{ i18nText.outStock  }}</span>
        </div>
        <div :class="$style.productInfoItem" v-if="product.variant_count">
          <span :class="$style.productMoreOptions">+{{ product.variant_count - 1 }} {{ i18nText.more }} {{ i18nText.option }}</span>
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
    getRandomColorCssClass,
    calculateEmi
  } from '~/utils'

  import { mapState, mapGetters } from 'vuex'

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
          return []
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
  @import "shared/img"
  @import "shared/category_summary/product_thumbnail"
</style>

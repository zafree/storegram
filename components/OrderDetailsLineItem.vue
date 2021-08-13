<template>
  <div :class="$style.item">
    <div :class="$style.itemImage">
      <div :class="$style.img">
        <div :class="$style.imgAspectRatio">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
            <use xlink:href="/svg/icons.svg?#i-camera"></use>
          </svg>
        </div>
        <div :class="$style.imgImage">
          <computed-image :meta="imageInfo" :alt="item.i18n_name"/>
        </div>
      </div>
    </div>
    <div :class="$style.itemInfo">
      <h3 :class="$style.itemInfoTitle">{{__(item.name)}}</h3>
      <div :class="$style.itemInfoStream">
        <span :class="$style.itemInfoCount">Qty {{ __$(item.qty) }}</span>
        <span :class="[$style.itemInfoMultiply, $style.btn]">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10">
            <use xlink:href="/svg/icons.svg?#i-close"></use>
          </svg>
        </span>
        <span :class="$style.itemInfoPrice">Tk. {{ __$(price) }}</span>
      </div>
    </div>
  </div>
</template>

<script>

  import {
    INCREASE_LINE_ITEM_QTY,
    DECREASE_LINE_ITEM_QTY,
    REMOVE_LINE_ITEM_FROM_CART
  } from '~/store/constants.yaml'

  import i18nLink from '~/components/i18nLink'

  import ComputedImage from '~/components/ComputedImage'

  import { makeDefaultImageMeta } from '~/utils'

  const DEFAULT_IMAGE_SVG = ('/clients/bronx/icons/default-image-sm.svg')

  export default {
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    computed: {
      price () {
        return this.item.discounted_price || this.item.unit_price
      },
      itemTotal () {
        return this.price * this.item.qty
      },
      imageInfo () {
        if (this.item.image_info && this.item.image_info.length) {
          return this.item.image_info[0]
        }
        return makeDefaultImageMeta(DEFAULT_IMAGE_SVG)
      },
      productUrl () {
        let variantSlug = this.cartItemInfo.variant_slug ? `/${this.cartItemInfo.variant_slug}` : ''
        let url = `/product/${this.cartItemInfo.slug + variantSlug}`
        return url
      },
      savedAmount () {
        return (this.item.price - this.item.discounted_price) * this.item.qty
      },
      isMinusButtonDisabled () {
        return this.item.qty === 1
      },
      isPlusButtonDisabled () {
        return this.item.qty === this.item.available_qty
      }
    },
    components: {
      ComputedImage,
      i18nLink
    },
    methods: {
      increaseQuantity () {
        this.$store.dispatch(INCREASE_LINE_ITEM_QTY, this.item)
      },
      decreaseQuantity () {
        this.$store.dispatch(DECREASE_LINE_ITEM_QTY, this.item)
      },
      removeItem () {
        this.$store.dispatch(REMOVE_LINE_ITEM_FROM_CART, this.item)
      }
    }
  }
</script>

<style lang="sass" module>
  @import "shared/button"
  @import "shared/img"
  @import "shared/cart-item"
</style>

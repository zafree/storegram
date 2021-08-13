<template>
  <div :class="$style.cart">
    Where are you cart?
    <div :class="$style.cartKeek">
      <div :class="$style.cartHero">
        <div :class="$style.cartImageAspectRatio"></div>
        <computed-image :class="$style.cartImage" :meta="imageInfo" :alt="item.i18n_name"/>
      </div>
      <div :class="$style.cartTitle">
        <i18n-link :class="$style.cartTitleLink" :to="item.product_url">{{__(item.i18n_name)}}</i18n-link>
      </div>
    </div>
    <div :class="$style.cartAmount">
      <div :class="$style.cartAmountPrice">৳ {{ __$(price) }}</div>
      <div :class="$style.cartAmountCount">
        <span :class="$style.cartAmountLabel">{{ $t('sidebar.cart.qty') }} :</span>
        <span :class="$style.cartAmountQuantity">{{ __$(item.qty) }}</span>
      </div>
      <div :class="$style.cartAmountTotal">৳ {{ __$(itemTotal) }}</div>
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
  import logger from '~/utils/logger'

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
        return this.item.discounted_price || this.item.price
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
          .catch(error => {
            logger.error(INCREASE_LINE_ITEM_QTY, error)
          })
      },
      decreaseQuantity () {
        this.$store.dispatch(DECREASE_LINE_ITEM_QTY, this.item)
          .catch(error => {
            logger.error(DECREASE_LINE_ITEM_QTY, error)
          })
      },
      removeItem () {
        this.$store.dispatch(REMOVE_LINE_ITEM_FROM_CART, this.item)
      }
    }
  }
</script>

<style lang="sass" module>
  // @import "shared/cart-item"
</style>

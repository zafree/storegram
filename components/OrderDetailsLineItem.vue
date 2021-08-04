<template>
  <div class="item">
    <div class="item__image">
      <computed-image :meta="imageInfo" :alt="item.i18n_name"/>
    </div>
    <div class="item__content">
      <h3 class="item__title">{{__(item.name)}}</h3>
      <div class="item__stream">
        <span class="quantity">Quantity: {{ __$(item.qty) }}</span>
        <span class="multiply"></span>
        <span class="price">Tk. {{ __$(price) }}</span>
      </div>
    </div>
  </div>
  <!-- <div :class="$style.cart">
    <div :class="$style.cartKeek">
      <div :class="$style.cartHero">
        <div :class="$style.cartImageAspectRatio"></div>
        <computed-image :class="$style.cartImage" :meta="imageInfo" :alt="item.i18n_name"/>
      </div>
      <div :class="$style.cartTitle">
        <span :class="$style.cartTitleLink">{{__(item.name)}}</span>
        <i18n-link :class="$style.cartTitleLink" :to="productUrl">{{__(item.name)}}</i18n-link>
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
  </div> -->
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
  @import "shared/cart-item"

  .cart
    &__amount
      height: 30px
</style>


<style lang="sass" scoped>
  .item
    margin-top: 20px
    position: relative
    display: flex
    flex-flow: row wrap
    // background-color: rgba($black, 0.03)
    &__image
      width: 70px
      height: 70px
      min-width: 70px
      min-height: 70px
      background-color: #EBEBEB
    &__content
      flex: 1
      position: relative
      // background-color: rgba($black, 0.03)
      width: 100%
      padding-left: 10px
    &__title
      font-size: 14px
      line-height: 1.33
      max-width: 160px
    &__stream
      margin-top: 8px
      position: relative
      display: inline-flex
      width: 100%
      // background-color: rgba($primary, 0.1)
      .quantity,
      .price
        display: block
        height: 21px
        font-size: 12px
        line-height: 22px
      .quantity
        color: $black
        text-align: center
      .multiply
        position: relative
        display: block
        width: 21px
        height: 21px
        // background-color: rgba($primary, 0.1)
        margin-left: 4px
        &::before,
        &::after
          content: ""
          position: absolute
          top: 0
          left: 0
          width: 7px
          height: 1px
          background-color: #666666
          margin-top: 11px
          margin-left: 7px
          transform-origin: center center
        &::before
          transform: rotate(45deg)
        &::after
          transform: rotate(135deg)
      .price
        margin-left: -3px
        color: #666666
    &__delete
      +button
      position: absolute
      top: 0
      right: 0
      padding: 0
      // background-color: rgba($black, 0.1)
      height: 22px
      width: 22px
      display: inline-flex
      justify-content: center
      align-items: center
      margin-right: -3px
      fill: #aaaaaa

  // .cart__line-item
  //   position: relative
  //   background-color: #fff
  //   .close-button
  //     position: absolute
  //     top: 2px
  //     right: 2px
  //   .item-total
  //     font-weight: bold

  //   .bottom-row
  //     color: #ccc


</style>

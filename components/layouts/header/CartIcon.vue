<template>
  <button @click.stop="toggleOverlay(overlays.aside2)">
    <svg viewBox="0 0 32 32" width="32px" height="32px">
      <path d="M8.4,7.6l-1-5.4L0.6,0L0,1.8l5.8,1.9l3.1,17c0.2,1.2,0.9,2.2,1.8,2.9c-1.6,1.4-1.7,3.7-0.4,5.3
        s3.7,1.7,5.3,0.4c1.4-1.2,1.7-3.2,0.8-4.7h4.8c-0.3,0.6-0.5,1.2-0.5,1.9c0,2.1,1.7,3.8,3.8,3.8s3.8-1.7,3.8-3.8s-1.7-3.8-3.8-3.8
        H13.5c-1.2,0-2.3-0.8-2.6-1.9c0.1,0,0.3,0.1,0.4,0.1h14.3c1.2,0,2.3-0.8,2.7-1.9L32,7.6H8.4z M11.3,18.9c-0.5,0-0.8-0.3-0.9-0.8h0
        l-1.2-6.7h3.8l1.9,7.5H11.3z M20.9,18.9h-4.2l-1.9-7.5h7.9L20.9,18.9z M26.4,18.2c-0.1,0.4-0.5,0.6-0.9,0.6h-2.7l1.9-7.5h4.1
        L26.4,18.2z"/>
    </svg>
    <span v-if="itemCount > 0" :class="[$style.countItems, {[$style.countItemsErrorState]: $store.getters.cartErrorExists}]">
      <slot v-if="!$store.getters.cartErrorExists">{{itemCount}}</slot>
      <slot v-else>!</slot>
    </span>
  </button>
  <!-- <div :class="$style.cart">
    <button
      :class="[$style.cartButton, {[$style.isActive]: isOverlayOpen(overlays.aside2), 'u-hideOnWideScreen': pageMode.checkoutMode}]"
      @click.stop="toggleOverlay(overlays.aside2)"
      type="button"
      name="button">
      <img :src="getImage" alt="">
      <span v-if="itemCount > 0" :class="[$style.countItems, {[$style.countItemsErrorState]: $store.getters.cartErrorExists}]">
        <slot v-if="!$store.getters.cartErrorExists">{{itemCount}}</slot>
        <slot v-else>!</slot>
      </span>
    </button>
  </div> -->
</template>

<script>
  import sumBy from 'lodash/sumBy'
  import { overlayMixin } from '~/utils'
  import { mapState } from 'vuex'

  export default {
    mixins: [overlayMixin],
    computed: {
      ...mapState([
        'pageMode'
      ]),
      getImage () {
        return this.isOverlayOpen(this.overlays.aside2) ? '/svg/cart-icon-active.svg' : '/svg/cart-icon.svg'
      },
      itemCount () {
        return sumBy(this.$store.state.cart.items, 'qty')
      }
    }
  }
</script>

<style lang="sass" scoped>
  .link
    svg
      width: 22px
      height: 22px
      +tablet
        width: auto
        height: auto
</style>

<style lang="sass" module>
  .Cart
    flex: 1
    max-width: 52px
    height: 44px
    &__button
      border: 0
      padding: 0
      cursor: pointer
      padding-left: 11px
      padding-right: 15px
      height: 100%
      background-color: transparent
      color: $white
      fill: $white
      position: relative
      &:hover,
      &:focus
        outline: none
  .countItems
    position: absolute
    min-width: 20px
    height: 20px
    border-radius: 20px
    background-color: $black
    font-size: 12px
    line-height: 1.88
    top: 0
    left: 0
    margin-top: 5px
    margin-left: 30px
    padding: 0 5px
    color: $primary
    &--errorState
      background-color: $red
      color: $white
</style>

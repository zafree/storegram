<template>
  <button @click.stop="toggleOverlay(overlays.aside2)">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
      <use xlink:href="/svg/icons.svg?#i-cart"></use>
    </svg>
    <span v-if="itemCount > 0" :class="[$style.countItems, {[$style.countItemsErrorState]: $store.getters.cartErrorExists}]">
      <slot v-if="!$store.getters.cartErrorExists">{{itemCount}}</slot>
      <slot v-else>!</slot>
    </span>
  </button>
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

<style lang="sass" module>
  .countItems
    position: absolute
    min-width: 20px
    height: 20px
    border-radius: 20px
    background-color: $primary
    color: $white
    font-size: 12px
    line-height: 1.8
    top: 0
    left: 0
    margin-top: 3px
    margin-left: 25px
    padding: 0 5px
    &--errorState
      background-color: $red
      color: $white
</style>

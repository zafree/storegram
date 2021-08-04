<template>
  <modal>
    <template slot="hero">
      <div :class="$style.bKashHero">
        <img src="/svg/bkash-182x80.svg" alt="">
      </div>
    </template>
    <bkash-diagram :success-callback="closeBkashDigramModal"></bkash-diagram>
    <template slot="actions">
      <button :class="[$style.button, $style.buttonModalClose]" type="button" name="button" @click="closeBkashDigramModal">
        <img :class="[$style.buttonIconSvg, $style.buttonIconSvgLeft]" src="/svg/icon-times.svg" alt="Modal Close">
      </button>
    </template>
    <button :class="[$style.button, $style.buttonModalCloseBottomText]" @click="closeBkashDigramModal">Close</button>
  </modal>
</template>

<script>
  import Modal from '~/components/Modal'
  import BkashDiagram from '~/components/BkashDiagram'
  import { overlayMixin } from '~/utils'

  export default {
    mixins: [overlayMixin],
    components: {
      Modal,
      BkashDiagram
    }
  }
</script>

<style lang="sass" module>
  @import "shared/button"

  .bKashHero
    flex: 1
    height: 100%
    position: relative
    background-color: #ee395f
    display: flex
    justify-content: center
    align-items: center
  
  .Button
    &--modalCloseBottomText
      border: 1px solid #d9d9d9
      height: 32px
      padding: 0 10px
      font-size: 13px
      color: #333
      fill: #333
      display: inherit
      margin-left: auto
      &:hover,
      &:focus,
      &:active
        color: #333
        fill: #333
        border-color: #777
</style>

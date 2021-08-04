<template>
  <modal>
    <template slot="hero">
      <div :class="$style.bKashHero">
        <img src="/svg/bkash-182x80.svg" alt="">
      </div>
    </template>
    <bkash-verification :success-callback="closeBkashVerificationModal"></bkash-verification>
    <template slot="actions">
      <button :class="[$style.button, $style.buttonModalClose]" type="button" name="button" @click="closeBkashVerificationModal">
        <img :class="[$style.buttonIconSvg, $style.buttonIconSvgLeft]" src="/svg/icon-times.svg" alt="Modal Close">
      </button>
    </template>
  </modal>
</template>

<script>
  import Modal from '~/components/Modal'
  import BkashVerification from '~/components/BkashVerification'
  import { overlayMixin } from '~/utils'

  export default {
    mixins: [overlayMixin],
    components: {
      Modal,
      BkashVerification
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

</style>

<style lang="sass" scoped>
  .Button
    display: inline-block
    position: relative
    text-align: center
    text-decoration: none
    cursor: pointer
    border: 0
    border-radius: 2px
    background-color: transparent
    vertical-align: top
    white-space: nowrap
    text-rendering: auto
    user-select: none
    letter-spacing: 0
    font-weight: 400
    font-style: normal
    box-shadow: none
    padding: 0
    height: 36px
    color: rgba($black,.44)
    fill: rgba($black,.44)
    transition: all .2s ease
    &:hover,
    &:focus
        color: rgba($black,.66)
        fill: rgba($black,.66)

    &:focus,
    &:active
        outline: none

    &--close
      font-size: 31px
      line-height: 1.33em
      position: absolute
      right: 0
      top: 0
      height: 40px
      width: 40px
</style>

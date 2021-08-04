<template>
  <div :class="$style.location">
    <button :class="[$style.locationIcon,  {[$style.locationIconIsActive]: preferredDeliveryAddress}]" @click="showSelector">
      <img :src="getImage" alt="">
    </button>
  </div>

</template>

<script>
  import { mapGetters } from 'vuex'
  import { overlayMixin } from '~/utils'
  export default {
    mixins: [overlayMixin],
    computed: {
      ...mapGetters([
        'preferredDeliveryAddress'
      ]),
      getImage () {
        return this.preferredDeliveryAddress ? '/svg/icon-location-active.svg' : '/svg/icon-location.svg'
      }
    },
    methods: {
      showSelector () {
        this.openOverlay(this.overlays.preferredDeliveryPointModal)
      }
    }
  }
</script>

<style lang="sass" module>
  .Location
    position: relative
    z-index: 51
    &::before
      content: ""
      position: absolute
      background-color: #d5d5d5
      height: 20px
      width: 1px
      top: 0
      left: 0
      margin-left: 34px
      margin-top: -10px
    &__multiselect
      position: absolute
      width: 220px
      margin-top: 12px
      +phablet
        width: 260px
      // border-top: 1px solid red

  .LocationIcon
    color: #aaaaaa
    fill: #aaaaaa
    position: absolute
    top: 50%
    left: 0
    transform: translateY(-50%)
    z-index: 4
    // pointer-events: none
    text-align: center
    text-decoration: none
    cursor: pointer
    border: 0
    background-color: transparent
    // background-color: rgba($red, .2)
    vertical-align: top
    white-space: nowrap
    text-rendering: auto
    user-select: none
    letter-spacing: 0
    font-weight: 400
    font-style: normal
    box-shadow: none
    height: 34px
    width: 34px
    &:focus,
    &:active
        outline: none
</style>

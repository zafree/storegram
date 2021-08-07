<template>
  <div :class="[$style.overlay, {[$style.overlayFixedTop]: isPreferredDeliveryModalOpen}, {[$style.overlayOnlyAgentMode]: isAgentMode}]">
    <div :class="$style.overlayDialog" v-on-click-outside="clickOutsideHandler">
      <div :class="$style.overlayTitle" v-if="$slots.title">
        <slot name="title"></slot>
      </div>
      <div :class="$style.overlayHero" v-if="$slots.hero">
        <slot name="hero"></slot>
      </div>
      <div :class="$style.overlayContent">
        <slot></slot>
      </div>
      <div :class="$style.overlayActions" v-if="$slots.actions">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  import { mixin as onClickOutside } from 'vue-on-click-outside'
  import { mapGetters, mapState } from 'vuex'
  import { OVERLAY_PREFERRED_DELIVERY_POINT_MODAL } from '~/store/constants.yaml'

  export default {
    mixins: [onClickOutside],
    props: {
      onClickOutside: {
        type: Function,
        required: false,
        default: null
      }
    },
    computed: {
      ...mapState([
        'ui'
      ]),
      ...mapGetters([
        'isAgentMode'
      ]),
      isPreferredDeliveryModalOpen () {
        return this.ui.activeOverlay === OVERLAY_PREFERRED_DELIVERY_POINT_MODAL
      }
    },
    methods: {
      clickOutsideHandler () {
        if (this.onClickOutside) {
          this.onClickOutside()
        }
      }
    }
  }
</script>

<style lang="sass" module>
  .Overlay
    z-index: $z-index-4-modal
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-color: rgba($white, .98)
    display: block
    text-align: center
    overflow: auto
    &::before
      content: ''
      display: inline-block
      vertical-align: top
      height: 100%
      +tablet
        margin-right: -.25em
        vertical-align: middle
    &--fixedTop
      overflow-y: scroll
      .Overlay__dialog
        vertical-align: top
        max-width: 515px


    &__dialog
      position: relative
      display: inline-block
      vertical-align: middle
      outline: 0
      overflow: hidden
      width: 100%
      max-width: 400px
      padding: 0
      background-color: $white
      min-height: 100%
      text-align: left
      box-shadow: 0 4px 32px 0 rgba(0,0,0,.2)
      +tablet
        min-height: 500px
        border-radius: 8px
        margin-top: 70px
        margin-bottom: 70px

    &__title
      position: relative
      height: 44px
      display: flex
      flex-flow: row wrap
      align-items: center
      width: 100%
      height: 44px
      background-color: #f2f2f2
      color: #777
      font-size: 14px
      padding-left: 10px
      padding-right: 10px
    &__hero
      background-color: $primary
      height: 180px
      overflow: hidden
      position: relative
      display: flex
      justify-content: center
      align-items: center

    &__content
        padding: 30px 30px 50px
</style>

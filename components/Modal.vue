<template>
  <div :class="[$style.overlay, {[$style.overlayOpen]: activeAnimation}]">
    <div :class="$style.overlayDialog">
      <div :class="$style.overlayOverlay" @click="closeModal"></div>
      <div :class="$style.overlayContent">
        <div :class="$style.overlayHeader" v-if="$slots.title">
          <h5 :class="$style.overlayHeaderTitle"><slot name="title"></slot></h5>
          <button :class="[$style.overlayHeaderClose, $style.btn]" @click="closeModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
              <use xlink:href="/svg/icons.svg?#i-close"></use>
            </svg>
          </button>
        </div>
        <div :class="$style.overlayHero" v-if="$slots.hero">
          <slot name="hero"></slot>
        </div>
        <div :class="$style.overlayBody">
          <slot></slot>
        </div>
        <div :class="$style.overlayActions" v-if="$slots.actions">
          <slot name="actions"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mixin as onClickOutside } from 'vue-on-click-outside'
  import { mapGetters, mapState } from 'vuex'
  import { OVERLAY_PREFERRED_DELIVERY_POINT_MODAL } from '~/store/constants.yaml'
  import { overlayMixin } from '~/utils'

  export default {
    data () {
      return {
        activeAnimation: false
      }
    },
    mounted () {
      setTimeout(() => {
        this.activeAnimation = true
      }, 0)
    },
    mixins: [onClickOutside, overlayMixin],
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
      },
      closeModal () {
        this.activeAnimation = false
        setTimeout(() => {
          this.closeAnyOverlayIfOpen()
        }, 0)
      }
    }
  }
</script>

<style lang="sass" module>
  @import "shared/button"
  @import "shared/modal-overlay"
</style>

<template>
  <modal :on-click-outside="closeLoginModal">
    <template slot="hero">
      <img :class="$style.heroImage" :src="brandLogo" alt="Hero Logo">
    </template>
    <login :success-callback="closeLoginModal"></login>
    <template slot="actions">
      <button :class="[$style.button, $style.buttonModalClose]" type="button" name="button" @click="closeLoginModal">
        <img :class="[$style.buttonIconSvg, $style.buttonIconSvgLeft]" src="/svg/icon-times.svg" alt="Modal Close">
      </button>
    </template>
  </modal>
</template>

<script>
  import Modal from '~/components/Modal'
  import Login from '~/components/Login'
  import { overlayMixin } from '~/utils'
  import { mapState } from 'vuex'
  import {
    SET_PREFERRED_DELIVERY_METHOD,
    PICKED_DELIVERY_METHODS
  } from '~/store/constants.yaml'

  export default {
    props: {
      successCallback: {
        type: Function,
        required: false,
        default: null
      }
    },
    mixins: [overlayMixin],
    components: {
      Modal,
      Login
    },
    computed: {
      ...mapState([
        'ui'
      ])
    },
    data () {
      return {
        brandLogo: '/clients/' + process.env.PROJECT_NAME + '/svg/brand-logo.svg'
      }
    },
    methods: {
      closeLoginModal () {
        if (this.successCallback) {
          setTimeout(() => {
            this.successCallback()
          }, 0)
        }
        if (this.ui.overlayContext && this.ui.overlayContext.openPreferredDeliveryPointModalAfterLogin) {
          this.$store.commit(SET_PREFERRED_DELIVERY_METHOD, PICKED_DELIVERY_METHODS.CUSTOMER)
          this.openOverlay(this.overlays.preferredDeliveryPointModal)
        }
        this.closeOverlayIfOpen(this.overlays.loginModal)
      }
    }
  }
</script>

<style lang="sass" module>
  @import "shared/button"

  .heroImage
    width: auto
    height: 80%
</style>

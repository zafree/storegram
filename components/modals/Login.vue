<template>
  <modal :on-click-outside="closeLoginModal">
    <template slot="title">Sign In</template>
    <login :success-callback="closeLoginModal"></login>
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
</style>

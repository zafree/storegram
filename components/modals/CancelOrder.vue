<template>
  <modal :on-click-outside="closeCancelOrderModal">
    <cancel-order :closeModal="closeCancelOrderModal"></cancel-order>
    <template slot="actions">
      <button :class="[$style.button, $style.buttonModalClose, $style.buttonClose]" type="button" name="button" @click="closeCancelOrderModal">
        <img :class="[$style.buttonIconSvg, $style.buttonIconSvgLeft]" src="/svg/icon-times.svg" alt="Modal Close">
      </button>
    </template>
  </modal>
</template>

<script>
  import Modal from '~/components/Modal'
  import CancelOrder from '~/components/CancelOrder'
  import { overlayMixin } from '~/utils'

  export default {
    mixins: [overlayMixin],
    components: {
      Modal,
      CancelOrder
    }
  }
</script>

<style lang="sass" module>
  @import "shared/button"
</style>

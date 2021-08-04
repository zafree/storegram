<template>
  <button @click.prevent.stop="openOverlay(overlays.loginModal)">Sign In</button>
</template>

<script>
  import { overlayMixin } from '~/utils'

  export default {
    mixins: [overlayMixin]
  }
</script>


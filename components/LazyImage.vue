<template>
  <img v-if="meta" :src="meta.url" :srcset="meta.srcset" v-bind:sizes="sizes" :width="meta.width" v-on="$listeners" :class="{[$style.isLoading]: isLoading}" v-observe-visibility="{
  callback: visibilityChanged,
  intersection: {
    rootMargin: '100%'
  }
}"/>
</template>

<script>

import { ObserveVisibility } from 'vue-observe-visibility'

const DEFAULT_SIZES_VALUE = '1px'

export default {
  directives: {
    ObserveVisibility
  },
  props: {
    meta: {
      type: Object,
      required: true
    },
    animate: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    isLoading: true,
    sizes: DEFAULT_SIZES_VALUE
  }),
  watch: {
    'meta.url': function (newUrl) {
      this.isLoading = this.animate
      this.sizes = DEFAULT_SIZES_VALUE
    }
  },
  methods: {
    visibilityChanged: function (isVisible, entry) {
      if (isVisible) {
        this.loadImage(entry.boundingClientRect.width)
      }
    },
    loadImage (imgWidth) {
      if (this.meta && this.meta.srcset && this.sizes === DEFAULT_SIZES_VALUE) {
        let img = new Image()
        img.srcset = this.meta.srcset
        img.sizes = Math.ceil(imgWidth / window.innerWidth * 100) + 'vw'
        img.onload = () => {
          this.isLoading = false
          this.sizes = img.sizes
          this.$emit('imageLoaded')
        }
      }
    }
  },
  beforeMount () {
    // this.observerRoot = document.querySelector('main')
  },
  mounted () {
    this.isLoading = this.animate
    // this.loadImage(this.$el.width)
  }
}
</script>

<style lang="sass" module>
  .is-loading
    animation-name: pulse
    animation-duration: 2s
    animation-fill-mode: forwards
    animation-iteration-count: infinite
    animation-timing-function: ease-in-out

  @keyframes pulse
    0%
      opacity: 1
    50%
      opacity: .5
    100%
      opacity: 1
</style>

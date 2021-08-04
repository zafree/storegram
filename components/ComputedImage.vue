<template>
  <img v-if="src" :src="imageSource" v-on="$listeners" :class="{[$style.isLoading]: isLoading}" v-on:load="imageIsLoaded()" v-on:error="imageIsNotLoaded()"/>
  <img v-else-if="meta" :srcset="meta.srcset" v-bind:sizes="sizes" :width="meta.width" v-on="$listeners" :class="{[$style.isLoading]: isLoading}" />
</template>

<script>
const DEFAULT_SIZES_VALUE = '1px'

export default {
  props: {
    src: {
      type: String,
      required: false
    },
    meta: {
      type: Object,
      required: false
    },
    animate: {
      type: Boolean,
      default: true
    },
    defaultImage: {
      type: String,
      required: false
    }
  },
  data: () => ({
    isLoading: true,
    sizes: DEFAULT_SIZES_VALUE,
    imageSource: null
  }),
  created () {
    this.isLoading = this.animate
    this.imageSource = this.src
  },
  watch: {
    'meta.url': function (newUrl) {
      this.sizes = DEFAULT_SIZES_VALUE
    }
  },
  methods: {
    imageIsLoaded () {
      this.isLoading = false
      this.$emit('imageLoaded')
    },
    imageIsNotLoaded () {
      if (this.defaultImage) {
        this.imageSource = this.defaultImage
      }
      this.$emit('imageNotLoaded')
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
    let imgWidth = window.getComputedStyle(this.$el.parentElement, null).getPropertyValue('width').replace('px', '')
    this.loadImage(imgWidth)
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

<template>
  <img v-if="imageUrl" :src="imageUrl" v-on="$listeners" />
</template>

<script>

const json2mq = require('json2mq')
import logger from '~/utils/logger'

export default {
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
    imageUrl: null
  }),
  methods: {
    loadImage (imageUrl) {
      this.isLoading = this.animate
      let img = new Image()
      img.src = imageUrl
      img.onload = () => {
        this.isLoading = false
        this.imageUrl = imageUrl
      }
    }
  },
  created () {
    this.imageUrl = this.meta.all[this.meta.sortedWidths[0]]
    this.isLoading = this.animate
  },
  mounted () {
    const registerMatchMediaListener = (width, mqSpec) => {
      const mediaQuery = json2mq(mqSpec)
      const mql = window.matchMedia(mediaQuery)
      const cb = ({ matches }) => {
        if (matches) {
          logger.log(mediaQuery, this.meta.all[width])
          this.loadImage(this.meta.all[width])
        }
      }
      mql.addListener(cb) // subscribing
      cb(mql) // initial trigger
    }

    const sortedWidths = this.meta.sortedWidths
    if (!window.matchMedia) {
      this.imageUrl = this.meta.all[sortedWidths[this.meta.width]]
      return
    }

    for (let i = 0; i < sortedWidths.length; i++) {
      let mqSpec = {}
      if (i === 0) {
        mqSpec.maxWidth = sortedWidths[i]
      } else if (i === sortedWidths.length - 1) {
        mqSpec.minWidth = sortedWidths[i - 1] + 1
      } else {
        mqSpec.minWidth = sortedWidths[i - 1] + 1
        mqSpec.maxWidth = sortedWidths[i]
      }
      registerMatchMediaListener(sortedWidths[i], mqSpec)
    }
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

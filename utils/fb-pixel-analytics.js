// import { EVENTS } from '~/utils/fb-pixel-analytics-meta.yaml'

export const fbPixelEvents = {
  computed: {
    isFbPixelAvailable () {
      return !!this.$fb
    }
  },
  methods: {
    fbPixelEvent (param) {
      if (!this.isFbPixelAvailable && !(this.isFbPixelAvailable && param)) return
      this.$fb.track(param.eventName, param.dataObject)
    }
  }
}

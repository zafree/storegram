<template>
  <nuxt-link :to="i18nTo" :replace="replace" :append="append"
    :tag="tag" :active-class="activeClass" :exact="exact"
    :event="internalEvent" :exact-active-class="exactActiveClass" v-on:click.native="closeAnyOverlayIfOpen">
    <slot></slot>
  </nuxt-link>
</template>

<script>
import { overlayMixin } from '~/utils'
// import logger from '~/utils/logger'

export default {
  mixins: [overlayMixin],
  props: [
    'to',
    'replace',
    'append',
    'tag',
    'activeClass',
    'exact',
    'event',
    'exactActiveClass'
  ],
  computed: {
    internalEvent () {
      return this.isNavigating ? '' : this.event
    },
    isNavigating () {
      return this.$store.state.navigatingRoutePath &&
        this.i18nToFullPath &&
        this.i18nToFullPath.href === this.$store.state.navigatingRoutePath
    },
    i18nToFullPath () {
      return this.$router.resolve(this.i18nTo, this.$route, this.append)
    },
    i18nTo () {
      // logger.log('to', to)
      if (this.$i18n.locale === 'en') {
        return this.to
      }
      let to = this.to
      let path = (typeof to === 'object') ? to.path : to
      if (path) {
        path = '/' + this.$i18n.locale + '/' + path.replace(/^\//, '')
        if (typeof to === 'object') {
          let computedTo = { ...to, ...{path} }
          // logger.log('computedTo', computedTo)
          return computedTo
        }
      }
      // logger.log('path', path)
      return path
    }
  }
}
</script>

<template>
  <div :class="$style.logo" v-if="enableDoubleClick" @dblclick="reload" @click="redirect">
    <svg xmlns="http://www.w3.org/2000/svg" width="146" height="32">
      <use xlink:href="/svg/icons.svg?#i-logo"></use>
    </svg>
  </div>
  <i18n-link :class="$style.logo" v-else to="/" :event="event" @click.native="scrollTop">
    <svg xmlns="http://www.w3.org/2000/svg" width="146" height="32">
      <use xlink:href="/svg/icons.svg?#i-logo"></use>
    </svg>
  </i18n-link>
  <!-- <div v-if="enableDoubleClick" :class="$style.link" @dblclick="reload" @click="redirect">
    <img :class="$style.image" :src="logoHeader" alt="">
  </div>
  <i18n-link v-else :class="$style.link" to="/" :event="event" @click.native="scrollTop">
    <img :class="$style.image" :src="logoHeader" alt="">
  </i18n-link> -->
</template>

<script>
import i18nLink from '~/components/i18nLink'
import { mapGetters, mapState } from 'vuex'
import { i18nRedirect } from '~/utils'

export default {
  computed: {
    ...mapState([
      'ui'
    ]),
    ...mapGetters([
      'isAgentMode',
      'isPlatformCordova'
    ]),
    enableDoubleClick () {
      return this.isPlatformCordova || this.isAgentMode
    },
    event () {
      return this.ui.isOffline ? '' : undefined
    }
  },
  components: {
    i18nLink
  },
  data () {
    return {
      logoHeader: '/clients/' + process.env.PROJECT_NAME + '/svg/logo-header.svg'
    }
  },
  methods: {
    scrollTop () {
      if (window && document) {
        if (window.safari) {
          document.body.scrollTop = 0
        } else {
          document.documentElement.scrollTop = 0
        }
      }
    },
    redirect () {
      this.scrollTop()
      return i18nRedirect(this.$ctx, '/')
    },
    reload () {
      this.$router.go({
        path: this.$router.path,
        query: {
          ts: Date.now()
        }
      })
    }
  }
}
</script>

<style lang="sass" module>
  .logo
    display: flex
    align-items: center
    height: 100%

</style>


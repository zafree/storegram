<template>
  <div :class="$style.error">
    <div :class="$style.errorWrapper">
      <h2 :class="$style.errorCode">{{errorTitle}} ({{translate('code')}}: {{ error.statusCode }})</h2>
      <h2 :class="$style.errorMessage" v-html="errorMessage"></h2>
      <div v-if="!ui.isOffline">
        <i18n-link :class="$style.btn" :event="internalEvent" v-if="error.statusCode === 404" to="/"><span v-html="buttonText"></span></i18n-link>
        <button :class="$style.btn" v-else type="button" @click="reloadPage" v-html="buttonText"></button>
      </div>
      <div v-else>
        <p v-html="offlineMessage" class="Offline"></p>
      </div>
    </div>
  </div>
</template>


<script>
  import SiteHeader from '~/components/layouts/error/SiteHeader'
  import i18nLink from '~/components/i18nLink'
  import { mapState } from 'vuex'

  export default {
    name: 'nuxt-error',
    props: ['error'],
    head () {
      return {
        title: this.errorTitle
      }
    },
    computed: {
      ...mapState([
        'ui'
      ]),
      internalEvent () {
        return this.$store.state.navigatingRoutePath ? '' : undefined
      },
      kernelStyles () {
        return this.kernelTop ? {top: `-${this.kernelTop}px`} : null
      },
      is404 () {
        return this.error.statusCode === 404
      },
      is500 () {
        return this.error.statusCode === 500
      },
      buttonText () {
        const key = this.is404 ? '_404' : 'default'
        return this.translate('button', key)
      },
      errorMessage () {
        const key = this.is404 || this.is500 ? '_' + this.error.statusCode : 'default'
        return this.translate('message', key)
      },
      errorTitle () {
        const key = this.is404 || this.is500 ? '_' + this.error.statusCode : 'default'
        return this.translate('title', key)
      },
      offlineMessage () {
        const key = this.$store.getters.isAgentMode ? 'agent' : 'customer'
        return this.translate('offline', key)
      }
    },
    methods: {
      translate (type, key) {
        const i18nKey = key ? `error_page.${type}.${key}` : `error_page.${type}`
        return this.$t(i18nKey)
      },
      reloadPage () {
        if (process.browser) {
          window.location.reload(true)
        }
      }
    },
    components: {
      i18nLink,
      // SiteFooter
      SiteHeader
    }
  }
</script>

<style lang="sass" module>
  @import "shared/button"

  .Offline
    margin-top: 30px
    font-size: 16px


  .error
    +container
    &__wrapper
      padding: $gutter*2 $gutter
      display: flex
      flex-direction: column
      max-width: 600px
      justify-content: center
      +desktop
        margin-top: $gutter*4
        margin-bottom: $gutter*4
    &__code
      font-size: 21px
      line-height: 1.33
      color: #999
      margin-bottom: 10px
    &__message
      font-size: 32px
      line-height: 1.33
      color: $text
      margin-bottom: $gutter*2

</style>


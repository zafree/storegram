<template>
  <div :class="$style.root">
    <div :class="$style.rootKernel" :style="kernelStyles">
      <div :class="$style.app">
        <!-- header -->
        <header :class="$style.appHeader">
          <slot name="header">
            <site-header>
              <template slot="cartIcon">
              </template>
            </site-header>
          </slot>
        </header>
        <div :class="$style.appHeaderClone"></div>
        <main :class="$style.appMain">
          <div :class="$style.appMainContainer">
            <div class="Error">
              <div class="Error__wrapper">
                <h2 class="Error__code">{{errorTitle}} ({{translate('code')}}: {{ error.statusCode }})</h2>
                <h2 class="Error__message" v-html="errorMessage"></h2>
                <div v-if="!ui.isOffline">
                  <i18n-link class="Button" :event="internalEvent" v-if="error.statusCode === 404" to="/"><span v-html="buttonText"></span></i18n-link>
                  <button class="Button" v-else type="button" @click="reloadPage" v-html="buttonText"></button>
                </div>
                <div v-else>
                  <p v-html="offlineMessage" class="Offline"></p>
                </div>
              </div>
            </div>
          </div>
        </main>
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

<style lang="sass" scoped>
  @import "shared/button"

  .Button
    margin-top: 30px
    padding-left: 30px
    padding-right: 30px
    font-size: 16px
    +btnYellow

  .Offline
    margin-top: 30px
    font-size: 16px

  .Error
    height: calc(100vh - 143px)
    display: flex
    width: 100%
    justify-content: center
    align-items: center
    +tablet
      height: calc(100vh - 94px)
    &__wrapper
    &__code
      font-size: 21px
      line-height: 1.33
      color: #999
      margin-bottom: 10px
    &__message
      font-size: 32px
      line-height: 1.33
      color: #333

</style>

<style lang="sass" module>
.Root
  position: relative
  &__kernel
    position: relative
    display: block

.App
  position: relative
  display: flex
  flex-flow: row wrap
  font-size: 1.4em
  justify-content: center

  $root: &;

  &__header,
  &__footer
      position: relative
      flex: 1 100%

  &__header
    position: fixed
    width: 100%
    min-width: 320px
    background-color: $purple
    z-index: $z-index-2-header
    left: 0
    top: 0

  &__main
    width: 100%
    background-color: #f5f5f5
    position: relative
    &-container
      +container
      display: flex
      flex-flow: row wrap
      margin-left: auto
      margin-right: auto
      width: 100%
      padding: 0 15px 0


  &__footer
    position: relative
    background-color: $white
    border-top: 1px solid #eeeeee
    z-index: $z-index-1-footer
    +clearfix

</style>

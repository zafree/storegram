<template>
  <div>
    <notification type="error" v-if="isFallbackContent">
      <p>{{ $t('static.translation_not_found') }}</p>
    </notification>
    <div v-html="content"></div>
  </div>
</template>

<script>

import upperFirst from 'lodash/upperFirst'
import lowerCase from 'lodash/lowerCase'

import Notification from '~/components/Notification.vue'
import { metaMixin } from '~/utils/meta'

function getPageContent (pageName, locale) {
  let content = null
  let contentLocale = locale
  try {
    content = require(`~/content/${contentLocale}/${pageName}.html`)
  } catch (e) {
    if (locale !== 'en') {
      try {
        contentLocale = 'en'
        content = require(`~/content/${contentLocale}/${pageName}.html`)
      } catch (e) {
        content = null
      }
    }
  }
  return {
    content,
    isFallbackContent: (contentLocale !== locale)
  }
}

export default {
  mixins: [metaMixin],
  layout: 'static',
  asyncData ({params, store, error}) {
    const content = getPageContent(params.page_name, store.state.locale)
    if (!content) {
      return error({
        statusCode: 404,
        message: 'Page not found'
      })
    }
    // logger.log(`content for ${store.state.locale}/${params.page_name}`)
    // logger.log(content)
    return Promise.resolve(content)
  },
  data () {
    return {
      isFallbackContent: false
    }
  },
  computed: {
    pageMetas () {
      if (!this.$route) return
      let pageMetas = {}
      pageMetas.ogUrl = process.env.BASE_URL + this.$route.path
      this.$route.params && this.$route.params.page_name ? pageMetas.ogTitle = upperFirst(lowerCase(this.$route.params.page_name)) : null
      return pageMetas
    }
  },
  components: {
    Notification
  }
}
</script>

import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { LOAD_MOST_USED_COMPONENTS_I18NKEYS } from '~/store/constants.yaml'

Vue.use(VueI18n)

export default (context) => {
  const { app, store } = context

  let i18nKeyFile = null
  if (store.state.locale === 'bn') {
    i18nKeyFile = require('~/static/bn.yaml')
  } else {
    i18nKeyFile = require('~/static/en.yaml')
  }
  let messages = {}
  messages[store.state.locale] = i18nKeyFile
  // Set i18n instance on app
  // This way we can use it in middleware and pages asyncData/fetch
  app.i18n = new VueI18n({
    locale: store.state.locale,
    fallbackLocale: 'en',
    messages
  })
  store.dispatch(LOAD_MOST_USED_COMPONENTS_I18NKEYS)
}

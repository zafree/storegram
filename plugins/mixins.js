import {
  translateModelAttr,
  translateCurrencyAttr
} from '~/utils'

import {
  SET_PAGE_NOTIFICATION
} from '~/store/constants.yaml'

import Vue from 'vue'

Vue.mixin({
  methods: {
    __ (attr) {
      return translateModelAttr(attr, this.$i18n.locale)
    },
    __$ (attr, justNumber = false) {
      let translatedNumber = translateCurrencyAttr(attr, this.$i18n ? this.$i18n.locale : null)
      if (justNumber) {
        translatedNumber = translatedNumber.replace(/,/g, '')
      }
      return translatedNumber
    },
    __e (errorCode, i18nContext) {
      const i18nKey = `api_errors.${errorCode.toString().toLowerCase()}`
      return this.$t(i18nKey, i18nContext)
    },
    showPageNotification (type, key = 'default') {
      this.$store.commit(SET_PAGE_NOTIFICATION, {type, key})
    }
  }
})

export default (ctx, inject) => {
  inject('ctx', ctx)
}

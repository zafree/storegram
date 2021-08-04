import Vue from 'vue'

import {
  MARK_FB_SDK_READY,
  TRY_AUTOMATIC_LOGIN_WITH_FACEBOOK,
  EVENT_FB_SDK_LOADED,
  SET_LAST_FB_LOGIN_TIMESTAMP
} from '~/store/constants.yaml'

/* eslint-disable */

const FacebookSdkLoader = {}

window.fbAsyncInit = function() {
  window.FB.init({
    appId: process.env.FB_APP_ID,
    autoLogAppEvents: false,
    xfbml: false,
    version: 'v2.10'
  })
  window.FB.AppEvents.logPageView()
  Vue.prototype.$fbsdk = window.FB
  window.dispatchEvent(new Event(EVENT_FB_SDK_LOADED))
}

FacebookSdkLoader.install = function (Vue, options) {
  (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0]
    if (d.getElementById(id)) return
    js = d.createElement(s)
    js.id = id
    js.src = 'https://connect.facebook.net/en_US/sdk.js'
    fjs.parentNode.insertBefore(js, fjs)
  }(document, 'script', 'facebook-jssdk'))

  Vue.prototype.$fbsdk = null
}

/* eslint-enable */

Vue.use(FacebookSdkLoader)

export default ({app, store}) => {
  function onFbSdkReady () {
    app.FB = window.FB
    window.removeEventListener(EVENT_FB_SDK_LOADED, onFbSdkReady)
    store.commit(MARK_FB_SDK_READY)

    if (store.getters.isPlatformCordova) {
      if (!store.state.customer && store.state.fbLoginAttempted) {
        store.dispatch(TRY_AUTOMATIC_LOGIN_WITH_FACEBOOK, app.FB)
      }
      store.commit(SET_LAST_FB_LOGIN_TIMESTAMP, false)
    }
  }
  window.addEventListener(EVENT_FB_SDK_LOADED, onFbSdkReady)
}

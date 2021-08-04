const path = require('path')
const endsWith = require('lodash/endsWith')
const merge = require('lodash/merge')
const isArray = require('lodash/isArray')
const isPlainObject = require('lodash/isPlainObject')
const extend = require('lodash/extend')
const isFunction = require('lodash/isFunction')
const dotEnvConfig = require('dotenv').config().parsed

// const fse = require('fs-extra')

const isProduction = dotEnvConfig.NODE_ENV === 'production'

const metaDefaultContents = {
  title: dotEnvConfig.PROJECT_TITLE,
  description: dotEnvConfig.PROJECT_DESCRIPTION,
  image: dotEnvConfig.BASE_URL + '/imgs/dg-banner.jpg'
}

let nuxtConfig = {
  env: {
    appMode: dotEnvConfig.APP_MODE || 'customer'
  },
  /*
  ** Headers of the page
  */
  head: {
    title: dotEnvConfig.PROJECT_TITLE,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no' },
      { name: 'msapplication-TileColor', content: '#783392' },
      { name: 'msapplication-TileImage', content: '/favicon/mstile-144x144.png' },
      { name: 'msapplication-config', content: '/favicon/browserconfig.xml' },
      { name: 'theme-color', content: '#783392' },
      { name: 'google-site-verification', content: 'je1pWYJJDhxDg7_xF8mzenwjqkNhl_kqiR496CPxoOI' },
      { hid: 'description', name: 'description', content: metaDefaultContents.description },
      { hid: 'fb:app_id', property: 'fb:app_id', content: dotEnvConfig.FB_APP_ID },
      { hid: 'og:title', property: 'og:title', content: metaDefaultContents.title },
      { hid: 'og:description', property: 'og:description', content: metaDefaultContents.description },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: dotEnvConfig.BASE_URL },
      { hid: 'og:image', property: 'og:image', content: metaDefaultContents.image }
    ],
    link: [
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/favicon/android-chrome-192x192.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png' },
      { rel: 'manifest', href: '/favicon/site.webmanifest' },
      { rel: 'mask-icon', href: '/favicon/safari-pinned-tab.svg', color: '#783392' },
      { rel: 'shortcut icon', href: '/favicon/favicon.ico' }
    ]
  },
  css: [
    '@/sass/global.sass'
  ],
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fcbf14', height: '3px' },

  modules: [
    '@nuxtjs/sentry',
    '@nuxtjs/dotenv',
    ['@nuxtjs/google-analytics', {
      id: dotEnvConfig.GA_ID,
      debug: {
        sendHitTask: isProduction
      },
      // debug: {
      //   enabled: true,
      //   trace: true,
      //   sendHitTask: true
      // },
      ecommerce: {
        enabled: true,
        enhanced: true
      }
    }],
    '@nuxtjs/style-resources',
    'nuxt-polyfill',
    '@nuxtjs/markdownit'
  ],
  markdownit: {
    injected: true,
    preset: 'default',
    linkify: true,
    breaks: true
  },
  // markdownit: {
  //   preset: 'default',
  //   linkify: true,
  //   breaks: true,
  //   use: [
  //     'markdown-it-div',
  //     'markdown-it-attrs'
  //   ]
  // }
  polyfill: {
    features: [
      /*
        Feature with detect:

        Detection is better because the polyfill will not be
        loaded, parsed and executed if it's not necessary.
      */
      {
        require: 'intersection-observer',
        detect: () => 'IntersectionObserver' in window
      }
    ]
  },
  sentry: {
    dsn: dotEnvConfig.SENTRY_DSN,
    config: {} // Additional config
  },
  router: {
    middleware: [
      'set-platform',
      'i18n',
      'page_notification',
      'set-current-category',
      'set-sidebar-menu',
      'fb_page_view',
      'page_mode'
    ],
    extendRoutes (routes, resolve) {
      routes.forEach((route) => {
        let hasOptionalParam = /\?/.test(route.path)
        if (hasOptionalParam) {
          let indexComponentPath = route.path.replace(/\?/g, '').replace(/:/g, '_') + '/index.vue'
          if (endsWith(route.component, indexComponentPath)) {
            route.path = route.path.replace(/\?/, '')
          }
        }
      })
    }
  },
  plugins: [
    '~plugins/mixins.js',
    { src: '~plugins/router_events.js', ssr: false },
    { src: '~plugins/i18n.js', injectAs: 'i18n' },
    { src: '~plugins/persistedstate.js', ssr: false },
    { src: '~plugins/fb_sdk.js', ssr: false },
    { src: '~plugins/fresh_desk.js', ssr: false },
    { src: '~/plugins/VueFlickity.js', ssr: false }
  ],
  /*
  ** Build configuration
  */
  build: {
    vendor: [
      'intersection-observer',
      'vue-observe-visibility',
      'axios',
      'js-cookie',
      'jwt-decode',
      'vue-i18n',
      'vuex-persistedstate',
      'vue-on-click-outside',
      'vue-flickity'
    ],
    /**
    ** cssModule name pattern
    */
    loaders: {
      cssModules: {
        modules: {
          localIdentName: isProduction ? '[hash:base64:10]' : '[name]__[local]'
        },
        localsConvention: 'camelCase'
      }
    },
    // postcss: [],
    extend (config, ctx) {
      /*
      ** Run ESLINT on save
      */
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }

      /**
       * import all the mixin, variables globally
       */
      const sassLoaderNames = ['scss', 'sass']
      sassLoaderNames.forEach((loaderName) => {
        let sassLoader = ctx.loaders[loaderName]
        sassLoader.sassOptions = {
          includePaths: [],
          indentWidth: 2,
          indentedSyntax: true
        }
        sassLoader.sassOptions.includePaths.push(path.resolve(__dirname, 'sass'))
        if (loaderName === 'sass') {
          sassLoader.prependData = '@import "clients/' + dotEnvConfig.PROJECT_NAME + '/sass-vars"'
        }
      })

      /**
       * not to load inline-svgs as base64 data
       */
      const inlineSvgPath = path.resolve(__dirname, 'inline-svg')
      const urlLoader = config.module.rules.find((rule) => {
        if (rule.use) return rule.use.find(l => l.loader === 'url-loader')
        return false
      })

      if (urlLoader.use) {
        urlLoader.exclude = [inlineSvgPath]
        if (!urlLoader.exclude) {
          urlLoader.exclude = inlineSvgPath
        } else {
          if (isArray(urlLoader.exclude)) {
            urlLoader.exclude.push(inlineSvgPath)
          } else {
            urlLoader.exclude = [urlLoader.exclude, inlineSvgPath]
          }
        }
      }

      /**
       * load inline svgs as they are
       */
      config.module.rules.push({
        test: /\.svg$/,
        loader: 'raw-loader',
        include: path.resolve(__dirname, 'inline-svg')
      })

      /**
       * custom configuration for store/constants.yaml
       */
      const yaml = require('js-yaml')
      const actionSufixes = ['STARTED', 'COMPLETED', 'SUCCESSFUL', 'FAILED']

      config.module.rules.push({
        test: /\.yaml$/,
        include: path.resolve(__dirname, 'store/constants'),
        use: [{
          loader: 'skeleton-loader',
          options: {
            procedure: function (content) {
              let parsed = yaml.safeLoad(content)
              let obj = {}
              let actions = parsed.ACTION ? parsed.ACTION : []
              let generics = parsed.ACTION ? (parsed.GENERIC ? parsed.GENERIC : []) : parsed

              for (var i = 0; i < actions.length; i++) {
                obj[actions[i]] = actions[i]
                for (var j = 0; j < actionSufixes.length; j++) {
                  let type = actions[i] + '_' + actionSufixes[j]
                  obj[type] = type
                }
              }

              for (i = 0; i < generics.length; i++) {
                if (isPlainObject(generics[i])) {
                  extend(obj, generics[i])
                } else {
                  obj[generics[i]] = generics[i]
                }
              }

              return obj
            },
            toCode: true
          }
        }]
      })

      /**
       * configuration for other yaml files
       */
      config.module.rules.push({
        test: /\.yaml$/,
        exclude: path.resolve(__dirname, 'store/constants'),
        use: [{
          loader: 'skeleton-loader',
          options: {
            procedure: function (content) {
              return yaml.load(content)
            },
            toCode: true
          }
        }]
      })

      /**
       * configuration for html files in content directory
       */
      config.module.rules.push({
        test: /\.html$/,
        loader: 'raw-loader',
        include: path.resolve(__dirname, 'content')
      })
    }
  }
}

if (isProduction) {
  nuxtConfig.modules.push('@nuxtjs/pwa')
  if (dotEnvConfig.FB_PIXEL_ID) {
    nuxtConfig.modules.push(['nuxt-facebook-pixel-module', {
      track: 'PageView',
      pixelId: dotEnvConfig.FB_PIXEL_ID
    }])
  }
} else {
  nuxtConfig.modules.push('@nuxtjs/icon')
  nuxtConfig.modules.push('@nuxtjs/meta')
}

try {
  let localConfig = require(path.resolve(__dirname, 'nuxt.config.local.js'))
  if (isFunction(localConfig)) {
    localConfig(nuxtConfig)
  } else {
    nuxtConfig = merge(nuxtConfig, localConfig)
  }
} catch (error) {}

module.exports = nuxtConfig

/** Usage:

Step 1: Define enums in ~/utils/enums.yaml

Step 2: Define translation for all enums under `enums.${enumName}` keys

Step 3: Add below line in top of component's script scetion:

import enumMixinFactory from '~/utils/enum_mixin_factory'

Step 4: Then in the component options use as below:

mixins: [enumMixinFactory()] // this will load all enums defined in ~/utils/enums.yaml

OR

mixins: [enumMixinFactory(
  'OrderPaymentStatus',
  'OrderCommissionStatus'
)] // this will load only OrderPaymentStatus & OrderCommissionStatus enums defined
in ~/utils/enums.yaml

Step 5:

Use enums, invertedEnums, i18nEnums & i18nInvertedEnums variables in your template

OR

Use __enumKey & __enumValue methods if necessary

**/

import isArray from 'lodash/isArray'
import toArray from 'lodash/toArray'
import pick from 'lodash/pick'
import mapValues from 'lodash/mapValues'
import invert from 'lodash/invert'

export default function enumMixinFactory (enumNames = null) {
  let enums = require('~/utils/enums.yaml')
  if (enumNames) {
    if (!isArray(enumNames)) {
      enumNames = toArray(arguments)
    }
    enums = pick(enums, enumNames)
  }
  const inverted = mapValues(enums, invert)

  function translateEnums (vm, enums, invertedMode = false) {
    return mapValues(enums, (enumObj, enumName) => {
      return mapValues(enumObj, (value, key) => {
        return vm.__enumKey(enumName, invertedMode ? value : key)
      })
    })
  }

  return {
    data () {
      return {
        i18nEnums: translateEnums(this, enums),
        i18nInvertedEnums: translateEnums(this, inverted, true)
      }
    },
    watch: {
      '$i18n.locale': function (newLocale) {
        this.i18nEnums = translateEnums(this, enums)
        this.i18nInvertedEnums = translateEnums(this, inverted, true)
      }
    },
    computed: {
      enums: function () {
        return enums
      },
      invertedEnums: function () {
        return inverted
      }
    },
    methods: {
      __enumKey (enumName, key, i18nContext) {
        const i18nKey = `enums.${enumName}.${key}`
        const i18nValue = this.$t(i18nKey)
        if (i18nValue === i18nKey && this.$i18n.locale !== 'en') {
          return this.$t(i18nKey, 'en', i18nContext)
        }
        return i18nValue
      },
      __enumValue (enumName, value, i18nContext) {
        return this.__enumKey(enumName, inverted[enumName][value], i18nContext)
      }
    }
  }
}

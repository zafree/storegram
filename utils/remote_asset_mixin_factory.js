/** Usage:

Step 1: Define per component meta in ~assets/meta/{compName}.yaml

Step 2: Add below line in top of component's script scetion:

import remoteAssetMixinFactory from '~/utils/remote_asset_mixin_factory'

Step 3: Then in the component options use as below:

mixins: [enumMixinFactory(
  'content_top',
  'cart',
  ...
)] // this will set processed asset meta in vm, under remoteAssets
// namespace, for each of the component names passed to the mixin factory

Step 4:

Use remoteAssets.{compName} variables in your template
**/

import toArray from 'lodash/toArray'
import keys from 'lodash/keys'
import each from 'lodash/each'
import extend from 'lodash/extend'
import isString from 'lodash/isString'
import isPlainObject from 'lodash/isPlainObject'
import pick from 'lodash/pick'

export default function remoteAssetMixinFactory () {
  const assetUrlBase = process.env.ASSET_URL_BASE
  const compNames = toArray(arguments)

  if (compNames.length === 0) {
    throw new Error('at least one argument is required')
  }

  function getResponsiveMeta (assetInfo, options) {
    const sortedWidths = keys(assetInfo)
      .map((v) => parseInt(v))
      .sort((a, b) => a > b)
    const defaultWidth = options.defaultWidth || sortedWidths[sortedWidths.length - 1]
    let srcSet
    let all = {}
    each(sortedWidths, function (width) {
      let assetUrl = assetInfo[width]
      if (!/^data:/.test(assetInfo[width])) {
        assetUrl = assetUrlBase + assetInfo[width]
      }
      all[width] = assetUrl
      if (options.srcSet) {
        srcSet = (srcSet ? `${srcSet}, ` : '') + `${assetUrl} ${width}w`
      }
    })
    return extend({
      url: all[defaultWidth],
      width: defaultWidth,
      all,
      sortedWidths
    }, (srcSet ? {srcset: srcSet} : {}))
  }

  function getRemoteAssetInfo (compName, options) {
    const assetMeta = require(`~/assets/meta/${compName}.yaml`)

    let assetData = {}
    each(assetMeta, function (v, k) {
      if (isString(v)) {
        assetData[k] = assetUrlBase + v
      } else if (isPlainObject(v)) {
        assetData[k] = getResponsiveMeta(v, options)
      }
    })
    return assetData
  }

  return {
    data () {
      let remoteAssets = {}
      const defaultOptions = {
        srcSet: false,
        defaultWidth: null
      }
      compNames.forEach((compName) => {
        let options = {...defaultOptions}

        if (isPlainObject(compName)) {
          options = extend(options, pick(compName, keys(defaultOptions)))
          compName = compName.name
        }

        extend(remoteAssets, {
          [compName]: getRemoteAssetInfo(compName, options)
        })
      })
      return {
        remoteAssets
      }
    }
  }
}

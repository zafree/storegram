import uniqBy from 'lodash/uniqBy'
import {
  CONTAINER_CATEGORY_MENU,
  CATALOG_PRODUCT_DEFAULT_DISPLAY_COUNT,
  CATALOG_API_PAGE_LIMIT
} from '~/store/constants.yaml'

import {
  getSpecialCategoryProducts
} from '~/api'
import logger from '~/utils/logger'

export default async function loadCategoriesByChunk (currentCategory, specialCategory, subCategories, agentToken, vm) {
  if (!vm) {
    vm = {
      categoryProducts: {},
      cancellApiCalls: false
    }
  }

  let categoriesQueue = []

  if (specialCategory && specialCategory.length) {
    categoriesQueue = [...specialCategory]
  } else if (specialCategory && !Array.isArray(specialCategory) && typeof specialCategory === 'object') {
    categoriesQueue = [specialCategory]
  }

  if (subCategories && subCategories.length) {
    categoriesQueue = [...categoriesQueue, ...subCategories]
  } else if (currentCategory) {
    categoriesQueue = [...categoriesQueue, ...[currentCategory]]
  }

  categoriesQueue = uniqBy(categoriesQueue, 'id')

  let from = 0
  let take = 0

  function dequeue () {
    from = 0
    take = 0
    categoriesQueue = categoriesQueue.slice(1)
  }
  while (!vm.cancellApiCalls && categoriesQueue.length) {
    let category = categoriesQueue[0]
    let context = category && category.display_in.includes(CONTAINER_CATEGORY_MENU) ? null : currentCategory

    const currentCategoryGotNoSubCategories = (currentCategory && category.id === currentCategory.id && (!subCategories || !subCategories.length))
    const showFullList = (category && !!category.full_list_in_summary) || currentCategoryGotNoSubCategories

    take = showFullList ? CATALOG_API_PAGE_LIMIT : CATALOG_PRODUCT_DEFAULT_DISPLAY_COUNT

    try {
      const result = await getSpecialCategoryProducts(category, context, agentToken, from, take)

      console.log('result', result)
      if (result[category.id]) {
        if (vm.categoryProducts[category.id]) {
          result[category.id].forEach(p => {
            vm.categoryProducts[category.id].push(p)
          })
        } else {
          vm.categoryProducts = { ...vm.categoryProducts, ...result }
        }
      }

      if (!showFullList || !result[category.id] || (Array.isArray(result[category.id]) && result[category.id].length < CATALOG_API_PAGE_LIMIT)) {
        dequeue()
      } else {
        from += CATALOG_API_PAGE_LIMIT
      }
    } catch (error) {
      logger.error('********* ERROR IN loadCategoriesByChunk ******** \n', error)
      dequeue()
    }
  }
  return vm.categoryProducts
}

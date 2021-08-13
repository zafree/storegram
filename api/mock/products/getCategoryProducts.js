import product10111 from '~/api/mock/products/product10/product10111.json'
import product10112 from '~/api/mock/products/product10/product10112.json'
import product10113 from '~/api/mock/products/product10/product10113.json'
import product10114 from '~/api/mock/products/product10/product10114.json'
import product10121 from '~/api/mock/products/product10/product10121.json'
import product10122 from '~/api/mock/products/product10/product10122.json'
import product10123 from '~/api/mock/products/product10/product10123.json'
import product10124 from '~/api/mock/products/product10/product10124.json'

import product20001 from '~/api/mock/products/product20/product20001.json'
import product20002 from '~/api/mock/products/product20/product20002.json'
import product20003 from '~/api/mock/products/product20/product20003.json'
import product20004 from '~/api/mock/products/product20/product20004.json'

export const products = [
  product10111,
  product10112,
  product10113,
  product10114,
  product10121,
  product10122,
  product10123,
  product10124,
  product20001,
  product20002,
  product20003,
  product20004
]

function getProductByCategoryId (id) {
  return products.filter(prod => prod.categoryId === id)
}

export function getCategoryProducts ({ categoryId }) {
  const categoryProducts = {}

  categoryProducts[categoryId] = getProductByCategoryId(categoryId)
  return categoryProducts
}

export function getProductBySlug ({ slug }) {
  const product = products.find(x => x.slug === slug)
  return Promise.resolve(product)
}

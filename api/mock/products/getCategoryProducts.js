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
  return products.filter(prod => prod.categoryId === id).map(x => detailsToListAdapter(x))
}

export function getCategoryProducts ({ categoryId }) {
  const categoryProducts = {}

  categoryProducts[categoryId] = getProductByCategoryId(categoryId)

  if (categoryId === 125) {
    categoryProducts[categoryId] = [product10111, product10112, product10121, product10122].map(x => detailsToListAdapter(x))
  }

  return categoryProducts
}

export function getProductBySlug ({ slug }) {
  const product = products.find(x => x.slug === slug)
  return Promise.resolve(product)
}

function detailsToListAdapter (product) {
  const productOrVariant = product.variants && product.variants.length > 0 ? product.variants.find(x => x.id === product.primary_variant_id) : product
  const summary = {
    'id': productOrVariant.id,
    'name': product.name,
    'slug': product.slug,
    'variant_slug': productOrVariant.variant_slug,
    'emi_tenures': productOrVariant.emi_tenures,
    'image_info': productOrVariant.image_info,
    'coupon_details': productOrVariant.coupon_details,
    'discounted_price': productOrVariant.discounted_price,
    'unit_price': productOrVariant.unit_price,
    'available_qty': productOrVariant.available_qty,
    'out_of_stock': productOrVariant.out_of_stock,
    'varies_on': productOrVariant.varies_on,
    'variant_count': productOrVariant.variant_count,
    'commission': productOrVariant.commission,
    'primary_variant_id': productOrVariant.primary_variant_id,
    'offers': productOrVariant.offers
  }
  return summary
}

import { products } from '~/api/mock/products'

import product11001 from '~/api/mock/products/product10/product11001.json'
import product11002 from '~/api/mock/products/product10/product11002.json'
import product11003 from '~/api/mock/products/product10/product11003.json'
import product11004 from '~/api/mock/products/product10/product11004.json'

import product12001 from '~/api/mock/products/product10/product12001.json'
import product12002 from '~/api/mock/products/product10/product12002.json'
import product12003 from '~/api/mock/products/product10/product12003.json'
import product12004 from '~/api/mock/products/product10/product12004.json'

export function getProductByID (id) {
  let product = {}
  products.forEach(x => {
    if (x && x.id && x.id === id) {
      product = x
      return
    } else if (x && x.variants && x.variants.find(v => v.id === id)) {
      product = x.variants.find(v => v.id === id)
      return
    }
  })

  return product
}
export function getProductByCategoryId (id) {
  return products.filter(prod => prod.categoryId === id).map(x => detailsToListAdapter(x))
}

export function getCategoryProducts ({ categoryId }) {
  const categoryProducts = {}

  categoryProducts[categoryId] = getProductByCategoryId(categoryId)

  if (categoryId === 125) {
    categoryProducts[categoryId] = [product11001, product11002, product12001, product12002, product11003, product11004, product12003, product12004].map(x => detailsToListAdapter(x))
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

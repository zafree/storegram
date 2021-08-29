import { products } from '~/api/mock/products'

import product10111 from '~/api/mock/products/product10/product10111.json'
import product10112 from '~/api/mock/products/product10/product10112.json'
import product10121 from '~/api/mock/products/product10/product10121.json'
import product10122 from '~/api/mock/products/product10/product10122.json'

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

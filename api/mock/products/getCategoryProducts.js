import { products } from '~/api/mock/products'

import product1101 from '~/api/mock/products/product10/product1101.json'
import product1102 from '~/api/mock/products/product10/product1102.json'
import product1103 from '~/api/mock/products/product10/product1103.json'
import product1104 from '~/api/mock/products/product10/product1104.json'

import product1201 from '~/api/mock/products/product10/product1201.json'
import product1202 from '~/api/mock/products/product10/product1202.json'
import product1203 from '~/api/mock/products/product10/product1203.json'
import product1204 from '~/api/mock/products/product10/product1204.json'

import product2101 from '~/api/mock/products/product20/product2101.json'
import product2201 from '~/api/mock/products/product20/product2201.json'
import product2301 from '~/api/mock/products/product20/product2301.json'
import product2401 from '~/api/mock/products/product20/product2401.json'

import product3101 from '~/api/mock/products/product30/product3101.json'
import product3201 from '~/api/mock/products/product30/product3201.json'
import product3301 from '~/api/mock/products/product30/product3301.json'
import product3401 from '~/api/mock/products/product30/product3401.json'

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

  if (categoryId === 10) {
    categoryProducts[categoryId] = [
      product1101, product1102, product1201, product1202, product1103, product1104, product1203, product1204
    ].map(x => detailsToListAdapter(x))
  }
  if (categoryId === 20) {
    categoryProducts[categoryId] = [
      product2101, product2201, product2301, product2401
    ].map(x => detailsToListAdapter(x))
  }
  if (categoryId === 30) {
    categoryProducts[categoryId] = [
      product3101, product3201, product3301, product3401
    ].map(x => detailsToListAdapter(x))
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

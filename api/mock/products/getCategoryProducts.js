import { products } from '~/api/mock/products'

import product1101 from '~/api/mock/products/product10/product1101.json'
import product1103 from '~/api/mock/products/product10/product1103.json'
import product1202 from '~/api/mock/products/product10/product1202.json'
import product1204 from '~/api/mock/products/product10/product1204.json'
import product1302 from '~/api/mock/products/product10/product1302.json'
import product1303 from '~/api/mock/products/product10/product1303.json'
import product1404 from '~/api/mock/products/product10/product1404.json'
import product1501 from '~/api/mock/products/product10/product1501.json'

import product2101 from '~/api/mock/products/product20/product2101.json'
import product2201 from '~/api/mock/products/product20/product2201.json'
import product2301 from '~/api/mock/products/product20/product2301.json'
import product2401 from '~/api/mock/products/product20/product2401.json'

import product3101 from '~/api/mock/products/product30/product3101.json'
import product3201 from '~/api/mock/products/product30/product3201.json'
import product3301 from '~/api/mock/products/product30/product3301.json'
import product3401 from '~/api/mock/products/product30/product3401.json'

import product4101 from '~/api/mock/products/product40/product4101.json'
import product4201 from '~/api/mock/products/product40/product4201.json'
import product4301 from '~/api/mock/products/product40/product4301.json'
import product4401 from '~/api/mock/products/product40/product4401.json'

import product5101 from '~/api/mock/products/product50/product5101.json'
import product5201 from '~/api/mock/products/product50/product5201.json'
import product5202 from '~/api/mock/products/product50/product5202.json'
import product5301 from '~/api/mock/products/product50/product5301.json'

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
      product1101, product1202, product1103, product1302,
      product1501, product1404, product1303, product1204
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
  if (categoryId === 40) {
    categoryProducts[categoryId] = [
      product4101, product4201, product4301, product4401
    ].map(x => detailsToListAdapter(x))
  }
  if (categoryId === 50) {
    categoryProducts[categoryId] = [
      product5101,
      product5201, product5202,
      product5301
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

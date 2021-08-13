// {
//   'items': [
//     {
//       'id': 78662,
//       'stock_record_id': 77779,
//       'discounted_price': 675,
//       'discount_rule_id': 3010,
//       'qty': 1
//     }
//   ],
//   'updated_at': null,
//   'is_emi': false
// }

// {
//   'is_emi': false,
//   'balance': 0,
//   'items': [
//     {
//       'request_item': {
//         'id': 78662,
//        ...
//         'item_total': 675
//       },
//       'item_details': {
//         'id': 78662,
//         ...
//       },
//       'error': false
//     }
//   ],
//   'sub_total': 675,
//   'coupon_error': false,
//   'applied_coupon': null,
//   'user_coupon': null,
//   'suggestion': null
// }

import { products } from '~/api/mock/products/getCategoryProducts'
export const mockSaveCart = (cartPayload) => {
  return mockValidateCart(cartPayload)
}

export const mockValidateCart = (cartPayload) => {
  const cartResponse = {
    'is_emi': false,
    'balance': 0,
    'items': [],
    'sub_total': 0,
    'coupon_error': false,
    'applied_coupon': null,
    'user_coupon': null,
    'suggestion': null
  }

  console.log(products)
  console.log(products.map(x => x.id))

  for (let index = 0; index < cartPayload.items.length; index++) {
    const curr = cartPayload.items[index]
    let productWanted
    for (let jendex = 0; jendex < products.length; jendex++) {
      if (products[jendex] && products[jendex].id === curr.id) {
        productWanted = products[jendex]
        break
      } else if (products[jendex] && products[jendex].variants && products[jendex].variants.length) {
        console.log(products[jendex])
        console.log(products[jendex].variants.map(v => v.id))
        console.log(curr.id)
        productWanted = products[jendex].variants.find(v => v.id === curr.id)
        if (productWanted) break
      }
    }
    let error = false
    if (!productWanted) error = 'NOT_FOUND'
    else if (productWanted.available_qty === 0) error = 'OUT_OF_STOCK'
    else if (curr.qty > productWanted.available_qty) error = 'NOT_ENOUGH_QTY'

    cartResponse.items.push({
      request_item: curr,
      item_details: productWanted,
      error
    })
  }

  cartResponse.sub_total = cartResponse.items.reduce((acc, curr) => acc + curr.request_item.discounted_price, 0)
  return cartResponse
}

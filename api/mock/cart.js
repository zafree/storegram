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

import { products } from './products'
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
  // cartResponse.items = cartPayload.items.map(x => {
  //   const product = products.find(p => p.id === x.id)
  //   return {
  //     request_item: x,
  //     item_details: product,
  //     error: x.qty > product.available_qty
  //   }
  // })
// cartItemInfo.error === 'NOT_ENOUGH_QTY'
// cartItemInfo.error === 'OUT_OF_STOCK'
// cartItemInfo.error === 'DISCONTINUED'
// cartItemInfo.error === 'PRICE_CHANGED'
// cartItemInfo.error === 'NOT_FOUND'
// cartItemInfo.error === 'NOT_DELIVERABLE_TO_AGENT'
// cartItemInfo.error === 'NOT_DELIVERABLE_TO_LOCKER'

  for (let index = 0; index < cartPayload.items.length; index++) {
    const curr = cartPayload.items[index]
    let productWanted
    for (let jendex = 0; jendex < products.length; jendex++) {
      if (products[jendex] && products[jendex].id === curr.id) {
        productWanted = products[jendex]
        break
      } else if (products[jendex] && products[jendex].variants && products[jendex].variants.length) {
        productWanted = products[jendex].variants.find(v => v.id === curr.id)
        break
      }
    }
    let error = false
    if (productWanted.available_qty === 0) error = 'OUT_OF_STOCK'
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

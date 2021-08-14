import order1 from './order1.json'
import order2 from './order2.json'
import order3 from './order3.json'
import order4 from './order4.json'
import order5 from './order5.json'
import order6 from './order6.json'

const orders = [order1, order2, order3, order4, order5, order6]

export function getOrderSummaryById ({ orderId }) {
  const order = orders.find(x => x.id === Number(orderId))
  return Promise.resolve(order)
}

export function getOrderSummaries () {
  return Promise.resolve(orders)
}

export function createOrder () {
  return Promise.resolve(order1)
}

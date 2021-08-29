import { products } from '~/api/mock/products'

export const getSearchItems = ({ query }) => {
  console.log('query ', query)
  const _products = products.filter(x => {
    if (x && x.name && x.name.en && x.name.en.includes(query)) return true
    return false
  })
  return Promise.resolve(_products)
}

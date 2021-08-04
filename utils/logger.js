import includes from 'lodash/includes'
import isFunction from 'lodash/isFunction'
import partial from 'lodash/partial'

const isProduction = process.env.NODE_ENV === 'production'
const methods = ['debug', 'error', 'info', 'log', 'warn', 'dir', 'trace']
const productionWhiteList = ['error']

function fnLog (method, ...args) {
  if (isProduction && !includes(productionWhiteList, method)) {
    return
  }
  if (isFunction(console[method])) {
    console[method](...args)
  }
}

let logger = {}

for (var i = 0; i < methods.length; i++) {
  logger[methods[i]] = partial(fnLog, methods[i])
}

export default logger

import {
  SET_PAGE_NOTIFICATION
} from '~/store/constants.yaml'

import get from 'lodash/get'

function capitalizeFirstChar (s) {
  if (s && typeof s === 'string') return s[0].toUpperCase() + s.slice(1)
  return null
}
export default function ({ store, route }) {
  const notificationType = get(route, 'query.n_type')
  const notificationKey = get(route, 'query.n_key', 'default')
  const notificationField = get(route, 'query.n_field')

  const notificationMessage = capitalizeFirstChar(get(route, 'query.n_msg'))

  let value = null

  if (notificationType) {
    if (notificationMessage) {
      value = {
        type: notificationType,
        msg: notificationMessage
      }
    } else if (notificationKey) {
      value = {
        type: notificationType,
        key: notificationKey,
        field: notificationField
      }
    }
  }

  store.commit(SET_PAGE_NOTIFICATION, value)
}

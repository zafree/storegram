import axios from '~/plugins/axios'
import { APP_MODE } from '~/store/constants.yaml'

export default function ({store}) {
  const storeState = store.state
  if (storeState.appMode === APP_MODE.CUSTOMER && storeState.customer_access_token) {
    axios.defaults.headers.common['Authorization'] = 'bearer ' + store.state.customer_access_token
  } else if (storeState.appMode === APP_MODE.AGENT && storeState.agent_access_token) {
    axios.defaults.headers.common['Authorization'] = 'bearer ' + store.state.agent_access_token
  }
}

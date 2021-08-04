import axios from 'axios'

if (process.env.API_ROOT) {
  const API_ROOT = process.env.API_ROOT
  const API_BASE = process.env.API_BASE || 'storefront/api'
  const API_VERSION = 'v1'
  axios.defaults.baseURL = `${API_ROOT}/${API_BASE}/${API_VERSION}/`
}

// function errorResponseHandler (error) {
//   // check for doNotSuppressError config
//   if (error.config.hasOwnProperty('doNotSuppressError') && error.config.doNotSuppressError === true) {
//     return Promise.reject(error)
//   }
// }

// // apply interceptor on response
// axios.interceptors.response.use(
//   response => response,
//   errorResponseHandler
// )

// axios.defaults.headers.common['Authorization'] = CUSTOMER_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
//

export default axios

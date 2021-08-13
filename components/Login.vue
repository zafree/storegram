<template>
  <login-customer v-if="isCustomerMode" :success-callback="successCallback" :request-product="requestedProduct"/>
</template>

<script>
  import { mapGetters } from 'vuex'
  import LoginCustomer from '~/components/Login/LoginCustomer'
  import LoginAgent from '~/components/Login/LoginAgent'

  export default {
    props: {
      successCallback: {
        type: Function,
        required: false,
        default: null
      },
      requestedProduct: {
        type: Object,
        required: false,
        default: null
      }
    },
    computed: {
      ...mapGetters([
        'isCustomerMode',
        'isAgentMode'
      ])
    },
    components: {
      LoginCustomer,
      LoginAgent
    }
  }
</script>

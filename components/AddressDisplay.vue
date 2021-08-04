<template>
  <div v-if="address">
    <label class="address__label">{{ addressTitle }}:</label>
    <div class="address__text">
      <p class="address__p" v-if="address.owner_name">{{ ownerName }}</p>
      <p class="address__p" v-if="showContacts">{{ address.contact_name }} ({{ address.contact_number }})</p>
      <p class="address__p">{{ address.address }}</p>
      <p class="address__p">{{ address.area }}, {{ address.location }}</p>
    </div>    
  </div>
</template>

<script>
import { ADDRESS_TYPES } from '~/store/constants.yaml'
export default {
  props: ['addressTitle', 'address'],
  mounted () {
    if (this.address && this.address.location && (this.address.location.en || this.address.location.bn)) {
      this.address.location = this.__(this.address.location)
    }
  },
  computed: {
    ownerName () {
      return this.address && this.address.owner_name && (this.address.owner_name.en || this.address.owner_name.bn) ? this.__(this.address.owner_name) : this.address.owner_name
    },
    showContacts () {
      if (this.$route.name.includes('customer-orders-order_id') || this.$route.name.includes('support-tickets-ticket_id')) return true
      else if (this.$store.getters.isAgentMode && this.address.owner_type === ADDRESS_TYPES.AGENT) return true
      else if (this.address.owner_type === ADDRESS_TYPES.CUSTOMER) return true
      else return false
    }
  }
}
</script>

<style lang="sass" scoped>
  .address
      position: relative
      max-width: 735px
      background-color: #f5f5f5
      padding: 13px 15px
      font-style: normal
      line-height: 1.5
      &:not(:last-child)
        margin-bottom: 20px
      &__label
        font-size: 13px
        font-weight: 700
        color: #555
        display: block
        text-decoration: underline
        margin-bottom: 5px
      &__text
        position: relative
        // padding-right: 100px
      &__p
        font-weight: 400
        font-size: 13px
</style>

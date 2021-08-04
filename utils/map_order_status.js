export const getOrderStatus = {
  methods: {
    mapOrderStatus (orderStatus) {
      if (!this.enums.OrderStatus || !this.enums.FrontEndOrderStatus) {
        throw new Error('Both OrderStatus && FrontEndOrderStatus enums needs to be mixed into the component using enumMixinFactory', this)
      }

      const orderStatuses = this.enums.OrderStatus
      const frontendStatuses = this.enums.FrontEndOrderStatus

      if (orderStatus === null || orderStatus === orderStatuses.CREATED) {
        return frontendStatuses.PENDING
      }

      if ((orderStatus > orderStatuses.CREATED && orderStatus < orderStatuses.PARTIALLY_SHIPPED) || (orderStatus === orderStatuses.FULFILMENT_FAILED)) {
        return frontendStatuses.CONFIRMED
      }

      if (orderStatus >= orderStatuses.PARTIALLY_SHIPPED && orderStatus < orderStatuses.DELIVERED) {
        return frontendStatuses.SHIPPED
      }

      if (orderStatus === orderStatuses.DELIVERED) {
        return frontendStatuses.DELIVERED
      }

      if (orderStatus === orderStatuses.CANCELLED || orderStatus === orderStatuses.REFUNDED || orderStatus === orderStatuses.REFUND_PENDING) {
        return frontendStatuses.CANCELLED
      }

      return frontendStatuses.UNKNOWN
    }
  }
}

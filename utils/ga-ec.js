import { ENHANCE_ECOM } from '~/utils/ga-meta.yaml'
import { mapGetters } from 'vuex'
import find from 'lodash/find'

export const gaEnhancedEcom = {
  computed: {
    ...mapGetters([
      'cart'
    ]),
    isGaEnhancedEcomAvailable () {
      return this.$ga.ecommerce
    },
    ecConst () {
      return ENHANCE_ECOM
    }
  },
  methods: {
    getQtyOfCartItem (itemId) {
      return find(this.cart.items, { id: itemId })
    },
    gaEvent (param) {
      if (!this.isGaAvailable && !(this.isGaAvailable && param)) return
      this.$ga.event(param)
    },
    gaEcaddImpression (product) {
      if (!this.isGaEnhancedEcomAvailable && !(this.isGaEnhancedEcomAvailable && product)) return
      this.$ga.ecommerce.addImpression({
        id: product.id,
        name: product.name.en,
        variant: product.variant_name ? product.variant_name : this.ecConst.TEXT.NOT_APPLICABLE,
        price: product.unit_price,
        category: product.category,
        list: product.list
      })
    },
    gaEcAddProduct (items) {
      if (!this.isGaEnhancedEcomAvailable && !(this.isGaEnhancedEcomAvailable && items)) return

      for (let i = 0; i < items.length; i++) {
        let product = items[i]
        let productData = {
          id: product.id,
          name: product.name.en,
          variant: product.variant_name ? (product.variant_name.en ? product.variant_name.en : product.variant_name) : this.ecConst.TEXT.NOT_APPLICABLE,
          price: product.unit_price
        }

        if (product && product.qty) {
          productData.quantity = product.qty
        } else if (this.getQtyOfCartItem(product.id) && this.getQtyOfCartItem(product.id).qty) {
          productData.quantity = this.getQtyOfCartItem(product.id).qty
        }

        if (product.category) {
          productData.category = product.category
        }
        this.$ga.ecommerce.addProduct(productData)
      }
    },
    addProductForCheckoutMeasurement (cartItems, stepNumber) {
      this.gaEcAddProduct(cartItems)
      this.gaEcSetAction(this.ecConst.ACTIONS.CHECKOUT, {'step': stepNumber})
      this.gaEcPageViewSend()
    },
    gaEcSetAction (actionType, optionalObject = null) {
      if (!this.isGaEnhancedEcomAvailable && !(this.isGaEnhancedEcomAvailable && actionType)) return
      this.$ga.ecommerce.setAction(actionType, optionalObject)
    },
    gaEcPageViewSend () {
      if (!this.isGaEnhancedEcomAvailable) return
      this.$ga.query(this.ecConst.COMMANDS.SEND, this.ecConst.COMMANDS.PAGEVIEW)
    }
  }
}

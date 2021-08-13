<template>
  <div :class="[$style.item, {[$style.itemError]: !!cartItemInfo.error}]">
    <div :class="$style.itemImage">
      <div :class="$style.img">
        <div :class="$style.imgAspectRatio">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
            <use xlink:href="/svg/icons.svg?#i-camera"></use>
          </svg>
        </div>
        <div :class="$style.imgImage">
          <computed-image :meta="productImageInfo" :alt="__(cartItemInfo.name)"/>
        </div>
      </div>
    </div>
    <div :class="$style.itemInfo">
      <h3 :class="$style.itemInfoTitle">{{__(cartItemInfo.name)}}</h3>
      <div :class="$style.itemInfoStream">
        <template v-if="cartItem.qty > 1">
          <button :class="[$style.itemInfoBtn, $style.btn]" @click="decreaseQuantity()">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14">
              <use xlink:href="/svg/icons.svg?#i-minus"></use>
            </svg>
          </button>
        </template>
        <template v-else>
          <button :class="[$style.itemInfoBtn, $style.btn]" @click="removeItem()">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14">
              <use xlink:href="/svg/icons.svg?#i-delete"></use>
            </svg>
          </button>
        </template>
        <span :class="$style.itemInfoCount">{{cartItem.qty}}</span>
        <button :class="[$style.itemInfoBtn, $style.btn, {[$style.btnMuted]: cartItemInfo.error}]" @click="increaseQuantity()" :disabled="cartItemInfo.error">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14">
            <use xlink:href="/svg/icons.svg?#i-plus"></use>
          </svg>
        </button>
        <span :class="[$style.itemInfoMultiply, $style.btn]">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10">
            <use xlink:href="/svg/icons.svg?#i-close"></use>
          </svg>
        </span>
        <span :class="$style.itemInfoPrice">Tk. {{ __$(totalPrice) }}</span>
      </div>
    </div>
    <template v-if="cartItemInfo.error">
      <div :class="$style.itemValidation" v-if="cartItemInfo.error === 'NOT_ENOUGH_QTY' && productUpdateStatus !== 'Updated'">
        <p :class="$style.itemValidationCopy">{{ i18nText.desiredQuantity }}</p>
        <button :class="[$style.itemValidationBtn, $style.btn, $style.btnPrimary]" @click="updateItem">{{ i18nText.update }}</button>
      </div>

      <div :class="$style.itemValidation" v-if="cartItemInfo.error === 'OUT_OF_STOCK' && productUpdateStatus !== 'Requested'">
        <p :class="$style.itemValidationCopy">{{ i18nText.outStock }}</p>
        <button :class="[$style.itemValidationBtn, $style.btn, $style.btnPrimary]" @click="requestForProduct">{{ i18nText.request }}</button>
      </div>
    </template>
  </div>
</template>

<script>

  import {
    INCREASE_LINE_ITEM_QTY,
    DECREASE_LINE_ITEM_QTY,
    REMOVE_LINE_ITEM_FROM_CART,
    UPDATE_LINE_ITEM_PRICE_QTY,
    SET_OVERLAY_CONTEXT,
    ADDRESS_TYPES
  } from '~/store/constants.yaml'

  import { ENHANCE_ECOM } from '~/utils/ga-meta.yaml'

  import ProductRequest from '~/components/modals/ProductRequest'
  import i18nLink from '~/components/i18nLink'
  import i18nKeys from '~/components/layouts/cart/LineItem.i18n.yaml'
  import ComputedImage from '~/components/ComputedImage'

  import {
    i18nMixin,
    overlayMixin,
    makeDefaultImageMeta
  } from '~/utils'

  import {
    ga
  } from '~/utils/ga'

  import {
    gaEnhancedEcom
  } from '~/utils/ga-ec'

  import { productRequest } from '~/api'
  import find from 'lodash/find'
  import { mapGetters, mapState } from 'vuex'
  import logger from '~/utils/logger'

  const DEFAULT_IMAGE_SVG = ('/clients/bronx/icons/default-image-sm.svg')

  export default {
    mixins: [i18nMixin(i18nKeys), overlayMixin, ga, gaEnhancedEcom],
    props: {
      cartItemInfo: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        productUpdateStatus: ''
      }
    },
    computed: {
      ...mapGetters([
        'authToken',
        'isCustomerMode',
        'preferredDeliveryAddress',
        'isLoggedIn'
      ]),
      ...mapState([
        'pageMode',
        'customer'
      ]),
      notDeliverableToAgentWarning () {
        if (!this.pageMode.checkoutMode && this.preferredDeliveryAddress) {
          let isPreferredAddressAgent = this.preferredDeliveryAddress.owner_type === ADDRESS_TYPES.AGENT
          let isItemNotDeliverableToAgent = !this.cartItemInfo.is_deliverable_to_agent
          return isItemNotDeliverableToAgent && isPreferredAddressAgent
        }
        return false
      },
      notDeliverableToLockerWarning () {
        if (!this.pageMode.checkoutMode && this.preferredDeliveryAddress) {
          let isPreferredAddressLocker = this.preferredDeliveryAddress.owner_type === ADDRESS_TYPES.LOCKER
          let isItemNotDeliverableToLocker = !this.cartItemInfo.is_deliverable_to_locker
          return isItemNotDeliverableToLocker && isPreferredAddressLocker
        }
        return false
      },
      cartItem () {
        return find(this.$store.state.cart.items, { id: this.cartItemInfo.id })
      },
      productUrl () {
        let variantSlug = this.cartItemInfo.variant_slug ? `/${this.cartItemInfo.variant_slug}` : ''
        let url = `/product/${this.cartItemInfo.slug + variantSlug}`
        return url
      },
      productImageUrl () {
        return this.cartItemInfo && this.cartItemInfo.images && this.cartItemInfo.images.length ? this.cartItemInfo.images[0] : ('/clients/bronx/icons/default-image-sm.svg')
      },
      productImageInfo () {
        return this.cartItemInfo && this.cartItemInfo.image_info && this.cartItemInfo.image_info.length ? this.cartItemInfo.image_info[0] : makeDefaultImageMeta(DEFAULT_IMAGE_SVG)
      },
      price () {
        return this.cartItem.discounted_price || this.cartItem.price
      },
      totalPrice () {
        return this.price * this.cartItem.qty
      },
      savedAmount () {
        return this.cartItemInfo.discounted_price ? (this.cartItemInfo.unit_price - this.cartItemInfo.discounted_price) * this.cartItem.qty : 0
      },
      isMinusButtonDisabled () {
        return this.cartItem.qty === 1
      },
      isPlusButtonDisabled () {
        return this.cartItem.qty === this.cartItemInfo.availale_quantity
      }
    },
    components: {
      i18nLink,
      ComputedImage,
      ProductRequest
    },
    methods: {
      increaseQuantity () {
        this.gaEvent({
          eventCategory: this.gaCategoriesMeta.CART.NAME,
          eventAction: this.gaCategoriesMeta.CART.ACTIONS.PLUS_ICON,
          eventValue: 1
        })

        this.$store.dispatch(INCREASE_LINE_ITEM_QTY, this.cartItem)
          .catch(error => {
            logger.error(INCREASE_LINE_ITEM_QTY, error)
          })
      },
      decreaseQuantity () {
        this.gaEvent({
          eventCategory: this.gaCategoriesMeta.CART.NAME,
          eventAction: this.gaCategoriesMeta.CART.ACTIONS.MINUS_ICON,
          eventValue: 1
        })

        this.$store.dispatch(DECREASE_LINE_ITEM_QTY, this.cartItem)
          .catch(error => {
            logger.error(DECREASE_LINE_ITEM_QTY, error)
          })
      },
      removeItem () {
        this.gaEvent({
          eventCategory: this.gaCategoriesMeta.CART.NAME,
          eventAction: this.gaCategoriesMeta.CART.ACTIONS.REMOVE_ICON,
          eventValue: 1
        })

        // *************************************************************************
        // Measuring removal of a product(s) from shopping cart
        if (!this.cartItemInfo.error) {
          let addProductData = [{
            id: this.cartItemInfo.id,
            name: this.cartItemInfo.name,
            variant_name: this.cartItemInfo.variant_name,
            unit_price: this.cartItemInfo.unit_price
          }]
          this.gaEcAddProduct(addProductData)
          this.gaEcSetAction(ENHANCE_ECOM.ACTIONS.REMOVE)
          this.gaEcPageViewSend()
        }
        // *************************************************************************

        this.$store.dispatch(REMOVE_LINE_ITEM_FROM_CART, this.cartItem)
      },
      requestForProduct () {
        const vm = this
        function updateProductRequest () {
          if (vm.isLoggedIn) {
            return productRequest(vm.authToken, vm.cartItem.id)
              .then(() => {
                vm.productUpdateStatus = 'Requested'
                if (!vm.isOverlayOpen(vm.overlays.aside2)) {
                  vm.openOverlay(vm.overlays.aside2)
                }
                if (vm.isOverlayOpen(vm.overlays.requestModal)) {
                  vm.closeOverlay(vm.overlays.requestModal)
                }
                setTimeout(() => {
                  vm.$store.commit(REMOVE_LINE_ITEM_FROM_CART, vm.cartItem)
                }, 4000)
              })
              .catch((reason) => {

              })
          }
        }
        if (this.customer) {
          this.productUpdateStatus = 'Requested'
          setTimeout(() => {
            this.$store.dispatch(REMOVE_LINE_ITEM_FROM_CART, this.cartItem)
          }, 2000)
        } else {
          let contextObj = {
            product: {
              name: this.name,
              image: this.imageUrl
            },
            callback: updateProductRequest
          }
          this.$store.commit(SET_OVERLAY_CONTEXT, contextObj)
          this.openOverlay(this.overlays.requestModal)
          this.productUpdateStatus = 'Request'
        }
      },
      updateItem () {
        this.$store.dispatch(UPDATE_LINE_ITEM_PRICE_QTY, {
          cartItem: this.cartItem,
          cartItemInfo: this.cartItemInfo
        })
      }
    }
  }
</script>


<style lang="sass" module>
  @import "shared/button"
  @import "shared/img"
  @import "shared/cart-item"
</style>

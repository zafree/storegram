<template>
  <div :class="['item', {'error': !!cartItemInfo.error}]">
    <div class="item__image">
      <computed-image :meta="productImageInfo" :alt="__(cartItemInfo.name)"/>
    </div>
    <div class="item__content">
      <h3 class="item__title">{{__(cartItemInfo.name)}}</h3>
      <div class="item__stream">
        <button class="minus" @click="decreaseQuantity()" :disabled="isMinusButtonDisabled"></button>
        <span class="count">{{cartItem.qty}}</span>
        <button class="plus" @click="increaseQuantity()" :disabled="isPlusButtonDisabled"></button>
        <span class="multiply"></span>
        <span class="price">Tk. {{ __$(totalPrice) }}</span>
      </div>
    </div>
    <button class="item__delete" @click="removeItem()">
      <svg viewBox="0 0 32 32" width="14px" height="14px">
        <g>
          <path d="M22.2,4.8V2.1c0-1.2-0.9-2.1-2.1-2.1h-8.2c-1.2,0-2.1,0.9-2.1,2.1v2.7H1.1v2.5h2.6l2.1,23.5
            C5.8,31.5,6.4,32,7,32h17.9c0.6,0,1.2-0.5,1.2-1.1l2.1-23.5h2.7V4.8H22.2z M12.3,2.5h7.4v2.3h-7.4V2.5z M23.8,29.5H8.2l-2-22.2
            h19.5L23.8,29.5z"/>
          <rect x="11.9" y="17.1" transform="matrix(3.667855e-02 -0.9993 0.9993 3.667855e-02 0.231 37.0335)" width="14.8" height="2.5"/>
          <rect x="11.4" y="11" transform="matrix(0.9993 -3.666115e-02 3.666115e-02 0.9993 -0.6661 0.477)" width="2.5" height="14.8"/>
        </g>
      </svg>
    </button>
    <template v-if="cartItemInfo.error">
      <div class="item__validation" v-if="cartItemInfo.error === 'NOT_ENOUGH_QTY' && productUpdateStatus !== 'Updated'">
        <p>{{ i18nText.desiredQuantity }}</p>
        <button @click="updateItem">{{ i18nText.update }}</button>
      </div>

      <div class="item__validation" v-if="cartItemInfo.error === 'OUT_OF_STOCK' && productUpdateStatus !== 'Requested'">
        <p>{{ i18nText.outStock }}</p>
        <button @click="requestForProduct">{{ i18nText.request }}</button>
      </div>
      
      
      <div class="item__validation" v-if="cartItemInfo.error === 'NOT_FOUND' && productUpdateStatus !== 'Requested'">
        <p>{{ i18nText.outStock }}</p>
        <button @click="requestForProduct">{{ i18nText.request }}</button>
      </div>
     
     <!-- <div class="item__validation" v-if="cartItemInfo.error === 'NOT_FOUND'" :class="$style.hint">
        <div :class="$style.hintBrief">{{ i18nText.notInventory }}</div>
        <div :class="$style.hintInlineButton">
          <button @click="removeItem" type="button" :class="$style.button">{{ i18nText.delete }}</button>
        </div>
      </div> -->
    </template>

  </div>
  <!-- <div :class="[ $style.cart, { [$style.cartError]: !!cartItemInfo.error }, { [$style.cartWarning]: (notDeliverableToAgentWarning || notDeliverableToLockerWarning)}]">
    <button :class="[$style.button, $style.buttonClose]" @click="removeItem()">
      <span :class="$style.buttonIconTimes"></span>
    </button>
    <div :class="$style.cartKeek">
      <div :class="$style.cartHero">
        <computed-image :class="$style.cartImage" :meta="productImageInfo" :alt="__(cartItemInfo.name)"/>
      </div>
      <div :class="$style.cartTitle">
        <i18n-link :class="$style.cartTitleLink" :to="productUrl">{{__(cartItemInfo.name)}}</i18n-link>
      </div>
    </div>
    <div :class="$style.cartAmount">
      <div :class="$style.cartAmountPrice">৳ {{ __$(price) }}</div>
      <div :class="$style.cartAmountCount">
        <button :class="[$style.button, $style.buttonCount, { [$style.buttonDisabled]: isMinusButtonDisabled } ]" @click="decreaseQuantity()">
          <span :class="$style.buttonIconMinus"></span>
        </button>
        <span :class="$style.cartAmountQuantity">{{cartItem.qty}}</span>
        <button :class="[$style.button, $style.buttonCount]" @click="increaseQuantity()" :disabled="isPlusButtonDisabled">
          <span :class="$style.buttonIconPlus"></span>
        </button>
      </div>
      <div :class="$style.cartAmountTotal">৳ {{ __$(cartItem.item_total) }}</div>
    </div>
    <div :class="$style.cartReduction" v-if="savedAmount > 0">
      {{ i18nText.saveItem1 }} ৳{{ __$(savedAmount) }} {{ i18nText.saveItem2 }}
    </div>

    <div v-if="cartItemInfo.error" :class="$style.cartValidation">
      state 1
      <div v-if="cartItemInfo.error === 'NOT_ENOUGH_QTY' && productUpdateStatus !== 'Updated'" :class="$style.hint">
        <div :class="$style.hintBrief">{{ i18nText.desiredQuantity }}</div>
        <div :class="$style.hintInlineButton">
          <button @click="updateItem" type="button" :class="$style.button">{{ i18nText.update }}</button>
        </div>
      </div>
      state 2
      <div v-if="productUpdateStatus === 'Requested'">{{ i18nText.productRequested }}</div>
      <div v-if="cartItemInfo.error === 'OUT_OF_STOCK' && productUpdateStatus !== 'Requested'" :class="$style.hint">
        <div :class="$style.hintBrief">{{ i18nText.outStock }}</div>
        <div :class="$style.hintInlineButton">
          <button @click="removeItem" type="button" :class="[$style.button, $style.buttonLine]">{{ i18nText.delete }}</button>
          <button @click="requestForProduct" type="button" :class="$style.button">{{ i18nText.request }}</button>
        </div>
      </div>
      state 3
      <div v-if="cartItemInfo.error === 'DISCONTINUED'" :class="$style.hint">
        <div :class="$style.hintBrief">{{ i18nText.productDiscountinued }}</div>
        <div :class="$style.hintInlineButton">
          <button @click="removeItem" type="button" :class="$style.button">{{ i18nText.delete }}</button>
        </div>
      </div>
      state 4
      <div v-if="cartItemInfo.error === 'PRICE_CHANGED' && productUpdateStatus !== 'Updated'" :class="$style.hint">
        <div :class="$style.hintBrief">{{ i18nText.priceChanged }}</div>
        <div :class="$style.hintInlineButton">
          <button @click="updateItem" type="button" :class="$style.button">{{ i18nText.update }}</button>
        </div>
      </div>
      state 5
      <div v-if="cartItemInfo.error === 'COMMISSION_CHANGED' && productUpdateStatus !== 'Updated'" :class="$style.hint">
        <div :class="$style.hintBrief">{{ i18nText.commissionChanged }}</div>
        <div :class="$style.hintInlineButton">
          <button @click="updateItem" type="button" :class="$style.button">{{ i18nText.update }}</button>
        </div>
      </div>
      state 6
      <div v-if="cartItemInfo.error === 'NOT_FOUND'" :class="$style.hint">
        <div :class="$style.hintBrief">{{ i18nText.notInventory }}</div>
        <div :class="$style.hintInlineButton">
          <button @click="removeItem" type="button" :class="$style.button">{{ i18nText.delete }}</button>
        </div>
      </div>
      state 7
      <div v-if="cartItemInfo.error === 'NOT_DELIVERABLE_TO_AGENT'" :class="$style.hint">
        <div :class="$style.hintBrief">{{ i18nText.notDeliverableAgent }}</div>
        <div :class="$style.hintInlineButton">
          <button @click="removeItem" type="button" :class="$style.button">{{ i18nText.delete }}</button>
        </div>
      </div>
      state 8
      <div v-if="cartItemInfo.error === 'NOT_DELIVERABLE_TO_LOCKER'" :class="$style.hint">
        <div :class="$style.hintBrief">{{ i18nText.notDeliverableLocker }}</div>
        <div :class="$style.hintInlineButton">
          <button @click="removeItem" type="button" :class="$style.button">{{ i18nText.delete }}</button>
        </div>
      </div>
    </div>
    <div v-if="!cartItemInfo.error && (notDeliverableToAgentWarning || notDeliverableToLockerWarning)" :class="$style.cartValidation">
      <div v-if="notDeliverableToAgentWarning" :class="$style.hint">
        <div :class="$style.hintBrief" class="hint__brief--desktopOnly">{{ i18nText.notDeliverableAgentTitle }}</div>
        <div :class="$style.hintBrief" class="hint__brief--mobileOnly" v-if="isCustomerMode">{{ i18nText.notDeliverableAgentWarning }}</div>
        <div :class="$style.hintBrief" class="hint__brief--mobileOnly" v-else>{{ i18nText.notDeliverableAgentAgent }}</div>
      </div>
      <div v-if="notDeliverableToLockerWarning" :class="$style.hint">
        <div :class="$style.hintBrief" class="hint__brief--desktopOnly">{{ i18nText.notDeliverableLockerTitle }}</div>
        <div :class="$style.hintBrief" class="hint__brief--mobileOnly">{{ i18nText.notDeliverableLockerWarning }}</div>
      </div>
    </div>
  </div> -->
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

<style lang="sass" scoped>
  .item__validation
    z-index: 11
    position: relative
    width: 100%
    display: flex
    flex-flow: row wrap
    align-items: center
    margin-top: 5px
    margin-bottom: 10px
    p
      font-size: 12px
      color: $red
      flex: 1
      // margin-top: 1px
    button
      +button
      padding: 0 12px
      height: 28px
      background-color: $red
      color: $white
      font-size: 12px
      border-radius: 0
      // margin-top: 4px
      font-weight: $weight-medium
      margin-left: 5px

  .item
    margin-top: 20px
    position: relative
    display: flex
    flex-flow: row wrap
    // background-color: rgba($black, 0.03)
    &.error
      &::after
        content: ""
        z-index: 10
        position: absolute
        top: 0
        left: 0
        right: 0
        bottom: 0
        background-color: rgba($white, 0.5)
      .item__delete
        z-index: 11
        fill: $red
    &__image
      width: 70px
      height: 70px
      min-width: 70px
      min-height: 70px
      background-color: #EBEBEB
      overflow: hidden
    &__content
      flex: 1
      position: relative
      // background-color: rgba($black, 0.03)
      width: 100%
      padding-left: 10px
    &__title
      font-size: 14px
      line-height: 1.33
      max-width: 160px
    &__stream
      margin-top: 8px
      position: relative
      display: inline-flex
      width: 100%
      // background-color: rgba($primary, 0.1)
      .minus,
      .plus
        +button
        padding: 0
        height: 21px
        width: 21px
        background-color: #EBEBEB
        &:disabled
          cursor: default
        &::before
          content: ""
          position: absolute
          top: 0
          left: 0
          width: 9px
          height: 1px
          background-color: $black
          margin-top: 10px
          margin-left: 6px
      .plus
        &::after
          content: ""
          position: absolute
          top: 0
          left: 0
          width: 1px
          height: 9px
          background-color: $black
          margin-top: 6px
          margin-left: 10px
      .count,
      .price
        display: block
        height: 21px
        font-size: 12px
        line-height: 22px
      .count
        width: 21px
        color: $black
        text-align: center
      .multiply
        position: relative
        display: block
        width: 21px
        height: 21px
        // background-color: rgba($primary, 0.1)
        margin-left: 4px
        &::before,
        &::after
          content: ""
          position: absolute
          top: 0
          left: 0
          width: 7px
          height: 1px
          background-color: #666666
          margin-top: 11px
          margin-left: 7px
          transform-origin: center center
        &::before
          transform: rotate(45deg)
        &::after
          transform: rotate(135deg)
      .price
        margin-left: -3px
        color: #666666
    &__delete
      +button
      position: absolute
      top: 0
      right: 0
      padding: 0
      // background-color: rgba($black, 0.1)
      height: 22px
      width: 22px
      display: inline-flex
      justify-content: center
      align-items: center
      margin-right: -3px
      fill: #aaaaaa

    // svg
    //   background-color: rgba($primary, 0.1)

</style>

<style lang="sass" scoped>
  .hint
    &__brief
      &--mobileOnly
        +desktop
          display: none
      &--desktopOnly
        display: none
        +desktop
          display: block

</style>


<style lang="sass" module>
  @import "shared/cart-item"
  @import "shared/button"

  .Button
    &__close
      position: absolute
      right: 0
      top: 0
      // background-color: rgba($black, .1)
      height: 30px
      width: 30px
      display: inline-flex
      justify-content: center
      z-index: 2
      padding: 0
    &__IconTimes
      position: relative
      width: 9px
      height: 9px
      &::before,
      &::after
        content: ''
        position: absolute
        width: 11px
        height: 1px
        left: 0
        margin-top: 4px
        margin-left: -1px
        background-color: #aaa
        transform-origin: center
      &::before
        transform: rotate(45deg)
      &::after
        transform: rotate(135deg)

    &__iconMinus,
    &__iconPlus
      position: relative
      width: 9px
      height: 1px
      background-color: rgba($black, .33)
    &__iconPlus
      &::after
        content: ''
        position: absolute
        width: 9px
        height: 1px
        left: 0
        background-color: rgba($black, .33)
        transform-origin: center center
        transform: rotate(90deg)
    &--count
      background-color: rgba($black, .1)
      display: inline-flex
      justify-content: center
      height: 30px
      width: 24px
      border-radius: 0
    &--disabled
      pointer-events: none
      opacity: .55

</style>

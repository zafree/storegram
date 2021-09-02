<template>
  <div :class="$style.product" v-if="currentVariant">
    <div :class="$style.productName">
      <span :class="$style.label">ID# {{currentVariant.id}}</span>
      <h1 :class="$style.title">{{ name }}</h1>
    </div>
    <div :class="$style.productDetails">
      <div :class="[$style.productGallery, $style.gallery]">
        <div :class="$style.img">
          <div :class="$style.imgAspectRatio">
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50">
              <use xlink:href="/svg/icons.svg?#i-camera"></use>
            </svg>
          </div>
          <div :class="[$style.imgImage, $style.uZoomIn]">
            <computed-image
              :meta="currentImage"
              :animate="false"
              @click="openProductImageZoomMode()"
              :alt="name"
              :title="name"
              @imageLoaded="imageIsLoaded = true"/>
          </div>
        </div>
        <ul :class="$style.galleryList" v-if="productImages.length > 2">
          <li
            v-for="(img, index) in productImages"
            :key="img.url"
            :class="[$style.img, $style.galleryItem, {[$style.galleryItemActive]: (index === currentProductImageIndex)}]"
            @click="changeProductHeroImg(index)">

            <div :class="$style.imgAspectRatio">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                <use xlink:href="/svg/icons.svg?#i-camera"></use>
              </svg>
            </div>
            <div :class="$style.imgImage">
              <computed-image
                :meta="img"
                :animate="false"
                :alt="name"
                :title="name"/>
            </div>
          </li>
        </ul>
      </div>
      <div :class="$style.productInfo">
        <div :class="$style.productAppearance">
          <template v-if="hasVariant">
            <div :class="[$style.productVariant, $style.variant]" v-for='attr in varyingAttributes' :key="attr.code">
              <label :class="$style.variantLabel">{{ __(attr.name) }}:</label>
              <div :class="$style.variantList">
                <div
                  :class="[$style.variantItem, $style.variantItemText, { [$style.variantItemActive]: data.active, [$style.variantItemMuted]: data.muted } ]"
                  v-for="data in attr.values"
                  :key="attr.code + ':' + data.value"
                  v-if="data.linkPath">
                  <i18n-link :class="$style.link" :to="data.linkPath">{{ __(data.i18n_value) }} {{ __(data.i18n_unit) }}</i18n-link>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div :class="[$style.productPrice, $style.price]">
          <div :class="$style.priceTopBlock">
            <template v-if="!currentVariant.out_of_stock && discount">
              <span :class="$style.priceUnit">{{ __$(currentVariant.unit_price) }}</span>
              <span :class="$style.priceDiscount">{{ i18nText.save }} {{ __$(discount) }}</span>
            </template>
            <div :class="$style.priceStockOut" v-if="currentVariant.out_of_stock">{{ i18nText.outStock  }}</div>
          </div>
          <div :class="$style.priceDiscounted">Tk. {{ __$(currentVariant.discounted_price) }}</div>

          <div :class="$style.productAction">
            <template v-if="currentVariant.out_of_stock">
              <p v-if="productRequestMsg" :class="$style.copy">{{productRequestMsg}}</p>
              <button v-else
                :class="[$style.btn, $style.btnLight]"
                @click="requestForProduct()">
                {{ i18nText.request }}
              </button>
            </template>
            <template v-else>
              <button
                :class="[$style.btn, $style.btnPrimary]"
                @click.stop="buyNow()">
                {{ i18nText.buyNow }}
              </button>
              <button v-if="!checkoutWithEMI"
                :class="[$style.btn, $style.btnLine]"
                @click="addToCart()">
                {{ i18nText.addCart }}
              </button>
            </template>
          </div>
        </div>

        <section :class="[$style.productDesc, $style.desc]" v-if="isDescriptionAvailable">
          <h2 :class="$style.descHeading">{{$t('product.description_label')}}</h2>
          <template v-if="descriptionMd">
            <article>
              <vue-markdown>{{ descriptionMd }}</vue-markdown>
            </article>
          </template>
          <template v-else>
            <article v-html="description"></article>
          </template>
        </section>
      </div>



    </div>

    <div :class="[$style.modal, $style.modalZoomImage]" v-show="productImageInZoomMode">
      <div :class="$style.modalOverlay" @click="closeProductImageZoomMode()"></div>
      <div :class="$style.modalContent">
        <div :class="$style.img">
          <div :class="$style.imgAspectRatio">
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50">
              <use xlink:href="/svg/icons.svg?#i-camera"></use>
            </svg>
          </div>
          <div :class="$style.imgImage">
            <computed-image
              :meta="currentImage"
              :animate="false"
              :alt="name"
              :title="name"
              @imageLoaded="imageIsLoaded = true"/>
          </div>
        </div>
        <button :class="$style.modalClose" @click="closeProductImageZoomMode()">
          <svg viewBox="0 0 32 32">
            <path d="M26.3,7.9l-2.1-2.1L16,13.9L7.9,5.7L5.7,7.9l8.1,8.1l-8.1,8.1l2.1,2.1l8.1-8.1l8.1,8.1l2.1-2.1
              L18.1,16L26.3,7.9z"/>
          </svg>
        </button>
        <button :class="$style.prev" v-if="productImages.length > 1" @click="prevProductHeroImage()">
          <svg viewBox="0 0 32 32">
            <path id="Path_22" d="M4.6,16L15,5.6v8.2h12.4v4.3H15v8.2L4.6,16z"/>
          </svg>
        </button>
        <button :class="$style.next" v-if="productImages.length > 1" @click="nextProductHeroImage()">
          <svg viewBox="0 0 32 32">
            <path id="Path_22" d="M4.6,16L15,5.6v8.2h12.4v4.3H15v8.2L4.6,16z" transform="translate(32, 32) rotate(180) "/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>

  import find from 'lodash/find'
  import pick from 'lodash/pick'
  import i18nLink from '~/components/i18nLink'
  import LazyImage from '~/components/LazyImage'
  import ComputedImage from '~/components/ComputedImage'
  import DeliverableInfo from '~/components/catalog/DeliverableInfo'
  import enumMixinFactory from '~/utils/enum_mixin_factory'
  import OfferLogoImage from '~/components/catalog/OfferLogoImage.vue'
  import VueMarkdown from 'vue-markdown'

  import {
    overlayMixin,
    i18nMixin,
    i18nRedirect,
    getRandomColorCssClass,
    calculateEmi
  } from '~/utils'

  import {
    ga
  } from '~/utils/ga'

  import {
    gaEnhancedEcom
  } from '~/utils/ga-ec'

  import logger from '~/utils/logger'
  import { mapState, mapGetters } from 'vuex'

  import {
    productRequest
  } from '~/api'

  import {
    ADD_PRODUCT_TO_CART,
    ADD_PRODUCT_TO_EMI_CART,
    OVERLAY_ASIDE_2,
    OVERLAY_PRODUCT_IMAGE,
    OPEN_PRODUCT_VARIANT_MODAL,
    CLOSE_PRODUCT_VARIANT_MODAL,
    SET_OVERLAY_CONTEXT,
    API_ERRORS,
    BUY_NOW,
    BUY_NOW_WITH_EMI,
    ADD_TO_CART,
    CASHBACK
  } from '~/store/constants.yaml'

  import { ENHANCE_ECOM } from '~/utils/ga-meta.yaml'

  function getVariantLink (variant) {
    return `/product/${variant.slug}` + (variant.variant_slug ? `/${variant.variant_slug}` : '')
  }

  function findVariantWithOtherAttrActiveValues (variants, attrCodeValue, otherAttrCodeValues) {
    let result = variants.filter((v) => find(v.attributes, attrCodeValue))
    otherAttrCodeValues.forEach((otherAttrCodeValue) => {
      result = result.filter((v) => find(v.attributes, otherAttrCodeValue))
    })
    return result.length ? result[0] : null
  }

  function updateProductRequest (vm) {
    if (vm.isLoggedIn) {
      return productRequest(vm.authToken, vm.currentVariant.id)
        .then(() => {
          vm.productRequestMsg = vm.i18nText.requested
        })
        .catch((reason) => {
          switch (reason.error) {
            case API_ERRORS.ALREADY_REQUESTED:
              vm.productRequestMsg = vm.__e(API_ERRORS.ALREADY_REQUESTED)
              break
          }
        })
    }
  }

  // const DEFAULT_IMAGE_SVG = ('/clients/bronx/icons/default-image.svg')

  export default {
    mixins: [i18nMixin('ProductDetails'), overlayMixin, enumMixinFactory('AdvancePayment'), ga, gaEnhancedEcom],
    props: {
      'product': {
        type: Object,
        required: true
      },
      'currentVariant': {
        type: Object,
        default: null
      },
      'cashbackindex': {
        type: Number
      }
    },
    data () {
      return {
        currentProductImageIndex: 0,
        productRequestMsg: null,
        productImageInZoomMode: false,
        imageIsLoaded: false,
        checkoutWithEMI: false,
        FPCarouselOptions: {
          contain: true,
          // initialIndex: 3,
          prevNextButtons: false,
          pageDots: true,
          wrapAround: true,
          selectedAttraction: 0.15,
          friction: 0.8
          // arrowShape: 'M14.5,50l32.3-32.3v25.7h38.6v13.3H46.8v25.7L14.5,50z'
        },
        mainImgOtions: {
          initialIndex: 0,
          prevNextButtons: false,
          // pageDots: false,
          wrapAround: false
        },
        navImgOtions: {
          asNavFor: '.targetGallery',
          freeScroll: false,
          contain: true,
          prevNextButtons: false,
          pageDots: false,
          wrapAround: true
        }
        // FPCarouselNavOptions: {
        //   contain: true,
        //   pageDots: false,
        //   asNavFor: this.$refs.FPCarouselOptions
        // }
      }
    },
    computed: {
      ...mapState([
        'toggleCommission',
        'ui',
        'customer'
      ]),
      ...mapGetters([
        'agentToken',
        'isAgentMode',
        'isCustomerMode',
        'preferredDeliveryAddress',
        'bkashCashBack',
        'cityBankAmericanExpressCashBack',
        'eblCashBack',
        'masterCardCashBack',
        'cashBackList',
        'authToken',
        'isLoggedIn'
      ]),
      description () {
        return this.__(this.currentVariant.description)
      },
      descriptionMd () {
        return this.__(this.currentVariant.description_md)
      },
      isDescriptionAvailable () {
        return !!(this.description || this.descriptionMd)
      },
      isVegan () {
        return this.currentVariant.is_vegan
      },
      isCrueltyFree () {
        return this.currentVariant.is_cruelty_free
      },
      isAdvancePaymentEnabled () {
        return this.currentVariant.advance_payment
      },
      addPercentSign () {
        return this.currentVariant.advance_payment.type === this.enums.AdvancePayment.FIXED
      },
      addTkSign () {
        return this.currentVariant.advance_payment.type === this.enums.AdvancePayment.PERCENTILE
      },
      translatedAmount () {
        return this.$t('advanced_payment.amount', { amount: this.__$(this.getAmount) })
      },
      getAmount () {
        return this.currentVariant.advance_payment.value
      },
      showBkashLogo () {
        return this.cashBackList[this.cashbackindex] === CASHBACK.BKASH
      },
      showcityBankLogo () {
        return this.cashBackList[this.cashbackindex] === CASHBACK.CITYBANK
      },
      showEblLogo () {
        return this.cashBackList[this.cashbackindex] === CASHBACK.EBL
      },
      showMastercardLogo () {
        return this.cashBackList[this.cashbackindex] === CASHBACK.MASTERCARD
      },
      showVariantModalForSmallDevice () {
        return this.ui.showVariantModal
      },
      hasVerifiedMobile () {
        return this.$store.getters.userHasVerifiedNumbers
      },
      name () {
        return this.__(this.currentVariant.name) + (this.hasVariant ? ' ' + this.__(this.currentVariant.variant_name) : '')
      },
      detailPageUrl () {
        return getVariantLink(this.currentVariant)
      },
      discount () {
        return this.currentVariant.discounted_price ? (this.currentVariant.unit_price - this.currentVariant.discounted_price) : null
      },
      emi () {
        if (!this.currentVariant.emi_tenures) return null
        return this.currentVariant.emi_tenures.map(month => {
          const amount = Math.ceil(this.currentVariant.discounted_price / month)
          return {
            month,
            amount
          }
        })
      },
      emiBankList () {
        if (this.currentVariant.emi_tenures && this.currentVariant.emi_tenures.length === 0) return
        return this.currentVariant.emi_supported_banks
      },
      emiStartsFrom () {
        if (this.currentVariant && this.currentVariant.emi_tenures) {
          const emiTenures = this.currentVariant.emi_tenures
          if (!emiTenures || !Array.isArray(emiTenures) || !emiTenures.length) return null

          return calculateEmi(this.currentVariant.discounted_price, emiTenures)
        }
        return null
      },
      offers () {
        if (!this.product.offers) return
        return this.product.offers
      },
      hasVariant () {
        return this.variants.length > 0
      },
      variants () {
        return this.product.variants || []
      },
      productImages () {
        if (this.currentVariant && this.currentVariant.image_info && this.currentVariant.image_info.length) {
          return this.currentVariant.image_info
        } else {
          return []
        }
      },
      currentImage () {
        return this.productImages.length ? this.productImages[this.currentProductImageIndex] : null
      },
      varyingAttributes () {
        let varyingAttributes = []
        if (!this.hasVariant || !this.product.varies_on || !this.product.varies_on.length) {
          return varyingAttributes
        }

        this.product.varies_on.forEach((attrCode) => {
          let attrInfo = {
            code: attrCode,
            values: []
          }

          this.variants.forEach((v) => {
            let attr = v.attributes.find((a) => a.code === attrCode)
            if (!attrInfo.name) {
              attrInfo.name = attr.name
            }

            // logger.log('attr', JSON.stringify(attr, null, '\t'))

            let valueInfo = {
              active: (this.currentVariant.id === v.id),
              muted: false,
              ...(pick(attr, ['value', 'i18n_value', 'i18n_unit']))
            }

            let prevIndex = attrInfo.values.findIndex(a => a.value === attr.value)

            if (prevIndex > -1) {
              if (valueInfo.active) {
                this.$set(attrInfo.values, prevIndex, valueInfo)
              }
            } else {
              attrInfo.values.push(valueInfo)
            }
          })
          varyingAttributes.push(attrInfo)
        })

        varyingAttributes.forEach((va) => {
          va.values.forEach((vInfo) => {
            if (vInfo.active) {
              vInfo.linkPath = getVariantLink(this.currentVariant)
            } else {
              let otherAttrActiveValueInfo = varyingAttributes
                .filter((a) => a.code !== va.code)
                .map((a) => {
                  return {code: a.code, value: find(a.values, {active: true}).value}
                })

              let variant = findVariantWithOtherAttrActiveValues(this.variants, {code: va.code, value: vInfo.value}, otherAttrActiveValueInfo)

              if (variant) {
                vInfo.linkPath = getVariantLink(variant)
              } else {
                vInfo.muted = true
                variant = find(this.variants, (v) => {
                  return vInfo.value === find(v.attributes, {code: va.code}).value
                })

                if (variant) {
                  vInfo.linkPath = getVariantLink(variant)
                } else {
                  vInfo.linkPath = null
                }
              }
            }
          })
        })

        return varyingAttributes
      },
      randomColorClass () {
        return this.$style[getRandomColorCssClass(this.name)]
      }
    },
    methods: {
      // imageShow (index) {
      //   return this.product.offers[index].logo_image
      // },
      openProductImageZoomMode () {
        if (this.imageIsLoaded) {
          this.openOverlay(OVERLAY_PRODUCT_IMAGE)
          this.productImageInZoomMode = true
        }
      },
      closeProductImageZoomMode () {
        this.closeOverlayIfOpen(OVERLAY_PRODUCT_IMAGE)
        this.productImageInZoomMode = false
      },
      currentAttribute (attrCode) {
        if (attrCode) {
          let result = find(this.currentVariant.attributes, {'code': attrCode})
          return `${this.__(result.i18n_value)} ${this.__(result.i18n_unit ? result.i18n_unit : '')}`
        } else {
          return null
        }
      },
      changeProductHeroImg (heroImgIndex) {
        this.currentProductImageIndex = heroImgIndex
      },
      nextProductHeroImage () {
        let tempImgIndex = this.currentProductImageIndex + 1
        if (tempImgIndex > (this.productImages.length - 1)) {
          this.currentProductImageIndex = 0
        } else {
          this.currentProductImageIndex = tempImgIndex
        }
      },
      prevProductHeroImage () {
        let tempImgIndex = this.currentProductImageIndex - 1

        if (tempImgIndex < 0) {
          this.currentProductImageIndex = (this.productImages.length - 1)
        } else {
          this.currentProductImageIndex = tempImgIndex
        }
      },
      addToCart () {
        this.gaEvent({
          eventCategory: this.gaCategoriesMeta.PRODUCT_CARD.NAME,
          eventAction: this.gaCategoriesMeta.PRODUCT_CARD.ACTIONS.ADD_TO_CART,
          eventLabel: this.name
        })

        // *************************************************************************
        // Measuring addition of a product(s) to a shopping cart

        let addProductData = [{
          id: this.product.id,
          name: this.product.name,
          variant_name: this.product.variant_name,
          unit_price: this.product.unit_price
        }]
        this.gaEcAddProduct(addProductData)
        this.gaEcSetAction(ENHANCE_ECOM.ACTIONS.ADD)
        this.gaEcPageViewSend()
        // *************************************************************************

        if (this.isAgentMode && !this.agentToken) {
          let contextObj = {
            cartItemBeforeAgentLogin: this.currentVariant,
            choosedAction: ADD_TO_CART
          }
          this.$store.commit(SET_OVERLAY_CONTEXT, contextObj)
          this.openOverlay(this.overlays.loginModal)
        } else {
          return this.$store.dispatch(ADD_PRODUCT_TO_CART, this.currentVariant)
            .then(response => {
              this.openOverlay(OVERLAY_ASIDE_2)
            })
            .catch(error => {
              logger.error(error)
              this.openOverlay(OVERLAY_ASIDE_2)
            })
        }
      },
      buyNow () {
        this.gaEvent({
          eventCategory: this.gaCategoriesMeta.PRODUCT_CARD.NAME,
          eventAction: this.gaCategoriesMeta.PRODUCT_CARD.ACTIONS.BUY_NOW,
          eventLabel: this.name
        })

        // *************************************************************************
        // Measuring addition of a product(s) to a shopping cart

        let addProductData = [{
          id: this.product.id,
          name: this.product.name,
          variant_name: this.product.variant_name,
          unit_price: this.product.unit_price
        }]
        this.gaEcAddProduct(addProductData)
        this.gaEcSetAction(ENHANCE_ECOM.ACTIONS.ADD)
        this.gaEcPageViewSend()
        // *************************************************************************

        if (this.isAgentMode && !this.agentToken) {
          let contextObj = {}
          if (this.checkoutWithEMI) {
            contextObj = {
              emiCartItemBeforeAgentLogin: this.currentVariant,
              choosedAction: BUY_NOW_WITH_EMI
            }
          } else {
            contextObj = {
              cartItemBeforeAgentLogin: this.currentVariant,
              choosedAction: BUY_NOW
            }
          }
          this.$store.commit(SET_OVERLAY_CONTEXT, contextObj)
          this.openOverlay(this.overlays.loginModal)
        } else {
          const ACTION_TO_PERFORM = this.checkoutWithEMI ? ADD_PRODUCT_TO_EMI_CART : ADD_PRODUCT_TO_CART
          return this.$store.dispatch(ACTION_TO_PERFORM, this.currentVariant)
            .then((response) => {
              if (this.$store.getters.cart.cartError) {
                this.openOverlay(OVERLAY_ASIDE_2)
              } else {
                i18nRedirect(this.$ctx, '/checkout/verify-user')
              }
            })
            .catch(error => {
              logger.error(error)
              this.openOverlay(OVERLAY_ASIDE_2)
            })
        }
      },
      openVariantModalForSmallDevice () {
        this.$store.commit(OPEN_PRODUCT_VARIANT_MODAL)
      },
      closeVariantModalForSmallDevice () {
        this.$store.commit(CLOSE_PRODUCT_VARIANT_MODAL)
      },
      requestForProduct () {
        let vm = this
        if ((this.isCustomerMode && this.customer && this.hasVerifiedMobile) || (this.isAgentMode && this.agentToken)) {
          return updateProductRequest(vm)
        } else {
          // Open Modal
          let contextObj = {
            product: {
              name: this.name,
              image: this.productImages[0]
            },
            callback: this.setProductRequestMsg
          }
          this.$store.commit(SET_OVERLAY_CONTEXT, contextObj)
          this.openOverlay(this.overlays.requestModal)
        }
      },
      setProductRequestMsg () {
        updateProductRequest(this)
        this.closeRequestModal()
      },
      viewPlans () {
        let emiObj = {
          emi: this.emi,
          emiBanks: this.emiBankList
        }
        this.$store.commit(SET_OVERLAY_CONTEXT, emiObj)
        this.openOverlay(this.overlays.emiViewPlans)
      }
    },
    components: {
      LazyImage,
      ComputedImage,
      i18nLink,
      DeliverableInfo,
      OfferLogoImage,
      VueMarkdown
    }
  }
</script>

<style lang="sass" module>
  @import "shared/button"
  @import "shared/modal"
  @import "shared/img"
  @import "shared/category_summary/product_details"



  .u-zoom-in
    cursor: zoom-in


  .copy
    font-size: 14px

  .modal
    &--zoomImage
      opacity: 1
      visibility: visible
      overflow: auto
      @media screen and (min-width: 800px)
        display: flex
        justify-content: center
      @media (min-height: 904px)
        display: flex
        align-items: center
    .modal__overlay
      background-color: rgba($black, 0.77)
      cursor: zoom-out
    .modal__content
      padding: 20px 20px 84px
      width: 840px
      min-width: 840px
      height: 904px
      min-height: 904px
      background-color: transparent
      overflow: visible
      @media screen and (min-width: 800px) and (min-height: 904px)
        padding: 0
        width: 800px
        min-width: 800px
        height: 800px
        min-height: 800px
      .image
        overflow: hidden
      .imageWrapper
        background-color: $white
        height: 100%
        width: 100%
        position: relative

    .modal__close
      +button
      z-index: 13
      position: fixed
      width: 44px
      height: 44px
      display: inline-flex
      align-items: center
      justify-content: center
      fill: $primary
      background-color: rgba($black, 0.44)
      fill: $white
      bottom: 20px
      left: 50%
      transform: translateX(-50%)
      svg
        width: 28px
        height: 28px
      @media screen and (min-width: 968px)
        left: auto
        top: 0
        right: 0
        margin-top: 10px
        margin-right: 10px
        transform: none
    .prev,
    .next
      +button
      display: inline-flex
      align-items: center
      justify-content: center
      background-color: rgba($black, 0.44)
      height: 44px
      width: 44px
      position: fixed
      bottom: 20px
      left: 50%
      transform: translateX(-50%)
      fill: $white
      @media screen and (min-width: 968px)
        bottom: auto
        top: 50%
        transform: translate(-50%, -50%)
      svg
        width: 28px
        height: 28px
      &.prev
        margin-left: -(44px + 20)
        @media screen and (min-width: 968px)
          margin-left: -(44px + 400)
      &.next
        margin-left: 44px + 20
        @media screen and (min-width: 968px)
          margin-left: 44px + 400


  article
    max-width: 100%
    h1,
    h2,
    h3,
    h4
      margin-bottom: 20px
      margin-top: 50px
    p
      font-size: 16px
      line-height: 1.8
    ul
      li
        margin-bottom: 10px
        line-height: 1.33

</style>

<template>
  <div :class="$style.item" v-if="currentVariant">
    <div :class="$style.product">

      <!-- Details Mode Images -->
      <div :class="$style.hero">
        <template v-if="productImages.length > 2">
          <flickity class="FPDCarousel" ref="FPCarouselOptions" :options="FPCarouselOptions">
            <div class="FPDCarousel__cell"
              v-for="(img) in productImages"
              :key="img.url">
              <div class="image">
                <div class="image-placeholder"></div>
                <lazy-image
                  :class="['image-image', {'image-loaded': imageIsLoaded}]"
                  :meta="img"
                  :animate="false"
                  :alt="name"
                  :title="name"
                  @click="openProductImageZoomMode()"
                  @imageLoaded="imageIsLoaded = true"/>
              </div>
            </div>
          </flickity>
        </template>
        <template v-else>
          <div class="image image-zoom">
            <div class="image-placeholder"></div>
            <lazy-image
              :meta="currentImage"
              :class="['image-image', {'image-loaded': imageIsLoaded}]"
              :animate="false"
              @click="openProductImageZoomMode()"
              :alt="name"
              :title="name"
              @imageLoaded="imageIsLoaded = true"/>
          </div>
        </template>

        <template v-if="productImages.length > 2">
          <div :class="$style.gallery">
            <div :class="$style.galleryHero">
              <div :class="$style.heroImageAspectRatio"></div>
              <lazy-image
                :meta="currentImage"
                :class="[$style.heroImage, {[$style.heroImageIsLoaded]: imageIsLoaded}]"
                :animate="false"
                @click="openProductImageZoomMode()"
                :alt="name"
                :title="name"
                @imageLoaded="imageIsLoaded = true"/>
            </div>
            <ul :class="$style.galleryList">
              <li
                v-for="(img, index) in productImages"
                :key="img.url"
                :class="[$style.galleryItem, {[$style.galleryItemActive]: (index === currentProductImageIndex)}]"
                @click="changeProductHeroImg(index)">
                <div :class="$style.heroImageAspectRatio"></div>
                <lazy-image :class="[$style.galleryImage, $style.heroImage, {[$style.heroImageIsLoaded]: imageIsLoaded}]"
                  :meta="img"
                  :animate="false"
                  :alt="name"
                  :title="name"/>
              </li>
            </ul>
          </div>
        </template>

        <div id="ProductDetails" :class="['modal', 'modal--visible']" v-show="productImageInZoomMode">
          <div class="modal__overlay" @click="closeProductImageZoomMode()"></div>
          <div class="modal__content">
            <div class="image">
              <div class="image-placeholder"></div>
              <lazy-image
                :meta="currentImage"
                :class="['image-image', {'image-loaded': imageIsLoaded}]"
                :animate="false"
                :alt="name"
                :title="name"
                @imageLoaded="imageIsLoaded = true"/>
            </div>

            <button class="modal__close" @click="closeProductImageZoomMode()">
              <svg viewBox="0 0 32 32">
                <path d="M26.3,7.9l-2.1-2.1L16,13.9L7.9,5.7L5.7,7.9l8.1,8.1l-8.1,8.1l2.1,2.1l8.1-8.1l8.1,8.1l2.1-2.1
                  L18.1,16L26.3,7.9z"/>
              </svg>
            </button>
            <button class="prev" v-if="productImages.length > 1" @click="prevProductHeroImage()">
              <svg viewBox="0 0 32 32">
                <path id="Path_22" d="M4.6,16L15,5.6v8.2h12.4v4.3H15v8.2L4.6,16z"/>
              </svg>
            </button>
            <button class="next" v-if="productImages.length > 1" @click="nextProductHeroImage()">
              <svg viewBox="0 0 32 32">
                <path id="Path_22" d="M4.6,16L15,5.6v8.2h12.4v4.3H15v8.2L4.6,16z" transform="translate(32, 32) rotate(180) "/>
              </svg>
            </button>
          </div>
        </div>

        <!-- <div :class="$style.overlay" v-show="productImageInZoomMode">
          <div @click="closeProductImageZoomMode()" :class="$style.overlayLayer"></div>
          <button @click="closeProductImageZoomMode()" :class="[$style.button, $style.overlayClose]">
            <img :class="$style.overlayCloseDetails" src="/svg/cancel.svg" alt="">
          </button>
          <div :class="$style.overlayContent">
            <ul :class="$style.overlayNav">
              <li :class="$style.overlayNavPrev">
                <button v-if="productImages.length > 1" @click="prevProductHeroImage()" :class="[$style.button, $style.buttonOverlayprev]" type="button">
                  <span :class="$style.buttonIcon">
                    <img :class="$style.svgIcon" src="/svg/carousel-prev.svg" alt="">
                  </span>
                </button>
              </li>
              <li :class="$style.overlayNavNext">
                <button v-if="productImages.length > 1" @click="nextProductHeroImage()" :class="[$style.button, $style.buttonOverlaynext]" type="button">
                  <span :class="$style.buttonIcon">
                    <img :class="$style.svgIcon" src="/svg/carousel-next.svg" alt="">
                  </span>
                </button>
              </li>
            </ul>
            <div :class="$style.overlayMain">
              <div :class="$style.overlayTheImage">
                <div :class="$style.heroImageAspectRatio"></div>
                <lazy-image
                  :meta="currentImage"
                  :class="[$style.heroImage, {[$style.heroImageIsLoaded]: imageIsLoaded}]"
                  :animate="false"
                  :alt="name"
                  :title="name"
                  @imageLoaded="imageIsLoaded = true"/>
              </div>
            </div>
          </div>
        </div> -->

      </div>

      <div :class="$style.stream">
        <!-- product id -->
        <span :class="$style.id">ID# {{currentVariant.id}}</span>
        <!-- coupon  -->
        <span :class="$style.coupon" v-if="currentVariant.coupon_details">
          <span :class="$style.couponText">{{ i18nText.coupon }}</span>
        </span>
        <!-- product offers -->
        <div :class="$style.offers" v-if="product.offers && product.offers.length">
          <div v-for="(offer, index) in product.offers" :key="index" :class="[$style.offersItem, {[ $style.offersItemIsActive ]: showBkashLogo }]">
            <offer-logo-image v-if="offer.logo_image" :imageLink="offer.logo_image"></offer-logo-image>
          </div>
        </div>
        <!-- product title -->
        <h1 :class="$style.title">{{name}}</h1>

        <template v-if="hasVariant">
          <div :class="$style.variant" v-for='attr in varyingAttributes' :key="attr.code">
            <label :class="$style.variantLabel">{{ __(attr.name) }}</label>
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

        <!-- varient select in Mobile Devices -->
        <!-- <div v-if="hasVariant" :class="[$style.productVariantSelect, $style.variantSelect]">
          <button
            v-for='attr in varyingAttributes'
            :key="attr.code"
            :class="$style.variantSelectRow"
            type="button"
            @click="openVariantModalForSmallDevice"
          >
            <label :class="$style.variantSelectTitle">
              {{__$(attr.values.length)}} {{__(attr.name)}} :
            </label>
            <div :class="$style.variantSelectSelected">
              <div :class="$style.variantSelectName">{{ currentAttribute(attr.code) }}</div>
              <div :class="$style.variantSelectArrow">
                <img class="hello" src="/svg/arrow-right-mored.svg" alt="">
              </div>
            </div>
          </button>
        </div> -->

        <!-- <div v-if="hasVariant" :class="[$style.productVariant, {[$style.productVariantOpen]: showVariantModalForSmallDevice}]">
          <div :class="$style.variantOverlay" @click="closeVariantModalForSmallDevice"></div>
          <button :class="[$style.button, $style.variantCloseButton]" @click="closeVariantModalForSmallDevice">Done</button>
          <div :class="$style.variantDialog">
            <div :class="$style.variant" v-for='attr in varyingAttributes' :key="attr.code">
              <label :class="$style.variantLabel">{{ __(attr.name) }}</label>
              <div :class="$style.variantScroll">
                <div :class="$style.variantContainer">
                  <div :class="$style.variantRow">
                    <div
                      :class="[$style.variantItem, $style.variantItemText, { [$style.variantItemActive]: data.active, [$style.variantItemMuted]: data.muted } ]"
                      v-for="data in attr.values"
                      :key="attr.code + ':' + data.value"
                      v-if="data.linkPath">
                      <i18n-link :class="$style.link" :to="data.linkPath">{{ __(data.i18n_value) }} {{ __(data.i18n_unit) }}</i18n-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> -->

        <!-- product price -->
        <div :class="$style.price">
          <span :class="$style.priceDiscounted">Tk. {{ __$(currentVariant.discounted_price) }}</span>
          <template v-if="!currentVariant.out_of_stock && discount">
            <span :class="$style.priceUnit">{{ __$(currentVariant.unit_price) }}</span>
            <!-- <span :class="$style.priceDiscount">{{ i18nText.save }} {{ __$(discount) }}</span> -->
          </template>
          <span :class="$style.priceStockOut" v-if="currentVariant.out_of_stock">{{ i18nText.outStock  }}</span>
          <span :class="$style.priceAgentCommission" v-else-if="toggleCommission && !currentVariant.out_of_stock">{{ i18nText.commissionLabel }} {{ __$(currentVariant.commission) }}</span>
        </div>

        <div class="BookingAmount" v-if="isAdvancePaymentEnabled">
          <span class="BookingAmount__image">
            <!-- <svg-icon file-name="arrow-right" :generate-inline-style="false"></svg-icon> -->
            <img class="BookingAmount__image--icon" src="/svg/icon-lock.svg" alt="">
          </span>
          <div class="BookingAmount__content">
            <span class="BookingAmount__content--price" v-if="addTkSign">৳{{ translatedAmount }}</span>
            <span class="BookingAmount__content--price" v-if="addPercentSign">{{ translatedAmount }}%</span>
            <p class="BookingAmount__content--copy">{{ $t('advanced_payment.minimum_booking_amount') }}</p>
          </div>
          <!-- <span v-if="addTkSign">৳</span>{{ translatedAmount }} <span v-if="addPercentSign">%</span>
          {{ $t('advanced_payment.minimum_booking_amount') }} -->
        </div>

        <div v-if="currentVariant.out_of_stock" :class="$style.actions">
            <div v-if="productRequestMsg" :class="$style.requestedMsg">
              {{productRequestMsg}}
            </div>
            <button v-else
              :class="[$style.button, $style.buttonRequest]"
              @click="requestForProduct()">
              {{ i18nText.request }}
            </button>
        </div>

        <div v-else :class="$style.actions">
          <!-- <div class="DispatchedDays">
            <svg viewBox="0 0 15 15" width="15px" height="15px">
              <path id="Path_192" d="M7.5,0C3.4,0,0,3.4,0,7.5S3.4,15,7.5,15S15,11.6,15,7.5C15,3.4,11.6,0,7.5,0z M7.5,13.5
                c-3.3,0-6-2.7-6-6s2.7-6,6-6s6,2.7,6,6C13.5,10.8,10.8,13.5,7.5,13.5z"/>
              <path id="Path_191" d="M7.5,7.5V3.8H6v5.1h4.1V7.5L7.5,7.5z"/>
            </svg>
            <span>Dispatched in 7 working days</span>
          </div> -->
          <div :class="$style.buttonGroup">
            <button
              :class="[$style.button, $style.buttonBuyNow, {[$style.buttonBuyNowWithEmi]: checkoutWithEMI}]"
              @click.stop="buyNow()">
              {{ checkoutWithEMI ? i18nText.buyNowWithEMI : i18nText.buyNow }}
            </button>
            <button v-if="!checkoutWithEMI"
              :class="[$style.button, $style.buttonAddToCart]"
              @click="addToCart()">
              {{ i18nText.addCart }}
            </button>
          </div>



          <!-- <div class="emi" v-if="emiStartsFrom">
            <div class="checkbox" @click="checkoutWithEMI = !checkoutWithEMI">
              <div :class="['checkbox__check', {'checkbox__check--active': checkoutWithEMI}]" ></div>
              <div class="checkbox__title">
                <label class="checkbox__label" for="emi_enable">
                  <span class="emiBadge">{{ $t('product.emi_from',{ amount: __$(emiStartsFrom)}) }}</span>
                </label>
              </div>
            </div>
            <button :class="[$style.button, $style.buttonViewPlans]" @click="viewPlans">{{ i18nText.viewPlans }}
              <img src="/svg/arrow-right-mored.svg" alt="">
            </button>
          </div> -->

          <!-- <deliverable-info :currentVariant="currentVariant" /> -->

        </div>

        <div class="lovingbadge">
          <div class="lovingbadge__image" v-if="isVegan">
            <img src="/clients/bronx/image/label-veganfriendly-150x150.png" alt="">
          </div>
          <div class="lovingbadge__image" v-if="isCrueltyFree">
            <img src="/clients/bronx/image/label-crueltyfree-150x150.png" alt="">
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>

  import find from 'lodash/find'
  import pick from 'lodash/pick'
  import i18nLink from '~/components/i18nLink'
  import LazyImage from '~/components/LazyImage'
  import DeliverableInfo from '~/components/catalog/DeliverableInfo'
  import enumMixinFactory from '~/utils/enum_mixin_factory'
  import OfferLogoImage from '~/components/catalog/OfferLogoImage.vue'

  import {
    overlayMixin,
    i18nMixin,
    i18nRedirect,
    makeDefaultImageMeta,
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

  const DEFAULT_IMAGE_SVG = ('/clients/bronx/icons/default-image.svg')

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
        return this.__(this.currentVariant.name) + (this.hasVariant ? ' (' + this.__(this.currentVariant.variant_name) + ')' : '')
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
          return [
            makeDefaultImageMeta(DEFAULT_IMAGE_SVG)
          ]
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
        this.openOverlay(OVERLAY_PRODUCT_IMAGE)
        this.productImageInZoomMode = true
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
      i18nLink,
      DeliverableInfo,
      OfferLogoImage
    }
  }
</script>

<style lang="sass" module>
  @import "shared/button"
  @import "shared/category_summary/product_details"
</style>
<style lang="sass" scoped>
  .lovingbadge
    margin-top: 20px
    display: flex
    &__image
      height: 100px
      width: 100px
      margin-right: 10px
  .FPDCarousel
    position: relative
    margin-bottom: 50px
    +desktop
      display: none
    &__cell
      width: 100%
      background-color: $white

  .DispatchedDays
    font-size: 14px
    color: #666
    fill: #666
    display: flex
    flex-flow: row wrap
    align-items: center
    margin-bottom: 15px
    span
      margin-top: 2px
      margin-left: 6px

  // .FPDCarouselNav
  //   position: relative
  //   margin-bottom: 50px
  //   &__cell
  //     height: 120px
  //     width: 120px
  //     margin-right: 10px
  //     background: #ED2
  //     &.is-nav-selected
  //       background: pink
</style>

<style lang="sass" scoped>
  @import "shared/modal"

  .image
    position: relative
    &-placeholder
      padding-bottom: 100%
      background-color: #f9f9f9
    &-image
      position: absolute
      top: 0
      left: 0
      opacity: 0
      visibility: hidden
      transition: 0.6s all ease-out
    &-loaded
      opacity: 1
      visibility: visible
    &-zoom
      cursor: zoom-in

  #ProductDetails
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
    &.modal--visible
      opacity: 1
      visibility: visible
      overflow: auto
      @media screen and (min-width: 800px)
        display: flex
        justify-content: center
      @media (min-height: 904px)
        display: flex
        align-items: center

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

</style>

<style lang="sass" scoped>
  @import "shared/button"
  @import "shared/alerts"
  @import "shared/form/field"
  .imageNotLoaded
    background-color: white
    height: 20px
    width: 60px
  .emiBadge
    background-color: darken($cyan, 15%)
    color: white
    padding: 2px 5px 1px
    border-radius: 3px
    font-size: inherit
    display: inline-block
    margin: 2px 0px 5px
    &--sm
      font-size: 12px

  .emi
    display: inline-flex
    flex-flow: row wrap
    margin-top: 5px

  .checkbox
    cursor: pointer
    position: relative
    &__input[type=checkbox]
        position: absolute
        visibility: hidden
    &__check
      position: absolute
      top: 50%
      left: 0
      margin-top: -2px
      transform: translateY(-50%)
      width: 16px
      height: 16px
      border-radius: 4px
      border-width: 2px
      border-style: solid
      background-color: $white
      border-color: $purple
      transition: none $speed $easing $speed*0.5
      transition-property: border-color
      z-index: 1
      &::before,
      &::after
        content: ''
        position: absolute
        left: 0
        top: 0
        width: 15px
        height: 4px
        border-style: solid
        border-top: 0
        border-right: 0
        transform-origin: center center
        transform: rotate(310deg)
        opacity: 0
        visibility: hidden
        transition: none $speed $easing $speed*0.25
        transition-property: opacity, visibility
      &::before
        border-width: 7px
        border-color: $white
        margin-left: -2px + 1
        margin-top: -2px - 3
        border-radius: 3px
      &::after
        border-width: 3px
        border-color: darken($purple, 5%)
        margin-left: 1px
        margin-top: -3px
      &--active
        border-color: $btn-purple
        &::before,
        &::after
          opacity: 1
          visibility: visible

    &__label
        display: inline-block
        position: relative
        cursor: pointer
        padding: 2px 0px 2px 20px
        font-size: 16px
    &__title
      position: relative
  .BookingAmount
    position: relative
    display: flex
    padding-top: 10px
    &__image
      border: 1px solid rgba($purple, 0.5)
      width: 30px
      height: 30px
      border-radius: 50px
      margin-right: 10px
      margin-top: 3px
      &--icon
        padding: 2px 2px
        color: rgba($purple, 0.9)
        fill: rgba($purple, 0.9)
    &__content
      position: relative
      &--price
        color: $black
        font-size: 12px
        line-height: 16px
      &--copy
        color: $dark
</style>

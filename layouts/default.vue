<template>
  <div :class="$style.root">
    <div :class="$style.rootKernel" :style="kernelStyles">
      <div :class="[$style.app, {[$style.appCordova]: isAgentMode && !isPlatformRBP}]">
        <!-- header -->
        <!-- <header :class="[$style.appHeader, {[$style.appHeaderWithoutGlobalSearch]: pageMode.checkoutMode}]"> -->
        <div :class="[$style.appHeader, {[$style.appHeaderCheckout]: pageMode.checkoutMode}]">
          <slot name="header">
            <site-header>
              <template slot="cartIcon" v-if="pageMode.paymentMode">
                <button :class="[$style.button, $style.buttonOrderSummary]" @click.stop="toggleOverlay(overlays.aside2)">{{this.$t('cart.order_summary')}}</button>
              </template>
            </site-header>
          </slot>
        </div>
        <!-- <div :class="[$style.appHeaderClone, {[$style.appHeaderWithoutGlobalSearch]: pageMode.checkoutMode}]"></div> -->
        <!-- Content Top/Banner/Location Selector -->
        <notification type="error" v-if="isVacationMode && !pageMode.homePage">
          <p v-html="$t('vacation.notice')"></p>
          <!-- <p v-html="$t('vacation.notice', 'bn')"></p> -->
        </notification>

        <notification v-if="pageNotification" :type="pageNotification.type">
          <p v-html="pageNotification.message"></p>
        </notification>


        <!-- <div :class="$style.appBanner" v-if="!pageMode.checkoutMode && (isVacationMode || isCustomerMode)">
          <div :class="$style.appBannerInner">
            <content-top></content-top>
            <img src="/imgs/image1@2x.png" alt="">
          </div>
        </div> -->

        <main :class="$style.appMain">

          <!-- <div :class="$style.appMainContainer"> -->

            <!-- Dynamic Page and Contents -->
            <div :class="[$style.content, {[$style.contentIsCheckoutMode]: pageMode.checkoutMode}]">
              <!-- <div :class="[{'u-goAway': isNavigating}]"><nuxt></nuxt></div> -->
              <template v-show="!isNavigating"><nuxt></nuxt></template>
              <!-- <loading-animation :class="[{'u-goAway': !isNavigating}]"></loading-animation> -->
              <loading-animation v-show="isNavigating"></loading-animation>
            </div>

            <!-- Category Menu Sidebar -->
            <!-- <aside :class="[$style.aside, $style.asideMenu, {[$style.asideShow] : isOverlayOpen(overlays.aside1)}]" v-if="!pageMode.checkoutMode">
              <div :class="[$style.asideContain, $style.asideContainMenu]"  v-on-click-outside="closeAside1">
                <slot name="aside1">
                  <sidebar></sidebar>
                </slot>
              </div>
            </aside> -->

            <!-- Cart Sidebar -->
            <!-- <aside :class="[$style.aside, $style.asideCart, {[$style.asideShow] : isOverlayOpen(overlays.aside2), [$style.asideIsCheckoutMode]: pageMode.checkoutMode, [$style.asideIsVacationMode]: (isVacationMode && pageMode.checkoutMode)}]">
              <div :class="[$style.asideContain, $style.asideContainCart, { [$style.asideContainCheckout] : pageMode.checkoutMode}]"  v-on-click-outside="closeAside2">
                <div :class="[$style.asideContainWrapper]">
                  <button :class="[$style.button, $style.buttonClose, {'u-hideOnWideScreen': pageMode.checkoutMode}]" type="button" name="button" @click="closeAside2">
                    <img src="/svg/back-right.svg" alt="">
                  </button>
                  <slot name="aside2">
                    <cart v-if="!pageMode.paymentMode"></cart>
                    <order-summary :orderSummary="orderSummary" v-if="pageMode.paymentMode && orderSummary"></order-summary>
                  </slot>
                </div>
              </div>
            </aside> -->

          <!-- </div> -->

        </main>

        <!-- Category Menu Sidebar -->
        <div id="Sidebar" :class="['modal', {'modal--open': isOverlayOpen(overlays.aside1)}]" v-if="!pageMode.checkoutMode">
          <div class="modal__overlay" @click="closeAside1"></div>
          <div class="modal__content">
            <button class="modal__close" @click="closeAside1">
              <svg viewBox="0 0 32 32" width="32px" height="32px">
                <path d="M26.3,7.9l-2.1-2.1L16,13.9L7.9,5.7L5.7,7.9l8.1,8.1l-8.1,8.1l2.1,2.1l8.1-8.1l8.1,8.1l2.1-2.1
                  L18.1,16L26.3,7.9z"/>
              </svg>
            </button>
            <slot name="aside1">
              <sidebar></sidebar>
            </slot>
          </div>
        </div>

        <!-- Cart Sidebar -->
        <div id="Cart" :class="['modal', {'modal--open': isOverlayOpen(overlays.aside2)}, {'modal--visible': pageMode.checkoutMode}]" v-if="!pageMode.paymentMode">
          <div class="modal__overlay" @click="closeAside2"></div>
          <div class="modal__content">
            <button class="modal__close" @click="closeAside2">
              <svg viewBox="0 0 32 32" width="32px" height="32px">
                <path d="M26.3,7.9l-2.1-2.1L16,13.9L7.9,5.7L5.7,7.9l8.1,8.1l-8.1,8.1l2.1,2.1l8.1-8.1l8.1,8.1l2.1-2.1
                  L18.1,16L26.3,7.9z"/>
              </svg>
            </button>
            <slot name="aside2">
              <cart v-if="!pageMode.paymentMode"></cart>
              <order-summary :orderSummary="orderSummary" v-if="pageMode.paymentMode && orderSummary"></order-summary>
            </slot>
          </div>
        </div>

        <!-- Search modal -->
        <div id="Search" :class="['modal', {'modal--open': isOverlayOpen(overlays.aside3)}]" v-if="!pageMode.checkoutMode">
          <div class="modal__overlay" @click="closeAside3"></div>
          <div class="modal__content">
            <button class="modal__close" @click="closeAside3">
              <svg viewBox="0 0 32 32" width="32px" height="32px">
                <path d="M28,14.5H9.7l8.4-8.4L16,4L4,16l12,12l2.1-2.1l-8.4-8.4H28V14.5z"/>
                <!-- <path d="M26.3,7.9l-2.1-2.1L16,13.9L7.9,5.7L5.7,7.9l8.1,8.1l-8.1,8.1l2.1,2.1l8.1-8.1l8.1,8.1l2.1-2.1
                  L18.1,16L26.3,7.9z"/> -->
              </svg>
            </button>
            <slot name="aside3">
              <search></search>
            </slot>
          </div>
        </div>

        <!-- Network Offline -->
        <div :class="$style.offline" v-if="ui.isOffline && isAgentMode">
          <div :class="$style.offlineDialog">
            <div :class="$style.offlineHero">
              <img :class="$style.heroImage" :src="brandLogo" alt="Hero Logo">
            </div>
            <div :class="$style.offlineContent">
              <h3 :class="$style.offlineTitle">{{ $t('network_offline.title') }}</h3>
              <p :class="$style.offlineCopy">{{ $t('network_offline.copy') }}</p>
            </div>
          </div>
        </div>

        <!-- preferred delivery point -->
        <slot name="preferred-delivery-point">
          <transition name="fade">
            <preferred-delivery-point v-if="isOverlayOpen(overlays.preferredDeliveryPointModal)"></preferred-delivery-point>
          </transition>
        </slot>

        <!-- Login -->
        <slot name="login" v-if="!pageMode.checkoutMode">
          <transition name="fade">
            <login v-if="isOverlayOpen(overlays.loginModal)" :success-callback="checkForReview"></login>
          </transition>
        </slot>

        <!-- bKash Diagram-->
        <slot name="bkash" v-if="pageMode.checkoutMode">
          <transition name="fade">
            <bkash-diagram v-if="isOverlayOpen(overlays.bkashDiagramModal)"></bkash-diagram>
          </transition>
        </slot>

        <!-- bKash Verification-->
        <slot name="bkashVerify" v-if="pageMode.checkoutMode">
          <transition name="fade">
            <bkash-verification v-if="isOverlayOpen(overlays.bkashVerificationModal)"></bkash-verification>
          </transition>
        </slot>

        <!-- Request-->
        <slot name="request" v-if="!pageMode.checkoutMode">
          <transition name="fade">
            <product-request v-if="isOverlayOpen(overlays.requestModal)"></product-request>
          </transition>
        </slot>

        <!--Agent Verification-->
        <slot name="agentVerify" v-if="!pageMode.checkoutMode">
          <transition name="fade">
            <agent-password v-if="isOverlayOpen(overlays.agentPasswordModal)"></agent-password>
          </transition>
        </slot>

        <!-- Cancel Order -->
        <slot name="cancelOrder" v-if="!pageMode.checkoutMode">
          <transition name="fade">
            <cancel-order v-if="isOverlayOpen(overlays.cancelOrderModal)"></cancel-order>
          </transition>
        </slot>

        <!-- EMI Plans -->
        <slot name="emiPlans">
          <transition name="fade">
            <emi-plans v-if="isOverlayOpen(overlays.emiViewPlans)"></emi-plans>
          </transition>
        </slot>

        <!-- Donation -->
        <slot name="donaTion" v-if="showDonation">
          <transition name="fade">
            <donation-modal v-if="isOverlayOpen(overlays.donationModal)"></donation-modal>
          </transition>
        </slot>

        <!-- Service Review Modal -->
        <slot name="serviceReview">
          <transition name="fade">
            <service-review v-if="isOverlayOpen(overlays.serviceReviewModal)"></service-review>
          </transition>
        </slot>

        <!-- Footer -->
        <footer :class="$style.appFooter" v-if="!pageMode.checkoutMode">
          <site-footer></site-footer>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
  import SiteHeader from '~/components/layouts/SiteHeader'
  // import ContentTop from '~/components/layouts/ContentTop'
  import i18nLink from '~/components/i18nLink'
  import Search from '~/components/layouts/header/Search.vue'
  import Sidebar from '~/components/layouts/Sidebar'
  import Cart from '~/components/layouts/Cart'
  import PreferredDeliveryPoint from '~/components/modals/PreferredDeliveryPoint'
  import { mapState, mapGetters } from 'vuex'
  import { mixin as onClickOutside } from 'vue-on-click-outside'
  import { overlayMixin } from '~/utils'
  import logger from '~/utils/logger'
  import { getOrderSummaryById, getServiceReview } from '~/api'

  import {
    EVENT_OVERLAY_OPENING,
    EVENT_OVERLAY_CLOSED,
    RESTORE_CART_ITEMS_FROM_BACKUP,
    SET_PAGE_NOTIFICATION,
    SET_OVERLAY_CONTEXT
  } from '~/store/constants.yaml'

  export default {
    mixins: [onClickOutside, overlayMixin],
    watch: {
      isAppMounted (newVal, oldVal) {
        if (newVal) {
          this.$nuxt.$loading.finish()
        }
      },
      '$route': {
        handler: function (to, from) {
          if (this.pageMode.paymentMode && to.params.order_id) {
            getOrderSummaryById(this.authToken, to.params.order_id)
              .then((result) => {
                this.orderSummary = result
              })
              .catch((reason) => {
                logger.error('getOrderSummaryById', reason)
              })
          } else {
            this.orderSummary = null
          }
        },
        immediate: true
      },
      isCheckoutMode: {
        handler: function (newVal, oldVal) {
          if (!newVal && this.$store.state.cart.is_emi) {
            setTimeout(() => {
              if (this.$store.state.cart.cart_items_backup.length) {
                this.$store.commit(SET_PAGE_NOTIFICATION, { type: 'info', key: 'cart_items_restored' })
              }
              this.$store.dispatch(RESTORE_CART_ITEMS_FROM_BACKUP)
            }, 0)
          }
        },
        immediate: true
      }
    },
    data () {
      return {
        orderSummary: null,
        kernelTop: null,
        routePathWhenOverlayOpened: null,
        brandLogo: '/clients/' + process.env.PROJECT_NAME + '/svg/brand-logo.svg'
      }
    },
    computed: {
      ...mapState([
        'isAppMounted',
        'pageMode',
        'ui'
      ]),
      ...mapGetters([
        'authToken',
        'isCustomerMode',
        'isAgentMode',
        'isVacationMode',
        'isPlatformRBP',
        'showDonation'
      ]),
      isCheckoutMode () {
        return this.pageMode.checkoutMode
      },
      isNavigating () {
        return this.$store.state.navigatingRoutePath !== null
      },
      kernelStyles () {
        return this.kernelTop ? {top: `-${this.kernelTop}px`} : null
      },
      pageNotification () {
        if (!this.ui.pageNotification) return null

        let { type, field } = this.ui.pageNotification

        if (this.ui.pageNotification.msg) return { type, message: this.ui.pageNotification.msg }
        if (this.ui.pageNotification.key) return { type, message: this.$t(`page_notifications.${type}.${this.ui.pageNotification.key}`, {field}) }
      }
    },
    components: {
      SiteHeader,
      // ContentTop,
      i18nLink,
      Search,
      Sidebar,
      Cart,
      PreferredDeliveryPoint,
      SiteFooter: () => import('~/components/layouts/SiteFooter'),
      Login: () => import('~/components/modals/Login'),
      BkashDiagram: () => import('~/components/modals/BkashDiagram'),
      BkashVerification: () => import('~/components/modals/BkashVerification'),
      AgentPassword: () => import('~/components/modals/AgentPassword'),
      CancelOrder: () => import('~/components/modals/CancelOrder'),
      ProductRequest: () => import('~/components/modals/ProductRequest'),
      Notification: () => import('~/components/Notification'),
      LoadingAnimation: () => import('~/components/LoadingAnimation'),
      OrderSummary: () => import('~/components/layouts/checkout/OrderSummary'),
      EmiPlans: () => import('~/components/modals/EmiPlans'),
      DonationModal: () => import('~/components/modals/DonationModal'),
      ServiceReview: () => import('~/components/modals/ServiceReview')
    },
    methods: {
      onOverlayOpening (overlayName) {
        this.routePathWhenOverlayOpened = this.$route.fullPath
        this.kernelTop = window.pageYOffset
        document.documentElement.classList.add('isScroll--disabled')
      },
      onOverlayClosed (overlayName) {
        document.documentElement.classList.remove('isScroll--disabled')
        if (this.routePathWhenOverlayOpened === this.$route.fullPath) {
          window.scrollTo(0, this.kernelTop)
        }
        this.routePathWhenOverlayOpened = null
        this.kernelTop = null
      },
      checkForReview () {
        if (this.authToken) {
          getServiceReview(this.authToken)
            .then(response => {
              if (Array.isArray(response) && response[0]) {
                this.askForReview = true
                this.$store.commit(SET_OVERLAY_CONTEXT, response[0])
                this.openOverlay(this.overlays.serviceReviewModal)
              }
            })
        }
      }
    },
    mounted () {
      this.$root.$on(EVENT_OVERLAY_OPENING, this.onOverlayOpening)
      this.$root.$on(EVENT_OVERLAY_CLOSED, this.onOverlayClosed)
      this.checkForReview()
      this.$nextTick(() => {
        this.$nuxt.$loading.start()
      })
    }
  }

</script>

<style lang="sass" module>
@import "shared/button"
@import "shared/button.sass"
.Root
  position: relative
  &__kernel
    position: relative
    display: block

.App
  position: relative
  +clearfix
  // display: flex
  // flex-flow: row wrap
  // font-size: 1.4em
  // justify-content: center

  $root: &;

  &__header,
  &__banner,
  &__main,
  &__footer
    // border: 1px solid red
      // position: relative
      // flex: 1 100%

  &__header
    position: relative
    height: $header-height
    background-color: $header-background
    color: $header-color
    fill: $header-color
    display: flex
    flex-direction: column
    // padding-top: 20px
    // padding-bottom: 30px
    // background-color: #000
    // background-color: $primary
    // +tablet
    //   padding-top: 30px
    //   padding-bottom: 40px
    // &--checkout
    //   background-color: $white

    &--clone
      // width: 100%
      // position: relative
      // display: block
      // height: $header-mobile-height
      // background-color: $lighter
      // z-index: $z-index-0-headerClone
      // +clearfix
      // +tablet
      //   height: $header-desktop-height

    &--withoutGlobalSearch
      // padding-top: $header-desktop-padding-top
      // padding-bottom: $header-desktop-padding-bottom
      // height: $header-desktop-height

  &__banner
    z-index: $z-index-1-banner
    // background-color: #f5f5f5
    // &__inner
    //   +container
  &__bannerInner
    position: relative
    +container

  &__main
    width: 100%
    // background-color: #f5f5f5
    background-color: $white
    position: relative
    &-container
      +container
      // display: flex
      // flex-flow: row wrap
      // margin-left: auto
      // margin-right: auto


  &__footer
    position: relative
    background-color: $white
    // border-top: 1px solid #eeeeee
    // z-index: $z-index-1-footer
    +clearfix


// App__main__

.Content
  position: relative
  +clearfix
  // border: 10px solid red
  // flex: 1
  // max-width: 100%

  &--isCheckoutMode
    position: relative
    padding-top: 30px
    +tablet
      padding-top: 0
    // min-height: calc(100vh - 79px)
    // +widescreen
    //   order: 1
    //   flex: 0 840px
    //   max-width: 840px
    //   padding-left: 0
    //   padding-right: 20px

.Aside
  &--menu
    z-index: $z-index-3-menu
    position: fixed
    overflow-x: hidden
    overflow-y: auto
    top: 0
    left: 0
    bottom: 0
    right: 0
    display: block
    background-color: rgba($black,.5)
    width: 100%
    padding: 0
    border: 0
    margin: 0
    // margin-top: $aside-mobile-margin-top
    cursor: pointer
    visibility: hidden
    opacity: 0
    transition: none $speed $easing $speed*2
    transition-property: transform, opacity, visibility
    +tablet
      // margin-top: $aside-desktop-margin-top
    +widescreen
      // z-index: auto
      // position: relative
      // display: block
      // background-color: transparent
      // width: auto
      // max-width: 210px
      // margin-top: 0
      // order: 1
      // flex: 1 auto
      // padding-right: 5px
      // visibility: visible
      // opacity: 1

  &--cart
    z-index: $z-index-3-cart
    position: fixed
    overflow-x: hidden
    overflow-y: auto
    top: 0
    left: 0
    bottom: 0
    right: 0
    display: block
    background-color: rgba($black,.5)
    width: 100%
    padding: 0
    border: 0
    margin: 0
    // margin-top: $aside-mobile-margin-top
    cursor: pointer
    visibility: hidden
    opacity: 0
    transition: none $speed $easing $speed*2
    transition-property: transform, opacity, visibility
    +tablet
      // margin-top: $aside-desktop-margin-top

  &--isCheckoutMode
    // margin-top: $aside-desktop-margin-top
    +widescreen
      z-index: auto
      visibility: visible
      opacity: 1
      position: fixed
      top: 0
      left: 50%
      bottom: 0
      margin-left: 415px
      margin-bottom: 15px
      // margin-top: $aside-desktop-margin-top + 15
      box-shadow: 0 1px 3px rgba($black, .1)
      width: 360px
      transform: translateX(-50%)
      .Aside__contain
        transform: translateX(0)
  &--isVacationMode
    +widescreen
      // margin-top: 15px
      position: absolute



  &__contain
    cursor: default
    position: absolute
    top: 0
    bottom: 0
    background-color: $white
    &--menu
      width: 280px
      overflow: auto
      left: 0
      transform: translateX(-100%)
      transition: transform $speed*2 $easing $speed
      // +widescreen
      //   width: auto
      //   position: relative
      //   height: 100%
      //   top: auto
      //   left: auto
      //   bottom: auto
      //   box-shadow: 0 1px 3px rgba($black, .1)
      //   transform: none

    &--cart
      right: 0
      width: 320px
      overflow: hidden
      transform: translateX(100%)
      transition: transform $speed*2 $easing $speed
      +phablet
        width: 320px + 30
        padding-left: 15px
        padding-right: 15px
      +tablet
        width: 320px + 40
        padding-left: 20px
        padding-right: 20px

    &--checkout
      overflow-y: auto
      +desktop
        overflow-y: auto
      +widescreen
        // overflow-y: auto

    &__wrapper
      position: relative
      display: block
      +clearfix

  &--show
    visibility: visible
    opacity: 1
    transition: none $speed $easing
    transition-property: transform, opacity, visibility
    .Aside__contain
      transform: translateX(0)

.Button--close
  position: absolute
  right: 0
  top: 0
  margin-top: 5px
  height: 48px
  width: 48px
  display: inline-flex
  justify-content: center
  color: rgba($black, .2)
  fill: rgba($black, .2)
  &:hover,
  &:focus
    color: rgba($black, .3)
    fill: rgba($black, .3)
  +phablet
    margin-top: 10px

.Offline
  z-index: $z-index-5-offline
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  min-width: 320px
  background-color: rgba($white, .66)
  display: flex
  justify-content: center
  align-items: center
  &__dialog
    position: relative
    outline: 0
    overflow: hidden
    max-width: 400px
    padding: 0
    background-color: $white
    box-shadow: 0 4px 14px 0 rgba($black, 0.3)
    border-radius: 3px
  &__hero
    height: 180px
    background-color: $purple
    overflow: hidden
    position: relative
    display: flex
    justify-content: flex-end
    align-items: center
  &__content
    padding: 30px 30px 50px
  &__title
    font-size: 30px
    font-weight: 700
    line-height: 1.22
  &__copy
    font-size: 16px
    font-weight: 400
    line-height: 1.55
    margin-top: 15px

.heroImage
  position: absolute
  top: 0
  right: 0
  height: 100%
  max-width: 1000px
  width: auto


.Button
  &--orderSummary
    padding: 0 15px
    &,
    &:focus,
    &:active,
    &:visited,
      color: $white
      text-decoration: none
    &:hover
      color: $yellow
    +widescreen
      display: none
</style>

<style lang="sass" scoped>
  @import "shared/modal"

  #Search
    padding-top: 106px
    +desktop
      position: absolute
      padding-top: 182px
    // padding-bottom: 60px
    .modal__overlay
      +desktop
        // background-color: transparent
    .modal__content
      +container
      +desktop
        padding-left: 0
        padding-right: 0
        max-width: 380px
        // max-height: 400px
        // min-height: 44px + 20
        overflow-y: visible
        right: 50%
        margin-right: -520px
        margin-top: 20px
        // opacity: 0.5
      // position: absolute
      // width: 100%
      // min-height: 56px
      // left: 50%
      // transform: translateX(-50%)
      // margin-top: 66px
      // margin-bottom: 66px
      // border: 10px solid red
      // opacity: 0.5
    .modal__close
      +button
      z-index: 10
      margin-top: 32px
      margin-left: 16px
      position: fixed
      top: 0
      left: 0
      width: 44px
      height: 44px
      // background-color: rgba($primary, 0.3)
      display: inline-flex
      align-items: center
      justify-content: center
      +desktop
        position: relative
        top: auto
        left: auto
        margin-top: 0
        margin-left: 0
        display: none
        // left: 50%
        // transform: translateX(-50%)
        // width: 56px
        // height: 56px
        // margin-left: -508px
        // margin-top: 66px

      svg
        width: 22px
        height: 22px
        // +desktop
        //   width: auto
        //   height: auto

      fill: $primary

  #Sidebar,
  #Cart
    .modal__content
      width: 360px
      height: 100%
      transition: all $speed*2 ease
    &.modal--open
      .modal__content
        transition: all $speed*3 ease

    .modal__close
      +button
      z-index: 10
      position: absolute
      top: 0
      right: 0
      width: 56px
      height: 56px
      // background-color: rgba($primary, 0.1)
      display: inline-flex
      align-items: center
      justify-content: center
      margin-top: 10px
      margin-right: 10px
      fill: $black

  #Sidebar
    .modal__content
      transform: translateX(-100%)
    &.modal--open
      .modal__content
        transform: translateX(0%)

  #Cart
    .modal__content
      margin-left: auto
      transform: translateX(100%)
    &.modal--open
      .modal__content
        transform: translateX(0%)

    &.modal--visible
      +desktop
        // margin-top: 100px
        opacity: 1
        visibility: visible
        width: 360px
        left: 50%
        transform: translateX(-50%)
        margin-left: 340px
        &::before
          content: ""
          position: absolute
          left: 0
          top: 0
          width: 1px
          bottom: 0
          background-color: #ededed
          margin-left: -20px
          z-index: 13
        .modal__overlay
          opacity: 0
          visibility: hidden
        .modal__close
          opacity: 0
          visibility: hidden
        .modal__content
          width: 100%
          transform: translateX(0%)
          // border: 1px solid red
</style>


<template>
  <div :class="$style.root">
    <div :class="$style.rootKernel" :style="kernelStyles">
      <div :class="[$style.app, {[$style.appCordova]: isAgentMode && !isPlatformRBP}]">
        <!-- header -->
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
          <template ><nuxt></nuxt></template>
          <loading-animation v-show="isNavigating"></loading-animation>
        </main>

        <!-- sidebar modal -->
        <div :class="[$style.appSidebar, $style.modal, {[$style.modalOpen]: isOverlayOpen(overlays.aside1)}]" v-if="!pageMode.checkoutMode">
          <div :class="$style.modalOverlay" @click="closeAside1"></div>
          <div :class="[$style.modalContent, $style.modalContentFullHeight, $style.modalContentFromLeft]">
            <button :class="[$style.modalClose, $style.btn]" @click="closeAside1">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                <use xlink:href="/svg/icons.svg?#i-close"></use>
              </svg>
            </button>
            <slot name="aside1">
              <sidebar></sidebar>
            </slot>
          </div>
        </div>

        <!-- cart modal -->
        <div :class="[$style.appCart, $style.modal, {[$style.modalOpen]: isOverlayOpen(overlays.aside2)}, {[$style.modalVisible]: pageMode.checkoutMode}]" v-if="!pageMode.paymentMode">
          <div :class="$style.modalOverlay" @click="closeAside2"></div>
          <div :class="[$style.modalContent, $style.modalContentFullHeight, $style.modalContentFromRight]">
            <button :class="[$style.modalClose, $style.btn]" @click="closeAside2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                <use xlink:href="/svg/icons.svg?#i-close"></use>
              </svg>
            </button>
            <slot name="aside2">
              <cart v-if="!pageMode.paymentMode"></cart>
              <order-summary :orderSummary="orderSummary" v-if="pageMode.paymentMode && orderSummary"></order-summary>
            </slot>
          </div>
        </div>

        <!-- search modal -->
        <div :class="[$style.appSearch, $style.modal, {[$style.modalOpen]: isOverlayOpen(overlays.aside3)}]" v-if="!pageMode.checkoutMode">
          <div :class="$style.modalOverlay" @click="closeAside3"></div>
          <div :class="[$style.modalContent, $style.modalContentFromTop]">
            <button :class="[$style.modalClose, $style.btn]" @click="closeAside3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                <use xlink:href="/svg/icons.svg?#i-close"></use>
              </svg>
              <!-- <svg viewBox="0 0 32 32" width="32px" height="32px">
                <path d="M28,14.5H9.7l8.4-8.4L16,4L4,16l12,12l2.1-2.1l-8.4-8.4H28V14.5z"/>
                <path d="M26.3,7.9l-2.1-2.1L16,13.9L7.9,5.7L5.7,7.9l8.1,8.1l-8.1,8.1l2.1,2.1l8.1-8.1l8.1,8.1l2.1-2.1
                  L18.1,16L26.3,7.9z"/>
              </svg> -->
            </button>
            <slot name="aside3">
              <search></search>
            </slot>
          </div>
        </div>

        <template>
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
            <transition>
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

        </template>

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
  @import "shared/modal"

  .Root
    position: relative
    &__kernel
      position: relative
      display: block

  .App
    position: relative
    +clearfix
    $root: &
    &__header
      position: relative
      height: 72px
      background-color: $white
      display: flex
      flex-direction: column
      margin-bottom: 20px
    &__main
      position: relative
      width: 100%
    &__footer
      position: relative
      background-color: $white
      margin-top: 80px
    &__sidebar
      width: 100%
      max-width: 320px
      // height: 100%
    &__cart
      width: 320px
      margin-left: auto
    &__search
      .modal__content
        height: auto
        max-height: 100%

  .modal
    &__close
      height: 44px
      width: 44px
      margin-left: auto
      margin-top: $gutter
      margin-right: $gutter
    // &__content
      height: 100%

</style>

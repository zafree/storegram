<template>
  <div :class="$style.contentTop" v-if="showContentTop">

    <!-- Vacation Banner -->
    <div :class="$style.hero" v-if="isVacationMode && pageMode.homePage">
      <div :class="[$style.heroHeight, $style.vacationBanner]">
        <div :class="[$style.heroContent, $style.vacationBannerContainer]">
          <div class="vacation">
            <h1 class="vacation__title">{{ i18nText.title }}</h1>
            <p class="vacation__subtitle">{{ i18nText.subTitle }}</p>
            <p class="vacation__announcement" v-html="i18nText.message"></p>
          </div>
        </div>
      </div>
    </div>

    <template v-else-if="isCustomerMode && pageMode.homePage">
      <div class="HeroCarousel">
        <div class="HeroCarousel__sliders">
          <slot v-for="(slider, index) in sliderContents">
            <!-- <transition name="fade" :key="index" v-if="index === currentSlide"> -->
              <div :class="['HeroCarousel__cell', { 'HeroCarousel__cell--isActive': index === currentSlideIndex }]" :key="index">
                <div class="HeroCarousel__cell__image">
                  <responsive-image v-if="slider.imageMeta" :meta="slider.imageMeta" />
                  <img v-else :src="slider.imageUrl" alt="image">
                </div>
                <div class="HeroCarousel__cell__content">
                  <p class="HeroCarousel__cell__content__copy1">{{ $t(slider.copy1) }}</p>
                  <span class="HeroCarousel__cell__content__copy2Svg">
                    <img  :src="slider.copy2Svg" alt="">
                  </span>
                  <!-- <p class="HeroCarousel__cell__content__copy3">{{ slider.copy3 }}</p> -->
                  <button class="Button Button--setDeliveryPoint" type="button" v-if="slider.deliveryMethod" @click="openPreferredDeliveryPointModal(slider.deliveryMethod)">{{ $t(currentSlide.copy4) }}</button>
                </div>
              </div>
            <!-- </transition> -->
          </slot>
        </div>
        <!-- <div class="HeroCarousel__dots">
          <slot v-for="(slide, index) in sliderContents">
            <span :key="index" class="HeroCarousel__dots__dot" :class="{'HeroCarousel__dots__dot--isActive': currentSlideIndex === index}" @click="selectSliderIndex(index)" >
              <img class="HeroCarousel__dots__dot__icon" :src="slide.svgFileName" alt="">
            </span>
          </slot>
        </div> -->
        <button class="Button HeroCarousel__buttonPrevNext HeroCarousel__buttonPrevNext--prev" type="button" @click="changeSlider(true)">
          <span class="HeroCarousel__svgIconWrapper">
            <img class="SvgIcon" src="/svg/carousel-prev.svg" alt="">
          </span>
        </button>
        <button class="Button HeroCarousel__buttonPrevNext HeroCarousel__buttonPrevNext--next" type="button" @click="changeSlider(false)">
          <span class="HeroCarousel__svgIconWrapper">
            <img class="SvgIcon" src="/svg/carousel-next.svg" alt="">
          </span>
        </button>
      </div>
    </template>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import i18nLink from '~/components/i18nLink'
  import i18nKeys from '~/components/layouts/ContentTop.i18n.yaml'
  import ResponsiveImage from '~/components/ResponsiveImage'

  import {
    SET_PREFERRED_DELIVERY_METHOD,
    PICKED_DELIVERY_METHODS,
    CAROUSEL_SLIDER,
    EVENT_OVERLAY_OPENED,
    EVENT_OVERLAY_CLOSED
  } from '~/store/constants.yaml'

  import Notification from '~/components/Notification.vue'
  import { i18nMixin, overlayMixin, deliveryMethodsPermissionMixin } from '~/utils'
  import remoteAssetMixinFactory from '~/utils/remote_asset_mixin_factory'

  export default {
    mixins: [
      remoteAssetMixinFactory('content_top'),
      i18nMixin(i18nKeys),
      overlayMixin,
      deliveryMethodsPermissionMixin
    ],
    components: {
      i18nLink,
      ResponsiveImage,
      Notification
    },
    created () {
      this.$root.$on(EVENT_OVERLAY_OPENED, (payload) => {
        this.stopCarouselAnimation()
      })
      this.$root.$on(EVENT_OVERLAY_CLOSED, (payload) => {
        this.startCarouselAnimation()
      })
    },
    mounted () {
      this.startCarouselAnimation()
    },
    beforeDestroy () {
      this.stopCarouselAnimation()
    },
    data () {
      return {
        currentSlideIndex: 0,
        fadeInOut: true,
        carouselAnimation: null
      }
    },
    computed: {
      ...mapGetters([
        'isCustomerMode',
        'isVacationMode',
        'customerAddresses'
      ]),
      ...mapState([
        'isAppMounted',
        'ui',
        'pageMode',
        'currentCategory'
      ]),
      showContentTop () {
        return (!this.currentCategory && !this.isSearchMode && !this.pageMode.specialMode) && !this.pageMode.profileMode
      },
      isSearchMode () {
        return (this.$route.name === 'search-query' || this.$route.name === 'lang-search-query')
      },
      sliderContents () {
        // let currentOffer = {
        //   imageMeta: this.remoteAssets.content_top.offer
        //   // copy1: 'content_top.slider.agent_content_copy1',
        //   // copy2Svg: '/svg/delivery-point/text-dgAgent.svg',
        //   // copy3: this.$t('content_top.slider.agent_content_copy3', { field: this.__$(numberOfAgents, true) }),
        //   // copy4: 'content_top.slider.agent_content_copy4',
        //   // svgFileName: '/svg/delivery-point/icon-dgAgent.svg'
        //   // deliveryMethod: PICKED_DELIVERY_METHODS.AGENT
        // }
        let agent = {
          imageMeta: this.remoteAssets.content_top.agent,
          copy1: 'content_top.slider.agent_content_copy1',
          copy2Svg: '/svg/delivery-point/text-dgAgent.svg',
          // copy3: this.$t('content_top.slider.agent_content_copy3', { field: this.__$(numberOfAgents, true) }),
          copy4: 'content_top.slider.agent_content_copy4',
          svgFileName: '/svg/delivery-point/icon-dgAgent.svg',
          deliveryMethod: PICKED_DELIVERY_METHODS.AGENT
        }

        let locker = {
          imageMeta: this.remoteAssets.content_top.locker,
          copy1: 'content_top.slider.locker_content_copy1',
          copy2Svg: '/svg/delivery-point/text-dgLocker.svg',
          // copy3: this.$t('content_top.slider.locker_content_copy3', { field: this.__$(numberOfLockers, true) }),
          copy4: 'content_top.slider.locker_content_copy4',
          svgFileName: '/svg/delivery-point/icon-dgLocker.svg',
          deliveryMethod: PICKED_DELIVERY_METHODS.LOCKER
        }

        let hub = {
          imageMeta: this.remoteAssets.content_top.hub,
          copy1: 'content_top.slider.hub_content_copy1',
          copy2Svg: '/svg/delivery-point/text-dgHub.svg',
          // copy3: this.$t('content_top.slider.hub_content_copy3', { field: this.__$(numberOfHubs, true) }),
          copy4: 'content_top.slider.hub_content_copy4',
          svgFileName: '/svg/delivery-point/icon-dgHub.svg',
          deliveryMethod: PICKED_DELIVERY_METHODS.HUB
        }

        let customer = {
          imageMeta: this.remoteAssets.content_top.home,
          copy1: 'content_top.slider.home_content_copy1',
          copy2Svg: '/svg/delivery-point/text-homeDelivery.svg',
          // copy3: this.$t('content_top.slider.home_content_copy3'),
          copy4: 'content_top.slider.home_content_copy4',
          svgFileName: '/svg/delivery-point/icon-homeDelivery.svg',
          deliveryMethod: PICKED_DELIVERY_METHODS.CUSTOMER
        }

        let contents = []
        // contents.push(currentOffer)
        if (this.isAgentDeliveryEnabledForCustomer) contents.push(agent)
        if (this.isLockerDeliveryEnabledForCustomer) contents.push(locker)
        if (this.isHubDeliveryEnabledForCustomer) contents.push(hub)
        contents.push(...[customer])

        return contents
      },
      sliderCount () {
        return this.sliderContents.length - 1
      },
      currentSlide () {
        return this.sliderContents[this.currentSlideIndex]
      }
    },
    methods: {
      startCarouselAnimation () {
        let carouseldLoadInterval = parseInt(CAROUSEL_SLIDER, 10) * 1000
        this.carouselAnimation = setInterval(() => {
          this.changeSlider()
        }, carouseldLoadInterval)
      },
      stopCarouselAnimation () {
        clearInterval(this.carouselAnimation)
      },
      resetCarouselAnimation () {
        this.stopCarouselAnimation()
        this.startCarouselAnimation()
      },
      openPreferredDeliveryPointModal (deliveryMethod) {
        this.$store.commit(SET_PREFERRED_DELIVERY_METHOD, deliveryMethod)
        this.openOverlay(this.overlays.preferredDeliveryPointModal)
      },
      selectSliderIndex (index) {
        this.resetCarouselAnimation()
        this.currentSlideIndex = index
        this.fadeInOutEffect()
      },
      changeSlider (changeToPrevious) {
        this.resetCarouselAnimation()
        if (changeToPrevious) {
          if (this.currentSlideIndex === 0) {
            this.currentSlideIndex = this.sliderCount
          } else {
            this.currentSlideIndex -= 1
          }
        } else {
          if (this.currentSlideIndex === this.sliderCount) {
            this.currentSlideIndex = 0
          } else {
            this.currentSlideIndex += 1
          }
        }
        this.fadeInOutEffect()
      },
      fadeInOutEffect () {
        this.fadeInOut = false
        setTimeout(() => {
          this.fadeInOut = true
        }, 250)
      }

    }
  }
</script>

<style lang="sass" scoped>
  @import "shared/button"

  .HeroCarousel
    position: relative
    height: 420px
    background: linear-gradient(310deg, $red 20%, $blue 120%)
    background-color: $red
    color: $white
    +widescreen
      border-bottom: 1px solid #d9d9d9
    &__sliders
      position: relative
      height: 100%
      overflow: hidden
    &__cell
      top: 0
      left: 0
      width: 100%
      max-width: 100%
      position: absolute
      display: flex
      flex-flow: row wrap
      align-items: center
      height: 100%
      visibility: hidden
      opacity: 0
      transition: none $speed*7 $easing
      transition-property: opacity, visibility
      &::before
        content: ""
        position: absolute
        top: 0
        left: 0
        right: 0
        bottom: 0
        background: linear-gradient(90deg, rgba($black, 0.5) 0%, rgba($black, 0) 40%)
        z-index: 1
      &::after
        content: ""
        position: absolute
        top: 0
        left: 0
        right: 0
        bottom: 0
        background: linear-gradient(0deg, rgba($black, 0.4) 0%, rgba($black, 0) 30%)
        z-index: 1
      // +phablet
        padding-left: 0
        padding-right: 0
      &--isActive
        visibility: visible
        opacity: 1
      // &__image
      //   position: absolute
      //   top: 50%
      //   left: 0
      //   transform: translateY(-50%)
      //   // opacity: 0.5
      //   width: 100%
      //   max-width: 100%
      //   img
      //     width: 100%
      &__image
        position: absolute
        top: 0
        left: 50%
        transform: translateX(-50%)
        height: 100%
        max-height: 100%
        img
          width: auto
          max-width: none
          height: 101%
          max-height: 101%

      &__content
        +container
        flex: 1
        position: absolute
        left: 50%
        transform: translateX(-50%)
        bottom: 0
        margin-bottom: 78px + 20
        width: 100%
        max-width: 280px
        height: 200px
        display: flex
        flex-direction: column
        justify-content: flex-end
        padding-left: 0
        padding-right: 0
        z-index: 2
        // +phablet
          padding-left: 15px
          padding-right: 15px
          // margin-bottom: 78px + 5 + 20
          // height: 270px


        &__copy1,
        &__copy2Svg,
        &__copy3
          text-shadow: 1px 1px 3px rgba($black, 1)

        &__copy1
          font-size: 16px
          max-width: 195px
          color: $white
          line-height: 1.44
          margin-bottom: 8px
          // // +phablet
          //   font-size: 22px
          //   max-width: 280px
          //   margin-left: 0
          +tablet
            margin-left: 90px
        &__copy2Svg
          transform: scale(2.3)
          transform-origin: top left
          margin-bottom: 15px + 75
          // // +phablet
          //   margin-bottom: 34px + 60
          //   transform: scale(3.5)
          //   margin-left: 0
          +tablet
            margin-left: 90px
        &__copy3
          font-size: 14px
          max-width: 125px
          color: $white
          line-height: 1.33
          margin-top: 6px
          // // +phablet
          //   font-size: 16px
          //   max-width: 135px
          //   margin-top: 10px

    &__dots
      z-index: 2
      position: absolute
      bottom: 0
      left: 50%
      display: flex
      flex-direction: row
      transform: translateX(-50%)
      margin-bottom: 15px
      // +phablet
        margin-bottom: 20px
      &__dot
        position: relative
        width: 63px
        height: 63px
        border: 3px solid $white
        border-radius: 500px
        background-color: $white
        cursor: pointer
        overflow: hidden
        padding: 5px
        &:not(:last-child)
          margin-right: 10px
        &--isActive
          border-color: $yellow
          background-color: lighten($yellow, 30%)
        &__icon
          width: 100%
          height: 100%
    &__buttonPrevNext
      z-index: 2
      position: absolute
      left: 50%
      bottom: 0
      padding: 0
      width: 63px
      height: 63px
      margin-bottom: 14px
      display: flex
      justify-content: center
      transform: translateX(-50%)
      // +phablet
        margin-bottom: 20px
      &--prev
        margin-left: -165px
      &--next
        margin-left: 165px

    &__svgIconWrapper
      position: relative
      display: block
      height: 24px
      width: 24px
      .SvgIcon
        position: absolute
        width: 100%
        height: 100%
        left: 0
        top: 0

  .Button
    &--setDeliveryPoint
      +button
      max-width: 280px
      width: 280px
      // margin-left: auto
      // margin-right: auto
      border-radius: 6px
      min-height: 38px
      position: absolute
      bottom: 0
      margin-bottom: -65px
      left: 50%
      transform: translateX(-50%)
      // +phablet
        font-size: 16px
        min-height: 40px


</style>


<style lang="sass" module>
  .content-top
    position: relative
    border: 10px solid red

  .Hero
    display: block
    max-width: 100%
    height: auto
    &__height
      position: relative
      width: 100%
      height: 325px
      background-image: url(/imgs/banner-small.jpg)
      background-position: 50% 100%
      background-size: cover
      background-repeat: no-repeat
    &__image
      position: absolute
      z-index: 1
      width: 100%
      height: 100%
      object-fit: cover
    &__svg
      position: absolute
      z-index: 1
      width: 502px
      height: 529px
      top: 0
      left: 50%
      transform: translateX(-50%)
      margin-top: 30px
      margin-left: 96px
      +tablet
        margin-left: 313px
        margin-top: 50px
      +desktop
        margin-left: 450px
    &__text
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
      display: none
      +tablet
        display: block
        width: 424px
        height: 130px
        margin-left: -130px
        margin-top: 20px
      +desktop
        width: 550px
        height: 80px
        margin-left: -200px
    &__title
      font-size: 42px
      line-height: 1.11
      font-weight: 700
      color: $primary
      text-shadow: 0px 1px 20px rgba($white, .8)

    &__content
      position: relative
      z-index: 3

    &--small
      .Hero
        &__height
          height: 125px
      .__promo
        display: none


  .PromoBanner
    display: flex
    align-items: center
    background-image: url(/imgs/banner.jpg)
    &::before
        content: ""
        position: absolute
        z-index: 2
        top: 0
        left: 0
        width: 100%
        height: 100%
        opacity: .8
        background: linear-gradient(310deg,$red 20%,$blue 120%)
        background-color: $red
    &__container
      flex: 1
      min-height: 1px
      margin-left: auto
      margin-right: auto
      padding-left: 15px
      padding-right: 15px
      text-align: center
      +tablet
        max-width: $tablet - 20
      +desktop
        max-width: $desktop - 20
      +widescreen
        position: relative
        max-width: $widescreen - 20

  .MainBanner
    overflow: hidden
    background-image: url(/imgs/banner.jpg)

  .vacationBanner
    display: flex
    align-items: center
    background-image: url(/imgs/eid-banner.jpg)
    // background-image: url(/imgs/banner-election.jpg)
    background-position: 50% 50%
    +tablet
      background-position: 50% 70%
    &::before
      content: ""
      position: absolute
      z-index: 2
      top: 0
      left: 0
      width: 100%
      height: 100%
      opacity: .8
      background: linear-gradient(310deg,$red 20%,$blue 120%)
      background-color: $red
    &__container
      flex: 1
      min-height: 1px
      margin-left: auto
      margin-right: auto
      padding-left: 15px
      padding-right: 15px
      text-align: center
      +tablet
        max-width: $tablet - 20
      +desktop
        max-width: $desktop - 20
      +widescreen
        position: relative
        max-width: $widescreen - 20

  .__promo

  .__location
    max-width: 600px
    display: block
    margin-left: auto
    margin-right: auto
    margin-top: 25px
    padding-left: 20px
    padding-right: 20px
    position: relative
    &__skip
      text-align: right
      font-size: 13px
      margin-top: 5px
      opacity: .6

  .ButtonSkip
    text-decoration: none
    cursor: pointer
    border: 0
    background-color: transparent
    color: $black
    white-space: nowrap
    text-rendering: auto
    user-select: none
    letter-spacing: 0
    font-weight: 400
    font-style: normal
    box-shadow: none
    padding: 0
    text-decoration: underline
    padding: 5px
    margin-right: -5px

</style>


<style lang="sass" scoped>
 .vacation
   position: relative
   color: $white
   display: flex
   flex-flow: column wrap
   align-items: center
   &__title
     font-size: 38px
     // font-size: 70px
     line-height: 1.22
     font-weight: 700
     // letter-spacing: 0.03em
     text-transform: uppercase
     // +phablet
       font-size: 52px
     +tablet
       font-size: 62px
   &__subtitle
     font-size: 14px
     // font-size: 25px
     line-height: 1.33
     // +phablet
       font-size: 18px
     +tablet
       font-size: 22px
   &__announcement
     font-size: 14px
     line-height: 1.55
     color: $red
     margin-top: 20px
     max-width: 290px
     background-color: rgba($white, .8)
     padding: 20px 15px
     border-radius: $gutter/4
     +tablet
       font-size: 16px
       max-width: 500px
       padding: 20px 70px
</style>

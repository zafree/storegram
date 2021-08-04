<template>
  <div class="Carousel">
    <div class="Carousel__scroll" ref="scrollWrapper">
      <div class="Carousel__sliders" ref="scrollSlider">
        <div :class="cellClass"
          v-for="(featured, index) in featuredList"
          :key="index"
          v-observe-visibility="{
            callback: (isVisible, entry) => featuredListVisibilityChanged(isVisible, entry, index),
            throttle: 200,
            intersection: {
              root: $refs && $refs.scrollWrapper ? $refs.scrollWrapper : null,
              threshold: 0.99
            }
        }"
        >
          <i18n-link class="Carousel__link" :to="featured.link">
            <div :class="imageWrapperClass">
              <computed-image :src="featuredImageInfo(featured)"/>
            </div>
            <h4 :class="titleClass">{{__(featured.name)}}</h4>
          </i18n-link>
        </div>
      </div>
    </div>
    <button @click="scrollPrev()" :class="['Button', 'Carousel__button', 'Carousel__button--prev', {'Carousel__button--isActive': showPrevCarouselButton}]">
      <img src="/svg/featured-carousel-prev.svg" alt="" class="Button__svgIcon">
    </button>
    <button @click="scrollNext()" :class="['Button', 'Carousel__button', 'Carousel__button--next', {'Carousel__button--isActive': showNextCarouselButton}]">
      <img src="/svg/featured-carousel-next.svg" alt="" class="Button__svgIcon">
    </button>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import ComputedImage from '~/components/ComputedImage'
  import i18nLink from '~/components/i18nLink'
  import { makeDefaultImageMeta } from '~/utils'

  import {
    ObserveVisibility
   } from 'vue-observe-visibility'

  const animatedScrollBy = function (el, offset, interval) {
    const scrollBy = 10
    const absOffset = Math.abs(offset)
    const directionVector = offset > 0 ? 1 : -1
    let animated = 0
    interval = interval || 300
    const timerInterval = interval * scrollBy / absOffset

    const timerID = setInterval(function () {
      el.scrollBy(scrollBy * directionVector, 0)
      animated += scrollBy
      if (animated >= absOffset) {
        clearInterval(timerID)
      }
    }, timerInterval)
  }

  export default {
    props: ['featuredList', 'imageWrapperModifier', 'defaultImageSvg'],
    directives: {
      ObserveVisibility
    },
    data () {
      return {
        showPrevCarouselButton: false,
        showNextCarouselButton: false
      }
    },
    computed: {
      ...mapGetters([
        'isAgentMode',
        'specialCategories'
      ]),
      imageWrapperClass () {
        return `Carousel__imageWrapper Carousel__imageWrapper--${this.imageWrapperModifier}`
      },
      titleClass () {
        return `Carousel__title Carousel__title--${this.imageWrapperModifier}`
      },
      cellClass () {
        return `Carousel__cell Carousel__cell--${this.imageWrapperModifier}`
      }
    },
    methods: {
      featuredListVisibilityChanged (isVisible, entry, index) {
        if (index === 0) {
          this.showPrevCarouselButton = !isVisible
        } else if (index === (this.featuredList.length - 1)) {
          this.showNextCarouselButton = !isVisible
        }
      },
      featuredImageInfo (item) {
        return item && item.featured_image_url
          ? item.featured_image_url
          : makeDefaultImageMeta(this.defaultImageSvg).url
      },
      // linkPath (category) {
      //   const catalogName = this.isAgentMode ? CONTAINER_AGENT_CATALOG : CONTAINER_CATALOG
      //   let isSpecialCategory = !!(find(this.specialCategories(catalogName), { 'id': category.id }))

      //   if (isSpecialCategory) {
      //     return '/special/' + category.slug
      //   } else {
      //     return '/category/' + category.slug
      //   }
      // },
      scrollNext () {
        const cellWidth = this.$refs.scrollWrapper.querySelector('.Carousel__cell').clientWidth
        animatedScrollBy(this.$refs.scrollWrapper, cellWidth)
      },
      scrollPrev () {
        const cellWidth = this.$refs.scrollWrapper.querySelector('.Carousel__cell').clientWidth
        animatedScrollBy(this.$refs.scrollWrapper, cellWidth * -1)
      }
    },
    components: {
      ComputedImage,
      i18nLink
    }
  }
</script>

<style lang="sass" scoped>
  @import "shared/button"
  @import "shared/carousel.sass"
  .Carousel
    &__content
      padding-left: 10px
      padding-right: 10px
      position: relative
      display: flex
      align-items: center
    &__copy
      font-size: 12px
      line-height: 1.11
      color: #000000
      flex: 1 50%
    &__seeAll
      padding: 0
      height: 32px
      display: inline-flex
      align-items: center
      font-size: 12px
      line-height: 1.11
      cursor: poniter
      padding-right: 5px
  .Button
    &__svgIcon
      width: 22px
      height: 22px
      fill: $white
      +phablet
        width: 32px
        height: 32px
</style>

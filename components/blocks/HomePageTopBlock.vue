<template>
  <div class="HomeHero" v-if="pageMode.homePage && (blockIsLoading || (!imageLinkBroken && offers.length))">
    <!-- HERO -->
    <div class="HomeHero__container">
      <div class="HomeHero__block" v-if="blockIsLoading"></div>
      <flickity v-else-if="!imageLinkBroken && offers.length" class="carousel" ref="flickity" :options="flickityOptions">
        <template v-for="(offer, index) in offers">
          <div class="carousel-cell" :key="index">
            <i18n-link :to="offer.internal_link" v-if="offer.internal_link">
              <computed-image :class="['carousel-image', {'carousel-image--loaded': imageIsLoaded}, {bannerBgColor: !imageIsLoaded}]"
                :src="offer.banner_image" :animate="false"
                @imageLoaded="imageIsLoaded = true"
                @imageIsNotLoaded="imageLinkBroken = true" :defaultImage="defaultImage"/>
            </i18n-link>
            <a :href="offer.external_link" v-else-if="offer.external_link">
              <computed-image :class="['carousel-image', {'carousel-image--loaded': imageIsLoaded}, {bannerBgColor: !imageIsLoaded}]"
                :src="offer.banner_image" :animate="false"
                @imageLoaded="imageIsLoaded = true"
                @imageIsNotLoaded="imageLinkBroken = true" :defaultImage="defaultImage"/>
            </a>
            <computed-image v-else :class="['carousel-image', {'carousel-image--loaded': imageIsLoaded}, {bannerBgColor: !imageIsLoaded}]"
              :src="offer.banner_image" :animate="false"
              @imageLoaded="imageIsLoaded = true"
              @imageIsNotLoaded="imageLinkBroken = true" :defaultImage="defaultImage"/>
          </div>
        </template>
      </flickity>
      <template v-if="offers.length > 1">
        <button class="carousel-button prev" @click="previous()">
          <svg viewBox="0 0 32 32" width="32px" height="32px">
            <path id="Path_22" d="M4.6,16L15,5.6v8.2h12.4v4.3H15v8.2L4.6,16z"/>
          </svg>
        </button>
        <button class="carousel-button next" @click="next()">
          <svg viewBox="0 0 32 32" width="32px" height="32px">
            <path id="Path_22" d="M4.6,16L15,5.6v8.2h12.4v4.3H15v8.2L4.6,16z" transform="translate(32, 32) rotate(180) "/>
          </svg>
        </button>
      </template>
    </div>
  </div>
</template>

<script>
  import ComputedImage from '~/components/ComputedImage'
  import { mapState } from 'vuex'
  import i18nLink from '~/components/i18nLink'
  import { getRandomColorCssClass, makeDefaultImageMeta } from '~/utils'
  import { getBlocks } from '~/api/index'
  // import Flickty from '~/components/blocks/flickity'

  const DEFAULT_IMAGE_SVG = '/svg/default-category-banner.svg'

  export default {
    mounted () {
      getBlocks('page', 'home', 'top')
        .then(response => {
          if (response && response.Top &&
            response.Top.length && response.Top[0].block &&
            response.Top[0].block.offers && response.Top[0].block.offers.length) {
            this.offers = response.Top[0].block.offers
              .filter(o => o.banner_image)
              .map(o => {
                if (o.related_type) {
                  if (o.related_type === 'App\\Models\\Product') {
                    o.internal_link = `/product/${o.related_slug}`
                  } else if (o.related_type === 'App\\Models\\Category') {
                    o.internal_link = `/category/${o.related_slug}`
                  }
                } else if (o.link) {
                  if (process.client && location && o.link.includes(location.origin)) {
                    o.internal_link = o.link.replace(location.origin, '')
                  } else {
                    o.external_link = o.link
                  }
                }
                return o
              })
          }
          this.blockIsLoading = false
        })
        .catch(error => {
          console.log(error)
          this.blockIsLoading = false
        })
    },
    data () {
      return {
        offers: [],
        blockIsLoading: true,
        imageIsLoaded: null,
        imageLinkBroken: false,
        defaultImage: makeDefaultImageMeta(DEFAULT_IMAGE_SVG, 1200).url,
        flickityOptions: {
          contain: true,
          initialIndex: 3,
          prevNextButtons: false,
          // pageDots: false,
          wrapAround: true,
          selectedAttraction: 0.15,
          friction: 0.8,
          autoPlay: 5000
          // arrowShape: 'M14.5,50l32.3-32.3v25.7h38.6v13.3H46.8v25.7L14.5,50z'
        }
      }
    },
    methods: {
      next () {
        this.$refs.flickity.next()
      },
      previous () {
        this.$refs.flickity.previous()
      }
    },
    computed: {
      ...mapState([
        'pageMode',
        'currentCategory'
      ]),
      bannerBgColor () {
        return this.$style[getRandomColorCssClass('abc')]
      }
    },
    components: {
      i18nLink,
      ComputedImage
      // Flickty
    }
  }
</script>

<style lang="sass" module>
  @import "shared/banner"
</style>

<style lang="sass" scoped>
  .carousel
    margin-bottom: 30px
    // +phablet
      padding-bottom: 20px
    &-cell
      width: 100%
      // padding-bottom: 43.75%
      padding-bottom: 50.32258064516129%
      background-color: #ddd
    &-image
      position: absolute
      width: 100%
      height: 100%
      top: 0
      left: 0
      opacity: 0
      visibility: hidden
      transition: 0.6s all ease-out
      &--loaded
        opacity: 1
        visibility: visible

    &-button
      +button
      display: inline-flex
      align-items: center
      justify-content: center
      background-color: $white
      height: 28px
      width: 28px
      position: absolute
      top: 50%
      transform: translateY(-50%)
      +tablet
        height: 44px
        width: 44px
      svg
        width: 18px
        height: 18px
        +tablet
          width: auto
          height: auto
      &.prev
        left: 20px
        +tablet
          left: 40px
      &.next
        right: 20px
        +tablet
          right: 40px

</style>

<style lang="sass" scoped>
  .CategoryBanner
    position: relative
    background-color: $white
  .HomeHero
    position: relative
    background-color: $white
    // margin-left: -30px
    // margin-right: -30px
    // +desktop
    //   margin-left: -100px
    //   margin-right: -100px
    &__container
      position: relative
      margin-right: auto
      margin-left: auto
      min-height: 1px
      max-width: 1240px
      width: 100%

    // display: none
    &__block,
    &__imageWrapper
      position: relative
      // padding-bottom: 43.75%
      padding-bottom: 50.32258064516129%
      background-color: #ddd //rgba($black, 0.06)
      // border-radius: 8px
      overflow: hidden

    &__image
      position: absolute
      width: 100%
      height: 100%
      top: 0
      left: 0
      opacity: 0
      visibility: hidden
      transition: 0.6s all ease-out
      &--loaded
        opacity: 1
        visibility: visible
    &__header
      height: 56px
      padding-left: 12px
      padding-right: 12px
      position: relative
    &__heading
      font-size: 16px
      line-height: 1.22
      font-weight: $weight-medium
      letter-spacing: -0.02em
      color: $text
      padding-top: 20px
</style>

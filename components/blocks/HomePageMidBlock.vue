<template>
  <div class="carousel" v-if="pageMode.homePage && (blockIsLoading || (!allImageLinkBroken && offers.length))">
    <div class="carousel__slider carousel__slider--scrollOff" v-if="blockIsLoading">
      <div class="carousel__cell" >
        <div class="carousel__imageWrapper"></div>
      </div>
      <div class="carousel__cell">
        <div class="carousel__imageWrapper"></div>
      </div>
    </div>
    <div class="carousel__slider" v-else-if="offers.length">
      <template v-for="(offer, index) in offers">
        <div class="carousel__cell" :key="index" v-if="!offer.imageLinkBroken">
          <a class="carousel__link" :href="offer.external_link" v-if="offer.external_link">
            <div class="carousel__imageWrapper">
              <computed-image class="carousel__image" :src="offer.banner_image" :animate="false"
                @imageIsNotLoaded="offer.imageLinkBroken = true" :defaultImage="defaultImage"></computed-image>
            </div>
          </a>
          <div class="carousel__imageWrapper" v-else-if="offer.internal_link && !offer.imageLinkBroken">
            <i18n-link class="carousel__link" :to="offer.internal_link">
              <computed-image class="carousel__image" :src="offer.banner_image" :animate="false"
                @imageIsNotLoaded="offer.imageLinkBroken = true" alt=""></computed-image>
            </i18n-link>
          </div>
          <div class="carousel__imageWrapper" v-else-if="!offer.imageLinkBroken">
            <computed-image class="carousel__image" :src="offer.banner_image" :animate="false"
              @imageIsNotLoaded="offer.imageLinkBroken = true" alt=""></computed-image>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import ComputedImage from '~/components/ComputedImage'
  import i18nLink from '~/components/i18nLink'
  import { makeDefaultImageMeta } from '~/utils'
  import { getBlocks } from '~/api/index'
  import { mapState } from 'vuex'

  const DEFAULT_IMAGE_SVG = '/svg/default-category-banner.svg'

  export default {
    mounted () {
      getBlocks('page', 'home', 'mid')
        .then(response => {
          if (response && response.Mid &&
            response.Mid.length && response.Mid[0].block &&
            response.Mid[0].block.offers && response.Mid[0].block.offers.length) {
            this.offers = response.Mid[0].block.offers
            this.offers = this.offers
              .filter(o => o.banner_image)
              .map(o => {
                if (o.related_type) {
                  if (o.related_type === 'App\\Models\\Product') {
                    o.internal_link = `/product/${o.related_slug}`
                  } else if (o.related_type === 'App\\Models\\Category') {
                    o.internal_link = `/category/${o.related_slug}`
                  }
                } else if (o.link) {
                  o.external_link = o.link
                }
                o.imageLinkBroken = false
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
        defaultImage: makeDefaultImageMeta(DEFAULT_IMAGE_SVG, 1200).url
      }
    },
    computed: {
      ...mapState([
        'pageMode'
      ]),
      allImageLinkBroken () {
        return this.offers.reduce((acc, current) => acc || current.imageLinkBroken, false)
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
  @import "shared/carouselm"

  .carousel
    margin-left: -15px
    margin-right: -15px
    +desktop
      margin-left: 0
      margin-right: 0
    &__slider
      &--scrollOff
        overflow-x: hidden
    &__cell
      width: 70%
      +tablet
        width: 40%
    &__imageWrapper
      border-radius: 10px
      position: relative
      padding-bottom: 66.67%
      background-color: #ddd // rgba($black, 0.06)
      border-radius: 8px
      overflow: hidden
    &__image
      position: absolute
      width: 100%
      height: 100%
      top: 0
      left: 0
    &__title
      padding-left: 5px
      padding-right: 5px
      font-size: 13px
</style>

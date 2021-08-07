<template>
  <modal>
    <template slot="title">{{$t('rating_page.reivew_us')}}</template>
    <template>
      <transition name="fade">
        <p class="thanks" v-if="reviewGiven">{{ $t('rating_page.thanks') }}</p>
      </transition>
      <transition name="fade">
        <div class="Review" v-if="selectedRating && !reviewGiven">
          <div class="Header">
            <div class="Header__productImage">
              <computed-image :src="productImage" defaultImage="/svg/default-brand-logo.svg"></computed-image>
            </div>
            <div class="Header__content">
              <p class="Header__text">{{ $t('rating_page.rate_experience') }}:</p>
              <span class="Header__label">{{ $t('rating_page.order') }} # {{ review.order_code }}</span>
            </div>
          </div>
          <div class="Emosi">
            <h3 class="Content__lable">{{ $t(selectedRating.text) }}</h3>
            <div class="Emosi__emos"> 
              <svg-icon class="Emosi__emos__emo" v-for="(rating, index) in ratings" :key="index" :fileName="selectedRating.rate === rating.rate ? rating.emo : rating.emoMuted" @click.native="selectRating(index)"></svg-icon>
            </div>
          </div>
          <div class="Content">
            <h3 class="Content__lable">{{ $t(selectedRating.text) }}</h3>
            <p class="Content__text">{{ $t('rating_page.experience_with_us') }}:</p>
            <textarea v-model="note" :class="['Content__textarea', { 'validation': reviewNotGivenValidation }]" type="text" :placeholder="$t('rating_page.placeholder')"></textarea>
            <button :class="['Button', {'Button--active': note}]" @click="updateReview">{{ $t('rating_page.done') }}</button>
          </div>
        </div>
      </transition>
      <transition name="fade">
        <div class="Overlay__modal" v-if="!selectedRating && !reviewGiven">
          <div class="Modal">
            <div class="Modal__productImage">
              <computed-image v-if="productImage" :src="productImage" defaultImage="/svg/default-brand-logo.svg"></computed-image>
            </div>
            <div class="Modal__content">
              <p class="Modal__text">{{ $t('service_review.question') }}</p>
              <div class="Modal__emos">
                <svg-icon class="Modal__emos__emo" v-for="(rating, index) in ratings" :key="index" :fileName="rating.emo" @click.native="selectRating(index)"></svg-icon>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </template>
    <template slot="actions">
      <button :class="[$style.button, $style.buttonModalClose]" type="button" name="button" @click="closeModal">
        <img :class="[$style.buttonIconSvg, $style.buttonIconSvgLeft]" src="/svg/icon-donation.svg" alt="Modal Close">
      </button>
    </template>
  </modal>
</template>
<script>

import ComputedImage from '~/components/ComputedImage'
import { updateServiceReview } from '~/api'
import { mapState, mapGetters } from 'vuex'
import Modal from '~/components/Modal'
import { overlayMixin } from '~/utils'
import { SET_OVERLAY_CONTEXT } from '~/store/constants.yaml'
import SvgIcon from '~/components/SvgIcon'
export default {
  mixins: [overlayMixin],
  data () {
    return {
      reviewNotGivenValidation: false,
      reviewGiven: false,
      selectedRating: null,
      note: null,
      ratings: [
        { rate: 1, emo: '/review-emos/icon-terrible.svg', emoMuted: '/review-emos/icon-terrible-muted.svg', text: 'rating_page.experience.terrible' },
        { rate: 2, emo: '/review-emos/icon-bad.svg', emoMuted: '/review-emos/icon-bad-muted.svg', text: 'rating_page.experience.bad' },
        { rate: 3, emo: '/review-emos/icon-disappointing.svg', emoMuted: '/review-emos/icon-disappointing-muted.svg', text: 'rating_page.experience.disappointing' },
        { rate: 4, emo: '/review-emos/icon-happy.svg', emoMuted: '/review-emos/icon-happy-muted.svg', text: 'rating_page.experience.good' },
        { rate: 5, emo: '/review-emos/icon-great.svg', emoMuted: '/review-emos/icon-great-muted.svg', text: 'rating_page.experience.great' }
      ]
    }
  },
  computed: {
    ...mapState([
      'pageMode',
      'ui'
    ]),
    ...mapGetters([
      'authToken'
    ]),
    review () {
      return this.ui.overlayContext
    },
    productImage () {
      if (this.review && this.review.order && this.review.order.line_items[0] && this.review.order.line_items[0].image) {
        return this.review.order.line_items[0].image
      }
      return null
    }
  },
  methods: {
    closeModal () {
      this.$store.commit(SET_OVERLAY_CONTEXT, null)
      this.closeServiceReviewModal()
    },
    selectRating (index) {
      this.selectedRating = this.ratings[index]
    },
    updateReview () {
      if (!this.note || !this.note.trim()) {
        this.reviewNotGivenValidation = true
        this.note = null
        return
      }

      this.reviewNotGivenValidation = false
      updateServiceReview(this.authToken, this.review.review_id, {
        rating: this.selectedRating.rate,
        note: this.note
      })
      .finally(() => {
        this.reviewGiven = true
        setTimeout(() => {
          this.closeModal()
        }, 1 * 1000)
      })
    }
  },
  components: {
    Modal,
    ComputedImage,
    SvgIcon
  }
}
</script>

<style lang="sass" module>
  @import "shared/button"
</style>
<style lang="sass" scoped>
  .Review 
    position: relative 
    background-color: #ffffff
    width: 100% 
    // height: 100vh
    overflow: hidden
    .Header 
      padding: 25px 0 12px
      position: relative 
      display: flex 
      flex-direction: column
      align-items: center
      justify-content: center
      &__productImage
        border-radius: 4px
        width: 62px 
        height: 62px 
        overflow: hidden
        background-color: #dddddd
        &img 
          widht: 100% 
          height: 100%
      &__content
        padding: 15px 10px 10px
        max-width: 220px
        width: 100%
        text-align: center
      &__text 
        font-size: 14px 
        line-height: 1.33 
        color: $black 
      &__label 
        font-size: 13px 
        line-height: 1.33 
        color: rgba($black, 0.34)
    .Emosi 
      position: relative
      display: flex 
      flex-direction: column 
      align-items: center
      justify-content: center
      padding: 10px 20px 10px
      &__emos
        font-size: 2.5em
        margin-top: 20px
        text-align: center
        flex-direction: row
        display: flex
        &__emo
          padding-right: 10px
          cursor: pointer
    .Content 
      display: flex 
      flex-direction: column 
      align-items: center
      justify-content: center
      border-top: 1px solid #EDEDED
      margin-top: 25px
      padding: 30px 20px 0
      &__lable 
        font-size: 20px 
        line-height: 1.55
        color: $black
      &__text 
        font-size: 13px 
        line-height: 1.33 
        color: rgba($black, 0.34)
      &__textarea
        margin-top: 27px
        border: 1px solid #E5E5E5
        width: 100%
        height: 100px
        padding: 15px 15px 0
        &:focus 
          outline: none
  .Button 
    background-color: $black
    color: #fff 
    height: 52px
    width: 100% 
    font-size: 18px 
    border-radius: 4px
    margin-top: 40px
    &--active
      background-color: $primary
</style>

<style lang="sass" scoped>
  .Overlay 
    z-index: 400
    position: fixed 
    top: 0 
    left: 0
    width: 100% 
    height: 100%  
    margin-left: auto 
    margin-right: auto 
    display: flex 
    justify-content: center 
    align-items: center 
    // background-color: rgba($black, 0.75)
    overflow: auto
    min-width: 320px
    height: 100% 
    &__close
      position: absolute 
      top: 0 
      right: 0
      color: #ffffff 
      font-size: 14px 
      margin-top: 40px 
      margin-right: 30px
      cursor: pointer 
      z-index: 500
    &__modal 
      background-color: #ffffff 
      position: relative
      outline: 0
      overflow: hidden
      padding: 40px 20px
      // box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.3)
      border-radius: 4px
      margin-left: 20px 
      margin-right: 20px
      max-width: 400px
      .Modal 
        position: relative 
        &__productImage 
          width: 80px
          height: 80px
          background-color: #DDDDDD
          border-radius: 4px
          overflow: hidden
          margin-left: 80px
          &img 
            width: 100% 
            height: 100% 
            overflow: hidden
        &__content 
          padding: 10px 10px 20px
        &__text 
          font-size: 16px
          line-height: 1.5
          color: $black 
          text-align: center 
          max-width: 220px 
          width: 100%
        &__emos
          font-size: 2em
          margin-top: 10px
          text-align: center
          flex-direction: row
          display: flex
          justify-content: space-evenly
          &__emo
            padding-right: 10px
            cursor: pointer
  .ButtonGroup 
    blackground-color: rgba(red, 0.3)
    display: flex 
    flex-direction: row 
  .Button 
    &__save,
    &__cancel
      border: 1px solid #DFE0E4
      color: #1C7EEB
      font-size: 16px 
      font-weight: 400 
      width: 100px
      height: 42px
      border-radius: 4px
    &__save 
      flex: 1
    &__cancel 
      flex: 1
      margin-left: 20px 
</style>

<style lang="sass">
.validation
  border: 1px solid red !important
.thanks
  text-align: center
  font-size: 2em
  font-weight: $weight-bold
  margin-top: 100px
</style>

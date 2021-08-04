<template>
  <modal :on-click-outside="closeDonationModal">
    <template slot="title">{{$t('donation.donation_modal')}}</template>
    <template>
      <div class="donation">
        <div class="donation__video">
          <!-- 16:9 aspect ratio -->
          <div class="embed embed--16by9">
            <iframe class="embed__item" src="https://www.youtube.com/embed/WEw3aIqt8ew?rel=0&controls=0&autoplay=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        </div>
        <p class="donation__brief">
          {{$t('donation.brief')}}
        </p>
      </div>
    </template>
    <template name="actions">
      <button :class="[$style.button, $style.buttonModalClose]" type="button" name="button" @click="closeDonationModal">
        <img :class="[$style.buttonIconSvg, $style.buttonIconSvgLeft]" src="/svg/icon-donation.svg" alt="Modal Close">
      </button>        
      <template v-if="!currentDonationStatus">
        <div class="checkbox">
          <input class="checkbox__input" type="checkbox" v-model="confirmDonateStatus" id="confirm-to-donate">
          <label class="checkbox__label" for="confirm-to-donate">{{$t('donation.confirm_to_donate')}}</label>
        </div>
        <div class="ButtonGroup">
          <button @click="collectDonation()" class="Button Button--donate" :class="{'Button--disable': !confirmDonateStatus}">{{$t('donation.donate')}}</button>
        </div>
      </template>
    </template>
    <template v-if="currentDonationStatus">
      <button class="Button Button--modalCloseBottomText" @click="closeDonationModal()">{{$t('donation.modal_close')}}</button>
    </template>
  </modal>
</template>

<script>
  import Modal from '~/components/Modal'
  import { overlayMixin } from '~/utils'
  import { mapState } from 'vuex'
  import {
    EVENT_TOGGLE_DONATION_FLAG
  } from '~/store/constants.yaml'

  export default {
    mixins: [overlayMixin],
    components: {
      Modal
    },
    data () {
      return {
        confirmDonateStatus: false,
        currentDonationStatus: false
      }
    },
    created () {
      this.currentDonationStatus = this.ui.overlayContext.confirmDonateStatus
    },
    computed: {
      ...mapState([
        'ui'
      ])
    },
    methods: {
      collectDonation () {
        this.$root.$emit(EVENT_TOGGLE_DONATION_FLAG, this.confirmDonateStatus)
        this.closeDonationModal()
      }
    }
  }
</script>

<style lang="sass" module>
  @import "shared/button"
  .Button
    &--modalClose
      color: rgba($black,.44)
      fill: rgba($black,.44)
      &:hover
        color: rgba($black,.66)
        fill: rgba($black,.66)
      &:focus,
      &:active
          outline: none
</style>

<style lang="sass" scoped>
  .embed
    position: relative
    display: block
    height: 0
    padding: 0
    overflow: hidden
    &--16by9
      padding-bottom: 56.25%
    &__item
      position: absolute
      top: 0
      bottom: 0
      left: 0
      width: 100%
      height: 100%
      border: 0

  .Button
    &--disable
      cursor: not-allowed
      opacity: .5

  .Button
    &Group
      position: relative
      margin-top: 10px
    &--donate
      width: 100%
      padding: 0 20px
      height: 44px
      font-size: 16px
      line-height: 44px
      +btnYellow
    &--modalCloseBottomText
      border: 1px solid #d9d9d9
      height: 32px
      padding: 0 10px
      font-size: 13px
      color: #333
      fill: #333
      display: inherit
      margin-left: auto
      margin-top: 50px
      &:hover,
      &:focus,
      &:active
        color: #333
        fill: #333
        border-color: #777

  .donation
    position: relative
    &__video
      background-color: #dddddd
      margin-bottom: 20px
      margin-top: -30px
      margin-left: -30px
      margin-right: -30px
    &__brief
      font-size: 14px
      line-height: 1.66

  .checkbox
    position: relative
    margin-top: 40px
    &__input[type=checkbox]
      position: absolute
      z-index: 1
      top: 0
      left: 0
      margin-top: 12px

    &__label
      display: inline-block
      position: relative
      cursor: pointer
      padding: 10px 20px
      font-size: 16px
</style>

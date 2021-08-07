<template>
  <div class="donation">
    <template>
      <div class="checkbox">
        <input class="checkbox__input" type="checkbox" id="donation_permission" v-model="confirmDonateStatus">
        <label class="checkbox__label" for="donation_permission">
          {{$t('donation.permission')}}
        </label>
      </div>
      <div class="ButtonGroup">
        <a href="#" class="Button Button--details" @click="openDonationModal">{{$t('donation.show_details')}}</a>
      </div>
    </template>

  </div>
</template>

<script>
  import { overlayMixin } from '~/utils'
  import { collectDonation } from '~/api'
  import {
    SET_OVERLAY_CONTEXT,
    EVENT_TOGGLE_DONATION_FLAG
  } from '~/store/constants.yaml'

  import { mapGetters } from 'vuex'

  export default {
    props: ['orderId', 'propDonationStatus'],
    mixins: [overlayMixin],
    mounted () {
      this.confirmDonateStatus = this.propDonationStatus
      this.$root.$on(EVENT_TOGGLE_DONATION_FLAG, (flag) => {
        this.confirmDonateStatus = flag
      })
    },
    data () {
      return {
        confirmDonateStatus: false
      }
    },
    watch: {
      confirmDonateStatus: function (newValue, oldValue) {
        collectDonation(this.authToken, this.orderId, newValue)
        .then((response) => {
        })
      }
    },
    computed: {
      ...mapGetters([
        'authToken'
      ])
    },
    methods: {
      openDonationModal () {
        let contextObj = {
          orderId: this.orderId,
          confirmDonateStatus: this.confirmDonateStatus
        }
        this.$store.commit(SET_OVERLAY_CONTEXT, contextObj)
        this.openOverlay(this.overlays.donationModal)
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import "shared/button"

  .Button
    &Group
      position: relative
      padding-left: 20px

    &--donate,
    &--details
      line-height: 26px
      height: 26px
    &--donate
      margin-right: 10px
      visibility: hidden
      opacity: 0
      margin-left: -73px
      padding: 0 8px
      +button
    &--details
      text-decoration: underline
      font-size: 13px
      padding: 0
    &--donateShow
      visibility: visible
      opacity: 1
      margin-left: 0
    &--cancelDonate
      padding: 0
      height: auto
      text-decoration: underline
      line-height: inherit

  .donation
    position: relative
    display: block
    width: 100%
    &__successMsg
      font-size: 14px
      line-height: 1.44

  .checkbox
    position: relative
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

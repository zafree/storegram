<template>
  <modal :on-click-outside="closeEmiViewModal">
    <template slot="title">{{ $t('emi_modal.title') }}</template>
    <div class="Emi">
      <div class="Emi__column">
        <div class="Emi__title">{{ $t('emi_modal.supported_banks') }}</div>
        <div class="Emi__body">
          <ul class="attrList">
            <li v-for="(emiSupportedBank, index) in emiSupportedBanks" :key="index" class="attrList__row">
              <ul class="attrList__body attrList__body--fullWidth">
                <li class="attrList__brief">{{ emiSupportedBank.name }}</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <div class="Emi__column">
        <div class="Emi__title">{{ $t('emi_modal.plans') }}</div>
        <div class="Emi__body">
          <ul class="attrList">
            <li class="attrList__row" v-for="(emi, key) in emis" :key="key">
              <h4 class="attrList__title">{{ __$(emi.month) }} {{ $t('emi_modal.zero_percent_per_month') }}</h4>
              <ul class="attrList__body">
                <li class="attrList__brief">
                  <span class="price">
                    <span class="price__amount">৳ {{ __$(emi.amount) }}</span>
                    <span class="price__perMonth"> {{ $t('emi_modal.per_month') }}</span>
                  </span>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <template slot="actions">
      <button class="Button Button--modalClose" type="button" name="button" @click="closeEmiViewModal">
        <img class="Button__iconSvg Button__iconSvg--left " src="/svg/icon-emi.svg" alt="">
      </button>
    </template>
  </modal>
</template>

<script>
  import Modal from '~/components/Modal'
  import { overlayMixin } from '~/utils'
  import { mapState } from 'vuex'

  export default {
    mixins: [overlayMixin],
    components: {
      Modal
    },
    computed: {
      ...mapState([
        'ui'
      ]),
      emis () {
        return this.ui.overlayContext.emi
      },
      emiSupportedBanks () {
        return this.ui.overlayContext.emiBanks
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import "shared/button"
  .Emi
    display: flex
    flex-flow: row wrap
    margin-top: -20px
    margin-left: -15px
    margin-right: -15px
    // +phablet
      padding-left: 15px
      padding-right: 15px
    +tablet
      margin-top: 5px
    &__column
      flex: 1 100%

    &__title
      padding: 12px 0px
      font-size: 16px
      font-weight: 700
      color: #333
      fill: #333
      border-bottom: 1px solid #ddd
    &__body
      color: #555
      fill: #555
      padding: 12px 0px 0px
      font-size: 14px
      +tablet
        padding-bottom: 20px
  .attrList
    margin: 0
    padding: 0
    list-style: none

    // li
    &__row
      display: flex
      flex-flow: row wrap
      width: 100%
      padding: 10px 0
      &:not(:last-child)
        border-bottom: 1px solid #f5f5f5
    &__title
      color: #aaa
      width: 50%
      padding-right: 10px

    // ul ul
    &__body
      padding: 0
      margin: 0
      width: 50%
      line-height: 1.4
      text-align: right
      &--fullWidth
        width: 100%
        text-align: left

    // ul ul li
    &__brief
      list-style: none
  .price
    &__amount
      font-size: 16px

    &__perMonth
      color: #aaa
      font-size: 12px

  .Button
    flex: 1
    &__iconSvg
      width: 14px
      height: 14px
    &--modalClose
      background-color: transparent
      border: none
      color: #777
      fill: #777
      &:hover,
      &:focus
        color: #555
        fill: #555
</style>

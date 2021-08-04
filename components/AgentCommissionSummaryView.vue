<template>
  <div class="agentBalance">
    <div class="agentBalance__row" @click="showCommissionDetails = !showCommissionDetails">
      <div class="agentBalance__col1">
        <label class="agentBalance__label">{{ $t('agent_commission.balance')}}</label>
        <p class="agentBalance__amount">
          <span>৳ {{ __$(commission.total_commission_paid) }} {{ $t('agent_commission.paid') }}</span>
          <span class="agentBalance__pendingAmount"> (৳ {{ __$(commission.total_commission_pending) }} {{ $t('agent_commission.pending') }})</span>
        </p>
        <div class="agentBalance__showMore">
          <span v-if="showCommissionDetails" class="agentBalance__showMoreText">{{ $t('profile.hide_details') }}</span>
          <span v-else class="agentBalance__showMoreText">{{ $t('profile.show_details') }}</span>
          <span class="agentBalance__showMoreIcon">
            <img class="agentBalance__showMoreIcon--image" src="/svg/arrow-right.svg" alt="arrow right">
          </span>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div class="agentBalance__row" v-show="showCommissionDetails">
        <div class="agentBalance__col3">
          <label class="agentBalance__label">{{ $t('agent_commission.sales_commission') }}</label>
          <p class="agentBalance__amount">
            <span>৳ {{ __$(commission.order_commission_paid) }} {{ $t('agent_commission.paid') }}</span>
            <span class="agentBalance__pendingAmount"> (৳ {{ __$(commission.order_commission_pending) }} {{ $t('agent_commission.pending') }})</span>
          </p>
        </div>
        <div class="agentBalance__col4">
          <label class="agentBalance__label">{{ $t('agent_commission.delivery_commission') }}</label>
          <p class="agentBalance__amount">
            <span>৳ {{ __$(commission.delivery_commission_paid) }} {{ $t('agent_commission.paid') }}</span>
            <span class="agentBalance__pendingAmount"> (৳ {{ __$(commission.delivery_commission_pending) }} {{ $t('agent_commission.pending') }})</span>
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import {
    LOAD_AGENT_COMMISSION
  } from '~/store/constants.yaml'
  import logger from '~/utils/logger'

  export default {
    created () {
      this.$store.dispatch(LOAD_AGENT_COMMISSION)
        .then(commission => {
          this.commission = commission
        })
        .catch(reason => {
          logger.error(reason)
        })
    },
    data () {
      return {
        showCommissionDetails: false,
        commission: {
          total_commission_paid: 0,
          total_commission_pending: 0,
          order_commission_paid: 0,
          order_commission_pending: 0,
          delivery_commission_paid: 0,
          delivery_commission_pending: 0
        }
      }
    }
  }
</script>

<style lang="sass" scoped>
  .agentBalance
    position: relative
    width: 100%
    max-width: 640px
    margin-bottom: 30px
    &__row
      display: block
      &--hide
        display: none
        // opacity: 0
        // visibility: hidden
        // transition: opacity .3s, visibility .3s
      &--show
        display: block
        // opacity: 1
        // visibility: visible
        // transition: opacity .6s ease 0.2s, visibility .6s ease 0.2s

    &__col1,
    &__col2,
    &__col3,
    &__col4
      display: block
      position: relative
      color: $white
      padding: 10px 20px
    &__col1
      background-color: rgba($green, 1)
      border-radius: 2px 2px 0 0
      cursor: pointer
    &__col2
      background-color: rgba($yellow, 1)
    &__col3
      background-color: rgba($purple, .7)
    &__col4
      background-color: rgba($red, .7)
      border-radius: 0 0 2px 2px
    &__label
      font-size: 14px
      font-weight: 400
      line-height: 1.22
      display: block
    &__amount
      font-size: 36px
      font-weight: 700
      line-height: 1.22
    &__pendingAmount
      font-size: .5em
      font-weight: 400
      line-height: 1.22
    &__showMore
      color: rgba($black, .5)
      fill: rgba($black, .5)
      background-color: rgba($white, .4)
      border-radius: 2px
      position: absolute
      right: 0
      top: 50%
      transform: translateY(-50%)
      display: flex
      align-items: center
      padding: 5px
      margin-right: 15px
    &__showMoreText
      line-height: 1.11
      font-size: 13px
      padding-right: 5px
    &__showMoreIcon
      height: 10px
      transform-origin: center center
      transform: rotate(90deg)
      &--image
        width: 10px 
        height: 10px
        
</style>

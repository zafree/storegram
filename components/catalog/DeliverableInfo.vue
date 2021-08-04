<template v-if="deliverableInfo">
  <div class="Flag">
    <template>
      <div class="Flag__item" v-for="(delivery, index) in deliverableInfoList" :key="index">
        <div class="Flag__icon">
          <img class="Flag__icon__svg" :src="delivery.icon" alt="">
          <img :class="['Flag__icon__status', delivery.deliverableStateIconCss]" :src="delivery.deliverableStateIcon" alt="">
        </div>
        <div class="Flag__content">
          <p class="Flag__copy">{{ delivery.flagCopy }}
            <button type="button" v-if="isCustomerMode" class="Button Button--text" @click="openPreferredDeliveryPointModal(delivery.openModal)">
              <template v-if="delivery.conflictWithPreferredAddress">({{ delivery.flagCopyButton }})</template>
              <template v-else>{{ delivery.flagCopyButton }}</template>
            </button>
            <template v-else>
              <template v-if="delivery.conflictWithPreferredAddress">({{ delivery.flagCopyButton }})</template>
              <template v-else>{{ delivery.flagCopyButton }}</template>
            </template>
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ADDRESS_TYPES, SET_PREFERRED_DELIVERY_METHOD } from '~/store/constants.yaml'
import i18nKeys from '~/components/catalog/DeliverableInfo.i18n.yaml'
import { i18nMixin, overlayMixin, deliveryMethodsPermissionMixin } from '~/utils'

export default {
  props: ['currentVariant'],
  mixins: [i18nMixin(i18nKeys), overlayMixin, deliveryMethodsPermissionMixin],
  data () {
    return {
      agent_delivery: ADDRESS_TYPES.AGENT,
      locker_delivery: ADDRESS_TYPES.LOCKER,
      hub_delivery: ADDRESS_TYPES.HUB,
      customer_delivery: ADDRESS_TYPES.CUSTOMER,
      checkedSvgUrl: '/svg/delivery-point/checked.svg',
      warningSvgUrl: '/svg/delivery-point/cancel-warning.svg',
      mutedSvgUrl: '/svg/delivery-point/close-muted.svg'
    }
  },
  computed: {
    ...mapGetters([
      'isCustomerMode',
      'preferredDeliveryAddress'
    ]),
    deliverableInfoList () {
      let isPreferredDeliveryAddressAgent = this.preferredDeliveryAddress && this.preferredDeliveryAddress.owner_type === ADDRESS_TYPES.AGENT
      let agentConflictWithPreferredAddress = !this.currentVariant.is_deliverable_to_agent && isPreferredDeliveryAddressAgent
      let agentDeliverableStateIcon = this.currentVariant.is_deliverable_to_agent ? this.checkedSvgUrl : isPreferredDeliveryAddressAgent ? this.warningSvgUrl : this.mutedSvgUrl
      // let agentDeliverableStateIconCss = this.currentVariant.is_deliverable_to_agent ? null : isPreferredDeliveryAddressAgent ? 'Flag__icon__status--warning' : 'Flag__icon__status--muted'
      let agentFlagCopy = this.currentVariant.is_deliverable_to_agent ? this.i18nText.deliverable : isPreferredDeliveryAddressAgent ? this.i18nText.notDeliverableToPreffered : this.i18nText.notDeliverable
      let agentDeliveryInfo = {
        icon: '/svg/delivery-point/icon-dgAgent.svg',
        deliverableStateIcon: agentDeliverableStateIcon,
        // deliverableStateIconCss: agentDeliverableStateIconCss,
        flagCopy: agentFlagCopy,
        flagCopyButton: this.i18nText.agentStore,
        openModal: ADDRESS_TYPES.AGENT,
        conflictWithPreferredAddress: agentConflictWithPreferredAddress
      }

      let isPreferredDeliveryAddressLocker = this.preferredDeliveryAddress && this.preferredDeliveryAddress.owner_type === ADDRESS_TYPES.LOCKER
      let lockerConflictWithPreferredAddress = !this.currentVariant.is_deliverable_to_locker && isPreferredDeliveryAddressLocker
      let lockerDeliverableStateIcon = this.currentVariant.is_deliverable_to_locker ? this.checkedSvgUrl : isPreferredDeliveryAddressLocker ? this.warningSvgUrl : this.mutedSvgUrl
      let lockerDeliverableStateIconCss = this.currentVariant.is_deliverable_to_locker ? null : isPreferredDeliveryAddressLocker ? 'Flag__icon__status--warning' : 'Flag__icon__status--muted'
      let lockerFlagCopy = this.currentVariant.is_deliverable_to_locker ? this.i18nText.deliverable : isPreferredDeliveryAddressLocker ? this.i18nText.notDeliverableToPreffered : this.i18nText.notDeliverable
      let lockerDeliveryInfo = {
        icon: '/svg/delivery-point/icon-dgLocker.svg',
        deliverableStateIcon: lockerDeliverableStateIcon,
        deliverableStateIconCss: lockerDeliverableStateIconCss,
        flagCopy: lockerFlagCopy,
        flagCopyButton: this.i18nText.locker,
        openModal: ADDRESS_TYPES.LOCKER,
        conflictWithPreferredAddress: lockerConflictWithPreferredAddress
      }

      let hubDeliveryInfo = {
        icon: '/svg/delivery-point/icon-dgHub.svg',
        deliverableStateIcon: '/svg/delivery-point/checked.svg',
        deliverableStateIconCss: null,
        flagCopy: this.i18nText.deliverable,
        flagCopyButton: this.i18nText.hub,
        openModal: ADDRESS_TYPES.HUB,
        conflictWithPreferredAddress: false
      }

      let homeDeliveryInfo = {
        icon: '/svg/delivery-point/icon-homeDelivery.svg',
        deliverableStateIcon: '/svg/delivery-point/checked.svg',
        deliverableStateIconCss: null,
        flagCopy: this.i18nText.deliverable,
        flagCopyButton: this.i18nText.home,
        openModal: ADDRESS_TYPES.CUSTOMER,
        conflictWithPreferredAddress: false
      }

      let list = []
      if (this.isAgentDeliveryEnabledForCustomer) {
        list.push(agentDeliveryInfo)
      }
      if (this.isLockerDeliveryEnabledForCustomer) {
        list.push(lockerDeliveryInfo)
      }
      if (this.isHubDeliveryEnabledForCustomer) {
        list.push(hubDeliveryInfo)
      }
      return [...list, homeDeliveryInfo]
    }
  },
  methods: {
    openPreferredDeliveryPointModal (deliveryMethod) {
      this.$store.commit(SET_PREFERRED_DELIVERY_METHOD, deliveryMethod)
      this.openOverlay(this.overlays.preferredDeliveryPointModal)
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "shared/button"

  .Button
    &--text
      border: none
      color: inherit
      text-decoration: underline
      padding: 0
      border-radius: 0
      line-height: inherit
      height: auto
      &:hover,
      &:focus
       color: inherit

  .Flag
    position: relative
    margin-top: 20px
    width: 100%
    $root: &;
    &__item
      position: relative
      display: flex
      flex-flow: row wrap
      margin-bottom: 5px
      // &--warning
      //   #{$root}__icon
      //     background-color: rgba($yellow, .33)
      //     &__not
      //       fill: $yellow
      //   #{$root}__copy
      //     // color: #FDA30E
      //     color: darken($yellow, 7%)
      // &--danger
      //   #{$root}__icon
      //     background-color: rgba($red, .33)
      //     &__not
      //       fill: $red
      //   #{$root}__copy
      //     color: $red
    &__icon
      position: relative
      display: flex
      // background-color: rgba($green, .33)
      &__svg
        // background-color: rgba($green, .33)
        position: relative
        width: 28px
        height: 28px
      &__status
        // background-color: rgba($green, .33)
        position: relative
        width: 20px
        height: 20px
        margin-top: 4px
        margin-left: 3px
        color: rgba($green, 1)
        fill: rgba($green, 1)
        &--warning
          color: rgba($yellow, 1)
          fill: rgba($yellow, 1)
        &--muted
          color: #bbbbbb
          fill: #bbbbbb
      // &__not
      //   background-color: $white
      //   width: 25px
      //   height: 25px
      //   display: flex
      //   border-radius: 25px
      //   border: 3px solid $white
      //   position: absolute
      //   top: 0
      //   right: 0
      //   margin-top: 6px
      //   margin-right: -8px
      //   fill: $green

    &__content
      position: relative
      flex: 1
      overflow: hidden
      padding-left: 8px
      padding-top: 2px
    &__copy
      fon-size: 14px
      line-height: 1.66
      color: $gray
    &__msg
      font-size: 14px
      color: $gray
      line-height: 1.55
      // display: none
</style>

<template>
  <div>
    <slot name="agentVerify" v-if="isAgentMode && showAgentPasswordVerification">
      <transition name="fade">
        <agent-password ></agent-password>
      </transition>
    </slot>
    <div v-else class="RequestRefundDetails">
      <i18n-link class="Button Button--back" :to="goBack">
        <img src="/svg/back.svg">
      </i18n-link>
      <div class="RequestRefundDetails__header">
        <div class="RequestRefundDetails__title">{{ i18nText.ticket }} # {{ supportRequest.code }}</div>
        <div class="RequestRefundDetails__date">{{ i18nText.update }}: {{ formatDate(supportRequest.updated_at) }}</div>
      </div>
      <div class="RequestRefundDetails__body">
        <div class="RequestRefundDetails__col1">
          <div class="col">
            <div class="col__title">{{ i18nText.requestDetails }}</div>
            <div class="col__body col__body--orderDetails">
              <div class="ProductsDetails">
                <div class="ProductsDetails__image">
                  <!-- <img :src="productImage" alt="" class="ProductsDetails__image--img"> -->
                  <computed-image :src="productImage"
                    class="ProductsDetails__image--img"
                    :class="{[$style.heroImageIsLoaded]: imageIsLoaded}"
                    @imageLoaded="imageIsLoaded = true"
                  >
                  </computed-image>
                </div>
                <div class="ProductsDetails__title">{{ supportRequest.product_name }}</div>
                <div class="ProductsDetails__body">
                  <!-- UPC -->
                  <div class="summary">
                    <label class="summary__title">{{ i18nText.upc }}:</label>
                    <span class="summary__amount">{{ supportRequest.upc }}</span>
                  </div>
                  <!-- Order -->
                  <div class="summary">
                    <label class="summary__title">{{ i18nText.order }} #:</label>
                    <span class="summary__amount">{{ supportRequest.order_code }}</span>
                  </div>
                  <!-- Order Date -->
                  <div class="summary">
                    <label class="summary__title">{{ i18nText.orderDate }}:</label>
                    <span class="summary__amount">{{ formatDate(supportRequest.order_date) }}</span>
                  </div>
                  <!-- Requested for -->
                  <div class="summary">
                    <label class="summary__title">{{ i18nText.requestedFor }}:</label>
                    <span class="summary__amount">{{ requestedFor }}</span>
                  </div>
                  <!-- Reason -->
                  <div class="summary">
                    <label class="summary__title">{{ i18nText.reason }}:</label>
                    <span class="summary__amount">{{supportRequest.reason}}</span>
                  </div>
                  <!-- Approved for -->
                  <div v-if="!showableInDetailsMode" class="summary">
                    <label class="summary__title">{{ i18nText.approvedFor }}:</label>
                    <span class="summary__amount">{{approvedFor}}</span>
                  </div>
                  <!-- Additional Charge -->
                  <div class="summary">
                    <label class="summary__title">{{i18nText.additionalCharge}}:</label>
                    <span class="summary__amount">৳ {{__$(supportRequest.additional_charge)}}</span>
                  </div>
                  <!-- Status -->
                  <div class="summary">
                    <label class="summary__title">{{i18nText.status}}:</label>
                    <span class="summary__amount">{{orderStatus}}</span>
                  </div>
                  <!-- Order Date -->
                </div>
								<div v-if="showableInDetailsMode">
									<p class="ProductsDetails__copy">
                    {{ i18nText.alert }}
									</p>
									<div class="ProductsDetails__confirm">
										<div class="radio option option__confirm">
											<div class="option__check" :class="{'option__check--actived': receiveOrCancel === true}"></div>
											<div class="option__title">
												<input v-model="receiveOrCancel" class="radio__input" type="radio" id="receive_input" name="receiveInput" v-bind:value="true">
												<label class="radio__label label" for="receive_input">
													<div class="lable__title">{{ i18nText.received }}</div>
												</label>
											</div>
										</div>
										<div class="radio option option__confirm">
											<div class="option__check" :class="{'option__check--actived': receiveOrCancel === false}"></div>
											<div class="option__title">
												<input v-model="receiveOrCancel" class="radio__input" type="radio" id="cancel_input" name="receiveInput" v-bind:value="false">
												<label class="radio__label label" for="cancel_input">
													<div class="lable__title">{{ i18nText.cancelled }}</div>
												</label>
											</div>
										</div>
									</div>
								</div>
              </div>
            </div>
          </div>
          <div v-if="showableInDetailsMode" class="RequestRefundDetails__UpdateRequest">
            <button :class="['Button', 'Button--purple', {'Button--disable': buttonDisabled}]" @click="updateRequest()" :disabled="buttonDisabled">{{ i18nText.updateRequest }}</button>
          </div>
        </div>
        <div class="RequestRefundDetails__col2">
          <!-- Customer information if agent mode -->
          <div class="col col__bottom">
            <div class="col__title">{{ i18nText.customerInformation }}</div>
            <div class="col__body">
              <div class="customerInfo">
                <div class="customerInfo__name">Name: {{ supportRequest.customer_name }}</div>
                <div class="customerInfo__number">Mobile: {{ supportRequest.customer_mobile }}</div>
              </div>
            </div>
          </div>
          <div class="col col__bottom">
            <address-display :address="delivaryAddress" :addressTitle="i18nText.deliveryAddress"></address-display>
          </div>
          <div class="col col__bottom">
            <address-display :address="pickupAddress" :addressTitle="i18nText.pickupAddress"></address-display>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import i18nLink from '~/components/i18nLink'
import AgentPassword from '~/components/modals/AgentPassword'
import ComputedImage from '~/components/ComputedImage'
import AddressDisplay from '~/components/AddressDisplay.vue'
import enumMixinFactory from '~/utils/enum_mixin_factory'
import { formatDate } from '~/utils/date'
import i18nKeys from '~/pages/_lang/customer/support-tickets/_ticket_id/index.i18n.yaml'

import { getRequestDetailsById, updateSupportRequestById } from '~/api'
import { i18nRedirect, agentVerificationMixin, getRandomColorCssClass, i18nMixin } from '~/utils'

import { mapGetters } from 'vuex'

export default {
  mixins: [enumMixinFactory('SupportTicketStatus', 'SupportTicketsApprovedStatus'), agentVerificationMixin, i18nMixin(i18nKeys)],
  fetch (context) {
    let {store} = context
    if (!store.getters.agentToken && !store.getters.customerToken) {
      return i18nRedirect(context, '/')
    }
  },
  asyncData ({store, params}) {
    const token = store.getters.customerToken ? store.getters.customerToken : store.getters.agentToken
    const localization = store.state.locale
    return getRequestDetailsById(token, params.ticket_id, localization)
    .then(supportRequest => {
      return {
        supportRequest
      }
    })
  },
  data () {
    return {
      receiveOrCancel: null,
      imageIsLoaded: false
    }
  },
  computed: {
    ...mapGetters(['agentToken', 'isAgentMode']),
    goBack () {
      return this.isAgentMode ? '/agent/support-tickets' : '/customer/support-tickets'
    },
    productImage () {
      return this.supportRequest.images.length > 0 ? this.supportRequest.images[0].url : '~/assets/imgs/default-product.svg'
    },
    customerDetails () {
      return this.supportRequest.customer
    },
    productDetails () {
      return this.supportRequest.product_details
    },
    buttonDisabled () {
      return this.receiveOrCancel === null
    },
    randomColorClass () {
      return this.$style[getRandomColorCssClass(this.name)]
    },
    showableInDetailsMode () {
      return this.isAgentMode && this.supportRequest.status === 0
    },
    delivaryAddress () {
      return this.supportRequest.delivery_address
    },
    pickupAddress () {
      return this.supportRequest.pickup_address
    },
    requestedFor () {
      return this.i18nInvertedEnums.SupportTicketsApprovedStatus[this.supportRequest.requested_type]
    },
    approvedFor () {
      return this.i18nInvertedEnums.SupportTicketsApprovedStatus[this.supportRequest.approval_type]
    },
    orderStatus () {
      return this.i18nInvertedEnums.SupportTicketStatus[this.supportRequest.status]
    }
  },
  methods: {
    updateRequest () {
      if (this.receiveOrCancel !== null) {
        updateSupportRequestById(this.agentToken, this.supportRequest.id, this.receiveOrCancel)
        .then(() => {
          i18nRedirect(this.$ctx, '/agent/support-tickets')
        })
        .catch(error => {
          this.receiveOrCancel = null
          console.log(error)
        })
      }
    },
    formatDate (date) {
      return formatDate(date, this.$i18n.locale)
    }
  },
  components: {
    AgentPassword,
    i18nLink,
    ComputedImage,
    AddressDisplay
  }
}
</script>

<style lang="sass" scoped>
  @import "shared/button"
  @import "shared/form/field"
  .Button
    &--back
      color: #ddd
      fill: #ddd
      &:hover,
      &:focus,
      &:active
        color: #aaa
        fill: #aaa
    &--disable
      cursor: not-allowed
      opacity: .5
    &--purple
      padding-left: 15px
      padding-right: 15px
      border-style: solid
      border-width: 1px
      color: #fff
      fill: #fff
      background-color: $btn-purple
      border-color: darken($btn-purple, 5%) darken($btn-purple, 10%) darken($btn-purple, 15%)
      background: linear-gradient(to bottom, lighten($btn-purple, 18%), $btn-purple)
      box-shadow: 0 1px 0 rgba($white, 0.4) inset
      &:hover
        color: #fff
        fill: #fff
        background-color: darken($btn-purple, 5%)
        background: linear-gradient(to bottom, $btn-purple, $btn-purple)
  .RequestRefundDetails
    position: relative
    background-color: $white
    padding: 15px 15px 30px
    box-shadow: 0 1px 3px rgba($black, 0.1)
    margin-left: -15px
    margin-right: -15px
    height: 100%
    +phablet
      margin-left: 0
      margin-right: 0
      padding: 20px 30px 30px
    &__header
      position: relative
    &__title
      font-size: 21px
      font-weight: 400
      color: #333
      line-height: 1.3
      +phablet
        font-size: 24px
    &__date
      font-size: 14px
      color: #999
      line-height: 1.5
    &__body
      position: relative
      margin-top: 30px
      +tablet
        display: flex
        flex-flow: row wrap
    &__col1,
    &__col2
      position: relative
      +tablet
        flex: 1
    &__col1
      +tablet
        margin-right: 50px
    &__col2
    &__UpdateRequest
      border-top: 1px solid #bfbfbf
      padding-top: 20px
  .col
    position: relative
    margin-bottom: 20px
    &__bottom
      margin-top: 30px
    +clearfix
    &__title
      font-size: 16px
      color: $red
      line-height: 1.3
      margin-bottom: 10px
    &__body
      position: relative
  .ProductsDetails
    position: relative
    &__image
      width: 266.6px
      margin-bottom: 15px
    &__body
      margin-top: 10px
      margin-bottom: 10px
    &__copy 
      color: purple
      font-size: 14px
      line-height: 1.33
      padding-bottom: 20px
    &__confirm
      position: relative
      display: flex
      margin-left: -15px
  .summary
    position: relative
    color: $text
    font-size: 16px
    font-width: $weight-normal
    line-height: 1.44
    display: flex
    flex-flow: row wrap
    padding-top: 7px
    padding-bottom: 7px
    border-top: 1px solid #dddddd
    &:not(:first-child)
      border-top: 1px solid #dddddd
    &__title
      font-size: inherit
      color: inherit
      font-width: inherit
      line-height: inherit
      float: left
      margin-right: 10px
    &__amount
      font-size: inherit
      color: inherit
      font-width: inherit
      line-height: inherit
      text-align: right
      padding-left: 0
      padding-right: 5px
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      max-width: 360px
  .option
    position: relative
    &__confirm
      border: none
      background-color: #fff
    &__check
      &--actived
        border-color: $btn-green
        &::before,
        &::after
          opacity: 1
          visibility: visible
  .lable
    &__title
      padding-right: 0
</style>

<style lang="sass" module>
  @import "shared/banner"
  @import "shared/button"
  @import "shared/category_summary/product_thumbnail"
</style>

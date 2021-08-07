<template>
  <div>
    <div :class="['Field', {'Field--error': errors.feedback, 'Field--success': errors.feedback === false}]">
      <label class="Field__label Field__label--uppercase Field__label--bold">
        {{ i18nText.reasonCancellation }}
      </label>
      <div class="Field__control">
        <textarea 
          @keyup.enter="continueOrderCancellation()"
          class="Field__input Field__input--textarea" 
          :placeholder="feedbackPlaceholder" 
          v-model="feedback" 
          rows="3"
        >
        </textarea>
      </div>
      <p class="Field__validation" v-if="errors.feedback">{{errors.feedback}}</p>
    </div>
    
    <button @click="closeModal" class="Button Button--back">{{ i18nText.back }}</button>
    <button @click="continueOrderCancellation()" class="Button Button--continue" >{{ i18nText.continue }}</button>
  </div>
</template>

<script>
import {
  i18nMixin
  } from '~/utils'
import {
  API_ERRORS
} from '~/store/constants.yaml'

import { cancelOrder } from '~/api'
import i18nKeys from '~/components/CancelOrder.i18n.yaml'
import { mapState } from 'vuex'
export default {
  mixins: [i18nMixin(i18nKeys)],
  props: {
    closeModal: {
      type: Function,
      required: false,
      default: null
    }
  },
  data () {
    return {
      feedback: null,
      errors: {
        feedback: null
      }
    }
  },
  computed: {
    ...mapState([
      'ui'
    ]),
    feedbackPlaceholder () {
      return this.i18nText.leaveFeedback
    },
    cancellationFeedback () {
      return this.i18nText.cancellationFeedback
    }
  },
  methods: {
    validate () {
      this.errors.feedback = null

      if (!this.feedback) {
        this.errors.feedback = this.$t('validation.required', {field: this.i18nText.cancellationFeedback})
      } else {
        this.errors.feedback = false
      }

      return !(this.errors.feedback)
    },
    continueOrderCancellation () {
      if (!this.validate()) return
      let attr = {
        orderId: this.ui.overlayContext.orderId,
        feedback: this.feedback
      }
      cancelOrder(attr)
      .then(() => {
        this.closeModal()
      })
      .catch((reason) => {
        switch (reason.error) {
          case API_ERRORS.ORDER_NOT_FOUND:
            this.errors.feedback = this.__e(API_ERRORS.ORDER_NOT_FOUND)
            break
        }
      })
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "shared/form/field"
  @import "shared/button"
</style>

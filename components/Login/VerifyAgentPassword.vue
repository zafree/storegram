<template>
  <div>
    <!--Password-->
    <div :class="[$style.field, {[$style.fieldError]: errors.password, [$style.fieldSuccess]: errors.password === false}]">
      <label :class="$style.fieldLabel">{{i18nText.passwordLabel}}</label>
      <div :class="$style.fieldControl">
        <input :class="$style.fieldInput" type="password" v-model="password" :placeholder="i18nText.verifyPasswordPlaceholder" @keyup.enter="verifyAgent()" v-focus>
      </div>
      <p :class="$style.fieldValidation" v-if="errors.password">{{errors.password}}</p>
    </div>

    <div :class="$style.field">
      <button :class="[$style.button, $style.buttonLogin]" @click="verifyAgent()">{{i18nText.buttonTextVerify}}</button>
    </div>

  </div>
</template>

<script>
import {
  VERIFY_AGENT_WITH_PASSWORD,
  API_ERRORS,
  TOGGLE_COMMISSION,
  LOGOUT_AGENT
} from '~/store/constants.yaml'

import { overlayMixin, i18nMixin } from '~/utils'
import i18nKeys from '~/components/Login.i18n.yaml'
import { mapGetters, mapState } from 'vuex'
import logger from '~/utils/logger'

export default {
  mixins: [i18nMixin(i18nKeys), overlayMixin],
  data () {
    return {
      password: null,
      errors: {
        password: null
      }
    }
  },
  computed: {
    ...mapState([
      'ui'
    ]),
    ...mapGetters([
      'isAgentMode'
    ])
  },
  methods: {
    verifyAgent () {
      if (!this.validate()) return
      return this.$store.dispatch(VERIFY_AGENT_WITH_PASSWORD, this.password)
      .then(() => {
        if (this.ui.overlayContext && this.ui.overlayContext.isPasswordModalOpenedByCommission) {
          this.$store.commit(TOGGLE_COMMISSION)
          this.closeAgentPasswordModal()
        }
      })
      .catch((reason) => {
        switch (reason.error) {
          case API_ERRORS.INVALID_MOBILE_NUMBER:
            this.errors.phoneNumber = this.__e(API_ERRORS.INVALID_MOBILE_NUMBER, {field: this.phoneNumber})
            break
          case API_ERRORS.MISMATCH_PASSWORD:
            this.errors.password = this.__e(API_ERRORS.MISMATCH_PASSWORD, {field: this.i18nText.passwordLabel})
            break
          case API_ERRORS.AGENT_NOT_FOUND:
            this.errors.phoneNumber = this.__e(API_ERRORS.AGENT_NOT_FOUND, {field: this.i18nText.phoneLabel})
            return this.$store.dispatch(LOGOUT_AGENT)
              .then(() => {
                this.$router.go({
                  path: this.$router.path,
                  query: {
                    ts: Date.now()
                  }
                })
              })
        }
        logger.error('verifyAgent', reason)
      })
    },
    validate () {
      this.errors.password = null

      if (!this.password) {
        this.errors.password = this.$t('validation.required', {field: this.i18nText.passwordLabel})
      } else {
        this.errors.password = false
      }

      return !(this.errors.password)
    }
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  }

}
</script>

<style lang="sass" module>
  @import "shared/button"
  @import "shared/form/field"

  .Button
    &--login
      display: flex
      justify-content: center
      align-item: center
      width: 100%
      +btnGreen
</style>

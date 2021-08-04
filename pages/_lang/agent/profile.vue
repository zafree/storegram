<template>
  <div>
    <slot name="agentVerify" v-if="showAgentPasswordVerification">
      <transition name="fade">
        <agent-password ></agent-password>
      </transition>
    </slot>
    <div class="CustomerProfile" v-else>
      <div class="CustomerProfile__title">{{ i18nText.profile }}</div>
      <div class="CustomerProfile__body">
        <div class="agent">
          <agent-commission-summary-view></agent-commission-summary-view>
          <div class="agentAddress">
            <address-display :addressTitle="i18nText.agentInfoLabel" :address="$store.getters.loggedInAgentAddress"></address-display>
          </div>

          <div class="agentPassword">
            <button type="button" class="Button" v-if="!showPasswordChangeForm" @click="showPasswordChangeForm = true">{{ i18nText.changePassword }}</button>
            <div class="agentChangePassword" v-if="showPasswordChangeForm">
              <label class="agentChangePassword__label">{{ i18nText.changePassword }}</label>
              <div class="agentChangePassword__fields">
                <div :class="[$style.field, {[$style.fieldError]: errors.currentPassword, [$style.fieldSuccess]: errors.currentPassword === false}]">
                  <label :class="$style.fieldLabel">{{ i18nText.currentPassword }}</label>
                  <div :class="$style.fieldControl">
                    <input :class="$style.fieldInput" type="password" v-model="currentPassword" :placeholder="i18nText.currentPassword">
                  </div>
                  <p :class="$style.fieldValidation" v-if="errors.currentPassword">{{errors.currentPassword}}</p>
                </div>
                <div :class="[$style.field, {[$style.fieldError]: errors.password, [$style.fieldSuccess]: errors.password === false}]">
                  <label :class="$style.fieldLabel">{{ i18nText.newPassword }}</label>
                  <div :class="$style.fieldControl">
                    <input :class="$style.fieldInput" type="password" v-model="password" :placeholder="i18nText.newPassword">
                  </div>
                  <p :class="$style.fieldValidation" v-if="errors.password">{{errors.password}}</p>
                </div>
                <div :class="[$style.field, {[$style.fieldError]: errors.confirmPassword, [$style.fieldSuccess]: errors.confirmPassword === false}]">
                  <label :class="$style.fieldLabel">{{ i18nText.confirmPassword }}</label>
                  <div :class="$style.fieldControl">
                    <input :class="$style.fieldInput" type="password" v-model="confirmPassword" :placeholder="i18nText.confirmPassword" @keyup.enter="passwordChangeRequest(true)">
                  </div>
                  <p :class="$style.fieldValidation" v-if="errors.confirmPassword">{{errors.confirmPassword}}</p>
                </div>
              </div>
              <div class="agentChangePassword__actions">
                <button @click="passwordChangeRequest(true)" class="Button Button--save" type="button">{{ i18nText.changePassword }}</button>
                <button @click="hidePasswordForm()" class="Button Button--cancel" type="button" >{{ i18nText.cancel }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import AgentPassword from '~/components/modals/AgentPassword'
  import { i18nMixin, i18nRedirect, agentVerificationMixin } from '~/utils'
  import AddressDisplay from '~/components/AddressDisplay'
  import i18nKeys from '~/pages/_lang/agent/profile.i18n.yaml'
  import AgentCommissionSummaryView from '~/components/AgentCommissionSummaryView'
  import { mapState } from 'vuex'
  import {
    API_ERRORS,
    CHANGE_PASSWORD,
    SET_AGENT_LOGIN_INFO
  } from '~/store/constants.yaml'

  import get from 'lodash/get'

  export default {
    mixins: [i18nMixin(i18nKeys), agentVerificationMixin],
    fetch (context) {
      let {store} = context
      if (!store.state.agent) {
        return i18nRedirect(context, '/')
      }
    },
    data () {
      return {
        showCommissionDetails: false,
        showPasswordChangeForm: false,
        currentPassword: null,
        password: null,
        confirmPassword: null,
        passwordChangeSuccess: false,
        errors: {
          currentPassword: null,
          password: null,
          confirmPassword: null
        }
      }
    },
    computed: {
      ...mapState([
        'agent'
      ]),
      agentAvatar () {
        let avatarUrl = get(this.agent, 'avatar_url')
        if (avatarUrl) {
          avatarUrl = this.agent.facebook_avatar ? this.agent.avatar_url + '?width=150&height=150' : this.agent.avatar_url
        }
        return avatarUrl
      },
      agentAddress () {
        let address = null
        if (this.agent) {
          address = {}
          address.contact_name = this.agent.name
          address.contact_number = this.agent.mobile
          address.address = this.agent.address
          address.area = this.agent.area
          address.location = this.agent.location
        }
        return address
      }
    },
    methods: {
      hidePasswordForm () {
        this.showPasswordChangeForm = false
        this.resetEverything()
      },
      passwordChangeRequest () {
        if (!this.currentPassword) {
          this.errors.currentPassword = this.$t('validation.required', {field: this.$t('profile.current_password_label')})
          return
        }
        if (!this.password) {
          this.errors.password = this.$t('validation.required', {field: this.$t('profile.new_password_label')})
          return
        } else if (this.password.length < 6) {
          this.errors.password = this.$t('validation.password_length', {field: this.$t('profile.new_password_label'), value: this.__$(6)})
          return
        }
        if (!this.confirmPassword) {
          this.errors.confirmPassword = this.$t('validation.required', {field: this.$t('profile.confirm_password_label')})
          return
        } else if (this.confirmPassword.length < 6) {
          this.errors.confirmPassword = this.$t('validation.password_length', {field: this.$t('profile.confirm_password_label'), value: this.__$(6)})
          return
        }
        if (this.password !== this.confirmPassword) {
          this.errors.confirmPassword = this.$t('validation.mismatch', {field1: this.$t('profile.new_password_label'), field2: this.$t('profile.confirm_password_label')})
          return
        }
        if (this.currentPassword === this.password) {
          this.errors.password = this.$t('validation.fields_same_value', {field1: this.$t('profile.current_password_label'), field2: this.$t('profile.new_password_label')})
          return
        }

        this.$store.dispatch(CHANGE_PASSWORD, {
          old_password: this.currentPassword,
          new_password: this.password,
          confirmed_password: this.confirmPassword
        })
        .then(response => {
          this.resetEverything()
          this.$store.commit(SET_AGENT_LOGIN_INFO, response)
        })
        .catch(reason => {
          switch (reason.error) {
            case API_ERRORS.MISMATCH_PASSWORD:
              this.errors.currentPassword = this.__e(API_ERRORS.MISMATCH_PASSWORD, {field: this.$t('profile.current_password_label')})
              break
            default:
              this.errors.password = 'Something went wrong'
              break
          }
        })
      },
      resetEverything () {
        this.showPasswordChangeForm = false
        this.currentPassword = null
        this.password = null
        this.confirmPassword = null
        this.passwordChangeSuccess = false
        this.errors.currentPassword = null
        this.errors.password = null
        this.errors.confirmPassword = null
      }
    },
    components: {
      AddressDisplay,
      AgentCommissionSummaryView,
      AgentPassword
    }
  }
</script>

<style lang="sass" module>
@import "shared/form/field"
</style>

<style lang="sass" scoped>
  @import "shared/button"

  .Field
    &__label
      padding: 0

    &__control
      display: flex
      flex-flow: row wrap
      &:not(:last-child)
        margin-bottom: 10px
    &__brief,
    &__input
      flex: 1
    &__inlineButton
      flex: 0 auto
      margin-left: 5px

    &__input
      height: 32px
      &--name
        font-size: 15px
        font-weight: 700
        background-color: $white
        padding: 0 15px
      &--justText
        border: none
        padding: 0
      &--mobile
        padding: 0 15px
        margin-right: 0
        background-color: #f5f5f5
        &:focus,
        &:active
          background-color: #f5f5f5

      &--email
        padding: 0
        background-color: $white

    &__state
      position: absolute
      top: 50%
      right: 0
      margin-right: 10px
      transform: translateY(-50%)
      display: flex
      align-items: center

    &__secondary
      margin-top: 15px
      padding-bottom: 20px
      .Field__label
        font-size: 13px
        padding: 0 15px

    &__deleteState
      position: absolute
      top: 0
      bottom: 0
      left: 0
      right: 0
      background-color: rgba(#fde7ec, 0.85)
      border: 1px solid #fac4d0

  .deleteState
    display: flex
    justify-content: flex-end
    align-items: center
    &__text
      color: $red
    &__actions
      margin-left: 10px

  .Button
    border: 1px solid #d9d9d9
    height: 32px
    padding: 0 10px
    font-size: 13px
    color: #333
    fill: #333
    &:hover,
    &:focus,
    &:active
      color: #333
      fill: #333
      border-color: #777
    &--continueWithFacebook
      border: none
      background-color: #3b5997
      display: inline-flex
      align-items: center
      text-align: left
      padding: 0 15px
      color: #fff
      fill: #fff
      &:hover,
      &:focus
        color: #fff
        fill: #fff
        background-color: darken(#3b5997, 5%)

      .Button__label
        margin-left: 7px
        letter-spacing: .02em

    &--save,
    &--verify
      border-color: #48d277
      color: #41b468
      fill: #41b468
      &:hover,
      &:focus,
      &:active
        border-color: darken(#48d277, 10%)
        color: #41b468
        fill: #41b468
    &--save
      margin-right: 5px

    &--delete,
    &--setPrimary
      font-size: 12px
      height: 22px
      padding: 0 5px
      border: none
      color: #777
      fill: #777
      &:hover,
      &:focus,
      &:active
        color: #777
        fill: #777
        text-decoration: underline
    &--delete
      margin-right: 2px
    &--setPrimary
      margin-left: 2px
    &-divider
      color: #777
      fill: #777

    &--yes,
    &--no
      color: $white
      fill: $white
      border: none
      &:hover,
      &:focus,
      &:active
        color: $white
        fill: $white
    &--yes
      background-color: $red
      margin-right: 1px
    &--no
      background-color: #252525
    &--disabled
      pointer-events: none
      opacity: .55

  .CustomerProfile
    background-color: $white
    padding: 15px 15px 30px
    box-shadow: 0 1px 3px rgba($black, 0.1)
    margin-left: -15px
    margin-right: -15px
    +phablet
      margin-left: 0
      margin-right: 0
      padding: 20px 30px 30px
    &__title
      font-size: 24px
      font-weight: 400
      color: #333
      line-height: 1.3
      margin-bottom: 10px
    &__body
      position: relative
      margin-top: 20px

  .agent
    position: relative

  .agentAddress
    margin-top: 40px
    margin-bottom: 30px

  .agentChangePassword
    position: relative
    max-width: 735px
    padding: 13px 15px
    font-style: normal
    line-height: 1.5
    background-color: #fff
    border: 1px solid #e5e5e5
    box-shadow: 0 1px 3px rgba($black, .1)
    &__label
      font-size: 13px
      font-weight: 700
      color: #ccc
      display: block
      text-decoration: none
      margin-bottom: 5px

    &__fields
      position: relative
      padding: 10px 15px

    &__actions
      text-align: right
      padding: 20px 30px 30px
</style>

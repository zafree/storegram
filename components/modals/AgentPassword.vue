<template>
  <modal>
    <template slot="hero">
      <img :class="$style.heroImage" :src="brandLogo" alt="Hero Logo">
    </template>
    <!--MODAL COMPONENT-->
    <verify-agent-password></verify-agent-password>
    <template slot="actions">
      <button :class="[$style.button, $style.buttonGoBack]" @click="goBackToHome()">{{$t('login_modal.go_back')}}</button>
      <button :class="[$style.button, $style.buttonModalClose]" type="button" name="button" @click="goBackToHome()">
        <img :class="[$style.buttonIconSvg, $style.buttonIconSvgLeft]" src="/svg/icon-times.svg" alt="Modal Close">
      </button>
    </template>

  </modal>
</template>

<script>
  import { SYNC_COMMISSION_SHOW } from '~/store/constants.yaml'
  import Modal from '~/components/Modal'
  import { mapState } from 'vuex'
  import VerifyAgentPassword from '~/components/Login/VerifyAgentPassword'
  import { overlayMixin, i18nRedirect } from '~/utils'

  export default {
    mixins: [overlayMixin],
    components: {
      Modal,
      VerifyAgentPassword
    },
    data () {
      return {
        brandLogo: '/clients/' + process.env.PROJECT_NAME + '/svg/brand-logo.svg'
      }
    },
    computed: {
      ...mapState([
        'ui'
      ])
    },
    methods: {
      goBackToHome () {
        if (this.ui.overlayContext && this.ui.overlayContext.isPasswordModalOpenedByCommission) {
          this.$root.$emit(SYNC_COMMISSION_SHOW)
          this.closeAgentPasswordModal()
        } else {
          i18nRedirect(this.$ctx, '/')
        }
      }
    }
  }
</script>

<style lang="sass" module>
  @import "shared/button"

  .heroImage 
    position: absolute
    top: 0
    right: 0
    height: 100%
    max-width: 1000px
    width: auto 

  .Button
    &--goBack
      border: 1px solid #d9d9d9
      height: 32px
      padding: 0 10px
      font-size: 13px
      color: #333
      fill: #333
      display: inherit
      margin-left: auto
      position: absolute
      bottom: 0
      right: 0
      margin-right: 30px
      margin-bottom: 40px
      &:hover,
      &:focus,
      &:active
        color: #333
        fill: #333
        border-color: #777

</style>

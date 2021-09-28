<template>
  <div :class="$style.wrapper">
    <div :class="$style.footer">
      <div :class="$style.footerIntro">
        <i18n-link :class="$style.footerLogo" to="/">
          <svg xmlns="http://www.w3.org/2000/svg" width="146" height="32">
            <use xlink:href="/svg/icons.svg?#i-logo"></use>
          </svg>
        </i18n-link>
        <p :class="$style.footerAbout">{{ footerAboutText }}</p>
        <p :class="$style.footerPhone"><a :class="[$style.footerLink, $style.btn]" :href="'tel:'+footerPhone">Phone: {{ footerPhone }}</a></p>
        <p :class="$style.footerEmail"><a :class="[$style.footerLink, $style.btn]" :href="'mailto:'+footerEmail">Email: {{ footerEmail }}</a></p>
        <p :class="$style.footerAddress">Address:<br>{{ footerAddress }}</p>
      </div>
      <div :class="$style.footerExtraRoute">
        <h4 :class="$style.footerExtraHeading">Quick links</h4>
        <ul :class="$style.footerExtraList">
          <li :class="$style.footerExtraItem">
            <i18n-link :class="[$style.footerExtraLink, $style.btn]" to="/docs/about">
              <svg :class="$style.btnIcon" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                <use xlink:href="/svg/icons.svg?#i-arrow"></use>
              </svg>
              <span :class="$style.btnLabel">About</span>
            </i18n-link>
          </li>
          <li :class="$style.footerExtraItem">
            <i18n-link :class="[$style.footerExtraLink, $style.btn]" to="/docs/help-center">
              <svg :class="$style.btnIcon" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                <use xlink:href="/svg/icons.svg?#i-arrow"></use>
              </svg>
              <span :class="$style.btnLabel">Help Center</span>
            </i18n-link>
          </li>
          <li :class="$style.footerExtraItem">
            <i18n-link :class="[$style.footerExtraLink, $style.btn]" to="/docs/faq">
              <svg :class="$style.btnIcon" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                <use xlink:href="/svg/icons.svg?#i-arrow"></use>
              </svg>
              <span :class="$style.btnLabel">FAQ</span>
            </i18n-link>
          </li>
        </ul>
      </div>
      <div :class="$style.footerExtraRoute">
        <h4 :class="$style.footerExtraHeading">Legal</h4>
        <ul :class="$style.footerExtraList">
          <li :class="$style.footerExtraItem">
            <i18n-link :class="[$style.footerExtraLink, $style.btn]" to="/docs/privacy">
              <svg :class="$style.btnIcon" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                <use xlink:href="/svg/icons.svg?#i-arrow"></use>
              </svg>
              <span :class="$style.btnLabel">Privacy Policy</span>
            </i18n-link>
          </li>
          <li :class="$style.footerExtraItem">
            <i18n-link :class="[$style.footerExtraLink, $style.btn]" to="/docs/terms">
              <svg :class="$style.btnIcon" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                <use xlink:href="/svg/icons.svg?#i-arrow"></use>
              </svg>
              <span :class="$style.btnLabel">Term and Conditions</span>
            </i18n-link>
          </li>
          <li :class="$style.footerExtraItem">
            <i18n-link :class="[$style.footerExtraLink, $style.btn]" to="/docs/return-policy">
              <svg :class="$style.btnIcon" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                <use xlink:href="/svg/icons.svg?#i-arrow"></use>
              </svg>
              <span :class="$style.btnLabel">Return Policy</span>
            </i18n-link>
          </li>
        </ul>
      </div>
      <div :class="$style.footerExtraRoute">
        <h4 :class="$style.footerExtraHeading">{{ i18nText.headingPayment }}</h4>
        <div :class="$style.footerPayment">
          <div :class="[$style.footerPaymentOption, $style.footerPaymentOptionCashOnDelivery]"></div>
          <div :class="[$style.footerPaymentOption, $style.footerPaymentOptionBkash]"></div>
          <!-- <div :class="[$style.footerPaymentOption, $style.footerPaymentOptionRocket]"></div> -->
          <div :class="[$style.footerPaymentOption, $style.footerPaymentOptionCcDbbl]"></div>
          <div :class="[$style.footerPaymentOption, $style.footerPaymentOptionCcVisa]"></div>
          <div :class="[$style.footerPaymentOption, $style.footerPaymentOptionCcMastercard]"></div>
          <div :class="[$style.footerPaymentOption, $style.footerPaymentOptionCcAmex]"></div>
        </div>
        <!-- <div :class="[$style.footerPayment, $style.footerPaymentOthers]">
          <div :class="[$style.footerPaymentOption, $style.footerPaymentOptionCashOnDelivery]">
          </div>
        </div> -->
        <!-- <p :class="$style.footerPaymentNote">{{ i18nText.paymentNote }}</p> -->
      </div>
    </div>

    <div :class="$style.foo">
      <div :class="$style.fooSocial">
        <a :class="[$style.fooSocialLink, $style.btn]" href="#Link">
          <svg :class="$style.btnIcon" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
            <use xlink:href="/svg/icons.svg?#i-facebook"></use>
          </svg>
        </a>
        <a :class="[$style.fooSocialLink, $style.btn]" href="#Link">
          <svg :class="$style.btnIcon" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
            <use xlink:href="/svg/icons.svg?#i-youtube"></use>
          </svg>
        </a>
        <a :class="[$style.fooSocialLink, $style.btn]" href="#Link">
          <svg :class="$style.btnIcon" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
            <use xlink:href="/svg/icons.svg?#i-instagram"></use>
          </svg>
        </a>
      </div>
      <span :class="$style.fooCopyright">©  {{ thisYear }} {{ fooCopyrignt }} </span>
    </div>
  </div>
</template>

<script>
  import i18nLink from '~/components/i18nLink'
  import i18nKeys from '~/components/layouts/SiteFooter.i18n.yaml'

  import {
    i18nMixin
  } from '~/utils'

  import { mapGetters } from 'vuex'

  export default {
    mixins: [i18nMixin(i18nKeys)],
    data () {
      return {
        footerAboutText: process.env.PROJECT_FOOTER_TEXT,
        footerPhone: process.env.PROJECT_PHONE,
        footerEmail: process.env.PROJECT_EMAIL,
        footerAddress: process.env.PROJECT_ADDRESS_TEXT,
        projectTitle: process.env.PROJECT_TITLE,
        projectFacebookLink: process.env.PROJECT_FACEBOOK,
        projectInstagramLink: process.env.PROJECT_INSTAGRAM,
        fooCopyrignt: process.env.PROJECT_COPYRIGHT
      }
    },
    computed: {
      ...mapGetters([
        'isAgentMode'
      ]),
      thisYear () {
        const thisYear = this.__$(new Date().getFullYear(), true)
        return this.$t(thisYear)
      },
      affiliatedIconFileName () {
        if (this._i18n.locale === 'bn') {
          return '/svg/foo-affiliated-bn.svg'
        } else return '/svg/foo-affiliated.svg'
      }
    },
    components: {
      i18nLink
    }
  }
</script>


<style lang="sass" module>
  @import "sass/shared/button"

  .wrapper
    +container

  .footer
    border-top: 2px solid $black
    padding-top: 80px
    position: relative
    display: flex
    flex-flow: row wrap
    margin-left: auto
    margin-right: auto
    justify-content: flex-start
    width: 100%
    &__intro
      margin-bottom: 35px
      width: 100%
      +desktop
        width: auto
        margin-right: 90px
    &__logo
      display: flex

    &__about
      line-height: 1.77
      font-size: 14px
      margin-top: 20px
      max-width: 350px
    &__phone,
    &__email,
    &__address
      margin-top: 11px
      max-width: 350px
      display: flex
    &__address
      font-size: 14px
    &__link
      width: auto
      font-weight: $weight-medium
      padding-left: 12px
      padding-right: 12px
    &__extraRoute
      box-sizing: border-box
      width: 50%
      +tablet
        // width: 33.333333%
        flex: 1
      +desktop
        flex: 1
        padding-right: 0
        &:nth-child(2)
          // width: 15%
        &:nth-child(3)
          // width: 20%

      &:last-child
        width: 164px
        +tablet
          flex: 0 164px
    &__extraHeading
      font-size: 16px
      line-height: 1.33
      font-weight: $weight-black
      padding-top: 30px
      +desktop
        padding-top: 40px
    &__extraList
      margin: 20px 0 0
      padding: 0
      list-style: none
    &__extraItem
      list-style: none
      display: flex
      &:not(:first-child)
    &__extraLink
      width: auto
      height: 28px
      margin-top: 8px
      margin-bottom: 8px
      background-color: $white
      padding-right: 20px
      font-weight: $weight-medium
      .btn__icon
        margin-left: -6px

    &__payment
      position: relative
      display: flex
      flex-flow: row wrap
      margin-top: 26px
      &--cc,
      &--others
        margin-top: 5px

    &__paymentOption
      position: relative
      border: 1px solid #ddd
      background-color: #fff
      overflow: hidden
      // border-radius: 6px
      margin-bottom: 10px
      background-position: 0
      background-repeat: no-repeat
      background-size: 46px auto
      display: inline-block
      vertical-align: middle
      height: 32px
      width: 48px
      &:not(:last-child)
        margin-right: 10px
      &:nth-child(3n)
        margin-right: 0

      &--bkash
        background-image: url(/svg/payment/bkash.svg)
      &--rocket
        background-image: url(/svg/payment/rocket.svg)
      &--ccDbbl
        background-image: url(/svg/payment/cc-dbbl.svg)
      &--ccVisa
        background-image: url(/svg/payment/cc-visa.svg)
      &--ccMastercard
        background-image: url(/svg/payment/cc-mastercard.svg)
      &--ccAmex
        background-image: url(/svg/payment/cc-amex.svg)
      &--cashOnDelivery
        background-image: url(/svg/payment/cash-on-delivery.svg)

    &__paymentNote
      font-size: 12px
      line-height: 1.55
      color: #999
      fill: #999
      margin-top: 7px

  .foo
    margin-top: 60px
    border-top: 1px solid #ebebeb
    position: relative
    padding-top: 20px
    padding-bottom: 30px
    width: 100%
    display: flex
    flex-flow: row wrap
    justify-content: center
    align-items: center
    +tablet
      justify-content: space-between
    &__social
      display: flex
      margin-bottom: 10px
      width: 100%
      justify-content: center
      +tablet
        margin-bottom: 0
        width: auto
    &__socialLink
      width: 32px
      height: 32px
      background-color: $white
      &:not(:first-child)
        margin-left: 10px
    &__copyright
      font-size: 14px
      color: $black
</style>

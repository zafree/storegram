<template>
  <div :class="$style.appFooterInner">
      <div :class="$style.appFooterContainer">
          <div :class="$style.footer">
              <div :class="$style.footerIntro">
                  <i18n-link :class="$style.footerLogo" to="/">
                      <img :class="$style.footerLogoImage" :src="logoFooter" alt="">
                  </i18n-link>
                  <p :class="$style.footerAbout">{{ footerAboutText }}</p>
                  <p :class="$style.footerPhone"><a :class="$style.footerPhoneLink" :href="'tel:'+footerPhone">Phone: {{ footerPhone }}</a></p>
                  <p :class="$style.footerPhone"><a :class="$style.footerPhoneLink" :href="'mailto:info@aksglobaltrading.net'">Email: info@aksglobaltrading.net</a></p>
                  <p :class="$style.footerAbout">Address:<br>{{ footerAddress }}</p>
                  <!-- <ul :class="$style.footerSocialList" v-if="!isAgentMode">
                      <li :class="$style.footerSocialItem">
                          <a :class="$style.footerSocialLink" :href="projectFacebookLink" target="_blank">
                            <img src="/svg/socials/facebook-footer.svg" alt="">
                          </a>
                      </li>
                      <li :class="$style.footerSocialItem">
                          <a :class="$style.footerSocialLink" :href="projectInstagramLink" target="_blank">
                            <img src="/svg/socials/instagram-footer.svg" alt="">
                          </a>
                      </li>
                  </ul> -->
              </div>
              <div :class="$style.footerExtraRoute">
                  <h4 :class="$style.footerExtraHeading">Quick links</h4>
                  <!-- <h4 :class="$style.footerExtraHeading">{{ projectTitle }}</h4> -->
                  <ul :class="$style.footerExtraList">
                      <li :class="$style.footerExtraItem"><i18n-link :class="$style.footerExtraLink" to="/docs/about"><span :class="$style.footerExtraLinkSvg"><img src="/svg/foo-arrowRight.svg" alt=""></span><span :class="$style.footerExtraLinkText">About</span></i18n-link></li>
                      <!-- <li :class="$style.footerExtraItem"><i18n-link :class="$style.footerExtraLink" to="/docs/store-finder"><span :class="$style.footerExtraLinkSvg"><img src="/svg/foo-arrowRight.svg" alt=""></span><span :class="$style.footerExtraLinkText">Store Finder</span></i18n-link></li> -->
                      <!-- <li :class="$style.footerExtraItem"><i18n-link :class="$style.footerExtraLink" to="/docs/franchise"><span :class="$style.footerExtraLinkSvg"><img src="/svg/foo-arrowRight.svg" alt=""></span><span :class="$style.footerExtraLinkText">Franchise</span></i18n-link></li> -->
                      <li :class="$style.footerExtraItem"><i18n-link :class="$style.footerExtraLink" to="/docs/help-center"><span :class="$style.footerExtraLinkSvg"><img src="/svg/foo-arrowRight.svg" alt=""></span><span :class="$style.footerExtraLinkText">Help Center</span></i18n-link></li>
                      <li :class="$style.footerExtraItem"><i18n-link :class="$style.footerExtraLink" to="/docs/faq"><span :class="$style.footerExtraLinkSvg"><img src="/svg/foo-arrowRight.svg" alt=""></span><span :class="$style.footerExtraLinkText">FAQ</span></i18n-link></li>
                      <!-- <li :class="$style.footerExtraItem"><i18n-link :class="$style.footerExtraLink" to="/docs/about"><span :class="$style.footerExtraLinkSvg"><img src="/svg/foo-arrowRight.svg" alt=""></span><span :class="$style.footerExtraLinkText">{{ i18nText.extraTextAbout }}</span></i18n-link></li>
                      <li :class="$style.footerExtraItem"><i18n-link :class="$style.footerExtraLink" to="/docs/contact"><span :class="$style.footerExtraLinkSvg"><img src="/svg/foo-arrowRight.svg" alt=""></span><span :class="$style.footerExtraLinkText">{{ i18nText.extraTextContact }}</span></i18n-link></li>
                      <li :class="$style.footerExtraItem"><i18n-link :class="$style.footerExtraLink" to="/docs/jobs"><span :class="$style.footerExtraLinkSvg"><img src="/svg/foo-arrowRight.svg" alt=""></span><span :class="$style.footerExtraLinkText">{{ i18nText.extraTextJobs }}</span></i18n-link></li>
                      <li :class="$style.footerExtraItem"><i18n-link :class="$style.footerExtraLink" to="/docs/press"><span :class="$style.footerExtraLinkSvg"><img src="/svg/foo-arrowRight.svg" alt=""></span><span :class="$style.footerExtraLinkText">{{ i18nText.extraTextPress }}</span></i18n-link></li> -->
                  </ul>
              </div>
              <div :class="$style.footerExtraRoute">
                  <h4 :class="$style.footerExtraHeading">Legal</h4>
                  <!-- <h4 :class="$style.footerExtraHeading">{{ i18nText.headingHelp }}</h4> -->
                  <ul :class="$style.footerExtraList">
                      <li :class="$style.footerExtraItem"><i18n-link :class="$style.footerExtraLink" to="/docs/privacy"><span :class="$style.footerExtraLinkSvg"><img src="/svg/foo-arrowRight.svg" alt=""></span><span :class="$style.footerExtraLinkText">Privacy Policy</span></i18n-link></li>
                      <li :class="$style.footerExtraItem"><i18n-link :class="$style.footerExtraLink" to="/docs/terms"><span :class="$style.footerExtraLinkSvg"><img src="/svg/foo-arrowRight.svg" alt=""></span><span :class="$style.footerExtraLinkText">Term and Conditions</span></i18n-link></li>
                      <li :class="$style.footerExtraItem"><i18n-link :class="$style.footerExtraLink" to="/docs/return-policy"><span :class="$style.footerExtraLinkSvg"><img src="/svg/foo-arrowRight.svg" alt=""></span><span :class="$style.footerExtraLinkText">Return Policy</span></i18n-link></li>
                      <!-- <li :class="$style.footerExtraItem"><i18n-link :class="$style.footerExtraLink" to="/docs/cancellation-and-returns"><span :class="$style.footerExtraLinkSvg"><img src="/svg/foo-arrowRight.svg" alt=""></span><span :class="$style.footerExtraLinkText">{{ i18nText.extraTextCancellationReturns }}</span></i18n-link></li> -->
                      <!-- <li :class="$style.footerExtraItem"><i18n-link :class="$style.footerExtraLink" to="/docs/payment"><span :class="$style.footerExtraLinkSvg"><img src="/svg/foo-arrowRight.svg" alt=""></span><span :class="$style.footerExtraLinkText">{{ i18nText.extraTextPayment }}</span></i18n-link></li>
                      <li :class="$style.footerExtraItem"><i18n-link :class="$style.footerExtraLink" to="/docs/delivery"><span :class="$style.footerExtraLinkSvg"><img src="/svg/foo-arrowRight.svg" alt=""></span><span :class="$style.footerExtraLinkText">{{ i18nText.extraTextDelivery }}</span></i18n-link></li>
                      <li :class="$style.footerExtraItem"><i18n-link :class="$style.footerExtraLink" to="/docs/faq"><span :class="$style.footerExtraLinkSvg"><img src="/svg/foo-arrowRight.svg" alt=""></span><span :class="$style.footerExtraLinkText">{{ i18nText.extraTextFaq }}</span></i18n-link></li>
                      <li :class="$style.footerExtraItem"><i18n-link :class="$style.footerExtraLink" to="/docs/customer-care"><span :class="$style.footerExtraLinkSvg"><img src="/svg/foo-arrowRight.svg" alt=""></span><span :class="$style.footerExtraLinkText">{{ i18nText.extraTextCustomerCare }}</span></i18n-link></li> -->
                  </ul>
              </div>
              <div :class="$style.footerExtraRoute">
                  <h4 :class="$style.footerExtraHeading">{{ i18nText.headingPayment }}</h4>
                  <div :class="$style.footerPayment">
                      <div :class="[$style.footerPaymentOption, $style.footerPaymentOptionCashOnDelivery]">
                      </div>
                      <div :class="[$style.footerPaymentOption, $style.footerPaymentOptionBkash]">
                      </div>
                      <div :class="[$style.footerPaymentOption, $style.footerPaymentOptionRocket]">
                      </div>
                      <!-- <div :class="[$style.footerPaymentOption, $style.footerPaymentOptionCcDbbl]">
                      </div> -->
                      <div :class="[$style.footerPaymentOption, $style.footerPaymentOptionCcVisa]">
                      </div>
                      <div :class="[$style.footerPaymentOption, $style.footerPaymentOptionCcMastercard]">
                      </div>
                      <div :class="[$style.footerPaymentOption, $style.footerPaymentOptionCcAmex]">
                      </div>
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
              <a :class="$style.fooSocialLink" href="#Link">
                <img src="/clients/bronx/icons/facebook.svg" alt="" width="32px" height="32px">
              </a>
              <a :class="$style.fooSocialLink" href="#Link">
                <img src="/clients/bronx/icons/instagram.svg" alt="" width="32px" height="32px">
              </a>
              <a :class="$style.fooSocialLink" href="#Link">
                <img src="/clients/bronx/icons/youtube.svg" alt="" width="32px" height="32px">
              </a>
            </div>
            <span :class="$style.fooCopyright"> {{copyRight}} </span>
          </div>
      </div>
      <!-- <div :class="$style.foo">
          <div :class="$style.fooContainer">
              <div :class="$style.fooFoo">
                <span :class="$style.fooCopyright"> {{copyRight}} </span>
              </div>
          </div>
      </div> -->
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
        footerAddress: process.env.PROJECT_ADDRESS_TEXT,
        projectTitle: process.env.PROJECT_TITLE,
        projectFacebookLink: process.env.PROJECT_FACEBOOK,
        projectInstagramLink: process.env.PROJECT_INSTAGRAM,
        logoFooter: '/clients/' + process.env.PROJECT_NAME + '/svg/logo-footer.svg'
      }
    },
    computed: {
      ...mapGetters([
        'isAgentMode'
      ]),
      copyRight () {
        const thisYear = this.__$(new Date().getFullYear(), true)
        return this.$t('footer.copy_right', {field: thisYear})
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
  .App__footer
    &-inner
      position: relative
      margin-top: 70px

    &-container
      +container
      display: flex
      flex-flow: row wrap
      margin-left: auto
      margin-right: auto
      justify-content: flex-start
      width: 100%


  .Footer
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
      display: inline-flex
      flex-flow: row wrap
      color: $purple
      fill: $purple
    &__logoImage
        height: 60px
        width: auto
        // +tablet
        //   height: 30px

    &__about
      color: #666
      fill: #666
      line-height: 1.77
      font-size: 14px
      margin-top: 20px
      max-width: 350px
    &__Phone
      margin-top: 11px
      max-width: 350px
    &__PhoneLink
      color: #666
      fill: #666
      line-height: 1.77
      font-size: 14px
      text-decoration: none

    &SocialList
      margin: 20px 0 0
      padding: 0
      list-style: none
      color: #666
      fill: #666
      display: flex
      flex-flow: row nowrap
    &__socialItem
      list-style: none
      &:not(:first-child)
        margin-left: 15px
    &__socialLink
      color: inherit
      fill: inherit
      text-decoration: none
      // background-color: rgba($black, .08)
      width: 26px
      height: 26px
      display: flex
      flex-flow: row wrap
      justify-content: center
      align-items: center
      border-radius: 4px
      transition: all .33s 0s
      &:hover,
      &:focus
        color: #000
        fill: #000



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
      // font-weight: bold
      color: $black
      fill: $black
      padding-top: 30px
      +desktop
        padding-top: 40px
    &__extraList
      margin: 20px 0 0
      padding: 0
      list-style: none
    &__extraItem
      list-style: none
      &:not(:first-child)
    &__extraLink
      +button
      font-size: 14px
      color: #666
      fill: #666
      text-decoration: none
      line-height: 1.33
      position: relative
      display: inline-flex
      flex-flow: row wrap
      align-items: center
      padding-left: 0
      padding-right: 20px
      padding-top: 6px
      padding-bottom: 6px
      min-height: 32px
      // background-color: $white
      transition: all .33s 0s
      &:hover,
      &:focus,
      &:active
        color: #333
        fill: #333
        padding-left: 15px
        padding-right: 5px
        .Footer__extraLinkSvg
          margin-left: 0
          opacity: 1
          visibility: visible
    &__extraLinkSvg
      position: absolute
      left: 0
      top: 50%
      transform: translateY(-50%)
      opacity: 0
      visibility: hidden
      margin-left: -6px
      line-height: 10px
      transition: all .33s 0s
    &__extraLinkText
      font-size: inherit
      color: inherit
      fill: inherit


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

  .Foo
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
      flex-flow: row wrap
      margin-bottom: 10px
      width: 100%
      justify-content: center
      +tablet
        margin-bottom: 0
        width: auto
    &__socialLink
      &:not(:first-child)
        margin-left: 10px
    &__copyright
      font-size: 14px
      color: $black
    svg
      background-color: rgba($primary, 0.1)
  // .Foo
  //   padding-top: 10px
  //   padding-bottom: 10px
  //   margin-top: 40px
  //   // border-top: 1px solid #eee
  //   background-color: #fafafa
  //   &__container
  //     +container
  //     text-align: center
  //     +desktop
  //       display: flex
  //       flex-flow: row wrap
  //       justify-content: center

    // &__address
    //   position: relative
    //   width: 100%
    //   font-style: normal
    //   font-size: 13px
    //   line-height: 1.55
    //   color: #999
    //   fill: #999
    //   margin-bottom: 5px
    //   +clearfix
    //   &Brief
    //     position: relative
    //   &Phone
    //     position: relative
    //     display: block
    //     margin-top: 5px
    //     +phablet
    //       display: inline
    //       margin-top: 0
    //       padding-left: 15px

    // &__extraList
    //   padding: 0
    //   margin: 0
    //   list-style: none
    //   display: flex
    //   flex-flow: row wrap
    //   justify-content: center
    //   +desktop
    //     margin-right: 20px
    // &__extraItem
    //   list-style: none
    //   &::after
    //     content: '\00b7'
    //     margin-left: 3px
    //     margin-right: 3px
    //     color: #999
    //     fill: #999
    //     +phablet
    //       margin-left: 5px
    //       margin-right: 5px
    //   &:not(:first-child)
    //     // margin-left: 5px
    //   &:not(:last-child)
    //     // margin-right: 5px
    //   &:last-child
    //     &::after
    //       display: none
    // &__extraLink
    //   font-size: 13px
    //   line-height: 1.55
    //   position: relative
    //   display: inline-flex
    //   align-items: center
    //   padding: 3px 5px
    //   // background-color: rgba(red, .1)
    //   min-height: 26px
    //   text-decoration: none
    //   color: #999
    //   fill: #999
    //   transition: all .33s 0s
    //   &:hover,
    //   &:focus,
    //   &:active
    //     color: #333
    //     fill: #333
    //     text-decoration: underline

    // &__foo
    //   font-size: 13px
    //   line-height: 1.88
    //   color: #999
    //   fill: #999

    // &__copyright
    //   display: inline-flex
    //   align-items: center
    // &__affiliated
    //   display: inline-flex
    //   align-items: center
    //   justify-content: center
    //   width: 100%
    //   color: $purple
    //   +phablet
    //     width: auto
    //     margin-left: 10px
    // &__affiliatedCompany
    //   padding-left: 4px
    //   padding-right: 5px
    //   color: #085da8
    //   fill: #085da8
    //   cursor: pointer
    //   display: inline-flex
    //   align-items: center

</style>

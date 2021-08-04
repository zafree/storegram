<template>
  <header>
    <h2>{{name}}</h2>
    <i18n-link class="link" v-if="!showFullListInSummary" :to="linkPath">See more</i18n-link>
  </header>
  <!-- <header :class="$style.heading">
    <span :class="$style.headingTitle">
      <span v-if="showFullListInSummary" :class="$style.headingLink">{{name}}</span>
      <i18n-link v-else :to="linkPath" :class="$style.headingLink">{{name}}</i18n-link>
    </span>
    <i18n-link v-if="!showFullListInSummary" :class="[$style.headingMore, $style.button]" :to="linkPath">
      <span>{{$t('catalog.view_more')}}</span>
      <img :class="$style.headingMoreIcon" src="/svg/arrow-right-more.svg" alt="">
    </i18n-link>
  </header> -->
</template>

<script>
  import i18nLink from '~/components/i18nLink'

  export default {
    props: [
      'name',
      'linkPath',
      'showFullListInSummary'
    ],
    components: {
      i18nLink
    }
  }
</script>

<style lang="sass" scoped>
  header
    position: relative
    display: flex
    flex-flow: row wrap
    justify-content: space-between
    align-items: center
    // background-color: rgba(blue, 0.1)
    // border-top: 1px solid #ededed
    // padding-top: 70px
    margin-bottom: 10px
    +tablet
      margin-bottom: 30px

  h2
    font-size: 2.4em
    line-height: 1.33
    color: $black
    letter-spacing: 0.01em
    font-weight: $weight-bold
    // font-family: $family-display
    // background-color: rgba(green, 0.1)
    +tablet
      font-size: 4em

  .link
    +button
    font-size: 1.6em
    height: 48px
    // background-color: rgba($primary, 0.1)
    display: inline-flex
    justify-content: center
    align-items: center
    padding-right: 8px + 6
    color: $black
    &::after
      content: ""
      position: absolute
      right: 0
      top: 50%
      width: 8px
      height: 12px
      transform: translateY(-50%)
      background-image: url(/clients/bronx/icons/seemore.svg)



</style>

<style lang="sass" module>
  @import "shared/button"

  .Heading
    display: flex
    justify-content: space-between
    align-items: center
    position: relative
    background-color: rgba($primary, 0.1)
    // border-top: 1px solid #e5e5e5
    // background-color: $white
    // margin-left: -15px
    // margin-right: -15px
    // padding-left: 15px
    // padding-right: 15px
    // +phablet
    //   margin-left: 0
    //   margin-right: 0
    //   padding-left: 0
    //   padding-right: 0
    //   background-color: transparent
    //   border-top: 1px solid #d9d9d9
    //   z-index: 2

    &__title
      font-size: 4em
      line-height: 1.2
      text-decoration: none
      font-weight: $weight-bold
      color: $black
      fill: $black
      // flex: 1
      background-color: rgba($black, 0.1)
    &__Link
      display: block
      color: inherit
      fill: inherit
      text-decoration: none
      // padding-top: 12px
      // padding-bottom: 12px
      border: 1px solid red

    &__more
      display: flex
      align-items: center
      font-size: 12px
      font-weight: $weight-medium
      text-transform: uppercase
      margin-top: -1px
      padding: 0 8px 0 10px
      height: 26px
      background-color: $purple
      color: $white
      fill: $yellow
      // +btnPurple
      border-radius: 6px
      &:hover
        color: $yellow
        fill: $yellow
      &--icon
        margin-left: 5px
</style>

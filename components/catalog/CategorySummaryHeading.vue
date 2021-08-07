<template>
  <header :class="$style.header">
    <h2 :class="$style.headerTitle">{{name}}</h2>
    <i18n-link :class="[$style.headerLink, $style.btn]" v-if="!showFullListInSummary" :to="linkPath">
      <span :class="$style.btnLabel">See more</span>
      <svg :class="$style.btnIcon" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
        <use xlink:href="/svg/icons.svg?#i-arrow"></use>
      </svg>
    </i18n-link>
  </header>
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

<style lang="sass" module>
  @import "shared/button"
  .header
    position: relative
    display: flex
    justify-content: space-between
    align-items: center
    margin-top: 20px
    margin-bottom: 30px
    &__title
      font-size: 3.2em
      line-height: 1.33
      color: $black
      font-weight: $weight-black
      flex: 1
    &__link
      width: auto
      padding-left: 8px
      padding-right: 8px
</style>

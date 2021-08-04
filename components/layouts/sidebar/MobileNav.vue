<template>
  <div class="tab">
    <button :class="['tab__link', {'isActive': isActiveCatalog}]" href="#link" v-if="!isStaticMode" @click.prevent="showCatalogMenu()">{{$t('catalog.all_categories')}}</button>
    <template v-if="!isLoggedIn">
      <login-link></login-link>
    </template>
    <template v-if="isLoggedIn">
      <button :class="['tab__link', {'isActive': isActiveProfile}]" href="#link" @click.prevent="showProfileMenu()">Account</button>
    </template>
  </div>
  <!-- <div class="tab">
    <button class="tab__link isActive" href="#link" v-if="!isStaticMode" @click.prevent="showCatalogMenu()">{{$t('catalog.all_categories')}}</button>
    <template v-if="!isLoggedIn">
      <login-link></login-link>
    </template>
    <template v-if="isLoggedIn">
      <button class="tab__link" href="#link" @click.prevent="showProfileMenu()">Account</button>
    </template>
  </div> -->

  <!-- <div :class="$style.nav">
    <p>Mobile Nav</p>
    <ul :class="$style.navList">

      <li :class="$style.navItem" v-if="!isStaticMode"><a :class="[$style.navLink, $style.navLinkCat]" href="" @click.prevent="showCatalogMenu()">{{$t('sidebar.nav.category_link')}}</a></li>

      <li :class="$style.navItem" v-if="!isLoggedIn">
        <login-link :class="[$style.navLink, $style.navLinkStatus]"></login-link>
      </li>
      <li :class="$style.navItem" v-if="isLoggedIn">
        <a :class="[$style.navLink, $style.navLinkStatus, { [$style.navLinkFull]: isLoggedIn && isStaticMode }]" href="" @click.prevent="showProfileMenu()">
          <span :class="$style.avatar">
            <img v-if="userAvatar" :class="$style.avatarCustomerPhoto" :src="userAvatar" :alt="userName">
            <img :class="$style.avatarSvgIcon" src="/svg/delivery-point/dgMan.svg" alt="">
          </span>

          <span :class="$style.name">{{ userName }}</span>
        </a>
      </li>
    </ul>
  </div> -->
</template>

<script>
  import LoginLink from '~/components/layouts/header/LoginLink.vue'
  import { mapState, mapGetters } from 'vuex'

  import {
    SET_SIDE_BAR_MENU,
    SIDE_BAR_MENU_CATALOG,
    SIDE_BAR_MENU_PROFILE
  } from '~/store/constants.yaml'

  export default {
    computed: {
      ...mapState([
        'customer',
        'agent',
        'ui'
      ]),
      ...mapGetters([
        'isAgentMode',
        'isCustomerMode',
        'isLoggedIn'
      ]),
      isStaticMode () {
        return (this.$route.name === 'docs-page_name' || this.$route.name === 'lang-docs-page_name')
      },
      userName () {
        if (this.agent) return this.__(this.agent.name)
        else if (this.customer) return this.customer.name
        else return null
      },
      userAvatar () {
        if (this.isCustomerMode && this.customer && this.customer.avatar_url) return this.customer.avatar_url
        else if (this.isAgentMode && this.agent && this.agent.address && this.agent.address.profile_image) return this.agent.address.profile_image
        else return null
      },
      isActiveCatalog () {
        if (this.isStaticMode) return !this.isStaticMode
        return this.ui.activeSideBarMenu === SIDE_BAR_MENU_CATALOG
      },
      isActiveProfile () {
        if (this.isStaticMode) return this.isStaticMode
        return this.ui.activeSideBarMenu === SIDE_BAR_MENU_PROFILE
      }
    },
    methods: {
      showCatalogMenu () {
        this.$store.commit(SET_SIDE_BAR_MENU, SIDE_BAR_MENU_CATALOG)
      },
      showProfileMenu () {
        this.$store.commit(SET_SIDE_BAR_MENU, SIDE_BAR_MENU_PROFILE)
      }
    },
    components: {
      LoginLink
    }
  }
</script>

<style lang="sass" scoped>

  .tab
    position: relative
    display: flex
    flex-flow: row wrap
    &::after
      content: ""
      position: absolute
      bottom: 0
      left: 0
      right: 0
      height: 1px
      background-color: #ddd
    &__link
      +button
      height: 56px
      // border: 1px solid green
      padding-right: 10px
      font-size: 1.4em
      color: #999999
      &:not(:first-child)
        margin-left: 10px
      &.isActive
        color: $black
        &::after
          content: ""
          position: absolute
          bottom: 0
          left: 0
          right: 0
          height: 2px
          background-color: $black
          z-index: 1

    .login
      +button
      position: absolute
      top: 50%
      right: 0
      height: 32px
      padding: 0 20px
      border: 1px solid rgba($primary, 0.5)
      background-color: rgba($primary, 0.03)
      font-size: 12px
      border-radius: 40px
      transform: translateY(-50%)

</style>

<style lang="sass" module>
  .Nav
    position: relative
    display: block
    &__list
      padding: 0
      margin: 0
      border: 0
      vertical-align: baseline
      list-style: none
      display: flex
      align-items: center
    &__item
      flex: 1
      text-align: center
      // background-color: rgba($black, .1)
    &__link
      padding: 0
      margin: 0
      border: 0
      border-radius: 0
      background: 0 0
      appearance: none
      display: inline-flex
      width: 100%
      flex-flow: row nowrap
      // justify-content: center
      align-items: center
      position: relative
      vertical-align: middle
      text-align: center
      text-decoration: none
      color: $gray
      line-height: 1.5
      // background-color: rgba($black, .1)
      min-height: 50px
      &--cat
        font-size: 15px
        padding-left: 15px
        padding-right: 15px
      &--status
        font-size: 13px
        background-color: $yellow
        justify-content: center
        padding-left: 10px
        padding-right: 10px
      &--full
        justify-content: flex-start
        .name
          max-width: 220px

  .avatar
    min-width: 30px
    min-height: 30px
    width: 30px
    height: 30px
    border-radius: 30px
    background-color: lighten($purple, 26%)
    margin-right: 5px
    overflow: hidden
    &__svgIcon
      width: 100%
  .name
    text-align: left
    display: block
    max-width: 70px
    overflow: hidden
    white-space: nowrap
    text-overflow: ellipsis
</style>

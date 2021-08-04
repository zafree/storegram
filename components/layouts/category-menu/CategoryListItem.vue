<template>
  <li :class="{ open: !item.collapsed && item && item.children.length, parentItem: !item.parent_id}" >
    <div class="link">
      <i18n-link class="name" :to="linkPath">{{ name }}</i18n-link>
      <div class="more" v-if="item && item.children && item && item.children.length" @click="toggle()">
        <span :class="['more__icon', iconFileName]"></span>
      </div>
    </div>
     <transition name="fade">
        <category-list
          v-if="item && item.children && item.children.length" v-show="!item.collapsed"
          :items="item.children"
        ></category-list>
      </transition>
  </li>
</template>

<script>
  import i18nLink from '~/components/i18nLink'
  import CategoryList from '~/components/layouts/category-menu/CategoryList'
  import { CHANGE_COLLAPDESD_STATE } from '~/store/constants.yaml'

  import { mapState } from 'vuex'

  export default {
    props: ['item'],
    data () {
      return {
        isActive: false
      }
    },
    computed: {
      ...mapState([
        'ui'
      ]),
      name () {
        return this.__(this.item.name)
      },
      linkPath () {
        return '/category/' + this.item.slug
      },
      // children () {
      //   return this.$store.getters.categoryChildren(CONTAINER_CATEGORY_MENU, this.item)
      // },
      iconFileName () {
        const iconName = this.item.parent_id
          ? 'more__icon--plus'
          : 'more__icon--arrow'
        return `${iconName}`
      }
    },
    methods: {
      toggle () {
        this.$store.commit(CHANGE_COLLAPDESD_STATE, {id: this.item.id, value: !this.item.collapsed})
      }
    },
    components: {
      i18nLink
    },
    beforeCreate: function () {
      this.$options.components.CategoryList = CategoryList
    }
  }
</script>

<style lang="sass" scoped>

  li
    list-style: none
    position: relative
    .link
      position: relative
      text-decoration: none
      color: $black
      fill: $black
      display: flex
      flex-flow: row nowrap
      // font-family: $family-alata
      // align-items: center
      &:hover
        .name
          color: $primary
          fill: $primary
        .more
          &__icon
            &::before,
            &::after
              background-color: $primary
      .name,
      .more
        // display: inline-flex
        // flex: 1
        // display: flex
        // flex-flow: row wrap
        // align-items: center
        // min-height: 40px
        // color: inherit
        // fill: inherit
      .name
        flex: 1
        min-height: 44px
        padding: 13px 0
        text-decoration: none
        font-size: 16px
        color: $black
        &.nuxt-link-exact-active.nuxt-link-active
          color: $primary
          fill: $primary
      .more
        position: relative
        width: 56px

        // background-color: rgba(green, 0.08)
        &__icon
          position: absolute
          // background-color: rgba($black, 0.08)
          width: 12px
          height: 12px
          top: 0
          left: 0
          margin-left: 22px
          margin-top: 16px
          &::before,
          &::after
            content: ""
            position: absolute
            top: 0
            left: 0
            background-color: $black
          &--arrow
            &::before
              height: 2px
              width: 12px
              margin-top: 5px
            &::after
              height: 12px
              width: 2px
              margin-left: 5px
              opacity: 1
              visibility: visible

          &--plus
            width: 11px
            height: 11px
            // background-color: rgba($black, 0.1)
            &::before
              height: 1px
              width: 11px
              margin-top: 5px
            &::after
              height: 11px
              width: 1px
              margin-left: 5px
              opacity: 1
              visibility: visible


    &.open
      // background-color: rgba($black, .02)
      > .link
        .name
          // font-weight: $weight-bold
          // border: 1px solid green
        .more
          &__icon
            &--arrow
              // background-color: rgba($primary, 0.11)
              &::before
                background-color: $primary
              &::after
                opacity: 0
                visibility: hidden
            &--plus
              // background-color: rgba($primary, 0.08)
              &::before
                background-color: $primary
              &::after
                opacity: 0
                visibility: hidden

  li.parentItem
    &:not(:first-child)
      border-top: 1px solid #ebebeb
    // min-height: 56px
    > .link
      // color: #555
      // fill: #555
      .name,
      .more
        // min-height: 56px
        // color: inherit
        // fill: inherit
      .name
        min-height: 64px
        padding: 23px 0
        font-size: 18px
      .more
        margin-right: -22px
        &__icon
          margin-top: 26px


</style>

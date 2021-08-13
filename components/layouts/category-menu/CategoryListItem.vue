<template>
  <li :class="[$style.item, {[$style.itemParent]: !item.parent_id}, {[$style.itemOpen]: !item.collapsed && item && item.children.length}]" itemprop="item">
    <div :class="$style.itemWrap" itemprop="item-wrapper">
      <i18n-link :class="[$style.itemLink, $style.btn]" itemprop="label" :to="linkPath">
        <span>{{ name }}</span>
      </i18n-link>
      <i18n-link :class="[$style.itemLinkIcon, $style.btn]" :to="linkPath" v-if="!(item && item.children && item && item.children.length)">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
          <use xlink:href="/svg/icons.svg?#i-arrow"></use>
        </svg>
      </i18n-link>
      <button :class="[$style.itemMore, $style.btn]" itemprop="icon" v-if="item && item.children && item && item.children.length" @click="toggle()">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
          <use xlink:href="/svg/icons.svg?#i-plus"></use>
        </svg>
      </button>
    </div>
    <category-list v-if="item && item.children && item.children.length" v-show="!item.collapsed" :class="$style.subList" itemprop="sub-list" :items="item.children"></category-list>
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

<style lang="sass" module>
  @import "shared/button"
  @import "shared/sidebar-category-list"
</style>

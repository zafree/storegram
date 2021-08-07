<template>
  <ul :class="$style.breadcrumbList">
    <li :class="$style.breadcrumbItem" v-for="route in linkRoutes" :key="route.id">
      <i18n-link :class="[$style.breadcrumbLink, $style.btn]" v-if="route.path" :to="route.path">
        <span :class="$style.btnLabel">{{route.text}}</span>
        <svg :class="$style.btnIcon" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
          <use xlink:href="/svg/icons.svg?#i-arrow"></use>
        </svg>
      </i18n-link>

      <span :class="[$style.breadcrumbSpan, $style.btn]" v-else>{{route.text}}</span>
    </li>
  </ul>
</template>

<script>
  import i18nLink from '~/components/i18nLink'
  import { mapState } from 'vuex'

  export default {
    computed: {
      ...mapState([
        'currentCategory'
      ]),
      ancestorsAndSelf () {
        let result = []
        if (this.currentCategory) {
          Array.prototype.push.apply(result, this.$store.getters.categoryAncestors(this.currentCategory))
          result.push(this.currentCategory)
        }
        return result
      },
      hasSpecialCategory () {
        return /^(lang-)?special-slug/.test(this.$route.name)
      },
      specialCategory () {
        if (this.hasSpecialCategory) {
          return this.$store.getters.categoryBySlug(this.$route.params.slug)
        }
        return null
      },
      linkRoutes () {
        const vm = this
        let routes = [{
          text: vm.$t('catalog.all_categories'),
          path: '/',
          id: 'bread-crumb-root'
        }]
        vm.ancestorsAndSelf.forEach((c) => {
          routes.push({
            text: vm.__(c.name),
            path: '/category/' + c.slug,
            id: 'bread-crumb-' + c.id
          })
        })

        if (vm.hasSpecialCategory) {
          routes.push({
            text: vm.__(vm.specialCategory.name),
            path: null,
            id: 'bread-crumb-' + vm.specialCategory.id
          })
        } else {
          delete routes[routes.length - 1].path
        }

        return routes
      }
    },
    components: {
      i18nLink
    }
  }
</script>

<style lang="sass" module>
  @import "shared/button"
  @import "shared/breadcrumb"
  .Breadcrumb
    // &__list
    //   margin: 0
    //   padding: 0
    //   display: flex
    //   flex-flow: row wrap
    // &__item
    //   position: relative
    //   list-style: none
    //   font-size: 12px
    //   color: $black
    //   display: flex
    //   align-items: center
    //   margin-right: 19px
    //   &::before
    //     content: ''
    //     position: absolute
    //     width: 10px
    //     height: 9px
    //     top: 50%
    //     right: 0
    //     margin-right: -14px
    //     transform: translateY(-50%)
    //     background-image: url('/svg/arrow-breadcrumb.svg')
    //     z-index: 1
    //   &:last-child
    //     margin-right: 0
    //     &::before
    //       display: none
    // &__link
    //   display: inline-block
    //   color: inherit
    //   fill: inherit
    //   text-decoration: none
    //   font-weight: 400
    //   position: relative
    // &__span
    //   display: inline-block
    //   color: inherit
    //   fill: inherit
    //   text-decoration: none
    //   font-weight: 700

</style>

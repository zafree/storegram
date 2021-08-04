<template>
  <div :class="$style.appHeaderInner">
      <div :class="$style.logo">
        <logo></logo>
      </div> <!-- /.Logo -->
  </div><!-- /.App__header-inner -->
</template>


<script>
  import Logo from '~/components/layouts/header/Logo.vue'

  export default {
    data () {
      return {

      }
    },
    computed: {
    },
    components: {
      Logo
    },
    methods: {
    }
  }
</script>

<style lang="sass" module>
  // .App__header-inner
  //   position: relative
  //   display: flex
  //   flex-flow: row wrap
  //   margin-left: auto
  //   margin-right: auto
  //   justify-content: flex-start
  //   width: 100%
  //   // padding-left: 15px
  //   // padding-right: 15px
  //   +phablet
  //     max-width: $phablet - 20
  //   +tablet
  //     max-width: $tablet - 20
  //   +desktop
  //     max-width: $desktop - 20
  //   +widescreen
  //     max-width: $widescreen - 20

  // .Logo
  //   flex: 1
  //   // max-width: 108px
  //   height: 40px
  //   display: flex
  //   flex-flow: row wrap
  //   align-items: center
  //   +widescreen
  //     // max-width: 240px
  //     padding-left: 15px
</style>


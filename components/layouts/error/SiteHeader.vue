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

</style>


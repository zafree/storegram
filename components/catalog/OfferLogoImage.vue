<template>
  <div>
    <computed-image
      :src="imageLink"
      :class="{[$style.this]: !imageIsLoaded}"
      @imageLoaded="imageIsLoaded = true"
    >
    </computed-image>
    <!-- <div v-if="!imageIsLoaded">
    </div> -->
  </div>
</template>

<script>
  import ComputedImage from '~/components/ComputedImage.vue'
  export default {
    data () {
      return {
        imageIsLoaded: false
      }
    },
    // mounted () {
    //   this.$root.$on('imageLoaded', () => {
    //     this.imageIsLoaded = true
    //   })
    // },
    props: {
      'imageLink': {
        type: String,
        required: false
      }
    },
    components: {
      ComputedImage
    }
  }
</script>

<style lang="sass" module>
  .this
    height: 10px
    width: 60px
    color: black
</style>

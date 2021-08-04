<template>
  <a :href="path">{{ text }}</a>
</template>

<script>
export default {
  computed: {
    text () {
      return this.$t('switch_language')
    },
    path () {
      if (this.$i18n.locale === 'en') {
        return '/bn' + this.$route.fullPath
      }
      return this.$route.fullPath.replace(/^\/[^/]+/, '')
    }
  }
}
</script>

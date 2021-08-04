<template>
  <div :class="$style.emptyState">
    <h4 :class="$style.emptyStateTitle">{{ text }}</h4>
  </div>
</template>

<script>

export default {
  props: {
    i18nKey: {
      type: String,
      required: true
    }
  },
  computed: {
    text () {
      return this.$t(this.i18nKey)
    }
  }
}
</script>

<style lang="sass" module>
  @import "shared/emptyState"
</style>

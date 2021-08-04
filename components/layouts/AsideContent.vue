<template>
  <div class="asideContent">
    <header :class="[$style.heading]" v-if="$slots.title">
      <h3 :class="[$style.headingTitle]">
        <slot name="title"></slot>
      </h3>
    </header>
    <slot></slot>
  </div>
</template>

<style lang="sass" scoped>
  .asideContent
    position: relative
</style>

<style lang="sass" module>
  .Heading
    margin-top: 10px
    margin-bottom: 25px
    &__title
      font-size: 16px
      padding: 0
      margin: 0
      font-weight: 700
      color: #555555
</style>

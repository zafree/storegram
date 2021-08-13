<template>
  <div class="loading">
    <svg class="loading__icon" viewBox="0 0 50 50">
      <circle class="loading__circle" cx="25" cy="25" r="20" fill="none" stroke-width="10"></circle>
    </svg>
  </div>
</template>

<style lang="sass" scoped>
  .loading
    // border: 1px solid red
    position: relative
    margin-top: 80px
    margin-bottom: 80px
    display: flex
    justify-content: center
    align-items: center
    &__icon
      width: 24px
      height: 24px
      overflow: hidden
      animation: rotate 2s linear infinite
    &__circle
      stroke: #dddddd
      stroke-linecap: round
      animation: dash 1.5s ease-in-out infinite

  +keyframes(rotate)
    100%
      transform: rotate(360deg)
  +keyframes(dash)
    0%
      stroke-dasharray: 1, 150
      stroke-dashoffset: 0
    50%
      stroke-dasharray: 90, 150
      stroke-dashoffset: -35
    100%
      stroke-dasharray: 90, 150
      stroke-dashoffset: -124
</style>


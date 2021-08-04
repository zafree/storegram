<template>
  <div :class="wrapperClassList">
    <div :class="$style.notificationContainer">
      <div :class="$style.notificationRow">
        <div :class="$style.notificationColumn">
          <div :class="$style.notificationText">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import get from 'lodash/get'

  export default {
    props: [
      'type'
    ],
    computed: {
      wrapperClassList () {
        let classList = [this.$style.notification]
        if (!this.type || this.type !== 'default') {
          classList.push(get(this, '$style.' + this.type))
        }
        return classList
      }
    }
  }
</script>

<style lang="sass" module>
.Notification
  // z-index: 100
  position: relative
  border-style: solid
  // border-width: 1px 0 1px 0
  border-width: 1px
  border-radius: 0
  flex: 1 100%
  margin-bottom: 30px
  +clearfix
  +tablet
    margin-bottom: 50px
  &__container
    // +container
    position: relative
  &__row
    margin-left: -15px
    margin-right: -15px
  &__column
    padding: 15px 30px
    text-align: center
  &__text
    font-size: 14px
    color: inherit
    fill: inherit
  &.error
    border-color: rgba($red, 0.2)
    color: $red
    fill: $red
    background-color: rgba($red, 0.12)
    z-index: 10
    +desktop
      max-width: 450px
      border-radius: 2px
      left: 50%
      transform: translateX(-50%)
      margin-left: -185px
  &.warning
    border-color: rgba($yellow, 0.2)
    color: $red
    fill: $yellow
    background-color: rgba($yellow, 0.12)
  &.success
    border-color: rgba($green, 0.2)
    color: $green
    fill: $green
    background-color: rgba($green, 0.2)
  &.info
    border-color: lighten($cyan, 10%)
    color: darken($cyan, 25%)
    fill: darken($cyan, 25%)
    background-color: lighten($cyan, 25%)
</style>

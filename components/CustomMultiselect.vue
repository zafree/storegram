<template>
  <!-- <div :class="['customMultiselect', {'customMultiselect--isactive': showOptionsList}, 'customMultiselect--above', 'customMultiselect--disabled']" v-on-click-outside="deactivate"> -->
  <div :class="$style.fieldControl" v-on-click-outside="deactivate">

    <input
      :class="$style.fieldInput"
      :value="searchInput"
      @input="searchInput = $event.target.value"
      @focus.prevent="activate()"
      @keydown.down.prevent="downNavigation()"
      @keydown.up.prevent="upNavigation()"
      @keydown.enter.prevent="selectOptionViaEnterKey()"
      @keyup.esc="deactivate()"
      type="text"
      :placeholder="placeholder"
      ref="inputField"
      >

    <template v-if="showOptionsList && filteredOptions.length">
      <ul :class="$style.list">
        <template >
          <li
            v-for="(option, index) in filteredOptions"
            :key="option.id"
            @click="selectOption()"
            @mouseover="onHover(index)"
            :class="[$style.listItem, {[$style.listItemSelected]: isSelected(option)}]">
            {{ __(option.name) }}
          </li>
        </template>
      </ul>
    </template>
    <template v-if="resultNotFound || (showOptionsList && filteredOptions.length === 0)" >
      <ul :class="$style.list">
        <li :class="$style.listItem">No elements found.</li>
      </ul>
    </template>

    <button
      @click.prevent="toggleList"
      @keydown.down.prevent="downNavigation()"
      @keydown.up.prevent="upNavigation()"
      @keydown.enter.prevent="selectOption()"
      @keyup.esc="deactivate()"
      :class="[$style.btn, $style.btnDropdown, {[$style.btnDropdownOpen]: showOptionsList}]"
    >
    <svg :class="$style.btnIcon" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
      <use xlink:href="/svg/icons.svg?#i-arrow"></use>
    </svg>
    </button>
  </div>
</template>

<script>
  import filter from 'lodash/filter'
  import { mixin as onClickOutside } from 'vue-on-click-outside'

  export default {
    mixins: [onClickOutside],
    props: {
      selected: {
        type: Object,
        default: null
      },
      options: {
        type: Array,
        required: true
      },
      placeholder: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        comingSoon: false,
        searchInput: null,
        showOptionsList: false,
        tempSearchInput: null,
        currentItem: 0
      }
    },
    watch: {
      options: {
        handler: function (newValue, oldValue) {
          if (newValue) {
            this.searchInput = null
          }
        },
        immediate: false
      },
      selected: {
        handler: function (newValue, oldValue) {
          if (newValue) {
            this.searchInput = this.__(newValue.name)
          }
        },
        immediate: true
      }
    },
    computed: {
      selectedValueName () {
        return this.selected ? this.__(this.selected.name) : null
      },
      filteredOptions () {
        if (this.searchInput) {
          return filter(this.options, (option) => {
            return this.__(option.name).toLowerCase().includes(this.searchInput.toLowerCase())
          })
        } else {
          return this.options
        }
      },
      resultNotFound () {
        return this.searchInput && (this.filteredOptions.length === 0)
      }
    },
    methods: {
      focusOnInputField () {
        this.$refs.inputField.focus()
      },
      isSelected (option) {
        if (!this.selected || !option) return
        return option.id === this.selected.id
      },
      activate () {
        this.currentItem = 0
        this.showOptionsList = true
        if (this.filteredOptions.length) {
          this.tempSearchInput = this.searchInput
        }
        this.searchInput = null
      },
      deactivate () {
        if (!this.showOptionsList) return
        this.showOptionsList = false
        if (this.tempSearchInput && this.filteredOptions.length) {
          this.searchInput = this.tempSearchInput
        }
        if (!this.selected) {
          this.searchInput = null
        }
      },
      toggleList () {
        this.showOptionsList = !this.showOptionsList
        if (this.showOptionsList) {
          // this.activate()
          this.focusOnInputField()
        } else {
          this.deactivate()
        }
      },
      selectOption () {
        let currentItem = this.filteredOptions[this.currentItem]
        if (this.selected && (this.selected.id === currentItem.id)) {
          this.deactivate()
          return
        }
        this.tempSearchInput = null
        this.$emit('setSelectedOption', this.filteredOptions[this.currentItem])
        this.showOptionsList = false
      },
      selectOptionViaEnterKey () {
        this.selectOption()
        this.$refs.inputField.blur()
      },
      onHover (currentIndex) {
        this.currentItem = currentIndex
      },
      upNavigation () {
        if (this.filteredOptions.length && this.currentItem === 0) return
        this.currentItem--
      },
      downNavigation () {
        if (this.filteredOptions.length && this.currentItem === (this.filteredOptions.length - 1)) return
        this.currentItem++
      }
    }
  }
</script>

<style lang="sass" module>
  @import "shared/button"
  @import "shared/field"
  .btn-dropdown
    width: 34px
    height: 34px
    position: absolute
    top: 0
    right: 0
    margin-top: 2px
    margin-right: 2px
    border-radius: 2px
    .btn-icon
      transform: rotate(90deg)
  .field__input
    padding-right: 48px

  .list
    padding: 0
    margin: 0
    margin-top: $gutter/2
    list-style: none
    display: flex
    flex-direction: column
    background-color: $light
    padding: $gutter $gutter*1.5
    max-height: 300px
    overflow-y: auto
    border-radius: $gutter/4
    &__item
      padding-top: $gutter/2
      padding-bottom: $gutter/2
      font-size: 14px
      font-weight: $weight-medium
      cursor: pointer
      &:hover
        color: $primary
      &--selected
        color: $primary


</style>

<style lang="sass" scoped>
  @import "shared/button"
  .customMultiselect
    border: 2px solid $red
    width: 100%
    position: relative
    display: flex
    align-items: center
    box-sizing: content-box
    min-height: 40px
    height: 40px
    text-align: left
    color: #35495E
    &--isactive
      min-width: 100%
      z-index: 9
    &__container
      flex: 1
    &__label
      width: 100%
      min-height: 40px
      display: block
      border-top-left-radius: 2px
      border-top-right-radius: 2px
      border: 1px solid #E8E8E8
      background: #fff
      font-size: 14px
      &:focus,
      &:active
        outline: none
      &--active
        outline: none
        border-color: $primary
    &__input
      position: relative
      width: 100%
      border: none
      border-radius: 2px
      padding: 12px
      box-sizing: border-box
      font-size: 14px
      transition: border 0.1s ease
      &::placeholder
        color: #35495E
      &:focus,
      &:active
        outline: none
        &::placeholder
          color: #ADADAD
    &__wrapper
      position: absolute
      display: block
      cussor: pointer
      background: #fff
      width: 100%
      max-height: 300px
      overflow: auto
      border-left: 1px solid #E8E8E8
      border-right: 1px solid #E8E8E8
      border-bottom: 1px solid #E8E8E8
      border-bottom-left-radius: 5px
      border-bottom-right-radius: 5px
      z-index: 99
      -webkit-overflow-scrolling: touch
      &--content
        list-style: none
        display: inline-block
        padding: 0
        margin: 0
        min-width: 100%
        vertical-align: top
      &--disabled
      &--select
    &__list
      font-size: 14px
      padding: 12px
      position: relative
      display: flex
      align-items: center
      overflow: auto
      &:hover
        background-color: rgba($black, .1)
        cursor: pointer
      &--active
        background-color: rgba($black, .1)
        cursor: pointer
      &--selected
          background-color: rgba($black, .05)
          cursor: pointer
          font-weight: 400
          color: #41b468
      &--notfound
        padding: 12px
        // width: 280px
        min-width: 100%
        overflow: auto
    &__option
      text-decoration: none
      text-transform: none
      vertical-align: middle
      cursor: pointer
      white-space: nowrap
      overflow: auto
      flex: 1
      &--notfound
        display: block
        // white-space: nowrap
    &__comingSoon
      color: $red
  .Button
    position: relative
    &__select
      line-height: 16px
      width: 40px
      height: 40px
      position: absolute
      display: flex
      top: 0
      right: 0
      margin: 0
      text-decoration: none
      align-items: center
      justify-content: center
      cursor: pointer
      transition: transform 0.2s ease
      &::before
        position: relative
        right: 0
        top: 0
        color: #999
        margin-top: 4px
        border-style: solid
        border-width: 5px 5px 0 5px
        border-color: #999999 transparent transparent transparent
        content: ""
      &--focus
        top: 2px
        border: none
        outline: none
        transform: rotateZ(180deg)

  *[dir="rtl"] .Button__select
      right: auto
      left: 1px

</style>


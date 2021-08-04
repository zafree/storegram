<template>
  <span :class="$style.Svg" :style="inlineStyles" v-html="svgContent"></span>
</template>

<script>

function parseViewBoxFromHeader (svgHeader) {
  const parsedWidth = /width\s*=\s*"\s*(\d+)(px)?\s*"/.exec(svgHeader)
  const parsedHeight = /height\s*=\s*"\s*(\d+)(px)?\s*"/.exec(svgHeader)
  return {
    top: 0,
    left: 0,
    width: parseInt(parsedWidth[1], 10),
    height: parseInt(parsedHeight[1], 10)
  }
}

export default {
  props: {
    fileName: {
      type: String,
      required: true
    },
    scale: {
      type: Number,
      default: 1
    },
    generateInlineStyle: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    scaledWidth () {
      return Math.round(this.viewBox.width * this.scale)
    },
    scaledHeight () {
      return Math.round(this.viewBox.height * this.scale)
    },
    svgHeader () {
      if (this.generateInlineStyle) {
        return `<svg class="Svg__icon" width="${this.scaledWidth}px" height="${this.scaledHeight}px" viewBox="${this.viewBox.top} ${this.viewBox.left} ${this.viewBox.width} ${this.viewBox.height}">`
      }
      return `<svg class="Svg__icon" viewBox="${this.viewBox.top} ${this.viewBox.left} ${this.viewBox.width} ${this.viewBox.height}">`
    },
    svgContent () {
      return `${this.svgHeader}${this.svgBody}</svg>`
    },
    inlineStyles () {
      let inlineStyles = {}
      if (this.generateInlineStyle) {
        Object.assign(inlineStyles, {
          'line-height': `${this.scaledHeight}px`,
          'height': `${this.scaledHeight}px`
        })
      }
      return inlineStyles
    },
    classNames () {
      return [this.sharedStyles.Svg, this.sharedStyles[`svg${this.viewBox.height}Px`]]
    },
    parsedSvg () {
      const svgContent = require(`~/inline-svgs${this.fileName}`)
      return /^\s*(<\s*svg[^>]+>)([\s\S]*)(<\s*\/\s*svg\s*>)\s*$/igm.exec(svgContent)
    },
    svgBody () {
      return this.parsedSvg[2]
    },
    viewBox () {
      return parseViewBoxFromHeader(this.parsedSvg[1])
    }
  }
}
</script>

<style lang="sass" module>
.Svg
  position: relative
  display: inline-block
  vertical-align: top
</style>

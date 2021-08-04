import map from 'lodash/map'

const reStripHtml = /<[^>]*>/g
const reWhiteSpace = /(\r|\n|\s|\t)+/g

export const metaMixin = {
  head () {
    let headObject = {
      meta: this.metas
    }
    if (this.pageMetas && this.pageMetas.ogTitle) {
      headObject.title = this.pageMetas.ogTitle
    }

    return headObject
  },
  computed: {
    metas () {
      const ogRe = /^og/

      return map(this.pageMetas, (value, key) => {
        if (ogRe.test(key)) {
          key = 'og:' + key.replace(ogRe, '').toLowerCase()
        }
        return {
          hid: key, property: key, content: value
        }
      })
    }
  }
}

export function removeHtmlTags (data) {
  return data ? data.replace(reStripHtml, '').replace(reWhiteSpace, ' ').trim().substr(0, 400) : null
}

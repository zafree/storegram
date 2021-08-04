import { GA_CATEGORIES } from '~/utils/ga-meta.yaml'

export const ga = {
  computed: {
    isGaAvailable () {
      return this.$ga
    },
    gaCategoriesMeta () {
      return GA_CATEGORIES
    }
  },
  methods: {
    gaEvent (param) {
      if (!this.isGaAvailable && !(this.isGaAvailable && param)) return
      this.$ga.event(param)
    },
    gaTrackForProductCardClick (clickedPlace) {
      let eventActionName
      switch (clickedPlace) {
        case this.gaCategoriesMeta.PRODUCT_CARD.ACTIONS.VIEW_DETAILS_VIA_IMAGE:
          eventActionName = this.gaCategoriesMeta.PRODUCT_CARD.ACTIONS.VIEW_DETAILS_VIA_IMAGE
          break
        case this.gaCategoriesMeta.PRODUCT_CARD.ACTIONS.VIEW_DETAILS_VIA_NAME:
          eventActionName = this.gaCategoriesMeta.PRODUCT_CARD.ACTIONS.VIEW_DETAILS_VIA_NAME
          break
        case this.gaCategoriesMeta.PRODUCT_CARD.ACTIONS.VIEW_DETAILS_VIA_BUTTON:
          eventActionName = this.gaCategoriesMeta.PRODUCT_CARD.ACTIONS.VIEW_DETAILS_VIA_BUTTON
          break
        case this.gaCategoriesMeta.PRODUCT_CARD.ACTIONS.VIEW_DETAILS_VIA_OPTIONS_LINK:
          eventActionName = this.gaCategoriesMeta.PRODUCT_CARD.ACTIONS.VIEW_DETAILS_VIA_OPTIONS_LINK
          break
        case this.gaCategoriesMeta.PRODUCT_CARD.ACTIONS.VIEW_DETAILS_VIA_CONTAINER_DIV:
          eventActionName = this.gaCategoriesMeta.PRODUCT_CARD.ACTIONS.VIEW_DETAILS_VIA_CONTAINER_DIV
          break
        case this.gaCategoriesMeta.PRODUCT_CARD.ACTIONS.IMAGE_ZOOM:
          eventActionName = this.gaCategoriesMeta.PRODUCT_CARD.ACTIONS.IMAGE_ZOOM
          break
      }
      this.gaEvent({
        eventCategory: this.gaCategoriesMeta.PRODUCT_CARD.NAME,
        eventAction: eventActionName,
        eventLabel: this.name
      })
    },
    gaTrackForPlacedOrderClick () {
      this.gaEvent({
        eventCategory: this.gaCategoriesMeta.CART.NAME,
        eventAction: this.gaCategoriesMeta.CART.ACTIONS.PLACE_ORDER,
        eventValue: 1
      })
    }
  }
}

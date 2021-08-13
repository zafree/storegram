<template>
  <modal :on-click-outside="closeRequestModal">
    <template slot="title">Product request</template>
    <p :class="$style.hint">{{ $t('product_request_modal.request_hint') }}</p>
    <!-- <div :class="$style.item">
      <div :class="$style.itemImage">
        <div :class="$style.img">
          <div :class="$style.imgAspectRatio">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
              <use xlink:href="/svg/icons.svg?#i-camera"></use>
            </svg>
          </div>
          <div :class="$style.imgImage">
            <computed-image :meta="productImageInfo" :alt="__(cartItemInfo.name)"/>
          </div>
        </div>
      </div>
      <div :class="$style.itemInfo">
        <h3 :class="$style.itemInfoTitle">{{__(cartItemInfo.name)}}</h3>
      </div>
    </div> -->

    <div class="item">
      <div class="item__image">
        <computed-image :class="$style.cartImage" :meta="productImage" :alt="productName"/>
      </div>
      <div class="item__content">
        <h3 class="item__title">{{ productName }}</h3>
      </div>
    </div>
    <login :success-callback="getCallback" :requested-product="product"></login>
  </modal>
</template>

<script>
  import { mapState } from 'vuex'
  import ComputedImage from '~/components/ComputedImage'
  import Modal from '~/components/Modal'
  import Login from '~/components/Login'
  import { overlayMixin } from '~/utils'

  export default {
    mixins: [overlayMixin],
    computed: {
      ...mapState([
        'ui'
      ]),
      product () {
        if (this.ui.overlayContext && this.ui.overlayContext.product) {
          return this.ui.overlayContext.product
        }
      },
      productImage () {
        if (this.product && this.product.image) {
          return this.product.image
        }
      },
      productName () {
        if (this.product && this.product.name) {
          return this.__(this.product.name)
        }
      },
      getCallback () {
        if (this.ui.overlayContext && this.ui.overlayContext.callback) {
          return this.ui.overlayContext.callback
        }
      }
    },
    components: {
      Modal,
      Login,
      ComputedImage
    }
  }
</script>

<style lang="sass" module>
  @import "shared/button"
  @import "shared/img"
  @import "shared/cart-item"


  // .hint
  //   font-size: 14px
  //   line-height: 1.33
  //   color: $primary
  //   font-weight: 400
  //   padding-right: 30px
  //   margin-top: 10px
</style>

<style lang="sass" scoped>
  // .item
  //   margin-top: 20px
  //   margin-bottom: 40px
  //   position: relative
  //   display: flex
  //   flex-flow: row wrap
  //   &__image
  //     width: 100px
  //     height: 100px
  //     min-width: 100px
  //     min-height: 100px
  //     background-color: #EBEBEB
  //   &__content
  //     flex: 1
  //     position: relative
  //     width: 100%
  //     padding-left: 20px
  //   &__title
  //     font-size: 18px
  //     font-weight: $weight-bold
  //     line-height: 1.33
  //     max-width: 200px
  //   &__price
  //     font-size: 16px
  //     margin-top: 5px
</style>


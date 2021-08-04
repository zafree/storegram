// import { mapGetters } from 'vuex'

export const cashbackInterval = {
  data () {
    return {
      cashBackAnimationInterval: null,
      currentCashbackIndex: 0
    }
  },
  mounted () {
    this.cashBackAnimationInterval = setInterval(() => {
      this.currentCashbackIndex++
      if (this.currentCashbackIndex === 10) {
        this.currentCashbackIndex = 0
      }
    }, 5000)
  },
  beforeDestroy () {
    clearInterval(this.cashBackAnimationInterval)
  }
}

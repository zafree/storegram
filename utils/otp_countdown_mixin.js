import { OTP_REQUEST_COUNT_DOWN } from '~/store/constants.yaml'

export const otpCountdown = {
  beforeDestroy () {
    this.clearTimer()
  },
  data () {
    return {
      waitingForOtpLinkTobeActive: false,
      countDown: null,
      timer: null,
      showAnotherOTPRequest: true
    }
  },
  methods: {
    startTimer () {
      this.clearTimer()

      let counter = parseInt(OTP_REQUEST_COUNT_DOWN)
      this.waitingForOtpLinkTobeActive = true

      this.timer = setInterval(() => {
        counter--
        this.countDown = `${counter > 9 ? counter : '0' + counter}`

        if (counter === 0) {
          this.clearTimer()
        }
      }, 1000)
    },
    clearTimer () {
      clearInterval(this.timer)
      this.timer = null
      this.waitingForOtpLinkTobeActive = false
    }
  }
}

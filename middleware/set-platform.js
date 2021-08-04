import cookie from 'cookie'
import invert from 'lodash/invert'
import has from 'lodash/has'
import isUndefined from 'lodash/isUndefined'
import { Platform } from '~/utils/enums.yaml'
import { SET_PLATFORM, PLATFORM_COOKIE_NAME } from '~/store/constants.yaml'

const invertedPlatform = invert(Platform)

export default function ({ store, route, res }) {
  if (!process.server || !has(route, 'query.platform')) return

  let targetPlatform = parseInt(route.query.platform)

  if (isUndefined(invertedPlatform[targetPlatform])) {
    targetPlatform = Platform.BROWSER
  }

  let oneYearInSeconds = 365 * 24 * 60 * 60 * 1000
  let oneYearAfterToday = new Date(oneYearInSeconds * 1000 + Date.now())
  let platformCookieString = null

  switch (targetPlatform) {
    case Platform.BROWSER:
      platformCookieString = cookie.serialize(PLATFORM_COOKIE_NAME, targetPlatform, {
        expires: new Date(),
        maxAge: 0,
        path: '/'
      })
      break
    default:
      platformCookieString = cookie.serialize(PLATFORM_COOKIE_NAME, targetPlatform, {
        expires: oneYearAfterToday,
        maxAge: oneYearInSeconds,
        path: '/'
      })
  }

  res.setHeader('Set-Cookie', platformCookieString)
  store.commit(SET_PLATFORM, targetPlatform)
}

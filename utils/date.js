import logger from '~/utils/logger'

const formats = {
  DATE: 0,
  TIME: 1,
  BOTH: 2
}

function format (value, locale, dateOrTime = formats.BOTH) {
  if (!value) {
    return ''
  }

  try {
    let dt = new Date(value)
    let method = 'toLocaleString'
    switch (dateOrTime) {
      case formats.DATE:
        method = 'toLocaleDateString'
        break
      case formats.TIME:
        method = 'toLocaleTimeString'
        break
    }
    return dt[method](locale === 'bn' ? locale : 'en-IN')
  } catch (e) {
    logger.error('failed to format date', e)
  }
  return value
}

export function formatDate (value, locale) {
  return format(value, locale, formats.DATE)
}

export function formatTime (value, locale) {
  return format(value, locale, formats.TIME)
}

export function formatDateTime (value, locale) {
  return format(value, locale)
}

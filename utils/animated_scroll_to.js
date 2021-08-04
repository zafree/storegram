export default function animatedScrollTo (target, offsetTop = 0, scrollInterval) {
  if (!window || !document || !document['querySelector']) {
    return
  }

  const targetElement = (typeof target === 'string') ? document.querySelector(target) : target
  let yPos = Math.max(0, (targetElement ? targetElement.offsetTop : 0) - offsetTop)

  if (window.pageYOffset === yPos) {
    return
  }

  let toTop = window.pageYOffset > yPos
  const scrollByY = toTop ? -10 : 10

  const timerID = setInterval(function () {
    window.scrollBy(0, scrollByY)
    yPos = Math.max(0, (targetElement ? targetElement.offsetTop : 0) - offsetTop)
    if (toTop ? window.pageYOffset <= yPos : window.pageYOffset >= yPos) {
      clearInterval(timerID)
    }
  }, scrollInterval)
}

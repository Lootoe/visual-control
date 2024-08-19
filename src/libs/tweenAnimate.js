import { Tween } from '@tweenjs/tween.js'

export const tweenAnimate = (startParams, endParams, duration, callBack) => {
  const tween = new Tween(startParams)
  tween.to(endParams, duration)
  tween.onUpdate(callBack)
  tween.start()
  const renderLoop = () => {
    if (tween.isPlaying()) {
      requestAnimationFrame(renderLoop)
      tween.update()
    }
  }
  renderLoop()
}

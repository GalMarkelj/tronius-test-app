import type { MainSceneType } from '../../../types/main-scene'

export function stopSpin(scene: MainSceneType) {
  const stopDuration = 800 // time per reel to stop (decelerate + snap)
  const reelDelay = 1000 // delay between reel stops
  const totalDelay = (scene.reels.length - 1) * reelDelay + stopDuration

  scene.reels.forEach((reel, index) => {
    scene.time.delayedCall(index * 1000, () => {
      reel.stop()

      // When the LAST reel begins stopping, start fading out the sound
      if (index === scene.reels.length - 1 && scene.spinSound) {
        scene.tweens.add({
          targets: scene.spinSound,
          volume: 0,
          rate: 0.8,
          duration: stopDuration,
          ease: 'Cubic.easeOut',
          onComplete: () => {
            scene.sound.stopByKey('spinning')
          },
        })
      }
    })
  })

  scene.time.delayedCall(totalDelay, () => scene.onSpinStop())
}

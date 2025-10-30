import type { MainSceneType } from '../../../types/main-scene'

export function startSpin(scene: MainSceneType) {
  // Disable button visually and logically
  scene.spinButton.disableInteractive()
  scene.spinButton.setAlpha(0.5) // greyed-out look

  const spinSound = scene.sound.add('spinning', { loop: true, volume: 0.3, rate: 2 })
  spinSound.play()
  scene.spinSound = spinSound

  scene.reels.forEach((reel) => reel.spin())

  // auto-stop after 2.5 seconds
  scene.time.delayedCall(scene.spinAutoStopDelay, () => scene.stopSpin())
}

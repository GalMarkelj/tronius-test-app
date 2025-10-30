import type { MainSceneType } from '../../../types/main-scene'

export function onSpinStop(scene: MainSceneType) {
  // image width = 350 height = 470
  const witch = scene.add
    .image(scene.scale.width / 2, scene.scale.height / 2, 'witch')
    .setScale(0.5)
    .setAlpha(0)

  scene.tweens.add({
    targets: witch,
    alpha: 1,
    scale: 1.5,
    duration: 300,
    ease: 'Back.easeOut',
    yoyo: false,
    onComplete: () => {
      // After 1 second, fade out and destroy
      scene.tweens.add({
        targets: witch,
        alpha: 0,
        duration: 700,
        delay: 1000,
        onComplete: () => {
          witch.destroy()
        },
      })
    },
  })
  scene.sound.play(`witchLaugh${Phaser.Math.Between(1, 9)}`, { volume: 0.3 })
  scene.sound.stopByKey('spinning')

  // Re-enable button
  scene.spinButton.setInteractive()
  scene.spinButton.clearAlpha()

  const duration = Phaser.Math.Between(1000, 2000)
  scene.increaseScore(duration)
  scene.spawnCoins(30, duration)
}

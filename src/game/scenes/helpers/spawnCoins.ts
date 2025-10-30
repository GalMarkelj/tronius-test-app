import { MainSceneType } from '../../../types/main-scene'

export function spawnCoins(scene: MainSceneType, count: number, fallDuration: number) {
  const coinsFalling = scene.sound.add('coinsFalling', { volume: 0.5 })
  coinsFalling.play()

  const longestDuration = 2000 // keep track of the longest coin tween
  const spawnDelayStep = 50

  for (let i = 0; i < count; i++) {
    const spawnDelay = i * spawnDelayStep

    scene.time.delayedCall(spawnDelay, () => {
      const coin = scene.add.image(
        Phaser.Math.Between(150, 250), // random X around center
        -10, // start near the win image
        'coin',
      )

      coin.setScale(Phaser.Math.FloatBetween(0.008, 0.01))
      coin.setAlpha(0.9)
      coin.setRotation(Phaser.Math.FloatBetween(0, Math.PI * 2))

      const duration = fallDuration
      const targetY = 180

      // Animate fall + spin
      scene.tweens.add({
        targets: coin,
        y: targetY,
        angle: Phaser.Math.Between(180, 720), // spin as it falls
        x: coin.x + Phaser.Math.Between(-50, 50), // slight side movement
        alpha: 0,
        duration,
        ease: 'Cubic.easeIn',
        onComplete: () => coin.destroy(),
      })
    })
  }
  // Fade out sound smoothly once all coins are almost done
  scene.time.delayedCall(longestDuration - 500, () => {
    scene.tweens.add({
      targets: coinsFalling,
      volume: 0,
      duration: 700, // fade duration
      ease: 'Sine.easeOut',
      onComplete: () => coinsFalling.stop(),
    })
  })
}

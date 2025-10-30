import type { MainSceneType } from '../../../types/main-scene'

export function increaseScore(scene: MainSceneType, duration: number) {
  const oldScore = scene.score
  const added = Phaser.Math.Between(50, 200)
  const newScore = oldScore + added

  // Tween the value smoothly
  const scoreObj = { value: oldScore }

  scene.tweens.add({
    targets: scoreObj,
    value: newScore,
    duration,
    ease: 'Cubic.easeOut',
    onUpdate: () => {
      // Update the text with the animated number (integer)
      scene.scoreText.setText(Math.floor(scoreObj.value).toString())
    },
    onComplete: () => {
      scene.score = newScore
    },
  })
}

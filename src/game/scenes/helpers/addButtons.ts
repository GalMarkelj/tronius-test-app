import type { Layout, MainSceneType } from '../../../types/main-scene'

export function addButtons(scene: MainSceneType, layout: Layout) {
  scene.spinButton = scene.add
    .image(
      layout.scene.width / 2,
      layout.scene.height - layout.reelWrapper.x / 2,
      'spinBtn',
    )
    .setInteractive()
    .setScale(0.6)

  scene.spinButton.on('pointerdown', () => {
    scene.sound.play('buttonClick', { volume: 0.5 })
    scene.startSpin()
  })
}

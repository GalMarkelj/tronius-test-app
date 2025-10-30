import type { Layout, MainSceneType } from '../../../types/main-scene'

export function addScore(scene: MainSceneType, layout: Layout) {
  // Score coordinates
  const sc = {
    imageX: layout.scene.width / 2 - layout.reelWrapper.width / 2 + 40, // (game width / 2) - (container width / 2) + container border radius
    imageY: layout.reelWrapper.height / 2 - 100, // (game width / 2) - (container width / 2) - gap
  }
  scene.add.image(sc.imageX, sc.imageY - 20, 'gold').setScale(0.2)
  scene.scoreText = scene.add.text(sc.imageX + 50, sc.imageY - 35, `${scene.score}`, {
    fontSize: '50px',
    color: '#ffd700',
    fontFamily: 'Henny Penny',
  })
}

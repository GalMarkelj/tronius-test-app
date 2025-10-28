import Phaser from 'phaser'

export default class Reel extends Phaser.GameObjects.Container {
  private symbols: Phaser.GameObjects.Image[] = []
  private symbolKeys: string[]
  private spinning: boolean = false

  constructor(scene: Phaser.Scene, x: number, y: number, symbolKeys: string[]) {
    super(scene, x, y)
    this.symbolKeys = symbolKeys
    this.createInitialSymbols()
    scene.add.existing(this)
  }

  private createInitialSymbols() {
    const symbolSize = 120

    for (let i = 0; i < 3; i++) {
      const key = Phaser.Utils.Array.GetRandom(this.symbolKeys)
      const symbol = this.scene.add.image(0, i * symbolSize, key).setOrigin(0.5)
      this.add(symbol)
      this.symbols.push(symbol)
    }
  }

  public spin() {
    if (this.spinning) return
    this.spinning = true

    // tween to simulate rotation
    this.scene.tweens.add({
      targets: this,
      y: this.y + 300,
      duration: 200,
      repeat: -1,
      ease: 'Linear',
    })
  }

  public stop() {
    if (!this.spinning) return
    this.spinning = false

    // stop all tweens for this reel
    this.scene.tweens.killTweensOf(this)

    // randomize new symbols
    this.symbols.forEach((symbol, i) => {
      const newKey = Phaser.Utils.Array.GetRandom(this.symbolKeys)
      symbol.setTexture(newKey)
    })

    // reset position (so it doesn't drift)
    this.y = Math.round(this.y / 100) * 100
  }
}

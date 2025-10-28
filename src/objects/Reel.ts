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
    for (let i = 0; i < 3; i++) {
      const key = Phaser.Utils.Array.GetRandom(this.symbolKeys)
      const symbol = this.scene.add.image(0, i * 153.6, key).setOrigin(-0.1)
      this.add(symbol)
      this.symbols.push(symbol)

      // const symbolColors = [0x0000f2, 0xffffff, 0x00ff00, 0xff0000, 0x0000ff]
      // const color = Phaser.Utils.Array.GetRandom(symbolColors)
      // const symbol2 = this.scene.add.graphics()
      // symbol2.fillStyle(color, 0.3)
      // symbol2.fillRect(0, i * 153.6, 238.93, 153.6)
      // // Optional: add a small border to see the edges clearly
      // symbol2.lineStyle(4, 0x000000, 1)
      // symbol2.strokeRect(0, i * 153.6, 238.93, 153.6)
      //
      // this.add(symbol2)
      // this.symbols.push(symbol2)
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

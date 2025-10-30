import Phaser from 'phaser'

import type { MainSceneType } from '../types/main-scene'

export default class Reel extends Phaser.GameObjects.Container {
  private symbols: Phaser.GameObjects.Image[] = []
  private symbolKeys: string[]
  private spinning: boolean = false
  private symbolHeight: number = 153.6
  private spinSpeed: number = 200
  private decelerating: boolean = false

  constructor(scene: MainSceneType, x: number, y: number, symbolKeys: string[]) {
    super(scene, x, y)
    this.symbolKeys = symbolKeys
    this.createInitialSymbols()
    scene.add.existing(this)
  }

  private createInitialSymbols() {
    // Create 5 symbols: 3 visible + 2 extra for smooth wrapping
    for (let i = 0; i < 5; i++) {
      const key = Phaser.Utils.Array.GetRandom(this.symbolKeys)
      const symbol = this.scene.add.image(0, i * this.symbolHeight, key).setOrigin(-0.1)
      this.add(symbol)
      this.symbols.push(symbol)
    }
  }

  public spin() {
    // Always ensure clean state before starting
    this.scene.events.off('update', this.updateReel, this)

    this.spinning = true
    this.decelerating = false
    this.spinSpeed = 200

    // Use scene update to move symbols smoothly
    this.scene.events.on('update', this.updateReel, this)
  }

  public stop() {
    if (!this.spinning || this.decelerating) return

    this.decelerating = true

    // Step 1: Smooth deceleration
    this.scene.tweens.add({
      targets: this,
      dummy: 0, // fake property just for timing
      duration: 500,
      onUpdate: (tween) => {
        this.spinSpeed = 200 * (1 - tween.progress)
      },
      onComplete: () => {
        this.spinning = false
        this.decelerating = false
        this.spinSpeed = 0

        // Stop listening to update event!
        this.scene.events.off('update', this.updateReel, this)

        // Step 2: SNAP symbols smoothly
        this.symbols.forEach((symbol) => {
          const targetY = Math.round(symbol.y / this.symbolHeight) * this.symbolHeight
          this.scene.tweens.add({
            targets: symbol,
            y: targetY,
            duration: 300,
            ease: 'Cubic.easeOut',
          })
        })
      },
    })
  }

  private updateReel() {
    for (const symbol of this.symbols) {
      symbol.y += this.spinSpeed

      // Wrap symbol naturally
      if (symbol.y >= 3 * this.symbolHeight) {
        symbol.y -= this.symbols.length * this.symbolHeight

        // Only assign new texture here — smooth, no sudden flash
        const newKey = Phaser.Utils.Array.GetRandom(this.symbolKeys)
        symbol.setTexture(newKey)
      }
    }
  }
}

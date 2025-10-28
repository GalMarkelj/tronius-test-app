import Phaser from 'phaser'
import Reel from '../../objects/Reel'

export default class MainScene extends Phaser.Scene {
  private reels: Reel[] = []
  private spinButton!: Phaser.GameObjects.Image
  private stopButton!: Phaser.GameObjects.Image
  private scoreText!: Phaser.GameObjects.Text
  private score: number = 0

  constructor() {
    super('MainScene')
  }

  preload() {
    // Load your assets
    this.load.image('bg', 'assets/bg.jpg')
    this.load.image('pumpkin', 'assets/pumpkin-2.png')
    this.load.image('ghost', 'assets/pumpkin-2.png')
    this.load.image('bat', 'assets/pumpkin-2.png')
    this.load.image('candy', 'assets/pumpkin-2.png')
    this.load.image('skull', 'assets/pumpkin-2.png')
    this.load.image('spinBtn', 'assets/pumpkin-2.png')
    this.load.image('stopBtn', 'assets/pumpkin-2.png')
  }

  create() {
    const { width, height } = this.scale

    // Background
    this.add.image(width / 2, height / 2, 'bg').setDisplaySize(width, height)

    // Symbols available
    const symbolKeys = ['pumpkin', 'ghost', 'bat', 'candy', 'skull']

    const rww = width * 0.7 // reel wrapper width
    const rwh = height * 0.6 // reel wrapper height

    const rwx = (width - rww) / 2 // reel wrapper X
    const rwy = (height - rwh) / 2 // reel wrapper Y

    const wrapperBg = this.add.graphics()
    wrapperBg.fillStyle(0x000000, 0.6)
    wrapperBg.fillRoundedRect(0, 0, rww, rwh, 20)
    wrapperBg.lineStyle(4, 0xffa500)
    wrapperBg.strokeRoundedRect(0, 0, rww, rwh, 20)

    // Then add it as the first element in your container
    const wrapper = this.add.container(rwx, rwy)
    wrapper.add(wrapperBg)

    // Create 3 reels
    const startX = width / 2 - 250
    for (let i = 0; i < 3; i++) {
      const reel = new Reel(this, startX + i * 150, height / 2 - 150, symbolKeys)
      this.reels.push(reel)

      const columnWidth = rww / 3
      const columnBg = this.add.graphics()
      columnBg.fillStyle(0x000000, 1)
      // reelBg.fillRoundedRect(startX + i * reelWidth, 0, reelWidth, ch)
      columnBg.fillRoundedRect(i * columnWidth, 0, columnWidth, rwh)
      columnBg.lineStyle(4, 0xffa500)
      // bg.strokeRoundedRect(0, i * symbolSize, cw, ch, 20)

      // Then add it as the first element in your container
      const columnWrap = this.add.container(rwx, rwy)
      columnWrap.add(columnBg)
    }

    // Score display
    // score coordinates
    const sc = {
      imageX: width / 2 - rww / 2 + 20, // (game width / 2) - (container width / 2) + container border radius
      imageY: height / 2 - rwh / 2, // (game width / 2) - (container width / 2) - gap
    }
    this.add.image(sc.imageX, sc.imageY - 20, 'pumpkin').setScale(0.2)
    this.scoreText = this.add.text(sc.imageX + 20, sc.imageY - 35, `${this.score}`, {
      fontSize: '28px',
      color: '#ffb84d',
      fontFamily: 'Arial',
    })

    // Buttons
    this.spinButton = this.add
      .image(width / 2 - 80, height - 80, 'spinBtn')
      .setInteractive()
      .setScale(0.5)
    this.stopButton = this.add
      .image(width / 2 + 80, height - 80, 'stopBtn')
      .setInteractive()
      .setScale(0.5)

    this.spinButton.on('pointerdown', () => this.startSpin())
    this.stopButton.on('pointerdown', () => this.stopSpin())
  }

  private startSpin() {
    this.reels.forEach((reel) => reel.spin())

    // auto-stop after 2.5 seconds
    this.time.delayedCall(2500, () => this.stopSpin())
  }

  private stopSpin() {
    this.reels.forEach((reel) => reel.stop())
    this.increaseScore()
  }

  private increaseScore() {
    this.score += Phaser.Math.Between(10, 100)
    this.scoreText.setText(`${this.score}`)
  }
}

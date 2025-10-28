import Phaser from 'phaser'
import Reel from '../../objects/Reel'

export default class MainScene extends Phaser.Scene {
  private reels: Reel[] = []
  private spinButton!: Phaser.GameObjects.Image
  private stopButton!: Phaser.GameObjects.Image
  private scoreText!: Phaser.GameObjects.Text
  private score: number = 0

  // settings
  private numOfColumns = 3

  constructor() {
    super('MainScene')
  }

  preload() {
    // Load your assets
    this.load.image('bg', 'assets/bg.jpg')
    this.load.image('pumpkin', 'assets/pumpkin.png')
    this.load.image('ghost', 'assets/ghost.png')
    this.load.image('bat', 'assets/bat.png')
    this.load.image('candy', 'assets/candy.png')
    this.load.image('skull', 'assets/skull.png')
    this.load.image('spinBtn', 'assets/pumpkin-2.png')
    this.load.image('stopBtn', 'assets/pumpkin-2.png')
  }

  create() {
    const { width, height } = this.scale

    // Background
    this.add.image(width / 2, height / 2, 'bg').setDisplaySize(width, height)

    // Symbols available
    const symbolKeys = ['pumpkin', 'ghost', 'bat', 'candy', 'skull']
    // const symbolColors = [0x0000f2, 0xffffff, 0x00ff00, 0xff0000, 0x0000ff]

    const rww = width * 0.7 // reel wrapper width
    const rwh = height * 0.6 // reel wrapper height

    const rwx = (width - rww) / 2 // reel wrapper X
    const rwy = (height - rwh) / 2 // reel wrapper Y

    const wrapperBg = this.add.graphics()
    wrapperBg.fillRoundedRect(0, 0, rww, rwh, 20)
    wrapperBg.lineStyle(4, 0xffa500)
    wrapperBg.strokeRoundedRect(0, 0, rww, rwh, 20)

    // Then add it as the first element in your container
    const wrapper = this.add.container(rwx, rwy)
    wrapper.add(wrapperBg)

    /* -- Start of separation lines -- */
    const lineColor = 0xffa500
    const lineWidth = 3
    const columnWidth = rww / 3

    const separatorLines = this.add.graphics()
    separatorLines.lineStyle(lineWidth, lineColor, 1)

    // Draw lines at 1/3 and 2/3 positions
    separatorLines.beginPath()
    separatorLines.moveTo(columnWidth, 0)
    separatorLines.lineTo(columnWidth, rwh)
    separatorLines.moveTo(2 * columnWidth, 0)
    separatorLines.lineTo(2 * columnWidth, rwh)
    separatorLines.strokePath()
    /* -- End of separation lines -- */

    // Add them to the same wrapper
    wrapper.add(separatorLines)

    // Create 3 reels
    for (let i = 0; i < this.numOfColumns; i++) {
      const columnBg = this.add.graphics()
      const columnBdRadius = (() => {
        const corners = {
          tl: 0,
          tr: 0,
          bl: 0,
          br: 0,
        }
        if (i === 0) {
          corners.tl = 20
          corners.bl = 20
        }
        if (i === this.numOfColumns - 1) {
          corners.tr = 20
          corners.br = 20
        }
        return corners
      })()
      columnBg.fillStyle(0xffffff, 0.8)
      columnBg.fillRoundedRect(i * columnWidth, 0, columnWidth, rwh, columnBdRadius)
      columnBg.lineStyle(4, 0xffa500)

      const columnWrap = this.add.container(rwx, rwy)
      columnWrap.add(columnBg)

      const reel = new Reel(this, rwx + i * columnWidth, rwy, symbolKeys)
      this.reels.push(reel)
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

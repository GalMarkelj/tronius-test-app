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
    // Load images
    this.load.setPath('assets/images')
    this.load.image('bg', 'bg.jpg')
    this.load.image('pumpkin', 'pumpkin.png')
    this.load.image('ghost', 'ghost.png')
    this.load.image('bat', 'bat.png')
    this.load.image('candy', 'candy.png')
    this.load.image('skull', 'skull.png')
    this.load.image('spinBtn', 'spin-button.png')
    this.load.image('stopBtn', 'stop-button.png')

    // Load music
    this.load.setPath('assets/music')
    this.load.audio('bgMusic', 'bg-music.wav')

    // Load witch laughs
    this.load.setPath('assets/sound-effects/witch-laughs')
    this.load.audio('witchLaugh1', 'witch-laugh-1.wav')
    this.load.audio('witchLaugh2', 'witch-laugh-2.wav')
    this.load.audio('witchLaugh3', 'witch-laugh-3.wav')
    this.load.audio('witchLaugh4', 'witch-laugh-4.wav')
    this.load.audio('witchLaugh5', 'witch-laugh-5.wav')
    this.load.audio('witchLaugh6', 'witch-laugh-6.wav')
    this.load.audio('witchLaugh7', 'witch-laugh-7.wav')
    this.load.audio('witchLaugh8', 'witch-laugh-8.wav')
    this.load.audio('witchLaugh9', 'witch-laugh-9.wav')
  }

  create() {
    const { width, height } = this.scale

    // set background music
    const music = this.sound.add('bgMusic', {
      loop: true,
      volume: 0.1, // between 0 and 1
    })
    music.play()

    // Background
    this.add.image(width / 2, height / 2, 'bg').setDisplaySize(width, height)

    // Symbols available
    const symbolKeys = ['pumpkin', 'ghost', 'bat', 'candy', 'skull']
    // const symbolColors = [0x0000f2, 0xffffff, 0x00ff00, 0xff0000, 0x0000ff]

    const rww = width * 0.7 // reel wrapper width
    const rwh = height * 0.6 // reel wrapper height

    const rwx = (width - rww) / 2 // reel wrapper X
    const rwy = (height - rwh) / 2 // reel wrapper Y

    const maskShape = this.add.graphics()
    maskShape.fillRect(rwx, rwy, rww, rwh) // match the wrapper size and position

    // Create the geometry mask
    const reelMask = maskShape.createGeometryMask()

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

      const reel = new Reel(this, rwx + i * columnWidth, rwy, symbolKeys, this.onSpinEnd)
      reel.setMask(reelMask)
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
    this.reels.forEach((reel, index) => {
      this.time.delayedCall(index * 1000, () => {
        reel.stop()
      })
    })
    const stopDuration = 2300 // time per reel to stop (decelerate + snap)
    const reelDelay = 1000 // delay between reel stops
    const totalDelay = (this.reels.length - 1) * reelDelay + stopDuration
    // Optional: update score after all reels have stopped
    this.time.delayedCall(totalDelay, () => this.onSpinStop())
  }

  private increaseScore() {
    this.score += Phaser.Math.Between(10, 100)
    this.scoreText.setText(`${this.score}`)
  }

  private onSpinStop() {
    // Play sound
    this.sound.play(`witchLaugh${Phaser.Math.Between(1, 9)}`, { volume: 0.3 })
    this.increaseScore()
  }
}

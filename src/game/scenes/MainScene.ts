import Phaser from 'phaser'
import Reel from '../../objects/Reel'

export default class MainScene extends Phaser.Scene {
  private reels: Reel[] = []
  private spinButton!: Phaser.GameObjects.Image
  private stopButton!: Phaser.GameObjects.Image
  private scoreText!: Phaser.GameObjects.Text
  private score: number = 0
  private spinSound?: Phaser.Sound.BaseSound

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
    this.load.image('witch', 'witch.png')
    this.load.image('gold', 'gold.png')
    this.load.image('coin', 'coin.png')

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

    // Load other sound effects
    this.load.setPath('assets/sound-effects')
    this.load.audio('spinning', 'spinning.wav')
    this.load.audio('buttonClick', 'button-click.wav')
    this.load.audio('coinsFalling', 'coins-falling.wav')
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

      const reel = new Reel(this, rwx + i * columnWidth, rwy, symbolKeys)
      reel.setMask(reelMask)
      this.reels.push(reel)
    }

    // Score display
    // score coordinates
    const sc = {
      imageX: width / 2 - rww / 2 + 40, // (game width / 2) - (container width / 2) + container border radius
      imageY: rwh / 2 - 100, // (game width / 2) - (container width / 2) - gap
    }
    this.add.image(sc.imageX, sc.imageY - 20, 'gold').setScale(0.2)
    this.scoreText = this.add.text(sc.imageX + 50, sc.imageY - 35, `${this.score}`, {
      fontSize: '50px',
      color: '#ffd700',
      fontFamily: 'Henny Penny',
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

    this.spinButton.on('pointerdown', () => this.onButtonClick(() => this.startSpin()))
    this.stopButton.on('pointerdown', () => this.onButtonClick(() => this.stopSpin()))
  }

  private startSpin() {
    const spinSound = this.sound.add('spinning', { loop: true, volume: 0.3, rate: 2 })
    spinSound.play()
    this.spinSound = spinSound

    this.reels.forEach((reel) => reel.spin())

    // auto-stop after 2.5 seconds
    // this.time.delayedCall(2500, () => this.stopSpin())
  }

  private stopSpin() {
    const stopDuration = 2300 // time per reel to stop (decelerate + snap)
    const reelDelay = 1000 // delay between reel stops
    const totalDelay = (this.reels.length - 1) * reelDelay + stopDuration

    this.reels.forEach((reel, index) => {
      this.time.delayedCall(index * 1000, () => {
        reel.stop()

        // When the LAST reel begins stopping, start fading out the sound
        if (index === this.reels.length - 1 && this.spinSound) {
          this.tweens.add({
            targets: this.spinSound,
            volume: 0,
            rate: 0.8,
            duration: stopDuration,
            ease: 'Cubic.easeOut',
            onComplete: () => {
              this.sound.stopByKey('spinning')
            },
          })
        }
      })
    })

    this.time.delayedCall(totalDelay, () => this.onSpinStop())
  }

  private increaseScore(duration: number) {
    const oldScore = this.score
    const added = Phaser.Math.Between(50, 200)
    const newScore = oldScore + added

    // Tween the value smoothly
    const scoreObj = { value: oldScore }

    this.tweens.add({
      targets: scoreObj,
      value: newScore,
      duration,
      ease: 'Cubic.easeOut',
      onUpdate: () => {
        // Update the text with the animated number (integer)
        this.scoreText.setText(Math.floor(scoreObj.value).toString())
      },
      onComplete: () => {
        this.score = newScore
      },
    })
  }

  private onSpinStop() {
    // image width = 350 height = 470
    const witch = this.add
      .image(this.scale.width / 2, this.scale.height / 2, 'witch')
      .setScale(0.5)
      .setAlpha(0)

    this.tweens.add({
      targets: witch,
      alpha: 1,
      scale: 1.5,
      duration: 300,
      ease: 'Back.easeOut',
      yoyo: false,
      onComplete: () => {
        // After 1 second, fade out and destroy
        this.tweens.add({
          targets: witch,
          alpha: 0,
          duration: 700,
          delay: 1000,
          onComplete: () => {
            witch.destroy()
          },
        })
      },
    })
    this.sound.play(`witchLaugh${Phaser.Math.Between(1, 9)}`, { volume: 0.3 })
    this.sound.stopByKey('spinning')

    const duration = Phaser.Math.Between(1000, 2000)
    this.increaseScore(duration)
    this.spawnCoins(30, duration)
  }

  private onButtonClick(callback: () => void) {
    this.sound.play('buttonClick', { volume: 0.5 })
    callback()
  }

  private spawnCoins(count: number = 15, fallDuration: number) {
    const coinsFalling = this.sound.add('coinsFalling', { volume: 0.5 })
    coinsFalling.play()

    const longestDuration = 2000 // keep track of the longest coin tween
    const spawnDelayStep = 50

    for (let i = 0; i < count; i++) {
      const spawnDelay = i * spawnDelayStep

      this.time.delayedCall(spawnDelay, () => {
        const coin = this.add.image(
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
        this.tweens.add({
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
    this.time.delayedCall(longestDuration - 500, () => {
      this.tweens.add({
        targets: coinsFalling,
        volume: 0,
        duration: 700, // fade duration
        ease: 'Sine.easeOut',
        onComplete: () => coinsFalling.stop(),
      })
    })
  }
}

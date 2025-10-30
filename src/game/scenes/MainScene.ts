import Phaser from 'phaser'

import Reel from '../../objects/Reel'
import { addScore } from './helpers/addScore'
import { addReels } from './helpers/addReels'
import { addButtons } from './helpers/addButtons'

import type { MainSceneInterface } from '../../interfaces/main-scene'
import { startSpin } from './helpers/startSpin'
import { stopSpin } from './helpers/stopSpin'
import { increaseScore } from './helpers/increaseScore'
import { onSpinStop } from './helpers/onSpinStop'
import { spawnCoins } from './helpers/spawnCoins'

export default class MainScene extends Phaser.Scene implements MainSceneInterface {
  public reels: Reel[] = []
  public spinButton: Phaser.GameObjects.Image
  public scoreText: Phaser.GameObjects.Text
  public spinSound: Phaser.Sound.BaseSound
  public score = 0
  public symbolKeys = ['pumpkin', 'ghost', 'bat', 'candy', 'skull']

  // game settings
  public spinAutoStopDelay = 2000
  public numOfColumns = 3

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

    const layout = (() => {
      const rww = width * 0.7 // reel wrapper width
      const rwh = height * 0.6 // reel wrapper height

      const rwx = (width - rww) / 2 // reel wrapper X
      const rwy = (height - rwh) / 2 // reel wrapper Y

      return {
        scene: {
          width,
          height,
        },
        reelWrapper: {
          width: rww,
          height: rwh,
          x: rwx,
          y: rwy,
        },
      }
    })()

    // Background
    this.add
      .image(layout.scene.width / 2, layout.scene.height / 2, 'bg')
      .setDisplaySize(layout.scene.width, layout.scene.height)

    // Set ambient music
    const music = this.sound.add('bgMusic', {
      loop: true,
      volume: 0.1, // between 0 and 1
    })
    music.play()

    addReels(this, layout)
    addScore(this, layout)
    addButtons(this, layout)
  }

  public startSpin() {
    startSpin(this)
  }

  public stopSpin() {
    stopSpin(this)
  }

  public increaseScore(duration: number) {
    increaseScore(this, duration)
  }

  public onSpinStop() {
    onSpinStop(this)
  }

  public spawnCoins(count: number, fallDuration: number) {
    spawnCoins(this, count, fallDuration)
  }
}

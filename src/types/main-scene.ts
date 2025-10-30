import { type MainSceneInterface } from '../interfaces/main-scene'

export type Layout = {
  scene: {
    width: number
    height: number
  }
  reelWrapper: {
    width: number
    height: number
    x: number
    y: number
  }
}

export type MainSceneType = Phaser.Scene & MainSceneInterface

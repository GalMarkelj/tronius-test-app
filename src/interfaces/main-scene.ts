import Reel from '../objects/Reel'

export interface MainSceneInterface {
  reels: Reel[]
  spinButton: Phaser.GameObjects.Image
  scoreText: Phaser.GameObjects.Text
  score: number
  spinSound: Phaser.Sound.BaseSound
  symbolKeys: string[]
  spinAutoStopDelay: number
  numOfColumns: number

  startSpin: () => void
  stopSpin: () => void
  onSpinStop: () => void
  increaseScore: (duration: number) => void
  spawnCoins: (count: number, fallDuration: number) => void
}

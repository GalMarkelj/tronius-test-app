import { AUTO, Game } from 'phaser'
import MainScene from './scenes/MainScene'

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: 1024,
  height: 768,
  parent: 'game-container',
  backgroundColor: '#1a1a1a', // fallback if background image fails
  scene: [MainScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
}

const StartGame = (parent: string) => {
  return new Game({ ...config, parent })
}

export default StartGame

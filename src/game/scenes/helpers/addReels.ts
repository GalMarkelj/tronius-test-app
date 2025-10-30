import Reel from '../../../objects/Reel'
import type { MainSceneType, Layout } from '../../../types/main-scene'

export function addReels(scene: MainSceneType, layout: Layout) {
  const { width, height, x, y } = layout.reelWrapper
  // 1. Wrapper or Box
  const wrapperBg = scene.add.graphics()
  wrapperBg.fillRoundedRect(0, 0, width, height, 20)
  wrapperBg.lineStyle(4, 0xffa500)
  wrapperBg.strokeRoundedRect(0, 0, width, height, 20)
  const wrapper = scene.add.container(x, y)
  wrapper.add(wrapperBg)

  // 2. Mask around each reel so that the additional symbols are not visible
  const maskShape = scene.add.graphics()
  maskShape.fillRect(x, y, width, height) // match the wrapper size and position
  const reelMask = maskShape.createGeometryMask() // use it for each reel

  // 3. Reel separation lines
  const lineColor = 0xffa500
  const lineWidth = 3
  const columnWidth = width / 3

  const separatorLines = scene.add.graphics()
  separatorLines.lineStyle(lineWidth, lineColor, 1)

  // Draw lines at 1/3 and 2/3 positions
  separatorLines.beginPath()
  separatorLines.moveTo(columnWidth, 0)
  separatorLines.lineTo(columnWidth, height)
  separatorLines.moveTo(2 * columnWidth, 0)
  separatorLines.lineTo(2 * columnWidth, height)
  separatorLines.strokePath()

  wrapper.add(separatorLines)

  // 4. Create reels
  for (let i = 0; i < scene.numOfColumns; i++) {
    const columnBg = scene.add.graphics()
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
      if (i === scene.numOfColumns - 1) {
        corners.tr = 20
        corners.br = 20
      }
      return corners
    })()
    columnBg.fillStyle(0xffffff, 0.8)
    columnBg.fillRoundedRect(i * columnWidth, 0, columnWidth, height, columnBdRadius)
    columnBg.lineStyle(4, 0xffa500)

    const columnWrap = scene.add.container(x, y)
    columnWrap.add(columnBg)

    const reel = new Reel(scene, x + i * columnWidth, y, scene.symbolKeys)
    reel.setMask(reelMask)
    scene.reels.push(reel)
  }
}

import { Graph } from './Graph.js'
import { Draw } from './Draw.js'
import { table } from './datatable.js'

const pm = new Graph()

function processChapters(num = null) {
  const allChapters = pm.getChapterNumbers()
  let allChapterData = {}
  let x = 0

  if (!num) {
      for (let chapter of allChapters) {
          let [returnedChapterNodes, returnedMaxX] = pm.plot(chapter, x, 0)
          // Save the data for this chapter
          allChapterData[chapter] = returnedChapterNodes
          x = returnedMaxX + 100
      }
  } else {
      let [returnedChapterNodes, returnedMaxX] = pm.plot(num, x, 0)
      // Save the data for this chapter
      allChapterData[num] = returnedChapterNodes
      x = returnedMaxX + 100
  }
  return allChapterData
}

new Draw('#container', processChapters(), {
  xOffset: 20,
  yOffset: 20,
  shape: 'circle',
  size: 5,
  fill: '#CC5500',
  textFontSize: 12,
  textFill: 'black'
})

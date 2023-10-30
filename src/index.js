import { Graph } from './Graph.js'
import { Draw } from './Draw.js'
import { table } from './datatable.js'

const pm = new Graph()

function processChapters(num = null) {
  const chapters = pm.getChapterNumbers()
  let chapterData = {}
  let x = 0
  const GAP = 200

  if (!num) {
      for (let chapter of chapters) {
          let [chapter_nodes, maxX] = pm.plot(chapter, x, 0)
          chapterData[chapter] = chapter_nodes
          x = maxX + GAP
      }
  } else {
      let [chapter_nodes, maxX] = pm.plot(num, x, 0)
      chapterData[num] = chapter_nodes
      x = maxX + GAP
  }
  return chapterData
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

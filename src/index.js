import { Graph } from './Graph.js'
import { Draw } from './Draw.js'
import { table } from './datatable.js'

const pm = new Graph()

function addPaddingToSVG(padding) {
  const svg = d3.select('#container')
  const bbox = svg.node().getBBox()

  const newViewBox = [
      bbox.x - padding,
      bbox.y - padding,
      bbox.width + padding * 2,
      bbox.height + padding * 2
  ]
  svg.attr('viewBox', newViewBox.join(' '))

  // Optional: Adjust the width and height attributes if necessary
  // svg.attr('width', bbox.width + padding * 2);
  // svg.attr('height', bbox.height + padding * 2);
}

function processChapters(num = null) {
  const excluded = ['8', '89']
  const chapters = pm.getChapterNumbers().filter(chapter => !excluded.includes(chapter))
  let chapterData = {}
  let x = 0
  const GAP = 300

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

addPaddingToSVG(0.5)

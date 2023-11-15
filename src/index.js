import { Draw } from './Draw.js'
import { Graph } from './Graph.js'

const pm = new Graph()

function addPaddingToSVG(padding) {
  const svg = d3.select('#container')
  const bbox = svg.node().getBBox()

  svg.attr('viewBox', [bbox.x, bbox.y, bbox.width, bbox.height])


}

function processChapters({ chapterNumbers = null, GAP = 300, PAD = 50, x = 0 } = {}) {
  const excluded = ['8', '89'];
  const chapters = pm.getChapterNumbers().filter(chapter => !excluded.includes(chapter));
  let chapterData = {};

  if (!chapterNumbers) {
    for (let chapter of chapters) {
      let [chapter_nodes, maxX] = pm.plot(chapter, x, 0, PAD);
      chapterData[chapter] = chapter_nodes;
      x = maxX + GAP;
    }
  } else {
    for (let chapter of chapterNumbers) {
      let [chapter_nodes, maxX] = pm.plot(chapter, x, 0, PAD);
      chapterData[chapter] = chapter_nodes;
      x = maxX + GAP;
    }
  }
  return chapterData;
}
/*
new Draw('#container', processChapters(), {
  xOffset: 20,
  yOffset: 20,
  shape: 'circle',
  size: 5,
  fill: '#CC5500',
  textFontSize: 12,
  textFill: 'black'
})
*/

function miniMap(chapters) {
  const content = processChapters({chapterNumbers: chapters, GAP: 100, PAD: 10})
  new Draw('#container', content, {
    xOffset: 20,
    yOffset: 20,
    shape: 'circle',
    size: 5,
    fill: '#CC5500',
    textFontSize: 12,
    textFill: 'black',
    minimap: true
  })

  const svg = d3.select('#container');
  const bbox = svg.node().getBBox();

  const newViewBox = [
    bbox.x - 10,
    bbox.y - 10,
    bbox.width + 10 * 2,
    bbox.height + 10 * 2
  ]

  svg.attr('viewBox', newViewBox.join(' '))
}

function normalMap() {
  new Draw('#container', processChapters(), {
    xOffset: 20,
    yOffset: 20,
    shape: 'circle',
    size: 5,
    fill: '#CC5500',
    textFontSize: 12,
    textFill: 'black'
  })

  addPaddingToSVG(10)
}


//miniMap(['24', '25'], 0)

normalMap()

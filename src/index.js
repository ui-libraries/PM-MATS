import { Draw } from './Draw.js'
import { Graph } from './Graph.js'
import { table } from './datatable.js'
import { getQueryParam } from './utils.js'

const pm = new Graph()

document.addEventListener('DOMContentLoaded', (event) => {
  let numberValue = getQueryParam('n')
  
  if (numberValue) {
    let chapterNumber = numberValue.split('.')[0]
    miniMap([chapterNumber])
  } else {
    normalMap()
  }  
})

function processChapters({ chapterNumbers = null, GAP = 300, PAD = 50, x = 0 } = {}) {
  const excluded = ['8', '89'];
  const chapters = pm.getChapterNumbers().filter(chapter => !excluded.includes(chapter));
  let chapterData = {};

  if (!chapterNumbers) {
    for (let chapter of chapters) {
      let [chapter_nodes, maxX] = pm.plot(chapter, x, 0, PAD)
      chapterData[chapter] = chapter_nodes
      x = maxX + GAP
    }
  } else {
    for (let chapter of chapterNumbers) {
      let [chapter_nodes, maxX] = pm.plot(chapter, x, 0, PAD)
      chapterData[chapter] = chapter_nodes
      x = maxX + GAP
    }
  }
  return chapterData
}

//GAP is the space between chapters, PAD is the space between nodes in a chapter
function miniMap(chapters) {
  const content = processChapters({chapterNumbers: chapters, GAP: 100, PAD: 20})
  new Draw('#minimap', content, {
    xOffset: 20,
    yOffset: 20,
    size: 5,
    fill: '#CC5500',
    textFontSize: 12,
    textFill: 'black',
  })
}

function normalMap() {
  new Draw('#container', processChapters(), {
    xOffset: 20,
    yOffset: 20,
    size: 5,
    fill: '#CC5500',
    textFontSize: 12,
    textFill: 'black'
  })
}

$('#number-search').on('submit', function(e) {
  e.preventDefault()
  const num = $('.menu-search').val()
  const svgElement = document.getElementById('container')
  const node = pm.getNodeByNumber(num)
  console.log(node)

  $('.content-container').animate({
    scrollLeft: node.x - $(window).width() / 2
  }, 100)
})




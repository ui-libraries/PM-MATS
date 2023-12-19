import { Map } from './Map.js'
import { Minimap } from './Minimap.js'
import { Graph } from './Graph.js'
import { table } from './datatable.js'
import { getQueryParam } from './utils.js'

const pm = new Graph()

document.addEventListener('DOMContentLoaded', (event) => {
  let numberValue = getQueryParam('n')
  
  if (numberValue) {
    $('#pm-map').remove()
    let chapterNumber = numberValue.split('.')[0]
    miniMap([chapterNumber], "#minimap2", numberValue)
    miniMap(['3'], "#minimap9", '3.1')
    miniMap(['9'], "#minimap7", '9.1')
  } else {
    normalMap()
  }  
})

function processChapters({ chapterNumbers = null, GAP = 300, PAD = 50, x = 0 } = {}) {
  const excluded = ['8', '89'];
  const chapters = pm.getChapterNumbers().filter(chapter => !excluded.includes(chapter))
  let chapterData = {}

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
function miniMap(chapters, svgSelector = '#pm-map', highlightedNumber = null) {
  const content = processChapters({chapterNumbers: chapters, GAP: 100, PAD: 20})
  new Minimap(svgSelector, content, {
    xOffset: 20,
    yOffset: 20,
    size: 5,
    fill: '#CC5500',
    textFontSize: 12,
    textFill: 'black',
    highlightedNumber: highlightedNumber
  })
}

function normalMap() {
  new Map('#pm-map', processChapters(), {
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
  const svgElement = document.getElementById('pm-map')
  const node = pm.getNodeByNumber(num)
  console.log(node)

  $('.content-container').animate({
    scrollLeft: node.x - $(window).width() / 2
  }, 100)
})




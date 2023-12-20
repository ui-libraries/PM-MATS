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
    //miniMap(['3'], "#minimap9", '3.1')
    //miniMap(['9'], "#minimap7", '9.1')
    generateMinimapColumns(numberValue)
  } else {
    normalMap()
  }  
})

//generates the svg, returns the unique id svg number for print
function amazing(number, i){
  const node = pm.getNodeByNumber(number)
  const proves = node.proves
  const provenBy = node.provenBy 

  //use the map method to return a list without decimal parts
  const provesChapter = proves.map((num) => num.split('.')[0])
  const provenByChapter = provenBy.map((num) => num.split('.')[0])

  miniMap([provenByChapter[i]], "#left-svg"+i, provenBy[i])
  miniMap([provesChapter[i]], "#right-svg"+i, proves[i])
}

function generateMinimapColumns(numberValue){
//insertRow will drop in the amazing function
//number is the query parameter number

  let i = 0
  let row = insertRow(i)

  $('#minimap-column-top').append(row)
  amazing(numberValue, i)
}

function insertRow(i) {
  let html = 
  `
  <div class="row minimap-row">
  <div class="col left-col">
     <svg id="left-svg${i}"></svg>
  </div>
  <div class="col">

  </div>
  <div class="col right-col">
     <svg id="right-svg${i}"></svg>
  </div>
</div>
  `
  return html
}


    //insertRow will have SVG container inserted into the dom
    //addMiniMaps will return the unique 


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




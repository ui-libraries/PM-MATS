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
      createSummaryLink(numberValue)
      generateAllRows(numberValue)
  } else {
      normalMap()
  }
})

function createSummaryLink(numberValue) {
  const node = pm.getNodeByNumber(numberValue)
  const page = node.properties.page
  let link = `https://archive.org/details/dli.ernet.247278/page/${page}/mode/2up`
  $('#minimap-title').append(`<a class="summary-link active" href="${link}" target="_blank">Summary</a>`)
}

function insertChapterSvgs(numberValue, i) {
  const node = pm.getNodeByNumber(numberValue)
  if (!node) {
    console.error(`Node not found for numberValue: ${numberValue}`)
    return
  }

  const proves = node.proves || []
  const provenBy = node.provenBy || []

  const provesChapter = proves.map((num) => num.split('.')[0])
  const provenByChapter = provenBy.map((num) => num.split('.')[0])

  if (provenByChapter.length > i && provenBy.length > i) {
    miniMap([provenByChapter[i]], "#left-svg" + i, provenBy[i])
  } else {
    console.warn(`provenByChapter does not have an element at index ${i}`)
  }

  if (provesChapter.length > i && proves.length > i) {
    miniMap([provesChapter[i]], "#right-svg" + i, proves[i])
  } else {
    console.warn(`provesChapter does not have an element at index ${i}`)
  }
}


function createRow(numberValue, i) {
  let row = `
    <div class="row minimap-row">
      <div class="col left-col">
          <svg id="left-svg${i}"></svg>
      </div>
      <div class="col"></div>
      <div class="col right-col">
          <svg id="right-svg${i}"></svg>
      </div>
    </div>
  `;
  $('#minimap-column-top').append(row);
  insertChapterSvgs(numberValue, i);
}


function generateAllRows(numberValue) {
  const node = pm.getNodeByNumber(numberValue);
  if (!node) {
    console.error(`Node not found for numberValue: ${numberValue}`);
    return;
  }

  const proves = node.proves || [];
  const provenBy = node.provenBy || [];

  // Loop through the arrays and create rows
  for (let i = 0; i < Math.max(proves.length, provenBy.length); i++) {
    createRow(numberValue, i);
  }
}



function processChapters({
  chapterNumbers = null,
  GAP = 300,
  PAD = 50,
  x = 0
} = {}) {
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
  const content = processChapters({
      chapterNumbers: chapters,
      GAP: 100,
      PAD: 20
  })
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
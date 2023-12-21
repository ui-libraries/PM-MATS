import { Map } from './Map.js'
import { Minimap } from './Minimap.js'
import { Graph } from './Graph.js'
import { table } from './datatable.js'
import { getQueryParam } from './utils.js'

const pm = new Graph()

document.addEventListener('DOMContentLoaded', (event) => {
  let pmNumber = getQueryParam('n')

  if (pmNumber) {
      $('.content-container').append(minimapTemplate())
      let chapterNumber = pmNumber.split('.')[0]
      miniMap([chapterNumber], "#main-minimap", pmNumber)
      createSummaryLink(pmNumber)
      generateAllRows(pmNumber)
  } else {
    $('.content-container').append('<svg id="pm-map"></svg>')
    normalMap()
  }
})

function minimapTemplate() {
  const html = `
  <div class="container mt-2 minimap-container-padding-top" id="minimap-column-top">
            <div class="row">
               <div class="col">
               </div>
               <div class="col">
                <div class="row">
                  <div id="minimap-title" class="col-6">
                    <h3>A Sufficiently long Title to test Display</h3>
                  </div>
                  <div class="col-6">
                    <svg id="main-minimap"></svg>
                  </div>
                </div>
              </div>
               <div class="col">
               </div>
            </div>
            <div class="row" id="proof-labels">
               <div class="col left-col">
                  <h3>Its Proof Cites...</h3>
               </div>
               <div class="col">
               </div>
               <div class="col right-col">
                  <h4>Cited in Proof of...</h4> 
               </div>
            </div>
         </div>
  `
  return html
}

function createSummaryLink(pmNumber) {
  const node = pm.getNodeByNumber(pmNumber)
  const page = node.properties.page
  let link = `https://archive.org/details/dli.ernet.247278/page/${page}/mode/2up`
  $('#minimap-title').append(`<a class="summary-link active" href="${link}" target="_blank">summary</a>`)
}

function insertChapterSvgs(pmNumber, i) {
  const node = pm.getNodeByNumber(pmNumber)
  if (!node) {
    console.error(`Node not found for pmNumber: ${pmNumber}`)
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


function createRow(pmNumber, i) {
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
  `
  $('#minimap-column-top').append(row)
  insertChapterSvgs(pmNumber, i)
}


function generateAllRows(pmNumber) {
  const node = pm.getNodeByNumber(pmNumber)
  if (!node) {
    console.error(`Node not found for pmNumber: ${pmNumber}`)
    return
  }

  const proves = node.proves || []
  const provenBy = node.provenBy || []

  // Loop through the arrays and create rows
  for (let i = 0; i < Math.max(proves.length, provenBy.length); i++) {
    createRow(pmNumber, i)
  }
}



function processChapters({ chapterNumbers = null, GAP = 300, PAD = 50, x = 0} = {}) {
  const excluded = ['8', '89']
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
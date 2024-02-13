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
      <div class="row main-svg">
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
      <div class="row proofs-svg">
        <div class="col" id="left-svg-container">
            <h3>Its Proof Cites...</h3>
        </div>
        <div class="col" id="right-svg-container">
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

function insertChapterSvgs(pmNumber, isLeft) {
  const node = pm.getNodeByNumber(pmNumber)
  if (!node) {
    console.error(`Node not found for pmNumber: ${pmNumber}`)
    return
  }

  // Replace periods in pmNumber with underscores for valid ID
  const safePmNumber = pmNumber.replace(/\./g, '_')
  const targetContainer = isLeft ? '#left-svg-container' : '#right-svg-container'
  const svgId = isLeft ? `left-svg${safePmNumber}` : `right-svg${safePmNumber}`
  const svgHtml = `<svg id="${svgId}"></svg>`

  $(targetContainer).append(svgHtml)

  const chapter = pmNumber.split('.')[0]
  miniMap([chapter], `#${svgId}`, pmNumber)
}

function generateAllRows(pmNumber) {
  const node = pm.getNodeByNumber(pmNumber)
  if (!node) {
    console.error(`Node not found for pmNumber: ${pmNumber}`)
    return
  }

  const proves = node.proves || []
  const provenBy = node.provenBy || []

  // Insert all left SVGs
  provenBy.forEach((proven, i) => insertChapterSvgs(proven, true))

  // Insert all right SVGs
  proves.forEach((prove, i) => insertChapterSvgs(prove, false))
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
import { Map } from './Map.js'
import { Minimap } from './Minimap.js'
import { Graph } from './Graph.js'
import { table } from './datatable.js'
import * as labels from './pm-chapter-labels.json'
import { getQueryParam, findLabel } from './utils.js'

const pm = new Graph()

document.addEventListener('DOMContentLoaded', (event) => {
  let pmNumber = getQueryParam('n')
  let isEdition2 = getQueryParam('edition-2') !== null
  let defaultExcluded = ['8', '89']
  let excludedChapters = isEdition2 ? [] : defaultExcluded

  const searchTemplate = `
    <form id="number-search" class="d-flex">
        <input class="form-control me-2 menu-search" type="search" placeholder="Enter a number..." aria-label="Search">
        <button class="btn btn-outline-info btn-sm" type="submit">Search</button>
    </form>
  `
  if (pmNumber) {
      $('#number-search').remove()
      $('.content-container').append(minimapTemplate())
      let chapterNumber = pmNumber.split('.')[0]
      miniMap([chapterNumber], "#main-minimap", pmNumber, excludedChapters)
      createSummaryLink(pmNumber)
      generateAllRows(pmNumber)
      chapterTitle(pmNumber, excludedChapters)
  } else if (window.location.pathname.includes('table.html')) {
      $('#number-search').remove()
      $('.content-container').append(minimapTemplate())
      let chapterNumber = pmNumber ? pmNumber.split('.')[0] : null
      miniMap(chapterNumber ? [chapterNumber] : [], "#main-minimap", pmNumber, excludedChapters)
      if (pmNumber) {
          createSummaryLink(pmNumber)
          generateAllRows(pmNumber)
          chapterTitle(pmNumber, excludedChapters)
      }
  } else {
    $('.content-container').append('<svg id="pm-map"></svg>')
    $('#navbarSupportedContent').append(searchTemplate)
    normalMap(excludedChapters)
    $('#number-search').on('submit', function(e) {
      e.preventDefault()
      const num = $('.menu-search').val()
      let node
    
      if (!num.includes('.')) {
        const chapterNodes = pm.getChapterNodes(num)
        // Select the first real node (not a ghost node)
        node = chapterNodes.find(n => !n.properties.isPlaceholder)
        if (!node) {
          node = chapterNodes[0]
        }
      } else {
        node = pm.getNodeByNumber(num)
      }
      
      if (node) {
        // Construct new URL without edition-2 if n is present
        const newUrl = new URL(window.location.href)
        newUrl.searchParams.set('n', num)
        newUrl.searchParams.delete('edition-2')
        window.history.pushState({}, '', newUrl.toString())

        $('.content-container').animate({
          scrollLeft: node.x - $(window).width() / 2
        }, 100)
      } else {
        console.log("No matching chapter found for number:", num)
      }
    })    
  }
})

/**
 * Updates the chapter title in the minimap based on the given chapter number.
 * 
 * @param {string} chapterNumber - The chapter number to find the title for.
 * @param {Array<string>} excluded - The chapters to be excluded.
 */
function chapterTitle(chapterNumber, excluded) {
  let title = findLabel(chapterNumber, processChapters({ excluded }), labels)
  document.querySelector('#minimap-title h3').textContent = title['chap-label']
}

/**
 * Generates the HTML template for the minimap.
 * 
 * @returns {string} The HTML template for the minimap.
 */
function minimapTemplate() {
  const html = `
    <div class="container mt-2 minimap-container-padding-top" id="minimap-column-top">
      <div class="row main-svg">
        <div class="col">
        </div>
        <div class="col">
            <div class="row">
              <div id="minimap-title" class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                  <h3></h3>
              </div>
              <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
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
            <div id="left-svgs"></div>
        </div>
        <div class="col" id="right-svg-container">
            <h3>Cited in Proof of...</h3>
            <div id="right-svgs"></div>
        </div>
      </div>
  </div>
  `
  return html
}

/**
 * Creates a link to the original text for a given chapter number.
 * 
 * @param {string} pmNumber - The chapter number to create the link for.
 */
function createSummaryLink(pmNumber) {
  const node = pm.getNodeByNumber(pmNumber)
  const page = node.properties.page
  const volume = node.properties.volume
  let link

  switch(volume) {
    case "1":
      link = `https://archive.org/details/alfred-north-whitehead-bertrand-russel-principia-mathematica.-1/Alfred%20North%20Whitehead%2C%20Bertrand%20Russel%20-%20Principia%20Mathematica.%201/page/${page}/mode/2up`
      break
    case "2":
      link = `https://archive.org/details/alfred-north-whitehead-bertrand-russel-principia-mathematica.-1/Alfred%20North%20Whitehead%2C%20Bertrand%20Russell%20-%20Principia%20Mathematica%20Volume%202/page/${page}/mode/2up`
      break
    case "3":
      link = `https://archive.org/details/alfred-north-whitehead-bertrand-russel-principia-mathematica.-1/Alfred%20North%20Whitehead%2C%20Bertrand%20Russell%20-%20Principia%20Mathematica.%20Volume%203/page/${page}/mode/2up`
      break
    default:
      console.log('Invalid volume number')
      return
  }

  $('#minimap-title').append(`<a class="summary-link active" href="${link}" target="_blank">original text</a>`)
}

/**
 * Inserts chapter SVGs into the specified container.
 * 
 * @param {string} pmNumber - The chapter number to insert SVGs for.
 * @param {boolean} isLeft - Whether to insert SVGs into the left container.
 */
function insertChapterSvgs(pmNumber, isLeft) {
  const node = pm.getNodeByNumber(pmNumber)
  if (!node) {
    console.error(`Node not found for pmNumber: ${pmNumber}`)
    return
  }

  // Replace periods in pmNumber with underscores for valid ID
  const safePmNumber = pmNumber.replace(/\./g, '_')
  const targetContainer = isLeft ? '#left-svgs' : '#right-svgs'
  const svgId = isLeft ? `left-svg${safePmNumber}` : `right-svg${safePmNumber}`
  const svgHtml = `<svg id="${svgId}" class="minisvg"></svg>`

  $(targetContainer).append(svgHtml)

  const chapter = pmNumber.split('.')[0]
  miniMap([chapter], `#${svgId}`, pmNumber)
}

/**
 * Generates all rows of chapter SVGs for a given chapter number.
 * 
 * @param {string} pmNumber - The chapter number to generate rows for.
 */
function generateAllRows(pmNumber) {
  const node = pm.getNodeByNumber(pmNumber)
  if (!node) {
    console.error(`Node not found for pmNumber: ${pmNumber}`)
    return
  }

  // "Its Proof Cites..." is 'provenBy' in the JSON and is on the left
  // "Cited in Proof of..." is 'proves' in the JSON" and is on the right

  const provenBy = node.provenBy || []
  const proves = node.proves || []
  
  // --- START OF NEW COUNTER LOGIC ---
  const provenByCount = provenBy.length
  const provesCount = proves.length
  
  // Update the left header (Its Proof Cites...)
  $('#left-svg-container h3').text(`Its Proof Cites... (${provenByCount})`)
  
  // Update the right header (Cited in Proof of...)
  $('#right-svg-container h3').text(`Cited in Proof of... (${provesCount})`)
  // --- END OF NEW COUNTER LOGIC ---

  // sort the arrays numerically
  provenBy.sort((a, b) => parseFloat(a) - parseFloat(b))
  console.log("sorted", provenBy)
  proves.sort((a, b) => parseFloat(a) - parseFloat(b))

  if (provenBy.length === 0) {
    $('#left-svg-container h3').text('no demonstration appears in text')
  }
  if (proves.length === 0) {
    $('#right-svg-container h3').text('does not appear in any demonstration')
  }

  provenBy.forEach((proven, i) => insertChapterSvgs(proven, true))
  proves.forEach((prove, i) => insertChapterSvgs(prove, false))
}


/**
 * Processes the chapters and generates the data needed for the minimap.
 * 
 * @param {Object} [options={}] - Options for processing the chapters.
 * @param {Array<string>} [options.chapterNumbers=null] - The specific chapters to process.
 * @param {number} [options.GAP=200] - The gap between chapters.
 * @param {number} [options.PAD=50] - The padding between nodes in a chapter.
 * @param {number} [options.x=0] - The starting x-coordinate.
 * @param {Array<string>} [options.excluded=['8', '89']] - The chapters to be excluded.
 * @returns {Object} The processed chapter data.
 */
function processChapters({ chapterNumbers = null, GAP = 200, PAD = 50, x = 0, excluded = ['8', '89'] } = {}) {
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

/**
 * Generates a minimap for the specified chapters.
 * 
 * @param {Array<string>} chapters - The chapters to generate the minimap for.
 * @param {string} svgSelector - The CSS selector for the SVG element.
 * @param {string|null} [highlightedNumber=null] - The chapter number to highlight.
 * @param {Array<string>} excluded - The chapters to be excluded.
 */
function miniMap(chapters, svgSelector, highlightedNumber = null, excluded = []) {
  const content = processChapters({
      chapterNumbers: chapters,
      GAP: 100,
      PAD: 20,
      excluded
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

/**
 * Generates the main map visualization.
 * 
 * @param {Array<string>} excluded - The chapters to be excluded.
 */
function normalMap(excluded = []) {
  new Map('#pm-map', processChapters({ excluded }), {
      xOffset: 20,
      yOffset: 20,
      size: 5,
      fill: '#CC5500',
      textFontSize: 12,
      textFill: 'black'
  })
}

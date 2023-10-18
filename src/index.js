import { Graph, NodeVisualizer, D3Visualizer } from './functions'
import { table } from './datatable.js'




let pm = new Graph()
let allChapters = pm.getChapterNumbers()
let x = 0

function flattenObjectArrays(obj) {
  const result = {}
  
  // Loop through each key of the main object
  Object.keys(obj).forEach(key => {
    const subObj = obj[key]

    // Loop through each key of the sub-object
    Object.keys(subObj).forEach(subKey => {
      const arr = subObj[subKey]

      // Loop through the array and add each object to the result
      arr.forEach((item, index) => {
        result[`${key}_${subKey}_${index}`] = item
      })
    })
  })

  return result
}

function processChapters(num = null) {
  let allChapterData = {}

  if (!num) {

      for (let chapter of allChapters) {
          let [returnedChapterNodes, returnedMaxX] = pm.plot(chapter, x, 0) 
          // Save the data for this chapter
          allChapterData[chapter] = returnedChapterNodes
          x = returnedMaxX + 100
      }
  } else {
      let [returnedChapterNodes, returnedMaxX] = pm.plot(num, x, 0)
      // Save the data for this chapter
      allChapterData[num] = returnedChapterNodes
      x = returnedMaxX + 100
  }

  return allChapterData
}

function downloadData(allChapterData) {
        // After looping through all chapters, save allChapterData to a file
        const jsonString = JSON.stringify(allChapterData, null, 2)
        const blob = new Blob([jsonString], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'all_chapter_nodes.json'
        a.click()
        URL.revokeObjectURL(url)
}

function visualizeData(allChapterData) {
    const visualizer = new D3Visualizer('#canvas', allChapterData, {
        xOffset: 20,
        yOffset: 20,
        circleRadius: 5,
        circleFill: 'blue',
        textFontSize: 12,
        textFill: 'black'
      })
}
const c = processChapters()
let chapterJson = JSON.stringify(c, null, 2)

//visualizeData(chapterJson)
console.log(chapterJson)
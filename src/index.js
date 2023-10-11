import { Graph, NodeVisualizer } from './functions'
import { table } from './datatable.js'
/* import coords_data from '../output/pm_coordinates.json'

let start = performance.now()
for (let chapterKey in coords_data) {
    let nodesArray = coords_data[chapterKey];  // This gives you the array of nodes for a specific chapter
    
    // Iterate over each node object in the nodesArray
    nodesArray.forEach(node => {
        let x = node.x;
        let y = node.y;
        
        // set a timer to see how long this takes:
        
        // Draw the no
        if (!node.properties.isPlaceholder) {
            new NodeVisualizer(node, x, y).draw("canvas")
        }
    })
}
let end = performance.now()
let duration = end - start
console.log("Drawing took " + duration + " milliseconds") */

let pm = new Graph()
//pm.plot(6)

let allChapters = pm.getChapterNumbers()
//console.log(chapterNumbers)
let x = 0

/*
chapterNumbers.forEach(chapter => {
    let chapterX = pm.plot(chapter, x, 0)
    x = chapterX + 100
})
*/

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

    for (let node of Object.values(allChapterData)) {
        node.forEach(node => {
            if (!node.properties.isPlaceholder) {
                new NodeVisualizer(node, node.x, node.y).draw("canvas")
            }
        })
    }

    //downloadData(allChapterData)
}

processChapters()

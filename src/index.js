import { Graph } from './functions'
import { table } from './datatable.js'



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

function processChapters(num = null) {
    let allChapterData = {}

    if (!num) {

        for (let chapter of allChapters) { // assuming allChapters is an array of all your chapter numbers
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

processChapters()
